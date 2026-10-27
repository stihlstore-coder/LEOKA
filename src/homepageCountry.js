export const HOMEPAGE_LANGUAGE_KEY = 'leoka.homepage.language'
export const SUPPORTED_LANGUAGES = Object.freeze(['en', 'ua'])
export const LEGAL_PAGE_KEYS = Object.freeze(['terms', 'privacy', 'privacy-policy', 'cookies', 'accessibility'])
const LEGACY_UK_PREFIX = /^\/uk(?=\/|$)/i

const validLanguage = (value) => SUPPORTED_LANGUAGES.includes(value)

export function getSavedHomepageLanguage() {
  try {
    const saved = window.localStorage.getItem(HOMEPAGE_LANGUAGE_KEY)
    if (saved === 'uk') {
      try {
        window.localStorage.setItem(HOMEPAGE_LANGUAGE_KEY, 'ua')
      } catch {
        // Storage can be unavailable; the returned preference still applies this visit.
      }
      return 'ua'
    }
    return validLanguage(saved) ? saved : null
  } catch {
    return null
  }
}

export function saveHomepageLanguage(language) {
  if (!validLanguage(language)) return false
  try {
    window.localStorage.setItem(HOMEPAGE_LANGUAGE_KEY, language)
    return true
  } catch {
    return false
  }
}

/** Saved manual choice wins; Ukrainian is the default for new visitors. */
export function resolveHomepageLanguage(savedLanguage = null) {
  if (savedLanguage === 'uk') return 'ua'
  return validLanguage(savedLanguage) ? savedLanguage : 'ua'
}

export function getLanguageFromPath(pathname) {
  const match = pathname.match(/^\/(en|ua)(?=\/|$)/i)
  return match ? match[1].toLowerCase() : null
}

export function getLocalizedPath(language, pathname) {
  const supportedLanguage = validLanguage(language) ? language : 'ua'
  const withoutLanguage = pathname.replace(/^\/(?:en|ua|uk)(?=\/|$)/i, '').replace(/^\/+/, '')
  const suffix = withoutLanguage ? `/${withoutLanguage}` : '/'
  return `/${supportedLanguage}${suffix}`
}

export function getRoutePath(pathname) {
  const segments = pathname.split('/').filter(Boolean)
  const prefix = segments[0]?.toLowerCase()
  const hasLanguagePrefix = prefix === 'en' || prefix === 'ua'
  const language = hasLanguagePrefix ? prefix : null
  if (hasLanguagePrefix) segments.shift()
  const routeKey = segments[0]?.toLowerCase() || null
  const pageKey = routeKey === 'privacy-policy' ? 'privacy' : routeKey
  const isLegalPage = segments.length === 1 && LEGAL_PAGE_KEYS.includes(routeKey)
  return { language, pageKey, isHome: pageKey === null, isLegalPage }
}

/** Normalize legacy /uk paths and language-neutral routes before React renders. */
export function initializeLocaleRoute() {
  const pathname = window.location.pathname
  if (LEGACY_UK_PREFIX.test(pathname)) {
    const migratedPath = pathname.replace(LEGACY_UK_PREFIX, '/ua')
    window.history.replaceState(window.history.state, '', `${migratedPath}${window.location.search}${window.location.hash}`)
    return 'ua'
  }

  const route = getRoutePath(pathname)
  if (route.language) {
    const remainder = pathname.replace(/^\/(?:en|ua)(?=\/|$)/i, '')
    const suffix = route.isHome ? '/' : remainder.replace(/\/+$/, '') || '/'
    const normalizedPath = `/${route.language}${suffix}`
    if (pathname !== normalizedPath) window.history.replaceState(window.history.state, '', `${normalizedPath}${window.location.search}${window.location.hash}`)
    return route.language
  }

  const language = resolveHomepageLanguage(getSavedHomepageLanguage())
  if (route.isHome || route.isLegalPage) {
    const target = getLocalizedPath(language, pathname) + window.location.search + window.location.hash
    window.history.replaceState(window.history.state, '', target)
  }
  return language
}
