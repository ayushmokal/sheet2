import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface AccuracySectionProps {
  data: {
    manual: string[];
  };
  handleInputChange: (section: string, field: string, value: string, index: number) => void;
}

export function AccuracySection({ data, handleInputChange }: AccuracySectionProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Accuracy Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3, 4, 5].map((num, index) => (
            <div key={`accuracy-${num}`} className="space-y-2">
              <label className="text-sm font-medium">Manual Value {num}</label>
              <Input
                type="number"
                step="0.1"
                value={data.manual[index]}
                onChange={(e) => handleInputChange("accuracy", "manual", e.target.value, index)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}