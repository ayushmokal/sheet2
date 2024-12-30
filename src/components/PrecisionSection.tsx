import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface PrecisionSectionProps {
  sampleNumber: number;
  data: {
    automated: string[];
    manual: string[];
  };
  handleInputChange: (section: string, field: string, value: string, index: number) => void;
}

export function PrecisionSection({ sampleNumber, data, handleInputChange }: PrecisionSectionProps) {
  const section = `precision.sample${sampleNumber}`;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Precision Sample #{sampleNumber}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Automated</h4>
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3, 4, 5].map((num, index) => (
                <div key={`automated-${num}`} className="space-y-2">
                  <label className="text-sm font-medium">Value {num}</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={data.automated[index]}
                    onChange={(e) => handleInputChange(section, "automated", e.target.value, index)}
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Manual</h4>
            <div className="grid grid-cols-1 gap-4">
              {[1, 2].map((num, index) => (
                <div key={`manual-${num}`} className="space-y-2">
                  <label className="text-sm font-medium">Value {num}</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={data.manual[index]}
                    onChange={(e) => handleInputChange(section, "manual", e.target.value, index)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}