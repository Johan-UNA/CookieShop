document.addEventListener("DOMContentLoaded", function() {
    // Inicializa el estado global si no existe en localStorage
    let globalState = JSON.parse(localStorage.getItem('globalState')) || {};
    document.getElementById("loginForm").addEventListener("submit", function(event) {
        event.preventDefault();

        const user = {
            usuario: document.getElementById("usuario").value,
            password: document.getElementById("password").value
        };

        fetch('http://localhost:8080/api/login/authenticate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Credenciales incorrectas."); // Handle unauthorized
                }
                return response.json();
            })
            .then(data => {
                globalState.user = data.usuario;
                globalState.role = data.role;

                localStorage.setItem('globalState', JSON.stringify(globalState));

                updateHeader();
                if(data.estado === "desactivado"){
                    document.getElementById("errorMessage").textContent = "Su cuenta esta inactiva";
                }
                else if (data.estado === "activo") {
                    window.location.href = window.location.origin + '/FrontEndCookieShop-1.0-SNAPSHOT/index.html';
                }
                else if (data.estado === "datos"){
                    window.location.href = window.location.origin + '/FrontEndCookieShop-1.0-SNAPSHOT/login/ViewDatos.html';
                } else{
                    document.getElementById("errorMessage").textContent = "Debe esperar a que su solicitud sea aceptada";
                }
            })
            .catch(error => {
                document.getElementById("errorMessage").textContent = error.message; // Display error
            });
    });
});
