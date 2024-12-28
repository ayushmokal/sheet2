export const emailHandlerScript = `
function sendEmailWithNewSpreadsheet(ss, sheetName, recipientEmail) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    throw new Error('Sheet not found: ' + sheetName);
  }
  
  // Generate PDF of the sheet
  const pdfBlob = ss.getAs('application/pdf').setName('SQA Data - ' + sheetName + '.pdf');
  
  // Create a copy of the spreadsheet
  const spreadsheetFile = DriveApp.getFileById(ss.getId());
  const spreadsheetBlob = spreadsheetFile.getAs('application/vnd.google-apps.spreadsheet');
  spreadsheetBlob.setName('SQA Data - ' + sheetName + '.xlsx');
  
  const emailSubject = 'New SQA Data Submission - ' + sheetName;
  const emailBody = 'A new SQA data submission has been recorded.\\n\\n' +
                   'Sheet Name: ' + sheetName + '\\n' +
                   'Date: ' + new Date().toLocaleDateString() + '\\n\\n' +
                   'You can access the spreadsheet here: ' + ss.getUrl() + '#gid=' + sheet.getSheetId() + '\\n\\n' +
                   'The spreadsheet and PDF version are attached to this email.\\n\\n' +
                   'This is an automated message.';
  
  GmailApp.sendEmail(
    recipientEmail,
    emailSubject,
    emailBody,
    {
      name: 'SQA Data System',
      attachments: [pdfBlob, spreadsheetBlob]
    }
  );
  
  return true;
}
`;