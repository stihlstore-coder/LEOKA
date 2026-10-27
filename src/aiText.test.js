import assert from 'node:assert/strict'
import { test } from 'node:test'
import { splitAITerms } from './aiText.js'

test('AI and ШІ abbreviations are matched as complete terms, including hyphenated forms', () => {
  assert.deepEqual(splitAITerms('AI-native systems and ШІ-системи'), [
    { text: 'AI', isTerm: true },
    { text: '-native systems and ', isTerm: false },
    { text: 'ШІ', isTerm: true },
    { text: '-системи', isTerm: false },
  ])
})

test('standalone lowercase forms are matched without styling ordinary words', () => {
  assert.deepEqual(splitAITerms('ai, ші; maintain, email, Ukraine, Україна'), [
    { text: 'ai', isTerm: true },
    { text: ', ', isTerm: false },
    { text: 'ші', isTerm: true },
    { text: '; maintain, email, Ukraine, Україна', isTerm: false },
  ])
})
