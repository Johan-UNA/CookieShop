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

            if (role === "dependiente" && !["cancelado", "entregado"].includes(order.estado.toLowerCase())) {
                const statusCell = document.createElement("td");
                const statusSelect = renderStatusSelect(order, order.estado);
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

    function getStatusOptions(currentStatus) {
        const options = [
            { value: "", label: "Seleccionar", disabled: true } // Opción predeterminada
        ];

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

    function renderStatusSelect(order, currentStatus) {
        const select = document.createElement("select");
        select.classList.add("form-control");

        const options = getStatusOptions(currentStatus);
        options.forEach(option => {
            const opt = document.createElement("option");
            opt.value = option.value;
            opt.textContent = option.label;
            if (option.disabled) opt.disabled = true;
            select.appendChild(opt);
        });

        select.value = "";

        select.addEventListener("change", () => {
            const newStatus = select.value;
            if (newStatus === "cancelado") {
                showCancellationModal(order.id, newStatus, order.medioPago);
            } else {
                updateOrderStatus(order.id, newStatus);
            }
        });

        return select;
    }

    function showCancellationModal(orderId, newStatus, paymentMethod) {
        let reasons = [];
        switch (paymentMethod) {
            case "Tarjeta":
                reasons = ["Producto insuficiente", "Método de pago inválido", "Solicitado por el cliente"];
                break;
            case "Sinpe Movil":
                reasons = ["Producto insuficiente", "Pago no recibido", "Solicitado por el cliente"];
                break;
            case "Efectivo":
            default:
                reasons = ["Producto insuficiente", "Solicitado por el cliente"];
        }

        const reasonOptions = reasons.map(reason => `<option value="${reason}">${reason}</option>`).join('');

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
                                ${reasonOptions}
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
                showAlertModal("Estado de la orden actualizado.");
                fetchOrders();
            })
            .catch(error => {
                console.error("Error al actualizar el estado de la orden:", error);
                showAlertModal("Error al actualizar el estado de la orden.");
            });
    }

    function showAlertModal(message) {
        const modalContent = `
            <div class="modal fade" id="alertModal" tabindex="-1" aria-labelledby="alertModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="alertModalLabel">Notificación</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">${message}</div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Aceptar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalContent);
        const alertModal = new bootstrap.Modal(document.getElementById("alertModal"));
        alertModal.show();
        alertModal._element.addEventListener('hidden.bs.modal', () => {
            document.getElementById("alertModal").remove();
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

        const fechaEntrega = new Date(order.fechaEntrega);
        const fechaEntregaFormateada = fechaEntrega.toLocaleDateString() + " " + fechaEntrega.toLocaleTimeString();

        container.innerHTML = `
        <div class="order-details border p-4">
            
            <div class="details mb-4">
                <strong>Cliente:</strong> ${order.cliente.nombre} ${order.cliente.apellido}<br>
                <strong>Fecha de Entrega:</strong> ${fechaEntregaFormateada}<br>
                <strong>Estado:</strong> ${order.estado}<br>
                ${order.estado === "cancelado" ? `<strong>Motivo de Cancelación:</strong> ${order.motivoCancelacion}<br>` : ''}
                ${order.nombreUsuario ? `<strong>Proveedor Asignado:</strong> ${order.nombreUsuario}<br>` : ''}
            </div>

            <h3>Productos en la Orden</h3>
            <table class="table table-striped">
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
            </table>

            <div class="total mb-3">
                <strong>Total:</strong> $${order.total.toFixed(2)}<br>
            </div>

            <button class="btn btn-secondary mt-3" id="back-to-orders">Volver a la lista de órdenes</button>
        </div>
    `;

        document.getElementById("back-to-orders").addEventListener("click", fetchOrders);
    }
});
