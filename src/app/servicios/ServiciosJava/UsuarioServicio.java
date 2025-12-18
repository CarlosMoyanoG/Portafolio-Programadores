package app.servicios.ServiciosJava;

import app.dao.UsuarioDao;
import app.modelos.ModelosJava.Usuario;
import java.util.List;

/**
 *
 * @author Carlos Moyano
 */

public class UsuarioServicio {

    private final UsuarioDao dao = new UsuarioDao();
    
    public Usuario crear(Usuario u) {
        if (!u.getOpcionesRol().contains(u.getRol())) {
            System.out.println("Error: Rol no válido (" + u.getRol() + ")");
            return null;
        }

        Usuario creado = dao.insertar(u);
        System.out.println("Usuario creado con ID: " + creado.getId());
        return creado;
    }

    public List<Usuario> obtenerTodos() {
        return dao.listar();
    }

    public Usuario obtenerPorId(int id) {
        return dao.buscarPorId(id);
    }

    public boolean actualizar(int id, Usuario nuevosDatos) {
        Usuario actual = dao.buscarPorId(id);
        
        if (actual != null) {
            actual.setNombre(nuevosDatos.getNombre());
            actual.setEmail(nuevosDatos.getEmail());
            
            if (actual.getOpcionesRol().contains(nuevosDatos.getRol())) {
                actual.setRol(nuevosDatos.getRol());
            }

            actual.setProgramadorId(nuevosDatos.getProgramadorId());
            actual.setFotoUrl(nuevosDatos.getFotoUrl());
            
            dao.actualizar(actual);
            
            System.out.println("Usuario ID " + id + " actualizado correctamente.");
            return true;
        } else {
            System.out.println("No se encontró el usuario con ID: " + id);
            return false;
        }
    }

    public boolean eliminar(int id) {
        boolean eliminado = dao.eliminar(id);
        if (eliminado) {
            System.out.println("Usuario ID " + id + " eliminado.");
        } else {
            System.out.println("No se puede eliminar, ID no encontrado.");
        }
        return eliminado;
    }
}