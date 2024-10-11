package una.ac.cr.backendcookieshop.data;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import una.ac.cr.backendcookieshop.logic.Direccion;

@Repository
public interface DireccionRepository extends CrudRepository<Direccion, Integer> {

}
