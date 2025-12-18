package app.dao;

import java.util.ArrayList;
import java.util.List;
import app.modelos.ModelosJava.Asesoria;

/**
 * 
 * @author Carlos Moyano
 */

public class AsesoriaDao {

    private static List<Asesoria> tablaAsesorias = new ArrayList<>();
    private static int contadorId = 1;

    public Asesoria insertar(Asesoria a) {
        a.setNumero(contadorId++);
        tablaAsesorias.add(a);
        return a;
    }

    public List<Asesoria> listar() {
        return new ArrayList<>(tablaAsesorias);
    }

    public Asesoria buscarPorId(int id) {
        return tablaAsesorias.stream()
                .filter(a -> a.getNumero() == id)
                .findFirst()
                .orElse(null);
    }

    public boolean actualizar(Asesoria a) {
        Asesoria existente = buscarPorId(a.getNumero());
        if (existente != null) {
            int index = tablaAsesorias.indexOf(existente);
            tablaAsesorias.set(index, a);
            return true;
        }
        return false;
    }

    public boolean eliminar(int id) {
        return tablaAsesorias.removeIf(a -> a.getNumero() == id);
    }
}