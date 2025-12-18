package app.dao;

import app.modelos.ModelosJava.Disponibilidad;
import java.util.ArrayList;
import java.util.List;

/**
 * @author Carlos Moyano
 */

public class DisponibilidadDao {

    private static List<Disponibilidad> tablaDisponibilidad = new ArrayList<>();
    private static int contadorId = 1;

    public Disponibilidad insertar(Disponibilidad d) {
        d.setId(contadorId++);
        tablaDisponibilidad.add(d);
        return d;
    }

    public List<Disponibilidad> listar() {
        return new ArrayList<>(tablaDisponibilidad);
    }

    public Disponibilidad buscarPorId(int id) {
        return tablaDisponibilidad.stream()
                .filter(d -> d.getId() == id)
                .findFirst()
                .orElse(null);
    }

    public boolean actualizar(Disponibilidad d) {
        Disponibilidad existente = buscarPorId(d.getId());
        if (existente != null) {
            int index = tablaDisponibilidad.indexOf(existente);
            tablaDisponibilidad.set(index, d);
            return true;
        }
        return false;
    }

    public boolean eliminar(int id) {
        return tablaDisponibilidad.removeIf(d -> d.getId() == id);
    }
}