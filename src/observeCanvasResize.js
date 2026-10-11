export function observeCanvasResize(element, resize) {
  let frame = 0
  let disposed = false

  // Defer backing-store changes until after ResizeObserver delivery. Resizing
  // a canvas in the observer callback can trigger WebKit's loop warning.
  const observer = new ResizeObserver(() => {
    if (frame || disposed) return
    frame = requestAnimationFrame(() => {
      frame = 0
      if (!disposed) resize()
    })
  })

  observer.observe(element)
  resize()

  return () => {
    disposed = true
    observer.disconnect()
    if (frame) cancelAnimationFrame(frame)
  }
}
