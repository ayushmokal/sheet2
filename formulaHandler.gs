function setFormulas(sheet) {
  setLowerLimitFormulas(sheet);
  setPrecisionFormulas(sheet, 24, 29); // Level 1
  setPrecisionFormulas(sheet, 36, 41); // Level 2
  setAccuracyFormulas(sheet);
}

function setLowerLimitFormulas(sheet) {
  sheet.getRange('B17').setFormula('=AVERAGE(B12:B16)');
  sheet.getRange('C17').setFormula('=AVERAGE(C12:C16)');
  sheet.getRange('B18').setFormula('=IF(B17>0,(STDEV(B12:B16)/B17*100),0)');
  sheet.getRange('C18').setFormula('=IF(C17>0,(STDEV(C12:C16)/C17*100),0)');
}

function setPrecisionFormulas(sheet, startRow, avgRow) {
  const endRow = startRow + 4;
  sheet.getRange(`B${avgRow}`).setFormula(`=AVERAGE(B${startRow}:B${endRow})`);
  sheet.getRange(`C${avgRow}`).setFormula(`=AVERAGE(C${startRow}:C${endRow})`);
  sheet.getRange(`D${avgRow}`).setFormula(`=AVERAGE(D${startRow}:D${endRow})`);
  
  const cvRow = avgRow + 1;
  sheet.getRange(`B${cvRow}`).setFormula(`=IF(B${avgRow}>0,(STDEV(B${startRow}:B${endRow})/B${avgRow}*100),0)`);
  sheet.getRange(`C${cvRow}`).setFormula(`=IF(C${avgRow}>0,(STDEV(C${startRow}:C${endRow})/C${avgRow}*100),0)`);
  sheet.getRange(`D${cvRow}`).setFormula(`=IF(D${avgRow}>0,(STDEV(D${startRow}:D${endRow})/D${avgRow}*100),0)`);
}

function setAccuracyFormulas(sheet) {
  sheet.getRange('L48').setFormula('=COUNTIF(G48:J52,"TP")');
  sheet.getRange('L49').setFormula('=COUNTIF(G48:J52,"TN")');
  sheet.getRange('L50').setFormula('=COUNTIF(G48:J52,"FP")');
  sheet.getRange('L51').setFormula('=COUNTIF(G48:J52,"FN")');
  sheet.getRange('K54').setFormula('=L48/(L48+L51)');
  sheet.getRange('K56').setFormula('=L49/(L49+L50)');
}