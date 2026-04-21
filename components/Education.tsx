'use client'

import { motion, useInView } from 'framer-motion'
import { Award, CalendarDays } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Education as EducationType } from '@/lib/data'

export default function Education() {
  const [education, setEducation] = useState<EducationType[]>([])
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    fetch('/api/portfolio')
      .then((r) => r.json())
      .then((d) => {
        if (d.education) setEducation(d.education)
      })
      .catch(() => {})
  }, [])

  return (
    <section id="education" ref={ref} className="relative py-28 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="text-center mb-20"
        >
          <span className="section-label">Academia</span>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-black gradient-text"
            style={{ fontFamily: 'var(--font-space, system-ui)' }}
          >
            Education
          </h2>
          <p className="mt-4 text-gray-500 text-base max-w-md mx-auto">
            The foundations I built on
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div
            className="absolute left-5 top-3 bottom-3 w-px hidden sm:block"
            style={{
              background:
                'linear-gradient(to bottom, transparent, rgba(99,102,241,0.35) 15%, rgba(139,92,246,0.35) 85%, transparent)',
            }}
            aria-hidden="true"
          />

          <div className="space-y-8">
            {education.map((edu, index) => (
              <motion.div
                key={edu.id || index}
                initial={{ opacity: 0, x: -28 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.7,
                  delay: index * 0.14,
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
                    className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl bg-gradient-to-b ${edu.color} opacity-70 group-hover:opacity-100 transition-opacity`}
                  />

                  {/* Header row */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
                    <div>
                      <h3
                        className="text-xl sm:text-2xl font-bold text-white mb-1.5"
                        style={{ fontFamily: 'var(--font-space, system-ui)' }}
                      >
                        {edu.institution}
                      </h3>
                      <p className="text-indigo-300 font-medium text-sm mb-2">
                        {edu.degree}
                      </p>
                      {edu.achievement ? (
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Award size={11} />
                          {edu.achievement}
                        </div>
                      ) : null}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${edu.color} text-white text-xs font-semibold whitespace-nowrap self-start shadow-md`}
                    >
                      <CalendarDays size={11} />
                      {edu.period}
                    </span>
                  </div>

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
