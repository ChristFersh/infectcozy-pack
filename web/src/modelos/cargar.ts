import * as THREE from "three";
import type { ModeloJefe, Parte } from "./formato";

const cargador = new THREE.TextureLoader();

function textura(url: string) {
  return new Promise<THREE.Texture>((ok, mal) =>
    cargador.load(
      url,
      (t) => {
        t.magFilter = THREE.NearestFilter;
        t.minFilter = THREE.NearestFilter;
        t.generateMipmaps = false;
        t.flipY = false;
        t.colorSpace = THREE.SRGBColorSpace;
        ok(t);
      },
      undefined,
      mal,
    ),
  );
}

function geometria(q: number[]) {
  const caras = q.length / 20;
  const pos = new Float32Array(caras * 12);
  const uv = new Float32Array(caras * 8);
  const idx: number[] = [];
  for (let c = 0; c < caras; c++) {
    for (let v = 0; v < 4; v++) {
      const k = c * 20 + v * 5;
      pos.set([q[k], q[k + 1], q[k + 2]], (c * 4 + v) * 3);
      uv.set([q[k + 3], q[k + 4]], (c * 4 + v) * 2);
    }
    const b = c * 4;
    idx.push(b, b + 1, b + 2, b, b + 2, b + 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function construir(parte: Parte, materiales: THREE.Material[]): THREE.Object3D {
  // M = T(p) · R · S · T(-o): un grupo para T(p)·R·S y dentro otro desplazado -o.
  const g = new THREE.Group();
  g.name = parte.n;
  g.position.set(...parte.p);
  if (parte.r) g.rotation.set(parte.r[0], parte.r[1], parte.r[2], "ZYX");
  if (parte.s) g.scale.set(...parte.s);
  if (parte.oculto) g.visible = false;
  const dentro = new THREE.Group();
  if (parte.o) dentro.position.set(-parte.o[0], -parte.o[1], -parte.o[2]);
  g.add(dentro);
  if (parte.q && parte.q.length) {
    const geo = geometria(parte.q);
    for (const m of materiales) dentro.add(new THREE.Mesh(geo, m));
  }
  for (const h of parte.h ?? []) dentro.add(construir(h, materiales));
  return g;
}

/** Carga un modelo y lo devuelve centrado en el origen, con los pies en y = 0 y en unidades de bloque. */
export async function cargarModelo(url: string): Promise<{ grupo: THREE.Group; datos: ModeloJefe }> {
  const datos = (await fetch(url).then((r) => r.json())) as ModeloJefe;
  const base = url.slice(0, url.lastIndexOf("/") + 1);
  const mapa = await textura(base + datos.textura);
  const materiales: THREE.Material[] = [
    new THREE.MeshLambertMaterial({ map: mapa, alphaTest: 0.1, side: THREE.DoubleSide }),
  ];
  if (datos.brillo) {
    const luz = await textura(base + datos.brillo);
    materiales.push(
      new THREE.MeshBasicMaterial({
        map: luz,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
  }

  const modelo = new THREE.Group();
  for (const p of datos.raiz) modelo.add(construir(p, materiales));
  const escala = (datos.escala ?? 1) / 16;
  // Los modelos de Java tienen la Y hacia abajo y Minecraft los dibuja con escala (-1, -1, 1).
  modelo.scale.set(datos.yArriba ? escala : -escala, datos.yArriba ? escala : -escala, escala);

  // Minecraft gira las entidades 180° para que miren hacia la cámara.
  const girado = new THREE.Group();
  girado.rotation.y = Math.PI;
  girado.add(modelo);
  const grupo = new THREE.Group();
  grupo.add(girado);
  grupo.updateMatrixWorld(true);
  const caja = cajaVisible(girado);
  const centro = caja.getCenter(new THREE.Vector3());
  girado.position.set(-centro.x, -caja.min.y, -centro.z);
  grupo.updateMatrixWorld(true);
  return { grupo, datos };
}

/** Caja que ocupa lo que se ve (sin las partes ocultas). */
export function cajaVisible(objeto: THREE.Object3D) {
  objeto.updateMatrixWorld(true);
  const caja = new THREE.Box3();
  objeto.traverseVisible((o) => {
    if (o instanceof THREE.Mesh) caja.expandByObject(o);
  });
  return caja;
}
