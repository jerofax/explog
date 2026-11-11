/* presentacion.js — navegación, pasos, vistas y niveles de animación.
   Solo actúa si <html data-modo="presentacion">; en divulgación solo
   prepara la impresión.

   Vistas (clase en <html>):
     vista-escenario  una diapositiva a la vez, ajustada a la ventana
     vista-lectura    todas apiladas, para leer con desplazamiento (celular)
     vista-orador     la ventana de notas (la abre orador.js)
     imprimiendo      estado de PDF

   API: Presentacion.ir(i, k), .siguiente(), .anterior(), .estado(), .diapositivas */
(() => {
  const raiz = document.documentElement;
  const parametros = new URLSearchParams(location.search);
  const esPresentacion = raiz.dataset.modo === 'presentacion';
  const esOrador = esPresentacion && parametros.has('orador');

  /* ── Impresión: vale para los dos modos ──────────────────────────────── */
  let vistaAntes = null;
  const prepararImpresion = () => {
    if (raiz.classList.contains('imprimiendo')) return;
    vistaAntes = ['vista-escenario', 'vista-lectura', 'vista-orador'].find(v => raiz.classList.contains(v)) || '';
    raiz.classList.remove('vista-escenario', 'vista-lectura', 'vista-orador');
    raiz.classList.add('imprimiendo');
    void document.body.offsetWidth; // fuerza el nuevo diseño antes de avisar
    document.dispatchEvent(new CustomEvent('plantilla:imprimir'));
  };
  const terminarImpresion = () => {
    if (parametros.has('imprimir')) return;
    raiz.classList.remove('imprimiendo');
    if (vistaAntes) raiz.classList.add(vistaAntes);
    if (window.Plantilla && window.Plantilla.ajustarGraficos) window.Plantilla.ajustarGraficos();
  };
  window.addEventListener('beforeprint', prepararImpresion);
  window.addEventListener('afterprint', terminarImpresion);

  /* ── Nivel de animación ──────────────────────────────────────────────── */
  const NIVELES = ['ninguna', 'sutil', 'completa'];
  const pedido = parametros.get('animacion') || raiz.dataset.animacion || 'ninguna';
  const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches && !parametros.has('animacion');
  raiz.dataset.animacion = reducir || !NIVELES.includes(pedido) ? 'ninguna' : pedido;
  const nivel = () => raiz.dataset.animacion;

  document.addEventListener('DOMContentLoaded', () => {
    if (parametros.has('imprimir')) setTimeout(prepararImpresion, 0);
    if (!esPresentacion) return;

    const diapositivas = [...document.querySelectorAll('.diapositiva')];
    if (!diapositivas.length) return;
    let i = 0, k = 0, vistaForzada = false;
    if (!document.startViewTransition) raiz.classList.add('sin-transiciones-de-vista');

    /* ── Preparación de cada diapositiva ───────────────────────────────── */
    const numeradas = diapositivas.filter(d => !d.matches('.portada, .seccion, .cierre, .sangre, [data-sin-numero]'));
    diapositivas.forEach((d, n) => {
      d.dataset.n = `${n + 1} / ${diapositivas.length}`;
      // Grupos de pasos: data-paso="2" fija el orden; sin número, uno tras otro.
      let cuenta = 0;
      const grupos = new Map();
      d.querySelectorAll('[data-paso]').forEach(el => {
        const fijo = parseInt(el.dataset.paso, 10);
        const g = fijo > 0 ? fijo : cuenta + 1;
        cuenta = Math.max(cuenta, g);
        if (!grupos.has(g)) grupos.set(g, []);
        grupos.get(g).push(el);
      });
      d._pasos = [...grupos.keys()].sort((a, b) => a - b).map(g => grupos.get(g));
      d.querySelectorAll('[data-mover-a]').forEach(el => {
        const [x, y] = el.dataset.moverA.split(',').map(Number);
        el.style.setProperty('--mx', x || 0); el.style.setProperty('--my', y || 0);
      });
      d.querySelectorAll('svg [data-efecto="dibujar"]').forEach(el => el.setAttribute('pathLength', '1'));
      d.querySelectorAll('[data-enlace]').forEach(el => el.style.setProperty('--enlace', 'enlace-' + el.dataset.enlace.replace(/[^\w-]/g, '-')));
    });
    void numeradas;

    /* ── Elementos flotantes ───────────────────────────────────────────── */
    const crear = (clase, html = '') => { const e = document.createElement('div'); e.className = clase; e.innerHTML = html; document.body.append(e); return e; };
    const progreso = crear('progreso');
    const aviso = crear('aviso');
    let relojAviso;
    const avisar = texto => { aviso.textContent = texto; aviso.classList.add('visible'); clearTimeout(relojAviso); relojAviso = setTimeout(() => aviso.classList.remove('visible'), 1400); };
    const ayuda = crear('panel', `<div class="panel__caja" data-sin-avance><h2>Teclas</h2><dl>
      <dt><kbd>→</kbd> <kbd>Espacio</kbd> clic</dt><dd>Avanzar</dd>
      <dt><kbd>←</kbd></dt><dd>Retroceder</dd>
      <dt><kbd>Inicio</kbd> <kbd>Fin</kbd></dt><dd>Primera y última</dd>
      <dt><kbd>F</kbd></dt><dd>Pantalla completa</dd>
      <dt><kbd>O</kbd></dt><dd>Vista del orador (ventana aparte)</dd>
      <dt><kbd>G</kbd></dt><dd>Ir a una diapositiva por número</dd>
      <dt><kbd>L</kbd></dt><dd>Vista de lectura (todas apiladas)</dd>
      <dt><kbd>A</kbd></dt><dd>Nivel de animación: ninguna, sutil, completa</dd>
      <dt><kbd>B</kbd></dt><dd>Barra de progreso</dd>
      <dt><kbd>Ctrl</kbd> <kbd>P</kbd></dt><dd>Guardar como PDF</dd>
      <dt><kbd>H</kbd> <kbd>?</kbd></dt><dd>Esta ayuda</dd></dl></div>`);
    const salto = crear('panel', `<div class="panel__caja" data-sin-avance><h2>Ir a la diapositiva</h2><input type="number" min="1" max="${diapositivas.length}" inputmode="numeric"></div>`);
    const boton = document.createElement('button');
    boton.type = 'button'; boton.className = 'boton-presentar'; boton.textContent = 'Presentar';
    document.body.append(boton);

    /* ── Estado de los pasos ───────────────────────────────────────────── */
    const contar = el => {
      const final = el.dataset.valor || (el.dataset.valor = el.textContent);
      const m = final.match(/^(\D*?)(-?\d+(?:[.,]\d+)?)(.*)$/s);
      if (!m || nivel() === 'ninguna') { el.textContent = final; return; }
      const meta = parseFloat(m[2].replace(',', '.')), decimales = (m[2].split(/[.,]/)[1] || '').length;
      const coma = m[2].includes(',');
      const inicio = performance.now(), dura = 900;
      const cuadro = ahora => {
        const t = Math.min(1, (ahora - inicio) / dura), suave = 1 - (1 - t) ** 3;
        el.textContent = t >= 1 ? final : m[1] + (meta * suave).toFixed(decimales).replace('.', coma ? ',' : '.') + m[3];
        if (t < 1 && el.isConnected) requestAnimationFrame(cuadro);
      };
      requestAnimationFrame(cuadro);
    };
    const pintarPasos = (d, cuantos, recien) => {
      d._pasos.forEach((grupo, g) => grupo.forEach(el => {
        el.classList.toggle('visible', g < cuantos);
        el.classList.toggle('actual', g === cuantos - 1);
        el.classList.toggle('recien', recien && g === cuantos - 1);
        if (recien && g === cuantos - 1 && el.dataset.efecto === 'contar') contar(el);
      }));
    };

    /* ── Navegación ────────────────────────────────────────────────────── */
    const enEscenario = () => raiz.classList.contains('vista-escenario');
    function ir(ni, nk = 0, opciones = {}) {
      ni = Math.max(0, Math.min(diapositivas.length - 1, ni));
      const destino = diapositivas[ni], origen = diapositivas[i];
      const total = destino._pasos.length;
      nk = nk === 'fin' ? total : Math.max(0, Math.min(total, nk));
      const cambia = destino !== origen || !destino.classList.contains('activa');
      const avanza = !cambia && nk === k + 1;
      const haciaAtras = ni < i;
      // El estado cambia ya; lo visual puede ir dentro de una transición.
      i = ni; k = nk;
      const aplicar = () => {
        if (cambia) {
          diapositivas.forEach(d => d.classList.toggle('activa', d === destino));
          destino.classList.toggle('entra', nivel() !== 'ninguna');
          destino.querySelectorAll('[data-efecto="contar"]:not([data-paso])').forEach(contar);
        }
        pintarPasos(destino, nk, avanza);
      };
      const animar = cambia && enEscenario() && !opciones.sinAnimacion && nivel() !== 'ninguna' && document.startViewTransition;
      if (animar) {
        raiz.dataset.transicion = nivel() === 'completa' ? destino.dataset.transicion || 'fundido' : 'fundido';
        raiz.dataset.direccion = haciaAtras ? 'atras' : 'adelante';
        const transicion = document.startViewTransition(aplicar);
        // Si llega otro cambio antes de terminar, el navegador la cancela: no es un error.
        transicion.ready.catch(() => {}); transicion.finished.catch(() => {});
      } else aplicar();

      progreso.style.width = `${diapositivas.length > 1 ? (ni / (diapositivas.length - 1)) * 100 : 100}%`;
      if (!esOrador) history.replaceState(null, '', '#' + (ni + 1));
      document.dispatchEvent(new CustomEvent('plantilla:cambio', { detail: { diapositiva: destino, i: ni, k: nk, total: diapositivas.length, remoto: !!opciones.remoto } }));
    }
    const siguiente = () => (k < diapositivas[i]._pasos.length ? ir(i, k + 1) : i < diapositivas.length - 1 ? ir(i + 1, 0) : null);
    const anterior = () => (k > 0 ? ir(i, k - 1) : i > 0 ? ir(i - 1, 'fin') : null);

    /* ── Vistas ────────────────────────────────────────────────────────── */
    const ponerVista = vista => {
      if (raiz.classList.contains('imprimiendo')) return;
      raiz.classList.remove('vista-escenario', 'vista-lectura', 'vista-orador');
      raiz.classList.add(vista);
      if (vista === 'vista-lectura') diapositivas[i].scrollIntoView({ block: 'center' });
    };
    const vistaNatural = () => (esOrador ? 'vista-orador' : window.innerWidth < 768 && !document.fullscreenElement ? 'vista-lectura' : 'vista-escenario');
    const pantallaCompleta = () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else raiz.requestFullscreen?.().catch(() => avisar('El navegador no permitió la pantalla completa'));
    };
    window.addEventListener('resize', () => { if (!vistaForzada) ponerVista(vistaNatural()); });
    document.addEventListener('fullscreenchange', () => { vistaForzada = false; ponerVista(vistaNatural()); });
    boton.addEventListener('click', () => { vistaForzada = true; ponerVista('vista-escenario'); pantallaCompleta(); });

    /* ── Entrada: clic, teclado, toque ─────────────────────────────────── */
    const NO_AVANZA = 'a, button, input, select, textarea, label, summary, details, .interactivo, [data-sin-avance], .panel';
    document.addEventListener('click', e => {
      if (e.target.closest('.panel') && !e.target.closest('.panel__caja')) { ayuda.classList.remove('abierto'); salto.classList.remove('abierto'); return; }
      if (!enEscenario() || e.target.closest(NO_AVANZA) || String(getSelection())) return;
      siguiente();
    });
    let toqueX = null;
    document.addEventListener('touchstart', e => { toqueX = e.touches.length === 1 ? e.touches[0].clientX : null; }, { passive: true });
    document.addEventListener('touchend', e => {
      if (toqueX === null || !enEscenario() || e.target.closest(NO_AVANZA)) return;
      const dx = e.changedTouches[0].clientX - toqueX;
      if (Math.abs(dx) > 60) { e.preventDefault(); (dx < 0 ? siguiente : anterior)(); }
      toqueX = null;
    });
    salto.querySelector('input').addEventListener('keydown', e => {
      if (e.key === 'Enter') { const n = parseInt(e.target.value, 10); if (n) ir(n - 1, 0); salto.classList.remove('abierto'); }
      if (e.key === 'Escape') salto.classList.remove('abierto');
      e.stopPropagation();
    });
    document.addEventListener('keydown', e => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.target.closest('input, textarea, select, [contenteditable]')) return;
      if (e.key === 'Escape') { ayuda.classList.remove('abierto'); salto.classList.remove('abierto'); return; }
      const enBoton = e.target.closest('button, summary, [role="button"], .tarjeta');
      const tecla = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const navegable = enEscenario() || esOrador;
      const acciones = {
        ArrowRight: () => navegable && siguiente(), ArrowDown: () => navegable && siguiente(), PageDown: () => navegable && siguiente(),
        ' ': () => navegable && !enBoton && siguiente(), Enter: () => navegable && !enBoton && siguiente(),
        ArrowLeft: () => navegable && anterior(), ArrowUp: () => navegable && anterior(), PageUp: () => navegable && anterior(),
        Backspace: () => navegable && anterior(),
        Home: () => navegable && ir(0, 0), End: () => navegable && ir(diapositivas.length - 1, 0),
        f: pantallaCompleta,
        l: () => { if (esOrador) return; vistaForzada = true; ponerVista(enEscenario() ? 'vista-lectura' : 'vista-escenario'); },
        a: () => { raiz.dataset.animacion = NIVELES[(NIVELES.indexOf(nivel()) + 1) % NIVELES.length]; avisar('Animación: ' + nivel()); },
        b: () => { raiz.classList.toggle('sin-progreso'); },
        g: () => { salto.classList.add('abierto'); const c = salto.querySelector('input'); c.value = ''; setTimeout(() => c.focus(), 0); },
        h: () => ayuda.classList.toggle('abierto'), '?': () => ayuda.classList.toggle('abierto'),
      };
      if (!acciones[tecla]) return;
      if (acciones[tecla]() !== false && [' ', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', 'Backspace'].includes(tecla) && navegable) e.preventDefault();
    });
    window.addEventListener('hashchange', () => { const n = parseInt(location.hash.slice(1), 10); if (n && n - 1 !== i) ir(n - 1, 0); });

    /* ── Arranque ──────────────────────────────────────────────────────── */
    window.Presentacion = { ir, siguiente, anterior, estado: () => ({ i, k }), diapositivas, esOrador, avisar, pantallaCompleta };
    ponerVista(vistaNatural());
    ir((parseInt(location.hash.slice(1), 10) || 1) - 1, 0, { sinAnimacion: true });
  });
})();
