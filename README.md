# 🐾 Adoptemos — Adopta, Cuida y Cambia una Vida

Sitio web de adopción de mascotas con catálogo de mascotas, fichas detalladas y un
visor 3D interactivo de cada animal.

## ✨ Características

- **Catálogo de 10 mascotas**: perros (Pastor Alemán, Labrador, Pug, Gran Danés),
  gatos (Mestizo/Criollo, Persa, Siamés) y otros (Cuy Inti, Conejo blanco, Hámster americano).
- **Fichas detalladas** con edad, género, tamaño, peso, ubicación y descripción.
- **Visor 3D interactivo** (Three.js) con modelos procedurales y animaciones.
- **Diseño responsive** con Tailwind CSS.
- **Servidor local** en Node.js sin dependencias externas.

## 📁 Estructura del proyecto

```
├── index.html      # Página principal
├── styles.css      # Estilos personalizados
├── app.js          # Lógica de la aplicación y datos de las mascotas
├── viewer3d.js     # Visor 3D interactivo (Three.js)
├── server.js       # Servidor HTTP estático (Node.js)
└── images/         # Fotografías de las mascotas
```

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
