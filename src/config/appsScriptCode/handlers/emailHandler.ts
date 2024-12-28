export const emailHandlerScript = `
function sendEmailWithSpreadsheet(spreadsheet, recipientEmail) {
  try {
    // Generate PDF of the spreadsheet
    const pdfBlob = spreadsheet.getAs('application/pdf')
      .setName('SQA Data.pdf');
    
    // Get the spreadsheet URL
    const spreadsheetUrl = spreadsheet.getUrl();
    
    const emailSubject = 'SQA Data Submission';
    const emailBody = 'Please find attached the SQA data submission PDF.\\n\\n' +
                     'You can access the spreadsheet directly here: ' + spreadsheetUrl + '\\n\\n' +
                     'This is an automated message.';
    
    GmailApp.sendEmail(
      recipientEmail,
      emailSubject,
      emailBody,
      {
        attachments: [pdfBlob],
        name: 'SQA Data System'
      }
    );
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email: ' + error.message);
  }
}
`;