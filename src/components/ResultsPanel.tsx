import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { CountryResult } from '../types';
import { formatCurrency, formatMonths } from '../lib/calculations';

const BREAKDOWN_COLORS = {
  rent: '#6366f1',
  groceries: '#22c55e',
  utilities: '#f59e0b',
  transport: '#06b6d4',
  healthInsurance: '#ec4899',
  carryOverExpenses: '#a855f7',
  buffer: '#94a3b8',
};

function CountryLabel({ result }: { result: CountryResult }) {
  return (
    <span>
      {result.flag} {result.countryName}
    </span>
  );
}

export function ResultsPanel({ results }: { results: CountryResult[] }) {
  if (results.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        Select at least one country above to see your budget comparison.
      </section>
    );
  }

  const sorted = [...results].sort((a, b) => b.monthlySurplus - a.monthlySurplus);
  const chartData = sorted.map((r) => ({
    name: `${r.flag} ${r.countryName}`,
    Rent: Math.round(r.rent),
    Groceries: Math.round(r.groceries),
    Utilities: Math.round(r.utilities),
    Transport: Math.round(r.transport),
    'Health insurance': Math.round(r.healthInsurance),
    'Debts / other': Math.round(r.carryOverExpenses),
    Buffer: Math.round(r.buffer),
  }));

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Monthly cost breakdown</h2>
        <div className="mt-4 h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis type="number" tickFormatter={(v) => `€${v}`} />
              <YAxis type="category" dataKey="name" width={140} />
              <Tooltip formatter={(v) => `€${Number(v).toLocaleString()}`} />
              <Legend />
              <Bar dataKey="Rent" stackId="a" fill={BREAKDOWN_COLORS.rent} />
              <Bar dataKey="Groceries" stackId="a" fill={BREAKDOWN_COLORS.groceries} />
              <Bar dataKey="Utilities" stackId="a" fill={BREAKDOWN_COLORS.utilities} />
              <Bar dataKey="Transport" stackId="a" fill={BREAKDOWN_COLORS.transport} />
              <Bar dataKey="Health insurance" stackId="a" fill={BREAKDOWN_COLORS.healthInsurance} />
              <Bar dataKey="Debts / other" stackId="a" fill={BREAKDOWN_COLORS.carryOverExpenses} />
              <Bar dataKey="Buffer" stackId="a" fill={BREAKDOWN_COLORS.buffer} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Comparison</h2>
        <table className="mt-4 w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500 dark:border-slate-700 dark:text-slate-400">
              <th className="py-2 pr-4">Country</th>
              <th className="py-2 pr-4">Monthly cost</th>
              <th className="py-2 pr-4">Monthly income</th>
              <th className="py-2 pr-4">Surplus / deficit</th>
              <th className="py-2 pr-4">One-time move cost</th>
              <th className="py-2 pr-4">Savings after move</th>
              <th className="py-2 pr-4">Runway / payback</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={`${r.countryId}-${r.tier}`} className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-2 pr-4">
                  <CountryLabel result={r} />
                  <div className="text-xs text-slate-400">{r.tierLabel}</div>
                </td>
                <td className="py-2 pr-4">{formatCurrency(r.monthlyCost)}</td>
                <td className="py-2 pr-4">{formatCurrency(r.monthlyIncome)}</td>
                <td
                  className={`py-2 pr-4 font-semibold ${
                    r.monthlySurplus >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {formatCurrency(r.monthlySurplus)}
                </td>
                <td className="py-2 pr-4">{formatCurrency(r.oneTimeCost)}</td>
                <td
                  className={`py-2 pr-4 ${
                    r.savingsAfterMove >= 0 ? 'text-slate-700 dark:text-slate-200' : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {formatCurrency(r.savingsAfterMove)}
                </td>
                <td className="py-2 pr-4">
                  {r.monthlySurplus < 0
                    ? `${formatMonths(r.runwayMonths)} runway`
                    : r.paybackMonths !== null
                      ? `${formatMonths(r.paybackMonths)} payback`
                      : 'Sustainable'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
          Runway = months your remaining savings cover a monthly deficit. Payback = months of surplus needed to
          recover the one-time relocation cost. "Sustainable" means income covers costs with no deficit.
        </p>
      </section>
    </div>
  );
}
