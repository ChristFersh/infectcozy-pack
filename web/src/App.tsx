import { lazy, Suspense } from "react";
import { Cabecera, Pie } from "./componentes/Cabecera";
import { fecha, useDatos, useNovedades } from "./datos";
import { Buscar } from "./paginas/Buscar";
import { Descargas } from "./paginas/Descargas";
import { Guia } from "./paginas/Guia";
import { Inicio } from "./paginas/Inicio";
import { useDesplazar, useRuta } from "./rutas";

const VisorModelo = lazy(() => import("./modelos/VisorModelo"));

export default function App() {
  const ruta = useRuta();
  const datos = useDatos();
  const novedades = useNovedades();
  const d = !datos.cargando && "datos" in datos ? datos.datos : undefined;
  const n = !novedades.cargando && "datos" in novedades ? novedades.datos : undefined;

  useDesplazar(ruta, !datos.cargando && !novedades.cargando);

  // Página de prueba (solo en desarrollo): #/modelo/<id> muestra un jefe en grande, sin girar.
  if (import.meta.env.DEV && ruta.pagina === "modelo" && ruta.ancla)
    return (
      <Suspense>
        <VisorModelo url={`./modelos/${ruta.ancla}.json`} alto={720} girar={false} encuadre={1.08} />
      </Suspense>
    );

  return (
    <div className="min-h-dvh">
      <Cabecera actual={ruta.pagina} version={d?.version} novedades={n} />
      <main>
        {ruta.pagina === "inicio" && <Inicio datos={d} novedades={n} errorNovedades={!novedades.cargando && !n} />}
        {ruta.pagina === "descargas" && <Descargas datos={d} cargando={datos.cargando} ancla={ruta.ancla} />}
        {ruta.pagina === "guia" && <Guia ancla={ruta.ancla} />}
        {ruta.pagina === "buscar" && <Buscar ruta={ruta} novedades={n} />}
      </main>
      <Pie version={d?.version} actualizado={d ? fecha(d.actualizado) : undefined} />
    </div>
  );
}
