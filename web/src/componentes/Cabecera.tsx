import { Chip, buttonVariants } from "@heroui/react";
import { Buscador } from "../busqueda/Buscador";
import type { Novedad } from "../datos";
import { href, type Pagina } from "../rutas";

// `corto` es el texto en pantallas estrechas, para que quepan los enlaces y la lupa en 360 px.
const ENLACES: { pagina: Pagina; texto: string; corto?: string }[] = [
  { pagina: "inicio", texto: "Inicio" },
  { pagina: "descargas", texto: "Descargas" },
  { pagina: "guia", texto: "Guía de juego", corto: "Guía" },
];

export function Cabecera({ actual, version, novedades }: { actual: Pagina; version?: string; novedades?: Novedad[] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[oklch(0.13_0.008_285/0.82)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-2 gap-y-2 px-4 py-2.5 sm:gap-x-6 lg:flex-nowrap">
        <a href={href("inicio")} className="flex shrink-0 items-center gap-2.5" aria-label="Infect Cozy, inicio">
          <img src="./img/icono.png" alt="" width={36} height={36} className="pixelado rounded-md" />
          <span className="hidden text-[15px] font-extrabold tracking-wide sm:inline">
            INFECT <span className="text-sangre-claro">COZY</span>
          </span>
        </a>

        <nav aria-label="Secciones" className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {ENLACES.map((e) => (
            <a
              key={e.pagina}
              href={href(e.pagina)}
              aria-current={actual === e.pagina ? "page" : undefined}
              className={
                "whitespace-nowrap rounded-full px-2.5 py-1.5 text-sm font-medium transition-colors sm:px-3 " +
                (actual === e.pagina ? "bg-white/10 text-foreground" : "text-muted hover:bg-white/5 hover:text-foreground")
              }
            >
              {e.corto ? (
                <>
                  <span className="sm:hidden">{e.corto}</span>
                  <span className="hidden sm:inline">{e.texto}</span>
                </>
              ) : (
                e.texto
              )}
            </a>
          ))}
        </nav>

        <Buscador novedades={novedades} />

        {version && (
          <Chip size="sm" variant="soft" color="accent" className="hidden shrink-0 xl:inline-flex">
            Versión {version}
          </Chip>
        )}
        <a href={href("descargas")} className={buttonVariants({ variant: "primary", size: "sm" }) + " hidden shrink-0 sm:inline-flex"}>
          Descargar
        </a>
      </div>
    </header>
  );
}

export function Pie({ version, actualizado }: { version?: string; actualizado?: string }) {
  return (
    <footer className="mt-24 border-t border-white/5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <img src="./img/icono.png" alt="" width={28} height={28} className="pixelado rounded" />
          <span>
            Infect Cozy{version ? ` ${version}` : ""} · Minecraft 1.21.1
            {actualizado ? ` · actualizado el ${actualizado}` : ""}
          </span>
        </div>
        <p>Un modpack de Christian para jugar con amigos. No es un producto oficial de Minecraft.</p>
      </div>
    </footer>
  );
}
