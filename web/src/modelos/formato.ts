// Formato de los modelos 3D de los jefes (public/modelos/<id>.json + su textura PNG al lado).
//
// Sirve para los dos tipos de modelo que usan los mods:
//  - Modelos de Java (ModelPart de vanilla, AdvancedModelBox de Cataclysm, AdvancedModelRenderer de Mowzie's):
//    `yArriba: false`. Coordenadas en píxeles con la Y hacia abajo; cada parte relativa a su padre. El visor
//    los voltea con escala (-1, -1, 1), como hace Minecraft al dibujar entidades.
//  - Modelos de GeckoLib (.geo.json): `yArriba: true`. Coordenadas absolutas: cada hueso usa `p` = `o` = pivote.
//
// Transformación de cada parte:  M = T(p) · Rz(r.z) · Ry(r.y) · Rx(r.x) · S(s) · T(-o)
// (la rotación es la de Minecraft: rotationZYX).

export type Vec3 = [number, number, number];

export interface Parte {
  /** Nombre de la parte (solo informativo). */
  n: string;
  /** Traslación en píxeles respecto al padre. */
  p: Vec3;
  /** Rotación en radianes [x, y, z]. */
  r?: Vec3;
  /** Escala [x, y, z]. */
  s?: Vec3;
  /** Pivote que se resta después de rotar (GeckoLib). Por defecto [0, 0, 0]. */
  o?: Vec3;
  /**
   * Caras de la parte, 20 números por cara: 4 vértices × [x, y, z, u, v].
   * x, y, z en píxeles en el espacio de la parte; u, v normalizados (0..1, v hacia abajo como en el PNG).
   * Los vértices van en orden (contorno), y la cara se parte en los triángulos 0-1-2 y 0-2-3.
   */
  q?: number[];
  /** Partes hijas. */
  h?: Parte[];
  /** Si no se dibuja (ni ella ni sus hijas). */
  oculto?: boolean;
}

export interface ModeloJefe {
  formato: 1;
  id: string;
  nombre: string;
  /** PNG de la textura, relativo al JSON. */
  textura: string;
  /** PNG opcional con las partes que brillan (misma UV), se dibuja encima sin sombras. */
  brillo?: string;
  yArriba: boolean;
  /** Escala extra que aplica el renderizador del juego (por defecto 1). */
  escala?: number;
  raiz: Parte[];
}
