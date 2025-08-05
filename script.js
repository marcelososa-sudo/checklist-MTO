// Script principal para el formulario de mantenimiento

// Configuración de EmailJS (deberá ser configurado por el usuario)
const EMAILJS_CONFIG = {
    serviceId: 'YOUR_SERVICE_ID',
    templateId: 'YOUR_TEMPLATE_ID',
    publicKey: 'YOUR_PUBLIC_KEY'
};

// URL del Google Apps Script (deberá ser configurado por el usuario)
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL';

// Variables globales
let formData = {};
let isSubmitting = false;

// Inicialización cuando se carga la página
document.addEventListener("DOMContentLoaded", function() {
    initializeForm();
    setupEventListeners();
    updateDateTime();
    loadSavedProgress();
});

window.onload = function() {
    const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
};

// Inicializar formulario
function initializeForm() {
    // Establecer fecha actual
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('inspectionDate').value = today;
    
    // Inicializar EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.publicKey);
    }
}

// Configurar event listeners
function setupEventListeners() {
    const form = document.getElementById('maintenanceForm');
    const saveButton = document.getElementById('saveProgress');
    const confirmButton = document.getElementById('confirmSend');
    
    // Envío del formulario
    form.addEventListener('submit', handleFormSubmit);
    
    // Guardar progreso
    saveButton.addEventListener('click', saveProgress);
    
    // Confirmación de envío
    confirmButton.addEventListener('click', confirmSubmission);
    
    // Validación en tiempo real
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearValidation);
    });
    
    // Auto-guardar cada 30 segundos
    setInterval(autoSave, 30000);
}

// Actualizar fecha y hora
function updateDateTime() {
    const now = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    
    document.getElementById('datetime').textContent = 
        now.toLocaleDateString('es-ES', options);
    
    // Actualizar cada segundo
    setTimeout(updateDateTime, 1000);
}

// Manejar envío del formulario
function handleFormSubmit(event) {
    event.preventDefault();
    
    if (isSubmitting) return;
    
    if (validateForm()) {
        showConfirmModal();
    }
}

// Validar formulario completo
function validateForm() {
    const form = document.getElementById('maintenanceForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showAlert('Por favor complete todos los campos obligatorios.', 'danger');
        // Scroll al primer campo inválido
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) {
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    return isValid;
}

// Validar campo individual
function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    let isValid = true;
    
    // Limpiar validación previa
    field.classList.remove('is-invalid');
    
    // Validar campos requeridos
    if (field.hasAttribute('required') && !value) {
        field.classList.add('is-invalid');
        isValid = false;
    }
    
    // Validaciones específicas por tipo
    if (value) {
        switch (field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    field.classList.add('is-invalid');
                    isValid = false;
                }
                break;
            case 'number':
                if (isNaN(value) || value < 0) {
                    field.classList.add('is-invalid');
                    isValid = false;
                }
                break;
        }
    }
    
    return isValid;
}

// Limpiar validación
function clearValidation(event) {
    event.target.classList.remove('is-invalid');
}

// Recopilar datos del formulario
function collectFormData() {
    const form = document.getElementById('maintenanceForm');
    const formData = new FormData(form);
    const data = {};
    
    // Datos básicos
    data.operatorName = document.getElementById('operatorName').value;
    data.inspectionDate = document.getElementById('inspectionDate').value;
    data.timestamp = new Date().toISOString();
    
    // Cisternas
    data.cisternas = {
        tanque1: document.getElementById('tanque1').value,
        tanque2: document.getElementById('tanque2').value,
        pulmonAuxiliar: document.getElementById('pulmonAuxiliar').value,
        bombaEncendida: document.getElementById('bombaEncendida').value
    };
    
    // Bombas de incendios
    data.bombasIncendio = document.getElementById('bombasIncendio').value;
    
    // Bombas cloacales
    data.bombasCloacales = {
        bomba1: {
            estado: document.getElementById('bomba1Estado').value,
            fecha: document.getElementById('bomba1Fecha').value,
            encendida: document.getElementById('bomba1Encendida').value
        },
        bomba2: {
            estado: document.getElementById('bomba2Estado').value,
            fecha: document.getElementById('bomba2Fecha').value,
            encendida: document.getElementById('bomba2Encendida').value
        }
    };
    
    // Tablero eléctrico
    data.tableroElectrico = {
        funcionamiento: document.getElementById('tableroFuncionamiento').value,
        problema: document.getElementById('tableroProblema').value
    };
    
    // Grupo electrógeno
    data.grupoElectrogeno = {
        controlAceite: document.getElementById('controlAceite').value,
        combustible: document.getElementById('combustible').value,
        controlBaterias: document.getElementById('controlBaterias').value,
        nivelAguaRadiador: document.getElementById('nivelAguaRadiador').value,
        modoOperacion: document.getElementById('modoOperacion').value
    };
    
    // Terraza Este
    const equiposEste = [];
    for (let i = 1; i <= 9; i++) {
        if (document.getElementById(`equipoEste${i}`).checked) {
            equiposEste.push(i);
        }
    }
    
    data.terrazaEste = {
        equiposFuncionando: equiposEste,
        falla: document.getElementById('fallaEste').value,
        limpieza: document.getElementById('limpiezaEste').value,
        fallaLimpieza: document.getElementById('fallaLimpiezaEste').value,
        descargas: document.getElementById('descargasEste').value,
        fallaDescargas: document.getElementById('fallaDescargasEste').value
    };
    
    // Terraza Oeste
    const equiposOeste = [];
    for (let i = 1; i <= 9; i++) {
        if (document.getElementById(`equipoOeste${i}`).checked) {
            equiposOeste.push(i);
        }
    }
    
    data.terrazaOeste = {
        equiposFuncionando: equiposOeste,
        falla: document.getElementById('fallaOeste').value,
        limpieza: document.getElementById('limpiezaOeste').value,
        fallaLimpieza: document.getElementById('fallaLimpiezaOeste').value,
        descargas: document.getElementById('descargasOeste').value,
        fallaDescargas: document.getElementById('fallaDescargasOeste').value,
        nivelTanques12: document.getElementById('nivelTanques12').value,
        nivelTanquesTecho: document.getElementById('nivelTanquesTecho').value,
        bombaPresurizadora: document.getElementById('bombaPresurizadora').value,
        funcionamientoCaldera: document.getElementById('funcionamientoCaldera').value,
        fallaCaldera: document.getElementById('fallaCaldera').value,
        temperaturaCaldera: document.getElementById('temperaturaCaldera').value
    };
    
    return data;
}

// Mostrar modal de confirmación
function showConfirmModal() {
    const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
    modal.show();
}

// Confirmar envío
async function confirmSubmission() {
    if (isSubmitting) return;
    
    isSubmitting = true;
    const confirmButton = document.getElementById('confirmSend');
    const originalText = confirmButton.innerHTML;
    
    try {
        // Mostrar loading
        confirmButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Enviando...';
        confirmButton.disabled = true;
        
        // Recopilar datos
        const data = collectFormData();
        
        // Enviar a Google Sheets
        await sendToGoogleSheets(data);
        
        // Enviar email
        await sendEmail(data);
        
        // Cerrar modal de confirmación
        bootstrap.Modal.getInstance(document.getElementById('confirmModal')).hide();
        
        // Mostrar modal de éxito
        showSuccessModal();
        
        // Limpiar formulario
        clearForm();
        
        // Limpiar progreso guardado
        localStorage.removeItem('maintenanceFormProgress');
        
    } catch (error) {
        console.error('Error al enviar formulario:', error);
        showAlert('Error al enviar el formulario. Por favor intente nuevamente.', 'danger');
    } finally {
        isSubmitting = false;
        confirmButton.innerHTML = originalText;
        confirmButton.disabled = false;
    }
}

// Enviar datos a Google Sheets
async function sendToGoogleSheets(data) {
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_URL') {
        console.warn('Google Script URL no configurado');
        return;
    }
    
    const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error('Error al enviar datos a Google Sheets');
    }
    
    return response.json();
}

// Enviar email
async function sendEmail(data) {
    if (typeof emailjs === 'undefined') {
        console.warn('EmailJS no está disponible');
        return;
    }
    
    if (EMAILJS_CONFIG.serviceId === 'YOUR_SERVICE_ID') {
        console.warn('EmailJS no configurado');
        return;
    }
    
    const emailData = {
        operator_name: data.operatorName,
        inspection_date: data.inspectionDate,
        timestamp: new Date(data.timestamp).toLocaleString('es-ES'),
        form_data: JSON.stringify(data, null, 2)
    };
    
    const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        emailData
    );
    
    if (response.status !== 200) {
        throw new Error('Error al enviar email');
    }
}

// Mostrar modal de éxito
function showSuccessModal() {
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();
}

// Guardar progreso
function saveProgress() {
    const data = collectFormData();
    localStorage.setItem('maintenanceFormProgress', JSON.stringify(data));
    showAlert('Progreso guardado exitosamente.', 'success');
}

// Auto-guardar
function autoSave() {
    if (!isSubmitting) {
        const data = collectFormData();
        localStorage.setItem('maintenanceFormProgress', JSON.stringify(data));
    }
}

// Cargar progreso guardado
function loadSavedProgress() {
    const saved = localStorage.getItem('maintenanceFormProgress');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            populateForm(data);
            showAlert('Se ha cargado el progreso guardado anteriormente.', 'info');
        } catch (error) {
            console.error('Error al cargar progreso guardado:', error);
        }
    }
}

// Poblar formulario con datos
function populateForm(data) {
    // Datos básicos
    if (data.operatorName) document.getElementById('operatorName').value = data.operatorName;
    if (data.inspectionDate) document.getElementById('inspectionDate').value = data.inspectionDate;
    
    // Cisternas
    if (data.cisternas) {
        if (data.cisternas.tanque1) document.getElementById('tanque1').value = data.cisternas.tanque1;
        if (data.cisternas.tanque2) document.getElementById('tanque2').value = data.cisternas.tanque2;
        if (data.cisternas.pulmonAuxiliar) document.getElementById('pulmonAuxiliar').value = data.cisternas.pulmonAuxiliar;
        if (data.cisternas.bombaEncendida) document.getElementById('bombaEncendida').value = data.cisternas.bombaEncendida;
    }
    
    // Bombas de incendios
    if (data.bombasIncendio) document.getElementById('bombasIncendio').value = data.bombasIncendio;
    
    // Bombas cloacales
    if (data.bombasCloacales) {
        if (data.bombasCloacales.bomba1) {
            if (data.bombasCloacales.bomba1.estado) document.getElementById('bomba1Estado').value = data.bombasCloacales.bomba1.estado;
            if (data.bombasCloacales.bomba1.fecha) document.getElementById('bomba1Fecha').value = data.bombasCloacales.bomba1.fecha;
            if (data.bombasCloacales.bomba1.encendida) document.getElementById('bomba1Encendida').value = data.bombasCloacales.bomba1.encendida;
        }
        if (data.bombasCloacales.bomba2) {
            if (data.bombasCloacales.bomba2.estado) document.getElementById('bomba2Estado').value = data.bombasCloacales.bomba2.estado;
            if (data.bombasCloacales.bomba2.fecha) document.getElementById('bomba2Fecha').value = data.bombasCloacales.bomba2.fecha;
            if (data.bombasCloacales.bomba2.encendida) document.getElementById('bomba2Encendida').value = data.bombasCloacales.bomba2.encendida;
        }
    }
    
    // Continuar con el resto de los campos...
    // (Se puede expandir según sea necesario)
}

// Limpiar formulario
function clearForm() {
    document.getElementById('maintenanceForm').reset();
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('inspectionDate').value = today;
}

// Mostrar alerta
function showAlert(message, type = 'info') {
    const alertContainer = document.createElement('div');
    alertContainer.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertContainer.style.cssText = 'top: 20px; right: 20px; z-index: 1060; max-width: 400px;';
    
    alertContainer.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertContainer);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (alertContainer.parentNode) {
            alertContainer.remove();
        }
    }, 5000);
}

// Funciones de utilidad
function formatDate(date) {
    return new Date(date).toLocaleDateString('es-ES');
}

function formatTime(date) {
    return new Date(date).toLocaleTimeString('es-ES');
}

// Exportar funciones para uso externo si es necesario
window.MaintenanceForm = {
    saveProgress,
    clearForm,
    collectFormData,
    showAlert
};

