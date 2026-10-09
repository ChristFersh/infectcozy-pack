import type { Seccion } from "../tipos";

export const seccion2: Seccion = {
  id: "2",
  titulo: "Primeros pasos",
  resumen:
    "Lo básico para tus primeros días: la primera noche, los monstruos de élite, las lunas, qué pasa si caes, los cofres, las habilidades y la minería.",
  subsecciones: [
    {
      id: "2.1",
      titulo: "La primera noche",
      bloques: [
        {
          tipo: "pasos",
          items: [
            "Antes de que oscurezca, busca refugio y pon **antorchas** dentro y alrededor de tu base: la oscuridad hace aparecer monstruos.",
            "Duerme en una **cama** para guardar tu punto de reaparición: sin cama, reapareces a **48 bloques del spawn**. También es donde despiertas si la colmena te atrapa en el Sueño (3.4). Al dormir, además, se despeja la lluvia.",
            "Los primeros días, **no salgas de noche**. Los monstruos son más duros de lo normal.",
            "Fíjate en el aviso del chat al anochecer: algunas noches la luna cambia (2.3).",
          ],
        },
      ],
    },
    {
      id: "2.2",
      titulo: "Monstruos de élite (campeones)",
      bloques: [
        {
          tipo: "p",
          texto:
            "Algunos monstruos aparecen como **élite** o **campeón** (mod Champions): llevan nombre, un aura de color y uno o más **afijos**, habilidades extra. Pegan más fuerte y aguantan más, pero sueltan mejor botín: cuanto más alto el rango, más tiradas de botín. Si te cruzas con uno al principio, lo mejor es evitarlo.",
        },
        {
          tipo: "tabla",
          columnas: ["Rango", "Nombre", "Botín extra"],
          filas: [
            ["1", "Common (común)", "Lingote de hierro"],
            ["2", "Skilled (hábil)", "Lingote de oro"],
            ["3", "Elite (élite)", "Diamante o esmeralda"],
            ["4", "Legendary (legendario)", "2 diamantes"],
            ["5", "Ultimate (supremo)", "Chatarra de netherita o 3 diamantes"],
          ],
        },
        {
          tipo: "nota",
          estilo: "consejo",
          titulo: "Cuántos salen",
          texto:
            "Los campeones al azar del mod están apagados. Salen del **3 al 7 %** de los enemigos según tu **nivel de amenaza**, con un rango acorde a tu equipo (sección 5), y de noche la colmena corona a otros (3.5).",
        },
        {
          tipo: "nota",
          estilo: "importante",
          texto: "La explosión de un creeper élite crece con su rango.",
        },
        { tipo: "p", texto: "**Afijos de élite**" },
        {
          tipo: "tabla",
          columnas: ["En el juego", "Qué hace"],
          filas: [
            [
              "**Adaptable**\nAdaptable",
              "Cada golpe seguido del mismo tipo de daño le hace un 15 % menos, hasta un 90 %. Cambia de arma.",
            ],
            ["**Arctic**\nÁrtico", "Te dispara proyectiles de hielo cada 3 segundos."],
            [
              "**Dampening**\nAmortiguador",
              "Reduce hasta un 30 % el daño directo que recibe, como los golpes cuerpo a cuerpo.",
            ],
            ["**Desecrating**\nProfanador", "Cada 3 segundos deja una nube dañina donde estás (radio 4)."],
            ["**Enkindling**\nIncendiario", "Te dispara proyectiles de fuego cada 3 segundos."],
            ["**Hasty**\nVeloz", "+25 % de velocidad de movimiento."],
            ["**Infested**\nInfestado", "Suelta lepismas (endermitas si es una criatura del End)."],
            [
              "**Knocking**\nEmpujador",
              "Te empuja con mucha fuerza y te ralentiza, tanto si te golpea como si lo golpeas tú.",
            ],
            [
              "**Lively**\nVivaz",
              "Tras 3 s sin recibir daño se cura 1 de vida por segundo; mucho más si está tranquilo.",
            ],
            ["**Magnetic**\nMagnético", "Te atrae hacia él desde 16 bloques."],
            [
              "**Molten**\nFundido",
              "Prende fuego 4 s al golpear o ser golpeado y quema con un aura de 3 bloques.",
            ],
            ["**Paralyzing**\nParalizante", "Cada golpe tiene un 20 % de paralizarte 3 segundos."],
            ["**Plagued**\nApestado", "Aura de efectos negativos de 5 bloques de radio."],
            ["**Reflective**\nReflectante", "Te devuelve del 10 al 35 % del daño (máx. 8). Nunca te mata."],
            ["**Shielding**\nEscudado", "50 % de bloquear por completo un ataque."],
            ["**Wounding**\nHiriente", "Cada golpe tiene un 40 % de herirte durante 10 segundos."],
          ],
          pie: "Son los valores de la configuración del servidor. En algunos afijos, la fuerza de cada afijo los ajusta.",
        },
      ],
    },
    {
      id: "2.3",
      titulo: "Lunas peligrosas (y útiles)",
      bloques: [
        {
          tipo: "p",
          texto:
            "Algunas noches la luna cambia de color (mod Enhanced Celestials). El chat avisa al salir y al ponerse. En la **luna de sangre** quédate en casa con la puerta cerrada.",
        },
        {
          tipo: "tabla",
          columnas: ["Luna", "Qué cambia"],
          filas: [
            [
              "**Luna de sangre**",
              "×2,25 monstruos, que además aparecen en la superficie. No se puede dormir. 50 % de probabilidad de asedio a las aldeas.",
            ],
            [
              "**Superluna de sangre**",
              "×4,5 monstruos, también en la superficie. No se puede dormir. Asedio a las aldeas seguro.",
            ],
            [
              "**Luna azul**",
              "Experiencia ×2. Encantar y usar el yunque cuesta la mitad. Radio de los faros ×1,5. Te da Suerte I.",
            ],
            [
              "**Superluna azul**",
              "Experiencia ×4. Encantar y el yunque cuestan un 25 %. Radio de los faros ×2. Te da Suerte V.",
            ],
            ["**Luna de cosecha**", "Los cultivos dan el doble."],
            ["**Superluna de cosecha**", "Los cultivos dan ×4."],
            ["**Superluna**", "Aparecen slimes en cualquier sitio."],
          ],
          pie: "Las lunas normales dejan al menos 4 noches entre una y otra. Las superlunas solo salen en luna llena y con al menos 20 noches de separación.",
        },
      ],
    },
    {
      id: "2.4",
      titulo: "Si caes: herido, tumba y segunda oportunidad",
      bloques: [
        {
          tipo: "definiciones",
          items: [
            {
              termino: "Herido",
              detalle: "PlayerRevive",
              texto:
                "En vez de morir quedas **herido 60 segundos** (“Te desangrarás en…”): vas lento, no puedes saltar y los **monstruos no te atacan**, aunque otros daños sí. Un compañero a 3 bloques o menos te reanima **manteniendo clic derecho** sobre ti unos 5 segundos (entre varios, más rápido; no hace falta ningún objeto). Te levantas con 1 corazón. Si nadie viene, puedes rendirte manteniendo la tecla que indica la pantalla.",
            },
            {
              termino: "Tumba",
              detalle: "Corail Tombstone",
              texto:
                "Si mueres, aparece una tumba con tus cosas donde caíste. **Solo tú puedes abrirla**: no se desbloquea con el tiempo para los demás. La excepción: si te mata otro jugador, queda abierta.",
            },
            {
              termino: "Death Rewind",
              detalle: "Revive By Death",
              texto:
                "Libro encantado que te puede salvar de la muerte: el encantamiento guarda puntos de control mientras juegas y, al morir, te devuelve al último con una pequeña escena. Primero cuenta el estado de herido. Sale con un **18 %** en las bibliotecas de las fortalezas, las ciudades antiguas, los tesoros de las ciudades del End, los tesoros de los bastiones y las mansiones del bosque.",
            },
            {
              termino: "Vacío",
              detalle: "Forgiving Void",
              texto:
                "Si caes al vacío, vuelves al último suelo firme, pero recibes **19 de daño** y quedas ciego 3 segundos: con poca vida, te mata igual.",
            },
          ],
        },
        {
          tipo: "nota",
          estilo: "nota",
          texto: "Si te mata un infectado, puedes despertar en el Sueño de la colmena. Lee la sección 3.4.",
        },
      ],
    },
    {
      id: "2.5",
      titulo: "Cofres de botín y cofres con cerradura",
      bloques: [
        {
          tipo: "p",
          texto:
            "**Cofres de botín** (Lootr). Los cofres de las estructuras tienen **botín propio para cada jugador**: aunque un amigo lo haya abierto, tú encuentras el tuyo. No los rompas: si rompes uno (hay que agacharse para poder), los demás se quedan sin su botín.",
        },
        {
          tipo: "p",
          texto:
            "**Cofres con cerradura** (Clavis). Algunos cofres de mazmorras están cerrados. Con una **ganzúa** los abres jugando un minijuego: engranajes en el Overworld y espejos en el End. Cada golpe que recibes en el minijuego baja la calidad del botín; aunque pierdas, el cofre se abre, pero con peor botín. Tómate tu tiempo.",
        },
        {
          tipo: "recetas",
          items: [
            {
              nombre: "Ganzúa",
              estacion: "Mesa de crafteo",
              forma: [
                ["Lingote de cobre", "Lingote de cobre", null],
                ["Lingote de cobre", null, null],
                ["Lingote de cobre", null, null],
              ],
              resultado: "Lock Pick (ganzúa)",
              cantidad: 4,
              pie: "4 lingotes de cobre dan 4 ganzúas.",
            },
          ],
        },
      ],
    },
    {
      id: "2.6",
      titulo: "Árbol de habilidades",
      bloques: [
        {
          tipo: "p",
          texto:
            "Al jugar ganas **puntos de habilidad** para mejorar a tu personaje (mod Puffish Skills): más vida, más daño, más velocidad y otras mejoras. Abre el árbol con **K** y elige en qué gastarlos. Hay dos árboles:",
        },
        {
          tipo: "tabla",
          columnas: ["Combate · mejora", "Nodos"],
          filas: [
            ["+1 corazón", "18"],
            ["+0,5 % de resistencia", "25"],
            ["+1,5 % de daño cuerpo a cuerpo", "25"],
            ["+1,5 % de daño a distancia", "25"],
            ["+5 % de velocidad de ataque", "10"],
            ["+5 % de velocidad", "10"],
            ["+5 % de aguante", "10"],
            ["+5 % de salto", "10"],
            ["+0,25 de Suerte", "8"],
            ["+5 % de curación", "7"],
          ],
        },
        {
          tipo: "tabla",
          columnas: ["Minería · mejora", "Nodos"],
          filas: [
            ["+3 % de velocidad de minado", "69"],
            ["+0,1 de Fortuna", "16"],
          ],
        },
        {
          tipo: "p",
          texto:
            "**Combate**: ganas experiencia al matar criaturas (la que sueltan más su vida máxima / 20). Solo cuentan 15 muertes por chunk cada 5 minutos, así que las granjas de monstruos no sirven.",
        },
        { tipo: "p", texto: "**Minería**: ganas experiencia al picar bloques." },
        {
          tipo: "nota",
          estilo: "consejo",
          texto: "Revisa todo el árbol antes de gastar y planea a qué mejoras quieres llegar.",
        },
      ],
    },
    {
      id: "2.7",
      titulo: "Minar y talar",
      bloques: [
        {
          tipo: "definiciones",
          items: [
            {
              termino: "Wide Mining",
              texto:
                "Encantamiento para picos y palas (de madera a netherita): rompe un área de **3×3** de un golpe. Sale en la mesa de encantamientos, en cofres y con aldeanos. **Agáchate** mientras minas para romper un solo bloque.",
            },
            {
              termino: "Veinminer",
              texto:
                "Al romper un mineral con un pico, se rompe la veta conectada entera (hasta 100 bloques). Gasta durabilidad por cada bloque. Incluye las menas de los mods, y con **pala** las gravas con mineral.",
            },
            {
              termino: "TreeChop",
              texto:
                "Los árboles se talan por partes: tras suficientes hachazos cae el árbol entero y las hojas se deshacen solas.",
            },
            {
              termino: "Rompedor de piedra base",
              detalle: "Infect Cozy",
              texto:
                "Con **clic derecho**, apuntando a menos de 5 bloques, rompe **piedra base**. Tiene **16 usos**, no se repara y nunca rompe la capa del fondo del mundo. Su receta aparece al conseguir una estrella del Nether.",
            },
          ],
        },
        {
          tipo: "recetas",
          items: [
            {
              nombre: "Rompedor de piedra base",
              estacion: "Mesa de crafteo",
              forma: [
                ["Diamante", "Estrella del Nether", "Diamante"],
                [null, "Lingote de netherita", null],
                [null, "Palo", null],
              ],
              pie: "Funciona en el Overworld, el Nether y el End.",
            },
          ],
        },
      ],
    },
  ],
};
