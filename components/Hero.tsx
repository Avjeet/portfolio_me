'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Download, Eye, ArrowDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import PhoneNumber from './PhoneNumber'

const roles = [
  'Android & KMP Engineer',
  'Multiplatform Mobile Architect',
  'GSoC Mentor & Open Source Contributor',
  'Compose Multiplatform Developer',
]

function useTypewriter(
  words: string[],
  typingSpeed = 75,
  deletingSpeed = 40,
  pauseDuration = 2400,
) {
  const [displayText, setDisplayText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPausing, setIsPausing] = useState(false)

  useEffect(() => {
    if (isPausing) return
    const current = words[wordIndex]
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          const next = current.slice(0, displayText.length + 1)
          setDisplayText(next)
          if (next === current) {
            setIsPausing(true)
            setTimeout(() => {
              setIsPausing(false)
              setIsDeleting(true)
            }, pauseDuration)
          }
        } else {
          const next = current.slice(0, displayText.length - 1)
          setDisplayText(next)
          if (next === '') {
            setIsDeleting(false)
            setWordIndex((prev) => (prev + 1) % words.length)
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed,
    )
    return () => clearTimeout(timeout)
  }, [
    displayText,
    isDeleting,
    isPausing,
    wordIndex,
    words,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
  ])

  return displayText
}

export default function Hero() {
  const [personalInfo, setPersonalInfo] = useState({
    name: 'Avjeet Singh',
    title: 'Multiplatform Mobile Architect | Android Engineer',
    description:
      '6+ years building Android, KMP & CMP applications. GSoC Mentor, Hackathon Winner.',
    email: 'singh.avjeet02@gmail.com',
    phone: ['+91 8527949323'],
    github: 'https://github.com/Avjeet',
    linkedin: 'https://www.linkedin.com/in/avjeet-singh-73572a138',
  })
  const [visitCount, setVisitCount] = useState<number | null>(null)
  const role = useTypewriter(roles)

  useEffect(() => {
    fetch('/api/portfolio')
      .then((r) => r.json())
      .then((d) => {
        if (d.personalInfo) setPersonalInfo(d.personalInfo)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisited')
    if (!hasVisited) {
      fetch('/api/visits', { method: 'POST' })
        .then((r) => r.json())
        .then((d) => {
          if (d.count !== undefined) setVisitCount(d.count)
          sessionStorage.setItem('hasVisited', 'true')
        })
        .catch(() => {})
    } else {
      fetch('/api/visits')
        .then((r) => r.json())
        .then((d) => {
          if (d.count !== undefined) setVisitCount(d.count)
        })
        .catch(() => {})
    }
  }, [])

  const nameParts = ['AVJEET', 'SINGH']

  const socialLinks = [
    {
      href: `mailto:${personalInfo.email}`,
      icon: Mail,
      label: 'Email',
      external: false,
    },
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
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 lg:px-8 pt-24 pb-16 overflow-hidden"
    >
      {/* Visit count badge */}
      {visitCount !== null && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.5 }}
          className="fixed top-[72px] right-5 z-40 flex items-center gap-1.5 text-[11px] text-gray-600 font-mono"
        >
          <Eye size={11} />
          <span>{visitCount.toLocaleString()} visits</span>
        </motion.div>
      )}

      {/* Status badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10 sm:mb-12"
      >
        <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full glass border border-white/10 text-sm text-gray-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          Available for opportunities
        </div>
      </motion.div>

      {/* Hero name — massive slide-up reveal */}
      <div className="text-center mb-5 select-none">
        {nameParts.map((word, i) => (
          <div key={word} className="overflow-hidden leading-none">
            <motion.div
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.95,
                delay: 0.18 + i * 0.14,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <h1
                className="font-black tracking-tight text-white"
                style={{
                  fontSize: 'clamp(68px, 13.5vw, 160px)',
                  lineHeight: 0.9,
                  fontFamily: 'var(--font-space, system-ui, sans-serif)',
                  letterSpacing: '-0.03em',
                }}
              >
                {word}
              </h1>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Gradient separator */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md h-px mb-7"
        style={{
          background:
            'linear-gradient(to right, transparent, rgba(99,102,241,0.6), rgba(139,92,246,0.4), transparent)',
        }}
      />

      {/* Typewriter role */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65, duration: 0.4 }}
        className="text-base sm:text-lg text-gray-400 font-mono mb-10 h-7 flex items-center"
      >
        <span>{role}</span>
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: 0.65,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="ml-px text-indigo-400 font-thin"
        >
          |
        </motion.span>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.82, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-wrap justify-center gap-2.5 mb-16"
      >
        {socialLinks.map(({ href, icon: Icon, label, external }) => (
          <motion.a
            key={label}
            href={href}
            {...(external
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
            className="group flex items-center gap-2 px-5 py-2.5 glass rounded-full border border-white/10 text-gray-400 text-sm font-medium hover:border-indigo-500/40 hover:text-white transition-all duration-200"
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <Icon
              size={15}
              className="group-hover:text-indigo-400 transition-colors duration-200"
            />
            {label}
          </motion.a>
        ))}

        <PhoneNumber phone={personalInfo.phone} />

        <motion.a
          href="/resume/Avjeet_Resume_2025.pdf"
          download="Avjeet_Singh_Resume.pdf"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-indigo-600/25"
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <Download size={15} />
          Resume
        </motion.a>
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 hover:text-gray-400 transition-colors group"
      >
        <span className="text-[10px] tracking-[0.22em] uppercase font-mono">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="group-hover:text-indigo-400 transition-colors"
        >
          <ArrowDown size={16} />
        </motion.div>
      </motion.a>

      {/* Ambient glow orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[180px]"
          style={{
            width: 700,
            height: 400,
            background:
              'radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Floating particles */}
      {[...Array(18)].map((_, i) => {
        const colors = ['#818cf8', '#a78bfa', '#67e8f9', '#6366f1', '#c4b5fd']
        const color = colors[i % colors.length]
        const size = Math.random() * 2 + 1
        return (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: size,
              height: size,
              background: color,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: `0 0 ${size * 4}px ${color}`,
            }}
            animate={{
              y: [0, -(Math.random() * 60 + 30), 0],
              opacity: [0.2, 0.7, 0.2],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeInOut',
            }}
          />
        )
      })}
    </section>
  )
}
