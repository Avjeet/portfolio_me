'use client'

import { motion, useInView } from 'framer-motion'
import { ExternalLink, Code, Github } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Project } from '@/lib/data'

function ProjectCard({ project, index, isInView }: {
  project: Project
  index: number
  isInView: boolean
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: -y * 6, y: x * 6 })
  }

  const onMouseLeave = () => setTilt({ x: 0, y: 0 })

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.2s ease-out',
        transformStyle: 'preserve-3d',
      }}
      className="group relative gradient-border h-full"
    >
      {/* Inner card */}
      <div
        className="relative h-full flex flex-col rounded-[1.25rem] border border-white/7 overflow-hidden transition-all duration-400"
        style={{
          background: 'rgba(255,255,255,0.025)',
        }}
      >
        {/* Gradient top bar */}
        <div
          className={`h-[2px] w-full bg-gradient-to-r ${project.color} opacity-60 group-hover:opacity-100 transition-opacity duration-400`}
        />

        <div className="flex flex-col flex-1 p-6 sm:p-7">
          {/* Title + type */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h3
                className="text-xl font-bold text-white mb-1 group-hover:text-indigo-200 transition-colors"
                style={{ fontFamily: 'var(--font-space, system-ui)' }}
              >
                {project.title}
              </h3>
              <span className="inline-block px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-white/6 border border-white/10 text-gray-400">
                {project.type}
              </span>
            </div>
            {/* Gradient icon */}
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center flex-shrink-0 shadow-lg opacity-80 group-hover:opacity-100 transition-opacity`}
            >
              <Code size={18} className="text-white" />
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 mb-4 leading-relaxed">
            {project.description}
          </p>

          {/* Features — max 3 */}
          <ul className="space-y-2 mb-5 flex-1">
            {project.features.slice(0, 3).map((feature, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-xs text-gray-500 leading-relaxed"
              >
                <span className="text-indigo-500 mt-0.5 flex-shrink-0">▸</span>
                <span>{feature.split('.')[0]}.</span>
              </li>
            ))}
          </ul>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.technologies.slice(0, 6).map((tech, i) => (
              <span key={i} className="tech-tag">
                {tech}
              </span>
            ))}
            {project.technologies.length > 6 && (
              <span className="tech-tag opacity-50">
                +{project.technologies.length - 6}
              </span>
            )}
          </div>

          {/* CTA */}
          {project.links && project.links.length > 0 ? (
            <div className="flex gap-2">
              {project.links.map((l) => (
                <motion.a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-semibold transition-all duration-200 border border-indigo-500/40"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <ExternalLink size={12} />
                  {l.label}
                </motion.a>
              ))}
            </div>
          ) : project.link ? (
            <motion.a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white text-sm font-semibold transition-all duration-200 border border-indigo-500/40"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <ExternalLink size={14} />
              View Project
            </motion.a>
          ) : (
            <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/4 text-gray-600 text-sm font-medium border border-white/6 cursor-default">
              Private / In Development
            </div>
          )}
        </div>

        {/* Hover glow */}
        <div
          className={`absolute inset-0 rounded-[1.25rem] bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-400 pointer-events-none`}
        />
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    fetch('/api/portfolio')
      .then((r) => r.json())
      .then((d) => {
        if (d.projects) setProjects(d.projects)
      })
      .catch(() => {})
  }, [])

  return (
    <section id="projects" ref={ref} className="relative py-28 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="text-center mb-20"
        >
          <span className="section-label">Portfolio</span>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-black gradient-text"
            style={{ fontFamily: 'var(--font-space, system-ui)' }}
          >
            Projects
          </h2>
          <p className="mt-4 text-gray-500 text-base max-w-md mx-auto">
            Things I&apos;ve built that I&apos;m proud of
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id || index}
              project={project}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <motion.a
            href="https://github.com/Avjeet"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 glass rounded-full border border-white/10 text-gray-300 text-sm font-medium hover:border-indigo-500/35 hover:text-white transition-all duration-200"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <Github size={17} />
            More on GitHub
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
