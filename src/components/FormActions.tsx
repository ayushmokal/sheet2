import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onLoadTestData: () => void;
  isSubmitting: boolean;
}

export function FormActions({ onLoadTestData, isSubmitting }: FormActionsProps) {
  return (
    <div className="flex justify-between items-center">
      <Button 
        type="button" 
        variant="outline"
        onClick={onLoadTestData}
      >
        Load Test Data
      </Button>
      <Button 
        type="submit" 
        className="bg-primary text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Data"}
      </Button>
    </div>
  );
}