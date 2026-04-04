'use client'

import { useEffect, useState, useRef } from 'react'
import Hero from '@/components/Hero'
import AboutMe from '@/components/AboutMe'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import Education from '@/components/Education'
import Blogs from '@/components/Blogs'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import BookMeetingButton from '@/components/BookMeetingButton'

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number }>>([])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Create nodes
    const nodeCount = 50
    const nodes: Array<{ x: number; y: number; vx: number; vy: number }> = []
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      })
    }
    nodesRef.current = nodes

    let animationFrameId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update nodes
      nodes.forEach(node => {
        node.x += node.vx
        node.y += node.vy

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1

        node.x = Math.max(0, Math.min(canvas.width, node.x))
        node.y = Math.max(0, Math.min(canvas.height, node.y))
      })

      // Draw lines between nearby nodes
      const maxDistance = 150
      nodes.forEach((node, i) => {
        nodes.slice(i + 1).forEach(otherNode => {
          const dx = node.x - otherNode.x
          const dy = node.y - otherNode.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.3
            ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(otherNode.x, otherNode.y)
            ctx.stroke()
          }
        })

        // Draw lines to mouse cursor
        const dx = node.x - mousePosition.x
        const dy = node.y - mousePosition.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < maxDistance * 1.5) {
          const opacity = (1 - distance / (maxDistance * 1.5)) * 0.4
          const gradient = ctx.createLinearGradient(node.x, node.y, mousePosition.x, mousePosition.y)
          gradient.addColorStop(0, `rgba(139, 92, 246, ${opacity})`)
          gradient.addColorStop(1, `rgba(236, 72, 153, ${opacity})`)
          ctx.strokeStyle = gradient
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(mousePosition.x, mousePosition.y)
          ctx.stroke()
        }

        // Draw nodes
        ctx.fillStyle = 'rgba(99, 102, 241, 0.6)'
        ctx.beginPath()
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [mousePosition])

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-black via-gray-950 to-black">
      {/* Animated background gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-[600px] h-[600px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-15 blur-3xl transition-all duration-1000"
          style={{
            left: `${mousePosition.x / 15}px`,
            top: `${mousePosition.y / 15}px`,
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div 
          className="absolute w-[400px] h-[400px] bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 rounded-full opacity-10 blur-3xl transition-all duration-1000 delay-500"
          style={{
            left: `${50 + mousePosition.x / 30}%`,
            top: `${50 + mousePosition.y / 30}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      {/* Animated lines canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Grid pattern overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#a855f710_1px,transparent_1px),linear-gradient(to_bottom,#a855f710_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />

      <Navigation />
      <Hero />
      <AboutMe />
      <Experience />
      <Projects />
      <Skills />
      <Education />
      <Blogs />
      <Footer />
      <BookMeetingButton />
    </main>
  )
}

