import { Kbd, SearchField } from "@heroui/react";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { flushSync } from "react-dom";
import type { Novedad } from "../datos";
import { href, ir } from "../rutas";
import { buscar } from "./buscar";
import { documentos } from "./indice";
import { ETIQUETA, Resaltado, migasDoc, nombreDoc } from "./Resaltado";

// Buscador de la cabecera: resultados al escribir, flechas + Enter para elegir, Esc para cerrar.
// Ctrl+K (⌘K en Mac) o / lo enfocan desde cualquier sitio. En el móvil vive en una fila aparte que se abre con la lupa.

const MAC = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

function escribiendo(el: Element | null) {
  return !!el && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || (el as HTMLElement).isContentEditable);
}

export function Buscador({ novedades }: { novedades?: Novedad[] }) {
  const [texto, setTexto] = useState("");
  const [lista, setLista] = useState(false);
  const [activo, setActivo] = useState(-1);
  /** En el móvil: la fila del buscador está abierta. */
  const [fila, setFila] = useState(false);
  const entrada = useRef<HTMLInputElement>(null);

  const consulta = texto.trim();
  const resultados = useMemo(
    () => (consulta.length >= 2 ? buscar(documentos(novedades), consulta, { limite: 6, porRuta: 2 }) : []),
    [consulta, novedades],
  );
  // Opciones de la lista: los resultados y, al final, "Ver todos".
  const opciones = consulta.length >= 2 ? resultados.length + 1 : 0;

  const abrir = () => {
    // Primero se muestra la fila (en el móvil está oculta) y luego se enfoca, sin perder lo que se teclee justo después.
    flushSync(() => setFila(true));
    entrada.current?.focus();
    entrada.current?.select();
  };

  useEffect(() => {
    const tecla = (e: globalThis.KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey) && !e.altKey) {
        e.preventDefault();
        abrir();
      } else if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey && !escribiendo(document.activeElement)) {
        e.preventDefault();
        abrir();
      }
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, []);

  const cerrar = (vaciar: boolean) => {
    setLista(false);
    setActivo(-1);
    if (vaciar) setTexto("");
    setFila(false);
    entrada.current?.blur();
  };

  const elegir = (i: number) => {
    const destino = i >= 0 && i < resultados.length ? resultados[i].doc.ruta : href("buscar", consulta);
    cerrar(true);
    ir(destino);
  };

  const teclas = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" && opciones > 0) {
      e.preventDefault();
      setLista(true);
      setActivo((a) => (a + 1) % opciones);
    } else if (e.key === "ArrowUp" && opciones > 0) {
      e.preventDefault();
      setLista(true);
      setActivo((a) => (a <= 0 ? opciones - 1 : a - 1));
    } else if (e.key === "Enter" && consulta) {
      e.preventDefault();
      elegir(lista ? activo : -1);
    } else if (e.key === "Escape") {
      // El campo ya se vacía solo con Esc; con el campo vacío, Esc lo cierra.
      setLista(false);
      setActivo(-1);
      if (!texto) cerrar(false);
    }
  };

  const desplegado = lista && consulta.length >= 2;

  return (
    <>
      {/* Lupa del móvil: abre la fila del buscador. */}
      <button
        type="button"
        // Sin quitar el foco al campo: si no, al cerrarse por el blur, el clic lo volvería a abrir.
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => (fila ? cerrar(false) : abrir())}
        aria-label="Buscar en la web"
        aria-expanded={fila}
        className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-foreground lg:hidden"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </button>

      <div className={(fila ? "order-last basis-full pb-1" : "hidden") + " relative min-w-0 lg:order-none lg:block lg:w-64 lg:basis-auto lg:pb-0 xl:w-72"}>
        <SearchField
          aria-label="Buscar en la guía y en la web"
          value={texto}
          onChange={(v) => {
            setTexto(v);
            setLista(true);
            setActivo(-1);
          }}
          onKeyDown={teclas}
          onBlur={() => {
            setLista(false);
            if (!texto) setFila(false);
          }}
          onFocus={() => setLista(true)}
          fullWidth
          variant="secondary"
        >
          <SearchField.Group className="w-full min-w-0 rounded-full">
            <SearchField.SearchIcon />
            <SearchField.Input
              ref={entrada}
              className="min-w-0 flex-1"
              placeholder="Buscar en la guía…"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={desplegado}
              aria-controls="buscador-lista"
              aria-activedescendant={desplegado && activo >= 0 ? `buscador-opcion-${activo}` : undefined}
            />
            {texto ? (
              <SearchField.ClearButton />
            ) : (
              <Kbd className="pointer-events-none mr-2 hidden text-[11px] lg:inline-flex">
                <Kbd.Content>{MAC ? "⌘" : "Ctrl"}</Kbd.Content>
                <Kbd.Content>K</Kbd.Content>
              </Kbd>
            )}
          </SearchField.Group>
        </SearchField>

        {desplegado && (
          <div
            // Que pulsar un resultado no quite el foco del campo antes de navegar.
            onMouseDown={(e) => e.preventDefault()}
            className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-overlay shadow-2xl shadow-black/50 lg:left-auto lg:w-[28rem]"
          >
            <ul id="buscador-lista" role="listbox" aria-label="Resultados" className="max-h-[70dvh] overflow-y-auto p-1.5">
              {resultados.map((r, i) => (
                <li key={r.doc.id} id={`buscador-opcion-${i}`} role="option" aria-selected={activo === i}>
                  <a
                    href={r.doc.ruta}
                    onClick={(e) => {
                      e.preventDefault();
                      elegir(i);
                    }}
                    onMouseEnter={() => setActivo(i)}
                    className={"block rounded-xl px-3 py-2.5 transition-colors " + (activo === i ? "bg-white/[0.08]" : "")}
                  >
                    <span className="flex items-center gap-2 text-[11px] text-muted">
                      <span className="shrink-0 rounded bg-white/[0.06] px-1.5 py-px font-medium uppercase tracking-wider text-sangre-claro">
                        {ETIQUETA[r.doc.tipo]}
                      </span>
                      <span className="truncate">{migasDoc(r.doc)}</span>
                    </span>
                    <span className="mt-1 block text-sm font-semibold leading-snug">{nombreDoc(r.doc)}</span>
                    <span className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-muted">
                      <Resaltado {...r.fragmento} />
                    </span>
                  </a>
                </li>
              ))}
              {resultados.length === 0 && <li className="px-3 py-3 text-sm text-muted">No hay nada que coincida con «{consulta}».</li>}
              <li id={`buscador-opcion-${resultados.length}`} role="option" aria-selected={activo === resultados.length}>
                <a
                  href={href("buscar", consulta)}
                  onClick={(e) => {
                    e.preventDefault();
                    elegir(-1);
                  }}
                  onMouseEnter={() => setActivo(resultados.length)}
                  className={
                    "flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sangre-claro transition-colors " +
                    (activo === resultados.length ? "bg-white/[0.08]" : "")
                  }
                >
                  <span className="truncate">Ver todos los resultados de «{consulta}»</span>
                  <Kbd className="shrink-0 text-[11px]">Enter</Kbd>
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
