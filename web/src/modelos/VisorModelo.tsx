import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { cajaVisible, cargarModelo } from "./cargar";

/** Visor 3D de un jefe: gira solo, se arrastra para rotar y la rueda acerca. */
export default function VisorModelo({
  url,
  alto = 420,
  girar = true,
  encuadre = 0.95,
}: {
  url: string;
  alto?: number;
  girar?: boolean;
  /** Distancia de la cámara respecto a la que hace caber la esfera del modelo (menos = más cerca). */
  encuadre?: number;
}) {
  const caja = useRef<HTMLDivElement>(null);
  const [estado, setEstado] = useState<"cargando" | "listo" | "error">("cargando");

  useEffect(() => {
    const el = caja.current;
    if (!el) return;
    let vivo = true;
    const render = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    render.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    render.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(render.domElement);
    render.domElement.style.display = "block";

    const escena = new THREE.Scene();
    escena.add(new THREE.AmbientLight(0xffffff, 1.6));
    const sol = new THREE.DirectionalLight(0xffffff, 1.6);
    sol.position.set(4, 8, 6);
    escena.add(sol);
    const contra = new THREE.DirectionalLight(0xff6b6b, 0.5);
    contra.position.set(-5, 3, -6);
    escena.add(contra);

    const camara = new THREE.PerspectiveCamera(35, 1, 0.05, 500);
    const control = new OrbitControls(camara, render.domElement);
    control.enableDamping = true;
    control.autoRotate = girar;
    control.autoRotateSpeed = 1.6;
    control.enablePan = false;

    const ajustar = () => {
      const w = el.clientWidth;
      render.setSize(w, alto);
      camara.aspect = w / alto;
      camara.updateProjectionMatrix();
    };
    ajustar();
    const obs = new ResizeObserver(ajustar);
    obs.observe(el);

    cargarModelo(url)
      .then(({ grupo }) => {
        if (!vivo) return;
        escena.add(grupo);
        grupo.updateMatrixWorld(true);
        const esfera = cajaVisible(grupo).getBoundingSphere(new THREE.Sphere());
        const centro = esfera.center;
        // Que quepa la esfera entera, mirando el lado más estrecho del lienzo.
        const mitadV = THREE.MathUtils.degToRad(camara.fov / 2);
        const mitadH = Math.atan(Math.tan(mitadV) * camara.aspect);
        const dist = (esfera.radius / Math.sin(Math.min(mitadV, mitadH))) * encuadre;
        const dir = new THREE.Vector3(0.55, 0.32, 0.77).normalize();
        camara.position.copy(centro).addScaledVector(dir, dist);
        control.target.copy(centro);
        control.minDistance = dist * 0.3;
        control.maxDistance = dist * 2.5;
        control.update();
        setEstado("listo");
      })
      .catch(() => vivo && setEstado("error"));

    let marco = 0;
    const bucle = () => {
      marco = requestAnimationFrame(bucle);
      control.update();
      render.render(escena, camara);
    };
    bucle();

    return () => {
      vivo = false;
      cancelAnimationFrame(marco);
      obs.disconnect();
      control.dispose();
      render.dispose();
      escena.traverse((o) => {
        if (o instanceof THREE.Mesh) o.geometry.dispose();
      });
      el.removeChild(render.domElement);
    };
  }, [url, alto, girar, encuadre]);

  return (
    <div className="relative w-full" style={{ height: alto }}>
      <div ref={caja} className="absolute inset-0 cursor-grab active:cursor-grabbing" data-estado={estado} />
      {estado !== "listo" && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-muted">
          {estado === "cargando" ? "Cargando modelo…" : "No se pudo cargar el modelo."}
        </div>
      )}
    </div>
  );
}
