# GastoHoy

Una aplicación web progresiva (PWA) para el control personal de finanzas, diseñada con una interfaz moderna y funcionalidades completas para gestionar ingresos y gastos diarios.

## 🌟 Características Principales

### 💳 Gestión Financiera Completa
- **Registro de transacciones**: Añade ingresos y gastos de forma rápida y sencilla
- **Categorías organizadas**: Clasifica tus movimientos en categorías predefinidas (Comida, Transporte, Compras, Servicios, Ocio, Salud, etc.)
- **Balance en tiempo real**: Visualiza tu saldo actual actualizado automáticamente
- **Presupuesto mensual**: Establece límites de gasto y monitorea tu progreso

### 📊 Análisis y Estadísticas
- **Gráficos interactivos**: Visualización de gastos por categoría con gráficos de dona
- **Historial completo**: Accede a todos tus registros con búsqueda y filtros avanzados
- **Resúmenes diarios y mensuales**: Consulta totales por período y análisis de tendencias

### 📱 Diseño Optimizado
- **Interfaz responsiva**: Experiencia perfecta en móviles y escritorio
- **Modo oscuro/claro**: Cambia entre temas según tu preferencia
- **Navegación intuitiva**: Sidebar fijo en desktop y navegación inferior en móviles
- **Animaciones suaves**: Feedback háptico y transiciones fluidas

### 💾 Seguridad y Respaldo
- **Almacenamiento local**: Tus datos se guardan localmente en tu dispositivo
- **Sistema de respaldo**: Exporta tus datos en formato JSON o CSV
- **Importación de datos**: Restaura tus respaldos fácilmente
- **Autenticación segura**: Sistema de PIN de 4 dígitos para proteger tu información

### 🔄 Funciones de Reset
- **Reiniciar balance**: Elimina todos los registros financieros manteniendo tu usuario
- **Reset completo**: Borra absolutamente todos los datos incluyendo configuración

## 🎯 Cómo Funciona

### 1. **Inicio Rápido**
- Al abrir la app por primera vez, crea tu perfil con un nombre y PIN de 4 dígitos
- Tu PIN se almacena de forma segura con hashing SHA-256

### 2. **Registro de Transacciones**
- Desde el panel principal, añade gastos e ingresos con solo unos toques
- Selecciona la categoría, ingresa el monto y añade una nota descriptiva
- Los registros se ordenan automáticamente por fecha (más reciente primero)

### 3. **Seguimiento de Presupuesto**
- Define un presupuesto mensual para controlar tus gastos
- La app muestra visualmente tu progreso con barras de porcentaje
- Recibe alertas visuales cuando te acercas a tu límite

### 4. **Análisis de Datos**
- En la sección de estadísticas, explora gráficos interactivos de tus gastos
- Filtra por categorías para ver detalles específicos
- Busca transacciones por texto o monto

### 5. **Respaldo y Restauración**
- Exporta todos tus datos en JSON para respaldos completos
- Descarga en CSV para análisis en Excel
- Importa respaldos anteriores cuando necesites restaurar información

### 6. **Sincronización Visual**
- La interfaz se actualiza automáticamente con cada cambio
- Los gráficos y totales reflejan tus datos en tiempo real
- El estado de respaldo se muestra con indicadores visuales

## 🛠️ Tecnología

- **Frontend**: Vue 3 con Composition API
- **Estilos**: Bootstrap 5 con CSS personalizado
- **Gráficos**: Chart.js para visualizaciones
- **Almacenamiento**: IndexedDB para persistencia local
- **Build**: Vite para desarrollo rápido
- **PWA**: Service Worker para instalación offline

## 🎨 Diseño y Experiencia

- **Premium Balance Card**: Tarjeta principal con diseño de tarjeta de crédito y gradientes
- **Sidebar fijo**: Navegación persistente en versión desktop
- **Scroll nativo**: Experiencia de navegación natural del navegador
- **Feedback háptico**: Vibraciones en acciones importantes
- **Transiciones suaves**: Animaciones y efectos hover cuidadosamente diseñados

## 📋 Modo de Uso

1. **Autenticación**: Ingresa tu PIN de 4 dígitos para acceder
2. **Panel Principal**: Revisa tu balance, presupuesto y transacciones recientes
3. **Añadir Movimientos**: Usa los botones flotantes o de header para nuevos registros
4. **Estadísticas**: Explora gráficos y análisis detallados de tus gastos
5. **Respaldo**: Exporta tus datos regularmente para seguridad

GastoHoy es la solución perfecta para el control financiero personal, combinando simplicidad de uso con potentes herramientas de análisis y una experiencia de usuario excepcional.
