export interface Household {
  adults: number;
  children: number;
}

export interface MonthlyExpenses {
  debtPayments: number;
  childcare: number;
  subscriptions: number;
  other: number;
}

export interface RelocationBudget {
  flights: number;
  shipping: number;
  visaFeesOverride: number | null;
  emergencyBuffer: number;
}

export interface FinancialProfile {
  savings: number;
  currentIncomeContinues: boolean;
  currentMonthlyIncomeNet: number;
  expectedLocalSalaryNet: number;
  expenses: MonthlyExpenses;
  relocation: RelocationBudget;
  bufferPct: number;
}

export type CityTierId = 'capital' | 'major' | 'smaller';

export interface CostOfLivingTier {
  label: string;
  rent1Bed: number;
  rent3Bed: number;
  groceriesPerAdult: number;
  utilities: number;
  transportPerAdult: number;
}

export interface Source {
  label: string;
  url: string;
}

export interface CountryProfile {
  id: string;
  name: string;
  flag: string;
  currency: string;
  visaResidencyCostPerAdult: number;
  healthInsuranceMonthlyPerAdult: number;
  incomeTaxEstimatePct: number;
  vatPct: number;
  notes: string;
  tiers: Record<CityTierId, CostOfLivingTier>;
  sources: Source[];
  asOf: string;
}

export interface SelectedCountry {
  countryId: string;
  tier: CityTierId;
}

export interface PlannerState {
  household: Household;
  financial: FinancialProfile;
  selectedCountries: SelectedCountry[];
}

export interface CountryResult {
  countryId: string;
  countryName: string;
  flag: string;
  tier: CityTierId;
  tierLabel: string;
  rent: number;
  groceries: number;
  utilities: number;
  transport: number;
  healthInsurance: number;
  carryOverExpenses: number;
  buffer: number;
  monthlyCost: number;
  monthlyIncome: number;
  monthlySurplus: number;
  oneTimeCost: number;
  savingsAfterMove: number;
  runwayMonths: number | null;
  paybackMonths: number | null;
}
