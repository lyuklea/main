# EuroMove Budget Planner

A client-side app for planning an immigration budget to European countries.
Enter your household, income, savings, and recurring costs once, then compare
the estimated monthly and one-time cost of relocating across multiple
countries and city tiers to see how much financial room you'd have.

## What it does

- **Ingests your finances**: household size, savings, current/expected
  income, recurring costs that carry over (debts, childcare, subscriptions),
  and a one-time relocation budget (flights, shipping, visa fees, emergency
  buffer).
- **Reference cost-of-living data** for 12 European countries (Germany,
  Netherlands, Portugal, Spain, France, Italy, Ireland, Austria, Switzerland,
  Sweden, Poland, Czech Republic), each with three named-city tiers (capital,
  major city, smaller city/town). Every country lists the sources used
  (Numbeo, OECD Taxing Wages, government visa/tax pages, etc.) and an
  "as of" note under "Sources & last verified" in the country picker. These
  numbers were gathered via web research, not a live data feed — this
  environment's direct fetch of primary sources was blocked, so figures were
  triangulated from search-result snippets and secondary mirrors rather than
  read straight off the source page. Treat them as directional and check the
  linked sources before relying on them; all are still editable.
- **Computes financial room** per selected country: estimated monthly cost
  (rent, groceries, utilities, transport, health insurance, carried-over
  costs, safety buffer), monthly surplus/deficit, one-time move cost, savings
  remaining after the move, and either a runway (months a deficit is
  affordable) or payback period (months to recoup relocation costs).
- **Compares side by side** with a stacked cost-breakdown chart and a sortable
  comparison table.
- Persists everything to `localStorage` — no backend, no account, all data
  stays in your browser.

## Development

```bash
npm install
npm run dev      # start dev server
npm run build    # type-check + production build
npm run lint     # oxlint
```

## Notes on the model

- Children are assumed to cost roughly half an adult's share of groceries,
  transport, and health insurance.
- Rent scales between a country's 1-bedroom and 3-bedroom estimates based on
  household size.
- Visa/residency cost defaults to a per-country estimate (per adult, with
  children at half cost) but can be overridden with a flat figure.
- All amounts are treated as EUR; countries outside the eurozone use an
  approximate EUR-equivalent figure.
