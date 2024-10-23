<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
  <title>JSP - Hello World</title>
</head>
<body>
<h1>Test Communication</h1>
<button id="testConnection">Test Connection</button>
<p id="responseMessage"></p>

<script>
  document.getElementById('testConnection').addEventListener('click', function() {
    fetch('http://localhost:8080/api/test')
            .then(response => response.json())
            .then(data => {
              document.getElementById('responseMessage').innerText = data.message;
            })
            .catch(error => {
              document.getElementById('responseMessage').innerText = 'Error: ' + error;
            });
  });
</script>

<a href="admin/ViewSolicitudes.html"> Solicitudes</a><br>
<a href="products/ViewProducts.html"> Productos</a><br>
<a href="products/ViewUpload.html"> Subir Productos</a><br>
<a href="login/ViewLogin.html"> Login</a>
<br>
<button type="button" onclick="window.location.href='login/ViewRegister.html?type=usuario'">Registro Usuario</button>
</body>
</html>