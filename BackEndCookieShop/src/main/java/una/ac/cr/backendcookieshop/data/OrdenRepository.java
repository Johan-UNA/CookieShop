package una.ac.cr.backendcookieshop.data;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import una.ac.cr.backendcookieshop.logic.Cliente;
import una.ac.cr.backendcookieshop.logic.Orden;
import una.ac.cr.backendcookieshop.logic.Usuario;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrdenRepository extends CrudRepository<Orden, Integer> {
    Optional<Orden> findById(Integer id);
    List<Orden> findByEstado(String estado);
    Iterable<Orden> findByIdCliente(Cliente idCliente);

    Iterable<Orden> findByIdUsuario(Usuario idUsuario);

    Iterable<Orden> findByIdUsuarioOrEstado(Usuario idUsuario, String estado);

}
