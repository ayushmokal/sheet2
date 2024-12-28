export const emailHandlerScript = `
function sendEmailWithNewSpreadsheet(ss, sheetName, recipientEmail) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    throw new Error('Sheet not found: ' + sheetName);
  }
  
  // Create a temporary spreadsheet with just this sheet
  const tempSpreadsheet = SpreadsheetApp.create('Temp - ' + sheetName);
  const tempSheet = tempSpreadsheet.getSheets()[0];
  
  // Copy the data and formatting from the original sheet
  const sourceRange = sheet.getDataRange();
  const sourceValues = sourceRange.getValues();
  const sourceFormats = sourceRange.getNumberFormats();
  const sourceFontColors = sourceRange.getFontColors();
  const sourceBackgrounds = sourceRange.getBackgrounds();
  const sourceFormulas = sourceRange.getFormulas();
  
  // Set dimensions of temp sheet
  const numRows = sourceValues.length;
  const numCols = sourceValues[0].length;
  
  if (tempSheet.getMaxRows() < numRows) {
    tempSheet.insertRows(1, numRows - tempSheet.getMaxRows());
  }
  if (tempSheet.getMaxColumns() < numCols) {
    tempSheet.insertColumns(1, numCols - tempSheet.getMaxColumns());
  }
  
  // Copy content and formatting
  const targetRange = tempSheet.getRange(1, 1, numRows, numCols);
  targetRange.setValues(sourceValues);
  targetRange.setNumberFormats(sourceFormats);
  targetRange.setFontColors(sourceFontColors);
  targetRange.setBackgrounds(sourceBackgrounds);
  
  // Apply formulas where they exist
  for (let i = 0; i < sourceFormulas.length; i++) {
    for (let j = 0; j < sourceFormulas[i].length; j++) {
      if (sourceFormulas[i][j] !== '') {
        tempSheet.getRange(i + 1, j + 1).setFormula(sourceFormulas[i][j]);
      }
    }
  }
  
  // Copy column widths and row heights
  for (let i = 1; i <= numCols; i++) {
    tempSheet.setColumnWidth(i, sheet.getColumnWidth(i));
  }
  for (let i = 1; i <= numRows; i++) {
    tempSheet.setRowHeight(i, sheet.getRowHeight(i));
  }
  
  // Get the temporary spreadsheet file
  const tempFile = DriveApp.getFileById(tempSpreadsheet.getId());
  
  // Create PDF and Excel versions
  const pdfBlob = tempFile.getAs(MimeType.PDF).setName('SQA Data - ' + sheetName + '.pdf');
  const xlsxBlob = tempFile.getAs(MimeType.MICROSOFT_EXCEL).setName('SQA Data - ' + sheetName + '.xlsx');
  
  const emailSubject = 'New SQA Data Submission - ' + sheetName;
  const emailBody = 'A new SQA data submission has been recorded.\\n\\n' +
                   'Sheet Name: ' + sheetName + '\\n' +
                   'Date: ' + new Date().toLocaleDateString() + '\\n\\n' +
                   'The data is attached in both PDF and Excel formats.\\n\\n' +
                   'This is an automated message.';
  
  // Send email with both attachments
  GmailApp.sendEmail(
    recipientEmail,
    emailSubject,
    emailBody,
    {
      name: 'SQA Data System',
      attachments: [pdfBlob, xlsxBlob]
    }
  );
  
  // Clean up by deleting the temporary spreadsheet
  DriveApp.getFileById(tempSpreadsheet.getId()).setTrashed(true);
  
  return true;
}
`;