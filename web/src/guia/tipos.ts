// Estructura de la guía de juego. Cada sección vive en su propio archivo de secciones/.
//
// Texto en línea (tipo Inline): admite **negrita**, *cursiva* y `código` (para teclas, comandos o nombres
// de archivo). Nada de HTML.

export type Inline = string;

export interface Receta {
  /** Nombre del objeto que se fabrica, tal como sale en el juego en español. */
  nombre: string;
  /** Dónde se hace: "Mesa de crafteo", "Mesa de herrería", "Sin forma", "Horno"... */
  estacion: string;
  /**
   * Rejilla de la receta, por filas. null = hueco vacío. Normalmente 3×3.
   * En la mesa de herrería es una sola fila: [plantilla, base, añadido].
   */
  forma?: (string | null)[][];
  /** Para recetas sin forma: lista de ingredientes (repite el nombre si van varios). */
  ingredientes?: string[];
  /** Lo que sale, si el nombre del resultado no es igual que `nombre` (por ejemplo con su nombre en inglés). */
  resultado?: string;
  /** Cuántas unidades salen, si son más de 1. */
  cantidad?: number;
  /** Texto debajo de la receta (para qué sirve, a dónde lleva...). */
  pie?: Inline;
}

export type Bloque =
  /** Párrafo normal. */
  | { tipo: "p"; texto: Inline }
  /** Pasos numerados. */
  | { tipo: "pasos"; items: Inline[] }
  /** Lista con viñetas. */
  | { tipo: "lista"; items: Inline[] }
  /** Recuadro destacado. "nota" (neutro), "importante" (peligro/aviso), "consejo" (ayuda). */
  | { tipo: "nota"; estilo: "nota" | "importante" | "consejo"; titulo?: string; texto: Inline }
  /** Tabla con cabecera. Cada fila tiene tantas celdas como columnas. Una celda puede llevar saltos de línea con \n. */
  | { tipo: "tabla"; columnas: string[]; filas: Inline[][]; pie?: Inline }
  /**
   * Lista de término → explicación (las tablas de dos columnas sin cabecera del PDF).
   * `detalle` es el texto pequeño bajo el término (por ejemplo el mod: "PlayerRevive").
   */
  | { tipo: "definiciones"; items: { termino: string; detalle?: string; texto: Inline }[] }
  /** Tarjetas cortas lado a lado (los recuadros con título del PDF). */
  | { tipo: "tarjetas"; items: { titulo: string; texto: Inline }[] }
  /** Una o varias recetas. */
  | { tipo: "recetas"; items: Receta[] }
  /** Ficha de valores (daño, durabilidad, efectos...). */
  | { tipo: "estadisticas"; titulo?: string; items: { etiqueta: string; valor: Inline }[] }
  /**
   * Galería de jefes con su modelo 3D (public/modelos/<modelo>.json y la miniatura public/modelos/<modelo>.webp).
   * `grupo` agrupa las tarjetas (Overworld, Nether…).
   */
  | { tipo: "jefes"; items: { modelo: string; nombre: string; detalle?: string; grupo?: string }[] };

export interface Subseccion {
  /** Número tal como en el PDF: "2.3". Si no tiene número, un id corto en minúsculas sin espacios. */
  id: string;
  titulo: string;
  bloques: Bloque[];
}

export interface Seccion {
  /** "1", "2"... */
  id: string;
  titulo: string;
  /** Una frase que resuma la sección (para el índice). */
  resumen: string;
  /** Bloques antes de la primera subsección (texto que va justo debajo del título de la sección). */
  intro?: Bloque[];
  subsecciones: Subseccion[];
}
