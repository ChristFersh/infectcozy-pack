import { Accordion, Card, Chip } from "@heroui/react";
import { fecha, type Novedad as TNovedad, type TipoCambio } from "../datos";
import { TextoRico } from "./TextoRico";

const ESTILO: Record<TipoCambio, { color: "accent" | "success" | "warning" | "danger" | "default"; punto: string }> = {
  nuevo: { color: "accent", punto: "bg-sangre" },
  equilibrio: { color: "warning", punto: "bg-oro" },
  arreglo: { color: "success", punto: "bg-teal" },
  quitado: { color: "default", punto: "bg-white/40" },
  rendimiento: { color: "success", punto: "bg-teal" },
};

export function Novedad({ n, reciente = false }: { n: TNovedad; reciente?: boolean }) {
  return (
    <Card className={"overflow-hidden " + (reciente ? "brillo-infeccion border border-sangre/30" : "")}>
      <Card.Header className="gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Chip color={reciente ? "accent" : "default"} variant={reciente ? "primary" : "soft"} size="sm">
            Versión {n.version}
          </Chip>
          {reciente && (
            <Chip color="success" variant="soft" size="sm">
              La más reciente
            </Chip>
          )}
          <span className="text-sm text-muted">{fecha(n.fecha)}</span>
        </div>
        <Card.Title className={reciente ? "text-2xl font-bold sm:text-3xl" : "text-xl font-semibold"}>{n.titulo}</Card.Title>
        <Card.Description className="text-base leading-relaxed">
          <TextoRico texto={n.resumen} />
        </Card.Description>
      </Card.Header>

      <Card.Content className="texto-guia gap-5">
        {n.destacados && n.destacados.length > 0 && (
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {n.destacados.map((d, i) => (
              <li key={i} className="flex gap-3 rounded-xl bg-white/[0.04] p-3.5 text-[15px] leading-snug">
                <span className="mt-1.5 size-2 shrink-0 rounded-sm bg-sangre" aria-hidden />
                <span>
                  <TextoRico texto={d} />
                </span>
              </li>
            ))}
          </ul>
        )}

        <Accordion allowsMultipleExpanded variant="surface" defaultExpandedKeys={reciente ? [] : [`${n.version}-0`]}>
          {n.secciones.map((s, i) => (
            <Accordion.Item key={i} id={`${n.version}-${i}`}>
              <Accordion.Heading>
                <Accordion.Trigger>
                  <span className="flex items-center gap-3">
                    <Chip size="sm" variant="soft" color={ESTILO[s.tipo].color}>
                      {s.puntos.length}
                    </Chip>
                    <span className="font-semibold">{s.titulo}</span>
                  </span>
                  <Accordion.Indicator />
                </Accordion.Trigger>
              </Accordion.Heading>
              <Accordion.Panel>
                <Accordion.Body>
                  <ul className="space-y-2.5 pb-2">
                    {s.puntos.map((p, j) => (
                      <li key={j} className="flex gap-3 leading-relaxed text-muted">
                        <span className={"mt-2 size-1.5 shrink-0 rounded-full " + ESTILO[s.tipo].punto} aria-hidden />
                        <span>
                          <TextoRico texto={p} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </Accordion.Body>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Card.Content>
    </Card>
  );
}
