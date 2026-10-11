import type { Seccion } from "../tipos";

// Datos de L_Ender's Cataclysm 1.21.1-3.33 (loot tables, recetas y estructuras del jar) y de
// config/cataclysm-common.toml del pack. La vida base sale de las constantes del jar.

export const seccion10: Seccion = {
  id: "10",
  titulo: "Progresión de Cataclysm",
  resumen:
    "Todo L_Ender's Cataclysm en orden: estructuras, cómo empieza cada pelea, vida, qué suelta cada jefe y qué se fabrica con ello.",
  intro: [
    {
      tipo: "p",
      texto:
        "**L_Ender's Cataclysm** tiene **8 jefes** (Remanente Antiguo, Maledictus, Monstruosidad de Netherita, Ignis, El Heraldo, El Leviatán, Scylla y Guardián Ender), varios minijefes y sus propias armas y armaduras. Esta sección los pone en orden. Dónde está cada jefe y la receta de cada ojo de búsqueda están en **4.2** y **4.3**; aquí va lo que necesitas para llegar a cada uno y lo que desbloquea.",
    },
    {
      tipo: "nota",
      estilo: "importante",
      titulo: "En este pack",
      texto:
        "Los 8 jefes y el Pinzardián tienen **+50 % de vida**. El daño es el normal. Cada jefe tiene además un **tope de daño por golpe** y otro **por segundo**: pegar más fuerte que el tope no sirve, mejor golpes constantes. La primera vez que matas a cada jefe sale un aviso en el chat para todos y ganas **500 de experiencia** (cuenta quien da el golpe final).",
    },
  ],
  subsecciones: [
    {
      id: "10.1",
      titulo: "Orden recomendado",
      bloques: [
        {
          tipo: "p",
          texto:
            "El orden sale de lo que pide cada jefe para empezar y de lo que necesitas de los anteriores. Puedes saltarte alguno, pero así cada pelea te da lo que hace falta para la siguiente.",
        },
        {
          tipo: "diagrama",
          titulo: "Progresión de Cataclysm",
          etapas: [
            {
              titulo: "Overworld temprano",
              nodos: [
                { nombre: "Acero negro", icono: "Lingote de acero negro", detalle: "Draugrs y ruinas abandonadas (nieve)" },
                { nombre: "Aptrgangr", icono: "Llave extraña", detalle: "Minijefe de la Prisión helada: suelta la Llave extraña" },
                { nombre: "Kobolediador y Wadjet", icono: "Lingote de metal antiguo", detalle: "Desierto: metal antiguo" },
              ],
            },
            {
              titulo: "Jefes del Overworld",
              nodos: [
                { nombre: "Remanente Antiguo", icono: "Tormenta de arena en un frasco", detalle: "Collar del desierto · 675 PV" },
                { nombre: "Maledictus", icono: "Lingote de cursio", detalle: "Llave extraña · 630 PV" },
              ],
            },
            {
              titulo: "Nether",
              nodos: [
                { nombre: "Monstruosidad de Netherita", icono: "Cuerno monstruoso", detalle: "Herrería de almas · 900 PV" },
                { nombre: "Ignis", icono: "Lingote de ignitio", detalle: "Cenizas ardientes en el altar · 675 PV" },
              ],
            },
            {
              titulo: "Después del Wither",
              nodos: [
                { nombre: "El Heraldo", icono: "Lingote de witherita", detalle: "Estrella del Nether · 585 PV" },
                { nombre: "Yunque de fusión mecánica", icono: "Yunque de fusión mecánica", detalle: "Desbloquea las fusiones" },
              ],
            },
            {
              titulo: "Océano",
              nodos: [
                { nombre: "El Leviatán", icono: "Sacrificio abisal", detalle: "Sacrificio abisal · 600 PV" },
                { nombre: "Pinzardián", icono: "Garra de quitina", detalle: "Acrópolis · 337 PV" },
                { nombre: "Scylla", icono: "Esencia de la tormenta", detalle: "Acrópolis · 585 PV" },
              ],
            },
            {
              titulo: "End",
              nodos: [
                { nombre: "Gólem de ender", icono: "Núcleo del vacío", detalle: "Siempre suelta un núcleo del vacío" },
                { nombre: "Guardián Ender", icono: "Guantelete de la guardia", detalle: "Altar del vacío · 500 PV" },
              ],
            },
            {
              titulo: "Arsenal definitivo",
              nodos: [
                { nombre: "Enderita y Yunque del Abismo", icono: "Lingote de enderita", detalle: "Recetas del pack (6)" },
                { nombre: "Arsenal definitivo", icono: "Filo del Juicio", detalle: "5 objetos irrompibles", destacado: true },
              ],
            },
          ],
          pie: "PV = vida en este pack (base +50 %).",
        },
        {
          tipo: "tabla",
          columnas: ["Etapa", "Jefes", "Por qué aquí"],
          filas: [
            ["1 · Overworld temprano", "Minijefes", "Los ojos de búsqueda del Overworld solo piden materiales normales. El acero negro da el Arco maldito y el molde de cursio."],
            ["2 · Overworld", "Remanente Antiguo, Maledictus", "Sus materiales mejoran la netherita: conviene tenerla, pero se pueden hacer antes."],
            ["3 · Nether", "Monstruosidad de Netherita, Ignis", "Sus ojos piden chatarra de netherita. El ignitio es la base del arsenal."],
            ["4 · Después del Wither", "El Heraldo", "Se despierta con una Estrella del Nether. Su witherita hace el Yunque de fusión mecánica."],
            ["5 · Océano", "El Leviatán, Pinzardián, Scylla", "El Sacrificio abisal es caro (5 bloques de mineral y un corazón del mar). Scylla va después del Pinzardián."],
            ["6 · End", "Gólem de ender, Guardián Ender", "El ojo del vacío pide caparazones de shulker de las ciudades del End."],
          ],
        },
      ],
    },
    {
      id: "10.2",
      titulo: "Estructuras",
      bloques: [
        {
          tipo: "tabla",
          columnas: ["Estructura", "Dónde", "Qué hay"],
          filas: [
            ["**Pirámide maldita**", "Desierto", "Remanente Antiguo, arena sospechosa con el Collar del desierto"],
            ["**Prisión helada**", "Llanuras nevadas", "Aptrgangr, Puerta sellada y Maledictus. Cofres con acero negro y diamantes"],
            ["**Fábrica antigua**", "Bajo tierra (hacia Y = −30)", "El Heraldo, El merodeador y El observador. Tiene un EMP"],
            ["**Ciudad hundida**", "Océanos profundos", "El Leviatán y su Altar del abismo"],
            ["**Acrópolis**", "Océano cálido, **flotando en el cielo** (Y ≈ 200)", "Scylla, Pinzardián y criaturas que sueltan lácrima"],
            ["**Herrería de almas**", "Nether", "Monstruosidad de Netherita"],
            ["**Arena ardiente**", "Nether (eriales)", "Ignis, su Altar del fuego y 2 Renacidos ignífugos"],
            ["**Ciudadela en ruinas**", "End (tierras altas y medias)", "Guardián Ender, Gólem de ender y el Altar del vacío"],
            ["**Nido de amatista**", "Cuevas frondosas", "Cangrejo de amatista y el Altar de la amatista"],
            ["**Ruinas abandonadas** (aguja, templo, aldea)", "Llanuras nevadas", "Draugrs y cofres con acero negro"],
            ["**Estructuras del desierto**", "Desierto", "Koboletons, Kobolediador y Wadjet"],
          ],
          pie: "Cada estructura de jefe se encuentra con su ojo de búsqueda (recetas en 4.2): se lanza como un ojo de ender.",
        },
      ],
    },
    {
      id: "10.3",
      titulo: "Los jefes, uno por uno",
      bloques: [
        {
          tipo: "barras",
          titulo: "Vida de los jefes en este pack",
          unidad: "PV",
          items: [
            { etiqueta: "Monstruosidad de Netherita", valor: 900, detalle: "base 600" },
            { etiqueta: "Remanente Antiguo", valor: 675, detalle: "base 450" },
            { etiqueta: "Ignis", valor: 675, detalle: "base 450" },
            { etiqueta: "Maledictus", valor: 630, detalle: "base 420" },
            { etiqueta: "El Leviatán", valor: 600, detalle: "base 400" },
            { etiqueta: "El Heraldo", valor: 585, detalle: "base 390" },
            { etiqueta: "Scylla", valor: 585, detalle: "base 390" },
            { etiqueta: "Guardián Ender", valor: 500, texto: "499,5 PV", detalle: "base 333" },
            { etiqueta: "Pinzardián", valor: 338, texto: "337,5 PV", detalle: "base 225" },
            { etiqueta: "Gólem de ender", valor: 150, detalle: "sin cambios" },
          ],
          pie: "2 PV = 1 corazón.",
        },
        { tipo: "p", texto: "**Objetos para empezar las peleas**" },
        {
          tipo: "objetos",
          items: [
            { nombre: "Collar del desierto", sale: "Arena sospechosa de la **Pirámide maldita**, con un pincel.", uso: "Despierta al Remanente Antiguo" },
            { nombre: "Llave extraña", sale: "El minijefe **Aptrgangr** de la Prisión helada (siempre).", uso: "Abre la Puerta sellada de Maledictus" },
            { nombre: "Cenizas ardientes", sale: "Los **Renacidos ignífugos** de la Arena ardiente; después, 4 brasas moribundas.", uso: "Invoca a Ignis en el Altar del fuego" },
            { nombre: "Estrella del Nether", sale: "**El Wither**.", uso: "Despierta a El Heraldo" },
            { nombre: "Sacrificio abisal", sale: "Receta (abajo) con un **Athame** y bloques de mineral.", uso: "Invoca al Leviatán en el Altar del abismo" },
            { nombre: "Athame", sale: "**Deepling sacerdote** y **Deepling brujo** (siempre), en océanos profundos.", uso: "Sacrificio abisal" },
          ],
        },
        { tipo: "p", texto: "**Remanente Antiguo**" },
        {
          tipo: "definiciones",
          items: [
            { termino: "Cómo empieza", texto: "Excava con el **pincel** la arena sospechosa de la Pirámide maldita hasta sacar el **Collar del desierto**: despierta al Remanente." },
            { termino: "Pelea", texto: "Cargas, pisotones, terremotos, estelas de arena y barridos de cola. Tope: 21 por golpe y 14 por segundo. Rompe bloques. Puede volver a aparecer." },
            { termino: "Suelta", texto: "**Tormenta de arena en un frasco**, **Bloque de metal antiguo** (9 lingotes), Calavera del remanente y un disco (10 %)." },
            { termino: "Desbloquea", texto: "Lanza antigua, armadura de reptil óseo (con piezas de koboleton), Ira del desierto y Guantelete del torbellino (fusiones). En el pack: Rompemundos y equipo de clase de nivel 2." },
          ],
        },
        { tipo: "p", texto: "**Maledictus**" },
        {
          tipo: "definiciones",
          items: [
            { termino: "Cómo empieza", texto: "Mata al **Aptrgangr** de la Prisión helada: suelta la **Llave extraña**, que abre la **Puerta sellada**. Detrás, la **Lápida maldita** invoca a Maledictus." },
            { termino: "Pelea", texto: "Cambia entre maza, alabarda y arco; lanza alabardas y flechas fantasma y golpes en área que escalan con tu vida máxima. Tope: 20 por golpe y 13 por segundo." },
            { termino: "Suelta", texto: "**3 o 4 lingotes de cursio** y un disco (10 %)." },
            { termino: "Desbloquea", texto: "Arco maldito, El aniquilador, Alabarda de alma, armadura de cursio y El inmolador. En el pack: Filo del Juicio, Arco de la Maldición Eterna y Yunque del Abismo." },
          ],
        },
        { tipo: "p", texto: "**Monstruosidad de Netherita**" },
        {
          tipo: "definiciones",
          items: [
            { termino: "Cómo empieza", texto: "Duerme en la Herrería de almas y se despierta al acercarte." },
            { termino: "Pelea", texto: "Aplasta, lanza bombas de lava (las recarga absorbiendo lava, que además la cura), chorros de fuego y bengalas. Por debajo de un tercio de vida se enfurece. Su cuerpo es sólido. Tope: 25 por golpe y 20 por segundo." },
            { termino: "Suelta", texto: "**Forja infernal**, **Cuerno monstruoso**, **16 a 24 celdas de energía de lava** y un disco (10 %)." },
            { termino: "Desbloquea", texto: "Yelmo monstruoso, Forja del vacío y Brontes. En el pack: Rompemundos y Netherita templada (cuerno o celda)." },
          ],
        },
        { tipo: "p", texto: "**Ignis**" },
        {
          tipo: "definiciones",
          items: [
            { termino: "Cómo empieza", texto: "Pon **Cenizas ardientes** en el **Altar del fuego** de la Arena ardiente. Las primeras las sueltan los 2 **Renacidos ignífugos** de la arena; después se fabrican con 4 brasas moribundas." },
            { termino: "Pelea", texto: "Fases con escudo (rómpelo) y armadura, golpes que escalan con tu vida máxima, Marca ardiente (derrite la armadura), robo de vida y bolas de fuego. Tope: 20 por golpe y 14 por segundo. No reaparece solo: se vuelve a invocar con más cenizas." },
            { termino: "Suelta", texto: "**3 lingotes de ignitio** y un disco (10 %)." },
            { termino: "Desbloquea", texto: "El incinerador, Baluarte de la llama, Guantes llameantes y armadura de ignitio. En el pack: casi todo el arsenal definitivo y la Netherita templada." },
          ],
        },
        { tipo: "p", texto: "**El Heraldo**" },
        {
          tipo: "definiciones",
          items: [
            { termino: "Cómo empieza", texto: "Está apagado en la Fábrica antigua: **dale una Estrella del Nether** (del Wither) para despertarlo." },
            { termino: "Pelea", texto: "Vuela y alterna láseres y misiles; cada cuarta habilidad es el **Láser de la muerte**. El **EMP** de la fábrica lo aturde. A media vida se vuelve inmune a las flechas. Tope: 22 por golpe y 14 por segundo." },
            { termino: "Suelta", texto: "**Bloque de witherita** (9 lingotes) y un disco (10 %)." },
            { termino: "Desbloquea", texto: "**Yunque de fusión mecánica**, Gatling láser, Trituradora de carne y Asalto de hombro del wither. En el pack: armadura del Último Amanecer." },
          ],
        },
        { tipo: "p", texto: "**El Leviatán**" },
        {
          tipo: "definiciones",
          items: [
            { termino: "Cómo empieza", texto: "Pon el **Sacrificio abisal** (receta abajo) en el **Altar del abismo** de la Ciudad hundida." },
            { termino: "Pelea", texto: "**Es inmune fuera del agua**: pelea sumergido (respiración acuática, Conductos, pociones). Mordiscos, embestidas, tentáculos, rayo del abismo, minas y grietas. Sus efectos de terror y quemadura abisal se evitan con la carne de cangrejo bendecida. Tope: 20 por golpe y 15 por segundo." },
            { termino: "Suelta", texto: "**Garras de la marea**, **Huevo abisal** (mascota) y un disco (10 %). Al morir empiezan a aparecer Gólems de coral en el océano." },
          ],
        },
        { tipo: "p", texto: "**Scylla**" },
        {
          tipo: "definiciones",
          items: [
            { termino: "Cómo empieza", texto: "Vive en lo alto de la Acrópolis. Mata antes al **Pinzardián** (minijefe de la misma estructura)." },
            { termino: "Pelea", texto: "Cambia el tiempo a tormenta; lanza de agua, rayos, serpientes de tormenta, ancla y giros. Tope: 21 por golpe y 13 por segundo." },
            { termino: "Suelta", texto: "**8 a 16 lácrimas**, **3 o 4 esencias de la tormenta** y un disco (10 %). El Pinzardián suelta una **Garra de quitina** y 5 a 8 lácrimas." },
            { termino: "Desbloquea", texto: "Astrape, Ceraunus y Brontes. En el pack: Tridente del Abismo." },
          ],
        },
        { tipo: "p", texto: "**Guardián Ender**" },
        {
          tipo: "definiciones",
          items: [
            { termino: "Cómo empieza", texto: "El **Altar del vacío** de la Ciudadela en ruinas lo invoca cuando te acercas. En la ciudadela también está el **Gólem de ender**, que siempre suelta un núcleo del vacío." },
            { termino: "Pelea", texto: "Atrae y empuja con gravedad, puñetazos cohete, teletransporte, runas del vacío. A media vida se le rompe el casco y pierde la mitad de su defensa. Rompe bloques. Armadura 20. Tope: 22 por golpe y 13 por segundo." },
            { termino: "Suelta", texto: "**Guantelete de la guardia** y un disco (10 %)." },
            { termino: "Desbloquea", texto: "Guantelete de baluarte y Guantelete del torbellino (fusiones)." },
          ],
        },
        {
          tipo: "recetas",
          items: [
            {
              nombre: "Sacrificio abisal",
              estacion: "Sin forma",
              ingredientes: [
                "Caparazón de nautilo",
                "Athame",
                "Coral cristalizado",
                "Bloque de diamante",
                "Corazón del mar",
                "Bloque de esmeralda",
                "Bloque de hierro",
                "Bloque de amatista",
                "Bloque de oro",
              ],
              pie: "El **Athame** lo sueltan siempre los Deepling sacerdote y brujo (océanos profundos). En lugar del coral cristalizado sirve un **Pedazo de coral** del Coralssus.",
            },
            {
              nombre: "Cenizas ardientes",
              estacion: "Mesa de crafteo",
              forma: [
                ["Brasa moribunda", "Brasa moribunda"],
                ["Brasa moribunda", "Brasa moribunda"],
              ],
              pie: "Las brasas las sueltan los Berserkers ignífugos, que aparecen en las fortalezas del Nether después de matar a Ignis.",
            },
          ],
        },
      ],
    },
    {
      id: "10.4",
      titulo: "Minijefes y criaturas",
      bloques: [
        {
          tipo: "tabla",
          columnas: ["Criatura", "Vida", "Dónde", "Suelta"],
          filas: [
            ["**Aptrgangr**", "160", "Prisión helada", "**Llave extraña**, acero negro (lingotes y pepitas), huesos"],
            ["**Gólem de ender**", "150", "Ciudadela en ruinas", "**Núcleo del vacío** (siempre)"],
            ["**Renacido ignífugo**", "80", "Arena ardiente", "**Cenizas ardientes**"],
            ["**Berserker ignífugo**", "65", "Fortalezas del Nether, tras Ignis", "Brasas moribundas"],
            ["**Kobolediador**", "180", "Desierto", "Calavera de kobolediador, huesos de koboleton, 1 a 3 lingotes de metal antiguo"],
            ["**Wadjet**", "150", "Desierto", "2 a 4 lingotes de metal antiguo"],
            ["**Koboleton**", "25", "Desierto, sabana y badlands", "Huesos de koboleton; a veces metal antiguo. Puede robarte el objeto de la mano"],
            ["**Draugr**", "28-32", "Ruinas abandonadas", "Pepitas de acero negro; lingote al 2,5 %"],
            ["**Cangrejo de amatista**", "200", "Nido de amatista", "Carne y caparazón de cangrejo de amatista"],
            ["**El merodeador**", "160", "Fábrica antigua", "Redstone y hierro"],
            ["**Deepling sacerdote / brujo**", "45", "Océanos profundos", "**Athame** (siempre) y caparazón de nautilo"],
            ["**Gólem de coral**", "110", "Océano, tras el Leviatán", "Fragmentos de coral cristalizados"],
          ],
        },
        {
          tipo: "definiciones",
          items: [
            { termino: "Altar de la amatista", detalle: "Nido de amatista", texto: "Bendice la carne de cangrejo de amatista. La **carne bendecida** te hace inmune a la oscuridad y al terror y la quemadura abisales del Leviatán." },
            { termino: "EMP", detalle: "Fábrica antigua", texto: "Se carga solo y aturde al Heraldo (salvo durante el Láser de la muerte)." },
            { termino: "Regenerador de jefes", detalle: "Estructuras", texto: "Vuelve a invocar al Guardián, la Monstruosidad, el Heraldo, el Remanente y Scylla en su estructura." },
          ],
        },
      ],
    },
    {
      id: "10.5",
      titulo: "Armas y armaduras de Cataclysm",
      bloques: [
        {
          tipo: "p",
          texto:
            "Las armas de Cataclysm también son buenas por sí solas, y varias son la base del arsenal definitivo. Las del Incinerador, el Arco maldito, la armadura de ignitio y el Yunque de fusión mecánica están en la sección 6.",
        },
        { tipo: "p", texto: "**Acero negro y cursio**" },
        {
          tipo: "recetas",
          items: [
            {
              nombre: "Escudo de acero negro",
              estacion: "Mesa de crafteo",
              forma: [
                ["Pepita de acero negro", "Tablones de roble", "Pepita de acero negro"],
                ["Tablones de roble", "Lingote de acero negro", "Tablones de roble"],
                ["Pepita de acero negro", "Tablones de roble", "Pepita de acero negro"],
              ],
              pie: "Sirve cualquier tablón. También hay espada, pico, hacha, pala y azada de acero negro.",
            },
            {
              nombre: "Molde de mejora de cursio",
              estacion: "Mesa de crafteo",
              forma: [
                ["Lingote de oro", "Lingote de oro", "Lingote de oro"],
                ["Lingote de acero negro", "Plantilla de mejora de netherita", "Lingote de acero negro"],
                ["Lingote de oro", "Lingote de oro", "Lingote de oro"],
              ],
            },
            {
              nombre: "Armadura de cursio",
              estacion: "Mesa de herrería",
              forma: [["Molde de mejora de cursio", "Peto de netherita", "Lingote de cursio"]],
              resultado: "Peto de cursio",
              pie: "Igual con el casco, las grebas y las botas. El peto te revive una vez con 5 de vida; el casco ve criaturas a través de las paredes.",
            },
            {
              nombre: "El aniquilador",
              estacion: "Mesa de crafteo",
              forma: [
                [null, "Lingote de cursio"],
                [null, "Lingote de cursio"],
                [null, "Lingote de acero negro"],
              ],
              pie: "Fusionado con un lingote de ignitio da **El inmolador**.",
            },
            {
              nombre: "Alabarda de alma",
              estacion: "Mesa de crafteo",
              forma: [
                ["Lingote de cursio", "Lingote de cursio"],
                ["Lingote de cursio", "Lingote de acero negro"],
                [null, "Lingote de acero negro"],
              ],
            },
          ],
        },
        { tipo: "p", texto: "**Metal antiguo e ignitio**" },
        {
          tipo: "recetas",
          items: [
            {
              nombre: "Lanza antigua",
              estacion: "Mesa de crafteo",
              forma: [
                [null, "Lingote de metal antiguo", null],
                [null, "Lingote de metal antiguo", "Lingote de metal antiguo"],
                ["Lingote de metal antiguo", null, null],
              ],
              pie: "Clic izquierdo: dispara una tormenta de arena.",
            },
            {
              nombre: "Baluarte de la llama",
              estacion: "Mesa de crafteo",
              forma: [
                ["Ladrillo del Nether", "Lingote de ignitio", "Ladrillo del Nether"],
                ["Vara de blaze", "Escudo", "Vara de blaze"],
                ["Ladrillo del Nether", "Lingote de ignitio", "Ladrillo del Nether"],
              ],
              pie: "Escudo con embestida.",
            },
            {
              nombre: "Yelmo monstruoso",
              estacion: "Mesa de herrería",
              forma: [["Plantilla de mejora de netherita", "Casco de netherita", "Cuerno monstruoso"]],
              pie: "Por debajo de media vida empuja a todos y te da defensa y regeneración.",
            },
          ],
        },
        { tipo: "p", texto: "**Witherita y tormenta**" },
        {
          tipo: "recetas",
          items: [
            {
              nombre: "Gatling láser",
              estacion: "Mesa de crafteo",
              forma: [
                ["Polvo de redstone", "Lingote de hierro", null],
                ["Lingote de hierro", "Bloque de redstone", "Lingote de witherita"],
                [null, "Lingote de witherita", "Lingote de hierro"],
              ],
              pie: "Se recarga con redstone.",
            },
            {
              nombre: "Trituradora de carne",
              estacion: "Mesa de crafteo",
              forma: [
                [null, "Polvo de redstone", "Bloque de hierro"],
                [null, "Lingote de witherita", "Polvo de redstone"],
                ["Lingote de witherita", null, null],
              ],
              pie: "Ignora la invulnerabilidad tras un golpe.",
            },
            {
              nombre: "Asalto de hombro del wither",
              estacion: "Mesa de crafteo",
              forma: [
                ["Lingote de witherita", "Pólvora", null],
                ["Pólvora", "Bloque de redstone", "Pólvora"],
                [null, "Pólvora", "Lingote de witherita"],
              ],
              pie: "Lanza misiles; agachado, un obús. Con un núcleo del vacío se fusiona en el Asalto de hombro del vacío.",
            },
            {
              nombre: "Astrape",
              estacion: "Mesa de crafteo",
              forma: [
                [null, "Esencia de la tormenta", "Lácrima"],
                [null, "Lácrima", "Esencia de la tormenta"],
                ["Lácrima", null, null],
              ],
              pie: "Lanza de relámpagos.",
            },
            {
              nombre: "Ceraunus",
              estacion: "Mesa de crafteo",
              forma: [
                ["Esencia de la tormenta", "Lácrima", "Esencia de la tormenta"],
                [null, "Lácrima", null],
                [null, "Lácrima", null],
              ],
              pie: "Ancla; agachado, lanza olas.",
            },
          ],
        },
        { tipo: "p", texto: "**Fusiones en el Yunque de fusión mecánica**" },
        {
          tipo: "tabla",
          columnas: ["Base", "Añadido", "Resultado"],
          filas: [
            ["Arco maldito", "Tormenta de arena en un frasco", "**Ira del desierto** (base del arco definitivo)"],
            ["Peto de ignitio", "Élitros", "**Peto de ignitio con élitros**"],
            ["El aniquilador", "Lingote de ignitio", "**El inmolador**"],
            ["Forja infernal", "Astrape", "**Brontes** (pico arrojadizo con tormenta)"],
            ["Forja infernal", "Núcleo del vacío", "**Forja del vacío**"],
            ["Guantelete de la guardia", "Baluarte de la llama", "**Guantelete de baluarte**"],
            ["Guantelete de la guardia", "Tormenta de arena en un frasco", "**Guantelete del torbellino**"],
            ["Asalto de hombro del wither", "Núcleo del vacío", "**Asalto de hombro del vacío**"],
          ],
        },
        {
          tipo: "nota",
          estilo: "nota",
          titulo: "ProjectE",
          texto: "En este pack los materiales de jefe de Cataclysm **no tienen EMC**: no se pueden copiar con la mesa de transmutación.",
        },
      ],
    },
  ],
};
