package una.ac.cr.backendcookieshop.logic;

import org.springframework.beans.factory.annotation.Autowired;
import una.ac.cr.backendcookieshop.data.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
    @Autowired
    private CalificacionRepository calificacionRepository;
    @Autowired
    private FacturaRepository facturaRepository;

    public Iterable<Cliente> clienteFindAll() { return clienteRepository.findAll(); }
    public List<UserDTO> usuarioFindAll() {
        Iterable<Usuario> iterable = usuarioRepository.findAll();
        List<UserDTO> list = new ArrayList<>();
        for (Usuario usuario : iterable) {
            if (usuario.getRol().equals("dependiente")) {
                list.add(convertToUsuarioDTO(usuario));
            }
        }
        return list;
    }
    public Optional<Cliente> clienteFindById(String id) { return clienteRepository.findByIdCliente(id); }
    public Optional<Usuario> usuarioFindById(String id) { return usuarioRepository.findByIdUsuario(id); }
    public Iterable<Producto> productoFindAll() { return productoRepository.findAll(); }
    public Optional<Producto> productoFindById(int id) { return productoRepository.findById(id); }
    public Optional<Orden> ordenFindById(int id) { return ordenRepository.findById(id); }
    public List<Usuario> usuarioFindByEstado(String estado) { return usuarioRepository.findByEstado(estado); }
    public void clienteSave(Cliente cliente) { clienteRepository.save(cliente); }
    public void usuarioSave(Usuario usuario) {usuarioRepository.save(usuario); }
    public void ordenSave(Orden orden) {ordenRepository.save(orden); }
    public void calificacionSave(Calificacion calificacion){ calificacionRepository.save(calificacion);}
    public void detalleOrdenSave(Detalleorden detalleOrden) {detalleOrdenRepository.save(detalleOrden); }
    public void direccionSave(Direccion direccion) { direccionRepository.save(direccion); }
    public void productoSave(Producto producto) {productoRepository.save(producto); }
    public void fotoProductoSave(Fotoproducto foto) {fotoProductoRepository.save(foto); }
    public void deleteFotoProducto(Fotoproducto foto) {fotoProductoRepository.delete(foto); }
    public List<Fotoproducto> fotoProductoFindByIdProducto(Producto producto) { return fotoProductoRepository.findByIdProducto(producto); }
    public boolean usuarioExistsById(String idUsuario) { return usuarioRepository.existsByIdUsuario(idUsuario); }
    public boolean userExistsById(String id) {
        return usuarioRepository.existsByIdUsuario(id) || clienteRepository.existsByIdCliente(id);
    }
    public Optional<Factura> facturaFindById(int id){return facturaRepository.findById(id);}
    public List<Factura> getFacturasByCliente(String idCliente){
        return facturaRepository.findByIdOrden_IdCliente(clienteRepository.findByIdCliente(idCliente).get());
    }
    public List<Factura> getFacturasByUsuario(String idUsuario){
        return facturaRepository.findByIdOrden_IdUsuario(usuarioRepository.findByIdUsuario(idUsuario).get());
    }

    public OrderDTO convertToOrderDTO(Orden orden) {
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setId(orden.getId());
        if(orden.getIdUsuario() != null) {
            orderDTO.setIdUsuario(orden.getIdUsuario().getIdUsuario());
            orderDTO.setNombreUsuario(orden.getIdUsuario().getNombre() + " " + orden.getIdUsuario().getApellido());
        }
        orderDTO.setMedioPago(orden.getMedioPago());
        orderDTO.setTotal(orden.getTotal());
        orderDTO.setFechaEntrega(orden.getFechaEntrega());
        orderDTO.setEstado(orden.getEstado());
        if(orden.getEstado().equals("cancelado")){
            orderDTO.setMotivoCancelacion(orden.getMotivoCancelacion());
        }

        ClienteDTO clienteDTO = new ClienteDTO();
        clienteDTO.setIdCliente(orden.getIdCliente().getIdCliente());
        clienteDTO.setNombre(orden.getIdCliente().getNombre());
        clienteDTO.setApellido(orden.getIdCliente().getApellido());
        clienteDTO.setEmail(orden.getIdCliente().getEmail());
        clienteDTO.setTelefono(orden.getIdCliente().getTelefono());
        orderDTO.setCliente(clienteDTO);

        List<DetalleOrdenDTO> detalleDTOs = orden.getDetalleordens().stream().map(detalle -> {
            DetalleOrdenDTO detalleDTO = new DetalleOrdenDTO();
            detalleDTO.setIdProducto(detalle.getIdProducto().getId());
            detalleDTO.setNombreProducto(detalle.getIdProducto().getNombre());
            detalleDTO.setDescripcionProducto(detalle.getIdProducto().getDescripcion());
            detalleDTO.setPrecioUnitario(detalle.getIdProducto().getPrecio());
            detalleDTO.setCantidad(detalle.getCantidad());
            detalleDTO.setSubtotal(detalle.getSubtotal());
            return detalleDTO;
        }).collect(Collectors.toList());

        orderDTO.setDetalleordens(detalleDTOs);
        return orderDTO;
    }

    public FacturaDTO convertToFacturaDTO(Factura factura) {
        FacturaDTO facturaDTO = new FacturaDTO();
        facturaDTO.setIdFactura(factura.getId());
        facturaDTO.setFechaCreacion(factura.getFechaCreacion());
        facturaDTO.setOrden(convertToOrderDTO(factura.getIdOrden()));
        return facturaDTO;
    }

    public UserDTO convertToUsuarioDTO(Usuario usuario){
        UserDTO usuarioDTO = new UserDTO();
        usuarioDTO.setIdUsuario(usuario.getIdUsuario());
        usuarioDTO.setNombre(usuario.getNombre());
        usuarioDTO.setApellido(usuario.getApellido());
        usuarioDTO.setEmail(usuario.getEmail());
        usuarioDTO.setEstado(usuario.getEstado());
        return usuarioDTO;
    }

    public ProductoDTO convertToProductoDTO(Producto producto){
        ProductoDTO productoDTO = new ProductoDTO();
        productoDTO.setId(producto.getId());
        productoDTO.setNombre(producto.getNombre());
        productoDTO.setDescripcion(producto.getDescripcion());
        productoDTO.setPrecio(producto.getPrecio());
        for (Fotoproducto foto : producto.getFotoproductos()){
            productoDTO.getFotoproductos().add(foto);
        }
        double averageRating = producto.getCalificacions().stream()
                .mapToInt(Calificacion::getCalificacion)
                .average()
                .orElse(0.0);

        productoDTO.setAverageRating(averageRating);
        for (Calificacion calificacion : producto.getCalificacions()){
            CalificacionDTO calificacionDTO = new CalificacionDTO();
            calificacionDTO.setRating(calificacion.getCalificacion());
            calificacionDTO.setIdProducto(calificacion.getIdProducto().getId());
            calificacionDTO.setIdUsuario(calificacion.getIdCliente().getIdCliente());
            productoDTO.getCalificaciones().add(calificacionDTO);
        }
        return productoDTO;
    }

    public List<ProductoDTO> productoDTOS(){
        List<Producto> productos = (List<Producto>) productoFindAll();
        List<ProductoDTO> productoDTOS = new ArrayList<>();
        for (Producto producto : productos){
            productoDTOS.add(convertToProductoDTO(producto));
        }
        return productoDTOS;
    }

    public List<Producto> obtenerProductosCompradosPorCliente(Cliente clienteId) {
        List<Detalleorden> detalleordens = detalleOrdenRepository.findByIdOrden_IdClienteAndIdOrden_Estado(clienteId, "entregado");
        return detalleordens.stream()
                .map(Detalleorden::getIdProducto)
                .collect(Collectors.toList());
    }

    public Optional<Calificacion> calificacionFindByClienteAndProducto(Cliente cliente, Producto producto) {
        return calificacionRepository.findByIdClienteAndIdProducto(cliente, producto);
    }

    public List<Factura> facturasFindAll(){ return (List<Factura>) facturaRepository.findAll();}

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
    public List<OrderDTO> obtenerOrdenesPorCliente(String idCliente) {
        Optional<Cliente> cliente = clienteRepository.findById(idCliente);
        List<OrderDTO> ordenes = new ArrayList<>();
        if (cliente.isPresent()) {
            Iterable<Orden> iterable = ordenRepository.findByIdCliente(cliente.get());
            for(Orden orden : iterable){
                ordenes.add(convertToOrderDTO(orden));
            }
        }
        return ordenes;
    }

    public List<OrderDTO> obtenerOrdenesTodas(){
        Iterable<Orden> iterable = ordenRepository.findAll();
        List<OrderDTO> ordenes = new ArrayList<>();
        for(Orden orden : iterable){
            ordenes.add(convertToOrderDTO(orden));
        }
        return ordenes;
    }

    public List<OrderDTO> obtenerOrdenesPorProveedor(String idUsuario){
        Optional<Usuario> usuario = usuarioFindById(idUsuario);
        List<OrderDTO> ordenes = new ArrayList<>();
        if (usuario.isPresent()) {
            Iterable<Orden> iterable = ordenRepository.findByIdUsuarioOrEstado(usuario.get(), "pendiente");
            for(Orden orden : iterable){
                ordenes.add(convertToOrderDTO(orden));
            }
        }
        return ordenes;
    }

    public OrderDTO obtenerOrdenPorId(int idOrden){
        Optional<Orden> orden = ordenRepository.findById(idOrden);
        return orden.map(this::convertToOrderDTO).orElse(null);
    }

}

