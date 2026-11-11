"""Arma index.html pegando datos.json en fuente.html y exporta el archivo único.

Uso (desde la raíz del repositorio):
    python erdos-kac/construir.py
"""
import json
import subprocess
import sys
from pathlib import Path

aqui = Path(__file__).resolve().parent
raiz = aqui.parent
datos = json.loads((aqui / "datos.json").read_text(encoding="utf-8"))
html = (aqui / "fuente.html").read_text(encoding="utf-8")
html = html.replace("__DATOS__", json.dumps(datos, separators=(",", ":")))
(aqui / "index.html").write_text(html, encoding="utf-8", newline="\n")

destino = aqui / "Teorema-Erdos-Kac.html"
exportar = raiz / "plantilla" / "herramientas" / "exportar.py"
subprocess.run([sys.executable, str(exportar), str(aqui), "-o", str(destino)], check=True)
