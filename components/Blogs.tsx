'use client'

import { motion, useInView } from 'framer-motion'
import { ExternalLink, Calendar, BookOpen, ArrowUpRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface BlogPost {
  title: string
  link: string
  pubDate: string
  contentSnippet: string
  content?: string
  guid?: string
  categories?: string[]
}

function cleanText(text: string) {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
}

function formatDate(dateString: string) {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}

export default function Blogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    fetch('/api/blogs')
      .then((r) => r.json())
      .then((d) => {
        if (d.blogs) setBlogs(d.blogs)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section id="blogs" ref={ref} className="relative py-28 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="text-center mb-20"
        >
          <span className="section-label">Writing</span>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-black gradient-text"
            style={{ fontFamily: 'var(--font-space, system-ui)' }}
          >
            Blogs
          </h2>
          <p className="mt-4 text-gray-500 text-base max-w-md mx-auto">
            Thoughts on engineering, systems, and software craft
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-8 h-8 rounded-full border-t-2 border-indigo-500 animate-spin" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-24">
            <BookOpen size={48} className="mx-auto text-gray-700 mb-4" />
            <p className="text-gray-600">No articles found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {blogs.map((blog, index) => (
              <motion.a
                key={blog.guid || index}
                href={blog.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 32 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.65,
                  delay: index * 0.09,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group card flex flex-col p-6 sm:p-7 overflow-hidden"
                whileHover={{ y: -4 }}
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <BookOpen size={18} className="text-white" />
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="text-gray-700 group-hover:text-indigo-400 transition-colors mt-1"
                  />
                </div>

                {/* Date */}
                <div className="flex items-center gap-1.5 text-[11px] text-gray-600 mb-3 font-mono">
                  <Calendar size={11} />
                  {formatDate(blog.pubDate)}
                </div>

                {/* Title */}
                <h3
                  className="text-base font-bold text-gray-200 mb-2 line-clamp-2 group-hover:text-white transition-colors leading-snug flex-1"
                  style={{ fontFamily: 'var(--font-space, system-ui)' }}
                >
                  {blog.title}
                </h3>

                {/* Snippet */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                  {cleanText(blog.contentSnippet)}
                </p>

                {/* Categories */}
                {blog.categories && blog.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {blog.categories.slice(0, 3).map((cat, i) => (
                      <span key={i} className="tech-tag">
                        {cat}
                      </span>
                    ))}
                  </div>
                )}

                {/* Read more */}
                <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-semibold mt-auto group-hover:text-indigo-300 transition-colors">
                  Read article
                  <ExternalLink size={12} />
                </div>

                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.03] to-rose-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-[1.25rem]" />
              </motion.a>
            ))}
          </div>
        )}

        {blogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <motion.a
              href="https://medium.com/@sparmeet162000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 glass rounded-full border border-white/10 text-gray-300 text-sm font-medium hover:border-orange-500/30 hover:text-white transition-all duration-200"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <BookOpen size={16} />
              All articles on Medium
            </motion.a>
          </motion.div>
        )}
      </div>
    </section>
  )
}
