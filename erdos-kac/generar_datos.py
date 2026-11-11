# Genera los datos de la guía con el mismo código del cuaderno Erdos_Kac.ipynb
import math, random, time, json, sys
import numpy as np

M = 0.2614972128476428
NMAX = 10**9

def primos_hasta(N):
    es_primo = np.ones(N + 1, dtype=bool)
    es_primo[:2] = False
    for p in range(2, math.isqrt(N) + 1):
        if es_primo[p]:
            es_primo[p*p::p] = False
    return np.flatnonzero(es_primo)

def criba_omega(N, primos=None):
    if primos is None:
        primos = primos_hasta(N)
    w = np.zeros(N + 1, dtype=np.uint8)
    T = max(math.isqrt(N), N // 10_000)
    for p in primos[primos <= T]:
        w[p::p] += 1
    grandes = primos[primos > T]
    for j in range(1, N // T + 1):
        m = np.searchsorted(grandes, N // j, side='right')
        if m == 0:
            break
        w[grandes[:m] * j] += 1
    return w

t0 = time.perf_counter()
primos = primos_hasta(NMAX)
print('primos', len(primos), time.perf_counter() - t0, flush=True)

# --- S(N) = sum 1/p, rejilla de 10^1 a 10^9 (8 puntos por década) ---
xsS = np.unique(np.round(np.logspace(1, 9, 8 * 8 + 1)).astype(np.int64))
lim = np.searchsorted(primos, xsS, side='right')
S1s, S2s = [], []
s1 = s2 = 0.0; a = 0
for b in lim:
    q = 1.0 / primos[a:b]
    s1 += q.sum(); s2 += (q * q).sum()
    S1s.append(s1); S2s.append(s2); a = b

t0 = time.perf_counter()
w = criba_omega(NMAX, primos)
print('criba', time.perf_counter() - t0, 'max', int(w.max()), flush=True)
del primos

# --- distribución, como en el cuaderno (rejilla de 10^2 a 10^9) ---
xs = np.unique(np.round(np.logspace(2, 9, 8 * 7 + 1)).astype(np.int64))
K = int(w.max()) + 1
k = np.arange(K)
conteo = np.zeros((len(xs), K), dtype=np.int64)
acum, a = np.zeros(K, dtype=np.int64), 1
for i, x in enumerate(xs):
    acum += np.bincount(w[a:x + 1], minlength=K)
    conteo[i], a = acum, x + 1
pmf = conteo / xs[:, None]
media = pmf @ k
varianza = pmf @ k**2 - media**2
lam = np.log(np.log(xs))

Phi = np.vectorize(lambda z: 0.5 * (1 + math.erf(z / math.sqrt(2))))
D = np.empty(len(xs))
for i in range(len(xs)):
    z = (k - lam[i]) / math.sqrt(lam[i])
    F = np.cumsum(pmf[i]); F_antes = F - pmf[i]
    D[i] = max(np.abs(F - Phi(z)).max(), np.abs(F_antes - Phi(z)).max())

i6 = list(xs).index(10**6)
c_var6 = varianza[i6] - lam[i6]
print('x=1e6 media', media[i6], 'var', varianza[i6], 'c', c_var6, flush=True)

# --- 64 bits (mismo código y semilla del cuaderno) ---
def es_primo(n):
    if n < 2:
        return False
    for p in (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37):
        if n % p == 0:
            return n == p
    d, s = n - 1, 0
    while d % 2 == 0:
        d //= 2; s += 1
    for a in (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37):
        x = pow(a, d, n)
        if x in (1, n - 1):
            continue
        for _ in range(s - 1):
            x = x * x % n
            if x == n - 1:
                break
        else:
            return False
    return True

def un_factor(n):
    if n % 2 == 0:
        return 2
    while True:
        y, c, m = random.randrange(1, n), random.randrange(1, n), 128
        g = r = q = 1
        while g == 1:
            x = y
            for _ in range(r):
                y = (y * y + c) % n
            j = 0
            while j < r and g == 1:
                ys = y
                for _ in range(min(m, r - j)):
                    y = (y * y + c) % n
                    q = q * abs(x - y) % n
                g = math.gcd(q, n); j += m
            r *= 2
        if g == n:
            g = 1
            while g == 1:
                ys = (ys * ys + c) % n
                g = math.gcd(abs(x - ys), n)
        if g != n:
            return g

def primos_distintos(n):
    ps = set()
    for p in (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47):
        while n % p == 0:
            ps.add(p); n //= p
    pila = [n] if n > 1 else []
    while pila:
        m = pila.pop()
        if m == 1:
            continue
        if es_primo(m):
            ps.add(m)
        else:
            d = un_factor(m); pila += [d, m // d]
    return ps

CUANTOS = 3000   # la tabla y la figura del cuaderno salen de esta corrida
random.seed(2026)
w64 = np.array([len(primos_distintos(random.randrange(2**63, 2**64))) for _ in range(CUANTOS)])
L = math.log(math.log(2**64))
print('64b media', w64.mean(), 'var', w64.var(), 'pred', L + M, L + c_var6, flush=True)

out = dict(
    M=M,
    S=dict(x=xsS.tolist(), S1=S1s, S2=S2s),
    xs=xs.tolist(), K=K, conteo=conteo.tolist(),
    media=media.tolist(), varianza=varianza.tolist(), D=D.tolist(),
    c_var6=c_var6,
    w64=dict(n=CUANTOS, conteo=np.bincount(w64, minlength=12).tolist(),
             media=float(w64.mean()), var=float(w64.var()), L=L,
             pred_media=L + M, pred_var=L + c_var6),
)
json.dump(out, open(sys.argv[1], 'w'), separators=(',', ':'))
print('listo', flush=True)
