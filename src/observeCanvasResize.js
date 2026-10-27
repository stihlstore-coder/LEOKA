export function observeCanvasResize(element, resize, canResize = () => true) {
  let frame = 0
  let disposed = false

  // Defer backing-store changes until after ResizeObserver delivery. Resizing
  // a canvas in the observer callback can trigger WebKit's loop warning.
  const observer = new ResizeObserver(() => {
    if (frame || disposed || !canResize()) return
    frame = requestAnimationFrame(() => {
      frame = 0
      if (!disposed && canResize()) resize()
    })
  })

  observer.observe(element)
  if (canResize()) resize()

  return () => {
    disposed = true
    observer.disconnect()
    if (frame) cancelAnimationFrame(frame)
  }
}
