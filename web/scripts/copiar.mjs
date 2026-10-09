// Copia la web compilada (dist/) a la raíz del repo de packwiz, que es lo que publica GitHub Pages.
// Solo toca index.html, favicon.png, assets/, img/, iconos/ y modelos/: packs/, descargas/, guias/, datos.json y novedades.json no se tocan.
import { cpSync, existsSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const web = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(web, "dist");
const repo = resolve(web, "..");

if (!existsSync(resolve(dist, "index.html"))) {
  console.error("No hay dist/index.html: ejecuta antes npm run build.");
  process.exit(1);
}
// Se borran las carpetas viejas para no acumular archivos que ya no se usan (assets/ lleva hashes en los nombres).
for (const carpeta of ["assets", "iconos", "modelos"]) rmSync(resolve(repo, carpeta), { recursive: true, force: true });
for (const nombre of ["index.html", "favicon.png", "assets", "img", "iconos", "modelos"]) {
  cpSync(resolve(dist, nombre), resolve(repo, nombre), { recursive: true, force: true });
}
console.log("Web copiada a la raíz del repo. Se publica con el próximo publicar.bat (o git push).");
