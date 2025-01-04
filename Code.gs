const TEMPLATE_SPREADSHEET_ID = '1baU2-peCdvKUvbJ7x_vbQsA8koQEN7VAbBGce92CCF0';
const ADMIN_EMAIL = 'ayushmokal13@gmail.com';
const PDF_FOLDER_ID = '1anEzYB_Is4SW_xbiSxR4UJRz2SmhABOs';
const EMAIL_LOG_SPREADSHEET_ID = '1n_TZcqcW3CyPG9QfAv4E9wDhmiT9vm0lAnzHGjd6yV4';

function doGet(e) {
  const params = e.parameter;
  const callback = params.callback;
  const action = params.action;
  const data = params.data ? JSON.parse(decodeURIComponent(params.data)) : null;
  
  let result;
  
  try {
    switch(action) {
      case 'submit':
        if (!data) {
          throw new Error('No data provided');
        }
        result = handleSubmit(data);
        break;
      case 'createCopy':
        result = createSpreadsheetCopy();
        break;
      default:
        throw new Error('Invalid action');
    }
    
    return ContentService.createTextOutput(callback + '(' + JSON.stringify(result) + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
      
  } catch (error) {
    console.error('Error in doGet:', error);
    const errorResponse = {
      status: 'error',
      message: error.message
    };
    
    return ContentService.createTextOutput(callback + '(' + JSON.stringify(errorResponse) + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
}

function handleSubmit(data) {
  console.log("Starting handleSubmit with data:", data);
  
  try {
    const templateFile = DriveApp.getFileById(TEMPLATE_SPREADSHEET_ID);
    const dateObj = new Date(data.date);
    const formattedDate = Utilities.formatDate(dateObj, Session.getScriptTimeZone(), "yyyy-MM-dd");
    const sanitizedFacility = data.facility.replace(/[^a-zA-Z0-9]/g, '');
    const cleanSerialNumber = data.serialNumber.trim();
    
    const fileName = formattedDate + '_' + cleanSerialNumber + '_' + sanitizedFacility;
    const newFile = templateFile.makeCopy(fileName);
    const ss = SpreadsheetApp.openById(newFile.getId());
    const sheet = ss.getSheets()[0];
    
    writeFacilityInfo(sheet, data);
    writeLinearityData(sheet, data);
    writePrecisionData(sheet, data);
    writeAccuracyData(sheet, data);
    writeLiveSamplePrecision(sheet, data);
    
    SpreadsheetApp.flush();
    
    const pdfBlob = ss.getAs(MimeType.PDF).setName(fileName + '.pdf');
    const pdfFile = DriveApp.getFolderById(PDF_FOLDER_ID).createFile(pdfBlob);
    
    sendAdminNotification(data, ss.getUrl(), pdfFile.getUrl());
    
    newFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT);
    
    return {
      status: 'success',
      message: 'Data submitted successfully',
      spreadsheetUrl: ss.getUrl(),
      pdfUrl: pdfFile.getUrl()
    };
    
  } catch (error) {
    console.error("Error in handleSubmit:", error);
    throw error;
  }
}

function sendAdminNotification(data, spreadsheetUrl, pdfUrl) {
  const subject = 'New SQA Data Submission - ' + data.facility;
  const body = \`New SQA data submission received:
    
Facility: ${data.facility}
Date: ${data.date}
Serial Number: ${data.serialNumber}
Batch ID: ${data.batchId}
Client Email: ${data.emailTo}
Client Phone: ${data.phone}

Spreadsheet: ${spreadsheetUrl}
PDF: ${pdfUrl}\`;

  GmailApp.sendEmail(ADMIN_EMAIL, subject, body);
  logEmailSend(data, spreadsheetUrl, pdfUrl);
}

function logEmailSend(data, spreadsheetUrl, pdfUrl) {
  try {
    const logSheet = SpreadsheetApp.openById(EMAIL_LOG_SPREADSHEET_ID).getActiveSheet();
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
}