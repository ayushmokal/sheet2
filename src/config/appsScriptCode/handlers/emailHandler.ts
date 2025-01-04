export const emailHandlerScript = `
function sendAdminNotification(data, spreadsheetUrl, pdfUrl) {
  const subject = 'New SQA Data Submission - ' + data.facility;
  const body = \`New SQA data submission received:
    
Facility: \${data.facility}
Date: \${data.date}
Serial Number: \${data.serialNumber}
Batch ID: \${data.batchId}
Client Email: \${data.emailTo}
Client Phone: \${data.phone}

Spreadsheet: \${spreadsheetUrl}
PDF: \${pdfUrl}\`;

  GmailApp.sendEmail('ayushmokal19@gmail.com', subject, body);
  logEmailSend(data, spreadsheetUrl, pdfUrl);
}

function logEmailSend(data, spreadsheetUrl, pdfUrl) {
  try {
    const logSheet = SpreadsheetApp.openById('1n_TZcqcW3CyPG9QfAv4E9wDhmiT9vm0lAnzHGjd6yV4').getActiveSheet();
    const timestamp = new Date();
    
    logSheet.appendRow([
      timestamp,
      data.facility,
      data.date,
      data.serialNumber,
      data.batchId,
      data.emailTo,
      data.phone,
      spreadsheetUrl,
      pdfUrl
    ]);
    
    console.log("Email send logged successfully");
  } catch (error) {
    console.error("Error logging email send:", error);
  }
}`;