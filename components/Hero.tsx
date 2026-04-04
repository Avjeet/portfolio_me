'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Download, Eye } from 'lucide-react'
import { useEffect, useState } from 'react'
import PhoneNumber from './PhoneNumber'

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 })
  const [currentEmojiIndex, setCurrentEmojiIndex] = useState(0)
  const [visitCount, setVisitCount] = useState<number | null>(null)
  const [personalInfo, setPersonalInfo] = useState({
    name: 'Parmeet Singh',
    title: 'Software Development Engineer',
    description: '3+ years of experience building scalable applications and innovative solutions',
    email: 'sparmeet162000@gmail.com',
    phone: ['+91 8450910113', '+49 15755866330'],
    github: 'https://github.com/parmeet10',
    linkedin: 'https://linkedin.com/in/parmeet10',
  })

  const emojis = ['👋', '💻', '🚀', '⚡', '✨', '🎯', '🔥', '💡', '🎨', '🌟']

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEmojiIndex((prev) => (prev + 1) % emojis.length)
    }, 500) // Change emoji every 500ms

    return () => clearInterval(interval)
  }, [emojis.length])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
    }
    
    setDimensions({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(data => {
        if (data.personalInfo) {
          setPersonalInfo(data.personalInfo)
        }
      })
      .catch(err => console.error('Error fetching personal info:', err))
  }, [])

  useEffect(() => {
    // Track visit only once per session to avoid counting refreshes
    const hasVisited = sessionStorage.getItem('hasVisited')
    
    if (!hasVisited) {
      // Increment count for new session
      fetch('/api/visits', { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          if (data.count !== undefined) {
            setVisitCount(data.count)
          }
          sessionStorage.setItem('hasVisited', 'true')
        })
        .catch(err => console.error('Error tracking visit:', err))
    } else {
      // Just fetch current count without incrementing
      fetch('/api/visits')
        .then(res => res.json())
        .then(data => {
          if (data.count !== undefined) {
            setVisitCount(data.count)
          }
        })
        .catch(err => console.error('Error fetching visit count:', err))
    }
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
      {/* Visitor Count Badge */}
      {visitCount !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="fixed top-24 right-4 sm:right-6 lg:right-8 z-50"
        >
          <div className="glass rounded-full px-4 py-2 flex items-center gap-2 backdrop-blur-sm border border-white/10 shadow-lg glow-effect">
            <Eye size={16} className="text-indigo-400" />
            <span className="text-sm font-medium text-gray-300">
              <span className="text-indigo-400 font-semibold">{visitCount.toLocaleString()}</span>
              {' '}visitors
            </span>
          </div>
        </motion.div>
      )}
      
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <motion.div
            variants={itemVariants}
            className="mb-6"
          >
            <motion.div
              className="inline-block"
              key={currentEmojiIndex}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-6xl sm:text-8xl">{emojis[currentEmojiIndex]}</span>
            </motion.div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6"
          >
            <span className="gradient-text">{personalInfo.name}</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-4"
          >
            {personalInfo.title}
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
          >
            {personalInfo.description}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <motion.a
              href={`mailto:${personalInfo.email}`}
              className="flex items-center gap-2 px-6 py-3 glass rounded-full hover:bg-white/10 transition-all glow-effect"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail size={20} />
              <span>Email</span>
            </motion.a>

            <PhoneNumber phone={personalInfo.phone} />

            <motion.a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 glass rounded-full hover:bg-white/10 transition-all glow-effect"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github size={20} />
              <span>GitHub</span>
            </motion.a>

            <motion.a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 glass rounded-full hover:bg-white/10 transition-all glow-effect"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Linkedin size={20} />
              <span>LinkedIn</span>
            </motion.a>

            <motion.a
              href="/resume/ResumeGerman.pdf"
              download="Parmeet_Singh_Resume.pdf"
              className="flex items-center gap-2 px-6 py-3 glass rounded-full hover:bg-white/10 transition-all glow-effect"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download size={20} />
              <span>Resume</span>
            </motion.a>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex justify-center"
          >
            <motion.a
              href="#about"
              className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-sm">Scroll to explore</span>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                </svg>
              </motion.div>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating particles with enhanced colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => {
          const startX = Math.random() * dimensions.width
          const startY = Math.random() * dimensions.height
          const colors = [
            'bg-indigo-400',
            'bg-purple-400',
            'bg-pink-400',
            'bg-cyan-400',
            'bg-blue-400',
            'bg-violet-400',
          ]
          const color = colors[Math.floor(Math.random() * colors.length)]
          return (
            <motion.div
              key={i}
              className={`absolute w-1.5 h-1.5 ${color} rounded-full shadow-lg`}
              style={{
                boxShadow: `0 0 10px ${color.replace('bg-', '')}`,
              }}
              initial={{
                x: startX,
                y: startY,
                opacity: Math.random() * 0.5 + 0.3,
              }}
              animate={{
                y: [startY, Math.random() * dimensions.height, startY],
                opacity: [0.3, 0.9, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          )
        })}
      </div>

      {/* Animated lines connecting to mouse */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(12)].map((_, i) => {
          const angle = (i * Math.PI * 2) / 12
          const distance = 300
          const centerX = dimensions.width / 2
          const centerY = dimensions.height / 2
          const startX = centerX + Math.cos(angle) * distance
          const startY = centerY + Math.sin(angle) * distance
          
          const dx = mousePosition.x - startX
          const dy = mousePosition.y - startY
          const length = Math.sqrt(dx * dx + dy * dy)
          const rotation = Math.atan2(dy, dx) * (180 / Math.PI)
          
          const colors = [
            'rgba(139, 92, 246, 0.3)',
            'rgba(236, 72, 153, 0.3)',
            'rgba(6, 182, 212, 0.3)',
            'rgba(59, 130, 246, 0.3)',
            'rgba(168, 85, 247, 0.3)',
          ]
          const color = colors[i % colors.length]
          
          return (
            <motion.div
              key={i}
              className="absolute origin-left"
              style={{
                left: `${startX}px`,
                top: `${startY}px`,
                width: `${length}px`,
                height: '1px',
                background: `linear-gradient(90deg, ${color}, transparent)`,
                transform: `rotate(${rotation}deg)`,
                opacity: length < 400 ? 0.4 : 0.1,
              }}
              animate={{
                opacity: [
                  length < 400 ? 0.4 : 0.1,
                  length < 400 ? 0.6 : 0.2,
                  length < 400 ? 0.4 : 0.1,
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          )
        })}
      </div>
    </section>
  )
}

