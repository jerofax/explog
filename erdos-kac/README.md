# Teorema de Erdős–Kac

> **Estado:** terminado. La entrega es una guía de divulgación en HTML.

**[Abrir la guía](https://jerofax.github.io/explog/erdos-kac/)** · [descargar el archivo único](Teorema-Erdos-Kac.html) (funciona sin internet)

## La pregunta

Sea $\omega(n)$ el número de factores primos **distintos** de $n$; por ejemplo, $\omega(12) = \omega(2^2 \cdot 3) = 2$.

> **¿Cuántos factores primos distintos tiene un número natural típico, y cómo se reparten esos valores?**

En promedio, $\omega(n)$ crece como $\log\log n$, y el **teorema de Erdős–Kac** (1939–1940) dice algo mucho más fino: al estandarizarla, se distribuye como una normal.

$$
\frac{\omega(n) - \log\log n}{\sqrt{\log\log n}} \;\longrightarrow\; \mathcal{N}(0,1).
$$

Es un teorema central del límite escondido en la aritmética: los números se comportan como si "ser divisible por $p$" fueran eventos casi independientes.

## Qué hay en la guía

1. **¿Cuántos factores primos distintos tiene un número natural?** La función $\omega(n)$ y su historia.
2. **¿Cómo calcular $\omega(n)$ para todo $n \le N$?** Una criba, y su costo.
3. **¿Cuál es la media de $\omega(n)$?** $\log\log N$ más la constante de Meissel–Mertens.
4. **¿Cómo se distribuye $\omega(n)$?** La campana, la varianza, por qué fallan los primos grandes, la estandarización y la velocidad de convergencia.
5. **Erdős y Kac.** El enunciado y su contexto.
6. **¿Para qué sirve esto?** Predecir $\omega$ donde la criba ya no llega.

Los experimentos llegan hasta $N = 10^9$.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | La guía, enlazada a la [plantilla](../plantilla/). Es la que publica GitHub Pages. |
| `Teorema-Erdos-Kac.html` | La misma guía en un solo archivo autocontenido (fuentes, KaTeX y gráficas incrustadas). |
| `fuente.html` | El texto de la guía, con el marcador `__DATOS__` donde van los datos. |
| `datos.json` | Los resultados numéricos que dibujan las gráficas. |
| `generar_datos.py` | Calcula `datos.json` con el mismo código del cuaderno. |
| `construir.py` | Pega `datos.json` en `fuente.html` y exporta el archivo único. |
| `notebooks/Erdos_Kac.ipynb` | El cuaderno de Colab con los experimentos. |

## Cómo reconstruirla

Desde la raíz del repositorio:

```bash
python erdos-kac/generar_datos.py erdos-kac/datos.json   # opcional: recalcula los datos (criba hasta 10^9)
python erdos-kac/construir.py                            # genera index.html y Teorema-Erdos-Kac.html
```

`generar_datos.py` necesita `numpy` y bastante memoria, porque criba hasta $10^9$. Si solo cambias el texto, basta con `construir.py`.

## Referencias

- Aristóteles. *Metafísica*, A.1, 980a21 (trad. W. D. Ross). [classics.mit.edu](http://classics.mit.edu/Aristotle/metaphysics.1.i.html)
- Euclides. *Elementos*, libro VII, proposiciones 30 a 32. [Edición de Joyce](https://mathcs.clarku.edu/~djoyce/java/elements/); [traducción de Heath, vol. 2](https://www.math.mcgill.ca/alapierre/math228/books/%5BHeaII56%5D.pdf)
- C. F. Gauss. *Disquisitiones Arithmeticae* (1801), art. 14–16. [Latín](https://archive.org/details/disquisitionesa00gaus/); [traducción al inglés](https://en.wikisource.org/wiki/Translation:Disquisitiones_Arithmeticae/Second_Section)
- G. H. Hardy y S. Ramanujan. *The normal number of prime factors of a number n*. Quarterly Journal of Mathematics 48 (1917), 76–92. [PDF](https://ramanujan.sirinudi.org/Volumes/published/ram35.pdf)
- P. Turán. *On a theorem of Hardy and Ramanujan*. J. London Math. Soc. 9 (1934), 274–276. [doi:10.1112/jlms/s1-9.4.274](https://doi.org/10.1112/jlms/s1-9.4.274)
- F. Mertens. *Ein Beitrag zur analytischen Zahlentheorie*. J. reine angew. Math. 78 (1874), 46–62. Constante de Meissel–Mertens: [OEIS A077761](https://oeis.org/A077761)
- P. Erdős y M. Kac. *On the Gaussian law of errors in the theory of additive functions*. Proc. Nat. Acad. Sci. USA 25 (1939), 206–207. [PDF](https://users.renyi.hu/~p_erdos/1939-09.pdf)
- P. Erdős y M. Kac. *The Gaussian law of errors in the theory of additive number theoretic functions*. Amer. J. Math. 62 (1940), 738–742. [PDF](https://users.renyi.hu/~p_erdos/1940-12.pdf); [doi:10.2307/2371483](https://doi.org/10.2307/2371483)
- A. Granville y K. Soundararajan. *Sieving and the Erdős–Kac theorem*. En *Equidistribution in Number Theory, An Introduction*, Springer (2007), 15–27. [arXiv:math/0606039](https://arxiv.org/pdf/math/0606039)
- P. Billingsley. *On the central limit theorem for the prime divisor functions*. Amer. Math. Monthly 76 (1969), 132–139. [doi:10.2307/2317259](https://doi.org/10.2307/2317259)
