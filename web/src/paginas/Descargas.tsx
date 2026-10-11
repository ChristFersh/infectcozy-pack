import { Accordion, Alert, Card, Chip, Skeleton, buttonVariants } from "@heroui/react";
import { useEffect, useState, type ReactNode } from "react";
import { PROBLEMAS, instruccion } from "../busqueda/instrucciones";
import { TextoRico } from "../componentes/TextoRico";
import { DETALLES, fecha, gb, type Datos, type Variante } from "../datos";

// Los textos de instalación están en busqueda/instrucciones.ts (el buscador también los usa).
// Cada bloque lleva el id de su instrucción, para poder enlazarlo: #/descargas/memoria.
const versiones = instruccion("versiones");
const instalar = instruccion("instalar");
const memoria = instruccion("memoria");
const servidor = instruccion("servidor");
const noEntra = instruccion("no-entra");

function Pasos({ items }: { items: ReactNode[] }) {
  return (
    <ol className="space-y-3.5">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3.5 leading-relaxed">
          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-sangre text-xs font-bold text-white">{i + 1}</span>
          <span className="texto-guia text-muted">{it}</span>
        </li>
      ))}
    </ol>
  );
}

function T({ t }: { t: string }) {
  return <TextoRico texto={t} />;
}

function TarjetaVersion({ v }: { v: Variante }) {
  const det = DETALLES[v.id];
  return (
    <Card className="h-full">
      <Card.Header className="gap-2">
        <div className="flex items-start justify-between gap-2">
          <Card.Title className="text-xl font-bold">{v.nombre}</Card.Title>
          <Chip size="sm" variant="soft" color="accent">
            {gb(v.ram_mb)}
          </Chip>
        </div>
        <Card.Description className="leading-snug">{det?.ideal ?? v.descripcion}</Card.Description>
      </Card.Header>
      <Card.Content className="gap-3 text-sm">
        {det && (
          <>
            <p className="text-muted">
              RAM de tu PC: <span className="font-medium text-foreground">{det.pc}</span>
            </p>
            <ul className="space-y-1.5">
              {det.graficos.map((g) => (
                <li key={g} className="flex gap-2 text-muted">
                  <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-sangre" aria-hidden />
                  {g}
                </li>
              ))}
            </ul>
          </>
        )}
      </Card.Content>
      <Card.Footer className="mt-auto flex-col items-stretch gap-2">
        <a href={v.prism} download className={buttonVariants({ variant: "primary", fullWidth: true })}>
          Zip para Prism
        </a>
      </Card.Footer>
    </Card>
  );
}

export function Descargas({ datos, cargando, ancla }: { datos?: Datos; cargando: boolean; ancla?: string }) {
  // Si se llega a un problema por su enlace (desde el buscador), se abre.
  const [abiertos, setAbiertos] = useState<Set<string | number>>(new Set());
  useEffect(() => {
    if (ancla && PROBLEMAS.some((p) => p.id === ancla)) setAbiertos((a) => new Set([...a, ancla]));
  }, [ancla]);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:pt-14">
      <header className="brillo-infeccion rounded-3xl border border-white/5 px-6 py-8 sm:px-10 sm:py-10">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Descargas</h1>
        <p className="mt-3 max-w-3xl text-lg text-muted">
          Elige la versión que aguante tu PC. Las cinco tienen el mismo contenido de juego y sirven para el mismo servidor:
          solo cambian los gráficos.
        </p>
        {datos && (
          <div className="mt-5 flex flex-wrap gap-2">
            <Chip color="accent">Versión {datos.version}</Chip>
            <Chip variant="soft">Minecraft {datos.minecraft}</Chip>
            <Chip variant="soft">NeoForge {datos.loader_version}</Chip>
            <Chip variant="soft">Actualizado el {fecha(datos.actualizado)}</Chip>
          </div>
        )}
      </header>

      {/* Versiones */}
      <section id="versiones" className="mt-10">
        <h2 className="text-2xl font-bold">{versiones.titulo}</h2>
        <p className="texto-guia mt-1 text-muted">
          <T t={versiones.texto!} />
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {cargando && [0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-96 rounded-3xl" />)}
          {datos?.variantes.map((v) => <TarjetaVersion key={v.id} v={v} />)}
        </div>
        {!cargando && !datos && (
          <Alert status="danger" className="mt-4">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>No se pudo cargar la lista de versiones</Alert.Title>
              <Alert.Description>Recarga la página en unos minutos.</Alert.Description>
            </Alert.Content>
          </Alert>
        )}
        {datos && datos.manuales.length > 0 && (
          <Alert status="warning" className="mt-6">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Mods que se bajan a mano</Alert.Title>
              <Alert.Description>
                Sus autores no permiten que otros programas los descarguen. Si al iniciar sale un aviso con alguno, descárgalo y
                ponlo en la carpeta <code className="codigo">mods</code> de la instancia:
                <ul className="mt-2 list-disc pl-5">
                  {datos.manuales.map((m) => (
                    <li key={m.archivo}>
                      <a className="underline" href={m.url}>
                        {m.nombre}
                      </a>{" "}
                      → <code className="codigo">mods/{m.archivo}</code>
                    </li>
                  ))}
                </ul>
              </Alert.Description>
            </Alert.Content>
          </Alert>
        )}
      </section>

      {/* Instalación */}
      <section id="instalar" className="mt-16 scroll-mt-24">
        <h2 className="text-2xl font-bold">{instalar.titulo}</h2>
        <Card className="mt-5">
          <Card.Content className="p-2 sm:p-4">
            <div className="px-2 py-4 sm:px-4">
              <Pasos items={instalar.pasos!.map((t) => <T t={t} />)} />
              <Alert id={memoria.id} status="accent" className="mt-6 scroll-mt-24">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>{memoria.titulo}</Alert.Title>
                  <Alert.Description>
                    <T t={memoria.texto!} />
                  </Alert.Description>
                </Alert.Content>
              </Alert>
            </div>
          </Card.Content>
        </Card>
      </section>

      {/* Servidor */}
      <section id="servidor" className="mt-16 scroll-mt-24">
        <h2 className="text-2xl font-bold">{servidor.titulo}</h2>
        <div className="mt-5 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card>
            <Card.Content className="p-6">
              <Pasos items={servidor.pasos!.map((t) => <T t={t} />)} />
            </Card.Content>
          </Card>
          <Alert id={noEntra.id} status="warning" className="h-fit scroll-mt-24">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>{noEntra.titulo}</Alert.Title>
              <Alert.Description>
                <T t={noEntra.texto!} />
              </Alert.Description>
            </Alert.Content>
          </Alert>
        </div>
      </section>

      {/* Problemas */}
      <section id="problemas" className="mt-16 scroll-mt-24">
        <h2 className="text-2xl font-bold">Si algo falla</h2>
        <Accordion className="mt-5" variant="surface" allowsMultipleExpanded expandedKeys={abiertos} onExpandedChange={setAbiertos}>
          {PROBLEMAS.map((p) => (
            <Accordion.Item key={p.id} id={p.id}>
              <Accordion.Heading>
                {/* El id del elemento (para el ancla) va en el título: el del Item es solo su clave. */}
                <Accordion.Trigger id={p.id} className="scroll-mt-24">
                  {p.titulo}
                  <Accordion.Indicator />
                </Accordion.Trigger>
              </Accordion.Heading>
              <Accordion.Panel>
                <Accordion.Body className="text-muted">
                  <T t={p.texto!} />
                </Accordion.Body>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </section>

      {/* Guías en PDF */}
      {datos && datos.guias.length > 0 && (
        <section id="pdf" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-bold">Guías en PDF</h2>
          <p className="mt-1 text-muted">La guía de juego de esta web es la que está al día.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {datos.guias.map((g) => (
              <a key={g.url} href={g.url} className={buttonVariants({ variant: "secondary" })}>
                {g.titulo}
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
