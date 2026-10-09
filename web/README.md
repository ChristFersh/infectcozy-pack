# Web de Infect Cozy

Vite + React + HeroUI v3 (Tailwind v4). Tres apartados: inicio con novedades, descargas con la guía de instalación y la guía de juego.

## Verla en local

Doble clic en `../ver-web.bat`, o:

```
npm install
npm run dev
```

Se abre en http://localhost:5173. En local lee `datos.json`, `novedades.json`, `descargas/` y `guias/` de la carpeta de arriba (`_packwiz`).

## Publicarla

```
npm run publicar
```

Compila y copia `index.html`, `favicon.png`, `assets/` e `img/` a la raíz de `_packwiz`. Se sube con el próximo `publicar.bat` (o con `git push`).

## Qué se edita y dónde

| Qué | Dónde | ¿Hay que recompilar? |
|---|---|---|
| Novedades de cada versión | `../novedades.json` (la más nueva arriba) | No |
| Versiones, enlaces y tamaños | `../datos.json`, lo escribe `publicar.py` | No |
| Guía de juego | `src/guia/secciones/*.ts` | Sí |
| Textos de inicio y descargas | `src/paginas/` | Sí |
| Imágenes | `public/img/` | Sí |
| Iconos de las recetas | `public/iconos/` + `src/guia/iconos.json` (nombre en la guía → archivo) | Sí |
| Modelos 3D de los jefes | `public/modelos/<id>.json`, `<id>.png` y la miniatura `<id>.webp` | No, pero sí hay que volver a publicar (`npm run publicar` los copia) |

En `novedades.json`, el `tipo` de cada sección es `nuevo`, `equilibrio`, `arreglo`, `quitado` o `rendimiento`. Los textos admiten `**negrita**`, `*cursiva*` y `` `código` ``.

Los iconos y los modelos se sacan de los mods con los scripts de `herramientas/` (`iconos.py`, `modelos-geo.py` y `modelos-java/`); cada uno explica arriba cómo se usa.

La guía de juego sigue el esquema de `src/guia/tipos.ts`. Cuando cambie algo del juego, edita la sección que toque y sube `GUIA_VERSION` en `src/guia/indice.ts`.
