package una.ac.cr.backendcookieshop.data;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import una.ac.cr.backendcookieshop.logic.Producto;

import java.util.Optional;

@Repository
public interface ProductoRepository extends CrudRepository<Producto, Integer> {
    Optional<Producto> findById(int id);
}
