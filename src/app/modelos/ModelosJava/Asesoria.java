package app.modelos.ModelosJava;
import java.util.ArrayList;

/**
 *
 * @author Carlos Moyano
 */

public class Asesoria {
    
    ArrayList<String> opcionesAsesorias = new ArrayList<>();
    
    int numero; 
    int programadorId;
    String nombreCliente;
    String emailCliente;
    String fecha;
    String hora;
    String descripcionProyecto;
    String mensajeRespuesta;
    
    public Asesoria() {
        opcionesAsesorias.add("pendiente");
        opcionesAsesorias.add("aprobada");
        opcionesAsesorias.add("rechazada");
    }

    public ArrayList<String> getOpcionesAsesorias() {
        return opcionesAsesorias;
    }

    public void setOpcionesAsesorias(ArrayList<String> opcionesAsesorias) {
        this.opcionesAsesorias = opcionesAsesorias;
    }

    public int getNumero() {
        return numero;
    }

    public void setNumero(int numero) {
        this.numero = numero;
    }

    public int getProgramadorId() {
        return programadorId;
    }

    public void setProgramadorId(int programadorId) {
        this.programadorId = programadorId;
    }

    public String getNombreCliente() {
        return nombreCliente;
    }

    public void setNombreCliente(String nombreCliente) {
        this.nombreCliente = nombreCliente;
    }

    public String getEmailCliente() {
        return emailCliente;
    }

    public void setEmailCliente(String emailCliente) {
        this.emailCliente = emailCliente;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public String getHora() {
        return hora;
    }

    public void setHora(String hora) {
        this.hora = hora;
    }

    public String getDescripcionProyecto() {
        return descripcionProyecto;
    }

    public void setDescripcionProyecto(String descripcionProyecto) {
        this.descripcionProyecto = descripcionProyecto;
    }

    public String getMensajeRespuesta() {
        return mensajeRespuesta;
    }

    public void setMensajeRespuesta(String mensajeRespuesta) {
        this.mensajeRespuesta = mensajeRespuesta;
    }

    @Override
    public String toString() {
        return "Asesoria [Num=" + numero + ", ProgID=" + programadorId + 
               ", Cliente=" + nombreCliente + ", Email=" + emailCliente + 
               ", Fecha=" + fecha + ", Hora=" + hora + "]";
    }
}