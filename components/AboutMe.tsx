'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import {
  MapPin,
  Calendar,
  Code2,
  Briefcase,
  GraduationCap,
  Zap,
  ArrowRight,
  Download,
} from 'lucide-react'

const stats = [
  {
    label: 'Years Experience',
    value: '6+',
    icon: Briefcase,
    gradient: 'from-violet-500 to-indigo-500',
  },
  {
    label: 'App Downloads',
    value: '50M+',
    icon: Zap,
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    label: 'Companies',
    value: '3',
    icon: Code2,
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    label: 'Projects Shipped',
    value: '10+',
    icon: MapPin,
    gradient: 'from-amber-500 to-orange-500',
  },
]

const highlights = [
  {
    icon: GraduationCap,
    text: 'Software Engineer @ PhonePe, Pincode',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/8',
    border: 'border-cyan-500/15',
  },
  {
    icon: Briefcase,
    text: 'Kotlin Multiplatform & Android Expert',
    color: 'text-violet-400',
    bg: 'bg-violet-500/8',
    border: 'border-violet-500/15',
  },
  {
    icon: MapPin,
    text: 'Based in Bengaluru, India',
    color: 'text-pink-400',
    bg: 'bg-pink-500/8',
    border: 'border-pink-500/15',
  },
  {
    icon: Calendar,
    text: '6+ years in Android development',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/8',
    border: 'border-emerald-500/15',
  },
]

const childVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export default function AboutMe() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [imageError, setImageError] = useState(false)

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-28 px-6 lg:px-8 overflow-hidden"
    >
      {/* Section bg blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-violet-600/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-cyan-600/8 rounded-full blur-[90px]" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="text-center mb-20"
        >
          <span className="section-label">Get to know me</span>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-black gradient-text"
            style={{ fontFamily: 'var(--font-space, system-ui)' }}
          >
            About Me
          </h2>
        </motion.div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center mb-16">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative group">
              {/* Rotating gradient ring */}
              <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 opacity-60 blur-sm group-hover:opacity-90 transition-opacity duration-500" />
              <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 opacity-40 spin-slow" />

              {/* Photo container */}
              <div className="relative w-72 h-80 sm:w-80 sm:h-96 lg:w-[360px] lg:h-[460px] rounded-2xl overflow-hidden bg-gray-950 border border-white/8">
                {!imageError ? (
                  <img
                    src="/profile.png"
                    alt="Avjeet Singh"
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900/40 to-violet-900/40">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mb-3 text-2xl font-black text-white">
                      AS
                    </div>
                    <p className="text-gray-500 text-xs px-6 text-center">
                      Drop profile.JPG in /public to show your photo
                    </p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                {/* Name badge */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="glass rounded-xl px-4 py-2.5 border border-white/10">
                    <p className="text-white font-semibold text-sm leading-none mb-0.5">
                      Avjeet Singh
                    </p>
                    <p className="text-indigo-300 text-xs">
                      Experienced Multiplatform Mobile Architect
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <p className="text-lg sm:text-xl text-gray-200 leading-relaxed font-light">
                I&apos;m an experienced Android and Multiplatform Mobile
                Architect with 6+ years building high-quality apps. From
                developing apps with 50M+ downloads at Rooter to building
                cross-platform KMP/CMP solutions at PhonePe — I thrive at the
                intersection of mobile engineering and innovative product
                delivery.
              </p>
              <p className="text-base text-gray-500 leading-relaxed">
                Currently working as a Software Engineer at PhonePe, Pincode,
                specializing in Kotlin Multiplatform and Compose Multiplatform.
                I&apos;m also a Google Summer of Code mentor and winner of the
                Pincode Hackathon 2025 for the Pinpoint AI Agent Debugger Tool.
              </p>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {highlights.map((item, i) => (
                <motion.div
                  key={i}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${item.bg} ${item.border} transition-all duration-200 hover:scale-[1.01] group`}
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.18 }}
                >
                  <item.icon
                    size={15}
                    className={`${item.color} flex-shrink-0`}
                  />
                  <span className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors font-medium">
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-1">
              <motion.a
                href="#experience"
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-indigo-600/25"
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                View Experience
                <ArrowRight size={15} />
              </motion.a>
              <motion.a
                href="/resume/Avjeet_Resume_2025.pdf"
                download="Avjeet_Singh_Resume.pdf"
                className="flex items-center gap-2 px-6 py-2.5 rounded-full glass border border-white/12 text-white font-semibold text-sm hover:border-white/25 hover:bg-white/8 transition-all duration-200"
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                <Download size={15} />
                Download CV
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Stats grid */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
          }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={childVariants}
              className="relative group overflow-hidden rounded-2xl border border-white/7 bg-white/[0.025] p-6 text-center transition-all duration-350 hover:border-indigo-500/25 hover:bg-white/[0.04]"
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-400`}
              />
              <div
                className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} mb-3 shadow-lg mx-auto`}
              >
                <stat.icon size={20} className="text-white" />
              </div>
              <p
                className={`text-3xl font-black bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent mb-0.5`}
                style={{ fontFamily: 'var(--font-space, system-ui)' }}
              >
                {stat.value}
              </p>
              <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
