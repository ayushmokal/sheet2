export interface FormData {
  facility: string;
  date: string;
  serialNumber: string;
  batchId: string;
  emailTo?: string;
  phone?: string;
  linearity: {
    sqa: string[];
  };
  precision: {
    sample1: {
      automated: string[];
      manual: string[];
    };
    sample2: {
      automated: string[];
      manual: string[];
    };
    sample3: {
      automated: string[];
      manual: string[];
    };
    sample4: {
      automated: string[];
      manual: string[];
    };
    sample5: {
      automated: string[];
      manual: string[];
    };
  };
  accuracy: {
    manual: string[];
    morphGradeFinal: {
      tp: string;
      tn: string;
      fp: string;
      fn: string;
    };
    sqa: string[];
    sqaMotility: string[];
    manualMotility: string[];
    sqaMorph: string[];
    manualMorph: string[];
  };
  lowerLimitDetection: {
    conc: string[];
    msc: string[];
  };
  qc: {
    level1: string[];
    level2: string[];
  };
  liveSamplePrecision: {
    set1: {
      conc: string[];
      motility: string[];
      morphology: string[];
    };
    set2: {
      conc: string[];
      motility: string[];
      morphology: string[];
    };
  };
}

export interface GoogleScriptResponse {
  status: 'success' | 'error';
  message?: string;
  spreadsheetId?: string;
  spreadsheetUrl?: string;
  sheetName?: string;
  pdfUrl?: string;
}