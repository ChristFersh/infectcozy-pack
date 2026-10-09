import { Chip, buttonVariants } from "@heroui/react";
import { href, type Pagina } from "../rutas";

const ENLACES: { pagina: Pagina; texto: string }[] = [
  { pagina: "inicio", texto: "Inicio" },
  { pagina: "descargas", texto: "Descargas" },
  { pagina: "guia", texto: "Guía de juego" },
];

export function Cabecera({ actual, version }: { actual: Pagina; version?: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[oklch(0.13_0.008_285/0.82)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5 sm:gap-6">
        <a href={href("inicio")} className="flex shrink-0 items-center gap-2.5" aria-label="Infect Cozy, inicio">
          <img src="./img/icono.png" alt="" width={36} height={36} className="pixelado rounded-md" />
          <span className="hidden text-[15px] font-extrabold tracking-wide sm:inline">
            INFECT <span className="text-sangre-claro">COZY</span>
          </span>
        </a>

        <nav aria-label="Secciones" className="flex flex-1 items-center gap-1 overflow-x-auto">
          {ENLACES.map((e) => (
            <a
              key={e.pagina}
              href={href(e.pagina)}
              aria-current={actual === e.pagina ? "page" : undefined}
              className={
                "whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-colors " +
                (actual === e.pagina ? "bg-white/10 text-foreground" : "text-muted hover:bg-white/5 hover:text-foreground")
              }
            >
              {e.texto}
            </a>
          ))}
        </nav>

        {version && (
          <Chip size="sm" variant="soft" color="accent" className="hidden md:inline-flex">
            Versión {version}
          </Chip>
        )}
        <a href={href("descargas")} className={buttonVariants({ variant: "primary", size: "sm" }) + " hidden sm:inline-flex"}>
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
