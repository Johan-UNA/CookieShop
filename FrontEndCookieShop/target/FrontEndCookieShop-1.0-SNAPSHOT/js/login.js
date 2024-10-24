document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("loginForm").addEventListener("submit", function(event) {
        event.preventDefault();

        const user = {
            usuario: document.getElementById("usuario").value,
            password: document.getElementById("password").value
        };

        console.log("Attempting to log in with user:", user);

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
                console.log("Login response received:", data);
                globalState.user = data.usuario; // Store user info
                globalState.role = data.role; // Store user role

                // Store in localStorage
                localStorage.setItem('globalState', JSON.stringify(globalState));
                console.log("Login successful. Updated global state:", globalState);

                // Update the header with the new user role
                updateHeader();

                // Redirect based on user state
                if (data.estado === "activo") {
                    console.log("Redirecting to home page.");
                    window.location.href = window.location.origin + '/FrontEndCookieShop-1.0-SNAPSHOT/index.html';
                } else {
                    console.log("Redirecting to datos.html.");
                    window.location.href = '/datos.html';
                }
            })
            .catch(error => {
                console.error("Error during login:", error);
                document.getElementById("errorMessage").textContent = error.message; // Display error
            });
    });
});
