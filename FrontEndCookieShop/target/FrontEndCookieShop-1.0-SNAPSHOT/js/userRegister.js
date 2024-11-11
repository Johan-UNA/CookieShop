document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const userType = urlParams.get('type') || 'usuario';
    console.log("User Type: ", userType); // Log user type

    renderForm(userType);

    function renderForm(type) {
        const formContainer = document.getElementById("formContainer");
        formContainer.innerHTML = ''; // Clear previous form

        const commonFields = `
            <div class="mb-3">
                <label class="form-label">Proovedor</label>
            </div>
            <div class="mb-3">
                <label for="nombre" class="form-label">Nombre:</label>
                <input type="text" id="nombre" name="nombre" class="form-control" required>
            </div>
            <div class="mb-3">
                <label for="apellido" class="form-label">Apellido:</label>
                <input type="text" id="apellido" name="apellido" class="form-control" required>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email:</label>
                <input type="email" id="email" name="email" class="form-control" required>
            </div>
            <div class="mb-3">
                <label for="contrasena" class="form-label">Contraseña:</label>
                <input type="password" id="contrasena" name="contrasena" class="form-control" required>
            </div>
        `;

        const specificFields = type === 'cliente' ? `
             <div class="mb-3">
                <label class="form-label">Cliente</label>
            </div>
            <div class="mb-3">
                <label for="idCliente" class="form-label">Identificación:</label>
                <input type="text" id="idCliente" name="idCliente" class="form-control" required>
            </div>
            <div class="mb-3">
                <label for="telefono" class="form-label">Teléfono:</label>
                <input type="text" id="telefono" name="telefono" class="form-control" required>
            </div>
        ` : `
            <div class="mb-3">
                <label for="idUsuario" class="form-label">Identificación:</label>
                <input type="text" id="idUsuario" name="idUsuario" class="form-control" required>
            </div>
        `;

        formContainer.innerHTML = `
            <form id="userForm">
                ${commonFields}
                ${specificFields}
                <button type="submit" class="btn btn-primary">Registrarse</button>
            </form>
        `;

        // Add the event listener for form submission
        document.getElementById("userForm").addEventListener("submit", function(event) {
            event.preventDefault();
            console.log("Form submitted"); // Log form submission

            const email = document.getElementById("email").value;
            if (!validateEmail(email)) {
                showModal('Error', 'Por favor, ingrese un correo electrónico válido con al menos un dominio.');
                return;
            }

            const user = userType === 'cliente' ? getClienteData() : getUsuarioData();
            console.log("User Data: ", user); // Log user data

            fetch(`http://localhost:8080/api/login/registro${userType.charAt(0).toUpperCase() + userType.slice(1)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            })
                .then(response => {
                    console.log("Response Status: ", response.status); // Log response status
                    return response.ok ? response.text() : response.text().then(text => { throw new Error(text); });
                })
                .then(message => {
                    console.log("Server Message: ", message); // Log server message
                    showModal('Éxito', message);
                    document.getElementById("userForm").reset();
                })
                .catch(error => {
                    console.log("Error: ", error); // Log any errors
                    showModal('Error', error.message);
                });
        });
    }

    function validateEmail(email) {
        const parts = email.split('@');
        return parts.length === 2 && parts[1].split('.').length > 1;
    }

    function getUsuarioData() {
        return {
            idUsuario: document.getElementById("idUsuario").value,
            nombre: document.getElementById("nombre").value,
            apellido: document.getElementById("apellido").value,
            email: document.getElementById("email").value,
            contrasena: document.getElementById("contrasena").value
        };
    }

    function getClienteData() {
        return {
            idCliente: document.getElementById("idCliente").value,
            nombre: document.getElementById("nombre").value,
            apellido: document.getElementById("apellido").value,
            email: document.getElementById("email").value,
            contrasena: document.getElementById("contrasena").value,
            telefono: document.getElementById("telefono").value
        };
    }

    function showModal(title, message) {
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        modalTitle.textContent = title;
        modalBody.textContent = message;
        const modal = new bootstrap.Modal(document.getElementById('messageModal'));
        modal.show();
    }
});
