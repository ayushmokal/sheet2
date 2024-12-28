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
  
  // Set dimensions of temp sheet
  if (tempSheet.getMaxRows() < sourceValues.length) {
    tempSheet.insertRows(1, sourceValues.length - tempSheet.getMaxRows());
  }
  if (tempSheet.getMaxColumns() < sourceValues[0].length) {
    tempSheet.insertColumns(1, sourceValues[0].length - tempSheet.getMaxColumns());
  }
  
  // Copy content and formatting
  const targetRange = tempSheet.getRange(1, 1, sourceValues.length, sourceValues[0].length);
  targetRange.setValues(sourceValues);
  targetRange.setNumberFormats(sourceFormats);
  targetRange.setFontColors(sourceFontColors);
  targetRange.setBackgrounds(sourceBackgrounds);
  
  // Generate PDF of just this sheet
  const pdfBlob = tempSpreadsheet.getAs('application/pdf').setName('SQA Data - ' + sheetName + '.pdf');
  
  // Delete the temporary spreadsheet
  DriveApp.getFileById(tempSpreadsheet.getId()).setTrashed(true);
  
  const emailSubject = 'New SQA Data Submission - ' + sheetName;
  const emailBody = 'A new SQA data submission has been recorded.\\n\\n' +
                   'Sheet Name: ' + sheetName + '\\n' +
                   'Date: ' + new Date().toLocaleDateString() + '\\n\\n' +
                   'You can access the spreadsheet here: ' + ss.getUrl() + '#gid=' + sheet.getSheetId() + '\\n\\n' +
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