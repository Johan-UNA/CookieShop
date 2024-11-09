document.addEventListener("DOMContentLoaded", function() {
    const globalState = JSON.parse(localStorage.getItem("globalState"));
    const userId = globalState.user;
    const role = globalState.role;

    fetchOrders();

    function fetchOrders() {
        const endpoint = `http://localhost:8080/api/order/getOrders?userId=${userId}&role=${role}`;

        fetch(endpoint, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
            .then(response => response.json())
            .then(orders => {
                showOrderList(orders);
            })
            .catch(error => console.error("Error al obtener órdenes:", error));
    }

    function showOrderList(orders) {
        const container = document.getElementById("orders-container");
        container.innerHTML = "";
        document.getElementById("order-details-container").innerHTML = "";

        const table = document.createElement("table");
        table.classList.add("table", "table-striped");

        let tableHeaders = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Cliente</th>`;
        if (role === "administrador") {
            tableHeaders += `<th>Proveedor</th>`;
        }
        tableHeaders += `
                    <th>Fecha Entrega</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Detalles</th>
                </tr>
            </thead>
        `;
        table.innerHTML = tableHeaders;

        const tbody = document.createElement("tbody");
        orders.forEach(order => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.cliente.nombre} ${order.cliente.apellido}</td>
            `;
            if (role === "administrador") {
                row.innerHTML += `<td>${order.nombreUsuario || "No asignado"}</td>`;
            }
            row.innerHTML += `
                <td>${new Date(order.fechaEntrega).toLocaleDateString()}</td>
                <td>$${order.total.toFixed(2)}</td>
                <td>${order.estado}</td>
                <td>
                    <button class="btn btn-primary btn-sm ver-orden" data-id="${order.id}">Ver</button>
                </td>
            `;

            if (role === "dependiente" && !["Cancelado", "Entregada"].includes(order.estado)) {
                const statusCell = document.createElement("td");
                const statusSelect = createStatusSelect(order.estado, order.id);
                statusCell.appendChild(statusSelect);
                row.appendChild(statusCell);
            } else {
                row.appendChild(document.createElement("td"));
            }

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        container.appendChild(table);

        document.querySelectorAll(".ver-orden").forEach(button => {
            button.addEventListener("click", function() {
                const orderId = this.getAttribute("data-id");
                viewOrderDetails(orderId);
            });
        });
    }

    function createStatusSelect(currentStatus, orderId) {
        const select = document.createElement("select");
        select.classList.add("form-control", "form-control-sm");
        select.dataset.orderId = orderId;

        const statusOptions = getStatusOptions(currentStatus);
        statusOptions.forEach(option => {
            const opt = document.createElement("option");
            opt.value = option.value;
            opt.textContent = option.label;
            select.appendChild(opt);
        });

        select.addEventListener("change", function() {
            const newStatus = this.value;
            if (newStatus === "Cancelado") {
                showCancellationModal(orderId, newStatus);
            } else {
                updateOrderStatus(orderId, newStatus);
            }
        });

        return select;
    }

    function getStatusOptions(currentStatus) {
        const options = [];
        switch (currentStatus) {
            case "pendiente":
                options.push({ value: "en proceso", label: "En Proceso" });
                options.push({ value: "cancelado", label: "Cancelado" });
                break;
            case "en proceso":
                options.push({ value: "lista", label: "Lista para entrega" });
                options.push({ value: "cancelado", label: "Cancelado" });
                break;
            case "lista":
                options.push({ value: "entregado", label: "Entregada" });
                options.push({ value: "cancelado", label: "Cancelado" });
                break;
            default:
                options.push({ value: currentStatus, label: currentStatus, disabled: true });
        }
        return options;
    }

    function showCancellationModal(orderId, newStatus) {
        const modalContent = `
            <div class="modal fade" id="cancellationModal" tabindex="-1" aria-labelledby="cancellationModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="cancellationModalLabel">Razón para Cancelar</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <select id="cancellationReason" class="form-control">
                                <option value="Producto insuficiente">Producto insuficiente</option>
                                <option value="Método de pago inválido">Método de pago inválido (solo tarjeta de crédito)</option>
                                <option value="Pago no recibido">Pago no recibido (solo transferencia o sinpe)</option>
                                <option value="Solicitado por el cliente">Solicitado por el cliente</option>
                            </select>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" class="btn btn-danger" id="confirmCancel">Confirmar Cancelación</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalContent);
        const cancellationModal = new bootstrap.Modal(document.getElementById("cancellationModal"));
        cancellationModal.show();

        document.getElementById("confirmCancel").addEventListener("click", function() {
            const reason = document.getElementById("cancellationReason").value;
            updateOrderStatus(orderId, newStatus, reason);
            cancellationModal.hide();
            document.getElementById("cancellationModal").remove();
        });
    }

    function updateOrderStatus(orderId, newStatus, cancellationReason = null) {
        fetch("http://localhost:8080/api/order/updateStatus", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId, newStatus, cancellationReason, userId })
        })
            .then(response => {
                if (!response.ok) throw new Error("No se pudo cambiar el estado.");
                return response.json();
            })
            .then(() => {
                alert("Estado de la orden actualizado.");
                fetchOrders();
            })
            .catch(error => {
                console.error("Error al actualizar el estado de la orden:", error);
                alert("Error al actualizar el estado de la orden.");
            });
    }

    function viewOrderDetails(orderId) {
        fetch(`http://localhost:8080/api/order/getOrder?orderId=${orderId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
            .then(response => response.json())
            .then(order => {
                showOrderDetails(order);
            })
            .catch(error => console.error("Error al obtener detalles de la orden:", error));
    }

    function showOrderDetails(order) {
        const container = document.getElementById("order-details-container");
        const title = document.getElementById("title");
        title.textContent = "Detalle de Orden";
        document.getElementById("orders-container").innerHTML = "";

        container.innerHTML = `
            <div class="invoice border p-4">
                <h2 class="text-center">Detalle de Orden</h2>
                <div class="details mb-4">
                    <strong>Cliente:</strong> ${order.cliente.nombre} ${order.cliente.apellido}<br>
                    <strong>Fecha de Entrega:</strong> ${new Date(order.fechaEntrega).toLocaleDateString()}<br>
                    <strong>Total:</strong> $${order.total.toFixed(2)}<br>
                    <strong>Estado:</strong> ${order.estado}<br>
                </div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Descripción</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.detalleordens.map(item => `
                            <tr>
                                <td>${item.nombreProducto}</td>
                                <td>${item.descripcionProducto}</td>
                                <td>${item.cantidad}</td>
                                <td>$${item.precioUnitario.toFixed(2)}</td>
                                <td>$${item.subtotal.toFixed(2)}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="4" class="text-end font-weight-bold">Total:</td>
                            <td>$${order.total.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colspan="4" class="text-end font-weight-bold">Impuesto (13%):</td>
                            <td>$${(order.total * 0.13).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colspan="4" class="text-end font-weight-bold">Total con Impuesto:</td>
                            <td>$${(order.total * 1.13).toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
                <button class="btn btn-secondary mt-3" id="back-to-orders">Volver a la lista de órdenes</button>
            </div>
        `;

        document.getElementById("back-to-orders").addEventListener("click", fetchOrders);
    }
});
