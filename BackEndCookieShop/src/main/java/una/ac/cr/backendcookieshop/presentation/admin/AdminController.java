package una.ac.cr.backendcookieshop.presentation.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import una.ac.cr.backendcookieshop.logic.Service;
import una.ac.cr.backendcookieshop.logic.UserDTO;
import una.ac.cr.backendcookieshop.logic.Usuario;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/solicitudes")
public class AdminController {
    @Autowired
    Service service;

    @GetMapping
    public List<UserDTO> getSolicitudes() {
        return service.usuarioFindAll();
    }

    @PostMapping("/aceptarSolicitud")
    public ResponseEntity<String> aceptarSolicitud(@RequestParam String idUsuario) {
        try {
            Optional<Usuario> usuario = service.usuarioFindById(idUsuario);
            if (usuario.isPresent()) {
                Usuario usuarioAux = usuario.get();
                usuarioAux.setEstado("datos");
                service.usuarioSave(usuarioAux);
                return ResponseEntity.ok("El usuario con id: " + idUsuario + " ha sido aceptado.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Usuario con id: " + idUsuario + " no encontrado.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/cambiarEstado")
    public ResponseEntity<String> cambiarEstado(@RequestParam String idUsuario) {
        try {
            Optional<Usuario> usuario = service.usuarioFindById(idUsuario);
            if (usuario.isPresent()) {
                Usuario usuarioAux = usuario.get();
                usuarioAux.setEstado("activo".equals(usuarioAux.getEstado()) ? "desactivado" : "activo");
                service.usuarioSave(usuarioAux);
                return ResponseEntity.ok("El estado ha sido cambiado.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Usuario con id: " + idUsuario + " no encontrado.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

}
