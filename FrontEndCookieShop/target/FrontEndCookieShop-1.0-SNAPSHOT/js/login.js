document.addEventListener("DOMContentLoaded", function() {
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
                if(data.estado === "inactivo"){
                    document.getElementById("errorMessage").textContent = "Su cuenta esta inactiva";
                }
                else if (data.estado === "activo") {
                    window.location.href = window.location.origin + '/FrontEndCookieShop-1.0-SNAPSHOT/index.html';
                } else {
                    window.location.href = window.location.origin + '/FrontEndCookieShop-1.0-SNAPSHOT/login/ViewDatos.html';
                }
            })
            .catch(error => {
                document.getElementById("errorMessage").textContent = error.message; // Display error
            });
    });
});
