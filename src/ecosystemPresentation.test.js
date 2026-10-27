import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { homepageTranslations } from './homepageTranslations.js'
import { getEcosystemPanelDetails, isMobileViewportWidth, lockEcosystemPageScroll, shouldRenderDynamicCanvas } from './ecosystemPresentation.js'

test('Section 5 omits its dynamic canvas at supported mobile widths', () => {
  for (const width of [320, 375, 390, 430, 800]) {
    assert.equal(isMobileViewportWidth(width), true)
    assert.equal(shouldRenderDynamicCanvas('ecosystem', true), false)
  }
})

test('desktop keeps the Section 5 canvas and other scenes keep their existing canvas', () => {
  assert.equal(isMobileViewportWidth(801), false)
  assert.equal(shouldRenderDynamicCanvas('ecosystem', false), true)
  assert.equal(shouldRenderDynamicCanvas('hero', true), true)
  assert.equal(shouldRenderDynamicCanvas('company', true), true)
})

test('each localized ecosystem panel uses only its matching existing system copy', () => {
  for (const language of ['en', 'ua']) {
    const ecosystemCopy = homepageTranslations[language].ecosystem

    ecosystemCopy.systems.forEach(([title, description], index) => {
      assert.deepEqual(getEcosystemPanelDetails(ecosystemCopy, index, String(index + 1).padStart(2, '0')), {
        number: String(index + 1).padStart(2, '0'),
        category: ecosystemCopy.nodeCategory,
        title,
        description,
        ecosystemTitle: ecosystemCopy.coreTitle.join(' '),
        ecosystemIntroduction: ecosystemCopy.introduction,
        registryNote: ecosystemCopy.registryNote,
      })
    })

    assert.equal(getEcosystemPanelDetails(ecosystemCopy, 6, '07'), null)
  }
})

test('mobile ecosystem dialog covers dynamic viewport and keeps long copy scrollable', () => {
  const styles = readFileSync(new URL('./ecosystem.css', import.meta.url), 'utf8')
  const mobileRule = styles.slice(styles.lastIndexOf('@media(max-width:800px){'))

  assert.match(mobileRule, /\.ecosystem-detail-dialog\{[\s\S]*?height:100vh;[\s\S]*?height:100dvh;/)
  for (const side of ['top', 'right', 'bottom', 'left']) {
    assert.ok(mobileRule.includes(`env(safe-area-inset-${side}, 0px)`))
  }
  assert.match(mobileRule, /\.ecosystem-detail-scroll\{[\s\S]*?overflow-y:auto;/)
  assert.match(mobileRule, /\.ecosystem-detail-scroll\{[\s\S]*?-webkit-overflow-scrolling:touch;/)
})

test('opening a mobile panel locks the page and restores its styles and scroll position', () => {
  const attributes = new Map([['aria-hidden', 'false']])
  const bodyStyle = { position: 'relative', top: '', left: '', right: '', width: '', overflow: 'auto' }
  const htmlStyle = { scrollBehavior: 'smooth' }
  const root = {
    hasAttribute: name => attributes.has(name),
    getAttribute: name => attributes.get(name) ?? null,
    setAttribute: (name, value) => attributes.set(name, value),
    removeAttribute: name => attributes.delete(name),
  }
  const scrollCalls = []
  const documentObject = { body: { style: bodyStyle }, documentElement: { style: htmlStyle }, getElementById: () => root }
  const windowObject = { scrollY: 480, scrollTo: (x, y) => scrollCalls.push([x, y]) }

  const restore = lockEcosystemPageScroll(documentObject, windowObject)
  assert.equal(bodyStyle.position, 'fixed')
  assert.equal(bodyStyle.top, '-480px')
  assert.equal(bodyStyle.overflow, 'hidden')
  assert.equal(attributes.get('inert'), '')
  assert.equal(attributes.get('aria-hidden'), 'true')

  restore()
  assert.deepEqual(bodyStyle, { position: 'relative', top: '', left: '', right: '', width: '', overflow: 'auto' })
  assert.equal(attributes.has('inert'), false)
  assert.equal(attributes.get('aria-hidden'), 'false')
  assert.deepEqual(scrollCalls, [[0, 480]])
  assert.equal(htmlStyle.scrollBehavior, 'smooth')
})
