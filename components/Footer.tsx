'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Footer() {
  const [personalInfo, setPersonalInfo] = useState({
    email: 'singh.avjeet02@gmail.com',
    github: 'https://github.com/Avjeet',
    linkedin: 'https://www.linkedin.com/in/avjeet-singh-73572a138',
  })

  useEffect(() => {
    fetch('/api/portfolio')
      .then((r) => r.json())
      .then((d) => {
        if (d.personalInfo) setPersonalInfo(d.personalInfo)
      })
      .catch(() => {})
  }, [])

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })

  const socials = [
    { href: `mailto:${personalInfo.email}`, icon: Mail, label: 'Email' },
    {
      href: personalInfo.github,
      icon: Github,
      label: 'GitHub',
      external: true,
    },
    {
      href: personalInfo.linkedin,
      icon: Linkedin,
      label: 'LinkedIn',
      external: true,
    },
  ]

  return (
    <footer className="relative border-t border-white/6 py-10 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3
              className="text-xl font-black gradient-text mb-0.5"
              style={{ fontFamily: 'var(--font-space, system-ui)' }}
            >
              Avjeet Singh
            </h3>
            <p className="text-gray-600 text-xs">
              Android & Multiplatform Mobile Architect
            </p>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2"
          >
            {socials.map(({ href, icon: Icon, label, external }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                {...(external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                className="w-10 h-10 rounded-xl glass border border-white/8 flex items-center justify-center text-gray-500 hover:text-white hover:border-indigo-500/30 transition-all duration-200"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.92 }}
              >
                <Icon size={16} />
              </motion.a>
            ))}
          </motion.div>

          {/* Back to top */}
          <motion.button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="w-10 h-10 rounded-xl glass border border-white/8 flex items-center justify-center text-gray-500 hover:text-white hover:border-indigo-500/30 transition-all duration-200"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.92 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <ArrowUp size={16} />
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-700 font-mono"
        >
          <span>© {new Date().getFullYear()} Avjeet Singh</span>
          <span>Built with Next.js · Tailwind · Framer Motion</span>
        </motion.div>
      </div>
    </footer>
  )
}
