"""Comprueba que las recetas del arsenal de la guía coinciden con las del datapack y que todo tiene icono.

USO
    python3 verificar-arsenal.py --instancia RUTA --install RUTA

Lee las recetas de los datapacks del pack (packs/detallada/moonlight-global-datapacks/infectcozy-*.zip):
el arsenal, la Netherita templada, la enderita y el Yunque del Abismo. Para cada una busca en la guía la
receta con el mismo resultado y compara casilla por casilla, traduciendo los nombres de la guía a ids con
los mismos lang y el mismo MAPEO_MANUAL que iconos.py.

Después lista los nombres de recetas, fichas de objetos y diagramas que no tienen icono en iconos.json
(salvo los GENERICOS). Sale con código 1 si encuentra algún problema.
"""
import argparse
import glob
import json
import os
import sys
import unicodedata
import zipfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import iconos  # noqa: E402

RECETAS = (
    "data/infectcozy/recipe/arsenal/",
    "data/infectcozy/recipe/clases/netherita_templada.json",
    "data/infectcozy/recipe/enderita.json",
    "data/infectcozy/recipe/yunque_del_abismo.json",
)


def plano(t):
    t = unicodedata.normalize("NFD", t.lower())
    return "".join(c for c in t if unicodedata.category(c) != "Mn").strip()


def recetas_del_pack(carpeta):
    out = []
    for z in sorted(glob.glob(os.path.join(carpeta, "infectcozy-*.zip"))):
        zf = zipfile.ZipFile(z)
        for n in zf.namelist():
            if n.endswith(".json") and any(n.startswith(r) for r in RECETAS):
                out.append((os.path.basename(z) + ":" + n, json.loads(zf.read(n))))
    return out


def ingrediente(i):
    """Id del ingrediente; las etiquetas se devuelven como '#etiqueta'."""
    if isinstance(i, list):
        i = i[0]
    return i["item"] if "item" in i else "#" + i["tag"]


def nombre_resultado(r, langs):
    comp = r["result"].get("components", {})
    if "minecraft:custom_name" in comp:
        return json.loads(comp["minecraft:custom_name"])["text"]
    ns, idd = r["result"]["id"].split(":")
    for lang in ("es_es", "en_us"):
        for clave in ("item.%s.%s" % (ns, idd), "block.%s.%s" % (ns, idd)):
            if clave in langs[lang]:
                return langs[lang][clave][0]
    return r["result"]["id"]


def main():
    aqui = os.path.dirname(os.path.abspath(__file__))
    raiz = os.path.abspath(os.path.join(aqui, "..", ".."))
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--instancia", required=True)
    ap.add_argument("--install", required=True)
    ap.add_argument("--datapacks", default=os.path.join(raiz, "packs", "detallada", "moonlight-global-datapacks"))
    args = ap.parse_args()

    web = os.path.join(raiz, "web")
    secciones = os.path.join(web, "src", "guia", "secciones")
    recursos, jars = iconos.montar_recursos(args.instancia, args.install, con_packs=False)
    langs = iconos.leer_langs(args.instancia, args.install, jars)
    inv = iconos.indice_inverso(langs)

    def id_de(nombre):
        return iconos.buscar_id(nombre, inv, recursos)[0] if nombre else None

    guia = {}
    for r in iconos.leer_recetas(secciones):
        guia.setdefault(plano(r.get("resultado") or r["nombre"]), []).append(r)

    problemas = 0
    for origen, r in recetas_del_pack(args.datapacks):
        nombre = nombre_resultado(r, langs)
        candidatas = guia.get(plano(nombre), [])
        if not candidatas:
            print("FALTA EN LA GUÍA  %-36s (%s)" % (nombre, origen))
            problemas += 1
            continue
        if r["type"] == "minecraft:crafting_shaped":
            esperado = [[ingrediente(r["key"][c]) if c != " " else None for c in fila] for fila in r["pattern"]]
            ok = any([[id_de(c) for c in fila] for fila in g.get("forma") or []] == esperado for g in candidatas)
        else:
            esperado = sorted(ingrediente(i) for i in r["ingredients"])
            # En la guía una etiqueta se muestra con un objeto de ejemplo que pertenece a ella.
            ok = False
            for g in candidatas:
                ids = sorted(id_de(c) for c in g.get("ingredientes") or [])
                if len(ids) == len(esperado) and all(e == i or e.startswith("#") for e, i in zip(esperado, ids)):
                    ok = True
        print("%-4s %-36s (%s)" % ("OK" if ok else "MAL", nombre, origen))
        if not ok:
            print("     datapack:", esperado)
            for g in candidatas:
                print("     guía:    ", g.get("forma") or g.get("ingredientes"))
            problemas += 1

    mapa = json.load(open(os.path.join(web, "src", "guia", "iconos.json"), encoding="utf-8"))
    sin = [n for n in iconos.nombres_de_guia(secciones) if n not in mapa and n not in iconos.GENERICOS]
    for n in sin:
        print("SIN ICONO        ", n)
    print("\n%d problemas en recetas, %d nombres sin icono" % (problemas, len(sin)))
    sys.exit(1 if problemas or sin else 0)


if __name__ == "__main__":
    main()
