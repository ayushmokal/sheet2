import { FormData } from "@/types/form";

export const initialFormData: FormData = {
  facility: "",
  date: "",
  technician: "",
  serialNumber: "",
  lowerLimitDetection: {
    conc: Array(5).fill(""),
    msc: Array(5).fill(""),
  },
  precisionLevel1: {
    conc: Array(5).fill(""),
    motility: Array(5).fill(""),
    morph: Array(5).fill(""),
  },
  precisionLevel2: {
    conc: Array(5).fill(""),
    motility: Array(5).fill(""),
    morph: Array(5).fill(""),
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
      fn: "",
    },
  },
  qc: {
    level1: Array(5).fill(""),
    level2: Array(5).fill(""),
  },
};

export const getTestData = (): FormData => ({
  facility: "Test Facility",
  date: "2024-03-15",
  technician: "Test Technician",
  serialNumber: "TEST123",
  lowerLimitDetection: {
    conc: ["1.0", "2.0", "3.0", "4.0", "5.0"],
    msc: ["10", "20", "30", "40", "50"],
  },
  precisionLevel1: {
    conc: ["156.9", "149.4", "147.1", "147.1", "147.1"],
    motility: ["43.0", "45.0", "45.0", "46.0", "45.0"],
    morph: ["6.0", "6.0", "6.0", "7.0", "7.0"],
  },
  precisionLevel2: {
    conc: ["11.2", "51.7", "47.0", "63.0", "149.4"],
    motility: ["4.0", "59.0", "48.0", "45.0", "45.0"],
    morph: ["6.0", "6.0", "6.0", "7.0", "7.0"],
  },
  accuracy: {
    sqa: ["11.2", "51.7", "47.0", "63.0", "149.4"],
    manual: ["18.0", "47.8", "44.9", "45.1", "141.1"],
    sqaMotility: ["4.0", "59.0", "48.0", "45.0", "45.0"],
    manualMotility: ["3.3", "57.5", "41.0", "54.0", "54.0"],
    sqaMorph: ["N/A", "N/A", "N/A", "N/A", "N/A"],
    manualMorph: ["N/A", "N/A", "N/A", "N/A", "N/A"],
    morphGradeFinal: {
      tp: "10",
      tn: "8",
      fp: "2",
      fn: "1",
    },
  },
  qc: {
    level1: ["1.0", "1.1", "1.0", "1.2", "1.1"],
    level2: ["2.0", "2.1", "2.0", "2.2", "2.1"],
  },
});