# Guía de Configuración - Formulario de Mantenimiento

## 1. Configuración de Google Sheets

### Paso 1: Crear Google Sheet
1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja de cálculo
3. Nómbrala "Formulario de Mantenimiento"
4. Copia el ID de la hoja desde la URL (la parte entre `/d/` y `/edit`)

### Paso 2: Configurar Google Apps Script
1. Ve a [Google Apps Script](https://script.google.com)
2. Crea un nuevo proyecto
3. Reemplaza el código por defecto con el contenido del archivo `google-apps-script.js`
4. Reemplaza `TU_SPREADSHEET_ID_AQUI` con el ID de tu hoja de cálculo
5. Guarda el proyecto con un nombre descriptivo

### Paso 3: Desplegar como Web App
1. En Google Apps Script, haz clic en "Desplegar" > "Nueva implementación"
2. Selecciona "Aplicación web" como tipo
3. Configura:
   - Descripción: "API Formulario Mantenimiento"
   - Ejecutar como: "Yo"
   - Quién tiene acceso: "Cualquier persona"
4. Haz clic en "Desplegar"
5. Copia la URL de la aplicación web
6. Autoriza los permisos necesarios

### Paso 4: Actualizar el formulario
1. Abre el archivo `script.js`
2. Reemplaza `YOUR_GOOGLE_SCRIPT_URL` con la URL de tu aplicación web

## 2. Configuración de EmailJS

### Paso 1: Crear cuenta en EmailJS
1. Ve a [EmailJS](https://www.emailjs.com)
2. Crea una cuenta gratuita
3. Verifica tu email

### Paso 2: Configurar servicio de email
1. En el dashboard, ve a "Email Services"
2. Haz clic en "Add New Service"
3. Selecciona tu proveedor de email (Gmail, Outlook, etc.)
4. Sigue las instrucciones para conectar tu cuenta
5. Copia el "Service ID"

### Paso 3: Crear plantilla de email
1. Ve a "Email Templates"
2. Haz clic en "Create New Template"
3. Usa esta plantilla:

```
Asunto: Nuevo Reporte de Mantenimiento - {{operator_name}}

Estimado equipo,

Se ha recibido un nuevo reporte de mantenimiento:

Operador: {{operator_name}}
Fecha de Inspección: {{inspection_date}}
Fecha de Envío: {{timestamp}}

Datos del formulario:
{{form_data}}

Saludos,
Sistema de Mantenimiento
```

4. Guarda la plantilla y copia el "Template ID"

### Paso 4: Obtener Public Key
1. Ve a "Account" > "General"
2. Copia tu "Public Key"

### Paso 5: Actualizar el formulario
1. Abre el archivo `script.js`
2. Reemplaza los valores en `EMAILJS_CONFIG`:
   - `YOUR_SERVICE_ID` con tu Service ID
   - `YOUR_TEMPLATE_ID` con tu Template ID
   - `YOUR_PUBLIC_KEY` con tu Public Key

## 3. Subir a Google Sites

### Paso 1: Preparar archivos
1. Asegúrate de que todos los archivos estén en la misma carpeta:
   - `index.html`
   - `styles.css`
   - `script.js`

### Paso 2: Crear sitio en Google Sites
1. Ve a [Google Sites](https://sites.google.com)
2. Crea un nuevo sitio
3. Elige un tema simple

### Paso 3: Subir el formulario
1. En Google Sites, haz clic en "Insertar" > "Insertar código"
2. Selecciona "HTML personalizado"
3. Copia y pega el contenido completo del archivo `index.html`
4. Asegúrate de que las referencias a CSS y JS sean correctas

### Alternativa: Usar Google Drive
1. Sube todos los archivos a Google Drive
2. Haz los archivos públicos
3. Obtén los enlaces públicos
4. Actualiza las referencias en el HTML

## 4. Configuración de Emails de Destino

Para configurar a dónde se envían los emails:

1. En la plantilla de EmailJS, agrega el campo de destinatario
2. Puedes usar múltiples destinatarios separados por comas
3. También puedes configurar emails de copia (CC) y copia oculta (BCC)

## 5. Personalización Adicional

### Cambiar colores y estilos
- Edita el archivo `styles.css`
- Modifica las variables CSS en `:root`

### Agregar campos adicionales
1. Agrega los campos en `index.html`
2. Actualiza la función `collectFormData()` en `script.js`
3. Modifica `google-apps-script.js` para incluir los nuevos campos

### Configurar validaciones personalizadas
- Edita la función `validateField()` en `script.js`

## 6. Pruebas

Antes de usar en producción:

1. Prueba el envío del formulario
2. Verifica que los datos lleguen a Google Sheets
3. Confirma que se envíen los emails
4. Prueba en dispositivos móviles
5. Verifica la funcionalidad de guardado automático

## 7. Mantenimiento

- Revisa periódicamente los logs en Google Apps Script
- Monitorea el uso de EmailJS (límites de la cuenta gratuita)
- Haz respaldos regulares de Google Sheets
- Actualiza las credenciales si es necesario

## Soporte

Si tienes problemas:
1. Revisa la consola del navegador para errores JavaScript
2. Verifica los logs en Google Apps Script
3. Confirma que todas las URLs y credenciales sean correctas
4. Asegúrate de que los permisos estén configurados correctamente

