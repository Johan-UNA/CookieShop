package una.ac.cr.backendcookieshop.logic;

import java.util.List;

public class OrderDTO {
    private String idUsuario;               // User ID
    private String medioPago;             // Payment method
    private List<DetalleOrdenDTO> detalleordens; // List of order details

    // Getters and Setters
    public String getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(String idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getMedioPago() {
        return medioPago;
    }

    public void setMedioPago(String medioPago) {
        this.medioPago = medioPago;
    }

    public List<DetalleOrdenDTO> getDetalleordens() {
        return detalleordens;
    }

    public void setDetalleordens(List<DetalleOrdenDTO> detalleordens) {
        this.detalleordens = detalleordens;
    }
}

