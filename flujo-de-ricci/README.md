# Flujo de Ricci combinatorio

> **Estado:** planeación. **Tema compartido**: el reparto del trabajo todavía no está definido.

## Contexto

El **flujo de Ricci combinatorio** de Chow y Luo (2003) es una versión discreta del flujo de Ricci para superficies trianguladas. Cada vértice tiene un radio, las longitudes de las aristas salen de esos radios, y los radios evolucionan en el tiempo según la curvatura de cada vértice: donde hay más curvatura los radios se ajustan para repartirla. La pregunta clásica es hacia qué métrica converge el flujo.

**Conexión con Gauss-Bonnet discreto:** la curvatura de cada vértice cambia durante el flujo, pero la suma total sigue siendo $2\pi\chi$, porque depende solo de la topología. El flujo **redistribuye** la curvatura, no la crea. Ver [`../gauss-bonnet-discreto/`](../gauss-bonnet-discreto/).

Preguntas y experimentos concretos: [COMPLETAR, cuando se defina el reparto]

## Contribuciones

Este tema se trabaja en grupo. Para que cada aporte se pueda identificar por separado:

- Cada integrante trabaja en **su propia subcarpeta**.
- Los commits de cada parte los hace su autor, con su cuenta.
- Lo que sea común (por ejemplo, una función compartida) se indica aquí con sus autores.

| Parte | Autor | Carpeta | Estado |
|---|---|---|---|
| [COMPLETAR] | Jerónimo Restrepo ([@jerofax](https://github.com/jerofax)) | [`jeronimo/`](jeronimo/) | Planeación |
| [COMPLETAR] | [COMPLETAR: integrantes] | [COMPLETAR] | Por definir |

## Estructura

```text
flujo-de-ricci/
├── README.md        # este archivo
└── jeronimo/        # contribución de Jerónimo Restrepo
    ├── src/
    └── notebooks/
```

## Referencias

- Chow, B. y Luo, F. (2003). *Combinatorial Ricci flows on surfaces*. **Journal of Differential Geometry**, 63(1), 97–129. [doi:10.4310/jdg/1080835659](https://doi.org/10.4310/jdg/1080835659)
