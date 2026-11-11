/* interactivos.js — componentes de estudio.

   Con definición en JavaScript:
     Interactivos.algoritmo("nombre", { codigo, lenguaje, entrada, leer, aleatoria, barras, *pasos(valor) })
       <div data-algoritmo="nombre"></div>
     Interactivos.explorador("nombre", { parametros, x, y, curvas, formula, lectura, puntos })
       <div data-explorador="nombre"></div>

   Solo con HTML:
     <div class="tarjetas"> <div class="tarjeta"><div class="frente">…</div><div class="reverso">…</div></div> … </div>
     <div class="pregunta"> <p class="enunciado">…</p> <ul><li data-correcta>…</li><li>…</li></ul> <p class="explicacion">…</p> </div>
     <div class="pestanas"> <section data-titulo="…">…</section> … </div>
     <details class="desplegable"><summary>…</summary> … </details> */
(() => {
  const Plantilla = (window.Plantilla = window.Plantilla || {});
  const definiciones = { algoritmo: {}, explorador: {} };
  window.Interactivos = {
    algoritmo: (nombre, def) => { definiciones.algoritmo[nombre] = def; },
    explorador: (nombre, def) => { definiciones.explorador[nombre] = def; },
  };
  const escapar = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const mostrar = v => Array.isArray(v) ? `[${v.join(', ')}]` : typeof v === 'number' && !Number.isInteger(v) ? v.toFixed(3) : String(v);
  const alImprimir = f => document.addEventListener('plantilla:imprimir', f);

  /* ── Algoritmo paso a paso ───────────────────────────────────────────── */
  const leerLista = texto => {
    const partes = texto.split(/[\s,;]+/).filter(Boolean);
    if (!partes.length) throw new Error('Escribí al menos un valor.');
    return partes.map(p => {
      const n = Number(p);
      if (!Number.isFinite(n)) throw new Error(`"${p}" no es un número.`);
      return n;
    });
  };
  const listaAlAzar = () => Array.from({ length: 6 + Math.floor(Math.random() * 3) }, () => 1 + Math.floor(Math.random() * 20));

  function dibujarArreglo(vis, s, def) {
    const a = s.arreglo;
    let caja = vis.querySelector('.arreglo');
    if (!caja || caja.children.length !== a.length) {
      vis.innerHTML = `<div class="arreglo">${a.map((_, i) => `<div class="celda"><div class="barra"></div><small>${i}</small><em></em></div>`).join('')}</div>`;
      caja = vis.firstElementChild;
    }
    const numerico = def.barras !== false && a.every(v => typeof v === 'number');
    caja.classList.toggle('sin-barras', !numerico);
    const max = Math.max(...a.map(v => Math.abs(v)), 1);
    const en = (lista, i) => (lista || []).includes(i);
    [...caja.children].forEach((celda, i) => {
      const barra = celda.firstElementChild;
      barra.textContent = a[i];
      barra.style.height = numerico ? `${22 + 78 * Math.abs(a[i]) / max}%` : '';
      celda.className = 'celda' + (en(s.ordenados, i) ? ' ordenado' : '') + (en(s.comparados, i) ? ' comparado' : '') + (en(s.activos, i) ? ' activo' : '');
      celda.lastElementChild.textContent = Object.entries(s.punteros || {}).filter(([, v]) => v === i).map(([k]) => k).join(',');
    });
  }
  function dibujarGrafo(vis, s, def) {
    const g = s.grafo || def.grafo;
    const pos = Object.fromEntries(g.nodos.map(n => [n.id, n]));
    const par = (lista, a, b) => (lista || []).some(([x, y]) => (x === a && y === b) || (x === b && y === a));
    const en = (lista, id) => (lista || []).includes(id);
    vis.innerHTML = `<svg class="grafo" viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet">` +
      g.aristas.map(([a, b]) => `<line class="arista${par(s.aristasActivas, a, b) ? ' activa' : par(s.aristasVisitadas, a, b) ? ' visitada' : ''}" x1="${pos[a].x}" y1="${pos[a].y}" x2="${pos[b].x}" y2="${pos[b].y}"/>`).join('') +
      g.nodos.map(n => `<g class="nodo${en(s.visitados, n.id) ? ' visitado' : ''}${en(s.comparados, n.id) ? ' comparado' : ''}${en(s.activos, n.id) ? ' activo' : ''}">` +
        `<circle cx="${n.x}" cy="${n.y}" r="4.6"/><text x="${n.x}" y="${n.y}">${escapar(n.etiqueta ?? n.id)}</text>` +
        (s.etiquetas && s.etiquetas[n.id] != null ? `<text class="extra" x="${n.x}" y="${n.y + 7.6}">${escapar(s.etiquetas[n.id])}</text>` : '') + `</g>`).join('') + `</svg>`;
  }

  function montarAlgoritmo(el) {
    const def = definiciones.algoritmo[el.dataset.algoritmo];
    if (!def) { console.warn(`algoritmo: no hay definición para "${el.dataset.algoritmo}".`); return; }
    el.classList.add('interactivo', 'algoritmo');
    const conEntrada = def.entrada !== false;
    el.innerHTML = `
      <pre data-numeros data-sin-foco><code class="language-${escapar(def.lenguaje || 'python')}"></code></pre>
      <div class="algoritmo__lado"><div class="algoritmo__vis"></div><dl class="algoritmo__vars"></dl><p class="algoritmo__nota"></p></div>
      <div class="controles">
        <button type="button" data-a="inicio">Reiniciar</button>
        <button type="button" data-a="atras">Atrás</button>
        <button type="button" data-a="paso" class="principal">Paso</button>
        <button type="button" data-a="correr">Reproducir</button>
        <span class="rotulo">Velocidad</span><input type="range" min="1" max="20" value="4" aria-label="Velocidad">
        <span class="contador"></span>
      </div>
      ${conEntrada ? `<div class="entrada"><span class="rotulo">Entrada</span><input type="text" aria-label="Entrada" spellcheck="false">
        <button type="button" data-a="aplicar">Aplicar</button><button type="button" data-a="azar">Aleatoria</button><span class="error"></span></div>` : ''}`;
    const $ = s => el.querySelector(s);
    const pre = $('pre'), vis = $('.algoritmo__vis'), vars = $('.algoritmo__vars'), nota = $('.algoritmo__nota');
    const campo = $('.entrada input'), error = $('.error'), velocidad = $('.controles input'), contador = $('.contador');
    const boton = a => $(`[data-a="${a}"]`);
    $('code').textContent = def.codigo;
    Plantilla.codigo(pre);

    let estados = [{}], i = 0, reloj = null;
    const pintar = () => {
      const s = estados[i] || {};
      Plantilla.resaltarLineas(pre, String(s.linea ?? ''));
      const linea = pre.querySelector('.linea.resaltada');
      if (linea) {
        // Mantiene la línea activa a la vista sin mover el resto de la página
        const rl = linea.getBoundingClientRect(), rp = pre.getBoundingClientRect();
        if (rl.top < rp.top || rl.bottom > rp.bottom) pre.scrollTop += rl.top - rp.top - rp.height / 2;
      }
      vars.innerHTML = Object.entries(s.variables || {}).map(([k, v]) => `<div><dt>${escapar(k)}</dt><dd>${escapar(mostrar(v))}</dd></div>`).join('');
      nota.innerHTML = s.nota || '';
      if (s.nota && Plantilla.mates) Plantilla.mates(nota);
      if (def.dibujar) def.dibujar(s, vis);
      else if (s.grafo || def.grafo) dibujarGrafo(vis, s, def);
      else if (s.arreglo) dibujarArreglo(vis, s, def);
      contador.textContent = `paso ${i + 1} / ${estados.length}`;
      boton('atras').disabled = boton('inicio').disabled = i === 0;
      boton('paso').disabled = i >= estados.length - 1;
    };
    const parar = () => { clearTimeout(reloj); reloj = null; boton('correr').textContent = 'Reproducir'; };
    const ir = n => { i = Math.max(0, Math.min(estados.length - 1, n)); pintar(); };
    const tic = () => {
      if (i >= estados.length - 1) return parar();
      ir(i + 1);
      reloj = setTimeout(tic, 1600 / Number(velocidad.value));
    };
    const cargar = texto => {
      parar();
      try {
        const valor = conEntrada ? (def.leer || leerLista)(texto) : undefined;
        const nuevos = [];
        for (const s of def.pasos(valor)) { nuevos.push(s); if (nuevos.length >= 5000) break; }
        estados = nuevos.length ? nuevos : [{}];
        if (error) error.textContent = '';
        ir(0);
      } catch (e) { if (error) error.textContent = e.message; else console.error(e); }
    };
    el.addEventListener('click', e => {
      const a = e.target.closest('button')?.dataset.a;
      if (a === 'inicio') { parar(); ir(0); }
      if (a === 'atras') { parar(); ir(i - 1); }
      if (a === 'paso') { parar(); ir(i + 1); }
      if (a === 'correr') { if (reloj) parar(); else { if (i >= estados.length - 1) ir(0); boton('correr').textContent = 'Pausa'; reloj = setTimeout(tic, 300); } }
      if (a === 'aplicar') cargar(campo.value);
      if (a === 'azar') {
        const v = (def.aleatoria || listaAlAzar)();
        campo.value = Array.isArray(v) ? v.join(', ') : String(v);
        cargar(campo.value);
      }
    });
    if (campo) {
      campo.value = el.dataset.entrada || (Array.isArray(def.entrada) ? def.entrada.join(', ') : def.entrada || '5, 2, 9, 1, 6, 3');
      campo.addEventListener('keydown', e => { if (e.key === 'Enter') cargar(campo.value); });
    }
    cargar(campo ? campo.value : '');
    alImprimir(() => { parar(); ir(el.dataset.estadoPdf ? Number(el.dataset.estadoPdf) - 1 : estados.length - 1); });
  }

  /* ── Explorador con deslizador ───────────────────────────────────────── */
  function marcas(a, b, cuantas = 6) {
    const bruto = (b - a) / cuantas, mag = 10 ** Math.floor(Math.log10(bruto));
    const paso = [1, 2, 2.5, 5, 10].map(m => m * mag).find(p => p >= bruto) || bruto;
    const lista = [];
    for (let v = Math.ceil(a / paso - 1e-9) * paso; v <= b + 1e-9; v += paso) lista.push(Math.abs(v) < 1e-12 ? 0 : Number(v.toPrecision(12)));
    return lista;
  }
  function trazar(svg, def, v) {
    const W = 640, H = 400, L = 52, R = 16, T = 16, B = 34;
    const [x0, x1] = typeof def.x === 'function' ? def.x(v) : def.x || [-5, 5];
    const [y0, y1] = typeof def.y === 'function' ? def.y(v) : def.y || [-5, 5];
    const X = x => L + (x - x0) / (x1 - x0) * (W - L - R), Y = y => H - B - (y - y0) / (y1 - y0) * (H - T - B);
    const id = svg.dataset.clip || (svg.dataset.clip = 'clip' + Math.random().toString(36).slice(2, 8));
    let h = `<defs><clipPath id="${id}"><rect x="${L}" y="${T}" width="${W - L - R}" height="${H - T - B}"/></clipPath></defs>`;
    marcas(x0, x1).forEach(m => { h += `<line class="cuadricula" x1="${X(m)}" y1="${T}" x2="${X(m)}" y2="${H - B}"/><text class="marca" x="${X(m)}" y="${H - B + 20}" text-anchor="middle">${m}</text>`; });
    marcas(y0, y1, 5).forEach(m => { h += `<line class="cuadricula" x1="${L}" y1="${Y(m)}" x2="${W - R}" y2="${Y(m)}"/><text class="marca" x="${L - 8}" y="${Y(m) + 4}" text-anchor="end">${m}</text>`; });
    if (y0 <= 0 && y1 >= 0) h += `<line class="eje" x1="${L}" y1="${Y(0)}" x2="${W - R}" y2="${Y(0)}"/>`;
    if (x0 <= 0 && x1 >= 0) h += `<line class="eje" x1="${X(0)}" y1="${T}" x2="${X(0)}" y2="${H - B}"/>`;
    const alto = y1 - y0;
    (def.curvas ? def.curvas(v) : []).forEach(c => {
      let d = '', pluma = false;
      for (let k = 0; k <= 320; k++) {
        const x = x0 + (x1 - x0) * k / 320, y = c.f(x);
        if (!Number.isFinite(y) || y < y0 - 2 * alto || y > y1 + 2 * alto) { pluma = false; continue; }
        d += `${pluma ? 'L' : 'M'}${X(x).toFixed(1)} ${Y(y).toFixed(1)}`;
        pluma = true;
      }
      h += `<path class="curva" clip-path="url(#${id})" d="${d}" style="stroke:var(--${c.color || 'morado'})${c.ancho ? `;stroke-width:${c.ancho}` : ''}"${c.punteada ? ' stroke-dasharray="8 8"' : ''}/>`;
    });
    (def.puntos ? def.puntos(v) : []).forEach(p => {
      h += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="7" style="fill:var(--${p.color || 'amarillo'});stroke:var(--fondo);stroke-width:2.5"/>`;
      if (p.etiqueta) h += `<text class="marca" x="${X(p.x) + 12}" y="${Y(p.y) - 10}">${escapar(p.etiqueta)}</text>`;
    });
    svg.innerHTML = h;
  }
  function montarExplorador(el) {
    const def = definiciones.explorador[el.dataset.explorador];
    if (!def) { console.warn(`explorador: no hay definición para "${el.dataset.explorador}".`); return; }
    el.classList.add('interactivo', 'explorador');
    const uid = 'e' + Math.random().toString(36).slice(2, 8);
    el.innerHTML = `<div class="explorador__grafica"><svg viewBox="0 0 640 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Gráfica"></svg></div>
      <div class="explorador__lado"><div class="explorador__formula"></div>
      ${def.parametros.map(p => `<div class="parametro"><label for="${uid}-${p.id}">${Plantilla.tex ? Plantilla.tex(p.tex || p.id) : escapar(p.id)}</label>
        <input type="range" id="${uid}-${p.id}" data-id="${escapar(p.id)}" min="${p.min}" max="${p.max}" step="${p.paso ?? 0.1}" value="${p.valor ?? p.min}"><output></output></div>`).join('')}
      <p class="explorador__lectura"></p></div>`;
    const svg = el.querySelector('svg'), formula = el.querySelector('.explorador__formula'), lectura = el.querySelector('.explorador__lectura');
    const campos = [...el.querySelectorAll('input[type="range"]')];
    const pintar = () => {
      const v = {};
      campos.forEach(c => {
        v[c.dataset.id] = Number(c.value);
        const decimales = (String(c.step).split('.')[1] || '').length;
        c.nextElementSibling.textContent = Number(c.value).toFixed(decimales);
      });
      if (def.formula) formula.innerHTML = Plantilla.tex(def.formula(v), true); else formula.hidden = true;
      if (def.lectura) { lectura.innerHTML = def.lectura(v); Plantilla.mates(lectura); }
      if (def.dibujar) def.dibujar(v, svg); else trazar(svg, def, v);
    };
    campos.forEach(c => c.addEventListener('input', pintar));
    pintar();
  }

  /* ── Tarjetas de repaso ──────────────────────────────────────────────── */
  function montarTarjetas(el) {
    el.classList.add('interactivo');
    const tarjetas = [...el.querySelectorAll(':scope > .tarjeta')];
    if (!tarjetas.length) return;
    const pila = document.createElement('div');
    pila.className = 'tarjetas__pila';
    tarjetas.forEach(t => {
      t.tabIndex = 0;
      t.querySelectorAll('.frente, .reverso').forEach(cara => { const caja = document.createElement('div'); caja.append(...cara.childNodes); cara.append(caja); });
      pila.append(t);
    });
    el.append(pila);
    el.insertAdjacentHTML('beforeend', `<p class="tarjetas__pista">Clic en la tarjeta para voltearla</p>
      <div class="controles tarjetas__nav"><button type="button" data-a="-1">Anterior</button><span class="contador"></span><button type="button" data-a="1">Siguiente</button></div>`);
    let i = 0;
    const pintar = () => {
      tarjetas.forEach((t, k) => { t.classList.toggle('actual', k === i); if (k !== i) t.classList.remove('volteada'); });
      el.querySelector('.contador').textContent = `${i + 1} / ${tarjetas.length}`;
    };
    pila.addEventListener('click', e => e.target.closest('.tarjeta')?.classList.toggle('volteada'));
    pila.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.target.closest('.tarjeta')?.classList.toggle('volteada'); } });
    el.querySelector('.tarjetas__nav').addEventListener('click', e => {
      const paso = Number(e.target.closest('button')?.dataset.a);
      if (paso) { i = (i + paso + tarjetas.length) % tarjetas.length; pintar(); }
    });
    pintar();
  }

  /* ── Pregunta de opción múltiple ─────────────────────────────────────── */
  function montarPregunta(el) {
    el.classList.add('interactivo');
    const opciones = [...el.querySelectorAll('li')];
    opciones.forEach((li, k) => { li.dataset.letra = String.fromCharCode(65 + k); li.tabIndex = 0; li.setAttribute('role', 'button'); });
    el.insertAdjacentHTML('beforeend', '<div class="controles"><button type="button" hidden>Reintentar</button></div>');
    const reintentar = el.querySelector('.controles button');
    const elegir = li => {
      if (!li || el.classList.contains('respondida')) return;
      el.classList.add('respondida');
      li.classList.add('elegida');
      opciones.forEach(o => o.classList.toggle('correcta', o.hasAttribute('data-correcta')));
      reintentar.hidden = false;
    };
    el.querySelector('ul').addEventListener('click', e => elegir(e.target.closest('li')));
    el.querySelector('ul').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); elegir(e.target.closest('li')); } });
    reintentar.addEventListener('click', () => {
      el.classList.remove('respondida');
      opciones.forEach(o => o.classList.remove('elegida', 'correcta'));
      reintentar.hidden = true;
    });
  }

  /* ── Pestañas ────────────────────────────────────────────────────────── */
  function montarPestanas(el) {
    el.classList.add('interactivo');
    const secciones = [...el.querySelectorAll(':scope > section')];
    const barra = document.createElement('div');
    barra.className = 'pestanas__barra';
    barra.setAttribute('role', 'tablist');
    barra.innerHTML = secciones.map((s, k) => `<button type="button" role="tab" data-k="${k}">${escapar(s.dataset.titulo || `Parte ${k + 1}`)}</button>`).join('');
    el.prepend(barra);
    const elegir = k => {
      secciones.forEach((s, j) => s.classList.toggle('actual', j === k));
      [...barra.children].forEach((b, j) => b.setAttribute('aria-selected', j === k));
    };
    barra.addEventListener('click', e => { const b = e.target.closest('button'); if (b) elegir(Number(b.dataset.k)); });
    elegir(0);
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-algoritmo]').forEach(montarAlgoritmo);
    document.querySelectorAll('[data-explorador]').forEach(montarExplorador);
    document.querySelectorAll('.tarjetas').forEach(montarTarjetas);
    document.querySelectorAll('.pregunta').forEach(montarPregunta);
    document.querySelectorAll('.pestanas').forEach(montarPestanas);
    // En el PDF los desplegables salen abiertos
    alImprimir(() => document.querySelectorAll('details.desplegable').forEach(d => { d.open = true; }));
  });
})();
