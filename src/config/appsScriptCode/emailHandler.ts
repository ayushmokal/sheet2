export const emailHandlerScript = `
function sendEmailWithSheet(spreadsheet, sheet, recipientEmail) {
  try {
    // Generate PDF of the specific sheet
    const pdfBlob = sheet.getAs(MimeType.PDF).setName(sheet.getName() + '.pdf');
    
    // Generate Excel version of the specific sheet
    const xlsxBlob = sheet.getAs(MimeType.MICROSOFT_EXCEL).setName(sheet.getName() + '.xlsx');
    
    const emailSubject = 'New SQA Data Submission - ' + sheet.getName();
    const emailBody = 
      'A new SQA data submission has been recorded.\\n\\n' +
      'Sheet Name: ' + sheet.getName() + '\\n' +
      'Date: ' + new Date().toLocaleDateString() + '\\n\\n' +
      'You can access the spreadsheet here: ' + spreadsheet.getUrl() + '#gid=' + sheet.getSheetId() + '\\n\\n' +
      'This is an automated message.';
    
    // Send email with both PDF and Excel attachments
    GmailApp.sendEmail(
      recipientEmail,
      emailSubject,
      emailBody,
      {
        name: 'SQA Data System',
        attachments: [pdfBlob, xlsxBlob]
      }
    );
    
    console.log("Email sent successfully to:", recipientEmail);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
`;