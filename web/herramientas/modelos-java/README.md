# modelos-java

Saca los modelos de Java de los jefes (vanilla, L_Ender's Cataclysm y Mowzie's Mobs) al formato de
`src/modelos/formato.ts` (`yArriba: false`) y copia sus texturas. Escribe `<id>.json`, `<id>.png` y, si hay capa que
brilla, `<id>_brillo.png` en `public/modelos/`.

## Cómo se ejecuta

Hace falta un JDK 21 (el `java` 11 del sistema no sirve) y Python 3 (solo para leer los `.json` de `versions/`).

```bash
./volcar.sh                 # todos los jefes
./volcar.sh wither scylla   # solo algunos
```

Variables que se pueden cambiar: `JDK` (carpeta `bin` del JDK 21), `INSTALL` (carpeta `Install` de CurseForge),
`MODS` (carpeta `mods` de la instancia), `SALIDA` (por defecto `../../public/modelos`) y `TRABAJO` (clases compiladas).
Por defecto apuntan a las rutas de la VM de Cowork (`$HOME/herr/...`, `$HOME/mnt/...`).

## Qué hace

1. `AbrirModelPart.java` escribe dos clases parcheadas que van primero en el classpath:
   - `ModelPart` con `children` y `cubes` públicos (lo pide el `accesstransformer.cfg` de Cataclysm; en el juego lo
     hace NeoForge al cargar la clase).
   - `EnderDragonRenderer` sin inicializador estático (sus campos estáticos necesitan el juego arrancado).
2. `Volcar.java` crea cada modelo como su renderizador (constructor o `createBodyLayer().bakeRoot()`), sin `setupAnim`,
   recorre el árbol de partes y saca las caras ya construidas (los quads de cada caja, con sus UV normalizadas).
3. Lo comprueba: llama a `renderToBuffer` del propio modelo con un `VertexConsumer` que guarda los vértices y los
   compara con los que salen de componer el JSON como el visor. La línea `sobran: 0  faltan: 0` quiere decir que el
   JSON dibuja exactamente lo mismo que el juego.

## Convenciones

- Vanilla `ModelPart`: `T(p/16) · rotationZYX · S(escala)`; los hijos heredan la escala.
- lionfishapi (`AdvancedModelBox`, Cataclysm) y llibrary (`AdvancedModelRenderer`, Mowzie's): mismo orden
  (`T · Rz · Ry · Rx · S`), pero con `scaleChildren = false` la escala no llega a los hijos. En el JSON esas cajas van en
  una subparte `<nombre>~cajas` con la escala, y los hijos cuelgan de la parte sin escalar.
- llibrary: `isHidden` quita solo las cajas propias (los hijos se dibujan); `showModel = false` quita la parte entera.
- Las partes que en el estado inicial de la entidad no se ven (por `setupAnim`) se marcan `oculto` en la tabla `JEFES`.
- Dragón del End: `DragonModel` dibuja la pieza del cuello 5 veces y 12 para la cola según el historial de vuelo; se
  arma a mano (`dragon()`) con el dragón volando quieto.
- Caballero de hierro forjado: se aplican los ajustes fijos de `setDefaultAngles` (de pie, activo); sus ojos brillantes
  salen recortando la textura con el modelo `ModelWroughtnaut(true)`.
- La escala del renderizador (`poseStack.scale`) va en `escala`: Wither 2, Heraldo 2, Leviatán 1,75, Scylla 1,15.
