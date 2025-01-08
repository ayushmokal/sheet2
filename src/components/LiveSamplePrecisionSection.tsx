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
      <div className="space-y-4">
        <h4 className="font-medium">Set {setNumber}</h4>
        <div className="grid grid-cols-4 gap-4">
          {/* Headers */}
          <div className="font-medium text-sm">Sample #</div>
          <div className="font-medium text-sm">Conc. (M/mL)</div>
          <div className="font-medium text-sm">Motility (%)</div>
          <div className="font-medium text-sm">Morphology (%)</div>

          {/* Rows */}
          {[1, 2, 3, 4, 5].map((num, index) => (
            <>
              <div key={`sample-${num}`} className="flex items-center">
                {num}
              </div>
              <div key={`conc-${num}`}>
                <Input
                  type="number"
                  step="0.1"
                  value={setData.conc[index]}
                  onChange={(e) => handleInputChange(section, "conc", e.target.value, index)}
                  className="w-full"
                />
              </div>
              <div key={`motility-${num}`}>
                <Input
                  type="number"
                  step="0.1"
                  value={setData.motility[index]}
                  onChange={(e) => handleInputChange(section, "motility", e.target.value, index)}
                  className="w-full"
                />
              </div>
              <div key={`morphology-${num}`}>
                <Input
                  type="number"
                  step="0.1"
                  value={setData.morphology[index]}
                  onChange={(e) => handleInputChange(section, "morphology", e.target.value, index)}
                  className="w-full"
                />
              </div>
            </>
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