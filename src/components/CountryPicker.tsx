import { COUNTRIES, CITY_TIER_LABELS } from '../data/countries';
import type { CityTierId, SelectedCountry } from '../types';

const TIERS: CityTierId[] = ['capital', 'major', 'smaller'];

interface CountryPickerProps {
  selected: SelectedCountry[];
  onChange: (selected: SelectedCountry[]) => void;
}

export function CountryPicker({ selected, onChange }: CountryPickerProps) {
  const isSelected = (id: string) => selected.some((s) => s.countryId === id);
  const tierFor = (id: string) => selected.find((s) => s.countryId === id)?.tier ?? 'capital';

  function toggleCountry(id: string) {
    if (isSelected(id)) {
      onChange(selected.filter((s) => s.countryId !== id));
    } else {
      onChange([...selected, { countryId: id, tier: 'capital' }]);
    }
  }

  function setTier(id: string, tier: CityTierId) {
    onChange(selected.map((s) => (s.countryId === id ? { ...s, tier } : s)));
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Countries to compare</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Pick one or more destinations and a city tier for each. Figures are editable ballpark estimates.
      </p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {COUNTRIES.map((country) => {
          const active = isSelected(country.id);
          return (
            <div
              key={country.id}
              className={`rounded-xl border p-3 transition ${
                active
                  ? 'border-indigo-400 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-950/40'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleCountry(country.id)}
                className="flex w-full items-center justify-between text-left"
              >
                <span className="font-medium text-slate-800 dark:text-slate-100">
                  {country.flag} {country.name}
                </span>
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs ${
                    active
                      ? 'border-indigo-500 bg-indigo-500 text-white'
                      : 'border-slate-300 text-transparent dark:border-slate-600'
                  }`}
                >
                  ✓
                </span>
              </button>
              {active && (
                <div className="mt-3 flex flex-col gap-1">
                  {TIERS.map((tier) => (
                    <label key={tier} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <input
                        type="radio"
                        name={`tier-${country.id}`}
                        checked={tierFor(country.id) === tier}
                        onChange={() => setTier(country.id, tier)}
                        className="h-3.5 w-3.5 text-indigo-600 focus:ring-indigo-500"
                      />
                      {country.tiers[tier].label} — {CITY_TIER_LABELS[tier]}
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
