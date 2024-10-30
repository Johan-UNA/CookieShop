package una.ac.cr.backendcookieshop.logic;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import una.ac.cr.backendcookieshop.data.*;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@org.springframework.stereotype.Service("service")
public class Service {
    @Autowired
    private ClienteRepository clienteRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private DireccionRepository direccionRepository;
    @Autowired
    private ProductoRepository productoRepository;
    @Autowired
    private FotoProductoRepository fotoProductoRepository;
    @Autowired
    private OrdenRepository ordenRepository;
    @Autowired
    private DetalleOrdenRepository detalleOrdenRepository;

    public Iterable<Cliente> clienteFindAll() { return clienteRepository.findAll(); }

    public Iterable<Usuario> usuarioFindAll() { return usuarioRepository.findAll(); }
    public Optional<Cliente> clienteFindById(String id) { return clienteRepository.findByIdCliente(id); }
    public Optional<Usuario> usuarioFindById(String id) { return usuarioRepository.findByIdUsuario(id); }
    public Iterable<Producto> productoFindAll() { return productoRepository.findAll(); }
    public Optional<Producto> productoFindById(int id) { return productoRepository.findById(id); }
    public List<Usuario> usuarioFindByEstado(String estado) { return usuarioRepository.findByEstado(estado); }
    public void clienteSave(Cliente cliente) { clienteRepository.save(cliente); }
    public void usuarioSave(Usuario usuario) {usuarioRepository.save(usuario); }
    public void ordenSave(Orden orden) {ordenRepository.save(orden); }
    public void detalleOrdenSave(Detalleorden detalleOrden) {detalleOrdenRepository.save(detalleOrden); }
    public void direccionSave(Direccion direccion) { direccionRepository.save(direccion); }
    public void productoSave(Producto producto) {productoRepository.save(producto); }
    public void fotoProductoSave(Fotoproducto foto) {fotoProductoRepository.save(foto); }
    public List<Fotoproducto> fotoProductoFindByIdProducto(Producto producto) { return fotoProductoRepository.findByIdProducto(producto); }
    public boolean usuarioExistsById(String idUsuario) { return usuarioRepository.existsByIdUsuario(idUsuario); }
    public boolean userExistsById(String id) {
        return usuarioRepository.existsByIdUsuario(id) || clienteRepository.existsByIdCliente(id);
    }

    public boolean esDireccionValida(Direccion direccion) {
        return direccion.getProvincia() != null && !direccion.getProvincia().isEmpty() &&
                direccion.getCanton() != null && !direccion.getCanton().isEmpty() &&
                direccion.getDistrito() != null && !direccion.getDistrito().isEmpty() &&
                direccion.getDescripcion() != null && !direccion.getDescripcion().isEmpty();
    }

    // Método para obtener todas las órdenes pendientes
    public Iterable<Orden> obtenerOrdenesPorEstado(String estado) {
        return ordenRepository.findByEstado(estado);
    }

    // Método para obtener todas las órdenes de un cliente específico
    public Iterable<Orden> obtenerOrdenesPorCliente(String idCliente) {
        Optional<Cliente> cliente = clienteRepository.findById(idCliente);
        if (cliente.isPresent()) {
            return ordenRepository.findByIdCliente(cliente.get());
        } else {
            return new ArrayList<>(); // Devuelve una lista vacía si el cliente no existe
        }
    }
}

