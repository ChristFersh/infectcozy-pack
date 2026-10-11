import { TextoRico } from "../componentes/TextoRico";
import { icono } from "./Receta";
import type { Objeto } from "./tipos";

/** El icono en su casilla de inventario, o la inicial si el objeto no tiene icono. */
export function CasillaIcono({ nombre, tam = "size-12" }: { nombre: string; tam?: string }) {
  const archivo = icono(nombre);
  return (
    <div
      className={
        tam +
        " flex shrink-0 items-center justify-center rounded-md border border-black/40 bg-black/35 shadow-[inset_2px_2px_0_rgba(0,0,0,0.35),inset_-2px_-2px_0_rgba(255,255,255,0.05)]"
      }
    >
      {archivo ? (
        <img src={`./iconos/${archivo}`} alt="" loading="lazy" className="pixelado size-[72%] object-contain" draggable={false} />
      ) : (
        <span className="text-sm font-bold text-muted" aria-hidden>
          {nombre.charAt(0)}
        </span>
      )}
    </div>
  );
}

export function TarjetaObjeto({ o }: { o: Objeto }) {
  return (
    <div className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <CasillaIcono nombre={o.icono ?? o.nombre} />
      <div className="min-w-0 text-sm leading-relaxed">
        <p className="font-semibold text-foreground">{o.nombre}</p>
        <p className="texto-guia text-foreground/80">
          <span className="text-muted">Sale de: </span>
          <TextoRico texto={o.sale} />
        </p>
        {o.uso && (
          <p className="texto-guia text-foreground/70">
            <span className="text-muted">Se usa en: </span>
            <TextoRico texto={o.uso} />
          </p>
        )}
      </div>
    </div>
  );
}

export function Objetos({ items }: { items: Objeto[] }) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {items.map((o) => (
        <TarjetaObjeto key={o.nombre} o={o} />
      ))}
    </div>
  );
}
