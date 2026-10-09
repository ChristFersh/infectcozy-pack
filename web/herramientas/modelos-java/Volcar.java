import com.mojang.blaze3d.vertex.PoseStack;
import com.mojang.blaze3d.vertex.VertexConsumer;
import net.minecraft.client.model.Model;
import net.minecraft.client.model.geom.ModelPart;
import org.joml.Matrix4f;
import org.joml.Vector3f;
import org.joml.Vector4f;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.InputStream;
import java.lang.reflect.Array;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

/**
 * Vuelca a JSON (formato de src/modelos/formato.ts, yArriba = false) los modelos de Java de los jefes:
 * ModelPart de vanilla, AdvancedModelBox de lionfishapi (Cataclysm) y AdvancedModelRenderer de llibrary (Mowzie's).
 *
 * Uso: java -cp <clases del juego y mods>:. Volcar <carpeta de salida> [id ...]
 *
 * Para cada modelo:
 *  1. Lo crea como lo crea su renderizador (constructor o createBodyLayer().bakeRoot()), sin setupAnim: pose de reposo.
 *  2. Recorre su árbol de partes y saca las caras ya construidas (quads de cada caja) en el espacio local de la parte.
 *  3. Comprueba el resultado: llama a renderToBuffer del propio modelo con un VertexConsumer que guarda los vértices
 *     y los compara con los que salen de componer el árbol del JSON como lo hace el visor.
 */
public class Volcar {

    // ------------------------------------------------------------------ formato de salida

    static class Parte {
        String n;
        float[] p = {0, 0, 0};
        float[] r;
        float[] s;
        boolean oculto;
        List<float[]> q = new ArrayList<>();
        List<Parte> h = new ArrayList<>();
    }

    static final List<String> avisos = new ArrayList<>();

    static void aviso(String s) {
        avisos.add(s);
        System.out.println("  AVISO: " + s);
    }

    static boolean esUno(float[] s) {
        return s == null || (s[0] == 1 && s[1] == 1 && s[2] == 1);
    }

    static boolean esCero(float[] r) {
        return r == null || (r[0] == 0 && r[1] == 0 && r[2] == 0);
    }

    /**
     * Arma una parte. Si la escala no debe afectar a los hijos (scaleChildren = false en lionfish/llibrary),
     * las cajas propias van en una subparte con la escala y los hijos cuelgan sin escalar.
     */
    static Parte nueva(String n, float[] p, float[] r, float[] s, boolean visible, boolean escalaHijos,
                       List<float[]> propias, List<Parte> hijos) {
        Parte x = new Parte();
        x.n = n;
        x.p = p;
        x.r = esCero(r) ? null : r;
        x.oculto = !visible;
        if (!esUno(s) && !escalaHijos && !hijos.isEmpty()) {
            if (!propias.isEmpty()) {
                Parte c = new Parte();
                c.n = n + "~cajas";
                c.s = s;
                c.q = propias;
                x.h.add(c);
            }
            x.h.addAll(hijos);
        } else {
            if (!esUno(s)) x.s = s;
            x.q = propias;
            x.h = hijos;
        }
        return x;
    }

    // ------------------------------------------------------------------ reflexión

    static final Map<String, Field> camposCache = new HashMap<>();

    static Field campoDe(Class<?> c, String nombre) {
        String k = c.getName() + "#" + nombre;
        Field f = camposCache.get(k);
        if (f == null) {
            try {
                f = c.getDeclaredField(nombre);
            } catch (NoSuchFieldException e) {
                throw new RuntimeException("no existe " + k);
            }
            f.setAccessible(true);
            camposCache.put(k, f);
        }
        return f;
    }

    static Object campo(Object o, Class<?> c, String nombre) {
        try {
            return campoDe(c, nombre).get(o);
        } catch (IllegalAccessException e) {
            throw new RuntimeException(e);
        }
    }

    static Object campo(Object o, String clase, String nombre) {
        return campo(o, clase(clase), nombre);
    }

    static float f(Object o, Class<?> c, String nombre) {
        return ((Number) campo(o, c, nombre)).floatValue();
    }

    static boolean b(Object o, Class<?> c, String nombre) {
        return (Boolean) campo(o, c, nombre);
    }

    static Class<?> clase(String n) {
        try {
            return Class.forName(n, false, Volcar.class.getClassLoader());
        } catch (ClassNotFoundException e) {
            return null;
        }
    }

    /** Primer campo de instancia declarado cuyo tipo es un arreglo de objetos. */
    static Object[] arregloDe(Object o) {
        for (Field fl : o.getClass().getDeclaredFields()) {
            if (Modifier.isStatic(fl.getModifiers())) continue;
            if (fl.getType().isArray() && !fl.getType().getComponentType().isPrimitive()) {
                fl.setAccessible(true);
                try {
                    return (Object[]) fl.get(o);
                } catch (IllegalAccessException e) {
                    throw new RuntimeException(e);
                }
            }
        }
        throw new RuntimeException("sin arreglo en " + o.getClass());
    }

    /** Vértice de cualquiera de las librerías: un Vector3f y dos float (u/v o textureU/textureV). */
    static float[] vertice(Object v) {
        Vector3f pos = null;
        Float u = null, vv = null;
        for (Field fl : v.getClass().getDeclaredFields()) {
            if (Modifier.isStatic(fl.getModifiers())) continue;
            fl.setAccessible(true);
            try {
                if (fl.getType() == Vector3f.class) pos = (Vector3f) fl.get(v);
                else if (fl.getName().equals("u") || fl.getName().equals("textureU")) u = fl.getFloat(v);
                else if (fl.getName().equals("v") || fl.getName().equals("textureV")) vv = fl.getFloat(v);
            } catch (IllegalAccessException e) {
                throw new RuntimeException(e);
            }
        }
        if (pos == null || u == null || vv == null) throw new RuntimeException("vértice raro: " + v.getClass());
        return new float[]{pos.x(), pos.y(), pos.z(), u, vv};
    }

    /** Caras de una caja (ModelPart.Cube, ModelBox de lionfish o de llibrary): 20 números por cara. */
    static List<float[]> caras(Object caja) {
        List<float[]> out = new ArrayList<>();
        for (Object quad : arregloDe(caja)) {
            if (quad == null) continue;
            Object[] vs = arregloDe(quad);
            if (vs.length != 4) throw new RuntimeException("cara de " + vs.length + " vértices");
            float[] c = new float[20];
            for (int i = 0; i < 4; i++) System.arraycopy(vertice(vs[i]), 0, c, i * 5, 5);
            out.add(c);
        }
        return out;
    }

    // ------------------------------------------------------------------ vanilla

    static Parte deVanilla(String n, ModelPart mp) {
        List<float[]> propias = new ArrayList<>();
        if (!mp.skipDraw)
            for (Object c : (List<?>) campo(mp, ModelPart.class, "cubes")) propias.addAll(caras(c));
        List<Parte> hijos = new ArrayList<>();
        @SuppressWarnings("unchecked")
        Map<String, ModelPart> ch = (Map<String, ModelPart>) campo(mp, ModelPart.class, "children");
        for (Map.Entry<String, ModelPart> e : ch.entrySet()) hijos.add(deVanilla(e.getKey(), e.getValue()));
        return nueva(n, new float[]{mp.x, mp.y, mp.z}, new float[]{mp.xRot, mp.yRot, mp.zRot},
                new float[]{mp.xScale, mp.yScale, mp.zScale}, mp.visible, true, propias, hijos);
    }

    // ------------------------------------------------------------------ lionfishapi (Cataclysm)

    static final String L = "com.github.L_Ender.lionfishapi.client.model.tools.";

    static Parte deLionfish(Object bx, Map<Object, String> nombres) {
        Class<?> AMB = clase(L + "AdvancedModelBox"), BMP = clase(L + "BasicModelPart");
        boolean avanzada = AMB.isInstance(bx);
        String n = nombres.get(bx);
        if (n == null) n = avanzada ? (String) campo(bx, AMB, "boxName") : "?";
        float[] p = {f(bx, BMP, "rotationPointX"), f(bx, BMP, "rotationPointY"), f(bx, BMP, "rotationPointZ")};
        float[] r = {f(bx, BMP, "rotateAngleX"), f(bx, BMP, "rotateAngleY"), f(bx, BMP, "rotateAngleZ")};
        boolean visible = b(bx, BMP, "showModel");
        List<?> cajas, hijosL;
        float[] s = null;
        boolean escalaHijos = true;
        if (avanzada) {
            // AdvancedModelBox.translateAndRotate: T(p/16) Rz Ry Rx S(xScale, yScale, zScale);
            // render(): si !scaleChildren, deshace la escala (1/max(s, 1e-4)) antes de dibujar los hijos.
            s = new float[]{f(bx, BMP, "xScale"), f(bx, BMP, "yScale"), f(bx, BMP, "zScale")};
            escalaHijos = b(bx, AMB, "scaleChildren");
            if (!escalaHijos) for (int i = 0; i < 3; i++) if (s[i] < 1e-4f) aviso(n + ": escala < 1e-4 con scaleChildren=false");
            cajas = (List<?>) campo(bx, AMB, "cubeList");
            hijosL = (List<?>) campo(bx, AMB, "childModels");
        } else {
            aviso(n + ": BasicModelPart sin escala");
            cajas = (List<?>) campo(bx, BMP, "cubeList");
            hijosL = (List<?>) campo(bx, BMP, "childModels");
        }
        List<float[]> propias = new ArrayList<>();
        for (Object c : cajas) propias.addAll(caras(c));
        List<Parte> hijos = new ArrayList<>();
        for (Object h : hijosL) hijos.add(deLionfish(h, nombres));
        return nueva(n, p, r, s, visible, escalaHijos, propias, hijos);
    }

    // ------------------------------------------------------------------ llibrary (Mowzie's Mobs)

    static final String M = "com.ilexiconn.llibrary.client.model.tools.";

    static Parte deMowzie(Object bx, Object padre, Map<Object, String> nombres) {
        Class<?> AMR = clase(M + "AdvancedModelRenderer"), BMR = clase(M + "BasicModelRenderer");
        boolean avanzada = AMR.isInstance(bx);
        String n = nombres.getOrDefault(bx, "?");
        float[] p = {f(bx, BMR, "rotationPointX"), f(bx, BMR, "rotationPointY"), f(bx, BMR, "rotationPointZ")};
        float[] r = {f(bx, BMR, "rotateAngleX"), f(bx, BMR, "rotateAngleY"), f(bx, BMR, "rotateAngleZ")};
        boolean visible = b(bx, BMR, "showModel");
        List<?> cajas, hijosL;
        float[] s = null;
        boolean escalaHijos = true, propiasOcultas = false;
        if (avanzada) {
            // AdvancedModelRenderer.translateRotate: [S(1/escala del padre) si !padre.scaleChildren] T(p/16) Rz Ry Rx S(escala)
            // render(): isHidden salta solo las cajas propias; los hijos sí se dibujan.
            s = new float[]{f(bx, AMR, "scaleX"), f(bx, AMR, "scaleY"), f(bx, AMR, "scaleZ")};
            escalaHijos = b(bx, AMR, "scaleChildren");
            propiasOcultas = b(bx, AMR, "isHidden");
            if (campo(bx, AMR, "mat4Override") != null) aviso(n + ": tiene mat4Override");
            if (f(bx, AMR, "opacity") < 1) aviso(n + ": opacidad " + f(bx, AMR, "opacity"));
            Object suPadre = campo(bx, AMR, "parent");
            if (suPadre != padre && suPadre != null) aviso(n + ": su campo parent no es quien lo dibuja");
            cajas = (List<?>) campo(bx, AMR, "cubeList");
            hijosL = (List<?>) campo(bx, AMR, "childModels");
            for (Object h : hijosL)
                if (AMR.isInstance(h) && campo(h, AMR, "parent") != bx && !escalaHijos && !esUno(s))
                    aviso(nombres.get(h) + ": no deshace la escala de " + n);
        } else {
            cajas = (List<?>) campo(bx, BMR, "cubeList");
            hijosL = (List<?>) campo(bx, BMR, "childModels");
        }
        List<float[]> propias = new ArrayList<>();
        if (!propiasOcultas) for (Object c : cajas) propias.addAll(caras(c));
        List<Parte> hijos = new ArrayList<>();
        for (Object h : hijosL) hijos.add(deMowzie(h, bx, nombres));
        return nueva(n, p, r, s, visible, escalaHijos, propias, hijos);
    }

    // ------------------------------------------------------------------ nombres y raíces

    static boolean esParte(Object o) {
        if (o == null) return false;
        if (o instanceof ModelPart) return true;
        Class<?> a = clase(L + "BasicModelPart"), b = clase(M + "BasicModelRenderer");
        return (a != null && a.isInstance(o)) || (b != null && b.isInstance(o));
    }

    /** Nombre de cada parte según el campo del modelo que la guarda. */
    static Map<Object, String> nombres(Object modelo) {
        Map<Object, String> m = new IdentityHashMap<>();
        for (Class<?> c = modelo.getClass(); c != null && c != Model.class && c != Object.class; c = c.getSuperclass()) {
            for (Field fl : c.getDeclaredFields()) {
                if (Modifier.isStatic(fl.getModifiers())) continue;
                fl.setAccessible(true);
                Object v;
                try {
                    v = fl.get(modelo);
                } catch (IllegalAccessException e) {
                    continue;
                }
                if (esParte(v)) m.putIfAbsent(v, fl.getName());
                else if (v != null && v.getClass().isArray() && !v.getClass().getComponentType().isPrimitive()) {
                    for (int i = 0; i < Array.getLength(v); i++) {
                        Object e = Array.get(v, i);
                        if (esParte(e)) m.putIfAbsent(e, fl.getName() + i);
                    }
                }
            }
        }
        return m;
    }

    static List<?> hijosDe(Object o) {
        if (o instanceof ModelPart mp) return new ArrayList<>(((Map<?, ?>) campo(mp, ModelPart.class, "children")).values());
        Class<?> AMB = clase(L + "AdvancedModelBox"), BMP = clase(L + "BasicModelPart");
        Class<?> AMR = clase(M + "AdvancedModelRenderer"), BMR = clase(M + "BasicModelRenderer");
        if (AMB != null && AMB.isInstance(o)) return (List<?>) campo(o, AMB, "childModels");
        if (BMP != null && BMP.isInstance(o)) return (List<?>) campo(o, BMP, "childModels");
        if (AMR != null && AMR.isInstance(o)) return (List<?>) campo(o, AMR, "childModels");
        return (List<?>) campo(o, BMR, "childModels");
    }

    /** Partes guardadas en campos del modelo que no son hijas de ninguna otra. */
    static List<Object> raicesCandidatas(Map<Object, String> nombres) {
        Set<Object> hijas = Collections.newSetFromMap(new IdentityHashMap<>());
        Deque<Object> pila = new ArrayDeque<>(nombres.keySet());
        Set<Object> vistos = Collections.newSetFromMap(new IdentityHashMap<>());
        while (!pila.isEmpty()) {
            Object o = pila.pop();
            if (!vistos.add(o)) continue;
            for (Object h : hijosDe(o)) {
                hijas.add(h);
                pila.push(h);
            }
        }
        List<Object> r = new ArrayList<>();
        for (Object o : nombres.keySet()) if (!hijas.contains(o)) r.add(o);
        return r;
    }

    static Parte convertir(Object raiz, Map<Object, String> nombres, String nombre) {
        if (raiz instanceof ModelPart mp) return deVanilla(nombre != null ? nombre : nombres.getOrDefault(mp, "root"), mp);
        Class<?> BMP = clase(L + "BasicModelPart");
        if (BMP != null && BMP.isInstance(raiz)) return deLionfish(raiz, nombres);
        return deMowzie(raiz, null, nombres);
    }

    // ------------------------------------------------------------------ comprobación

    /** VertexConsumer que guarda lo que dibuja el modelo (en píxeles). */
    static class Captura implements VertexConsumer {
        final List<float[]> v = new ArrayList<>();
        float[] actual;

        public VertexConsumer addVertex(float x, float y, float z) {
            actual = new float[]{x * 16, y * 16, z * 16, 0, 0, 1};
            v.add(actual);
            return this;
        }

        public VertexConsumer setColor(int r, int g, int b, int a) {
            actual[5] = a / 255f;
            return this;
        }

        public VertexConsumer setUv(float u, float vv) {
            actual[3] = u;
            actual[4] = vv;
            return this;
        }

        public VertexConsumer setUv1(int u, int vv) {
            return this;
        }

        public VertexConsumer setUv2(int u, int vv) {
            return this;
        }

        public VertexConsumer setNormal(float x, float y, float z) {
            return this;
        }
    }

    /** Compone el árbol como el visor: M = T(p) · Rz · Ry · Rx · S(s). */
    static void mundo(Parte x, Matrix4f padre, List<float[]> out) {
        if (x.oculto) return;
        Matrix4f m = new Matrix4f(padre).translate(x.p[0], x.p[1], x.p[2]);
        if (x.r != null) m.rotateZYX(x.r[2], x.r[1], x.r[0]);
        if (x.s != null) m.scale(x.s[0], x.s[1], x.s[2]);
        for (float[] c : x.q)
            for (int i = 0; i < 4; i++) {
                Vector4f v = new Vector4f(c[i * 5], c[i * 5 + 1], c[i * 5 + 2], 1).mul(m);
                out.add(new float[]{v.x, v.y, v.z, c[i * 5 + 3], c[i * 5 + 4]});
            }
        for (Parte h : x.h) mundo(h, m, out);
    }

    static String clave(float[] v) {
        return Math.round(v[0] * 20) + "," + Math.round(v[1] * 20) + "," + Math.round(v[2] * 20) + ","
                + Math.round(v[3] * 4096) + "," + Math.round(v[4] * 4096);
    }

    /** Devuelve cuántos vértices del árbol no aparecen en la captura y viceversa. */
    static int[] comparar(List<float[]> arbol, List<float[]> captura) {
        Map<String, Integer> cuenta = new HashMap<>();
        for (float[] v : captura) cuenta.merge(clave(v), 1, Integer::sum);
        int sobran = 0;
        for (float[] v : arbol) {
            String k = clave(v);
            Integer c = cuenta.get(k);
            if (c == null || c == 0) sobran++;
            else cuenta.put(k, c - 1);
        }
        int faltan = 0;
        for (int c : cuenta.values()) faltan += c;
        return new int[]{sobran, faltan};
    }

    /** a menos b (como multiconjuntos de vértices). */
    static List<float[]> restar(List<float[]> a, List<float[]> b) {
        Map<String, Integer> cuenta = new HashMap<>();
        for (float[] v : b) cuenta.merge(clave(v), 1, Integer::sum);
        List<float[]> r = new ArrayList<>();
        for (float[] v : a) {
            String k = clave(v);
            Integer c = cuenta.get(k);
            if (c != null && c > 0) cuenta.put(k, c - 1);
            else r.add(v);
        }
        return r;
    }

    /** Muestra los vértices que no casan, con el más cercano del otro lado. */
    static void detalle(List<float[]> mios, List<float[]> captura) {
        List<float[]> sobran = restar(mios, captura), faltan = restar(captura, mios);
        for (int i = 0; i < Math.min(sobran.size(), 6); i++) {
            float[] v = sobran.get(i), mejor = null;
            double dm = 1e9;
            for (float[] w : faltan) {
                double d = Math.abs(v[0] - w[0]) + Math.abs(v[1] - w[1]) + Math.abs(v[2] - w[2])
                        + 100 * (Math.abs(v[3] - w[3]) + Math.abs(v[4] - w[4]));
                if (d < dm) { dm = d; mejor = w; }
            }
            System.out.println("    sobra " + Arrays.toString(v) + "  más cercano " + Arrays.toString(mejor));
        }
    }

    static List<float[]> capturar(Model modelo) {
        Captura cap = new Captura();
        modelo.renderToBuffer(new PoseStack(), cap, 0xF000F0, 655360, -1);
        return cap.v;
    }

    // ------------------------------------------------------------------ JSON

    static String num(float x, int dec) {
        if (Float.isNaN(x) || Float.isInfinite(x)) throw new RuntimeException("número no válido");
        double f = Math.pow(10, dec);
        double r = Math.round(x * f) / f;
        if (r == Math.rint(r) && Math.abs(r) < 1e9) return Long.toString((long) r);
        String s = String.format(Locale.ROOT, "%." + dec + "f", r);
        s = s.replaceAll("0+$", "");
        if (s.equals("-0")) s = "0";
        return s;
    }

    static String vec(float[] v, int dec) {
        return "[" + num(v[0], dec) + ", " + num(v[1], dec) + ", " + num(v[2], dec) + "]";
    }

    static String esc(String s) {
        return "\"" + s.replace("\\", "\\\\").replace("\"", "\\\"") + "\"";
    }

    static void json(Parte x, StringBuilder sb, String sang) {
        sb.append(sang).append("{\"n\": ").append(esc(x.n)).append(", \"p\": ").append(vec(x.p, 4));
        if (x.r != null) sb.append(", \"r\": ").append(vec(x.r, 6));
        if (x.s != null) sb.append(", \"s\": ").append(vec(x.s, 5));
        if (x.oculto) sb.append(", \"oculto\": true");
        if (!x.q.isEmpty()) {
            sb.append(", \"q\": [");
            boolean primero = true;
            for (float[] c : x.q)
                for (int i = 0; i < 20; i++) {
                    if (!primero) sb.append(",");
                    primero = false;
                    sb.append(num(c[i], (i % 5) < 3 ? 4 : 6));
                }
            sb.append("]");
        }
        if (!x.h.isEmpty()) {
            sb.append(", \"h\": [\n");
            for (int i = 0; i < x.h.size(); i++) {
                json(x.h.get(i), sb, sang + "  ");
                sb.append(i + 1 < x.h.size() ? ",\n" : "\n");
            }
            sb.append(sang).append("]");
        }
        sb.append("}");
    }

    // ------------------------------------------------------------------ jefes

    static class Jefe {
        String id, nombre, textura, brillo;
        float escala = 1;
        String claseModelo;
        boolean capa;                    // createBodyLayer().bakeRoot() en vez de constructor sin argumentos
        String[] ocultar = {};           // partes que en reposo no se ven (según el estado inicial de la entidad)
        java.util.function.Consumer<Model> pose;      // ajustes fijos que el juego aplica siempre en setupAnim
        java.util.function.Supplier<Model> mascaraBrillo; // modelo que solo dibuja lo que brilla (brillo = textura recortada)

        Jefe(String id, String nombre, String claseModelo, boolean capa, String textura, String brillo, float escala) {
            this.id = id;
            this.nombre = nombre;
            this.claseModelo = claseModelo;
            this.capa = capa;
            this.textura = textura;
            this.brillo = brillo;
            this.escala = escala;
        }

        Jefe ocultar(String... n) {
            ocultar = n;
            return this;
        }

        Jefe pose(java.util.function.Consumer<Model> p) {
            pose = p;
            return this;
        }

        Jefe mascaraBrillo(java.util.function.Supplier<Model> m) {
            mascaraBrillo = m;
            return this;
        }
    }

    static final String C = "com.github.L_Ender.cataclysm.client.model.entity.";
    static final String T = "assets/cataclysm/textures/entity/";
    static final String MZ = "com.bobmowzie.mowziesmobs.client.model.entity.";
    static final String TM = "assets/mowziesmobs/textures/entity/";
    static final String DRAGON = "dragon";

    static final List<Jefe> JEFES = List.of(
            new Jefe("wither", "Wither", "net.minecraft.client.model.WitherBossModel", true,
                    "assets/minecraft/textures/entity/wither/wither.png", null, 2), // WitherBossRenderer.scale: 2 (sin invulnerabilidad)
            // Sin clase de modelo: EnderDragonRenderer.DragonModel dibuja el cuello y la cola repitiendo la misma pieza
            // según el historial de vuelo de la entidad; se arma a mano en dragon().
            new Jefe("dragon-del-end", "Dragón del End", DRAGON, true,
                    "assets/minecraft/textures/entity/enderdragon/dragon.png",
                    "assets/minecraft/textures/entity/enderdragon/dragon_eyes.png", 1),
            // Ignis_Entity.SHOW_SHIELD empieza en true: el escudo se ve.
            new Jefe("ignis", "Ignis", C + "Ignis_Model", false, T + "ignis/ignis_idle_0.png", null, 1),
            new Jefe("monstruosidad-de-netherita", "Monstruosidad de netherita", C + "Netherite_Monstrosity_Model", true,
                    T + "monstrosity/netherite_monstrosity.png", T + "monstrosity/netherite_monstrosity_layer.png", 1),
            new Jefe("guardian-ender", "Guardián ender", C + "Ender_Guardian_Model", false,
                    T + "ender_guardian.png", T + "ender_guardian_layer.png", 1),
            new Jefe("golem-de-ender", "Gólem de ender", C + "Ender_Golem_Model", false,
                    T + "ender_golem.png", T + "ender_golem_layer.png", 1),
            new Jefe("el-heraldo", "El Heraldo", C + "The_Harbinger_Model", false,
                    T + "harbinger/the_harbinger.png", T + "harbinger/the_harbinger_layer.png", 2),
            new Jefe("el-leviatan", "El Leviatán", C + "The_Leviathan_Model", false,
                    T + "leviathan/the_leviathan.png", T + "leviathan/the_leviathan_layer.png", 1.75f),
            // Ancient_Remnant_Entity.NECKLACE empieza en true: el collar se ve y no duerme.
            new Jefe("remanente-antiguo", "Remanente antiguo", C + "Ancient_Remnant_Rework_Model", true,
                    T + "ancient_remnant/ancient_remnant.png", T + "ancient_remnant/ancient_remnant_layer.png", 1),
            // setupAnim: mazas si WEAPON == 0 (valor inicial), arco si 1, alabarda si 2.
            new Jefe("maledictus", "Maledictus", C + "Maledictus_Model", true,
                    T + "maledictus/maledictus_armor.png", T + "maledictus/maledictus_ghost.png", 1)
                    .ocultar("bow", "halberd"),
            // setupAnim: ojos si EYE, cadena si CHAIN_ANCHOR, segunda ancla si duerme; las tres empiezan en false.
            new Jefe("scylla", "Scylla", C + "Scylla_Model", true,
                    T + "scylla/scylla_no_snake.png", T + "scylla/scylla_snake.png", 1.15f)
                    .ocultar("l_eye", "r_eye", "chain_main", "anchor2"),
            new Jefe("caballero-de-hierro-forjado", "Caballero de hierro forjado", MZ + "ModelWroughtnaut", false,
                    TM + "wroughtnaut.png", null, 1)
                    .pose(Volcar::poseWroughtnaut)
                    .mascaraBrillo(() -> {
                        // WroughtnautEyesLayer: new ModelWroughtnaut(true) (solo los ojos) con la misma textura y RenderType eyes.
                        try {
                            return (Model) Class.forName(MZ + "ModelWroughtnaut").getConstructor(boolean.class).newInstance(true);
                        } catch (Exception e) {
                            throw new RuntimeException(e);
                        }
                    }),
            new Jefe("frostmaw", "Frostmaw", MZ + "ModelFrostmaw", false, TM + "frostmaw.png", null, 1),
            new Jefe("naga", "Naga", MZ + "ModelNaga", false, TM + "naga.png", null, 1)
    );

    // ------------------------------------------------------------------ poses

    /** Suma a un campo float de la parte guardada en el campo `parte` del modelo (como en el bytecode: en double). */
    static void sumar(Object modelo, String parte, String campo, double d) {
        try {
            Field fp = null;
            for (Class<?> c = modelo.getClass(); c != null && fp == null; c = c.getSuperclass()) {
                try {
                    fp = c.getDeclaredField(parte);
                } catch (NoSuchFieldException ignored) {
                }
            }
            fp.setAccessible(true);
            Object p = fp.get(modelo);
            Field f = null;
            for (Class<?> c = p.getClass(); c != null && f == null; c = c.getSuperclass()) {
                try {
                    f = c.getDeclaredField(campo);
                } catch (NoSuchFieldException ignored) {
                }
            }
            f.setAccessible(true);
            f.setFloat(p, (float) (f.getFloat(p) + d));
        } catch (Exception e) {
            throw new RuntimeException(parte + "." + campo, e);
        }
    }

    /**
     * ModelWroughtnaut.setDefaultAngles (lo llama setupAnim en cada fotograma, después de resetToDefaultPose): rama
     * "activo" (de pie, con los ojos encendidos), mirando al frente, sin caminar (walkAnim = 0) y en el fotograma 0.
     * Con esos valores, bob/walk/swing no mueven nada; quedan estos ajustes fijos.
     */
    static void poseWroughtnaut(Model m) {
        String X = "rotateAngleX", Y = "rotateAngleY", Z = "rotateAngleZ";
        sumar(m, "shoulderLeft", Z, -0.4);
        sumar(m, "shoulderRight", Z, 0.35);
        sumar(m, "shoulderLeft", Y, -0.3);
        sumar(m, "shoulderRight", Y, 0.2);
        sumar(m, "upperArmLeft", Z, 0.5);
        sumar(m, "upperArmRight", Z, 0.5);
        sumar(m, "upperArmLeft", Y, -0.5);
        sumar(m, "upperArmRight", Y, 0.3);
        sumar(m, "lowerArmLeft", Z, 1.5);
        sumar(m, "lowerArmRight", Z, -1.3);
        sumar(m, "lowerArmLeft", Y, 0.3);
        sumar(m, "lowerArmRight", Y, 0.7);
        sumar(m, "handRight", Z, 0.3);
        sumar(m, "handRight", X, -0.2);
        sumar(m, "handLeftJoint", X, 1.6);
        sumar(m, "handLeftJoint", Z, -0.5);
        sumar(m, "axeHandle", Y, 0.8);
        // Parte final (siempre): la espada de la espalda.
        sumar(m, "swordJoint", "rotationPointX", 2);
        sumar(m, "swordJoint", "rotationPointZ", -3);
        sumar(m, "swordJoint", Y, 1.3);
        sumar(m, "swordJoint", X, -0.5);
        sumar(m, "swordJoint", Z, -0.5);
        sumar(m, "sword", "rotationPointX", -8);
        sumar(m, "sword", "rotationPointZ", -5.5);
        sumar(m, "sword", "rotationPointY", -5);
        try {
            Object espada = campo(m, m.getClass(), "sword");
            espada.getClass().getMethod("setScale", float.class).invoke(espada, 1.7f);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    // ------------------------------------------------------------------ dragón del End

    static ModelPart hijo(ModelPart p, String nombre) {
        if (p.hasChild(nombre)) return p.getChild(nombre);
        @SuppressWarnings("unchecked")
        Map<String, ModelPart> ch = (Map<String, ModelPart>) campo(p, ModelPart.class, "children");
        for (ModelPart h : ch.values()) {
            ModelPart r = hijo(h, nombre);
            if (r != null) return r;
        }
        return null;
    }

    /**
     * EnderDragonRenderer.DragonModel.renderToBuffer, con el dragón volando quieto: todas las posiciones del historial
     * (getLatencyPos) iguales, así que las diferencias de giro/altura valen 0 y getHeadPartYOffset devuelve 0; flapTime = 0.
     */
    static List<Parte> dragon() throws Exception {
        Class<?> r = Class.forName("net.minecraft.client.renderer.entity.EnderDragonRenderer");
        Object capa = r.getMethod("createBodyLayer").invoke(null);
        ModelPart raiz = (ModelPart) capa.getClass().getMethod("bakeRoot").invoke(capa);
        ModelPart head = hijo(raiz, "head"), jaw = hijo(raiz, "jaw"), neck = hijo(raiz, "neck"), body = hijo(raiz, "body");
        ModelPart lw = hijo(raiz, "left_wing"), lwt = hijo(raiz, "left_wing_tip");
        ModelPart rw = hijo(raiz, "right_wing"), rwt = hijo(raiz, "right_wing_tip");
        float flap = 0;
        jaw.xRot = (float) (Math.sin(flap * 6.2831855f) + 1.0) * 0.2f;
        float f1 = (float) (Math.sin(flap * 6.2831855f - 1.0f) + 1.0);
        f1 = (f1 * f1 + f1 * 2.0f) * 0.05f;
        // poseStack.translate(0, f1 - 2, -3); mulPose(XP.rotationDegrees(f1 * 2))
        Parte grupo = new Parte();
        grupo.n = "dragon";
        grupo.p = new float[]{0, (f1 - 2.0f) * 16, -3.0f * 16};
        grupo.r = new float[]{f1 * 2.0f * 0.017453292f, 0, 0};
        float x = 0, y = 20, z = -12, f15 = flap * 6.2831855f;
        for (int i = 0; i < 5; i++) {
            float f18 = (float) Math.cos(i * 0.45f + f15) * 0.15f;
            neck.yRot = 0;
            neck.xRot = f18;
            neck.zRot = 0;
            neck.y = y;
            neck.z = z;
            neck.x = x;
            y += net.minecraft.util.Mth.sin(neck.xRot) * 10.0f;
            z -= net.minecraft.util.Mth.cos(neck.yRot) * net.minecraft.util.Mth.cos(neck.xRot) * 10.0f;
            x -= net.minecraft.util.Mth.sin(neck.yRot) * net.minecraft.util.Mth.cos(neck.xRot) * 10.0f;
            grupo.h.add(deVanilla("cuello" + (i + 1), neck));
        }
        head.y = y;
        head.z = z;
        head.x = x;
        head.xRot = head.yRot = head.zRot = 0;
        grupo.h.add(deVanilla("head", head));
        // pushPose; translate(0,1,0); ZP(-f13*1.5) con f13 = 0; translate(0,-1,0): no cambia nada.
        body.zRot = 0;
        grupo.h.add(deVanilla("body", body));
        float f17 = flap * 6.2831855f;
        lw.xRot = 0.125f - (float) Math.cos(f17) * 0.2f;
        lw.yRot = -0.25f;
        lw.zRot = -((float) (Math.sin(f17) + 0.125)) * 0.8f;
        lwt.zRot = (float) (Math.sin(f17 + 2.0f) + 0.5) * 0.75f;
        rw.xRot = lw.xRot;
        rw.yRot = -lw.yRot;
        rw.zRot = -lw.zRot;
        rwt.zRot = -lwt.zRot;
        for (String lado : new String[]{"left", "right"}) {
            ModelPart ala = hijo(raiz, lado + "_wing");
            ModelPart pd = hijo(raiz, lado + "_front_leg"), pdp = hijo(raiz, lado + "_front_leg_tip"), pdpie = hijo(raiz, lado + "_front_foot");
            ModelPart pt = hijo(raiz, lado + "_hind_leg"), ptp = hijo(raiz, lado + "_hind_leg_tip"), ptpie = hijo(raiz, lado + "_hind_foot");
            pt.xRot = 1.0f + f1 * 0.1f;
            ptp.xRot = 0.5f + f1 * 0.1f;
            ptpie.xRot = 0.75f + f1 * 0.1f;
            pd.xRot = 1.3f + f1 * 0.1f;
            pdp.xRot = -0.5f - f1 * 0.1f;
            pdpie.xRot = 0.75f + f1 * 0.1f;
            grupo.h.add(deVanilla(lado + "_wing", ala));
            grupo.h.add(deVanilla(lado + "_front_leg", pd));
            grupo.h.add(deVanilla(lado + "_hind_leg", pt));
        }
        // Cola: 12 veces la pieza del cuello.
        float f18 = -net.minecraft.util.Mth.sin(flap * 6.2831855f) * 0.0f;
        y = 10;
        z = 60;
        x = 0;
        for (int k = 0; k < 12; k++) {
            f18 += net.minecraft.util.Mth.sin(k * 0.45f + f15) * 0.05f;
            neck.yRot = (0 * 1.5f + 180.0f) * 0.017453292f;
            neck.xRot = f18;
            neck.zRot = 0;
            neck.y = y;
            neck.z = z;
            neck.x = x;
            y += net.minecraft.util.Mth.sin(neck.xRot) * 10.0f;
            z -= net.minecraft.util.Mth.cos(neck.yRot) * net.minecraft.util.Mth.cos(neck.xRot) * 10.0f;
            x -= net.minecraft.util.Mth.sin(neck.yRot) * net.minecraft.util.Mth.cos(neck.xRot) * 10.0f;
            grupo.h.add(deVanilla("cola" + (k + 1), neck));
        }
        return List.of(grupo);
    }

    // ------------------------------------------------------------------ brillo recortado

    /** Copia de la textura con solo los píxeles que caen en las caras que dibuja `mascara`. */
    static void brilloRecortado(Model mascara, Path textura, Path destino) throws Exception {
        BufferedImage tex = ImageIO.read(textura.toFile());
        int w = tex.getWidth(), h = tex.getHeight();
        BufferedImage out = new BufferedImage(w, h, BufferedImage.TYPE_INT_ARGB);
        List<float[]> vs = capturar(mascara);
        for (int i = 0; i + 3 < vs.size(); i += 4) {
            float u0 = 9, u1 = -9, v0 = 9, v1 = -9;
            for (int k = 0; k < 4; k++) {
                float[] v = vs.get(i + k);
                u0 = Math.min(u0, v[3]); u1 = Math.max(u1, v[3]);
                v0 = Math.min(v0, v[4]); v1 = Math.max(v1, v[4]);
            }
            for (int py = Math.max(0, Math.round(v0 * h)); py < Math.min(h, Math.round(v1 * h)); py++)
                for (int px = Math.max(0, Math.round(u0 * w)); px < Math.min(w, Math.round(u1 * w)); px++)
                    out.setRGB(px, py, tex.getRGB(px, py));
        }
        ImageIO.write(out, "png", destino.toFile());
        System.out.println("  brillo recortado de " + (vs.size() / 4) + " caras -> " + destino.getFileName());
    }

    static Model crear(Jefe j) throws Exception {
        Class<?> c = Class.forName(j.claseModelo);
        if (!j.capa) return (Model) c.getConstructor().newInstance();
        Method cbl;
        Object capa;
        try {
            cbl = c.getMethod("createBodyLayer");
            capa = cbl.invoke(null);
        } catch (NoSuchMethodException e) {
            Class<?> cd = Class.forName("net.minecraft.client.model.geom.builders.CubeDeformation");
            cbl = c.getMethod("createBodyLayer", cd);
            capa = cbl.invoke(null, cd.getField("NONE").get(null));
        }
        ModelPart raiz = (ModelPart) capa.getClass().getMethod("bakeRoot").invoke(capa);
        return (Model) c.getConstructor(ModelPart.class).newInstance(raiz);
    }

    static List<Object> raicesDe(Model modelo, Map<Object, String> nombres) {
        for (Class<?> c = modelo.getClass(); c != null; c = c.getSuperclass()) {
            try {
                Method m = c.getDeclaredMethod("root");
                if (m.getParameterCount() == 0) {
                    m.setAccessible(true);
                    Object r = m.invoke(modelo);
                    if (esParte(r)) return List.of(r);
                }
            } catch (NoSuchMethodException ignored) {
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
        return raicesCandidatas(nombres);
    }

    static void marcarOcultas(Parte x, Set<String> ocultar) {
        if (ocultar.contains(x.n)) x.oculto = true;
        for (Parte h : x.h) marcarOcultas(h, ocultar);
    }

    static void uvFuera(Parte x) {
        for (float[] c : x.q) {
            boolean fuera = false;
            for (int i = 0; i < 4; i++) {
                float u = c[i * 5 + 3], v = c[i * 5 + 4];
                if (u < -1e-6 || u > 1 + 1e-6 || v < -1e-6 || v > 1 + 1e-6) fuera = true;
            }
            if (fuera) {
                // área de la cara (si es 0 no se ve)
                Vector3f a = new Vector3f(c[0], c[1], c[2]), b2 = new Vector3f(c[5], c[6], c[7]),
                        d = new Vector3f(c[15], c[16], c[17]);
                float area = new Vector3f(b2).sub(a).cross(new Vector3f(d).sub(a)).length();
                System.out.printf(Locale.ROOT, "    UV fuera en %s: u %.3f..%.3f v %.3f..%.3f área %.2f%n", x.n,
                        Math.min(Math.min(c[3], c[8]), Math.min(c[13], c[18])), Math.max(Math.max(c[3], c[8]), Math.max(c[13], c[18])),
                        Math.min(Math.min(c[4], c[9]), Math.min(c[14], c[19])), Math.max(Math.max(c[4], c[9]), Math.max(c[14], c[19])), area);
            }
        }
        for (Parte h : x.h) uvFuera(h);
    }

    static int contarCaras(Parte x) {
        int n = x.q.size();
        for (Parte h : x.h) n += contarCaras(h);
        return n;
    }

    static void copiarRecurso(String ruta, Path destino) throws Exception {
        try (InputStream in = Volcar.class.getClassLoader().getResourceAsStream(ruta)) {
            if (in == null) throw new RuntimeException("no está en el classpath: " + ruta);
            Files.write(destino, in.readAllBytes());
        }
        BufferedImage img = ImageIO.read(destino.toFile());
        System.out.println("  textura " + destino.getFileName() + ": " + img.getWidth() + "x" + img.getHeight());
    }

    static void volcar(Jefe j, Path salida) throws Exception {
        System.out.println("== " + j.id);
        if (j.claseModelo.equals(DRAGON)) {
            escribir(j, dragon(), salida);
            System.out.println("  armado a mano desde DragonModel.renderToBuffer (sin comprobación: necesita la entidad)");
            return;
        }
        Model modelo = crear(j);
        if (j.pose != null) j.pose.accept(modelo);
        Map<Object, String> nombres = nombres(modelo);
        List<Object> raices = raicesDe(modelo, nombres);
        List<Parte> partes = new ArrayList<>();
        for (Object r : raices) partes.add(convertir(r, nombres, null));
        List<float[]> captura = capturar(modelo);
        if (raices.size() > 1) {
            // Sin root(): se quedan las raíces cuyas caras dibuja de verdad renderToBuffer (de la más grande a la más
            // pequeña, gastando los vértices capturados para no contar dos veces una parte que cuelga de dos sitios).
            Map<Parte, List<float[]>> vsDe = new IdentityHashMap<>();
            for (Parte p : partes) {
                List<float[]> vs = new ArrayList<>();
                mundo(p, new Matrix4f(), vs);
                vsDe.put(p, vs);
            }
            List<Parte> orden = new ArrayList<>(partes);
            orden.sort((a, b2) -> vsDe.get(b2).size() - vsDe.get(a).size());
            List<float[]> quedan = new ArrayList<>(captura);
            Set<Parte> dibujadas = Collections.newSetFromMap(new IdentityHashMap<>());
            for (Parte p : orden) {
                List<float[]> vs = vsDe.get(p);
                if (!vs.isEmpty() && comparar(vs, quedan)[0] == 0) {
                    dibujadas.add(p);
                    quedan = restar(quedan, vs);
                } else System.out.println("  raíz descartada: " + p.n + " (" + vs.size() + " vértices)");
            }
            partes.removeIf(p -> !dibujadas.contains(p));
        }
        // Comprobación contra lo que dibuja el propio modelo (antes de ocultar nada a mano).
        List<float[]> mios = new ArrayList<>();
        for (Parte p : partes) mundo(p, new Matrix4f(), mios);
        int[] dif = comparar(mios, captura);
        int caras = 0;
        for (Parte p : partes) caras += contarCaras(p);
        System.out.println("  raíces: " + partes.stream().map(p -> p.n).toList() + "  caras: " + caras
                + "  vértices dibujados por el juego: " + captura.size() + "  míos: " + mios.size()
                + "  sobran: " + dif[0] + "  faltan: " + dif[1]);
        if (dif[0] + dif[1] > 0) detalle(mios, captura);
        // Caras con UV fuera de 0..1 (el juego repite la textura; el visor la estira en el borde).
        for (Parte p : partes) uvFuera(p);
        float minU = 9, maxU = -9, minV = 9, maxV = -9;
        for (float[] v : captura) {
            minU = Math.min(minU, v[3]); maxU = Math.max(maxU, v[3]);
            minV = Math.min(minV, v[4]); maxV = Math.max(maxV, v[4]);
        }
        System.out.println("  UV: u " + minU + ".." + maxU + "  v " + minV + ".." + maxV);
        escribir(j, partes, salida);
        if (j.mascaraBrillo != null)
            brilloRecortado(j.mascaraBrillo.get(), salida.resolve(j.id + ".png"), salida.resolve(j.id + "_brillo.png"));
    }

    static void escribir(Jefe j, List<Parte> partes, Path salida) throws Exception {
        Set<String> ocultar = new HashSet<>(Arrays.asList(j.ocultar));
        for (Parte p : partes) marcarOcultas(p, ocultar);
        Set<String> todas = new HashSet<>();
        Deque<Parte> pila = new ArrayDeque<>(partes);
        while (!pila.isEmpty()) {
            Parte p = pila.pop();
            todas.add(p.n);
            pila.addAll(p.h);
        }
        for (String n : ocultar) if (!todas.contains(n)) aviso("no existe la parte a ocultar " + n);
        if (!ocultar.isEmpty()) System.out.println("  ocultas: " + ocultar);
        boolean conBrillo = j.brillo != null || j.mascaraBrillo != null;
        StringBuilder sb = new StringBuilder();
        sb.append("{\"formato\": 1, \"id\": ").append(esc(j.id)).append(", \"nombre\": ").append(esc(j.nombre))
                .append(", \"textura\": ").append(esc(j.id + ".png"));
        if (conBrillo) sb.append(", \"brillo\": ").append(esc(j.id + "_brillo.png"));
        sb.append(", \"yArriba\": false");
        if (j.escala != 1) sb.append(", \"escala\": ").append(num(j.escala, 4));
        sb.append(", \"raiz\": [\n");
        for (int i = 0; i < partes.size(); i++) {
            json(partes.get(i), sb, "  ");
            sb.append(i + 1 < partes.size() ? ",\n" : "\n");
        }
        sb.append("]}\n");
        Files.writeString(salida.resolve(j.id + ".json"), sb.toString(), StandardCharsets.UTF_8);
        copiarRecurso(j.textura, salida.resolve(j.id + ".png"));
        if (j.brillo != null) copiarRecurso(j.brillo, salida.resolve(j.id + "_brillo.png"));
    }

    public static void main(String[] args) throws Exception {
        Path salida = Path.of(args[0]);
        Files.createDirectories(salida);
        Set<String> pedidos = new HashSet<>(Arrays.asList(args).subList(1, args.length));
        for (Jefe j : JEFES) {
            if (!pedidos.isEmpty() && !pedidos.contains(j.id)) continue;
            try {
                volcar(j, salida);
            } catch (Throwable e) {
                System.out.println("  ERROR en " + j.id + ": " + e);
                Throwable c = e;
                while (c.getCause() != null) c = c.getCause();
                if (c != e) System.out.println("  causa: " + c);
                for (StackTraceElement st : c.getStackTrace()) {
                    System.out.println("    " + st);
                    if (st.getClassName().equals("Volcar")) break;
                }
            }
        }
    }
}
