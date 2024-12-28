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
  const sourceMerges = sourceRange.getMergedRanges();
  
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
  
  // Recreate merged cells
  sourceMerges.forEach(mergedRange => {
    const row = mergedRange.getRow();
    const col = mergedRange.getColumn();
    const numRows = mergedRange.getNumRows();
    const numCols = mergedRange.getNumColumns();
    tempSheet.getRange(row, col, numRows, numCols).merge();
  });
  
  // Get the PDF and XLSX files directly from Drive
  const tempFile = DriveApp.getFileById(tempSpreadsheet.getId());
  
  // Create PDF blob
  const pdfBlob = tempSheet.getAs(MimeType.PDF).setName('SQA Data - ' + sheetName + '.pdf');
  
  // Create XLSX blob
  const xlsxBlob = tempFile.getAs(MimeType.MICROSOFT_EXCEL_LEGACY).setName('SQA Data - ' + sheetName + '.xlsx');
  
  // Delete the temporary spreadsheet
  DriveApp.getFileById(tempSpreadsheet.getId()).setTrashed(true);
  
  const emailSubject = 'New SQA Data Submission - ' + sheetName;
  const emailBody = 'A new SQA data submission has been recorded.\\n\\n' +
                   'Sheet Name: ' + sheetName + '\\n' +
                   'Date: ' + new Date().toLocaleDateString() + '\\n\\n' +
                   'You can access the spreadsheet here: ' + ss.getUrl() + '#gid=' + sheet.getSheetId() + '\\n\\n' +
                   'This is an automated message.\\n\\n' +
                   'Attachments include both PDF and XLSX formats of the submitted data.';
  
  GmailApp.sendEmail(
    recipientEmail,
    emailSubject,
    emailBody,
    {
      name: 'SQA Data System',
      attachments: [pdfBlob, xlsxBlob]
    }
  );
  
  return true;
}
`;