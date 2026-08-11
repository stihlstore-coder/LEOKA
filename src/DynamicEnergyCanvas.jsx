import { useEffect, useRef } from 'react'

const TAU = Math.PI * 2
const LOOP = 48000

const seeded = (index, salt = 1) => {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453
  return value - Math.floor(value)
}

const lerp = (a, b, amount) => a + (b - a) * amount

function DynamicEnergyCanvas({ variant = 'default' }) {
  const canvasRef = useRef(null)
  const stageRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const stage = stageRef.current
    if (!canvas || !stage) return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.matchMedia('(max-width: 800px)').matches
    const particleCount = mobile ? 24 : 42
    const particles = Array.from({ length: particleCount }, (_, index) => ({
      angle: seeded(index, 2) * TAU,
      radius: .18 + seeded(index, 3) * .82,
      phase: seeded(index, 4) * TAU,
      speed: 1 + index % 3,
      size: .45 + seeded(index, 5) * 1.15,
    }))
    const arcs = Array.from({ length: variant === 'hero' || variant === 'cta' ? 3 : 5 }, (_, index) => ({
      start: .16 + seeded(index, 6) * .68,
      end: .18 + seeded(index, 7) * .64,
      bend: (seeded(index, 8) - .5) * .22,
      phase: seeded(index, 9) * TAU,
      width: .55 + seeded(index, 10) * .65,
      pulseOffset: seeded(index, 11),
    }))
    const arcGeometry = arcs.map(() => ({
      a: { x: 0, y: 0 },
      b: { x: 0, y: 0 },
      c: { x: 0, y: 0 },
      branch: { x: 0, y: 0 },
      pulse: { x: 0, y: 0 },
    }))
    const setPoint = (target, centerX, centerY, radius, angle, distance) => {
      target.x = centerX + Math.cos(angle) * radius * distance
      target.y = centerY + Math.sin(angle) * radius * distance * .58
      return target
    }

    let width = 0
    let height = 0
    let frame = 0
    let visible = false
    const start = performance.now()

    const resize = () => {
      const rect = stage.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.75)
      width = rect.width
      height = rect.height
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(stage)
    resize()

    const drawArc = (arc, progress, index) => {
      const centerX = variant === 'hero' ? width * .72 : variant === 'cta' ? width * .62 : width * .58
      const centerY = variant === 'hero' ? height * .48 : height * .5
      const radius = Math.min(width, height) * (.2 + (index % 3) * .075)
      const startAngle = arc.start * TAU + progress * TAU * (index % 2 ? -1 : 1)
      const endAngle = startAngle + (index % 2 ? -1.15 : 1.3) + arc.end * .7
      const geometry = arcGeometry[index]
      const a = setPoint(geometry.a, centerX, centerY, radius, startAngle, .62)
      const b = setPoint(geometry.b, centerX, centerY, radius, (startAngle + endAngle) * .5 + arc.bend * Math.sin(progress * TAU + arc.phase), .98)
      const c = setPoint(geometry.c, centerX, centerY, radius, endAngle, .62)

      ctx.save()
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.quadraticCurveTo(b.x, b.y, c.x, c.y)
      ctx.strokeStyle = `rgba(151, 92, 255, ${.14 + .06 * Math.sin(progress * TAU + arc.phase)})`
      ctx.lineWidth = arc.width * 5
      ctx.shadowColor = '#7a38e8'
      ctx.shadowBlur = 14
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.quadraticCurveTo(b.x, b.y, c.x, c.y)
      ctx.strokeStyle = 'rgba(238, 228, 255, .72)'
      ctx.lineWidth = arc.width * .45
      ctx.shadowColor = '#d0aaff'
      ctx.shadowBlur = 7
      ctx.stroke()

      if (index % 2 === 0 && variant !== 'hero') {
        const branch = setPoint(geometry.branch, centerX, centerY, radius, (startAngle + endAngle) * .5 + .42, .78)
        ctx.beginPath()
        ctx.moveTo(b.x, b.y)
        ctx.quadraticCurveTo((b.x + branch.x) * .5, (b.y + branch.y) * .5, branch.x, branch.y)
        ctx.strokeStyle = 'rgba(185, 137, 255, .38)'
        ctx.lineWidth = arc.width * .32
        ctx.shadowBlur = 5
        ctx.stroke()
      }

      const pulse = (progress * (1.15 + index * .08) + arc.pulseOffset) % 1
      const pulsePoint = geometry.pulse
      pulsePoint.x = lerp(lerp(a.x, b.x, pulse), lerp(b.x, c.x, pulse), pulse)
      pulsePoint.y = lerp(lerp(a.y, b.y, pulse), lerp(b.y, c.y, pulse), pulse)
      const pulseGlow = ctx.createRadialGradient(pulsePoint, pulsePoint, 0, pulsePoint, pulsePoint, 14)
      pulseGlow.addColorStop(0, 'rgba(255,255,255,.95)')
      pulseGlow.addColorStop(.18, 'rgba(216,183,255,.8)')
      pulseGlow.addColorStop(1, 'rgba(126,57,231,0)')
      ctx.fillStyle = pulseGlow
      ctx.beginPath(); ctx.arc(pulsePoint.x, pulsePoint.y, 14, 0, TAU); ctx.fill()
      ctx.restore()
    }

    const draw = (now) => {
      frame = 0
      const progress = reduced ? 0 : ((now - start) % LOOP) / LOOP
      const phase = progress * TAU
      ctx.clearRect(0, 0, width, height)
      const cx = variant === 'hero' ? width * .72 : width * .58
      const cy = height * .5
      const atmosphere = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(width, height) * .62)
      atmosphere.addColorStop(0, 'rgba(104, 40, 202, .09)')
      atmosphere.addColorStop(.55, 'rgba(44, 16, 92, .035)')
      atmosphere.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = atmosphere
      ctx.fillRect(0, 0, width, height)

      particles.forEach((particle, index) => {
        const angle = particle.angle + phase * particle.speed * .32
        const radius = particle.radius * Math.min(width, height) * .54
        const x = cx + Math.cos(angle) * radius
        const y = cy + Math.sin(angle) * radius * .6
        const alpha = .1 + .1 * Math.sin(phase * (1 + index % 3) + particle.phase)
        ctx.globalAlpha = alpha
        ctx.fillStyle = index % 9 === 0 ? '#eee5ff' : '#a77cff'
        ctx.beginPath(); ctx.arc(x, y, particle.size, 0, TAU); ctx.fill()
      })
      ctx.globalAlpha = 1
      arcs.forEach((arc, index) => drawArc(arc, progress, index))
      if (reduced) return
      if (visible && document.visibilityState === 'visible') frame = requestAnimationFrame(draw)
    }

    const schedule = () => {
      if (!frame && visible && document.visibilityState === 'visible' && !reduced) frame = requestAnimationFrame(draw)
    }
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) draw(performance.now())
      else if (frame) { cancelAnimationFrame(frame); frame = 0 }
    }, { rootMargin: '120px 0px' })
    visibilityObserver.observe(stage)
    const onVisibility = () => {
      if (document.visibilityState !== 'visible' && frame) { cancelAnimationFrame(frame); frame = 0 }
      else schedule()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [variant])

  return <canvas ref={canvasRef} className="dynamic-energy-canvas" aria-hidden="true" />
}

export default DynamicEnergyCanvas
