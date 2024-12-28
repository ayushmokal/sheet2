export const emailHandlerScript = `
function sendEmailWithNewSpreadsheet(ss, sheetName, recipientEmail) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    throw new Error('Sheet not found: ' + sheetName);
  }

  // Get the spreadsheet file
  const file = DriveApp.getFileById(ss.getId());
  
  // Create PDF and Excel versions of just this sheet
  const pdfBlob = sheet.getAs(MimeType.PDF).setName('SQA Data - ' + sheetName + '.pdf');
  const xlsxBlob = sheet.getAs(MimeType.MICROSOFT_EXCEL).setName('SQA Data - ' + sheetName + '.xlsx');
  
  const emailSubject = 'New SQA Data Submission - ' + sheetName;
  const emailBody = 'A new SQA data submission has been recorded.\\n\\n' +
                   'Sheet Name: ' + sheetName + '\\n' +
                   'Date: ' + new Date().toLocaleDateString() + '\\n\\n' +
                   'The data is attached in both PDF and Excel formats.\\n\\n' +
                   'This is an automated message.';
  
  // Send email with both attachments
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