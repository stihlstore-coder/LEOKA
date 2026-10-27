export const MOBILE_VIEWPORT_QUERY = '(max-width: 800px)'

export function isMobileViewportWidth(width) {
  return width <= 800
}

export function shouldRenderDynamicCanvas(variant, mobileViewport) {
  return variant !== 'ecosystem' || !mobileViewport
}

export function lockEcosystemPageScroll(documentObject, windowObject) {
  const body = documentObject.body
  const root = documentObject.getElementById('root')
  const html = documentObject.documentElement
  const scrollY = windowObject.scrollY
  const bodyStyles = {
    position: body.style.position,
    top: body.style.top,
    left: body.style.left,
    right: body.style.right,
    width: body.style.width,
    overflow: body.style.overflow,
  }
  const scrollBehavior = html.style.scrollBehavior
  const rootWasInert = root?.hasAttribute('inert') ?? false
  const rootAriaHidden = root?.getAttribute('aria-hidden') ?? null

  body.style.position = 'fixed'
  body.style.top = `-${scrollY}px`
  body.style.left = '0'
  body.style.right = '0'
  body.style.width = '100%'
  body.style.overflow = 'hidden'
  if (root) {
    root.setAttribute('inert', '')
    root.setAttribute('aria-hidden', 'true')
  }

  return () => {
    body.style.position = bodyStyles.position
    body.style.top = bodyStyles.top
    body.style.left = bodyStyles.left
    body.style.right = bodyStyles.right
    body.style.width = bodyStyles.width
    body.style.overflow = bodyStyles.overflow
    if (root) {
      if (!rootWasInert) root.removeAttribute('inert')
      if (rootAriaHidden === null) root.removeAttribute('aria-hidden')
      else root.setAttribute('aria-hidden', rootAriaHidden)
    }
    html.style.scrollBehavior = 'auto'
    windowObject.scrollTo(0, scrollY)
    html.style.scrollBehavior = scrollBehavior
  }
}

export function getEcosystemPanelDetails(ecosystemCopy, index, number) {
  const system = ecosystemCopy.systems[index]
  if (!system) return null

  return {
    number,
    category: ecosystemCopy.nodeCategory,
    title: system[0],
    description: system[1],
    ecosystemTitle: ecosystemCopy.coreTitle.join(' '),
    ecosystemIntroduction: ecosystemCopy.introduction,
    registryNote: ecosystemCopy.registryNote,
  }
}
