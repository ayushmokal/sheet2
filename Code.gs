const TEMPLATE_SPREADSHEET_ID = '1baU2-peCdvKUvbJ7x_vbQsA8koQEN7VAbBGce92CCF0';
const SUBMISSION_RECORD_SHEET_ID = '1n_TZcqcW3CyPG9QfAv4E9wDhmiT9vm0lAnzHGjd6yV4';
const PDF_FOLDER_ID = '1anEzYB_Is4SW_xbiSxR4UJRz2SmhABOs';
const ADMIN_EMAIL = 'ayushmokal19@gmail.com';

function doGet(e) {
  const params = e.parameter;
  const callback = params.callback;
  const action = params.action;
  const data = params.data ? JSON.parse(decodeURIComponent(params.data)) : null;
  
  let result;
  
  try {
    if (action === 'submit') {
      if (!data) {
        throw new Error('No data provided');
      }
      result = handleSubmit(data);
    } else {
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