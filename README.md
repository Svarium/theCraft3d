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

## 🔐 Iteración 2 — Sistema de Autenticación y Roles

Implementación robusta de autenticación con Firebase, gestión de roles y protección de rutas.

### **Características Principales**
1.  **Contexto Global (`AuthContext`):**
    *   Gestiona el estado del usuario (`auth/firestore`) a través de toda la app.
    *   **Auto-healing:** Si un usuario entra con datos incompletos (ej. sin nombre), el sistema intenta corregirlos automáticamente en el siguiente inicio de sesión.
    *   **Persistencia:** La sesión se mantiene activa aunque se recargue la página.

2.  **Métodos de Acceso:**
    *   **Google Sign-In:** Registro/Login en un click. Captura automática de **Foto de Perfil** y Nombre.
    *   **Email/Password:** Registro con validación de contraseña.
    *   **Verificación de Email:** Envío automático de correo de verificación (Firebase) al registrarse. Estado visible en el Perfil.

3.  **Roles y Permisos:**
    *   **Roles:** `user`, `admin`, `superadmin`.
    *   **Hooks:** `useRole` para verificar permisos fácilmente (`isAdmin`, `hasRole`).
    *   **Reglas de Firestore:** Seguridad configurada para que cada usuario solo pueda leer/escribir su propia información.

4.  **UX / UI Mejorada:**
    *   **Protección de Rutas:**
        *   `ProtectedRoute`: Bloquea acceso a no autenticados (o roles sin permiso).
        *   `PublicRoute`: Evita que usuarios logueados entren a login/registro.
    *   **Feedback Visual:** Componente `Loader` para transiciones de carga, login y verificaciones.
    *   **Perfil de Usuario:** Visualización de Avatar (Foto de Google o Inicial), Rol, Email y Estado de Verificación.

### **Tecnologías Usadas**
*   **Firebase Auth:** Google Provider, EmailProvider, EmailVerification.
*   **Firestore:** Base de datos NoSQL para datos extendidos de usuario.
*   **React Router v6:** Gestión de navegación y redirecciones.
*   **Context API:** Estado global.

### **Próximos Pasos**
*   Implementación del Carrito de Compras (Persistence + Drawer UI).
*   Panel de Administración.
