export const HOMEPAGE_LANGUAGE_KEY = 'leoka.homepage.language'
export const SUPPORTED_LANGUAGES = Object.freeze(['en', 'uk'])
export const LEGAL_PAGE_KEYS = Object.freeze(['terms', 'privacy', 'cookies', 'accessibility'])

const COUNTRY_META_NAME = 'leoka-country-code'
const validLanguage = (value) => SUPPORTED_LANGUAGES.includes(value)

export function getSavedHomepageLanguage() {
  try {
    const saved = window.localStorage.getItem(HOMEPAGE_LANGUAGE_KEY)
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

/**
 * Read only a country code inserted into the HTML by a trusted edge/server
 * integration. Browsers cannot read the incoming request headers themselves.
 */
export function getTrustedHomepageCountry() {
  const values = [window.__LEOKA_COUNTRY_CODE__, document.querySelector(`meta[name="${COUNTRY_META_NAME}"]`)?.content]
  for (const value of values) {
    if (typeof value !== 'string' || !/^[a-z]{2}$/i.test(value)) continue
    const countryCode = value.toUpperCase()
    if (countryCode !== 'XX' && countryCode !== 'T1') return countryCode
  }
  return null
}

export function languageForCountry(countryCode) {
  if (typeof countryCode !== 'string' || !/^[a-z]{2}$/i.test(countryCode)) return null
  return countryCode.toUpperCase() === 'UA' ? 'uk' : 'en'
}

export function languageForBrowser(languages) {
  const preferred = Array.isArray(languages) ? languages : [languages]
  return typeof preferred[0] === 'string' && /^uk(?:-|$)/i.test(preferred[0].trim())
    ? 'uk'
    : 'en'
}

export function resolveHomepageLanguage(countryCode, savedLanguage = null, browserLanguages = []) {
  if (validLanguage(savedLanguage)) return savedLanguage
  return languageForCountry(countryCode) || languageForBrowser(browserLanguages)
}

export function getLanguageFromPath(pathname) {
  const match = pathname.match(/^\/(en|uk)(?=\/|$)/i)
  return match ? match[1].toLowerCase() : null
}

export function getLocalizedPath(language, pathname) {
  const supportedLanguage = validLanguage(language) ? language : 'en'
  const withoutLanguage = pathname.replace(/^\/(?:en|uk)(?=\/|$)/i, '').replace(/^\/+/, '')
  const suffix = withoutLanguage ? `/${withoutLanguage}` : '/'
  return `/${supportedLanguage}${suffix}`
}

export function getRoutePath(pathname) {
  const segments = pathname.split('/').filter(Boolean)
  const prefix = segments[0]?.toLowerCase()
  const hasLanguagePrefix = prefix === 'en' || prefix === 'uk'
  const language = hasLanguagePrefix ? prefix : null
  if (hasLanguagePrefix) segments.shift()
  const pageKey = segments[0]?.toLowerCase() || null
  return {
    language,
    pageKey,
    isHome: pageKey === null,
    isLegalPage: LEGAL_PAGE_KEYS.includes(pageKey),
  }
}

/** Normalize the homepage and legacy legal URLs before the React tree renders. */
export function initializeLocaleRoute() {
  const pathname = window.location.pathname
  const route = getRoutePath(pathname)
  if (route.language) {
    const remainder = pathname.replace(/^\/(?:en|uk)(?=\/|$)/i, '')
    const suffix = route.isHome ? '/' : route.isLegalPage ? `/${route.pageKey}` : remainder.replace(/\/+$/, '') || '/'
    const normalizedPath = `/${route.language}${suffix}`
    if (pathname !== normalizedPath) window.history.replaceState(window.history.state, '', `${normalizedPath}${window.location.search}${window.location.hash}`)
    return route.language
  }

  const needsLanguagePrefix = route.isHome || route.isLegalPage
  const countryCode = getTrustedHomepageCountry()
  const language = resolveHomepageLanguage(
    countryCode,
    getSavedHomepageLanguage(),
    window.navigator.languages?.length ? window.navigator.languages : [window.navigator.language],
  )

  if (needsLanguagePrefix) {
    const target = getLocalizedPath(language, pathname) + window.location.search + window.location.hash
    window.history.replaceState(window.history.state, '', target)
  }
  return language
}
