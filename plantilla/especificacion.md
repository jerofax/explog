# Especificación de la plantilla HTML

Documento de referencia de la plantilla de presentaciones y páginas de divulgación. Recoge todas las decisiones tomadas y los valores exactos, de modo que puedas replicar o modificar el HTML por tu cuenta.

Estado: plantilla construida y probada en el navegador (escritorio y celular) y en PDF. Lo único pendiente de verificar es el beige en un proyector real (sección 14).

Dónde ver cada cosa funcionando:

- `catalogo/index.html`: todos los bloques en modo presentación, con su franja de uso y notas del orador.
- `catalogo/divulgacion.html`: una guía de ejemplo en modo divulgación.
- `presentaciones/_base/` y `divulgacion/_base/`: puntos de partida vacíos para copiar.

---

## 1. Principios

1. **Dos modos, un mismo sistema visual.** Presentación (diapositivas 16:9) y divulgación (página continua). Comparten colores, tipografías y bloques.
2. **Todo local.** Fuentes y librerías viven en la carpeta; nada depende de internet.
3. **Sobrio con acentos.** Mucho aire; el color aparece en títulos, bloques y datos, no como decoración.
4. **Animaciones a pedido.** Existen todas en la plantilla, pero un documento nuevo no trae ninguna salvo que se pidan.
5. **El PDF es el estado final.** Cada diapositiva se imprime completa, sin animación.
6. **Una sola fuente de verdad.** Los colores y tamaños se definen una vez como variables CSS; cambiar una variable cambia todo.

---

## 2. Modos

| | Presentación | Divulgación |
|---|---|---|
| Atributo | `<html data-modo="presentacion">` | `<html data-modo="divulgacion">` |
| Formato | Diapositivas 16:9 que escalan a la pantalla | Página continua con desplazamiento vertical |
| Navegación | Clic, flechas, pantalla completa | Desplazamiento normal |
| Vista del orador | Sí | No |
| Número de página y barra de progreso | Sí | No |
| Lo dinámico | Transiciones, revelado por pasos, movimiento (a pedido) | Simulaciones e interactivos (a pedido) |
| Uso típico | Exposición por HDMI o pantalla compartida | Guías de estudio, artículos, ayudas de algoritmos |

Al empezar cada encargo se definen dos cosas: el modo, y si lleva animaciones o simulaciones.

**Lectura en celular del modo presentación.** En pantallas angostas (menos de 768 px) y fuera de pantalla completa, las diapositivas se muestran apiladas una debajo de otra, cada una escalada al ancho, para poder leerlas con desplazamiento.

---

## 3. Paleta

### 3.1 Fondos y superficies

| Variable | Valor | Uso |
|---|---|---|
| `--fondo` | `#faf6ee` | Fondo de toda diapositiva y página |
| `--superficie` | `#fffdf8` | Tarjetas, bloques neutros, tablas |
| `--superficie-hundida` | `#f1ecdf` | Fondo de código, variables y teclas |

### 3.2 Texto y líneas

Tomados del portafolio sin cambios.

| Variable | Valor | Uso |
|---|---|---|
| `--tinta` | `#0b1220` | Títulos y texto principal |
| `--tinta-suave` | `#243042` | Texto secundario |
| `--tinta-apagada` | `#4f5d70` | Etiquetas, pies, ejes de gráficos |
| `--tinta-tenue` | `#7a8698` | Numeración, marcas discretas |
| `--linea` | `#0f172a` al 10 % (`#0f172a1a`) | Bordes y divisores |
| `--linea-fuerte` | `#0f172a` al 22 % (`#0f172a38`) | Bordes con énfasis |

### 3.3 Colores de marca

Cada color tiene tres niveles. Regla: **base para rellenos, fuerte para texto, tinte para fondos**. El amarillo y el verde base nunca se usan como texto sobre fondo claro porque no se leen.

| Color | Base | Fuerte | Tinte (base al 12 % sobre el fondo) |
|---|---|---|---|
| Morado | `#8b5cf6` | `#6d28d9` | aprox. `#ede4ef` |
| Verde | `#22c55e` | `#15803d` | aprox. `#e0f0dd` |
| Amarillo | `#eab308` | `#a16207` | aprox. `#f8eed2` |
| Azul | `#3b82f6` | `#1d4ed8` | aprox. `#e3e8ef` |

En CSS el tinte no se escribe a mano; se calcula:

```css
--morado-tinte: color-mix(in srgb, var(--morado) 12%, var(--fondo));
```

Contraste medido (WCAG; 4,5:1 es el mínimo para texto normal, 3:1 para texto grande):

| Color | Fuerte sobre el fondo | Fuerte sobre su tinte | Base sobre el fondo |
|---|---|---|---|
| Morado | 6,6 | 5,7 | 3,9 |
| Verde | 4,7 | 4,2 | 2,1 |
| Amarillo | 4,6 | 4,3 | 1,8 |
| Azul | 6,2 | 5,4 | 3,4 |

| Tinta | Sobre el fondo |
|---|---|
| `--tinta` | 17,4 |
| `--tinta-suave` | 12,4 |
| `--tinta-apagada` | 6,2 |
| `--tinta-tenue` | 3,4 (solo números de página y marcas, nunca texto de lectura) |

Todos los tonos fuertes pasan sobre el fondo. Sobre su propio tinte, el verde y el amarillo quedan apenas por debajo (4,2 y 4,3); eso solo afecta los rótulos chicos de los bloques de ejemplo y observación, que son etiquetas y no texto de lectura. Si se quiere que pasen, la salida es oscurecer esos dos tonos a `#166534` y `#854d0e`.

### 3.4 Color por significado

| Bloque | Color |
|---|---|
| Definición | Azul |
| Teorema, lema, proposición, corolario | Morado |
| Ejemplo | Verde |
| Observación, advertencia | Amarillo |
| Demostración | Neutro (tinta y línea) |

Se puede forzar otro color en un bloque puntual con `data-color="verde"`.

### 3.5 Color en gráficos

- Orden de las series: morado, verde, amarillo, azul.
- Máximo recomendado: cuatro series. Si hay más, resaltar una con color y dejar las demás en `--tinta-tenue`.
- Fondo del gráfico transparente, para que se vea el beige de la diapositiva.
- Ejes y etiquetas en `--tinta-apagada`; cuadrícula en `--linea`.

---

## 4. Tipografía

| Rol | Fuente | Pesos |
|---|---|---|
| Títulos y cuerpo | Newsreader (serif, con cursiva) | 300 a 800 |
| Etiquetas, numeración, código | JetBrains Mono | 400, 500, 600, 800 |
| Matemáticas | Fuentes propias de KaTeX | — |

Ambas tienen licencia abierta (SIL OFL) y se guardan en `core/fuentes/` en formato `.woff2`.

Rasgos heredados del portafolio:

- Títulos con espaciado negativo entre letras (de `-0.02em` a `-0.045em` según el tamaño).
- Etiqueta superior ("eyebrow") en JetBrains Mono, mayúsculas, `letter-spacing: 0.22em`, precedida de una línea corta del color de acento. Ejemplo: `01 — MOTIVACIÓN`.
- Interlineado del cuerpo: 1.6 en divulgación; 1.35 en diapositivas.

---

## 5. Escala de tamaños

### 5.1 Modo presentación

Cada diapositiva es un lienzo fijo de **1920 × 1080 px** que se escala completo con `transform: scale()` hasta caber en la pantalla. Por eso los tamaños se escriben en píxeles del lienzo y se ven proporcionalmente iguales en cualquier pantalla.

| Elemento | Tamaño | Peso |
|---|---|---|
| Título de portada | 120 px | 700 |
| Título de sección | 96 px | 700 |
| Idea destacada | 88 px | 500 |
| Título de diapositiva | 64 px | 700 |
| Subtítulo | 40 px | 400 |
| Cuerpo normal | 36 px | 400 |
| Etiqueta superior (mono) | 22 px | 600 |
| Código | 28 px | 400 |
| Pie, citas, número de página | 20 px | 400 |

Márgenes del lienzo: 96 px a los lados, 80 px arriba y abajo. Rejilla de 12 columnas con 32 px de separación.

### 5.2 Variantes de densidad

Se aplican a cualquier diapositiva con `data-densidad`.

| Valor | Cuerpo | Código | Cuándo |
|---|---|---|---|
| `amplia` | 48 px | 32 px | Poco texto: una idea, pocas líneas |
| `normal` (por defecto) | 36 px | 28 px | Caso general |
| `densa` | 28 px | 24 px | Mucho texto, demostraciones largas, tablas |
| `visual` | — | — | Sin texto: gráfico, diagrama o imagen a sangre |

Límite inferior: nada por debajo de 20 px en el lienzo, porque deja de leerse proyectado.

### 5.3 Modo divulgación

Tamaños fluidos, como en el portafolio.

| Elemento | Tamaño |
|---|---|
| Título principal | `clamp(2.1rem, 6vw, 3.6rem)` |
| Título de sección | `clamp(1.4rem, 3vw, 1.9rem)` |
| Cuerpo | `clamp(1.06rem, 1.5vw, 1.18rem)` |
| Etiqueta superior | `0.72rem` |

Columna de texto de 68 caracteres como máximo; los gráficos e interactivos pueden ocupar más ancho que el texto.

### 5.4 Formas

| Variable | Valor |
|---|---|
| `--radio-s` | 0.5 rem |
| `--radio` | 0.9 rem |
| `--radio-l` | 1.4 rem |
| Borde de bloque | 1 px `--linea`, más una franja izquierda de 4 px del color del bloque |

---

## 6. Catálogo de bloques

Cada bloque tendrá en el catálogo una diapositiva de ejemplo con su explicación de uso.

### 6.1 Estructura

| Bloque | Descripción |
|---|---|
| Portada | Título, subtítulo, autor, fecha, evento |
| Sección | Número y título de sección, a pantalla completa |
| Índice | Lista de secciones, con la actual resaltada |
| Cierre | Agradecimiento, contacto, preguntas |
| Referencias | Bibliografía completa; se reparte sola en varias diapositivas |

### 6.2 Texto

| Bloque | Descripción |
|---|---|
| Título con texto | El caso base |
| Dos columnas | Texto y texto, o texto y visual |
| Lista | Con viñetas o numerada |
| Cita | Texto en cursiva con franja lateral y autor |
| Idea destacada | Una sola frase grande |

### 6.3 Matemáticos

| Bloque | Descripción |
|---|---|
| Definición | Azul, con etiqueta y nombre opcional |
| Teorema | Morado; variantes lema, proposición, corolario; numeración automática |
| Demostración | Neutra, por pasos, con símbolo de cierre al final |
| Ejemplo | Verde |
| Observación | Amarillo |
| Advertencia | Amarillo, con marca de atención |

### 6.4 Técnicos

| Bloque | Descripción |
|---|---|
| Código | Resaltado de sintaxis, numeración opcional, resaltado de líneas |
| Código con explicación | Código a un lado, texto al otro; cada paso resalta sus líneas |
| Código con salida | Código arriba o a la izquierda, resultado al lado |
| Pseudocódigo | Estilo de libro de algoritmos, con palabras clave en negrita |

### 6.5 Datos y visuales

| Bloque | Descripción |
|---|---|
| Gráfico a pantalla completa | Diapositiva de densidad `visual` |
| Gráfico con texto | Gráfico grande y una columna angosta de lectura |
| Tabla | Encabezado en mono, filas con línea fina, celda resaltable |
| Cifra destacada | Un número grande con su etiqueta |
| Comparación | Dos o tres columnas enfrentadas |
| Línea de tiempo | Hitos en horizontal |
| Diagrama | SVG hecho a mano con la paleta |
| Imagen completa | A sangre, con pie opcional superpuesto |
| Imagen con pie | Imagen enmarcada y leyenda |

### 6.6 Interactivos

| Componente | Comportamiento |
|---|---|
| Algoritmo paso a paso | Código, variables y visualización (arreglo, árbol o grafo) avanzan juntos. Controles: paso adelante, paso atrás, reproducir de corrido, pausa, velocidad, reinicio. Entrada: campo para escribir los datos a mano o botón para generarlos al azar. La línea en ejecución se resalta. |
| Explorador con deslizador | Uno o más parámetros; al moverlos cambian el gráfico y los valores de la fórmula. |
| Tarjetas de repaso | Pregunta al frente y respuesta al voltear; avance entre tarjetas. |
| Pregunta de opción múltiple | Respuesta con retroalimentación inmediata y explicación. |
| Pestañas y desplegables | Para organizar guías largas en modo divulgación. |

En el PDF cada interactivo sale en su estado final, o en el que se indique con `data-estado-pdf`.

**Cómo se escribe un algoritmo paso a paso.** En el HTML va un contenedor vacío, y al final del archivo su definición: el código que se muestra y una función generadora que, por cada paso, devuelve la línea activa y el estado. El componente pone los controles, el resaltado, la visualización y la entrada (manual o aleatoria).

```html
<div data-algoritmo="insercion"></div>
```

```js
Interactivos.algoritmo('insercion', {
  lenguaje: 'python',
  entrada: [5, 2, 9, 1, 6, 3],          // valor inicial del campo de entrada
  codigo: `def ordenar(a): ...`,         // lo que se ve, línea por línea
  *pasos(a) {                            // recibe la entrada ya leída
    yield { linea: 1, arreglo: [...a], nota: 'Arreglo de entrada.' };
    // ...
  },
});
```

Campos que puede traer cada estado:

| Campo | Qué hace |
|---|---|
| `linea` | Línea del código que se resalta |
| `variables` | Objeto `{nombre: valor}` que se muestra como fichas |
| `nota` | Explicación del paso; admite fórmulas `\( \)` |
| `arreglo` | Arreglo a dibujar como barras o celdas |
| `activos`, `comparados`, `ordenados` | Índices (o nodos) en morado, amarillo y verde |
| `punteros` | `{i: 3, j: 1}`: etiquetas bajo las celdas |
| `grafo` (o `grafo` en la definición) | `{nodos: [{id, x, y}], aristas: [[a, b]]}`, con x de 0 a 100 e y de 0 a 60 |
| `visitados`, `aristasActivas`, `aristasVisitadas`, `etiquetas` | Estado del grafo |

Opciones de la definición: `leer(texto)` para convertir una entrada propia (por defecto, una lista de números), `aleatoria()` para generar una, `barras: false` para celdas sin altura, `entrada: false` para quitar el campo, y `dibujar(estado, caja)` para una visualización propia.

**Cómo se escribe un explorador con deslizador.**

```js
Interactivos.explorador('onda', {
  parametros: [{ id: 'a', tex: 'A', min: 0, max: 3, paso: 0.1, valor: 1.5 }],
  x: [-6.5, 6.5], y: [-3.2, 3.2],
  curvas: p => [{ f: x => p.a * Math.sin(x), color: 'morado' }],
  puntos: p => [{ x: 0, y: 0, color: 'amarillo', etiqueta: 'origen' }],
  formula: p => `y = ${p.a}\\sin x`,      // LaTeX
  lectura: p => `Amplitud ${p.a}.`,        // texto bajo la fórmula
});
```

Las curvas aceptan `color` (cualquier variable de la paleta sin `--`), `punteada: true` y `ancho`.

---

## 7. Referencias

- Las referencias se escriben **una sola vez**, en una lista dentro del documento, cada una con una clave.
- En el texto se cita con la clave: `<cite data-ref="manservigi2025"></cite>`, que se muestra como `[3]`.
- La numeración es automática, por orden de primera aparición.
- En modo presentación, al pie de la diapositiva aparece la referencia corta (autor y año) de lo citado ahí.
- Al final, el bloque de referencias arma la bibliografía completa y la reparte en las diapositivas que hagan falta.
- En modo divulgación, la cita enlaza a la bibliografía al final de la página.

---

## 8. Animaciones

### 8.1 Regla general

Un documento nuevo arranca con `data-animacion="ninguna"`. Las animaciones se agregan solo cuando se piden.

| Nivel | Qué incluye |
|---|---|
| `ninguna` (por defecto) | Cortes secos. El revelado por pasos sigue disponible, pero los elementos aparecen de golpe. |
| `sutil` | Fundido entre diapositivas y aparición suave de los pasos. |
| `completa` | Todo: transiciones marcadas en secciones, movimiento entre diapositivas, trazos que se dibujan, contadores. |

- Se cambia de nivel con una tecla o desde la dirección: `index.html?animacion=sutil`.
- Si el sistema operativo tiene activada la opción de reducir movimiento, se fuerza `ninguna`.
- En el PDF siempre es `ninguna`.

### 8.2 Revelado por pasos

El revelado por pasos no se considera animación sino ritmo de exposición: se usa donde el contenido se entiende mejor por partes (demostraciones, listas largas), incluso sin efectos.

```html
<li data-paso>Primer punto</li>
<li data-paso>Segundo punto</li>
<li data-paso="3" data-efecto="resaltar">Tercero, con efecto propio</li>
```

Lo ya revelado queda igual; atenuar lo anterior es opcional con `data-atenuar` en la diapositiva.

### 8.3 Efectos disponibles

| Efecto | Atributo | Descripción |
|---|---|---|
| Aparecer | `data-efecto="aparecer"` | Fundido |
| Subir | `data-efecto="subir"` | Fundido con desplazamiento de 16 px hacia arriba. Es el efecto por defecto cuando hay animación. |
| Resaltar | `data-efecto="resaltar"` | Marca una palabra o un término de una fórmula con el color de acento |
| Dibujar | `data-efecto="dibujar"` | Traza una línea de un diagrama SVG |
| Contar | `data-efecto="contar"` | Un número sube hasta su valor |
| Mover | `data-mover-a="x,y"` | El elemento se desplaza dentro de la diapositiva |

### 8.4 Transiciones entre diapositivas

| Transición | Atributo | Uso |
|---|---|---|
| Fundido | `data-transicion="fundido"` | Por defecto cuando hay animación |
| Deslizar | `data-transicion="deslizar"` | Avance horizontal |
| Acercar | `data-transicion="acercar"` | Acercamiento suave; sugerida para secciones |
| Corte | `data-transicion="corte"` | Sin transición |

### 8.5 Movimiento entre diapositivas

Si un elemento aparece en dos diapositivas seguidas con el mismo `data-enlace="nombre"`, viaja y cambia de tamaño de una a otra. Sirve para seguir una fórmula o un nodo a lo largo de una transformación.

Se apoya en la API de transiciones de vista del navegador (Chrome, Edge, Safari). Donde no exista, cae a fundido sin romperse.

### 8.6 Tiempos

| Variable | Valor |
|---|---|
| `--curva` | `cubic-bezier(.22, 1, .36, 1)` (la del portafolio) |
| Transición entre diapositivas | 300 ms |
| Aparición de un paso | 400 ms |
| Movimiento entre diapositivas | 600 ms |
| Escalonado entre elementos simultáneos | 70 ms |

---

## 9. Navegación y extras (modo presentación)

| Acción | Control |
|---|---|
| Avanzar | Clic, flecha derecha, flecha abajo, barra espaciadora, AvPág |
| Retroceder | Flecha izquierda, flecha arriba, RePág |
| Primera y última | Inicio, Fin |
| Pantalla completa | `F` |
| Vista del orador | `O` |
| Ir a una diapositiva | `G`, el número y Enter |
| Cambiar nivel de animación | `A` |
| Mostrar u ocultar barra de progreso | `B` |
| Vista de lectura (todas apiladas) | `L` |
| Ayuda con todas las teclas | `H` o `?` |
| Cerrar un panel | `Esc` |

En pantalla táctil se avanza y retrocede deslizando el dedo. Dentro de un interactivo el clic no avanza la diapositiva.

- **Número de página:** `7 / 24` en JetBrains Mono, esquina inferior derecha, color `--tinta-tenue`. Oculto en portada, secciones y cierre.
- **Barra de progreso:** línea de 3 px en el borde inferior, color de acento.
- **Dirección con posición:** la dirección del archivo guarda la diapositiva actual (`#12`), así al recargar se vuelve al mismo punto.

### 9.1 Vista del orador

Se abre en una ventana aparte y muestra: la diapositiva actual, la siguiente, las notas, la hora y un cronómetro que se puede pausar y reiniciar. Las dos ventanas se mantienen sincronizadas.

Las notas se escriben dentro de cada diapositiva y no se ven en la proyección:

```html
<aside class="notas">Recordar mencionar el caso discreto antes de la fórmula.</aside>
```

Montaje:

- **HDMI con pantalla extendida:** la presentación en pantalla completa en el proyector; la ventana del orador en el portátil.
- **Pantalla compartida con un solo monitor:** compartir solo la ventana de la presentación, no la pantalla entera, y dejar la del orador al lado.

---

## 10. Librerías

| Función | Librería | Motivo |
|---|---|---|
| Matemáticas | KaTeX | Renderiza al instante, pesa poco, fuentes locales |
| Código | highlight.js, con tema propio y envoltorio por líneas | Liviano, mantenido, permite resaltar líneas por pasos |
| Gráficos | ECharts con renderizado SVG | Estética cuidada, tipos variados (incluye grafos y mapas de calor), PDF vectorial |
| Diagramas e interactivos | SVG y JavaScript propios | Control total de la paleta, sin dependencias |

Todas se guardan en `core/vendor/` con su versión fija (lista en `core/vendor/VERSIONES.txt`): KaTeX 0.16.11, highlight.js 11.9.0, ECharts 5.5.1. Las fuentes son Newsreader y JetBrains Mono variables, subconjunto latino.

**Cómo se escribe un gráfico.** En el HTML va un contenedor; al final del archivo, las opciones de ECharts. El tema pone colores, fuentes, ejes y leyenda; solo hay que dar los datos.

```html
<div class="grafico" data-grafico="comparaciones"></div>
```

```js
Plantilla.grafico('comparaciones', {
  legend: {},
  xAxis: { type: 'category', data: ['n = 100', 'n = 200'] },
  yAxis: { type: 'value', name: 'comparaciones' },
  series: [{ name: 'Inserción', type: 'bar', data: [2.5, 10] }],
});
```

Las opciones también pueden ser una función que recibe `{ colores }` y devuelve el objeto, útil cuando los datos se calculan.

**Figuras de Python.** El archivo `herramientas/jero.mplstyle` da a matplotlib el mismo fondo, los mismos colores en el mismo orden y la misma tipografía. Las figuras se guardan en SVG para que escalen sin perder nitidez.

```python
import matplotlib.pyplot as plt
plt.style.use("herramientas/jero.mplstyle")
```

---

## 11. Estructura de carpeta

```
plantilla HTML/
├── especificacion.md
├── core/
│   ├── css/
│   │   ├── plantilla.css       punto de entrada: importa todos los demás en orden
│   │   ├── tokens.css          variables: colores, fuentes, formas, tiempos
│   │   ├── base.css            tipografía y elementos comunes
│   │   ├── bloques.css         catálogo de bloques y tema de resaltado de código
│   │   ├── interactivos.css    algoritmo, explorador, tarjetas, pregunta, pestañas
│   │   ├── presentacion.css    lienzo 16:9, escalado, vistas, orador
│   │   ├── divulgacion.css     página continua
│   │   ├── animaciones.css     efectos y transiciones
│   │   └── impresion.css       reglas de PDF
│   ├── js/
│   │   ├── referencias.js      citas y bibliografía
│   │   ├── contenido.js        rótulos de bloques, KaTeX, highlight.js, tema de ECharts
│   │   ├── interactivos.js     los cinco componentes interactivos
│   │   ├── presentacion.js     navegación, pasos, vistas, niveles de animación, impresión
│   │   └── orador.js           vista del orador
│   ├── fuentes/                Newsreader y JetBrains Mono en .woff2, con sus licencias
│   └── vendor/                 KaTeX, highlight.js, ECharts y VERSIONES.txt
├── catalogo/
│   ├── index.html              catálogo en modo presentación
│   └── divulgacion.html        catálogo en modo divulgación
├── presentaciones/
│   ├── _base/index.html        punto de partida vacío
│   └── nombre-de-la-charla/
│       ├── index.html
│       └── img/
├── divulgacion/
│   ├── _base/index.html
│   └── nombre-de-la-guia/
└── herramientas/
    ├── exportar.py             genera el .html único autocontenido
    └── jero.mplstyle           estilo de matplotlib
```

Una corrección en `core/` mejora todas las presentaciones a la vez. Para congelar una versión, se exporta al archivo único.

---

## 12. Exportación

### 12.1 Archivo único para compartir

```bash
python herramientas/exportar.py presentaciones/nombre-de-la-charla
```

Genera un solo `.html` con fuentes, estilos, librerías e imágenes incrustados. Abre igual en cualquier computador, sin conexión y sin la carpeta. Tamaño estimado: 2 a 4 MB más las imágenes.

### 12.2 PDF

Desde Chrome o Edge: Ctrl+P, destino "Guardar como PDF", márgenes "Ninguno", con "Gráficos de fondo" activado.

También se puede ver en pantalla cómo va a salir, agregando `?imprimir` a la dirección (`index.html?imprimir`).

Reglas de `impresion.css`:

- Una diapositiva por página, a 1920 × 1080.
- Todos los pasos visibles: cada diapositiva sale en su estado final.
- Sin animaciones ni transiciones.
- Sin controles, barra de progreso ni notas.
- Los interactivos salen en su estado final o en el indicado con `data-estado-pdf`.
- Las tarjetas salen con las dos caras lado a lado; las pestañas, todas una debajo de otra; los desplegables, abiertos; las preguntas, con la respuesta marcada.
- En modo divulgación, el PDF sale en páginas tamaño carta o A4 con el texto corrido.

### 12.3 Figuras de Python

Ver sección 10: estilo `herramientas/jero.mplstyle`, guardar en SVG dentro de la carpeta `img/` del documento.

---

## 13. Anatomía de una diapositiva

```html
<section class="diapositiva" data-densidad="normal">
  <p class="etiqueta">02 — Resultado principal</p>
  <h2>Curvatura total de una superficie cerrada</h2>

  <div class="bloque bloque--teorema" data-nombre="Gauss-Bonnet">
    <p>Sea \(M\) una superficie compacta orientable sin borde. Entonces</p>
    <p>\[ \int_M K \, dA = 2\pi \, \chi(M). \]</p>
  </div>

  <p data-paso>La suma de la curvatura no depende de la forma, solo de la topología
     <cite data-ref="docarmo1976"></cite>.</p>

  <aside class="notas">Conectar con el flujo de Ricci de la sección siguiente.</aside>
</section>
```

Qué define cada parte:

- `class="diapositiva"`: una página del lienzo 16:9.
- `data-densidad`: escala de texto (sección 5.2).
- `class="etiqueta"`: la línea superior en mono.
- `class="bloque bloque--teorema"`: tipo de bloque, que fija color y rótulo.
- `data-paso`: aparece con un clic.
- `<cite data-ref>`: cita numerada con pie automático.
- `<aside class="notas">`: solo visible en la vista del orador.

---

## 14. Decisiones registradas

| Tema | Decisión |
|---|---|
| Carga de recursos | Todo local, más exportación a archivo único |
| Temas | Uno solo, claro; sin variante oscura |
| Tono | Sobrio con acentos |
| Fondo | Beige `#faf6ee` |
| Tipografía | Newsreader en títulos y cuerpo; JetBrains Mono en etiquetas y código |
| Color en texto | Tres niveles por color: base, fuerte, tinte |
| Color de bloques | Fijo por significado |
| Matemáticas | KaTeX |
| Código | highlight.js con resaltado por líneas |
| Gráficos | ECharts en SVG; estilo de matplotlib incluido |
| Carpeta | Núcleo compartido |
| Catálogo | Completo, con los cinco interactivos |
| Extras | Vista del orador, número de página, barra de progreso; solo en modo presentación |
| Modos | Presentación y divulgación (página continua) |
| Animaciones | A pedido; por defecto ninguna, con revelado por pasos donde el contenido lo pida |
| Referencias | Citas numeradas, pie por diapositiva, bibliografía automática |

**Pendiente de verificar en una sala real:** que el beige `#faf6ee` no se lave a blanco en el proyector. El catálogo incluirá una diapositiva de prueba; si hace falta, se cambia solo la variable `--fondo`.

---

## 15. Skill de Claude Code

La plantilla también existe como skill, para que Claude la use sola cuando pidas una presentación, una guía de estudio o un artefacto interactivo, en cualquier proyecto.

### 15.1 Estructura

```
skill/plantilla-jero/
├── SKILL.md        cuándo usarla, preguntas iniciales, flujo PDF → HTML, reglas, verificación
└── plantilla/      copia generada de core/, _base, catálogo, herramientas y esta especificación
```

`SKILL.md` se escribe a mano. La carpeta `plantilla/` no se edita: se regenera desde el proyecto.

### 15.2 Instalar o actualizar

```bash
python herramientas/empaquetar_skill.py --instalar
```

Regenera `skill/plantilla-jero/plantilla/` con la versión actual y copia el skill a `~/.claude/skills/plantilla-jero/`, donde Claude Code lo encuentra en cualquier proyecto. Sin `--instalar` solo regenera la copia del proyecto. Hay que volver a correrlo cada vez que cambies `core/`, el catálogo o esta especificación.

Para tenerlo solo en un proyecto en lugar de en todos, copiá `skill/plantilla-jero/` a `.claude/skills/plantilla-jero/` dentro de ese proyecto.

### 15.3 Cómo usarlo

No hace falta nombrarlo: alcanza con pedir, por ejemplo, "armame una presentación a partir de este PDF" adjuntando el PDF, o "haceme una guía interactiva de Dijkstra". También se invoca a mano con `/plantilla-jero`.

Lo que hace Claude con el skill:

1. Pregunta el modo (presentación o divulgación) y si lleva animaciones o simulaciones, si no está claro.
2. Lee el PDF y propone un esquema de diapositivas antes de escribir.
3. Copia la plantilla al directorio de trabajo si no está, y crea el documento a partir de `_base`.
4. Lo prueba en el navegador, en versión PDF y, en divulgación, a ancho de celular.
5. Lo exporta a archivo único si se va a compartir o publicar como artefacto.
