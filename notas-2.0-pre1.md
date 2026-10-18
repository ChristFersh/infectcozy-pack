# Infect Cozy 2.0-pre1 (pre-release)

Versión de prueba de **Infect Cozy 2.0**, para **Media** y **Detallada**. No es la versión publicada (1.7.4): se instala aparte y no toca la instancia que ya tengas.

> Minecraft 1.21.1 · NeoForge · 8 GB de RAM · Media: 505 archivos · Detallada: 509 archivos

## Cómo instalarla

1. Baja el zip de tu versión: **Media** (gráfica dedicada; shaders apagados de fábrica, se encienden con **O**) o **Detallada** (PC potente; shaders y Distant Horizons encendidos).
2. En **Prism Launcher**: *Añadir instancia → Importar* y elige el zip.
3. Dale a **Jugar**. La primera vez packwiz baja todo el pack (tarda). Después se actualiza solo cada vez que abres el juego.

Se crea una instancia nueva, "Infect Cozy … (pre-release)". Si publico otra pre-release, esa misma instancia se actualiza sola.

> **Servidor:** la 2.0 trae mods de contenido nuevos (Create Aeronautics, el Arsenal del Abismo…). Hasta que el servidor de Falix tenga esta versión, pruébala en un **mundo propio** (un jugador).

---

## Lo grande de la 2.0

### Arsenal del Abismo (mod propio, `infectcozy-arco` 2.0.0-beta.47)

Las armas definitivas del pack dejan de ser objetos del datapack y pasan a ser **objetos propios**, con modelos, animaciones (Better Combat) y efectos que se ven también con shaders. Están en la pestaña creativa **Arsenal del Abismo** y se fabrican con los materiales de los jefes.

- **Filo del Juicio** (se ve como el Incinerador de Cataclysm)
  - **Calor:** cada golpe calienta la hoja. La barra de la derecha de la mira se llena con **12 golpes**. Cada tercio da **+0,4 bloques de alcance** (hasta 4,2) y enciende la hoja. Aguanta 5 s sin golpear.
  - **Juicio:** 3 golpes seguidos en menos de 3 s hacen estallar fuego alrededor del enemigo.
  - **Guardia ígnea** (mantener clic derecho): recibes la mitad de daño. Al soltar salen las **Llamaradas del Juicio**, columnas de fuego en fila que atraen a los enemigos y te curan.
  - **Embestida** (**Q**): carrera envuelta en fuego que golpea y deja un rastro de llamas.
  - **Sentencia** (**agachado + Q**): salto y picada con una onda de fuego al caer.
  - Con la barra llena, las Llamaradas y la Sentencia salen **potenciadas** y gastan el calor.
- **Rompemundos** (hacha de hielo)
  - **Escarcha:** se carga con 5 golpes. Mientras brilla, cada golpe quita armadura al enemigo (**Rompecorazas**, del 15 al 25 %).
  - **Remolino helado** (clic derecho tras un golpe cargado): giro de 360° que empuja y pone los efectos de los encantamientos.
  - **Golpe sísmico** (agachado + clic derecho en el suelo): onda que levanta a los enemigos y hace saltar el suelo. Es solo visual: no rompe bloques.
  - **Lanzarla** (**Q**): queda clavada y crea una **zona helada** que congela y frena. Con la escarcha completa la zona llega a radio 8 y la levanta un **pilar de hielo**. El hacha no se pierde: al llamarla vuelve.
- **Tridente del Abismo**
  - Lanza una copia y el original se queda en la mano. Recoger la copia da cargas (hasta 30); se ven en la barra bajo el icono.
  - Con **10 cargas o más** el lanzamiento puede desatar la **Furia del Abismo** (gran daño en área).
- **Arco de la Maldición Eterna**
  - No necesita flechas. Al tensarlo sale un círculo de runas y al soltar dispara un **rayo de energía** de largo alcance, con un rayo en zigzag en el impacto.
- **Último Amanecer** (armadura, se ve como la Ignitium de Cataclysm)
  - Set completo:
    - robo de vida;
    - aura de sol;
    - **dos escudos de sol** que paran un golpe entero cada uno y vuelven a los 20 s;
    - **+15 % de daño** con las armas del abismo;
    - **+5 % de velocidad**.
  - Hay también una **coraza alada** (con élitras).
- **Encantar:** las piezas solo se encantan con libros en el **Yunque del Abismo**.
- **Piezas viejas:** si tienes las del datapack, se cambian solas por las nuevas y conservan sus encantamientos.

### El Arco Prohibido

El arma final. **No se fabrica:** se consigue con un **ritual en la Mesa del Sacrificio**. Pones encima las 8 piezas del arsenal (Filo, Rompemundos, Tridente, Arco de la Maldición y las 4 del Último Amanecer), tienes 100 niveles y confirmas con *agachado + clic derecho con la mano vacía*.

- **Invocar:** mantén clic derecho 3 s. Un arco de 7 bloques se forma a tu lado. Mientras está invocado te protegen **6 escudos arcanos** (cada uno para un golpe).
- **Disparar:** con el arco invocado, mantén clic derecho 2 s y suelta. Mientras cargas puedes **volar** para acomodarte, hasta 20 bloques más arriba.
- **Costo por tiro:** la mitad de tu vida actual, 10 niveles y 2 puntos del árbol de habilidades.
- **Dos disparos y recarga de 10 minutos.** Los disparos que quedan se ven **debajo de la mira**. Tras el último, el arco se desinvoca solo.
- **El rayo orbital**, donde cae la flecha:
  1. Se abre una **grieta en el cielo**, a la altura de las estrellas: roja, se vuelve negra, con relámpagos, latidos y su propia música.
  2. Salen los haces de luz y el rayo se carga. De día, justo antes del golpe, todo se apaga menos el rayo y la grieta.
  3. El rayo cae **12 s después** de la flecha.
- **Daño:**
  - en el centro, 600 de daño verdadero; en el borde, 150 de daño normal;
  - a los **jefes**, el **50 % de su vida por tiro**;
  - **también puede matarte a ti** si estás dentro.
- **Cráter:** radio 20 y 25 de hondo. Quita los líquidos sin que el agua de alrededor entre. Nunca rompe la bedrock; la obsidiana, solo a veces.
- Si el impacto es lejos, el rayo se sigue viendo y la zona se carga sola para que el rayo llegue igual.

### Create Aeronautics: barcos y aeronaves

Construye **naves voladoras y barcos** con Create, con física real (**Sable**). Llega con varios addons:

- **Gadgets & Gizmos:** controles, rodamientos y propulsores;
- **AeroWarptics**;
- **Aeronautical Diesel:** motores diésel;
- **Drill Levitite**;
- **Throwable Rope Connector:** cuerdas que se lanzan;
- **Create: Quality of Life**.

---

## Otros mods nuevos

- **Ancient Remnants: Monoliths:** estructuras nuevas.
- **Orbital Railgun:** lo usa el Arco Prohibido.
- **Not Enough Recipe Book (NERB):** libro de recetas mejorado.
- **Cataclysm & BetterCombat - Compatibility:** reemplaza al datapack que hacía lo mismo.
- **Animated Loading Screen** y **Dark early loading:** pantalla de carga animada y oscura.
- **MCG's Guidebook: Aquamirae** (con MCG Core).
- **Window Resize Fix (Iris & Distant Horizons):** arregla los LODs que se dibujaban encima de todo al cargar un mundo o cambiar el tamaño de la ventana.
- **Actualizados:**
  - Aquamirae 7.2.12, Fragmentum 5.4.0 y Supplementaries 4.0.1;
  - Sophisticated Backpacks, Storage y Core;
  - Collective, Moonlight, Locate Fixer 4.0, Stack Refill 6.0 y Streams Reflowing 2.15;
  - EMF/ETF, ImmediatelyFast y unos 40 más (versiones menores).

## Quitado

- **Yet Another Gravestone (YAGM):** al morir salían dos tumbas y el botín se duplicaba. Queda solo la tumba de **Corail Tombstone**.
- **Just Enough Items (JEI):** la lista de objetos es la de **REI**.
- **Better FPS - Render Distance:** en Media y Detallada, al subir alto dejaba de dibujarse el terreno de abajo. Sigue en las versiones bajas.
- **RenderScale** (Detallada): junto con Distant Horizons e Iris hacía que el mundo se viera estirado o doblado.
- **ScalableLux** y **Create: Advanced Optimization:** salen para poder usar Create Aeronautics y Sable.
- **Cultural Delights**, **Effortless Building**, **Falling Leaves**, **Rogues & Warriors** y **LoaderOptimization**.
- **Datapacks:** BetterCombat x Cataclysm (ahora es un mod) y Fortune Works On Ancient Debris.
- **Resource packs:** Chests Reimagined, Colourful Containers Dark Mode, Fresh Animations: Objects y Grassy Grass.

## Aspecto

- **Interfaz oscura Mandala's GUI:** Dark Mode, la extensión Utopia y la compatibilidad con Advancement Plaques, TrashSlot y otros mods. Reemplaza los temas oscuros de antes.
- **Trident Reforged:** nueva textura del tridente.
- **Shaders:** Complementary Reimagined r5.9.3 + Euphoria Patches 1.10.5, y se añaden los ajustes de Complementary Unbound.

## Arreglos

- **Pantalla negra después del rayo** (se arreglaba abriendo un menú): Enhanced Visuals dibujaba un rectángulo negro que quedaba a la vista; ya no se dibuja.
- **Lluvia y nubes negras durante la grieta:** con shaders se veían como cuadros negros. Ahora la lluvia se aparta mientras la grieta tiene el cielo cerrado, y las nubes se tiñen de rojo.
- **Tumbas duplicadas:** ver *Quitado*.
- **Distant Horizons** dibujaba los LODs encima de los chunks cercanos, con franjas negras.
- **Resource packs:** la versión ahora lleva la lista de packs activos del pack (incluidos los de Mandala's GUI).
- **Icono:** la instancia de Prism trae el icono de Infect Cozy.

---

## Qué probar

- [ ] Instalar e iniciar sin errores (Media y/o Detallada). Detallada con shaders y Distant Horizons; Media encendiendo los shaders con **O**.
- [ ] Cargar un mundo, cambiar a pantalla completa y redimensionar la ventana: los LODs de lejos **no** deben taparte el mundo.
- [ ] Morir: sale **una** sola tumba (Corail Tombstone) con tus cosas, sin duplicados.
- [ ] Arsenal del Abismo (creativo, pestaña *Arsenal del Abismo*): habilidades de cada arma con y sin shaders.
- [ ] Arco Prohibido (`/give @s infectcozy_arco:arco_prohibido` en creativo, o el ritual en supervivencia), de día y de noche:
  - [ ] la grieta, la música y el apagón;
  - [ ] que la pantalla **no** quede negra después;
  - [ ] el contador de disparos y que el arco se vaya tras el segundo tiro;
  - [ ] el 50 % a un jefe.
- [ ] Create Aeronautics: armar una nave pequeña y volar.
- [ ] Rendimiento: FPS normales y sin tirones raros.

Si algo falla, manda una captura y, si puedes, el archivo `logs/latest.log` de la instancia (en Prism: clic derecho en la instancia → *Carpeta* → `logs`).
