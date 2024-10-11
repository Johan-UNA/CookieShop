package una.ac.cr.backendcookieshop.logic;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "producto")
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto", nullable = false)
    private Integer id;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Lob
    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "precio", nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @OneToMany(mappedBy = "idProducto")
    @JsonIgnore
    private Set<Detalleorden> detalleordens = new LinkedHashSet<>();

    @OneToMany(mappedBy = "idProducto")
    private Set<Fotoproducto> fotoproductos = new LinkedHashSet<>();

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

    public Set<Detalleorden> getDetalleordens() {
        return detalleordens;
    }

    public void setDetalleordens(Set<Detalleorden> detalleordens) {
        this.detalleordens = detalleordens;
    }

    public Set<Fotoproducto> getFotoproductos() {
        return fotoproductos;
    }

    public void setFotoproductos(Set<Fotoproducto> fotoproductos) {
        this.fotoproductos = fotoproductos;
    }

}