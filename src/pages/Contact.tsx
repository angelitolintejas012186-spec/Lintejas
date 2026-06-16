import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, MapPin, Mail, Phone } from 'lucide-react'
import { useSiteConfig } from '../lib/SiteConfigContext'

export default function Contact() {
  const { config } = useSiteConfig()
  const cfPlugin = config.plugins.find(p => p.id === 'contact-form' && p.installed && p.enabled)
  const cf = (cfPlugin?.settings ?? {}) as Record<string, unknown>

  const showPhone   = Boolean(cf.showPhone)
  const showCompany = cfPlugin ? Boolean(cf.showCompany) : true
  const successMsg  = cf.successMessage ? String(cf.successMessage) : "We'll respond within one business day."

  const [form, setForm]       = useState({ name: '', company: '', phone: '', email: '', type: 'general', message: '' })
  const [sent, setSent]       = useState(false)
  const [sending, setSending] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    await new Promise(r => setTimeout(r, 900))
    setSent(true)
    setSending(false)
  }

  const inputClass = `w-full px-4 py-3 rounded-xl text-sm outline-none border focus:ring-2 transition-all`
  const inputStyle = { background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' } as React.CSSProperties

  return (
    <div className="min-h-screen pt-24 pb-24 px-4" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-medium tracking-widest uppercase"
               style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--accent)' }}>
            Contact
          </div>
          <h1 className="font-display font-semibold text-5xl mb-4" style={{ color: 'var(--text-primary)' }}>
            Get in touch
          </h1>
          <p className="text-lg max-w-xl" style={{ color: 'var(--text-secondary)' }}>
            Demos, investment discussions, partnerships, or just a conversation — we read everything.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3 rounded-2xl p-8 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            {sent ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-12 text-center">
                <div className="text-4xl mb-4">✓</div>
                <h3 className="font-display font-semibold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>Message sent</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{successMsg}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Full name *</label>
                    <input name="name" required value={form.name} onChange={handleChange} className={inputClass} style={inputStyle} placeholder="Your name" />
                  </div>
                  {showCompany && (
                    <div>
                      <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Company</label>
                      <input name="company" value={form.company} onChange={handleChange} className={inputClass} style={inputStyle} placeholder="Optional" />
                    </div>
                  )}
                </div>
                {showPhone && (
                  <div>
                    <label className="block text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                      <Phone size={11} /> Phone
                    </label>
                    <input name="phone" type="tel" value={form.phone} onChange={handleChange} className={inputClass} style={inputStyle} placeholder="+421 …" />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Email *</label>
                  <input name="email" type="email" required value={form.email} onChange={handleChange} className={inputClass} style={inputStyle} placeholder="you@company.com" />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Enquiry type</label>
                  <select name="type" value={form.type} onChange={handleChange} className={inputClass} style={inputStyle}>
                    <option value="general">General enquiry</option>
                    <option value="demo">Product demo</option>
                    <option value="investment">Investment</option>
                    <option value="partnership">Partnership</option>
                    <option value="enterprise">Enterprise sales</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Message *</label>
                  <textarea name="message" required rows={5} value={form.message} onChange={handleChange} className={inputClass} style={inputStyle}
                            placeholder="Tell us what you're working on or what you'd like to know…" />
                </div>

                <button type="submit" disabled={sending}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium transition-all hover:opacity-90 disabled:opacity-60"
                        style={{ background: 'linear-gradient(135deg, var(--accent-light) 0%, var(--accent) 100%)', color: '#0B1F33' }}>
                  {sending ? 'Sending…' : <><Send size={15} /> Send message</>}
                </button>
              </form>
            )}
          </div>

          {/* Info + Impressum */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl p-7 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>Contact details</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Mail size={16} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>Email</p>
                    <a href="mailto:hello@lintejas.com" className="text-sm hover:text-[var(--accent)] transition-colors"
                       style={{ color: 'var(--text-primary)' }}>hello@lintejas.com</a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPin size={16} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>Location</p>
                    <p className="text-sm" style={{ color: 'var(--text-primary)' }}>Slovak Republic, EU</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Impressum */}
            <div id="impressum" className="rounded-2xl p-7 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Impressum</h3>
              <div className="space-y-1 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Lintejas s.r.o.</p>
                <p>Registered in the Slovak Republic</p>
                <p>EU VAT: SK — (registration pending)</p>
                <p className="pt-2" style={{ color: 'var(--text-muted)' }}>
                  This website is operated by Lintejas s.r.o. in accordance with applicable Slovak and EU regulations including GDPR (Regulation 2016/679).
                  For data protection enquiries, contact the email above.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
