import { spreadsheetHandlerScript } from './handlers/spreadsheetHandler';
import { pdfHandlerScript } from './handlers/pdfHandler';
import { emailHandlerScript } from './handlers/emailHandler';
import { dataHandlerScript } from './handlers/dataHandler';

export const mainScript = `
const TEMPLATE_SPREADSHEET_ID = '1baU2-peCdvKUvbJ7x_vbQsA8koQEN7VAbBGce92CCF0';
const SUBMISSION_RECORD_SHEET_ID = '1n_TZcqcW3CyPG9QfAv4E9wDhmiT9vm0lAnzHGjd6yV4';

${spreadsheetHandlerScript}

${dataHandlerScript}

${pdfHandlerScript}

${emailHandlerScript}

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
    
    // Generate PDF and send email
    const pdfUrl = generateAndSavePDF(ss, newSheetName, data);
    sendAdminNotification(data, ss.getUrl(), pdfUrl);
    
    logSubmission(data);

    return {
      status: 'success',
      message: 'Data submitted successfully',
      sheetName: newSheetName,
      pdfUrl: pdfUrl
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

function logSubmission(data) {
  try {
    const logSheet = SpreadsheetApp.openById(SUBMISSION_RECORD_SHEET_ID).getActiveSheet();
    const timestamp = new Date();
    
    logSheet.appendRow([
      timestamp,
      data.facility,
      data.date,
      data.serialNumber,
      data.batchId,
      data.emailTo,
      data.phone,
      data.spreadsheetUrl,
      data.pdfUrl
    ]);
    
    console.log("Submission logged successfully");
  } catch (error) {
    console.error("Error logging submission:", error);
  }
}`;