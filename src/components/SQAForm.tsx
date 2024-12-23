import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FormData {
  facility: string;
  date: string;
  technician: string;
  serialNumber: string;
  lowerLimitDetection: {
    conc: string[];
    msc: string[];
  };
  precisionLevel1: {
    conc: string[];
    motility: string[];
    morph: string[];
  };
  precisionLevel2: {
    conc: string[];
    motility: string[];
    morph: string[];
  };
  accuracy: {
    sqa: string[];
    manual: string[];
    sqaMotility: string[];
    manualMotility: string[];
    sqaMorph: string[];
    manualMorph: string[];
  };
}

const initialFormData: FormData = {
  facility: "",
  date: "",
  technician: "",
  serialNumber: "",
  lowerLimitDetection: {
    conc: Array(5).fill(""),
    msc: Array(5).fill(""),
  },
  precisionLevel1: {
    conc: Array(5).fill(""),
    motility: Array(5).fill(""),
    morph: Array(5).fill(""),
  },
  precisionLevel2: {
    conc: Array(5).fill(""),
    motility: Array(5).fill(""),
    morph: Array(5).fill(""),
  },
  accuracy: {
    sqa: Array(5).fill(""),
    manual: Array(5).fill(""),
    sqaMotility: Array(5).fill(""),
    manualMotility: Array(5).fill(""),
    sqaMorph: Array(5).fill(""),
    manualMorph: Array(5).fill(""),
  },
};

export function SQAForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const { toast } = useToast();

  const handleInputChange = (
    section: keyof FormData,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Here you would typically send the data to your backend
      // which would then update the Google Sheet
      console.log("Form data:", formData);
      
      toast({
        title: "Success!",
        description: "Data has been submitted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>SQA Precision / Accuracy / Lower Limit Detection Study</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Header Information */}
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

          {/* Lower Limit Detection */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Lower Limit Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5].map((num, index) => (
                  <div key={`lld-${num}`} className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Conc. Value {num}</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.lowerLimitDetection.conc[index]}
                        onChange={(e) => handleInputChange("lowerLimitDetection", "conc", e.target.value, index)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">MSC Value {num}</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.lowerLimitDetection.msc[index]}
                        onChange={(e) => handleInputChange("lowerLimitDetection", "msc", e.target.value, index)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Precision & Sensitivity Level 1 */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Precision & Sensitivity - Level 1</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {[1, 2, 3, 4, 5].map((num, index) => (
                  <div key={`ps1-${num}`} className="grid grid-cols-3 gap-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Conc. (M/mL) {num}</label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.precisionLevel1.conc[index]}
                        onChange={(e) => handleInputChange("precisionLevel1", "conc", e.target.value, index)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Motility (%) {num}</label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.precisionLevel1.motility[index]}
                        onChange={(e) => handleInputChange("precisionLevel1", "motility", e.target.value, index)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Morph. (%) {num}</label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.precisionLevel1.morph[index]}
                        onChange={(e) => handleInputChange("precisionLevel1", "morph", e.target.value, index)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <Button type="submit" className="bg-primary text-white">
              Submit Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}