import { Alert } from "@heroui/react";
import { TextoRico } from "../componentes/TextoRico";
import { Barras, Diagrama } from "./Diagrama";
import { GaleriaJefes } from "./GaleriaJefes";
import { Objetos } from "./Objetos";
import { TarjetaReceta } from "./Receta";
import type { Bloque } from "./tipos";

const SOLO_NEGRITA = /^\*\*[^*]+\*\*$/;

const NOTA = {
  nota: { status: "accent", titulo: "Nota" },
  importante: { status: "warning", titulo: "Importante" },
  consejo: { status: "success", titulo: "Consejo" },
} as const;

export function Bloques({ bloques }: { bloques: Bloque[] }) {
  return (
    <div className="space-y-5">
      {bloques.map((b, i) => (
        <BloqueGuia key={i} b={b} />
      ))}
    </div>
  );
}

function BloqueGuia({ b }: { b: Bloque }) {
  switch (b.tipo) {
    case "p":
      if (SOLO_NEGRITA.test(b.texto.trim()))
        return <h4 className="pt-2 text-base font-semibold text-foreground">{b.texto.trim().slice(2, -2)}</h4>;
      return (
        <p className="texto-guia leading-relaxed text-foreground/80">
          <TextoRico texto={b.texto} />
        </p>
      );

    case "pasos":
      return (
        <ol className="space-y-3">
          {b.items.map((it, i) => (
            <li key={i} className="flex gap-3.5 leading-relaxed">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-sangre/90 text-[11px] font-bold text-white">
                {i + 1}
              </span>
              <span className="texto-guia text-foreground/80">
                <TextoRico texto={it} />
              </span>
            </li>
          ))}
        </ol>
      );

    case "lista":
      return (
        <ul className="space-y-2">
          {b.items.map((it, i) => (
            <li key={i} className="flex gap-3 leading-relaxed">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-sangre" aria-hidden />
              <span className="texto-guia text-foreground/80">
                <TextoRico texto={it} />
              </span>
            </li>
          ))}
        </ul>
      );

    case "nota": {
      const n = NOTA[b.estilo];
      return (
        <Alert status={n.status}>
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>{b.titulo ?? n.titulo}</Alert.Title>
            <Alert.Description className="texto-guia">
              <TextoRico texto={b.texto} />
            </Alert.Description>
          </Alert.Content>
        </Alert>
      );
    }

    case "tabla":
      return (
        <div>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[480px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-white/[0.06]">
                  {b.columnas.map((c, i) => (
                    <th key={i} scope="col" className="px-3.5 py-2.5 font-semibold">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.filas.map((f, i) => (
                  <tr key={i} className="border-t border-white/5 odd:bg-white/[0.015]">
                    {f.map((celda, j) => (
                      <td key={j} className={"texto-guia px-3.5 py-2.5 align-top leading-relaxed " + (j === 0 ? "text-foreground" : "text-foreground/75")}>
                        <TextoRico texto={celda} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {b.pie && (
            <p className="texto-guia mt-2 text-sm text-muted">
              <TextoRico texto={b.pie} />
            </p>
          )}
        </div>
      );

    case "definiciones":
      return (
        <dl className="divide-y divide-white/5 overflow-hidden rounded-xl border border-white/10">
          {b.items.map((d, i) => (
            <div key={i} className="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(150px,26%)_1fr] sm:gap-5">
              <dt>
                <span className="font-semibold text-foreground">{d.termino}</span>
                {d.detalle && <span className="block text-xs text-muted">{d.detalle}</span>}
              </dt>
              <dd className="texto-guia leading-relaxed text-foreground/80">
                <TextoRico texto={d.texto} />
              </dd>
            </div>
          ))}
        </dl>
      );

    case "tarjetas":
      return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {b.items.map((t, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="font-semibold text-sangre-claro">{t.titulo}</p>
              <p className="texto-guia mt-1 text-sm leading-relaxed text-foreground/80">
                <TextoRico texto={t.texto} />
              </p>
            </div>
          ))}
        </div>
      );

    case "recetas":
      return (
        <div className="grid gap-3 md:grid-cols-2">
          {b.items.map((r, i) => (
            <TarjetaReceta key={i} r={r} />
          ))}
        </div>
      );

    case "jefes":
      return <GaleriaJefes items={b.items} />;

    case "objetos":
      return <Objetos items={b.items} />;

    case "diagrama":
      return <Diagrama b={b} />;

    case "barras":
      return <Barras b={b} />;

    case "estadisticas":
      return (
        <div>
          {b.titulo && <p className="mb-2 font-semibold">{b.titulo}</p>}
          <div className="flex flex-wrap gap-2">
            {b.items.map((s, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2">
                <span className="block text-[11px] font-medium uppercase tracking-wider text-muted">{s.etiqueta}</span>
                <span className="texto-guia font-semibold">
                  <TextoRico texto={s.valor} />
                </span>
              </div>
            ))}
          </div>
        </div>
      );
  }
}
