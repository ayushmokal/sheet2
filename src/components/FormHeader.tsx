import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface FormHeaderProps {
  formData: {
    facility: string;
    date: string;
    serialNumber: string;
    batchId: string;
    emailTo?: string;
    phone?: string;
  };
  handleInputChange: (section: string, field: string, value: string) => void;
  hasSubmittedData: boolean;
}

export function FormHeader({ formData, handleInputChange, hasSubmittedData }: FormHeaderProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Facility Name</label>
            <Input
              type="text"
              value={formData.facility}
              onChange={(e) => handleInputChange("facility", "", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", "", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">SQA Serial Number</label>
            <Input
              type="text"
              value={formData.serialNumber}
              onChange={(e) => handleInputChange("serialNumber", "", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Batch ID</label>
            <Input
              type="text"
              value={formData.batchId}
              onChange={(e) => handleInputChange("batchId", "", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Contact Email (for records only)</label>
            <Input
              type="email"
              value={formData.emailTo || ''}
              onChange={(e) => handleInputChange("emailTo", "", e.target.value)}
              placeholder="Enter email address"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Contact Phone (for records only)</label>
            <Input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => handleInputChange("phone", "", e.target.value)}
              placeholder="Enter phone number"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}