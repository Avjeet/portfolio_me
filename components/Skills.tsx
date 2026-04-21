'use client'

import { motion, useInView } from 'framer-motion'
import { Code, Smartphone, Layers, Bot } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Skills as SkillsType } from '@/lib/data'
import InterestsSection from './InterestsSection'

const iconMap: Record<string, typeof Code> = {
  Languages: Code,
  'Android & Mobile': Smartphone,
  Architecture: Layers,
  'AI & Dev Tools': Bot,
}

const categoryAccents: Record<string, string> = {
  Languages: 'from-blue-500 to-cyan-500',
  'Android & Mobile': 'from-violet-500 to-purple-500',
  Architecture: 'from-emerald-500 to-teal-500',
  'AI & Dev Tools': 'from-orange-500 to-amber-500',
}

export default function Skills() {
  const [skills, setSkills] = useState<SkillsType>({
    languages: { title: 'Languages', skills: [], color: 'from-blue-500 to-cyan-500' },
    technologies: { title: 'Android & Mobile', skills: [], color: 'from-violet-500 to-purple-500' },
    webDevTools: { title: 'Architecture', skills: [], color: 'from-emerald-500 to-teal-500' },
    frameworks: { title: 'AI & Dev Tools', skills: [], color: 'from-orange-500 to-amber-500' },
  })
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    fetch('/api/portfolio')
      .then((r) => r.json())
      .then((d) => {
        if (d.skills) setSkills(d.skills)
      })
      .catch(() => {})
  }, [])

  const skillCategories = [
    skills.languages,
    skills.technologies,
    skills.webDevTools,
    skills.frameworks,
  ]

  return (
    <section id="skills" ref={ref} className="relative py-28 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="text-center mb-20"
        >
          <span className="section-label">Stack</span>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-black gradient-text"
            style={{ fontFamily: 'var(--font-space, system-ui)' }}
          >
            Technical Skills
          </h2>
          <p className="mt-4 text-gray-500 text-base max-w-md mx-auto">
            Technologies I reach for when building
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {skillCategories.map((category, catIdx) => {
            const Icon = iconMap[category.title] || Code
            const gradient = categoryAccents[category.title] || category.color

            return (
              <motion.div
                key={catIdx}
                initial={{ opacity: 0, y: 32 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.65,
                  delay: catIdx * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group card p-6 sm:p-7"
              >
                {/* Category header */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg flex-shrink-0`}
                  >
                    <Icon size={18} className="text-white" />
                  </div>
                  <h3
                    className="text-lg font-bold text-white"
                    style={{ fontFamily: 'var(--font-space, system-ui)' }}
                  >
                    {category.title}
                  </h3>
                  <span className="ml-auto text-xs text-gray-600 font-mono">
                    {category.skills.length} tools
                  </span>
                </div>

                {/* Skill chips */}
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIdx) => (
                    <motion.span
                      key={skillIdx}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{
                        duration: 0.3,
                        delay: catIdx * 0.1 + skillIdx * 0.03,
                        type: 'spring',
                        stiffness: 200,
                      }}
                      whileHover={{ scale: 1.08, y: -1 }}
                      className="tech-tag"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        <InterestsSection />
      </div>
    </section>
  )
}
