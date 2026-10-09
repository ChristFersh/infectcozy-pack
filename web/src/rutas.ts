import { useEffect, useState } from "react";

// Rutas con almohadilla (#/descargas, #/guia/2.4): GitHub Pages no sabe redirigir rutas de una SPA.

export type Pagina = "inicio" | "descargas" | "guia" | "modelo";

export interface Ruta {
  pagina: Pagina;
  /** Lo que va después de la página: el id de una sección de la guía o de un apartado. */
  ancla?: string;
}

function leer(): Ruta {
  const [pagina, ...resto] = window.location.hash.replace(/^#\/?/, "").split("/");
  const ancla = resto.join("/") || undefined;
  if (pagina === "descargas" || pagina === "guia" || pagina === "modelo") return { pagina, ancla };
  return { pagina: "inicio", ancla: pagina || undefined };
}

export function href(pagina: Pagina, ancla?: string) {
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
    if (!ruta.ancla) {
      window.scrollTo({ top: 0 });
      return;
    }
    const el = document.getElementById(ruta.ancla);
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
  }, [ruta.pagina, ruta.ancla, listo]);
}
