document.addEventListener("DOMContentLoaded", function() {
    const globalState = JSON.parse(localStorage.getItem("globalState"));
    const clientId = globalState?.user; // Verifica si el usuario está autenticado

    console.log("clientId:", clientId); // Agrega esto para verificar el valor de clientId

    if (!clientId) {
        alert("Debes iniciar sesión para ver tus órdenes.");
        window.location.href = "/FrontEndCookieShop-1.0-SNAPSHOT/login/ViewLogin.html";
        return;
    }

    fetchCustomerOrders(clientId);

    function fetchCustomerOrders(clientId) {
        fetch(`http://localhost:8081/api/order/customerOrders?clientId=${clientId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })

            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al obtener las órdenes. Por favor, intenta nuevamente.");
                }
                return response.json();
            })
            .then(orders => {
                if (!orders || orders.length === 0) {
                    document.getElementById("orderList").innerHTML = "<p>No tienes órdenes registradas.</p>";
                } else {
                    renderOrders(orders);
                }
            })
            .catch(error => {
                console.error("Error fetching orders:", error);
                document.getElementById("orderList").innerHTML = `<p>Error al obtener las órdenes: ${error.message}</p>`;
            });
    }

    function renderOrders(orders) {
        const orderList = document.getElementById("orderList");
        orderList.innerHTML = orders.map(order => `
            <div class="order-item card mb-3 p-3">
                <p><strong>ID Orden:</strong> ${order.id}</p>
                <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
                <p><strong>Estado:</strong> ${order.estado}</p>
                <p><strong>Fecha de Entrega:</strong> ${order.fechaEntrega || 'No disponible'}</p>
                <p><strong>Hora de Entrega:</strong> ${order.horaEntrega || 'No disponible'}</p>
                <h5>Detalles de Orden:</h5>
                <ul>
                    ${order.detalleordens.map(item => `
                        <li>${item.nombreProducto} - ${item.cantidad} x $${item.precioUnitario.toFixed(2)} = $${item.subtotal.toFixed(2)}</li>
                    `).join('')}
                </ul>
            </div>
        `).join("");
    }
});
