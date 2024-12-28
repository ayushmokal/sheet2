export const emailHandlerScript = `
function sendEmailWithNewSpreadsheet(ss, sheetName, recipientEmail) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    throw new Error('Sheet not found: ' + sheetName);
  }
  
  // Create a copy of the spreadsheet
  const spreadsheetFile = DriveApp.getFileById(ss.getId());
  
  const emailSubject = 'SQA Data Submission - ' + sheetName;
  const emailBody = 'Please find attached the SQA data submission.\\n\\n' +
                   'You can access the spreadsheet directly here: ' + ss.getUrl() + '#gid=' + sheet.getSheetId() + '\\n\\n' +
                   'This is an automated message.';
  
  GmailApp.sendEmail(
    recipientEmail,
    emailSubject,
    emailBody,
    {
      name: 'SQA Data System',
      attachments: [spreadsheetFile]
    }
  );
  
  return true;
}
`;