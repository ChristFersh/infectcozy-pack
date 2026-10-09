"""Arma los zips completos de Infect Cozy para clientes, uno por cada versión de variantes.json
(Ultra Low, Lite, Media-Lite, Media y Detallada).

Formato de CurseForge: manifest.json + overrides/ con todos los mods dentro. Se importan en CurseForge
o en Prism, o se descomprimen para el launcher oficial. Elige los archivos con la misma lógica que
publicar.py (excluir_siempre, solo_servidor, excluir de cada versión y ajustes/<versión>/).

Uso:  python exportar_zips.py 1.6                 crea ../exportar-1.6/ con los 5 zips
      python exportar_zips.py 1.6 --solo lite     solo esa versión (se pueden poner varias)
      python exportar_zips.py 1.6 --lista         solo imprime qué lleva cada versión (JSON)

Las guías en PDF se toman de guias/ (junto a este script) y van dentro de cada zip.
"""

import argparse
import fnmatch
import json
import sys
import time
import zipfile
from pathlib import Path

AQUI = Path(__file__).resolve().parent
INSTANCIA = AQUI.parent
CARPETAS_ITEMS = ["mods", "resourcepacks", "shaderpacks", "datapacks"]
CARPETAS_COPIA = ["config", "defaultconfigs", "moonlight-global-datapacks"]
SIN_COMPRIMIR = {".jar", ".zip", ".png", ".jpg", ".ogg", ".pdf", ".gz", ".dat"}
GUIAS = ["Infect-Cozy-Guia-de-instalacion.pdf", "Infect-Cozy-Guia-del-superviviente.pdf"]

# Para quién es cada versión y qué trae (va al LEEME.txt).
PENSADA_PARA = {
    "ultra-low": [
        "PENSADA PARA: PC muy justa, con 8 GB de RAM compartidos con gráficos integrados.",
        " - Solo trae los mods que hacen falta para jugar en el servidor y los de rendimiento.",
        "   Nada estético: sin shaders, Distant Horizons, animaciones, partículas extra,",
        "   HUD decorativo, cámara ni sonido extra.",
        " - Distancia de renderizado 5, 60 FPS sin VSync y la imagen al 70 % de la resolución.",
        "   Si se ve borrosa y tu PC aguanta, abre config/renderscale.json5 dentro de la carpeta",
        "   del juego y cambia 0.7 por 1.0.",
        " - Para ver recetas usa REI (no trae JEI).",
        " - Antes de jugar cierra el navegador, Discord y otros programas: la RAM es muy justa.",
    ],
    "lite": [
        "PENSADA PARA: PC con 8 GB de RAM y gráficos integrados (Intel o AMD Radeon de la CPU).",
        " - No trae Distant Horizons, shaders, Fresh Animations ni mods de partículas o animaciones extra.",
        " - Distancia de renderizado 6 y la imagen al 80 % de la resolución para ganar FPS.",
        "   Si se ve borrosa y tu PC aguanta, abre config/renderscale.json5 dentro de la carpeta",
        "   del juego y cambia 0.8 por 1.0.",
        " - Antes de jugar cierra el navegador, Discord y otros programas: la RAM es justa.",
    ],
    "media-lite": [
        "PENSADA PARA: PC con 12 a 16 GB de RAM y tarjeta de video básica (GTX 1050 / 1650, RX 570 o similar).",
        " - Shaders Complementary ENCENDIDOS desde el inicio, en perfil \"Low\".",
        "   Para cambiarlo: Opciones -> Video -> Shader Packs -> Shader Pack Settings -> Profile.",
        "   Si va lento, pulsa K en el juego para apagar los shaders.",
        " - Sin Distant Horizons, luz dinámica, sonido 3D ni mods de partículas extra.",
        " - Mantiene Fresh Animations y las animaciones.",
    ],
    "media": [
        "PENSADA PARA: PC con 16 GB de RAM y tarjeta de video dedicada (GTX 1050 / 1650 o mejor).",
        " - Distant Horizons viene con distancia corta y un solo hilo de CPU.",
        " - Los shaders están instalados pero apagados. Si los activas (tecla K), baja la distancia",
        "   de renderizado.",
        " - Luz dinámica y sonido 3D. Sin mods de partículas extra; mantiene Fresh Animations y las animaciones.",
    ],
    "detallada": [
        "PENSADA PARA: PC potente, con 16 GB de RAM o más y una tarjeta de video dedicada buena.",
        " - Todo activado: shaders Complementary con Euphoria Patches ENCENDIDOS, Distant Horizons,",
        "   luz dinámica, sonido 3D, Fresh Animations y los mods de partículas y efectos extra.",
        " - Si va lento, pulsa K en el juego para apagar los shaders o usa la versión Media.",
    ],
}


def coincide(patrones, rel, nombre=None):
    """Igual que en publicar.py: un patrón vale como nombre del proyecto, nombre de archivo o ruta."""
    candidatos = [rel.lower(), rel.lower().rsplit("/", 1)[-1]]
    if nombre:
        candidatos.append(nombre.lower())
    for p in patrones:
        p_l = p.lower()
        if any(c == p_l or fnmatch.fnmatchcase(c, p_l) for c in candidatos):
            return True
    return False


def leer_instancia():
    mi = json.loads((INSTANCIA / "minecraftinstance.json").read_text(encoding="utf-8"))
    loader, loader_ver = mi["baseModLoader"]["name"].split("-", 1)
    nombres = {}
    for a in mi["installedAddons"]:
        f = a["installedFile"]
        for archivo in (f.get("fileNameOnDisk"), f["fileName"]):
            if archivo:
                nombres.setdefault(archivo, a["name"])
    return mi["gameVersion"], loader, loader_ver, nombres


def contenido(cfg, v, nombres):
    """{ruta dentro de overrides: archivo de origen} de una versión."""
    excluir_v = v.get("excluir", [])
    archivos = {}
    for carpeta in CARPETAS_ITEMS:
        d = INSTANCIA / carpeta
        if not d.is_dir():
            continue
        for p in sorted(d.iterdir()):
            if not p.is_file() or p.suffix == ".disabled":
                continue
            rel = f"{carpeta}/{p.name}"
            nombre = nombres.get(p.name, p.stem)
            if (coincide(cfg["excluir_siempre"], rel, nombre) or coincide(excluir_v, rel, nombre)
                    or coincide(cfg.get("solo_servidor", []), rel, nombre)):
                continue
            archivos[rel] = p
    excluir = cfg["excluir_siempre"] + excluir_v
    for carpeta in CARPETAS_COPIA:
        for p in sorted((INSTANCIA / carpeta).rglob("*")):
            rel = p.relative_to(INSTANCIA).as_posix()
            if p.is_file() and not coincide(excluir, rel):
                archivos[rel] = p
    # Los ajustes de la versión (options.txt, gráficos...) pisan a los de la instancia.
    ajustes = AQUI / "ajustes" / v["id"]
    if ajustes.is_dir():
        for p in sorted(ajustes.rglob("*")):
            if p.is_file():
                archivos[p.relative_to(ajustes).as_posix()] = p
    return dict(sorted(archivos.items()))


def gb(mb):
    return f"{mb / 1024:g}".replace(".", ",")


def leeme(cfg, v, version, mc, loader_ver, guias):
    ram = gb(v["ram_mb"])
    xmx = f"{v['ram_mb']}M" if v["ram_mb"] % 1024 else f"{v['ram_mb'] // 1024}G"
    nombres_v = [x["nombre"] for x in cfg["variantes"]]
    otras = ", ".join(nombres_v[:-1]) + " y " + nombres_v[-1] if len(nombres_v) > 1 else nombres_v[0]
    instalador = (f"https://maven.neoforged.net/releases/net/neoforged/neoforge/{loader_ver}/"
                  f"neoforge-{loader_ver}-installer.jar")
    lineas = [f"INFECT COZY {v['nombre'].upper()} {version}  -  Minecraft {mc} + NeoForge {loader_ver}"]
    if "Infect-Cozy-Guia-de-instalacion.pdf" in guias:
        lineas.append(f"Memoria recomendada: {ram} GB.  Guía de instalación con imágenes: Infect-Cozy-Guia-de-instalacion.pdf")
    else:
        lineas.append(f"Memoria recomendada: {ram} GB.")
    if "Infect-Cozy-Guia-del-superviviente.pdf" in guias:
        lineas.append("Cómo se juega (jefes, arsenal, infección): Infect-Cozy-Guia-del-superviviente.pdf")
    lineas += [""] + PENSADA_PARA.get(v["id"], [f"PENSADA PARA: {v['descripcion']}."]) + [
        "",
        "CURSEFORGE (la forma más fácil)",
        " 1. Abre CurseForge -> Minecraft -> \"Crear perfil personalizado\" (Create Custom Profile).",
        " 2. En esa ventana pulsa \"Importar\" (Import) y elige ESTE ZIP sin descomprimir.",
        f" 3. En el perfil: tres puntos -> \"Opciones del perfil\" -> desactiva \"usar la memoria del sistema\" y pon {ram} GB.",
        " 4. Pulsa Jugar. La primera carga tarda varios minutos.",
        "",
        "PRISM LAUNCHER",
        " 1. Agregar instancia -> Importar -> elige ESTE ZIP sin descomprimir.",
        f" 2. En la configuración de la instancia (pestaña Java), pon la memoria máxima en {v['ram_mb']} MB.",
        " 3. Jugar.",
        "",
        "LAUNCHER OFICIAL DE MINECRAFT",
        f" 1. Instala NeoForge {loader_ver} (Install client):",
        f"    {instalador}",
        "    (si no se abre, instala Java 21 desde adoptium.net)",
        " 2. Extrae este zip en C:\\InfectCozy",
        " 3. Launcher -> Instalaciones -> Nueva instalación:",
        f"      Versión: neoforge-{loader_ver}",
        "      Directorio del juego: C:\\InfectCozy\\overrides",
        f"      Más opciones -> Argumentos JVM: cambia -Xmx2G por -Xmx{xmx}",
        " 4. Jugar.",
        "",
        f"Las versiones {otras} sirven para el mismo servidor.",
        "",
    ]
    return "\ufeff" + "\r\n".join(lineas)


def manifest(cfg, v, version, mc, loader, loader_ver):
    return {
        "minecraft": {
            "version": mc,
            "modLoaders": [{"id": f"{loader}-{loader_ver}", "primary": True}],
            "recommendedRam": v["ram_mb"],
        },
        "manifestType": "minecraftModpack",
        "manifestVersion": 1,
        "name": f"{cfg['nombre']} {v['nombre']}",
        "version": version,
        "author": cfg["autor"],
        "files": [],
        "overrides": "overrides",
    }


def escribir_zip(destino, cfg, v, archivos, version, mc, loader, loader_ver, texto_leeme, guias):
    inicio = time.time()
    with zipfile.ZipFile(destino, "w", zipfile.ZIP_DEFLATED) as z:
        datos = manifest(cfg, v, version, mc, loader, loader_ver)
        z.writestr("manifest.json", json.dumps(datos, indent=2, ensure_ascii=False) + "\n")
        z.writestr("LEEME.txt", texto_leeme.encode("utf-8"))
        for g in guias:
            z.write(AQUI / "guias" / g, g, compress_type=zipfile.ZIP_STORED)
        for i, (rel, origen) in enumerate(archivos.items(), 1):
            modo = zipfile.ZIP_STORED if origen.suffix.lower() in SIN_COMPRIMIR else zipfile.ZIP_DEFLATED
            z.write(origen, f"overrides/{rel}", compress_type=modo)
            if i % 250 == 0:
                print(f"    {i}/{len(archivos)} archivos ({time.time() - inicio:.0f} s)", flush=True)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("version")
    ap.add_argument("--solo", nargs="+", metavar="ID", help="ids de las versiones (ultra-low, lite...)")
    ap.add_argument("--lista", action="store_true", help="solo imprime el contenido de cada versión")
    args = ap.parse_args()

    cfg = json.loads((AQUI / "variantes.json").read_text(encoding="utf-8"))
    variantes = [v for v in cfg["variantes"] if not args.solo or v["id"] in args.solo]
    if args.solo and len(variantes) != len(args.solo):
        sys.exit(f"Versiones desconocidas: {set(args.solo) - {v['id'] for v in variantes}}")
    mc, loader, loader_ver, nombres = leer_instancia()

    if args.lista:
        salida = {v["id"]: list(contenido(cfg, v, nombres)) for v in variantes}
        json.dump(salida, sys.stdout, ensure_ascii=False, indent=1)
        return

    guias = [g for g in GUIAS if (AQUI / "guias" / g).is_file()]
    for g in sorted(set(GUIAS) - set(guias)):
        print(f"Aviso: falta guias/{g}; los zips salen sin esa guía.")
    salida = INSTANCIA / f"exportar-{args.version}"
    salida.mkdir(exist_ok=True)
    print(f"Minecraft {mc} · {loader} {loader_ver} · versión {args.version} -> {salida}")
    for v in variantes:
        archivos = contenido(cfg, v, nombres)
        mods = sum(1 for r in archivos if r.startswith("mods/"))
        texto = leeme(cfg, v, args.version, mc, loader_ver, guias)
        destino = salida / f"InfectCozy-{v['nombre'].replace(' ', '-')}-{args.version}.zip"
        print(f"  {v['nombre']}: {mods} mods, {len(archivos)} archivos -> {destino.name}", flush=True)
        escribir_zip(destino, cfg, v, archivos, args.version, mc, loader, loader_ver, texto, guias)
        (salida / f"LEEME-{v['nombre'].replace(' ', '-')}.txt").write_text(texto, encoding="utf-8", newline="")
        print(f"    listo: {destino.stat().st_size / 1024**3:.2f} GB", flush=True)
    print("Listo.")


if __name__ == "__main__":
    main()
