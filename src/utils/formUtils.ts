export const initialFormData = {
  facility: "",
  date: "",
  technician: "",
  serialNumber: "",
  emailTo: "",
  lowerLimitDetection: {
    conc: Array(5).fill(""),
    msc: Array(5).fill("")
  },
  precisionLevel1: {
    conc: Array(5).fill(""),
    motility: Array(5).fill(""),
    morph: Array(5).fill("")
  },
  precisionLevel2: {
    conc: Array(5).fill(""),
    motility: Array(5).fill(""),
    morph: Array(5).fill("")
  },
  accuracy: {
    sqa: Array(5).fill(""),
    manual: Array(5).fill(""),
    sqaMotility: Array(5).fill(""),
    manualMotility: Array(5).fill(""),
    sqaMorph: Array(5).fill(""),
    manualMorph: Array(5).fill(""),
    morphGradeFinal: {
      tp: "",
      tn: "",
      fp: "",
      fn: ""
    }
  },
  qc: {
    level1: Array(5).fill(""),
    level2: Array(5).fill("")
  }
};

export const getTestData = () => ({
  facility: "Test Facility",
  date: "2024-02-14",
  technician: "John Doe",
  serialNumber: "TEST123",
  emailTo: "test@example.com",
  lowerLimitDetection: {
    conc: ["0.1", "0.2", "0.3", "0.4", "0.5"],
    msc: ["1", "2", "3", "4", "5"]
  },
  precisionLevel1: {
    conc: ["1", "2", "3", "4", "5"],
    motility: ["10", "20", "30", "40", "50"],
    morph: ["1", "2", "3", "4", "5"]
  },
  precisionLevel2: {
    conc: ["6", "7", "8", "9", "10"],
    motility: ["60", "70", "80", "90", "100"],
    morph: ["6", "7", "8", "9", "10"]
  },
  accuracy: {
    sqa: ["1", "2", "3", "4", "5"],
    manual: ["1.1", "2.1", "3.1", "4.1", "5.1"],
    sqaMotility: ["10", "20", "30", "40", "50"],
    manualMotility: ["11", "21", "31", "41", "51"],
    sqaMorph: ["1", "2", "3", "4", "5"],
    manualMorph: ["1.1", "2.1", "3.1", "4.1", "5.1"],
    morphGradeFinal: {
      tp: "95",
      tn: "90",
      fp: "5",
      fn: "10"
    }
  },
  qc: {
    level1: ["1", "2", "3", "4", "5"],
    level2: ["6", "7", "8", "9", "10"]
  }
});