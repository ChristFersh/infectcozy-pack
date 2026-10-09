import type { Seccion } from "../tipos";

export const seccion5: Seccion = {
  id: "5",
  titulo: "Nivel de amenaza",
  resumen: "Cómo se calcula tu nivel de amenaza y cuánto endurece a los enemigos que aparecen cerca.",
  intro: [
    {
      tipo: "p",
      texto:
        "Los enemigos **se adaptan a tu equipo**. El servidor te da un **puntaje** con tu armadura, tu ataque y los jefes que hayas derrotado, y ese puntaje decide tu **nivel de amenaza**, del 1 al 5. Cuanto más alto, más duros son los enemigos que aparecen a tu alrededor y más campeones salen.",
    },
    {
      tipo: "tarjetas",
      items: [
        { titulo: "Armadura", texto: "la que llevas puesta (cuenta hasta 20)" },
        { titulo: "+ Ataque", texto: "cuerpo a cuerpo, hechizo ×2 o arco" },
        { titulo: "+ 3 × jefes", texto: "3 puntos por cada jefe derrotado (la Naga y el Guardián anciano no suman)" },
        { titulo: "= Puntaje", texto: "decide tu nivel, del 1 al 5" },
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
      texto: "20 de armadura + 9 de ataque + 2 jefes derrotados (2 × 3 = 6) = **35 puntos**: nivel 3.",
    },
  ],
  subsecciones: [
    {
      id: "5.1",
      titulo: "Los 5 niveles",
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
            "No afecta a los **jefes** ni a las criaturas con **150 o más de vida base**.",
            "Los jugadores en **creativo** no cuentan.",
            "Los campeones al azar del mod Champions están apagados: los campeones salen de este sistema y de la colmena (3.5).",
          ],
        },
        {
          tipo: "nota",
          estilo: "consejo",
          titulo: "Tu nivel",
          texto: "Escribe `/trigger amenaza` en el chat para ver tu nivel.",
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
  ],
};
