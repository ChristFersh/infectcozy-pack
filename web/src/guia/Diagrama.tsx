import { Fragment } from "react";
import { TextoRico } from "../componentes/TextoRico";
import { CasillaIcono } from "./Objetos";
import type { Bloque } from "./tipos";

type BloqueDiagrama = Extract<Bloque, { tipo: "diagrama" }>;
type BloqueBarras = Extract<Bloque, { tipo: "barras" }>;

/**
 * Progresión por etapas: en pantalla ancha, columnas de izquierda a derecha unidas por flechas;
 * en el móvil, las etapas una debajo de otra con la flecha hacia abajo.
 */
export function Diagrama({ b }: { b: BloqueDiagrama }) {
  return (
    <figure className="rounded-xl border border-white/10 bg-white/[0.02] p-3 sm:p-4">
      {b.titulo && <figcaption className="mb-3 font-semibold">{b.titulo}</figcaption>}
      <div className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-stretch">
        {b.etapas.map((e, i) => (
          <Fragment key={i}>
            {i > 0 && (
              <div className="flex items-center justify-center text-xl text-sangre-claro" aria-hidden>
                <span className="lg:hidden">↓</span>
                <span className="hidden lg:inline">→</span>
              </div>
            )}
            <section className="flex min-w-0 flex-1 flex-col gap-2 rounded-lg bg-white/[0.035] p-2.5">
              <h5 className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                <span className="mr-1.5 text-sangre-claro">{i + 1}</span>
                {e.titulo}
              </h5>
              <ul className="flex flex-col gap-1.5">
                {e.nodos.map((n) => (
                  <li
                    key={n.nombre}
                    className={
                      "flex items-center gap-2.5 rounded-md border px-2 py-1.5 " +
                      (n.destacado ? "border-sangre/60 bg-sangre/15" : "border-white/10 bg-black/20")
                    }
                  >
                    {n.icono && <CasillaIcono nombre={n.icono} tam="size-9" />}
                    <div className="min-w-0 text-[13px] leading-snug">
                      <p className="font-semibold text-foreground">{n.nombre}</p>
                      {n.detalle && (
                        <p className="texto-guia text-[12px] text-muted">
                          <TextoRico texto={n.detalle} />
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </Fragment>
        ))}
      </div>
      {b.pie && (
        <p className="texto-guia mt-3 text-sm text-muted">
          <TextoRico texto={b.pie} />
        </p>
      )}
    </figure>
  );
}

export function Barras({ b }: { b: BloqueBarras }) {
  const max = Math.max(...b.items.map((x) => x.valor), 1);
  return (
    <figure className="rounded-xl border border-white/10 bg-white/[0.02] p-3 sm:p-4">
      {b.titulo && <figcaption className="mb-3 font-semibold">{b.titulo}</figcaption>}
      <ul className="space-y-2.5">
        {b.items.map((x) => (
          <li key={x.etiqueta} className="grid grid-cols-[minmax(84px,30%)_1fr] items-center gap-3 text-sm">
            <span className="min-w-0 text-foreground/85">
              {x.etiqueta}
              {x.detalle && (
                <span className="texto-guia block text-[12px] leading-snug text-muted">
                  <TextoRico texto={x.detalle} />
                </span>
              )}
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 rounded-sm bg-sangre/80" style={{ width: `${Math.max(2, (x.valor / max) * 100)}%` }} />
              <span className="shrink-0 tabular-nums text-foreground">
                {x.texto ?? x.valor}
                {!x.texto && b.unidad ? ` ${b.unidad}` : ""}
              </span>
            </span>
          </li>
        ))}
      </ul>
      {b.pie && (
        <p className="texto-guia mt-3 text-sm text-muted">
          <TextoRico texto={b.pie} />
        </p>
      )}
    </figure>
  );
}
