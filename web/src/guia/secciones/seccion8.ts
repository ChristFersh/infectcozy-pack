import type { Seccion } from "../tipos";

export const seccion8: Seccion = {
  id: "8",
  titulo: "Sistemas y mods importantes",
  resumen:
    "Cómo funcionan los sistemas clave del modpack: waystones, mochilas, colonias, Create, magia, movilidad, accesorios, mapa y descanso.",
  subsecciones: [
    {
      id: "8.1",
      titulo: "Waystones: viajar",
      bloques: [
        {
          tipo: "p",
          texto:
            "Las **Waystones** te teletransportan entre puntos que ya visitaste. Busca las de las aldeas y las salvajes (hay una cada 25 chunks, más o menos) o fabrica la tuya. Cada waystone que activas aparece como punto de ruta en JourneyMap.",
        },
        {
          tipo: "definiciones",
          items: [
            {
              termino: "Coste",
              texto:
                "Niveles de experiencia según la distancia (1 nivel cada 100 bloques, más o menos; máximo 27). Entre dimensiones, 27 niveles.",
            },
            {
              termino: "Gratis",
              texto: "Desde una Warp Plate, con un pergamino o hacia una waystone global.",
            },
            {
              termino: "Acompañantes",
              texto: "Las mascotas no viajan contigo; los animales atados con correa, sí.",
            },
          ],
        },
        {
          tipo: "recetas",
          items: [
            {
              nombre: "Waystone",
              estacion: "Mesa de crafteo",
              forma: [
                [null, "Ladrillos de piedra", null],
                ["Ladrillos de piedra", "Warp Stone", "Ladrillos de piedra"],
                ["Obsidiana", "Obsidiana", "Obsidiana"],
              ],
            },
            {
              nombre: "Warp Stone",
              estacion: "Mesa de crafteo",
              forma: [
                ["Fragmento de amatista", "Perla de ender", "Fragmento de amatista"],
                ["Perla de ender", "Esmeralda", "Perla de ender"],
                ["Fragmento de amatista", "Perla de ender", "Fragmento de amatista"],
              ],
            },
            {
              nombre: "Warp en Pergamino",
              estacion: "Mesa de crafteo",
              forma: [
                ["Pepita de oro", "Saco de tinta", "Pepita de oro"],
                ["Pepita de oro", "Perla de ender", "Pepita de oro"],
                ["Papel", "Papel", "Papel"],
              ],
              cantidad: 3,
              pie: "Te lleva a una waystone que ya visitaste.",
            },
            {
              nombre: "Pergamino para volver",
              estacion: "Mesa de crafteo",
              forma: [
                ["Pepita de oro", "Saco de tinta", "Pepita de oro"],
                ["Papel", "Papel", "Papel"],
                [null, null, null],
              ],
              cantidad: 3,
            },
          ],
        },
      ],
    },
    {
      id: "8.2",
      titulo: "Mochilas y almacenamiento",
      bloques: [
        {
          tipo: "p",
          texto:
            "Para cargar más cosas usa una **mochila** (Sophisticated Backpacks). Se abre con el **botón 5 del ratón**. Después puedes mejorarla: rodea la de hierro con 8 lingotes de oro para la de oro, y la de oro con 8 diamantes para la de diamante. La de netherita se hace en la mesa de herrería (plantilla de mejora de netherita + lingote de netherita). Sophisticated Storage hace lo mismo con cofres y barriles.",
        },
        {
          tipo: "recetas",
          items: [
            {
              nombre: "Mochila",
              estacion: "Mesa de crafteo",
              forma: [
                ["Hilo", "Cuero", "Hilo"],
                ["Hilo", "Cofre", "Hilo"],
                ["Cuero", "Cuero", "Cuero"],
              ],
            },
            {
              nombre: "Mochila de hierro",
              estacion: "Mesa de crafteo",
              forma: [
                ["Lingote de hierro", "Lingote de hierro", "Lingote de hierro"],
                ["Lingote de hierro", "Mochila", "Lingote de hierro"],
                ["Lingote de hierro", "Lingote de hierro", "Lingote de hierro"],
              ],
              pie: "Oro y diamante siguen el mismo patrón.",
            },
          ],
        },
      ],
    },
    {
      id: "8.3",
      titulo: "Colonias (MineColonies)",
      bloques: [
        {
          tipo: "p",
          texto:
            "Funda un pueblo con ciudadanos que trabajan para ti. Empieza con un **Campamento de provisiones** (necesita un suelo plano de al menos 16×17 bloques sin hierba, flores ni agujeros) o un **Barco de provisiones** (en un océano o río). **Solo puedes poner uno**, así que elige bien el sitio. Después construyes el **Ayuntamiento**. La colonia empieza con 4 ciudadanos y admite hasta 250. El rayo del arco definitivo nunca daña a tus ciudadanos.",
        },
      ],
    },
    {
      id: "8.4",
      titulo: "Create",
      bloques: [
        {
          tipo: "p",
          texto:
            "Máquinas, engranajes y automatización. Mantén **W** con el ratón sobre un objeto de Create para ver una animación que explica cómo funciona (Ponder). Las **Gafas del ingeniero** y la **Llave inglesa** son tus herramientas básicas. Vienen addons como Create Deco y Slice & Dice.",
        },
      ],
    },
    {
      id: "8.5",
      titulo: "Magia (Iron's Spells 'n Spellbooks)",
      bloques: [
        {
          tipo: "p",
          texto:
            "Libros de hechizos, pergaminos y maná. En la **Mesa de Inscripción** pones los hechizos en tu libro; lanzas el hechizo activo con **V** y cambias de hechizo con la rueda (**P**). En este servidor los hechizos **no rompen bloques** y cada objeto admite hasta 3 mejoras (orbes de mejora).",
        },
      ],
    },
    {
      id: "8.6",
      titulo: "Movilidad",
      bloques: [
        {
          tipo: "p",
          texto:
            "**Paravela** (Paraglider): planear gasta aguante; correr y nadar no. En las **Estatuas de la diosa** cambias **Símbolos de valía** por contenedores de corazón o de vigor (cada contenedor de vigor suma 200 de aguante; hasta 10). Los símbolos salen de generadores de monstruos (1), de desafío (2, o 4 si son ominosos) y del Guardián anciano; el Dragón y el Wither sueltan un contenedor y las invasiones dan otro. **Esquivar** con **R**: 4 s de espera.",
        },
      ],
    },
    {
      id: "8.7",
      titulo: "Accesorios y reliquias",
      bloques: [
        {
          tipo: "p",
          texto:
            "Anillos, collares y demás van en los huecos de accesorios (**G**, mod Curios). Las **reliquias** (Relics) suben de nivel y tienen habilidades activas (**U**).",
        },
      ],
    },
    {
      id: "8.8",
      titulo: "Mapa y descanso",
      bloques: [
        {
          tipo: "p",
          texto:
            "**JourneyMap**: mapa con **J** y puntos de ruta con **B**. **Comforts**: sacos de dormir (de noche) y hamacas (de día) para descansar fuera de casa; también evitan los phantoms. Al dormir se despeja la lluvia.",
        },
      ],
    },
  ],
};
