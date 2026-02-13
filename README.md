# THE CRAFT ⚙️💀

**The Craft** es un ecommerce exclusivo de Drops limitados de decoración gótica impresa en 3D. El sitio combina una estética oscura y minimalista con tecnología moderna para ofrecer una experiencia de compra mística y premium.

## 🌌 Visión y Estética
- **Estilo**: Minimalista, Elegante, Moderno Tech, Mística Sutil.
- **Paleta**: 
  - Dark Mode (Default): Background `#1C0F26`, Accordion/Cards `#261434`, Accent `#A36DFF`.
  - Light Mode: Background `#F7F7FB`, Cards `#FFFFFF`.
- **Identidad**: Uso de efectos de glassmorphism, resplandores místicos (glow) y un logo circular "hanging" que protagoniza la interfaz.

## 🛠️ Tech Stack
- **Frontend**: React + Vite
- **Navegación**: React Router v6
- **Estilos**: Vanilla CSS (Variables globales, Mobile First)
- **Backend**: Firebase Auth + Firestore
- **Iconografía**: Tipografía Roboto (400-700)

## 🚀 Estado Actual del Proyecto (Base Completada)
Actualmente el proyecto cuenta con la base estructural lista para el escalamiento por módulos:

### Infraestructura Core
- [x] Configuración de **Firebase SDK** (Auth & Firestore).
- [x] **Theme Context**: Sistema de cambio de modo Oscuro/Claro persistente.
- [x] **Sistema de Roles**: Estructura preparada para `user`, `admin` y `superadmin`.
- [x] **Modelos de Datos**: Definición de interfaces para Firestore (Users, Products, Orders, Drops).

### Diseño y Layout
- [x] **Navbar Premium**: Efecto glassmorphism, logo circular solapado y animaciones suaves.
- [x] **Componentes Reutilizables**: `Button`, `Card`, `Container`, `PageWrapper`.
- [x] **Layout Principal**: Estructura de navegación persistente con Footer elegante.

### Páginas y Navegación
- [x] **Home**: Hero section, simulador de drop (countdown y barra de progreso).
- [x] **Rutas Configuradas**: 
  - `/` (Home)
  - `/drop` (Catálogo de Drops)
  - `/product/:id` (Detalle de Producto)
  - `/profile` (Perfil de Usuario)
  - `/admin` (Panel de Administración)

## 📦 Instalación y Uso
1. Clonar el repositorio.
2. Ejecutar `npm install`.
3. Iniciar el servidor de desarrollo: `npm run dev`.

---
*Created with passion by [The Craft Team]*
