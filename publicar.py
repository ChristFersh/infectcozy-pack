"""Genera las versiones de Infect Cozy en formato packwiz a partir de esta instancia
de CurseForge y las sube a GitHub Pages, desde donde se actualizan tus amigos.

Uso:  python publicar.py [version] [--sin-subir]
      python publicar.py [version] --prueba [--solo media]   versión de prueba en prueba/ (no toca la publicada)
      python publicar.py [version] --pre [--solo media detallada]   pre-release en pre-release/ y release de GitHub
                                                                 marcada como pre-release con los zips de Prism
      python publicar.py --solo-datos      solo rehace datos.json (lo que lee la web)

Si en ../exportar-<versión>/ están los zips de CurseForge (exportar_curseforge.py), datos.json enlaza
también su descarga desde la release v<versión> de GitHub.

La web (index.html, assets/, img/) se compila aparte desde web/ con `npm run publicar`.
"""

import argparse
import os
import webbrowser
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
from datetime import date
from pathlib import Path
from urllib.parse import quote

from exportar_curseforge import nombre_zip, url_release

AQUI = Path(__file__).resolve().parent
INSTANCIA = AQUI.parent
HERRAMIENTAS = INSTANCIA / "_packwiz-herramientas"
PACKWIZ = HERRAMIENTAS / "packwiz" / "packwiz.exe"
BOOTSTRAP = HERRAMIENTAS / "bootstrap" / "packwiz-installer-bootstrap.jar"
# Icono de las instancias de Prism: va en la raíz del zip con el nombre de su iconKey y Prism lo instala al importar.
ICONO = AQUI / "icono-instancia.png"
ICONO_KEY = "infectcozy"
# Canales aparte de la versión publicada: cada uno en su carpeta del repo, con sus zips de Prism.
CANALES = {
    "prueba": {"carpeta": "prueba", "sufijo": " (prueba)", "commit": "Prueba", "nombre": "prueba"},
    "pre": {"carpeta": "pre-release", "sufijo": " (pre-release)", "commit": "Pre-release", "nombre": "pre-release"},
}

# Carpetas cuyos archivos se descargan de CurseForge/Modrinth cuando se puede.
CARPETAS_DESCARGABLES = ["mods", "resourcepacks", "shaderpacks", "datapacks"]
# Carpetas que se copian tal cual al pack.
# globalresources: Default Resources (va dentro de Missing Wilds) carga sus zips siempre activos.
CARPETAS_COPIA = ["config", "defaultconfigs", "moonlight-global-datapacks", "globalresources"]
# Guías en PDF que enlaza la web (están en guias/).
GUIAS = [
    ("Infect-Cozy-Guia-del-superviviente.pdf", "Guía del superviviente"),
]

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
    opcional: bool = False  # desactivado (.disabled) en la instancia: solo va en las versiones que lo piden en "agregar"
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
    agregar = [x for v in cfg["variantes"] for x in v.get("agregar", [])]
    for carpeta in CARPETAS_DESCARGABLES:
        d = INSTANCIA / carpeta
        if not d.is_dir():
            continue
        for p in sorted(d.iterdir()):
            if not p.is_file():
                continue
            # Lo desactivado (.disabled) no se publica, salvo que alguna versión lo pida en "agregar".
            desactivado = p.suffix == ".disabled"
            archivo = p.name[: -len(".disabled")] if desactivado else p.name
            a = addons.get(p.name) or addons.get(archivo)
            it = Item(carpeta, archivo, p, a["name"] if a else Path(archivo).stem, opcional=desactivado)
            if desactivado and ((d / archivo).exists() or not coincide(agregar, it.rel, it.nombre)):
                continue
            if coincide(cfg["excluir_siempre"], it.rel, it.nombre):
                continue
            if Path(it.archivo).suffix.lower() in (".jar", ".zip"):
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

    # Un mod desactivado que piden algunas versiones ("agregar") tiene que salir de CurseForge o Modrinth: si no,
    # su jar se copiaría al repo, y puede no tener licencia libre (Better FPS - Render Distance es ARR).
    sin_origen = [it.archivo for it in items if it.opcional and it.tipo == "archivo"
                  and not coincide(cfg.get("alojar_en_repo", []), it.rel, it.nombre)]
    if sin_origen:
        sys.exit("La app de CurseForge no tiene registrados estos mods desactivados que piden las versiones en \"agregar\": "
                 + ", ".join(sin_origen) + ". Abre la instancia en la app de CurseForge para que los detecte y vuelve a publicar.")

    # Bloqueados en CurseForge pero con licencia libre (MIT, Apache...): el jar va dentro del repo.
    for it in items:
        if it.bloqueado and coincide(cfg.get("alojar_en_repo", []), it.rel, it.nombre):
            it.tipo, it.bloqueado = "archivo", False
        # Solo hace falta en el servidor. Ojo: Structurize NO envía los style packs que vienen dentro
        # de un jar; si el servidor tiene uno que el cliente no, el build tool se queda vacío.
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


def va_en_variante(v, it):
    """Si el archivo va en la versión v: no está en su "excluir" y, si está desactivado en la instancia, está en su "agregar"."""
    if it.opcional and not coincide(v.get("agregar", []), it.rel, it.nombre):
        return False
    return not coincide(v.get("excluir", []), it.rel, it.nombre)


def packs_de_la_instancia(texto, packs_version):
    """Pone en el options.txt de una versión la lista de resource packs activos (y su orden) de options.txt de la
    instancia, sin los packs sueltos ("file/...") que esa versión no lleva. Así ajustes/<versión>/options.txt no
    se queda con una lista vieja cada vez que se activan o quitan packs en la instancia."""
    origen = INSTANCIA / "options.txt"
    if not origen.is_file():
        return texto
    inst = {}
    for linea in origen.read_text(encoding="utf-8", errors="replace").splitlines():
        clave, sep, valor = linea.partition(":")
        if sep and clave in ("resourcePacks", "incompatibleResourcePacks"):
            inst[clave] = json.loads(valor)
    if "resourcePacks" not in inst:
        return texto
    packs = [x for x in inst["resourcePacks"] if not x.startswith("file/") or x[5:] in packs_version]
    nuevas = {"resourcePacks": packs,
              "incompatibleResourcePacks": [x for x in inst.get("incompatibleResourcePacks", []) if x in packs]}
    lineas, vistas = [], set()
    for linea in texto.splitlines():
        clave = linea.partition(":")[0]
        if clave in nuevas:
            linea = clave + ":" + json.dumps(nuevas[clave], ensure_ascii=False, separators=(",", ":"))
            vistas.add(clave)
        lineas.append(linea)
    lineas += [k + ":" + json.dumps(x, ensure_ascii=False, separators=(",", ":")) for k, x in nuevas.items() if k not in vistas]
    return "\n".join(lineas) + "\n"


def construir_variante(cfg, v, items, version, mc, loader, loader_ver, raiz=None):
    out = (raiz or AQUI / "packs") / v["id"]
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)
    excluir = cfg["excluir_siempre"] + v.get("excluir", [])
    usados = set()
    cuenta = {"cf": 0, "mr": 0, "archivo": 0}
    manuales = []

    for it in items:
        if not va_en_variante(v, it):
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

    opciones = out / "options.txt"
    if opciones.is_file():
        packs_version = {it.archivo for it in items if it.carpeta == "resourcepacks" and va_en_variante(v, it)}
        opciones.write_text(packs_de_la_instancia(opciones.read_text(encoding="utf-8"), packs_version),
                            encoding="utf-8", newline="\n")

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


def crear_instancia_prism(cfg, v, mc, loader, loader_ver, prueba=False, canal=None):
    """Zip que tus amigos importan en Prism Launcher: al darle a Jugar, packwiz sincroniza el pack.
    Con un canal (prueba=True es el de prueba) apunta a <canal>/packs/ y se llama "... (prueba)" o "... (pre-release)"."""
    if canal is None and prueba:
        canal = CANALES["prueba"]
    carpeta_packs = f"{canal['carpeta']}/packs" if canal else "packs"
    url = f"{cfg['url_base'].rstrip('/')}/{carpeta_packs}/{v['id']}/pack.toml"
    sufijo = canal["sufijo"] if canal else ""
    lineas = [
        "InstanceType=OneSix",
        f"name={cfg['nombre']} {v['nombre']}{sufijo}",
        *([f"iconKey={ICONO_KEY}"] if ICONO.is_file() else []),
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
    destino = (AQUI / canal["carpeta"] / "descargas" if canal else AQUI / "descargas") / f"{cfg['nombre']} {v['nombre']}{sufijo}.zip"
    destino.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(destino, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("instance.cfg", instance_cfg)
        z.writestr("mmc-pack.json", json.dumps(mmc_pack, indent=4) + "\n")
        z.write(BOOTSTRAP, ".minecraft/packwiz-installer-bootstrap.jar")
        if ICONO.is_file():
            z.write(ICONO, f"{ICONO_KEY}.png")
    return destino


def gb(mb):
    """6144 -> "6", 5632 -> "5,5"."""
    return f"{mb / 1024:g}".replace(".", ",")


def escribir_datos(cfg, version, mc, loader, loader_ver, resumen, manuales):
    """datos.json: lo que lee la web (versiones, enlaces de descarga, mods que se bajan a mano)."""
    variantes = []
    for v, zip_, total in resumen:
        variantes.append({
            "id": v["id"],
            "nombre": v["nombre"],
            "descripcion": v["descripcion"],
            "ram_mb": v["ram_mb"],
            "archivos": total,
            "prism": f"descargas/{quote(zip_.name)}",
            "pack_toml": f"{cfg['url_base'].rstrip('/')}/packs/{v['id']}/pack.toml",
        })
        # Zip para la app de CurseForge: solo si ya se generó para esta versión (se sube a la release v<versión>).
        if cfg.get("repo_github") and (INSTANCIA / f"exportar-{version}" / nombre_zip(cfg, v, version)).is_file():
            variantes[-1]["curseforge"] = url_release(cfg, v, version)
    datos = {
        "nombre": cfg["nombre"],
        "version": version,
        "minecraft": mc,
        "loader": loader,
        "loader_version": loader_ver,
        "actualizado": date.today().isoformat(),
        "url_base": cfg["url_base"],
        "variantes": variantes,
        "manuales": manuales,
        "guias": [{"titulo": t, "url": f"guias/{quote(n)}"} for n, t in GUIAS if (AQUI / "guias" / n).is_file()],
    }
    (AQUI / "datos.json").write_text(json.dumps(datos, indent=2, ensure_ascii=False) + "\n", encoding="utf-8", newline="\n")


def manuales_web(manuales):
    return [
        {"nombre": it.nombre, "archivo": it.archivo, "url": f"{it.datos.get('web') or ''}/files/{it.datos['file_id']}"}
        for it in manuales
    ]


def solo_datos(cfg):
    """Rehace datos.json con lo que ya hay en packs/ y descargas/, sin volver a generar los packs."""
    mc, loader, loader_ver, _ = leer_instancia()
    resumen = []
    for v in cfg["variantes"]:
        carpeta = AQUI / "packs" / v["id"]
        total = sum(1 for c in CARPETAS_DESCARGABLES if (carpeta / c).is_dir() for p in (carpeta / c).iterdir() if p.is_file())
        resumen.append((v, AQUI / "descargas" / f"{cfg['nombre']} {v['nombre']}.zip", total))
    previo = AQUI / "datos.json"
    manuales = json.loads(previo.read_text(encoding="utf-8")).get("manuales", []) if previo.is_file() else []
    escribir_datos(cfg, cfg["version"], mc, loader, loader_ver, resumen, manuales)
    print(f"Listo: datos.json de la versión {cfg['version']}.")


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


def subir_prueba(version, canal=None):
    """Sube solo la carpeta del canal (prueba/ o pre-release/); los cambios del resto del repo quedan como estaban,
    sin commit. Con la pre-release, si prueba/ se borró del disco, su borrado va en el mismo commit."""
    canal = canal or CANALES["prueba"]
    def git(*args, ok=False):
        r = subprocess.run(["git", *args], cwd=AQUI)
        if r.returncode != 0 and not ok:
            sys.exit(f"git {' '.join(args)} falló")
    rutas = [canal["carpeta"]]
    if canal is not CANALES["prueba"] and not (AQUI / "prueba").exists():
        seguidas = subprocess.run(["git", "ls-files", "--", "prueba"], cwd=AQUI, capture_output=True, text=True).stdout
        if seguidas.strip():
            rutas.append("prueba")
    git("add", "-A", "--", *rutas)
    if subprocess.run(["git", "diff", "--cached", "--quiet", "--", *rutas], cwd=AQUI).returncode == 0:
        print(f"La {canal['nombre']} no cambió; se suben los commits pendientes, si los hay.")
    else:
        git("commit", "-m", f"{canal['commit']} {version}", "--", *rutas)
    git("push")


def crear_prerelease(cfg, version, zips):
    """Release v<versión> de GitHub marcada como pre-release, con los zips de Prism (los que bajan el pack con
    packwiz desde pre-release/packs/). Con gh se crea sola; sin gh se abre la página para hacerlo a mano."""
    repo = cfg.get("repo_github")
    if not repo:
        print("variantes.json no tiene repo_github: no se crea la release.")
        return
    tag = f"v{version}"
    titulo = f"{cfg['nombre']} {version} (pre-release)"
    notas = (f"Versión de prueba de {cfg['nombre']} {version}. No es la versión publicada ({cfg['version']}).\n\n"
             "Cómo probarla:\n"
             "1. Baja el zip de la versión que quieras (Media o Detallada).\n"
             "2. En Prism Launcher: Añadir instancia → Importar → elige el zip.\n"
             "3. Dale a Jugar: packwiz baja el pack la primera vez (tarda) y lo actualiza solo en cada arranque.\n\n"
             "Es una instancia aparte (\"... (pre-release)\"): no toca la que ya tengas del pack.")
    # Si hay notas escritas para esta versión (notas-<versión>.md), van en la release en vez de las de arriba.
    archivo_notas = AQUI / f"notas-{version}.md"
    if archivo_notas.is_file():
        notas = archivo_notas.read_text(encoding="utf-8")
    if shutil.which("gh"):
        existe = subprocess.run(["gh", "release", "view", tag, "--repo", repo], capture_output=True).returncode == 0
        if existe:
            cmd = ["gh", "release", "upload", tag, *map(str, zips), "--repo", repo, "--clobber"]
            if archivo_notas.is_file():
                subprocess.run(["gh", "release", "edit", tag, "--repo", repo, "--notes-file", str(archivo_notas)])
        else:
            cmd = ["gh", "release", "create", tag, *map(str, zips), "--repo", repo, "--prerelease",
                   "--title", titulo, "--notes", notas]
        print(f"{'Actualizando' if existe else 'Creando'} la pre-release {tag} en GitHub...")
        if subprocess.run(cmd).returncode != 0:
            print("gh no pudo. Si es la primera vez, haz antes: gh auth login")
            return
        print(f"Listo: https://github.com/{repo}/releases/tag/{tag}")
        return
    print("No tienes GitHub CLI (gh), así que la pre-release se crea a mano:")
    print(f"  1. Se abre la página de nueva release con el tag {tag}, el título y la casilla de pre-release puestos.")
    webbrowser.open(f"https://github.com/{repo}/releases/new?tag={quote(tag)}&title={quote(titulo)}"
                    f"&body={quote(notas)}&prerelease=1")
    print(f"  2. Arrastra estos zips de la carpeta que se abre: {', '.join(z.name for z in zips)}")
    print("  3. Comprueba que está marcada «Set as a pre-release» y pulsa Publish release.")
    if hasattr(os, "startfile") and zips:
        os.startfile(zips[0].parent)
    input("\nCuando esté publicada, pulsa Enter para terminar...")


def main_prueba(cfg, version, solo, sin_subir, canal=None):
    """Versión de prueba: los packs van a <canal>/packs/<id>/ y los zips de Prism a <canal>/descargas/ (prueba/ o
    pre-release/). No toca packs/, descargas/, datos.json ni la versión de variantes.json: quien tiene el pack
    publicado no recibe nada. La pre-release, además, crea su release de GitHub marcada como pre-release."""
    canal = canal or CANALES["prueba"]
    variantes = [v for v in cfg["variantes"] if not solo or v["id"] in solo]
    if not variantes:
        sys.exit("Ninguna versión se llama " + ", ".join(solo))
    mc, loader, loader_ver, addons = leer_instancia()
    print(f"{canal['nombre'].upper()} {version} · Minecraft {mc} · {loader} {loader_ver} · leyendo la instancia...")
    items = escanear(cfg, addons)
    raiz = AQUI / canal["carpeta"] / "packs"
    zips, manuales_todos = [], {}
    for v in variantes:
        cuenta, manuales = construir_variante(cfg, v, items, version, mc, loader, loader_ver, raiz=raiz)
        zips.append(crear_instancia_prism(cfg, v, mc, loader, loader_ver, canal=canal))
        manuales_todos.update({it.rel: it for it in manuales})
        print(f"  {v['nombre']:<11} {cuenta['cf']:>3} de CurseForge · {cuenta['mr']:>3} de Modrinth · {cuenta['archivo']:>3} copiados")
    if manuales_todos:
        print("  Se bajan a mano:", ", ".join(it.nombre for it in sorted(manuales_todos.values(), key=lambda it: it.nombre)))
    if not sin_subir:
        subir_prueba(version, canal)
    base = cfg["url_base"].rstrip("/")
    print(f"Listo: {canal['nombre']} {version}" + (" generada (sin subir)." if sin_subir else " subida. GitHub Pages tarda ~10 min en servirla."))
    for z in zips:
        print(f"  Zip para Prism: {z}")
        print(f"     o desde la web: {base}/{canal['carpeta']}/descargas/{quote(z.name)}")
    if canal is CANALES["pre"] and not sin_subir:
        crear_prerelease(cfg, version, zips)


def siguiente_version(v):
    partes = v.split(".")
    return ".".join(partes[:-1] + [str(int(partes[-1]) + 1)]) if partes[-1].isdigit() else v


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("version", nargs="?")
    ap.add_argument("--sin-subir", action="store_true", help="solo genera los packs, no hace commit ni push")
    ap.add_argument("--solo-datos", action="store_true", help="solo rehace datos.json para la web")
    ap.add_argument("--prueba", action="store_true", help="versión de prueba en prueba/ (no toca la publicada)")
    ap.add_argument("--pre", action="store_true", help="pre-release en pre-release/ y release de GitHub marcada como pre-release")
    ap.add_argument("--solo", nargs="+", help="con --prueba o --pre: solo esas versiones (ultra-low, lite, media-lite, media, detallada)")
    args = ap.parse_args()

    ruta_cfg = AQUI / "variantes.json"
    cfg = json.loads(ruta_cfg.read_text(encoding="utf-8"))
    if args.solo_datos:
        solo_datos(cfg)
        return
    version = args.version
    if args.pre:
        if args.prueba:
            sys.exit("--pre y --prueba no van juntos")
        if not version:
            sugerida = "2.0-pre1"
            version = input(f"Versión de la pre-release (la publicada es {cfg['version']}) [{sugerida}]: ").strip() or sugerida
        main_prueba(cfg, version, args.solo, args.sin_subir, CANALES["pre"])
        return
    if args.prueba:
        if not version:
            sugerida = f"{siguiente_version(cfg['version'])}-prueba"
            version = input(f"Versión de prueba (la publicada es {cfg['version']}) [{sugerida}]: ").strip() or sugerida
        main_prueba(cfg, version, args.solo, args.sin_subir)
        return
    if args.solo:
        sys.exit("--solo solo vale con --prueba o --pre")
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

    escribir_datos(cfg, version, mc, loader, loader_ver, resumen, manuales_web(manuales_todos))
    cfg["version"] = version
    ruta_cfg.write_text(json.dumps(cfg, indent=2, ensure_ascii=False) + "\n", encoding="utf-8", newline="\n")

    if args.sin_subir:
        print(f"Listo: versión {version} generada en {AQUI / 'packs'} (sin subir).")
    else:
        subir(version)
        print(f"Listo: versión {version} publicada. Tus amigos la reciben al abrir el juego (puede tardar ~10 min).")


if __name__ == "__main__":
    main()
