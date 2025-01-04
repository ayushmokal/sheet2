import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { WizardForm } from "./wizard/WizardForm";
import { FormData, GoogleScriptResponse } from "@/types/form";
import { initialFormData, getTestData } from "@/utils/formUtils";
import { APPS_SCRIPT_URL } from "@/config/constants";

export function SQAForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleInputChange = (
    section: string,
    field: string,
    value: string,
    index?: number
  ) => {
    setFormData((prev) => {
      if (field.includes('.')) {
        const [parentField, childField] = field.split('.');
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [parentField]: {
              ...prev[section][parentField],
              [childField]: value
            }
          }
        };
      }
      
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
    setFormData(getTestData());
    toast({
      title: "Test Data Loaded",
      description: "You can now proceed with the form submission.",
    });
  };

  const createSpreadsheet = async () => {
    console.log("Creating spreadsheet...");
    const callbackName = `callback_${Date.now()}`;

    try {
      const responsePromise = new Promise<GoogleScriptResponse>((resolve, reject) => {
        (window as any)[callbackName] = (response: GoogleScriptResponse) => {
          console.log("Received createCopy response:", response);
          resolve(response);
          delete (window as any)[callbackName];
        };

        const script = document.createElement('script');
        script.src = `${APPS_SCRIPT_URL}?callback=${callbackName}&action=createCopy`;
        
        script.onerror = () => {
          console.error("Script loading failed");
          reject(new Error('Failed to load the script'));
          delete (window as any)[callbackName];
        };

        document.body.appendChild(script);
      });

      const response = await responsePromise;
      
      if (response.status === 'success' && response.spreadsheetId) {
        console.log("Spreadsheet created:", response.spreadsheetId);
        setSpreadsheetId(response.spreadsheetId);
        toast({
          title: "Success",
          description: "Spreadsheet created successfully.",
        });
        return response.spreadsheetId;
      } else {
        throw new Error(response.message || 'Failed to create spreadsheet');
      }
    } catch (error) {
      console.error('Error creating spreadsheet:', error);
      toast({
        title: "Error",
        description: "Failed to create spreadsheet. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    console.log("Starting submission process...");

    try {
      // Create spreadsheet if not already created
      const currentSpreadsheetId = spreadsheetId || await createSpreadsheet();
      
      if (!currentSpreadsheetId) {
        throw new Error('No spreadsheet ID available');
      }

      const submitData = {
        ...formData,
        spreadsheetId: currentSpreadsheetId,
        sheetName: 'Template'
      };

      console.log("Submitting form data:", submitData);

      const callbackName = `callback_${Date.now()}`;
      console.log("Using callback name:", callbackName);

      const responsePromise = new Promise<GoogleScriptResponse>((resolve, reject) => {
        (window as any)[callbackName] = (response: GoogleScriptResponse) => {
          console.log("Received response:", response);
          resolve(response);
          delete (window as any)[callbackName];
        };

        const script = document.createElement('script');
        const encodedData = encodeURIComponent(JSON.stringify(submitData));
        script.src = `${APPS_SCRIPT_URL}?callback=${callbackName}&action=submit&data=${encodedData}`;
        console.log("Request URL:", script.src);
        
        script.onerror = () => {
          console.error("Script loading failed");
          reject(new Error('Failed to load the script'));
          delete (window as any)[callbackName];
        };

        document.body.appendChild(script);
      });

      const response = await responsePromise;
      console.log("Processing response:", response);

      if (response.status === 'success') {
        toast({
          title: "Success!",
          description: "Data has been submitted successfully.",
        });
      } else {
        throw new Error(response.message || 'Failed to submit data');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-center">
          SQA Precision / Accuracy / Lower Limit Detection Study
        </h1>
        <WizardForm
          formData={formData}
          handleInputChange={handleInputChange}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onLoadTestData={loadTestData}
        />
      </div>
    </div>
  );
}