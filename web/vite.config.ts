import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

// La web se publica en la raíz del repo de packwiz (GitHub Pages), junto a packs/, descargas/ y guias/.
// En desarrollo, esos archivos (y datos.json / novedades.json) se sirven desde la carpeta de arriba.
const REPO = resolve(__dirname, "..");
const DEL_REPO = /^\/(datos\.json|novedades\.json|descargas\/.+|guias\/.+)$/;
const TIPOS: Record<string, string> = {
  ".json": "application/json; charset=utf-8",
  ".zip": "application/zip",
  ".pdf": "application/pdf",
};

function archivosDelRepo(): Plugin {
  return {
    name: "archivos-del-repo",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const ruta = decodeURIComponent((req.url ?? "").split("?")[0]);
        if (!DEL_REPO.test(ruta)) return next();
        const archivo = resolve(REPO, "." + ruta);
        if (!archivo.startsWith(REPO) || !existsSync(archivo) || !statSync(archivo).isFile()) return next();
        res.setHeader("Content-Type", TIPOS[extname(archivo)] ?? "application/octet-stream");
        createReadStream(archivo).pipe(res);
      });
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss(), archivosDelRepo()],
  build: { outDir: "dist", emptyOutDir: true },
});
