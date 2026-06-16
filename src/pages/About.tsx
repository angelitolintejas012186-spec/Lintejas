import { motion } from 'framer-motion'

const fade = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-24 px-4" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-3xl mx-auto">
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
          <motion.div variants={fade} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-medium tracking-widest uppercase"
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--accent)' }}>
            About
          </motion.div>

          <motion.h1 variants={fade} className="font-display font-semibold text-5xl mb-6 leading-tight" style={{ color: 'var(--text-primary)' }}>
            Building technology with purpose.
          </motion.h1>

          <motion.p variants={fade} className="text-lg leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
            Lintejas is a technology holding company founded in the Slovak Republic. We identify, build, and grow software
            ventures that solve real operational problems in industries where precision matters.
          </motion.p>
        </motion.div>

        <div className="space-y-10">
          {[
            {
              title: 'Our mission',
              body: `We exist to demonstrate that European software companies can achieve world-class outcomes —
              built with care, designed for longevity, and respectful of the people who use them. We believe
              the best technology is invisible: it dissolves into the work, amplifying human capability without friction.`,
            },
            {
              title: 'Where we operate',
              body: `Headquartered in Slovakia, we operate across the European Union. Our portfolio focuses on
              manufacturing, food production, logistics, and enterprise software — sectors where the gap between
              operational reality and available tooling remains significant.`,
            },
            {
              title: 'How we invest',
              body: `We take concentrated positions in companies we understand deeply. Rather than spreading
              capital thinly, we commit fully: co-founding teams, contributing architecture decisions, and
              staying patient through long product development cycles. Quality over velocity.`,
            },
          ].map(({ title, body }) => (
            <motion.section
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="border-l-2 pl-7"
              style={{ borderColor: 'var(--accent)' }}
            >
              <h2 className="font-display font-semibold text-2xl mb-3" style={{ color: 'var(--text-primary)' }}>{title}</h2>
              <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{body}</p>
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  )
}
