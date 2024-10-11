package una.ac.cr.backendcookieshop.presentation.products;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import una.ac.cr.backendcookieshop.logic.Fotoproducto;
import una.ac.cr.backendcookieshop.logic.Producto;
import una.ac.cr.backendcookieshop.logic.Service;

import java.nio.file.Paths;
import java.util.LinkedHashSet;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private Service service;

    @Value("${upload.dir}")
    private String uploadDir;

    @GetMapping
    public List<Producto> getProducts() {
        List<Producto> productos = (List<Producto>) service.productoFindAll();

        for (Producto producto : productos) {
            List<Fotoproducto> fotos = service.fotoProductoFindByIdProducto(producto);
            producto.setFotoproductos(new LinkedHashSet<>(fotos));

            for (Fotoproducto foto : fotos) {
                foto.setFoto("/uploads/" + foto.getFoto());
            }
        }

        return productos;
    }

    @GetMapping("/images/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        Path path = Paths.get(uploadDir, filename);
        Resource resource = new FileSystemResource(path);

        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }

        String contentType = null;
        String fileExtension = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();

        contentType = switch (fileExtension) {
            case "jpg", "jpeg" -> MediaType.IMAGE_JPEG_VALUE;
            case "png" -> MediaType.IMAGE_PNG_VALUE;
            case "gif" -> MediaType.IMAGE_GIF_VALUE;
            default -> MediaType.APPLICATION_OCTET_STREAM_VALUE;
        };

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }

    @PostMapping("/add")
    public ResponseEntity<String> addProduct(
            @RequestParam("nombre") String nombre,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("precio") Double precio,
            @RequestParam("fotos") MultipartFile[] fotos) {

        try {
            // Crear nuevo producto
            Producto nuevoProducto = new Producto();
            nuevoProducto.setNombre(nombre);
            nuevoProducto.setDescripcion(descripcion);
            nuevoProducto.setPrecio(BigDecimal.valueOf(precio));
            service.productoSave(nuevoProducto);

            Path uploadPath = Paths.get(uploadDir);
            for (MultipartFile foto : fotos) {
                String fileName = System.currentTimeMillis() + "_" + foto.getOriginalFilename();
                Path path = uploadPath.resolve(fileName);
                Files.copy(foto.getInputStream(), path);

                Fotoproducto nuevaFoto = new Fotoproducto();
                nuevaFoto.setIdProducto(nuevoProducto);
                nuevaFoto.setFoto(fileName);
                service.fotoProductoSave(nuevaFoto);
            }

            return ResponseEntity.ok("Producto y fotos subidos exitosamente.");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al subir archivos: " + e.getMessage());
        }
    }
}


