import { mainScript } from './appsScriptCode/main';
import { utilsScript } from './appsScriptCode/utils';
import { emailHandlerScript } from './appsScriptCode/emailHandler';
import { dataHandlerScript } from './appsScriptCode/dataHandler';

export const APPS_SCRIPT_CODE = `
${mainScript}

${utilsScript}

${emailHandlerScript}

${dataHandlerScript}
`;