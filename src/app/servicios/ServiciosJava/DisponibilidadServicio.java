package app.servicios.ServiciosJava;

import app.dao.DisponibilidadDao;
import app.modelos.ModelosJava.Disponibilidad;
import java.util.List;

/**
 *
 * @author Carlos Moyano
 */

public class DisponibilidadServicio {

    private final DisponibilidadDao dao = new DisponibilidadDao();

    public Disponibilidad crear(Disponibilidad d) {
        if (!d.getOpcionesTipo().contains(d.getTipo())) {
            System.out.println("Error: Tipo de disponibilidad no válido.");
            return null;
        }

        Disponibilidad creada = dao.insertar(d);
        System.out.println("Disponibilidad creada con ID: " + creada.getId());
        return creada;
    }

    public List<Disponibilidad> obtenerTodos() {
        return dao.listar();
    }

    public Disponibilidad obtenerPorId(int id) {
        return dao.buscarPorId(id);
    }

    public boolean actualizar(int id, Disponibilidad nuevosDatos) {
        Disponibilidad actual = dao.buscarPorId(id);
        
        if (actual != null) {
            actual.setProgramadorId(nuevosDatos.getProgramadorId());
            
            if (actual.getOpcionesTipo().contains(nuevosDatos.getTipo())) {
                actual.setTipo(nuevosDatos.getTipo());
            }
            
            actual.setDiaSemana(nuevosDatos.getDiaSemana());
            actual.setFecha(nuevosDatos.getFecha());
            actual.setHoraInicio(nuevosDatos.getHoraInicio());
            actual.setHoraFin(nuevosDatos.getHoraFin());
            actual.setHora(nuevosDatos.getHora());
            
            dao.actualizar(actual);
            
            System.out.println("Disponibilidad ID " + id + " actualizada correctamente.");
            return true;
        } else {
            System.out.println("No se encontró la disponibilidad con ID: " + id);
            return false;
        }
    }

    public boolean eliminar(int id) {
        boolean eliminado = dao.eliminar(id);
        if (eliminado) {
            System.out.println("Disponibilidad ID " + id + " eliminada.");
        } else {
            System.out.println("No se puede eliminar, ID no encontrado.");
        }
        return eliminado;
    }
}