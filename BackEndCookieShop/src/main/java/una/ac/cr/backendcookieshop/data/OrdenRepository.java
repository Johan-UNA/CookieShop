package una.ac.cr.backendcookieshop.data;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import una.ac.cr.backendcookieshop.logic.Cliente;
import una.ac.cr.backendcookieshop.logic.Orden;
import una.ac.cr.backendcookieshop.logic.EstadoOrden;

import java.util.List;

@Repository
public interface OrdenRepository extends CrudRepository<Orden, Integer> {
    // Método personalizado para encontrar órdenes por estado
    List<Orden> findByEstado(EstadoOrden estado);

    // Método personalizado para encontrar órdenes por el ID del cliente
    Iterable<Orden> findByIdCliente(Cliente idCliente);

    List<Orden> findOrdenByIdCliente(Cliente cliente);

    // Nuevo método: encontrar órdenes pendientes sin proveedor asignado
    List<Orden> findByEstadoAndIdUsuarioIsNull(EstadoOrden estado);

}
