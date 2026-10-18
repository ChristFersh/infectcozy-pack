# Infect Cozy con packwiz

Tus amigos juegan con Prism Launcher. Cada vez que abren el juego, packwiz compara su instalación con lo
publicado aquí y descarga solo lo que cambió: mods, configs, resource packs y shaders.

## Sacar una versión nueva

1. Haz tus cambios como siempre en la instancia de CurseForge (añadir o quitar mods, tocar configs).
2. Doble clic en `publicar.bat` y escribe el número de versión (o pulsa Enter para aceptar el que sugiere).
3. Listo. En unos 10 minutos les llega a todos al abrir el juego.
4. Para ofrecer también la versión de CurseForge: doble clic en `exportar-curseforge.bat` y luego en `subir-a-github.bat`
   (sube los zips a la release `v<versión>` y añade el botón a la web).

`python publicar.py 1.6 --sin-subir` genera los packs sin subirlos, por si quieres revisar antes.

## Pre-release (sin tocar la publicada)

Para que alguien pruebe cambios antes de publicarlos: `publicar-pre.bat 2.0-pre1 --solo media detallada` (sin
`--solo` van las 5). Genera las versiones en `pre-release/packs/` y sus zips de Prism en `pre-release/descargas/`
("Infect Cozy Media (pre-release).zip", etc.), sube solo la carpeta `pre-release/` y crea en GitHub la release
`v2.0-pre1` **marcada como pre-release** con esos zips. Con GitHub CLI (`gh`) se crea sola; sin `gh` se abre la página
de nueva release con todo puesto y solo hay que arrastrar los zips. No toca `packs/`, `descargas/`, `datos.json` ni la
versión de `variantes.json`, así que quien tiene el pack normal no recibe nada.

- Quien prueba baja el zip de la release y lo importa en Prism: es otra instancia ("... (pre-release)"). Cada vez que
  vuelvas a correr `publicar-pre.bat` con la misma versión, su instancia se actualiza sola al abrir el juego (~10 min
  después). Para una pre-release nueva (`2.0-pre2`), la instancia sigue sirviendo: apunta a `pre-release/packs/`.
- Cuando esté bien, publica normal con `publicar.bat`.
- Sin `git push` ni release: `python publicar.py 2.0-pre1 --pre --sin-subir`.
- Las beta test viejas (`prueba/`, de la 2.1 a la 2.5.1) se quitaron el 16-oct; su borrado sale en el commit de la
  primera pre-release. `--prueba` sigue existiendo en `publicar.py` pero ya no tiene .bat.

## Qué hace `publicar.py`

- Lee `minecraftinstance.json` y la carpeta `mods/`, `resourcepacks/`, `shaderpacks/` y `datapacks/` de la instancia.
- Cada archivo sale de CurseForge si se puede; si su autor bloquea las descargas fuera de la app de CurseForge,
  lo busca idéntico en Modrinth; si no está en ningún sitio, copia el archivo tal cual al repo.
- Copia `config/`, `defaultconfigs/`, `moonlight-global-datapacks/` y `globalresources/`. Los zips de `globalresources/` los carga Default Resources (viene dentro de Missing Wilds) siempre activos, sin depender de `options.txt`. Ahí va `infectcozy-mando.zip`, con los botones por defecto de Controlify.
- Genera las 5 versiones en `packs/`, los zips para Prism en `descargas/` y la página `index.html`.
- Hace commit y push a GitHub; GitHub Pages lo publica.

## `variantes.json`

| Clave | Para qué sirve |
|---|---|
| `excluir_siempre` | Archivos que nunca se publican (Xray, cachés, `.bak`, perfiles de spark...). |
| `alojar_en_repo` | Mods bloqueados en CurseForge pero con licencia libre (MIT, Apache): el jar va dentro del repo. |
| `solo_servidor` | Mods que los clientes no necesitan; Prism no los descarga. |
| `conservar` | Se instalan la primera vez y después **no se pisan nunca**: `options.txt`, gráficos, shaders... Así cada amigo conserva sus teclas y ajustes. |
| `variantes[].excluir` | Qué quita cada versión respecto a tu instancia (Detallada = tu instancia completa). |
| `variantes[].agregar` | Mods que en tu instancia están desactivados (`.disabled`) pero que esta versión sí lleva. Así un mod puede ir solo en las versiones bajas sin tenerlo activo tú. Ejemplo: Better FPS - Render Distance va de Media-Lite para abajo (Media y Detallada lo tienen en `excluir`, por si en tu instancia está activo). |
| `jvm_args` | Parámetros de Java que llevan los zips de Prism (recolector G1 ajustado). Una versión puede tener los suyos con su propio `jvm_args`. Solo llegan a quien importa el zip de nuevo. |

Los patrones valen como nombre del proyecto de CurseForge (`"Iris Shaders"`), nombre de archivo (`"punchy-*.jar"`)
o ruta (`"shaderpacks/*"`).

**Si añades un mod visual o pesado**, acuérdate de ponerlo en `excluir` de Ultra Low y de Lite (y de Media-Lite si toca).
Cualquier mod que dependa de Iris (por ejemplo Colorwheel) tiene que ir en `excluir` de Ultra Low y de Lite, que no llevan Iris.

### Ultra Low

Para PCs muy justas. Lleva todo lo que el servidor necesita (mods con bloques, objetos, criaturas o mundo, y sus librerías) más los
de rendimiento. Quita todo lo estético que es solo de cliente: animaciones, partículas, HUD y tooltips decorativos, cámara, sonido extra,
Essential y JEI (se queda REI, que también está en el servidor). De resource packs solo lleva los del propio pack
(InfectCozy Sophisticated Oscuro y el tema oscuro de Colourful Containers) más los que traen los mods. Sus ajustes en `ajustes/ultra-low/`:
distancia 5, 60 FPS sin VSync, RenderScale al 70 %, límite de 1500 partículas y Sodium Extra recortado.

Antes de quitar algo de Ultra Low, comprueba que no esté en el servidor de Falix: si un mod está allí, el cliente normalmente lo necesita para entrar.

## `ajustes/<versión>/`

Archivos que reemplazan a los de tu instancia solo en esa versión (sacados de los zips 1.4): `options.txt`
con las teclas para amigos, sodium al mínimo en Lite, renderscale al 80 %, etc. Casi todos están en
`conservar`, así que solo afectan a instalaciones nuevas.

Los resource packs activos y su orden (`resourcePacks` e `incompatibleResourcePacks` de `options.txt`) no salen de
`ajustes/`: al publicar (y en `exportar_prism_completo.py`) se copian del `options.txt` de tu instancia, quitando los
packs sueltos (`file/...`) que esa versión no lleva. Activa o desactiva packs en tu instancia y la próxima publicación
lo repite en cada versión. Si quieres que un cambio en un archivo conservado
llegue a quien ya lo tiene instalado, quítalo de `conservar` para esa publicación.

## Mods solo de servidor

`solo_servidor` en `variantes.json` marca mods que los clientes no instalan. **SmallColonies** está ahí:
es *All Rights Reserved* y su autor bloquea las descargas fuera de CurseForge, pero solo contiene planos de
Minecolonies y Structurize se los envía a cada jugador al entrar al servidor. Por eso **tiene que estar en el
servidor de Falix**.

Si algún día un mod bloqueado sí hace falta en el cliente, la página de descargas mostrará un aviso con el
enlace para bajarlo a mano.

## La web

`web/` es la página de descargas (Vite + React + HeroUI): inicio con novedades, descargas con la guía de instalación y la guía de juego. Detalles en `web/README.md`.

- **Verla en local**: doble clic en `ver-web.bat` (la primera vez instala las dependencias; necesita Node.js 20.19 o más nuevo).
- **Publicarla**: doble clic en `subir-a-github.bat`: si hay zips de CurseForge de la versión actual los sube a la release y rehace `datos.json`; luego compila la web, la copia a la raíz del repo y hace commit y push. Solo la web: en `web/`, `npm run publicar`, y sale con el próximo `publicar.bat`.
- **Novedades**: se escriben a mano en `novedades.json` (la versión más nueva arriba). No hace falta recompilar.
- **datos.json**: lo escribe `publicar.py` en cada versión (versiones, enlaces, tamaños). `python publicar.py --solo-datos` lo rehace sin regenerar los packs. Cada versión lleva `curseforge` (enlace a la release) solo si su zip de CurseForge está en `../exportar-<versión>/`.

`plantilla.html` ya no se usa: `publicar.py` no toca `index.html`.

## Prism y CurseForge

La forma recomendada es Prism Launcher (zip pequeño + packwiz: se actualiza solo). La web también ofrece un zip por versión
para la app de CurseForge, que no se actualiza solo: con cada versión nueva hay que importar el zip nuevo.

- `exportar-curseforge.bat` (o `python exportar_curseforge.py`) crea en `../exportar-<versión>/` los zips
  `InfectCozy-<Versión>-CurseForge-<versión>.zip` a partir de `packs/`: `manifest.json` con lo que es de CurseForge
  (la app lo descarga sola) y `overrides/` con configs y lo de Modrinth o del repo.
- Pesan entre 40 y 70 MB, así que no van en el repo sino en la release `v<versión>` de GitHub. `subir-a-github.bat` los sube
  (`python exportar_curseforge.py --solo-subir`, solo los que faltan o cambiaron) con GitHub CLI (`gh`, hace falta
  `gh auth login` una vez); si no tienes `gh`, abre la página de la release para arrastrarlos a mano.
- Los nombres no llevan espacios porque GitHub los cambia por puntos en las releases y el enlace de la web dejaría de valer.
- El repo de la release es `repo_github` en `variantes.json`.

## Herramientas

`../_packwiz-herramientas/` tiene `packwiz.exe` y `packwiz-installer-bootstrap.jar`. No están en el repo.

**RenderScale** va solo en Lite y Ultra Low (desactivado en la instancia, pedido en `agregar`). En Detallada se quita: junto con Distant Horizons e Iris hacía que los LODs se dibujaran encima del mundo al cargar o al cambiar el tamaño de la ventana. **Window Resize Fix (Iris & Distant Horizons)** (irisscalefix) necesita Iris, así que Lite y Ultra Low lo tienen en `excluir`.
