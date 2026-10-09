# Infect Cozy con packwiz

Tus amigos juegan con Prism Launcher. Cada vez que abren el juego, packwiz compara su instalación con lo
publicado aquí y descarga solo lo que cambió: mods, configs, resource packs y shaders.

## Sacar una versión nueva

1. Haz tus cambios como siempre en la instancia de CurseForge (añadir o quitar mods, tocar configs).
2. Doble clic en `publicar.bat` y escribe el número de versión (o pulsa Enter para aceptar el que sugiere).
3. Listo. En unos 10 minutos les llega a todos al abrir el juego.

`python publicar.py 1.6 --sin-subir` genera los packs sin subirlos, por si quieres revisar antes.

## Qué hace `publicar.py`

- Lee `minecraftinstance.json` y la carpeta `mods/`, `resourcepacks/`, `shaderpacks/` y `datapacks/` de la instancia.
- Cada archivo sale de CurseForge si se puede; si su autor bloquea las descargas fuera de la app de CurseForge,
  lo busca idéntico en Modrinth; si no está en ningún sitio, copia el archivo tal cual al repo.
- Copia `config/`, `defaultconfigs/` y `moonlight-global-datapacks/`.
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
`conservar`, así que solo afectan a instalaciones nuevas. Si quieres que un cambio en un archivo conservado
llegue a quien ya lo tiene instalado, quítalo de `conservar` para esa publicación.

## Mods solo de servidor

`solo_servidor` en `variantes.json` marca mods que los clientes no instalan. **SmallColonies** está ahí:
es *All Rights Reserved* y su autor bloquea las descargas fuera de CurseForge, pero solo contiene planos de
Minecolonies y Structurize se los envía a cada jugador al entrar al servidor. Por eso **tiene que estar en el
servidor de Falix**.

Si algún día un mod bloqueado sí hace falta en el cliente, la página de descargas mostrará un aviso con el
enlace para bajarlo a mano.

## Zips completos (`exportar_zips.py`)

Para quien no usa Prism o quiere el pack sin depender de GitHub: `python exportar_zips.py 1.6` crea `../exportar-1.6/`
con un zip por versión (formato de CurseForge: `manifest.json` + `overrides/` con todos los mods dentro), su LEEME y las
guías en PDF de `guias/`. Elige los archivos con la misma lógica que `publicar.py` (`excluir_siempre`, `solo_servidor`,
`excluir` de cada versión y `ajustes/<versión>/`). `--solo lite media` hace solo esas versiones; `--lista` solo muestra
qué lleva cada una. Cierra el juego antes, para que no cambie configs mientras se arman.

## Herramientas

`../_packwiz-herramientas/` tiene `packwiz.exe` y `packwiz-installer-bootstrap.jar`. No están en el repo.
