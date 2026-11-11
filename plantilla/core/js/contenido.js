/* contenido.js — prepara el contenido: rótulos de bloques, matemáticas (KaTeX),
   código (highlight.js, línea por línea) y gráficos (ECharts con la paleta).

   API pública (objeto global Plantilla):
     Plantilla.macros = { "\\RR": "\\mathbb{R}" }     macros de LaTeX propias
     Plantilla.mates(elemento)                        renderiza fórmulas nuevas
     Plantilla.tex("x^2", enBloque)                   devuelve el HTML de una fórmula
     Plantilla.codigo(pre)                            resalta un <pre><code>
     Plantilla.resaltarLineas(pre, "2,4-6")           marca líneas de un código
     Plantilla.grafico("nombre", opciones | funcion)  registra un gráfico
     Plantilla.colores                                la paleta leída del CSS */
(() => {
  const Plantilla = (window.Plantilla = window.Plantilla || {});
  const raiz = document.documentElement;
  const escapar = t => String(t).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

  /* ── Paleta, leída de tokens.css para no repetir valores ─────────────── */
  let paleta;
  Object.defineProperty(Plantilla, 'colores', {
    get() {
      if (paleta) return paleta;
      const estilo = getComputedStyle(raiz);
      const v = n => estilo.getPropertyValue('--' + n).trim();
      paleta = {};
      ['fondo', 'superficie', 'superficie-hundida', 'tinta', 'tinta-suave', 'tinta-apagada', 'tinta-tenue',
        'morado', 'verde', 'amarillo', 'azul', 'morado-fuerte', 'verde-fuerte', 'amarillo-fuerte', 'azul-fuerte']
        .forEach(n => { paleta[n.replace(/-(\w)/g, (_, l) => l.toUpperCase())] = v(n); });
      paleta.linea = 'rgba(15, 23, 42, 0.10)';
      paleta.lineaFuerte = 'rgba(15, 23, 42, 0.22)';
      paleta.serie = [paleta.morado, paleta.verde, paleta.amarillo, paleta.azul,
        paleta.moradoFuerte, paleta.verdeFuerte, paleta.amarilloFuerte, paleta.azulFuerte];
      return paleta;
    },
  });

  /* ── Rótulos de bloques: "Teorema 1 · Gauss-Bonnet" ──────────────────── */
  const NOMBRES = {
    definicion: 'Definición', teorema: 'Teorema', lema: 'Lema', proposicion: 'Proposición', corolario: 'Corolario',
    ejemplo: 'Ejemplo', observacion: 'Observación', advertencia: 'Advertencia', demostracion: 'Demostración',
  };
  const GRUPO = { teorema: 'r', lema: 'r', proposicion: 'r', corolario: 'r', definicion: 'd', ejemplo: 'e' };
  function rotular() {
    const cuenta = {};
    document.querySelectorAll('.bloque').forEach(b => {
      if (b.querySelector(':scope > .bloque__rotulo')) return;
      const tipo = Object.keys(NOMBRES).find(t => b.classList.contains('bloque--' + t));
      let texto = b.dataset.rotulo || (tipo && NOMBRES[tipo]);
      if (!texto) return;
      if (tipo && GRUPO[tipo] && !b.dataset.rotulo && !b.hasAttribute('data-sin-numero')) {
        const n = b.dataset.numero || (cuenta[GRUPO[tipo]] = (cuenta[GRUPO[tipo]] || 0) + 1);
        texto += ' ' + n;
      }
      const p = document.createElement('p');
      p.className = 'bloque__rotulo';
      p.innerHTML = escapar(texto) + (b.dataset.nombre ? ` <span>· ${escapar(b.dataset.nombre)}</span>` : '');
      b.prepend(p);
    });
  }

  /* ── Matemáticas ─────────────────────────────────────────────────────── */
  Plantilla.macros = Plantilla.macros || {};
  Plantilla.mates = (el = document.body) => {
    if (!window.renderMathInElement) return;
    window.renderMathInElement(el, {
      delimiters: [
        { left: '\\[', right: '\\]', display: true }, { left: '$$', right: '$$', display: true },
        { left: '\\(', right: '\\)', display: false },
      ],
      macros: Plantilla.macros, throwOnError: false,
      ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'option'],
      ignoredClasses: ['uso', 'sin-mates'],
    });
  };
  Plantilla.tex = (tex, enBloque = false) =>
    window.katex ? window.katex.renderToString(tex, { displayMode: enBloque, macros: Plantilla.macros, throwOnError: false }) : escapar(tex);

  /* ── Código ──────────────────────────────────────────────────────────── */
  // Quita la sangría común y las líneas vacías de los extremos, para poder
  // indentar el código dentro del HTML sin que eso se vea.
  function limpiar(texto) {
    const lineas = texto.replace(/\t/g, '    ').split('\n');
    while (lineas.length && !lineas[0].trim()) lineas.shift();
    while (lineas.length && !lineas[lineas.length - 1].trim()) lineas.pop();
    const sangria = Math.min(...lineas.filter(l => l.trim()).map(l => l.match(/^ */)[0].length));
    return lineas.map(l => l.slice(Number.isFinite(sangria) ? sangria : 0)).join('\n');
  }
  // Parte el HTML resaltado en líneas, cerrando y reabriendo las etiquetas
  // que quedan abiertas al final de cada una (cadenas de varias líneas).
  function porLineas(html) {
    const abiertas = [], lineas = [];
    let actual = '';
    html.replace(/(<span[^>]*>)|(<\/span>)|(\n)|([^<\n]+)/g, (_, abre, cierra, salto, texto) => {
      if (abre) { abiertas.push(abre); actual += abre; }
      else if (cierra) { abiertas.pop(); actual += cierra; }
      else if (salto) { lineas.push(actual + '</span>'.repeat(abiertas.length)); actual = abiertas.join(''); }
      else actual += texto;
      return '';
    });
    lineas.push(actual);
    return lineas.map(l => `<span class="linea">${l || ' '}</span>`).join('');
  }
  const rango = texto => {
    const s = new Set();
    String(texto || '').split(',').forEach(p => {
      const [a, b] = p.split('-').map(n => parseInt(n, 10));
      if (!a) return;
      for (let i = a; i <= (b || a); i++) s.add(i);
    });
    return s;
  };
  Plantilla.resaltarLineas = (pre, texto) => {
    const marcadas = texto instanceof Set ? texto : rango(texto);
    pre.querySelectorAll('.linea').forEach((l, i) => l.classList.toggle('resaltada', marcadas.has(i + 1)));
    pre.classList.toggle('con-foco', marcadas.size > 0 && !pre.hasAttribute('data-sin-foco'));
  };
  Plantilla.codigo = pre => {
    const code = pre.querySelector('code');
    if (!code || code.dataset.listo) return;
    const texto = limpiar(code.textContent);
    const lenguaje = (code.className.match(/language-([\w-]+)/) || [])[1] || pre.dataset.lenguaje;
    let html = escapar(texto);
    if (window.hljs && lenguaje && window.hljs.getLanguage(lenguaje)) {
      html = window.hljs.highlight(texto, { language: lenguaje, ignoreIllegals: true }).value;
    }
    code.innerHTML = porLineas(html);
    code.dataset.listo = '1';
    if (pre.dataset.resaltar) Plantilla.resaltarLineas(pre, pre.dataset.resaltar);
  };
  // Un paso con data-lineas="3-5" resalta esas líneas del código de su
  // diapositiva (o del que indique data-codigo="#id") cuando le toca.
  document.addEventListener('plantilla:cambio', e => {
    const d = e.detail.diapositiva;
    const pasos = [...d.querySelectorAll('[data-paso][data-lineas]')];
    if (!pasos.length) return;
    const vigente = pasos.filter(p => p.classList.contains('visible')).pop();
    const destinos = new Set(pasos.map(p => (p.dataset.codigo && d.querySelector(p.dataset.codigo)) || d.querySelector('pre')));
    destinos.forEach(pre => {
      if (!pre) return;
      const dueno = vigente && ((vigente.dataset.codigo && d.querySelector(vigente.dataset.codigo)) || d.querySelector('pre'));
      Plantilla.resaltarLineas(pre, dueno === pre ? vigente.dataset.lineas : pre.dataset.resaltar || '');
    });
  });

  /* ── Gráficos ────────────────────────────────────────────────────────── */
  const definiciones = {};
  Plantilla.grafico = (nombre, definicion) => { definiciones[nombre] = definicion; };

  function tema(base) {
    const c = Plantilla.colores;
    const eje = {
      axisLine: { lineStyle: { color: c.lineaFuerte, width: base / 12 } },
      axisTick: { show: false },
      axisLabel: { color: c.tintaApagada, fontSize: base * 0.92, fontFamily: 'JetBrains Mono, monospace', margin: base * 0.6 },
      splitLine: { lineStyle: { color: c.linea, width: base / 14 } },
      nameTextStyle: { color: c.tintaApagada, fontSize: base, fontFamily: 'Newsreader, serif', fontStyle: 'italic' },
      nameGap: base * 1.8,
    };
    return {
      color: c.serie,
      backgroundColor: 'transparent',
      textStyle: { fontFamily: 'Newsreader, serif', color: c.tintaSuave, fontSize: base },
      title: { textStyle: { color: c.tinta, fontSize: base * 1.3, fontWeight: 600 }, subtextStyle: { color: c.tintaApagada, fontSize: base * 0.9 }, left: 0, top: 0 },
      legend: { textStyle: { color: c.tintaSuave, fontSize: base }, itemWidth: base * 1.1, itemHeight: base * 0.6, itemGap: base * 1.2, icon: 'roundRect', top: 0, right: base * 0.6 },
      tooltip: {
        backgroundColor: c.superficie, borderColor: c.lineaFuerte, borderWidth: 1, padding: [base * 0.4, base * 0.6],
        textStyle: { color: c.tinta, fontSize: base * 0.9, fontFamily: 'Newsreader, serif' },
        axisPointer: { lineStyle: { color: c.lineaFuerte }, crossStyle: { color: c.lineaFuerte } },
      },
      categoryAxis: { ...eje, splitLine: { show: false } },
      valueAxis: eje, logAxis: eje, timeAxis: eje,
      line: { lineStyle: { width: base / 5.5 }, symbol: 'circle', symbolSize: base * 0.45, smooth: false },
      bar: { itemStyle: { borderRadius: [base / 4, base / 4, 0, 0] }, barMaxWidth: base * 4 },
      scatter: { symbolSize: base * 0.6, itemStyle: { opacity: 0.85 } },
      pie: { itemStyle: { borderColor: c.fondo, borderWidth: base / 8 }, label: { color: c.tintaSuave, fontSize: base } },
      heatmap: { itemStyle: { borderColor: c.fondo, borderWidth: base / 10 }, label: { fontSize: base * 0.8 } },
      graph: {
        color: c.serie, symbolSize: base * 1.8, lineStyle: { color: c.lineaFuerte, width: base / 10 },
        label: { color: c.tinta, fontSize: base * 0.85, fontFamily: 'JetBrains Mono, monospace' },
        itemStyle: { borderColor: c.fondo, borderWidth: base / 8 },
      },
      visualMap: { color: [c.morado, c.azul, c.fondo], textStyle: { color: c.tintaApagada, fontSize: base * 0.85 } },
    };
  }
  function completar(op, base, ancho) {
    const o = { ...op };
    const angosto = ancho < 560;  // celular: la leyenda baja para no pisar el nombre del eje
    if (!o.grid && (o.xAxis || o.yAxis)) {
      const conNombre = o.yAxis && o.yAxis.name;
      o.grid = { left: base * 0.4, right: base * 1.4, bottom: base * ((o.xAxis && o.xAxis.name ? 2 : 0.4) + (angosto && o.legend ? 2.2 : 0)), top: base * (o.title ? 4.8 : (o.legend && !angosto) || conNombre ? 3 : 1.2), containLabel: true };
    }
    // El nombre del eje x va centrado abajo; el del eje y, arriba y hacia la derecha
    if (o.xAxis && o.xAxis.name && !o.xAxis.nameLocation) o.xAxis = { nameLocation: 'middle', ...o.xAxis };
    if (o.yAxis && o.yAxis.name && !o.yAxis.nameLocation) o.yAxis = { nameTextStyle: { align: 'left' }, nameGap: base * 1.1, ...o.yAxis };
    if (angosto && o.legend && !Array.isArray(o.legend)) o.legend = { top: 'auto', bottom: 0, right: 'auto', left: 'center', ...o.legend };
    if (raiz.dataset.animacion === 'ninguna' || raiz.classList.contains('imprimiendo')) o.animation = false;
    return o;
  }
  function iniciarGrafico(el) {
    if (el._grafico || !window.echarts || !el.offsetWidth || !el.offsetHeight) return;
    const diapositiva = el.closest('.diapositiva');
    const u = diapositiva ? diapositiva.offsetWidth / 1920 : 1;
    const base = diapositiva ? 24 : 14;
    const json = el.querySelector('script[type="application/json"]');
    let definicion = definiciones[el.dataset.grafico];
    if (!definicion && json) {
      try { definicion = JSON.parse(json.textContent); } catch (e) { console.error('grafico: JSON no válido.', e); }
    }
    if (!definicion) { console.warn(`grafico: no hay definición para "${el.dataset.grafico}".`); return; }
    // El gráfico se dibuja siempre en unidades del lienzo (1920 de ancho) y se
    // escala con CSS: así textos y grosores quedan proporcionales a la diapositiva.
    const ancho = el.offsetWidth / u, alto = el.offsetHeight / u;
    const lienzo = document.createElement('div');
    lienzo.className = 'grafico__lienzo';
    lienzo.style.cssText = `width:${ancho}px;height:${alto}px;` + (diapositiva ? `transform:scale(${u})` : '');
    el.append(lienzo);
    const nombreTema = 'plantilla-' + base;
    window.echarts.registerTheme(nombreTema, tema(base));
    const grafico = window.echarts.init(lienzo, nombreTema, { renderer: 'svg', width: ancho, height: alto });
    const opciones = typeof definicion === 'function' ? definicion({ colores: Plantilla.colores, base, grafico }) : definicion;
    grafico.setOption(completar(opciones, base, ancho));
    el._grafico = { grafico, ancho, alto, lienzo, enDiapositiva: !!diapositiva };
    fluir(el);
  }
  // Fuera de las diapositivas el ancho de la página impresa no se conoce de
  // antemano: al imprimir, el SVG recibe un viewBox y escala al ancho disponible.
  function fluir(el) {
    const g = el._grafico, svg = el.querySelector('.grafico__lienzo svg');
    if (!g || g.enDiapositiva || !svg || !raiz.classList.contains('imprimiendo')) return;
    svg.setAttribute('viewBox', `0 0 ${svg.getAttribute('width')} ${svg.getAttribute('height')}`);
    el.classList.add('grafico--fluido');
  }
  function ajustarGrafico(el) {
    const g = el._grafico;
    if (!g) return iniciarGrafico(el);
    if (!el.offsetWidth) return;
    if (g.enDiapositiva) g.lienzo.style.transform = `scale(${el.offsetWidth / g.ancho})`;
    else {
      g.lienzo.style.width = el.offsetWidth + 'px'; g.lienzo.style.height = el.offsetHeight + 'px';
      g.grafico.resize({ width: el.offsetWidth, height: el.offsetHeight });
    }
  }
  Plantilla.ajustarGraficos = () => document.querySelectorAll('.grafico').forEach(ajustarGrafico);

  /* ── Arranque ────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    rotular();
    document.querySelectorAll('pre').forEach(Plantilla.codigo);
    Plantilla.mates();

    const graficos = [...document.querySelectorAll('.grafico')];
    if (graficos.length) {
      const listo = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
      listo.then(() => {
        const alVer = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && iniciarGrafico(e.target)));
        const alCambiar = new ResizeObserver(es => es.forEach(e => ajustarGrafico(e.target)));
        graficos.forEach(g => { alVer.observe(g); alCambiar.observe(g); });
        // Para el PDF se dibujan todos de una vez, sin esperar a que se vean
        if (raiz.classList.contains('imprimiendo')) graficos.forEach(iniciarGrafico);
      });
    }
    document.addEventListener('plantilla:imprimir', () => {
      Plantilla.ajustarGraficos();
      document.querySelectorAll('.grafico').forEach(fluir);
    });
  });
})();
