package una.ac.cr.backendcookieshop.logic;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ProductoDTO {
    private Integer id;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private List<Fotoproducto> fotoproductos = new ArrayList<>();
    private List<CalificacionDTO> calificaciones = new ArrayList<>();
    private Double averageRating;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public List<Fotoproducto> getFotoproductos() {
        return fotoproductos;
    }

    public void setFotoproductos(List<Fotoproducto> fotoproductos) {
        this.fotoproductos = fotoproductos;
    }

    public List<CalificacionDTO> getCalificaciones() {
        return calificaciones;
    }

    public void setCalificaciones(List<CalificacionDTO> calificaciones) {
        this.calificaciones = calificaciones;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }
}
