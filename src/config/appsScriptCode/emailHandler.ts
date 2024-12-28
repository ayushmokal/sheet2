export const emailHandlerScript = `
function sendEmailWithSheet(spreadsheet, sheet, recipientEmail) {
  try {
    // Get the spreadsheet ID and sheet ID
    const ssId = spreadsheet.getId();
    const sheetId = sheet.getSheetId();
    
    // Create PDF URL
    const pdfUrl = 'https://docs.google.com/spreadsheets/d/' + ssId + '/export?' +
                  'exportFormat=pdf&' +
                  'format=pdf&' +
                  'size=letter&' +
                  'portrait=true&' +
                  'fitw=true&' +
                  'sheetnames=false&' +
                  'printtitle=false&' +
                  'pagenumbers=false&' +
                  'gridlines=false&' +
                  'fzr=false&' +
                  'gid=' + sheetId;

    // Fetch PDF content
    const token = ScriptApp.getOAuthToken();
    const response = UrlFetchApp.fetch(pdfUrl, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    
    // Create PDF blob
    const pdfBlob = response.getBlob().setName(sheet.getName() + '.pdf');
    
    // Create Excel blob
    const xlsxBlob = sheet.getAs(MimeType.MICROSOFT_EXCEL).setName(sheet.getName() + '.xlsx');
    
    // Send email with both attachments
    const emailSubject = 'New SQA Data Submission - ' + sheet.getName();
    const emailBody = 
      'A new SQA data submission has been recorded.\\n\\n' +
      'Sheet Name: ' + sheet.getName() + '\\n' +
      'Date: ' + new Date().toLocaleDateString() + '\\n\\n' +
      'You can access the spreadsheet here: ' + spreadsheet.getUrl() + '#gid=' + sheetId + '\\n\\n' +
      'The submitted data sheet is attached in both PDF and Excel formats.\\n\\n' +
      'This is an automated message.';
    
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