import type { Seccion } from "../tipos";

export const seccion4: Seccion = {
  id: "4",
  titulo: "Jefes y progresión",
  resumen:
    "La ruta de jefes del Overworld al End: cómo encontrarlos, qué sueltan y el equipo de clase que desbloquean.",
  intro: [
    {
      tipo: "nota",
      estilo: "consejo",
      titulo: "Guía completa",
      texto: "La progresión completa de Cataclysm (orden de jefes, cómo empieza cada pelea, vida, botín y armas) está en la **sección 10**.",
    },
  ],
  subsecciones: [
    {
      id: "4.1",
      titulo: "La ruta de jefes",
      bloques: [
        {
          tipo: "p",
          texto:
            "Empieza en el **Overworld**, sigue en el **Nether** y termina en el **End**. Cada jefe suelta materiales para el arsenal definitivo (sección 6) y para el equipo de clase (4.5).",
        },
        {
          tipo: "p",
          texto:
            "La **primera vez que vences a cada jefe**, el chat lo anuncia a todos (*“⚔ Nombre derrotó a Jefe por primera vez”*), ves el título **¡Jefe derrotado!**, ganas **500 puntos de experiencia** y sumas 1 en el marcador de Jefes derrotados. Cuenta para cada jugador. Cada jefe derrotado suma también **3 puntos** a tu nivel de amenaza (sección 5).",
        },
        {
          tipo: "p",
          texto:
            "Cuenta para todos los jefes de las tablas de esta sección salvo el Gólem de ender y Valamon, y también para el Warden y el Guardián anciano. La Naga y el Guardián anciano no suman puntos de amenaza.",
        },
        {
          tipo: "nota",
          estilo: "consejo",
          texto:
            "El mod **Boss Checklist** lista los jefes del pack, marca los que ya se derrotaron y guarda quién remató a cada uno y las estadísticas de las peleas.",
        },
      ],
    },
    {
      id: "jefes-3d",
      titulo: "Los jefes en 3D",
      bloques: [
        {
          tipo: "p",
          texto: "Pulsa un jefe para verlo en 3D: arrástralo para girarlo y usa la rueda para acercarte. Los modelos salen de los propios mods, en su pose de reposo.",
        },
        {
          tipo: "jefes",
          items: [
            { modelo: "caballero-de-hierro-forjado", nombre: "Caballero de hierro forjado", detalle: "Mowzie's Mobs", grupo: "Overworld" },
            { modelo: "frostmaw", nombre: "Frostmaw", detalle: "Mowzie's Mobs", grupo: "Overworld" },
            { modelo: "umvuthi", nombre: "Umvuthi, el ave solar", detalle: "Mowzie's Mobs", grupo: "Overworld" },
            { modelo: "naga", nombre: "Naga", detalle: "Mowzie's Mobs", grupo: "Overworld" },
            { modelo: "remanente-antiguo", nombre: "Remanente Antiguo", detalle: "Cataclysm", grupo: "Overworld" },
            { modelo: "maledictus", nombre: "Maledictus", detalle: "Cataclysm", grupo: "Overworld" },
            { modelo: "el-heraldo", nombre: "El Heraldo", detalle: "Cataclysm", grupo: "Overworld" },
            { modelo: "el-leviatan", nombre: "El Leviatán", detalle: "Cataclysm", grupo: "Overworld" },
            { modelo: "scylla", nombre: "Scylla", detalle: "Cataclysm", grupo: "Overworld" },
            { modelo: "night-lich", nombre: "Night Lich", detalle: "Bosses of Mass Destruction", grupo: "Overworld" },
            { modelo: "void-blossom", nombre: "Void Blossom", detalle: "Bosses of Mass Destruction", grupo: "Overworld" },
            { modelo: "monstruosidad-de-netherita", nombre: "Monstruosidad de Netherita", detalle: "Cataclysm", grupo: "Nether" },
            { modelo: "ignis", nombre: "Ignis", detalle: "Cataclysm", grupo: "Nether" },
            { modelo: "nether-gauntlet", nombre: "Nether Gauntlet", detalle: "Bosses of Mass Destruction", grupo: "Nether" },
            { modelo: "wither", nombre: "El Wither", detalle: "Vanilla", grupo: "Nether" },
            { modelo: "guardian-ender", nombre: "Guardián Ender", detalle: "Cataclysm", grupo: "End y otros" },
            { modelo: "golem-de-ender", nombre: "Gólem de ender", detalle: "Cataclysm", grupo: "End y otros" },
            { modelo: "obsidilith", nombre: "Obsidilith", detalle: "Bosses of Mass Destruction", grupo: "End y otros" },
            { modelo: "dragon-del-end", nombre: "Dragón del End", detalle: "Vanilla + True Ending", grupo: "End y otros" },
            { modelo: "valamon", nombre: "Valamon", detalle: "Macabre", grupo: "End y otros" },
          ],
        },
      ],
    },
    {
      id: "4.2",
      titulo: "Ojos de búsqueda",
      bloques: [
        {
          tipo: "p",
          texto:
            "Las estructuras de los jefes de Cataclysm se encuentran con sus **ojos**. Se usan como un Ojo de Ender: lánzalos y síguelos hasta la estructura. Todos se fabrican a partir de un Ojo de Ender. Debajo de cada receta tienes a dónde te lleva y qué jefe te espera.",
        },
        {
          tipo: "recetas",
          items: [
            {
              nombre: "Ojo del fuego",
              estacion: "Mesa de crafteo",
              forma: [
                ["Polvo de blaze", "Polvo de blaze", "Polvo de blaze"],
                ["Chatarra de netherita", "Ojo de ender", "Chatarra de netherita"],
                ["Arena de almas", "Arena de almas", "Arena de almas"],
              ],
              pie: "**Arena ardiente** · Ignis · Nether",
            },
            {
              nombre: "Ojo de la monstruosidad",
              estacion: "Mesa de crafteo",
              forma: [
                ["Cubo de lava", "Chatarra de netherita", "Cubo de lava"],
                ["Piedra negra", "Ojo de ender", "Piedra negra"],
                ["Cubo de lava", "Chatarra de netherita", "Cubo de lava"],
              ],
              pie: "**Herrería de almas** · Monstruosidad de Netherita · Nether",
            },
            {
              nombre: "Ojo de la mecánica",
              estacion: "Mesa de crafteo",
              forma: [
                ["Bloque de redstone", "Lingote de hierro", "Bloque de redstone"],
                ["Lingote de hierro", "Ojo de ender", "Lingote de hierro"],
                ["Bloque de redstone", "Lingote de hierro", "Bloque de redstone"],
              ],
              pie: "**Fábrica antigua** · El Heraldo · Overworld",
            },
            {
              nombre: "Ojo del desierto",
              estacion: "Mesa de crafteo",
              forma: [
                ["Lingote de oro", "Arenisca cincelada", "Esmeralda"],
                ["Arbusto seco", "Ojo de ender", "Cactus"],
                ["Carne podrida", "Arenisca cincelada", "Hueso"],
              ],
              pie: "**Pirámide maldita** · Remanente Antiguo · Overworld",
            },
            {
              nombre: "Ojo de la maldición",
              estacion: "Mesa de crafteo",
              forma: [
                ["Lingote de oro", "Hueso", "Lingote de oro"],
                ["Membrana de phantom", "Ojo de ender", "Membrana de phantom"],
                ["Lingote de oro", "Carne podrida", "Lingote de oro"],
              ],
              pie: "**Prisión helada** · Maledictus · Overworld",
            },
            {
              nombre: "Ojo del abismo",
              estacion: "Mesa de crafteo",
              forma: [
                ["Obsidiana llorosa", "Obsidiana", "Obsidiana llorosa"],
                ["Obsidiana", "Ojo de ender", "Obsidiana"],
                ["Obsidiana llorosa", "Obsidiana", "Obsidiana llorosa"],
              ],
              pie: "**Ciudad hundida** · El Leviatán · Overworld",
            },
            {
              nombre: "Ojo de la tormenta",
              estacion: "Mesa de crafteo",
              forma: [
                ["Fragmento de prismarina", "Pararrayos", "Fragmento de prismarina"],
                ["Diamante", "Ojo de ender", "Diamante"],
                ["Cristales de prismarina", "Cubo de agua", "Cristales de prismarina"],
              ],
              pie: "**Acrópolis** · Scylla · Overworld",
            },
            {
              nombre: "Ojo del vacío",
              estacion: "Mesa de crafteo",
              forma: [
                ["Pilar de púrpur", "Caparazón de shulker", "Pilar de púrpur"],
                ["Ladrillos de piedra del End", "Ojo de ender", "Ladrillos de piedra del End"],
                ["Bloque de púrpur", "Caparazón de shulker", "Bloque de púrpur"],
              ],
              pie: "**Ciudadela en ruinas** · Guardián Ender · End",
            },
          ],
        },
        {
          tipo: "nota",
          estilo: "importante",
          texto:
            "Antes de ir: lleva comida, pociones y bloques. Las estructuras son grandes y laberínticas.",
        },
      ],
    },
    {
      id: "4.3",
      titulo: "Todos los jefes y qué sueltan",
      bloques: [
        {
          tipo: "p",
          texto: "En negrita, lo que necesitas para el arsenal y las recetas clave.",
        },
        {
          tipo: "nota",
          estilo: "importante",
          titulo: "Más vida",
          texto: "Los jefes de **Cataclysm** tienen un **+50 % de vida** en este pack.",
        },
        { tipo: "p", texto: "**Overworld**" },
        {
          tipo: "tabla",
          columnas: ["Jefe", "Dónde está", "Cómo empieza", "Suelta"],
          filas: [
            [
              "Caballero de hierro forjado\nMowzie's Mobs",
              "Bajo tierra, en una cámara sellada.",
              "—",
              "**Hacha pesada** (base del Rompemundos)\nYelmo forjado",
            ],
            ["Frostmaw\nMowzie's Mobs", "Duerme en biomas nevados.", "—", "**Cristal de hielo**"],
            [
              "Umvuthi, el ave solar\nMowzie's Mobs",
              "En las arboledas de la sabana.",
              "—",
              "**Semblante solar**",
            ],
            [
              "Naga\nMowzie's Mobs",
              "Sobrevuela los acantilados junto al mar.",
              "—",
              "**Colmillo de naga**",
            ],
            [
              "Remanente Antiguo\nCataclysm",
              "Pirámide maldita, en el desierto.",
              "Se despierta con el **Collar del desierto**.",
              "**Bloque de metal antiguo** (9 lingotes)\n**Tormenta de arena en un frasco**",
            ],
            [
              "Maledictus\nCataclysm",
              "Prisión helada.",
              "Entra con la **Llave extraña**.",
              "**Lingote de cursio**",
            ],
            [
              "El Heraldo\nCataclysm",
              "Fábrica antigua.",
              "Se activa con una **Estrella del Nether**.",
              "**Bloque de witherita** (9 lingotes)",
            ],
            [
              "El Leviatán\nCataclysm",
              "Ciudad hundida, en el océano profundo.",
              "Se invoca con el **Sacrificio abisal**.",
              "Garras de la marea\nHuevo abisal",
            ],
            [
              "Scylla\nCataclysm",
              "Acrópolis, en el océano cálido.",
              "—",
              "**Esencia de la tormenta**\n**Lácrima**",
            ],
            [
              "Night Lich\nBosses of Mass Destruction",
              "En torres de biomas fríos.",
              "—",
              "**Ancient Anima**\nDiamante\nLibro\nHuesos",
            ],
            [
              "Void Blossom\nBosses of Mass Destruction",
              "Escondida bajo tierra.",
              "—",
              "**Crystal Fruit**\n**Void Thorn**",
            ],
          ],
        },
        { tipo: "p", texto: "**Nether**" },
        {
          tipo: "tabla",
          columnas: ["Jefe", "Dónde está", "Cómo empieza", "Suelta"],
          filas: [
            [
              "Monstruosidad de Netherita\nCataclysm",
              "Herrería de almas, en el Nether.",
              "—",
              "**Cuerno monstruoso**\nForja infernal\nCelda de energía de lava",
            ],
            [
              "Ignis\nCataclysm",
              "Arena ardiente, en el Nether.",
              "Pon **Cenizas ardientes** en el Altar del fuego (10.3).",
              "**Lingotes de ignitio**, base del arsenal",
            ],
            [
              "Nether Gauntlet\nBosses of Mass Destruction",
              "En una arena del Nether.",
              "—",
              "Su cofre: **Blazing Eye**",
            ],
            [
              "El Wither\nVanilla",
              "Donde lo invoques: hazlo lejos de tu base, destruye todo a su alrededor.",
              "3 cráneos de esqueleto wither y 4 bloques de arena de almas.",
              "**Estrella del Nether**: activa a El Heraldo",
            ],
          ],
        },
        { tipo: "p", texto: "**End y otros**" },
        {
          tipo: "tabla",
          columnas: ["Jefe", "Dónde está", "Cómo empieza", "Suelta"],
          filas: [
            [
              "Guardián Ender\nCataclysm",
              "Ciudadela en ruinas, en el End.",
              "El Altar del vacío lo invoca al acercarte.",
              "**Guantelete de la guardia**",
            ],
            ["Gólem de ender\nCataclysm", "En el End.", "—", "**Núcleo del vacío**, siempre"],
            [
              "Obsidilith\nBosses of Mass Destruction",
              "En una arena del End.",
              "—",
              "Su cofre: **Obsidian Heart**",
            ],
            [
              "Dragón del End\nVanilla + True Ending",
              "Isla central del End.",
              "Destruye los cristales de las torres antes de atacarlo.",
              "Un contenedor de corazón o de vigor (8.6)",
            ],
            ["Valamon\nMacabre", "Valle sin muerte de Macabre.", "—", "**Heart of Valamon**"],
          ],
        },
      ],
    },
    {
      id: "4.4",
      titulo: "El Dragón del End",
      bloques: [
        {
          tipo: "p",
          texto:
            "En este pack el Dragón del End es mucho más fuerte de lo normal. **Vayan en grupo**, con buena armadura, comida y bloques para subir a las torres.",
        },
        {
          tipo: "definiciones",
          items: [
            {
              termino: "True Ending",
              texto:
                "Lleva el datapack **True Ending** (Ender Dragon Overhaul): el dragón tiene **ataques nuevos** y **más vida**.",
            },
            {
              termino: "Más difícil",
              texto:
                "Dificultad extra sobre la normal, que además sube con el número de jugadores en la pelea: más daño, más vida y más monstruos de apoyo.",
            },
            {
              termino: "Cristales",
              texto:
                "Los cristales reaparecen. Romper uno **cuerpo a cuerpo** le quita un **10 %** de su vida al dragón. Al morir, dejan una nube de efectos dañinos.",
            },
            {
              termino: "Refuerzos",
              texto:
                "Si rompes un cristal a distancia salen phantoms; cuando reaparece un cristal salen blazes; mientras el dragón está posado en el centro salen endermans. No aparecen otros monstruos en la isla.",
            },
            {
              termino: "Defensas",
              texto:
                "Tiene una habilidad contra el vuelo y es inmune a las explosiones (camas incluidas).",
            },
          ],
        },
      ],
    },
    {
      id: "4.5",
      titulo: "Equipo de clase",
      bloques: [
        {
          tipo: "p",
          texto:
            "Las clases de **RPG Series** (Paladins & Priests, Archers y Wizards) dan a paladín, sacerdote, arquero y mago su propio equipo, en **tres niveles**:",
        },
        {
          tipo: "definiciones",
          items: [
            { termino: "Nivel 1", texto: "Materiales normales." },
            {
              termino: "Nivel 2",
              detalle: "armadura",
              texto:
                "Cada pieza de armadura pide **1 material de un jefe del Overworld**: sirve cualquiera de la lista.",
            },
            {
              termino: "Nivel 3",
              detalle: "netherita",
              texto:
                "La mejora a netherita en la **mesa de herrería**, de armaduras y de armas, pide **Netherita templada**.",
            },
          ],
        },
        {
          tipo: "nota",
          estilo: "nota",
          texto:
            "Las armaduras de clase de nivel 2 y 3 **no salen en cofres**: las sueltan los jefes o se fabrican. Las ligeras y medianas tienen más armadura y todas las de nivel 2 y 3 tienen dureza (por ejemplo, el set de Ranger da 15 de armadura y 4 de dureza, y el de netherita, 18 y 8).",
        },
        { tipo: "p", texto: "**Materiales de jefe del Overworld (nivel 2)**" },
        {
          tipo: "p",
          texto: "Cualquiera de estos sirve para cada pieza de armadura de clase de nivel 2:",
        },
        {
          tipo: "objetos",
          items: [
            { nombre: "Colmillo de naga", sale: "**Naga** (Mowzie's Mobs), acantilados junto al mar." },
            { nombre: "Cristal de hielo", sale: "**Frostmaw** (Mowzie's Mobs), biomas nevados." },
            { nombre: "Ancient Anima", sale: "**Night Lich** (Bosses of Mass Destruction), torres de biomas fríos." },
            { nombre: "Void Thorn", sale: "**Void Blossom** (Bosses of Mass Destruction), bajo tierra." },
            { nombre: "Crystal Fruit", sale: "**Void Blossom**." },
            { nombre: "Lingote de cursio", sale: "**Maledictus** (Cataclysm), Prisión helada." },
            { nombre: "Lingote de witherita", sale: "**El Heraldo** (Cataclysm), Fábrica antigua." },
            { nombre: "Lingote de metal antiguo", sale: "**Remanente Antiguo** (Cataclysm), Pirámide maldita." },
            { nombre: "Esencia de la tormenta", sale: "**Scylla** (Cataclysm), Acrópolis." },
            { nombre: "Lácrima", sale: "**Scylla** y las criaturas de la Acrópolis." },
            { nombre: "Garra de quitina", sale: "Los **Pinzardianes** (Cataclysm), en la Acrópolis." },
            { nombre: "Amatista abisal", sale: "La **Madre del laberinto** (Aquamirae), en el océano helado, y las bolsas del tesoro de Aquamirae." },
            { nombre: "Ancient Drive Crystal", sale: "**Relic Annihilator**, **Relic Earthshaker** y **Realmwarden** (EEEAB's Mobs)." },
            { nombre: "Armor Debris", sale: "**Immortal Knight** e **Immortal Executioner** (EEEAB's Mobs)." },
          ],
        },
        { tipo: "p", texto: "**Netherita templada (nivel 3)**" },
        {
          tipo: "p",
          texto:
            "La **Netherita templada** se fabrica sin forma con **2 lingotes de netherita** y **1 material de un jefe del Nether**, y da **2 lingotes**. Brilla y lleva el nombre en dorado. En la mesa de herrería ocupa el lugar del lingote de netherita normal.",
        },
        {
          tipo: "objetos",
          items: [
            { nombre: "Lingote de ignitio", sale: "**Ignis** (Cataclysm), Arena ardiente del Nether." },
            { nombre: "Cuerno monstruoso", sale: "**Monstruosidad de Netherita** (Cataclysm), Herrería de almas." },
            { nombre: "Celda de energía de lava", sale: "**Monstruosidad de Netherita**." },
            { nombre: "Blazing Eye", sale: "Cofre del **Nether Gauntlet** (Bosses of Mass Destruction)." },
            { nombre: "Estrella del Nether", sale: "**El Wither**." },
          ],
        },
        {
          tipo: "recetas",
          items: [
            {
              nombre: "Netherita templada",
              estacion: "Sin forma",
              ingredientes: ["Lingote de netherita", "Lingote de netherita", "Lingote de ignitio"],
              resultado: "Netherita templada",
              cantidad: 2,
              pie: "En lugar del lingote de ignitio sirve cualquier material de jefe del Nether de la lista.",
            },
            {
              nombre: "Mejora de clase a netherita",
              estacion: "Mesa de herrería",
              forma: [["Plantilla de mejora de netherita", "Túnica de Explorador", "Netherita templada"]],
              resultado: "Túnica de Explorador de Netherite",
              pie: "Igual para todas las armas y armaduras de clase de diamante o de nivel 2. Con un lingote de netherita normal no funciona.",
            },
          ],
        },
      ],
    },
  ],
};
