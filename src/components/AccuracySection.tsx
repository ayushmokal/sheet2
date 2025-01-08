import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AccuracySectionProps {
  data: {
    manual: string[];
  };
  handleInputChange: (section: string, field: string, value: string, index: number) => void;
}

export function AccuracySection({ data }: AccuracySectionProps) {
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
              <div className="p-2 bg-gray-50 rounded border border-gray-200">
                {data.manual[index] || '-'}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}