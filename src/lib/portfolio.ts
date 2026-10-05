/* Shared venture list — DERIVED from the homepage deck's CARDS (the single source
   of truth). Membership and order come from CARDS itself (PORTFOLIO = CARDS.map),
   so adding/removing a deck card automatically adds/removes it here — no second
   hand-kept list to drift. Status, link and base icon are read from the same CARDS
   by whoever renders (pages/Companies.tsx, components/Footer.tsx), so this file
   holds no status/url. The only thing it adds is the Portfolio-specific display
   name + one-line purpose + flagship flag that a deck card doesn't carry. */
import { CARDS } from '../components/ProductDeck'

export interface PortfolioItem {
  v:        string   // = ProductDeck CARDS `v` id (status/url/base icon come from there)
  name:     string
  purpose:  string
  flagship?: boolean
  short?:   string   // compact label for tight contexts (footer column); defaults to name
}

/* Portfolio display copy, keyed by the deck CARDS `v` id. NOT a venture list —
   it only overlays the copy the deck card doesn't hold. A card with no entry
   here still appears (falls back to its deck title/hook below). */
const META: Record<string, Omit<PortfolioItem, 'v'>> = {
  blueprints: { name: 'NegosyoPlans', flagship: true,
    purpose: 'Ready-made business plans for Filipino entrepreneurs — start with a complete plan, not a guess.' },
  matthew: { name: 'Matthew System',
    purpose: "A comprehensive business-manager dashboard that watches your numbers so you don't go under." },
  lite: { name: 'Matthew Lite',
    purpose: 'Know every day if you really earned — sales, expenses, profit and your cash split at a glance.' },
  courses: { name: 'ZAM Academy',
    purpose: 'Practical digital-marketing courses — marketing that sells, not just gets likes.' },
  supplier: { name: 'WDRICH Supplier Registration', short: 'WDRICH',
    purpose: 'Register as a supplier for Filipino entrepreneurs — or share your own business model and get credited in a blueprint.' },
  contribute: { name: 'Share Your Business Model', short: 'Share your model',
    purpose: 'Have a real model but no blueprint yet? Tell us how it works — we may build it next.' },
  skillvue: { name: 'SkillVue',
    purpose: 'The human layer of the smart factory — a safety and workforce platform planned for food manufacturing.' },
  biyaheph: { name: 'BiyahePH',
    purpose: 'Maps and commute directions for the Philippines — planned for Android and iOS.' },
}

export const PORTFOLIO: PortfolioItem[] = CARDS.map(c => ({
  v:        c.v,
  name:     META[c.v]?.name    ?? c.title ?? c.v,
  purpose:  META[c.v]?.purpose ?? c.hook  ?? '',
  flagship: META[c.v]?.flagship,
  short:    META[c.v]?.short,
}))
