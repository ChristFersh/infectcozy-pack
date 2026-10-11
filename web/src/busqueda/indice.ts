import type { Novedad } from "../datos";
import { SECCIONES } from "../guia/indice";
import type { Bloque, Inline, Objeto, Receta, Subseccion } from "../guia/tipos";
import { href } from "../rutas";
import { INSTRUCCIONES } from "./instrucciones";

// Índice del buscador: la guía, las instrucciones de descargas y las novedades, aplanados en documentos cortos.
// Cada receta, objeto, fila de tabla o definición es su propio documento, para que la respuesta sea precisa;
// el resto del texto de un apartado se agrupa en trozos (se corta en los subtítulos en negrita).

export type TipoDoc = "seccion" | "texto" | "receta" | "objeto" | "tabla" | "definicion" | "jefe" | "instruccion" | "novedad";

export interface Doc {
  id: string;
  /** Miga de pan: sección › apartado › subtítulo. */
  migas: string[];
  titulo: string;
  /** Enlace con almohadilla (#/guia/4.5). */
  ruta: string;
  tipo: TipoDoc;
  /** Nombre de la receta, del objeto, del término o de la primera celda de la fila. */
  nombre?: string;
  /** Texto plano, sin marcas de negrita ni cursiva. */
  texto: string;
  /** La receta u objeto completo, para enseñarlo como respuesta directa. */
  payload?: { receta: Receta } | { objeto: Objeto };
}

const SOLO_NEGRITA = /^\*\*[^*]+\*\*$/;
/** Largo a partir del cual se empieza otro trozo de texto (en caracteres). */
const TROZO = 600;

/** Quita **negrita**, *cursiva*, `código` y saltos de línea. */
export function plano(texto: Inline): string {
  return texto
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*([^*\s][^*]*)\*/g, "$1")
    .replace(/\s*\n\s*/g, " ")
    .trim();
}

/** Todas las cadenas de un valor cualquiera (para bloques que este índice aún no conoce). */
function cadenas(valor: unknown, clave = ""): string[] {
  if (typeof valor === "string") return ["tipo", "estilo", "icono", "modelo"].includes(clave) ? [] : [plano(valor)];
  if (Array.isArray(valor)) return valor.flatMap((v) => cadenas(v));
  if (valor && typeof valor === "object") return Object.entries(valor).flatMap(([k, v]) => cadenas(v, k));
  return [];
}

function unir(partes: (string | undefined)[], sep = " · ") {
  return partes.filter((p): p is string => !!p && p.length > 0).join(sep);
}

function textoReceta(r: Receta) {
  const lista = (r.forma ? r.forma.flat() : (r.ingredientes ?? [])).filter((x): x is string => !!x);
  const cuenta = new Map<string, number>();
  for (const x of lista) cuenta.set(x, (cuenta.get(x) ?? 0) + 1);
  const ingredientes = [...cuenta].map(([n, c]) => (c > 1 ? `${n} ×${c}` : n)).join(", ");
  const resultado = `${r.resultado ?? r.nombre}${r.cantidad && r.cantidad > 1 ? ` ×${r.cantidad}` : ""}`;
  return unir([`Receta en ${r.estacion}: ${ingredientes} → ${resultado}.`, r.pie && plano(r.pie)], " ");
}

/** Va juntando el texto de un apartado y lo suelta en documentos. */
class Trozos {
  private partes: string[] = [];
  private subtitulo?: string;
  private primero = true;
  private migas: string[];
  private ruta: string;
  private salida: Doc[];

  constructor(migas: string[], ruta: string, salida: Doc[]) {
    this.migas = migas;
    this.ruta = ruta;
    this.salida = salida;
  }

  agregar(texto: string) {
    if (!texto) return;
    this.partes.push(texto);
    if (this.partes.join(" ").length > TROZO) this.soltar();
  }

  /** Un párrafo solo en negrita hace de subtítulo: empieza otro trozo. */
  titular(subtitulo: string) {
    this.soltar();
    this.subtitulo = subtitulo;
  }

  soltar() {
    if (this.partes.length === 0) return;
    const migas = this.subtitulo ? [...this.migas, this.subtitulo] : this.migas;
    this.salida.push({
      id: `${this.ruta}~${this.salida.length}`,
      migas,
      titulo: migas.join(" › "),
      ruta: this.ruta,
      // El primer trozo de un apartado lo representa a él (el título del apartado cuenta más ahí).
      tipo: this.primero && !this.subtitulo ? "seccion" : "texto",
      texto: this.partes.join(" "),
    });
    this.primero = false;
    this.partes = [];
  }
}

/** Convierte los bloques de un apartado en documentos. */
function bloques(lista: Bloque[], migas: string[], ruta: string, salida: Doc[]) {
  const trozos = new Trozos(migas, ruta, salida);
  const doc = (d: Omit<Doc, "id" | "titulo" | "ruta" | "migas">) => {
    salida.push({ ...d, migas, titulo: migas.join(" › "), ruta, id: `${ruta}~${salida.length}` });
  };

  for (const b of lista) {
    switch (b.tipo) {
      case "p":
        if (SOLO_NEGRITA.test(b.texto.trim())) trozos.titular(b.texto.trim().slice(2, -2));
        else trozos.agregar(plano(b.texto));
        break;
      case "pasos":
      case "lista":
        trozos.agregar(b.items.map(plano).join(" · "));
        break;
      case "nota":
        trozos.agregar(unir([b.titulo && `${b.titulo}:`, plano(b.texto)], " "));
        break;
      case "tabla":
        for (const fila of b.filas)
          doc({
            tipo: "tabla",
            // Si la primera celda es solo un número ("10"), el nombre lleva también su columna ("Corrupción 10").
            nombre: /^[\d\s.,%≈+-]*$/.test(plano(fila[0] ?? "")) ? `${b.columnas[0] ?? ""} ${plano(fila[0] ?? "")}`.trim() : plano(fila[0]),
            texto: fila.map((celda, i) => `${b.columnas[i] ?? ""}: ${plano(celda)}`).join(" · "),
          });
        if (b.pie) trozos.agregar(plano(b.pie));
        break;
      case "definiciones":
        for (const d of b.items) doc({ tipo: "definicion", nombre: d.termino, texto: unir([d.detalle, plano(d.texto)]) });
        break;
      case "tarjetas":
        for (const t of b.items) doc({ tipo: "definicion", nombre: t.titulo, texto: plano(t.texto) });
        break;
      case "recetas":
        for (const r of b.items) doc({ tipo: "receta", nombre: r.nombre, texto: textoReceta(r), payload: { receta: r } });
        break;
      case "objetos":
        for (const o of b.items)
          doc({ tipo: "objeto", nombre: o.nombre, texto: unir([`Sale de: ${plano(o.sale)}`, o.uso && `Se usa en: ${plano(o.uso)}`]), payload: { objeto: o } });
        break;
      case "jefes":
        for (const j of b.items) doc({ tipo: "jefe", nombre: j.nombre, texto: unir(["Jefe", j.grupo, j.detalle && plano(j.detalle)]) });
        break;
      case "estadisticas":
        trozos.agregar(unir([b.titulo, b.items.map((s) => `${s.etiqueta}: ${plano(s.valor)}`).join(" · ")], ". "));
        break;
      case "diagrama":
        trozos.agregar(
          unir(
            [
              b.titulo,
              ...b.etapas.map((e) => `${e.titulo}: ${e.nodos.map((n) => (n.detalle ? `${n.nombre} (${plano(n.detalle)})` : n.nombre)).join(", ")}`),
              b.pie && plano(b.pie),
            ],
            ". ",
          ),
        );
        break;
      case "barras": {
        const items = b.items.map((x) => unir([`${x.etiqueta}: ${x.texto ?? `${x.valor}${b.unidad ? ` ${b.unidad}` : ""}`}`, x.detalle && plano(x.detalle)], " "));
        trozos.agregar(unir([b.titulo, items.join(" · "), b.pie && plano(b.pie)], ". "));
        break;
      }
      default:
        // Un tipo de bloque nuevo que este índice aún no conoce: se indexan todas sus cadenas.
        trozos.agregar(cadenas(b as unknown).join(" · "));
    }
  }
  trozos.soltar();
}

function tituloApartado(u: Subseccion) {
  return /^\d/.test(u.id) ? `${u.id} ${u.titulo}` : u.titulo;
}

function documentosGuia(): Doc[] {
  const salida: Doc[] = [];
  for (const s of SECCIONES) {
    const seccion = `${s.id}. ${s.titulo}`;
    const ruta = href("guia", `seccion-${s.id}`);
    salida.push({ id: ruta, migas: [seccion], titulo: seccion, ruta, tipo: "seccion", nombre: s.titulo, texto: plano(s.resumen) });
    if (s.intro) bloques(s.intro, [seccion], ruta, salida);
    for (const u of s.subsecciones) {
      const antes = salida.length;
      bloques(u.bloques, [seccion, tituloApartado(u)], href("guia", u.id), salida);
      // Apartados sin texto suelto (solo recetas, por ejemplo): un documento con su título para que se pueda encontrar.
      if (!salida.slice(antes).some((d) => d.tipo === "seccion")) {
        const ruta = href("guia", u.id);
        const nombres = salida.slice(antes).map((d) => d.nombre).filter(Boolean);
        salida.push({ id: `${ruta}~titulo`, migas: [seccion, tituloApartado(u)], titulo: `${seccion} › ${tituloApartado(u)}`, ruta, tipo: "seccion", texto: nombres.join(" · ") });
      }
    }
  }
  return salida;
}

function documentosDescargas(): Doc[] {
  return INSTRUCCIONES.map((i) => {
    const titulo = i.titulo.replace(/^\d+\.\s*/, "");
    const migas = titulo === i.apartado ? ["Descargas", titulo] : ["Descargas", i.apartado, titulo];
    return {
      id: `descargas~${i.id}`,
      migas,
      titulo: migas.join(" › "),
      ruta: href("descargas", i.id),
      tipo: "instruccion" as const,
      nombre: titulo,
      texto: unir(["pasos" in i ? i.pasos.map(plano).join(" · ") : undefined, "texto" in i ? plano(i.texto) : undefined], " "),
    };
  });
}

function documentosNovedades(novedades: Novedad[]): Doc[] {
  const ruta = href("inicio", "novedades");
  return novedades.flatMap((n) => {
    const version = `Versión ${n.version}`;
    return [
      {
        id: `novedad~${n.version}`,
        migas: ["Novedades", version],
        titulo: `Novedades › ${version}`,
        ruta,
        tipo: "novedad" as const,
        nombre: n.titulo,
        texto: unir([plano(n.resumen), ...(n.destacados ?? []).map(plano)], " "),
      },
      ...n.secciones.map((s, i) => ({
        id: `novedad~${n.version}~${i}`,
        migas: ["Novedades", version, s.titulo],
        titulo: `Novedades › ${version} › ${s.titulo}`,
        ruta,
        tipo: "novedad" as const,
        texto: s.puntos.map(plano).join(" · "),
      })),
    ];
  });
}

// Se construye la primera vez que alguien busca, y una sola vez (las novedades, cada vez que cambia la lista).
let base: Doc[] | undefined;
let conNovedades: { de: Novedad[]; docs: Doc[] } | undefined;

/** Todos los documentos del buscador. */
export function documentos(novedades?: Novedad[]): Doc[] {
  base ??= [...documentosGuia(), ...documentosDescargas()];
  if (!novedades?.length) return base;
  if (conNovedades?.de !== novedades) conNovedades = { de: novedades, docs: [...base, ...documentosNovedades(novedades)] };
  return conNovedades.docs;
}
