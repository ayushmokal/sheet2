export const emailHandlerScript = `
function sendEmailWithNewSpreadsheet(originalSpreadsheet, sheetName, recipientEmail) {
  // Create a temporary spreadsheet for this specific sheet
  const tempSpreadsheet = SpreadsheetApp.create('Temp - ' + sheetName);
  const tempSheet = tempSpreadsheet.getSheets()[0];
  const sheet = originalSpreadsheet.getSheetByName(sheetName);
  
  // Get source data and formatting
  const sourceRange = sheet.getDataRange();
  const sourceValues = sourceRange.getValues();
  const sourceFormats = sourceRange.getNumberFormats();
  const sourceFontColors = sourceRange.getFontColors();
  const sourceBackgrounds = sourceRange.getBackgrounds();
  const sourceMerges = sourceRange.getMergedRanges();
  
  // Prepare target sheet
  const numRows = sourceValues.length;
  const numCols = sourceValues[0].length;
  
  // Ensure target sheet has enough rows and columns
  if (tempSheet.getMaxRows() < numRows) {
    tempSheet.insertRows(1, numRows - tempSheet.getMaxRows());
  }
  if (tempSheet.getMaxColumns() < numCols) {
    tempSheet.insertColumns(1, numCols - tempSheet.getMaxColumns());
  }
  
  // Copy data and formatting
  const targetRange = tempSheet.getRange(1, 1, numRows, numCols);
  targetRange.setValues(sourceValues);
  targetRange.setNumberFormats(sourceFormats);
  targetRange.setFontColors(sourceFontColors);
  targetRange.setBackgrounds(sourceBackgrounds);
  
  // Copy column widths and row heights
  for (let i = 1; i <= sourceValues[0].length; i++) {
    tempSheet.setColumnWidth(i, sheet.getColumnWidth(i));
  }
  for (let i = 1; i <= sourceValues.length; i++) {
    tempSheet.setRowHeight(i, sheet.getRowHeight(i));
  }
  
  // Recreate merged cells
  sourceMerges.forEach(mergedRange => {
    const row = mergedRange.getRow();
    const col = mergedRange.getColumn();
    const numRows = mergedRange.getNumRows();
    const numCols = mergedRange.getNumColumns();
    tempSheet.getRange(row, col, numRows, numCols).merge();
  });
  
  // Create PDF blob
  const pdfBlob = DriveApp.getFileById(tempSpreadsheet.getId()).getAs(MimeType.PDF)
    .setName('SQA Data - ' + sheetName + '.pdf');
  
  // Create XLSX blob
  const xlsxBlob = DriveApp.getFileById(tempSpreadsheet.getId()).getAs(MimeType.MICROSOFT_EXCEL_XLSX)
    .setName('SQA Data - ' + sheetName + '.xlsx');
  
  // Send email with both attachments
  const emailSubject = 'New SQA Data Submission - ' + sheetName;
  const emailBody = 
    'A new SQA data submission has been recorded.\\n\\n' +
    'Sheet Name: ' + sheetName + '\\n' +
    'Date: ' + new Date().toLocaleDateString() + '\\n\\n' +
    'Please find attached both PDF and Excel versions of the submitted data.\\n\\n' +
    'This is an automated message.';
  
  GmailApp.sendEmail(
    recipientEmail,
    emailSubject,
    emailBody,
    {
      name: 'SQA Data System',
      attachments: [pdfBlob, xlsxBlob]
    }
  );
  
  // Clean up - delete temporary spreadsheet
  DriveApp.getFileById(tempSpreadsheet.getId()).setTrashed(true);
  
  return true;
}
`;