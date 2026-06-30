import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MapPin, Mail, CheckCircle, ChevronDown } from 'lucide-react'
import { useSiteConfig } from '../lib/SiteConfigContext'
import Reveal from '../components/ui/Reveal'
import SocialIcons from '../components/SocialIcons'
import { ease } from '../lib/motion'

const WA_HREF = 'https://wa.me/421XXXXXXXXX?text=Hi%20Lintejas!%20I%27d%20like%20to%20get%20in%20touch.'

const ENQUIRY_TYPES = [
  { value: 'general',     label: 'General enquiry' },
  { value: 'demo',        label: 'Product demo — SkillVue' },
  { value: 'investment',  label: 'Investment discussion' },
  { value: 'partnership', label: 'Partnership opportunity' },
  { value: 'enterprise',  label: 'Enterprise sales' },
  { value: 'support',     label: 'Technical support' },
  { value: 'press',       label: 'Press / media' },
]

function WhatsAppSVG() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

/* ── Styled input ─────────────────────────────────────────────── */
function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        className="block text-xs font-medium mb-2"
        style={{ color: 'var(--slate)' }}
      >
        {label}
        {required && <span className="ml-1" style={{ color: 'var(--gold)' }}>*</span>}
      </label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  background:  'rgba(10,22,40,0.6)',
  borderColor: 'rgba(212,168,67,0.15)',
  color:       'var(--cream)',
  backdropFilter: 'blur(8px)',
}

const inputClass =
  'w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all duration-200 ' +
  'focus:border-[rgba(212,168,67,0.50)] focus:ring-2 focus:ring-[rgba(212,168,67,0.12)] ' +
  'placeholder:text-[var(--slate)]'

/* ── Page ──────────────────────────────────────────────────────── */
export default function Contact() {
  const { config } = useSiteConfig()
  const cfPlugin = config.plugins.find(p => p.id === 'contact-form' && p.installed && p.enabled)
  const cf = (cfPlugin?.settings ?? {}) as Record<string, unknown>

  const showPhone   = Boolean(cf.showPhone)
  const showCompany = cfPlugin ? Boolean(cf.showCompany) : true
  const successMsg  = cf.successMessage
    ? String(cf.successMessage)
    : "We'll respond within one business day."

  const [form, setForm]       = useState({ name: '', company: '', phone: '', email: '', type: 'general', message: '' })
  const [sent, setSent]       = useState(false)
  const [sending, setSending] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)

    const subject = encodeURIComponent(`[lintejas.io] Enquiry — ${form.type}`)
    const body = encodeURIComponent(
      `Name: ${form.name}\n` +
      (form.company ? `Company: ${form.company}\n` : '') +
      (form.phone   ? `Phone: ${form.phone}\n`   : '') +
      `Email: ${form.email}\nType: ${form.type}\n\nMessage:\n${form.message}`
    )
    window.location.href = `mailto:hello@lintejas.com?subject=${subject}&body=${body}`

    await new Promise(r => setTimeout(r, 600))
    setSent(true)
    setSending(false)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--navy)' }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-28 pb-28">

        {/* ── Header ─────────────────────────────────────────── */}
        <Reveal className="mb-14">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase mb-6"
            style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.20)', color: 'var(--gold)' }}
          >
            Contact
          </div>
          <h1
            className="font-display font-semibold text-5xl sm:text-6xl leading-tight mb-4"
            style={{ color: 'var(--cream)' }}
          >
            Get in touch
          </h1>
          <p className="text-lg max-w-xl" style={{ color: 'var(--slate)' }}>
            Demos, investment discussions, partnerships, or just a conversation — we read everything
            and respond personally.
          </p>
        </Reveal>

        {/* ── Main grid ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Form card ──────────────────────────────────── */}
          <Reveal className="lg:col-span-3">
            <div
              className="relative rounded-2xl border overflow-hidden"
              style={{
                background:     'var(--glass-bg)',
                borderColor:    'var(--glass-border)',
                backdropFilter: 'blur(24px)',
              }}
            >
              {/* Top hairline shine */}
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(232,199,102,0.20), transparent)' }}
              />

              <div className="p-8">
                <AnimatePresence mode="wait">
                  {sent ? (
                    /* Success state */
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease }}
                      className="py-16 flex flex-col items-center text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.1 }}
                        className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                        style={{
                          background:  'rgba(212,168,67,0.10)',
                          border:      '1px solid rgba(212,168,67,0.25)',
                          boxShadow:   '0 0 32px rgba(212,168,67,0.18)',
                        }}
                      >
                        <CheckCircle size={28} style={{ color: 'var(--gold)' }} />
                      </motion.div>
                      <h3 className="font-display font-semibold text-xl mb-2" style={{ color: 'var(--cream)' }}>
                        Message sent
                      </h3>
                      <p className="text-sm max-w-xs" style={{ color: 'var(--slate)' }}>
                        {successMsg}
                      </p>
                    </motion.div>
                  ) : (
                    /* Form */
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      className="space-y-5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Field label="Full name" required>
                          <input
                            name="name" required value={form.name}
                            onChange={handleChange}
                            className={inputClass} style={inputStyle}
                            placeholder="Your name"
                          />
                        </Field>
                        {showCompany && (
                          <Field label="Company">
                            <input
                              name="company" value={form.company}
                              onChange={handleChange}
                              className={inputClass} style={inputStyle}
                              placeholder="Optional"
                            />
                          </Field>
                        )}
                      </div>

                      {showPhone && (
                        <Field label="Phone">
                          <input
                            name="phone" type="tel" value={form.phone}
                            onChange={handleChange}
                            className={inputClass} style={inputStyle}
                            placeholder="+421 …"
                          />
                        </Field>
                      )}

                      <Field label="Email" required>
                        <input
                          name="email" type="email" required value={form.email}
                          onChange={handleChange}
                          className={inputClass} style={inputStyle}
                          placeholder="you@company.com"
                        />
                      </Field>

                      <Field label="Enquiry type" required>
                        <div className="relative">
                          <select
                            name="type" value={form.type}
                            onChange={handleChange}
                            className={inputClass}
                            style={{ ...inputStyle, appearance: 'none', paddingRight: '2.5rem' } as React.CSSProperties}
                          >
                            {ENQUIRY_TYPES.map(({ value, label }) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>
                          <ChevronDown
                            size={14}
                            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ color: 'var(--gold)' }}
                          />
                        </div>
                      </Field>

                      <Field label="Message" required>
                        <textarea
                          name="message" required rows={5} value={form.message}
                          onChange={handleChange}
                          className={inputClass} style={inputStyle}
                          placeholder="Tell us what you're working on or what you'd like to know…"
                        />
                      </Field>

                      <motion.button
                        type="submit"
                        disabled={sending}
                        whileTap={{ scale: 0.97 }}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 disabled:opacity-60"
                        style={{
                          background: 'linear-gradient(135deg, #E8C766 0%, #D4A843 55%, #9A7A2E 100%)',
                          color: '#0A1628',
                          boxShadow: sending ? 'none' : '0 0 24px rgba(212,168,67,0.28), 0 4px 16px rgba(0,0,0,0.25)',
                        }}
                        onMouseEnter={e => {
                          if (!sending)
                            (e.currentTarget as HTMLElement).style.boxShadow = '0 0 36px rgba(212,168,67,0.44), 0 8px 24px rgba(0,0,0,0.3)'
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(212,168,67,0.28), 0 4px 16px rgba(0,0,0,0.25)'
                        }}
                      >
                        {sending ? (
                          <span className="flex items-center gap-2">
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                              className="inline-block w-4 h-4 rounded-full border-2 border-current border-t-transparent"
                            />
                            Sending…
                          </span>
                        ) : (
                          <>
                            <Send size={14} />
                            Send message
                          </>
                        )}
                      </motion.button>

                      {/* WhatsApp alternative */}
                      <div className="flex items-center gap-3 pt-1">
                        <div className="flex-1 h-px" style={{ background: 'var(--glass-border)' }} />
                        <span className="text-xs" style={{ color: 'var(--slate)' }}>or</span>
                        <div className="flex-1 h-px" style={{ background: 'var(--glass-border)' }} />
                      </div>
                      <a
                        href={WA_HREF}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                        style={{
                          background: 'rgba(37,211,102,0.08)',
                          border: '1px solid rgba(37,211,102,0.25)',
                          color: '#25D366',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(37,211,102,0.16)' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(37,211,102,0.08)' }}
                      >
                        <WhatsAppSVG />
                        Message us on WhatsApp
                      </a>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Reveal>

          {/* ── Sidebar ────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Contact details */}
            <Reveal delay={0.08}>
              <div
                className="relative rounded-2xl border p-7"
                style={{
                  background:     'var(--glass-bg)',
                  borderColor:    'var(--glass-border)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <div
                  className="absolute inset-x-0 top-0 h-px rounded-t-2xl"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(232,199,102,0.15), transparent)' }}
                />
                <h3
                  className="font-display font-semibold text-base mb-6"
                  style={{ color: 'var(--cream)' }}
                >
                  Contact details
                </h3>
                <div className="space-y-5">
                  <div className="flex gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.15)' }}
                    >
                      <Mail size={13} style={{ color: 'var(--gold)' }} />
                    </div>
                    <div>
                      <p className="text-xs mb-1" style={{ color: 'var(--slate)' }}>Email</p>
                      <a
                        href="mailto:hello@lintejas.com"
                        className="text-sm font-medium transition-colors duration-200"
                        style={{ color: 'var(--cream)' }}
                        onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--gold)')}
                        onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--cream)')}
                      >
                        hello@lintejas.com
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.15)' }}
                    >
                      <MapPin size={13} style={{ color: 'var(--gold)' }} />
                    </div>
                    <div>
                      <p className="text-xs mb-1" style={{ color: 'var(--slate)' }}>Location</p>
                      <p className="text-sm font-medium" style={{ color: 'var(--cream)' }}>
                        European Union
                      </p>
                    </div>
                  </div>
                </div>

                {/* Response time note */}
                <div
                  className="mt-6 pt-5 border-t text-xs leading-relaxed"
                  style={{ borderColor: 'var(--glass-border)', color: 'var(--slate)' }}
                >
                  We respond to every message personally within one business day. No auto-replies,
                  no ticketing systems.
                </div>
              </div>
            </Reveal>

            {/* Social icons */}
            <Reveal delay={0.12}>
              <div
                className="relative rounded-2xl border p-7"
                style={{
                  background:     'var(--glass-bg)',
                  borderColor:    'var(--glass-border)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <div
                  className="absolute inset-x-0 top-0 h-px rounded-t-2xl"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(232,199,102,0.12), transparent)' }}
                />
                <SocialIcons />
              </div>
            </Reveal>

            {/* Impressum */}
            <Reveal delay={0.14}>
              <div
                id="impressum"
                className="relative rounded-2xl border p-7"
                style={{
                  background:     'var(--glass-bg)',
                  borderColor:    'var(--glass-border)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <div
                  className="absolute inset-x-0 top-0 h-px rounded-t-2xl"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(232,199,102,0.12), transparent)' }}
                />
                <h3
                  className="font-display font-semibold text-base mb-4"
                  style={{ color: 'var(--cream)' }}
                >
                  Impressum
                </h3>
                <div className="space-y-1 text-xs leading-relaxed" style={{ color: 'var(--slate)' }}>
                  <p className="font-medium text-sm" style={{ color: 'var(--cream)' }}>Lintejas s.r.o.</p>
                  <p>European Union</p>
                  <p>EU VAT: SK — (registration pending)</p>
                  <p
                    className="pt-3 mt-1 border-t text-xs"
                    style={{ borderColor: 'var(--glass-border)', color: 'var(--slate)' }}
                  >
                    Operated in accordance with applicable Slovak and EU regulations including GDPR
                    (Regulation 2016/679). For data protection enquiries, use the email above.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  )
}
