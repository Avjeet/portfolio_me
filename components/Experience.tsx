'use client'

import { motion, useInView } from 'framer-motion'
import { Briefcase, MapPin, CalendarDays } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Experience as ExperienceType } from '@/lib/data'

export default function Experience() {
  const [experiences, setExperiences] = useState<ExperienceType[]>([])
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    fetch('/api/portfolio')
      .then((r) => r.json())
      .then((d) => {
        if (d.experiences) setExperiences(d.experiences)
      })
      .catch(() => {})
  }, [])

  return (
    <section
      id="experience"
      ref={ref}
      className="relative py-28 px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="text-center mb-20"
        >
          <span className="section-label">Career</span>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-black gradient-text"
            style={{ fontFamily: 'var(--font-space, system-ui)' }}
          >
            Experience
          </h2>
          <p className="mt-4 text-gray-500 text-base max-w-md mx-auto">
            Roles where I shipped real things that mattered
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-5 top-3 bottom-3 w-px hidden sm:block"
            style={{
              background:
                'linear-gradient(to bottom, transparent, rgba(99,102,241,0.35) 15%, rgba(139,92,246,0.35) 85%, transparent)',
            }}
            aria-hidden="true"
          />

          <div className="space-y-10">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id || index}
                initial={{ opacity: 0, x: -32 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.7,
                  delay: index * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative sm:pl-16"
              >
                {/* Timeline dot */}
                <div className="absolute left-5 top-6 -translate-x-1/2 hidden sm:block">
                  <div className="timeline-dot" />
                </div>

                {/* Card */}
                <div className="group relative card p-6 sm:p-8 overflow-hidden">
                  {/* Gradient accent — left border */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl bg-gradient-to-b ${exp.color} opacity-70 group-hover:opacity-100 transition-opacity`}
                  />

                  {/* Header row */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3
                          className="text-xl sm:text-2xl font-bold text-white"
                          style={{ fontFamily: 'var(--font-space, system-ui)' }}
                        >
                          {exp.company}
                        </h3>
                      </div>
                      <p className="text-indigo-300 font-medium text-sm mb-2">
                        {exp.position}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-600 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin size={11} />
                          {exp.location}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${exp.color} text-white text-xs font-semibold whitespace-nowrap self-start shadow-md`}
                    >
                      <CalendarDays size={11} />
                      {exp.period}
                    </span>
                  </div>

                  {/* Description bullets */}
                  <ul className="space-y-2.5">
                    {exp.description.map((item, i) => (
                      <motion.li
                        key={i}
                        className="flex items-start gap-3 text-sm text-gray-400 group-hover:text-gray-300 transition-colors"
                        initial={{ opacity: 0, x: -12 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: index * 0.15 + i * 0.07 + 0.3 }}
                      >
                        <span className="bullet-arrow mt-1 text-indigo-500">
                          ▸
                        </span>
                        <span className="leading-relaxed">{item}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Hover glow overlay */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                    style={{
                      background: 'radial-gradient(ellipse at top left, rgba(99,102,241,0.04) 0%, transparent 70%)',
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
