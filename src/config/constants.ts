// Spreadsheet configuration
export const SPREADSHEET_CONFIG = {
  TEMPLATE_SHEET_NAME: 'Template',
  SPREADSHEET_ID: '1NN-_CgDUpIrzW_Rlsa5FHPnGqE9hIwC4jEjaBVG3tWU'
};

export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzSWAFpAbFVAVeIF4AzyHEypSFy6mwj4jMtfa2Wt8JSSiYOQ4IlMGUOZ6m8nw48mj-p-A/exec';

export const FORM_CONFIG = {
  SECTIONS: {
    LOWER_LIMIT: 'Lower Limit Detection',
    PRECISION_1: 'Precision Level 1',
    PRECISION_2: 'Precision Level 2',
    ACCURACY: 'Accuracy',
    QC: 'Quality Control'
  }
};

// Apps Script Code Template
export const APPS_SCRIPT_CODE = `
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

function handleSubmit(data) {
  console.log("Starting handleSubmit with data:", data);
  
  if (!data) {
    throw new Error('No data provided');
  }

  const ss = SpreadsheetApp.openById('${SPREADSHEET_CONFIG.SPREADSHEET_ID}');
  console.log("Opened spreadsheet");
  
  const templateSheet = ss.getSheetByName(data.sheetName);
  if (!templateSheet) {
    throw new Error('Template sheet not found: ' + data.sheetName);
  }
  
  const newSheetName = generateUniqueSheetName(ss, data);
  const newSheet = templateSheet.copyTo(ss);
  newSheet.setName(newSheetName);
  console.log("Created new sheet:", newSheetName);

  try {
    newSheet.getRange('B3:H3').setValue(data.facility);
    newSheet.getRange('B4:H4').setValue(data.date);
    newSheet.getRange('B5:H5').setValue(data.technician);
    newSheet.getRange('B6:H6').setValue(data.serialNumber);
    console.log("Wrote facility info");

    for (let i = 0; i < 5; i++) {
      newSheet.getRange(\`B\${12 + i}\`).setValue(data.lowerLimitDetection.conc[i]);
      newSheet.getRange(\`C\${12 + i}\`).setValue(data.lowerLimitDetection.msc[i]);
    }
    console.log("Wrote Lower Limit Detection data");

    for (let i = 0; i < 5; i++) {
      newSheet.getRange(\`B\${24 + i}\`).setValue(data.precisionLevel1.conc[i]);
      newSheet.getRange(\`C\${24 + i}\`).setValue(data.precisionLevel1.motility[i]);
      newSheet.getRange(\`D\${24 + i}\`).setValue(data.precisionLevel1.morph[i]);
    }
    console.log("Wrote Precision Level 1 data");

    for (let i = 0; i < 5; i++) {
      newSheet.getRange(\`B\${36 + i}\`).setValue(data.precisionLevel2.conc[i]);
      newSheet.getRange(\`C\${36 + i}\`).setValue(data.precisionLevel2.motility[i]);
      newSheet.getRange(\`D\${36 + i}\`).setValue(data.precisionLevel2.morph[i]);
    }
    console.log("Wrote Precision Level 2 data");

    for (let i = 0; i < 5; i++) {
      newSheet.getRange(\`A\${48 + i}\`).setValue(data.accuracy.sqa[i]);
      newSheet.getRange(\`B\${48 + i}\`).setValue(data.accuracy.manual[i]);
      newSheet.getRange(\`C\${48 + i}\`).setValue(data.accuracy.sqaMotility[i]);
      newSheet.getRange(\`D\${48 + i}\`).setValue(data.accuracy.manualMotility[i]);
      newSheet.getRange(\`E\${48 + i}\`).setValue(data.accuracy.sqaMorph[i]);
      newSheet.getRange(\`F\${48 + i}\`).setValue(data.accuracy.manualMorph[i]);
    }
    console.log("Wrote Accuracy data");

    for (let i = 0; i < 5; i++) {
      newSheet.getRange(\`B\${71 + i}\`).setValue(data.qc.level1[i]);
      newSheet.getRange(\`C\${71 + i}\`).setValue(data.qc.level2[i]);
    }
    console.log("Wrote QC data");

    const tp = parseFloat(data.accuracy.morphGradeFinal.tp) || 0;
    const tn = parseFloat(data.accuracy.morphGradeFinal.tn) || 0;
    const fp = parseFloat(data.accuracy.morphGradeFinal.fp) || 0;
    const fn = parseFloat(data.accuracy.morphGradeFinal.fn) || 0;

    newSheet.getRange('L48').setValue(tp);
    newSheet.getRange('L49').setValue(tn);
    newSheet.getRange('L50').setValue(fp);
    newSheet.getRange('L51').setValue(fn);

    const sensitivity = tp + fn !== 0 ? (tp / (tp + fn)) * 100 : 0;
    const specificity = fp + tn !== 0 ? (tn / (fp + tn)) * 100 : 0;

    newSheet.getRange('L46').setValue(sensitivity);
    newSheet.getRange('L47').setValue(specificity);
    console.log("Wrote Morph Grade Final data");

    return {
      status: 'success',
      message: 'Data submitted successfully',
      sheetName: newSheetName
    };
  } catch (error) {
    console.error("Error writing data:", error);
    try {
      ss.deleteSheet(newSheet);
    } catch (e) {
      console.error("Error deleting sheet after failure:", e);
    }
    throw error;
  }
}`;