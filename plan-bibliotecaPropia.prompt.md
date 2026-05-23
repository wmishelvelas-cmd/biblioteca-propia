## Plan: Sistema de biblioteca full-stack

TL;DR: Crearé un proyecto nuevo con backend en Node.js + Express, frontend en React, autenticación básica con roles de usuario y administrador, y almacenamiento local con SQLite para manejar libros y artículos.

**Steps**
1. Inicializar el proyecto en el workspace vacío.
   - Crear `package.json` y estructura de carpetas `backend/` y `frontend/`.
   - Configurar el backend con Express y SQLite.
   - Configurar el frontend con React y Vite.
2. Diseñar el modelo de datos.
   - Tabla `users` con email, password hash, rol y estado.
   - Tabla `items` con tipo (`libro` o `artículo`), título, autor, año, categoría y estado.
   - Tabla `sessions` o token simple si se usa JWT.
3. Implementar backend.
   - Rutas de autenticación: registro, login, logout.
   - Middleware de autorización para roles.
   - CRUD de `items` (libros/artículos) solo para usuarios autenticados; operaciones de administración para el rol admin.
   - Endpoints de usuario básico para obtener datos de perfil y listar usuarios si hace falta.
   - Manejo de errores y validaciones básicas.
4. Implementar frontend.
   - Pagina de login y dashboard principal.
   - Formularios para crear y editar libros/artículos.
   - Listado con filtros y búsqueda básica.
   - Vista de administración de usuarios si se incluye en el alcance.
   - Consumo de la API con `fetch` o `axios`.
5. Verificación y pruebas.
   - Probar rutas del backend con `curl` o Postman.
   - Probar la UI en el navegador.
   - Validar que CRUD y roles funcionen correctamente.

**Relevant files**
- `backend/server.js` o similar — servidor Express y rutas.
- `backend/db.js` — conexión SQLite y migraciones iniciales.
- `backend/routes/auth.js` — login/registro.
- `backend/routes/items.js` — CRUD de libros/artículos.
- `frontend/src/App.jsx` — estructura de navegación y rutas.
- `frontend/src/pages/Login.jsx` — autenticación.
- `frontend/src/pages/Dashboard.jsx` — lista y gestión de items.
- `frontend/src/services/api.js` — cliente API centralizado.

**Verification**
1. Ejecutar `npm install` en backend y frontend.
2. Iniciar servidor Express y verificar endpoint `GET /api/items`.
3. Iniciar frontend y comprobar que la pantalla de login carga.
4. Crear usuario admin, autenticar, crear libro y editarlo.
5. Confirmar que un usuario sin admin no puede acceder a rutas administrativas.

**Decisions**
- Se usará SQLite como base de datos local recomendado para un sistema interno rápido de montar.
- Se usará React en el frontend para una interfaz moderna y escalable.
- El sistema incluirá login y roles para seguridad.

**Further Considerations**
1. Si prefieres, puedo ajustar el alcance para un prototipo más ligero usando solo HTML/CSS/JS y una API mínima.
2. Si deseas, puedo añadir también gestión de categorías y préstamos en una segunda fase.
