import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";

interface FormActionsProps {
  onLoadTestData: () => void;
  onCreateSpreadsheet: () => void;
  isSubmitting: boolean;
  hasSpreadsheet: boolean;
}

export function FormActions({ 
  onLoadTestData, 
  onCreateSpreadsheet,
  isSubmitting,
  hasSpreadsheet 
}: FormActionsProps) {
  return (
    <div className="flex justify-between items-center gap-4 flex-wrap">
      <div className="flex gap-2">
        <Button 
          type="button" 
          variant="outline"
          onClick={onLoadTestData}
        >
          Load Test Data
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCreateSpreadsheet}
          className="flex items-center gap-2"
        >
          <FileSpreadsheet className="w-4 h-4" />
          {hasSpreadsheet ? "Open Spreadsheet" : "Create Spreadsheet"}
        </Button>
      </div>
      <Button 
        type="submit" 
        className="bg-primary text-white"
        disabled={isSubmitting || !hasSpreadsheet}
      >
        {isSubmitting ? "Submitting..." : "Submit Data"}
      </Button>
    </div>
  );
}