package una.ac.cr.backendcookieshop.data;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import una.ac.cr.backendcookieshop.logic.Detalleorden;
import una.ac.cr.backendcookieshop.logic.Orden;
import java.util.List;

@Repository
public interface DetalleOrdenRepository extends CrudRepository<Detalleorden, Integer> {
    List<Detalleorden> findByIdOrden(Orden ordenId);
}
