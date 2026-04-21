'use client'

import { motion } from 'framer-motion'
import { CalendarDays } from 'lucide-react'

export default function BookMeetingButton() {
  return (
    <motion.a
      href="https://calendly.com/singh-avjeet02"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Book a 1:1 meeting"
      className="fixed bottom-7 right-7 z-50 group"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.06, y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Glow halo */}
      <div className="absolute inset-0 rounded-2xl bg-indigo-600 blur-xl opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-300" />

      {/* Button */}
      <div className="relative flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-2xl shadow-indigo-600/30 border border-indigo-500/50 transition-colors duration-200">
        <CalendarDays size={16} />
        <span>Book 1:1</span>
        {/* Live dot */}
        <span className="relative flex h-2 w-2 ml-0.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
        </span>
      </div>
    </motion.a>
  )
}
