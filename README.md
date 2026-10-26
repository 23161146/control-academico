# Actividad 8 — Control Académico

## Descripción
Aplicación React con inicio de sesión mediante DummyJSON, navegación protegida y una tabla de estudiantes conectada a una API pública. La tabla incluye búsqueda, filtros, paginación reflejada en la URL y operaciones CRUD.

## Requisitos
- Node.js LTS y npm.
- Navegador con conexión a Internet para consultar DummyJSON.

## Instalación y ejecución local
```bash
npm install
npm run dev
```

## Compilar para el VPS
Esta versión se configura para publicarse en el subdirectorio `/t3_act8_eq05/`.
```bash
npm run build
```
Vite genera la carpeta `dist/`. Copia **el contenido** de `dist/` al directorio del servidor web asignado a `/t3_act8_eq05/`.

## Inicio de sesión de prueba
- API: `https://dummyjson.com/auth/login`
- Usuario: `emilys`
- Contraseña: `emilyspass`

Las credenciales pertenecen al servicio de demostración DummyJSON; no se deben usar para cuentas reales.

## API de estudiantes
La tabla consulta `https://dummyjson.com/users`. Para cumplir la demostración CRUD usa:
- `GET /users?limit=100` para listar.
- `POST /users` para crear.
- `PUT /users/{id}` para reemplazar/actualizar.
- `PATCH /users/{id}` para actualizar parcialmente.
- `DELETE /users/{id}` para eliminar.

**Importante:** DummyJSON simula las operaciones de escritura y no persiste los cambios realmente en el servidor. La aplicación refleja el resultado en el estado local de la sesión para demostrar el CRUD.

Carrera y semestre se asignan en el cliente como campos de demostración porque no forman parte del modelo de usuarios estándar de DummyJSON.

## Despliegue en Nginx
Configura el alias o `root` de modo que `/t3_act8_eq05/` sirva el contenido compilado y añade fallback de rutas SPA a `index.html`. Ejemplo orientativo en `deploy/nginx-location.conf`; adapta la ruta real a la configuración del VPS.

## Prueba previa a entrega
1. `npm install`
2. `npm run build` y confirmar que termina sin errores.
3. Probar inicio/cierre de sesión.
4. Abrir Estudiantes: comprobar carga, búsqueda, filtros y opciones 10/20/40/50.
5. Cambiar páginas y confirmar que la URL cambia a `?page=2&limit=10`.
6. Probar crear, editar con PATCH, editar con PUT y eliminar.
7. Abrir directamente una ruta del sistema y refrescarla desde el VPS.
8. Confirmar que imágenes, CSS y peticiones a DummyJSON funcionan en el subdirectorio.

## Datos de portada pendientes
Completa con los nombres reales del equipo, grupo, docente y fecha de entrega antes de enviar la actividad.
