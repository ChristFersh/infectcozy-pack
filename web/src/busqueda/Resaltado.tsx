import type { ReactNode } from "react";
import type { Doc, TipoDoc } from "./indice";

/** Texto con las palabras encontradas marcadas en el color de la infección. */
export function Resaltado({ texto, marcas }: { texto: string; marcas: [number, number][] }) {
  const partes: ReactNode[] = [];
  let i = 0;
  for (const [desde, hasta] of marcas) {
    if (desde < i) continue;
    if (desde > i) partes.push(texto.slice(i, desde));
    partes.push(
      <mark key={desde} className="rounded-sm bg-sangre/30 px-0.5 text-foreground">
        {texto.slice(desde, hasta)}
      </mark>,
    );
    i = hasta;
  }
  partes.push(texto.slice(i));
  return <>{partes}</>;
}

export const ETIQUETA: Record<TipoDoc, string> = {
  seccion: "Apartado",
  texto: "Guía",
  receta: "Receta",
  objeto: "Objeto",
  tabla: "Tabla",
  definicion: "Guía",
  jefe: "Jefe",
  instruccion: "Descargas",
  novedad: "Novedades",
};

/** Lo que se enseña como nombre del resultado: el de la receta u objeto, o el del apartado. */
export function nombreDoc(d: Doc) {
  return d.tipo === "seccion" || !d.nombre ? d.migas[d.migas.length - 1] : d.nombre;
}

/** La miga de pan sin el nombre (si el nombre ya es su último tramo). */
export function migasDoc(d: Doc) {
  const nombre = nombreDoc(d);
  const migas = nombre === d.migas[d.migas.length - 1] ? d.migas.slice(0, -1) : d.migas;
  return migas.length > 0 ? migas.join(" › ") : "Guía de juego";
}
