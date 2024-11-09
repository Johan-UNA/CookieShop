let globalState = JSON.parse(localStorage.getItem('globalState')) || {
    user: null,
    role: 'guest'
};

const roleOptions = {
    administrador: [
        { path: 'admin/Dashboard', display: 'Dashboard' },
        { path: 'admin/ViewSolicitudes', display: 'Solicitudes' },
        { path: 'products/ViewProducts', display: 'Productos' },
        { path: '#', display: 'Logout', isLogout: true }
    ],
    dependiente: [
        { path: 'user/Dashboard', display: 'Dashboard' },
        { path: 'products/ViewProducts', display: 'Productos' },
        { path: '#', display: 'Logout', isLogout: true }
    ],
    cliente: [
        { path: 'products/ViewProducts', display: 'Productos' },
        { path: 'order/Orders', display: 'Ordenes' },
        { path: 'order/CreateOrder', display: 'Crear Orden' },
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
            <a class="navbar-brand" href="${window.location.origin}/FrontEndCookieShop-1.0-SNAPSHOT/index.html">
                <img src="${logoUrl}" alt="Logo" style="height: 30px;">
            </a>
            <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                <div id="header" class="navbar-nav"></div>
            </div>
        </nav>
    `;

    document.body.insertAdjacentHTML('afterbegin', navbarHtml);
}

function updateHeader() {
    const header = document.getElementById('header');
    header.innerHTML = ''; // Clear existing options

    const options = roleOptions[globalState.role] || [];

    options.forEach(option => {
        const link = document.createElement('a');
        const path = `/FrontEndCookieShop-1.0-SNAPSHOT/${option.path}.html`;
        if (option.isLogout) {
            link.href = window.location.origin + '/FrontEndCookieShop-1.0-SNAPSHOT/index.html';
            link.onclick = handleLogout;
        } else {
            link.href = window.location.origin + path;
        }
        link.textContent = option.display;
        link.className = 'nav-link';
        header.appendChild(link);
    });

}

function handleLogout() {
    globalState.user = null;
    globalState.role = 'guest';
    localStorage.removeItem('globalState');
    window.location.href = window.location.origin + '/FrontEndCookieShop-1.0-SNAPSHOT/index.html';
}

renderNavbar();
updateHeader();
