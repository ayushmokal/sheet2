export const calculateRValue = (xValues: string[], yValues: string[]) => {
  // Filter out non-numeric and empty values
  const validPairs = xValues.map((x, i) => [x, yValues[i]])
    .filter(([x, y]) => !isNaN(Number(x)) && !isNaN(Number(y)) && x !== '' && y !== '');
  
  if (validPairs.length < 2) return 0;
  
  const x = validPairs.map(pair => Number(pair[0]));
  const y = validPairs.map(pair => Number(pair[1]));
  
  const n = validPairs.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, x, i) => sum + x * y[i], 0);
  const sumX2 = x.reduce((sum, x) => sum + x * x, 0);
  const sumY2 = y.reduce((sum, y) => sum + y * y, 0);
  
  const numerator = (n * sumXY) - (sumX * sumY);
  const denominator = Math.sqrt(((n * sumX2) - (sumX * sumX)) * ((n * sumY2) - (sumY * sumY)));
  
  if (denominator === 0) return 0;
  const r = numerator / denominator;
  return r * r; // Return R² directly
};

export const calculateSensitivity = (data: string[], referenceCutoff: number) => {
  const validData = data
    .map(value => Number(value))
    .filter(value => !isNaN(value) && value !== '');
    
  if (validData.length === 0) return "N/A";
  
  const belowCutoff = validData.filter(value => value < referenceCutoff);
  if (belowCutoff.length === 0) return "N/A";
  
  const truePositives = belowCutoff.length;
  const falseNegatives = validData.filter(value => value >= referenceCutoff).length;
  
  if (truePositives + falseNegatives === 0) return "N/A";
  return ((truePositives / (truePositives + falseNegatives)) * 100).toFixed(1) + "%";
};