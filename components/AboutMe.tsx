'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { MapPin, Calendar, Code2, Briefcase, GraduationCap, Zap } from 'lucide-react'

const stats = [
  { label: 'Years Experience', value: '3+', icon: Briefcase, color: 'from-violet-500 to-purple-500' },
  { label: 'Companies', value: '3', icon: Code2, color: 'from-pink-500 to-rose-500' },
  { label: 'Countries Worked', value: '3', icon: MapPin, color: 'from-cyan-500 to-blue-500' },
  { label: 'Projects Shipped', value: '10+', icon: Zap, color: 'from-amber-500 to-orange-500' },
]

const highlights = [
  { icon: GraduationCap, text: 'MS Computer Science @ FAU, Germany', color: 'text-cyan-400' },
  { icon: Briefcase, text: 'SDE-II @ Jio — XR & Spatial Computing', color: 'text-violet-400' },
  { icon: MapPin, text: 'Based in Erlangen, Germany', color: 'text-pink-400' },
  { icon: Calendar, text: '3+ years building production systems', color: 'text-emerald-400' },
]

export default function AboutMe() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [imageError, setImageError] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  }

  const leftVariants = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  }

  const rightVariants = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  }

  const statVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  }

  return (
    <section id="about" ref={ref} className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cyan-600/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-semibold tracking-widest uppercase text-violet-400 mb-4 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10">
            Get to know me
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
            <span className="gradient-text">About Me</span>
          </h2>
        </motion.div>

        {/* Main grid: image left, text right */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid lg:grid-cols-2 gap-16 items-center mb-20"
        >
          {/* LEFT — Photo */}
          <motion.div variants={leftVariants} className="flex justify-center lg:justify-end">
            <div className="relative group">
              {/* Static glow border */}
              <div className="absolute -inset-[3px] rounded-2xl bg-gradient-to-r from-violet-500 via-pink-500 to-cyan-500 opacity-70 blur-sm group-hover:opacity-100 transition-opacity duration-500" />

              {/* Rotating gradient ring */}
              <div className="absolute -inset-[3px] rounded-2xl bg-gradient-to-r from-violet-500 via-pink-500 to-cyan-500 opacity-50 spin-slow" />

              {/* Photo container */}
              <div className="relative w-72 h-80 sm:w-80 sm:h-96 lg:w-96 lg:h-[480px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10">
                {!imageError ? (
                  <img
                    src="/profile.JPG"
                    alt="Parmeet Singh"
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-violet-900/50 to-pink-900/50">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center mb-4 text-4xl font-bold text-white">
                      PS
                    </div>
                    <p className="text-gray-400 text-sm px-4 text-center">Drop profile.JPG in /public to show your photo</p>
                  </div>
                )}

                {/* Gradient overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Name badge at bottom */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="glass rounded-xl px-4 py-2 border border-white/10">
                    <p className="text-white font-semibold text-sm">Parmeet Singh</p>
                    <p className="text-violet-300 text-xs">Software Development Engineer</p>
                  </div>
                </div>
              </div>

              {/* Floating badge — top right */}
              <motion.div
                className="absolute -top-4 -right-4 glass rounded-full px-3 py-2 border border-violet-500/30 bg-violet-500/10 flex items-center gap-1.5 shadow-lg z-10"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs text-white font-medium whitespace-nowrap">Open to opportunities</span>
              </motion.div>

              {/* Floating badge — bottom left */}
              <motion.div
                className="absolute -bottom-4 -left-4 glass rounded-xl px-3 py-2 border border-pink-500/30 bg-pink-500/10 shadow-lg z-10"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <p className="text-xs text-pink-300 font-medium">🎓 MS @ FAU Germany</p>
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT — Text content */}
          <motion.div variants={rightVariants} className="space-y-6">
            <div className="space-y-4">
              <p className="text-lg sm:text-xl text-gray-200 leading-relaxed font-light">
                I&apos;m a Software Development Engineer with a passion for building systems that scale. From crafting real-time XR voice pipelines at Jio to architecting full-stack platforms from scratch — I thrive at the intersection of backend engineering and innovative product thinking.
              </p>
              <p className="text-base text-gray-400 leading-relaxed">
                Currently pursuing my Master&apos;s in Computer Science at Friedrich-Alexander-Universität Erlangen-Nürnberg, Germany, I bring a global perspective shaped by working across India, Kyrgyzstan, and Germany. I specialize in Node.js, TypeScript, and distributed systems, with hands-on experience in gRPC, WebSockets, microservices, and cloud infrastructure. When I&apos;m not writing code, I&apos;m exploring new technologies, contributing to open source, or thinking about the next problem worth solving.
              </p>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {highlights.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 glass rounded-xl px-4 py-3 border border-white/5 hover:border-white/15 transition-colors group"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <item.icon size={16} className={`${item.color} flex-shrink-0`} />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{item.text}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-3 pt-2">
              <motion.a
                href="#experience"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold text-sm hover:from-violet-500 hover:to-pink-500 transition-all shadow-lg shadow-violet-500/25"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                View Experience
              </motion.a>
              <motion.a
                href="/resume/ResumeGerman.pdf"
                download="Parmeet_Singh_Resume.pdf"
                className="px-6 py-3 rounded-full glass border border-white/15 text-white font-semibold text-sm hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Download CV
              </motion.a>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={statVariants}
              className="relative group glass rounded-2xl p-6 border border-white/5 hover:border-white/15 transition-all overflow-hidden text-center"
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} mb-3 shadow-lg mx-auto`}>
                <stat.icon size={20} className="text-white" />
              </div>
              <p className={`text-3xl font-bold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </p>
              <p className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wide">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
