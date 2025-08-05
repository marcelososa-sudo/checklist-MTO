// Google Apps Script para integración con Google Sheets
// Este código debe ser copiado en Google Apps Script (script.google.com)

function doPost(e) {
  try {
    // Obtener datos del formulario
    const data = JSON.parse(e.postData.contents);
    
    // ID de la hoja de cálculo (debe ser reemplazado por el ID real)
    const SPREADSHEET_ID = 'TU_SPREADSHEET_ID_AQUI';
    
    // Abrir la hoja de cálculo
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName('Mantenimiento');
    
    // Si la hoja no existe, crearla
    if (!sheet) {
      sheet = spreadsheet.insertSheet('Mantenimiento');
      setupHeaders(sheet);
    }
    
    // Agregar los datos
    addDataToSheet(sheet, data);
    
    // Respuesta exitosa
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Datos guardados correctamente'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function setupHeaders(sheet) {
  const headers = [
    'Timestamp',
    'Operador',
    'Fecha Inspección',
    
    // Cisternas
    'Tanque 1 (L)',
    'Tanque 2 (L)',
    'Pulmón Auxiliar (L)',
    'Bomba Encendida',
    
    // Bombas Incendios
    'Estado Bombas Incendio',
    
    // Bombas Cloacales
    'Bomba 1 Estado',
    'Bomba 1 Fecha',
    'Bomba 1 Encendida',
    'Bomba 2 Estado',
    'Bomba 2 Fecha',
    'Bomba 2 Encendida',
    
    // Tablero Eléctrico
    'Tablero Funcionamiento',
    'Tablero Problema',
    
    // Grupo Electrógeno
    'Control Aceite',
    'Combustible (L)',
    'Control Baterías',
    'Nivel Agua Radiador',
    'Modo Operación',
    
    // Terraza Este
    'Equipos Este Funcionando',
    'Falla Este',
    'Limpieza Este',
    'Falla Limpieza Este',
    'Descargas Este',
    'Falla Descargas Este',
    
    // Terraza Oeste
    'Equipos Oeste Funcionando',
    'Falla Oeste',
    'Limpieza Oeste',
    'Falla Limpieza Oeste',
    'Descargas Oeste',
    'Falla Descargas Oeste',
    'Nivel Tanques 1-2',
    'Nivel Tanques Techo',
    'Bomba Presurizadora',
    'Funcionamiento Caldera',
    'Falla Caldera',
    'Temperatura Caldera'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Formatear encabezados
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  headerRange.setWrap(true);
  
  // Ajustar ancho de columnas
  sheet.autoResizeColumns(1, headers.length);
}

function addDataToSheet(sheet, data) {
  const row = [
    new Date(data.timestamp),
    data.operatorName,
    data.inspectionDate,
    
    // Cisternas
    data.cisternas.tanque1,
    data.cisternas.tanque2,
    data.cisternas.pulmonAuxiliar,
    data.cisternas.bombaEncendida,
    
    // Bombas Incendios
    data.bombasIncendio,
    
    // Bombas Cloacales
    data.bombasCloacales.bomba1.estado,
    data.bombasCloacales.bomba1.fecha,
    data.bombasCloacales.bomba1.encendida,
    data.bombasCloacales.bomba2.estado,
    data.bombasCloacales.bomba2.fecha,
    data.bombasCloacales.bomba2.encendida,
    
    // Tablero Eléctrico
    data.tableroElectrico.funcionamiento,
    data.tableroElectrico.problema,
    
    // Grupo Electrógeno
    data.grupoElectrogeno.controlAceite,
    data.grupoElectrogeno.combustible,
    data.grupoElectrogeno.controlBaterias,
    data.grupoElectrogeno.nivelAguaRadiador,
    data.grupoElectrogeno.modoOperacion,
    
    // Terraza Este
    data.terrazaEste.equiposFuncionando.join(', '),
    data.terrazaEste.falla,
    data.terrazaEste.limpieza,
    data.terrazaEste.fallaLimpieza,
    data.terrazaEste.descargas,
    data.terrazaEste.fallaDescargas,
    
    // Terraza Oeste
    data.terrazaOeste.equiposFuncionando.join(', '),
    data.terrazaOeste.falla,
    data.terrazaOeste.limpieza,
    data.terrazaOeste.fallaLimpieza,
    data.terrazaOeste.descargas,
    data.terrazaOeste.fallaDescargas,
    data.terrazaOeste.nivelTanques12,
    data.terrazaOeste.nivelTanquesTecho,
    data.terrazaOeste.bombaPresurizadora,
    data.terrazaOeste.funcionamientoCaldera,
    data.terrazaOeste.fallaCaldera,
    data.terrazaOeste.temperaturaCaldera
  ];
  
  // Agregar la fila
  sheet.appendRow(row);
  
  // Formatear la nueva fila
  const lastRow = sheet.getLastRow();
  const range = sheet.getRange(lastRow, 1, 1, row.length);
  
  // Alternar color de fila
  if (lastRow % 2 === 0) {
    range.setBackground('#f8f9fa');
  }
  
  // Formatear fecha
  sheet.getRange(lastRow, 1).setNumberFormat('dd/mm/yyyy hh:mm:ss');
}

// Función para obtener datos (opcional)
function doGet(e) {
  try {
    const SPREADSHEET_ID = 'TU_SPREADSHEET_ID_AQUI';
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName('Mantenimiento');
    
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'error',
          message: 'Hoja no encontrada'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = sheet.getDataRange().getValues();
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        data: data
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

