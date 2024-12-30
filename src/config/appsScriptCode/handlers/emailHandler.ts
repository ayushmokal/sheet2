export const emailHandlerScript = `
function sendEmailWithSpreadsheet(spreadsheet, recipientEmail) {
  try {
    const spreadsheetUrl = spreadsheet.getUrl();
    
    const emailSubject = 'SQA Data Submission';
    const emailBody = 'Please find attached the SQA data submission spreadsheet.\\n\\n' +
                     'You can access the spreadsheet directly here: ' + spreadsheetUrl + '\\n\\n' +
                     'This is an automated message.';
    
    const spreadsheetFile = DriveApp.getFileById(spreadsheet.getId());
    
    GmailApp.sendEmail(
      recipientEmail,
      emailSubject,
      emailBody,
      {
        attachments: [spreadsheetFile],
        name: 'SQA Data System'
      }
    );
    
    return {
      status: 'success',
      message: 'Email sent successfully'
    };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email: ' + error.message);
  }
}`;