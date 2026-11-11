# Plantilla HTML

La identidad visual de todas las entregas de Explog: fondo beige, acentos morado, amarillo, verde y azul, y las tipografías Newsreader y JetBrains Mono. Sirve para dos cosas:

- **Divulgación:** páginas continuas, guías de estudio y explicadores (como la [guía de Erdős–Kac](../erdos-kac/)).
- **Presentaciones:** diapositivas 16:9 con notas del orador y exportación a PDF.

Todo es local: fuentes, KaTeX, ECharts y highlight.js viven en `core/`, así que nada depende de internet.

## Contenido

| Carpeta | Qué es |
|---|---|
| `core/` | CSS, JavaScript, fuentes y librerías. Es lo que enlazan todas las páginas. |
| `divulgacion/_base/` | Punto de partida vacío para una página de divulgación. |
| `presentaciones/_base/` | Punto de partida vacío para una presentación. |
| `catalogo/` | Todos los bloques en funcionamiento: `index.html` (presentación) y `divulgacion.html` (divulgación). |
| `herramientas/` | `exportar.py` (un documento → un solo `.html` autocontenido), `jero.mplstyle` (gráficas de matplotlib con los mismos colores) y `empaquetar_skill.py`. |
| `especificacion.md` | Todas las decisiones de diseño y los valores exactos. |

Catálogo en línea: [presentación](https://jerofax.github.io/explog/plantilla/catalogo/) · [divulgación](https://jerofax.github.io/explog/plantilla/catalogo/divulgacion.html).

## Cómo empezar un tema nuevo

1. Crea la carpeta del tema en la raíz del repositorio, por ejemplo `gauss-bonnet-discreto/`.
2. Copia ahí `plantilla/divulgacion/_base/index.html`.
3. Cambia las rutas `../../core/` por `../plantilla/core/`.
4. Para el archivo único autocontenido:

   ```bash
   python plantilla/herramientas/exportar.py gauss-bonnet-discreto -o gauss-bonnet-discreto/Gauss-Bonnet.html
   ```

Las licencias de las fuentes y librerías incluidas están junto a cada una, en `core/fuentes/` y `core/vendor/`.
