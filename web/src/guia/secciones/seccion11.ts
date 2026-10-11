import type { Seccion } from "../tipos";

// Datos de Fungal Infection: Spore 2.2.0j y Spore Inquisition 4.5 (recetas, cofres y lang del jar),
// de config/spore-*.toml del pack y de sus datapacks infectcozy-*. Nombres: el es_mx del propio Spore.

export const seccion11: Seccion = {
  id: "11",
  titulo: "Progresión de la infección",
  resumen:
    "Fungal Infection: Spore de principio a fin: fases de la colmena, cada tipo de infectado, el equipo para contraatacar y el final de Spore Inquisition.",
  intro: [
    {
      tipo: "p",
      texto:
        "La infección es **Fungal Infection: Spore** con su addon **Spore Inquisition**, ajustados por el pack. La sección 3 explica cómo se vive en el día a día (zona, hordas, bases, novatos); aquí va la progresión completa: qué fases tiene, qué criaturas salen en cada una, cómo se fabrica el equipo para contraatacar y cómo se termina.",
    },
  ],
  subsecciones: [
    {
      id: "11.1",
      titulo: "Las fases de la colmena",
      bloques: [
        {
          tipo: "diagrama",
          titulo: "De mundo limpio a TÉLOS",
          etapas: [
            {
              titulo: "Antes del REDNIGHT",
              nodos: [
                { nombre: "Mundo limpio", icono: "Lámina de compuesto", detalle: "Solo hay estructuras de Spore con su botín" },
                { nombre: "Primer equipo", icono: "Escáner", detalle: "Escáner, Mesa de cirugía, UDC" },
              ],
            },
            {
              titulo: "REDNIGHT (12 h)",
              nodos: [
                { nombre: "REDNIGHT", icono: "Bloque de biomasa", detalle: "Cae a 350-500 bloques del spawn" },
                { nombre: "Montículos e infectados", icono: "Fibra mutada", detalle: "El micelio avanza" },
              ],
            },
            {
              titulo: "Evolucionados",
              nodos: [
                { nombre: "Evolucionados", icono: "Fragmentos de armadura", detalle: "Un infectado que mata y sobrevive 150 s evoluciona" },
                { nombre: "Armas de carne", icono: "Sable infectado", detalle: "Mesa de cirugía" },
              ],
            },
            {
              titulo: "Colmena",
              nodos: [
                { nombre: "Prototipo de mentecolmena", icono: "Restos cerebrales", detalle: "Organoides y hordas cada 10 min" },
                { nombre: "Organoides", icono: "El ojo del vigilante", detalle: "Vigilantes, Umarmer, Usurpadores…" },
              ],
            },
            {
              titulo: "Corrupción 70+",
              nodos: [
                { nombre: "Hiper-evolucionados", icono: "Tendones", detalle: "Hordas cada 20 min" },
                { nombre: "Calamidades", icono: "Corazón Amalgamado", detalle: "Útero con 100 de biomasa · ECLIPSE desde 275" },
              ],
            },
            {
              titulo: "Final",
              nodos: [
                { nombre: "Finalitas", icono: "Biomasa terrestre reforjada", detalle: "Ofrenda con la corrupción al máximo" },
                { nombre: "TÉLOS", icono: "Biomasa quemada por congelación", detalle: "La infección termina", destacado: true },
              ],
            },
          ],
        },
        {
          tipo: "tabla",
          columnas: ["Fase", "Cuándo", "Qué pasa"],
          filas: [
            ["**0 · Mundo limpio**", "Al empezar", "Solo hay estructuras de Spore (laboratorios, hospitales, iglesias, minas…) con sus propios infectados y cofres de equipo."],
            ["**1 · REDNIGHT**", "12 h de juego con alguien conectado", "Cae el REDNIGHT y nace la zona infectada (64 bloques de radio). Montículos de carne y humanos infectados."],
            ["**2 · Evolucionados**", "En cuanto un infectado mata", "Gana puntos de evolución y, si sobrevive 150 s, evoluciona. Uno de cada diez sale mal: un Scamper."],
            ["**3 · Colmena**", "Proto Hivemind", "Organoides alrededor del Proto. Cada 10 min cada Proto suelta un evolucionado de cada tipo (2 desde 70 de corrupción, 3 desde 140)."],
            ["**4 · Hiper**", "Corrupción **70**", "Cada 20 min cada Proto suelta hiper-evolucionados (el doble desde 140)."],
            ["**5 · Calamidades**", "Útero o ECLIPSE", "Un Útero con 100 de biomasa invoca una calamidad. Desde **275** de corrupción puede llegar el ECLIPSE."],
            ["**6 · Finalitas**", "Ofrenda a corrupción máxima", "Viaje a la dimensión final, cuatro guardianes y la pelea contra el REDNIGHT."],
          ],
        },
        {
          tipo: "barras",
          titulo: "Corrupción: qué pasa en cada punto",
          items: [
            { etiqueta: "10", valor: 10, texto: "Primer aviso", detalle: "«La tierra empieza a pudrirse…»" },
            { etiqueta: "25", valor: 25, texto: "Inquietud", detalle: "No puedes dormir · campeones de noche" },
            { etiqueta: "50", valor: 50, texto: "La colmena despierta" },
            { etiqueta: "70", valor: 70, texto: "Hiper-evolucionados", detalle: "Hordas de hiper cada 20 min" },
            { etiqueta: "80", valor: 80, texto: "Marcador", detalle: "Efecto cada hora" },
            { etiqueta: "140", valor: 140, texto: "Hordas dobles", detalle: "Campeones también de día" },
            { etiqueta: "160", valor: 160, texto: "Infección de micelio", detalle: "10 s cada hora" },
            { etiqueta: "240", valor: 240, texto: "Locura" },
            { etiqueta: "275", valor: 275, texto: "ECLIPSE posible" },
            { etiqueta: "320", valor: 320, texto: "Fase final", detalle: "Las voces callan" },
            { etiqueta: "396", valor: 396, texto: "Techo (99 %)", detalle: "Solo sube con ofrendas" },
          ],
          pie: "La corrupción sube **1 punto por hora** de juego con alguien conectado (máximo 400). Más o menos coincide con las horas desde el REDNIGHT.",
        },
      ],
    },
    {
      id: "11.2",
      titulo: "Los infectados por niveles",
      bloques: [
        {
          tipo: "p",
          texto:
            "El Escáner clasifica cada criatura por su peligro. De menos a más: **infectados** (bajo), **evolucionados** (medio-alto), **hiper-evolucionados** (muy alto) y **calamidades** («¡CORRE!»). Los **organoides** son las piezas de la colmena.",
        },
        { tipo: "p", texto: "**Infectados**" },
        {
          tipo: "tabla",
          columnas: ["Criatura", "Vida", "Viene de", "Evoluciona a"],
          filas: [
            ["Humano infectado", "15", "Mordiscos, montículos y el REDNIGHT", "Caballero, Griefer, Braiomil, Phayres, Acosador, Bruto, Jagdhund…"],
            ["Aldeano infectado", "20", "Aldeanos", "Atleta, Asesino, Escupidor"],
            ["Bruja infectada", "25", "Brujas", "Volátil, Mephitic, Gorgona"],
            ["Saqueador infectado", "20", "Saqueadores", "Aullador"],
            ["Vindicador / Evocador infectado", "28 / 35", "Illagers", "Axtwerfer / Hexenmeister (hiper)"],
            ["Ahogado infectado", "16", "Ahogados", "Hinchado, Náyade"],
            ["Aventurero infectado", "21", "**Jugadores** que mueren infectados", "Nuckelavee, Protector, Gárgola"],
            ["Garra", "15", "Casi cualquier **animal**", "—"],
          ],
          pie: "Los infectados aparecen en la oscuridad del Overworld (nunca en biomas fríos ni en la Oscuridad profunda). Su mordisco da **Infección de micelio**: si mueres con ella, te levantas como infectado.",
        },
        { tipo: "p", texto: "**Evolucionados**" },
        {
          tipo: "tabla",
          columnas: ["Criatura", "Vida", "Qué hace", "Suelta"],
          filas: [
            ["Caballero", "25", "Tanque cuerpo a cuerpo", "Fragmentos de armadura y de garra"],
            ["Griefer", "45", "Explota (aquí sin romper bloques)", "Tumor, tendones"],
            ["Braiomil", "25", "Nube de gas venenoso", "Colmillo, saco alveólico"],
            ["Phayres", "35", "Vuela; a veces kamikaze", "Membrana de ala"],
            ["Escupidor", "15", "Ácido a distancia", "Saco corrosivo"],
            ["Atleta / Asesino", "40 / 35", "Salta / cuchillas", "Tendones / fragmento de hoz"],
            ["Aullador", "32", "Llama refuerzos y los potencia", "—"],
            ["Acosador", "55", "Sigiloso", "Bazo alterado"],
            ["Bruto", "70", "Muy blindado (15 de armadura)", "Fragmentos de armadura"],
            ["Verdathorn", "40", "Cactus andante", "Espiga"],
            ["Protector", "50", "Escudo", "Fragmento de escudo"],
            ["Embriagador", "30", "Cura y potencia a los infectados: mátalo primero", "Tumor"],
          ],
        },
        { tipo: "p", texto: "**Hiper-evolucionados**" },
        {
          tipo: "barras",
          titulo: "Vida de los hiper-evolucionados",
          unidad: "PV",
          items: [
            { etiqueta: "Ogro", valor: 100, detalle: "del Bruto" },
            { etiqueta: "Axtwerfer", valor: 80, detalle: "del Vindicador infectado" },
            { etiqueta: "Hexenmeister", valor: 80, detalle: "del Evocador infectado" },
            { etiqueta: "Wendigo", valor: 75, detalle: "del Acosador · te quita la armadura" },
            { etiqueta: "Groberfub", valor: 75, detalle: "del Atleta" },
            { etiqueta: "Brotkatze", valor: 70, detalle: "del Braiomil · gas con wither" },
            { etiqueta: "Hollenhund", valor: 65, detalle: "del Jagdhund" },
            { etiqueta: "Inquisidor", valor: 60, detalle: "del Caballero · 15 de daño" },
          ],
          pie: "En este pack casi no evolucionan solos (hacen falta 700 muertes): llegan con las hordas desde 70 de corrupción.",
        },
        { tipo: "p", texto: "**Organoides**" },
        {
          tipo: "definiciones",
          items: [
            { termino: "Montículo de carne", detalle: "20 PV", texto: "Infecta el terreno a su alrededor (10 a 25 bloques según su edad) y crece. Destrúyelos pronto." },
            { termino: "Prototipo de mentecolmena", detalle: "100 PV", texto: "La mente de la colmena. **Como mucho 20 de daño por golpe**: mejor muchos golpes rápidos. Al morir deja un **Tumor Colmena** (50 PV) que vuelve a ser Proto a los 10 min. Matarlo hace retroceder la zona 25 bloques; el tumor, 10." },
            { termino: "Vigilante", detalle: "60 PV", texto: "Te vigila y llama a asaltos. Suelta **El ojo del vigilante**." },
            { termino: "Umarmer", detalle: "70 PV", texto: "Te agarra." },
            { termino: "Usurpador", detalle: "60 PV", texto: "Torreta a distancia." },
            { termino: "Verwahrung", detalle: "20 PV", texto: "Trae hiper-evolucionados." },
            { termino: "Delirante", detalle: "35 PV", texto: "Provoca alucinaciones." },
            { termino: "Útero", detalle: "30 PV", texto: "Junta biomasa (1 cada 30 s y 5 por cada infectado que absorbe). Con 100 **invoca una calamidad**." },
          ],
        },
        { tipo: "p", texto: "**Calamidades**" },
        {
          tipo: "barras",
          titulo: "Vida de las calamidades",
          unidad: "PV",
          items: [
            { etiqueta: "Howitzer", valor: 500, detalle: "Tierra · Hígado Hiperbolizado" },
            { etiqueta: "Leviathan", valor: 450, detalle: "Agua · Glándula Acidimétrica" },
            { etiqueta: "Grakensenker", valor: 400, detalle: "Agua · Aletas Prensiles" },
            { etiqueta: "Hindenburg", valor: 400, detalle: "Aire · Corazón Amalgamado · bombas" },
            { etiqueta: "GazenBreacher", valor: 350, detalle: "Agua · Aletas Prensiles" },
            { etiqueta: "Sieger", valor: 300, detalle: "Tierra · Corazón Amalgamado" },
            { etiqueta: "Verfalldrache", valor: 300, detalle: "Aire · Membranas de ala" },
            { etiqueta: "Hohlfresser", valor: 250, detalle: "Subsuelo · Glándula Acidimétrica" },
            { etiqueta: "Stahlmorder", valor: 200, detalle: "Tierra · Ligamentos Hiper-suspensores" },
          ],
          pie: "Cada calamidad suelta un **órgano único** (al lado de su nombre) y sus restos dan **biomasa reforjada**. En este pack **no rompen bloques**. Cuando les queda poca vida se enraízan y llaman Vigilantes.",
        },
      ],
    },
    {
      id: "11.3",
      titulo: "Equipo para contraatacar",
      bloques: [
        {
          tipo: "p",
          texto:
            "Antes del REDNIGHT, saquea las estructuras de Spore: sus cofres traen **láminas de compuesto**, placas de circuitos, jeringas, máscaras de gas y a veces un **Escáner** o una **Pistola de jeringa**. Lo demás se fabrica:",
        },
        {
          tipo: "recetas",
          items: [
            {
              nombre: "Polvo de amatista",
              estacion: "Sin forma",
              ingredientes: ["Fragmento de amatista"],
            },
            {
              nombre: "Compuesto",
              estacion: "Mesa de crafteo",
              forma: [["Azúcar", "Polvo de amatista", "Azúcar"]],
              pie: "Hornéalo para tener una **Lámina de compuesto**.",
            },
            {
              nombre: "Placa de circuitos",
              estacion: "Mesa de crafteo",
              forma: [
                ["Polvo de redstone", "Comparador de redstone", "Polvo de redstone"],
                ["Repetidor de redstone", "Polvo de redstone", "Repetidor de redstone"],
                ["Polvo de redstone", "Lámina de compuesto", "Polvo de redstone"],
              ],
            },
            {
              nombre: "Mesa de cirugía",
              estacion: "Mesa de crafteo",
              forma: [
                ["Espada de hierro", "Frasco de cristal", "Hacha de hierro"],
                ["Lámina de compuesto", "Mesa de trabajo", "Lámina de compuesto"],
                ["Lámina de compuesto", "Lámina de compuesto", "Lámina de compuesto"],
              ],
              pie: "Fabrica las armas y armaduras de carne (rejilla de 4×4) y los injertos.",
            },
            {
              nombre: "UDC (C.D.U.)",
              estacion: "Mesa de crafteo",
              forma: [
                ["Lámina de compuesto", "Trampilla de hierro", "Lámina de compuesto"],
                ["Lámina de compuesto", "Dispensador", "Lámina de compuesto"],
                ["Lingote de hierro", "Lingote de hierro", "Lingote de hierro"],
              ],
              resultado: "UDC",
              pie: "Lanza frío: **limpia los bloques infectados** (alcance 25) y los deja como biomasa congelada.",
            },
            {
              nombre: "Contenedor de hielo",
              estacion: "Mesa de crafteo",
              forma: [
                ["Pepita de hierro", "Pepita de hierro", "Pepita de hierro"],
                ["Pepita de hierro", "Hielo azul", "Pepita de hierro"],
                ["Pepita de hierro", "Pepita de hierro", "Pepita de hierro"],
              ],
              pie: "Munición de la UDC.",
            },
            {
              nombre: "Máscara de gas",
              estacion: "Mesa de crafteo",
              forma: [
                ["Lana negra", "Lana negra", "Lana negra"],
                ["Lana negra", null, "Lana negra"],
                ["Esponja", "Lingote de hierro", "Esponja"],
              ],
              pie: "Protege de los gases de la colmena.",
            },
          ],
        },
        { tipo: "p", texto: "**Partes de los infectados**" },
        {
          tipo: "objetos",
          items: [
            { nombre: "Fibra mutada", sale: "Casi todos los infectados.", uso: "Componentes de carne, músculo denso" },
            { nombre: "Fragmentos de garra", sale: "Garras, Caballeros, Jagdhund.", uso: "Garra carnosa, unión endurecida" },
            { nombre: "Fragmentos de armadura", sale: "Caballeros, Brutos, Inquisidores, Ogros.", uso: "Núcleo viviente, armaduras esqueléticas" },
            { nombre: "Corazón mutado", sale: "Humanos y aldeanos infectados (poco frecuente).", uso: "Núcleo viviente, reactivos" },
            { nombre: "Cerebro", sale: "Aldeanos, comerciantes y brujas infectados.", uso: "Nervios (×8)" },
            { nombre: "Tendones", sale: "Griefer, Atleta, Bruto.", uso: "Arcos, ballestas, alas" },
            { nombre: "El ojo del vigilante", sale: "Vigilantes (siempre).", uso: "Pico de combate, respirador, Restos cerebrales" },
            { nombre: "Restos cerebrales", sale: "El Proto al morir; también 8 cerebros + ojo del vigilante.", uso: "Zoaholic, Casco viviente V2" },
            { nombre: "Corazón Amalgamado", sale: "Sieger y Hindenburg.", uso: "Armas vivas, mejoras de vida" },
            { nombre: "Biomasa terrestre reforjada", sale: "Restos de calamidades (más con el Saqueador de Spore) y el jefe FIXER.", uso: "Armadura viviente V2, armas vivas" },
          ],
        },
        { tipo: "p", texto: "**Armaduras de Spore**" },
        {
          tipo: "tabla",
          columnas: ["Nivel", "Cómo se hace", "Protección (casco/pecho/grebas/botas)"],
          filas: [
            ["De carne", "Mesa de cirugía: músculo, tendones, nervios, órganos y núcleo viviente", "2 / 6 / 5 / 2"],
            ["Esquelética", "Mesa de cirugía: placas y fragmentos de armadura", "4 / 8 / 6 / 3"],
            ["Viviente", "Injerto: esquelética + agente integrador + de carne. Agachado, **trepa paredes**", "4 / 10 / 9 / 4"],
            ["Viviente V2", "Injerto con órganos de calamidad y biomasa reforjada. El casco V2 bloquea la Locura del Proto", "6 / 13 / 10 / 5"],
          ],
        },
        {
          tipo: "nota",
          estilo: "importante",
          titulo: "Armas vivas",
          texto:
            "El Lanzabilis, el Asesino Ácido, el Creador de Niebla Micelial y el Aterrorizador Tóxico usan órganos de calamidad. En este pack hacen **el doble de daño** pero aguantan **muy poco** (15 a 60 usos).",
        },
        { tipo: "p", texto: "**Cómo frenar la colmena**" },
        {
          tipo: "lista",
          items: [
            "**Frío**: los infectados son débiles al frío y la congelación pausa su evolución. Usa la UDC, el PCI (inyector criogénico), granadas criogénicas y el equipo de hielo de Spore Inquisition.",
            "**Mata Protos y Tumores Colmena**: la zona retrocede 25 y 10 bloques.",
            "**Destruye montículos** antes de que crezcan y mata a los Embriagadores primero.",
            "**Bases protegidas** con `/trigger base` (3.7).",
            "Los infectados **mueren de hambre** con el tiempo si no comen.",
          ],
        },
      ],
    },
    {
      id: "11.4",
      titulo: "Spore Inquisition y el final",
      bloques: [
        {
          tipo: "definiciones",
          items: [
            { termino: "ECLIPSE", texto: "Con **275 de corrupción o más**, el REDNIGHT acumula «juicio». A las 12 h lanza el ECLIPSE contra hasta 3 jugadores: un **Gazenbreacher**, un **Hindenburg** y un **Sieger** sobrecargados. Aquí aparecen en la superficie y **nunca contra novatos**." },
            { termino: "Ofrendas", texto: "Cabezas fabricadas que se tiran **sobre bloques de biomasa** a cambio de objetos o mejoras muy buenas. Suben la corrupción: +25, +50 o +100." },
            { termino: "Mejoras permanentes", texto: "En la mesa de cirugía, una jeringa con órganos de calamidad y reactivos da al jugador más **vida** (Corazón Amalgamado), **daño** (Glándula Acidimétrica), **armadura** (Hígado Hiperbolizado), **velocidad** (Ligamentos) o **nado** (Aletas)." },
            { termino: "FIXER", texto: "Un aventurero infectado jefe que aparece junto al REDNIGHT cuando alguien se acerca a menos de 200 bloques. Suelta **biomasa reforjada** o un Puesto del vigilante: la forma fácil de conseguirla." },
            { termino: "Ordalías", texto: "**Desactivadas** en este pack, aunque los avisos de corrupción las nombren." },
          ],
        },
        { tipo: "p", texto: "**Finalitas: cómo se termina la infección**" },
        {
          tipo: "pasos",
          items: [
            "La corrupción natural se queda en el **99 %** (unos 396). Para empezar el final hay que hacer una **ofrenda** con la corrupción al máximo.",
            "Suena la historia y todos viajan a la dimensión **Finalitas**.",
            "Aparecen de uno en uno **cuatro guardianes**: **Fames** (mazo), **Impotentia** (arco), **Desperatio** (hacha de batalla) y **Odium** (lanza). Cada uno suelta un ojo que hace de llave: Abundance, Vis, Spes y Amor.",
            "Con las cuatro llaves se abre el camino a la **pelea final contra el REDNIGHT**.",
            "Al vencerlo y subir a lo más alto llega **TÉLOS**: la infección termina, los organoides se hunden, los infectados se debilitan y las calamidades se marchitan.",
          ],
        },
        { tipo: "p", texto: "**Lo que cambia el pack**" },
        {
          tipo: "tabla",
          columnas: ["Qué", "Normal", "Infect Cozy"],
          filas: [
            ["Empieza la infección", "Desde el principio", "**REDNIGHT a las 12 h** de juego con gente conectada"],
            ["Sube la corrupción", "Sola", "**+1 por hora** solo con jugadores conectados"],
            ["Romper bloques", "Calamidades, Griefers y algunos infectados", "**Nadie**, salvo las estructuras de la colmena dentro de la zona"],
            ["Tiempo para evolucionar", "300 s", "**150 s**"],
            ["Hiper-evolución", "7 muertes", "**700 muertes** (llegan por las hordas)"],
            ["Mente reconstruida (colmena nueva)", "40 muertes", "**3500 muertes**"],
            ["Tumor Colmena vuelve a ser Proto", "1200 s", "**600 s**"],
            ["Radio de infección del montículo", "5 a 20 bloques", "**10 a 25 bloques**"],
            ["Armas vivas", "300 usos", "**15 a 60 usos**, daño ×2"],
            ["Ordalías y oleadas de vigilantes", "Sí", "**No**"],
            ["Finalitas", "Automático", "**Con una ofrenda** a corrupción máxima"],
          ],
        },
      ],
    },
  ],
};
