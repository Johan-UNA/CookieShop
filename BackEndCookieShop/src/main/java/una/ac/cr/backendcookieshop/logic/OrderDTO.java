package una.ac.cr.backendcookieshop.logic;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class OrderDTO {
    private Integer id;
    private String idUsuario;
    private String nombreUsuario;
    private String medioPago;
    private Instant fechaEntrega;
    private ClienteDTO cliente;
    private List<DetalleOrdenDTO> detalleordens;
    private BigDecimal total;
    private String estado;
    private String motivoCancelacion;

    // Getters y Setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

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

    public Instant getFechaEntrega() {
        return fechaEntrega;
    }

    public void setFechaEntrega(Instant fechaEntrega) {
        this.fechaEntrega = fechaEntrega;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getMotivoCancelacion() {
        return motivoCancelacion;
    }

    public void setMotivoCancelacion(String motivoCancelacion) {
        this.motivoCancelacion = motivoCancelacion;
    }
}

