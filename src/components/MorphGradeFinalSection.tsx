import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface MorphGradeFinalSectionProps {
  data: {
    tp: string;
    tn: string;
    fp: string;
    fn: string;
  };
  handleInputChange: (section: string, field: string, value: string) => void;
}

export function MorphGradeFinalSection({ data, handleInputChange }: MorphGradeFinalSectionProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Morph Grade Final</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">TP (True Positive)</label>
            <Input
              type="number"
              step="0.1"
              value={data.tp}
              onChange={(e) => handleInputChange("accuracy", "morphGradeFinal.tp", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">TN (True Negative)</label>
            <Input
              type="number"
              step="0.1"
              value={data.tn}
              onChange={(e) => handleInputChange("accuracy", "morphGradeFinal.tn", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">FP (False Positive)</label>
            <Input
              type="number"
              step="0.1"
              value={data.fp}
              onChange={(e) => handleInputChange("accuracy", "morphGradeFinal.fp", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">FN (False Negative)</label>
            <Input
              type="number"
              step="0.1"
              value={data.fn}
              onChange={(e) => handleInputChange("accuracy", "morphGradeFinal.fn", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}