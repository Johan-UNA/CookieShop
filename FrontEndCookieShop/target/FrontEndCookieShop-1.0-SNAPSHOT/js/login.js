let globalState = {
    user: null,
    role: null
};

// Login Script
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
                globalState.user = data.usuario; // Store user info
                globalState.role = data.role; // Store user role
                console.log("Login successful", globalState);
                if (data.estado === "activo") {
                    window.location.href = window.location.origin + '/FrontEndCookieShop-1.0-SNAPSHOT/index.jsp'; // Redirect to home page for active users
                } else {
                    window.location.href = '/datos.html';
                }
            })
            .catch(error => {
                console.error("Error:", error);
                document.getElementById("errorMessage").textContent = error.message; // Display error
            });
    });
});
