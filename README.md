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

## La web

`web/` es la página de descargas (Vite + React + HeroUI): inicio con novedades, descargas con la guía de instalación y la guía de juego. Detalles en `web/README.md`.

- **Verla en local**: doble clic en `ver-web.bat` (la primera vez instala las dependencias; necesita Node.js 20.19 o más nuevo).
- **Publicarla**: doble clic en `subir-a-github.bat`: compila la web, la copia a la raíz del repo y hace commit y push. Solo la web: en `web/`, `npm run publicar`, y sale con el próximo `publicar.bat`.
- **Novedades**: se escriben a mano en `novedades.json` (la versión más nueva arriba). No hace falta recompilar.
- **datos.json**: lo escribe `publicar.py` en cada versión (versiones, enlaces, tamaños). `python publicar.py --solo-datos` lo rehace sin regenerar los packs.

`plantilla.html` ya no se usa: `publicar.py` no toca `index.html`.

## Solo Prism

El pack se distribuye únicamente con Prism Launcher (zip pequeño + packwiz). Desde la 1.7.2 ya no se generan zips
completos para CurseForge o el launcher oficial, ni se suben a GitHub Releases.

Si alguien necesita importarlo en la app de CurseForge, doble clic en `exportar-curseforge.bat` (o `python exportar_curseforge.py`) crea en `../exportar-<versión>/`
un zip por versión a partir de `packs/`: `manifest.json` con lo que es de CurseForge (la app lo descarga sola) y
`overrides/` con configs y lo de Modrinth o del repo. No se publican: se comparten a mano.

## Herramientas

`../_packwiz-herramientas/` tiene `packwiz.exe` y `packwiz-installer-bootstrap.jar`. No están en el repo.
