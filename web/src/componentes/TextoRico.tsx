import { Fragment, type ReactNode } from "react";

// Texto con **negrita**, *cursiva*, `código` y saltos de línea (\n). Nada de HTML.
const PATRON = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\s][^*]*\*)/g;

function enLinea(texto: string, clave: string): ReactNode[] {
  return texto.split(PATRON).map((trozo, i) => {
    const k = `${clave}-${i}`;
    if (trozo.startsWith("**") && trozo.endsWith("**") && trozo.length > 4) return <strong key={k}>{trozo.slice(2, -2)}</strong>;
    if (trozo.startsWith("`") && trozo.endsWith("`") && trozo.length > 2) return <code key={k}>{trozo.slice(1, -1)}</code>;
    if (trozo.startsWith("*") && trozo.endsWith("*") && trozo.length > 2) return <em key={k}>{trozo.slice(1, -1)}</em>;
    return <Fragment key={k}>{trozo}</Fragment>;
  });
}

export function TextoRico({ texto }: { texto: string }) {
  const lineas = texto.split("\n");
  return (
    <>
      {lineas.map((linea, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {enLinea(linea, String(i))}
        </Fragment>
      ))}
    </>
  );
}
