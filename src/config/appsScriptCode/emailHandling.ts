export const emailHandling = `
function sendEmailWithNewSpreadsheet(originalSpreadsheet, sheetName, recipientEmail) {
  // Create a new spreadsheet
  const newSpreadsheet = SpreadsheetApp.create('SQA Data - ' + sheetName);
  const originalSheet = originalSpreadsheet.getSheetByName(sheetName);
  
  // Get the first sheet of the new spreadsheet and clear it
  const targetSheet = newSpreadsheet.getSheets()[0];
  targetSheet.clear();
  
  // Match sheet properties
  targetSheet.setFrozenRows(originalSheet.getFrozenRows());
  targetSheet.setFrozenColumns(originalSheet.getFrozenColumns());
  
  // Copy the data
  const sourceRange = originalSheet.getDataRange();
  const sourceValues = sourceRange.getValues();
  const sourceFormulas = sourceRange.getFormulas();
  const numRows = sourceValues.length;
  const numCols = sourceValues[0].length;
  
  // Ensure target sheet has enough rows and columns
  if (targetSheet.getMaxRows() < numRows) {
    targetSheet.insertRows(1, numRows - targetSheet.getMaxRows());
  }
  if (targetSheet.getMaxColumns() < numCols) {
    targetSheet.insertColumns(1, numCols - targetSheet.getMaxColumns());
  }
  
  // Set dimensions
  for (let i = 1; i <= numCols; i++) {
    targetSheet.setColumnWidth(i, originalSheet.getColumnWidth(i));
  }
  for (let i = 1; i <= numRows; i++) {
    targetSheet.setRowHeight(i, originalSheet.getRowHeight(i));
  }
  
  // Copy data and formatting
  const targetRange = targetSheet.getRange(1, 1, numRows, numCols);
  targetRange.setValues(sourceValues);
  
  // Apply formulas
  for (let i = 0; i < sourceFormulas.length; i++) {
    for (let j = 0; j < sourceFormulas[i].length; j++) {
      if (sourceFormulas[i][j] !== '') {
        targetSheet.getRange(i + 1, j + 1).setFormula(sourceFormulas[i][j]);
      }
    }
  }
  
  copySheetFormatting(sourceRange, targetRange, originalSheet, targetSheet);
  
  // Get the URL of the new spreadsheet
  const newSpreadsheetUrl = newSpreadsheet.getUrl();
  
  // Generate PDF
  const pdfBlob = targetSheet.getAs('application/pdf').setName('SQA Data - ' + sheetName + '.pdf');
  
  // Share the spreadsheet with the recipient
  newSpreadsheet.addEditor(recipientEmail);
  
  const emailSubject = 'New SQA Data Submission - ' + sheetName;
  const emailBody = 
    'A new SQA data submission has been recorded.\\n\\n' +
    'Sheet Name: ' + sheetName + '\\n' +
    'Date: ' + new Date().toLocaleDateString() + '\\n\\n' +
    'You can access the spreadsheet here: ' + newSpreadsheetUrl + '\\n\\n' +
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
`;