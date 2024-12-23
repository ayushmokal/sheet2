import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PrecisionSectionProps {
  level: number;
  data: {
    conc: string[];
    motility: string[];
    morph: string[];
  };
  handleInputChange: (section: string, field: string, value: string, index: number) => void;
}

export function PrecisionSection({ level, data, handleInputChange }: PrecisionSectionProps) {
  const section = `precisionLevel${level}`;
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Precision & Sensitivity - Level {level}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3, 4, 5].map((num, index) => (
            <div key={`ps${level}-${num}`} className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Conc. (M/mL) {num}</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.conc[index]}
                  onChange={(e) => handleInputChange(section, "conc", e.target.value, index)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Motility (%) {num}</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.motility[index]}
                  onChange={(e) => handleInputChange(section, "motility", e.target.value, index)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Morph. (%) {num}</label>
                <Input
                  type="number"
                  step="0.1"
                  value={data.morph[index]}
                  onChange={(e) => handleInputChange(section, "morph", e.target.value, index)}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}