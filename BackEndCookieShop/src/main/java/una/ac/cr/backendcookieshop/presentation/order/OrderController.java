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
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    @Autowired
    private Service service;

    // Endpoint para crear una nueva orden
    @PostMapping("/createOrder")
    public ResponseEntity<String> createOrder(@RequestBody OrderDTO orderDTO) {
        try {
            Orden orden = new Orden();
            BigDecimal total = orderDTO.getDetalleordens().stream()
                    .map(DetalleOrdenDTO::getSubtotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            Optional<Cliente> cliente = service.clienteFindById(orderDTO.getIdUsuario());
            cliente.ifPresent(orden::setIdCliente);

            orden.setEstado(EstadoOrden.valueOf("PENDIENTE"));
            orden.setFechaCreacion(Instant.now().minus(Duration.ofHours(6)));
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

    // Endpoint para actualizar el estado de una orden
    @PutMapping("/{id}/updateStatus")
    public ResponseEntity<String> updateOrderStatus(@PathVariable Integer id,
                                                    @RequestParam EstadoOrden nuevoEstado,
                                                    @RequestParam(required = false) String razonCancelacion) {
        try {
            Orden orden = service.obtenerOrdenPorId(id).orElseThrow(() -> new Exception("Orden no encontrada"));
            service.actualizarEstadoOrden(orden, nuevoEstado, razonCancelacion);

            return ResponseEntity.ok("Estado de la orden actualizado a: " + nuevoEstado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error al actualizar el estado de la orden: " + e.getMessage());
        }
    }

    // Endpoint para consultar todas las órdenes de un cliente
    @GetMapping("/customerOrders")
    public ResponseEntity<Iterable<OrderDTO>> getCustomerOrders(@RequestParam("clientId") String idCliente) {
        try {
            // Obtener las órdenes del cliente
            Iterable<Orden> ordenes = service.obtenerOrdenesPorCliente(idCliente);
            Iterable<OrderDTO> orderDTOs = StreamSupport.stream(ordenes.spliterator(), false)
                    .map(service::convertToOrderDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(orderDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonList(new OrderDTO()));
        }
    }


    // Endpoint para asignar un proveedor a una orden pendiente
    @PutMapping("/{id}/assignProvider")
    public ResponseEntity<String> assignProvider(@PathVariable Integer id) {
        try {
            Orden orden = service.obtenerOrdenPorId(id).orElseThrow(() -> new Exception("Orden no encontrada"));
            Orden ordenConProveedor = service.asignarProveedor(orden);

            return ResponseEntity.ok("Proveedor asignado exitosamente a la orden con ID: " + ordenConProveedor.getId());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error al asignar proveedor a la orden: " + e.getMessage());
        }
    }

    @GetMapping("/byStatus")
    public ResponseEntity<List<Orden>> getOrdersByStatus(@RequestParam EstadoOrden estado) {
        List<Orden> ordenes = service.obtenerOrdenesPorEstado(estado);
        return ResponseEntity.ok(ordenes);
    }

    // Endpoint para obtener todas las órdenes pendientes sin proveedor asignado
    @GetMapping("/pendingWithoutProvider")
    public ResponseEntity<List<Orden>> getPendingOrdersWithoutProvider() {
        List<Orden> ordenesPendientes = service.obtenerOrdenesPendientesSinProveedor();
        return ResponseEntity.ok(ordenesPendientes);
    }
}
