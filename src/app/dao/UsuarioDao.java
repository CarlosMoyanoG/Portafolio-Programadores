package app.dao;

import app.modelos.ModelosJava.Usuario;
import java.util.ArrayList;
import java.util.List;

/**
 * 
 * @author Carlos Moyano
 */

public class UsuarioDao {

    private static List<Usuario> tablaUsuarios = new ArrayList<>();
    private static int contadorId = 1;

    public Usuario insertar(Usuario u) {
        u.setId(contadorId++);
        tablaUsuarios.add(u);
        return u;
    }

    public List<Usuario> listar() {
        return new ArrayList<>(tablaUsuarios);
    }

    public Usuario buscarPorId(int id) {
        return tablaUsuarios.stream()
                .filter(u -> u.getId() == id)
                .findFirst()
                .orElse(null);
    }

    public boolean actualizar(Usuario u) {
        Usuario existente = buscarPorId(u.getId());
        if (existente != null) {
            int index = tablaUsuarios.indexOf(existente);
            tablaUsuarios.set(index, u);
            return true;
        }
        return false;
    }

    public boolean eliminar(int id) {
        return tablaUsuarios.removeIf(u -> u.getId() == id);
    }
}