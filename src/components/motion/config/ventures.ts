/**
 * Node data for the NetworkGraph.
 * Add new ventures here — the graph picks them up automatically.
 */
export interface VentureNode {
  id:      string
  label:   string
  status:  'live' | 'coming-soon' | 'pilot' | 'in-development'
  radius:  number   // visual node size (relative units)
  color:   string   // CSS color string
  angle:   number   // initial orbit angle in radians
  orbit:   number   // orbit radius from centre node (relative units)
}

export const CENTRE_NODE = {
  id:    'lintejas',
  label: 'Lintejas',
  color: '#E8C766',   // gold-bright — brightest node
  radius: 18,
}

// The Lintejas brands (same ventures the homepage deck + Portfolio show). Live
// ventures are gold; RomLet (pilot programme) is bronze. NegosyoPlans is the
// brightest/largest node (the flagship). Positions are decorative only.
export const VENTURE_NODES: VentureNode[] = [
  {
    id:     'negosyo-plans',
    label:  'NegosyoPlans',
    status: 'live',         // flagship — the live, selling product
    radius: 12,
    color:  '#D4A843',      // gold (live)
    angle:  Math.PI * 0.25,
    orbit:  150,
  },
  {
    id:     'matthew',
    label:  'Matthew System',
    status: 'live',
    radius: 10,
    color:  '#D4A843',
    angle:  Math.PI * 0.70,
    orbit:  145,
  },
  {
    id:     'matthew-lite',
    label:  'Matthew Lite',
    status: 'live',
    radius: 9,
    color:  '#D4A843',
    angle:  Math.PI * 1.05,
    orbit:  155,
  },
  {
    id:     'staycation',
    label:  'Staycation Booking',
    status: 'coming-soon',   // coming soon (27 Oct 2026) — not open to customers yet
    radius: 8,
    color:  '#9A7A2E',       // bronze (not live)
    angle:  Math.PI * 1.20,
    orbit:  168,
  },
  {
    id:     'zam-academy',
    label:  'ZAM Academy',
    status: 'live',
    radius: 9,
    color:  '#D4A843',
    angle:  Math.PI * 1.35,
    orbit:  140,
  },
  {
    id:     'wdrich',
    label:  'WDRICH',
    status: 'live',
    radius: 9,
    color:  '#D4A843',
    angle:  Math.PI * 1.65,
    orbit:  150,
  },
  {
    id:     'share-model',
    label:  'Share Model',
    status: 'live',
    radius: 8,
    color:  '#D4A843',
    angle:  Math.PI * 1.95,
    orbit:  135,
  },
  {
    id:     'skillvue',
    label:  'RomLet',        // formerly SkillVue (renamed 19 Oct 2026)
    status: 'pilot',         // pilot programme open at romlet.tech — not live yet
    radius: 9,
    color:  '#9A7A2E',       // bronze (not live)
    angle:  Math.PI * 0.50,
    orbit:  162,
  },
]
