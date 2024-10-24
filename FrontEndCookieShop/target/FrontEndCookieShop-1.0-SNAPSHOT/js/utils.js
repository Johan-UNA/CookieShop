let globalState = JSON.parse(localStorage.getItem('globalState')) || {
    user: null,
    role: 'guest' // Default to guest options
};

const roleOptions = {
    administrador: [
        { path: 'admin/Dashboard', display: 'Dashboard' },
        { path: 'admin/Users', display: 'Users' },
        { path: 'admin/Settings', display: 'Settings' },
        { path: '#', display: 'Logout', isLogout: true }
    ],
    dependiente: [
        { path: 'user/Dashboard', display: 'Dashboard' },
        { path: 'user/Profile', display: 'Profile' },
        { path: '#', display: 'Logout', isLogout: true }
    ],
    cliente: [
        { path: 'user/Dashboard', display: 'Dashboard' },
        { path: 'user/Profile', display: 'Ordenes' },
        { path: '#', display: 'Logout', isLogout: true }
    ],
    guest: [
        { path: 'login/ViewLogin', display: 'Login' },
        { path: 'login/ViewRegister', display: 'Register' }
    ]
};

// Function to render the navbar
function renderNavbar() {
    const logoUrl = `${window.location.origin}/FrontEndCookieShop-1.0-SNAPSHOT/img/logo.jpeg`;
    const navbarHtml = `
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="${window.location.origin}/FrontEndCookieShop-1.0-SNAPSHOT/index.jsp">
                <img src="${logoUrl}" alt="Logo" style="height: 30px;">
            </a>
            <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                <div id="header" class="navbar-nav"></div>
            </div>
        </nav>
    `;

    // Insert the navbar HTML at the beginning of the body
    document.body.insertAdjacentHTML('afterbegin', navbarHtml);
}

// Function to update the header based on user role
function updateHeader() {
    console.log("Updating header for role:", globalState.role);
    const header = document.getElementById('header');
    header.innerHTML = ''; // Clear existing options

    const options = roleOptions[globalState.role] || [];
    console.log("Options available:", options); // Debug message

    options.forEach(option => {
        const link = document.createElement('a');
        const path = `/FrontEndCookieShop-1.0-SNAPSHOT/${option.path}.html`;
        if (option.isLogout) {
            link.href = '#';
            link.onclick = handleLogout;
        } else {
            link.href = window.location.origin + path; // Regular link
        }
        link.textContent = option.display;
        link.className = 'nav-link';
        header.appendChild(link);
    });

    console.log("Header updated successfully."); // Debug message
}

// Logout function
function handleLogout() {
    console.log("Logging out...");
    globalState.user = null;
    globalState.role = 'guest';
    localStorage.removeItem('globalState');
    updateHeader();
}

// Initial rendering of the navbar and header options
renderNavbar();
updateHeader();
