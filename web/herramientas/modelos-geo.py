#!/usr/bin/env python3
"""Convierte los modelos GeckoLib (.geo.json) de los jefes al formato del visor web (src/modelos/formato.ts).

Uso:  python3 modelos-geo.py [--mods <carpeta de mods>] [--salida <public/modelos>] [ids...]

Lee el .geo.json y la textura directamente de los .jar de los mods y escribe <id>.json + <id>.png
(y <id>_brillo.png si el jefe tiene huesos que brillan).

La geometría replica GeckoLib 4.9.3 (rama 1.21.1 de bernie-g/geckolib):
  - BakedModelFactory.Builtin.constructBone / constructCube (espejo del eje X, signos de las rotaciones, inflate),
  - BakedModelFactory.buildQuad + VertexSet + GeoQuad.build (UV de caja y por cara, mirror, uv_rotation),
  - GeoRenderer.renderRecursively / renderCube + RenderUtil (pivote, Rz·Ry·Rx, escala).
Unidades: píxeles del modelo (GeckoLib divide entre 16; el visor también).
"""
import argparse
import json
import math
import os
import sys
import zipfile

# --------------------------------------------------------------------------------------------------
# Jefes
# --------------------------------------------------------------------------------------------------
BOMD = "BOMD-NeoForge-1.21-1.3.3.jar"
BOMD_A = "assets/bosses_of_mass_destruction/"

JEFES = [
    {
        "id": "night-lich", "nombre": "Night Lich", "jar": BOMD,
        "geo": BOMD_A + "geo/lich.geo.json", "textura": BOMD_A + "textures/entity/lich.png",
        # LichBoneLight: luz máxima (15728880) en los huesos crown_crystals, crystal, leftEye y rightEye (y sus hijos).
        "brillo": lambda n: n in ("crown_crystals", "crystal", "leftEye", "rightEye"),
    },
    {
        "id": "void-blossom", "nombre": "Void Blossom", "jar": BOMD,
        "geo": BOMD_A + "geo/void_blossom.geo.json", "textura": BOMD_A + "textures/entity/void_blossom.png",
        # VoidBlossomBoneLight: luz máxima en los huesos cuyo nombre contiene Spike, Thorn o FlowerCenter (y sus hijos).
        "brillo": lambda n: "Spike" in n or "Thorn" in n or "FlowerCenter" in n,
    },
    {
        "id": "nether-gauntlet", "nombre": "Nether Gauntlet", "jar": BOMD,
        # GauntletTextureProvider: gauntlet.png (gauntlet_hurt.png solo al recibir daño).
        "geo": BOMD_A + "geo/gauntlet.geo.json", "textura": BOMD_A + "textures/entity/gauntlet.png",
    },
    {
        "id": "obsidilith", "nombre": "Obsidilith", "jar": BOMD,
        "geo": BOMD_A + "geo/obsidilith.geo.json", "textura": BOMD_A + "textures/entity/obsidilith.png",
        # ObsidilithBoneLight: middle_runes solo brilla durante un ataque (currentAttack > 0, con el color del ataque);
        # en reposo se dibuja con el color (0.5, 0.5, 0.5): se oscurece esa zona de la textura.
        "tinte": (lambda n: n == "middle_runes", 0.5),
    },
    {
        "id": "umvuthi", "nombre": "Umvuthi", "jar": "mowziesmobs-1.21.1-1.8.2.jar",
        "geo": "assets/mowziesmobs/geo/umvuthi.geo.json", "textura": "assets/mowziesmobs/textures/entity/umvuthi.png",
    },
    {
        "id": "valamon", "nombre": "Valamon", "jar": "macabre-0.9.2-neoforge-1.21.1.jar",
        # ValamonModel: macabre:geo/valamon.geo.json; textura macabre:textures/entities/<getTexture()> = valamon.png
        "geo": "assets/macabre/geo/valamon.geo.json", "textura": "assets/macabre/textures/entities/valamon.png",
    },
]

# --------------------------------------------------------------------------------------------------
# Utilidades
# --------------------------------------------------------------------------------------------------


def arr(a, n=3):
    """JsonUtil.jsonArrayToDoubleArray + RenderUtil.arrayToVec: null -> [0,0,0]; 1 valor -> los 3 iguales."""
    if a is None or len(a) == 0:
        return [0.0] * n
    if len(a) == 1:
        return [float(a[0])] * n
    return [float(x) for x in a[:n]]


def rot_zyx(x, y, z):
    """Matriz 3x3 de Quaternionf.rotationZYX(z, y, x) = Rz · Ry · Rx (radianes)."""
    cx, sx = math.cos(x), math.sin(x)
    cy, sy = math.cos(y), math.sin(y)
    cz, sz = math.cos(z), math.sin(z)
    rx = [[1, 0, 0], [0, cx, -sx], [0, sx, cx]]
    ry = [[cy, 0, sy], [0, 1, 0], [-sy, 0, cy]]
    rz = [[cz, -sz, 0], [sz, cz, 0], [0, 0, 1]]
    return matmul(rz, matmul(ry, rx))


def matmul(a, b):
    return [[sum(a[i][k] * b[k][j] for k in range(3)) for j in range(3)] for i in range(3)]


def aplicar(m, v):
    return [m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
            m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
            m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2]]


ROTACIONES_UV = {
    # FaceUV.Rotation.rotateUvs(u, v, uWidth, vHeight)
    0: lambda u, v, uw, vh: [u, v, uw, v, uw, vh, u, vh],
    1: lambda u, v, uw, vh: [uw, v, uw, vh, u, vh, u, v],
    2: lambda u, v, uw, vh: [uw, vh, u, vh, u, v, uw, v],
    3: lambda u, v, uw, vh: [u, vh, u, v, uw, v, uw, vh],
}


def rotacion_uv(valor):
    """FaceUV.Rotation.fromValue: values()[(value % 360) / 90] (división entera de Java)."""
    valor = int(valor or 0)
    r = int(math.fmod(valor, 360)) // 90 if valor >= 0 else -(int(math.fmod(-valor, 360)) // 90)
    if 0 <= r <= 3:
        return r
    return (math.floor(abs(valor) / 90) * 90 % 360) // 90


# --------------------------------------------------------------------------------------------------
# Cubos: BakedModelFactory.Builtin.constructCube + buildQuads + GeoRenderer.renderCube
# --------------------------------------------------------------------------------------------------


def caras_cubo(cubo, inflado_hueso, tw, th):
    """Devuelve una lista de caras [(vertices[4], uvs[4])] en coordenadas absolutas del modelo (píxeles)."""
    espejo = cubo.get("mirror") is True
    if cubo.get("inflate") is not None:
        crecer = float(cubo["inflate"])
    else:
        crecer = float(inflado_hueso) if inflado_hueso is not None else 0.0
    tam = arr(cubo.get("size"))
    org = arr(cubo.get("origin"))
    giro = arr(cubo.get("rotation"))
    piv = arr(cubo.get("pivot"))

    # origin = (-(origin.x + size.x), origin.y, origin.z)
    x0, y0, z0 = -(org[0] + tam[0]), org[1], org[2]
    x1, y1, z1 = x0 + tam[0], y0 + tam[1], z0 + tam[2]
    i = crecer
    # VertexSet(origin, vertexSize, inflation)
    BLBk = (x0 - i, y0 - i, z0 - i)
    BRBk = (x0 - i, y0 - i, z1 + i)
    TLBk = (x0 - i, y1 + i, z0 - i)
    TRBk = (x0 - i, y1 + i, z1 + i)
    TLF = (x1 + i, y1 + i, z0 - i)
    TRF = (x1 + i, y1 + i, z1 + i)
    BLF = (x1 + i, y0 - i, z0 - i)
    BRF = (x1 + i, y0 - i, z1 + i)
    quad = {
        "west": [TRBk, TLBk, BLBk, BRBk],
        "east": [TLF, TRF, BRF, BLF],
        "north": [TLBk, TLF, BLF, BLBk],
        "south": [TRF, TRBk, BRBk, BRF],
        "up": [TRBk, TRF, TLF, TLBk],
        "down": [BLBk, BLF, BRF, BRBk],
    }

    def vertices(dir_, caja):
        # VertexSet.verticesForQuad(direction, boxUv, mirror)
        if dir_ == "west":
            return quad["east"] if espejo else quad["west"]
        if dir_ == "east":
            return quad["west"] if espejo else quad["east"]
        if dir_ == "up":
            return quad["down"] if (espejo and not caja) else quad["up"]
        if dir_ == "down":
            return quad["up"] if (espejo and not caja) else quad["down"]
        return quad[dir_]

    uv = cubo.get("uv")
    caras = []
    for dir_ in ("west", "east", "north", "south", "up", "down"):  # orden de buildQuads
        if isinstance(uv, dict):
            cara = uv.get(dir_)
            if cara is None:
                continue
            u, v = arr(cara.get("uv"), 2)
            us, vs = arr(cara.get("uv_size"), 2)
            rot = rotacion_uv(cara.get("uv_rotation", 0))
            vs_ = vertices(dir_, False)
        else:
            b = arr(uv, 2)
            sx, sy, sz = (math.floor(t) for t in tam)
            u, v, us, vs = {
                "west": (b[0] + sz + sx, b[1] + sz, sz, sy),
                "east": (b[0], b[1] + sz, sz, sy),
                "north": (b[0] + sz, b[1] + sz, sx, sy),
                "south": (b[0] + sz + sx + sz, b[1] + sz, sx, sy),
                "up": (b[0] + sz, b[1], sx, sz),
                "down": (b[0] + sz + sx, b[1] + sz, sx, -sz),
            }[dir_]
            rot = 0
            vs_ = vertices(dir_, True)
        # GeoQuad.build
        uw = (u + us) / tw
        vh = (v + vs) / th
        u /= tw
        v /= th
        if not espejo:
            u, uw = uw, u
        uvs = ROTACIONES_UV[rot](u, v, uw, vh)
        caras.append((list(vs_), [(uvs[0], uvs[1]), (uvs[2], uvs[3]), (uvs[4], uvs[5]), (uvs[6], uvs[7])]))

    # renderCube: T(pivote) · Rz·Ry·Rx · T(-pivote), con pivote (-x, y, z) y giro (-x, -y, z) en grados
    if any(giro):
        p = (-piv[0], piv[1], piv[2])
        m = rot_zyx(math.radians(-giro[0]), math.radians(-giro[1]), math.radians(giro[2]))
        caras = [([tuple(a + b for a, b in zip(aplicar(m, [q[0] - p[0], q[1] - p[1], q[2] - p[2]]), p)) for q in vs_], uvs)
                 for vs_, uvs in caras]
    return caras


def redondear(x, n):
    r = round(x, n)
    return 0.0 if r == 0 else r


# --------------------------------------------------------------------------------------------------
# Huesos: constructBone + renderRecursively (prepMatrixForBone)
# --------------------------------------------------------------------------------------------------


def convertir(geo, ocultos=(), brillo=None, tinte=None):
    """Devuelve (raiz, caras_uv, (tw, th)).

    caras_uv: por cada cara dibujada, (rectángulo UV en píxeles, brilla, tinte). Como en
    SimpleLivingGeoRenderer.renderRecursively (BOMD), la luz y el color de un hueso pasan a sus hijos."""
    g = geo["minecraft:geometry"][0]  # GeometryTree.fromModel solo usa la primera geometría
    desc = g.get("description", {})
    tw = float(desc.get("texture_width", 16))
    th = float(desc.get("texture_height", 16))
    huesos = g.get("bones", [])
    por_nombre = {}
    for b in huesos:
        por_nombre[b.get("name")] = b
    hijos = {}
    raices = []
    for b in huesos:
        padre = b.get("parent")
        if padre is None:
            raices.append(b)
        else:
            if padre not in por_nombre:
                raise ValueError(f"hueso {b.get('name')} con padre inexistente {padre}")
            hijos.setdefault(padre, []).append(b)
    caras_uv = []

    def parte(b, brilla_padre, tinte_padre):
        nombre = b.get("name")
        brilla = brilla_padre or bool(brillo and brillo(nombre))
        tin = tinte[1] if (tinte and tinte[0](nombre)) else tinte_padre
        piv = arr(b.get("pivot"))
        giro = arr(b.get("rotation"))
        p = [redondear(-piv[0], 5), redondear(piv[1], 5), redondear(piv[2], 5)]  # updatePivot(-x, y, z)
        r = [math.radians(-giro[0]), math.radians(-giro[1]), math.radians(giro[2])]  # updateRotation(-x, -y, z)
        out = {"n": nombre, "p": p, "o": list(p)}
        if any(r):
            out["r"] = [redondear(x, 7) for x in r]
        q = []
        if b.get("neverRender") is not True:  # GeoBone.hidden = dontRender: no dibuja sus cubos (sí los hijos)
            for c in b.get("cubes", []) or []:
                for vs_, uvs in caras_cubo(c, b.get("inflate"), tw, th):
                    for (x, y, z), (u, v) in zip(vs_, uvs):
                        q += [redondear(x, 5), redondear(y, 5), redondear(z, 5), redondear(u, 7), redondear(v, 7)]
                    if nombre not in ocultos:
                        us = [u * tw for u, _ in uvs]
                        vs = [v * th for _, v in uvs]
                        caras_uv.append(((min(us), min(vs), max(us), max(vs)), brilla, tin))
        if q:
            out["q"] = q
        h = [parte(c, brilla, tin) for c in hijos.get(nombre, [])]
        if h:
            out["h"] = h
        if nombre in ocultos:
            out["oculto"] = True
        return out

    return [parte(b, False, 1.0) for b in raices], caras_uv, (int(tw), int(th))


def pixeles(rect):
    """Píxeles de la textura que cubre una cara (rectángulo UV en píxeles)."""
    a, c, b, e = rect
    if b - a < 1e-6 or e - c < 1e-6:
        return []
    return [(x, y) for y in range(math.floor(c + 1e-6), math.ceil(e - 1e-6))
            for x in range(math.floor(a + 1e-6), math.ceil(b - 1e-6))]


def texturas(png_bytes, caras_uv, factor_brillo=0.6):
    """Aplica el tinte a la textura base y crea la de brillo (solo los píxeles de las caras que brillan)."""
    from PIL import Image
    import io
    img = Image.open(io.BytesIO(png_bytes)).convert("RGBA")
    W, H = img.size
    brillo, normal, tintes = set(), set(), {}
    for rect, brilla, tin in caras_uv:
        for x, y in pixeles(rect):
            if 0 <= x < W and 0 <= y < H:
                (brillo if brilla else normal).add((x, y))
                tintes.setdefault((x, y), set()).add(tin)
    avisos = []
    if brillo & normal:
        avisos.append(f"{len(brillo & normal)} píxeles de brillo compartidos con caras que no brillan")
    px = img.load()
    base = png_bytes
    con_tinte = {k: next(iter(v)) for k, v in tintes.items() if v != {1.0}}
    if any(len(v) > 1 for v in tintes.values()):
        avisos.append("hay píxeles con tintes distintos")
    if con_tinte:
        for (x, y), t in con_tinte.items():
            r, g, b_, a_ = px[x, y]
            px[x, y] = (round(r * t), round(g * t), round(b_ * t), a_)
        buf = io.BytesIO()
        img.save(buf, "PNG")
        base = buf.getvalue()
    luz = None
    if brillo:
        out = Image.new("RGBA", img.size, (0, 0, 0, 0))
        po = out.load()
        for x, y in brillo:
            r, g, b_, a_ = px[x, y]
            if a_ > 0:
                po[x, y] = (round(r * factor_brillo), round(g * factor_brillo), round(b_ * factor_brillo), a_)
        if out.getbbox():
            buf = io.BytesIO()
            out.save(buf, "PNG")
            luz = buf.getvalue()
    return base, luz, avisos


def main():
    aqui = os.path.dirname(os.path.abspath(__file__))
    ap = argparse.ArgumentParser()
    ap.add_argument("--mods", default=os.path.normpath(os.path.join(aqui, "..", "..", "..", "mods")))
    ap.add_argument("--salida", default=os.path.normpath(os.path.join(aqui, "..", "public", "modelos")))
    ap.add_argument("--sin-brillo", action="store_true")
    ap.add_argument("ids", nargs="*")
    a = ap.parse_args()
    os.makedirs(a.salida, exist_ok=True)
    for j in JEFES:
        if a.ids and j["id"] not in a.ids:
            continue
        with zipfile.ZipFile(os.path.join(a.mods, j["jar"])) as z:
            geo = json.loads(z.read(j["geo"]).decode("utf-8"))
            png = z.read(j["textura"])
        raiz, caras_uv, (tw, th) = convertir(geo, j.get("ocultos", ()), None if a.sin_brillo else j.get("brillo"),
                                             j.get("tinte"))
        modelo = {"formato": 1, "id": j["id"], "nombre": j["nombre"], "textura": j["id"] + ".png", "yArriba": True}
        if j.get("escala", 1) != 1:
            modelo["escala"] = j["escala"]
        base, luz, avisos = texturas(png, caras_uv)
        with open(os.path.join(a.salida, j["id"] + ".png"), "wb") as f:
            f.write(base)
        if luz:
            with open(os.path.join(a.salida, j["id"] + "_brillo.png"), "wb") as f:
                f.write(luz)
            modelo["brillo"] = j["id"] + "_brillo.png"
        for av in avisos:
            print(f"  aviso ({j['id']}): {av}")
        modelo["raiz"] = raiz
        with open(os.path.join(a.salida, j["id"] + ".json"), "w", encoding="utf-8") as f:
            json.dump(modelo, f, ensure_ascii=False, separators=(",", ":"))
        caras = 0

        def contar(p):
            nonlocal caras
            caras += len(p.get("q", [])) // 20
            for h in p.get("h", []):
                contar(h)
        for p in raiz:
            contar(p)
        print(f"{j['id']}: {caras} caras, textura {tw}x{th}" + (", con brillo" if "brillo" in modelo else ""))


if __name__ == "__main__":
    main()
