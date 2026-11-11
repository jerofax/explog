/* referencias.js — citas numeradas, pie por diapositiva y bibliografía automática.

   Uso:
   1. Una sola lista en el documento:
        <script type="application/json" id="referencias">
        { "docarmo1976": { "autores": "do Carmo, M. P.", "anio": 1976,
                           "titulo": "Differential Geometry of Curves and Surfaces",
                           "fuente": "Prentice-Hall", "corta": "do Carmo, 1976" } }
        </script>
   2. En el texto: <cite data-ref="docarmo1976"></cite>  (varias: data-ref="a,b")
   3. Donde va la bibliografía: un elemento con el atributo data-referencias.
      En presentación es una diapositiva, y se reparte sola en varias. */
(() => {
  const escapar = t => String(t ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  document.addEventListener('DOMContentLoaded', () => {
    const fuente = document.getElementById('referencias');
    if (!fuente) return;
    let datos;
    try { datos = JSON.parse(fuente.textContent); }
    catch (e) { console.error('referencias: el JSON no es válido.', e); return; }

    const esPresentacion = document.documentElement.dataset.modo === 'presentacion';
    const orden = [];
    const numero = clave => {
      if (!orden.includes(clave)) orden.push(clave);
      return orden.indexOf(clave) + 1;
    };
    const corta = r => r.corta || `${String(r.autores).split(',')[0]}, ${r.anio}`;

    // 1. Citas en el texto, numeradas por orden de aparición
    const porDiapositiva = new Map();
    document.querySelectorAll('cite[data-ref]').forEach(cita => {
      const claves = cita.dataset.ref.split(',').map(c => c.trim()).filter(Boolean);
      const partes = claves.map(clave => {
        if (!datos[clave]) { console.warn(`referencias: no existe la clave "${clave}".`); return '?'; }
        const n = numero(clave);
        const diapositiva = cita.closest('.diapositiva');
        if (diapositiva) {
          if (!porDiapositiva.has(diapositiva)) porDiapositiva.set(diapositiva, []);
          const lista = porDiapositiva.get(diapositiva);
          if (!lista.includes(clave)) lista.push(clave);
        }
        return esPresentacion ? n : `<a href="#ref-${escapar(clave)}">${n}</a>`;
      });
      cita.innerHTML = `[${partes.join(', ')}]`;
    });

    // 2. Pie con la referencia corta en cada diapositiva que cita
    porDiapositiva.forEach((claves, diapositiva) => {
      if (diapositiva.hasAttribute('data-sin-pie')) return;
      const pie = document.createElement('footer');
      pie.className = 'pie-referencias';
      pie.innerHTML = claves.map(c => `<span><b>[${numero(c)}]</b> ${escapar(corta(datos[c]))}</span>`).join('');
      diapositiva.append(pie);
    });

    // 3. Bibliografía completa
    const item = clave => {
      const r = datos[clave];
      return `<li id="ref-${escapar(clave)}" data-n="${numero(clave)}">${escapar(r.autores)} (${escapar(r.anio)}). ` +
        `<b>${escapar(r.titulo)}</b>.${r.fuente ? ` <span class="fuente">${escapar(r.fuente)}</span>.` : ''}` +
        `${r.url ? ` <a href="${escapar(r.url)}">${escapar(r.url.replace(/^https?:\/\//, ''))}</a>` : ''}</li>`;
    };
    document.querySelectorAll('[data-referencias]').forEach(destino => {
      const claves = [...orden];
      if (destino.hasAttribute('data-todas')) Object.keys(datos).forEach(c => { if (!claves.includes(c)) { numero(c); claves.push(c); } });
      const porPagina = esPresentacion ? Number(destino.dataset.porPagina) || 6 : Infinity;
      let actual = destino;
      for (let i = 0; i < Math.max(claves.length, 1); i += porPagina) {
        if (i > 0) {
          const copia = destino.cloneNode(true);
          copia.querySelector('.bibliografia')?.remove();
          copia.removeAttribute('id');
          actual.after(copia);
          actual = copia;
        }
        const lista = document.createElement('ol');
        lista.className = 'bibliografia';
        lista.innerHTML = claves.slice(i, i + porPagina).map(item).join('');
        actual.append(lista);
      }
    });
  });
})();
