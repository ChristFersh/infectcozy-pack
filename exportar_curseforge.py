"""Crea los zips completos para importar Infect Cozy en la app de CurseForge, a partir de packs/.

Uso:  python exportar_curseforge.py                 las 5 versiones en ../exportar-<versión>/
      python exportar_curseforge.py --solo lite     solo una versión
      python exportar_curseforge.py --salida RUTA   otra carpeta de salida

Cada zip lleva el formato de modpack de CurseForge:
- manifest.json con los mods, resource packs y shaders de CurseForge (la app los descarga sola,
  también los que bloquean la descarga fuera de ella);
- overrides/ con todo lo demás, tal cual lo recibe Prism: configs, ajustes de la versión y los
  archivos que no son de CurseForge (los de Modrinth se bajan y se comprueba su hash).

No se publican: se generan para compartirlos a mano (Drive, Discord...).
"""

import argparse
import hashlib
import html
import json
import sys
import tomllib
import urllib.request
import zipfile
from pathlib import Path

AQUI = Path(__file__).resolve().parent


def leer_toml(ruta):
    with open(ruta, "rb") as f:
        return tomllib.load(f)


def bajar(url, destino, formato, esperado):
    """Descarga url a destino (si no está ya) y comprueba el hash del .pw.toml."""
    if not destino.exists():
        destino.parent.mkdir(parents=True, exist_ok=True)
        tmp = destino.with_suffix(destino.suffix + ".part")
        pet = urllib.request.Request(url, headers={"User-Agent": "infectcozy-exportar"})
        for intento in range(4):
            try:
                with urllib.request.urlopen(pet, timeout=120) as r, open(tmp, "wb") as f:
                    while trozo := r.read(1 << 20):
                        f.write(trozo)
                break
            except OSError:
                if intento == 3:
                    raise
        tmp.replace(destino)
    if hashlib.new(formato, destino.read_bytes()).hexdigest() != esperado:
        destino.unlink()
        sys.exit(f"El hash de {destino.name} no coincide con su .pw.toml ({url})")
    return destino


def exportar(v, cfg, salida, cache):
    carpeta = AQUI / "packs" / v["id"]
    pack = leer_toml(carpeta / "pack.toml")
    indice = leer_toml(carpeta / pack["index"]["file"])
    mc = pack["versions"]["minecraft"]
    loader, version_loader = next((k, val) for k, val in pack["versions"].items() if k != "minecraft")

    archivos_cf, en_overrides, copiados = [], [], []
    for entrada in indice["files"]:
        ruta = entrada["file"]
        if not entrada.get("metafile"):
            copiados.append(ruta)
            continue
        meta = leer_toml(carpeta / ruta)
        if meta.get("side") == "server":
            continue
        cf = meta.get("update", {}).get("curseforge")
        if cf:
            archivos_cf.append({"projectID": cf["project-id"], "fileID": cf["file-id"], "required": True,
                                "_nombre": meta["name"]})
            continue
        d = meta["download"]
        jar = bajar(d["url"], cache / meta["filename"], d["hash-format"], d["hash"])
        en_overrides.append((str(Path(ruta).parent / meta["filename"]), jar))

    manifest = {
        "minecraft": {"version": mc, "modLoaders": [{"id": f"{loader}-{version_loader}", "primary": True}]},
        "manifestType": "minecraftModpack",
        "manifestVersion": 1,
        "name": f"{cfg['nombre']} {v['nombre']}",
        "version": cfg["version"],
        "author": cfg.get("autor", ""),
        "files": [{k: val for k, val in f.items() if not k.startswith("_")} for f in archivos_cf],
        "overrides": "overrides",
    }
    lista = "".join(
        f'<li><a href="https://www.curseforge.com/projects/{f["projectID"]}">{html.escape(f["_nombre"])}</a></li>\n'
        for f in sorted(archivos_cf, key=lambda f: f["_nombre"].lower())
    )

    salida.mkdir(parents=True, exist_ok=True)
    destino = salida / f"{cfg['nombre']} {v['nombre']} {cfg['version']}.zip"
    with zipfile.ZipFile(destino, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        z.writestr("manifest.json", json.dumps(manifest, ensure_ascii=False, indent=2))
        z.writestr("modlist.html", f"<ul>\n{lista}</ul>\n")
        for ruta in copiados:
            z.write(carpeta / ruta, f"overrides/{ruta}")
        for ruta, jar in en_overrides:
            z.write(jar, f"overrides/{ruta}")
    return destino, len(archivos_cf), len(en_overrides), len(copiados)


def main():
    ap = argparse.ArgumentParser(description="Zips completos para importar en CurseForge.")
    ap.add_argument("--solo", help="id de una versión (ultra-low, lite, media-lite, media, detallada)")
    ap.add_argument("--salida", type=Path, help="carpeta de salida (por defecto ../exportar-<versión>/)")
    ap.add_argument("--cache", type=Path, default=AQUI.parent / "_cache-modrinth",
                    help="dónde guardar los archivos de Modrinth descargados")
    args = ap.parse_args()

    cfg = json.loads((AQUI / "variantes.json").read_text(encoding="utf-8"))
    salida = args.salida or AQUI.parent / f"exportar-{cfg['version']}"
    variantes = [v for v in cfg["variantes"] if not args.solo or v["id"] == args.solo]
    if not variantes:
        sys.exit(f"No hay ninguna versión con id {args.solo!r}")
    for v in variantes:
        zip_, cf, otros, copiados = exportar(v, cfg, salida, args.cache)
        mb = zip_.stat().st_size / 1048576
        print(f"  {v['nombre']:<11} {cf:>3} de CurseForge · {otros:>3} dentro · {copiados:>4} configs · {mb:5.1f} MB  {zip_.name}")
    print(f"\nZips en {salida}")
    print("En CurseForge: Crear perfil personalizado → Importar → elige el zip.")


if __name__ == "__main__":
    main()
