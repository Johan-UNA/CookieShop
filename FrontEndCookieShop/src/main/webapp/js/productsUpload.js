document.getElementById("productForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("nombre", document.getElementById("nombre").value);
    formData.append("descripcion", document.getElementById("descripcion").value);
    formData.append("precio", document.getElementById("precio").value);

    const fotos = document.getElementById("fotos").files;
    for (let i = 0; i < fotos.length; i++) {
        formData.append("fotos", fotos[i]);
    }

    fetch('http://localhost:8080/api/products/add', {
        method: 'POST',
        body: formData
    })
        .then(response => response.text())
        .then(result => {
            document.getElementById("resultMessage").textContent = result;
            document.getElementById("productForm").reset();
        })
        .catch(error => {
            document.getElementById("resultMessage").textContent = 'Error: ' + error;
        });
});
