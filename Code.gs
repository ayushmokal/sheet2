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

function writeFacilityInfo(sheet, data) {
  sheet.getRange('C3:I3').setValue(data.facility);
  sheet.getRange('C4:I4').setValue(data.serialNumber);
  sheet.getRange('C5:I5').setValue(data.date);
  sheet.getRange('C6:I6').setValue(data.batchId);
  console.log("Wrote facility info");
}

function writeLinearityData(sheet, data) {
  for (let i = 0; i < data.linearity.sqa.length; i++) {
    const row = 12 + i;
    if (row <= 17) {
      sheet.getRange('D' + row).setValue(data.linearity.sqa[i]);
    }
  }
  console.log("Wrote Linearity data");
}

function writePrecisionData(sheet, data) {
  // Sample #1
  for (let i = 0; i < data.precision.sample1.automated.length; i++) {
    const row = 63 + i;
    if (row <= 67) {
      sheet.getRange('C' + row).setValue(data.precision.sample1.automated[i]);
    }
  }
  for (let i = 0; i < data.precision.sample1.manual.length; i++) {
    const row = 63 + i;
    if (row <= 64) {
      sheet.getRange('E' + row).setValue(data.precision.sample1.manual[i]);
    }
  }

  // Sample #2
  for (let i = 0; i < data.precision.sample2.automated.length; i++) {
    const row = 74 + i;
    if (row <= 78) {
      sheet.getRange('C' + row).setValue(data.precision.sample2.automated[i]);
    }
  }
  for (let i = 0; i < data.precision.sample2.manual.length; i++) {
    const row = 74 + i;
    if (row <= 75) {
      sheet.getRange('E' + row).setValue(data.precision.sample2.manual[i]);
    }
  }

  // Sample #3
  for (let i = 0; i < data.precision.sample3.automated.length; i++) {
    const row = 85 + i;
    if (row <= 89) {
      sheet.getRange('C' + row).setValue(data.precision.sample3.automated[i]);
    }
  }
  for (let i = 0; i < data.precision.sample3.manual.length; i++) {
    const row = 85 + i;
    if (row <= 86) {
      sheet.getRange('E' + row).setValue(data.precision.sample3.manual[i]);
    }
  }

  // Sample #4
  for (let i = 0; i < data.precision.sample4.automated.length; i++) {
    const row = 96 + i;
    if (row <= 100) {
      sheet.getRange('C' + row).setValue(data.precision.sample4.automated[i]);
    }
  }
  for (let i = 0; i < data.precision.sample4.manual.length; i++) {
    const row = 96 + i;
    if (row <= 97) {
      sheet.getRange('E' + row).setValue(data.precision.sample4.manual[i]);
    }
  }

  // Sample #5
  for (let i = 0; i < data.precision.sample5.automated.length; i++) {
    const row = 107 + i;
    if (row <= 111) {
      sheet.getRange('C' + row).setValue(data.precision.sample5.automated[i]);
    }
  }
  for (let i = 0; i < data.precision.sample5.manual.length; i++) {
    const row = 107 + i;
    if (row <= 108) {
      sheet.getRange('E' + row).setValue(data.precision.sample5.manual[i]);
    }
  }

  console.log("Wrote Precision data");
}

function writeAccuracyData(sheet, data) {
  for (let i = 0; i < data.accuracy.manual.length; i++) {
    const row = 119 + i;
    if (row <= 123) {
      sheet.getRange('C' + row).setValue(data.accuracy.manual[i]);
    }
  }
  console.log("Wrote Accuracy data");
}

function writeLiveSamplePrecision(sheet, data) {
  // First set
  for (let i = 0; i < data.liveSamplePrecision.set1.conc.length; i++) {
    const row = 155 + i;
    if (row <= 159) {
      sheet.getRange('C' + row).setValue(data.liveSamplePrecision.set1.conc[i]);
      sheet.getRange('D' + row).setValue(data.liveSamplePrecision.set1.motility[i]);
      sheet.getRange('E' + row).setValue(data.liveSamplePrecision.set1.morphology[i]);
    }
  }

  // Second set
  for (let i = 0; i < data.liveSamplePrecision.set2.conc.length; i++) {
    const row = 165 + i;
    if (row <= 169) {
      sheet.getRange('C' + row).setValue(data.liveSamplePrecision.set2.conc[i]);
      sheet.getRange('D' + row).setValue(data.liveSamplePrecision.set2.motility[i]);
      sheet.getRange('E' + row).setValue(data.liveSamplePrecision.set2.morphology[i]);
    }
  }
  
  console.log("Wrote Live Sample Precision data");
}

function sendAdminNotification(data, spreadsheetUrl, pdfUrl) {
  const subject = 'New SQA Data Submission - ' + data.facility;
  const body = `New SQA data submission received:
    
Facility: ${data.facility}
Date: ${data.date}
Serial Number: ${data.serialNumber}
Batch ID: ${data.batchId}
Client Email: ${data.emailTo}
Client Phone: ${data.phone}

Spreadsheet: ${spreadsheetUrl}
PDF: ${pdfUrl}`;

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

function createSpreadsheetCopy() {
  try {
    const templateFile = DriveApp.getFileById(TEMPLATE_SPREADSHEET_ID);
    const newFile = templateFile.makeCopy('SQA Data Collection Form (Copy)');
    const newSpreadsheet = SpreadsheetApp.openById(newFile.getId());
    
    newFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT);
    
    return {
      status: 'success',
      spreadsheetId: newFile.getId(),
      spreadsheetUrl: newSpreadsheet.getUrl()
    };
  } catch (error) {
    console.error('Error in createSpreadsheetCopy:', error);
    throw new Error('Failed to create spreadsheet copy: ' + error.message);
  }
}