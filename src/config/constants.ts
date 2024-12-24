// Google Apps Script URL for form submission
export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyALESHv-oMzoW6PYVg1QCSgzne2vZtRWrjSM3lM_eu0Zn0F_qBLSQ0245PLZhuFhHbsw/exec';

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
const APPS_SCRIPT_CODE = `
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
`;

export { APPS_SCRIPT_CODE };