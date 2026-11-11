/* orador.js — vista del orador.
   La tecla O abre el mismo documento en otra ventana con ?orador. Esa ventana
   muestra la diapositiva actual, la siguiente, las notas, la hora y un
   cronómetro. Las dos ventanas se avisan entre sí cada cambio.

   Las notas van dentro de cada diapositiva:  <aside class="notas">…</aside> */
(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const P = window.Presentacion;
    if (!P) return;
    let otra = P.esOrador ? window.opener : null;
    const enviar = datos => { try { if (otra && !otra.closed) otra.postMessage({ plantilla: true, ...datos }, '*'); } catch (e) { /* la otra ventana ya no existe */ } };

    // Sincronía: cada ventana avisa sus cambios propios y obedece los ajenos
    document.addEventListener('plantilla:cambio', e => { if (!e.detail.remoto) enviar({ i: e.detail.i, k: e.detail.k }); });
    window.addEventListener('message', e => {
      const m = e.data;
      if (!m || !m.plantilla) return;
      if (m.hola) { otra = e.source; const s = P.estado(); enviar({ i: s.i, k: s.k }); return; }
      if (typeof m.i === 'number') P.ir(m.i, m.k, { remoto: true, sinAnimacion: P.esOrador });
    });

    if (!P.esOrador) {
      document.addEventListener('keydown', e => {
        if (e.key.toLowerCase() !== 'o' || e.ctrlKey || e.metaKey || e.altKey || e.target.closest('input, textarea, select')) return;
        const url = new URL(location.href);
        url.searchParams.set('orador', '1');
        url.hash = '';
        otra = window.open(url.href, 'plantilla-orador', 'width=1280,height=760');
        if (!otra) P.avisar('El navegador bloqueó la ventana del orador');
      });
      return;
    }

    /* ── Ventana del orador ──────────────────────────────────────────────── */
    document.title = 'Orador · ' + document.title;
    const panel = document.createElement('div');
    panel.className = 'orador';
    panel.innerHTML = `
      <span class="orador__rotulo orador__rotulo--actual">Ahora <b class="orador__pos"></b></span>
      <span class="orador__rotulo orador__rotulo--siguiente">Siguiente</span>
      <div class="orador__fin">Fin de la presentación</div>
      <div class="orador__reloj" data-sin-avance>
        <div><small>Hora</small><b class="orador__hora">--:--</b></div>
        <div><small>Tiempo</small><b class="orador__crono">00:00</b></div>
        <div class="orador__botones"><button type="button" data-a="pausa">Iniciar</button><button type="button" data-a="cero">Reiniciar</button></div>
      </div>
      <div class="orador__notas" data-sin-avance></div>`;
    document.body.append(panel);
    const $ = s => panel.querySelector(s);

    let acumulado = 0, desde = null;
    const dos = n => String(Math.floor(n)).padStart(2, '0');
    const tic = () => {
      const ahora = new Date();
      $('.orador__hora').textContent = `${dos(ahora.getHours())}:${dos(ahora.getMinutes())}`;
      const s = (acumulado + (desde ? Date.now() - desde : 0)) / 1000;
      $('.orador__crono').textContent = (s >= 3600 ? dos(s / 3600) + ':' : '') + `${dos((s % 3600) / 60)}:${dos(s % 60)}`;
      $('[data-a="pausa"]').textContent = desde ? 'Pausa' : acumulado ? 'Seguir' : 'Iniciar';
    };
    panel.addEventListener('click', e => {
      const a = e.target.closest('button')?.dataset.a;
      if (a === 'pausa') { if (desde) { acumulado += Date.now() - desde; desde = null; } else desde = Date.now(); }
      if (a === 'cero') { acumulado = 0; desde = null; }
      tic();
    });
    setInterval(tic, 500);

    let primera = true;
    document.addEventListener('plantilla:cambio', e => {
      const { diapositiva, i, k, total } = e.detail;
      P.diapositivas.forEach((d, n) => {
        d.classList.toggle('orador-actual', n === i);
        d.classList.toggle('orador-siguiente', n === i + 1);
      });
      panel.classList.toggle('orador--final', i === total - 1);
      const pasos = diapositiva._pasos.length;
      $('.orador__pos').textContent = `${i + 1} / ${total}` + (pasos ? ` · paso ${k} de ${pasos}` : '');
      const notas = diapositiva.querySelector('.notas');
      $('.orador__notas').innerHTML = notas ? notas.innerHTML : '';
      if (!primera && !desde && !acumulado) desde = Date.now(); // el cronómetro arranca con el primer avance
      primera = false;
      if (window.Plantilla && window.Plantilla.ajustarGraficos) setTimeout(window.Plantilla.ajustarGraficos, 0);
    });
    const s = P.estado();
    P.ir(s.i, s.k, { remoto: true, sinAnimacion: true });
    enviar({ hola: true });
    tic();
  });
})();
