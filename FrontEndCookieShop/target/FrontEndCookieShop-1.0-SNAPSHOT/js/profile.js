document.addEventListener("DOMContentLoaded", function() {
    const globalState = JSON.parse(localStorage.getItem('globalState'));
    const userId = globalState.user; // Get user ID
    const role = globalState.role; // Get user role
    console.log("User ID: ", userId, "Role: ", role); // Log user ID and role

    fetchUserData(userId);

    function fetchUserData(userId) {
        fetch(`http://localhost:8080/api/user/${userId}`)
            .then(response => response.json())
            .then(data => {
                console.log("Fetched User Data: ", data); // Log fetched data
                renderForm(data);
                if (role === 'cliente') {
                    loadAddressData();
                }
            })
            .catch(error => {
                console.log("Error fetching user data: ", error);
                showModal('Error', 'No se pudo cargar la información del usuario.');
            });
    }

    function renderForm(user) {
        const formContainer = document.getElementById("formContainer");
        formContainer.innerHTML = ''; // Clear previous form

        let formFields = `
            <div class="mb-3">
                <label for="idUsuario" class="form-label">ID de Usuario:</label>
                <input type="text" id="idUsuario" name="idUsuario" class="form-control" value="${user.idUsuario}" readonly>
            </div>
            <div class="mb-3">
                <label for="nombre" class="form-label">Nombre:</label>
                <input type="text" id="nombre" name="nombre" class="form-control" value="${user.nombre}" required>
            </div>
            <div class="mb-3">
                <label for="apellido" class="form-label">Apellido:</label>
                <input type="text" id="apellido" name="apellido" class="form-control" value="${user.apellido}" required>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email:</label>
                <input type="email" id="email" name="email" class="form-control" value="${user.email}" required>
            </div>
        `;

        if (role === 'cliente') {
            formFields += `
                <div class="mb-3">
                <label for="telefono" class="form-label">Telefono:</label>
                <input type="text" id="telefono" name="telefono" class="form-control" value="${user.telefono}" required>
                </div>
                <h5>Dirección Principal</h5>
                <div class="mb-3">
                    <label for="provincia" class="form-label">Provincia:</label>
                    <select id="provincia" class="form-control" required>
                        <option value="">Seleccione una provincia</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="canton" class="form-label">Canton:</label>
                    <select id="canton" class="form-control" required>
                        <option value="">Seleccione un cantón</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="distrito" class="form-label">Distrito:</label>
                    <select id="distrito" class="form-control" required>
                        <option value="">Seleccione un distrito</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="descripcion" class="form-label">Descripción:</label>
                    <input type="text" id="descripcion" name="descripcion" class="form-control" required>
                </div>
                <h5>Dirección Secundaria (opcional)</h5>
                <div class="mb-3">
                    <label for="secProvincia" class="form-label">Provincia:</label>
                    <select id="secProvincia" class="form-control">
                        <option value="">Seleccione una provincia</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="secCanton" class="form-label">Canton:</label>
                    <select id="secCanton" class="form-control">
                        <option value="">Seleccione un cantón</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="secDistrito" class="form-label">Distrito:</label>
                    <select id="secDistrito" class="form-control">
                        <option value="">Seleccione un distrito</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="secDescripcion" class="form-label">Descripción:</label>
                    <input type="text" id="secDescripcion" name="secDescripcion" class="form-control">
                </div>
            `;
        }

        formContainer.innerHTML = `
            <form id="userForm">
                ${formFields}
                <button type="submit" class="btn btn-primary">Modificar</button>
            </form>
        `;

        // Add the event listener for form submission
        document.getElementById("userForm").addEventListener("submit", function(event) {
            event.preventDefault();
            console.log("Profile form submitted"); // Log form submission

            const user = getUserData();
            console.log("Updated User Data: ", user); // Log updated user data

            const endpoint = role === 'cliente'
                ? `http://localhost:8080/api/user/cliente/${userId}`
                : `http://localhost:8080/api/user/dependiente/${userId}`;

            fetch(endpoint, {
                method: 'PUT',
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
                    window.location.href = window.location.origin + '/FrontEndCookieShop-1.0-SNAPSHOT/index.html';
                })
                .catch(error => {
                    console.log("Error: ", error); // Log any errors
                    showModal('Error', error.message);
                });
        });
    }

    function getUserData() {
        if(role === 'cliente'){
        const primaryAddress = {
            provincia: document.getElementById("provincia").selectedOptions[0].text,
            canton: document.getElementById("canton").selectedOptions[0].text,
            distrito: document.getElementById("distrito").selectedOptions[0].text,
            descripcion: document.getElementById("descripcion").value,
            tipo: "principal"
        };

        const secondaryAddress = {
            provincia: document.getElementById("secProvincia").selectedOptions[0].text,
            canton: document.getElementById("secCanton").selectedOptions[0].text,
            distrito: document.getElementById("secDistrito").selectedOptions[0].text,
            descripcion: document.getElementById("secDescripcion").value,
            tipo: "alternativa"
        };

        return {
            nombre: document.getElementById("nombre").value,
            apellido: document.getElementById("apellido").value,
            email: document.getElementById("email").value,
            telefono: document.getElementById("telefono").value,
            addresses: [primaryAddress, secondaryAddress]
        };
        }
        else{
            return {
                nombre: document.getElementById("nombre").value,
                apellido: document.getElementById("apellido").value,
                email: document.getElementById("email").value
            };
        }
    }

    function loadAddressData() {
        fetch('../json/provincias.json') // Adjust the path to your JSON file
            .then(response => response.json())
            .then(data => {
                populateAddressFields(data);
            })
            .catch(error => {
                console.log("Error loading address data: ", error);
            });
    }

    function populateAddressFields(data) {
        const provinceSelect = document.getElementById("provincia");
        const cantonSelect = document.getElementById("canton");
        const districtSelect = document.getElementById("distrito");
        const secProvinceSelect = document.getElementById("secProvincia");
        const secCantonSelect = document.getElementById("secCanton");
        const secDistrictSelect = document.getElementById("secDistrito");

        Object.entries(data).forEach(([key, value]) => {
            const option = new Option(value.nombre, key);
            provinceSelect.add(option.cloneNode(true));
            secProvinceSelect.add(option);
        });

        provinceSelect.addEventListener('change', function() {
            const provinciaId = provinceSelect.value;
            populateCantones(data[provinciaId].cantones, cantonSelect, districtSelect);
        });

        cantonSelect.addEventListener('change', function() {
            const provinciaId = provinceSelect.value;
            const cantonId = cantonSelect.value;
            populateDistritos(data[provinciaId].cantones[cantonId].distritos, districtSelect);
        });

        secProvinceSelect.addEventListener('change', function() {
            const provinciaId = secProvinceSelect.value;
            populateCantones(data[provinciaId].cantones, secCantonSelect, secDistrictSelect);
        });

        secCantonSelect.addEventListener('change', function() {
            const provinciaId = secProvinceSelect.value;
            const cantonId = secCantonSelect.value;
            populateDistritos(data[provinciaId].cantones[cantonId].distritos, secDistrictSelect);
        });
    }

    function populateCantones(cantones, cantonSelect, districtSelect) {
        cantonSelect.innerHTML = `<option value="">Seleccione un cantón</option>`;
        districtSelect.innerHTML = `<option value="">Seleccione un distrito</option>`; // Reinicia distritos

        Object.entries(cantones).forEach(([key, value]) => {
            const option = new Option(value.nombre, key);
            cantonSelect.add(option);
        });
    }

    function populateDistritos(distritos, districtSelect) {
        districtSelect.innerHTML = `<option value="">Seleccione un distrito</option>`;
        Object.entries(distritos).forEach(([key, value]) => {
            const option = new Option(value, key);
            districtSelect.add(option);
        });
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
