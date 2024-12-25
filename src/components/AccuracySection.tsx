import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface AccuracySectionProps {
  data: {
    sqa: string[];
    manual: string[];
    sqaMotility: string[];
    manualMotility: string[];
    sqaMorph: string[];
    manualMorph: string[];
    morphGradeFinal: {
      tp: string;
      tn: string;
      fp: string;
      fn: string;
    };
  };
  handleInputChange: (section: string, field: string, value: string, index?: number) => void;
}

export function AccuracySection({ data, handleInputChange }: AccuracySectionProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Accuracy (Optional)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Concentration (M/ml)</h4>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5].map((num, index) => (
                <div key={`conc-${num}`} className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">SQA {num}</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={data.sqa[index]}
                      onChange={(e) => handleInputChange("accuracy", "sqa", e.target.value, index)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Manual {num}</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={data.manual[index]}
                      onChange={(e) => handleInputChange("accuracy", "manual", e.target.value, index)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Motility (%)</h4>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5].map((num, index) => (
                <div key={`mot-${num}`} className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">SQA {num}</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={data.sqaMotility[index]}
                      onChange={(e) => handleInputChange("accuracy", "sqaMotility", e.target.value, index)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Manual {num}</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={data.manualMotility[index]}
                      onChange={(e) => handleInputChange("accuracy", "manualMotility", e.target.value, index)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Morphology (%)</h4>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5].map((num, index) => (
                <div key={`morph-${num}`} className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">SQA {num}</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={data.sqaMorph[index]}
                      onChange={(e) => handleInputChange("accuracy", "sqaMorph", e.target.value, index)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Manual {num}</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={data.manualMorph[index]}
                      onChange={(e) => handleInputChange("accuracy", "manualMorph", e.target.value, index)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Morphology Grade Final</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">True Positive (TP)</label>
                <Input
                  type="number"
                  value={data.morphGradeFinal.tp}
                  onChange={(e) => handleInputChange("accuracy", "morphGradeFinal.tp", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">True Negative (TN)</label>
                <Input
                  type="number"
                  value={data.morphGradeFinal.tn}
                  onChange={(e) => handleInputChange("accuracy", "morphGradeFinal.tn", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">False Positive (FP)</label>
                <Input
                  type="number"
                  value={data.morphGradeFinal.fp}
                  onChange={(e) => handleInputChange("accuracy", "morphGradeFinal.fp", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">False Negative (FN)</label>
                <Input
                  type="number"
                  value={data.morphGradeFinal.fn}
                  onChange={(e) => handleInputChange("accuracy", "morphGradeFinal.fn", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}