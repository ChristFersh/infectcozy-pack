import { Card, Chip, Skeleton, buttonVariants } from "@heroui/react";
import { Novedad } from "../componentes/Novedad";
import type { Datos, Novedad as TNovedad } from "../datos";
import { href } from "../rutas";

const PILARES = [
  {
    titulo: "La colmena",
    texto: "Nace tras 12 horas de juego y solo avanza mientras hay alguien conectado. Su zona crece cada hora y retrocede si matas a sus mentes.",
    color: "text-sangre-claro",
    marca: "bg-sangre",
    enlace: { texto: "Cómo avanza", href: href("guia", "seccion-3") },
  },
  {
    titulo: "Los jefes",
    texto: "Una veintena repartidos entre el Overworld, el Nether y el End. Cada uno suelta materiales únicos y todo el servidor se entera la primera vez que caen.",
    color: "text-oro",
    marca: "bg-oro",
    enlace: { texto: "Verlos en 3D", href: href("guia", "jefes-3d") },
  },
  {
    titulo: "El arsenal",
    texto: "Cuatro armas y un set de armadura irrompibles, hechos con materiales de jefes y con mecánicas propias.",
    color: "text-teal",
    marca: "bg-teal",
    enlace: { texto: "Ver las recetas", href: href("guia", "seccion-6") },
  },
];

const PASOS = [
  { n: "1", titulo: "Elige tu versión", texto: "Hay cinco, de Ultra Low a Detallada. Todas sirven para el mismo servidor.", enlace: href("descargas") },
  { n: "2", titulo: "Impórtala en Prism", texto: "Un zip pequeño: los mods se descargan solos y se actualizan cada vez que abres el juego.", enlace: href("descargas", "instalar") },
  { n: "3", titulo: "Entra al servidor", texto: "Multijugador → Agregar servidor, con la dirección que te pase Christian.", enlace: href("descargas", "servidor") },
];

export function Inicio({ datos, novedades, errorNovedades }: { datos?: Datos; novedades?: TNovedad[]; errorNovedades: boolean }) {
  const [ultima, ...anteriores] = novedades ?? [];
  return (
    <>
      {/* Portada */}
      <section className="relative isolate">
        <picture>
          <source media="(max-width: 700px)" srcSet="./img/portada-900.webp" />
          <source media="(max-width: 1400px)" srcSet="./img/portada-1600.webp" />
          <img
            src="./img/portada-2400.webp"
            alt="Infect Cozy, servidor de Minecraft: una aldea acogedora invadida por raíces rojas de la infección"
            className="h-[58vh] min-h-[320px] w-full object-cover object-[50%_35%] sm:h-[72vh] sm:max-h-[760px]"
          />
        </picture>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-background via-background/70 to-transparent" />
      </section>

      <section className="relative z-10 mx-auto -mt-16 max-w-6xl px-4 sm:-mt-24">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex flex-wrap justify-center gap-2">
            <Chip variant="soft" color="accent">
              Versión {datos?.version ?? "…"}
            </Chip>
            <Chip variant="soft">Minecraft {datos?.minecraft ?? "1.21.1"}</Chip>
            <Chip variant="soft">NeoForge {datos?.loader_version ?? "…"}</Chip>
          </div>
          <h1 className="max-w-3xl text-balance text-3xl font-extrabold leading-tight sm:text-5xl">
            Sobrevive juntos. <span className="text-sangre-claro">No te dejes infectar.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg text-muted">
            Un modpack de terror para jugar con amigos: una infección que crece mientras hay gente conectada, monstruos que se
            adaptan a tu equipo y una veintena de jefes.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href={href("descargas")} className={buttonVariants({ variant: "primary", size: "lg" })}>
              Descargar {datos ? datos.version : ""}
            </a>
            <a href={href("guia")} className={buttonVariants({ variant: "secondary", size: "lg" })}>
              Guía de juego
            </a>
            <a href="#novedades" className={buttonVariants({ variant: "ghost", size: "lg" })}>
              Novedades
            </a>
          </div>
        </div>
      </section>

      {/* Qué es */}
      <section className="mx-auto mt-20 max-w-6xl px-4">
        <div className="grid gap-4 md:grid-cols-3">
          {PILARES.map((p) => (
            <Card key={p.titulo} className="h-full">
              <Card.Header>
                <span className={"mb-1 block h-1 w-10 rounded-full " + p.marca} aria-hidden />
                <Card.Title className={"text-lg font-bold " + p.color}>{p.titulo}</Card.Title>
                <Card.Description className="leading-relaxed">{p.texto}</Card.Description>
              </Card.Header>
              <Card.Footer>
                <a href={p.enlace.href} className={"text-sm font-semibold hover:underline " + p.color}>
                  {p.enlace.texto} →
                </a>
              </Card.Footer>
            </Card>
          ))}
        </div>
      </section>

      {/* Cómo empezar */}
      <section className="mx-auto mt-16 max-w-6xl px-4">
        <h2 className="text-2xl font-bold">Empieza en tres pasos</h2>
        <ol className="mt-5 grid gap-4 md:grid-cols-3">
          {PASOS.map((p) => (
            <li key={p.n}>
              <a href={p.enlace} className="group flex h-full gap-4 rounded-2xl border border-white/5 bg-surface/60 p-5 transition-colors hover:border-sangre/40 hover:bg-surface">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sangre text-sm font-bold text-white">{p.n}</span>
                <span>
                  <span className="block font-semibold group-hover:text-sangre-claro">{p.titulo}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted">{p.texto}</span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </section>

      {/* Novedades */}
      <section id="novedades" className="mx-auto mt-20 max-w-6xl scroll-mt-24 px-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">Novedades</h2>
            <p className="mt-1 text-muted">Qué trae cada actualización del pack.</p>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {!novedades && !errorNovedades && <Skeleton className="h-72 rounded-3xl" />}
          {errorNovedades && <p className="text-muted">No se pudieron cargar las novedades.</p>}
          {ultima && <Novedad n={ultima} reciente />}
          {anteriores.length > 0 && (
            <>
              <h3 className="pt-4 text-lg font-semibold text-muted">Versiones anteriores</h3>
              {anteriores.map((n) => (
                <Novedad key={n.version} n={n} />
              ))}
            </>
          )}
        </div>
      </section>
    </>
  );
}

