import type { Seccion } from "../tipos";

export const seccion3: Seccion = {
  id: "3",
  titulo: "La infección",
  resumen:
    "Cómo nace y avanza la colmena, qué infectados manda, con qué herramientas cazarlos y qué pasa si te atrapa.",
  intro: [
    {
      tipo: "nota",
      estilo: "consejo",
      titulo: "Guía completa",
      texto: "La progresión completa de la colmena (fases, cada tipo de infectado, el equipo de Spore y el final de Spore Inquisition) está en la **sección 11**.",
    },
  ],
  subsecciones: [
    {
      id: "3.1",
      titulo: "Cómo empieza",
      bloques: [
        {
          tipo: "p",
          texto:
            "Al crear el mundo **no hay infección**. El servidor cuenta el tiempo de juego, pero **solo mientras hay al menos una persona conectada**.",
        },
        {
          tipo: "p",
          texto:
            "Con **12 horas** de juego acumulado con alguien conectado cae el **REDNIGHT** a **350-500 bloques del spawn**, en una de **8 direcciones**, nunca encima y evitando océanos y ríos, y nace la colmena. El chat avisa la distancia y la dirección: *“Algo cae del cielo a unos 420 bloques al noreste del spawn…”* Desde ahí la infección se extiende. Quien muere sin cama reaparece a **48 bloques del spawn**, lejos de la colmena.",
        },
        {
          tipo: "p",
          texto:
            "Tras el REDNIGHT, la **corrupción sube 1 punto por cada hora** de juego con gente conectada. Si no hay nadie, el contador se detiene, las zonas de la infección se descargan y el spawn no queda cargado: la colmena no crece sola.",
        },
        {
          tipo: "nota",
          estilo: "importante",
          texto: "Si ves **micelio** en el suelo, la infección ya llegó a esa zona.",
        },
        { tipo: "p", texto: "**Avisos de la colmena**" },
        {
          tipo: "p",
          texto:
            "Al llegar a ciertos puntos de corrupción, todo el servidor ve un aviso de **[La Colmena]** en el chat, con un latido:",
        },
        {
          tipo: "tabla",
          columnas: ["Corrupción", "Desde el REDNIGHT", "Aviso en el chat", "Qué cambia"],
          filas: [
            ["10", "≈ 10 h", "*“La tierra empieza a pudrirse. Algo se mueve bajo el suelo…”*", ""],
            ["25", "≈ 25 h", "*“El micelio avanza. Los animales huyen de los montículos.”*", ""],
            ["50", "≈ 50 h", "*“La colmena despierta. Pronto enviará a sus hijos.”*", ""],
            ["70", "≈ 70 h", "*“LA PRIMERA ORDALÍA SE ACERCA.”*", "Llegan los hiper-infectados y las hordas crecen"],
            ["140", "≈ 140 h", "*“La colmena crece. La segunda Ordalía está cerca.”*", "Hordas al máximo"],
            ["210", "≈ 210 h", "*“El cielo se oscurece. La tercera Ordalía llega.”*", ""],
            ["280", "≈ 280 h", "*“MEDIANOCHE. La última Ordalía ha comenzado.”*", ""],
          ],
          pie: "Los avisos de 70 a 280 todavía hablan de Ordalías, pero desde la 1.6 ya no hay Ordalías ni oleadas de vigías.",
        },
        {
          tipo: "nota",
          estilo: "importante",
          titulo: "Las hordas de la colmena",
          texto:
            "Cada 10 minutos, cada Proto Hivemind suelta infectados evolucionados: 1 de cada tipo, 2 desde los **70 puntos** y 3 desde los **140**; desde los 70 también los sueltan las Hivetumors. Los **hiper-infectados** (Inquisitor, Brot, Wendigo, Ogre y Hollen) llegan cada 20 minutos desde los **70 puntos**, y el doble desde los **140**. El evento final de Spore Inquisition, **Finalitas**, no se activa solo en este servidor: únicamente empieza si alguien hace una ofrenda con la corrupción al máximo. Ojo: las ofrendas a la colmena suben la corrupción de golpe (+25, +50 o +100).",
        },
      ],
    },
    {
      id: "3.2",
      titulo: "Los infectados",
      bloques: [
        {
          tipo: "p",
          texto:
            "Los infectados atacan a todo lo vivo y lo convierten en más infectados. Con el tiempo **evolucionan**: mátalos rápido. Si tienes el efecto **Infección de micelio**, retírate o puede matarte.",
        },
        {
          tipo: "tabla",
          columnas: ["Criatura", "Qué hace"],
          filas: [
            ["Humano infectado", "El infectado más común. Cuidado cuando vienen varios."],
            ["Montículo de carne", "Extiende la infección a su alrededor. Destrúyelo pronto."],
            [
              "Prototipo de mentecolmena\nProto Hivemind",
              "La mente de la colmena. Controla a los infectados de su zona. Matarla hace retroceder la zona infectada (3.6).",
            ],
          ],
        },
        {
          tipo: "p",
          texto:
            "Los infectados **no rompen bloques**, no abren puertas y sus explosiones no destruyen el terreno. Solo crecen las estructuras de la colmena, y solo dentro de su zona. Una Hivetumor tarda mucho en volver a ser una mente colmena: mátala antes.",
        },
      ],
    },
    {
      id: "3.3",
      titulo: "Herramientas contra la colmena",
      bloques: [
        {
          tipo: "p",
          texto:
            "Los restos de los infectados sirven para fabricar equipo. Estas tres herramientas son las más útiles para empezar a cazarlos.",
        },
        {
          tipo: "recetas",
          items: [
            {
              nombre: "Escáner",
              estacion: "Mesa de crafteo",
              forma: [
                ["Lámina de compuesto", "Lámina de compuesto", "Lámina de compuesto"],
                ["Observador", "Placa de circuitos", "Placa de circuitos"],
                [null, null, "Palanca"],
              ],
              pie: "Apunta a un infectado para ver su vida, su nivel de amenaza y cuánto le falta para evolucionar.",
            },
            {
              nombre: "Zoaholic",
              estacion: "Mesa de crafteo",
              forma: [
                ["Restos cerebrales", "Placa de circuitos", "Placa de circuitos"],
                ["Lingote de hierro", "Lingote de hierro", "Lingote de hierro"],
                ["Lingote de hierro", "UAMP (B.C.U.)", "Lingote de hierro"],
              ],
              pie: "Detecta anomalías de la colmena cerca de ti.",
            },
            {
              nombre: "Jeringa",
              estacion: "Mesa de crafteo",
              forma: [
                [null, null, "Pepita de hierro"],
                ["Pepita de hierro", "Frasco de cristal", null],
                [null, "Pepita de hierro", null],
              ],
              cantidad: 4,
              pie: "La base de las muestras de sangre de Spore.",
            },
          ],
        },
      ],
    },
    {
      id: "3.4",
      titulo: "El Sueño de la colmena",
      bloques: [
        {
          tipo: "pasos",
          items: [
            "Si te mata un infectado, hay un **10 %** de probabilidad de despertar en el **Sueño**, una dimensión de la colmena.",
            "Una barra morada, *“Sueño de la Colmena — despiertas en m:ss”*, muestra el tiempo que falta: **3 minutos**. Dentro tienes resistencia, regeneración y fatiga minera.",
            "30 segundos antes del final verás *“Sientes que el sueño se desvanece…”*.",
            "Al terminar despiertas en **tu cama** (o tu punto de reaparición). Si no tienes, en el spawn del mundo: *“Despiertas… la colmena te dejó ir… por ahora”*. Durante unos segundos ves oscuro y vas lento.",
          ],
        },
      ],
    },
    {
      id: "3.5",
      titulo: "Campeones de la colmena",
      bloques: [
        {
          tipo: "p",
          texto:
            "Desde los **25 puntos** de corrupción, de noche y **solo en el Overworld**, la colmena puede **coronar** a un infectado cercano como **campeón**: brilla, ruge y el chat avisa con su rango (*“La colmena ha coronado a … como campeón (rango 3).”*).",
        },
        {
          tipo: "p",
          texto:
            "Es un élite como los de la sección 2.2: más vida, más daño y afijos, pero mejor botín. Cuanta más corrupción, de más rango; desde los **140 puntos** también corona de día.",
        },
        {
          tipo: "p",
          texto:
            "Nunca corona a un campeón de más rango que el **nivel de amenaza** (sección 5) del jugador al que va a buscar, y no se lo manda a los novatos (3.8).",
        },
        {
          tipo: "tabla",
          columnas: ["Corrupción", "Campeón", "Cuándo"],
          filas: [
            ["25+", "Rango 1 o 2", "De noche"],
            ["70+", "Rango 2 o 3", "De noche"],
            ["140+", "Rango 3 o 4", "Noche y día"],
            ["210+", "Rango 4 o 5", "Noche y día"],
          ],
        },
      ],
    },
    {
      id: "3.6",
      titulo: "La zona infectada",
      bloques: [
        {
          tipo: "p",
          texto:
            "La infección ocupa un **círculo alrededor de la colmena** (donde cayó el REDNIGHT). Crece **10 bloques por cada hora de juego** con alguien conectado, hasta 3000 bloques de radio. En un mundo nuevo nace con 64 bloques.",
        },
        {
          tipo: "definiciones",
          items: [
            {
              termino: "Fuera de la zona",
              texto:
                "Los infectados que aparecen fuera se hunden en el suelo, y los que se alejan más de 32 bloques de la frontera desaparecen. Se salvan los de las **estructuras de Spore** (laboratorios, iglesias, hospital, prisión, minas…) y el infectado en que te conviertes al morir. Los montículos, Hivetumors y Proto Hiveminds que quedan fuera también se hunden.",
            },
            {
              termino: "Hacerla retroceder",
              texto:
                "Matar un **Proto Hivemind** la hace retroceder **25 bloques**, y una **Hivetumor**, **10**. Todo el servidor ve *“La colmena pierde fuerza”*.",
            },
            {
              termino: "Avisos",
              texto: "Al entrar o salir de la zona lo ves en la barra: *“☣ Entraste en la zona infectada”*.",
            },
            {
              termino: "Dónde",
              texto: "Solo en el Overworld. En el Nether y el End la infección funciona como siempre.",
            },
          ],
        },
      ],
    },
    {
      id: "3.7",
      titulo: "Bases protegidas",
      bloques: [
        {
          tipo: "p",
          texto:
            "Escribe `/trigger base` donde quieras tu base: en **48 bloques** a la redonda no puede haber infectados y los montículos se quitan hasta los 68 bloques, aunque la zona infectada llegue hasta ahí.",
        },
        {
          tipo: "lista",
          items: [
            "Cada jugador tiene una base: si marcas otra, se mueve.",
            "`/trigger base set 3` te la muestra, con la distancia a la frontera de la zona.",
            "`/trigger base set 2` la quita.",
            "No se puede marcar dentro de la zona infectada.",
          ],
        },
      ],
    },
    {
      id: "3.8",
      titulo: "Protección de novato",
      bloques: [
        {
          tipo: "p",
          texto:
            "Durante tus **primeras 5 horas de juego** no recibes los efectos de la infección, no te salen campeones (ni de la colmena ni de tu nivel de amenaza), nunca caes en el Sueño y el ECLIPSE no te elige. Los infectados normales sí te atacan.",
        },
        {
          tipo: "nota",
          estilo: "consejo",
          titulo: "Cuánto te queda",
          texto:
            "Escribe `/trigger novato` para ver los minutos que te quedan. Al terminar verás el título *“la colmena ya sabe de ti”*.",
        },
      ],
    },
  ],
};
