'use client'

import { motion, useInView } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export default function InterestsSection() {
  const [interests, setInterests] = useState(
    'Passionate about building scalable systems, exploring new technologies, and solving complex problems',
  )
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  useEffect(() => {
    fetch('/api/portfolio')
      .then((r) => r.json())
      .then((d) => {
        if (d.interests) setInterests(d.interests)
      })
      .catch(() => {})
  }, [])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="mt-10"
    >
      <div className="card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg">
          <Sparkles size={20} className="text-white" />
        </div>
        <div>
          <h3
            className="text-sm font-bold text-white mb-1.5 uppercase tracking-wider"
            style={{ fontFamily: 'var(--font-space, system-ui)' }}
          >
            Interests
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
            {interests}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
