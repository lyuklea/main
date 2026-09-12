import { useMemo } from 'react';
import { NumberField, Section, ToggleField } from './components/Field';
import { CountryPicker } from './components/CountryPicker';
import { ResultsPanel } from './components/ResultsPanel';
import { usePersistedState } from './lib/storage';
import { calculateAllResults } from './lib/calculations';
import type { PlannerState } from './types';

const DEFAULT_STATE: PlannerState = {
  household: { adults: 1, children: 0 },
  financial: {
    savings: 15000,
    currentIncomeContinues: true,
    currentMonthlyIncomeNet: 3200,
    expectedLocalSalaryNet: 0,
    expenses: {
      debtPayments: 0,
      childcare: 0,
      subscriptions: 40,
      other: 150,
    },
    relocation: {
      flights: 400,
      shipping: 800,
      visaFeesOverride: null,
      emergencyBuffer: 2000,
    },
    bufferPct: 10,
  },
  selectedCountries: [{ countryId: 'pt', tier: 'capital' }],
};

function App() {
  const [state, setState] = usePersistedState<PlannerState>(DEFAULT_STATE);

  const results = useMemo(
    () => calculateAllResults(state.selectedCountries, state.household, state.financial),
    [state.selectedCountries, state.household, state.financial],
  );

  function updateHousehold(patch: Partial<PlannerState['household']>) {
    setState((s) => ({ ...s, household: { ...s.household, ...patch } }));
  }

  function updateFinancial(patch: Partial<PlannerState['financial']>) {
    setState((s) => ({ ...s, financial: { ...s.financial, ...patch } }));
  }

  function updateExpenses(patch: Partial<PlannerState['financial']['expenses']>) {
    setState((s) => ({
      ...s,
      financial: { ...s.financial, expenses: { ...s.financial.expenses, ...patch } },
    }));
  }

  function updateRelocation(patch: Partial<PlannerState['financial']['relocation']>) {
    setState((s) => ({
      ...s,
      financial: { ...s.financial, relocation: { ...s.financial.relocation, ...patch } },
    }));
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-16 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">EuroMove Budget Planner</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Enter your finances once, then compare the monthly and one-time cost of relocating to different
            European countries to see how much financial room you'd have.
          </p>
        </div>
      </header>

      <main className="mx-auto mt-6 flex max-w-5xl flex-col gap-5 px-4">
        <Section title="Household" description="Who is moving?">
          <NumberField label="Adults" value={state.household.adults} min={1} onChange={(v) => updateHousehold({ adults: v })} />
          <NumberField label="Children" value={state.household.children} min={0} onChange={(v) => updateHousehold({ children: v })} />
        </Section>

        <Section title="Income & savings" description="What you have and what you'll bring in after moving.">
          <NumberField
            label="Total liquid savings"
            value={state.financial.savings}
            step={100}
            suffix="€"
            onChange={(v) => updateFinancial({ savings: v })}
          />
          <div className="flex flex-col gap-3">
            <ToggleField
              label="Current income continues after moving"
              hint="Check this if your job is remote or you keep the same income."
              checked={state.financial.currentIncomeContinues}
              onChange={(v) => updateFinancial({ currentIncomeContinues: v })}
            />
          </div>
          <NumberField
            label="Current net monthly income"
            value={state.financial.currentMonthlyIncomeNet}
            step={50}
            suffix="€/mo"
            onChange={(v) => updateFinancial({ currentMonthlyIncomeNet: v })}
          />
          <NumberField
            label="Expected local salary (net, if any)"
            value={state.financial.expectedLocalSalaryNet}
            step={50}
            suffix="€/mo"
            hint="Add this if you (or a partner) expect to also earn local income."
            onChange={(v) => updateFinancial({ expectedLocalSalaryNet: v })}
          />
        </Section>

        <Section
          title="Recurring costs that carry over"
          description="Costs that don't change based on country — debts, childcare, subscriptions."
        >
          <NumberField
            label="Debt payments"
            value={state.financial.expenses.debtPayments}
            step={25}
            suffix="€/mo"
            onChange={(v) => updateExpenses({ debtPayments: v })}
          />
          <NumberField
            label="Childcare / school"
            value={state.financial.expenses.childcare}
            step={25}
            suffix="€/mo"
            onChange={(v) => updateExpenses({ childcare: v })}
          />
          <NumberField
            label="Subscriptions"
            value={state.financial.expenses.subscriptions}
            step={5}
            suffix="€/mo"
            onChange={(v) => updateExpenses({ subscriptions: v })}
          />
          <NumberField
            label="Other recurring costs"
            value={state.financial.expenses.other}
            step={25}
            suffix="€/mo"
            onChange={(v) => updateExpenses({ other: v })}
          />
          <NumberField
            label="Safety buffer on top of estimated costs"
            value={state.financial.bufferPct}
            step={1}
            suffix="%"
            hint="Cushion for costs the model doesn't capture exactly."
            onChange={(v) => updateFinancial({ bufferPct: v })}
          />
        </Section>

        <Section title="One-time relocation budget" description="Costs incurred once, around the move itself.">
          <NumberField
            label="Flights (total for household)"
            value={state.financial.relocation.flights}
            step={50}
            suffix="€"
            onChange={(v) => updateRelocation({ flights: v })}
          />
          <NumberField
            label="Shipping / moving costs"
            value={state.financial.relocation.shipping}
            step={50}
            suffix="€"
            onChange={(v) => updateRelocation({ shipping: v })}
          />
          <NumberField
            label="Visa / residency fee override"
            value={state.financial.relocation.visaFeesOverride ?? 0}
            step={25}
            suffix="€"
            hint="Leave at 0 to use each country's estimated visa cost automatically."
            onChange={(v) => updateRelocation({ visaFeesOverride: v === 0 ? null : v })}
          />
          <NumberField
            label="Emergency buffer to keep untouched"
            value={state.financial.relocation.emergencyBuffer}
            step={100}
            suffix="€"
            onChange={(v) => updateRelocation({ emergencyBuffer: v })}
          />
        </Section>

        <CountryPicker
          selected={state.selectedCountries}
          onChange={(selectedCountries) => setState((s) => ({ ...s, selectedCountries }))}
        />

        <ResultsPanel results={results} />

        <p className="text-center text-xs text-slate-400 dark:text-slate-600">
          Country figures are research-sourced estimates in EUR (see "Sources & last verified" under each country
          above) — not a live feed. Verify visa fees, taxes, and cost of living for your specific situation before
          making decisions. Your data is stored only in this browser.
        </p>
      </main>
    </div>
  );
}

export default App;
