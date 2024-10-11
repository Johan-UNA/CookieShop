package una.ac.cr.backendcookieshop.data;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import una.ac.cr.backendcookieshop.logic.Cliente;
import java.util.Optional;

@Repository
public interface ClienteRepository extends CrudRepository<Cliente, String> {
    Optional<Cliente> findByIdCliente(String idCliente);
    Optional<Cliente> findByEmail(String email);
}
