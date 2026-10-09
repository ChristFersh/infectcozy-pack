import { Chip, Modal, Spinner } from "@heroui/react";
import { lazy, Suspense, useState } from "react";

const VisorModelo = lazy(() => import("../modelos/VisorModelo"));

type Jefe = { modelo: string; nombre: string; detalle?: string; grupo?: string };

/** Tarjetas con la miniatura de cada jefe; al pulsar se abre su modelo 3D. */
export function GaleriaJefes({ items }: { items: Jefe[] }) {
  const [abierto, setAbierto] = useState<Jefe | null>(null);
  const grupos = [...new Set(items.map((j) => j.grupo ?? ""))];

  return (
    <div className="space-y-6">
      {grupos.map((g) => (
        <div key={g}>
          {g && <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">{g}</p>}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {items
              .filter((j) => (j.grupo ?? "") === g)
              .map((j) => (
                <button
                  key={j.modelo}
                  type="button"
                  onClick={() => setAbierto(j)}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(70%_60%_at_50%_45%,oklch(0.3_0.06_22/0.55),transparent_75%)] text-left transition-colors hover:border-sangre/50 focus-visible:outline-2 focus-visible:outline-sangre"
                >
                  <img
                    src={`./modelos/${j.modelo}.webp`}
                    alt=""
                    loading="lazy"
                    className="aspect-square w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="px-3 pb-3">
                    <span className="block font-semibold leading-tight">{j.nombre}</span>
                    {j.detalle && <span className="block text-xs text-muted">{j.detalle}</span>}
                  </span>
                  <Chip size="sm" variant="soft" color="accent" className="absolute right-2 top-2">
                    3D
                  </Chip>
                </button>
              ))}
          </div>
        </div>
      ))}

      <Modal>
        <Modal.Backdrop isOpen={!!abierto} onOpenChange={(o) => !o && setAbierto(null)}>
          <Modal.Container size="lg" placement="center">
            <Modal.Dialog className="sm:max-w-3xl">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading className="text-xl font-bold">{abierto?.nombre}</Modal.Heading>
                {abierto?.detalle && <p className="text-sm text-muted">{abierto.detalle}</p>}
              </Modal.Header>
              <Modal.Body>
                {abierto && (
                  <Suspense fallback={<Spinner className="mx-auto my-24" />}>
                    <VisorModelo url={`./modelos/${abierto.modelo}.json`} alto={460} encuadre={0.82} />
                  </Suspense>
                )}
                <p className="pt-2 text-center text-xs text-muted">Arrastra para girarlo · rueda o pellizco para acercar</p>
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
