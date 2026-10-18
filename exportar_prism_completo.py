"""Zip de Prism Launcher con la instancia COMPLETA de una versión (mods, configs, packs y datapacks dentro), para
probar cambios sin publicar: no lleva el instalador de packwiz, así que no se actualiza ni baja nada de GitHub.
Elige los archivos igual que publicar.py (excluir_siempre, excluir de la versión, solo_servidor, carpetas copiadas
y ajustes/<versión>/), pero sin red: todo sale de la instancia.

Uso:  python exportar_prism_completo.py media --version 1.7.5-prueba
      --quitar RUTA          no meter ese archivo (ruta relativa a la instancia, admite * y ?); se puede repetir
      --anadir RUTA=ARCHIVO  meter ARCHIVO como RUTA (por ejemplo una beta del mod que aún no está en mods/)
      --salida CARPETA       por defecto ../exportar-prueba-<version>/

Ojo: el zip lleva los jars tal cual. Es para pasárselo a quien vaya a probar, no para colgarlo en la web.
"""
import argparse
import fnmatch
import json
import sys
import zipfile
from pathlib import Path

AQUI = Path(__file__).resolve().parent
INSTANCIA = AQUI.parent
CARPETAS_DESCARGABLES = ["mods", "resourcepacks", "shaderpacks", "datapacks"]
CARPETAS_COPIA = ["config", "defaultconfigs", "moonlight-global-datapacks", "globalresources"]
UID_LOADER = {"neoforge": "net.neoforged", "forge": "net.minecraftforge", "fabric": "net.fabricmc.fabric-loader", "quilt": "org.quiltmc.quilt-loader"}
SIN_COMPRIMIR = {".jar", ".zip", ".png", ".ogg", ".jpg"}
ICONO = AQUI / "icono-instancia.png"  # igual que en publicar.py
ICONO_KEY = "infectcozy"


def coincide(patrones, rel, nombre=None):
    """Igual que en publicar.py: el patrón vale como nombre del proyecto, nombre de archivo o ruta."""
    candidatos = [rel.lower(), rel.lower().rsplit("/", 1)[-1]]
    if nombre:
        candidatos.append(nombre.lower())
    return any(any(c == p.lower() or fnmatch.fnmatchcase(c, p.lower()) for c in candidatos) for p in patrones)


def packs_de_la_instancia(texto, packs_version):
    """Igual que en publicar.py: pone en el options.txt de una versión la lista de resource packs activos (y su orden) de options.txt de la
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


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("variante")
    ap.add_argument("--version", required=True)
    ap.add_argument("--quitar", action="append", default=[])
    ap.add_argument("--anadir", action="append", default=[])
    ap.add_argument("--salida", type=Path)
    a = ap.parse_args()

    cfg = json.loads((AQUI / "variantes.json").read_text(encoding="utf-8"))
    v = next((x for x in cfg["variantes"] if x["id"] == a.variante), None)
    if v is None:
        sys.exit("No existe la versión " + a.variante)
    mi = json.loads((INSTANCIA / "minecraftinstance.json").read_text(encoding="utf-8"))
    loader, loader_ver = mi["baseModLoader"]["name"].split("-", 1)
    mc = mi["gameVersion"]
    nombres = {}
    for ad in mi["installedAddons"]:
        f = ad["installedFile"]
        for n in (f.get("fileNameOnDisk"), f["fileName"]):
            if n:
                nombres.setdefault(n, ad["name"])

    excluir = cfg["excluir_siempre"] + v.get("excluir", []) + a.quitar
    servidor = cfg.get("solo_servidor", [])
    archivos = {}  # ruta en .minecraft -> archivo de origen
    for carpeta in CARPETAS_DESCARGABLES:
        d = INSTANCIA / carpeta
        if not d.is_dir():
            continue
        for p in sorted(d.iterdir()):
            if not p.is_file():
                continue
            # Lo desactivado (.disabled) solo va si esta versión lo pide en "agregar" (ver publicar.py).
            desactivado = p.suffix == ".disabled"
            archivo = p.name[: -len(".disabled")] if desactivado else p.name
            rel = f"{carpeta}/{archivo}"
            nombre = nombres.get(p.name) or nombres.get(archivo) or Path(archivo).stem
            if desactivado and ((d / archivo).exists() or not coincide(v.get("agregar", []), rel, nombre)):
                continue
            if coincide(excluir, rel, nombre) or coincide(servidor, rel, nombre):
                continue
            archivos[rel] = p
    for carpeta in CARPETAS_COPIA:
        d = INSTANCIA / carpeta
        if not d.is_dir():
            continue
        for p in d.rglob("*"):
            rel = p.relative_to(INSTANCIA).as_posix()
            if p.is_file() and not coincide(excluir, rel):
                archivos[rel] = p
    ajustes = AQUI / "ajustes" / v["id"]
    if ajustes.is_dir():
        for p in ajustes.rglob("*"):
            if p.is_file():
                archivos[p.relative_to(ajustes).as_posix()] = p
    for x in a.anadir:
        rel, _, ruta = x.partition("=")
        p = Path(ruta)
        if not p.is_file():
            sys.exit("No existe " + ruta)
        archivos[rel] = p

    salida = a.salida or INSTANCIA / f"exportar-prueba-{a.version}"
    salida.mkdir(parents=True, exist_ok=True)
    nombre_inst = f"{cfg['nombre']} {v['nombre']} {a.version}"
    destino = salida / f"{nombre_inst}.zip"
    lineas = ["InstanceType=OneSix", f"name={nombre_inst}", *([f"iconKey={ICONO_KEY}"] if ICONO.is_file() else []), "OverrideMemory=true", "MinMemAlloc=1024", f"MaxMemAlloc={v['ram_mb']}"]
    jvm = v.get("jvm_args", cfg.get("jvm_args"))
    if jvm:
        lineas += ["OverrideJavaArgs=true", f"JvmArgs={jvm}"]
    mmc = {"components": [{"important": True, "uid": "net.minecraft", "version": mc}, {"uid": UID_LOADER[loader], "version": loader_ver}],
           "formatVersion": 1}
    tmp = destino.with_suffix(".zip.part")
    total = 0
    with zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("instance.cfg", "\n".join(lineas) + "\n")
        z.writestr("mmc-pack.json", json.dumps(mmc, indent=4) + "\n")
        if ICONO.is_file():
            z.write(ICONO, f"{ICONO_KEY}.png")
        packs_version = {rel.split("/", 1)[1] for rel in archivos if rel.startswith("resourcepacks/")}
        for rel in sorted(archivos):
            p = archivos[rel]
            tipo = zipfile.ZIP_STORED if p.suffix.lower() in SIN_COMPRIMIR else zipfile.ZIP_DEFLATED
            if rel == "options.txt":
                z.writestr(".minecraft/" + rel, packs_de_la_instancia(p.read_text(encoding="utf-8"), packs_version),
                           compress_type=tipo)
            else:
                z.write(p, ".minecraft/" + rel, compress_type=tipo)
            total += p.stat().st_size
    tmp.replace(destino)
    cuenta = {}
    for rel in archivos:
        cuenta[rel.split("/", 1)[0] if "/" in rel else "(raíz)"] = cuenta.get(rel.split("/", 1)[0] if "/" in rel else "(raíz)", 0) + 1
    print(f"Listo: {destino}")
    print(f"  {len(archivos)} archivos, {total / 1e9:.2f} GB sin comprimir, zip de {destino.stat().st_size / 1e9:.2f} GB")
    print("  " + ", ".join(f"{k}: {n}" for k, n in sorted(cuenta.items())))


if __name__ == "__main__":
    main()
