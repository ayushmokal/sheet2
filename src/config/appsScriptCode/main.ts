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

function generateUniqueSheetName(spreadsheet, data) {
  const date = new Date(data.date);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const formattedDate = \`\${year}-\${month}-\${day}\`;
  
  const sanitizedFacility = data.facility.replace(/[^a-zA-Z0-9]/g, '');
  const cleanSerialNumber = data.serialNumber.trim();
  
  const baseSheetName = \`\${formattedDate}-\${cleanSerialNumber}-\${sanitizedFacility}\`;
  
  // Check if sheet name already exists
  const existingSheets = spreadsheet.getSheets().map(sheet => sheet.getName());
  if (existingSheets.includes(baseSheetName)) {
    throw new Error('A submission with this date, serial number, and facility already exists');
  }
  
  return baseSheetName;
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
    writeDataToSheet(newSheet, data);

    // Create a new spreadsheet and copy the data
    const newSpreadsheet = SpreadsheetApp.create('SQA Data - ' + newSheetName);
    const targetSheet = newSpreadsheet.getSheets()[0];
    targetSheet.setName(newSheetName);

    // Copy data and formatting from the template
    const sourceRange = newSheet.getDataRange();
    const sourceValues = sourceRange.getValues();
    const sourceFormats = sourceRange.getNumberFormats();
    const sourceFontColors = sourceRange.getFontColors();
    const sourceBackgrounds = sourceRange.getBackgrounds();
    const sourceMerges = sourceRange.getMergedRanges();

    // Set dimensions of target sheet
    if (targetSheet.getMaxRows() < sourceValues.length) {
      targetSheet.insertRows(1, sourceValues.length - targetSheet.getMaxRows());
    }
    if (targetSheet.getMaxColumns() < sourceValues[0].length) {
      targetSheet.insertColumns(1, sourceValues[0].length - targetSheet.getMaxColumns());
    }

    // Copy content and formatting
    const targetRange = targetSheet.getRange(1, 1, sourceValues.length, sourceValues[0].length);
    targetRange.setValues(sourceValues);
    targetRange.setNumberFormats(sourceFormats);
    targetRange.setFontColors(sourceFontColors);
    targetRange.setBackgrounds(sourceBackgrounds);

    // Re-apply merged cells
    sourceMerges.forEach(mergedRange => {
      const row = mergedRange.getRow();
      const col = mergedRange.getColumn();
      const numRows = mergedRange.getNumRows();
      const numCols = mergedRange.getNumColumns();
      targetSheet.getRange(row, col, numRows, numCols).merge();
    });

    // Share and send email if recipient provided
    if (data.emailTo) {
      const newSpreadsheetUrl = newSpreadsheet.getUrl();
      const file = DriveApp.getFileById(newSpreadsheet.getId());
      file.addViewer(data.emailTo);

      // Generate PDF
      const pdfBlob = targetSheet.getAs('application/pdf').setName('SQA Data - ' + newSheetName + '.pdf');

      // Send email
      const emailSubject = 'New SQA Data Submission - ' + newSheetName;
      const emailBody = 'A new SQA data submission has been recorded.\\n\\n' +
                       'Sheet Name: ' + newSheetName + '\\n' +
                       'Date: ' + new Date().toLocaleDateString() + '\\n\\n' +
                       'You can access the new spreadsheet here: ' + newSpreadsheetUrl + '\\n\\n' +
                       'The original spreadsheet can be found here: ' + ss.getUrl() + '#gid=' + newSheet.getSheetId() + '\\n\\n' +
                       'This is an automated message.';

      GmailApp.sendEmail(
        data.emailTo,
        emailSubject,
        emailBody,
        {
          name: 'SQA Data System',
          attachments: [pdfBlob]
        }
      );
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
`;