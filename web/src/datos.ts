import { useEffect, useState } from "react";

// datos.json lo escribe publicar.py en cada versión; novedades.json se edita a mano.
// Los dos viven en la raíz del repo, junto a esta web, y se leen al abrir la página:
// cambiarlos no obliga a recompilar la web.

export interface Variante {
  id: string;
  nombre: string;
  descripcion: string;
  ram_mb: number;
  archivos: number;
  /** Zip para importar en Prism (relativo a la web). */
  prism: string;
  /** Zip para la app de CurseForge (release de GitHub). Solo está si se generó para esta versión. */
  curseforge?: string;
  pack_toml: string;
}

export interface ModManual {
  nombre: string;
  archivo: string;
  url: string;
}

export interface Datos {
  nombre: string;
  version: string;
  minecraft: string;
  loader: string;
  loader_version: string;
  actualizado: string;
  url_base: string;
  variantes: Variante[];
  manuales: ModManual[];
  guias: { titulo: string; url: string }[];
}

export type TipoCambio = "nuevo" | "equilibrio" | "arreglo" | "quitado" | "rendimiento";

export interface Novedad {
  version: string;
  fecha: string;
  titulo: string;
  resumen: string;
  /** Lo más importante, en pocas palabras (se muestra en la portada). */
  destacados?: string[];
  secciones: { tipo: TipoCambio; titulo: string; puntos: string[] }[];
}

type Estado<T> = { cargando: true } | { cargando: false; datos: T } | { cargando: false; error: string };

function useJson<T>(url: string): Estado<T> {
  const [estado, setEstado] = useState<Estado<T>>({ cargando: true });
  useEffect(() => {
    let vivo = true;
    fetch(url, { cache: "no-cache" })
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
        return r.json() as Promise<T>;
      })
      .then((datos) => vivo && setEstado({ cargando: false, datos }))
      .catch((e: unknown) => vivo && setEstado({ cargando: false, error: String(e) }));
    return () => {
      vivo = false;
    };
  }, [url]);
  return estado;
}

export const useDatos = () => useJson<Datos>("./datos.json");
export const useNovedades = () => useJson<Novedad[]>("./novedades.json");

export function gb(mb: number) {
  return `${(mb / 1024).toLocaleString("es", { maximumFractionDigits: 1 })} GB`;
}

export function fecha(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" });
}

/** Características de cada versión que no cambian entre publicaciones (para las tarjetas de descarga). */
export const DETALLES: Record<string, { ideal: string; pc: string; graficos: string[] }> = {
  "ultra-low": {
    ideal: "PC muy justa con gráficos integrados",
    pc: "8 GB",
    graficos: ["Solo mods necesarios y de rendimiento", "Sin shaders, animaciones ni partículas extra", "Distancia 5 e imagen al 70 %"],
  },
  lite: {
    ideal: "PC modestos y portátiles con gráficos integrados",
    pc: "8 GB o más",
    graficos: ["Sin shaders ni animaciones de mobs", "Sin partículas extra, luz dinámica ni sonido 3D", "Distancia 6 e imagen al 80 %"],
  },
  "media-lite": {
    ideal: "Tarjeta de video básica (GTX 1050 / 1650, RX 570)",
    pc: "12 a 16 GB",
    graficos: ["Shaders encendidos en perfil Low", "Animaciones de mobs (Fresh Animations)", "Sin Distant Horizons · distancia 8"],
  },
  media: {
    ideal: "PC con tarjeta de video dedicada",
    pc: "16 GB o más",
    graficos: ["Animaciones, luz dinámica y sonido 3D", "Distant Horizons corto", "Shaders incluidos pero apagados"],
  },
  detallada: {
    ideal: "PC potentes",
    pc: "16 GB o más",
    graficos: ["Shaders con Euphoria Patches encendidos", "Distant Horizons", "Partículas y efectos extra"],
  },
};
