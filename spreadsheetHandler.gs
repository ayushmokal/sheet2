const createSpreadsheetCopy = () => {
  try {
    // Open the template spreadsheet
    const templateSpreadsheet = SpreadsheetApp.openById(TEMPLATE_SPREADSHEET_ID);
    const templateSheet = templateSpreadsheet.getSheetByName(TEMPLATE_SHEET_NAME);
    
    if (!templateSheet) {
      console.error(`Template sheet "${TEMPLATE_SHEET_NAME}" not found in source spreadsheet`);
      throw new Error(`Template sheet "${TEMPLATE_SHEET_NAME}" not found in the template spreadsheet`);
    }
    
    // Create a new spreadsheet
    const newSpreadsheet = SpreadsheetApp.create('SQA Data Collection Form (Copy)');
    
    // Get the default sheet and rename it to Results
    const resultsSheet = newSpreadsheet.getSheets()[0];
    resultsSheet.setName(RESULTS_SHEET_NAME);
    
    // Copy the template sheet to the new spreadsheet
    templateSheet.copyTo(newSpreadsheet).setName(TEMPLATE_SHEET_NAME);
    
    // Set sharing permissions
    const newFile = DriveApp.getFileById(newSpreadsheet.getId());
    newFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT);
    
    console.log("Successfully created spreadsheet copy with template");
    
    return {
      status: 'success',
      spreadsheetId: newSpreadsheet.getId(),
      spreadsheetUrl: newFile.getUrl()
    };
  } catch (error) {
    console.error('Error in createSpreadsheetCopy:', error);
    throw new Error('Failed to create spreadsheet copy: ' + error.message);
  }
}