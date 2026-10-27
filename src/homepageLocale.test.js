import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  HOMEPAGE_LANGUAGE_KEY,
  SUPPORTED_LANGUAGES,
  getLocalizedPath,
  getRoutePath,
  getSavedHomepageLanguage,
  initializeLocaleRoute,
  resolveHomepageLanguage,
  saveHomepageLanguage,
} from './homepageCountry.js'

test('the app locale codes are ua and en, with Ukrainian as the new visitor default', () => {
  assert.deepEqual(SUPPORTED_LANGUAGES, ['en', 'ua'])
  assert.equal(resolveHomepageLanguage(), 'ua')
  assert.equal(resolveHomepageLanguage(null), 'ua')
  assert.equal(resolveHomepageLanguage('unsupported'), 'ua')
  assert.equal(resolveHomepageLanguage('en'), 'en')
  assert.equal(resolveHomepageLanguage('ua'), 'ua')
})

test('saved language choices persist and prior uk storage values migrate to ua', () => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')
  const values = new Map([[HOMEPAGE_LANGUAGE_KEY, 'uk']])
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { localStorage: {
      getItem: key => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
    } },
  })

  try {
    assert.equal(getSavedHomepageLanguage(), 'ua')
    assert.equal(values.get(HOMEPAGE_LANGUAGE_KEY), 'ua')
    assert.equal(saveHomepageLanguage('en'), true)
    assert.equal(getSavedHomepageLanguage(), 'en')
    assert.equal(saveHomepageLanguage('ua'), true)
    assert.equal(getSavedHomepageLanguage(), 'ua')
    assert.equal(saveHomepageLanguage('uk'), false)
  } finally {
    if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow)
    else delete globalThis.window
  }
})

test('explicit ua and en routes override saved preferences and privacy-policy resolves', () => {
  for (const [pathname, saved, language] of [
    ['/ua/', 'en', 'ua'],
    ['/en/', 'ua', 'en'],
    ['/ua/privacy', 'en', 'ua'],
    ['/en/privacy', 'ua', 'en'],
  ]) {
    const result = initialize(pathname, { saved })
    assert.equal(result.language, language)
    assert.deepEqual(result.historyChanges, [])
    assert.equal(getRoutePath(pathname).language, language)
  }

  assert.deepEqual(getRoutePath('/ua/privacy-policy'), {
    language: 'ua',
    pageKey: 'privacy',
    isHome: false,
    isLegalPage: true,
  })
})

test('root defaults to ua without country or browser-language detection and preserves query and fragment', () => {
  const result = initialize('/', {
    search: '?campaign=x',
    hash: '#company',
    country: 'US',
    browserLanguage: 'en-US',
  })
  assert.equal(result.language, 'ua')
  assert.deepEqual(result.historyChanges, ['/ua/?campaign=x#company'])

  const savedEnglish = initialize('/', { saved: 'en' })
  assert.equal(savedEnglish.language, 'en')
  assert.deepEqual(savedEnglish.historyChanges, ['/en/'])
})

test('legacy /uk paths migrate once to the matching /ua path and preserve query and fragment', () => {
  for (const [pathname, search, hash, expected] of [
    ['/uk/', '', '', '/ua/'],
    ['/uk/privacy-policy', '?from=old&campaign=x', '#rights', '/ua/privacy-policy?from=old&campaign=x#rights'],
    ['/uk/terms/', '?ref=legacy', '', '/ua/terms/?ref=legacy'],
  ]) {
    const result = initialize(pathname, { saved: 'en', search, hash })
    assert.equal(result.language, 'ua')
    assert.deepEqual(result.historyChanges, [expected])
  }
})

test('legacy migration matches only a leading locale segment and avoids rewrite loops', () => {
  for (const pathname of ['/ukraine/', '/assets/uk/icon.svg', '/api/uk', '/auth/callback']) {
    const result = initialize(pathname, { saved: 'en' })
    assert.equal(result.language, 'en')
    assert.deepEqual(result.historyChanges, [], pathname)
  }
  assert.deepEqual(initialize('/ua/').historyChanges, [])
  assert.equal(getLocalizedPath('ua', '/uk/privacy'), '/ua/privacy')
  assert.equal(getLocalizedPath('en', '/ua/privacy'), '/en/privacy')
})

function initialize(pathname, { saved = null, search = '', hash = '', country = null, browserLanguage = 'en' } = {}) {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')
  const values = new Map(saved ? [[HOMEPAGE_LANGUAGE_KEY, saved]] : [])
  const historyChanges = []
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      location: { pathname, search, hash },
      history: { state: null, replaceState: (_state, _title, target) => historyChanges.push(target) },
      navigator: { language: browserLanguage, languages: [browserLanguage] },
      __LEOKA_COUNTRY_CODE__: country,
      localStorage: { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) },
    },
  })

  try {
    return { language: initializeLocaleRoute(), historyChanges }
  } finally {
    if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow)
    else delete globalThis.window
  }
}
