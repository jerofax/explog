# Gauss-Bonnet discreto

> **Estado:** planeación. Sin código ni resultados todavía.

## La idea

En una superficie triangulada, la curvatura vive en los vértices. El **defecto angular** de un vértice $v$ mide cuánto le falta (o le sobra) a la suma de ángulos alrededor de $v$ para ser plana:

$$
\delta(v) = 2\pi - \sum_{\text{ángulos en } v} \theta .
$$

En una superficie cerrada, el teorema de Gauss-Bonnet discreto dice que

$$
\sum_{v} \delta(v) = 2\pi\,\chi ,
$$

con $\chi = V - E + F$ la característica de Euler. Para una esfera ($\chi = 2$) la suma es $4\pi$; para un toro ($\chi = 0$) es $0$.

## Preguntas

1. Si $A(v)$ es un área asociada al vértice, **¿$\delta(v)/A(v)$ aproxima la curvatura de Gauss** de la superficie suave al refinar la malla?
2. **¿Depende de si la malla es regular o aleatoria?**
3. En un toro, **¿dónde se concentra la curvatura negativa?**

Por definir: qué área $A(v)$ usar (por ejemplo, un tercio del área de los triángulos vecinos) y cómo medir el error de aproximación. [COMPLETAR]

## Experimentos previstos

| Experimento | Superficie | Qué se mide |
|---|---|---|
| Control | Tetraedro y cubo | Que $\sum \delta = 4\pi$ dé exacto (verifica el código) |
| Esfera regular | Icosfera, refinando | $\delta/A$ contra la curvatura de Gauss conocida |
| Esfera aleatoria | Envolvente convexa de puntos aleatorios sobre la esfera | Lo mismo, con una malla irregular |
| Toro | Toro de revolución triangulado | Dónde caen los defectos negativos; que la suma total dé 0 |

## Estructura

```text
gauss-bonnet-discreto/
├── src/         # construcción de mallas y cálculo de defectos
└── notebooks/   # experimentos y figuras
```

## Referencias

- [COMPLETAR]
- Conexión con el flujo de Ricci: ver [`../flujo-de-ricci/`](../flujo-de-ricci/).
