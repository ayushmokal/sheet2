export const APPS_SCRIPT_CODE = `
const SPREADSHEET_ID = '1NN-_CgDUpIrzW_Rlsa5FHPnGqE9hIwC4jEjaBVG3tWU';

// Main Script
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

// Utils Script
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
}

function generateUniqueSheetName(spreadsheet, data) {
  const formattedDate = formatDate(data.date);
  const sanitizedFacility = data.facility.replace(/[^a-zA-Z0-9]/g, '');
  const cleanSerialNumber = data.serialNumber.trim();
  
  const baseSheetName = formattedDate + '-' + cleanSerialNumber + '-' + sanitizedFacility;
  
  const existingSheets = spreadsheet.getSheets().map(sheet => sheet.getName());
  if (existingSheets.includes(baseSheetName)) {
    throw new Error('A submission with this date, serial number, and facility already exists');
  }
  
  return baseSheetName;
}

// Email Handler Script
function sendEmailWithNewSpreadsheet(originalSpreadsheet, sheetName, recipientEmail) {
  // Create a new spreadsheet
  const newSpreadsheet = SpreadsheetApp.create('SQA Data - ' + sheetName);
  const originalSheet = originalSpreadsheet.getSheetByName(sheetName);
  
  // Get the first sheet of the new spreadsheet and clear it
  const targetSheet = newSpreadsheet.getSheets()[0];
  targetSheet.clear();
  
  // Match sheet properties and copy data
  copySheetProperties(originalSheet, targetSheet);
  copySheetData(originalSheet, targetSheet);
  copySheetFormatting(originalSheet.getDataRange(), targetSheet.getRange(1, 1, originalSheet.getLastRow(), originalSheet.getLastColumn()));
  
  // Generate PDF
  const pdfBlob = targetSheet.getAs('application/pdf').setName('SQA Data - ' + sheetName + '.pdf');
  
  // Share and send email
  newSpreadsheet.addEditor(recipientEmail);
  
  const emailSubject = 'New SQA Data Submission - ' + sheetName;
  const emailBody = 'A new SQA data submission has been recorded.\\n\\n' +
                   'Sheet Name: ' + sheetName + '\\n' +
                   'Date: ' + new Date().toLocaleDateString() + '\\n\\n' +
                   'You can access the spreadsheet here: ' + newSpreadsheet.getUrl() + '\\n\\n' +
                   'This is an automated message.';
  
  GmailApp.sendEmail(
    recipientEmail,
    emailSubject,
    emailBody,
    {
      name: 'SQA Data System',
      attachments: [pdfBlob]
    }
  );
  
  return true;
}

function copySheetProperties(source, target) {
  target.setFrozenRows(source.getFrozenRows());
  target.setFrozenColumns(source.getFrozenColumns());
  
  // Copy dimensions
  const numRows = source.getLastRow();
  const numCols = source.getLastColumn();
  
  // Ensure target has enough rows and columns
  if (target.getMaxRows() < numRows) {
    target.insertRows(1, numRows - target.getMaxRows());
  }
  if (target.getMaxColumns() < numCols) {
    target.insertColumns(1, numCols - target.getMaxColumns());
  }
  
  // Copy column widths and row heights
  for (let i = 1; i <= numCols; i++) {
    target.setColumnWidth(i, source.getColumnWidth(i));
  }
  for (let i = 1; i <= numRows; i++) {
    target.setRowHeight(i, source.getRowHeight(i));
  }
}

function copySheetData(source, target) {
  const sourceRange = source.getDataRange();
  const sourceValues = sourceRange.getValues();
  const sourceFormulas = sourceRange.getFormulas();
  
  const targetRange = target.getRange(1, 1, sourceValues.length, sourceValues[0].length);
  targetRange.setValues(sourceValues);
  
  // Apply formulas where they exist
  for (let i = 0; i < sourceFormulas.length; i++) {
    for (let j = 0; j < sourceFormulas[i].length; j++) {
      if (sourceFormulas[i][j] !== '') {
        target.getRange(i + 1, j + 1).setFormula(sourceFormulas[i][j]);
      }
    }
  }
}

function copySheetFormatting(sourceRange, targetRange) {
  // Copy all formatting
  targetRange.setBackgrounds(sourceRange.getBackgrounds());
  targetRange.setFontColors(sourceRange.getFontColors());
  targetRange.setFontFamilies(sourceRange.getFontFamilies());
  targetRange.setFontLines(sourceRange.getFontLines());
  targetRange.setFontStyles(sourceRange.getFontStyles());
  targetRange.setFontWeights(sourceRange.getFontWeights());
  targetRange.setHorizontalAlignments(sourceRange.getHorizontalAlignments());
  targetRange.setVerticalAlignments(sourceRange.getVerticalAlignments());
  targetRange.setNumberFormats(sourceRange.getNumberFormats());
  targetRange.setTextRotations(sourceRange.getTextRotations());
  targetRange.setWraps(sourceRange.getWraps());
  
  // Copy merged ranges
  const mergedRanges = sourceRange.getMergedRanges();
  mergedRanges.forEach(function(range) {
    const row = range.getRow();
    const col = range.getColumn();
    const numRows = range.getNumRows();
    const numCols = range.getNumColumns();
    targetRange.getSheet().getRange(row, col, numRows, numCols).merge();
  });
  
  // Copy conditional formatting rules
  const rules = sourceRange.getSheet().getConditionalFormatRules();
  targetRange.getSheet().setConditionalFormatRules(rules);
  
  // Copy data validation rules
  for (let i = 1; i <= sourceRange.getNumRows(); i++) {
    for (let j = 1; j <= sourceRange.getNumColumns(); j++) {
      const sourceCell = sourceRange.getSheet().getRange(i, j);
      const targetCell = targetRange.getSheet().getRange(i, j);
      const validation = sourceCell.getDataValidation();
      if (validation != null) {
        targetCell.setDataValidation(validation);
      }
    }
  }
  
  // Copy borders
  const sourceBorder = sourceRange.getBorder();
  if (sourceBorder) {
    const top = sourceBorder.getTop() || null;
    const left = sourceBorder.getLeft() || null;
    const bottom = sourceBorder.getBottom() || null;
    const right = sourceBorder.getRight() || null;
    const vertical = sourceBorder.getVertical() || null;
    const horizontal = sourceBorder.getHorizontal() || null;

    if (top || left || bottom || right || vertical || horizontal) {
      targetRange.setBorder(top, left, bottom, right, vertical, horizontal);
    }
  }
}

// Data Handler Script
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
      sendEmailWithNewSpreadsheet(ss, newSheetName, data.emailTo);
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
  console.log("Wrote facility info");
}

function writeLowerLimitDetection(sheet, data) {
  for (let i = 0; i < data.lowerLimitDetection.conc.length; i++) {
    sheet.getRange('B' + (12 + i)).setValue(data.lowerLimitDetection.conc[i]);
    sheet.getRange('C' + (12 + i)).setValue(data.lowerLimitDetection.msc[i]);
  }
  console.log("Wrote Lower Limit Detection data");
}

function writePrecisionData(sheet, data) {
  // Level 1
  for (let i = 0; i < data.precisionLevel1.conc.length; i++) {
    sheet.getRange('B' + (24 + i)).setValue(data.precisionLevel1.conc[i]);
    sheet.getRange('C' + (24 + i)).setValue(data.precisionLevel1.motility[i]);
    sheet.getRange('D' + (24 + i)).setValue(data.precisionLevel1.morph[i]);
  }
  console.log("Wrote Precision Level 1 data");

  // Level 2
  for (let i = 0; i < data.precisionLevel2.conc.length; i++) {
    sheet.getRange('B' + (36 + i)).setValue(data.precisionLevel2.conc[i]);
    sheet.getRange('C' + (36 + i)).setValue(data.precisionLevel2.motility[i]);
    sheet.getRange('D' + (36 + i)).setValue(data.precisionLevel2.morph[i]);
  }
  console.log("Wrote Precision Level 2 data");
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
  console.log("Wrote Accuracy data");
}

function writeMorphGradeFinal(sheet, data) {
  const tp = parseFloat(data.accuracy.morphGradeFinal.tp) || 0;
  const tn = parseFloat(data.accuracy.morphGradeFinal.tn) || 0;
  const fp = parseFloat(data.accuracy.morphGradeFinal.fp) || 0;
  const fn = parseFloat(data.accuracy.morphGradeFinal.fn) || 0;

  sheet.getRange('L48').setValue(tp);
  sheet.getRange('L49').setValue(tn);
  sheet.getRange('L50').setValue(fp);
  sheet.getRange('L51').setValue(fn);

  const sensitivity = tp + fn !== 0 ? (tp / (tp + fn)) * 100 : 0;
  const specificity = fp + tn !== 0 ? (tn / (fp + tn)) * 100 : 0;

  sheet.getRange('L46').setValue(sensitivity);
  sheet.getRange('L47').setValue(specificity);
  console.log("Wrote Morph Grade Final data");
}

function writeQCData(sheet, data) {
  for (let i = 0; i < data.qc.level1.length; i++) {
    sheet.getRange('B' + (71 + i)).setValue(data.qc.level1[i]);
    sheet.getRange('C' + (71 + i)).setValue(data.qc.level2[i]);
  }
  console.log("Wrote QC data");
}
`;