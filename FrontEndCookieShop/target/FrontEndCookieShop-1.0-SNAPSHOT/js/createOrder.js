document.addEventListener("DOMContentLoaded", () => {
    const globalState = JSON.parse(localStorage.getItem("globalState"));
    let orderItems = [];
    let products = [];

    // Initialization functions
    fetchProducts();
    initializeOrderTable();
    initializeOrderForm();
    fetchOrderItems();
    updateTotal();

    function fetchProducts() {
        fetch("http://localhost:8080/api/products")
            .then(response => response.json())
            .then(fetchedProducts => {
                products = fetchedProducts;
                renderProducts(products);
            })
            .catch(error => console.error("Error fetching products:", error));
    }

    function renderProducts(products) {
        const productList = document.getElementById("productList");
        productList.innerHTML = "";
        products.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("card");
            productDiv.innerHTML = `
            <div id="carousel-${product.id}" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                    ${product.fotoproductos.length ? product.fotoproductos.map((foto, index) => `
                        <div class="carousel-item ${index === 0 ? 'active' : ''}">
                            <img src="http://localhost:8080${foto.foto}" class="d-block" alt="${product.nombre}">
                        </div>
                    `).join('') : '<div class="carousel-item active"><img src="placeholder.jpg" class="d-block" alt="No images available"></div>'}
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${product.id}" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carousel-${product.id}" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
            <div class="card-body">
                <h5 class="card-title">${product.nombre}</h5>
                <p class="card-text">${product.descripcion}</p>
                <p class="card-text"><strong>Precio: $${product.precio}</strong></p>
                <button class="btn btn-primary add-to-cart" data-id="${product.id}">Agregar a Orden</button>
            </div>
        `;
            productList.appendChild(productDiv);
        });

        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = parseInt(event.target.getAttribute('data-id'));
                addToCart(productId);
            });
        });
    }

    function addToCart(productId) {
        const product = products.find(p => p.id === productId); // Use the products variable
        if (product) {
            const existingItem = orderItems.find(item => item.idProducto === product.id);
            if (existingItem) {
                existingItem.cantidad += 1;
            } else {
                orderItems.push({
                    idProducto: product.id,
                    nombre: product.nombre,
                    precio: product.precio,
                    cantidad: 1
                });
            }
            renderOrderItems();
            updateTotal();
        }
    }

    function initializeOrderTable() {
        const orderContainer = document.getElementById('orderContainer');
        orderContainer.innerHTML = `
            <p>La cantidad maxima por producto es 100</p>
            <table class="table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody id="orderTableBody"></tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" style="text-align: right;"><strong>Total:</strong></td>
                        <td id="totalAmount">$0.00</td>
                        <td colspan="1"></td>
                    </tr>
                </tfoot>
            </table>
        `;
    }

    function initializeOrderForm() {
        const formContainer = document.getElementById('formContainer');
        formContainer.innerHTML = `
            <form id="orderForm">
                <label for="medioPago">Medio de Pago</label>
                <select id="medioPago" name="medioPago" required class="form-control">
                    <option value="" disabled selected>Seleccione una opción</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Tarjeta">Tarjeta</option>
                    <option value="Sinpe Movil">Sinpe Movil</option>
                </select>
                <button type="submit" class="btn btn-success mt-2">Crear orden</button>
            </form>
            <div id="orderMessage" class="mt-3"></div>
        `;

        document.getElementById("orderForm").addEventListener("submit", (event) => {
            event.preventDefault();
            submitOrder();
        });
    }

    function fetchOrderItems() {
        orderItems = [
        ];
        renderOrderItems();
    }

    function renderOrderItems() {
        const orderBody = document.getElementById("orderTableBody");
        orderBody.innerHTML = "";
        orderItems.forEach((item, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${item.nombre}</td>
            <td>$${item.precio.toFixed(2)}</td>
            <td>
                <input type="number" min="1" max="100" value="${item.cantidad}" 
                       data-index="${index}" class="quantity-input form-control" />
                <small class="text-danger d-none quantity-warning">Debe ser entre 1 y 100.</small>
            </td>
            <td class="subtotal">$${(item.precio * item.cantidad).toFixed(2)}</td>
            <td><button class="btn btn-danger remove-item" data-index="${index}">Eliminar</button></td>
        `;
            orderBody.appendChild(row);
        });

        document.querySelectorAll(".quantity-input").forEach(input => {
            input.addEventListener("blur", (event) => {
                updateQuantity(event);
            });
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (event) => {
                const itemIndex = parseInt(event.target.getAttribute('data-index'));
                removeOrderItem(itemIndex);
            });
        });

        updateTotal();
    }

    function updateQuantity(event) {
        const index = event.target.dataset.index;
        let quantity = parseInt(event.target.value);

        if (isNaN(quantity) || quantity < 1) {
            quantity = 1;
            event.target.nextElementSibling.classList.remove("d-none");
            event.target.nextElementSibling.textContent = "La cantidad mínima es 1.";
        } else if (quantity > 100) {
            quantity = 100;
            event.target.nextElementSibling.classList.remove("d-none");
            event.target.nextElementSibling.textContent = "La cantidad máxima es 100.";
        } else {
            event.target.nextElementSibling.classList.add("d-none");
        }

        // Set the validated quantity back into the input field
        event.target.value = quantity;
        orderItems[index].cantidad = quantity;

        // Update subtotal display for this row
        const subtotalCell = event.target.closest("tr").querySelector(".subtotal");
        subtotalCell.textContent = `$${(orderItems[index].precio * quantity).toFixed(2)}`;

        updateTotal();
    }

    function updateTotal() {
        const total = orderItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
        document.querySelector("#totalAmount").textContent = `$${total.toFixed(2)}`;
    }

    function removeOrderItem(index) {
        orderItems.splice(index, 1);
        renderOrderItems();
    }

    function submitOrder() {
        const medioPago = document.getElementById("medioPago").value;
        const invalidQuantities = orderItems.filter(item => item.cantidad < 1 || item.cantidad > 100);

        if (invalidQuantities.length > 0) {
            document.getElementById("orderMessage").textContent = "Las cantidades deben estar entre 1 y 100.";
            return;
        }

        const orderData = {
            idUsuario: globalState.user,
            medioPago: medioPago,
            detalleordens: orderItems.map(item => ({
                idProducto: item.idProducto,
                cantidad: item.cantidad,
                subtotal: item.precio * item.cantidad
            }))
        };
        console.log(JSON.stringify(orderData));

        fetch("http://localhost:8080/api/order/createOrder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`HTTP error! status: ${response.status}. Response: ${text}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                document.getElementById("orderMessage").textContent = data.message; // Use the message from the JSON response
                orderItems = [];
                renderOrderItems();
            })
            .catch(error => {
                console.error("Error creating order:", error);
                document.getElementById("orderMessage").textContent = "Error al crear la orden.";
            });
    }

});
