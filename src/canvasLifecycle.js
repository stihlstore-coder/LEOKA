/** Release a canvas backing bitmap so offscreen pages can return its memory. */
export function releaseCanvasBackingStore(canvas) {
  if (!canvas) return
  if (canvas.width !== 0) canvas.width = 0
  if (canvas.height !== 0) canvas.height = 0
}

/**
 * Suspend canvas work while the document is hidden or in the back-forward
 * cache, then restore its bitmap and one animation frame when it resumes.
 */
export function observeCanvasLifecycle({ canvas, isInView, resize, schedule, cancel }) {
  let pageHidden = false
  let disposed = false

  const canRun = () => !disposed
    && !pageHidden
    && document.visibilityState === 'visible'
    && isInView()

  const suspend = () => {
    cancel()
    releaseCanvasBackingStore(canvas)
  }

  const resume = () => {
    if (!canRun()) return
    resize()
    schedule()
  }

  const onVisibilityChange = () => {
    if (document.visibilityState === 'visible') resume()
    else suspend()
  }
  const onPageHide = () => {
    pageHidden = true
    suspend()
  }
  const onPageShow = (event) => {
    if (!event.persisted) return
    pageHidden = false
    resume()
  }

  document.addEventListener('visibilitychange', onVisibilityChange)
  window.addEventListener('pagehide', onPageHide)
  window.addEventListener('pageshow', onPageShow)

  return {
    canRun,
    dispose() {
      if (disposed) return
      disposed = true
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('pagehide', onPageHide)
      window.removeEventListener('pageshow', onPageShow)
      suspend()
    },
  }
}
