import type { Seccion } from "../tipos";

export const seccion6: Seccion = {
  id: "6",
  titulo: "Arsenal definitivo",
  resumen:
    "Armas y armadura irrompibles hechas con materiales de jefes: de dónde salen los materiales, sus recetas y sus habilidades.",
  intro: [
    {
      tipo: "p",
      texto:
        "El arsenal definitivo son **4 armas** y un **set de armadura** hechos con materiales de jefes. **Todo es irrompible** y de rareza épica. Cada receta **mejora un arma o armadura de otro mod**: primero consigue esa pieza base. El arma mejorada conserva las habilidades de la base. Las recetas están en el recetario (JEI).",
    },
    {
      tipo: "nota",
      estilo: "importante",
      titulo: "Encantamientos",
      texto:
        "Nada del arsenal se encanta en la mesa de encantamientos ni en el yunque normal: todo lleva la maldición **Sello del Abismo**, que no hace nada más. Se encanta solo con **libros** en el **Yunque del Abismo** (6.6).",
    },
    { tipo: "p", texto: "**Piezas base**" },
    {
      tipo: "p",
      texto: "Cada objeto del arsenal se fabrica encima de una pieza de otro mod. Consíguela antes de juntar los materiales:",
    },
    {
      tipo: "objetos",
      items: [
        {
          nombre: "El incinerador",
          sale: "Receta con lingotes de ignitio (6.1).",
          uso: "Filo del Juicio",
        },
        {
          nombre: "Hacha pesada",
          sale: "La suelta el **Caballero de hierro forjado** (Mowzie's Mobs), que espera bajo tierra en una cámara sellada.",
          uso: "Rompemundos",
        },
        {
          nombre: "Tridente",
          sale: "Lo sueltan los **ahogados** que aparecen con tridente (océanos y ríos, de noche).",
          uso: "Tridente del Abismo",
        },
        {
          nombre: "Ira del desierto",
          sale: "Fusión de un **Arco maldito** con una **Tormenta de arena en un frasco** en el Yunque de fusión mecánica (6.4).",
          uso: "Arco de la Maldición Eterna",
        },
        {
          nombre: "Casco de ignitio",
          sale: "Casco de netherita + lingote de ignitio en la **mesa de herrería**, con el molde de mejora de ignitio (6.5).",
          uso: "Yelmo del Último Amanecer",
        },
        {
          nombre: "Peto de ignitio",
          sale: "Peto de netherita + lingote de ignitio en la mesa de herrería, con el molde de mejora de ignitio.",
          uso: "Coraza del Último Amanecer",
        },
        {
          nombre: "Peto de ignitio con élitros",
          sale: "Fusión de un **Peto de ignitio** con unos **Élitros** en el Yunque de fusión mecánica.",
          uso: "Coraza alada del Último Amanecer",
        },
        {
          nombre: "Grebas de ignitio",
          sale: "Grebas de netherita + lingote de ignitio en la mesa de herrería, con el molde de mejora de ignitio.",
          uso: "Grebas del Último Amanecer",
        },
        {
          nombre: "Botas de ignitio",
          sale: "Botas de netherita + lingote de ignitio en la mesa de herrería, con el molde de mejora de ignitio.",
          uso: "Botas del Último Amanecer",
        },
      ],
    },
    { tipo: "p", texto: "**Materiales y de dónde salen**" },
    {
      tipo: "objetos",
      items: [
        {
          nombre: "Lingote de ignitio",
          sale: "**Ignis**, en la Arena ardiente del Nether.",
          uso: "El incinerador, Filo del Juicio, armadura de ignitio, Yunque del Abismo, Piedra filosofal, Netherita templada",
        },
        {
          nombre: "Lingote de cursio",
          sale: "**Maledictus** (Prisión helada).",
          uso: "Filo del Juicio, Arco maldito, arco definitivo, Yunque del Abismo",
        },
        {
          nombre: "Núcleo del vacío",
          sale: "Los **Gólems de ender** del End (siempre sueltan uno).",
          uso: "Filo del Juicio, enderita, Yunque del Abismo",
        },
        {
          nombre: "Lingote de enderita",
          sale: "Receta con núcleo del vacío, chatarra de netherita y caparazones de shulker (ver abajo).",
          uso: "Arco definitivo, armadura del Último Amanecer, Materia roja",
        },
        {
          nombre: "Obsidian Heart",
          sale: "Cofre del **Obsidilith** (Bosses of Mass Destruction), en una arena del End.",
          uso: "Rompemundos",
        },
        {
          nombre: "Lingote de metal antiguo",
          sale: "**Remanente Antiguo** (suelta bloques: 1 bloque = 9 lingotes); también koboletons, Wadjet y los cofres de la Pirámide maldita.",
          uso: "Rompemundos",
        },
        {
          nombre: "Cuerno monstruoso",
          sale: "**Monstruosidad de Netherita**, en la Herrería de almas del Nether.",
          uso: "Rompemundos, Netherita templada",
        },
        {
          nombre: "Celda de energía de lava",
          sale: "**Monstruosidad de Netherita** (Nether).",
          uso: "Netherita templada",
        },
        {
          nombre: "Esencia de la tormenta",
          sale: "**Scylla**, en la Acrópolis del océano cálido.",
          uso: "Tridente del Abismo",
        },
        {
          nombre: "Lácrima",
          sale: "**Scylla**, las criaturas de la Acrópolis y sus cofres del tesoro.",
          uso: "Tridente del Abismo",
        },
        {
          nombre: "Colmillo de naga",
          sale: "**Naga** (Mowzie's Mobs), que sobrevuela los acantilados junto al mar.",
          uso: "Tridente del Abismo",
        },
        {
          nombre: "Blazing Eye",
          sale: "Cofre del **Nether Gauntlet** (Bosses of Mass Destruction), en una arena del Nether.",
          uso: "Arco definitivo, Netherita templada",
        },
        {
          nombre: "Tormenta de arena en un frasco",
          sale: "**Remanente Antiguo** (Pirámide maldita, en el desierto).",
          uso: "Ira del desierto",
        },
        {
          nombre: "Lingote de acero negro",
          sale: "**Draugr** y **Draugr real** (2,5 % al matarlos tú), el minijefe **Aptrgangr** (Prisión helada) y los cofres de la Prisión helada y de las ruinas abandonadas.",
          uso: "Arco maldito",
        },
        {
          nombre: "Lingote de witherita",
          sale: "**El Heraldo**, en la Fábrica antigua (suelta bloques: 1 bloque = 9 lingotes).",
          uso: "Armadura del Último Amanecer, Yunque de fusión mecánica",
        },
        {
          nombre: "Cristal de hielo",
          sale: "**Frostmaw** (Mowzie's Mobs), en los biomas nevados.",
          uso: "Yelmo del Último Amanecer",
        },
        {
          nombre: "Crystal Fruit",
          sale: "**Void Blossom** (Bosses of Mass Destruction), escondida bajo tierra.",
          uso: "Coraza y Coraza alada del Último Amanecer",
        },
        {
          nombre: "Void Thorn",
          sale: "**Void Blossom**.",
          uso: "Grebas del Último Amanecer",
        },
        {
          nombre: "Ancient Anima",
          sale: "**Night Lich** (Bosses of Mass Destruction), en torres de biomas fríos.",
          uso: "Botas del Último Amanecer, Piedra filosofal",
        },
        {
          nombre: "Estrella del Nether",
          sale: "**El Wither** (lo invocas tú).",
          uso: "Netherita templada",
        },
      ],
    },
    {
      tipo: "p",
      texto:
        "Los materiales de jefe del Overworld también sirven para el equipo de clase de nivel 2, y los del Nether para la Netherita templada (4.5).",
    },
    { tipo: "p", texto: "**Enderita**" },
    {
      tipo: "p",
      texto:
        "Los lingotes de **enderita** se fabrican con el **Núcleo del vacío** que sueltan **siempre** los Gólems de ender del End. Los necesitas para la armadura, el arco y la Materia roja.",
    },
    {
      tipo: "recetas",
      items: [
        {
          nombre: "Lingote de enderita",
          estacion: "Mesa de crafteo",
          forma: [
            [null, "Caparazón de shulker", null],
            ["Chatarra de netherita", "Núcleo del vacío", "Chatarra de netherita"],
            [null, "Caparazón de shulker", null],
          ],
          cantidad: 2,
          pie: "Cada receta da 2 lingotes.",
        },
      ],
    },
  ],
  subsecciones: [
    {
      id: "6.1",
      titulo: "Filo del Juicio",
      bloques: [
        {
          tipo: "p",
          texto:
            "Mejora de El Incinerador (Cataclysm) · “Forjada con el fuego de Ignis y la maldición de Maledictus.”",
        },
        {
          tipo: "estadisticas",
          items: [
            { etiqueta: "Daño", valor: "21" },
            { etiqueta: "Velocidad", valor: "1,6" },
            { etiqueta: "Durabilidad", valor: "Irrompible" },
          ],
        },
        {
          tipo: "recetas",
          items: [
            {
              nombre: "El Incinerador (base)",
              estacion: "Mesa de crafteo",
              forma: [
                [null, "Vara de blaze", "Lingote de ignitio"],
                ["Vara de blaze", "Lingote de ignitio", "Vara de blaze"],
                ["Espada de netherita", "Vara de blaze", null],
              ],
              resultado: "El incinerador",
              pie: "Primero fabrica El Incinerador.",
            },
            {
              nombre: "Filo del Juicio",
              estacion: "Mesa de crafteo",
              forma: [
                [null, "Lingote de cursio", null],
                ["Lingote de ignitio", "El incinerador", "Lingote de ignitio"],
                [null, "Núcleo del vacío", null],
              ],
              pie: "Mantiene el ataque de fuego del Incinerador.",
            },
          ],
        },
        { tipo: "p", texto: "**Guardia ígnea**" },
        {
          tipo: "pasos",
          items: [
            "Mantén **clic derecho** para cargar el ataque de fuego del Incinerador.",
            "Mientras cargas te envuelve un **aura de llamas** (a la cintura y a los pies) y recibes **la mitad de daño** (−50 %, se aplica después de la armadura). La barra de acción lo indica: *“Guardia ígnea · -50 % de daño recibido”*. Si te golpean, oyes el fuego apagarse.",
            "A los **3 segundos** la carga está lista: aparece una **corona de llamas** sobre tu cabeza y la barra dice *“¡Carga lista!”*.",
            "Suelta el clic para lanzar el ataque. Al dejar de cargar (soltar, cambiar de objeto o morir) la guardia se apaga al instante.",
          ],
        },
        {
          tipo: "nota",
          estilo: "consejo",
          texto: "Úsala como escudo: carga mientras un jefe te ataca y suelta cuando abra la guardia.",
        },
        { tipo: "p", texto: "**Llamaradas del Juicio**" },
        { tipo: "p", texto: "Al soltar la carga, el ataque de fuego lanza llamaradas:" },
        {
          tipo: "definiciones",
          items: [
            { termino: "Vórtice", texto: "Antes de estallar, **atraen** a los enemigos cercanos (a los jefes no)." },
            {
              termino: "Tierra calcinada",
              texto: "Dejan el suelo ardiendo **5 s**: **2 de daño cada medio segundo** y fuego a quien la pise.",
            },
            {
              termino: "Curación",
              texto: "Te curan **2 corazones por enemigo alcanzado**, hasta 3 enemigos por ataque.",
            },
            { termino: "Estados", texto: "Llevan los encantamientos de estado de la espada (6.6)." },
          ],
        },
        { tipo: "p", texto: "**Combo, Embestida y Sentencia**" },
        {
          tipo: "tabla",
          columnas: ["Habilidad", "Cómo", "Qué hace"],
          filas: [
            [
              "**Combo del Juicio**",
              "3 golpes",
              "3 golpes seguidos, con menos de 3 s entre uno y otro: el tercero estalla en **fuego maldito** (**10 de daño** en área).",
            ],
            [
              "**Embestida**",
              "**Q**",
              "Sales disparado unos **9 bloques** hacia donde miras, girando envuelto en fuego: **12 de daño** y un rastro de fuego de almas durante 2 s. Recarga **8 s**.",
            ],
            [
              "**Sentencia**",
              "**Agachado + Q**",
              "Subes, alzas la espada y caes en picada **hacia donde apuntas** (sin daño de caída): una onda de fuego de **6 bloques** (**16 de daño** y fuego) lanza a los enemigos al aire, menos a los jefes. Recarga **20 s**.",
            ],
          ],
        },
        {
          tipo: "nota",
          estilo: "nota",
          texto:
            "La espada **nunca se suelta**: con **Q** haces la Embestida o la Sentencia y sigue en tu mano. Los demás jugadores cerca no reciben daño de estos ataques.",
        },
      ],
    },
    {
      id: "6.2",
      titulo: "Rompemundos",
      bloques: [
        {
          tipo: "p",
          texto: "Mejora del Hacha pesada (Mowzie's Mobs) · “El corazón del Obsidilith late dentro de su filo.”",
        },
        {
          tipo: "estadisticas",
          items: [
            { etiqueta: "Daño", valor: "24" },
            { etiqueta: "Velocidad", valor: "0,9" },
            { etiqueta: "Durabilidad", valor: "Irrompible" },
          ],
        },
        {
          tipo: "recetas",
          items: [
            {
              nombre: "Rompemundos",
              estacion: "Mesa de crafteo",
              forma: [
                [null, "Obsidian Heart", null],
                ["Lingote de metal antiguo", "Hacha pesada", "Lingote de metal antiguo"],
                [null, "Cuerno monstruoso", null],
              ],
              pie: "La base la suelta el Caballero de hierro forjado.",
            },
          ],
        },
        { tipo: "p", texto: "**Habilidades del Hacha pesada**" },
        { tipo: "p", texto: "Las mantiene, pero ahora con el daño del Rompemundos:" },
        {
          tipo: "lista",
          items: [
            "**Clic derecho**: barrido en arco, en área.",
            "**Agachado + clic derecho** en el suelo: golpe sísmico con onda de choque.",
            "**Q**: la lanzas (abajo).",
          ],
        },
        { tipo: "p", texto: "**Lanzamiento**" },
        {
          tipo: "pasos",
          items: [
            "Pulsa **Q** con el hacha en la mano (o arrástrala fuera del inventario) para **lanzarla**. Sale recta desde tus ojos y cae con la distancia. Si muere alguien y suelta el hacha, no se lanza: queda como objeto normal.",
            "En su hueco queda **Llamar al Rompemundos**. Usa **clic derecho** con él (o pulsa **Q** otra vez) y el hacha **vuelve a ti atravesando bloques**, cada vez más rápido.",
            "Vuelve al hueco donde tienes el objeto de llamada. Si estás en otra dimensión, a más de 160 bloques o tarda más de 10 segundos, te llega directamente.",
            "Si **no llevas encima el objeto de llamada** durante 1 segundo (lo guardaste o lo perdiste), el hacha vuelve sola. Si estás desconectado o muerto, te espera flotando donde esté.",
          ],
        },
        { tipo: "p", texto: "**Hielo**" },
        {
          tipo: "definiciones",
          items: [
            {
              termino: "Clavada en una criatura",
              texto:
                "**24 de daño** (cuenta como tuyo: botín, experiencia y logros). La encierra en un bloque de hielo **6 s**: no anda, no salta y no la empujan. Después va **lenta**. Mientras siga clavada pierde un **30 % de armadura**. Tras el hielo hay **4 s de espera** antes de poder paralizarla otra vez. Si muere, el hacha cae y la **zona helada estalla donde aterrice**.",
            },
            {
              termino: "Contra jefes",
              texto:
                "Solo los frena: congelados 2 s y −60 % de velocidad (al andar y al volar) mientras siga clavada, sin paralizarlos. También pierden el 30 % de armadura.",
            },
            {
              termino: "Clavada en un bloque",
              texto:
                "Crea una **zona helada de 5 bloques** de radio con cristales y niebla mientras siga ahí: los enemigos van con lentitud (−30 % de velocidad) y pierden un **15 % de armadura**. Si rompen el bloque, el hacha cae y la zona se rehace donde aterrice. Mientras siga clavada, la **nieve se va acumulando** a su alrededor.",
            },
            {
              termino: "Al agua",
              texto:
                "Se clava en la superficie y la **congela** en 5 bloques. El hielo aguanta mientras siga ahí (la zona helada también congela el agua cercana) y después se derrite solo.",
            },
            {
              termino: "Encantamientos de estado",
              texto:
                "Clavada en una criatura, le aplica **todos** sin parar (como mucho a nivel V). En el suelo, la zona aplica **uno al azar**. La lista está en 6.6.",
            },
            { termino: "Al llamarla", texto: "El hielo se rompe y se quitan todos los efectos." },
          ],
        },
        {
          tipo: "nota",
          estilo: "nota",
          texto:
            "Los efectos no se suman: si una criatura tiene el hacha clavada y además está dentro de una zona, cuenta solo el del hacha clavada (−30 % de armadura).",
        },
      ],
    },
    {
      id: "6.3",
      titulo: "Tridente del Abismo",
      bloques: [
        {
          tipo: "p",
          texto: "Mejora del tridente · “Las tormentas de Scylla obedecen a quien lo empuña.”",
        },
        {
          tipo: "estadisticas",
          items: [
            { etiqueta: "Daño", valor: "18" },
            { etiqueta: "Velocidad", valor: "1,1" },
            { etiqueta: "Durabilidad", valor: "Irrompible" },
          ],
        },
        {
          tipo: "recetas",
          items: [
            {
              nombre: "Tridente del Abismo",
              estacion: "Mesa de crafteo",
              forma: [
                [null, "Esencia de la tormenta", null],
                ["Lácrima", "Tridente", "Lácrima"],
                [null, "Colmillo de naga", null],
              ],
            },
          ],
        },
        { tipo: "p", texto: "**Lanzar sin perderlo**" },
        {
          tipo: "lista",
          items: [
            "Al lanzarlo **no sale de tu inventario**: lo que vuela es una **copia**.",
            "Cada vez que cae **explota en área** (radio 5, **10 de daño**). No rompe bloques ni daña a jugadores ni mascotas.",
            "El impacto directo hace **8 de daño + 1 por carga**.",
            "La copia clavada dura **2 minutos** y **solo tú** puedes recogerla.",
          ],
        },
        { tipo: "p", texto: "**Cargas del abismo**" },
        {
          tipo: "p",
          texto:
            "Cada copia que recoges es una **carga** (máximo 30). La barra de acción te dice cuántas tienes y qué te dará el próximo lanzamiento. El siguiente lanzamiento **gasta todas tus cargas**: +1 de daño por carga y, desde **10 cargas**, la posibilidad de desatar la Furia. **Si mueres, las pierdes.**",
        },
        {
          tipo: "tabla",
          columnas: ["Cargas", "Furia", "Daño directo"],
          filas: [
            ["0-9", "No sale", "8-17"],
            ["10", "9,6 %", "18"],
            ["15", "13,5 %", "23"],
            ["20", "17,3 %", "28"],
            ["25", "21,1 %", "33"],
            ["30", "25 %", "38"],
          ],
          pie: "Sin Suerte. Con menos de 10 cargas no hay Furia; de 10 a 30 cargas sube del 9,6 al 25 %.",
        },
        {
          tipo: "nota",
          estilo: "consejo",
          titulo: "Tiro cargado",
          texto:
            "Lanza 30 veces sin recoger nada, recoge las 30 copias y haz el **tiro cargado**. Las copias duran 2 minutos, así que hazlo en una pelea larga o cerca de donde caen.",
        },
        {
          tipo: "nota",
          estilo: "nota",
          titulo: "Furia del Abismo",
          texto:
            "Solo con **10 cargas o más**, una tirada por lanzamiento. Si sale, el objetivo y todo lo que alcance la onda (radio 5) reciben **150 de daño verdadero**: ignora armadura, resistencias y la invulnerabilidad tras un golpe. A los **jefes** les quita el **6 % de su vida** (como mucho 150). Los tridentes fabricados antes de la 1.6 siguen mostrando los valores viejos en su descripción, pero hacen el daño nuevo. Se ve con anillos púrpura y un aviso en la barra de acción.",
        },
        { tipo: "p", texto: "**Suerte marina**" },
        {
          tipo: "p",
          texto:
            "Tu **Suerte** también sube la Furia: **+4 % por cada punto entero de Suerte**, sumado a tus cargas. **Nunca pasa del 35 %.**",
        },
        {
          tipo: "lista",
          items: [
            "**Poción de suerte marina**: Suerte II durante 3 minutos → **+8 %**.",
            "Árbol de combate: cada nodo da +0,25; con 4 nodos tienes +1 (+4 %) y con los 8, +2 (+8 %).",
            "Ejemplo: 30 cargas + poción = 33 %. Con los 8 nodos, el tope: 35 %.",
          ],
        },
        {
          tipo: "recetas",
          items: [
            {
              nombre: "Poción de suerte marina",
              estacion: "Sin forma",
              ingredientes: [
                "Frasco de cristal",
                "Caparazón de nautilo",
                "Cristales de prismarina",
                "Cristales de prismarina",
                "Pata de conejo",
              ],
              pie: "Bébela antes del tiro cargado.",
            },
          ],
        },
        { tipo: "p", texto: "**Multidisparo**" },
        {
          tipo: "definiciones",
          items: [
            { termino: "Multidisparo I", texto: "Lanzas **2 tridentes** a la vez." },
            {
              termino: "Multidisparo II",
              texto: "Lanzas **3 tridentes**. Se consigue uniendo dos libros de Multidisparo I.",
            },
            {
              termino: "Copias extra",
              texto: "Golpean y explotan como la principal, pero **no dan cargas ni Furia**.",
            },
          ],
        },
        {
          tipo: "nota",
          estilo: "importante",
          texto:
            "El Multidisparo solo se le pone en el **Yunque del Abismo** (6.6). El tridente **no acepta encantamientos de estado**.",
        },
      ],
    },
    {
      id: "6.4",
      titulo: "Arco de la Maldición Eterna",
      bloques: [
        {
          tipo: "p",
          texto: "Mejora de la Ira del desierto (Cataclysm) · “Nunca se rompe.”",
        },
        {
          tipo: "estadisticas",
          items: [
            { etiqueta: "Daño", valor: "20" },
            { etiqueta: "Tipo de daño", valor: "Daño verdadero" },
            { etiqueta: "Cadencia", valor: "1 disparo/s" },
          ],
        },
        {
          tipo: "p",
          texto:
            "La base es la **Ira del desierto**: se fusiona un **Arco maldito** con una **Tormenta de arena en un frasco** en el **Yunque de fusión mecánica**. Son cuatro pasos:",
        },
        {
          tipo: "recetas",
          items: [
            {
              nombre: "Arco maldito",
              estacion: "Mesa de crafteo",
              forma: [
                [null, "Lingote de cursio", "Hilo"],
                ["Lingote de cursio", null, "Hilo"],
                [null, "Lingote de acero negro", "Hilo"],
              ],
            },
            {
              nombre: "Yunque de fusión mecánica",
              estacion: "Mesa de crafteo",
              forma: [
                ["Lingote de witherita", "Lingote de witherita", "Lingote de witherita"],
                ["Bloque de redstone", "Yunque", "Bloque de redstone"],
                ["Lingote de witherita", "Lingote de witherita", "Lingote de witherita"],
              ],
            },
            {
              nombre: "Ira del desierto",
              estacion: "Yunque de fusión mecánica",
              forma: [["Arco maldito", "Tormenta de arena en un frasco"]],
              pie: "Fusión en el yunque de fusión mecánica.",
            },
            {
              nombre: "Arco de la Maldición Eterna",
              estacion: "Mesa de crafteo",
              forma: [
                ["Lingote de enderita", "Blazing Eye", "Lingote de enderita"],
                ["Lingote de cursio", "Ira del desierto", "Lingote de cursio"],
                ["Lingote de enderita", "Blazing Eye", "Lingote de enderita"],
              ],
              pie: "Irrompible.",
            },
          ],
        },
        { tipo: "p", texto: "**Cómo funciona**" },
        {
          tipo: "definiciones",
          items: [
            {
              termino: "Rayo de energía",
              texto:
                "Dispara un **rayo instantáneo** (sin flecha ni caída) de hasta **80 bloques**. Dispara una vez por segundo; si lo intentas antes, oyes un siseo.",
            },
            {
              termino: "Si da a una criatura",
              texto:
                "**20 de daño verdadero**: ignora la armadura, los encantamientos de protección, los escudos, la Resistencia y la invulnerabilidad tras un golpe. Cae un **relámpago** sobre ella.",
            },
            {
              termino: "Poder",
              texto:
                "Cada nivel de Poder suma **+3 de daño** que sí cuenta la armadura, además de los 20 de daño verdadero.",
            },
            { termino: "Encantamientos de estado", texto: "Los aplica en **cada impacto** (lista en 6.6)." },
            {
              termino: "Si da en un bloque",
              texto:
                "**Explota en área** (radio 5, 20 de daño), sin romper bloques, y también cae un relámpago. El fuego del relámpago se apaga solo.",
            },
            {
              termino: "Qué atraviesa",
              texto:
                "Hierba, flores, cultivos, agua, lava, nieve fina, antorchas, telarañas, carteles, raíles, escaleras de mano y otros bloques no sólidos. Se detiene en los bloques sólidos.",
            },
            {
              termino: "A quién no daña",
              texto:
                "Ni el rayo ni su explosión dañan a jugadores ni a mascotas con dueño; tampoco a aldeanos, comerciantes, gólems de hierro y de nieve, lobos, gatos, loros, caballos, burros, mulas, llamas, allays, ciudadanos de MineColonies ni perros de Doggy Talents.",
            },
            {
              termino: "Relámpago seguro",
              texto:
                "Si hay un jugador justo al lado del punto del impacto, el relámpago no cae (solo suena), para no herirlo.",
            },
          ],
        },
      ],
    },
  ],
};
