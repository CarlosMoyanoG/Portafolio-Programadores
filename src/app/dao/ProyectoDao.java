package app.dao;

import app.modelos.ModelosJava.Proyecto;
import java.util.ArrayList;
import java.util.List;

/**
 * 
 * @author Carlos Moyano
 */

public class ProyectoDao {

    private static List<Proyecto> tablaProyectos = new ArrayList<>();
    private static int contadorId = 1;

    public Proyecto insertar(Proyecto p) {
        p.setId(contadorId++);
        tablaProyectos.add(p);
        return p;
    }

    public List<Proyecto> listar() {
        return new ArrayList<>(tablaProyectos);
    }

    public Proyecto buscarPorId(int id) {
        return tablaProyectos.stream()
                .filter(p -> p.getId() == id)
                .findFirst()
                .orElse(null);
    }

    public boolean actualizar(Proyecto p) {
        Proyecto existente = buscarPorId(p.getId());
        if (existente != null) {
            int index = tablaProyectos.indexOf(existente);
            tablaProyectos.set(index, p);
            return true;
        }
        return false;
    }

    public boolean eliminar(int id) {
        return tablaProyectos.removeIf(p -> p.getId() == id);
    }
}