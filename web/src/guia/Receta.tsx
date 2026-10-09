import { Card, Chip, Tooltip } from "@heroui/react";
import { TextoRico } from "../componentes/TextoRico";
import iconos from "./iconos.json";
import type { Receta } from "./tipos";

const ICONOS = iconos as Record<string, string>;

function icono(nombre: string | null) {
  return nombre ? ICONOS[nombre] : undefined;
}

/** Una casilla de la mesa: el icono del objeto (o su nombre si no tiene icono). */
function Hueco({ texto, resultado = false, cantidad }: { texto: string | null; resultado?: boolean; cantidad?: number }) {
  const archivo = icono(texto);
  const casilla = (
    <div
      className={
        "relative flex aspect-square min-w-0 items-center justify-center rounded-md border text-center " +
        (resultado
          ? "border-sangre/60 bg-sangre/15"
          : texto
            ? "border-black/40 bg-black/35 shadow-[inset_2px_2px_0_rgba(0,0,0,0.35),inset_-2px_-2px_0_rgba(255,255,255,0.05)]"
            : "border-black/30 bg-black/20 shadow-[inset_2px_2px_0_rgba(0,0,0,0.3)]")
      }
    >
      {archivo ? (
        <img src={`./iconos/${archivo}`} alt={texto ?? ""} loading="lazy" className="pixelado size-[72%] object-contain" draggable={false} />
      ) : (
        texto && (
          <span className="line-clamp-4 break-words px-1 text-[10.5px] leading-tight text-foreground/90 hyphens-auto sm:text-[11px]" lang="es">
            {texto}
          </span>
        )
      )}
      {cantidad && cantidad > 1 && (
        <span className="absolute bottom-0.5 right-1 text-[12px] font-bold text-white [text-shadow:1px_1px_0_#3f3f3f]">{cantidad}</span>
      )}
    </div>
  );
  if (!texto || !archivo) return casilla;
  return (
    <Tooltip delay={150}>
      <Tooltip.Trigger aria-label={texto}>{casilla}</Tooltip.Trigger>
      <Tooltip.Content>{texto}</Tooltip.Content>
    </Tooltip>
  );
}

/** "Polvo de blaze ×3 · Ojo de ender": lo que lleva la receta, en texto, para quien no reconozca los iconos. */
function Ingredientes({ r }: { r: Receta }) {
  const lista = (r.forma ? r.forma.flat() : r.ingredientes ?? []).filter((x): x is string => !!x);
  const cuenta = new Map<string, number>();
  for (const x of lista) cuenta.set(x, (cuenta.get(x) ?? 0) + 1);
  return (
    <p className="text-[13px] leading-relaxed text-muted">
      {[...cuenta].map(([nombre, n], i) => (
        <span key={nombre}>
          {i > 0 && " · "}
          <span className="text-foreground/85">{nombre}</span>
          {n > 1 && ` ×${n}`}
        </span>
      ))}
    </p>
  );
}

export function TarjetaReceta({ r }: { r: Receta }) {
  const filas = r.forma ?? [];
  const columnas = Math.max(1, ...filas.map((f) => f.length));
  const resultado = r.resultado ?? r.nombre;
  return (
    <Card variant="secondary" className="h-full">
      <Card.Header className="gap-1.5">
        <Card.Title className="text-[15px] font-semibold leading-snug">{r.nombre}</Card.Title>
        <Chip size="sm" variant="soft" className="w-fit">
          {r.estacion}
        </Chip>
      </Card.Header>
      <Card.Content className="gap-3">
        <div className="flex items-center gap-2 rounded-xl bg-white/[0.035] p-2.5 sm:gap-3">
          {r.forma ? (
            <div className="grid flex-1 gap-1" style={{ gridTemplateColumns: `repeat(${columnas}, minmax(0, 1fr))`, maxWidth: columnas * 64 }}>
              {filas.flatMap((f, i) => Array.from({ length: columnas }, (_, j) => <Hueco key={`${i}-${j}`} texto={f[j] ?? null} />))}
            </div>
          ) : (
            <div className="grid flex-1 grid-cols-3 gap-1" style={{ maxWidth: 192 }}>
              {(r.ingredientes ?? []).map((ing, i) => (
                <Hueco key={i} texto={ing} />
              ))}
            </div>
          )}
          <span className="text-xl text-muted" aria-label="da">
            →
          </span>
          <div className="w-16 shrink-0 sm:w-[72px]">
            <Hueco texto={resultado} resultado cantidad={r.cantidad} />
          </div>
        </div>
        <Ingredientes r={r} />
        {r.pie && (
          <p className="texto-guia text-sm leading-relaxed text-muted">
            <TextoRico texto={r.pie} />
          </p>
        )}
      </Card.Content>
    </Card>
  );
}
