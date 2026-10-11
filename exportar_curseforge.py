"""Crea los zips completos para importar Infect Cozy en la app de CurseForge, a partir de packs/.

Uso:  python exportar_curseforge.py                 las 5 versiones en ../exportar-<versión>/
      python exportar_curseforge.py --solo lite     solo una versión
      python exportar_curseforge.py --salida RUTA   otra carpeta de salida
      python exportar_curseforge.py --subir         los genera y los sube a la release v<versión> de GitHub
      python exportar_curseforge.py --solo-subir    sube los que ya están en ../exportar-<versión>/

Cada zip lleva el formato de modpack de CurseForge:
- manifest.json con los mods, resource packs y shaders de CurseForge (la app los descarga sola,
  también los que bloquean la descarga fuera de ella);
- overrides/ con todo lo demás, tal cual lo recibe Prism: configs, ajustes de la versión y los
  archivos que no son de CurseForge (los de Modrinth se bajan y se comprueba su hash).

La web los ofrece desde la release v<versión> del repo (pesan demasiado para el repo). Para subirlos se
usa GitHub CLI (gh) si está instalado; si no, se abre la página de la release para arrastrarlos a mano.
subir-a-github.bat lo hace solo antes de publicar la web.
"""

import argparse
import hashlib
import html
import json
import os
import shutil
import subprocess
import sys
import tomllib
import urllib.error
import urllib.request
import webbrowser
import zipfile
from pathlib import Path
from urllib.parse import quote

AQUI = Path(__file__).resolve().parent


def nombre_zip(cfg, v, version=None):
    """Nombre del zip de una versión. Sin espacios: GitHub los cambia por puntos al subirlo a una release."""
    return f"InfectCozy-{v['nombre'].replace(' ', '-')}-CurseForge-{version or cfg['version']}.zip"


def url_release(cfg, v, version=None):
    """Enlace de descarga del zip en la release de GitHub (lo usa publicar.py para datos.json)."""
    version = version or cfg["version"]
    return f"https://github.com/{cfg['repo_github']}/releases/download/v{version}/{quote(nombre_zip(cfg, v, version))}"


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
    destino = salida / nombre_zip(cfg, v)
    with zipfile.ZipFile(destino, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        z.writestr("manifest.json", json.dumps(manifest, ensure_ascii=False, indent=2))
        z.writestr("modlist.html", f"<ul>\n{lista}</ul>\n")
        for ruta in copiados:
            z.write(carpeta / ruta, f"overrides/{ruta}")
        for ruta, jar in en_overrides:
            z.write(jar, f"overrides/{ruta}")
    return destino, len(archivos_cf), len(en_overrides), len(copiados)


def assets_release(repo, tag):
    """{nombre: tamaño} de los archivos de una release publicada, o None si no existe (API pública, sin cuenta)."""
    pet = urllib.request.Request(f"https://api.github.com/repos/{repo}/releases/tags/{tag}",
                                 headers={"Accept": "application/vnd.github+json", "User-Agent": "infectcozy-exportar"})
    try:
        with urllib.request.urlopen(pet, timeout=30) as r:
            return {a["name"]: a["size"] for a in json.load(r).get("assets", [])}
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return None
        raise


def subir_release(cfg, zips):
    """Sube los zips a la release v<versión>. Solo sube los que faltan o cambiaron. Devuelve True si quedan todos arriba."""
    repo, version = cfg["repo_github"], cfg["version"]
    tag = f"v{version}"
    previos = assets_release(repo, tag)
    pendientes = [z for z in zips if (previos or {}).get(z.name) != z.stat().st_size]
    if not pendientes:
        print(f"Los {len(zips)} zips ya están en la release {tag}.")
        return True

    if shutil.which("gh"):
        if previos is None:
            cmd = ["gh", "release", "create", tag, *map(str, pendientes), "--repo", repo,
                   "--title", f"{cfg['nombre']} {version} (CurseForge)",
                   "--notes", f"Zips de {cfg['nombre']} {version} para la app de CurseForge: Crear perfil personalizado → Importar. "
                              f"La forma recomendada sigue siendo Prism: {cfg['url_base']}"]
        else:
            cmd = ["gh", "release", "upload", tag, *map(str, pendientes), "--repo", repo, "--clobber"]
        print(f"Subiendo {len(pendientes)} zips a la release {tag} (tarda según tu conexión)...")
        if subprocess.run(cmd).returncode != 0:
            print("gh no pudo subirlos. Si es la primera vez, haz antes: gh auth login")
            return False
    else:
        print("No tienes GitHub CLI (gh), así que se suben a mano:")
        if previos is None:
            print(f"  1. Se abre la página de nueva release con el tag {tag} ya puesto.")
            webbrowser.open(f"https://github.com/{repo}/releases/new?tag={tag}"
                            f"&title={quote(cfg['nombre'] + ' ' + version + ' (CurseForge)')}")
        else:
            print(f"  1. Se abre la página para editar la release {tag}.")
            webbrowser.open(f"https://github.com/{repo}/releases/edit/{tag}")
        print(f"  2. Arrastra estos zips de la carpeta que se abre: {', '.join(z.name for z in pendientes)}")
        print("  3. Pulsa Publish release (o Update release). No la dejes como borrador.")
        if hasattr(os, "startfile"):
            os.startfile(zips[0].parent)
        input("\nCuando esté publicada, pulsa Enter para seguir...")

    arriba = assets_release(repo, tag) or {}
    faltan = [z.name for z in zips if arriba.get(z.name) != z.stat().st_size]
    if faltan:
        print(f"En la release {tag} faltan o no coinciden: {', '.join(faltan)}")
        return False
    print(f"Listo: los {len(zips)} zips están en https://github.com/{repo}/releases/tag/{tag}")
    return True


def main():
    ap = argparse.ArgumentParser(description="Zips completos para importar en CurseForge.")
    ap.add_argument("--solo", help="id de una versión (ultra-low, lite, media-lite, media, detallada)")
    ap.add_argument("--salida", type=Path, help="carpeta de salida (por defecto ../exportar-<versión>/)")
    ap.add_argument("--cache", type=Path, default=AQUI.parent / "_cache-modrinth",
                    help="dónde guardar los archivos de Modrinth descargados")
    ap.add_argument("--subir", action="store_true", help="después de generarlos, súbelos a la release v<versión>")
    ap.add_argument("--solo-subir", action="store_true", help="no generes nada: sube los zips que ya hay")
    args = ap.parse_args()

    cfg = json.loads((AQUI / "variantes.json").read_text(encoding="utf-8"))
    salida = args.salida or AQUI.parent / f"exportar-{cfg['version']}"
    variantes = [v for v in cfg["variantes"] if not args.solo or v["id"] == args.solo]
    if not variantes:
        sys.exit(f"No hay ninguna versión con id {args.solo!r}")

    if not args.solo_subir:
        for v in variantes:
            zip_, cf, otros, copiados = exportar(v, cfg, salida, args.cache)
            mb = zip_.stat().st_size / 1048576
            print(f"  {v['nombre']:<11} {cf:>3} de CurseForge · {otros:>3} dentro · {copiados:>4} configs · {mb:5.1f} MB  {zip_.name}")
        print(f"\nZips en {salida}")
        print("En CurseForge: Crear perfil personalizado → Importar → elige el zip.")

    if args.subir or args.solo_subir:
        zips = [salida / nombre_zip(cfg, v) for v in variantes]
        faltan = [z.name for z in zips if not z.is_file()]
        if faltan:
            sys.exit(f"Faltan zips en {salida}: {', '.join(faltan)}. Créalos con exportar-curseforge.bat")
        if not subir_release(cfg, zips):
            sys.exit(1)


if __name__ == "__main__":
    main()
