export const writeFormData = (sheet: any, data: any) => {
  // Header information
  sheet.getRange('B3:H3').setValue(data.facility);
  sheet.getRange('B4:H4').setValue(data.date);
  sheet.getRange('B5:H5').setValue(data.technician);
  sheet.getRange('B6:H6').setValue(data.serialNumber);
  
  // Lower Limit Detection
  for (let i = 0; i < data.lowerLimitDetection.conc.length; i++) {
    sheet.getRange(`B${12 + i}`).setValue(data.lowerLimitDetection.conc[i]);
    sheet.getRange(`C${12 + i}`).setValue(data.lowerLimitDetection.msc[i]);
  }
  
  // Precision Level 1
  for (let i = 0; i < data.precisionLevel1.conc.length; i++) {
    sheet.getRange(`B${24 + i}`).setValue(data.precisionLevel1.conc[i]);
    sheet.getRange(`C${24 + i}`).setValue(data.precisionLevel1.motility[i]);
    sheet.getRange(`D${24 + i}`).setValue(data.precisionLevel1.morph[i]);
  }
  
  // Precision Level 2
  for (let i = 0; i < data.precisionLevel2.conc.length; i++) {
    sheet.getRange(`B${36 + i}`).setValue(data.precisionLevel2.conc[i]);
    sheet.getRange(`C${36 + i}`).setValue(data.precisionLevel2.motility[i]);
    sheet.getRange(`D${36 + i}`).setValue(data.precisionLevel2.morph[i]);
  }
  
  // Accuracy section
  for (let i = 0; i < data.accuracy.sqa.length; i++) {
    sheet.getRange(`A${48 + i}`).setValue(data.accuracy.sqa[i]);
    sheet.getRange(`B${48 + i}`).setValue(data.accuracy.manual[i]);
    sheet.getRange(`C${48 + i}`).setValue(data.accuracy.sqaMotility[i]);
    sheet.getRange(`D${48 + i}`).setValue(data.accuracy.manualMotility[i]);
    sheet.getRange(`E${48 + i}`).setValue(data.accuracy.sqaMorph[i]);
    sheet.getRange(`F${48 + i}`).setValue(data.accuracy.manualMorph[i]);
  }
  
  // QC section
  for (let i = 0; i < data.qc.level1.length; i++) {
    sheet.getRange(`B${71 + i}`).setValue(data.qc.level1[i]);
    sheet.getRange(`C${71 + i}`).setValue(data.qc.level2[i]);
  }
  
  // Calculate and write R² values
  const { calculateRValue, calculateSensitivity } = require('./googleScriptCalculations');
  
  const concRSquared = calculateRValue(
    data.accuracy.manual.map(String),
    data.accuracy.sqa.map(String)
  );
  sheet.getRange('I54').setValue(`R² = ${concRSquared.toFixed(4)}`);
  
  const motilityRSquared = calculateRValue(
    data.accuracy.manualMotility.map(String),
    data.accuracy.sqaMotility.map(String)
  );
  sheet.getRange('I55').setValue(`R² = ${motilityRSquared.toFixed(4)}`);
  
  // Calculate sensitivity based on reference cutoff
  const referenceCutoff = 4; // Reference cutoff value
  const sensitivity = calculateSensitivity(data.accuracy.sqa.map(String), referenceCutoff);
  sheet.getRange('J54').setValue(sensitivity);
};