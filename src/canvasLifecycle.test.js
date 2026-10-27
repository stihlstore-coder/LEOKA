import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { observeCanvasLifecycle } from './canvasLifecycle.js'
import { observeCanvasResize } from './observeCanvasResize.js'

const originals = {
  window: globalThis.window,
  document: globalThis.document,
  ResizeObserver: globalThis.ResizeObserver,
  requestAnimationFrame: globalThis.requestAnimationFrame,
  cancelAnimationFrame: globalThis.cancelAnimationFrame,
}

class EventTargetMock {
  listeners = new Map()

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) || new Set()
    listeners.add(listener)
    this.listeners.set(type, listeners)
  }

  removeEventListener(type, listener) {
    this.listeners.get(type)?.delete(listener)
  }

  dispatch(type, event = {}) {
    this.listeners.get(type)?.forEach(listener => listener(event))
  }
}

function installBrowserMocks() {
  const scheduledFrames = new Map()
  const canceledFrames = []
  let nextFrame = 1
  const windowMock = new EventTargetMock()
  const documentMock = new EventTargetMock()
  documentMock.visibilityState = 'visible'
  globalThis.window = windowMock
  globalThis.document = documentMock
  globalThis.requestAnimationFrame = callback => {
    const id = nextFrame++
    scheduledFrames.set(id, callback)
    return id
  }
  globalThis.cancelAnimationFrame = id => {
    canceledFrames.push(id)
    scheduledFrames.delete(id)
  }

  return { windowMock, documentMock, scheduledFrames, canceledFrames }
}

afterEach(() => {
  Object.assign(globalThis, originals)
})

test('canvas lifecycle suspends on pagehide and resumes from persisted pageshow', () => {
  const { windowMock, documentMock } = installBrowserMocks()
  const canvas = { width: 480, height: 960 }
  let inView = true
  let resizeCount = 0
  let scheduleCount = 0
  let cancelCount = 0
  const lifecycle = observeCanvasLifecycle({
    canvas,
    isInView: () => inView,
    resize: () => { resizeCount += 1 },
    schedule: () => { scheduleCount += 1 },
    cancel: () => { cancelCount += 1 },
  })

  windowMock.dispatch('pagehide', { persisted: true })
  assert.equal(lifecycle.canRun(), false)
  assert.deepEqual([canvas.width, canvas.height], [0, 0])
  assert.equal(cancelCount, 1)

  windowMock.dispatch('pageshow', { persisted: false })
  assert.equal(resizeCount, 0)

  windowMock.dispatch('pageshow', { persisted: true })
  assert.equal(lifecycle.canRun(), true)
  assert.deepEqual([resizeCount, scheduleCount], [1, 1])

  documentMock.visibilityState = 'hidden'
  documentMock.dispatch('visibilitychange')
  assert.equal(lifecycle.canRun(), false)
  assert.deepEqual([canvas.width, canvas.height], [0, 0])

  documentMock.visibilityState = 'visible'
  documentMock.dispatch('visibilitychange')
  assert.deepEqual([resizeCount, scheduleCount], [2, 2])

  inView = false
  windowMock.dispatch('pagehide', { persisted: true })
  windowMock.dispatch('pageshow', { persisted: true })
  assert.equal(lifecycle.canRun(), false)
  assert.equal(resizeCount, 2)

  lifecycle.dispose()
  assert.equal(windowMock.listeners.get('pagehide').size, 0)
  assert.equal(windowMock.listeners.get('pageshow').size, 0)
  assert.equal(documentMock.listeners.get('visibilitychange').size, 0)
  assert.deepEqual([canvas.width, canvas.height], [0, 0])
})

test('canvas resize remains lazy offscreen and cancels pending work on cleanup', () => {
  const { scheduledFrames, canceledFrames } = installBrowserMocks()
  const observers = []
  globalThis.ResizeObserver = class ResizeObserverMock {
    constructor(callback) { this.callback = callback; this.disconnected = false; observers.push(this) }
    observe() {}
    disconnect() { this.disconnected = true }
  }
  let active = false
  let resizeCount = 0
  const stop = observeCanvasResize({}, () => { resizeCount += 1 }, () => active)
  const observer = observers[0]

  assert.equal(resizeCount, 0)
  observer.callback()
  assert.equal(scheduledFrames.size, 0)

  active = true
  observer.callback()
  assert.equal(scheduledFrames.size, 1)
  const [frameId, callback] = scheduledFrames.entries().next().value
  stop()
  assert.deepEqual(canceledFrames, [frameId])
  callback()
  assert.equal(resizeCount, 0)
  assert.equal(observer.disconnected, true)
})
