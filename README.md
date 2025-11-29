🛒 Proyecto Ecommerce - Sistemas Operativos
Aplicación web Miari Detalles, desarrollada con arquitectura de microservicios, dockerizada y conectada a una base de datos externa.

📐 Arquitectura General
El sistema está compuesto por tres servicios principales:
1. Frontend
  React + Vite
  Desplegado con Nginx dentro de un contenedor Docker
  Comunicación con el backend mediante variables de entorno (VITE_API_BASE_URL)
2. Backend
  Node.js + Express
  Microservicio REST
  Integra MariaDB y MongoDB Atlas (para comentarios)
3. Base de Datos
  MariaDB (RDS en AWS) – persistencia principal
  MongoDB Atlas – almacenamiento de comentarios en tiempo real

🧰 Requisitos Previos
Asegúrate de tener:
✔️ Docker
✔️ Docker Compose
✔️ Acceso a la base de datos MariaDB en AWS
✔️ Credenciales para MongoDB Atlas (solo para módulo de comentarios)
✔️ Node.js (solo si deseas ejecutar fuera de Docker)

🐳 Docker
Construir y levantar los servicios
docker compose up --build -d
