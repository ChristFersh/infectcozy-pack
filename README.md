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
- Genera las 4 versiones en `packs/`, los zips para Prism en `descargas/` y la página `index.html`.
- Hace commit y push a GitHub; GitHub Pages lo publica.

## `variantes.json`

| Clave | Para qué sirve |
|---|---|
| `excluir_siempre` | Archivos que nunca se publican (Xray, cachés, `.bak`, perfiles de spark...). |
| `alojar_en_repo` | Mods bloqueados en CurseForge pero con licencia libre (MIT, Apache): el jar va dentro del repo. |
| `conservar` | Se instalan la primera vez y después **no se pisan nunca**: `options.txt`, gráficos, shaders... Así cada amigo conserva sus teclas y ajustes. |
| `variantes[].excluir` | Qué quita cada versión respecto a tu instancia (Detallada = tu instancia completa). |

Los patrones valen como nombre del proyecto de CurseForge (`"Iris Shaders"`), nombre de archivo (`"punchy-*.jar"`)
o ruta (`"shaderpacks/*"`).

**Si añades un mod visual o pesado**, acuérdate de ponerlo en `excluir` de Lite (y de Media-Lite si toca).

## `ajustes/<versión>/`

Archivos que reemplazan a los de tu instancia solo en esa versión (sacados de los zips 1.4): `options.txt`
con las teclas para amigos, sodium al mínimo en Lite, renderscale al 80 %, etc. Casi todos están en
`conservar`, así que solo afectan a instalaciones nuevas. Si quieres que un cambio en un archivo conservado
llegue a quien ya lo tiene instalado, quítalo de `conservar` para esa publicación.

## Mods que se bajan a mano

**SmallColonies** es *All Rights Reserved* y su autor bloquea las descargas fuera de CurseForge, así que no
puede ir en el repo. La primera vez (y cuando cambie de versión) a tus amigos les sale un aviso con el enlace
y la carpeta donde guardarlo. La página de descargas lo explica.

## Herramientas

`../_packwiz-herramientas/` tiene `packwiz.exe` y `packwiz-installer-bootstrap.jar`. No están en el repo.
