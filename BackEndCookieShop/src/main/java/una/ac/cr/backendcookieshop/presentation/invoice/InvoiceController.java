package una.ac.cr.backendcookieshop.presentation.invoice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import una.ac.cr.backendcookieshop.logic.Factura;
import una.ac.cr.backendcookieshop.logic.FacturaDTO;
import una.ac.cr.backendcookieshop.logic.Service;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/factura")
public class InvoiceController {
    @Autowired
    Service service;

    @GetMapping("/getFactura")
    public FacturaDTO getFactura(@RequestParam int idFactura) {
        return service.convertToFacturaDTO(service.facturaFindById(idFactura).get());

    }

    @GetMapping("/getFacturas")
    public ResponseEntity<List<FacturaDTO>> getFacturas(
            @RequestParam String userId,
            @RequestParam String role
    ) {
        List<Factura> facturas;
        List<FacturaDTO> facturaDTOs = new ArrayList<>();
        if ("cliente".equals(role)) {
            facturas = service.getFacturasByCliente(userId);
        } else if ("dependiente".equals(role)) {
            facturas = service.getFacturasByUsuario(userId);
        } else {
            facturas = service.facturasFindAll();
        }
        for (Factura factura : facturas) {
            facturaDTOs.add(service.convertToFacturaDTO(factura));
        }

        return ResponseEntity.ok(facturaDTOs);
    }
}