import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface LinearitySectionProps {
  data: {
    sqa: string[];
  };
  handleInputChange: (section: string, field: string, value: string, index: number) => void;
}

export function LinearitySection({ data, handleInputChange }: LinearitySectionProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Linearity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3, 4, 5, 6].map((num, index) => (
            <div key={`linearity-${num}`} className="space-y-2">
              <label className="text-sm font-medium">SQA Value {num}</label>
              <Input
                type="number"
                step="0.1"
                value={data.sqa[index]}
                onChange={(e) => handleInputChange("linearity", "sqa", e.target.value, index)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}