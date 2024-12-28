import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Mail } from "lucide-react";

interface FormActionsProps {
  onLoadTestData: () => void;
  onCreateSpreadsheet: () => void;
  onSendEmail: () => void;
  isCreatingSpreadsheet: boolean;
  isSendingEmail: boolean;
  hasSpreadsheet: boolean;
  hasSubmittedData: boolean;
}

export function FormActions({ 
  onLoadTestData, 
  onCreateSpreadsheet,
  onSendEmail,
  isCreatingSpreadsheet,
  isSendingEmail,
  hasSpreadsheet,
  hasSubmittedData
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
          disabled={isCreatingSpreadsheet}
          className="flex items-center gap-2"
        >
          <FileSpreadsheet className="w-4 h-4" />
          {isCreatingSpreadsheet ? "Creating..." : hasSpreadsheet ? "Open Spreadsheet" : "Create Spreadsheet"}
        </Button>
        {hasSubmittedData && (
          <Button
            type="button"
            variant="outline"
            onClick={onSendEmail}
            disabled={isSendingEmail}
            className="flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            {isSendingEmail ? "Sending..." : "Send Email"}
          </Button>
        )}
      </div>
      <Button 
        type="submit" 
        className="bg-primary text-white"
        disabled={!hasSpreadsheet}
      >
        Submit Data
      </Button>
    </div>
  );
}