import { Chip, buttonVariants } from "@heroui/react";
import { useEffect, useState } from "react";
import { Bloques } from "../guia/Bloques";
import { GUIA_VERSION, SECCIONES, introGuia } from "../guia/indice";
import { href } from "../rutas";

/** Subsección que se está leyendo, para marcarla en el índice. */
function useActiva(ids: string[]) {
  const [activa, setActiva] = useState<string>();
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entradas) => {
        const visibles = entradas.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visibles[0]) setActiva(visibles[0].target.id);
      },
      { rootMargin: "-80px 0px -65% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids]);
  return activa;
}

const IDS = SECCIONES.flatMap((s) => [`seccion-${s.id}`, ...s.subsecciones.map((u) => u.id)]);

function Indice({ activa, compacto = false }: { activa?: string; compacto?: boolean }) {
  return (
    <nav aria-label="Índice de la guía">
      <ol className="space-y-1">
        {SECCIONES.map((s) => {
          const dentro = activa === `seccion-${s.id}` || s.subsecciones.some((u) => u.id === activa);
          return (
            <li key={s.id}>
              <a
                href={href("guia", `seccion-${s.id}`)}
                className={
                  "flex items-baseline gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold transition-colors " +
                  (dentro ? "bg-white/[0.07] text-foreground" : "text-foreground/80 hover:bg-white/5")
                }
              >
                <span className="w-4 shrink-0 text-right text-sangre-claro">{s.id}</span>
                {s.titulo}
              </a>
              {(dentro || compacto) && (
                <ol className="mb-2 ml-[1.9rem] mt-0.5 space-y-0.5 border-l border-white/10">
                  {s.subsecciones.map((u) => (
                    <li key={u.id}>
                      <a
                        href={href("guia", u.id)}
                        className={
                          "-ml-px block border-l py-1 pl-3 text-[13px] leading-snug transition-colors " +
                          (activa === u.id ? "border-sangre text-foreground" : "border-transparent text-muted hover:text-foreground")
                        }
                      >
                        {u.titulo}
                      </a>
                    </li>
                  ))}
                </ol>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function Guia({ ancla }: { ancla?: string }) {
  const activa = useActiva(IDS);
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:pt-14">
      <header className="brillo-infeccion rounded-3xl border border-white/5 px-6 py-8 sm:px-10 sm:py-10">
        <div className="flex flex-wrap items-center gap-2">
          <Chip color="accent" size="sm">
            Guía del superviviente
          </Chip>
          <Chip variant="soft" size="sm">
            Revisada para la {GUIA_VERSION}
          </Chip>
        </div>
        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">Cómo se juega en Infect Cozy</h1>
        <div className="mt-4 max-w-3xl text-lg">
          <Bloques bloques={introGuia} />
        </div>
      </header>

      <details className="group mt-6 rounded-2xl border border-white/10 bg-surface/60 lg:hidden" open={!ancla}>
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-semibold">
          Índice de la guía
          <span className="text-muted transition-transform group-open:rotate-180">▾</span>
        </summary>
        <div className="max-h-[60vh] overflow-y-auto px-2 pb-3">
          <Indice activa={activa} />
        </div>
      </details>

      <div className="mt-8 lg:grid lg:grid-cols-[250px_1fr] lg:gap-10">
        <aside className="hidden lg:block">
          <div className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto pb-6 pr-1">
            <Indice activa={activa} />
          </div>
        </aside>

        <article className="min-w-0 space-y-16">
          {SECCIONES.map((s) => (
            <section key={s.id} id={`seccion-${s.id}`} className="scroll-mt-24">
              <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sangre text-lg font-extrabold text-white">
                  {s.id}
                </span>
                <div>
                  <h2 className="text-2xl font-bold sm:text-3xl">{s.titulo}</h2>
                  <p className="text-sm text-muted">{s.resumen}</p>
                </div>
              </div>
              {s.intro && (
                <div className="mt-6">
                  <Bloques bloques={s.intro} />
                </div>
              )}
              <div className="mt-8 space-y-12">
                {s.subsecciones.map((u) => (
                  <section key={u.id} id={u.id} className="scroll-mt-24">
                    <h3 className="mb-4 flex items-baseline gap-3 text-xl font-semibold">
                      {/^\d/.test(u.id) && <span className="text-base font-bold text-sangre-claro">{u.id}</span>}
                      {u.titulo}
                    </h3>
                    <Bloques bloques={u.bloques} />
                  </section>
                ))}
              </div>
            </section>
          ))}

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 p-6">
            <p className="text-muted">¿Aún no tienes el pack instalado?</p>
            <a href={href("descargas")} className={buttonVariants({ variant: "primary" })}>
              Ir a descargas
            </a>
          </div>
        </article>
      </div>
    </div>
  );
}
