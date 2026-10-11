import { useEffect, useState } from "react";

// Rutas con almohadilla (#/descargas, #/guia/2.4): GitHub Pages no sabe redirigir rutas de una SPA.

export type Pagina = "inicio" | "descargas" | "guia" | "buscar" | "modelo";

export interface Ruta {
  pagina: Pagina;
  /** Lo que va después de la página: el id de una sección de la guía o de un apartado (en #/buscar, la búsqueda). */
  ancla?: string;
}

function descodificar(texto: string) {
  try {
    return decodeURIComponent(texto);
  } catch {
    return texto;
  }
}

function leer(): Ruta {
  const [pagina, ...resto] = window.location.hash.replace(/^#\/?/, "").split("/");
  const ancla = resto.join("/") || undefined;
  if (pagina === "buscar") return { pagina, ancla: ancla && descodificar(ancla) };
  if (pagina === "descargas" || pagina === "guia" || pagina === "modelo") return { pagina, ancla };
  return { pagina: "inicio", ancla: pagina || undefined };
}

export function href(pagina: Pagina, ancla?: string) {
  if (pagina === "buscar") return ancla ? `#/buscar/${encodeURIComponent(ancla)}` : "#/buscar";
  const base = pagina === "inicio" ? "#/" : `#/${pagina}`;
  return ancla ? `${base}${pagina === "inicio" ? "" : "/"}${ancla}` : base;
}

export function useRuta(): Ruta {
  const [ruta, setRuta] = useState(leer);
  useEffect(() => {
    const cambio = () => setRuta(leer());
    window.addEventListener("hashchange", cambio);
    return () => window.removeEventListener("hashchange", cambio);
  }, []);
  return ruta;
}

/** Al cambiar de página sube arriba; si hay ancla, baja hasta ese elemento. */
export function useDesplazar(ruta: Ruta, listo = true) {
  useEffect(() => {
    if (!listo) return;
    if (!ruta.ancla || ruta.pagina === "buscar") {
      window.scrollTo({ top: 0 });
      return;
    }
    const el = document.getElementById(ruta.ancla);
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
  }, [ruta.pagina, ruta.ancla, listo]);
}

/** Va a un enlace con almohadilla; si ya estás en él, vuelve a bajar hasta su ancla. */
export function ir(destino: string) {
  if (window.location.hash !== destino) {
    window.location.hash = destino;
    return;
  }
  const { ancla } = leer();
  const el = ancla ? document.getElementById(ancla) : null;
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}
