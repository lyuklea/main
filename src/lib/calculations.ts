import { COUNTRIES, CITY_TIER_LABELS } from '../data/countries';
import type { CountryResult, Household, FinancialProfile, SelectedCountry } from '../types';

// Children are assumed to cost roughly half an adult's share of groceries,
// transport, and health insurance — a simplification the user can reason
// about, not a precise per-country figure.
const CHILD_COST_FACTOR = 0.5;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

function rentForHousehold(rent1Bed: number, rent3Bed: number, householdSize: number): number {
  if (householdSize <= 2) return rent1Bed;
  if (householdSize >= 4) return rent3Bed;
  return lerp(rent1Bed, rent3Bed, (householdSize - 2) / 2);
}

export function calculateCountryResult(
  selected: SelectedCountry,
  household: Household,
  financial: FinancialProfile,
): CountryResult | null {
  const country = COUNTRIES.find((c) => c.id === selected.countryId);
  if (!country) return null;
  const tier = country.tiers[selected.tier];

  const adultEquivalents = household.adults + household.children * CHILD_COST_FACTOR;
  const householdSize = household.adults + household.children;

  const rent = rentForHousehold(tier.rent1Bed, tier.rent3Bed, householdSize);
  const groceries = tier.groceriesPerAdult * adultEquivalents;
  const utilities = tier.utilities;
  const transport = tier.transportPerAdult * adultEquivalents;
  const healthInsurance = country.healthInsuranceMonthlyPerAdult * adultEquivalents;

  const carryOverExpenses =
    financial.expenses.debtPayments +
    financial.expenses.childcare +
    financial.expenses.subscriptions +
    financial.expenses.other;

  const subtotal = rent + groceries + utilities + transport + healthInsurance + carryOverExpenses;
  const buffer = subtotal * (financial.bufferPct / 100);
  const monthlyCost = subtotal + buffer;

  const monthlyIncome =
    (financial.currentIncomeContinues ? financial.currentMonthlyIncomeNet : 0) +
    financial.expectedLocalSalaryNet;

  const monthlySurplus = monthlyIncome - monthlyCost;

  const visaCost =
    financial.relocation.visaFeesOverride ??
    country.visaResidencyCostPerAdult * household.adults +
      country.visaResidencyCostPerAdult * CHILD_COST_FACTOR * household.children;

  const oneTimeCost = visaCost + financial.relocation.flights + financial.relocation.shipping;

  const savingsAfterMove = financial.savings - oneTimeCost - financial.relocation.emergencyBuffer;

  const runwayMonths = monthlySurplus < 0 ? savingsAfterMove / Math.abs(monthlySurplus) : null;
  const paybackMonths = monthlySurplus > 0 ? oneTimeCost / monthlySurplus : null;

  return {
    countryId: country.id,
    countryName: country.name,
    flag: country.flag,
    tier: selected.tier,
    tierLabel: `${tier.label} (${CITY_TIER_LABELS[selected.tier]})`,
    rent,
    groceries,
    utilities,
    transport,
    healthInsurance,
    carryOverExpenses,
    buffer,
    monthlyCost,
    monthlyIncome,
    monthlySurplus,
    oneTimeCost,
    savingsAfterMove,
    runwayMonths,
    paybackMonths,
  };
}

export function calculateAllResults(
  selectedCountries: SelectedCountry[],
  household: Household,
  financial: FinancialProfile,
): CountryResult[] {
  return selectedCountries
    .map((s) => calculateCountryResult(s, household, financial))
    .filter((r): r is CountryResult => r !== null);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatMonths(value: number | null): string {
  if (value === null) return '—';
  if (!Number.isFinite(value)) return '—';
  if (value < 0) return 'Immediately short';
  return `${value.toFixed(1)} mo`;
}
