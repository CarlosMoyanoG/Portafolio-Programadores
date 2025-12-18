package app.dao;

import app.modelos.ModelosJava.Programador;
import java.util.ArrayList;
import java.util.List;

/**
 * 
 * @author Carlos Moyano
 */

public class ProgramadorDao {

    private static List<Programador> tablaProgramadores = new ArrayList<>();
    private static int contadorId = 1;

    public Programador insertar(Programador p) {
        p.setId(contadorId++);
        tablaProgramadores.add(p);
        return p;
    }

    public List<Programador> listar() {
        return new ArrayList<>(tablaProgramadores);
    }

    public Programador buscarPorId(int id) {
        return tablaProgramadores.stream()
                .filter(p -> p.getId() == id)
                .findFirst()
                .orElse(null);
    }

    public boolean actualizar(Programador p) {
        Programador existente = buscarPorId(p.getId());
        if (existente != null) {
            int index = tablaProgramadores.indexOf(existente);
            tablaProgramadores.set(index, p);
            return true;
        }
        return false;
    }

    public boolean eliminar(int id) {
        return tablaProgramadores.removeIf(p -> p.getId() == id);
    }
}