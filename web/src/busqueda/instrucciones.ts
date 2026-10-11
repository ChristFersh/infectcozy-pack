import type { Inline } from "../guia/tipos";

// Textos de la página de descargas. Viven aquí para que la página y el buscador usen los mismos:
// cada uno tiene un id que es también el ancla de la página (#/descargas/<id>).

export interface Instruccion {
  id: string;
  /** Apartado de la página al que pertenece (para la miga de pan del buscador). */
  apartado: string;
  titulo: string;
  /** Pasos numerados. */
  pasos?: readonly Inline[];
  /** Texto corrido (un aviso, la respuesta de un problema...). */
  texto?: Inline;
}

export const INSTRUCCIONES = [
  {
    id: "versiones",
    apartado: "Elige tu versión",
    titulo: "1. Elige tu versión",
    texto:
      "Lo recomendado es **Prism Launcher**: su zip pesa poco, los mods se descargan solos y se actualizan cada vez que abres el juego. Si prefieres la **app de CurseForge**, usa el zip para CurseForge de tu versión.",
  },
  {
    id: "instalar",
    apartado: "Instálala",
    titulo: "2. Instálala",
    pasos: [
      "Instala **Prism Launcher** desde **prismlauncher.org** y entra con tu cuenta de Microsoft.",
      "Descarga el **zip para Prism** de tu versión (arriba).",
      "En Prism pulsa **Añadir instancia → Importar** y elige ese zip, sin descomprimir.",
      "Pulsa **Iniciar**. La primera vez se abre una ventana que descarga todos los mods: espera a que termine. Luego, cada vez que abras el juego, solo baja lo que cambió.",
    ],
  },
  {
    id: "memoria",
    apartado: "Instálala",
    titulo: "La memoria ya viene puesta",
    texto:
      "El zip trae la memoria de tu versión y los parámetros de Java ajustados. Para cambiar de versión, importa el zip de la otra: queda como una instancia aparte.",
  },
  {
    id: "instalar-curseforge",
    apartado: "Instálala",
    titulo: "Con la app de CurseForge",
    pasos: [
      "Instala la **app de CurseForge** desde **curseforge.com/download/app** y entra en la sección de **Minecraft**.",
      "Descarga el **zip para CurseForge** de tu versión (arriba).",
      "Pulsa **Crear perfil personalizado → Importar** y elige ese zip, sin descomprimir.",
      "Espera a que el perfil descargue todos los mods (la primera vez tarda) y pulsa **Jugar**.",
    ],
  },
  {
    id: "memoria-curseforge",
    apartado: "Instálala",
    titulo: "En CurseForge, la memoria se pone a mano",
    texto:
      "El zip no la trae. En la app ve a **Configuración → Minecraft** y, en la configuración de Java, sube la **memoria asignada** a la de tu versión (sale en su tarjeta).",
  },
  {
    id: "actualizar-curseforge",
    apartado: "Instálala",
    titulo: "En CurseForge no se actualiza solo",
    texto:
      "Cuando salga una versión nueva del pack, descarga su zip para CurseForge e impórtalo igual que la primera vez. Después puedes borrar el perfil viejo.",
  },
  {
    id: "servidor",
    apartado: "Entra al servidor",
    titulo: "3. Entra al servidor",
    pasos: [
      "En el menú principal: **Multijugador → Agregar servidor**.",
      "Nombre: **Infect Cozy** · Dirección: la que te pase Christian. Pulsa **Listo**.",
      "Haz doble clic en el servidor para entrar. Al llegar recibes el kit de bienvenida y la **Guía de Infect Cozy**.",
    ],
  },
  {
    id: "no-entra",
    apartado: "Entra al servidor",
    titulo: "¿No te deja entrar?",
    texto:
      "Si dice que no estás en la lista blanca, pásale a Christian tu nombre de jugador exacto. Si habla de mods incompatibles, usa la versión más reciente del pack.",
  },
  {
    id: "problema-descarga",
    apartado: "Si algo falla",
    titulo: "La ventana de Prism se queda descargando o falla un mod",
    texto: "Cierra y vuelve a pulsar Iniciar: retoma lo que falta. Si un mod pide bajarse a mano, sale en el aviso de arriba.",
  },
  {
    id: "problema-curseforge",
    apartado: "Si algo falla",
    titulo: "CurseForge no termina de importar el zip",
    texto:
      "Cierra la app, ábrela otra vez e importa el zip de nuevo. Si sigue fallando, instala el pack con Prism: es la forma recomendada.",
  },
  {
    id: "problema-lento",
    apartado: "Si algo falla",
    titulo: "El juego se cierra al cargar o va muy lento",
    texto:
      "Revisa la memoria (la de tu versión) o usa una versión más ligera, como Lite o Ultra Low. Cierra el navegador y Discord antes de jugar.",
  },
  {
    id: "problema-incompatibles",
    apartado: "Si algo falla",
    titulo: "Sale «mods incompatibles» al entrar al servidor",
    texto:
      "Tienes una versión vieja. En Prism, cierra el juego y vuelve a abrirlo: se actualiza solo. En CurseForge, descarga el zip nuevo e impórtalo.",
  },
  {
    id: "problema-otro",
    apartado: "Si algo falla",
    titulo: "Cualquier otro error",
    texto:
      "Envíale a Christian el archivo latest.log de la carpeta logs (o el de crash-reports). En Prism: clic derecho en la instancia → Carpeta. En CurseForge: en el perfil, menú **⋯ → Abrir carpeta**.",
  },
] as const satisfies readonly Instruccion[];

export type IdInstruccion = (typeof INSTRUCCIONES)[number]["id"];

/** La instrucción con ese id (los ids están tipados, así que siempre existe). */
export function instruccion(id: IdInstruccion): Instruccion {
  return INSTRUCCIONES.find((i) => i.id === id)!;
}

/** Los problemas frecuentes, en el orden de la página. */
export const PROBLEMAS: Instruccion[] = INSTRUCCIONES.filter((i) => i.apartado === "Si algo falla");
