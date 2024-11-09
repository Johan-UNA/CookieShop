package una.ac.cr.backendcookieshop.data;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import una.ac.cr.backendcookieshop.logic.Usuario;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends CrudRepository<Usuario, String> {
    Optional<Usuario> findByIdUsuario(String id);
    List<Usuario> findByEstado(String estado);
    boolean existsByIdUsuario(String IdUsuario);
    // Método para encontrar el primer usuario con un rol y estado específicos
    Optional<Usuario> findFirstByRolAndEstado(String rol, String estado);

}
