#!/usr/bin/env bash
# Compila y ejecuta el volcado de modelos de Java de los jefes (ver README.md).
# Uso: ./volcar.sh [id ...]        (sin ids vuelca todos)
# Variables (con valores por defecto para la VM de Cowork):
#   JDK      carpeta bin de un JDK 21
#   INSTALL  carpeta "Install" de CurseForge (libraries/ y versions/)
#   MODS     carpeta mods/ de la instancia
#   SALIDA   dónde escribir <id>.json y <id>.png
#   TRABAJO  carpeta temporal para las clases compiladas
set -euo pipefail
AQUI="$(cd "$(dirname "$0")" && pwd)"
JDK="${JDK:-$HOME/herr/jdk-21.0.12.1+1/bin}"
INSTALL="${INSTALL:-$HOME/mnt/Install}"
MODS="${MODS:-$HOME/mnt/horror/mods}"
SALIDA="${SALIDA:-$AQUI/../../public/modelos}"
TRABAJO="${TRABAJO:-$HOME/herr/trab/volcar}"
MC=1.21.1-20240808.144430
NEO=21.1.252
mkdir -p "$TRABAJO/clases" "$TRABAJO/parches"

# Classpath: clases parcheadas por NeoForge, cliente con nombres de Mojang, recursos de vanilla, NeoForge,
# librerías de NeoForge y de Minecraft (según los .json de versions/) y los mods.
cp="$TRABAJO/parches"
cp="$cp:$INSTALL/libraries/net/neoforged/neoforge/$NEO/neoforge-$NEO-client.jar"
cp="$cp:$INSTALL/libraries/net/minecraft/client/$MC/client-$MC-srg.jar"
cp="$cp:$INSTALL/libraries/net/minecraft/client/$MC/client-$MC-extra.jar"
cp="$cp:$INSTALL/libraries/net/neoforged/neoforge/$NEO/neoforge-$NEO-universal.jar"
for v in "neoforge-$NEO/neoforge-$NEO.json" "1.21.1/1.21.1.json"; do
  while read -r p; do
    [ -f "$INSTALL/libraries/$p" ] && cp="$cp:$INSTALL/libraries/$p"
  done < <(python3 -c "
import json,sys
for l in json.load(open(sys.argv[1]))['libraries']:
    a=l.get('downloads',{}).get('artifact')
    if a: print(a['path'])" "$INSTALL/versions/$v")
done
for m in "L_Ender's Cataclysm 1.21.1-3.33.jar" lionfishapi-3.1.jar mowziesmobs-1.21.1-1.8.2.jar \
         geckolib-neoforge-1.21.1-4.9.3.jar curios-neoforge-9.5.1+1.21.1.jar; do
  cp="$cp:$MODS/$m"
done

"$JDK/javac" -nowarn -cp "$cp" -d "$TRABAJO/clases" "$AQUI/AbrirModelPart.java" "$AQUI/Volcar.java"
"$JDK/java" -cp "$cp:$TRABAJO/clases" AbrirModelPart "$TRABAJO/parches"
"$JDK/java" -Djava.awt.headless=true -cp "$cp:$TRABAJO/clases" Volcar "$SALIDA" "$@" 2>&1 \
  | grep -v -E "StatusConsoleListener|UnknownHostException|^\s+at |^\s+\.\.\. [0-9]+ more|^Caused by|Picked up"
