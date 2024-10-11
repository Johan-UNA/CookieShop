document.addEventListener("DOMContentLoaded", function() {
    fetch('http://localhost:8080/api/products')
        .then(response => response.json())
        .then(products => {
            const productList = document.getElementById('productList');
            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('col-md-4', 'mb-4');

                productDiv.innerHTML = `
                    <div class="card">
                        <div id="carousel-${product.id}" class="carousel slide" data-bs-ride="carousel">
                            <div class="carousel-inner">
                                ${product.fotoproductos.length ? product.fotoproductos.map((foto, index) => {
                    const imageUrl = `http://localhost:8080${foto.foto}`; // Construct full image URL
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
                            <p class="card-text"><strong>Price: $${product.precio}</strong></p>
                        </div>
                    </div>
                `;

                productList.appendChild(productDiv);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
});
