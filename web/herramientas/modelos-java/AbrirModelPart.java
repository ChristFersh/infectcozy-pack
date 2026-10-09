import org.objectweb.asm.ClassReader;
import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.FieldVisitor;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;

/**
 * Aplica a ModelPart lo que pide el accesstransformer.cfg de Cataclysm ("public net.minecraft.client.model.geom.ModelPart
 * children"): en el juego lo hace NeoForge al cargar la clase; aquí se escribe una copia parcheada que va primero en el
 * classpath. Sin esto, los modelos nuevos de Cataclysm (createBodyLayer) fallan con IllegalAccessError.
 *
 * También escribe una copia de EnderDragonRenderer sin inicializador estático: sus campos estáticos (RenderType…)
 * necesitan el juego arrancado, y para EnderDragonRenderer.createBodyLayer() no hacen falta.
 *
 * Uso: java -cp <classpath del juego>:. AbrirModelPart <carpeta de salida>
 */
public class AbrirModelPart {
    public static void main(String[] args) throws Exception {
        String ruta = "net/minecraft/client/model/geom/ModelPart.class";
        byte[] original;
        try (InputStream in = AbrirModelPart.class.getClassLoader().getResourceAsStream(ruta)) {
            original = in.readAllBytes();
        }
        ClassReader cr = new ClassReader(original);
        ClassWriter cw = new ClassWriter(0);
        cr.accept(new ClassVisitor(Opcodes.ASM9, cw) {
            @Override
            public FieldVisitor visitField(int acc, String nombre, String desc, String firma, Object valor) {
                if (nombre.equals("children") || nombre.equals("cubes"))
                    acc = (acc & ~(Opcodes.ACC_PRIVATE | Opcodes.ACC_PROTECTED)) | Opcodes.ACC_PUBLIC;
                return super.visitField(acc, nombre, desc, firma, valor);
            }
        }, 0);
        Path destino = Path.of(args[0]).resolve(ruta);
        Files.createDirectories(destino.getParent());
        Files.write(destino, cw.toByteArray());
        System.out.println("escrito " + destino);

        String ruta2 = "net/minecraft/client/renderer/entity/EnderDragonRenderer.class";
        try (InputStream in = AbrirModelPart.class.getClassLoader().getResourceAsStream(ruta2)) {
            original = in.readAllBytes();
        }
        ClassWriter cw2 = new ClassWriter(0);
        new ClassReader(original).accept(new ClassVisitor(Opcodes.ASM9, cw2) {
            @Override
            public MethodVisitor visitMethod(int acc, String nombre, String desc, String firma, String[] exc) {
                if (nombre.equals("<clinit>")) return null;
                return super.visitMethod(acc, nombre, desc, firma, exc);
            }
        }, 0);
        Path destino2 = Path.of(args[0]).resolve(ruta2);
        Files.createDirectories(destino2.getParent());
        Files.write(destino2, cw2.toByteArray());
        System.out.println("escrito " + destino2);
    }
}
