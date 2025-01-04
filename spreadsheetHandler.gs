function handleSubmit(data) {
  console.log("Starting handleSubmit with data:", data);
  
  try {
    const fileName = generateFileName(data);
    const newSpreadsheet = createNewSpreadsheet(fileName);
    const sheet = newSpreadsheet.getSheets()[0];
    
    writeAllData(sheet, data);
    setFormulas(sheet);
    
    // Ensure all calculations are completed
    SpreadsheetApp.flush();
    
    const pdfFile = generatePDF(newSpreadsheet, fileName);
    sendAdminNotification(data, newSpreadsheet.getUrl(), pdfFile.getUrl());
    
    return {
      status: 'success',
      message: 'Data submitted successfully'
    };
    
  } catch (error) {
    console.error("Error in handleSubmit:", error);
    throw error;
  }
}

function generateFileName(data) {
  const dateObj = new Date(data.date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  
  const sanitizedFacility = data.facility.replace(/[^a-zA-Z0-9]/g, '');
  const cleanSerialNumber = data.serialNumber.trim().replace(/[^a-zA-Z0-9]/g, '');
  
  return `${formattedDate}-${cleanSerialNumber}-${sanitizedFacility}`;
}

function createNewSpreadsheet(fileName) {
  const templateFile = DriveApp.getFileById(TEMPLATE_SPREADSHEET_ID);
  const newFile = templateFile.makeCopy(fileName);
  return SpreadsheetApp.openById(newFile.getId());
}

function writeAllData(sheet, data) {
  writeFacilityInfo(sheet, data);
  writeLowerLimitDetection(sheet, data);
  writePrecisionData(sheet, data);
  writeAccuracyData(sheet, data);
  writeMorphGradeFinal(sheet, data);
  writeQCData(sheet, data);
}