import { useEffect, useRef } from 'react'

const TAU = Math.PI * 2
// All animation frequencies complete an integer number of cycles in this
// duration, so progress 0 and progress 1 render the same state.
const LOOP_DURATION = 28000

const seeded = (index, salt) => {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453
  return value - Math.floor(value)
}

const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value))
const circularDistance = (a, b) => { const distance = Math.abs(a - b) % 1; return Math.min(distance, 1 - distance) }

function WorkforceEnergyCanvas({ onNodePosition, children }) {
  const canvasRef = useRef(null)
  const stageRef = useRef(null)
  const positionRef = useRef(onNodePosition)
  positionRef.current = onNodePosition

  useEffect(() => {
    const canvas = canvasRef.current
    const stage = stageRef.current
    if (!canvas || !stage) return undefined
    const context = canvas.getContext('2d')
    if (!context) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.matchMedia('(max-width: 800px)').matches
    const rings = [
      { rx: .29, ry: .12, rotation: -.3, speed: 1, alpha: .23 },
      { rx: .37, ry: .2, rotation: .62, speed: -2, alpha: .17 },
      { rx: .46, ry: .29, rotation: -.58, speed: 1, alpha: .13 },
      { rx: .55, ry: .39, rotation: .16, speed: -1, alpha: .1 },
      { rx: .49, ry: .17, rotation: 1.02, speed: 2, alpha: .095 },
    ]
    const nodes = [
      { angle: -.2, rx: .3, ry: .14, rotation: -.3, phase: .02, cycles: 1 },
      { angle: 2.15, rx: .41, ry: .23, rotation: .62, phase: .17, cycles: 2 },
      { angle: -.28, rx: .52, ry: .35, rotation: -.58, phase: .34, cycles: 1 },
      { angle: 1.05, rx: .53, ry: .38, rotation: .16, phase: .51, cycles: 2 },
      { angle: 2.9, rx: .48, ry: .17, rotation: 1.02, phase: .68, cycles: 3 },
      { angle: .48, rx: .43, ry: .27, rotation: -.58, phase: .85, cycles: 1 },
    ]
    const particles = Array.from({ length: mobile ? 48 : 112 }, (_, index) => ({
      angle: seeded(index, 2) * TAU,
      radius: .22 + seeded(index, 3) * .86,
      cycles: 1 + index % 4,
      phase: seeded(index, 5) * TAU,
      size: .35 + seeded(index, 6) * 1.05,
      layer: index % 3,
    }))
    const arcs = nodes.map((_, index) => ({
      seed: seeded(index, 14), phase: seeded(index, 15),
      branches: mobile ? 2 : 3, segments: mobile ? 15 : 23,
      width: .72 + seeded(index, 16) * .5,
    }))

    let width = 0
    let height = 0
    let frame = 0
    let visible = false
    const start = performance.now()

    const resize = () => {
      const rect = stage.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(stage)
    resize()

    const center = () => ({ x: width * (mobile ? .53 : .57), y: height * .5 })
    const orbitPoint = (node, progress) => {
      const theta = node.angle + progress * TAU * node.cycles + Math.sin(progress * TAU + node.phase * TAU) * .025
      const c = center()
      const x = Math.cos(theta) * node.rx * width
      const y = Math.sin(theta) * node.ry * height
      return { x: c.x + x * Math.cos(node.rotation) - y * Math.sin(node.rotation), y: c.y + x * Math.sin(node.rotation) + y * Math.cos(node.rotation), depth: Math.sin(theta + node.phase) }
    }
    const drawPath = (points, lineWidth, color, blur = 0) => {
      context.save()
      context.beginPath()
      points.forEach((point, index) => index ? context.lineTo(point.x, point.y) : context.moveTo(point.x, point.y))
      context.strokeStyle = color
      context.lineWidth = lineWidth
      context.lineCap = 'round'
      context.lineJoin = 'round'
      context.shadowColor = '#7d3ce8'
      context.shadowBlur = blur
      context.stroke()
      context.restore()
    }
    const lightningPath = (from, to, arc, progress, branch = 0, scale = 1) => {
      const dx = to.x - from.x
      const dy = to.y - from.y
      const length = Math.hypot(dx, dy) || 1
      const nx = -dy / length
      const ny = dx / length
      return Array.from({ length: arc.segments + 1 }, (_, index) => {
        const t = index / arc.segments
        const envelope = Math.sin(Math.PI * t)
        const seed = arc.seed + branch * 3.73
        const noise = Math.sin(index * 2.29 + seed * 12 + progress * TAU * (2 + branch)) * .58
          + Math.sin(index * 5.17 - seed * 8 + progress * TAU * (3 + branch)) * .28
          + Math.sin(index * 9.41 + seed * 5 - progress * TAU * (5 + branch)) * .14
        const amount = (10 + length * .018) * scale * envelope * noise
        return { x: from.x + dx * t + nx * amount, y: from.y + dy * t + ny * amount }
      })
    }
    const pulsePosition = (points, amount) => {
      const scaled = amount * (points.length - 1)
      const index = Math.min(points.length - 2, Math.floor(scaled))
      const local = scaled - index
      const a = points[index]
      const b = points[index + 1]
      return { x: a.x + (b.x - a.x) * local, y: a.y + (b.y - a.y) * local }
    }
    const drawLightning = (from, to, arc, progress) => {
      const burst = Math.exp(-(circularDistance((progress + arc.phase) % 1, .18) ** 2) / .012)
      const secondaryBurst = Math.exp(-(circularDistance((progress + arc.phase) % 1, .68) ** 2) / .02)
      const flicker = .88 + .08 * Math.sin(progress * TAU * 17 + arc.seed * 9) + .04 * Math.sin(progress * TAU * 31 + arc.phase * 7)
      const intensity = clamp((.08 + burst * .9 + secondaryBurst * .42) * flicker)
      const primary = lightningPath(from, to, arc, progress)
      drawPath(primary, 16 * intensity * arc.width, `rgba(107, 45, 219, ${.06 + intensity * .18})`, 30)
      drawPath(primary, 5.5 * intensity * arc.width, `rgba(163, 89, 255, ${.08 + intensity * .42})`, 14)
      drawPath(primary, .75 + intensity * 1.15, `rgba(255, 249, 255, ${.18 + intensity * .82})`, 3)

      for (let branch = 0; branch < arc.branches; branch += 1) {
        const anchor = .19 + ((arc.seed * .41 + branch * .24) % .58)
        const base = primary[Math.floor(anchor * (primary.length - 1))]
        const direction = branch % 2 ? 1 : -1
        const distance = (22 + branch * 12) * direction
        const branchEnd = { x: base.x + (-((to.y - from.y) / (Math.hypot(to.x - from.x, to.y - from.y) || 1)) * distance) + (to.x - from.x) * .06, y: base.y + (((to.x - from.x) / (Math.hypot(to.x - from.x, to.y - from.y) || 1)) * distance) + (to.y - from.y) * .06 }
        const secondary = lightningPath(base, branchEnd, { ...arc, segments: 7 + branch * 2, seed: arc.seed + branch * 6.1 }, progress + branch * .037, branch + 1, .7)
        const branchLife = intensity * (.42 + .58 * (.5 + .5 * Math.sin(progress * TAU * (2 + branch) + arc.phase + branch)))
        drawPath(secondary, 2.8 * branchLife, `rgba(166, 93, 255, ${.11 + branchLife * .38})`, 9)
        drawPath(secondary, .4 + branchLife * .4, `rgba(255, 247, 255, ${.2 + branchLife * .6})`, 2)
        if (!mobile) {
          const microBase = secondary[Math.floor(secondary.length * .58)]
          const micro = lightningPath(microBase, { x: microBase.x + direction * 20, y: microBase.y + 12 + branch * 6 }, { ...arc, segments: 5, seed: arc.seed + branch * 11 }, progress + .12, branch + 4, .28)
          drawPath(micro, .32 + branchLife * .22, `rgba(238, 221, 255, ${branchLife * .58})`, 2)
        }
      }

      const travel = (progress * (1 + (arc.segments % 3)) + arc.phase * .73) % 1
      const point = pulsePosition(primary, travel)
      const pulse = context.createRadialGradient(point.x, point.y, 0, point.x, point.y, 21)
      pulse.addColorStop(0, `rgba(255,255,255,${.2 + intensity * .78})`)
      pulse.addColorStop(.16, `rgba(237,211,255,${.18 + intensity * .56})`)
      pulse.addColorStop(.42, `rgba(139,70,240,${.12 + intensity * .32})`)
      pulse.addColorStop(1, 'rgba(88,35,190,0)')
      context.fillStyle = pulse
      context.beginPath(); context.arc(point.x, point.y, 21, 0, TAU); context.fill()
      return { intensity, arrival: Math.exp(-(circularDistance(travel, .98) ** 2) / .006) * intensity }
    }

    const draw = (now) => {
      frame = 0
      const progress = reduced ? 0 : ((now - start) % LOOP_DURATION) / LOOP_DURATION
      const phase = progress * TAU
      const c = center()
      context.clearRect(0, 0, width, height)
      const haze = context.createRadialGradient(c.x, c.y, 0, c.x, c.y, Math.max(width, height) * .68)
      haze.addColorStop(0, 'rgba(104, 38, 199, .17)'); haze.addColorStop(.45, 'rgba(43, 14, 83, .08)'); haze.addColorStop(1, 'rgba(0,0,0,0)')
      context.fillStyle = haze; context.fillRect(0, 0, width, height)
      particles.forEach((particle, index) => {
        const angle = particle.angle + phase * particle.cycles
        const radius = particle.radius * Math.min(width, height) * .62
        const x = c.x + Math.cos(angle) * radius
        const y = c.y + Math.sin(angle) * radius * (.57 + particle.layer * .04)
        const alpha = .055 + particle.layer * .025 + .04 * (.5 + .5 * Math.sin(phase * (1 + particle.layer) + particle.phase))
        context.globalAlpha = alpha; context.fillStyle = index % 11 === 0 ? '#f2eaff' : '#aa7be9'
        context.beginPath(); context.arc(x, y, particle.size, 0, TAU); context.fill()
      })
      context.globalAlpha = 1
      rings.forEach((ring, index) => {
        context.save(); context.translate(c.x, c.y); context.rotate(ring.rotation + phase * ring.speed); context.scale(1, ring.ry / ring.rx)
        context.beginPath(); context.ellipse(0, 0, ring.rx * width, ring.rx * width, 0, 0, TAU)
        context.strokeStyle = `rgba(179, 137, 250, ${ring.alpha})`; context.lineWidth = index % 2 ? .8 : .55; context.setLineDash(index % 2 ? [2, 10] : [1, 7]); context.lineDashOffset = -Math.sin(phase) * 4; context.stroke(); context.restore()
      })

      const nodePoints = nodes.map((node) => orbitPoint(node, progress))
      const reactions = nodePoints.map((point, index) => drawLightning(c, point, arcs[index], progress))
      nodePoints.forEach((point, index) => {
        const reaction = reactions[index].arrival
        const endpoint = context.createRadialGradient(point.x, point.y, 0, point.x, point.y, 28)
        endpoint.addColorStop(0, `rgba(255,255,255,${.12 + reaction * .55})`); endpoint.addColorStop(.18, `rgba(189,119,255,${.13 + reaction * .42})`); endpoint.addColorStop(1, 'rgba(97,40,198,0)')
        context.fillStyle = endpoint; context.beginPath(); context.arc(point.x, point.y, 28, 0, TAU); context.fill()
        positionRef.current(index, point, reaction, Math.sin(point.depth) * .5 + .5)
      })

      const coreRadius = Math.min(width, height) * (mobile ? .14 : .115)
      const corePulse = .5 + .5 * Math.sin(phase)
      const aura = context.createRadialGradient(c.x, c.y, coreRadius * .2, c.x, c.y, coreRadius * 3.7)
      aura.addColorStop(0, `rgba(149, 77, 255, ${.4 + corePulse * .06})`); aura.addColorStop(.32, 'rgba(91,35,173,.18)'); aura.addColorStop(1, 'rgba(48,18,102,0)')
      context.fillStyle = aura; context.beginPath(); context.arc(c.x, c.y, coreRadius * 3.7, 0, TAU); context.fill()
      for (let i = 0; i < 3; i += 1) {
        context.save(); context.translate(c.x, c.y); context.rotate(i * 1.8 + phase * (i % 2 ? -1 : 1)); context.scale(1, .22 + i * .07); context.beginPath(); context.ellipse(0, 0, coreRadius * (1.7 + i * .32), coreRadius * (1.7 + i * .32), 0, 0, TAU); context.strokeStyle = `rgba(205,175,255,${.16 - i * .025})`; context.lineWidth = .8; context.setLineDash([2, 8]); context.stroke(); context.restore()
      }
      const core = context.createRadialGradient(c.x - coreRadius * .32, c.y - coreRadius * .38, 0, c.x, c.y, coreRadius)
      core.addColorStop(0, '#fff8ff'); core.addColorStop(.1, '#bd86ff'); core.addColorStop(.4, '#4a158d'); core.addColorStop(.78, '#17062e'); core.addColorStop(1, '#050208')
      context.fillStyle = core; context.shadowColor = '#843ee6'; context.shadowBlur = 24 + corePulse * 10; context.beginPath(); context.arc(c.x, c.y, coreRadius, 0, TAU); context.fill(); context.shadowBlur = 0; context.strokeStyle = '#d7bdff'; context.lineWidth = .8; context.stroke()
      for (let i = 0; i < 20; i += 1) {
        const a = i / 20 * TAU + phase * (i % 2 ? -1 : 2); const radius = coreRadius * (.26 + (i % 6) * .1)
        context.globalAlpha = .16 + corePulse * .13; context.fillStyle = i % 5 === 0 ? '#fff' : '#ae7bff'; context.beginPath(); context.arc(c.x + Math.cos(a) * radius, c.y + Math.sin(a) * radius, i % 4 === 0 ? 1.2 : .65, 0, TAU); context.fill()
      }
      context.globalAlpha = 1; context.fillStyle = '#fff'; context.textAlign = 'center'; context.font = `600 ${Math.max(12, coreRadius * .28)}px var(--mono)`; context.fillText('LEOKA', c.x, c.y - 2); context.fillStyle = '#cdb4f3'; context.font = `${Math.max(6, coreRadius * .105)}px var(--mono)`; context.fillText('SHARED INTELLIGENCE', c.x, c.y + coreRadius * .24)
      if (visible && document.visibilityState === 'visible' && !reduced) frame = requestAnimationFrame(draw)
    }

    const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) draw(performance.now()); else if (frame) { cancelAnimationFrame(frame); frame = 0 } }, { rootMargin: '120px 0px' })
    visibilityObserver.observe(stage)
    const onVisibility = () => { if (document.visibilityState !== 'visible' && frame) { cancelAnimationFrame(frame); frame = 0 } else if (visible && !reduced && !frame) frame = requestAnimationFrame(draw) }
    document.addEventListener('visibilitychange', onVisibility)
    return () => { if (frame) cancelAnimationFrame(frame); resizeObserver.disconnect(); visibilityObserver.disconnect(); document.removeEventListener('visibilitychange', onVisibility) }
  }, [])

  return <div ref={stageRef} className="workforce-visual"><canvas ref={canvasRef} role="img" aria-label="A living LEOKA intelligence core connected to six specialized AI employees" />{children}</div>
}

export { LOOP_DURATION }
export default WorkforceEnergyCanvas
