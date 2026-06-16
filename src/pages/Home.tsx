import type React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Cpu, Shield, TrendingUp } from 'lucide-react'
import TheInterlockLogo from '../components/TheInterlockLogo'
import BrandName from '../components/BrandName'
import SiteLogo from '../components/SiteLogo'
import { useSiteConfig } from '../lib/SiteConfigContext'

const fade = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }
const ALIGN_CLASS = { left: 'justify-start', center: 'justify-center', right: 'justify-end' } as const

export default function Home() {
  const { config } = useSiteConfig()
  const heroJustify  = ALIGN_CLASS[config.branding.logo.align]     ?? 'justify-center'
  const brandAlign   = config.branding.brandName.align
  const brandTextAlign: React.CSSProperties['textAlign'] =
    brandAlign === 'left' ? 'left' : brandAlign === 'right' ? 'right' : 'center'

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-24 px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-10"
               style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }} />
        </div>

        <motion.div
          className="max-w-4xl mx-auto text-center relative z-10"
          initial="hidden" animate="show"
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.div variants={fade} className={`flex ${heroJustify} mb-8`}>
            <SiteLogo overrideConfig={{ size: 88 }} />
          </motion.div>

          <motion.div variants={fade} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-medium tracking-widest uppercase"
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--accent)' }}>
            Technology Holding Company · Slovakia, EU
          </motion.div>

          <motion.h1 variants={fade} className="text-5xl sm:text-6xl lg:text-7xl font-display font-semibold mb-6 leading-tight"
                     style={{ color: 'var(--text-primary)', textAlign: brandTextAlign }}>
            <BrandName className="block" />
          </motion.h1>

          <motion.p variants={fade} className="text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto"
                    style={{ color: 'var(--text-secondary)' }}>
            Precision software for the industries that shape the world.
            We build and grow technology companies with enduring competitive advantage.
          </motion.p>

          <motion.div variants={fade} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/companies"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-medium transition-all hover:opacity-90 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, var(--accent-light) 0%, var(--accent) 100%)', color: '#0B1F33' }}>
              View Our Portfolio <ArrowRight size={16} />
            </Link>
            <Link to="/about"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-medium border transition-all hover:bg-[var(--bg-card)]"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
              About Lintejas
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Cpu,       title: 'Precision Engineering', desc: 'Every product is built to exacting standards, designed for the long run and the harshest operational environments.' },
            { icon: Shield,    title: 'European Values',       desc: 'Founded in Slovakia. Operating across the EU. Our products reflect European standards of quality, privacy, and reliability.' },
            { icon: TrendingUp, title: 'Compounding Value',   desc: 'We invest in ventures with durable moats — products that get more valuable as the businesses they serve grow.' },
          ].map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl p-7 border"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                   style={{ background: 'linear-gradient(135deg, var(--accent-light)22 0%, var(--accent)22 100%)', border: '1px solid var(--border)' }}>
                <Icon size={20} style={{ color: 'var(--accent)' }} />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured venture */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
          <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--accent)' }}>Portfolio</span>
          <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl p-8 sm:p-10 border relative overflow-hidden"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-5 pointer-events-none"
               style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6"
               style={{ background: '#0B2F1A', color: '#4ADE80', border: '1px solid #166534' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Live
          </div>

          <div className="flex items-start gap-5 mb-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                 style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              🧠
            </div>
            <div>
              <h2 className="font-display font-semibold text-2xl mb-1" style={{ color: 'var(--text-primary)' }}>SkillVue</h2>
              <p style={{ color: 'var(--accent)' }} className="text-sm font-medium">Competency Intelligence Platform</p>
            </div>
          </div>

          <p className="text-base leading-relaxed mb-7 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            A comprehensive platform that maps, tracks, and develops employee competencies in food manufacturing environments.
            Trusted by HR leaders across Slovakia and Central Europe.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link to="/companies" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, var(--accent-light) 0%, var(--accent) 100%)', color: '#0B1F33' }}>
              Learn more <ArrowRight size={14} />
            </Link>
            <a href="https://skillvue-app.fly.dev" target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition-all hover:bg-[var(--bg-secondary)]"
               style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
              Visit Platform
            </a>
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="rounded-2xl p-10 text-center border relative overflow-hidden"
             style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <TheInterlockLogo size={56} className="mx-auto mb-6 opacity-60" />
          <h2 className="font-display font-semibold text-3xl mb-4" style={{ color: 'var(--text-primary)' }}>
            Build with us
          </h2>
          <p className="text-base leading-relaxed mb-7 max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
            We partner with industry operators, investors, and engineering teams to build the next generation of industrial software.
          </p>
          <Link to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-medium transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, var(--accent-light) 0%, var(--accent) 100%)', color: '#0B1F33' }}>
            Get in touch <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
