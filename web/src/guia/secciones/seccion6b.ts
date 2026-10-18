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
          "Mejora de la armadura de ignitio (Cataclysm) · 4 piezas · **+6 corazones** · **Robo de vida** · **Escudos de sol** · **Irrompible**",
      },
      {
        tipo: "p",
        texto:
          "Mejora la armadura de **ignitio**. Se ve como la armadura de ignitio. El set completo da **+6 corazones**, mucha armadura y resistencia al empuje, robo de vida, escudos de sol y un aura (abajo). Primero mejora cada pieza de netherita a ignitio en la mesa de herrería:",
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
            nombre: "Peto de ignitio con élitros (opcional)",
            estacion: "Yunque de fusión mecánica",
            forma: [["Peto de ignitio", "Élitros"]],
            resultado: "Peto de ignitio con élitros",
            pie: "Base de la Coraza alada del Último Amanecer.",
          },
        ],
      },
      {
        tipo: "p",
        texto:
          "Después, cada pieza de ignitio se mejora en la mesa de crafteo: **arriba** el material de su jefe, a los **lados** lingotes de witherita, **abajo** un lingote de enderita y en el **centro** la pieza de ignitio.",
      },
      {
        tipo: "recetas",
        items: [
          {
            nombre: "Yelmo del Último Amanecer",
            estacion: "Mesa de crafteo",
            forma: [
              [null, "Cristal de hielo", null],
              ["Lingote de witherita", "Casco de ignitio", "Lingote de witherita"],
              [null, "Lingote de enderita", null],
            ],
            resultado: "Yelmo del Último Amanecer",
            pie: "Cristal de hielo: Frostmaw.",
          },
          {
            nombre: "Coraza del Último Amanecer",
            estacion: "Mesa de crafteo",
            forma: [
              [null, "Crystal Fruit", null],
              ["Lingote de witherita", "Peto de ignitio", "Lingote de witherita"],
              [null, "Lingote de enderita", null],
            ],
            resultado: "Coraza del Último Amanecer",
            pie: "Crystal Fruit: Void Blossom.",
          },
          {
            nombre: "Coraza alada del Último Amanecer",
            estacion: "Mesa de crafteo",
            forma: [
              [null, "Crystal Fruit", null],
              ["Lingote de witherita", "Peto de ignitio con élitros", "Lingote de witherita"],
              [null, "Lingote de enderita", null],
            ],
            resultado: "Coraza alada del Último Amanecer",
            pie: "Permite planear y cuenta como pieza del set. El peto con élitros sale de fusionar un peto de ignitio con unos élitros en el Yunque de fusión mecánica.",
          },
          {
            nombre: "Grebas del Último Amanecer",
            estacion: "Mesa de crafteo",
            forma: [
              [null, "Void Thorn", null],
              ["Lingote de witherita", "Grebas de ignitio", "Lingote de witherita"],
              [null, "Lingote de enderita", null],
            ],
            resultado: "Grebas del Último Amanecer",
            pie: "Void Thorn: Void Blossom.",
          },
          {
            nombre: "Botas del Último Amanecer",
            estacion: "Mesa de crafteo",
            forma: [
              [null, "Ancient Anima", null],
              ["Lingote de witherita", "Botas de ignitio", "Lingote de witherita"],
              [null, "Lingote de enderita", null],
            ],
            resultado: "Botas del Último Amanecer",
            pie: "Ancient Anima: Night Lich.",
          },
        ],
      },
      { tipo: "p", texto: "**Qué da cada pieza**" },
      {
        tipo: "tabla",
        columnas: ["Pieza", "Pieza base", "Armadura", "Dureza", "Resist. al empuje", "Vida extra"],
        filas: [
          ["**Yelmo**", "Casco de ignitio", "6", "4", "0,2", "+2"],
          ["**Coraza**", "Peto de ignitio", "11", "4", "0,2", "+4"],
          ["**Coraza alada**", "Peto de ignitio con élitros", "11", "4", "0,2", "+4"],
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
      { tipo: "p", texto: "**Más bonos del set completo**" },
      {
        tipo: "definiciones",
        items: [
          {
            termino: "Escudos de sol",
            texto: "**Dos escudos** giran a tu alrededor. Cada uno para **un golpe entero** y vuelve a los **20 s**.",
          },
          { termino: "Daño", texto: "**+15 % de daño** con las armas del abismo (no con el Arco Prohibido)." },
          { termino: "Velocidad", texto: "**+5 %** de velocidad al andar." },
          { termino: "Aura", texto: "Te rodea un aura de sol que también ven los demás." },
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
          "El arsenal definitivo no se encanta en la mesa ni en el yunque normal: se encanta con **libros** en el **Yunque del Abismo**. También sirve para **cualquier otra arma o armadura**.",
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
          "Haz **clic derecho** al Yunque del Abismo: se abre el **menú del yunque**.",
          "**Izquierda**: el arma o la armadura. **Derecha**: el libro encantado. Coge el resultado y pagas el coste (abajo).",
          "Para **unir dos libros**, pon un libro en cada lado.",
          "Puedes **renombrar** el objeto a la vez, como en un yunque normal.",
          "Para llevártelo, **rómpelo con un pico**: lo recoges entero.",
        ],
      },
      { tipo: "p", texto: "**Costes y reglas**" },
      {
        tipo: "tabla",
        columnas: ["Qué haces", "Coste"],
        filas: [
          ["Poner encantamientos", "**5 niveles** por encantamiento"],
          ["Multidisparo en el tridente", "**+30 niveles** más"],
          ["Unir dos libros", "**3 niveles** por encantamiento"],
          ["Multidisparo I + I = II", "**+10 niveles** más"],
        ],
        pie: "El coste nunca pasa de **39 niveles**, así que el yunque no dice nunca «¡Demasiado caro!». **Nunca se desgasta.**",
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
  {
    id: "6.9",
    titulo: "El Arco Prohibido",
    bloques: [
      {
        tipo: "p",
        texto:
          "El arma final del pack. **No se fabrica**: nace de un ritual con las 8 piezas del Arsenal del Abismo en la **Mesa del Sacrificio**. Dispara una flecha y, donde cae, un **rayo orbital** baja del cielo.",
      },
      {
        tipo: "recetas",
        items: [
          {
            nombre: "Mesa del Sacrificio",
            estacion: "Mesa de crafteo",
            forma: [
              ["Cadena", "Bloque de oro", "Cadena"],
              ["Obsidiana llorosa", "Núcleo del vacío", "Obsidiana llorosa"],
              ["Obsidiana llorosa", "Obsidiana llorosa", "Obsidiana llorosa"],
            ],
            pie: "Un altar flotante del abismo. El Núcleo del vacío sale de los Gólems de ender.",
          },
        ],
      },
      { tipo: "p", texto: "**El ritual**" },
      {
        tipo: "pasos",
        items: [
          "Pon en la mesa, con **clic derecho**, las 8 piezas: Filo del Juicio, Rompemundos, Tridente del Abismo, Arco de la Maldición Eterna y las 4 del Último Amanecer (la Coraza alada también vale). Flotan girando encima. Con la mano vacía, clic derecho saca la última.",
          "Con las 8 encima y **100 niveles**, haz **agachado + clic derecho con la mano vacía**. La mesa te avisa de lo que vas a perder.",
          "Repite en menos de 10 s para sellar el pacto: las piezas se funden, cae un rayo de luz y el **Arco Prohibido** va a tu inventario. Las piezas y los 100 niveles se pierden.",
        ],
      },
      {
        tipo: "nota",
        estilo: "nota",
        texto: "Si rompes la mesa con piezas encima, las suelta. Carry On no la puede levantar.",
      },
      { tipo: "p", texto: "**Cómo se usa**" },
      {
        tipo: "definiciones",
        items: [
          {
            termino: "Invocar",
            detalle: "mantener clic derecho 3 s",
            texto:
              "El arco no se empuña: se forma a tu lado, de 7 bloques de alto. Mientras está invocado y sin disparar, te protegen **6 escudos arcanos**: cada uno para un golpe.",
          },
          {
            termino: "Disparar",
            detalle: "con el arco invocado, mantener clic derecho 2 s y soltar",
            texto:
              "Mientras cargas puedes **volar** para acomodarte, hasta 20 bloques por encima de donde empezaste. Al soltar, la caída no te hace daño. La flecha llega hasta **200 bloques**; si se clava en una criatura, el rayo la persigue.",
          },
          {
            termino: "Disparos",
            texto:
              "**Dos disparos** y después **10 minutos** de recarga. Los que quedan se ven debajo de la mira. Tras el último, el arco se desinvoca solo.",
          },
        ],
      },
      {
        tipo: "estadisticas",
        titulo: "Costo de cada tiro",
        items: [
          { etiqueta: "Vida", valor: "La mitad de tu vida actual (necesitas más de 2 corazones)" },
          { etiqueta: "Niveles", valor: "10" },
          { etiqueta: "Árbol de habilidades", valor: "2 puntos libres" },
        ],
      },
      { tipo: "p", texto: "**El rayo orbital**" },
      {
        tipo: "pasos",
        items: [
          "Donde cae la flecha se abre una **grieta en el cielo**, a la altura de las estrellas: roja, se vuelve negra, con relámpagos, latidos y su propia música.",
          "Salen los haces de luz y el rayo se carga. De día, justo antes del golpe, todo se apaga menos el rayo y la grieta.",
          "El rayo cae **12 s** después de la flecha. Toda la zona se carga sola desde que cae la flecha, aunque esté lejos de los jugadores.",
        ],
      },
      {
        tipo: "estadisticas",
        titulo: "Daño del rayo",
        items: [
          { etiqueta: "Centro", valor: "600 de daño verdadero" },
          { etiqueta: "Borde", valor: "150 de daño normal" },
          { etiqueta: "Jefes", valor: "50 % de su vida máxima por tiro" },
          { etiqueta: "Cráter", valor: "Radio 20 y 25 de hondo" },
        ],
      },
      {
        tipo: "lista",
        items: [
          "El cráter quita los líquidos sin que entre el agua de alrededor.",
          "Nunca rompe la bedrock; la obsidiana, solo a veces.",
          "En creativo no cuesta nada (`/give @s infectcozy_arco:arco_prohibido`).",
        ],
      },
      {
        tipo: "nota",
        estilo: "importante",
        titulo: "También te puede matar a ti",
        texto:
          "El rayo daña a **todos los jugadores** que estén dentro, también al que disparó, y no deja a nadie herido en el suelo: se muere directamente. Aléjate antes de que caiga.",
      },
    ],
  },
];
