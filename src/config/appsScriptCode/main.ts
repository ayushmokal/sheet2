export const mainScript = `
const SPREADSHEET_ID = '1NN-_CgDUpIrzW_Rlsa5FHPnGqE9hIwC4jEjaBVG3tWU';

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
  console.log("Starting handleSubmit with data:", data);
  
  if (!data) {
    throw new Error('No data provided');
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  console.log("Opened spreadsheet");
  
  // Get template sheet
  const templateSheet = ss.getSheetByName(data.sheetName);
  if (!templateSheet) {
    throw new Error('Template sheet not found: ' + data.sheetName);
  }
  
  // Create new sheet from template
  const newSheetName = generateUniqueSheetName(ss, data);
  const newSheet = templateSheet.copyTo(ss);
  newSheet.setName(newSheetName);
  console.log("Created new sheet:", newSheetName);

  try {
    writeFacilityInfo(newSheet, data);
    writeLowerLimitDetection(newSheet, data);
    writePrecisionData(newSheet, data);
    writeAccuracyData(newSheet, data);
    writeMorphGradeFinal(newSheet, data);
    writeQCData(newSheet, data);

    // Send email with new spreadsheet if recipient is provided
    if (data.emailTo) {
      sendEmailWithSheet(ss, newSheet, data.emailTo);
    }

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
}

function writeFacilityInfo(sheet, data) {
  sheet.getRange('B3:H3').setValue(data.facility);
  sheet.getRange('B4:H4').setValue(data.date);
  sheet.getRange('B5:H5').setValue(data.technician);
  sheet.getRange('B6:H6').setValue(data.serialNumber);
}

function writeLowerLimitDetection(sheet, data) {
  for (let i = 0; i < data.lowerLimitDetection.conc.length; i++) {
    sheet.getRange('B' + (12 + i)).setValue(data.lowerLimitDetection.conc[i]);
    sheet.getRange('C' + (12 + i)).setValue(data.lowerLimitDetection.msc[i]);
  }
}

function writePrecisionData(sheet, data) {
  // Write Precision Level 1 data
  for (let i = 0; i < data.precisionLevel1.conc.length; i++) {
    sheet.getRange('B' + (24 + i)).setValue(data.precisionLevel1.conc[i]);
    sheet.getRange('C' + (24 + i)).setValue(data.precisionLevel1.motility[i]);
    sheet.getRange('D' + (24 + i)).setValue(data.precisionLevel1.morph[i]);
  }
  
  // Write Precision Level 2 data
  for (let i = 0; i < data.precisionLevel2.conc.length; i++) {
    sheet.getRange('B' + (36 + i)).setValue(data.precisionLevel2.conc[i]);
    sheet.getRange('C' + (36 + i)).setValue(data.precisionLevel2.motility[i]);
    sheet.getRange('D' + (36 + i)).setValue(data.precisionLevel2.morph[i]);
  }
}

function writeAccuracyData(sheet, data) {
  for (let i = 0; i < data.accuracy.sqa.length; i++) {
    sheet.getRange('A' + (48 + i)).setValue(data.accuracy.sqa[i]);
    sheet.getRange('B' + (48 + i)).setValue(data.accuracy.manual[i]);
    sheet.getRange('C' + (48 + i)).setValue(data.accuracy.sqaMotility[i]);
    sheet.getRange('D' + (48 + i)).setValue(data.accuracy.manualMotility[i]);
    sheet.getRange('E' + (48 + i)).setValue(data.accuracy.sqaMorph[i]);
    sheet.getRange('F' + (48 + i)).setValue(data.accuracy.manualMorph[i]);
  }
}

function writeMorphGradeFinal(sheet, data) {
  const morphData = data.accuracy.morphGradeFinal;
  const tp = parseFloat(morphData.tp) || 0;
  const tn = parseFloat(morphData.tn) || 0;
  const fp = parseFloat(morphData.fp) || 0;
  const fn = parseFloat(morphData.fn) || 0;

  sheet.getRange('L48').setValue(tp);
  sheet.getRange('L49').setValue(tn);
  sheet.getRange('L50').setValue(fp);
  sheet.getRange('L51').setValue(fn);

  const sensitivity = tp + fn !== 0 ? (tp / (tp + fn)) * 100 : 0;
  const specificity = fp + tn !== 0 ? (tn / (fp + tn)) * 100 : 0;

  sheet.getRange('L46').setValue(sensitivity);
  sheet.getRange('L47').setValue(specificity);
}

function writeQCData(sheet, data) {
  for (let i = 0; i < data.qc.level1.length; i++) {
    sheet.getRange('B' + (71 + i)).setValue(data.qc.level1[i]);
    sheet.getRange('C' + (71 + i)).setValue(data.qc.level2[i]);
  }
}
`;