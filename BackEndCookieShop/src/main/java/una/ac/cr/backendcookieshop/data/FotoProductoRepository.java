package una.ac.cr.backendcookieshop.data;

import org.springframework.data.repository.CrudRepository;
import una.ac.cr.backendcookieshop.logic.Fotoproducto;
import una.ac.cr.backendcookieshop.logic.Producto;

import java.util.List;

public interface FotoProductoRepository extends CrudRepository<Fotoproducto, Integer> {
    List<Fotoproducto> findByIdProducto(Producto idProducto);
}
