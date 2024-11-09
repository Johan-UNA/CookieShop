document.addEventListener("DOMContentLoaded", function() {
    const mainContainer = document.getElementById("productFormContainer");
    mainContainer.innerHTML = `
        <h2 id="formTitle" class="mb-4"></h2>
        <form id="productForm" enctype="multipart/form-data">
            <div class="mb-3">
                <label for="nombre" class="form-label">Nombre del Producto:</label>
                <input type="text" id="nombre" name="nombre" class="form-control" required>
            </div>

            <div class="mb-3">
                <label for="descripcion" class="form-label">Descripción:</label>
                <textarea id="descripcion" name="descripcion" class="form-control" required></textarea>
            </div>

            <div class="mb-3">
                <label for="precio" class="form-label">Precio:</label>
                <input type="number" id="precio" name="precio" class="form-control" min="0.1" max="100" step="0.01" required>
                <small class="text-danger d-none" id="precioError">El precio debe estar entre $0.01 y $100.</small>
            </div>

            <div class="mb-3">
                <label for="fotos" class="form-label">Subir Fotos (máximo 3):</label>
                <input type="file" id="fotos" name="fotos" class="form-control" accept="image/*" multiple>
                <small class="text-danger d-none" id="fotosError">Solo puedes subir hasta 3 imágenes.</small>
            </div>

            <button type="submit" class="btn btn-primary" id="submitButton"></button>
        </form>
        <div id="resultMessage"></div>
    `;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
    const isEditMode = productId !== null;

    const formTitle = document.getElementById("formTitle");
    const submitButton = document.getElementById("submitButton");

    if (isEditMode) {
        formTitle.textContent = "Edición de Producto";
        submitButton.textContent = "Actualizar Producto";
        loadProductData(productId);
    } else {
        formTitle.textContent = "Creación de Producto";
        submitButton.textContent = "Agregar Producto";
    }

    document.getElementById("productForm").addEventListener("submit", function(event) {
        event.preventDefault();

        const precio = parseFloat(document.getElementById("precio").value);
        const precioError = document.getElementById("precioError");
        if (isNaN(precio) || precio <= 0 || precio > 100) {
            precioError.classList.remove("d-none");
            return;
        } else {
            precioError.classList.add("d-none");
        }

        // Validar el número de fotos
        const fotos = document.getElementById("fotos").files;
        const fotosError = document.getElementById("fotosError");
        if (fotos.length > 3) {
            fotosError.classList.remove("d-none");
            return;
        } else {
            fotosError.classList.add("d-none");
        }

        const formData = new FormData();
        formData.append("nombre", document.getElementById("nombre").value);
        formData.append("descripcion", document.getElementById("descripcion").value);
        formData.append("precio", precio);

        for (let i = 0; i < fotos.length; i++) {
            formData.append("fotos", fotos[i]);
        }

        const url = isEditMode
            ? `http://localhost:8080/api/products/${productId}/update`
            : 'http://localhost:8080/api/products/add';

        fetch(url, {
            method: isEditMode ? 'PUT' : 'POST',
            body: formData
        })
            .then(response => response.text())
            .then(result => {
                document.getElementById("resultMessage").textContent = result;
                if (!isEditMode) document.getElementById("productForm").reset();
            })
            .catch(error => {
                document.getElementById("resultMessage").textContent = 'Error: ' + error;
            });
    });

    function loadProductData(productId) {
        fetch(`http://localhost:8080/api/products/${productId}`)
            .then(response => response.json())
            .then(product => {
                document.getElementById("nombre").value = product.nombre;
                document.getElementById("descripcion").value = product.descripcion;
                document.getElementById("precio").value = product.precio;
            })
            .catch(error => {
                document.getElementById("resultMessage").textContent = 'Error al cargar el producto: ' + error;
            });
    }
});
