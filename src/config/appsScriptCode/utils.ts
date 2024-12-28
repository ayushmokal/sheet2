export const utilsScript = `
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
  
  const baseSheetName = \`\${formattedDate}_\${cleanSerialNumber}_\${sanitizedFacility}\`;
  
  // Check if sheet name already exists
  const existingSheets = spreadsheet.getSheets().map(sheet => sheet.getName());
  if (existingSheets.includes(baseSheetName)) {
    // If exists, append a number
    let counter = 1;
    while (existingSheets.includes(\`\${baseSheetName}_\${counter}\`)) {
      counter++;
    }
    return \`\${baseSheetName}_\${counter}\`;
  }
  
  return baseSheetName;
}

function copySheetFormatting(sourceRange, targetRange, originalSheet, targetSheet) {
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
    targetSheet.getRange(row, col, numRows, numCols).merge();
  });
  
  // Copy conditional formatting rules
  const rules = originalSheet.getConditionalFormatRules();
  targetSheet.setConditionalFormatRules(rules);
}
`;