package app.servicios.ServiciosJava;

import app.dao.ProyectoDao;
import app.modelos.ModelosJava.Proyecto;
import java.util.List;

/**
 *
 * @author Carlos Moyano
 */

public class ProyectoServicio {

    private final ProyectoDao dao = new ProyectoDao();

    public Proyecto crear(Proyecto p) {
        if (!p.getOpcionesSeccion().contains(p.getSeccion())) {
            System.out.println("Error: Sección no válida (" + p.getSeccion() + ")");
            return null;
        }

        if (!p.getOpcionesParticipacion().contains(p.getParticipacion())) {
            System.out.println("Error: Participación no válida (" + p.getParticipacion() + ")");
            return null;
        }

        Proyecto creado = dao.insertar(p);
        System.out.println("Proyecto creado con ID: " + creado.getId());
        return creado;
    }

    public List<Proyecto> obtenerTodos() {
        return dao.listar();
    }

    public Proyecto obtenerPorId(int id) {
        return dao.buscarPorId(id);
    }

    public boolean actualizar(int id, Proyecto nuevosDatos) {
        Proyecto actual = dao.buscarPorId(id);
        
        if (actual != null) {
            actual.setNombre(nuevosDatos.getNombre());
            actual.setDescripcion(nuevosDatos.getDescripcion());
            
            if (actual.getOpcionesSeccion().contains(nuevosDatos.getSeccion())) {
                actual.setSeccion(nuevosDatos.getSeccion());
            }

            if (actual.getOpcionesParticipacion().contains(nuevosDatos.getParticipacion())) {
                actual.setParticipacion(nuevosDatos.getParticipacion());
            }

            actual.setTecnologias(nuevosDatos.getTecnologias());
            actual.setRepoUrl(nuevosDatos.getRepoUrl());
            actual.setDemoUrl(nuevosDatos.getDemoUrl());
            
            dao.actualizar(actual);
            
            System.out.println("Proyecto ID " + id + " actualizado correctamente.");
            return true;
        } else {
            System.out.println("No se encontró el proyecto con ID: " + id);
            return false;
        }
    }

    public boolean eliminar(int id) {
        boolean eliminado = dao.eliminar(id);
        if (eliminado) {
            System.out.println("Proyecto ID " + id + " eliminado.");
        } else {
            System.out.println("No se puede eliminar, ID no encontrado.");
        }
        return eliminado;
    }
}