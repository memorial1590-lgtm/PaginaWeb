# 🐾 Huellitas — Adopta, Cuida y Cambia una Vida

Sitio web de adopción de mascotas con catálogo de mascotas, fichas detalladas y un
visor 3D interactivo de cada animal.

## ✨ Características

- **Catálogo de 10 mascotas**: perros (Pastor Alemán, Labrador, Pug, Gran Danés),
  gatos (Mestizo/Criollo, Persa, Siamés) y otros (Cuy Inti, Conejo blanco, Hámster americano).
- **Fichas detalladas** con edad, género, tamaño, peso, ubicación y descripción.
- **Visor 3D interactivo** (Three.js) con modelos procedurales y animaciones.
- **Cuentas de usuario**: registro e inicio de sesión con contraseñas guardadas con hash SHA-256.
- **Solicitudes de publicación**: los clientes envían mascotas y el administrador las aprueba
  antes de que aparezcan en el catálogo.
- **Panel de administración** (atajo `Ctrl + 8`) para aprobar/rechazar solicitudes, agregar
  mascotas directamente y ver los usuarios registrados.
- **Diseño responsive** con Tailwind CSS.
- **Servidor local** en Node.js sin dependencias externas.

## 📁 Estructura del proyecto

```
├── index.html      # Página principal
├── styles.css      # Estilos personalizados
├── app.js          # Lógica de la aplicación y datos de las mascotas
├── auth.js         # Registro, login, solicitudes y panel de administración
├── viewer3d.js     # Visor 3D interactivo (Three.js)
├── server.js       # Servidor HTTP estático (Node.js)
├── favicon.svg     # Icono de la pestaña (huella de la marca)
├── favicon.ico     # Icono para navegadores antiguos (16/32/48 px)
├── site.webmanifest  # Manifest para "Añadir a pantalla de inicio"
└── images/         # Fotografías de las mascotas
```

## 🔐 Cuentas y administración

### Clientes

1. Pulsan **“Publica tu mascota”** (arriba a la derecha).
2. Si no tienen sesión, se abre el modal de **iniciar sesión / crear cuenta**.
3. Completan la ficha de la mascota y la envían como **solicitud** (estado *En revisión*).
4. En **Mi cuenta** pueden ver el estado de sus publicaciones.

### Administrador

- **Atajo de acceso: `Ctrl + 8`** (abre el login del administrador desde cualquier parte).
- Credenciales por defecto:
  - Correo: `andyrojascei@gmail.com`
  - Contraseña: `WilderRojas`
- Desde el panel puede:
  - **Aprobar** una solicitud → la mascota pasa al catálogo público.
  - **Rechazar** una solicitud → queda registrada como rechazada.
  - **+ Agregar mascota** → publica directamente, sin revisión.
  - **Quitar del catálogo** una mascota publicada.
  - Ver los **usuarios** registrados y cuántas solicitudes ha enviado cada uno.

> Las credenciales se pueden cambiar en el archivo `auth.js` (constante `HZ_ADMIN`).

### ⚠️ Sobre la seguridad

Esta autenticación funciona **100 % en el navegador** (los datos se guardan en
`localStorage`). Sirve para que todo el flujo sea funcional en una demo o trabajo
académico, pero **no es segura para producción**: las credenciales del administrador
están en `auth.js` y el estado de la sesión puede editarse desde el navegador.
Para un entorno real habría que mover la autenticación a un servidor (Node/Express +
base de datos), con contraseñas cifradas y sesiones firmadas.


## 🚀 Cómo ejecutarlo

Requiere [Node.js](https://nodejs.org/) instalado.

```bash
node server.js
```

Luego abre 👉 http://localhost:8080

También puedes cambiar el puerto:

```bash
# PowerShell
$env:PORT=3000; node server.js
```

## 🛠️ Tecnologías

- HTML5 / CSS3 / JavaScript (vanilla)
- [Tailwind CSS](https://tailwindcss.com/) (vía CDN)
- [Three.js](https://threejs.org/) para el visor 3D
- Node.js (`http`, `fs`, `path`) para el servidor local

## 📄 Licencia

Proyecto con fines educativos y de demostración.
