import assert from 'node:assert/strict'
import { test } from 'node:test'
import { isMobileViewportWidth, shouldRenderDynamicCanvas } from './ecosystemPresentation.js'

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
