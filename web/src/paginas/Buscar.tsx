import { Card, Chip, SearchField, buttonVariants } from "@heroui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { buscar, resaltar, type Resultado } from "../busqueda/buscar";
import { documentos } from "../busqueda/indice";
import { ETIQUETA, Resaltado, migasDoc, nombreDoc } from "../busqueda/Resaltado";
import type { Novedad } from "../datos";
import { TarjetaObjeto } from "../guia/Objetos";
import { TarjetaReceta } from "../guia/Receta";
import { href, type Ruta } from "../rutas";

const EJEMPLOS = ["¿Cómo se consigue netherita templada?", "Tridente del Abismo", "Rednight", "Yunque del Abismo", "Instalar Prism"];

function Ejemplos() {
  return (
    <div className="flex flex-wrap gap-2">
      {EJEMPLOS.map((e) => (
        <a
          key={e}
          href={href("buscar", e)}
          className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-sm text-foreground/85 transition-colors hover:border-sangre/50 hover:bg-sangre/10"
        >
          {e}
        </a>
      ))}
    </div>
  );
}

/** La respuesta directa: la receta o el objeto, o el mejor trozo de texto. */
function Respuesta({ r, consulta }: { r: Resultado; consulta: string }) {
  const { doc } = r;
  const payload = doc.payload;
  return (
    <Card className="brillo-infeccion border border-sangre/30">
      <Card.Header className="gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Chip color="accent" size="sm">
            Respuesta
          </Chip>
          <span className="text-sm text-muted">{migasDoc(doc)}</span>
        </div>
        {!payload && (
          <Card.Title className="text-xl font-bold">
            <Resaltado texto={nombreDoc(doc)} marcas={resaltar(nombreDoc(doc), consulta)} />
          </Card.Title>
        )}
      </Card.Header>
      <Card.Content className="gap-4">
        {payload && "receta" in payload && (
          <div className="max-w-md">
            <TarjetaReceta r={payload.receta} />
          </div>
        )}
        {payload && "objeto" in payload && (
          <div className="max-w-xl">
            <TarjetaObjeto o={payload.objeto} />
          </div>
        )}
        {!payload && (
          <p className="text-[15px] leading-relaxed text-foreground/85">
            <Resaltado {...r.fragmento} />
          </p>
        )}
      </Card.Content>
      <Card.Footer>
        <a href={doc.ruta} className={buttonVariants({ variant: "secondary", size: "sm" })}>
          Ir a la sección
        </a>
      </Card.Footer>
    </Card>
  );
}

function Fila({ r, consulta }: { r: Resultado; consulta: string }) {
  const nombre = nombreDoc(r.doc);
  return (
    <li>
      <a href={r.doc.ruta} className="block rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-3.5 transition-colors hover:border-white/15 hover:bg-white/[0.05]">
        <span className="flex min-w-0 items-center gap-2 text-xs text-muted">
          <span className="shrink-0 rounded bg-white/[0.06] px-1.5 py-px font-medium uppercase tracking-wider text-sangre-claro">{ETIQUETA[r.doc.tipo]}</span>
          <span className="truncate">{migasDoc(r.doc)}</span>
        </span>
        <span className="mt-1.5 block font-semibold leading-snug">
          <Resaltado texto={nombre} marcas={resaltar(nombre, consulta)} />
        </span>
        <span className="mt-1 block text-sm leading-relaxed text-muted">
          <Resaltado {...r.fragmento} />
        </span>
      </a>
    </li>
  );
}

export function Buscar({ ruta, novedades }: { ruta: Ruta; novedades?: Novedad[] }) {
  const [texto, setTexto] = useState(ruta.ancla ?? "");
  const entrada = useRef<HTMLInputElement>(null);
  // Sin búsqueda, el campo se enfoca solo para escribir directamente.
  useEffect(() => {
    if (!ruta.ancla) entrada.current?.focus();
  }, [ruta]);
  // Una búsqueda nueva desde la cabecera cambia la ruta: el campo se pone al día.
  useEffect(() => setTexto(ruta.ancla ?? ""), [ruta]);

  // La dirección sigue a lo que se escribe (sin crear historial ni avisar a useRuta), para poder compartirla.
  const consulta = texto.trim();
  useEffect(() => {
    const destino = href("buscar", consulta || undefined);
    if (window.location.hash !== destino) history.replaceState(null, "", destino);
  }, [consulta]);

  const resultados = useMemo(() => (consulta ? buscar(documentos(novedades), consulta, { limite: 30, porRuta: 4 }) : []), [consulta, novedades]);
  // La primera es respuesta solo si tiene todo lo buscado.
  const respuesta = resultados[0]?.completo ? resultados[0] : undefined;
  const resto = respuesta ? resultados.slice(1) : resultados;

  return (
    <div className="mx-auto max-w-4xl px-4 pt-10 sm:pt-14">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Buscar</h1>
      <p className="mt-2 text-muted">En la guía de juego, la instalación y las novedades. Pregunta como quieras: «¿de dónde sale el ignitio?».</p>

      <SearchField aria-label="Buscar" value={texto} onChange={setTexto} fullWidth className="mt-6" variant="secondary">
        <SearchField.Group className="h-12 w-full min-w-0 rounded-2xl text-base">
          <SearchField.SearchIcon className="ml-1" />
          <SearchField.Input ref={entrada} className="min-w-0 flex-1" placeholder="¿Cómo se consigue…?" />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>

      {!consulta && (
        <div className="mt-8">
          <p className="mb-3 text-sm font-medium text-muted">Prueba con:</p>
          <Ejemplos />
        </div>
      )}

      {consulta && resultados.length === 0 && (
        <div className="mt-8 rounded-2xl border border-white/10 p-6">
          <p className="font-semibold">No hay nada que coincida con «{consulta}».</p>
          <p className="mt-1 text-sm text-muted">Prueba con menos palabras o con el nombre del objeto tal como sale en el juego.</p>
          <div className="mt-4">
            <Ejemplos />
          </div>
        </div>
      )}

      {respuesta && (
        <div className="mt-8">
          <Respuesta r={respuesta} consulta={consulta} />
        </div>
      )}

      {resto.length > 0 && (
        <section className="mt-10" aria-label="Resultados">
          <h2 className="mb-3 text-sm font-medium text-muted">
            {resultados.length === 1 ? "1 resultado" : `${resultados.length} resultados`}
          </h2>
          <ul className="space-y-2.5">
            {resto.map((r) => (
              <Fila key={r.doc.id} r={r} consulta={consulta} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
