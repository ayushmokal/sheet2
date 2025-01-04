export const pdfHandlerScript = `
function generateAndSavePDF(ss, fileName, data) {
  const pdfOptions = {
    fitw: true,
    portrait: true,
    size: 'A4',
    gridlines: false
  };
  
  const pdfBlob = ss.getAs(MimeType.PDF).setName(\`\${fileName}.pdf\`);
  const pdfFile = DriveApp.getFolderById('1anEzYB_Is4SW_xbiSxR4UJRz2SmhABOs').createFile(pdfBlob);
  
  return pdfFile.getUrl();
}`;