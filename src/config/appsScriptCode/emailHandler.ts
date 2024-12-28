export const emailHandlerScript = `
function sendEmailWithNewSpreadsheet(ss, sheetName, recipientEmail) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    throw new Error('Sheet not found: ' + sheetName);
  }
  
  // Create a new spreadsheet with a meaningful name
  const newSpreadsheet = SpreadsheetApp.create('SQA Data - ' + sheetName);
  const targetSheet = newSpreadsheet.getSheets()[0];
  targetSheet.setName(sheetName);
  
  // Copy the data and formatting from the original sheet
  const sourceRange = sheet.getDataRange();
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
  
  // Get the new spreadsheet's URL
  const newSpreadsheetUrl = newSpreadsheet.getUrl();
  
  // Share the spreadsheet with the recipient
  const file = DriveApp.getFileById(newSpreadsheet.getId());
  file.addViewer(recipientEmail);
  
  // Generate PDF
  const pdfBlob = targetSheet.getAs('application/pdf').setName('SQA Data - ' + sheetName + '.pdf');
  
  const emailSubject = 'New SQA Data Submission - ' + sheetName;
  const emailBody = 'A new SQA data submission has been recorded.\\n\\n' +
                   'Sheet Name: ' + sheetName + '\\n' +
                   'Date: ' + new Date().toLocaleDateString() + '\\n\\n' +
                   'You can access the new spreadsheet here: ' + newSpreadsheetUrl + '\\n\\n' +
                   'The original spreadsheet can be found here: ' + ss.getUrl() + '#gid=' + sheet.getSheetId() + '\\n\\n' +
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
  
  return {
    status: 'success',
    message: 'Email sent successfully',
    newSpreadsheetUrl: newSpreadsheetUrl
  };
}
`;