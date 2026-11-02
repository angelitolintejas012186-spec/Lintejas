import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import { Send, ShieldCheck, Link2, Wallet, FileSignature, CheckCircle2 } from 'lucide-react'
import Reveal from '../components/ui/Reveal'
import { sendPilotSignup } from '../components/automation/submit'

/* ── Affiliates (/affiliates) — Angie, 2 Nov 2026 ─────────────────────────────────────────────────────────────
   One page, one form, every Lintejas brand. Taglish / English switch (the agent pages' copy, word for word where
   it exists). Where each application goes:
   • NegosyoPlans ticked → the shop's own agent system: POST https://negosyoplans.com/api/agent/apply (the same
     endpoint as negosyoplans.com/become-an-agent, tagged source "lintejas") → Admin → Agents → Applications.
     The shop requires its Cloudflare bot check on that form, so the widget is rendered here with the shop's public
     site key from /api/turnstile-config (which allows this origin). If the check cannot run here, the visitor is
     sent to the shop's own form instead — nothing is lost.
   • Any "coming soon" brand ticked → a waiting list row in Supabase pilot_signups (insert-only, the same table the
     Business Automation pilot uses), tagged "Affiliate waitlist: <brand>" in `automations`. No database change.
   Honest copy only: no income promises, rates only where a program is open, an application is not an approval. */

const NP = 'https://negosyoplans.com'
const GOLD = 'var(--gold)'
type Lang = 'tl' | 'en'
const LANG_KEY = 'lt_aff_lang'

const SOON = [
  { id: 'romlet', name: 'RomLet', tl: 'Software para sa competency ng mga manggagawa sa food manufacturing.', en: 'Workforce competency software for food manufacturers.' },
  { id: 'automation', name: 'Business Automation', tl: 'Order, booking at araw-araw na operasyon para sa maliliit na tindahan at kainan.', en: 'Ordering, bookings and daily operations for small shops and restaurants.' },
  { id: 'staycation', name: 'Staycation Booking', tl: 'Sariling booking page para sa mga may-ari ng staycation.', en: 'Direct booking pages for staycation owners.' },
] as const

const S = {
  tl: {
    chip: 'Lintejas Affiliate Program', h1a: 'Ibahagi ang isang Lintejas brand.', h1b: 'Kumita kada buwan.',
    lead: 'Isang application para sa lahat ng Lintejas brand. Makukuha mo ang sarili mong link at QR card, isang handang post, at page na nagpapakita ng mga customer at kita mo. Ipinapadala kada buwan sa GCash o Maya.',
    apply: 'Mag-apply bilang affiliate', see: 'Tingnan ang mga program',
    prog_h: 'Mga program', prog_p: 'Ang binabayad ng bawat brand ngayon. Ang rate ng mga brand na "paparating" ay itatakda kapag bukas na ang program nila.',
    open: 'Bukas na', soon: 'Paparating', np_desc: 'Business blueprints at Matthew System dashboard para sa mga Pilipinong negosyante at OFW.',
    r1: 'ng bawat blueprint na binili ng customer mo', r2: 'ng Matthew System pass, sa unang 12 buwan ng customer', r3: 'ng OFW bundle', r4: 'sa unang bayad na Matthew Lite ng customer',
    r_note: 'Sa iyo ang customer sa loob ng 30 araw mula nang pindutin ang link mo. Pinapadala kada buwan sa GCash o Maya kapag umabot na sa ₱500. Hindi kasama ang dati nang customer at ang sarili mong bili.',
    agent_link: 'Agent ka na? Buksan ang agent page →', soon_note: 'I-tsek sa form at ikaw ang unang sasabihan kapag bukas na.',
    how_h: 'Paano ito gumagana',
    s1_h: 'Mag-apply', s1_p: 'Punan ang form. Babasahin namin ito at kokontakin ka namin.',
    s2_h: 'Pirmahan ang kasunduan', s2_p: 'Ipapadala namin ang agent agreement. Pagkatapos, makukuha mo ang sarili mong code at link.',
    s3_h: 'Ibahagi ang link mo', s3_p: 'Nasa agent page mo ang link, QR card at handang post. Email lang, walang password.',
    s4_h: 'Matanggap ang kita', s4_p: 'Makikita mo ang mga customer at kita mo. Ipinapadala kada buwan sa GCash o Maya.',
    form_h: 'Mag-apply bilang affiliate', form_p: 'Parehong tanong sa NegosyoPlans agent form, at kung aling brand ang gusto mong ibahagi.',
    f_name: 'Buong pangalan', f_email: 'Email', f_mobile: 'GCash / Maya number', f_wallet: 'Saan ipapadala ang kita', f_city: 'Lungsod o probinsya',
    f_channel: 'Saan mo ibabahagi ang link?', ch_pick: 'Pumili…', ch_fb: 'Facebook (sariling page o profile)', ch_groups: 'Facebook groups o group chats',
    ch_friends: 'Pamilya at kaibigan', ch_biz: 'Sa sarili kong negosyo o mga kliyente', ch_other: 'Iba pa',
    f_brands: 'Mga brand na gusto mong ibahagi', f_note: 'Kaunting kuwento tungkol sa iyo (hindi kailangan)',
    f_agree: 'Nabasa ko ang mga patakaran at sumasang-ayon ako. 18 taong gulang pataas ako at akin ang GCash o Maya na ito.',
    rules_h: 'Mga patakaran',
    k1: 'Ang customer mismo ang magbabayad sa official checkout. Huwag kailanman tumanggap ng cash o bayad sa personal mong GCash o Maya.',
    k2: 'Laging sabihin sa customer na may commission ka.', k3: 'Walang pangakong kita — huwag mangako ng kikitain ng customer o ng sinuman.',
    k4: 'Ang commission ay para lang sa bagong customer na dumaan sa link mo.',
    bot: 'May tahimik na security check (Cloudflare) para sa NegosyoPlans application.',
    submit: 'Ipadala ang application', sending: 'Ipinapadala…',
    done_np: 'Salamat! Natanggap namin ang NegosyoPlans application mo. Kokontakin ka namin sa email sa loob ng ilang araw.',
    done_wait: 'Nasa waiting list ka na para sa: {list}. Sasabihan ka namin kapag bukas na.',
    e_name: 'Ilagay ang buong pangalan mo.', e_email: 'Ilagay ang tamang email.', e_mobile: 'Ang number ay 11 digits at nagsisimula sa 09.',
    e_city: 'Ilagay ang lungsod o probinsya mo.', e_channel: 'Pumili kung saan mo ibabahagi ang link.', e_agree: 'Pakitsek ang kahon para sumang-ayon sa mga patakaran.',
    e_brand: 'Pumili ng kahit isang brand.', e_many: 'Masyadong maraming subok — maghintay nang kaunti at subukan ulit.',
    e_bot: 'Hindi tumakbo ang security check dito. Mag-apply na lang sa NegosyoPlans mismo:', e_closed: 'Sarado muna ang NegosyoPlans agent program. Subukan ulit sa susunod.',
    e_generic: 'Hindi maipadala ngayon. Subukan ulit mamaya.', e_wait: 'Hindi naisama sa waiting list:',
    privacy: 'Hindi namin ipinapakita sa customer ang pangalan o email mo.',
  },
  en: {
    chip: 'Lintejas Affiliate Program', h1a: 'Share a Lintejas brand.', h1b: 'Earn every month.',
    lead: 'One application covers every Lintejas brand. You get your own link and QR card, a ready-made post, and a page that shows your customers and earnings. Paid monthly to GCash or Maya.',
    apply: 'Apply as an affiliate', see: 'See the programs',
    prog_h: 'Programs', prog_p: 'What each brand pays today. Rates for the brands marked "coming soon" are set when that program opens.',
    open: 'Open now', soon: 'Coming soon', np_desc: 'Business blueprints and the Matthew System dashboard for Filipino entrepreneurs and OFWs.',
    r1: 'of every blueprint your customer buys', r2: 'of Matthew System passes, for the customer’s first 12 months', r3: 'of the OFW bundle', r4: 'for a customer’s first paid Matthew Lite',
    r_note: 'A customer counts for 30 days after tapping your link. Paid monthly to GCash or Maya once it reaches ₱500. Existing customers and your own purchases don’t count.',
    agent_link: 'Already an agent? Open your agent page →', soon_note: 'Tick it on the form and we’ll tell you first when it opens.',
    how_h: 'How it works',
    s1_h: 'Apply', s1_p: 'Fill in the form. We read every application and will contact you.',
    s2_h: 'Sign the agreement', s2_p: 'We send you the agent agreement. After that you get your own code and link.',
    s3_h: 'Share your link', s3_p: 'Your link, QR card and a ready-made post are on your agent page. Just your email, no password.',
    s4_h: 'Get paid', s4_p: 'Your page shows your customers and earnings. Paid monthly to GCash or Maya.',
    form_h: 'Apply as an affiliate', form_p: 'The same questions as the NegosyoPlans agent form, plus which brands you want to share.',
    f_name: 'Full name', f_email: 'Email', f_mobile: 'GCash / Maya number', f_wallet: 'Where to send your earnings', f_city: 'City or province',
    f_channel: 'Where will you share your link?', ch_pick: 'Choose…', ch_fb: 'Facebook (own page or profile)', ch_groups: 'Facebook groups or group chats',
    ch_friends: 'Family and friends', ch_biz: 'In my own business or with my clients', ch_other: 'Other',
    f_brands: 'Brands you want to share', f_note: 'A little about you (optional)',
    f_agree: 'I have read the rules and I agree. I am 18 or older and this GCash or Maya is mine.',
    rules_h: 'The rules',
    k1: 'The customer pays at the official checkout. Never accept cash or payment to your own GCash or Maya.',
    k2: 'Always tell the customer you earn a commission.', k3: 'No income promises — never promise earnings to a customer or anyone else.',
    k4: 'Commission is only for new customers who come through your link.',
    bot: 'A quiet security check (Cloudflare) runs for the NegosyoPlans application.',
    submit: 'Send my application', sending: 'Sending…',
    done_np: 'Thank you! We received your NegosyoPlans application. We’ll contact you by email within a few days.',
    done_wait: 'You’re on the waiting list for: {list}. We’ll tell you when it opens.',
    e_name: 'Enter your full name.', e_email: 'Enter a valid email.', e_mobile: 'The number is 11 digits and starts with 09.',
    e_city: 'Enter your city or province.', e_channel: 'Choose where you’ll share your link.', e_agree: 'Please tick the box to agree to the rules.',
    e_brand: 'Pick at least one brand.', e_many: 'Too many tries — please wait a bit and try again.',
    e_bot: 'The security check couldn’t run here. Please apply on NegosyoPlans directly:', e_closed: 'The NegosyoPlans agent program is closed for now. Please try again later.',
    e_generic: 'Couldn’t send right now. Please try again in a few minutes.', e_wait: 'Couldn’t add you to the waiting list:',
    privacy: 'We never show your name or email to customers.',
  },
} as const
type Key = keyof typeof S.en

const CHANNELS = ['facebook', 'groups', 'friends', 'own_business', 'other'] as const
const CH_KEY: Record<string, Key> = { facebook: 'ch_fb', groups: 'ch_groups', friends: 'ch_friends', own_business: 'ch_biz', other: 'ch_other' }

declare global {
  interface Window { turnstile?: { render: (el: HTMLElement, o: Record<string, unknown>) => string; reset: (id?: string) => void } }
}

/* The shop's bot check, rendered here only when the shop says its agent form needs it. */
function useShopBotCheck(enabled: boolean) {
  const box = useRef<HTMLDivElement>(null)
  const id = useRef<string | null>(null)
  const [token, setToken] = useState('')
  const [state, setState] = useState<'off' | 'loading' | 'ready' | 'failed'>('off')
  useEffect(() => {
    if (!enabled || id.current !== null) return
    let gone = false
    setState('loading')
    fetch(NP + '/api/turnstile-config').then(r => r.ok ? r.json() : null).then((c: { siteKey?: string; enforce?: string[] } | null) => {
      if (gone) return
      if (!c || !c.siteKey || !(c.enforce || []).includes('agent_apply')) { setState('off'); return }
      const draw = () => {
        if (gone || !box.current || !window.turnstile) return
        try {
          id.current = window.turnstile.render(box.current, {
            sitekey: c.siteKey, size: 'flexible', appearance: 'interaction-only',
            callback: (t: string) => { setToken(t); setState('ready') },
            'expired-callback': () => setToken(''),
            'error-callback': () => { setToken(''); setState('failed') },
          })
        } catch { setState('failed') }
      }
      if (window.turnstile) { draw(); return }
      const s = document.createElement('script')
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      s.async = true; s.onload = draw; s.onerror = () => setState('failed')
      document.head.appendChild(s)
    }).catch(() => { if (!gone) setState('off') })
    return () => { gone = true }
  }, [enabled])
  const reset = () => { setToken(''); try { if (id.current !== null) window.turnstile?.reset(id.current) } catch { /* fine */ } }
  return { box, token, state, reset }
}

export default function Affiliates() {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const [lang, setLang] = useState<Lang>(() => { try { return localStorage.getItem(LANG_KEY) === 'tl' ? 'tl' : 'en' } catch { return 'en' } })
  const t = (k: Key) => S[lang][k] as string
  const pick = (l: Lang) => { setLang(l); try { localStorage.setItem(LANG_KEY, l) } catch { /* private mode */ } }

  const [f, setF] = useState({ name: '', email: '', mobile: '', walletType: 'GCash', city: '', channel: '', note: '', website: '' })
  const [brands, setBrands] = useState<Record<string, boolean>>({ negosyoplans: true })
  const [agree, setAgree] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<{ msg: string; fallback?: boolean } | null>(null)
  const [done, setDone] = useState<{ np: boolean; wait: string[] } | null>(null)
  const doneRef = useRef<HTMLDivElement>(null)
  const bot = useShopBotCheck(!!brands.negosyoplans)
  const up = (k: keyof typeof f) => (e: { target: { value: string } }) => setF(p => ({ ...p, [k]: e.target.value }))

  useEffect(() => { if (done) doneRef.current?.focus() }, [done])

  function check(): string | null {
    const m = f.mobile.replace(/[\s-]/g, '')
    if (f.name.trim().length < 2) return t('e_name')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) return t('e_email')
    if (!/^09\d{9}$/.test(m)) return t('e_mobile')
    if (!f.city.trim()) return t('e_city')
    if (!f.channel) return t('e_channel')
    if (!Object.values(brands).some(Boolean)) return t('e_brand')
    if (!agree) return t('e_agree')
    return null
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (busy) return
    const bad = check(); if (bad) { setErr({ msg: bad }); return }
    setErr(null); setBusy(true)
    let npOk = false
    try {
      if (brands.negosyoplans) {
        if (f.website.trim()) { npOk = true } else {
          const r = await fetch(NP + '/api/agent/apply', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: f.name.trim(), email: f.email.trim(), mobile: f.mobile.replace(/[\s-]/g, ''), walletType: f.walletType,
              city: f.city.trim(), channel: f.channel, note: f.note.trim(), agree: true, lang, source: 'lintejas', turnstileToken: bot.token }),
          })
          bot.reset()
          if (r.status === 403) { setErr({ msg: t('e_bot'), fallback: true }); return }
          if (r.status === 404) { setErr({ msg: t('e_closed') }); return }
          if (r.status === 429) { setErr({ msg: t('e_many') }); return }
          if (r.status === 400) { const j = await r.json().catch(() => ({})); const k = ('e_' + String(j.field || '')) as Key; setErr({ msg: k in S[lang] ? t(k) : t('e_generic') }); return }
          if (!r.ok) { setErr({ msg: t('e_generic') }); return }
          npOk = true
        }
      }
      const wait = SOON.filter(b => brands[b.id]).map(b => b.name)
      if (wait.length && !f.website.trim()) {
        try {
          await sendPilotSignup({ name: f.name.trim(), business_name: 'Affiliate waitlist', business_type: 'Other', country: 'Philippines', email: f.email.trim(),
            mobile: f.mobile.replace(/[\s-]/g, '') || null, messenger: null, automations: wait.map(n => 'Affiliate waitlist: ' + n),
            time_sink: [f.city.trim(), t(CH_KEY[f.channel]), f.note.trim()].filter(Boolean).join(' · ').slice(0, 300) || null, consent: true })
        } catch (x) {
          if (npOk) { setDone({ np: true, wait: [] }); setErr({ msg: t('e_wait') + ' ' + (x as Error).message }); return }
          setErr({ msg: t('e_wait') + ' ' + (x as Error).message }); return
        }
      }
      setDone({ np: npOk, wait })
    } catch {
      setErr({ msg: t('e_generic') })
    } finally { setBusy(false) }
  }

  const card: CSSProperties = { background: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }
  const input = 'w-full min-h-[46px] rounded-xl border px-3 py-2 text-[15px] bg-[rgba(10,22,40,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]'
  const inputStyle: CSSProperties = { borderColor: 'var(--glass-border)', color: 'var(--cream)' }
  const label = 'grid gap-1.5 text-[13px] font-semibold min-w-0'

  return (
    <div className="min-h-screen" style={{ background: 'var(--navy)' }}>
      <div className="max-w-[1180px] mx-auto px-6 lg:px-8 pt-28 pb-24">

        {/* ── Language switch ── */}
        <div className="flex justify-end mb-6">
          <div role="group" aria-label="Language" className="inline-flex rounded-full border p-1" style={{ borderColor: 'var(--glass-border)' }}>
            {(['tl', 'en'] as const).map(l => (
              <button key={l} type="button" onClick={() => pick(l)} aria-pressed={lang === l}
                className="min-w-[56px] min-h-[44px] px-4 rounded-full text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
                style={lang === l ? { background: GOLD, color: '#0a1628' } : { color: 'var(--slate)' }}>{l.toUpperCase()}</button>
            ))}
          </div>
        </div>

        {/* ── Hero ── */}
        <Reveal className="mb-16 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
            style={{ background: 'rgba(212,168,67,0.10)', border: '1px solid rgba(212,168,67,0.35)', color: GOLD }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />{t('chip')}
          </div>
          <h1 className="font-display font-semibold text-4xl sm:text-5xl lg:text-6xl mb-5 leading-[1.05]" style={{ color: 'var(--cream)', textWrap: 'balance' } as CSSProperties}>
            {t('h1a')} <span style={{ color: 'var(--gold-bright, #E8C766)' }}>{t('h1b')}</span>
          </h1>
          <p className="text-lg max-w-2xl mb-7" style={{ color: 'var(--slate)' }}>{t('lead')}</p>
          <div className="flex flex-wrap gap-3">
            <a href="#apply" className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-xl font-bold text-[15px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
              style={{ background: 'linear-gradient(135deg, #E8C766, #D4A843 50%, #9A7A2E)', color: '#0a1628', boxShadow: '0 0 28px rgba(212,168,67,0.25)' }}>{t('apply')}</a>
            <a href="#programs" className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-xl font-bold text-[15px] border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
              style={{ borderColor: 'rgba(212,168,67,0.35)', color: 'var(--gold-bright, #E8C766)' }}>{t('see')}</a>
          </div>
        </Reveal>

        {/* ── Programs ── */}
        <Reveal className="mb-16">
          <section id="programs" aria-labelledby="aff-prog-h" style={{ scrollMarginTop: 'calc(88px + env(safe-area-inset-top))' }}>
            <h2 id="aff-prog-h" className="font-display font-semibold text-3xl sm:text-4xl mb-2" style={{ color: 'var(--cream)' }}>{t('prog_h')}</h2>
            <p className="mb-7 max-w-2xl" style={{ color: 'var(--slate)' }}>{t('prog_p')}</p>
            <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
              <article className="rounded-2xl border p-6 sm:p-7 grid gap-4 content-start min-w-0" style={{ ...card, borderColor: 'rgba(212,168,67,0.35)' }}>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <h3 className="font-display font-bold text-2xl" style={{ color: 'var(--cream)' }}>Negosyo<span style={{ color: GOLD }}>Plans</span></h3>
                  <span className="text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full" style={{ background: 'rgba(46,196,182,0.12)', color: '#2EC4B6', border: '1px solid rgba(46,196,182,0.35)' }}>{t('open')}</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--slate)' }}>{t('np_desc')}</p>
                <ul className="grid gap-2.5">
                  {([['25%', 'r1'], ['20%', 'r2'], ['20%', 'r3'], ['₱50', 'r4']] as const).map(([n, k]) => (
                    <li key={k} className="grid grid-cols-[64px_1fr] gap-3 items-baseline text-[15px]" style={{ color: 'var(--cream)' }}>
                      <b className="font-display text-2xl" style={{ color: 'var(--gold-bright, #E8C766)', fontVariantNumeric: 'tabular-nums' }}>{n}</b><span>{t(k)}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[13px]" style={{ color: 'var(--slate)' }}>{t('r_note')}</p>
                <a href={NP + '/agent'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-[44px] text-sm font-semibold w-fit" style={{ color: 'var(--gold-bright, #E8C766)' }}>{t('agent_link')}</a>
              </article>
              <div className="grid gap-4 content-start">
                {SOON.map(b => (
                  <article key={b.id} className="rounded-2xl border p-5 grid gap-2 min-w-0" style={card}>
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <h3 className="font-display font-bold text-xl" style={{ color: 'var(--cream)' }}>{b.name}</h3>
                      <span className="text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border" style={{ color: 'var(--slate)', borderColor: 'var(--glass-border)' }}>{t('soon')}</span>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--slate)' }}>{b[lang]}</p>
                    <p className="text-xs" style={{ color: 'var(--slate)', opacity: 0.8 }}>{t('soon_note')}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* ── How it works ── */}
        <Reveal className="mb-16">
          <h2 className="font-display font-semibold text-3xl sm:text-4xl mb-7" style={{ color: 'var(--cream)' }}>{t('how_h')}</h2>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {([[Send, 's1'], [FileSignature, 's2'], [Link2, 's3'], [Wallet, 's4']] as const).map(([Icon, k], i) => (
              <li key={k} className="rounded-2xl border p-5 flex items-start gap-3 min-w-0" style={card}>
                <span className="flex-shrink-0 flex items-center justify-center rounded-xl" aria-hidden="true"
                  style={{ width: 40, height: 40, background: 'rgba(212,168,67,0.10)', border: '1px solid rgba(212,168,67,0.30)', color: GOLD }}><Icon size={18} /></span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold" style={{ color: 'var(--cream)' }}><span className="sr-only">{i + 1}. </span>{t((k + '_h') as Key)}</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--slate)' }}>{t((k + '_p') as Key)}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        {/* ── Apply ── */}
        <Reveal>
          <section id="apply" aria-labelledby="aff-form-h" style={{ scrollMarginTop: 'calc(88px + env(safe-area-inset-top))' }}>
            <h2 id="aff-form-h" className="font-display font-semibold text-3xl sm:text-4xl mb-2" style={{ color: 'var(--cream)' }}>{t('form_h')}</h2>
            <p className="mb-7 max-w-2xl" style={{ color: 'var(--slate)' }}>{t('form_p')}</p>
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] items-start">
              {done ? (
                <div ref={doneRef} tabIndex={-1} role="status" className="rounded-2xl border p-6 grid gap-3 focus:outline-none" style={{ ...card, borderColor: 'rgba(46,196,182,0.35)' }}>
                  <CheckCircle2 size={28} style={{ color: '#2EC4B6' }} aria-hidden="true" />
                  {done.np && <p className="text-[15px]" style={{ color: 'var(--cream)' }}>{t('done_np')}</p>}
                  {done.wait.length > 0 && <p className="text-[15px]" style={{ color: 'var(--cream)' }}>{t('done_wait').replace('{list}', done.wait.join(', '))}</p>}
                  {err && <p className="text-sm" style={{ color: '#F3B4A8' }}>{err.msg}</p>}
                </div>
              ) : (
                <form onSubmit={submit} noValidate className="rounded-2xl border p-5 sm:p-7 grid gap-4 min-w-0" style={{ ...card, borderColor: 'rgba(212,168,67,0.35)' }}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className={label} style={{ color: 'var(--slate)' }} htmlFor="aff-name">{t('f_name')}<input id="aff-name" className={input} style={inputStyle} value={f.name} onChange={up('name')} maxLength={60} autoComplete="name" /></label>
                    <label className={label} style={{ color: 'var(--slate)' }} htmlFor="aff-email">{t('f_email')}<input id="aff-email" type="email" inputMode="email" className={input} style={inputStyle} value={f.email} onChange={up('email')} maxLength={120} autoComplete="email" /></label>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className={label} style={{ color: 'var(--slate)' }} htmlFor="aff-wallet">{t('f_wallet')}
                      <select id="aff-wallet" className={input} style={inputStyle} value={f.walletType} onChange={up('walletType')}><option>GCash</option><option>Maya</option></select></label>
                    <label className={label} style={{ color: 'var(--slate)' }} htmlFor="aff-mobile">{t('f_mobile')}<input id="aff-mobile" inputMode="numeric" placeholder="09XXXXXXXXX" className={input} style={inputStyle} value={f.mobile} onChange={up('mobile')} maxLength={13} autoComplete="tel" /></label>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className={label} style={{ color: 'var(--slate)' }} htmlFor="aff-city">{t('f_city')}<input id="aff-city" className={input} style={inputStyle} value={f.city} onChange={up('city')} maxLength={60} autoComplete="address-level2" /></label>
                    <label className={label} style={{ color: 'var(--slate)' }} htmlFor="aff-channel">{t('f_channel')}
                      <select id="aff-channel" className={input} style={inputStyle} value={f.channel} onChange={up('channel')}>
                        <option value="">{t('ch_pick')}</option>
                        {CHANNELS.map(c => <option key={c} value={c}>{t(CH_KEY[c])}</option>)}
                      </select></label>
                  </div>
                  <fieldset className="grid gap-2 min-w-0">
                    <legend className="text-[13px] font-semibold mb-1.5" style={{ color: 'var(--slate)' }}>{t('f_brands')}</legend>
                    <div className="flex flex-wrap gap-2">
                      {[{ id: 'negosyoplans', name: 'NegosyoPlans', open: true }, ...SOON.map(b => ({ id: b.id, name: b.name, open: false }))].map(b => (
                        <label key={b.id} htmlFor={'aff-b-' + b.id} className="inline-flex items-center gap-2 min-h-[44px] px-3.5 rounded-full border text-sm cursor-pointer"
                          style={{ borderColor: brands[b.id] ? 'rgba(212,168,67,0.45)' : 'var(--glass-border)', background: brands[b.id] ? 'rgba(212,168,67,0.10)' : 'transparent', color: 'var(--cream)' }}>
                          <input id={'aff-b-' + b.id} type="checkbox" checked={!!brands[b.id]} onChange={e => setBrands(p => ({ ...p, [b.id]: e.target.checked }))} className="w-4 h-4 accent-[#D4A843]" />
                          {b.name}<span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: b.open ? '#2EC4B6' : 'var(--slate)' }}>{b.open ? t('open') : t('soon')}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <label className={label} style={{ color: 'var(--slate)' }} htmlFor="aff-note">{t('f_note')}<textarea id="aff-note" rows={3} className={input + ' resize-y'} style={inputStyle} value={f.note} onChange={up('note')} maxLength={300} /></label>
                  <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
                    <input tabIndex={-1} autoComplete="off" value={f.website} onChange={up('website')} />
                  </div>
                  <label htmlFor="aff-agree" className="flex gap-3 items-start min-h-[44px] py-1 text-sm cursor-pointer" style={{ color: 'var(--slate)' }}>
                    <input id="aff-agree" type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} className="mt-0.5 w-[18px] h-[18px] flex-none accent-[#D4A843]" />
                    <span>{t('f_agree')}</span>
                  </label>
                  {brands.negosyoplans && (
                    <div className="grid gap-2">
                      <p className="flex items-center gap-2 text-xs" style={{ color: 'var(--slate)' }}><ShieldCheck size={14} style={{ color: '#2EC4B6' }} aria-hidden="true" />{t('bot')}</p>
                      <div ref={bot.box} />
                    </div>
                  )}
                  {err && (
                    <p role="alert" className="text-sm rounded-xl border px-3 py-2.5" style={{ color: '#F3B4A8', borderColor: 'rgba(243,180,168,0.35)', background: 'rgba(243,180,168,0.06)' }}>
                      {err.msg}{err.fallback && <> <a href={NP + '/become-an-agent'} target="_blank" rel="noopener noreferrer" className="underline font-semibold">negosyoplans.com/become-an-agent</a></>}
                    </p>
                  )}
                  <button type="submit" disabled={busy} className="w-full min-h-[50px] rounded-xl font-bold text-[15px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #E8C766, #D4A843 50%, #9A7A2E)', color: '#0a1628' }}>{busy ? t('sending') : t('submit')}</button>
                  <p className="text-xs" style={{ color: 'var(--slate)' }}>{t('privacy')}</p>
                </form>
              )}
              <aside className="rounded-2xl border p-6 grid gap-3 min-w-0" style={card}>
                <h3 className="font-display font-semibold text-xl" style={{ color: 'var(--cream)' }}>{t('rules_h')}</h3>
                <ul className="grid gap-2.5 text-sm" style={{ color: 'var(--slate)' }}>
                  {(['k1', 'k2', 'k3', 'k4'] as const).map(k => <li key={k} className="flex gap-2"><span aria-hidden="true" style={{ color: GOLD }}>•</span><span>{t(k)}</span></li>)}
                </ul>
              </aside>
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  )
}
