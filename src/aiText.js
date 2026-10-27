const AI_TERM_PATTERN = /(?<![\p{L}\p{N}_])(?:AI|ШІ)(?![\p{L}\p{N}_])/giu

export function splitAITerms(value) {
  if (typeof value !== 'string' || !value) return []

  const pieces = []
  let previousIndex = 0
  const pattern = new RegExp(AI_TERM_PATTERN.source, AI_TERM_PATTERN.flags)

  for (const match of value.matchAll(pattern)) {
    if (match.index > previousIndex) {
      pieces.push({ text: value.slice(previousIndex, match.index), isTerm: false })
    }
    pieces.push({ text: match[0], isTerm: true })
    previousIndex = match.index + match[0].length
  }

  if (previousIndex < value.length) {
    pieces.push({ text: value.slice(previousIndex), isTerm: false })
  }
  return pieces.length ? pieces : [{ text: value, isTerm: false }]
}
