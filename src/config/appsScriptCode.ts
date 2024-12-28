import { mainScript } from './appsScriptCode/main';
import { utilsScript } from './appsScriptCode/utils';
import { emailHandlerScript } from './appsScriptCode/emailHandler';
import { sheetWriterScript } from './appsScriptCode/sheetWriter';

export const APPS_SCRIPT_CODE = `
${mainScript}

${utilsScript}

${emailHandlerScript}

${sheetWriterScript}
`;