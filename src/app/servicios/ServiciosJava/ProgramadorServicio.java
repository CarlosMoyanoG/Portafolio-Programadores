package app.servicios.ServiciosJava;

import app.dao.ProgramadorDao;
import app.modelos.ModelosJava.Programador;
import java.util.List;

/**
 *
 * @author Carlos Moyano
 */

public class ProgramadorServicio {

    private final ProgramadorDao dao = new ProgramadorDao();

    public Programador crear(Programador p) {
        Programador creado = dao.insertar(p);
        System.out.println("Programador creado con ID: " + creado.getId());
        return creado;
    }

    public List<Programador> obtenerTodos() {
        return dao.listar();
    }

    public Programador obtenerPorId(int id) {
        return dao.buscarPorId(id);
    }

    public boolean actualizar(int id, Programador nuevosDatos) {
        Programador actual = dao.buscarPorId(id);
        
        if (actual != null) {
            actual.setNombre(nuevosDatos.getNombre());
            actual.setEspecialidad(nuevosDatos.getEspecialidad());
            actual.setDescripcion(nuevosDatos.getDescripcion());
            actual.setFotoUrl(nuevosDatos.getFotoUrl());
            actual.setEmailContacto(nuevosDatos.getEmailContacto());
            actual.setGithubUrl(nuevosDatos.getGithubUrl());
            actual.setLinkedinUrl(nuevosDatos.getLinkedinUrl());
            actual.setSitioWeb(nuevosDatos.getSitioWeb());
            actual.setDuenioUid(nuevosDatos.getDuenioUid());
            
            actual.setProyectos(nuevosDatos.getProyectos());
            
            dao.actualizar(actual);
            
            System.out.println("Programador ID " + id + " actualizado correctamente.");
            return true;
        } else {
            System.out.println("No se encontró el programador con ID: " + id);
            return false;
        }
    }

    public boolean eliminar(int id) {
        boolean eliminado = dao.eliminar(id);
        if (eliminado) {
            System.out.println("Programador ID " + id + " eliminado.");
        } else {
            System.out.println("No se puede eliminar, ID no encontrado.");
        }
        return eliminado;
    }
}