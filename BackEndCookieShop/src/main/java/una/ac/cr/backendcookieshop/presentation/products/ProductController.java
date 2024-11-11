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
import org.springframework.orm.jpa.JpaObjectRetrievalFailureException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import una.ac.cr.backendcookieshop.logic.*;

import java.nio.file.Paths;
import java.util.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private Service service;

    @Value("${upload.dir}")
    private String uploadDir;

    @GetMapping
    public ProductResponse getProducts(@RequestParam String userId) {
        List<ProductoDTO> productos = service.productoDTOS();

        for (ProductoDTO producto : productos) {
            for (Fotoproducto foto : producto.getFotoproductos()) {
                foto.setFoto("/uploads/" + foto.getFoto());
            }
        }
        List<Integer> purchasedProductIds = new ArrayList<>();
        Optional<Cliente> cliente = service.clienteFindById(userId);
        if (cliente.isPresent()) {
            for (Producto p : service.obtenerProductosCompradosPorCliente(cliente.get())) {
                purchasedProductIds.add(p.getId());
            }
        }

        return new ProductResponse(productos, purchasedProductIds);
    }

    @GetMapping("/order")
    public List<ProductoDTO> getProducts() {
        List<ProductoDTO> productos = service.productoDTOS();

        for (ProductoDTO producto : productos) {
            for (Fotoproducto foto : producto.getFotoproductos()) {
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

    @GetMapping("/{id}")
    public ResponseEntity<ProductoDTO> getProduct(@PathVariable Integer id) {
        Optional<Producto> productOpt = service.productoFindById(id);

        return productOpt
                .map(product -> {
                    ProductoDTO productoDTO = service.convertToProductoDTO(product);
                    return ResponseEntity.ok(productoDTO);
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    @PutMapping("/{id}/update")
    public ResponseEntity<String> updateProduct(
            @PathVariable Integer id,
            @RequestParam("nombre") String nombre,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("precio") BigDecimal precio,
            @RequestParam(value = "fotos", required = false) List<MultipartFile> fotos) {

        Optional<Producto> productOpt = service.productoFindById(id);

        if (productOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Producto no encontrado.");
        }

        try {
            Producto product = productOpt.get();
            product.setNombre(nombre);
            product.setDescripcion(descripcion);
            product.setPrecio(precio);

            if (fotos != null && !fotos.isEmpty()) {
                for (Fotoproducto foto : product.getFotoproductos()) {
                    Path pathToDelete = Paths.get(uploadDir).resolve(foto.getFoto());
                    Files.deleteIfExists(pathToDelete);
                    service.deleteFotoProducto(foto);
                }

                Path uploadPath = Paths.get(uploadDir);
                for (MultipartFile foto : fotos) {
                    String fileName = System.currentTimeMillis() + "_" + foto.getOriginalFilename();
                    Path path = uploadPath.resolve(fileName);
                    Files.copy(foto.getInputStream(), path);

                    Fotoproducto nuevaFoto = new Fotoproducto();
                    nuevaFoto.setIdProducto(product);
                    nuevaFoto.setFoto(fileName);
                    service.fotoProductoSave(nuevaFoto);
                }
            }

            service.productoSave(product);

            return ResponseEntity.ok("Producto actualizado exitosamente.");

        } catch (JpaObjectRetrievalFailureException e) {
            return ResponseEntity.ok("Producto actualizado exitosamente.");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar el producto: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/rate")
    public ResponseEntity<Map<String, String>> rateProduct(@PathVariable Integer id,
                                                           @RequestBody CalificacionDTO calificacionRequest) {
        Optional<Cliente> clienteOpt = service.clienteFindById(calificacionRequest.getIdUsuario());
        Optional<Producto> productoOpt = service.productoFindById(id);

        if (clienteOpt.isEmpty() || productoOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("message", "Cliente o Producto no encontrado."));
        }

        Cliente cliente = clienteOpt.get();
        Producto producto = productoOpt.get();

        try {
            Optional<Calificacion> existingCalificacion = service.calificacionFindByClienteAndProducto(cliente, producto);

            Calificacion calificacion;
            if (existingCalificacion.isPresent()) {
                calificacion = existingCalificacion.get();
                calificacion.setCalificacion(calificacionRequest.getRating());
            } else {
                calificacion = new Calificacion();
                calificacion.setIdProducto(producto);
                calificacion.setIdCliente(cliente);
                calificacion.setCalificacion(calificacionRequest.getRating());
            }

            service.calificacionSave(calificacion);

            return ResponseEntity.ok(Collections.singletonMap("message", "Producto calificado exitosamente."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("message", "Error al enviar calificación: " + e.getMessage()));
        }
    }



}



