#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
iconos.py - Genera los iconos (PNG de 64x64) de todos los objetos que salen en las recetas de la guía web.

USO
    python3 iconos.py                 # rutas por defecto (ver abajo)
    python3 iconos.py --sin-packs     # sin los resource packs activos (solo mods + vanilla)
    python3 iconos.py --instancia RUTA --install RUTA --web RUTA
    python3 iconos.py --lista         # solo muestra nombre -> objeto, sin escribir nada
    python3 iconos.py --solo-nuevos   # pinta solo lo que falta en iconos.json, sin tocar lo que ya hay

    Requiere Python 3.10+ con Pillow y numpy (pip install pillow numpy).

RUTAS POR DEFECTO
    --web        el proyecto web: la carpeta padre de herramientas/ (donde está este archivo).
    --instancia  la instancia de Minecraft (mods/, resourcepacks/, options.txt...): dos niveles
                 por encima de --web (…/horror/_packwiz/web -> …/horror).
    --install    la carpeta Install de CurseForge (libraries/ y assets/ de Minecraft). Se busca en
                 <instancia>/../../Install y en <instancia>/../Install.

QUÉ HACE
    1. Lee las recetas de src/guia/secciones/*.ts (bloques tipo "recetas") y saca los nombres:
       huecos de `forma`, `ingredientes` y el resultado (`resultado` o, si no hay, `nombre`).
    2. Busca cada nombre en los es_es.json de Minecraft y de los mods (claves item.* y block.*),
       luego en los en_us.json, y luego el texto dentro y fuera de los paréntesis
       ("Lock Pick (ganzúa)"). Lo que no sale así, o sale en varios mods, está en MAPEO_MANUAL.
       Los nombres genéricos ("Material del jefe"...) están en GENERICOS y no llevan icono.
    3. Pinta cada objeto con su modelo, como en el inventario: los planos (item/generated) con sus
       capas; los bloques y modelos 3D en isométrico (cara de arriba más clara, laterales más
       oscuros). Usa los resource packs activos de options.txt (salvo con --sin-packs).
    4. Escribe public/iconos/<ns>__<id>.png y src/guia/iconos.json con la forma
       {"Nombre tal cual en la guía": "<ns>__<id>.png"}.

    Al añadir recetas nuevas a la guía basta con volver a ejecutarlo; si sale algún nombre en
    "SIN ICONO", añádelo a MAPEO_MANUAL (o a GENERICOS).
"""
import argparse
import glob
import io
import json
import math
import os
import re
import sys
import zipfile

import numpy as np
from PIL import Image

# ---------------------------------------------------------------------------------------------
# Datos a mano
# ---------------------------------------------------------------------------------------------

# Nombres que no son un objeto concreto: no llevan icono.
GENERICOS = {
    "Material del jefe",
    "Material de jefe del Nether",
    "Pieza de ignitio",
    "Pieza del Último Amanecer",
}

# Nombre en la guía -> id del objeto. Para los que no salen en los lang, salen en varios mods o
# son objetos del pack con nombre propio (el icono es el del objeto base).
MAPEO_MANUAL = {
    # Spore no trae es_es: nombres traducidos en la guía
    "Lámina de compuesto": "spore:compound_plate",
    "Placa de circuitos": "spore:circuit_board",
    "Restos cerebrales": "spore:brain_remnants",
    "Escáner": "spore:scanner",
    "Jeringa": "spore:syringe",
    "UAMP (B.C.U.)": "spore:container",
    # Vanilla con otro nombre en el juego
    "Chatarra de netherita": "minecraft:netherite_scrap",      # "Fragmentos de netherita"
    "Cubo de lava": "minecraft:lava_bucket",                   # "Cubo con lava"
    "Cubo de agua": "minecraft:water_bucket",                  # "Cubo con agua"
    "Arbusto seco": "minecraft:dead_bush",                     # "Arbusto muerto"
    "Membrana de phantom": "minecraft:phantom_membrane",       # "Membrana de fantasma"
    "Pilar de púrpur": "minecraft:purpur_pillar",              # "Pilar de purpur"
    "Bloque de púrpur": "minecraft:purpur_block",              # "Bloque de purpur"
    "Plantilla de mejora de netherita": "minecraft:netherite_upgrade_smithing_template",
    "Molde de mejora de ignitio": "cataclysm:ignitium_upgrade_smithing_template",
    # Ambiguos (varios mods con el mismo nombre)
    "Mochila": "sophisticatedbackpacks:backpack",              # también quark:backpack
    "Transmutation Table": "projecte:transmutation_table",     # también alexsmobs
    # Objetos del pack (datapack infectcozy-*): resultado con nombre propio sobre un objeto base
    "Rompedor de piedra base": "minecraft:carrot_on_a_stick",  # infectcozy_rb:rompedor
    "Netherita templada": "minecraft:netherite_ingot",         # clases/netherita_templada
    "Filo del Juicio": "cataclysm:the_incinerator",            # arsenal/filo_del_juicio
    "Rompemundos": "mowziesmobs:wrought_axe",                  # arsenal/rompemundos
    "Tridente del Abismo": "minecraft:trident",                # arsenal/tridente_del_abismo
    "Arco de la Maldición Eterna": "cataclysm:wrath_of_the_desert",  # arsenal/arco_maldicion_eterna
    "Poción de suerte marina": "minecraft:potion",             # pocion_suerte_marina
    "Yunque del Abismo": "minecraft:anvil",                    # yunque_del_abismo (modelo propio)
    "Yelmo del Último Amanecer": "cataclysm:ignitium_helmet",  # arsenal/ultimo_amanecer_*
    "Coraza del Último Amanecer": "cataclysm:ignitium_chestplate",
    "Coraza alada del Último Amanecer": "cataclysm:ignitium_elytra_chestplate",
    "Grebas del Último Amanecer": "cataclysm:ignitium_leggings",
    "Botas del Último Amanecer": "cataclysm:ignitium_boots",
}

# Ajustes de pintado por nombre de la guía (cuando el objeto del pack se ve distinto del base).
#   cmd: custom_model_data del resultado (elige el modelo en "overrides")
#   tinte: {índice de tinte: color RGB}
#   archivo: nombre del PNG (sin .png) si no debe ser <ns>__<id>
AJUSTES = {
    "Yunque del Abismo": {"cmd": 771001, "archivo": "infectcozy__yunque_abismo"},
    "Poción de suerte marina": {"tinte": {0: 1759403}, "archivo": "infectcozy__pocion_suerte_marina"},
}

# Colores por defecto de algunos objetos con tinte (índice de tinte -> RGB).
TINTES_POR_OBJETO = {
    "minecraft:potion": {0: 0x385DC6},
    "sophisticatedbackpacks:backpack": {0: 0xCC613A, 1: 0x622E1A},
    "sophisticatedbackpacks:iron_backpack": {0: 0xCC613A, 1: 0x622E1A},
}

# Objetos con modelo especial (builtin/entity): textura plana a usar en su lugar.
# (El incinerador y los arcos de Cataclysm no la necesitan: el resource pack activo "Cataclysm
# Reimagined" les da un modelo plano para la GUI. Con --sin-packs se quedan sin icono, porque las
# texturas item/*.png de Cataclysm son de modelo de entidad, no iconos.)
TEXTURA_PLANA = {}

# Objetos con modelo especial que se dibujan con otro modelo parecido (aproximación).
MODELO_APROXIMADO = {
    # El yunque de fusión mecánica se pinta con un modelo de entidad; se aproxima con la forma
    # del yunque vanilla y texturas de netherita.
    "cataclysm:mechanical_fusion_anvil": {
        "parent": "minecraft:block/anvil",
        "textures": {"body": "minecraft:block/netherite_block", "top": "minecraft:block/netherite_block",
                     "particle": "minecraft:block/netherite_block"},
    },
}

# Partes del modelo de la mochila de Sophisticated Backpacks (loader propio).
PARTES_MOCHILA = ["backpack_base", "backpack_front_pouch", "backpack_left_pouch", "backpack_right_pouch"]

TAM = 64            # tamaño final del icono
SUPER = 4           # supermuestreo para los modelos 3D
FORMATO_PACK = 34   # pack_format de 1.21.1

# ---------------------------------------------------------------------------------------------
# Recetas de la guía
# ---------------------------------------------------------------------------------------------

def _saltar_cadena(s, i):
    q = s[i]
    j = i + 1
    while s[j] != q:
        j += 2 if s[j] == "\\" else 1
    return j + 1


def _ts_a_json(s):
    """Convierte un literal de TypeScript (objetos/arrays con claves sin comillas) a JSON."""
    out = []
    i, n = 0, len(s)
    while i < n:
        c = s[i]
        if c in "\"'`":
            j = _saltar_cadena(s, i)
            cuerpo = s[i + 1:j - 1]
            if c != '"':
                cuerpo = cuerpo.replace("\\" + c, c).replace('"', '\\"')
            out.append('"' + cuerpo + '"')
            i = j
            continue
        if s.startswith("//", i):
            i = s.index("\n", i)
            continue
        m = re.match(r"([A-Za-z_]\w*)\s*:", s[i:])
        if m and (not out or not re.match(r"\w", out[-1][-1:])):
            out.append('"' + m.group(1) + '":')
            i += m.end()
            continue
        out.append(c)
        i += 1
    return re.sub(r",(\s*[\]}])", r"\1", "".join(out))


def leer_recetas(carpeta, tipo="recetas"):
    """Los items de todos los bloques {tipo: "<tipo>", items: [...]} de las secciones."""
    recetas = []
    for f in sorted(glob.glob(os.path.join(carpeta, "*.ts"))):
        s = open(f, encoding="utf-8").read()
        for m in re.finditer(r'tipo:\s*"%s"\s*,\s*items:\s*\[' % tipo, s):
            i = m.end() - 1
            j, prof = i, 0
            while True:
                c = s[j]
                if c in "\"'`":
                    j = _saltar_cadena(s, j)
                    continue
                if c == "[":
                    prof += 1
                elif c == "]":
                    prof -= 1
                    if prof == 0:
                        break
                j += 1
            recetas += json.loads(_ts_a_json(s[i:j + 1]))
    return recetas


def nombres_de_recetas(recetas):
    nombres = []
    for r in recetas:
        for fila in r.get("forma") or []:
            nombres += [c for c in fila if c]
        nombres += r.get("ingredientes") or []
        nombres.append(r.get("resultado") or r["nombre"])
    return list(dict.fromkeys(nombres))


def nombres_de_guia(carpeta):
    """Todos los nombres que llevan icono: recetas, fichas de objetos y nodos de los diagramas."""
    nombres = nombres_de_recetas(leer_recetas(carpeta))
    nombres += [o.get("icono") or o["nombre"] for o in leer_recetas(carpeta, "objetos")]
    for f in sorted(glob.glob(os.path.join(carpeta, "*.ts"))):
        nombres += re.findall(r'\bicono:\s*"([^"]+)"', open(f, encoding="utf-8").read())
    return list(dict.fromkeys(nombres))

# ---------------------------------------------------------------------------------------------
# Recursos (vanilla + mods + resource packs)
# ---------------------------------------------------------------------------------------------

def _rango_formatos(e):
    f = e.get("formats", e.get("supported_formats"))
    if isinstance(f, int):
        return f, f
    if isinstance(f, list) and len(f) == 2:
        return f[0], f[1]
    if isinstance(f, dict):
        return f.get("min_inclusive", 0), f.get("max_inclusive", 9999)

    def num(x):
        return x[0] if isinstance(x, list) else x
    if "min_format" in e or "max_format" in e:
        return num(e.get("min_format", 0)), num(e.get("max_format", 9999))
    return None


class Recursos:
    def __init__(self):
        self.idx = {}       # "assets/ns/..." -> (zip, nombre dentro del zip)
        self.zips = {}
        self.orden = []     # fuentes, de menor a mayor prioridad

    def zip(self, ruta):
        if ruta not in self.zips:
            self.zips[ruta] = zipfile.ZipFile(ruta)
        return self.zips[ruta]

    def agregar(self, ruta, prefijo="", overlays=False, etiqueta=None):
        """Añade un zip/jar (o una carpeta dentro de él) encima de lo que ya hay."""
        try:
            z = self.zip(ruta)
        except Exception as e:  # noqa: BLE001
            print("  ! no se pudo abrir", ruta, e)
            return
        nombres = z.namelist()
        capas = [prefijo]
        if overlays:
            try:
                meta = json.loads(z.read(prefijo + "pack.mcmeta").decode("utf-8-sig"))
                for e in (meta.get("overlays") or {}).get("entries", []):
                    r = _rango_formatos(e)
                    if r and r[0] <= FORMATO_PACK <= r[1]:
                        capas.append(prefijo + e["directory"].strip("/") + "/")
            except Exception:  # noqa: BLE001
                pass
        for capa in capas:
            for n in nombres:
                if n.startswith(capa + "assets/") and not n.endswith("/"):
                    self.idx[n[len(capa):]] = (ruta, n)
        self.orden.append(etiqueta or os.path.basename(ruta) + (":" + prefijo if prefijo else ""))

    def existe(self, ruta):
        return ruta in self.idx

    def leer(self, ruta):
        f = self.idx.get(ruta)
        if not f:
            return None
        return self.zip(f[0]).read(f[1])

    def json(self, ruta):
        b = self.leer(ruta)
        if b is None:
            return None
        try:
            return json.loads(b.decode("utf-8-sig"))
        except Exception:  # noqa: BLE001
            try:
                return json.loads(re.sub(r",(\s*[\]}])", r"\1", b.decode("utf-8-sig")))
            except Exception:  # noqa: BLE001
                return None


def rl(s, defecto="minecraft"):
    s = s.strip()
    return s if ":" in s else defecto + ":" + s


def montar_recursos(instancia, install, con_packs=True):
    r = Recursos()
    vj = glob.glob(os.path.join(install, "libraries/net/minecraft/client/1.21.1-*/client-1.21.1-*-extra.jar"))
    if not vj:
        sys.exit("No encuentro el client-1.21.1-*-extra.jar dentro de " + install)
    r.agregar(vj[0], etiqueta="vanilla")
    jars = sorted(glob.glob(os.path.join(instancia, "mods", "*.jar")))
    for j in jars:
        r.agregar(j)
    if not con_packs:
        return r, jars
    for g in sorted(glob.glob(os.path.join(instancia, "globalresources", "*.zip"))):
        r.agregar(g, overlays=True)
    opciones = os.path.join(instancia, "options.txt")
    activos = []
    if os.path.exists(opciones):
        for linea in open(opciones, encoding="utf-8", errors="replace"):
            if linea.startswith("resourcePacks:"):
                activos = json.loads(linea.split(":", 1)[1])
    for p in activos:  # el último de la lista es el de más prioridad
        if p.startswith("file/"):
            ruta = os.path.join(instancia, "resourcepacks", p[5:])
            if os.path.isfile(ruta):
                r.agregar(ruta, overlays=True)
        elif p.startswith("mod/") and ":" in p:
            modid, carpeta = p[4:].split(":", 1)
            pref = carpeta.strip("/") + "/"
            for j in jars:
                z = r.zip(j)
                if any(n.startswith(pref + "assets/") for n in z.namelist()):
                    r.agregar(j, prefijo=pref, overlays=True, etiqueta=p)
                    break
    return r, jars

# ---------------------------------------------------------------------------------------------
# Nombres -> id
# ---------------------------------------------------------------------------------------------

def leer_langs(instancia, install, jars):
    langs = {"es_es": {}, "en_us": {}}

    def cargar(lang, datos, fuente):
        for k, v in datos.items():
            if isinstance(v, str) and k not in langs[lang]:
                langs[lang][k] = (v, fuente)

    vj = glob.glob(os.path.join(install, "libraries/net/minecraft/client/1.21.1-*/client-1.21.1-*-extra.jar"))[0]
    z = zipfile.ZipFile(vj)
    cargar("en_us", json.loads(z.read("assets/minecraft/lang/en_us.json")), "vanilla")
    # índice de assets de 1.21.1 = 17.json; si no está, el de número más alto
    indices = glob.glob(os.path.join(install, "assets", "indexes", "*.json"))
    indices.sort(key=lambda p: (os.path.basename(p) != "17.json",
                                -int(re.sub(r"\D", "", os.path.basename(p)) or 0)))
    for ind in indices:
        try:
            h = json.load(open(ind))["objects"]["minecraft/lang/es_es.json"]["hash"]
            ruta = os.path.join(install, "assets", "objects", h[:2], h)
            if os.path.exists(ruta):
                cargar("es_es", json.load(open(ruta, encoding="utf-8")), "vanilla")
                break
        except Exception:  # noqa: BLE001
            continue
    for j in jars:
        try:
            z = zipfile.ZipFile(j)
        except Exception:  # noqa: BLE001
            continue
        for n in z.namelist():
            m = re.match(r"assets/([^/]+)/lang/(es_es|en_us)\.json$", n)
            if m:
                try:
                    datos = json.loads(z.read(n).decode("utf-8-sig"))
                except Exception:  # noqa: BLE001
                    try:
                        datos = json.loads(re.sub(r",(\s*[\]}])", r"\1", z.read(n).decode("utf-8-sig")))
                    except Exception:  # noqa: BLE001
                        continue
                cargar(m.group(2), datos, os.path.basename(j))
    return langs


def _limpiar(t):
    return re.sub(r"§.", "", t).strip().lower()


def indice_inverso(langs):
    inv = {}
    for lang in ("es_es", "en_us"):
        for k, (v, _f) in langs[lang].items():
            m = re.match(r"^(item|block)\.([a-z0-9_.-]+?)\.([a-z0-9_/-]+)$", k)
            if m and "." not in m.group(3):
                inv.setdefault((lang, _limpiar(v)), []).append(m.group(2) + ":" + m.group(3))
    return inv


def buscar_id(nombre, inv, recursos):
    """Devuelve (id, nota). nota explica dudas (ambiguo, etc.)."""
    if nombre in MAPEO_MANUAL:
        return MAPEO_MANUAL[nombre], "manual"
    intentos = [nombre]
    m = re.match(r"^(.*?)\s*\((.*)\)\s*$", nombre)
    if m:
        intentos += [m.group(2), m.group(1)]
    for texto in intentos:
        for lang in ("es_es", "en_us"):
            cands = list(dict.fromkeys(inv.get((lang, _limpiar(texto)), [])))
            cands = [c for c in cands if recursos.existe("assets/%s/models/item/%s.json" % tuple(c.split(":")))]
            if not cands:
                continue
            vanilla = [c for c in cands if c.startswith("minecraft:")]
            if vanilla:
                return vanilla[0], lang
            ns = {c.split(":")[0] for c in cands}
            nota = lang if len(ns) == 1 else lang + ", ambiguo: " + ", ".join(cands)
            return cands[0], nota
    return None, "no encontrado"

# ---------------------------------------------------------------------------------------------
# Modelos
# ---------------------------------------------------------------------------------------------

class Pintor:
    def __init__(self, recursos):
        self.r = recursos
        self.cache_tex = {}

    # -- texturas ------------------------------------------------------------------------------
    def textura(self, nombre):
        """RL de textura -> imagen RGBA (primer fotograma si es animada) o None."""
        nombre = rl(nombre)
        if nombre in self.cache_tex:
            return self.cache_tex[nombre]
        ns, p = nombre.split(":", 1)
        datos = self.r.leer("assets/%s/textures/%s.png" % (ns, p))
        img = None
        if datos is not None:
            img = Image.open(io.BytesIO(datos)).convert("RGBA")
            meta = self.r.json("assets/%s/textures/%s.png.mcmeta" % (ns, p))
            anim = (meta or {}).get("animation")
            w, h = img.size
            if anim is not None or h > w:
                lado = min(w, h)
                fw = anim.get("width", lado) if anim else lado
                fh = anim.get("height", lado) if anim else lado
                if anim and "width" in anim and "height" not in anim:
                    fh = h if h < w else fw
                indice = 0
                frames = (anim or {}).get("frames")
                if frames:
                    f0 = frames[0]
                    indice = f0.get("index", 0) if isinstance(f0, dict) else int(f0)
                cols = max(1, w // fw)
                x, y = (indice % cols) * fw, (indice // cols) * fh
                img = img.crop((x, y, x + fw, y + fh))
        self.cache_tex[nombre] = img
        return img

    # -- modelos -------------------------------------------------------------------------------
    def modelo(self, nombre):
        nombre = rl(nombre)
        ns, p = nombre.split(":", 1)
        return self.r.json("assets/%s/models/%s.json" % (ns, p))

    def resolver(self, m, profundidad=0):
        """Sigue la cadena de padres. Devuelve dict con textures, elements, display_gui,
        gui_light, tipo ('generated' | 'elements' | 'builtin' | None)."""
        cadena = []
        tipo = None
        cur = m
        while cur is not None and len(cadena) < 40:
            if cur.get("loader") in ("neoforge:separate_transforms", "forge:separate_transforms"):
                sub = (cur.get("perspectives") or {}).get("gui") or cur.get("base")
                if sub is not None and profundidad < 5:
                    # El modelo de la GUI manda (es un modelo completo por sí mismo).
                    return self.resolver(sub, profundidad + 1)
            cadena.append(cur)
            padre = cur.get("parent")
            if not padre:
                break
            padre = rl(padre)
            if padre == "minecraft:builtin/generated":
                tipo = "generated"
                break
            if padre == "minecraft:builtin/entity":
                tipo = "builtin"
                break
            cur = self.modelo(padre)
            if cur is None:
                break
        texturas, elementos, gui, luz, loader = {}, None, None, None, None
        for c in reversed(cadena):
            texturas.update(c.get("textures") or {})
        for c in cadena:
            if elementos is None and c.get("elements"):
                elementos = c["elements"]
            if gui is None and (c.get("display") or {}).get("gui"):
                gui = c["display"]["gui"]
            if luz is None and c.get("gui_light"):
                luz = c["gui_light"]
            if loader is None and c.get("loader"):
                loader = c["loader"]
        if tipo is None and elementos:
            tipo = "elements"
        if tipo == "generated" and elementos:
            tipo = "elements"
        return {"textures": texturas, "elements": elementos, "gui": gui, "gui_light": luz,
                "tipo": tipo, "loader": loader}

    def tex_ref(self, texturas, ref, prof=0):
        if ref is None or prof > 20:
            return None
        if ref.startswith("#"):
            return self.tex_ref(texturas, texturas.get(ref[1:]), prof + 1)
        return ref

    # -- pintado plano -------------------------------------------------------------------------
    def plano(self, capas, tintes=None):
        imgs = []
        for i, t in enumerate(capas):
            img = self.textura(t) if t else None
            if img is None:
                continue
            if tintes and i in tintes:
                img = teñir(img, tintes[i])
            imgs.append(img)
        if not imgs:
            return None
        lado = max(max(i.size) for i in imgs)
        base = Image.new("RGBA", (lado, lado), (0, 0, 0, 0))
        for img in imgs:
            if img.size != (lado, lado):
                img = img.resize((lado, lado), Image.NEAREST)
            base.alpha_composite(img)
        return base.resize((TAM, TAM), Image.NEAREST)

    # -- pintado 3D ----------------------------------------------------------------------------
    def tres_d(self, res, tintes=None):
        elementos = res["elements"]
        texturas = res["textures"]
        gui = res["gui"] or {}
        rot = gui.get("rotation", [0, 0, 0])
        tra = gui.get("translation", [0, 0, 0])
        esc = gui.get("scale", [1, 1, 1])
        luz_lateral = (res.get("gui_light") or "side") != "front"
        R = rot_xyz(*rot)
        N = TAM * SUPER
        k = N / 16.0
        color = np.zeros((N, N, 4), np.float32)   # premultiplicado
        zbuf = np.full((N, N), -1e9, np.float32)
        caras = []
        for el in elementos:
            a = np.array(el["from"], float)
            b = np.array(el["to"], float)
            rot_el = el.get("rotation")
            for dirn, cara in (el.get("faces") or {}).items():
                ref = self.tex_ref(texturas, cara.get("texture"))
                if not ref:
                    continue
                img = self.textura(ref)
                if img is None:
                    continue
                esquinas = esquinas_cara(dirn, a, b)
                if esquinas is None:
                    continue
                uv = cara.get("uv") or uv_defecto(dirn, a, b)
                uvs = [(uv[0], uv[1]), (uv[2], uv[1]), (uv[2], uv[3]), (uv[0], uv[3])]
                giro = int(cara.get("rotation", 0)) // 90 % 4
                uvs = [uvs[(i - giro) % 4] for i in range(4)]
                pts = []
                for p in esquinas:
                    p = np.array(p, float)
                    if rot_el:
                        p = rotar_elemento(p, rot_el)
                    p = (p - 8.0) * np.array(esc, float)
                    p = R @ p + np.array(tra, float)
                    pts.append(p)
                pts = np.array(pts)
                normal = np.cross(pts[3] - pts[0], pts[1] - pts[0])
                largo = np.linalg.norm(normal)
                if largo < 1e-9:
                    continue
                normal /= largo
                if normal[2] <= 1e-6:
                    continue  # cara de espaldas
                if luz_lateral and el.get("shade", True):
                    brillo = 0.787 - 0.1414 * normal[0] + 0.246 * normal[1]
                else:
                    brillo = 1.0
                brillo = float(min(1.0, max(0.3, brillo)))
                tinte = None
                if "tintindex" in cara and tintes and cara["tintindex"] in tintes:
                    tinte = tintes[cara["tintindex"]]
                caras.append((pts[:, 2].mean(), pts, uvs, img, brillo, tinte))
        if not caras:
            return None
        caras.sort(key=lambda c: c[0])
        for _z, pts, uvs, img, brillo, tinte in caras:
            pintar_cara(color, zbuf, pts, uvs, img, brillo, tinte, N, k)
        # bajar de resolución (media con alfa premultiplicado)
        c = color.reshape(TAM, SUPER, TAM, SUPER, 4).mean(axis=(1, 3))
        alfa = c[..., 3:4]
        rgb = np.where(alfa > 1e-6, c[..., :3] / np.maximum(alfa, 1e-6), 0)
        out = np.concatenate([rgb, alfa], axis=-1)
        return Image.fromarray(np.clip(out * 255 + 0.5, 0, 255).astype(np.uint8), "RGBA")

    # -- objeto -> icono -----------------------------------------------------------------------
    def icono(self, oid, ajustes=None):
        ajustes = ajustes or {}
        ns, ident = oid.split(":", 1)
        tintes = dict(TINTES_POR_OBJETO.get(oid, {}))
        tintes.update(ajustes.get("tinte", {}))
        m = self.modelo("%s:item/%s" % (ns, ident))
        if m is None:
            return None, "sin modelo de objeto"
        nota = ""
        if ajustes.get("cmd") is not None:
            for ov in m.get("overrides") or []:
                if (ov.get("predicate") or {}).get("custom_model_data") == ajustes["cmd"]:
                    m = self.modelo(ov["model"]) or m
                    nota = "modelo " + ov["model"]
        if oid in MODELO_APROXIMADO:
            res = self.resolver(dict(MODELO_APROXIMADO[oid]))
            res["gui"] = self.resolver(m)["gui"] or res["gui"]
            img = self.tres_d(res, tintes)
            return img, "aproximado (modelo de entidad)"
        if m.get("loader") == "sophisticatedbackpacks:backpack" or \
                self.resolver(m).get("loader") == "sophisticatedbackpacks:backpack":
            return self.mochila(m, tintes), "mochila (partes del modelo)"
        res = self.resolver(m)
        if res["tipo"] == "generated":
            capas = []
            i = 0
            while "layer%d" % i in res["textures"]:
                capas.append(self.tex_ref(res["textures"], res["textures"]["layer%d" % i]))
                i += 1
            img = self.plano(capas, tintes)
            return img, nota or ("plano" if img else "sin textura")
        if res["tipo"] == "elements":
            img = self.tres_d(res, tintes)
            return img, nota or ("3D" if img else "sin textura")
        if res["tipo"] == "builtin":
            if oid == "minecraft:chest":
                img = self.tres_d({**cofre(), "gui": res["gui"], "gui_light": res["gui_light"]})
                return img, "cofre (modelo de entidad)"
            plana = TEXTURA_PLANA.get(oid)
            if plana is None and self.r.existe("assets/%s/textures/item/%s.png" % (ns, ident)):
                img = self.textura("%s:item/%s" % (ns, ident))
                if img is not None and max(img.size) <= 32:  # las grandes son de entidad, no iconos
                    plana = "%s:item/%s" % (ns, ident)
            if plana:
                return self.plano([plana], tintes), "plano (modelo de entidad)"
            return None, "modelo de entidad (se pinta por código), sin icono plano"
        return None, "modelo desconocido"

    def mochila(self, m, tintes):
        res = self.resolver(m)
        ns = "sophisticatedbackpacks"
        elementos = []
        texturas = {}
        for parte in PARTES_MOCHILA:
            pm = self.modelo("%s:block/%s" % (ns, parte))
            if pm is None:
                continue
            elementos += pm.get("elements") or []
            for k_, v in (pm.get("textures") or {}).items():
                texturas.setdefault(k_, v)
        # las texturas del modelo (clips de hierro, etc.) mandan sobre las de las partes
        cadena_tex = {}
        cur = m
        pila = []
        while cur is not None and len(pila) < 10:
            pila.append(cur)
            cur = self.modelo(cur["parent"]) if cur.get("parent") else None
        for c in reversed(pila):
            cadena_tex.update(c.get("textures") or {})
        texturas.update(cadena_tex)
        gui = res["gui"]
        for c in pila:
            if (c.get("display") or {}).get("gui"):
                gui = c["display"]["gui"]
                break
        return self.tres_d({"elements": elementos, "textures": texturas, "gui": gui,
                            "gui_light": "side"}, tintes)


def teñir(img, rgb):
    a = np.asarray(img).astype(np.float32)
    f = np.array([(rgb >> 16) & 255, (rgb >> 8) & 255, rgb & 255], np.float32) / 255.0
    a[..., :3] *= f
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "RGBA")


def rot_xyz(rx, ry, rz):
    """Rotación del display (grados): primero Z, luego Y, luego X (Quaternionf.rotationXYZ)."""
    x, y, z = (math.radians(v) for v in (rx, ry, rz))
    Rx = np.array([[1, 0, 0], [0, math.cos(x), -math.sin(x)], [0, math.sin(x), math.cos(x)]])
    Ry = np.array([[math.cos(y), 0, math.sin(y)], [0, 1, 0], [-math.sin(y), 0, math.cos(y)]])
    Rz = np.array([[math.cos(z), -math.sin(z), 0], [math.sin(z), math.cos(z), 0], [0, 0, 1]])
    return Rx @ Ry @ Rz


def rotar_elemento(p, rot):
    eje = rot.get("axis", "y")
    ang = math.radians(float(rot.get("angle", 0)))
    o = np.array(rot.get("origin", [8, 8, 8]), float)
    q = p - o
    c, s = math.cos(ang), math.sin(ang)
    if eje == "x":
        q = np.array([q[0], q[1] * c - q[2] * s, q[1] * s + q[2] * c])
    elif eje == "y":
        q = np.array([q[0] * c + q[2] * s, q[1], -q[0] * s + q[2] * c])
    else:
        q = np.array([q[0] * c - q[1] * s, q[0] * s + q[1] * c, q[2]])
    if rot.get("rescale") and abs(c) > 1e-6:
        f = 1.0 / abs(c)
        if eje == "x":
            q = q * np.array([1, f, f])
        elif eje == "y":
            q = q * np.array([f, 1, f])
        else:
            q = q * np.array([f, f, 1])
    return q + o


def esquinas_cara(d, a, b):
    """Esquinas (arriba-izq, arriba-der, abajo-der, abajo-izq) vistas desde fuera."""
    x0, y0, z0 = a
    x1, y1, z1 = b
    return {
        "north": [(x1, y1, z0), (x0, y1, z0), (x0, y0, z0), (x1, y0, z0)],
        "south": [(x0, y1, z1), (x1, y1, z1), (x1, y0, z1), (x0, y0, z1)],
        "west": [(x0, y1, z0), (x0, y1, z1), (x0, y0, z1), (x0, y0, z0)],
        "east": [(x1, y1, z1), (x1, y1, z0), (x1, y0, z0), (x1, y0, z1)],
        "up": [(x0, y1, z0), (x1, y1, z0), (x1, y1, z1), (x0, y1, z1)],
        "down": [(x0, y0, z1), (x1, y0, z1), (x1, y0, z0), (x0, y0, z0)],
    }.get(d)


def uv_defecto(d, a, b):
    x0, y0, z0 = a
    x1, y1, z1 = b
    return {
        "north": [16 - x1, 16 - y1, 16 - x0, 16 - y0],
        "south": [x0, 16 - y1, x1, 16 - y0],
        "west": [z0, 16 - y1, z1, 16 - y0],
        "east": [16 - z1, 16 - y1, 16 - z0, 16 - y0],
        "up": [x0, z0, x1, z1],
        "down": [x0, 16 - z1, x1, 16 - z0],
    }[d]


def pintar_cara(color, zbuf, pts, uvs, img, brillo, tinte, N, k):
    tex = np.asarray(img).astype(np.float32) / 255.0
    th, tw = tex.shape[:2]
    if tinte is not None:
        tex = tex.copy()
        tex[..., :3] *= np.array([(tinte >> 16) & 255, (tinte >> 8) & 255, tinte & 255], np.float32) / 255.0
    # a coordenadas de lienzo (y hacia abajo)
    P = np.stack([N / 2 + pts[:, 0] * k, N / 2 - pts[:, 1] * k], axis=1)
    Z = pts[:, 2]
    e1 = P[1] - P[0]
    e2 = P[3] - P[0]
    det = e1[0] * e2[1] - e1[1] * e2[0]
    if abs(det) < 1e-9:
        return
    xmin = max(0, int(math.floor(P[:, 0].min())))
    xmax = min(N, int(math.ceil(P[:, 0].max())) + 1)
    ymin = max(0, int(math.floor(P[:, 1].min())))
    ymax = min(N, int(math.ceil(P[:, 1].max())) + 1)
    if xmin >= xmax or ymin >= ymax:
        return
    ys, xs = np.mgrid[ymin:ymax, xmin:xmax]
    dx = xs + 0.5 - P[0, 0]
    dy = ys + 0.5 - P[0, 1]
    s = (dx * e2[1] - dy * e2[0]) / det
    t = (e1[0] * dy - e1[1] * dx) / det
    dentro = (s >= 0) & (s <= 1) & (t >= 0) & (t <= 1)
    if not dentro.any():
        return
    U = np.array([u for u, _v in uvs]) * tw / 16.0
    V = np.array([v for _u, v in uvs]) * th / 16.0
    u = U[0] + s * (U[1] - U[0]) + t * (U[3] - U[0])
    v = V[0] + s * (V[1] - V[0]) + t * (V[3] - V[0])
    ui = np.clip(np.floor(u), 0, tw - 1).astype(int)
    vi = np.clip(np.floor(v), 0, th - 1).astype(int)
    z = Z[0] + s * (Z[1] - Z[0]) + t * (Z[3] - Z[0])
    muestra = tex[vi, ui]
    a = muestra[..., 3]
    zona = zbuf[ymin:ymax, xmin:xmax]
    ok = dentro & (a > 0.01) & (z >= zona - 1e-4)
    if not ok.any():
        return
    rgb = muestra[..., :3] * brillo
    dst = color[ymin:ymax, xmin:xmax]
    aa = a[..., None]
    nuevo = np.concatenate([rgb * aa, aa], axis=-1) + dst * (1 - aa)
    dst[ok] = nuevo[ok]
    opaco = ok & (a > 0.5)
    zona[opaco] = z[opaco]


def cofre():
    """Cofre vanilla: modelo de entidad (textura entity/chest/normal, 64x64) como elementos."""
    def px(u0, v0, u1, v1):  # píxeles de la textura 64x64 -> uv 0..16
        return [u0 / 4, v0 / 4, u1 / 4, v1 / 4]
    t = "#c"
    return {
        "textures": {"c": "minecraft:entity/chest/normal"},
        "elements": [
            {"from": [1, 0, 1], "to": [15, 10, 15], "faces": {
                "north": {"uv": px(14, 43, 28, 33), "texture": t}, "south": {"uv": px(42, 43, 56, 33), "texture": t},
                "west": {"uv": px(0, 43, 14, 33), "texture": t}, "east": {"uv": px(28, 43, 42, 33), "texture": t},
                "down": {"uv": px(14, 19, 28, 33), "texture": t}}},
            {"from": [1, 9, 1], "to": [15, 14, 15], "faces": {
                "north": {"uv": px(14, 19, 28, 14), "texture": t}, "south": {"uv": px(42, 19, 56, 14), "texture": t},
                "west": {"uv": px(0, 19, 14, 14), "texture": t}, "east": {"uv": px(28, 19, 42, 14), "texture": t},
                "up": {"uv": px(28, 0, 42, 14), "texture": t}}},
            {"from": [7, 7, 15], "to": [9, 11, 16], "faces": {
                "south": {"uv": px(4, 5, 6, 1), "texture": t}, "east": {"uv": px(3, 5, 4, 1), "texture": t},
                "west": {"uv": px(0, 5, 1, 1), "texture": t}, "up": {"uv": px(3, 0, 5, 1), "texture": t},
                "down": {"uv": px(1, 0, 3, 1), "texture": t}}},
        ],
    }

# ---------------------------------------------------------------------------------------------
# Principal
# ---------------------------------------------------------------------------------------------

def main():
    aqui = os.path.dirname(os.path.abspath(__file__))
    ap = argparse.ArgumentParser(description="Genera los iconos de las recetas de la guía web.")
    ap.add_argument("--web", default=os.path.dirname(aqui))
    ap.add_argument("--instancia")
    ap.add_argument("--install")
    ap.add_argument("--sin-packs", action="store_true", help="no usar los resource packs activos")
    ap.add_argument("--lista", action="store_true", help="solo mostrar el mapeo, sin escribir")
    ap.add_argument("--solo-nuevos", action="store_true",
                    help="conservar los iconos que ya están en iconos.json y pintar solo los que faltan")
    args = ap.parse_args()

    web = os.path.abspath(args.web)
    instancia = os.path.abspath(args.instancia or os.path.join(web, "..", ".."))
    install = args.install
    if not install:
        for c in (os.path.join(instancia, "..", "..", "Install"), os.path.join(instancia, "..", "Install")):
            if os.path.isdir(c):
                install = c
                break
    if not install or not os.path.isdir(install):
        sys.exit("No encuentro la carpeta Install de CurseForge; pásala con --install")
    install = os.path.abspath(install)

    print("web:      ", web)
    print("instancia:", instancia)
    print("install:  ", install)

    secciones = os.path.join(web, "src", "guia", "secciones")
    nombres = nombres_de_guia(secciones)
    print("%d recetas, %d nombres distintos" % (len(leer_recetas(secciones)), len(nombres)))
    destino = os.path.join(web, "src", "guia", "iconos.json")
    previos = {}
    if args.solo_nuevos and os.path.exists(destino):
        previos = json.load(open(destino, encoding="utf-8"))
        nombres = [n for n in nombres if n not in previos]
        print("solo nuevos: %d por pintar" % len(nombres))

    recursos, jars = montar_recursos(instancia, install, con_packs=not args.sin_packs)
    print("fuentes de recursos:", len(recursos.orden))
    langs = leer_langs(instancia, install, jars)
    inv = indice_inverso(langs)
    pintor = Pintor(recursos)

    carpeta = os.path.join(web, "public", "iconos")
    mapa = {}
    hechos = {}
    sin_icono = []
    filas = []
    for nombre in nombres:
        if nombre in GENERICOS:
            sin_icono.append((nombre, "genérico"))
            continue
        oid, nota = buscar_id(nombre, inv, recursos)
        if not oid:
            sin_icono.append((nombre, nota))
            continue
        aj = AJUSTES.get(nombre, {})
        archivo = (aj.get("archivo") or oid.replace(":", "__")).lower() + ".png"
        clave = (oid, json.dumps(aj, sort_keys=True))
        if clave not in hechos:
            img, como = pintor.icono(oid, aj)
            hechos[clave] = (img, como)
        img, como = hechos[clave]
        filas.append((nombre, oid, archivo, nota, como if img else "SIN ICONO: " + como))
        if img is None:
            sin_icono.append((nombre, oid + ": " + como))
            continue
        mapa[nombre] = archivo
        if not args.lista and not (args.solo_nuevos and os.path.exists(os.path.join(carpeta, archivo))):
            os.makedirs(carpeta, exist_ok=True)
            img.save(os.path.join(carpeta, archivo))

    for f in filas:
        print("  %-36s %-46s %-40s %s | %s" % f)
    print("\n%d nombres, %d con icono, %d archivos" % (len(nombres), len(mapa), len(set(mapa.values()))))
    if sin_icono:
        print("SIN ICONO:")
        for n, porque in sin_icono:
            print("  -", n, "->", porque)
    if not args.lista:
        mapa = {**previos, **mapa}
        with open(destino, "w", encoding="utf-8") as fh:
            json.dump(mapa, fh, ensure_ascii=False, indent=2)
            fh.write("\n")
        print("\nescrito:", destino)
        print("iconos en:", carpeta)


if __name__ == "__main__":
    main()
