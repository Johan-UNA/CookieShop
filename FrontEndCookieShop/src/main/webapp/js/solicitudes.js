function cargarSolicitudes() {
    fetch('http://localhost:8080/api/solicitudes')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('usuarios-table-body');
            tableBody.innerHTML = '';

            data.forEach(usuario => {
                const fila = document.createElement('tr');

                const idColumna = document.createElement('td');
                idColumna.textContent = usuario.idUsuario;
                fila.appendChild(idColumna);

                const nombreColumna = document.createElement('td');
                nombreColumna.textContent = `${usuario.nombre} ${usuario.apellido}`;
                fila.appendChild(nombreColumna);

                const emailColumna = document.createElement('td');
                emailColumna.textContent = usuario.email;
                fila.appendChild(emailColumna);

                const estadoColumna = document.createElement('td');
                estadoColumna.textContent = usuario.estado;
                fila.appendChild(estadoColumna);

                const accionesColumna = document.createElement('td');

                if (usuario.estado === 'inactivo') {
                    const botonAceptar = document.createElement('button');
                    botonAceptar.textContent = "Aceptar";
                    botonAceptar.classList.add('btn', 'btn-success');
                    botonAceptar.addEventListener('click', () => aceptarSolicitud(usuario.idUsuario));
                    accionesColumna.appendChild(botonAceptar);
                }

                if (usuario.estado === 'activo') {
                    const botonDesactivar = document.createElement('button');
                    botonDesactivar.textContent = "Desactivar";
                    botonDesactivar.classList.add('btn', 'btn-warning');
                    botonDesactivar.addEventListener('click', () => cambiarEstado(usuario.idUsuario));
                    accionesColumna.appendChild(botonDesactivar);
                } else if (usuario.estado === 'desactivado') {
                    const botonActivar = document.createElement('button');
                    botonActivar.textContent = "Activar";
                    botonActivar.classList.add('btn', 'btn-warning');
                    botonActivar.addEventListener('click', () => cambiarEstado(usuario.idUsuario));
                    accionesColumna.appendChild(botonActivar);
                }

                fila.appendChild(accionesColumna);
                tableBody.appendChild(fila);
            });
        })
        .catch(error => console.error('Error al cargar las solicitudes:', error));
}

function aceptarSolicitud(idUsuario) {
    fetch(`http://localhost:8080/api/solicitudes/aceptarSolicitud`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            idUsuario: idUsuario
        })
    })
        .then(response => response.text())
        .then(message => {
            mostrarMensajeEnModal(message);
            cargarSolicitudes();
        })
        .catch(error => console.error('Error al aceptar la solicitud:', error));
}

function cambiarEstado(idUsuario) {
    fetch(`http://localhost:8080/api/solicitudes/cambiarEstado`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            idUsuario: idUsuario
        })
    })
        .then(response => response.text())
        .then(message => {
            mostrarMensajeEnModal(message);
            cargarSolicitudes();
        })
        .catch(error => console.error('Error al cambiar el estado:', error));
}

// Función para mostrar mensajes en el modal
function mostrarMensajeEnModal(mensaje) {
    const modalMessageElement = document.getElementById('modalMessage');
    modalMessageElement.textContent = mensaje;
    const modal = new bootstrap.Modal(document.getElementById('messageModal'));
    modal.show();
}

window.onload = cargarSolicitudes;
