package una.ac.cr.backendcookieshop.data;

import org.springframework.data.repository.CrudRepository;
import una.ac.cr.backendcookieshop.logic.Cliente;
import una.ac.cr.backendcookieshop.logic.Factura;
import una.ac.cr.backendcookieshop.logic.Usuario;

import java.util.List;
import java.util.Optional;

public interface FacturaRepository extends CrudRepository<Factura, Integer> {
    List<Factura> findByIdOrden_IdCliente(Cliente idCliente);
    List<Factura> findByIdOrden_IdUsuario(Usuario idUsuario);
}
