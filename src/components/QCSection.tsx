import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface QCSectionProps {
  data: {
    level1: string[];
    level2: string[];
  };
  handleInputChange: (section: string, field: string, value: string, index: number) => void;
}

export function QCSection({ data, handleInputChange }: QCSectionProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Precision & Sensitivity - QC</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5].map((num, index) => (
            <div key={`qc-${num}`} className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Level 1 Conc. {num}</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.level1[index]}
                  onChange={(e) => handleInputChange("qc", "level1", e.target.value, index)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Level 2 Conc. {num}</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.level2[index]}
                  onChange={(e) => handleInputChange("qc", "level2", e.target.value, index)}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}