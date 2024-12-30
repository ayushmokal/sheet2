export const initialFormData = {
  facility: "",
  date: "",
  serialNumber: "",
  batchId: "",
  emailTo: "",
  linearity: {
    sqa: Array(6).fill("")
  },
  precision: {
    sample1: {
      automated: Array(5).fill(""),
      manual: Array(2).fill("")
    },
    sample2: {
      automated: Array(5).fill(""),
      manual: Array(2).fill("")
    },
    sample3: {
      automated: Array(5).fill(""),
      manual: Array(2).fill("")
    },
    sample4: {
      automated: Array(5).fill(""),
      manual: Array(2).fill("")
    },
    sample5: {
      automated: Array(5).fill(""),
      manual: Array(2).fill("")
    }
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
  qc: {
    level1: Array(5).fill(""),
    level2: Array(5).fill("")
  },
  liveSamplePrecision: {
    set1: {
      conc: Array(5).fill(""),
      motility: Array(5).fill(""),
      morphology: Array(5).fill("")
    },
    set2: {
      conc: Array(5).fill(""),
      motility: Array(5).fill(""),
      morphology: Array(5).fill("")
    }
  }
};

export const getTestData = () => ({
  facility: "Test Facility",
  date: "2024-02-14",
  serialNumber: "TEST123",
  batchId: "BATCH001",
  emailTo: "test@example.com",
  linearity: {
    sqa: ["1", "2", "3", "4", "5", "6"]
  },
  precision: {
    sample1: {
      automated: ["1", "2", "3", "4", "5"],
      manual: ["1.1", "2.1"]
    },
    sample2: {
      automated: ["6", "7", "8", "9", "10"],
      manual: ["6.1", "7.1"]
    },
    sample3: {
      automated: ["11", "12", "13", "14", "15"],
      manual: ["11.1", "12.1"]
    },
    sample4: {
      automated: ["16", "17", "18", "19", "20"],
      manual: ["16.1", "17.1"]
    },
    sample5: {
      automated: ["21", "22", "23", "24", "25"],
      manual: ["21.1", "22.1"]
    }
  },
  accuracy: {
    sqa: Array(5).fill("1"),
    manual: Array(5).fill("1"),
    sqaMotility: Array(5).fill("50"),
    manualMotility: Array(5).fill("50"),
    sqaMorph: Array(5).fill("10"),
    manualMorph: Array(5).fill("10"),
    morphGradeFinal: {
      tp: "10",
      tn: "10",
      fp: "5",
      fn: "5"
    }
  },
  lowerLimitDetection: {
    conc: ["1", "2", "3", "4", "5"],
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
  qc: {
    level1: ["1", "2", "3", "4", "5"],
    level2: ["6", "7", "8", "9", "10"]
  },
  liveSamplePrecision: {
    set1: {
      conc: ["1", "2", "3", "4", "5"],
      motility: ["10", "20", "30", "40", "50"],
      morphology: ["1", "2", "3", "4", "5"]
    },
    set2: {
      conc: ["6", "7", "8", "9", "10"],
      motility: ["60", "70", "80", "90", "100"],
      morphology: ["6", "7", "8", "9", "10"]
    }
  }
});