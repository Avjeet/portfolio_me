'use client'

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import Hero from '@/components/Hero'
import AboutMe from '@/components/AboutMe'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import Education from '@/components/Education'
import Achievements from '@/components/Achievements'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import BookMeetingButton from '@/components/BookMeetingButton'

function CustomCursor() {
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)
  const springCfg = { damping: 22, stiffness: 350, mass: 0.4 }
  const ringX = useSpring(mouseX, springCfg)
  const ringY = useSpring(mouseY, springCfg)

  useEffect(() => {
    // Only enable custom cursor for pointer devices
    if (window.matchMedia('(hover: none)').matches) return

    document.documentElement.classList.add('cursor-none')

    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', move)
    return () => {
      window.removeEventListener('mousemove', move)
      document.documentElement.classList.remove('cursor-none')
    }
  }, [mouseX, mouseY])

  return (
    <>
      {/* Dot — follows instantly */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full bg-indigo-400"
        style={{
          x: mouseX,
          y: mouseY,
          width: 8,
          height: 8,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
      {/* Ring — follows with spring lag */}
      <motion.div
        className="fixed pointer-events-none z-[9998] rounded-full"
        style={{
          x: ringX,
          y: ringY,
          width: 36,
          height: 36,
          translateX: '-50%',
          translateY: '-50%',
          border: '1px solid rgba(99,102,241,0.45)',
        }}
      />
    </>
  )
}

export default function Home() {
  return (
    <>
      <CustomCursor />

      {/* Film grain overlay */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-[9997]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '180px 180px',
          opacity: 0.028,
        }}
      />

      <main className="relative min-h-screen bg-[#050505]">
        {/* Ambient background blobs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-[-10%] left-[20%] w-[700px] h-[700px] bg-indigo-950/60 rounded-full blur-[140px]" />
          <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-violet-950/50 rounded-full blur-[120px]" />
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-cyan-950/30 rounded-full blur-[160px]" />
        </div>

        {/* Subtle grid */}
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.018) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />

        <Navigation />
        <Hero />
        <AboutMe />
        <Experience />
        <Projects />
        <Education />
        <Skills />
        <Achievements />
<Footer />
        <BookMeetingButton />
      </main>
    </>
  )
}
