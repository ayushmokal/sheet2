import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface LiveSamplePrecisionSectionProps {
  data: {
    set1: {
      conc: string[];
      motility: string[];
      morphology: string[];
    };
    set2: {
      conc: string[];
      motility: string[];
      morphology: string[];
    };
  };
  handleInputChange: (section: string, field: string, value: string, index: number) => void;
}

export function LiveSamplePrecisionSection({ data, handleInputChange }: LiveSamplePrecisionSectionProps) {
  const renderSet = (setNumber: 1 | 2) => {
    const section = `liveSamplePrecision.set${setNumber}`;
    const setData = setNumber === 1 ? data.set1 : data.set2;

    return (
      <div className="space-y-6">
        <h4 className="font-medium">Set {setNumber}</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5].map((num, index) => (
            <div key={`set${setNumber}-${num}`} className="grid grid-cols-1 gap-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Conc. (M/mL) {num}</label>
                <Input
                  type="number"
                  step="0.1"
                  value={setData.conc[index]}
                  onChange={(e) => handleInputChange(section, "conc", e.target.value, index)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Motility (%) {num}</label>
                <Input
                  type="number"
                  step="0.1"
                  value={setData.motility[index]}
                  onChange={(e) => handleInputChange(section, "motility", e.target.value, index)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Morphology (%) {num}</label>
                <Input
                  type="number"
                  step="0.1"
                  value={setData.morphology[index]}
                  onChange={(e) => handleInputChange(section, "morphology", e.target.value, index)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Live Sample Precision</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {renderSet(1)}
        {renderSet(2)}
      </CardContent>
    </Card>
  );
}