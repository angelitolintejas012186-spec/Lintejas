/* Shared venture list — the ONE hand-kept mapping of which NegosyoPlans-family
   members the site surfaces, their display name, flagship flag and one-line purpose.
   Status, link and base icon are read from the homepage deck (ProductDeck CARDS) by
   whoever renders it, so this file holds no status/url (no second source of truth).
   Both the Portfolio page (pages/Companies.tsx) and the Footer ventures column
   (components/Footer.tsx) derive from this — no second hand-kept list anywhere. */
export interface PortfolioItem {
  v:        string   // = ProductDeck CARDS `v` id (status/url/base icon come from there)
  name:     string
  purpose:  string
  flagship?: boolean
  short?:   string   // compact label for tight contexts (footer column); defaults to name
}

export const PORTFOLIO: PortfolioItem[] = [
  { v: 'blueprints', name: 'NegosyoPlans', flagship: true,
    purpose: 'Ready-made business plans for Filipino entrepreneurs — start with a complete plan, not a guess.' },
  { v: 'matthew', name: 'Matthew System',
    purpose: "A comprehensive business-manager dashboard that watches your numbers so you don't go under." },
  { v: 'lite', name: 'Matthew Lite',
    purpose: 'Know every day if you really earned — sales, expenses, profit and your cash split at a glance.' },
  { v: 'courses', name: 'ZAM Academy',
    purpose: 'Practical digital-marketing courses — marketing that sells, not just gets likes.' },
  { v: 'supplier', name: 'WDRICH Supplier Registration', short: 'WDRICH',
    purpose: 'List your business where owners look for suppliers.' },
  { v: 'contribute', name: 'Share Your Business Model', short: 'Share your model',
    purpose: 'Have a real model but no blueprint yet? Tell us how it works — we may build it next.' },
  { v: 'skillvue', name: 'SkillVue',
    purpose: 'The human layer of the smart factory — a safety and workforce platform planned for food manufacturing.' },
  { v: 'biyaheph', name: 'BiyahePH',
    purpose: 'Maps and commute directions for the Philippines — planned for Android and iOS.' },
]
