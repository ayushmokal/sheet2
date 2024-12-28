import { mainScript } from './appsScriptCode/main';
import { emailHandlerScript } from './appsScriptCode/handlers/emailHandler';
import { spreadsheetHandlerScript } from './appsScriptCode/handlers/spreadsheetHandler';
import { dataHandlerScript } from './appsScriptCode/handlers/dataHandler';

export const APPS_SCRIPT_CODE = `
${mainScript}

${emailHandlerScript}

${spreadsheetHandlerScript}

${dataHandlerScript}
`;