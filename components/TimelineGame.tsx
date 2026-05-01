'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

// ── Constants ─────────────────────────────────────────────────────────────────
const CW = 800
const CH = 315
const GROUND = 220
const CHAR_X = 120
const OBSTACLE_GAP = 560  // pixels between obstacles (equidistant)
const OBSTACLE_START = 300 // first obstacle worldX
const GRAVITY = 0.16
const JUMP_F = -7
const INIT_SPD = 2.0
const MAX_SPD = 4.0

interface TLEvent {
  id: string
  year: number
  month: number
  label: string
  sublabel: string
  type: 'education' | 'work' | 'achievement'
}

interface Obs {
  worldX: number
  label: string
  sublabel: string
  date: string
  type: string
  w: number
  h: number
}

type GameState = 'idle' | 'playing' | 'dead' | 'won'

// ── Helpers ──────────────────────────────────────────────────────────────────
function rRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  const rad = Math.min(r, w / 2, h / 2)
  ctx.moveTo(x + rad, y)
  ctx.lineTo(x + w - rad, y)
  ctx.arcTo(x + w, y, x + w, y + rad, rad)
  ctx.lineTo(x + w, y + h - rad)
  ctx.arcTo(x + w, y + h, x + w - rad, y + h, rad)
  ctx.lineTo(x + rad, y + h)
  ctx.arcTo(x, y + h, x, y + h - rad, rad)
  ctx.lineTo(x, y + rad)
  ctx.arcTo(x, y, x + rad, y, rad)
  ctx.closePath()
}

function drawBg(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#06060f'
  ctx.fillRect(0, 0, CW, CH)
  ctx.strokeStyle = 'rgba(99,102,241,0.04)'
  ctx.lineWidth = 1
  for (let x = 0; x < CW; x += 72) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CH); ctx.stroke()
  }
  for (let y = 0; y < CH; y += 72) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CW, y); ctx.stroke()
  }
}

function drawGround(ctx: CanvasRenderingContext2D) {
  const g = ctx.createLinearGradient(0, 0, CW, 0)
  g.addColorStop(0, 'rgba(99,102,241,0.05)')
  g.addColorStop(0.5, 'rgba(99,102,241,0.7)')
  g.addColorStop(1, 'rgba(99,102,241,0.05)')
  ctx.strokeStyle = g
  ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(0, GROUND); ctx.lineTo(CW, GROUND); ctx.stroke()
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function getNowLabel() {
  const d = new Date()
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

function drawNowMarker(ctx: CanvasRenderingContext2D, nowWorldX: number, charWorldX: number) {
  const sx = CHAR_X + (nowWorldX - charWorldX)
  if (sx < -60 || sx > CW + 60) return
  // Glowing vertical line
  ctx.save()
  ctx.strokeStyle = 'rgba(52,211,153,0.7)'
  ctx.lineWidth = 2
  ctx.shadowColor = '#34d399'
  ctx.shadowBlur = 8
  ctx.beginPath(); ctx.moveTo(sx, GROUND - 36); ctx.lineTo(sx, GROUND + 2); ctx.stroke()
  ctx.shadowBlur = 0
  ctx.restore()
  // "NOW" pill
  ctx.textAlign = 'center'
  ctx.font = 'bold 9px system-ui,sans-serif'
  const pillW = 34, pillH = 14
  ctx.fillStyle = 'rgba(52,211,153,0.18)'
  ctx.beginPath()
  rRect(ctx, sx - pillW / 2, GROUND - 52, pillW, pillH, 4)
  ctx.fill()
  ctx.fillStyle = 'rgba(52,211,153,0.95)'
  ctx.fillText('NOW', sx, GROUND - 42)
  // Tick + date label below ground
  ctx.strokeStyle = 'rgba(52,211,153,0.5)'
  ctx.lineWidth = 1.5
  ctx.beginPath(); ctx.moveTo(sx, GROUND + 2); ctx.lineTo(sx, GROUND + 14); ctx.stroke()
  ctx.font = '600 10px ui-monospace,monospace'
  ctx.fillStyle = 'rgba(52,211,153,0.9)'
  ctx.fillText(getNowLabel(), sx, GROUND + 26)
}

function drawMarkers(ctx: CanvasRenderingContext2D, obs: Obs[], charWorldX: number) {
  ctx.textAlign = 'center'
  for (const o of obs) {
    const sx = CHAR_X + (o.worldX - charWorldX)
    if (sx < -60 || sx > CW + 60) continue
    // Tick line
    ctx.strokeStyle = 'rgba(99,102,241,0.5)'
    ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.moveTo(sx + o.w / 2, GROUND + 2); ctx.lineTo(sx + o.w / 2, GROUND + 14); ctx.stroke()
    // Date — distinct: indigo, monospace, smaller
    ctx.font = '600 10px ui-monospace,monospace'
    ctx.fillStyle = 'rgba(129,140,248,0.9)'
    ctx.fillText(o.date, sx + o.w / 2, GROUND + 26)
    // Label — white, system font, slightly larger
    ctx.font = 'bold 10px system-ui,sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.82)'
    ctx.fillText(o.label, sx + o.w / 2, GROUND + 39)
    // Sublabel — muted, smaller
    ctx.font = '9px system-ui,sans-serif'
    ctx.fillStyle = 'rgba(156,163,175,0.7)'
    ctx.fillText(o.sublabel, sx + o.w / 2, GROUND + 51)
  }
}

function drawObs(ctx: CanvasRenderingContext2D, obs: Obs[], charWorldX: number) {
  const palettes: Record<string, { a: string; b: string; icon: string }> = {
    achievement: { a: '#f59e0b', b: '#ef4444', icon: '🏆' },
    education:   { a: '#3b82f6', b: '#6366f1', icon: '🎓' },
    work:        { a: '#8b5cf6', b: '#ec4899', icon: '💼' },
  }
  for (const o of obs) {
    const sx = CHAR_X + (o.worldX - charWorldX)
    if (sx < -o.w - 40 || sx > CW + 40) continue
    const p = palettes[o.type] || palettes.work
    const topY = GROUND - o.h

    // Glow
    ctx.shadowColor = p.a
    ctx.shadowBlur = 14
    const gr = ctx.createLinearGradient(sx, topY, sx + o.w, GROUND)
    gr.addColorStop(0, p.a)
    gr.addColorStop(1, p.b)
    ctx.fillStyle = gr
    ctx.beginPath()
    rRect(ctx, sx, topY, o.w, o.h, 6)
    ctx.fill()
    ctx.shadowBlur = 0

    // Shine strip
    ctx.fillStyle = 'rgba(255,255,255,0.12)'
    ctx.beginPath()
    rRect(ctx, sx + 4, topY + 4, o.w - 8, 6, 3)
    ctx.fill()

    // Icon
    ctx.font = '16px serif'
    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.fillText(p.icon, sx + o.w / 2, topY + o.h / 2 + 6)

  }
}

const CAR_W = 100
const CAR_H = 55   // 1408×768 aspect ≈ 1.83 → 100×55

function drawCar(ctx: CanvasRenderingContext2D, charY: number, frame: number) {
  const cx = CHAR_X
  const imgX = cx - CAR_W / 2
  const imgY = charY - CAR_H

  ctx.save()

  // Shadow (shrinks when airborne)
  const shadowW = 36 * Math.max(0.3, 1 - (GROUND - charY) / 120)
  ctx.fillStyle = 'rgba(79,70,229,0.22)'
  ctx.beginPath()
  ctx.ellipse(cx, GROUND + 5, shadowW, 5, 0, 0, Math.PI * 2)
  ctx.fill()

  // Exhaust puffs when on/near ground
  if (charY >= GROUND - 3) {
    const exhaustX = imgX
    const exhaustY = charY - 18
    const a1 = 0.18 + Math.sin(frame * 0.38) * 0.07
    const a2 = 0.11 + Math.sin(frame * 0.55 + 1) * 0.05
    const a3 = 0.06 + Math.sin(frame * 0.42 + 2) * 0.03
    ctx.fillStyle = `rgba(200,210,220,${a1})`
    ctx.beginPath(); ctx.arc(exhaustX - 0, exhaustY, 5 + Math.sin(frame * 0.28), 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = `rgba(180,190,200,${a2})`
    ctx.beginPath(); ctx.arc(exhaustX - 8, exhaustY - 3, 4, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = `rgba(160,170,180,${a3})`
    ctx.beginPath(); ctx.arc(exhaustX - 15, exhaustY - 5, 3, 0, Math.PI * 2); ctx.fill()
  }

  // Car image
  if (carImg?.complete && carImg.naturalWidth > 0) {
    ctx.drawImage(carImg, imgX, imgY, CAR_W, CAR_H)
  } else {
    // Fallback while image loads
    ctx.fillStyle = '#4f46e5'
    ctx.beginPath(); rRect(ctx, imgX + 5, imgY + CAR_H * 0.4, CAR_W - 10, CAR_H * 0.55, 4); ctx.fill()
  }

  ctx.restore()
}

function drawProgressBar(ctx: CanvasRenderingContext2D, charWorldX: number, worldEnd: number) {
  const progress = Math.max(0, Math.min(1, charWorldX / worldEnd))
  const barX = 16, barY = 12, barW = CW - 32, barH = 4
  ctx.fillStyle = 'rgba(255,255,255,0.06)'
  ctx.beginPath(); rRect(ctx, barX, barY, barW, barH, 2); ctx.fill()
  if (progress > 0) {
    const pGrad = ctx.createLinearGradient(barX, 0, barX + barW * progress, 0)
    pGrad.addColorStop(0, '#6366f1')
    pGrad.addColorStop(1, '#a855f7')
    ctx.fillStyle = pGrad
    ctx.beginPath(); rRect(ctx, barX, barY, Math.max(4, barW * progress), barH, 2); ctx.fill()
  }
}

// ── Car image (loaded once on client) ────────────────────────────────────────
let carImg: HTMLImageElement | null = null

// ── DPI helper ────────────────────────────────────────────────────────────────
function getCtx(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext('2d')!
  const dpr = window.devicePixelRatio || 1
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  return ctx
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function TimelineGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [gameState, setGameState] = useState<GameState>('idle')
  const [hitObs, setHitObs] = useState<Obs | null>(null)
  const [events, setEvents] = useState<TLEvent[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  const [isPortrait, setIsPortrait] = useState(false)
  const [mobileScale, setMobileScale] = useState(1)
  const [desktopScale, setDesktopScale] = useState(1)
  const gameContainerRef = useRef<HTMLDivElement | null>(null)

  // Mutable game state (RAF-accessible)
  const stateRef     = useRef<GameState>('idle')
  const cwXRef       = useRef(-600)
  const cYRef        = useRef(GROUND)
  const velYRef      = useRef(0)
  const onGroundRef  = useRef(true)
  const speedRef     = useRef(INIT_SPD)
  const frameRef     = useRef(0)
  const obsRef       = useRef<Obs[]>([])
  const rafRef       = useRef(0)
  const eventsRef    = useRef<TLEvent[]>([])

  // Callback ref — DPI setup runs every time canvas mounts (desktop or overlay)
  const setCanvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
    canvasRef.current = canvas
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = CW * dpr
    canvas.height = CH * dpr
    if (!carImg) { carImg = new Image(); carImg.src = '/car.png' }
  }, [])

  const buildObs = useCallback((evs: TLEvent[]) => {
    return evs.map((e, i) => ({
      worldX: OBSTACLE_START + i * OBSTACLE_GAP,
      label: e.label,
      sublabel: e.sublabel,
      date: `${MONTHS[e.month - 1]} ${e.year}`,
      type: e.type,
      w: 40,
      h: e.type === 'achievement' ? 58 : e.type === 'education' ? 48 : 42,
    }))
  }, [])

  // Scale desktop canvas to fill the container
  useEffect(() => {
    const el = gameContainerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setDesktopScale(entry.contentRect.width / CW)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Detect mobile / orientation / scale
  useEffect(() => {
    const update = () => {
      const mobile = window.innerWidth < 1024
      const portrait = window.innerHeight > window.innerWidth
      setIsMobile(mobile)
      setIsPortrait(portrait)
      const scaleW = window.innerWidth / CW
      const scaleH = window.innerHeight / CH
      setMobileScale(Math.min(scaleW, scaleH))
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  // Lock body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = showOverlay ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [showOverlay])

  useEffect(() => {
    fetch('/api/portfolio')
      .then(r => r.json())
      .then(d => { if (d.timelineEvents) setEvents(d.timelineEvents) })
      .catch(() => {})
  }, [])

  // Keep eventsRef and obsRef in sync with events state
  useEffect(() => {
    eventsRef.current = events
    obsRef.current = buildObs(events)
  }, [events, buildObs])

  const nowWorldX = events.length > 0
    ? OBSTACLE_START + (events.length - 1) * OBSTACLE_GAP + 500
    : 3800
  const worldEnd = nowWorldX

  // Static preview when idle — re-runs when canvas mounts (showOverlay changes)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || gameState !== 'idle') return
    const ctx = getCtx(canvas)
    const previewWX = 0
    drawBg(ctx)
    drawGround(ctx)
    drawMarkers(ctx, obsRef.current, previewWX)
    drawObs(ctx, obsRef.current, previewWX)
    drawNowMarker(ctx, nowWorldX, previewWX)
    drawCar(ctx, GROUND, 0)
    const fade = ctx.createLinearGradient(CW * 0.55, 0, CW, 0)
    fade.addColorStop(0, 'rgba(6,6,15,0)')
    fade.addColorStop(1, 'rgba(6,6,15,0.85)')
    ctx.fillStyle = fade
    ctx.fillRect(0, 0, CW, CH)
  }, [gameState, events, showOverlay])

  const jump = useCallback(() => {
    if (stateRef.current !== 'playing') return
    if (onGroundRef.current) {
      velYRef.current = JUMP_F
      onGroundRef.current = false
    }
  }, [])

  const startGame = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    obsRef.current = buildObs(eventsRef.current)
    cwXRef.current = -100
    cYRef.current = GROUND
    velYRef.current = 0
    onGroundRef.current = true
    speedRef.current = INIT_SPD
    frameRef.current = 0
    stateRef.current = 'playing'
    setHitObs(null)
    setGameState('playing')
  }, [buildObs])

  const stopGame = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    stateRef.current = 'idle'
    setGameState('idle')
    setShowOverlay(false)
  }, [])

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = getCtx(canvas)
    stateRef.current = 'playing'

    const loop = () => {
      // Re-apply DPR transform each frame (reset by drawBg's fillRect in some browsers)
      getCtx(canvas)
      frameRef.current++
      cwXRef.current += speedRef.current
      speedRef.current = Math.min(speedRef.current + 0.0009, MAX_SPD)

      velYRef.current += GRAVITY
      cYRef.current += velYRef.current
      if (cYRef.current >= GROUND) {
        cYRef.current = GROUND
        velYRef.current = 0
        onGroundRef.current = true
      }

      // Win
      if (cwXRef.current >= worldEnd) {
        stateRef.current = 'won'
        setGameState('won')
        return
      }

      // Collision (AABB) — car bounding box
      const cy = cYRef.current
      const cLeft  = CHAR_X - CAR_W * 0.4
      const cRight = CHAR_X + CAR_W * 0.4
      const cTop   = cy - CAR_H + 6   // slight forgiveness at top
      const cBot   = cy - 4
      for (const o of obsRef.current) {
        const sx = CHAR_X + (o.worldX - cwXRef.current)
        if (sx > CHAR_X + 130 || sx < CHAR_X - 80) continue
        const shrinkX = o.w * 0.22
        const oLeft  = sx + shrinkX
        const oRight = sx + o.w - shrinkX
        const oTop   = GROUND - o.h + 5
        if (cRight > oLeft && cLeft < oRight && cBot > oTop && cTop < GROUND) {
          stateRef.current = 'dead'
          setGameState('dead')
          setHitObs(o)
          return
        }
      }

      // Draw frame
      drawBg(ctx)
      drawGround(ctx)
      drawMarkers(ctx, obsRef.current, cwXRef.current)
      drawObs(ctx, obsRef.current, cwXRef.current)
      drawNowMarker(ctx, nowWorldX, cwXRef.current)
      drawCar(ctx, cYRef.current, frameRef.current)
      drawProgressBar(ctx, cwXRef.current, worldEnd)

      // Jump hint early game
      if (cwXRef.current < 350) {
        const a = Math.max(0, 1 - cwXRef.current / 350) * 0.65
        ctx.font = '11px system-ui,sans-serif'
        ctx.fillStyle = `rgba(129,140,248,${a})`
        ctx.textAlign = 'center'
        ctx.fillText('SPACE / TAP to jump', CHAR_X, GROUND - 50)
      }

      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [gameState])

  // Won: confetti canvas animation
  useEffect(() => {
    if (gameState !== 'won') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = getCtx(canvas)
    const cols = ['#6366f1','#a855f7','#f59e0b','#10b981','#ef4444','#3b82f6','#ec4899']
    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * CW,
      y: -(Math.random() * CH * 0.5),
      vx: (Math.random() - 0.5) * 3.5,
      vy: Math.random() * 2.5 + 1,
      color: cols[Math.floor(Math.random() * cols.length)],
      size: Math.random() * 5 + 2,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.15,
    }))
    const drawWonText = () => {
      ctx.globalAlpha = 1
      ctx.font = 'bold 22px system-ui,sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.92)'
      ctx.textAlign = 'center'
      ctx.fillText("🎉 You made it through Avjeet's journey!", CW / 2, CH / 2 - 14)
      ctx.font = '14px system-ui,sans-serif'
      ctx.fillStyle = 'rgba(129,140,248,0.8)'
      ctx.fillText('Explore the full story below ↓', CW / 2, CH / 2 + 16)
    }
    let f = 0
    const animate = () => {
      f++
      getCtx(canvas)
      drawBg(ctx)
      drawGround(ctx)
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.rot += p.rotV
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0, 1 - f / 180)
        ctx.fillRect(-p.size / 2, -p.size * 0.3, p.size, p.size * 0.6)
        ctx.restore()
      }
      drawWonText()
      if (f < 240) rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [gameState])

  // Dead: draw last frame static
  useEffect(() => {
    if (gameState !== 'dead') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = getCtx(canvas)
    drawBg(ctx)
    drawGround(ctx)
    drawMarkers(ctx, obsRef.current, cwXRef.current)
    drawObs(ctx, obsRef.current, cwXRef.current)
    drawNowMarker(ctx, nowWorldX, cwXRef.current)
    // Stopped car
    drawCar(ctx, cYRef.current, frameRef.current)
    // Dark overlay
    ctx.fillStyle = 'rgba(6,6,15,0.55)'
    ctx.fillRect(0, 0, CW, CH)
  }, [gameState])

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); jump() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [jump])

  // Shared canvas + overlays (used in both desktop and mobile overlay)
  const gameView = (scaled: boolean) => {
    const scale = scaled ? mobileScale : desktopScale
    return (
    <div
      className="relative rounded-2xl overflow-hidden border border-white/8 shadow-2xl shadow-black/60"
      style={{ width: CW * scale, height: CH * scale }}
    >
      <canvas
        ref={setCanvasRef}
        className="block transition-[filter] duration-300"
        style={{
          width: CW,
          height: CH,
          ...(scale !== 1 && { transform: `scale(${scale})`, transformOrigin: 'top left' }),
          cursor: gameState === 'playing' ? 'none' : 'default',
          filter: (gameState === 'idle' || gameState === 'dead') ? 'blur(8px) brightness(0.5)' : 'none',
          touchAction: 'none',
        }}
        onClick={() => { if (gameState === 'playing') jump() }}
      />

      {gameState === 'idle' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <button
            onClick={startGame}
            className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg shadow-lg shadow-indigo-600/30 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <span>🎮</span> View My Timeline
          </button>
          <p className="text-gray-500 text-sm text-center">
            {scaled
              ? 'Tap anywhere to jump · ace every achievement'
              : <><kbd className="px-1.5 py-0.5 rounded bg-white/8 text-gray-400 text-xs font-mono">SPACE</kbd>{' '}or tap to jump · ace every achievement</>
            }
          </p>
        </div>
      )}

      {gameState === 'dead' && hitObs && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <p className="text-white/40 text-xs uppercase tracking-widest font-semibold">You hit a milestone!</p>
          <div className="text-center">
            <p className="text-white font-bold text-xl">{hitObs.label}</p>
            <p className="text-gray-400 text-sm mt-1">{hitObs.sublabel}</p>
          </div>
          <button
            onClick={startGame}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  )
  }

  return (
    <section id="timeline" className="relative py-28 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65 }}
          className="text-center mb-12"
        >
          <span className="section-label">Timeline</span>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-black gradient-text"
            style={{ fontFamily: 'var(--font-space,system-ui)' }}
          >
            My Journey
          </h2>
          <p className="mt-4 text-gray-500 text-base max-w-md mx-auto">
            Ace the achievements — jump over every milestone that shaped the journey
          </p>
        </motion.div>

        {/* Desktop: inline game — ref used by ResizeObserver to compute scale */}
        {!isMobile && (
          <>
            <div ref={gameContainerRef}>
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                {gameView(false)}
              </motion.div>
            </div>

            {gameState === 'won' && (
              <div className="mt-4 flex justify-center">
                <button onClick={startGame} className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/16 border border-white/12 text-white text-sm font-medium transition-all">
                  See Again
                </button>
              </div>
            )}
            {gameState === 'playing' && (
              <div className="mt-4 flex justify-center">
                <button onClick={stopGame} className="px-5 py-2.5 rounded-xl bg-white/8 hover:bg-white/14 border border-white/10 text-gray-400 hover:text-white text-sm font-medium transition-all">
                  ✕ Stop
                </button>
              </div>
            )}
          </>
        )}

        {/* Mobile: teaser */}
        {isMobile && !showOverlay && (
          <div className="flex flex-col items-center gap-4 py-10">
            <button
              onClick={() => setShowOverlay(true)}
              className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg shadow-lg shadow-indigo-600/30 transition-all duration-200 active:scale-95"
            >
              <span>🎮</span> View My Timeline
            </button>
            <p className="text-gray-500 text-sm text-center">Tap to open · rotate to landscape for best experience</p>
          </div>
        )}
      </div>

      {/* Mobile: fullscreen overlay — z-index above nav (z-50) */}
      {isMobile && showOverlay && (
        <div className="fixed inset-0 z-[9999] bg-[#06060f] flex flex-col items-center justify-center">
          {isPortrait ? (
            <div className="flex flex-col items-center gap-4 text-center px-8">
              {/* Close — only shown in portrait since landscape has no spare UI space */}
              <button
                onClick={stopGame}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white text-xl font-bold transition-all"
              >
                ✕
              </button>
              <span className="text-6xl">📱</span>
              <p className="text-white font-bold text-2xl">Rotate to landscape</p>
              <p className="text-gray-400 text-sm">The timeline game needs horizontal space</p>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              {gameView(true)}

              {gameState === 'won' && (
                <button onClick={startGame} className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2.5 rounded-xl bg-white/10 border border-white/12 text-white text-sm font-medium">
                  See Again
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
