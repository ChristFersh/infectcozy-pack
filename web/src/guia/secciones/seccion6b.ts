import type { Subseccion } from "../tipos";

export const subsecciones6b: Subseccion[] = [
  {
    id: "6.5",
    titulo: "Armadura del Último Amanecer",
    bloques: [
      {
        tipo: "nota",
        estilo: "nota",
        titulo: "Armadura del Último Amanecer",
        texto:
          "Mejora de la armadura de ignitio (Cataclysm) · 4 piezas · **+6 corazones** · **Robo de vida** · **Irrompible**",
      },
      {
        tipo: "p",
        texto:
          "Mejora la armadura de **ignitio**. El set completo da **+6 corazones**, mucha armadura y resistencia al empuje, y mantiene las habilidades de la armadura de ignitio (teclas en la sección 7). Primero mejora cada pieza de netherita a ignitio en la mesa de herrería:",
      },
      {
        tipo: "recetas",
        items: [
          {
            nombre: "1 · Molde de mejora de ignitio",
            estacion: "Mesa de crafteo",
            forma: [
              ["Ladrillos del Nether", "Polvo de blaze", "Ladrillos del Nether"],
              ["Polvo de blaze", "Plantilla de mejora de netherita", "Polvo de blaze"],
              ["Ladrillos del Nether", "Polvo de blaze", "Ladrillos del Nether"],
            ],
            resultado: "Molde de mejora de ignitio",
            pie: "Molde para mejorar la netherita a ignitio.",
          },
          {
            nombre: "2 · Pieza de ignitio",
            estacion: "Mesa de herrería",
            forma: [["Molde de mejora de ignitio", "Peto de netherita", "Lingote de ignitio"]],
            resultado: "Peto de ignitio",
            pie: "Igual para el casco, las grebas y las botas.",
          },
          {
            nombre: "3 · Pieza del Último Amanecer",
            estacion: "Mesa de crafteo",
            forma: [
              [null, "Material del jefe", null],
              ["Lingote de witherita", "Pieza de ignitio", "Lingote de witherita"],
              [null, "Lingote de enderita", null],
            ],
            resultado: "Pieza del Último Amanecer",
            pie: "Arriba va el material de su jefe.",
          },
        ],
      },
      { tipo: "p", texto: "**Qué va arriba**" },
      {
        tipo: "lista",
        items: [
          "**Yelmo**: Cristal de hielo (Frostmaw)",
          "**Coraza**: Crystal Fruit (Void Blossom)",
          "**Coraza alada**: Crystal Fruit, con un **peto de ignitio con élitras** en el centro. Permite planear y cuenta como pieza del set.",
          "**Grebas**: Void Thorn (Void Blossom)",
          "**Botas**: Ancient Anima (Night Lich)",
        ],
      },
      {
        tipo: "p",
        texto:
          "En los lados, lingotes de witherita; abajo, un lingote de enderita; en el centro, la pieza de ignitio que mejoras.",
      },
      { tipo: "p", texto: "**Qué da cada pieza**" },
      {
        tipo: "tabla",
        columnas: ["Pieza", "Pieza base", "Armadura", "Dureza", "Resist. al empuje", "Vida extra"],
        filas: [
          ["**Yelmo**", "Casco de ignitio", "6", "4", "0,2", "+2"],
          ["**Coraza**", "Peto de ignitio", "11", "4", "0,2", "+4"],
          ["**Coraza alada**", "Peto de ignitio con élitras", "11", "4", "0,2", "+4"],
          ["**Grebas**", "Grebas de ignitio", "9", "4", "0,2", "+4"],
          ["**Botas**", "Botas de ignitio", "6", "4", "0,2", "+2"],
          ["**Set completo**", "4 piezas", "**32**", "**16**", "**0,8**", "**+12** (6 corazones)"],
        ],
        pie: "Vida en puntos: 2 puntos = 1 corazón. La resistencia al empuje de 0,2 equivale a un 20 % por pieza.",
      },
      { tipo: "p", texto: "**Robo de vida**" },
      {
        tipo: "p",
        texto:
          "Con **las 4 piezas** puestas, cada **golpe directo** te cura el **10 %** del daño que haces, hasta **3 de vida** (1,5 corazones) por golpe. Lo ves con un corazón y un latido. Si tienes la vida llena no cura; los decimales se guardan para el siguiente golpe.",
      },
      {
        tipo: "tabla",
        columnas: ["Cuenta"],
        filas: [
          ["Golpes cuerpo a cuerpo (un barrido que da a varios cuenta como un golpe)"],
          ["El rayo del arco definitivo (20 de daño: cura 2)"],
          ["El Rompemundos lanzado (24 de daño)"],
          ["El impacto directo del Tridente del Abismo, también con Furia"],
        ],
      },
      {
        tipo: "tabla",
        columnas: ["No cuenta"],
        filas: [
          ["Daño con el tiempo: veneno, fuego"],
          ["Explosiones, también las del arco y el tridente"],
          ["La onda de la Furia sobre otras criaturas"],
        ],
      },
    ],
  },
  {
    id: "6.6",
    titulo: "Yunque del Abismo",
    bloques: [
      {
        tipo: "p",
        texto:
          "El arsenal definitivo no se encanta en la mesa ni en el yunque normal (lleva la maldición **Sello del Abismo**, que no hace nada más): se encanta con **libros** en el **Yunque del Abismo**. También sirve para **cualquier otra arma o armadura**.",
      },
      { tipo: "p", texto: "**Receta**" },
      {
        tipo: "recetas",
        items: [
          {
            nombre: "Yunque del Abismo",
            estacion: "Mesa de crafteo",
            forma: [
              ["Lingote de cursio", "Núcleo del vacío", "Lingote de ignitio"],
              ["Bloque de netherita", "Yunque", "Bloque de netherita"],
              ["Obsidiana llorosa", "Obsidiana llorosa", "Obsidiana llorosa"],
            ],
            pie: "Se coloca como un yunque.",
          },
        ],
      },
      { tipo: "p", texto: "**Cómo se usa**" },
      {
        tipo: "pasos",
        items: [
          "Pon el **objeto** en la mano principal y el **libro encantado** en la secundaria.",
          "Haz **clic derecho** al yunque: el encantamiento pasa al objeto y pagas el coste (abajo).",
          "Para **unir dos libros**, pon un libro en cada mano.",
          "**Agachado + clic derecho**: recoges el yunque.",
        ],
      },
      { tipo: "p", texto: "**Costes y reglas**" },
      {
        tipo: "tabla",
        columnas: ["Qué haces", "Coste"],
        filas: [
          ["Poner un encantamiento", "**5 niveles** y **8 de lapislázuli** por encantamiento"],
          ["Multidisparo en el tridente", "**+30 niveles** y **+32 de lapislázuli** más"],
          ["Unir dos libros", "**3 niveles** y **3 de lapislázuli** por encantamiento"],
          ["Multidisparo I + I = II", "**+10 niveles** y **+32 de lapislázuli** más"],
          ["En creativo", "Gratis"],
        ],
      },
      {
        tipo: "lista",
        items: [
          "Dos niveles iguales **suben uno**: III + III = IV.",
          "No deja poner encantamientos **incompatibles**.",
          "El **Multidisparo** solo va en ballestas (nivel I) y en el Tridente del Abismo (I o II).",
        ],
      },
      { tipo: "p", texto: "**Encantamientos de estado**" },
      {
        tipo: "p",
        texto: "Aplican un estado al enemigo (fuego, congelación, plaga…). Son estos:",
      },
      {
        tipo: "tabla",
        columnas: ["Mod", "Encantamientos"],
        filas: [
          ["Vanilla", "Aspecto ígneo, Llama, Perdición de los artrópodos"],
          [
            "Tombstone",
            "Decrepitud, Congelación, Heridas incurables, Portador de plagas. **Llegan a nivel X.**",
          ],
          ["Spore", "Potencia corrosiva, Aspecto criogénico, Vómito gástrico"],
          ["Inquisition", "Congelación profunda, Congelación de almas"],
          ["Dungeons & Taverns", "Recubrimiento de marchitez"],
        ],
      },
      { tipo: "p", texto: "**Los estados en el arsenal**" },
      {
        tipo: "tabla",
        columnas: ["Arma", "Cómo los aplica"],
        filas: [
          [
            "Rompemundos",
            "Clavado en una criatura, le aplica todos sin parar (como mucho a nivel V). En el suelo, la zona helada aplica uno al azar.",
          ],
          ["Filo del Juicio", "Los llevan las llamaradas del ataque cargado."],
          ["Arco de la Maldición Eterna", "En cada impacto."],
          ["Tridente del Abismo", "No los acepta."],
        ],
      },
    ],
  },
  {
    id: "6.7",
    titulo: "Transmutación (ProjectE)",
    bloques: [
      {
        tipo: "p",
        texto:
          "ProjectE convierte unos objetos en otros usando **EMC**. En este pack está **bloqueado detrás de los jefes**: la **Piedra filosofal** (Philosopher's Stone) pide materiales de Ignis y del Night Lich, y la **Materia roja** (Red Matter) pide enderita. Las demás recetas de ProjectE no cambian.",
      },
      {
        tipo: "recetas",
        items: [
          {
            nombre: "Piedra filosofal",
            estacion: "Mesa de crafteo",
            forma: [
              ["Polvo de redstone", "Polvo de piedra luminosa", "Polvo de redstone"],
              ["Lingote de ignitio", "Diamante", "Ancient Anima"],
              ["Polvo de redstone", "Polvo de piedra luminosa", "Polvo de redstone"],
            ],
            resultado: "Philosopher's Stone",
            pie: "Tu primer paso en la transmutación.",
          },
          {
            nombre: "Mesa de transmutación",
            estacion: "Mesa de crafteo",
            forma: [
              ["Obsidiana", "Piedra", "Obsidiana"],
              ["Piedra", "Philosopher's Stone", "Piedra"],
              ["Obsidiana", "Piedra", "Obsidiana"],
            ],
            resultado: "Transmutation Table",
          },
          {
            nombre: "Materia oscura",
            estacion: "Mesa de crafteo",
            forma: [
              ["Aeternalis Fuel", "Aeternalis Fuel", "Aeternalis Fuel"],
              ["Aeternalis Fuel", "Bloque de diamante", "Aeternalis Fuel"],
              ["Aeternalis Fuel", "Aeternalis Fuel", "Aeternalis Fuel"],
            ],
            resultado: "Dark Matter",
          },
          {
            nombre: "Materia roja",
            estacion: "Mesa de crafteo",
            forma: [
              ["Aeternalis Fuel", "Lingote de enderita", "Aeternalis Fuel"],
              ["Dark Matter", "Dark Matter", "Dark Matter"],
              ["Aeternalis Fuel", "Aeternalis Fuel", "Aeternalis Fuel"],
            ],
            resultado: "Red Matter",
            pie: "Necesita enderita.",
          },
        ],
      },
    ],
  },
  {
    id: "6.8",
    titulo: "Extra: el hacha de Valamon",
    bloques: [
      {
        tipo: "recetas",
        items: [
          {
            nombre: "Seeping Waraxe",
            estacion: "Sin forma · en cualquier orden",
            ingredientes: ["Heart of Valamon", "Doubleslit"],
          },
        ],
      },
      {
        tipo: "p",
        texto:
          "**Valamon** vive en el Valle sin muerte de Macabre y suelta su corazón (Heart of Valamon). Con él fabricas la **Seeping Waraxe**.",
      },
      {
        tipo: "p",
        texto: "No forma parte del arsenal definitivo, pero es un buen trofeo.",
      },
    ],
  },
];
