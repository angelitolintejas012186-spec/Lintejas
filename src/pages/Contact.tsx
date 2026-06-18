import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MapPin, Mail, CheckCircle } from 'lucide-react'
import { useSiteConfig } from '../lib/SiteConfigContext'
import Reveal from '../components/ui/Reveal'
import SocialIcons from '../components/SocialIcons'
import { ease } from '../lib/motion'

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

                      <Field label="Enquiry type">
                        <select
                          name="type" value={form.type}
                          onChange={handleChange}
                          className={inputClass}
                          style={{ ...inputStyle, appearance: 'none' } as React.CSSProperties}
                        >
                          <option value="general">General enquiry</option>
                          <option value="demo">Product demo (SkillVue)</option>
                          <option value="investment">Investment discussion</option>
                          <option value="partnership">Partnership</option>
                          <option value="enterprise">Enterprise sales</option>
                        </select>
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
                        Slovak Republic, EU
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
                  <p>Registered in the Slovak Republic</p>
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
