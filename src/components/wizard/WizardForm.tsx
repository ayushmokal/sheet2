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
  onLoadTestData: () => void;
}

export function WizardForm({
  formData,
  handleInputChange,
  onSubmit,
  isSubmitting,
  onLoadTestData,
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
          <PrecisionSection
            sampleNumber={1}
            data={formData.precision.sample1}
            handleInputChange={handleInputChange}
          />
          <PrecisionSection
            sampleNumber={2}
            data={formData.precision.sample2}
            handleInputChange={handleInputChange}
          />
          <PrecisionSection
            sampleNumber={3}
            data={formData.precision.sample3}
            handleInputChange={handleInputChange}
          />
          <PrecisionSection
            sampleNumber={4}
            data={formData.precision.sample4}
            handleInputChange={handleInputChange}
          />
          <PrecisionSection
            sampleNumber={5}
            data={formData.precision.sample5}
            handleInputChange={handleInputChange}
          />
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
    },
    {
      title: "Verification",
      component: (
        <Card>
          <CardHeader>
            <CardTitle>Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Please verify all the data before submitting.</p>
            <FormActions
              onLoadTestData={onLoadTestData}
              onCreateSpreadsheet={() => {}}
              onSendEmail={() => {}}
              isCreatingSpreadsheet={false}
              isSendingEmail={false}
              isSubmitting={isSubmitting}
              hasSpreadsheet={false}
              hasSubmittedData={false}
            />
          </CardContent>
        </Card>
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
        </CardHeader>
        <CardContent>
          {steps[currentStep].component}
          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={previousStep}
              disabled={currentStep === 0}
            >
              Back
            </Button>
            {currentStep === steps.length - 1 ? (
              <Button
                type="button"
                onClick={onSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Data"}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={nextStep}
              >
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}