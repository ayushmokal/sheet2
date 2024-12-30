const TEMPLATE_SPREADSHEET_ID = '19LpAqJxn_XNFlxFRcV0oZiq0d4L4zQLQbj7CRtNqW9g';

function doGet(e) {
  const params = e.parameter;
  const callback = params.callback;
  const action = params.action;
  const data = params.data ? JSON.parse(decodeURIComponent(params.data)) : null;
  
  let result;
  
  try {
    switch (action) {
      case 'createCopy':
        result = createSpreadsheetCopy();
        break;
      case 'submit':
        if (!data || !data.spreadsheetId) {
          throw new Error('No data or spreadsheetId provided');
        }
        result = handleSubmit(data);
        break;
      case 'sendEmail':
        if (!data || !data.spreadsheetId || !data.emailTo) {
          throw new Error('Missing required data for sending email');
        }
        const ss = SpreadsheetApp.openById(data.spreadsheetId);
        result = sendEmailWithSpreadsheet(ss, data.emailTo);
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

function createSpreadsheetCopy() {
  try {
    const templateFile = DriveApp.getFileById(TEMPLATE_SPREADSHEET_ID);
    const newFile = templateFile.makeCopy('SQA Data Collection Form (Copy)');
    const newSpreadsheet = SpreadsheetApp.openById(newFile.getId());
    
    // Set sharing permissions to anyone with link can edit
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

function handleSubmit(data) {
  console.log("Starting handleSubmit with data:", data);
  
  if (!data) {
    throw new Error('No data provided');
  }

  const ss = SpreadsheetApp.openById(data.spreadsheetId);
  console.log("Opened spreadsheet");
  
  const templateSheet = ss.getSheetByName(data.sheetName);
  if (!templateSheet) {
    throw new Error('Template sheet not found: ' + data.sheetName);
  }
  
  const newSheetName = generateUniqueSheetName(ss, data);
  const newSheet = templateSheet.copyTo(ss);
  newSheet.setName(newSheetName);
  console.log("Created new sheet:", newSheetName);

  try {
    writeFacilityInfo(newSheet, data);
    writeLinearityData(newSheet, data);
    writePrecisionData(newSheet, data);
    writeAccuracyData(newSheet, data);
    writeLiveSamplePrecision(newSheet, data);

    return {
      status: 'success',
      message: 'Data submitted successfully',
      sheetName: newSheetName
    };
  } catch (error) {
    console.error("Error writing data:", error);
    try {
      ss.deleteSheet(newSheet);
    } catch (e) {
      console.error("Error deleting sheet after failure:", e);
    }
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
  // Write SQA values
  for (let i = 0; i < data.linearity.sqa.length; i++) {
    sheet.getRange('D' + (12 + i)).setValue(data.linearity.sqa[i]);
  }
  console.log("Wrote Linearity data");
}

function writePrecisionData(sheet, data) {
  // Sample #1
  for (let i = 0; i < data.precision.sample1.automated.length; i++) {
    sheet.getRange('C' + (63 + i)).setValue(data.precision.sample1.automated[i]);
  }
  for (let i = 0; i < data.precision.sample1.manual.length; i++) {
    sheet.getRange('E' + (63 + i)).setValue(data.precision.sample1.manual[i]);
  }

  // Sample #2
  for (let i = 0; i < data.precision.sample2.automated.length; i++) {
    sheet.getRange('C' + (74 + i)).setValue(data.precision.sample2.automated[i]);
  }
  for (let i = 0; i < data.precision.sample2.manual.length; i++) {
    sheet.getRange('E' + (74 + i)).setValue(data.precision.sample2.manual[i]);
  }

  // Sample #3
  for (let i = 0; i < data.precision.sample3.automated.length; i++) {
    sheet.getRange('C' + (85 + i)).setValue(data.precision.sample3.automated[i]);
  }
  for (let i = 0; i < data.precision.sample3.manual.length; i++) {
    sheet.getRange('E' + (85 + i)).setValue(data.precision.sample3.manual[i]);
  }

  // Sample #4
  for (let i = 0; i < data.precision.sample4.automated.length; i++) {
    sheet.getRange('C' + (96 + i)).setValue(data.precision.sample4.automated[i]);
  }
  for (let i = 0; i < data.precision.sample4.manual.length; i++) {
    sheet.getRange('E' + (96 + i)).setValue(data.precision.sample4.manual[i]);
  }

  // Sample #5
  for (let i = 0; i < data.precision.sample5.automated.length; i++) {
    sheet.getRange('C' + (107 + i)).setValue(data.precision.sample5.automated[i]);
  }
  for (let i = 0; i < data.precision.sample5.manual.length; i++) {
    sheet.getRange('E' + (107 + i)).setValue(data.precision.sample5.manual[i]);
  }
  
  console.log("Wrote Precision data");
}

function writeAccuracyData(sheet, data) {
  // Write Manual values
  for (let i = 0; i < data.accuracy.manual.length; i++) {
    sheet.getRange('C' + (119 + i)).setValue(data.accuracy.manual[i]);
  }
  console.log("Wrote Accuracy data");
}

function writeLiveSamplePrecision(sheet, data) {
  // First set
  for (let i = 0; i < data.liveSamplePrecision.set1.conc.length; i++) {
    sheet.getRange('C' + (155 + i)).setValue(data.liveSamplePrecision.set1.conc[i]);
    sheet.getRange('D' + (155 + i)).setValue(data.liveSamplePrecision.set1.motility[i]);
    sheet.getRange('E' + (155 + i)).setValue(data.liveSamplePrecision.set1.morphology[i]);
  }

  // Second set
  for (let i = 0; i < data.liveSamplePrecision.set2.conc.length; i++) {
    sheet.getRange('C' + (165 + i)).setValue(data.liveSamplePrecision.set2.conc[i]);
    sheet.getRange('D' + (165 + i)).setValue(data.liveSamplePrecision.set2.motility[i]);
    sheet.getRange('E' + (165 + i)).setValue(data.liveSamplePrecision.set2.morphology[i]);
  }
  
  console.log("Wrote Live Sample Precision data");
}

function generateUniqueSheetName(ss, data) {
  const date = new Date(data.date);
  const formattedDate = Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd");
  const sanitizedFacility = data.facility.replace(/[^a-zA-Z0-9]/g, '');
  const cleanSerialNumber = data.serialNumber.trim();
  
  const baseSheetName = formattedDate + '_' + cleanSerialNumber + '_' + sanitizedFacility;
  let sheetName = baseSheetName;
  let counter = 1;
  
  while (ss.getSheetByName(sheetName)) {
    sheetName = baseSheetName + '_' + counter;
    counter++;
  }
  
  return sheetName;
}

function sendEmailWithSpreadsheet(spreadsheet, recipientEmail) {
  try {
    const spreadsheetUrl = spreadsheet.getUrl();
    
    const emailSubject = 'SQA Data Submission';
    const emailBody = 'Please find attached the SQA data submission spreadsheet.\n\n' +
                     'You can access the spreadsheet directly here: ' + spreadsheetUrl + '\n\n' +
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
}