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
    conc: ["1.1", "1.2", "1.3", "1.4", "1.5"],
    motility: ["60", "65", "70", "75", "80"],
    morph: ["10", "12", "14", "16", "18"],
  },
  precisionLevel2: {
    conc: ["2.1", "2.2", "2.3", "2.4", "2.5"],
    motility: ["55", "60", "65", "70", "75"],
    morph: ["15", "17", "19", "21", "23"],
  },
  accuracy: {
    sqa: ["1.0", "2.0", "3.0", "4.0", "5.0"],
    manual: ["1.1", "2.1", "3.1", "4.1", "5.1"],
    sqaMotility: ["50.0", "55.0", "60.0", "65.0", "70.0"],
    manualMotility: ["52.0", "57.0", "62.0", "67.0", "72.0"],
    sqaMorph: ["12.0", "14.0", "16.0", "18.0", "20.0"],
    manualMorph: ["13.0", "15.0", "17.0", "19.0", "21.0"],
  },
  qc: {
    level1: ["1.0", "1.0", "1.0", "1.0", "1.0"],
    level2: ["11.0", "1.0", "1.0", "1.0", "1.0"],
  },
});