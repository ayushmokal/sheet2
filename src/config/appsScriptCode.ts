import { mainScript } from './appsScriptCode/main';
import { emailHandlerScript } from './appsScriptCode/handlers/emailHandler';
import { pdfHandlerScript } from './appsScriptCode/handlers/pdfHandler';
import { dataHandlerScript } from './appsScriptCode/handlers/dataHandler';

export const APPS_SCRIPT_CODE = `
${mainScript}

${emailHandlerScript}

${pdfHandlerScript}

${dataHandlerScript}
`;