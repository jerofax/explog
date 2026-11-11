<p align="center">
  <img src="assets/banner.svg" alt="Una malla triangulada en la que la curvatura empieza concentrada en unos pocos vértices y se redistribuye sin que cambie la suma total" width="100%">
</p>

<h1 align="center">Explog</h1>
<p align="center"><em>Matemáticas experimentales: hacer preguntas, programar el experimento y mirar qué pasa.</em></p>

<p align="center">
  <img src="https://img.shields.io/badge/estado-en%20curso-8b5cf6" alt="Estado: en curso">
  <a href="https://jerofax.github.io/explog/"><img src="https://img.shields.io/badge/p%C3%A1gina-jerofax.github.io%2Fexplog-22c55e" alt="Página: jerofax.github.io/explog"></a>
  <img src="https://img.shields.io/badge/python-numpy%20%C2%B7%20scipy%20%C2%B7%20matplotlib-1f2328" alt="Python: numpy, scipy, matplotlib">
  <img src="https://img.shields.io/badge/licencia-MIT-1f2328" alt="Licencia MIT">
</p>

Este repositorio reúne lo que hago en el curso de posgrado de **Matemáticas Experimentales**. La idea de fondo es la de la disciplina: usar la computadora como laboratorio, plantear una pregunta concreta, diseñar el experimento que la ataca y dejar que los datos sugieran (o tumben) conjeturas.

Hay una carpeta por tema. Cada entrega es una **página de divulgación en HTML**, hecha con una [plantilla](plantilla/) común, y se puede leer en línea en **[jerofax.github.io/explog](https://jerofax.github.io/explog/)**. Los dos últimos temas están conectados: el teorema de Gauss-Bonnet discreto es el invariante que el flujo de Ricci combinatorio conserva mientras redistribuye la curvatura.

---

## Estado

> **En curso.** La primera entrega, el teorema de Erdős–Kac, está terminada. Gauss-Bonnet discreto y flujo de Ricci siguen en planeación.

| Tema | Carpeta | Pregunta central | Estado |
|---|---|---|---|
| Teorema de Erdős–Kac | [`erdos-kac/`](erdos-kac/) · [guía](https://jerofax.github.io/explog/erdos-kac/) | ¿Cuántos factores primos distintos tiene un número típico, y cómo se distribuye esa cantidad? | Terminado |
| Gauss-Bonnet discreto | [`gauss-bonnet-discreto/`](gauss-bonnet-discreto/) | ¿El defecto angular por unidad de área aproxima la curvatura de Gauss al refinar la malla? | Planeación |
| Flujo de Ricci | [`flujo-de-ricci/`](flujo-de-ricci/) | Flujo de Ricci combinatorio sobre superficies trianguladas | Planeación, tema compartido |

## El hilo conductor

En una superficie triangulada cerrada, el **defecto angular** de un vértice es

$$
\delta(v) = 2\pi - \sum_{\text{ángulos en } v} \theta ,
$$

y la versión discreta del teorema de **Gauss-Bonnet** dice que

$$
\sum_{v} \delta(v) = 2\pi\,\chi ,
$$

donde $\chi$ es la característica de Euler. Ese total depende solo de la topología. El **flujo de Ricci combinatorio** cambia la geometría de la malla, y con ella la curvatura de cada vértice, pero no puede cambiar la suma: la curvatura se *mueve*, no se crea ni se destruye. Es lo que intenta mostrar el banner.

## Estructura del repositorio

```text
explog/
├── erdos-kac/
│   ├── README.md          # pregunta, archivos y cómo reconstruir la guía
│   ├── index.html         # la guía (la publica GitHub Pages)
│   ├── Teorema-Erdos-Kac.html   # la misma guía en un solo archivo
│   ├── fuente.html, datos.json, generar_datos.py, construir.py
│   └── notebooks/Erdos_Kac.ipynb
├── gauss-bonnet-discreto/
│   ├── README.md
│   ├── src/
│   └── notebooks/
├── flujo-de-ricci/
│   ├── README.md          # tema compartido, con sección de Contribuciones
│   └── jeronimo/          # mi parte, separada e identificable
│       ├── src/
│       └── notebooks/
├── plantilla/             # identidad visual común: core/, bases, catálogo, herramientas
├── index.html             # portada de jerofax.github.io/explog
├── assets/banner.svg
├── requirements.txt
└── LICENSE
```

## Cómo usarlo

Para **leer** las entregas no hace falta instalar nada: están en [jerofax.github.io/explog](https://jerofax.github.io/explog/), y cada tema trae además un `.html` único que se abre sin internet.

Para **correr** los experimentos:

```bash
git clone https://github.com/jerofax/explog.git
cd explog
python -m venv .venv
source .venv/bin/activate   # en Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Cada carpeta tiene sus notebooks, que se pueden abrir con Jupyter o directamente en Google Colab. Para reconstruir una guía, mira el README de su carpeta.

## Referencias

- Erdős, P. y Kac, M. (1940). *The Gaussian law of errors in the theory of additive number theoretic functions*. **American Journal of Mathematics**, 62, 738–742. [doi:10.2307/2371483](https://doi.org/10.2307/2371483)
- Granville, A. y Soundararajan, K. (2007). *Sieving and the Erdős–Kac theorem*. En *Equidistribution in Number Theory, An Introduction*, Springer, 15–27. [arXiv:math/0606039](https://arxiv.org/abs/math/0606039)
- Chow, B. y Luo, F. (2003). *Combinatorial Ricci flows on surfaces*. **Journal of Differential Geometry**, 63(1), 97–129. [doi:10.4310/jdg/1080835659](https://doi.org/10.4310/jdg/1080835659)
- [COMPLETAR: referencia(s) para Gauss-Bonnet discreto]

Cada carpeta tiene sus referencias específicas.

## Licencia

[MIT](LICENSE). En `flujo-de-ricci/`, la autoría de cada parte se indica en su README.

---

<p align="center">Hecho por <a href="https://github.com/jerofax">Jerónimo Restrepo</a> · <a href="https://jerofax.github.io">jerofax.github.io</a></p>
