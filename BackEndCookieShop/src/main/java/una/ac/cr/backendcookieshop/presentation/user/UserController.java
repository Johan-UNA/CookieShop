package una.ac.cr.backendcookieshop.presentation.user;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import una.ac.cr.backendcookieshop.logic.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    Service service;

    // Endpoint para obtener información del usuario según su ID
    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable String userId) {
        try {
            UserDTO user = new UserDTO();
            if(service.usuarioExistsById(userId)) {
                Usuario u = service.usuarioFindById(userId).get();
                user.setIdUsuario(u.getIdUsuario());
                user.setNombre(u.getNombre());
                user.setApellido(u.getApellido());
                user.setEmail(u.getEmail());
            }
            else {
                Cliente cliente = service.clienteFindById(userId).get();
                user.setIdUsuario(cliente.getIdCliente());
                user.setNombre(cliente.getNombre());
                user.setApellido(cliente.getApellido());
                user.setEmail(cliente.getEmail());
                user.setTelefono(cliente.getTelefono());
            }
            return ResponseEntity.ok(user);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Endpoint para actualizar información de un cliente
    @PutMapping("/cliente/{userId}")
    public ResponseEntity<String> updateClientProfile(@PathVariable String userId, @RequestBody UserDTO userDto) {
        try {
            Cliente cliente = service.clienteFindById(userId).get();
            cliente.setNombre(userDto.getNombre());
            cliente.setApellido(userDto.getApellido());
            cliente.setEmail(userDto.getEmail());
            cliente.setTelefono(userDto.getTelefono());
            cliente.setEstado("activo");
            Direccion principal = userDto.getAddresses().getFirst();
            principal.setIdCliente(cliente);
            service.clienteSave(cliente);
            service.direccionSave(principal);
            return ResponseEntity.ok("Perfil de cliente actualizado exitosamente");

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar perfil de cliente");
        }
    }

    // Endpoint para actualizar información de un dependiente
    @PutMapping("/dependiente/{userId}")
    public ResponseEntity<String> updateDependentProfile(@PathVariable String userId, @RequestBody UserDTO userDto) {
        try {
            Usuario usuario = service.usuarioFindById(userId).get();
            usuario.setNombre(userDto.getNombre());
            usuario.setApellido(userDto.getApellido());
            usuario.setEmail(userDto.getEmail());
            usuario.setIdUsuario(usuario.getIdUsuario());
            usuario.setEstado("activo");
            service.usuarioSave(usuario);
            return ResponseEntity.ok("Perfil de dependiente actualizado exitosamente");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar perfil de dependiente");
        }
    }
}

