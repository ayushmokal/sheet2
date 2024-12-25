import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormHeader } from "./FormHeader";
import { LowerLimitDetection } from "./LowerLimitDetection";
import { PrecisionSection } from "./PrecisionSection";
import { AccuracySection } from "./AccuracySection";
import { QCSection } from "./QCSection";
import { FormActions } from "./FormActions";
import { FormData, GoogleScriptResponse } from "@/types/form";
import { initialFormData, getTestData } from "@/utils/formUtils";
import { APPS_SCRIPT_URL, SPREADSHEET_CONFIG } from "@/config/constants";

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
    setFormData(getTestData());
    toast({
      title: "Test Data Loaded",
      description: "You can now submit the form to test the Google Sheets integration.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    console.log("Submitting form data:", formData);

    try {
      const callbackName = `callback_${Date.now()}`;
      console.log("Using callback name:", callbackName);

      const responsePromise = new Promise<GoogleScriptResponse>((resolve, reject) => {
        let scriptElement: HTMLScriptElement | null = null;
        
        const timeoutId = setTimeout(() => {
          reject(new Error('Request timed out after 30 seconds'));
          cleanup();
        }, 30000);

        (window as any)[callbackName] = (response: GoogleScriptResponse) => {
          clearTimeout(timeoutId);
          console.log("Received response:", response);
          resolve(response);
          cleanup();
        };

        function cleanup() {
          delete (window as any)[callbackName];
          if (scriptElement && scriptElement.parentNode) {
            scriptElement.parentNode.removeChild(scriptElement);
          }
        }

        try {
          scriptElement = document.createElement('script');
          scriptElement.async = true;
          scriptElement.defer = true;
          
          const dataToSubmit = {
            ...formData,
            sheetName: SPREADSHEET_CONFIG.TEMPLATE_SHEET_NAME
          };
          console.log("Data being sent to Google Sheets:", dataToSubmit);
          
          const encodedData = encodeURIComponent(JSON.stringify(dataToSubmit));
          const timestamp = new Date().getTime();
          const url = new URL(APPS_SCRIPT_URL);
          url.searchParams.append('callback', callbackName);
          url.searchParams.append('action', 'submit');
          url.searchParams.append('data', encodedData);
          url.searchParams.append('_', timestamp.toString());
          
          scriptElement.src = url.toString();
          console.log("Request URL:", scriptElement.src);
          
          scriptElement.onerror = () => {
            clearTimeout(timeoutId);
            reject(new Error('Failed to connect to Google Sheets. Please check your internet connection and try again.'));
            cleanup();
          };

          document.body.appendChild(scriptElement);
        } catch (error) {
          clearTimeout(timeoutId);
          reject(error);
          cleanup();
        }
      });

      const response = await responsePromise;
      console.log("Processing response:", response);

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
        description: error instanceof Error 
          ? `Failed to submit data: ${error.message}. Please ensure you're connected to the internet and try again.` 
          : "Failed to submit data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>SQA Precision / Accuracy / Lower Limit Detection Study</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormActions 
            onLoadTestData={loadTestData}
            isSubmitting={isSubmitting}
          />
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
          <AccuracySection
            data={formData.accuracy}
            handleInputChange={handleInputChange}
          />
          <QCSection
            data={formData.qc}
            handleInputChange={handleInputChange}
          />
        </CardContent>
      </Card>
    </form>
  );
}