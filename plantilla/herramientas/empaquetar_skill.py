#!/usr/bin/env python3
"""Copia la versión actual de la plantilla dentro del skill de Claude Code.

El skill vive en skill/plantilla-jero/. Su SKILL.md se escribe a mano; la
carpeta plantilla/ que va al lado se regenera con este script, para que el
skill siempre lleve la misma versión de core/ que este proyecto.

Uso:
    python herramientas/empaquetar_skill.py              regenera skill/plantilla-jero/plantilla
    python herramientas/empaquetar_skill.py --instalar   además lo copia a ~/.claude/skills/plantilla-jero

Volvé a correrlo cada vez que cambies algo en core/, el catálogo o la especificación.
"""
import argparse
import shutil
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SKILL = RAIZ / "skill" / "plantilla-jero"
DESTINO = SKILL / "plantilla"

# Qué entra en el skill. Los exportados (*-unico.html) no: se generan cuando hacen falta.
PIEZAS = [
    "core",
    "presentaciones/_base",
    "divulgacion/_base",
    "catalogo/index.html",
    "catalogo/divulgacion.html",
    "catalogo/img",
    "herramientas/exportar.py",
    "herramientas/jero.mplstyle",
    "especificacion.md",
]
IGNORAR = shutil.ignore_patterns("*-unico.html", "__pycache__", "*.pyc", ".DS_Store")


def copiar(origen: Path, destino: Path) -> None:
    destino.parent.mkdir(parents=True, exist_ok=True)
    if origen.is_dir():
        shutil.copytree(origen, destino, ignore=IGNORAR)
    else:
        shutil.copy2(origen, destino)


def main() -> int:
    for flujo in (sys.stdout, sys.stderr):
        if hasattr(flujo, "reconfigure"):
            flujo.reconfigure(encoding="utf-8", errors="replace")
    analizador = argparse.ArgumentParser(description="Empaqueta la plantilla como skill de Claude Code.")
    analizador.add_argument("--instalar", action="store_true", help="copiar el skill a ~/.claude/skills/plantilla-jero")
    argumentos = analizador.parse_args()

    if not (SKILL / "SKILL.md").exists():
        print(f"Falta {SKILL / 'SKILL.md'}", file=sys.stderr)
        return 1

    # Solo se borra la carpeta generada, nunca el SKILL.md escrito a mano.
    if DESTINO.exists():
        shutil.rmtree(DESTINO)
    for pieza in PIEZAS:
        origen = RAIZ / pieza
        if not origen.exists():
            print(f"Aviso: no existe {pieza}, se omite", file=sys.stderr)
            continue
        copiar(origen, DESTINO / pieza)
    total = sum(f.stat().st_size for f in DESTINO.rglob("*") if f.is_file())
    print(f"Skill listo en {SKILL}  ({total / 1_048_576:.1f} MB)")

    if argumentos.instalar:
        instalado = Path.home() / ".claude" / "skills" / "plantilla-jero"
        if instalado.exists():
            shutil.rmtree(instalado)
        shutil.copytree(SKILL, instalado, ignore=IGNORAR)
        print(f"Instalado en {instalado}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
