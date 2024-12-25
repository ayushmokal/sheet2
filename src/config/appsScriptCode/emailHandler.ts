export const emailHandlerScript = `
function sendEmailWithNewSpreadsheet(originalSpreadsheet, sheetName, recipientEmail) {
  const sheet = originalSpreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    throw new Error('Sheet not found: ' + sheetName);
  }
  
  // Generate PDF from the original spreadsheet
  const pdfBlob = originalSpreadsheet.getAs('application/pdf').setName('SQA Data - ' + sheetName + '.pdf');
  
  // Share the spreadsheet with the recipient
  originalSpreadsheet.addEditor(recipientEmail);
  
  const emailSubject = 'New SQA Data Submission - ' + sheetName;
  const emailBody = 'A new SQA data submission has been recorded.\\n\\n' +
                   'Sheet Name: ' + sheetName + '\\n' +
                   'Date: ' + new Date().toLocaleDateString() + '\\n\\n' +
                   'You can access the spreadsheet here: ' + originalSpreadsheet.getUrl() + '\\n\\n' +
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