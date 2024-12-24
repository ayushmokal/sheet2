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
  // Function to format date as YYYY-MM-DD
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Function to sanitize facility name (remove special characters)
  const sanitizeFacilityName = (name: string) => {
    return name.replace(/[^a-zA-Z0-9]/g, '');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Facility</label>
        <Input
          value={formData.facility}
          onChange={(e) => {
            const sanitizedValue = sanitizeFacilityName(e.target.value);
            handleInputChange("facility", "", sanitizedValue);
          }}
          placeholder="Enter facility name"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Date</label>
        <Input
          type="date"
          value={formData.date}
          onChange={(e) => {
            const formattedDate = formatDate(e.target.value);
            handleInputChange("date", "", formattedDate);
          }}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Technician</label>
        <Input
          value={formData.technician}
          onChange={(e) => handleInputChange("technician", "", e.target.value)}
          placeholder="Enter technician name"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Serial Number</label>
        <Input
          value={formData.serialNumber}
          onChange={(e) => {
            const value = e.target.value.trim();
            handleInputChange("serialNumber", "", value);
          }}
          placeholder="Enter serial number"
          required
        />
      </div>
    </div>
  );
}