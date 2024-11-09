package una.ac.cr.backendcookieshop.data;

import org.springframework.data.repository.CrudRepository;
import una.ac.cr.backendcookieshop.logic.Calificacion;
import una.ac.cr.backendcookieshop.logic.Cliente;
import una.ac.cr.backendcookieshop.logic.Producto;

import java.util.Optional;

public interface CalificacionRepository extends CrudRepository<Calificacion, Integer> {
    Optional<Calificacion> findByIdClienteAndIdProducto(Cliente cliente, Producto producto);
}
