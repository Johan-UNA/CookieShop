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
    Service service;

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
}

