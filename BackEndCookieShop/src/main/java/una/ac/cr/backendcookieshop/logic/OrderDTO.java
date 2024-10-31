package una.ac.cr.backendcookieshop.logic;

import java.math.BigDecimal;
import java.util.List;

public class OrderDTO {
    private String idUsuario;
    private String nombreUsuario;
    private String medioPago;
    private ClienteDTO cliente;
    private List<DetalleOrdenDTO> detalleordens;
    private BigDecimal total;

    // Getters y Setters
    public String getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(String idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getMedioPago() {
        return medioPago;
    }

    public void setMedioPago(String medioPago) {
        this.medioPago = medioPago;
    }

    public ClienteDTO getCliente() {
        return cliente;
    }

    public void setCliente(ClienteDTO cliente) {
        this.cliente = cliente;
    }

    public List<DetalleOrdenDTO> getDetalleordens() {
        return detalleordens;
    }

    public void setDetalleordens(List<DetalleOrdenDTO> detalleordens) {
        this.detalleordens = detalleordens;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }
}

