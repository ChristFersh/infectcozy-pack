import type { Seccion } from "../tipos";

export const seccion7: Seccion = {
  id: "7",
  titulo: "Controles",
  resumen: "Las teclas que trae el pack por categorías y cómo ver o cambiar las tuyas.",
  intro: [
    {
      tipo: "p",
      texto:
        "Estas son las teclas con las que viene configurado el pack. Si las cambiaste, pulsa `F7` para ver las tuyas en un teclado de colores: cada tecla asignada se ilumina. En **Opciones → Controles** puedes buscar y cambiar cualquiera.",
    },
    {
      tipo: "nota",
      estilo: "consejo",
      texto: "El libro del juego muestra siempre tus teclas actuales, aunque las cambies.",
    },
  ],
  subsecciones: [
    {
      id: "combate",
      titulo: "Combate",
      bloques: [
        {
          tipo: "tabla",
          columnas: ["Combate", "Tecla", "Nota"],
          filas: [
            [
              "Esquivar (rodar)",
              "`R`",
              "Espera de 4 s. Necesitas algo de comida (más de 3 muslos) y no funciona en el aire.",
            ],
            ["Habilidad del arma (Cataclysm)", "`X`", ""],
            [
              "Habilidad del casco / pechera / botas",
              "`C` / `Y` / `H`",
              "Armaduras de Cataclysm, como la de ignitio.",
            ],
            ["Lanzar / llamar al Rompemundos", "`Q`", "Es la tecla de soltar objeto."],
            ["Remolino helado / Golpe sísmico (Rompemundos)", "`Clic der.` / agachado + `Clic der.`", "Con el golpe cargado."],
            ["Guardia ígnea (Filo del Juicio)", "`Clic der.` (mantener)", "Al soltar, Llamaradas del Juicio."],
            ["Embestida (Filo del Juicio)", "`Q`", "Recarga 8 s. La espada no se suelta."],
            ["Sentencia (Filo del Juicio)", "Agachado + `Q`", "Recarga 20 s."],
            ["Invocar / disparar el Arco Prohibido", "`Clic der.` (mantener)", "3 s para invocar; con el arco invocado, 2 s y soltar para disparar."],
            ["Habilidades activas de reliquias", "`U`", "Mod Relics."],
          ],
        },
      ],
    },
    {
      id: "magia",
      titulo: "Magia y equipo",
      bloques: [
        {
          tipo: "tabla",
          columnas: ["Magia y equipo", "Tecla", "Nota"],
          filas: [
            ["Lanzar hechizo", "`V`", "Iron's Spells 'n Spellbooks."],
            ["Rueda de hechizos", "`P`", ""],
            ["Barra de hechizos (modificador)", "`Alt izq.`", ""],
            ["Abrir mochila", "`B`", ""],
            ["Accesorios (Curios)", "`G`", ""],
            ["Árbol de habilidades", "`K`", ""],
          ],
        },
      ],
    },
    {
      id: "mapa",
      titulo: "Mapa y cámara",
      bloques: [
        {
          tipo: "tabla",
          columnas: ["Mapa y cámara", "Tecla", "Nota"],
          filas: [
            ["Mapa grande / minimapa", "`J` / `Ctrl + J`", "JourneyMap."],
            ["Crear punto de ruta", "`J` y luego `B`", "Con el mapa grande abierto."],
            ["Cambiar cámara", "`F5`", ""],
            [
              "Zoom",
              "`Z`",
              "Cinematic Zoom. El zoom de Essential va en la tecla `Menú`.",
            ],
            ["Elegir shaders", "`O`", "Solo en las versiones con shaders. Ahí también se apagan."],
          ],
        },
      ],
    },
    {
      id: "otros",
      titulo: "Otros",
      bloques: [
        {
          tipo: "tabla",
          columnas: ["Otros", "Tecla", "Nota"],
          filas: [
            ["Ver todas tus teclas", "`F7`", "Teclado de colores (Keyboard Wizard). No está en Ultra Low."],
            ["Mandar un objeto a la basura", "`Ctrl + Mayús + clic`", "Sobre el objeto, si la casilla de basura está a la vista."],
            ["Explicación de un bloque de Create", "`W` (mantener)", "Con el ratón sobre el objeto (Ponder)."],
            ["Construir puente", "`,` (coma)", "Bridging Mod."],
            ["Ajustes de la paravela", "`Ctrl + P`", ""],
            ["Maniobras con élitros", "`I`", "Do a Barrel Roll."],
            ["Guía de campo", "`Insert`", "Field Guide."],
            ["Modo ausente (AFK)", "`Inicio`", "AFK Station."],
          ],
        },
      ],
    },
  ],
};
