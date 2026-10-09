import type { Seccion } from "./tipos";
import { introGuia, seccion1 } from "./secciones/seccion1";
import { seccion2 } from "./secciones/seccion2";
import { seccion3 } from "./secciones/seccion3";
import { seccion4 } from "./secciones/seccion4";
import { seccion5 } from "./secciones/seccion5";
import { seccion6 } from "./secciones/seccion6";
import { subsecciones6b } from "./secciones/seccion6b";
import { seccion7 } from "./secciones/seccion7";
import { seccion8 } from "./secciones/seccion8";
import { seccion9 } from "./secciones/seccion9";

export { introGuia };

/** Versión del pack para la que está revisada la guía. */
export const GUIA_VERSION = "1.6";

export const SECCIONES: Seccion[] = [
  seccion1,
  seccion2,
  seccion3,
  seccion4,
  seccion5,
  { ...seccion6, subsecciones: [...seccion6.subsecciones, ...subsecciones6b] },
  seccion7,
  seccion8,
  seccion9,
];
