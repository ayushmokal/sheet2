import { Input } from "@/components/ui/input";

interface FormHeaderProps {
  formData: {
    facility: string;
    date: string;
    technician: string;
    serialNumber: string;
  };
  handleInputChange: (section: string, field: string, value: string) => void;
}

export function FormHeader({ formData, handleInputChange }: FormHeaderProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Facility</label>
        <Input
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
        <label className="text-sm font-medium">Technician</label>
        <Input
          value={formData.technician}
          onChange={(e) => handleInputChange("technician", "", e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Serial Number</label>
        <Input
          value={formData.serialNumber}
          onChange={(e) => handleInputChange("serialNumber", "", e.target.value)}
          required
        />
      </div>
    </div>
  );
}