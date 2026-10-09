import { Accordion, Alert, Card, Chip, Skeleton, buttonVariants } from "@heroui/react";
import type { ReactNode } from "react";
import { TextoRico } from "../componentes/TextoRico";
import { DETALLES, fecha, gb, type Datos, type Variante } from "../datos";

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

export function Descargas({ datos, cargando }: { datos?: Datos; cargando: boolean }) {
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
        <h2 className="text-2xl font-bold">1. Elige tu versión</h2>
        <p className="mt-1 text-muted">
          El pack se instala con <strong className="text-foreground">Prism Launcher</strong>. El zip de cada versión pesa poco:
          los mods se descargan solos y se actualizan cada vez que abres el juego.
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
        <h2 className="text-2xl font-bold">2. Instálala</h2>
        <Card className="mt-5">
          <Card.Content className="p-2 sm:p-4">
            <div className="px-2 py-4 sm:px-4">
              <Pasos
                items={[
                  <T t="Instala **Prism Launcher** desde **prismlauncher.org** y entra con tu cuenta de Microsoft." />,
                  <T t="Descarga el **zip para Prism** de tu versión (arriba)." />,
                  <T t="En Prism pulsa **Añadir instancia → Importar** y elige ese zip, sin descomprimir." />,
                  <T t="Pulsa **Iniciar**. La primera vez se abre una ventana que descarga todos los mods: espera a que termine. Luego, cada vez que abras el juego, solo baja lo que cambió." />,
                ]}
              />
              <Alert status="accent" className="mt-6">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>La memoria ya viene puesta</Alert.Title>
                  <Alert.Description>
                    El zip trae la memoria de tu versión y los parámetros de Java ajustados. Para cambiar de versión, importa el zip
                    de la otra: queda como una instancia aparte.
                  </Alert.Description>
                </Alert.Content>
              </Alert>
            </div>
          </Card.Content>
        </Card>
      </section>

      {/* Servidor */}
      <section id="servidor" className="mt-16 scroll-mt-24">
        <h2 className="text-2xl font-bold">3. Entra al servidor</h2>
        <div className="mt-5 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card>
            <Card.Content className="p-6">
              <Pasos
                items={[
                  <T t="En el menú principal: **Multijugador → Agregar servidor**." />,
                  <T t="Nombre: **Infect Cozy** · Dirección: la que te pase Christian. Pulsa **Listo**." />,
                  <T t="Haz doble clic en el servidor para entrar. Al llegar recibes el kit de bienvenida y la **Guía de Infect Cozy**." />,
                ]}
              />
            </Card.Content>
          </Card>
          <Alert status="warning" className="h-fit">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>¿No te deja entrar?</Alert.Title>
              <Alert.Description>
                Si dice que no estás en la lista blanca, pásale a Christian tu nombre de jugador exacto. Si habla de mods
                incompatibles, usa la versión más reciente del pack.
              </Alert.Description>
            </Alert.Content>
          </Alert>
        </div>
      </section>

      {/* Problemas */}
      <section id="problemas" className="mt-16 scroll-mt-24">
        <h2 className="text-2xl font-bold">Si algo falla</h2>
        <Accordion className="mt-5" variant="surface">
          {[
            ["La ventana de Prism se queda descargando o falla un mod", "Cierra y vuelve a pulsar Iniciar: retoma lo que falta. Si un mod pide bajarse a mano, sale en el aviso de arriba."],
            ["El juego se cierra al cargar o va muy lento", "Revisa la memoria (la de tu versión) o usa una versión más ligera, como Lite o Ultra Low. Cierra el navegador y Discord antes de jugar."],
            ["Sale «mods incompatibles» al entrar al servidor", "Tienes una versión vieja. Cierra el juego y vuelve a abrirlo desde Prism: se actualiza solo."],
            ["Cualquier otro error", "Envíale a Christian el archivo latest.log de la carpeta logs (o el de crash-reports). En Prism: clic derecho en la instancia → Carpeta."],
          ].map(([p, s], i) => (
            <Accordion.Item key={i} id={`p${i}`}>
              <Accordion.Heading>
                <Accordion.Trigger>
                  {p}
                  <Accordion.Indicator />
                </Accordion.Trigger>
              </Accordion.Heading>
              <Accordion.Panel>
                <Accordion.Body className="text-muted">{s}</Accordion.Body>
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
