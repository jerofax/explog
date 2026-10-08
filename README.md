<p align="center">
  <img src="assets/banner.svg" alt="Una malla triangulada en la que la curvatura empieza concentrada en unos pocos vértices y se redistribuye sin que cambie la suma total" width="100%">
</p>

<h1 align="center">Explog</h1>
<p align="center"><em>Matemáticas experimentales: hacer preguntas, programar el experimento y mirar qué pasa.</em></p>

<p align="center">
  <img src="https://img.shields.io/badge/estado-planeaci%C3%B3n-8c959f" alt="Estado: planeación">
  <img src="https://img.shields.io/badge/python-numpy%20%C2%B7%20scipy%20%C2%B7%20matplotlib-1f2328" alt="Python: numpy, scipy, matplotlib">
  <img src="https://img.shields.io/badge/licencia-MIT-1f2328" alt="Licencia MIT">
</p>

Este repositorio reúne lo que hago en el curso de posgrado de **Matemáticas Experimentales**. La idea de fondo es la de la disciplina: usar la computadora como laboratorio, plantear una pregunta concreta, diseñar el experimento que la ataca y dejar que los datos sugieran (o tumben) conjeturas.

Hay una carpeta por tema. Los dos últimos están conectados: el teorema de Gauss-Bonnet discreto es el invariante que el flujo de Ricci combinatorio conserva mientras redistribuye la curvatura.

---

## Estado

> **Planeación.** Las exposiciones y el proyecto final están por definirse con el profesor; no hay fechas ni rúbrica escrita todavía. Ningún tema tiene resultados aún.

| Tema | Carpeta | Pregunta central | Estado |
|---|---|---|---|
| Juegos espaciales | [`juegos-espaciales/`](juegos-espaciales/) | ¿Para qué valores de *b* sobrevive la cooperación y cuándo es caótica la dinámica? | Planeación |
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
├── juegos-espaciales/
│   ├── README.md          # pregunta, modelo, experimentos previstos
│   ├── src/
│   └── notebooks/
├── gauss-bonnet-discreto/
│   ├── README.md
│   ├── src/
│   └── notebooks/
├── flujo-de-ricci/
│   ├── README.md          # tema compartido, con sección de Contribuciones
│   └── jeronimo/          # mi parte, separada e identificable
│       ├── src/
│       └── notebooks/
├── assets/banner.svg
├── requirements.txt
└── LICENSE
```

## Cómo usarlo

Todavía no hay código ejecutable. Cuando lo haya:

```bash
git clone https://github.com/jerofax/explog.git
cd explog
python -m venv .venv
source .venv/bin/activate   # en Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Cada carpeta tendrá sus notebooks, que se pueden abrir con Jupyter o directamente en Google Colab.

## Referencias

- Nowak, M. A. y May, R. M. (1992). *Evolutionary games and spatial chaos*. **Nature**, 359, 826–829. [doi:10.1038/359826a0](https://doi.org/10.1038/359826a0)
- Szabó, G. y Fáth, G. (2007). *Evolutionary games on graphs*. **Physics Reports**, 446(4–6), 97–216. [arXiv:cond-mat/0607344](https://arxiv.org/abs/cond-mat/0607344)
- Chow, B. y Luo, F. (2003). *Combinatorial Ricci flows on surfaces*. **Journal of Differential Geometry**, 63(1), 97–129. [doi:10.4310/jdg/1080835659](https://doi.org/10.4310/jdg/1080835659)
- [COMPLETAR: referencia(s) para Gauss-Bonnet discreto]

Cada carpeta tiene sus referencias específicas.

## Licencia

[MIT](LICENSE). En `flujo-de-ricci/`, la autoría de cada parte se indica en su README.

---

<p align="center">Hecho por <a href="https://github.com/jerofax">Jerónimo Restrepo</a> · <a href="https://jerofax.github.io">jerofax.github.io</a></p>
