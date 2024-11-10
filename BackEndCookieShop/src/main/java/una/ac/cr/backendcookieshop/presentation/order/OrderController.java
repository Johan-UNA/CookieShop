package una.ac.cr.backendcookieshop.presentation.order;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import una.ac.cr.backendcookieshop.logic.*;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    @Autowired
    private Service service;

    @PostMapping("/createOrder")
    public ResponseEntity<String> createOrder(@RequestBody OrderDTO orderDTO) {
        System.out.println(orderDTO);
        try {
            Orden orden = new Orden();
            BigDecimal total = orderDTO.getDetalleordens().stream()
                    .map(DetalleOrdenDTO::getSubtotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            Optional<Cliente> cliente = service.clienteFindById(orderDTO.getIdUsuario());
            cliente.ifPresent(orden::setIdCliente);
            orden.setEstado("pendiente");
            orden.setFechaCreacion(Instant.now().minus(Duration.ofHours(6)));
            orden.setFechaEntrega(orderDTO.getFechaEntrega().minus(Duration.ofHours(6)));
            orden.setMedioPago(orderDTO.getMedioPago());
            orden.setTotal(total);
            service.ordenSave(orden);
            for (DetalleOrdenDTO detalle : orderDTO.getDetalleordens()) {
                Detalleorden ordenDetalle = new Detalleorden();
                ordenDetalle.setIdOrden(orden);
                ordenDetalle.setSubtotal(detalle.getSubtotal());
                ordenDetalle.setCantidad(detalle.getCantidad());
                Optional<Producto> producto = service.productoFindById(detalle.getIdProducto());
                producto.ifPresent(ordenDetalle::setIdProducto);
                service.detalleOrdenSave(ordenDetalle);
            }

            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, String> response = new HashMap<>();
            response.put("message", "Orden creada con éxito. ID de orden: " + orden.getId());

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(objectMapper.writeValueAsString(response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Collections.singletonMap("error", "Error al crear la orden: " + e.getMessage()).toString());
        }
    }

    @PutMapping("/updateStatus")
    public ResponseEntity<Map<String, String>> updateOrderStatus(@RequestBody EstadoRequest estadoRequest) {
        Optional<Orden> orderOpt = service.ordenFindById(estadoRequest.getOrderId());
        Optional<Usuario> userOpt = service.usuarioFindById(estadoRequest.getUserId());

        if (orderOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("message", "Orden no encontrada"));
        }

        Orden order = orderOpt.get();

        String currentStatus = order.getEstado();
        String newStatus = estadoRequest.getNewStatus();

        // Configura la razón de cancelación, si corresponde
        if ("cancelado".equals(newStatus) && estadoRequest.getCancellationReason() != null) {
            order.setMotivoCancelacion(estadoRequest.getCancellationReason());
        }

        if("pendiente".equals(currentStatus)){
            order.setIdUsuario(userOpt.get());
        }

        order.setEstado(newStatus);
        service.ordenSave(order);
        if("entregado".equals(newStatus)){
            Factura factura = new Factura();
            factura.setIdOrden(order);
            factura.setFechaCreacion(Instant.now().minus(Duration.ofHours(6)));
            service.facturaSave(factura);
        }

        return ResponseEntity.ok(Collections.singletonMap("message", "Estado de la orden actualizado correctamente"));
    }

    @GetMapping("/getOrders")
    public ResponseEntity<List<OrderDTO>> getCustomerOrders(@RequestParam String userId,
                                                            @RequestParam String role) {
        try {
            switch (role) {
                case "cliente" -> {
                    return ResponseEntity.ok(service.obtenerOrdenesPorCliente(userId));
                }
                case "dependiente" -> {
                    return ResponseEntity.ok(service.obtenerOrdenesPorProveedor(userId));
                }
                default -> {
                    return ResponseEntity.ok(service.obtenerOrdenesTodas());
                }
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonList(new OrderDTO()));
        }
    }

    @GetMapping("/getOrder")
    public ResponseEntity<OrderDTO> getOrder(@RequestParam("orderId") Integer orderId) {
        return ResponseEntity.ok(service.obtenerOrdenPorId(orderId));
    }




    // Endpoint para asignar un proveedor a una orden pendiente
//    @PutMapping("/{id}/assignProvider")
//    public ResponseEntity<String> assignProvider(@PathVariable Integer id) {
//        try {
//            Orden orden = service.obtenerOrdenPorId(id).orElseThrow(() -> new Exception("Orden no encontrada"));
//            Orden ordenConProveedor = service.asignarProveedor(orden);
//
//            return ResponseEntity.ok("Proveedor asignado exitosamente a la orden con ID: " + ordenConProveedor.getId());
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body("Error al asignar proveedor a la orden: " + e.getMessage());
//        }
//    }

//    @GetMapping("/byStatus")
//    public ResponseEntity<List<Orden>> getOrdersByStatus(@RequestParam EstadoOrden estado) {
//        List<Orden> ordenes = service.obtenerOrdenesPorEstado(estado);
//        return ResponseEntity.ok(ordenes);
//    }
//
//    // Endpoint para obtener todas las órdenes pendientes sin proveedor asignado
//    @GetMapping("/pendingWithoutProvider")
//    public ResponseEntity<List<Orden>> getPendingOrdersWithoutProvider() {
//        List<Orden> ordenesPendientes = service.obtenerOrdenesPendientesSinProveedor();
//        return ResponseEntity.ok(ordenesPendientes);
//    }
}
