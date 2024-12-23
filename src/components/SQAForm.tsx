import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormHeader } from "./FormHeader";
import { LowerLimitDetection } from "./LowerLimitDetection";
import { PrecisionSection } from "./PrecisionSection";

interface FormData {
  facility: string;
  date: string;
  technician: string;
  serialNumber: string;
  lowerLimitDetection: {
    conc: string[];
    msc: string[];
  };
  precisionLevel1: {
    conc: string[];
    motility: string[];
    morph: string[];
  };
  precisionLevel2: {
    conc: string[];
    motility: string[];
    morph: string[];
  };
  accuracy: {
    sqa: string[];
    manual: string[];
    sqaMotility: string[];
    manualMotility: string[];
    sqaMorph: string[];
    manualMorph: string[];
  };
}

interface GoogleScriptResponse {
  status: 'success' | 'error';
  message?: string;
}

const initialFormData: FormData = {
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
};

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz-R_FX3C-F6FhJznqnSOHuPuHqtbt0M2zdfMYATsRzogZ2IhO23FRNOsvH-1T77XdDww/exec';

export function SQAForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (
    section: string,
    field: string,
    value: string,
    index?: number
  ) => {
    setFormData((prev) => {
      if (typeof index === "number" && typeof prev[section] === "object") {
        const sectionData = { ...prev[section] };
        if (Array.isArray(sectionData[field])) {
          sectionData[field] = [...sectionData[field]];
          sectionData[field][index] = value;
        }
        return { ...prev, [section]: sectionData };
      }
      return { ...prev, [section]: value };
    });
  };

  const loadTestData = () => {
    const testData: FormData = {
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
        sqaMotility: ["50", "55", "60", "65", "70"],
        manualMotility: ["52", "57", "62", "67", "72"],
        sqaMorph: ["12", "14", "16", "18", "20"],
        manualMorph: ["13", "15", "17", "19", "21"],
      },
    };
    setFormData(testData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    let script: HTMLScriptElement | null = null;
    const cleanup = () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
      setIsSubmitting(false);
    };

    try {
      const callbackName = 'callback_' + Date.now();

      const responsePromise = new Promise<GoogleScriptResponse>((resolve, reject) => {
        (window as any)[callbackName] = (response: GoogleScriptResponse) => {
          resolve(response);
          delete (window as any)[callbackName];
        };

        script = document.createElement('script');
        script.src = `${APPS_SCRIPT_URL}?callback=${callbackName}&action=submit&data=${encodeURIComponent(JSON.stringify(formData))}`;
        
        script.onerror = () => {
          reject(new Error('Failed to load the script'));
          delete (window as any)[callbackName];
        };

        document.body.appendChild(script);
      });

      const response = await responsePromise;

      if (response.status === 'success') {
        toast({
          title: "Success!",
          description: "Data has been submitted to Google Sheets successfully.",
        });
      } else {
        throw new Error(response.message || 'Failed to submit data');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to submit data. Please try again.",
        variant: "destructive",
      });
    } finally {
      cleanup();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>SQA Precision / Accuracy / Lower Limit Detection Study</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-end mb-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={loadTestData}
              className="mr-2"
            >
              Load Test Data
            </Button>
          </div>
          <FormHeader formData={formData} handleInputChange={handleInputChange} />
          <LowerLimitDetection 
            data={formData.lowerLimitDetection}
            handleInputChange={handleInputChange}
          />
          <PrecisionSection 
            level={1}
            data={formData.precisionLevel1}
            handleInputChange={handleInputChange}
          />
          <PrecisionSection 
            level={2}
            data={formData.precisionLevel2}
            handleInputChange={handleInputChange}
          />
          
          <div className="flex justify-end mt-6">
            <Button 
              type="submit" 
              className="bg-primary text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Data"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
