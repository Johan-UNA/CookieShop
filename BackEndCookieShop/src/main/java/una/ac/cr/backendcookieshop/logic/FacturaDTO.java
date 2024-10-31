package una.ac.cr.backendcookieshop.logic;

import java.time.Instant;

public class FacturaDTO {
    private Integer idFactura;
    private Instant fechaCreacion;
    private OrderDTO orden;

    public Integer getIdFactura() {
        return idFactura;
    }

    public void setIdFactura(Integer idFactura) {
        this.idFactura = idFactura;
    }

    public Instant getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(Instant fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public OrderDTO getOrden() {
        return orden;
    }

    public void setOrden(OrderDTO orden) {
        this.orden = orden;
    }
}