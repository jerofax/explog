#!/usr/bin/env python3
"""Genera un único archivo .html autocontenido a partir de una presentación
o una página de divulgación de la plantilla.

Incrusta dentro del HTML todo lo que el documento carga desde la carpeta:
hojas de estilo (con sus @import), fuentes, librerías e imágenes. El archivo
resultante abre igual en cualquier computador, sin conexión y sin la carpeta.

Uso:
    python herramientas/exportar.py presentaciones/mi-charla
    python herramientas/exportar.py catalogo/divulgacion.html
    python herramientas/exportar.py presentaciones/mi-charla -o entrega.html

No necesita instalar nada: solo la biblioteca estándar de Python 3.8 o superior.
"""
import argparse
import base64
import mimetypes
import re
import sys
from pathlib import Path
from urllib.parse import unquote

TIPOS = {
    ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf", ".otf": "font/otf",
    ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
    ".gif": "image/gif", ".webp": "image/webp", ".avif": "image/avif", ".ico": "image/x-icon",
    ".mp4": "video/mp4", ".webm": "video/webm",
}
avisos = []


def es_externa(ruta: str) -> bool:
    """True si la ruta no es un archivo local (web, datos incrustados, ancla)."""
    return ruta.startswith(("http://", "https://", "//", "data:", "#", "mailto:", "blob:", "about:"))


def resolver(ruta: str, base: Path) -> Path:
    limpia = unquote(ruta.split("#")[0].split("?")[0])
    return (base / limpia).resolve()


def a_datos(archivo: Path) -> str:
    """Convierte un archivo en una dirección data: con su contenido en base64."""
    tipo = TIPOS.get(archivo.suffix.lower()) or mimetypes.guess_type(archivo.name)[0] or "application/octet-stream"
    return f"data:{tipo};base64,{base64.b64encode(archivo.read_bytes()).decode('ascii')}"


def incrustar_css(archivo: Path, vistos=None) -> str:
    """Devuelve el CSS de un archivo con sus @import y sus url() ya incrustados."""
    vistos = vistos or set()
    if archivo in vistos:
        return ""
    vistos.add(archivo)
    css = archivo.read_text(encoding="utf-8")
    base = archivo.parent

    def importar(m):
        ruta = m.group(2)
        if es_externa(ruta):
            return m.group(0)
        destino = resolver(ruta, base)
        if not destino.exists():
            avisos.append(f"No se encontró la hoja importada: {destino}")
            return ""
        return f"/* {destino.name} */\n" + incrustar_css(destino, vistos)

    css = re.sub(r"""@import\s+(?:url\()?\s*(['"])(.+?)\1\s*\)?\s*;""", importar, css)

    def recurso(m):
        coma, ruta, formato = m.group(1) or "", m.group(3).strip(), m.group(4) or ""
        if es_externa(ruta):
            return m.group(0)
        destino = resolver(ruta, base)
        if destino.exists():
            return f'{coma}url("{a_datos(destino)}"){formato}'
        if coma:
            # Fuente alternativa que no está en la carpeta (por ejemplo .woff o
            # .ttf de KaTeX cuando solo se guardó .woff2): se quita de la lista.
            return ""
        avisos.append(f"No se encontró el recurso de CSS: {destino}")
        return m.group(0)

    return re.sub(r"""(,\s*)?url\(\s*(['"]?)([^'")]+)\2\s*\)(\s*format\([^)]*\))?""", recurso, css)


def atributo(etiqueta: str, nombre: str):
    m = re.search(rf"""\b{nombre}\s*=\s*(["'])(.*?)\1""", etiqueta, re.S)
    return m.group(2) if m else None


def exportar(origen: Path, salida: Path) -> None:
    html = origen.read_text(encoding="utf-8")
    base = origen.parent

    # Imágenes y otros medios referenciados desde el HTML. Va primero, antes de
    # incrustar las librerías, para no tocar cadenas de texto dentro de su código.
    def medio(m):
        ruta = m.group(3)
        if es_externa(ruta):
            return m.group(0)
        destino = resolver(ruta, base)
        if not destino.exists():
            avisos.append(f"No se encontró el archivo: {destino}")
            return m.group(0)
        return f"{m.group(1)}{m.group(2)}{a_datos(destino)}{m.group(2)}"

    html = re.sub(r"""(<(?:img|source|video|audio|image)\b[^>]*?\s(?:src|href|poster)\s*=\s*)(["'])(.*?)\2""", medio, html, flags=re.S)

    # Hojas de estilo
    def hoja(m):
        etiqueta = m.group(0)
        href = atributo(etiqueta, "href")
        if (atributo(etiqueta, "rel") or "").lower() != "stylesheet" or not href or es_externa(href):
            return etiqueta
        destino = resolver(href, base)
        if not destino.exists():
            avisos.append(f"No se encontró la hoja de estilo: {destino}")
            return etiqueta
        return f"<style>\n{incrustar_css(destino)}\n</style>"

    html = re.sub(r"<link\b[^>]*>", hoja, html)

    # Scripts
    def script(m):
        etiqueta, src = m.group(0), atributo(m.group(1), "src")
        if not src or es_externa(src):
            return etiqueta
        destino = resolver(src, base)
        if not destino.exists():
            avisos.append(f"No se encontró el script: {destino}")
            return etiqueta
        codigo = destino.read_text(encoding="utf-8")
        # Dentro de un <script>, la secuencia </script cerraría la etiqueta antes de tiempo.
        codigo = re.sub(r"</(script)", r"<\\/\1", codigo, flags=re.I)
        resto = re.sub(r"""\s*\bsrc\s*=\s*(["']).*?\1""", "", m.group(1), flags=re.S)
        return f"<script{resto}>/* {destino.name} */\n{codigo}\n</script>"

    html = re.sub(r"<script\b([^>]*)>\s*</script>", script, html, flags=re.S)

    marca = f"<!-- Archivo único generado por herramientas/exportar.py a partir de {origen.name}. No editar: editar el original y volver a exportar. -->\n"
    salida.write_text(marca + html, encoding="utf-8", newline="\n")


def main() -> int:
    for flujo in (sys.stdout, sys.stderr):  # tildes legibles en la consola de Windows
        if hasattr(flujo, "reconfigure"):
            flujo.reconfigure(encoding="utf-8", errors="replace")
    analizador = argparse.ArgumentParser(description="Exporta un documento de la plantilla a un único .html autocontenido.")
    analizador.add_argument("origen", help="carpeta (usa su index.html) o archivo .html")
    analizador.add_argument("-o", "--salida", help="archivo de salida; por defecto, junto al original con el sufijo -unico")
    argumentos = analizador.parse_args()

    origen = Path(argumentos.origen).resolve()
    if origen.is_dir():
        nombre = origen.name
        origen = origen / "index.html"
    else:
        nombre = origen.stem
    if not origen.exists():
        print(f"No existe: {origen}", file=sys.stderr)
        return 1
    salida = Path(argumentos.salida).resolve() if argumentos.salida else origen.parent / f"{nombre}-unico.html"

    exportar(origen, salida)
    for aviso in avisos:
        print("Aviso:", aviso, file=sys.stderr)
    print(f"Listo: {salida}  ({salida.stat().st_size / 1_048_576:.1f} MB)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
