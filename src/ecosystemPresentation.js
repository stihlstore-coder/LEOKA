export const MOBILE_VIEWPORT_QUERY = '(max-width: 800px)'

export function isMobileViewportWidth(width) {
  return width <= 800
}

export function shouldRenderDynamicCanvas(variant, mobileViewport) {
  return variant !== 'ecosystem' || !mobileViewport
}
