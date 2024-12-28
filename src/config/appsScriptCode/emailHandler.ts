export const emailHandlerScript = `
function sendEmailWithSheet(spreadsheet, sheet, recipientEmail) {
  try {
    // Set full sheet as PDF export range
    const pdfOptions = {
      fitw: true,
      portrait: true,
      gridlines: false,
      printtitle: false,
      sheetnames: false,
      pagenum: 'UNDEFINED',
      attachment: true
    };
    
    // Create PDF URL with options
    const url = 'https://docs.google.com/spreadsheets/d/' + spreadsheet.getId() + '/export?' +
                'exportFormat=pdf&format=pdf' +
                '&size=letter' +
                '&portrait=true' +
                '&fitw=true' +
                '&sheetnames=false' +
                '&printtitle=false' +
                '&pagenumbers=false' +
                '&gridlines=false' +
                '&fzr=false' +
                '&gid=' + sheet.getSheetId();

    // Fetch PDF content
    const token = ScriptApp.getOAuthToken();
    const response = UrlFetchApp.fetch(url, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    
    // Create PDF blob
    const pdfBlob = response.getBlob().setName(sheet.getName() + '.pdf');
    
    // Generate Excel version
    const xlsxBlob = sheet.getAs(MimeType.MICROSOFT_EXCEL).setName(sheet.getName() + '.xlsx');
    
    const emailSubject = 'New SQA Data Submission - ' + sheet.getName();
    const emailBody = 
      'A new SQA data submission has been recorded.\\n\\n' +
      'Sheet Name: ' + sheet.getName() + '\\n' +
      'Date: ' + new Date().toLocaleDateString() + '\\n\\n' +
      'You can access the spreadsheet here: ' + spreadsheet.getUrl() + '#gid=' + sheet.getSheetId() + '\\n\\n' +
      'The submitted data sheet is attached to this email in both PDF and Excel formats.\\n\\n' +
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