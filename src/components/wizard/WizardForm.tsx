import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormHeader } from "../FormHeader";
import { LinearitySection } from "../LinearitySection";
import { PrecisionSection } from "../PrecisionSection";
import { AccuracySection } from "../AccuracySection";
import { LiveSamplePrecisionSection } from "../LiveSamplePrecisionSection";
import { FormData } from "@/types/form";
import { FormActions } from "../FormActions";

interface WizardFormProps {
  formData: FormData;
  handleInputChange: (section: string, field: string, value: string, index?: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function WizardForm({
  formData,
  handleInputChange,
  onSubmit,
  isSubmitting,
}: WizardFormProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Facility Information",
      component: (
        <FormHeader 
          formData={formData} 
          handleInputChange={handleInputChange}
          hasSubmittedData={false}
        />
      )
    },
    {
      title: "Linearity",
      component: (
        <LinearitySection 
          data={formData.linearity} 
          handleInputChange={handleInputChange} 
        />
      )
    },
    {
      title: "Precision",
      component: (
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((sampleNumber) => (
            <PrecisionSection
              key={`precision-${sampleNumber}`}
              sampleNumber={sampleNumber}
              data={formData.precision[`sample${sampleNumber}`]}
              handleInputChange={handleInputChange}
            />
          ))}
        </div>
      )
    },
    {
      title: "Accuracy",
      component: (
        <AccuracySection 
          data={formData.accuracy} 
          handleInputChange={handleInputChange} 
        />
      )
    },
    {
      title: "Live Sample Precision",
      component: (
        <LiveSamplePrecisionSection 
          data={formData.liveSamplePrecision} 
          handleInputChange={handleInputChange} 
        />
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {steps[currentStep].component}
            <div className="flex justify-between mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={previousStep}
                disabled={currentStep === 0 || isSubmitting}
              >
                Previous
              </Button>
              {currentStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  className="bg-primary text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Data"}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={isSubmitting}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}