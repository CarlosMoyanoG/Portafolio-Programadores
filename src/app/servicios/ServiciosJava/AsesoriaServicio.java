package app.servicios.ServiciosJava;

import app.dao.AsesoriaDao;
import app.modelos.ModelosJava.Asesoria;
import java.util.List;

/**
 *
 * @author Carlos Moyano
 */

public class AsesoriaServicio {

    private final AsesoriaDao dao = new AsesoriaDao();
    
    public Asesoria crear(Asesoria a) {
        Asesoria creada = dao.insertar(a);
        System.out.println("Asesoría creada con Numero (ID): " + creada.getNumero());
        return creada;
    }

    public List<Asesoria> obtenerTodos() {
        return dao.listar();
    }

    public Asesoria obtenerPorId(int numero) {
        return dao.buscarPorId(numero);
    }

    public boolean actualizar(int numero, Asesoria nuevosDatos) {
        Asesoria actual = dao.buscarPorId(numero);
        
        if (actual != null) {
            actual.setProgramadorId(nuevosDatos.getProgramadorId());
            actual.setNombreCliente(nuevosDatos.getNombreCliente());
            actual.setEmailCliente(nuevosDatos.getEmailCliente());
            actual.setFecha(nuevosDatos.getFecha());
            actual.setHora(nuevosDatos.getHora());
            actual.setDescripcionProyecto(nuevosDatos.getDescripcionProyecto());
            actual.setMensajeRespuesta(nuevosDatos.getMensajeRespuesta());
            
            dao.actualizar(actual);
            
            System.out.println("Asesoría Numero " + numero + " actualizada correctamente.");
            return true;
        } else {
            System.out.println("No se encontró la asesoría con Numero: " + numero);
            return false;
        }
    }

    public boolean eliminar(int numero) {
        boolean eliminado = dao.eliminar(numero);
        if (eliminado) {
            System.out.println("Asesoría Numero " + numero + " eliminada.");
        } else {
            System.out.println("No se puede eliminar, Numero no encontrado.");
        }
        return eliminado;
    }
}