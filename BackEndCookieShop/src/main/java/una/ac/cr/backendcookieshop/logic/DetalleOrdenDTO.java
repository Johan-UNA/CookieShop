package una.ac.cr.backendcookieshop.logic;

import java.math.BigDecimal;

public class DetalleOrdenDTO {
    private Integer idProducto;
    private Integer cantidad;
    private BigDecimal subtotal;

    public int getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(Integer idProducto) {
        this.idProducto = idProducto;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
}
