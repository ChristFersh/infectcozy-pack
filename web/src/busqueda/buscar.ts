import type { Doc } from "./indice";

// Búsqueda por palabras clave, toda en el navegador. Las palabras se comparan sin tildes ni mayúsculas
// y reducidas a una raíz sencilla (plurales fuera), y cada documento suma puntos según dónde aparecen:
// en el nombre (receta, objeto...) más que en el título del apartado, y ahí más que en el texto.

/** Palabras que no aportan nada a la búsqueda (ya normalizadas: sin tildes). */
const VACIAS = new Set(
  (
    "como donde que cual cuales cuando cuanto cuanta cuantos cuantas quien porque se consigue consigo conseguir consiguen " +
    "obtener obtengo obtiene obtienen sacar saco saca hacer hago hace hacen craftear crafteo fabricar fabrico " +
    "el la lo los las un una unos unas de del para por en y e o u a al mi mis me es son esta estan hay puedo puede " +
    "tengo tiene tienen con su sus tu tus te le les nos este esto ese eso esa estos esas ya muy mas pero si no ni"
  ).split(" "),
);

/** Palabras que indican que se busca cómo conseguir algo: dan ventaja a recetas, objetos y "sale de". */
const OBTENER = new Set(
  (
    "consigue consigo conseguir consiguen obtener obtengo obtiene obtienen sacar saco saca craftear crafteo craft crafting " +
    "fabricar fabrico fabrica hacer hago hace receta recetas dropea dropean drop drops suelta sueltan sale salen"
  ).split(" "),
);

/** Palabras que preguntan cómo se invoca o empieza algo (un jefe, la infección...). */
const INVOCAR = new Set(
  (
    "invoco invocar invoca invocan invocarlo invocarla despierto despertar despierta despiertan empieza empezar empiezo " +
    "comienza comenzar activo activar activa spawnear spawnea aparece aparecer"
  ).split(" "),
);

/** Indicios en el texto de que explica cómo empieza algo. */
const PISTAS_INVOCAR = /\b(como empieza|invoca|despierta|despertarlo|se activa|altar)\b/;

/** Sinónimos de una palabra (inglés del juego, abreviaturas...). */
const SINONIMOS: Record<string, string> = {
  netherite: "netherita",
  boss: "jefe",
  bosses: "jefe",
  jefazo: "jefe",
  mods: "mod",
  armor: "armadura",
  sword: "espada",
  enchant: "encantamiento",
  craft: "receta",
  crafting: "receta",
  drop: "suelta",
  drops: "suelta",
};

/** Sinónimos de varias palabras, sobre la consulta ya normalizada. */
const FRASES: [RegExp, string][] = [
  [/\bnether star\b/g, "estrella del nether"],
  [/\bender dragon\b/g, "dragon del end"],
  [/\bdragon\b(?! del end)/g, "dragon del end"],
];

/** Indicios en el texto de que habla de cómo se consigue algo. */
const PISTAS_OBTENER = /\b(sale de|sale en|se fabrica|se consigue|se obtiene|receta|suelta|sueltan|dropea|se craftea)\b/;

const PALABRA = /[\p{L}\p{M}\p{N}]+/gu;

/** "¿Cómo?" → "como": minúsculas, sin tildes y sin signos. */
export function normalizar(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

/** Raíz sencilla para español: quita el plural (jefes → jefe, materiales → material, raíces → raiz). */
export function raiz(p: string) {
  if (p.length > 6 && p.endsWith("ciones")) return p.slice(0, -2);
  if (p.length > 4 && p.endsWith("ces")) return p.slice(0, -3) + "z";
  if (p.length > 4 && /[aeiou][rln]es$/.test(p)) return p.slice(0, -2);
  if (p.length > 3 && p.endsWith("s") && !p.endsWith("ss")) return p.slice(0, -1);
  return p;
}

/** Raíz más corta para buscar por prefijo: sin la vocal final ni la terminación del infinitivo (instalar → instal). */
function tronco(r: string) {
  const t = r.replace(/(ar|er|ir|[aeo])$/, "");
  return t.length >= 5 ? t : undefined;
}

interface Termino {
  raiz: string;
  tronco?: string;
}

export interface Consulta {
  terminos: Termino[];
  /** Pregunta por cómo se consigue algo. */
  obtener: boolean;
  /** Pregunta por cómo se invoca o empieza algo. */
  invocar: boolean;
}

export function analizar(q: string): Consulta {
  let n = normalizar(q);
  for (const [patron, cambio] of FRASES) n = n.replace(patron, cambio);
  const palabras = n.split(" ").filter(Boolean);
  const obtener = palabras.some((p) => OBTENER.has(p));
  const invocar = palabras.some((p) => INVOCAR.has(p));
  let utiles = palabras.filter((p) => !VACIAS.has(p) && !OBTENER.has(p) && !INVOCAR.has(p));
  // Si todo eran palabras vacías ("receta"), se buscan tal cual.
  if (utiles.length === 0) utiles = palabras;
  const vistas = new Set<string>();
  const terminos: Termino[] = [];
  for (const p of utiles) {
    const r = raiz(SINONIMOS[p] ?? p);
    if (vistas.has(r)) continue;
    vistas.add(r);
    terminos.push({ raiz: r, tronco: tronco(r) });
  }
  return { terminos, obtener, invocar };
}

/** Raíces de un texto, sin palabras vacías (se guardan por documento). */
function raices(texto: string) {
  return normalizar(texto)
    .split(" ")
    .filter((p) => p && !VACIAS.has(p))
    .map((p) => raiz(SINONIMOS[p] ?? p));
}

interface Campos {
  nombre: string[];
  titulo: string[];
  cuerpo: string[];
  pistaObtener: boolean;
  pistaInvocar: boolean;
}

const CACHE = new WeakMap<Doc, Campos>();

function campos(d: Doc): Campos {
  let c = CACHE.get(d);
  if (!c) {
    // El título que cuenta es el del apartado; el nombre de la sección pesa como el texto.
    const titulo = d.migas.length > 1 ? d.migas.slice(1) : d.migas;
    const resto = d.migas.length > 1 ? d.migas[0] : "";
    c = {
      nombre: d.nombre ? raices(d.nombre) : [],
      titulo: raices(titulo.join(" ")),
      cuerpo: raices(`${d.texto} ${resto}`),
      pistaObtener: PISTAS_OBTENER.test(normalizar(d.texto)),
      pistaInvocar: PISTAS_INVOCAR.test(normalizar(`${d.nombre ?? ""} ${d.texto}`)),
    };
    CACHE.set(d, c);
  }
  return c;
}

/** 1 si la palabra es el término, 0.5 si empieza por él (o por su tronco), 0 si no. */
function coincide(palabra: string, t: Termino) {
  if (palabra === t.raiz) return 1;
  if (t.raiz.length >= 4 && palabra.startsWith(t.raiz)) return 0.5;
  if (t.tronco && palabra.startsWith(t.tronco)) return 0.5;
  return 0;
}

function mejor(lista: string[], t: Termino) {
  let m = 0;
  for (const p of lista) {
    const c = coincide(p, t);
    if (c > m) m = c;
    if (m === 1) break;
  }
  return m;
}

/** ¿Están los términos seguidos (y en orden) en la lista? */
function seguidos(lista: string[], terminos: Termino[]) {
  outer: for (let i = 0; i + terminos.length <= lista.length; i++) {
    for (let j = 0; j < terminos.length; j++) if (coincide(lista[i + j], terminos[j]) === 0) continue outer;
    return true;
  }
  return false;
}

export interface Fragmento {
  texto: string;
  /** Tramos a resaltar: [inicio, fin) dentro de `texto`. */
  marcas: [number, number][];
}

export interface Resultado {
  doc: Doc;
  puntos: number;
  /** Trozo del texto con las palabras encontradas. */
  fragmento: Fragmento;
  /** Aparecen todos los términos de la búsqueda. */
  completo: boolean;
}

/** Dónde aparecen los términos en un texto (posiciones del texto original). */
function apariciones(texto: string, terminos: Termino[]) {
  const salida: { inicio: number; fin: number; termino: number }[] = [];
  for (const m of texto.matchAll(PALABRA)) {
    const p = normalizar(m[0]);
    if (VACIAS.has(p)) continue;
    const r = raiz(SINONIMOS[p] ?? p);
    const i = terminos.findIndex((t) => coincide(r, t) > 0);
    if (i >= 0) salida.push({ inicio: m.index, fin: m.index + m[0].length, termino: i });
  }
  return salida;
}

/** Tramos a resaltar en un texto corto (un nombre o un título). */
export function resaltar(texto: string, q: string | Consulta): [number, number][] {
  const c = typeof q === "string" ? analizar(q) : q;
  return apariciones(texto, c.terminos).map((a) => [a.inicio, a.fin]);
}

/** El trozo de unos `largo` caracteres con más términos distintos. */
export function fragmento(texto: string, q: string | Consulta, largo = 180): Fragmento {
  const c = typeof q === "string" ? analizar(q) : q;
  const ap = apariciones(texto, c.terminos);
  if (texto.length <= largo) return { texto, marcas: ap.map((a) => [a.inicio, a.fin]) };

  let desde = 0;
  let mejorClave = -1;
  for (let i = 0; i < ap.length; i++) {
    const inicio = Math.max(0, ap[i].inicio - 40);
    const dentro = ap.filter((a) => a.inicio >= inicio && a.fin <= inicio + largo);
    const clave = new Set(dentro.map((a) => a.termino)).size * 100 + dentro.length;
    if (clave > mejorClave) {
      mejorClave = clave;
      desde = inicio;
    }
  }
  // Corta en límites de palabra.
  if (desde > 0) {
    const espacio = texto.lastIndexOf(" ", desde);
    desde = espacio > 0 && desde - espacio < 20 ? espacio + 1 : desde;
  }
  let hasta = Math.min(texto.length, desde + largo);
  if (hasta < texto.length) {
    const espacio = texto.lastIndexOf(" ", hasta);
    if (espacio > desde + largo / 2) hasta = espacio;
  }
  const prefijo = desde > 0 ? "…" : "";
  const sufijo = hasta < texto.length ? "…" : "";
  const marcas = ap
    .filter((a) => a.inicio >= desde && a.fin <= hasta)
    .map((a): [number, number] => [a.inicio - desde + prefijo.length, a.fin - desde + prefijo.length]);
  return { texto: prefijo + texto.slice(desde, hasta) + sufijo, marcas };
}

/** Peso de cada término según lo raro que es (los que salen en todas partes valen menos). */
function pesos(docs: Doc[], terminos: Termino[]) {
  return terminos.map((t) => {
    let df = 0;
    for (const d of docs) {
      const c = campos(d);
      if (mejor(c.nombre, t) || mejor(c.titulo, t) || mejor(c.cuerpo, t)) df++;
    }
    return Math.log(1 + docs.length / (1 + df));
  });
}

function puntuar(d: Doc, consulta: Consulta, peso: number[]) {
  const c = campos(d);
  const { terminos } = consulta;
  let puntos = 0;
  let encontrados = 0;
  terminos.forEach((t, i) => {
    const n = mejor(c.nombre, t) * 8;
    const ti = mejor(c.titulo, t) * 5;
    const cu = mejor(c.cuerpo, t) * 2;
    const m = Math.max(n, ti, cu);
    if (m === 0) return;
    encontrados++;
    // Lo mejor de los tres campos, y un poco más si además sale en el texto.
    puntos += (m + (cu > 0 && m > cu ? 0.5 : 0)) * peso[i];
  });
  if (encontrados === 0) return { puntos: 0, completo: false };

  const completo = encontrados === terminos.length;
  if (terminos.length > 1) {
    puntos *= (encontrados / terminos.length) ** 2;
    if (completo) puntos += 5;
    // Las palabras seguidas, como en la búsqueda ("netherita templada"), valen mucho más.
    if (seguidos(c.nombre, terminos)) puntos += 15;
    else if (seguidos(c.titulo, terminos)) puntos += 10;
    else if (seguidos(c.cuerpo, terminos)) puntos += 5;
  }
  // El nombre empieza justo por lo buscado: es la ficha de esa cosa.
  if (completo && c.nombre.length > 0 && terminos.every((t, i) => c.nombre[i] && coincide(c.nombre[i], t) === 1)) puntos += 6;
  // Cuanto más del nombre cubre la búsqueda, más es la ficha de lo buscado ("Lingote de ignitio" antes que "Molde de mejora de ignitio").
  if (c.nombre.length > 0) puntos += (6 * c.nombre.filter((p) => terminos.some((t) => coincide(p, t) === 1)).length) / c.nombre.length;

  if (consulta.obtener) {
    // La ficha de un objeto dice de dónde sale: va un poco por delante de una receta que solo lo nombra.
    if (d.tipo === "objeto") puntos = puntos * 1.6 + 10;
    else if (d.tipo === "receta") puntos = puntos * 1.5 + 8;
    else if (c.pistaObtener) puntos *= 1.15;
  }
  if (consulta.invocar && c.pistaInvocar) puntos = puntos * 1.5 + 6;
  // A igualdad, la ficha de una cosa (receta, objeto, jefe) va antes que una fila de tabla que la nombra.
  if (d.tipo === "receta" || d.tipo === "objeto" || d.tipo === "jefe") puntos += 1;
  // Las novedades viejas hablan de cosas que pueden haber cambiado: la guía va antes.
  if (d.tipo === "novedad") puntos *= 0.6;
  return { puntos, completo };
}

export interface Opciones {
  /** Cuántos resultados devolver. */
  limite?: number;
  /** Máximo de resultados que llevan al mismo apartado (para que haya variedad). */
  porRuta?: number;
}

export function buscar(docs: Doc[], q: string, { limite = 20, porRuta = 3 }: Opciones = {}): Resultado[] {
  const consulta = analizar(q);
  if (consulta.terminos.length === 0) return [];
  const peso = pesos(docs, consulta.terminos);

  const puntuados: { doc: Doc; puntos: number; completo: boolean }[] = [];
  for (const doc of docs) {
    const r = puntuar(doc, consulta, peso);
    if (r.puntos > 0) puntuados.push({ doc, ...r });
  }
  puntuados.sort((a, b) => b.puntos - a.puntos);

  // Si algún documento tiene todos los términos, los que tienen pocos sobran.
  const tope = puntuados[0]?.puntos ?? 0;
  const salida: Resultado[] = [];
  const cuenta = new Map<string, number>();
  for (const p of puntuados) {
    if (salida.length >= limite) break;
    if (p.puntos < tope * 0.12) break;
    const n = cuenta.get(p.doc.ruta) ?? 0;
    if (n >= porRuta) continue;
    cuenta.set(p.doc.ruta, n + 1);
    salida.push({ ...p, fragmento: fragmento(p.doc.texto, consulta) });
  }
  return salida;
}
