document.addEventListener("DOMContentLoaded", function () {
    const globalState = JSON.parse(localStorage.getItem('globalState'));
    const userId = globalState.user;
    const role = globalState.role;

    fetchFacturas();

    // Función para obtener y mostrar la lista de facturas
    function fetchFacturas() {
        const endpoint = `http://localhost:8080/api/factura/getFacturas?userId=${userId}&role=${role}`;

        fetch(endpoint, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                console.log("Estado de la respuesta:", response.status);
                return response.json();
            })
            .then(facturas => {
                console.log("Datos de facturas recibidos:", facturas);
                mostrarListaFacturas(facturas);
            })
            .catch(error => console.error('Error al obtener facturas:', error));
    }

    // Función para mostrar la lista de facturas
    function mostrarListaFacturas(facturas) {
        const container = document.getElementById("facturas-container");
        container.innerHTML = '';
        document.getElementById("factura-container").innerHTML = '';

        const table = document.createElement("table");
        table.classList.add("table", "table-striped");
        table.innerHTML = `
            <thead>
                <tr>
                    <th>ID Factura</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Usuario</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${facturas.map(factura => `
                    <tr>
                        <td>${factura.idFactura}</td>
                        <td>${new Date(factura.fechaCreacion).toLocaleDateString()}</td>
                        <td>${factura.orden.cliente.nombre} ${factura.orden.cliente.apellido}</td>
                        <td>${factura.orden.nombreUsuario}</td>
                        <td>
                            <button class="btn btn-primary btn-sm ver-factura" data-id="${factura.idFactura}">Ver</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        `;

        container.appendChild(table);

        // Añadir el evento a los botones
        const botonesVerFactura = document.querySelectorAll('.ver-factura');
        botonesVerFactura.forEach(boton => {
            boton.addEventListener('click', function() {
                const idFactura = this.getAttribute('data-id');
                verFactura(idFactura);
            });
        });
    }

    // Función para obtener y mostrar el detalle de la factura
    function verFactura(idFactura) {
        fetch(`http://localhost:8080/api/factura/getFactura?idFactura=${idFactura}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(factura => {
                mostrarFactura(factura);
            })
            .catch(error => console.error('Error al obtener la factura:', error));
    }

    function mostrarFactura(factura) {
        const container = document.getElementById('factura-container');
        const title = document.getElementById("title");
        title.textContent = "Detalle de Factura";
        document.getElementById("facturas-container").innerHTML = '';

        const impuestoPorcentaje = 0.13;
        const totalConImpuesto = factura.orden.total * (1 + impuestoPorcentaje);

        container.innerHTML = `
        <div class="invoice border p-4">
            <h1 class="text-center">Factura</h1>
            <div class="text-center mb-4">
                <img src="ruta/al/logo.png" alt="Logo" style="width: 50px;">
                <h2>Cookie Shop</h2>
            </div>
            <div class="details mb-4">
                <strong>Cliente:</strong> ${factura.orden.cliente.nombre} ${factura.orden.cliente.apellido}<br>
                <strong>Email:</strong> ${factura.orden.cliente.email}<br>
                <strong>Teléfono:</strong> ${factura.orden.cliente.telefono}<br>
                <strong>Fecha:</strong> ${new Date(factura.fechaCreacion).toLocaleDateString()}<br>
            </div>
            <table class="table">
                <thead class="thead-light">
                    <tr>
                        <th>Producto</th>
                        <th>Descripción</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${factura.orden.detalleordens.map(detalle => `
                        <tr>
                            <td>${detalle.nombreProducto}</td>
                            <td>${detalle.descripcionProducto}</td>
                            <td>${detalle.cantidad}</td>
                            <td>$${detalle.precioUnitario.toFixed(2)}</td>
                            <td>$${detalle.subtotal.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="4" class="text-end font-weight-bold">Total:</td>
                        <td>$${factura.orden.total.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="4" class="text-end font-weight-bold">Impuesto (13%):</td>
                        <td>$${(factura.orden.total * impuestoPorcentaje).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="4" class="text-end font-weight-bold">Total con Impuesto:</td>
                        <td>$${totalConImpuesto.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
            <button class="btn btn-secondary mt-3" id="volver-facturas">Volver a la lista de facturas</button>
        </div>
    `;

        document.getElementById('volver-facturas').addEventListener('click', fetchFacturas);
    }
});
