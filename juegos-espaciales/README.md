# Juegos espaciales

> **Estado:** planeación. Sin código ni resultados todavía.

## La pregunta

En el modelo de **Nowak y May (1992)**, jugadores fijos en una grilla juegan el **dilema del prisionero** con sus vecinos. Cada uno es cooperador o desertor, y la ventaja de traicionar se mide con un solo parámetro, $b > 1$.

> **¿Para qué valores de $b$ sobrevive la cooperación, y cuándo se vuelve caótica la dinámica?**

## El modelo

En la versión de Nowak y May:

- Cada celda de una grilla cuadrada tiene un jugador, cooperador (C) o desertor (D).
- En cada ronda, cada jugador juega con sus vecinos (y consigo mismo) con pagos simplificados: dos cooperadores reciben 1, un desertor que juega contra un cooperador recibe $b$, y el resto de los casos paga 0.
- Después, todos a la vez adoptan la estrategia del vecino con mayor puntaje, contándose a sí mismos.

No hay memoria ni aleatoriedad en la regla de actualización: todo lo interesante sale de la geometría de la grilla.

## Experimentos previstos

1. **Barrido de $b$:** desde condiciones iniciales aleatorias, medir la **densidad de cooperadores en estado estacionario** en función de $b$.
2. **Un desertor en el centro:** partir de una grilla de cooperadores con un solo desertor en el centro y observar los patrones que se forman para distintos $b$.
3. **Sensibilidad a condiciones iniciales:** correr dos simulaciones que difieren en **un solo sitio** y seguir la **distancia de Hamming** entre ellas a lo largo del tiempo, como indicador de caos.

Parámetros por fijar: tamaño de la grilla, condiciones de frontera, vecindario (Moore o von Neumann), número de pasos y criterio de estado estacionario. [COMPLETAR]

## Estructura

```text
juegos-espaciales/
├── src/         # simulación de la grilla
└── notebooks/   # experimentos y figuras
```

## Referencias

- Nowak, M. A. y May, R. M. (1992). *Evolutionary games and spatial chaos*. **Nature**, 359, 826–829. [doi:10.1038/359826a0](https://doi.org/10.1038/359826a0)
- Szabó, G. y Fáth, G. (2007). *Evolutionary games on graphs*. **Physics Reports**, 446, 97–216, sección 6.5. [arXiv:cond-mat/0607344](https://arxiv.org/abs/cond-mat/0607344)
