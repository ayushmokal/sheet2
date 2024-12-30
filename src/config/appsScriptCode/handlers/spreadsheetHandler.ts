export const spreadsheetHandlerScript = `
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
`;