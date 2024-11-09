document.addEventListener("DOMContentLoaded", function() {
    const globalState = JSON.parse(localStorage.getItem('globalState'));
    const userId = globalState.user;
    const role = globalState.role;

    fetch(`http://localhost:8080/api/products?userId=${userId}`)
        .then(response => response.json())
        .then(({ products, purchasedProductIds }) => {
            const productList = document.getElementById('productList');
            productList.innerHTML = '';

            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('col-md-4', 'mb-4');

                const averageRating = product.averageRating ? product.averageRating.toFixed(1) : null;

                productDiv.innerHTML = `
                    <div class="card">
                        <div id="carousel-${product.id}" class="carousel slide" data-bs-ride="carousel">
                            <div class="carousel-inner">
                                ${product.fotoproductos.length ? product.fotoproductos.map((foto, index) => {
                    const imageUrl = `http://localhost:8080${foto.foto}`;
                    return `
                                        <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                            <img src="${imageUrl}" class="d-block" style="width: 100%; height: 180px;" alt="${product.nombre}">
                                        </div>
                                    `;
                }).join('') : '<div class="carousel-item active"><img src="placeholder.jpg" class="d-block" style="width: 100%; height: 180px;" alt="No images available"></div>'}
                            </div>
                            <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${product.id}" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Previous</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#carousel-${product.id}" data-bs-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Next</span>
                            </button>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">${product.nombre}</h5>
                            <p class="card-text">${product.descripcion}</p>
                            <p class="card-text"><strong>Precio: $${product.precio}</strong></p>
                            ${averageRating ? `<p class="card-text"><strong>Calificación: ${averageRating} / 5</strong></p>` : ''}
                        </div>
                    </div>
                `;

                const cardBody = productDiv.querySelector('.card-body');

                if (role === 'dependiente') {
                    const editButton = document.createElement('button');
                    editButton.classList.add('btn', 'btn-warning', 'mt-2');
                    editButton.textContent = 'Editar producto';
                    editButton.onclick = () => {
                        window.location.href = `${window.location.origin}/FrontEndCookieShop-1.0-SNAPSHOT/products/ViewUpload.html?id=${product.id}`;
                    };
                    cardBody.appendChild(editButton);
                } else if (role === 'cliente' && purchasedProductIds.includes(product.id)) { // Habilita solo para productos comprados
                    const rateButton = document.createElement('button');
                    rateButton.classList.add('btn', 'btn-info', 'mt-2');
                    rateButton.textContent = 'Calificar producto';
                    rateButton.onclick = () => showRatingModal(product.id);
                    cardBody.appendChild(rateButton);
                }

                productList.appendChild(productDiv);
            });
        })
        .catch(error => console.error('Error fetching products:', error));

    function showRatingModal(productId) {
        const modalContent = `
            <div class="modal fade" id="ratingModal" tabindex="-1" aria-labelledby="ratingModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="ratingModalLabel">Calificar Producto</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p>Seleccione una calificación de 1 a 5:</p>
                            <select id="productRating" class="form-control">
                                <option value="1">1 - Muy Malo</option>
                                <option value="2">2 - Malo</option>
                                <option value="3">3 - Regular</option>
                                <option value="4">4 - Bueno</option>
                                <option value="5">5 - Excelente</option>
                            </select>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" class="btn btn-primary" onclick="submitRating(${productId})">Guardar Calificación</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalContent);
        const ratingModal = new bootstrap.Modal(document.getElementById('ratingModal'));
        ratingModal.show();
    }

    window.submitRating = function(productId) {
        const rating = document.getElementById('productRating').value;
        const userId = JSON.parse(localStorage.getItem('globalState')).user;

        fetch(`http://localhost:8080/api/products/${productId}/rate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating: parseInt(rating), idUsuario: userId })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.json();
            })
            .then(() => {
                const ratingModalEl = document.getElementById('ratingModal');
                const ratingModal = bootstrap.Modal.getInstance(ratingModalEl);
                ratingModal.hide();
                ratingModalEl.remove();
            })
            .catch(error => {
                console.error('Error al enviar la calificación:', error);
                alert('Hubo un error al enviar la calificación');
            });
    };
});
