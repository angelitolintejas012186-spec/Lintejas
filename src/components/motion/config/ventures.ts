/**
 * Node data for the NetworkGraph.
 * Add new ventures here — the graph picks them up automatically.
 */
export interface VentureNode {
  id:      string
  label:   string
  status:  'live' | 'coming-soon'
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

export const VENTURE_NODES: VentureNode[] = [
  {
    id:     'skillvue',
    label:  'SkillVue',
    status: 'live',
    radius: 13,
    color:  '#D4A843',      // gold
    angle:  Math.PI * 0.25,
    orbit:  160,
  },
  {
    id:     'mcis',
    label:  'MCIS',
    status: 'coming-soon',
    radius: 9,
    color:  '#9A7A2E',      // bronze
    angle:  Math.PI * 1.1,
    orbit:  140,
  },
  {
    id:     'scheduler',
    label:  'Staff Scheduler',
    status: 'coming-soon',
    radius: 9,
    color:  '#9A7A2E',      // bronze
    angle:  Math.PI * 1.7,
    orbit:  150,
  },
]
