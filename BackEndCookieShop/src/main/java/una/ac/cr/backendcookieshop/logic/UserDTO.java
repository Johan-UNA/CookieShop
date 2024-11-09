package una.ac.cr.backendcookieshop.logic;

import java.util.List;

public class UserDTO {
    private String idUsuario;
    private String nombre;
    private String apellido;
    private String email;
    private String telefono;
    private String estado;
    private List<Direccion> addresses; // Lista de direcciones del usuario

    public String getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(String idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public List<Direccion> getAddresses() {
        return addresses;
    }

    public void setAddresses(List<Direccion> addresses) {
        this.addresses = addresses;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}

