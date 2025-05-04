export interface SalesData {
  totalContributions: number;
  year: string;
  months: {
    [key: string]: number[][];
  };
}
