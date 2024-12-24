// Google Apps Script URL for form submission
export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw6ZrzWFE1gfRPGKECgBf-7kEfQjw3RIBP5QNlaaY3Gj_70Jsxmh0FWTkJIgUqBpji8XQ/exec';

// Spreadsheet configuration
export const SPREADSHEET_CONFIG = {
  TEMPLATE_SHEET_NAME: 'Template',
  DEFAULT_SHEET_PREFIX: 'Data_'
};

// Form configuration
export const FORM_CONFIG = {
  SECTIONS: {
    LOWER_LIMIT: 'Lower Limit Detection',
    PRECISION_1: 'Precision Level 1',
    PRECISION_2: 'Precision Level 2',
    ACCURACY: 'Accuracy',
    QC: 'Quality Control'
  }
};

// Apps Script Code (for reference - deploy this separately in Google Apps Script)
export const APPS_SCRIPT_CODE = `
// Replace with your actual spreadsheet ID
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';

function doGet(e) {
  const params = e.parameter;
  const callback = params.callback;
  const action = params.action;
  const data = params.data ? JSON.parse(decodeURIComponent(params.data)) : null;
  
  let result;
  
  try {
    switch (action) {
      case 'submit':
        result = handleSubmit(data);
        break;
      default:
        throw new Error('Invalid action');
    }
    
    return ContentService.createTextOutput(callback + '(' + JSON.stringify(result) + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
      
  } catch (error) {
    const errorResponse = {
      status: 'error',
      message: error.message
    };
    
    return ContentService.createTextOutput(callback + '(' + JSON.stringify(errorResponse) + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
}

function handleSubmit(data) {
  if (!data) throw new Error('No data provided');
  
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const templateSheet = ss.getSheetByName(data.sheetName);
  
  if (!templateSheet) throw new Error('Template sheet not found');
  
  const newSheetName = generateUniqueSheetName(ss, data);
  const newSheet = templateSheet.copyTo(ss);
  newSheet.setName(newSheetName);
  
  writeFormData(newSheet, data);
  
  return {
    status: 'success',
    message: 'Data submitted successfully',
    sheetName: newSheetName
  };
}

function generateUniqueSheetName(spreadsheet, data) {
  const formattedDate = formatDate(data.date);
  const sanitizedFacility = data.facility.replace(/[^a-zA-Z0-9]/g, '');
  const cleanSerialNumber = data.serialNumber.trim();
  
  const baseSheetName = \`\${formattedDate}-\${cleanSerialNumber}-\${sanitizedFacility}\`;
  
  const existingSheets = spreadsheet.getSheets().map(sheet => sheet.getName());
  if (existingSheets.includes(baseSheetName)) {
    throw new Error('A submission with this date, serial number, and facility already exists');
  }
  
  return baseSheetName;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return \`\${year}-\${month}-\${day}\`;
}

function writeFormData(sheet, data) {
  // Header information (B3:H6)
  sheet.getRange('B3:H3').setValue(data.facility);
  sheet.getRange('B4:H4').setValue(data.date);
  sheet.getRange('B5:H5').setValue(data.technician);
  sheet.getRange('B6:H6').setValue(data.serialNumber);
  
  // Lower Limit Detection (starting at A8)
  // Headers at B10:B11 and C10:C11
  // Data in B12:B16 and C12:C16
  for (let i = 0; i < data.lowerLimitDetection.conc.length; i++) {
    sheet.getRange(\`B\${12 + i}\`).setValue(data.lowerLimitDetection.conc[i]);
    sheet.getRange(\`C\${12 + i}\`).setValue(data.lowerLimitDetection.msc[i]);
  }
  
  // Precision Level 1 (starting at A20)
  // Headers at B22:B23, C22:C23, D22:D23
  // Data in B24:B28, C24:C28, D24:D28
  for (let i = 0; i < data.precisionLevel1.conc.length; i++) {
    sheet.getRange(\`B\${24 + i}\`).setValue(data.precisionLevel1.conc[i]);
    sheet.getRange(\`C\${24 + i}\`).setValue(data.precisionLevel1.motility[i]);
    sheet.getRange(\`D\${24 + i}\`).setValue(data.precisionLevel1.morph[i]);
  }
  
  // Precision Level 2 (starting at A32)
  // Headers at B34:B35, C34:C35, D34:D35
  // Data in B36:B40, C36:C40, D36:D40
  for (let i = 0; i < data.precisionLevel2.conc.length; i++) {
    sheet.getRange(\`B\${36 + i}\`).setValue(data.precisionLevel2.conc[i]);
    sheet.getRange(\`C\${36 + i}\`).setValue(data.precisionLevel2.motility[i]);
    sheet.getRange(\`D\${36 + i}\`).setValue(data.precisionLevel2.morph[i]);
  }
  
  // Accuracy (starting at A44)
  // Headers at A46:B46 (CONC), C46:D46 (MOTILITY), E46:F46 (MORPHOLOGY)
  // Sub-headers at A47, B47, C47, D47, E47, F47
  // Data in A48:A52, B48:B52, C48:C52, D48:D52, E48:E52, F48:F52
  for (let i = 0; i < data.accuracy.sqa.length; i++) {
    sheet.getRange(\`A\${48 + i}\`).setValue(data.accuracy.sqa[i]);
    sheet.getRange(\`B\${48 + i}\`).setValue(data.accuracy.manual[i]);
    sheet.getRange(\`C\${48 + i}\`).setValue(data.accuracy.sqaMotility[i]);
    sheet.getRange(\`D\${48 + i}\`).setValue(data.accuracy.manualMotility[i]);
    sheet.getRange(\`E\${48 + i}\`).setValue(data.accuracy.sqaMorph[i]);
    sheet.getRange(\`F\${48 + i}\`).setValue(data.accuracy.manualMorph[i]);
  }
  
  // QC (starting at A67)
  // Headers at B69:B70, C69:C70
  // Data in B71:B75, C71:C75
  for (let i = 0; i < data.qc.level1.length; i++) {
    sheet.getRange(\`B\${71 + i}\`).setValue(data.qc.level1[i]);
    sheet.getRange(\`C\${71 + i}\`).setValue(data.qc.level2[i]);
  }
}`;