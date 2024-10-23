package una.ac.cr.backendcookieshop.presentation.login;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import una.ac.cr.backendcookieshop.logic.Cliente;
import una.ac.cr.backendcookieshop.logic.Service;
import una.ac.cr.backendcookieshop.logic.User;
import una.ac.cr.backendcookieshop.logic.Usuario;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/login")
public class LoginController {

    @Autowired
    Service service;

    @GetMapping("/registroUsuario")
    public ResponseEntity<Usuario> showRegistro() {
        Usuario usuario = new Usuario();
        return ResponseEntity.ok(usuario);
    }

//    @PostMapping("/registro")
//    public ResponseEntity<String> registerUser(@RequestBody Map<String, Object> userData) {
//        try {
//            String userType = (String) userData.get("type");
//            String id = userType.equals("cliente") ? (String) userData.get("idCliente") : (String) userData.get("idUsuario");
//
//            if (service.userExistsById(id)) {
//                return ResponseEntity.status(400).body("Ya existe un usuario con este ID.");
//            }
//
//            if (userType.equals("cliente")) {
//                Cliente cliente = new Cliente();
//                cliente.setIdCliente((String) userData.get("idCliente"));
//                cliente.setNombre((String) userData.get("nombre"));
//                cliente.setApellido((String) userData.get("apellido"));
//                cliente.setEmail((String) userData.get("email"));
//                cliente.setContrasena((String) userData.get("contrasena"));
//                cliente.setTelefono((String) userData.get("telefono"));
//
//                service.clienteSave(cliente);
//                return ResponseEntity.ok("Cliente registrado correctamente.");
//            } else if (userType.equals("usuario")) {
//                Usuario usuario = new Usuario();
//                usuario.setIdUsuario((String) userData.get("idUsuario"));
//                usuario.setNombre((String) userData.get("nombre"));
//                usuario.setApellido((String) userData.get("apellido"));
//                usuario.setEmail((String) userData.get("email"));
//                usuario.setContrasena((String) userData.get("contrasena"));
//                usuario.setEstado("inactivo");
//                usuario.setRol("dependiente");
//
//                service.usuarioSave(usuario);
//                return ResponseEntity.ok("Usuario registrado correctamente.");
//            } else {
//                return ResponseEntity.status(400).body("Tipo de usuario no válido.");
//            }
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body("Ocurrió un error al guardar el usuario.");
//        }
//    }

    @PostMapping("/registroUsuario")
    public ResponseEntity<String> userRegister(@RequestBody Usuario usuario) {
        try {
            if (service.userExistsById(usuario.getIdUsuario())) {
                return ResponseEntity.status(400).body("Ya existe un usuario con este ID.");
            }
            usuario.setEstado("inactivo");
            usuario.setRol("dependiente");
            service.usuarioSave(usuario);
            return ResponseEntity.ok("Usuario registrado correctamente.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Ocurrió un error al guardar el usuario.");
        }
    }

    @PostMapping("/registroCliente")
    public ResponseEntity<String> clientRegister(@RequestBody Cliente cliente) {
        try {
            if (service.userExistsById(cliente.getIdCliente())) {
                return ResponseEntity.status(400).body("Ya existe un usuario con este ID.");
            }
            service.clienteSave(cliente);
            return ResponseEntity.ok("Cliente registrado correctamente.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Ocurrió un error al guardar el cliente.");
        }
    }


    @PostMapping("/authenticate")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            Optional<Cliente> cliente = service.clienteFindById(user.getUsuario());
            if (cliente.isPresent() && cliente.get().getContrasena().equals(user.getPassword())) {
                User user1 = new User();
                user1.setUsuario(cliente.get().getIdCliente());
                user1.setRole("cliente");
                return ResponseEntity.ok(user1);
            }

            Optional<Usuario> usuario = service.usuarioFindById(user.getUsuario());
            if (usuario.isPresent() && usuario.get().getContrasena().equals(user.getPassword())) {
                User user1 = new User();
                user1.setUsuario(usuario.get().getIdUsuario());
                user1.setRole(usuario.get().getRol());
                user1.setEstado(usuario.get().getEstado());
                return ResponseEntity.ok(user1);
            }

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ocurrió un error durante el inicio de sesión.");
        }
    }
}


