'use client'

import { motion, useInView } from 'framer-motion'
import { Trophy, CalendarDays } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Achievement as AchievementType } from '@/lib/data'

function AchievementImage({ src, alt, color }: { src: string; alt: string; color: string }) {
  const [errored, setErrored] = useState(false)

  if (!src || errored) {
    return (
      <div className={`w-full h-full bg-gradient-to-br ${color} opacity-20 flex items-center justify-center`}>
        <Trophy size={40} className="text-white/40" />
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setErrored(true)}
      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
    />
  )
}

export default function Achievements() {
  const [achievements, setAchievements] = useState<AchievementType[]>([])
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    fetch('/api/portfolio')
      .then((r) => r.json())
      .then((d) => {
        if (d.achievements) setAchievements(d.achievements)
      })
      .catch(() => {})
  }, [])

  return (
    <section id="highlights" ref={ref} className="relative py-28 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="text-center mb-20"
        >
          <span className="section-label">Recognition</span>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-black gradient-text"
            style={{ fontFamily: 'var(--font-space, system-ui)' }}
          >
            Highlights
          </h2>
          <p className="mt-4 text-gray-500 text-base max-w-md mx-auto">
            Milestones worth remembering
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {achievements.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.65,
                delay: index * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative card overflow-hidden"
            >
              {/* Gradient accent — left border */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl bg-gradient-to-b ${item.color} opacity-70 group-hover:opacity-100 transition-opacity z-10`}
              />

              {/* Image */}
              <div className="relative w-full aspect-video overflow-hidden rounded-t-2xl bg-white/4">
                <AchievementImage src={item.image} alt={item.title} color={item.color} />
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6">
                {/* Org badge + date row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${item.color} text-white text-xs font-semibold shadow-md`}
                  >
                    <Trophy size={10} />
                    {item.organization}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-600">
                    <CalendarDays size={11} />
                    {item.date}
                  </span>
                </div>

                <h3
                  className="text-base sm:text-lg font-bold text-white mb-2 leading-snug"
                  style={{ fontFamily: 'var(--font-space, system-ui)' }}
                >
                  {item.title}
                </h3>

                <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Hover glow overlay */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at top left, rgba(99,102,241,0.04) 0%, transparent 70%)',
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
