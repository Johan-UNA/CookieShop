CookieShop 🍪

Aplicación web para la gestión de una tienda de galletas. El sistema permite administrar productos, gestionar usuarios y clientes, registrar órdenes de compra y dar seguimiento a su estado.

El proyecto está organizado en dos módulos independientes: un frontend desarrollado con Java y tecnologías web, y un backend basado en Spring Boot que proporciona los servicios necesarios para la gestión de la información.

Características principales

Gestión de usuarios: registro e inicio de sesión para clientes y personal de la tienda.

Catálogo de productos: consulta, búsqueda y administración de productos.

Gestión de imágenes: carga y almacenamiento local de fotografías de los productos.

Órdenes de compra: creación de órdenes, consulta de pedidos y seguimiento de su estado.

Administración de pedidos: actualización de estados y asignación de personal encargado.

Calificaciones: posibilidad de valorar productos.

Facturación: generación de registros de facturas asociadas a órdenes entregadas.

Base de datos relacional: almacenamiento de usuarios, clientes, direcciones, productos, órdenes y facturas.

Tecnologías utilizadas

Componente

Tecnologías

Backend

Java 21, Spring Boot 3.3.4

Persistencia

Spring Data JPA, JDBC

API

Spring Web, REST

Base de datos

MySQL

Frontend

Java, HTML, CSS, JavaScript

Interfaz

Bootstrap

Construcción

Apache Maven

Arquitectura del proyecto

El repositorio contiene los siguientes componentes:

CookieShop/
│
├── BackEndCookieShop/
│   ├── src/main/java/
│   │   └── una/ac/cr/backendcookieshop/
│   │       ├── config/
│   │       ├── data/
│   │       ├── logic/
│   │       └── presentation/
│   ├── src/main/resources/
│   └── pom.xml
│
├── FrontEndCookieShop/
│   ├── src/main/java/
│   ├── src/main/webapp/
│   │   ├── admin/
│   │   ├── invoice/
│   │   ├── login/
│   │   ├── order/
│   │   ├── products/
│   │   ├── css/
│   │   └── js/
│   └── pom.xml
│
├── VentaGalletas.sql
└── README.md

Backend

El backend está desarrollado con Spring Boot y utiliza una organización por responsabilidades:

presentation: controladores REST que exponen los endpoints de la aplicación.

logic: entidades, DTO y lógica de negocio.

data: repositorios para el acceso a la base de datos.

config: configuración de la aplicación.

Frontend

El frontend utiliza páginas HTML, hojas de estilo CSS y JavaScript para construir la interfaz de usuario e interactuar con los servicios del backend.

Bootstrap se utiliza para apoyar la construcción de los componentes visuales y el diseño de las páginas.

Base de datos

El archivo VentaGalletas.sql contiene el script de creación de la base de datos venta_galletas.

Entre las principales entidades se encuentran:

Usuario y Cliente.

Dirección.

Producto y FotoProducto.

Calificación.

Orden y DetalleOrden.

Factura.

Requisitos previos

Para preparar el entorno de desarrollo se necesitan:

Java Development Kit (JDK) 21 para el backend.

Java compatible con la configuración del frontend (Java 11).

MySQL Server.

Apache Maven.

Un entorno de desarrollo compatible con proyectos Java.

Configuración y ejecución

1. Obtener el proyecto

git clone https://github.com/Johan-UNA/CookieShop.git
cd CookieShop

2. Preparar la base de datos

Ejecutar el script VentaGalletas.sql en MySQL para crear la base de datos y sus tablas.

3. Configurar el backend

Revisar BackEndCookieShop/src/main/resources/application.properties y configurar los parámetros de conexión a MySQL.

También debe configurarse el directorio local utilizado para almacenar las imágenes de los productos. La configuración original utiliza:

C:/uploads/

El directorio debe existir y ser accesible para la aplicación.

Importante: utilizar credenciales propias y seguras para la base de datos. No publicar contraseñas ni información sensible en archivos de configuración.

4. Construir y ejecutar el backend

Desde el directorio BackEndCookieShop:

mvn clean package

El proyecto está configurado para generar un archivo WAR mediante Maven. La ejecución requiere configurar el entorno de despliegue correspondiente.

5. Construir el frontend

Desde el directorio FrontEndCookieShop:

mvn clean package

El frontend también está configurado para generar un archivo WAR.

Para completar la ejecución, debe configurarse el despliegue del frontend y la comunicación con el backend.

Estado del proyecto

Proyecto de desarrollo académico. Su propósito es aplicar conocimientos de desarrollo de aplicaciones web, programación orientada a objetos, integración de servicios y administración de bases de datos relacionales.

Autor

Johan Méndez Agüero

Estudiante de Ingeniería en Sistemas.

GitHub: Johan-UNA

Repositorio: CookieShop
