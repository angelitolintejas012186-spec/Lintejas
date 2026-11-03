/* NegosyoPlans agent rates shown on /affiliates (Angie, 3 Nov 2026).
   Blueprint commission: 25% for orders created before Monday 17 Nov 2026 00:00 Manila, 20% from then on — the same
   cutoff as the shop (negosyoplan16may js/np-price-notice.js PRICE_NOTICE_UNTIL, the shop's single constant; keep the
   two in step). The page switches its wording by itself at the cutoff. Other rates are unchanged. */

export const NP_BLUEPRINT_RATE_CUTOFF = '2026-11-17T00:00:00+08:00'
export const NP_BLUEPRINT_RATE_CUTOFF_MS = Date.parse(NP_BLUEPRINT_RATE_CUTOFF)

/** True from the cutoff on (20%); false before it (25%, with the "20% from 17 Nov" note). */
export function npBlueprintRateIsNew(nowMs: number = Date.now()): boolean {
  return nowMs >= NP_BLUEPRINT_RATE_CUTOFF_MS
}
/** The blueprint rate to show at nowMs: '25%' before the cutoff, '20%' from it. */
export function npBlueprintRate(nowMs: number = Date.now()): '25%' | '20%' {
  return npBlueprintRateIsNew(nowMs) ? '20%' : '25%'
}
