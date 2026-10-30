import type { Seccion } from "../tipos";

export const seccion5: Seccion = {
  id: "5",
  titulo: "Nivel de amenaza",
  resumen: "Cómo se calcula tu nivel de amenaza, cuánto endurece a los enemigos que aparecen cerca y cómo se adaptan los jefes.",
  intro: [
    {
      tipo: "p",
      texto:
        "Los enemigos **se adaptan a tu equipo**. El servidor te da un **puntaje** con tu armadura, tu ataque, los jefes que hayas derrotado y tu árbol de combate, y ese puntaje decide tu **nivel de amenaza**, del 1 al 7. Cuanto más alto, más duros son los enemigos que aparecen a tu alrededor y más campeones salen.",
    },
    {
      tipo: "tarjetas",
      items: [
        { titulo: "Armadura", texto: "la que llevas puesta (cuenta hasta 20)" },
        { titulo: "+ Ataque", texto: "cuerpo a cuerpo, hechizo ×2 o arco" },
        { titulo: "+ 3 × jefes", texto: "3 puntos por cada jefe derrotado (la Naga y el Guardián anciano no suman)" },
        { titulo: "+ ½ árbol de combate", texto: "la mitad de los puntos que hayas ganado en el árbol de combate (hasta 74)" },
        { titulo: "= Puntaje", texto: "decide tu nivel, del 1 al 7" },
      ],
    },
    {
      tipo: "p",
      texto:
        "Para el ataque cuenta lo más alto de tres cosas: tu daño **cuerpo a cuerpo**, tu **poder de hechizo ×2** o el **daño de tu arco**. Cuenta el **equipo que llevas puesto**: si te lo quitas, tu puntaje baja 1 punto por minuto hasta igualar lo que llevas.",
    },
    {
      tipo: "nota",
      estilo: "nota",
      titulo: "Ejemplo",
      texto: "20 de armadura + 9 de ataque + 2 jefes derrotados (2 × 3 = 6) + 40 puntos del árbol de combate (la mitad, 20) = **55 puntos**: nivel 4.",
    },
  ],
  subsecciones: [
    {
      id: "5.1",
      titulo: "Los 7 niveles",
      bloques: [
        {
          tipo: "tabla",
          columnas: ["Nivel", "Puntaje", "Vida", "Daño", "Armadura", "Campeones"],
          filas: [
            ["**1**", "**menos de 20**", "Normal", "Normal", "—", "3 % · rango 1"],
            ["**2**", "**20+**", "+25 %", "+10 %", "—", "4 % · rango 1-2"],
            ["**3**", "**32+**", "+60 %", "+25 %", "+2", "5 % · rango 2-3"],
            ["**4**", "**48+**", "+100 %", "+40 %", "+4", "6 % · rango 3-4"],
            ["**5**", "**75+**", "+150 %", "+60 %", "+6", "7 % · rango 4-5"],
            ["**6**", "**110+**", "+200 %", "+80 %", "+8", "8 % · rango 5"],
            ["**7**", "**145+**", "+250 %", "+100 %", "+10", "9 % · rango 5"],
          ],
          pie: "Vida, daño y armadura: lo que ganan los enemigos sobre lo normal. Campeones: qué parte de los enemigos sale como campeón (élite, sección 2.2) y de qué rango.",
        },
      ],
    },
    {
      id: "5.2",
      titulo: "A quién afecta",
      bloques: [
        {
          tipo: "lista",
          items: [
            "Cada enemigo nuevo toma el nivel del **jugador más cercano** y lo **conserva**.",
            "Cerca de un jugador con protección de novato (3.8) no salen campeones.",
            "No afecta a los **jefes** ni a las criaturas con **150 o más de vida base**: los jefes se adaptan a su manera (5.3).",
            "Los jugadores en **creativo** no cuentan.",
            "Los campeones al azar del mod Champions están apagados: los campeones salen de este sistema y de la colmena (3.5).",
          ],
        },
        {
          tipo: "nota",
          estilo: "consejo",
          titulo: "Tu nivel",
          texto: "Escribe `/trigger amenaza` en el chat para ver tu nivel y los puntos de tu árbol de combate.",
        },
        {
          tipo: "nota",
          estilo: "importante",
          titulo: "En grupo",
          texto:
            "Si vas con alguien mucho mejor equipado, cada enemigo toma el nivel de quien tenga más cerca: los que salen a tu lado son de tu nivel, y los que salen junto a él, del suyo.",
        },
      ],
    },
    {
      id: "5.3",
      titulo: "Jefes adaptativos",
      bloques: [
        {
          tipo: "p",
          texto:
            "Los **jefes grandes** también se adaptan: toman el nivel de amenaza del **jugador más fuerte** que esté a **48 bloques** y, desde el nivel 4, ganan vida, daño y un **golpe extra**.",
        },
        {
          tipo: "tabla",
          columnas: ["Nivel", "Vida", "Daño", "Golpe extra"],
          filas: [
            ["**1-3**", "Normal", "Normal", "—"],
            ["**4**", "×1,5", "+15 %", "+2"],
            ["**5**", "×2", "+30 %", "+4"],
            ["**6**", "×3", "+50 %", "+6"],
            ["**7**", "×4", "+75 %", "+8"],
          ],
          pie: "Golpe extra: daño que se suma a los golpes del jefe e ignora la armadura y la Protección (como mucho una vez cada medio segundo). El efecto Resistencia sí lo reduce.",
        },
        {
          tipo: "lista",
          items: [
            "Afecta a los **26 jefes** de la lista del Arco Prohibido (6.9), incluidos el **Warden** y el **guardián anciano**.",
            "El jefe **nunca baja de nivel** durante la pelea, aunque el jugador más fuerte se vaya.",
            "**En grupo**: cada jugador extra a 48 bloques le da **+50 % de vida** (cuenta hasta 5 jugadores).",
            "Los jefes de **Cataclysm** que ya tienen tope de daño por segundo solo ganan daño, no vida.",
            "Si el nivel es 4 o más, o hay 2 o más jugadores, sale un aviso en el chat.",
          ],
        },
      ],
    },
  ],
};
