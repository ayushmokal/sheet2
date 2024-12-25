export const emailHandlerScript = `
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
  mergedRanges.forEach(range => {
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
`;