import type { Bloque, Seccion } from "../tipos";

export const introGuia: Bloque[] = [
  {
    tipo: "p",
    texto:
      "Esta guía amplía el libro que recibes al entrar al servidor, la Guía de Infect Cozy. Tiene todo lo del libro, ordenado y con más detalle: cómo avanza la infección, qué jefes hay y qué sueltan, cómo se adaptan los enemigos a tu equipo, las recetas del arsenal definitivo con sus números, las teclas y los sistemas más importantes del pack.",
  },
  {
    tipo: "nota",
    estilo: "consejo",
    titulo: "Por dónde empezar",
    texto:
      "¿Acabas de llegar? Lee las secciones 2 y 3 antes de tu primera noche. ¿Ya tienes equipo de diamante? Ve a la 4 (jefes), la 5 (nivel de amenaza) y la 6 (arsenal). Las teclas están en la 7.",
  },
];

export const seccion1: Seccion = {
  id: "1",
  titulo: "Qué es Infect Cozy",
  resumen: "Qué es el modpack, qué recibes al entrar por primera vez y qué cuentan los marcadores del servidor.",
  subsecciones: [
    {
      id: "que-es",
      titulo: "Qué es",
      bloques: [
        {
          tipo: "p",
          texto:
            "Infect Cozy es un modpack de terror para Minecraft 1.21.1 con NeoForge y cientos de mods, pensado para jugar en un servidor con amigos. Mezcla tres cosas: **terror** (monstruos que se adaptan a tu equipo, élites y lunas peligrosas), **jefes** (una veintena, repartidos entre el Overworld, el Nether y el End) y una **infección** que crece mientras hay gente jugando.",
        },
        {
          tipo: "p",
          texto:
            "Juega en grupo, ilumina tu base y ten a mano el libro: esta guía sigue el mismo orden que sus cinco capítulos (Primeros pasos, La Infección, Jefes y progresión, Arsenal y recetas clave, Controles). Además, el nivel de amenaza tiene su propia sección y al final hay una de sistemas del pack y otra de consejos.",
        },
        {
          tipo: "p",
          texto:
            "Hay cinco versiones del cliente, de **Ultra Low** a **Detallada**. Tienen el mismo contenido de juego y solo cambian los gráficos, así que esta guía sirve para todas.",
        },
        {
          tipo: "tarjetas",
          items: [
            {
              titulo: "La colmena",
              texto: "Nace tras 12 horas de juego y solo avanza mientras hay alguien conectado.",
            },
            {
              titulo: "Los jefes",
              texto: "Cada uno suelta materiales únicos. La primera vez que vences a cada uno, todo el servidor se entera.",
            },
            {
              titulo: "El arsenal",
              texto: "4 armas y un set de armadura irrompibles, hechos con materiales de jefes y con habilidades propias. Con las 8 piezas se forja el Arco Prohibido.",
            },
          ],
        },
      ],
    },
    {
      id: "al-entrar",
      titulo: "Al entrar por primera vez",
      bloques: [
        {
          tipo: "p",
          texto:
            "El chat anuncia *“… llegó a Infect Cozy por primera vez”*, ves el título *“sobrevive… y no te dejes infectar”* y recibes el kit de bienvenida:",
        },
        {
          tipo: "tabla",
          columnas: ["Qué recibes", "Para qué"],
          filas: [
            ["Espada de piedra, pico de piedra y hacha de piedra", "Para tus primeras horas."],
            ["Armadura de cota de malla y escudo", "Para aguantar los primeros golpes."],
            ["16 panes y 32 antorchas", "Comida y luz para la primera noche."],
            ["Cama roja", "Colócala enseguida: fija tu punto de reaparición."],
            ["Guía de Infect Cozy", "El libro ilustrado del pack. Muestra tus teclas reales y las recetas."],
          ],
        },
      ],
    },
    {
      id: "marcadores",
      titulo: "Marcadores del servidor",
      bloques: [
        {
          tipo: "definiciones",
          items: [
            { termino: "Muertes", texto: "Siempre visible en la lista de jugadores (tecla Tab)." },
            {
              termino: "Infectados eliminados",
              texto: "Suma 1 cada vez que matas a una criatura de la infección (Spore).",
            },
            { termino: "Jefes derrotados", texto: "Suma 1 la primera vez que vences a cada jefe." },
          ],
        },
        {
          tipo: "p",
          texto: "El administrador puede mostrar cualquiera de los tres en el lateral de la pantalla.",
        },
        {
          tipo: "nota",
          estilo: "nota",
          texto: "Si pierdes el libro, pídeselo al administrador.",
        },
      ],
    },
  ],
};
