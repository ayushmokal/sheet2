import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface LowerLimitDetectionProps {
  data: {
    conc: string[];
    msc: string[];
  };
  handleInputChange: (section: string, field: string, value: string, index: number) => void;
}

export function LowerLimitDetection({ data, handleInputChange }: LowerLimitDetectionProps) {
  const { toast } = useToast();

  const validateNonZero = (value: string, field: string, index: number) => {
    const numValue = parseFloat(value);
    if (value && numValue === 0) {
      toast({
        title: "Invalid Input",
        description: "Value cannot be zero",
        variant: "destructive",
      });
      return;
    }
    handleInputChange("lowerLimitDetection", field, value, index);
  };

  return (
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
                  value={data.conc[index]}
                  onChange={(e) => validateNonZero(e.target.value, "conc", index)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">MSC Value {num}</label>
                <Input
                  type="number"
                  step="0.01"
                  value={data.msc[index]}
                  onChange={(e) => validateNonZero(e.target.value, "msc", index)}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}