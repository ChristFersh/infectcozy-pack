"""Genera las versiones de Infect Cozy en formato packwiz a partir de esta instancia
de CurseForge y las sube a GitHub Pages, desde donde se actualizan tus amigos.

Uso:  python publicar.py [version] [--sin-subir]
"""

import argparse
import fnmatch
import hashlib
import json
import re
import shutil
import subprocess
import sys
import tomllib
import unicodedata
import urllib.request
import zipfile
from dataclasses import dataclass, field
from html import escape
from pathlib import Path
from urllib.parse import quote

AQUI = Path(__file__).resolve().parent
INSTANCIA = AQUI.parent
HERRAMIENTAS = INSTANCIA / "_packwiz-herramientas"
PACKWIZ = HERRAMIENTAS / "packwiz" / "packwiz.exe"
BOOTSTRAP = HERRAMIENTAS / "bootstrap" / "packwiz-installer-bootstrap.jar"

# Carpetas cuyos archivos se descargan de CurseForge/Modrinth cuando se puede.
CARPETAS_DESCARGABLES = ["mods", "resourcepacks", "shaderpacks", "datapacks"]
# Carpetas que se copian tal cual al pack.
CARPETAS_COPIA = ["config", "defaultconfigs", "moonlight-global-datapacks"]

UID_LOADER = {
    "neoforge": "net.neoforged",
    "forge": "net.minecraftforge",
    "fabric": "net.fabricmc.fabric-loader",
    "quilt": "org.quiltmc.quilt-loader",
}


@dataclass
class Item:
    carpeta: str
    archivo: str
    ruta: Path
    nombre: str
    tipo: str = "archivo"  # "cf", "mr" o "archivo"
    bloqueado: bool = False  # CurseForge no deja bajarlo fuera de su app
    lado: str = "both"  # "server": los clientes no lo instalan
    datos: dict = field(default_factory=dict)

    @property
    def rel(self):
        return f"{self.carpeta}/{self.archivo}"


def sha(ruta, algoritmo):
    h = hashlib.new(algoritmo)
    with open(ruta, "rb") as f:
        for bloque in iter(lambda: f.read(1 << 20), b""):
            h.update(bloque)
    return h.hexdigest()


def coincide(patrones, rel, nombre=None):
    """Un patrón vale como nombre del proyecto, nombre de archivo o ruta (admite * y ?)."""
    candidatos = [rel.lower(), rel.lower().rsplit("/", 1)[-1]]
    if nombre:
        candidatos.append(nombre.lower())
    for p in patrones:
        p_l = p.lower()
        if any(c == p_l or fnmatch.fnmatchcase(c, p_l) for c in candidatos):
            return True
    return False


def toml_str(s):
    s = s.replace("\\", "\\\\").replace('"', '\\"')
    s = re.sub(r"[\x00-\x1f\x7f]", lambda m: f"\\u{ord(m.group()):04x}", s)
    return f'"{s}"'


def slug(texto):
    texto = re.sub(r"§.", "", texto)  # códigos de color de Minecraft
    s = unicodedata.normalize("NFKD", texto).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower() or "archivo"


def leer_instancia():
    mi = json.loads((INSTANCIA / "minecraftinstance.json").read_text(encoding="utf-8"))
    loader, loader_ver = mi["baseModLoader"]["name"].split("-", 1)
    addons = {}
    for a in mi["installedAddons"]:
        f = a["installedFile"]
        for nombre in (f.get("fileNameOnDisk"), f["fileName"]):
            if nombre:
                addons.setdefault(nombre, a)
    return mi["gameVersion"], loader, loader_ver, addons


def buscar_en_modrinth(sha1s):
    if not sha1s:
        return {}
    req = urllib.request.Request(
        "https://api.modrinth.com/v2/version_files",
        data=json.dumps({"hashes": sorted(sha1s), "algorithm": "sha1"}).encode(),
        headers={"Content-Type": "application/json", "User-Agent": "infectcozy-publicar/1.0"},
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.load(r)


def escanear(cfg, addons):
    """Decide de dónde sale cada mod / resource pack / shader de la instancia."""
    items = []
    for carpeta in CARPETAS_DESCARGABLES:
        d = INSTANCIA / carpeta
        if not d.is_dir():
            continue
        for p in sorted(d.iterdir()):
            if not p.is_file() or p.suffix == ".disabled":
                continue
            a = addons.get(p.name)
            it = Item(carpeta, p.name, p, a["name"] if a else p.stem)
            if coincide(cfg["excluir_siempre"], it.rel, it.nombre):
                continue
            if p.suffix.lower() in (".jar", ".zip"):
                it.datos["sha1"] = sha(p, "sha1")
                if a:
                    cf_sha1 = next((h["value"] for h in a["installedFile"].get("hashes", []) if h["type"] == 1), None)
                    if cf_sha1 in (None, it.datos["sha1"]):
                        it.tipo = "cf"
                        it.bloqueado = a.get("allowModDistribution") is False
                        it.datos.update(project_id=a["addonID"], file_id=a["installedFile"]["id"], web=a.get("webSiteURL"))
            items.append(it)

    # Lo que CurseForge no deja descargar, o no viene de CurseForge, se busca en Modrinth.
    pendientes = {it.datos["sha1"]: it for it in items if "sha1" in it.datos and (it.tipo != "cf" or it.bloqueado)}
    for h, version in buscar_en_modrinth(pendientes).items():
        it = pendientes[h]
        archivo = next(f for f in version["files"] if f["hashes"]["sha1"] == h)
        it.tipo, it.bloqueado = "mr", False
        it.datos.update(
            url=archivo["url"], sha512=archivo["hashes"]["sha512"],
            project_id=version["project_id"], version_id=version["id"],
        )

    # Bloqueados en CurseForge pero con licencia libre (MIT, Apache...): el jar va dentro del repo.
    for it in items:
        if it.bloqueado and coincide(cfg.get("alojar_en_repo", []), it.rel, it.nombre):
            it.tipo, it.bloqueado = "archivo", False
        # Solo hace falta en el servidor (p. ej. style packs de Minecolonies: Structurize los envía al entrar).
        if coincide(cfg.get("solo_servidor", []), it.rel, it.nombre):
            it.lado = "server"
    # Los packs son para clientes: un archivo copiado no puede marcarse como de servidor, así que no va.
    return [it for it in items if not (it.lado == "server" and it.tipo == "archivo")]


def metafile(it):
    lineas = [
        f"name = {toml_str(it.nombre)}",
        f"filename = {toml_str(it.archivo)}",
        f"side = {toml_str(it.lado)}",
        "",
        "[download]",
    ]
    if it.tipo == "cf":
        lineas += [
            'hash-format = "sha1"',
            f'hash = "{it.datos["sha1"]}"',
            'mode = "metadata:curseforge"',
            "",
            "[update]",
            "[update.curseforge]",
            f"file-id = {it.datos['file_id']}",
            f"project-id = {it.datos['project_id']}",
        ]
    else:
        lineas += [
            f"url = {toml_str(it.datos['url'])}",
            'hash-format = "sha512"',
            f'hash = "{it.datos["sha512"]}"',
            "",
            "[update]",
            "[update.modrinth]",
            f"mod-id = {toml_str(it.datos['project_id'])}",
            f"version = {toml_str(it.datos['version_id'])}",
        ]
    return "\n".join(lineas) + "\n"


def packwiz(carpeta, *args):
    r = subprocess.run([str(PACKWIZ), *args], cwd=carpeta, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if r.returncode != 0:
        sys.exit(f"packwiz {' '.join(args)} falló en {carpeta}:\n{r.stdout}\n{r.stderr}")


def marcar_conservados(carpeta, patrones):
    """Los archivos 'conservados' se instalan la primera vez y luego no se pisan (ajustes de cada jugador)."""
    ruta = carpeta / "index.toml"
    index = tomllib.loads(ruta.read_text(encoding="utf-8"))
    salida = [f"hash-format = {toml_str(index['hash-format'])}"]
    for f in index.get("files", []):
        salida += ["", "[[files]]", f"file = {toml_str(f['file'])}", f"hash = {toml_str(f['hash'])}"]
        if "hash-format" in f:
            salida.append(f"hash-format = {toml_str(f['hash-format'])}")
        if f.get("metafile"):
            salida.append("metafile = true")
        if f.get("preserve") or coincide(patrones, f["file"]):
            salida.append("preserve = true")
    ruta.write_text("\n".join(salida) + "\n", encoding="utf-8", newline="\n")


def construir_variante(cfg, v, items, version, mc, loader, loader_ver):
    out = AQUI / "packs" / v["id"]
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)
    excluir = cfg["excluir_siempre"] + v.get("excluir", [])
    usados = set()
    cuenta = {"cf": 0, "mr": 0, "archivo": 0}
    manuales = []

    for it in items:
        if coincide(v.get("excluir", []), it.rel, it.nombre):
            continue
        destino = out / it.carpeta
        destino.mkdir(exist_ok=True)
        cuenta[it.tipo] += 1
        if it.tipo == "archivo":
            shutil.copy2(it.ruta, destino / it.archivo)
            continue
        if it.bloqueado and it.lado != "server":
            manuales.append(it)
        base = nombre = slug(it.nombre)
        n = 2
        while (it.carpeta, nombre) in usados:
            nombre, n = f"{base}-{n}", n + 1
        usados.add((it.carpeta, nombre))
        (destino / f"{nombre}.pw.toml").write_text(metafile(it), encoding="utf-8", newline="\n")

    for carpeta in CARPETAS_COPIA:
        for p in (INSTANCIA / carpeta).rglob("*"):
            rel = p.relative_to(INSTANCIA).as_posix()
            if p.is_file() and not coincide(excluir, rel):
                (out / rel).parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(p, out / rel)

    ajustes = AQUI / "ajustes" / v["id"]
    if ajustes.is_dir():
        for p in ajustes.rglob("*"):
            if p.is_file():
                rel = p.relative_to(ajustes)
                (out / rel).parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(p, out / rel)

    (out / "pack.toml").write_text(
        "\n".join([
            f"name = {toml_str(cfg['nombre'] + ' ' + v['nombre'])}",
            f"author = {toml_str(cfg['autor'])}",
            f"version = {toml_str(version)}",
            'pack-format = "packwiz:1.1.0"',
            "",
            "[index]",
            'file = "index.toml"',
            'hash-format = "sha256"',
            'hash = ""',
            "",
            "[versions]",
            f"minecraft = {toml_str(mc)}",
            f"{loader} = {toml_str(loader_ver)}",
        ]) + "\n",
        encoding="utf-8", newline="\n",
    )
    (out / "index.toml").write_text('hash-format = "sha256"\n', encoding="utf-8", newline="\n")
    packwiz(out, "refresh")
    marcar_conservados(out, cfg["conservar"])
    packwiz(out, "refresh")
    return cuenta, manuales


def crear_instancia_prism(cfg, v, mc, loader, loader_ver):
    """Zip que tus amigos importan en Prism Launcher: al darle a Jugar, packwiz sincroniza el pack."""
    url = f"{cfg['url_base'].rstrip('/')}/packs/{v['id']}/pack.toml"
    lineas = [
        "InstanceType=OneSix",
        f"name={cfg['nombre']} {v['nombre']}",
        "OverrideCommands=true",
        f'PreLaunchCommand="$INST_JAVA" -jar packwiz-installer-bootstrap.jar {url}',
        "OverrideMemory=true",
        "MinMemAlloc=1024",
        f"MaxMemAlloc={v['ram_mb']}",
    ]
    # Parámetros de Java (recolector G1 ajustado). Una versión puede tener los suyos con "jvm_args".
    jvm_args = v.get("jvm_args", cfg.get("jvm_args"))
    if jvm_args:
        lineas += ["OverrideJavaArgs=true", f"JvmArgs={jvm_args}"]
    instance_cfg = "\n".join(lineas) + "\n"
    mmc_pack = {
        "components": [
            {"important": True, "uid": "net.minecraft", "version": mc},
            {"uid": UID_LOADER[loader], "version": loader_ver},
        ],
        "formatVersion": 1,
    }
    # Prism usa el nombre del zip como nombre de la instancia.
    destino = AQUI / "descargas" / f"{cfg['nombre']} {v['nombre']}.zip"
    destino.parent.mkdir(exist_ok=True)
    with zipfile.ZipFile(destino, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("instance.cfg", instance_cfg)
        z.writestr("mmc-pack.json", json.dumps(mmc_pack, indent=4) + "\n")
        z.write(BOOTSTRAP, ".minecraft/packwiz-installer-bootstrap.jar")
    return destino


def gb(mb):
    """6144 -> "6", 5632 -> "5,5"."""
    return f"{mb / 1024:g}".replace(".", ",")


def escribir_pagina(cfg, version, resumen, manuales):
    filas = "\n".join(
        f'      <li><a href="descargas/{quote(zip_.name)}">{escape(cfg["nombre"])} {escape(v["nombre"])}</a>'
        f'<span>{escape(v["descripcion"])} · {gb(v["ram_mb"])} GB de RAM · {total} archivos</span></li>'
        for v, zip_, total in resumen
    )
    aviso = ""
    if manuales:
        enlaces = "\n".join(
            f'      <li><a href="{escape(it.datos.get("web") or "")}/files/{it.datos["file_id"]}">{escape(it.nombre)}</a>'
            f' → guárdalo como <code>mods/{escape(it.archivo)}</code></li>'
            for it in manuales
        )
        aviso = (
            "  <h2>Mods que se bajan a mano</h2>\n"
            "  <p>Sus autores no permiten que otros programas los descarguen. Si al iniciar sale un aviso con alguno, "
            "descárgalo del enlace y ponlo en la carpeta <code>mods</code> de la instancia "
            "(en Prism: clic derecho en la instancia → <b>Carpeta</b> → <code>.minecraft</code>). Luego vuelve a iniciar.</p>\n"
            f"  <ul>\n{enlaces}\n  </ul>\n"
        )
    html = (AQUI / "plantilla.html").read_text(encoding="utf-8")
    html = (html.replace("{{NOMBRE}}", escape(cfg["nombre"])).replace("{{VERSION}}", escape(version))
            .replace("{{VARIANTES}}", filas).replace("{{MANUALES}}", aviso))
    (AQUI / "index.html").write_text(html, encoding="utf-8", newline="\n")


def subir(version):
    def git(*args, ok=False):
        r = subprocess.run(["git", *args], cwd=AQUI)
        if r.returncode != 0 and not ok:
            sys.exit(f"git {' '.join(args)} falló")
    git("add", "-A")
    if subprocess.run(["git", "diff", "--cached", "--quiet"], cwd=AQUI).returncode == 0:
        print("No hay cambios nuevos; se suben los commits pendientes, si los hay.")
    else:
        git("commit", "-m", f"Version {version}")
    git("push")


def siguiente_version(v):
    partes = v.split(".")
    return ".".join(partes[:-1] + [str(int(partes[-1]) + 1)]) if partes[-1].isdigit() else v


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("version", nargs="?")
    ap.add_argument("--sin-subir", action="store_true", help="solo genera los packs, no hace commit ni push")
    args = ap.parse_args()

    ruta_cfg = AQUI / "variantes.json"
    cfg = json.loads(ruta_cfg.read_text(encoding="utf-8"))
    version = args.version
    if not version:
        sugerida = siguiente_version(cfg["version"])
        version = input(f"Versión a publicar (la última fue {cfg['version']}) [{sugerida}]: ").strip() or sugerida

    mc, loader, loader_ver, addons = leer_instancia()
    print(f"Minecraft {mc} · {loader} {loader_ver} · leyendo la instancia...")
    items = escanear(cfg, addons)

    resumen = []
    manuales_todos = {}
    shutil.rmtree(AQUI / "descargas", ignore_errors=True)
    for v in cfg["variantes"]:
        cuenta, manuales = construir_variante(cfg, v, items, version, mc, loader, loader_ver)
        zip_ = crear_instancia_prism(cfg, v, mc, loader, loader_ver)
        total = sum(cuenta.values())
        resumen.append((v, zip_, total))
        manuales_todos.update({it.rel: it for it in manuales})
        print(f"  {v['nombre']:<11} {cuenta['cf']:>3} de CurseForge · {cuenta['mr']:>3} de Modrinth · {cuenta['archivo']:>3} copiados")
    manuales_todos = sorted(manuales_todos.values(), key=lambda it: it.nombre)
    if manuales_todos:
        print("  Tus amigos los bajan a mano (CurseForge no deja otra opción):", ", ".join(it.nombre for it in manuales_todos))

    escribir_pagina(cfg, version, resumen, manuales_todos)
    cfg["version"] = version
    ruta_cfg.write_text(json.dumps(cfg, indent=2, ensure_ascii=False) + "\n", encoding="utf-8", newline="\n")

    if args.sin_subir:
        print(f"Listo: versión {version} generada en {AQUI / 'packs'} (sin subir).")
    else:
        subir(version)
        print(f"Listo: versión {version} publicada. Tus amigos la reciben al abrir el juego (puede tardar ~10 min).")


if __name__ == "__main__":
    main()
