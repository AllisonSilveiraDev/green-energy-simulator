export interface Device {
  name: string;
  power: number; // in watts
  hoursPerDay: number; // hours per day
  daysPerMonth: number; // default: 30
  energyConsumption: number; // kWh per month
  costPerMonth: number; // calculated based on tariff
}
