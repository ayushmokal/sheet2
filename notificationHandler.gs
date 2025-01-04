function generatePDF(spreadsheet, fileName) {
  const pdfOptions = {
    fitw: true,
    portrait: true,
    size: 'A4',
    gridlines: false
  };
  
  const pdfBlob = spreadsheet.getAs(MimeType.PDF).setName(`${fileName}.pdf`);
  return DriveApp.getFolderById(PDF_FOLDER_ID).createFile(pdfBlob);
}

function sendAdminNotification(data, spreadsheetUrl, pdfUrl) {
  const subject = 'New SQA Data Submission - ' + data.facility;
  const body = `New SQA data submission received:
    
Facility: ${data.facility}
Date: ${data.date}
Technician: ${data.technician}
Serial Number: ${data.serialNumber}
Client Email: ${data.emailTo}
Client Phone: ${data.phone}

Spreadsheet: ${spreadsheetUrl}
PDF: ${pdfUrl}`;

  GmailApp.sendEmail(ADMIN_EMAIL, subject, body);
  logSubmission(data, spreadsheetUrl, pdfUrl);
}

function logSubmission(data, spreadsheetUrl, pdfUrl) {
  try {
    const logSheet = SpreadsheetApp.openById(SUBMISSION_RECORD_SHEET_ID).getActiveSheet();
    const timestamp = new Date();
    
    logSheet.appendRow([
      timestamp,
      data.facility,
      data.date,
      data.technician,
      data.serialNumber,
      data.emailTo,
      data.phone,
      spreadsheetUrl,
      pdfUrl
    ]);
    
    console.log("Submission logged successfully");
  } catch (error) {
    console.error("Error logging submission:", error);
  }
}