package una.ac.cr.backendcookieshop.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import una.ac.cr.backendcookieshop.logic.Cliente;
import una.ac.cr.backendcookieshop.logic.Detalleorden;
import una.ac.cr.backendcookieshop.logic.Orden;
import java.util.List;

@Repository
public interface DetalleOrdenRepository extends JpaRepository<Detalleorden, Integer> {
    List<Detalleorden> findByIdOrden(Orden ordenId);
    List<Detalleorden> findByIdOrden_IdClienteAndIdOrden_Estado(Cliente clienteId, String estado);
}
