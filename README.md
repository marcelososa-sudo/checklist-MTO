# Formulario de Mantenimiento - Complejo Casino, Hotel y Centro Comercial

## 📋 Descripción

Sistema web de formulario online para control de mantenimiento de un complejo que incluye casino, hotel y centro comercial. El formulario permite a los operadores registrar inspecciones diarias y envía automáticamente los datos a Google Sheets y por email.

## 🚀 Características

- **Interfaz Responsive**: Funciona en desktop, tablet y móvil
- **Guardado Automático**: Los datos se guardan cada 30 segundos
- **Validación en Tiempo Real**: Campos se validan mientras se completan
- **Integración Google Sheets**: Datos se almacenan automáticamente
- **Envío por Email**: Notificaciones automáticas por email
- **Diseño Profesional**: Interfaz moderna con colores distintivos por sección

## 📁 Archivos Incluidos

### Archivos Principales
- `index.html` - Archivo principal del formulario
- `styles.css` - Estilos y diseño responsive
- `script.js` - Funcionalidad JavaScript

### Archivos de Configuración
- `google-apps-script.js` - Código para Google Apps Script
- `configuracion.md` - Guía detallada de configuración
- `pruebas-realizadas.md` - Resultados de pruebas realizadas

### Documentación
- `README.md` - Este archivo
- `formulario_design.md` - Documentación del diseño

## 🛠️ Instalación Rápida

### Opción 1: Google Sites (Recomendado)

1. **Preparar archivos**:
   - Sube `index.html`, `styles.css` y `script.js` a Google Drive
   - Haz los archivos públicos y obtén los enlaces

2. **Crear sitio**:
   - Ve a [Google Sites](https://sites.google.com)
   - Crea un nuevo sitio
   - Inserta el código HTML personalizado

3. **Configurar servicios**:
   - Sigue la guía en `configuracion.md`
   - Configura Google Apps Script
   - Configura EmailJS

### Opción 2: Servidor Web

1. Sube todos los archivos a tu servidor web
2. Asegúrate de que `index.html` sea el archivo principal
3. Configura los servicios según `configuracion.md`

## ⚙️ Configuración Requerida

### 1. Google Sheets + Apps Script

```javascript
// En google-apps-script.js, reemplaza:
const SPREADSHEET_ID = 'TU_SPREADSHEET_ID_AQUI';
```

### 2. EmailJS

```javascript
// En script.js, reemplaza:
const EMAILJS_CONFIG = {
    serviceId: 'TU_SERVICE_ID',
    templateId: 'TU_TEMPLATE_ID', 
    publicKey: 'TU_PUBLIC_KEY'
};
```

### 3. URL de Google Apps Script

```javascript
// En script.js, reemplaza:
const GOOGLE_SCRIPT_URL = 'TU_GOOGLE_SCRIPT_URL';
```

## 📊 Secciones del Formulario

1. **Información del Operador** - Datos básicos
2. **Cisternas** - Control de tanques de agua
3. **Bombas de Incendios** - Sistema de seguridad
4. **Bombas Cloacales** - Sistema de desagües
5. **Tablero Eléctrico** - Control eléctrico general
6. **Grupo Electrógeno** - Sistema de respaldo
7. **Terraza Este** - Aires acondicionados zona este
8. **Terraza Oeste** - Aires acondicionados zona oeste
9. **Sala de Casino** - Controles específicos del casino
10. **Centro Comercial** - Sistemas del centro comercial
11. **Hotel** - Sistemas hoteleros (spa, piletas, etc.)

## 🎨 Personalización

### Cambiar Colores

Edita las variables CSS en `styles.css`:

```css
:root {
    --primary-color: #0d6efd;
    --secondary-color: #6c757d;
    /* ... más colores */
}
```

### Agregar Campos

1. Agrega el HTML en `index.html`
2. Actualiza `collectFormData()` en `script.js`
3. Modifica `google-apps-script.js` para incluir nuevos campos

## 🧪 Pruebas Realizadas

- ✅ Carga correcta de la aplicación
- ✅ Funcionalidad de todos los campos
- ✅ Guardado automático y manual
- ✅ Validación de campos obligatorios
- ✅ Diseño responsive
- ✅ Notificaciones del sistema

Ver `pruebas-realizadas.md` para detalles completos.

## 📱 Compatibilidad

- **Navegadores**: Chrome, Firefox, Safari, Edge (últimas versiones)
- **Dispositivos**: Desktop, tablet, móvil
- **Resoluciones**: Desde 320px hasta 1920px+

## 🔧 Solución de Problemas

### Error: "Google Script URL no configurado"
- Configura la URL en `script.js` después de desplegar Google Apps Script

### Error: "EmailJS no está disponible"
- Verifica que las credenciales de EmailJS estén correctas
- Confirma que el servicio de email esté activo

### Los datos no se guardan en Google Sheets
- Verifica que el ID del spreadsheet sea correcto
- Confirma que los permisos de Google Apps Script estén configurados

## 📞 Soporte

Para problemas técnicos:

1. Revisa la consola del navegador (F12)
2. Verifica los logs en Google Apps Script
3. Confirma que todas las URLs y credenciales sean correctas
4. Consulta `configuracion.md` para pasos detallados

## 📄 Licencia

Este proyecto está diseñado específicamente para el sistema de mantenimiento del complejo. Todos los derechos reservados.

## 🔄 Actualizaciones

Para actualizar el formulario:

1. Modifica los archivos necesarios
2. Vuelve a subir a Google Sites o tu servidor
3. Prueba la funcionalidad antes de usar en producción

---

**Versión**: 1.0  
**Fecha**: Agosto 2025  
**Desarrollado para**: Sistema de Control de Mantenimiento

