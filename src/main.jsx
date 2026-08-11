import { StrictMode, useCallback, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import './ecosystem.css'
import './workforce.css'
import './method.css'
import './footer.css'
import DynamicEnergyCanvas from './DynamicEnergyCanvas.jsx'
import WorkforceEnergyCanvas from './WorkforceEnergyCanvas.jsx'
import { legalPages } from './legal.js'
import { company } from './siteConfig.js'

const siteUrl = import.meta.env.VITE_SITE_URL?.replace(/\/$/, '')
const siteDescription = 'LEOKA is an AI-native technology company building software, intelligent systems and digital products through a specialized AI workforce.'

const SECTION_NUMBERS = Object.freeze({
  hero: '01',
  company: '02',
  workforce: '03',
  workflow: '04',
  ecosystem: '05',
  nextBuild: '06',
})
const RESOLVED_SECTION_NUMBERS = [
  SECTION_NUMBERS.hero,
  SECTION_NUMBERS.company,
  SECTION_NUMBERS.workforce,
  SECTION_NUMBERS.workflow,
  SECTION_NUMBERS.ecosystem,
  SECTION_NUMBERS.nextBuild,
]

if (import.meta.env.DEV) {
  const expectedSectionNumbers = ['01', '02', '03', '04', '05', '06']
  if (
    RESOLVED_SECTION_NUMBERS.length !== 6
    || new Set(RESOLVED_SECTION_NUMBERS).size !== 6
    || RESOLVED_SECTION_NUMBERS.join(',') !== expectedSectionNumbers.join(',')
  ) {
    throw new Error(`Invalid numbered section structure: ${RESOLVED_SECTION_NUMBERS.join(',')}`)
  }
}

function setMetaContent(selector, content) {
  const element = document.querySelector(selector)
  if (element) element.setAttribute('content', content)
}

const departments = [
  ['PRODUCT', 'AI Product Manager'], ['RESEARCH', 'AI Researcher'],
  ['ENGINEERING', 'AI Engineer'], ['SYSTEM', 'AI System Architect'],
  ['DATA', 'AI Data Engineer'], ['QUALITY', 'AI QA Engineer']
]

const productSystems = [
  ['01', 'SOFTWARE', 'Digital foundations designed to move with the world.', 'software'],
  ['02', 'AI SYSTEMS', 'Specialized intelligence shaped into useful systems.', 'intelligence'],
  ['03', 'DIGITAL PRODUCTS', 'Clear, capable experiences for ambitious organizations.', 'product'],
  ['04', 'AUTOMATION', 'Workflows that turn complexity into momentum.', 'automation'],
  ['05', 'DATA INFRASTRUCTURE', 'The connective tissue behind better decisions.', 'data'],
  ['06', 'INTELLIGENT PLATFORMS', 'Technology that learns, responds, and evolves.', 'platform']
]

// The repository currently has no separate application registry or product URL.
// Keep this section data-driven so verified product metadata can be added without
// changing the visualization itself.
const productUrl = ''
const workWithLeokaHref = 'mailto:admin@leoka.us?subject=Work%20with%20LEOKA'

function Arrow() { return <span className="arrow" aria-hidden="true">↗</span> }
function Reveal({ children, className = '', ...props }) { return <div className={`reveal ${className}`} {...props}>{children}</div> }

function Starfield({ density = 35 }) {
  return <div className="starfield" aria-hidden="true">{Array.from({ length: density }, (_, i) => <i key={i} style={{ '--x': `${(i * 47) % 101}%`, '--y': `${(i * 71) % 97}%`, '--delay': `${(i % 7) * -.8}s`, '--size': `${i % 5 === 0 ? 2 : 1}px` }} />)}</div>
}

function OrbitalStructure({ variant = 'hero' }) {
  return <div className={`orbital-structure ${variant}`} aria-hidden="true">
    <div className="structure-aura" /><div className="structure-ring ring-one" /><div className="structure-ring ring-two" /><div className="structure-ring ring-three" />
    <div className="structure-core"><span />{variant !== 'hero' && <b>L</b>}<small>INTELLIGENCE CORE</small></div>
    <div className="structure-axis" /><div className="structure-beam beam-one" /><div className="structure-beam beam-two" />
    <div className="structure-satellite satellite-one" /><div className="structure-satellite satellite-two" />
  </div>
}

function CosmicScene({ variant, children }) {
  return <div className={`cosmic-scene scene-${variant}`} aria-hidden="true"><Starfield density={variant === 'workforce' ? 50 : 34} /><div className="nebula nebula-one" /><div className="nebula nebula-two" />{variant !== 'workforce' && variant !== 'workflow' && <DynamicEnergyCanvas variant={variant} />}{children}</div>
}

function Nav() {
  const [open, setOpen] = useState(false)
  const links = [['Company', '#company'], ['AI Workforce', '#workforce'], ['Product Ecosystem', '#ecosystem'], ['Contact', '#contact']]
  const hrefFor = href => window.location.pathname === '/' ? href : `/${href}`
  return <><a className="skip-link" href="#main-content">Skip to main content</a><header className="nav-wrap"><nav className="nav container" aria-label="Main navigation"><a className="brand" href={hrefFor('#top')}><span className="brand-mark">L</span><span>LEOKA</span></a><button type="button" className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="main-navigation" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}><span /><span /></button><div id="main-navigation" className={`nav-links ${open ? 'is-open' : ''}`}>{links.map(([label, href]) => <a key={href} href={hrefFor(href)} onClick={() => setOpen(false)}>{label}</a>)}<a className="nav-cta" href={workWithLeokaHref} onClick={() => setOpen(false)}>Work With LEOKA <Arrow /></a></div></nav></header></>
}

function Hero() {
  return <section className="hero" id="top"><CosmicScene variant="hero"><OrbitalStructure /></CosmicScene><div className="hero-content container"><Reveal><p className="eyebrow"><span className="live-dot" /> AI-NATIVE TECHNOLOGY COMPANY</p><h1>LEOKA<br /><span>AI-NATIVE</span><br />TECHNOLOGY<br /><em>COMPANY.</em></h1><p className="hero-lede">We build software, intelligent systems and digital products through a specialized AI workforce.</p><div className="hero-actions"><a className="button button-primary" href="#company">Explore LEOKA <Arrow /></a><a className="text-link" href="#contact">Work With Us <Arrow /></a></div></Reveal></div><div className="hero-meta"><span>{SECTION_NUMBERS.hero} / 06</span><span>THE COMPANY THAT BUILDS THE TECHNOLOGY</span></div><div className="hero-scroll">SCROLL TO EXPLORE <i /></div></section>
}

function Company() {
  return <section className="company section" id="company"><CosmicScene variant="company"><div className="geometry geometry-company" /><div className="geometry geometry-company-two" /></CosmicScene><div className="container company-grid"><Reveal><p className="section-kicker">{SECTION_NUMBERS.company} / THE COMPANY</p><h2>Built<br /><span>differently.</span></h2></Reveal><Reveal className="company-copy"><p className="large-copy">LEOKA is an AI-native technology company developing software, intelligent systems and digital products through a specialized AI workforce.</p><p>What makes us different is not a single AI model. It is the organization built around it — a new operating model for creating technology.</p><a className="text-link" href="#workforce">See how we operate <Arrow /></a></Reveal></div></section>
}

// Retained below for compatibility with the original section prototype; the
// rendered section uses WorkforceEnergyCanvas instead.
// eslint-disable-next-line no-unused-vars
function WorkforceVisual({ active, onActivate }) {
  const canvasRef = useRef(null)
  const stageRef = useRef(null)
  const buttonRefs = useRef([])
  const activeRef = useRef(active)
  const activateRef = useRef(onActivate)
  const pointerRef = useRef({ x: 0, y: 0 })
  activeRef.current = active
  activateRef.current = onActivate

  useEffect(() => {
    const canvas = canvasRef.current
    const stage = stageRef.current
    if (!canvas || !stage) return undefined
    const context = canvas.getContext('2d')
    if (!context) return undefined
    const TAU = Math.PI * 2
    const LOOP_DURATION = 24000
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.matchMedia('(max-width: 800px)').matches
    const seeded = (index, salt) => { const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453; return value - Math.floor(value) }
    const orbits = [
      { rx: .29, ry: .105, rot: -.22, cycles: 2, phase: .2, depth: .11 }, { rx: .35, ry: .18, rot: .7, cycles: 3, phase: 2.3, depth: .17 },
      { rx: .43, ry: .27, rot: -.58, cycles: 1, phase: 4.1, depth: .25 }, { rx: .5, ry: .35, rot: .18, cycles: 2, phase: 5.3, depth: .34 },
      { rx: .56, ry: .17, rot: 1.05, cycles: 3, phase: 1.1, depth: .18 }, { rx: .47, ry: .42, rot: -.9, cycles: 1, phase: 2.7, depth: .4 }
    ]
    const stars = Array.from({ length: mobile ? 72 : 144 }, (_, i) => ({ angle: seeded(i, 2) * TAU, radius: .28 + seeded(i, 3) * .75, phase: seeded(i, 4) * TAU, cycles: 1 + i % 4, size: i % 13 === 0 ? 1.4 : .45 + seeded(i, 5) * 1.1, layer: i % 3 }))
    const particles = Array.from({ length: mobile ? 28 : 58 }, (_, i) => ({ angle: seeded(i, 6) * TAU, radius: .22 + seeded(i, 7) * .8, phase: seeded(i, 8) * TAU, cycles: 2 + i % 5, size: .55 + seeded(i, 9) * 1.2 }))
    const arcs = orbits.map((_, index) => ({
      segments: mobile ? 15 : 21,
      seed: seeded(index, 21),
      phase: seeded(index, 22) * TAU,
      branchCount: mobile ? 2 : 3,
      pulsePhase: seeded(index, 23),
    }))
    let frame = 0; let visible = false; let start = performance.now(); let width = 0; let height = 0
    const resize = () => { const rect = stage.getBoundingClientRect(); const dpr = Math.min(window.devicePixelRatio || 1, 2); width = rect.width; height = rect.height; canvas.width = Math.floor(width * dpr); canvas.height = Math.floor(height * dpr); canvas.style.width = `${width}px`; canvas.style.height = `${height}px`; context.setTransform(dpr, 0, 0, dpr, 0, 0) }
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(stage); resize()
    const centerFor = () => ({ x: width * .55 + pointerRef.current.x * 4, y: height * .5 + pointerRef.current.y * 4 })
    const pointFor = (orbit, progress, offset = 0) => { const theta = orbit.phase + offset + progress * TAU * orbit.cycles; const c = centerFor(); const rawX = Math.cos(theta) * orbit.rx * width; const rawY = Math.sin(theta) * orbit.ry * height; return { x: c.x + rawX * Math.cos(orbit.rot) - rawY * Math.sin(orbit.rot), y: c.y + rawX * Math.sin(orbit.rot) + rawY * Math.cos(orbit.rot), z: Math.sin(theta + orbit.phase) * orbit.depth } }
    const pathStroke = (points, widthValue, color, blur = 0) => {
      context.save(); context.beginPath(); points.forEach((point, i) => i ? context.lineTo(point.x, point.y) : context.moveTo(point.x, point.y))
      context.strokeStyle = color; context.lineWidth = widthValue; context.lineCap = 'round'; context.lineJoin = 'round'; context.shadowColor = '#8a47ed'; context.shadowBlur = blur; context.stroke(); context.restore()
    }
    const lightningPath = (from, to, arc, progress, branch = 0, scale = 1) => {
      const dx = to.x - from.x; const dy = to.y - from.y; const length = Math.hypot(dx, dy) || 1; const nx = -dy / length; const ny = dx / length
      const points = Array.from({ length: arc.segments + 1 }, (_, i) => {
        const t = i / arc.segments; const envelope = Math.sin(Math.PI * t); const seed = arc.seed + branch * 4.13
        const noise = Math.sin(i * 2.37 + seed * 11 + TAU * progress * (2 + branch) + arc.phase) * 0.58 + Math.sin(i * 5.71 + seed * 7 - TAU * progress * 3) * .27 + Math.sin(i * 9.17 + seed * 13 + TAU * progress * 5) * .15
        const amount = (14 + indexScale(arc) * 13) * scale * envelope * noise
        return { x: from.x + dx * t + nx * amount, y: from.y + dy * t + ny * amount }
      })
      return points
    }
    const indexScale = (arc) => 1 + (arc.segments - 15) * .025
    const drawLightning = (from, to, progress, index, emphasis) => {
      const arc = arcs[index]; const primary = lightningPath(from, to, arc, progress, 0, 1)
      const intensity = .72 + .2 * Math.sin(TAU * progress * 7 + arc.phase) + .1 * Math.sin(TAU * progress * 13 + arc.seed)
      pathStroke(primary, 12 + emphasis * 5, `rgba(92, 31, 210, ${.13 + emphasis * .08})`, 25)
      pathStroke(primary, 4.2 + emphasis * 1.4, `rgba(157, 83, 255, ${.28 + intensity * .12})`, 12)
      pathStroke(primary, 1.05 + emphasis * .7, `rgba(255, 249, 255, ${.78 + intensity * .12})`, 4)
      for (let branch = 0; branch < arc.branchCount; branch += 1) {
        const anchor = .22 + ((branch * .23 + arc.seed * .3) % .56); const segment = Math.floor(anchor * arc.segments)
        const base = primary[segment]; const direction = branch % 2 ? 1 : -1
        const lineLength = Math.hypot(to.x - from.x, to.y - from.y) || 1
        const normalX = -(to.y - from.y) / lineLength; const normalY = (to.x - from.x) / lineLength
        const branchDistance = (34 + branch * 14) * direction
        const branchEnd = { x: base.x + normalX * branchDistance + (to.x - from.x) * (.05 + branch * .015), y: base.y + normalY * branchDistance + (to.y - from.y) * (.05 + branch * .015) }
        const secondary = lightningPath(base, branchEnd, { ...arc, segments: 7 + branch, seed: arc.seed + branch * 2.8, phase: arc.phase + branch }, progress + branch * .025, branch + 1, .72)
        const branchLife = .45 + .55 * (.5 + .5 * Math.sin(TAU * progress * (2 + branch) + arc.phase + branch))
        pathStroke(secondary, 2.2 * branchLife, `rgba(184, 124, 255, ${.3 * branchLife})`, 8)
        pathStroke(secondary, .55 * branchLife, `rgba(248, 239, 255, ${.55 * branchLife})`, 2)
        if (!mobile) {
          const microBase = secondary[Math.floor(secondary.length * .58)]
          const micro = lightningPath(microBase, { x: microBase.x + (branch % 2 ? 18 : -18), y: microBase.y + 20 + branch * 5 }, { ...arc, segments: 4, seed: arc.seed + branch * 8, phase: arc.phase }, progress + .1, branch + 4, .35)
          pathStroke(micro, .38, `rgba(216, 181, 255, ${.35 * branchLife})`, 3)
        }
      }
      const pulse = (progress * (2 + index % 3) + arc.pulsePhase) % 1; const segment = Math.min(primary.length - 2, Math.floor(pulse * (primary.length - 1))); const local = pulse * (primary.length - 1) - segment; const a = primary[segment]; const b = primary[segment + 1]; const px = a.x + (b.x - a.x) * local; const py = a.y + (b.y - a.y) * local
      const glow = context.createRadialGradient(px, py, 0, px, py, 24); glow.addColorStop(0, 'rgba(255,255,255,.98)'); glow.addColorStop(.12, 'rgba(248,228,255,.95)'); glow.addColorStop(.35, 'rgba(180,116,255,.55)'); glow.addColorStop(1, 'rgba(104,39,220,0)'); context.fillStyle = glow; context.beginPath(); context.arc(px, py, 24, 0, TAU); context.fill()
    }
    const draw = (now) => {
      frame = 0
      const progress = reduced ? 0 : ((now - start) % LOOP_DURATION) / LOOP_DURATION
      const phase = progress * TAU; const pulse = .5 + .5 * Math.sin(TAU * progress); const { x: cx, y: cy } = centerFor(); const activeIndex = activeRef.current
      context.clearRect(0, 0, width, height)
      const hazeX = cx + Math.sin(TAU * progress) * width * .025; const hazeY = cy + Math.cos(TAU * progress) * height * .02; const atmosphere = context.createRadialGradient(hazeX, hazeY, 0, hazeX, hazeY, Math.max(width, height) * .68); atmosphere.addColorStop(0, `rgba(112,48,204,${.15 + pulse * .08})`); atmosphere.addColorStop(.5, 'rgba(45,17,83,.1)'); atmosphere.addColorStop(1, 'rgba(2,2,8,0)'); context.fillStyle = atmosphere; context.fillRect(0, 0, width, height)
      stars.forEach((star) => { const a = star.angle + TAU * progress * star.cycles; const r = star.radius * Math.min(width, height) * .65; context.globalAlpha = .08 + (star.layer === 2 ? .14 : .06) + .08 * (.5 + .5 * Math.sin(TAU * progress * star.cycles + star.phase)); context.fillStyle = '#d8c8ff'; context.beginPath(); context.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r * .72, star.size, 0, TAU); context.fill() })
      particles.forEach((particle, i) => { const a = particle.angle + TAU * progress * particle.cycles; const r = particle.radius * Math.min(width, height) * .5; context.globalAlpha = .12 + .13 * (.5 + .5 * Math.sin(TAU * progress * 6 + particle.phase)); context.fillStyle = i % 5 ? '#9e72e7' : '#f0e5ff'; context.beginPath(); context.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r * .64, particle.size, 0, TAU); context.fill() }); context.globalAlpha = 1
      orbits.forEach((orbit, index) => { context.save(); context.translate(cx, cy); context.rotate(orbit.rot); context.scale(1, orbit.ry / orbit.rx); context.beginPath(); context.ellipse(0, 0, orbit.rx * width, orbit.rx * width, 0, 0, TAU); context.strokeStyle = `rgba(168,126,244,${.19 - index * .012})`; context.lineWidth = index % 2 ? 1 : .7; context.setLineDash(index % 2 ? [2, 9] : [1, 5]); context.lineDashOffset = -phase * (index % 2 ? 8 : 4); context.stroke(); context.restore(); [0, 1].forEach((body) => { const point = pointFor(orbit, progress, body * Math.PI); context.fillStyle = body ? '#a979f2' : '#f4eaff'; context.shadowColor = '#9a5cff'; context.shadowBlur = 10; context.beginPath(); context.arc(point.x, point.y, body ? 1.5 : 2.3, 0, TAU); context.fill(); context.shadowBlur = 0 }) })
      const nodePoints = orbits.map((orbit) => pointFor(orbit, progress)); nodePoints.forEach((point, index) => { drawLightning({ x: cx, y: cy }, point, progress, index, activeIndex === index ? 1 : .46); const arrival = .5 + .5 * Math.sin(TAU * progress * (2 + index % 3) + arcs[index].pulsePhase - TAU * .22); const button = buttonRefs.current[index]; if (button) { const scale = .78 + (point.z + .4) * .38; button.style.transform = `translate3d(${point.x - 12}px, ${point.y - 12}px, 0) scale(${scale})`; button.style.opacity = `${.45 + scale * .45}`; button.style.zIndex = `${Math.round(10 + point.z * 10)}`; button.style.setProperty('--energy-hit', `${.72 + arrival * .8}`) } const endpoint = context.createRadialGradient(point.x, point.y, 0, point.x, point.y, 30); endpoint.addColorStop(0, `rgba(255,255,255,${.18 + arrival * .3})`); endpoint.addColorStop(.18, `rgba(188,125,255,${.16 + arrival * .22})`); endpoint.addColorStop(1, 'rgba(112,44,218,0)'); context.fillStyle = endpoint; context.beginPath(); context.arc(point.x, point.y, 30, 0, TAU); context.fill() })
      const coreRadius = Math.min(width, height) * (.115 + pulse * .006); const aura = context.createRadialGradient(cx, cy, coreRadius * .2, cx, cy, coreRadius * 3.5); aura.addColorStop(0, `rgba(155,94,255,${.42 + pulse * .1})`); aura.addColorStop(.3, 'rgba(105,41,194,.22)'); aura.addColorStop(1, 'rgba(73,28,144,0)'); context.fillStyle = aura; context.beginPath(); context.arc(cx, cy, coreRadius * 3.5, 0, TAU); context.fill()
      context.save(); context.translate(cx, cy); [{ rx: 1.9, ry: .34, rot: .48, cycles: 2 }, { rx: 2.25, ry: .24, rot: -.7, cycles: 3 }, { rx: 1.45, ry: .58, rot: 1.1, cycles: 1 }].forEach((orbit) => { context.save(); context.rotate(orbit.rot + phase * orbit.cycles); context.scale(1, orbit.ry); context.beginPath(); context.ellipse(0, 0, coreRadius * orbit.rx, coreRadius * orbit.rx, 0, 0, TAU); context.strokeStyle = 'rgba(214,190,255,.32)'; context.lineWidth = 1; context.setLineDash([2, 7]); context.stroke(); context.restore() }); context.restore()
      const core = context.createRadialGradient(cx - coreRadius * .3, cy - coreRadius * .35, 0, cx, cy, coreRadius); core.addColorStop(0, '#f4ecff'); core.addColorStop(.1, '#b47cff'); core.addColorStop(.42, '#4b168e'); core.addColorStop(1, '#08030f'); context.fillStyle = core; context.shadowColor = '#873ee8'; context.shadowBlur = 28 + pulse * 12; context.beginPath(); context.arc(cx, cy, coreRadius, 0, TAU); context.fill(); context.shadowBlur = 0; context.strokeStyle = '#d5baff'; context.stroke()
      for (let i = 0; i < 22; i += 1) { const a = TAU * (progress * (i % 2 ? -(2 + i % 3) : 2 + i % 3) + i / 22); const rr = coreRadius * (.32 + (i % 6) * .1 + .04 * Math.sin(phase * 3 + i)); context.fillStyle = i % 4 === 0 ? '#fff' : '#b889ff'; context.globalAlpha = .2 + .16 * pulse; context.beginPath(); context.arc(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, i % 4 === 0 ? 1.35 : .7, 0, TAU); context.fill() }
      context.globalAlpha = 1
      for (let i = 0; i < 4; i += 1) { const coronaStart = phase * (i % 2 ? -1 : 1) + i * 1.7; const coronaEnd = coronaStart + .5 + .2 * Math.sin(phase * 2 + i); const corona = Array.from({ length: 9 }, (_, j) => { const t = j / 8; const angle = coronaStart + (coronaEnd - coronaStart) * t; const radius = coreRadius * (1.08 + .12 * Math.sin(TAU * t + phase * 2 + i)); return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius } }); pathStroke(corona, 2.6, 'rgba(124,57,235,.42)', 8); pathStroke(corona, .55, 'rgba(255,245,255,.72)', 2) }
      context.globalAlpha = 1; context.fillStyle = '#fff'; context.textAlign = 'center'; context.font = `600 ${Math.max(12, coreRadius * .28)}px ${getComputedStyle(stage).getPropertyValue('--mono') || 'monospace'}`; context.fillText('LEOKA', cx, cy - 2); context.fillStyle = '#cfb5f7'; context.font = `${Math.max(6, coreRadius * .105)}px monospace`; context.fillText('SHARED INTELLIGENCE', cx, cy + coreRadius * .24)
      if (visible && document.visibilityState === 'visible' && !reduced) frame = requestAnimationFrame(draw)
    }
    const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) draw(performance.now()); else if (frame) { cancelAnimationFrame(frame); frame = 0 } }, { rootMargin: '120px 0px' }); visibilityObserver.observe(stage)
    const onVisibility = () => { if (document.visibilityState !== 'visible' && frame) { cancelAnimationFrame(frame); frame = 0 } else if (visible && !reduced && !frame) frame = requestAnimationFrame(draw) }; document.addEventListener('visibilitychange', onVisibility)
    return () => { if (frame) cancelAnimationFrame(frame); resizeObserver.disconnect(); visibilityObserver.disconnect(); document.removeEventListener('visibilitychange', onVisibility) }
  }, [])

  return <div ref={stageRef} className="workforce-visual" onPointerMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); pointerRef.current = { x: (event.clientX - rect.left - rect.width / 2) / rect.width * 10, y: (event.clientY - rect.top - rect.height / 2) / rect.height * 10 } }} onPointerLeave={() => { pointerRef.current = { x: 0, y: 0 } }}>
    <canvas ref={canvasRef} role="img" aria-label="A living LEOKA intelligence core connected to six specialized AI employees" />
    <div className="workforce-nodes">{departments.map(([name, role], i) => <button ref={(element) => { buttonRefs.current[i] = element }} key={name} className={`workforce-node ${active === i ? 'is-active' : ''}`} onMouseEnter={() => activateRef.current(i)} onFocus={() => activateRef.current(i)} onClick={() => activateRef.current(i)} aria-pressed={active === i}><span className="node-orb" /><span className="node-copy"><strong>{name}</strong><small>{role}</small></span></button>)}</div>
    <div className="scene-caption">ONE COMPANY <i /> ONE ACCOUNTABLE ORGANIZATION</div>
  </div>
}

function Workforce() {
  const [active, setActive] = useState(0)
  const [name, role] = departments[active]
  const activate = useCallback((index) => setActive(index), [])
  const nodeRefs = useRef([])
  const onNodePosition = useCallback((index, point, reaction, depth) => {
    const node = nodeRefs.current[index]
    if (!node) return
    const scale = .8 + depth * .2 + reaction * .16
    node.style.transform = `translate3d(${point.x - 12}px, ${point.y - 12}px, 0) scale(${scale})`
    node.style.opacity = `${.58 + depth * .25 + reaction * .2}`
    node.style.zIndex = `${10 + Math.round(depth * 10)}`
    node.style.setProperty('--energy-hit', `${1 + reaction * 1.5}`)
  }, [])
  return <section className="workforce section" id="workforce"><CosmicScene variant="workforce"><div className="workforce-nebula nebula-purple" /><div className="workforce-nebula nebula-blue" /><div className="constellation constellation-a" /><div className="constellation constellation-b" /></CosmicScene><div className="container workforce-layout"><Reveal className="workforce-copy"><p className="section-kicker">{SECTION_NUMBERS.workforce} / THE AI WORKFORCE</p><h2>An organization<br />of specialized<br /><span>intelligence.</span></h2><p className="workforce-lede">Human direction.<br />Machine specialization.</p><p className="workforce-micro">Six specialized AI employees.<br />One shared intelligence.</p></Reveal><Reveal className="workforce-stage"><WorkforceEnergyCanvas onNodePosition={onNodePosition}><div className="workforce-nodes">{departments.map(([nodeName, nodeRole], index) => <button ref={(element) => { nodeRefs.current[index] = element }} key={nodeName} className={`workforce-node ${active === index ? 'is-active' : ''}`} onMouseEnter={() => activate(index)} onFocus={() => activate(index)} onClick={() => activate(index)} aria-pressed={active === index}><span className="node-orb" /><span className="node-copy"><strong>{nodeName}</strong><small>{nodeRole}</small></span></button>)}</div><div className="scene-caption">ONE COMPANY <i /> ONE ACCOUNTABLE ORGANIZATION</div></WorkforceEnergyCanvas><div className="workforce-detail"><span className="eyebrow">ACTIVE EMPLOYEE / {name}</span><h3>{role}</h3><p>Specialized intelligence working inside one accountable organization.</p><span className="detail-line" /></div></Reveal></div></section>
}

const methodSteps = [
  ['VISION / STRATEGY', 'We define the challenge and align on outcomes that matter.', '◎'],
  ['RESEARCH', 'Deep research and data intelligence reveal opportunities.', '⌁'],
  ['PRODUCT', 'We design intelligent solutions built for real-world impact.', '◇'],
  ['ENGINEERING', 'Our engineers build scalable, secure and efficient systems.', '⌘'],
  ['QA / SECURITY', 'Rigorous testing and security ensure reliability you can trust.', '⊙'],
  ['DEPLOYMENT', 'We deploy with precision and monitor every movement.', '↗'],
  ['CONTINUOUS IMPROVEMENT', 'We learn, optimize and evolve — every single day.', '↻']
]
function MethodVisual({ active, onActivate }) {
  const canvasRef = useRef(null)
  const stageRef = useRef(null)
  const nodeRefs = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    const stage = stageRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !stage || !ctx) return undefined
    const TAU = Math.PI * 2
    const LOOP_DURATION = 48000
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.matchMedia('(max-width: 800px)').matches
    const hash = (index, salt = 0) => { const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453; return value - Math.floor(value) }
    const stars = Array.from({ length: mobile ? 90 : 180 }, (_, i) => ({ x: hash(i, 1), y: hash(i, 2), size: .3 + hash(i, 3) * 1.2, phase: hash(i, 4) * TAU }))
    const dust = Array.from({ length: mobile ? 28 : 58 }, (_, i) => ({ angle: hash(i, 5) * TAU, radius: .22 + hash(i, 6) * .78, phase: hash(i, 7) * TAU, speed: 1 + i % 3 }))
    const planets = [
      // Each orbital speed is an integer number of turns per master loop.
      // This keeps the approved orbital relationships while guaranteeing
      // that every planet is exactly back at its initial position at 1.
      { rx: .20, ry: .075, tilt: -.20, phase: .25, speed: 4, size: 1.18, type: 'vision' },
      { rx: .29, ry: .13, tilt: .58, phase: 2.1, speed: 3, size: .74, type: 'research' },
      { rx: .39, ry: .22, tilt: -.42, phase: 4.2, speed: 2, size: .92, type: 'product' },
      { rx: .50, ry: .31, tilt: .18, phase: 5.3, speed: 2, size: .86, type: 'engineering' },
      { rx: .59, ry: .16, tilt: 1.0, phase: 1.25, speed: 1, size: .68, type: 'security' },
      { rx: .68, ry: .40, tilt: -.82, phase: 2.8, speed: 1, size: .78, type: 'deployment' },
      { rx: .78, ry: .52, tilt: .36, phase: 4.7, speed: 1, size: .98, type: 'improvement' },
    ]
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
    let width = 0; let height = 0; let frame = 0; let visible = false; let lastStage = -1
    const startTime = performance.now()
    const resize = () => { const rect = stage.getBoundingClientRect(); const dpr = Math.min(window.devicePixelRatio || 1, 2); width = rect.width; height = rect.height; canvas.width = Math.floor(width * dpr); canvas.height = Math.floor(height * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0) }
    const observer = new ResizeObserver(resize); observer.observe(stage); resize()
    const center = () => ({ x: width * (mobile ? .53 : .62), y: height * .55 })
    const stroke = (points, color, size, blur = 0) => { ctx.save(); ctx.beginPath(); points.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.strokeStyle = color; ctx.lineWidth = size; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.shadowColor = '#9e63ff'; ctx.shadowBlur = blur; ctx.stroke(); ctx.restore() }
    const ellipsePoint = (planet, progress) => { const angle = planet.phase + progress * TAU * planet.speed; const rx = planet.rx * width; const ry = planet.ry * height; const x = Math.cos(angle) * rx; const y = Math.sin(angle) * ry; return { x: center().x + x * Math.cos(planet.tilt) - y * Math.sin(planet.tilt), y: center().y + x * Math.sin(planet.tilt) + y * Math.cos(planet.tilt), z: Math.sin(angle + planet.phase) } }
    const drawLightning = (from, to, seed, progress, intensity) => { const dx = to.x - from.x; const dy = to.y - from.y; const length = Math.hypot(dx, dy) || 1; const nx = -dy / length; const ny = dx / length; const flash = Math.max(0, Math.sin(TAU * (progress * 3 + seed)) ** 14); const power = intensity * (.12 + flash * .88); const points = Array.from({ length: mobile ? 8 : 13 }, (_, i) => { const t = i / (mobile ? 7 : 12); const wobble = Math.sin(i * 2.7 + seed * 12 + progress * TAU * 2) * Math.sin(Math.PI * t); return { x: from.x + dx * t + nx * wobble * 24, y: from.y + dy * t + ny * wobble * 24 } }); stroke(points, `rgba(96,31,205,${power * .2})`, 12 * power, 28); stroke(points, `rgba(183,111,255,${power * .5})`, 2.5 * power, 10); stroke(points, `rgba(255,250,255,${power * .78})`, .65 + power, 3) }
    const drawPlanet = (planet, point, index, progress, activeIndex) => { const depth = .74 + point.z * .18; const r = Math.max(10, Math.min(width, height) * .033 * planet.size * depth); const activeEnergy = index === activeIndex ? 1 : .42; const light = ctx.createRadialGradient(point.x - r * .35, point.y - r * .42, r * .08, point.x, point.y, r * 1.35); const color = index === 0 ? ['#eee2ff', '#7e46cf', '#170b31'] : index === 1 ? ['#9883cc', '#39255d', '#090713'] : index === 2 ? ['#f0d7ff', '#7544b8', '#151027'] : index === 3 ? ['#fff', '#8b4fff', '#2b0b4e'] : index === 4 ? ['#73628f', '#201b38', '#05050b'] : index === 5 ? ['#e7d6ff', '#5e37a0', '#10091d'] : ['#fff', '#6a3ab2', '#0d071c']; light.addColorStop(0, color[0]); light.addColorStop(.28, color[1]); light.addColorStop(1, color[2]); ctx.save(); ctx.globalAlpha = .62 + depth * .3; ctx.shadowColor = '#9b5cff'; ctx.shadowBlur = 14 + activeEnergy * 14; ctx.fillStyle = light; ctx.beginPath(); ctx.arc(point.x, point.y, r, 0, TAU); ctx.fill(); ctx.shadowBlur = 0; ctx.globalAlpha = .34 + activeEnergy * .42; ctx.strokeStyle = '#d8baff'; ctx.lineWidth = 1; if (index === 0 || index === 4) { ctx.beginPath(); ctx.ellipse(point.x, point.y, r * 1.7, r * .42, planet.tilt, 0, TAU); ctx.stroke() } if (index === 2) { ctx.strokeStyle = '#fff0ff'; for (let line = -1; line < 2; line += 1) { ctx.beginPath(); ctx.moveTo(point.x - r * .7, point.y + line * r * .35); ctx.lineTo(point.x + r * .7, point.y - line * r * .35); ctx.stroke() } } if (index === 3 || index === 6) { const storm = Math.sin(TAU * (progress * 4 + index * .13)); ctx.beginPath(); ctx.arc(point.x - r * .1, point.y, r * (.5 + storm * .12), .3, 2.7); ctx.stroke() } if (index === 1 || index === 5 || index === 6) { const moon = pointForMoon(point, r, index, progress); ctx.fillStyle = '#e9d9ff'; ctx.globalAlpha = .55; ctx.beginPath(); ctx.arc(moon.x, moon.y, Math.max(2, r * .13), 0, TAU); ctx.fill() } ctx.restore(); return r }
    const pointForMoon = (point, radius, index, progress) => { const angle = progress * TAU * (2 + index * .17) + index; return { x: point.x + Math.cos(angle) * radius * 2.1, y: point.y + Math.sin(angle) * radius * 1.2 } }
    const draw = (now) => { frame = 0; const rawProgress = reduced ? 0 : (((now - startTime) % LOOP_DURATION) / LOOP_DURATION); const progress = rawProgress >= 1 ? 0 : rawProgress; const phase = progress * TAU; const activeIndex = Math.floor(progress * methodSteps.length) % methodSteps.length; const c = center(); const radius = Math.min(width, height); const pulse = .5 + .5 * Math.sin(phase * 2); if (activeIndex !== lastStage) { lastStage = activeIndex; onActivate(activeIndex) } ctx.clearRect(0, 0, width, height)
      const haze = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, radius * 1.15); haze.addColorStop(0, `rgba(101,47,196,${.16 + pulse * .06})`); haze.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = haze; ctx.fillRect(0, 0, width, height)
      stars.forEach((star, i) => { const x = star.x * width + Math.sin(phase * (i % 2 ? 1 : -1) + star.phase) * 4; const y = star.y * height + Math.cos(phase + star.phase) * 3; ctx.globalAlpha = .08 + .14 * (.5 + .5 * Math.sin(phase * (1 + i % 3) + star.phase)); ctx.fillStyle = i % 13 === 0 ? '#fff' : '#c6a8ff'; ctx.beginPath(); ctx.arc(x, y, star.size, 0, TAU); ctx.fill() }); ctx.globalAlpha = 1
      dust.forEach((particle, i) => { const a = particle.angle + phase * particle.speed; const r = particle.radius * radius * .72; ctx.globalAlpha = .08 + .12 * (.5 + .5 * Math.sin(phase * 2 + particle.phase)); ctx.fillStyle = i % 5 ? '#8f63d8' : '#efe4ff'; ctx.beginPath(); ctx.arc(c.x + Math.cos(a) * r, c.y + Math.sin(a) * r * .58, 1 + (i % 3) * .35, 0, TAU); ctx.fill() }); ctx.globalAlpha = 1
      planets.forEach((planet, index) => { ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(planet.tilt); ctx.scale(1, planet.ry / planet.rx); ctx.beginPath(); ctx.ellipse(0, 0, planet.rx * width, planet.rx * width, 0, 0, TAU); ctx.strokeStyle = `rgba(174,128,255,${index === activeIndex ? .25 : .10})`; ctx.lineWidth = index === activeIndex ? 1.2 : .65; ctx.setLineDash([1, 8]); ctx.stroke(); ctx.restore() })
      const points = planets.map((planet, index) => { const point = ellipsePoint(planet, progress); const depth = clamp(.64 + point.z * .28, .45, 1); const node = nodeRefs.current[index]; if (node) { node.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%) scale(${depth})`; node.style.opacity = `${.55 + depth * .4}`; node.style.setProperty('--planet-energy', index === activeIndex ? '1' : '.55') } return point })
      planets.forEach((planet, index) => { const point = points[index]; if (index === activeIndex || index === 3 || index === 4 || index === 6) drawLightning(c, point, hash(index, 22), progress, index === activeIndex ? .8 : .26) })
      planets.map((planet, index) => ({ planet, point: points[index], index })).sort((a, b) => a.point.z - b.point.z).forEach(({ planet, point, index }) => drawPlanet(planet, point, index, progress, activeIndex))
      const sunR = radius * (mobile ? .095 : .12); const corona = ctx.createRadialGradient(c.x, c.y, sunR * .2, c.x, c.y, sunR * 4.8); corona.addColorStop(0, `rgba(237,218,255,${.72 + pulse * .1})`); corona.addColorStop(.18, 'rgba(160,91,255,.35)'); corona.addColorStop(1, 'rgba(57,15,121,0)'); ctx.fillStyle = corona; ctx.beginPath(); ctx.arc(c.x, c.y, sunR * 4.8, 0, TAU); ctx.fill()
      for (let arc = 0; arc < 6; arc += 1) { const start = phase * (arc % 2 ? -0.35 : .35) + arc * 1.1; const pointsArc = Array.from({ length: 18 }, (_, i) => { const t = i / 17; const a = start + (t - .5) * (.8 + .15 * Math.sin(phase + arc)); const rr = sunR * (1.02 + .3 * Math.sin(Math.PI * t) + .06 * Math.sin(phase * 2 + i)); return { x: c.x + Math.cos(a) * rr, y: c.y + Math.sin(a) * rr } }); stroke(pointsArc, 'rgba(168,98,255,.5)', 3.2, 14); stroke(pointsArc, 'rgba(255,247,255,.7)', .75, 3) }
      const sun = ctx.createRadialGradient(c.x - sunR * .3, c.y - sunR * .35, 0, c.x, c.y, sunR); sun.addColorStop(0, '#fff'); sun.addColorStop(.18, '#ead5ff'); sun.addColorStop(.46, '#8e4de2'); sun.addColorStop(.78, '#35105e'); sun.addColorStop(1, '#08030e'); ctx.fillStyle = sun; ctx.shadowColor = '#a75cff'; ctx.shadowBlur = 34 + pulse * 15; ctx.beginPath(); ctx.arc(c.x, c.y, sunR, 0, TAU); ctx.fill(); ctx.shadowBlur = 0
      for (let i = 0; i < 26; i += 1) { const a = i / 26 * TAU + phase * (i % 2 ? -2 : 2); const rr = sunR * (.18 + (i % 7) * .1 + .03 * Math.sin(phase * 3 + i)); ctx.fillStyle = i % 5 === 0 ? '#fff' : '#c18aff'; ctx.globalAlpha = .24 + pulse * .2; ctx.beginPath(); ctx.arc(c.x + Math.cos(a) * rr, c.y + Math.sin(a) * rr, i % 5 === 0 ? 1.5 : .8, 0, TAU); ctx.fill() }
      ctx.globalAlpha = 1
      if (visible && document.visibilityState === 'visible' && !reduced) frame = requestAnimationFrame(draw)
    }
    let intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) draw(performance.now()); else if (frame) cancelAnimationFrame(frame) }, { rootMargin: '140px 0px' }); intersection.observe(stage)
    const onVisibility = () => { if (document.visibilityState === 'visible' && visible && !reduced && !frame) frame = requestAnimationFrame(draw); else if (document.visibilityState !== 'visible' && frame) cancelAnimationFrame(frame) }
    document.addEventListener('visibilitychange', onVisibility)
    return () => { if (frame) cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect(); document.removeEventListener('visibilitychange', onVisibility) }
  }, [onActivate])

  const [title, description] = methodSteps[active]
  return <div ref={stageRef} id="method-visual" className="method-visual" data-loop-duration="48000" aria-label="A cinematic deep-space solar system representing the seven stages of the LEOKA method"><canvas ref={canvasRef} aria-hidden="true" /><div className="method-core-content"><div className="core-brand" aria-label="LEOKA intelligence core"><b>LEOKA</b><span>INTELLIGENCE CORE</span></div><div className="core-divider" aria-hidden="true" /><div className="active-stage" key={active} aria-live="polite"><small>{String(active + 1).padStart(2, '0')}</small><strong>{title}</strong><p>{description}</p></div></div><div className="method-nodes">{methodSteps.map(([nodeTitle], index) => <button ref={(element) => { nodeRefs.current[index] = element }} key={nodeTitle} className={`method-node method-node-${index} ${active === index ? 'is-active' : ''}`} onMouseEnter={() => onActivate(index)} onFocus={() => onActivate(index)} onClick={() => onActivate(index)} aria-pressed={active === index}><span className="method-node-label"><small>{String(index + 1).padStart(2, '0')}</small><strong>{nodeTitle}</strong></span></button>)}</div></div>
}

function Workflow() {
  const [active, setActive] = useState(0)
  return <section className="workflow section" id="method"><div className="method-space" aria-hidden="true" /><MethodVisual active={active} onActivate={setActive} /><div className="container workflow-layout"><Reveal className="workflow-copy"><p className="section-kicker">{SECTION_NUMBERS.workflow} / OUR METHOD</p><h2>Human vision.<br /><span>Systematic execution.</span></h2><p className="workflow-lede">We follow a continuous cycle of research, engineering, and refinement to build reliable AI solutions that create real impact.</p><a className="text-link" href="#method-visual">Explore our process <Arrow /></a><div className="workflow-active"><span>ACTIVE STAGE</span><strong>{methodSteps[active][0]}</strong></div></Reveal></div></section>
}

function EcosystemNode({ item, index, active, onActivate }) {
  const [num, title, copy, type] = item
  return <article className={`ecosystem-node node-${index} ${active === index ? 'active' : ''}`} onMouseEnter={() => onActivate(index)}>
    <span className="node-index">{num}</span><span className={`node-glyph glyph-${type}`} aria-hidden="true"><i /><b /></span><span className="node-category">LEOKA PRODUCT SYSTEM</span><strong>{title}</strong><small>{copy}</small><span className="node-link">VIEW SYSTEM <Arrow /></span>
  </article>
}

function EcosystemVisual() {
  const [active, setActive] = useState(0)
  return <div className="ecosystem-visual">
    <div className="ecosystem-aura" /><div className="ecosystem-orbit ecosystem-orbit-one" /><div className="ecosystem-orbit ecosystem-orbit-two" />
    <div className="ecosystem-lines" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
    <div className="ecosystem-core"><span className="core-signal" /><b>LEOKA</b><strong>PRODUCT<br />ECOSYSTEM</strong><small>BUILT BY LEOKA</small></div>
    {productSystems.map((item, i) => <EcosystemNode key={item[1]} item={item} index={i} active={active} onActivate={setActive} />)}
    <div className="ecosystem-particle particle-one" /><div className="ecosystem-particle particle-two" /><div className="ecosystem-particle particle-three" />
  </div>
}

function Ecosystem() {
  return <section className="ecosystem section" id="ecosystem"><CosmicScene variant="ecosystem"><div className="ecosystem-grid-glow" /><div className="planet-arc" /><div className="planet-arc planet-arc-two" /></CosmicScene><div className="container ecosystem-content"><Reveal className="section-heading"><div><p className="section-kicker">{SECTION_NUMBERS.ecosystem} / BUILT BY LEOKA</p><h2>One company.<br /><span>Many intelligent systems.</span></h2></div><p>Technology designed,<br />engineered and operated by LEOKA.</p></Reveal><Reveal className="ecosystem-intro"><p>LEOKA builds software products designed to solve real business problems. Our product systems bring specialized capabilities together into one intelligent environment.</p><div className="ecosystem-actions">{productUrl ? <a className="button button-primary" href={productUrl} target="_blank" rel="noreferrer">Explore the Product <Arrow /></a> : <span className="button button-primary button-disabled" aria-disabled="true" title="Product URL not configured">Explore the Product <Arrow /></span>}<a className="text-link" href={workWithLeokaHref}>Work With LEOKA <Arrow /></a></div></Reveal><Reveal><EcosystemVisual /></Reveal><p className="ecosystem-note">PRODUCT REGISTRY / The public application registry is not configured in this build. Systems shown are the existing LEOKA build definitions.</p></div></section>
}

function NextBuild() {
  return <section className="next-build section" id="next-build"><CosmicScene variant="technology"><OrbitalStructure variant="technology" /></CosmicScene><div className="container next-build-content"><div className="cta-content next-build-copy"><Reveal><p className="section-kicker">{SECTION_NUMBERS.nextBuild} / THE NEXT BUILD</p><h2>We build what<br /><span>comes next.</span></h2><p>Explore the technologies, AI systems, and digital products being developed by LEOKA.</p><a className="button button-primary" href="https://info.scoutlyai.us" target="_blank" rel="noopener noreferrer" aria-label="Explore LEOKA developments">Explore our developments <Arrow /></a></Reveal></div></div></section>
}

const footerCompany = [['About', '#company'], ['AI Workforce', '#workforce'], ['Our Method', '#method'], ['Contact', '#contact']]
const footerCapabilities = [['Software', '#ecosystem'], ['AI Systems', '#ecosystem'], ['Digital Products', '#ecosystem'], ['Automation', '#ecosystem'], ['Data Infrastructure', '#ecosystem'], ['Intelligent Platforms', '#ecosystem']]
const footerLegal = [['Terms of Service', '/terms'], ['Privacy Policy', '/privacy'], ['Cookie Policy', '/cookies'], ['Accessibility', '/accessibility']]

function FooterColumn({ title, links }) {
  const hrefFor = href => href.startsWith('#') && window.location.pathname !== '/' ? `/${href}` : href
  return <div className="footer-column"><h3>{title}</h3><ul className="footer-links">{links.map(([label, href]) => <li key={href + label}><a className="footer-link" href={hrefFor(href)}>{label}</a></li>)}</ul></div>
}

function Footer() {
  const year = new Date().getFullYear()
  const hrefFor = href => window.location.pathname === '/' ? href : `/${href}`
  return <footer className="site-footer" id="contact"><div className="footer-container"><div className="footer-cta"><div><p className="footer-kicker">START A CONVERSATION</p><h2>Build with <span>intelligence.</span></h2></div><a className="footer-cta-link" href={workWithLeokaHref}>Work with LEOKA <Arrow /></a></div><div className="footer-grid"><div className="footer-brand-column"><a className="footer-brand" href={hrefFor('#top')} aria-label="LEOKA home"><span className="footer-brand-mark">L</span><span>LEOKA</span></a><p className="footer-description">AI-native technology company building specialized intelligence, software, and intelligent systems.</p><p className="footer-company-details">Operated by {company.legalName}<br />{company.address[0]}<br />{company.address[1]}<br />{company.address[2]}<br /><a href={`mailto:${company.email}`}>{company.email}</a></p></div><FooterColumn title="COMPANY" links={footerCompany} /><FooterColumn title="CAPABILITIES" links={footerCapabilities} /><div className="footer-column"><h3>CONTACT</h3><ul className="footer-links"><li><a className="footer-link footer-contact-link" href={workWithLeokaHref}>Work with LEOKA <Arrow /></a></li><li><a className="footer-link" href={hrefFor('#contact')}>Start a conversation</a></li></ul></div><FooterColumn title="LEGAL" links={footerLegal} /></div><div className="footer-legal-bar"><span>© {year} LEOKA. All rights reserved.</span><nav className="footer-legal-links" aria-label="Legal navigation"><a href="/terms">Terms</a><a href="/privacy">Privacy</a><a href="/cookies">Cookies</a><a href="/accessibility">Accessibility</a></nav></div></div></footer>
}

function LegalPage({ page }) {
  useEffect(() => {
    const title = page.metaTitle || `${page.title} — LEOKA`
    document.title = title
    const description = document.querySelector('meta[name="description"]')
    if (description) description.setAttribute('content', page.description)
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical) }
    canonical.href = siteUrl ? `${siteUrl}${window.location.pathname}` : window.location.pathname || '/'
    setMetaContent('meta[property="og:url"]', siteUrl ? `${siteUrl}${window.location.pathname}` : window.location.pathname || '/')
    setMetaContent('meta[property="og:image"]', siteUrl ? `${siteUrl}/og-image.svg` : '/og-image.svg')
    setMetaContent('meta[name="twitter:image"]', siteUrl ? `${siteUrl}/og-image.svg` : '/og-image.svg')
    return () => { document.title = 'LEOKA — AI-Native Technology Company'; if (description) description.setAttribute('content', siteDescription) }
  }, [page])
  const renderBlock = (block) => {
    if (typeof block === 'string') return <p key={block}>{block}</p>
    if (block.type === 'link') return <p key={block.href}><a className="legal-inline-link" href={block.href}>{block.label} <Arrow /></a></p>
    if (block.type === 'list') return <ul key={block.items.join('|')}>{block.items.map(item => <li key={item}>{item}</li>)}</ul>
    return <p key={block.text}>{block.text}</p>
  }
  return <><Nav /><main id="main-content" className="legal-page"><article className="legal-shell"><p className="legal-eyebrow">{page.eyebrow}</p><h1>{page.title}</h1><p className="legal-intro">{page.description}</p><p className="legal-updated">Last Updated: {page.lastUpdated || 'August 11, 2026'}</p><div className="legal-content">{page.sections.map(([heading, blocks]) => <section key={heading}><h2>{heading}</h2>{blocks.map(renderBlock)}</section>)}</div><a className="legal-back" href="/#top">← Back to LEOKA</a></article></main><Footer /></>
}

function NotFound() {
  useEffect(() => { document.title = 'Page Not Found — LEOKA'; return () => { document.title = 'LEOKA — AI-Native Technology Company' } }, [])
  return <><Nav /><main id="main-content" className="legal-page"><div className="legal-shell"><p className="legal-eyebrow">LEOKA / 404</p><h1>Signal not found.</h1><p className="legal-intro">The page you requested does not exist or has moved.</p><a className="legal-back" href="/">← Return to LEOKA</a></div></main><Footer /></>
}

function App() {
  const legalKey = window.location.pathname.replace(/^\//, '').replace(/\/$/, '')
  const page = legalPages[legalKey]
  useEffect(() => { if (page) return undefined; const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible') }), { threshold: .12 }); document.querySelectorAll('.reveal').forEach(el => observer.observe(el)); return () => observer.disconnect() }, [page])
  if (window.location.pathname !== '/' && !page) return <NotFound />
  if (page) return <LegalPage page={page} />
  return <><Nav /><main id="main-content"><Hero /><Company /><Workforce /><Workflow /><Ecosystem /><NextBuild /></main><Footer /></>
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
