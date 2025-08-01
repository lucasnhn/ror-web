/**
 * Utility for parsing Kubernetes resource quantity strings (e.g. "512Mi", "2Gi", "100m")
 * and converting them to a numeric value in base units (bytes for memory, cores for CPU, etc).
 * Supports SI and binary suffixes.
 */

const re = /^(\d+(?:\.\d+)?)(Ei|Pi|Ti|Gi|Mi|Ki|E|P|T|G|M|K|m|u|n)?$/

export function parseQuantity(q: string): number {
  const m = q.match(re)
  if (!m) throw new Error(`Ugiltig Quantity: ${q}`)
  const [, numStr, suffix = ''] = m
  const num = parseFloat(numStr)

  switch (suffix) {
    case 'n':
      return num / 1e9 // nano (1e-9)
    case 'u':
      return num / 1e6 // micro (1e-6)
    case 'm':
      return num / 1e3 // milli (1e-3)
    case 'Ki':
      return num * 2 ** 10 // kibibyte (2^10 bytes)
    case 'Mi':
      return num * 2 ** 20 // mebibyte (2^20 bytes)
    case 'Gi':
      return num * 2 ** 30 // gibibyte (2^30 bytes)
    case 'Ti':
      return num * 2 ** 40 // tebibyte (2^40 bytes)
    case 'Pi':
      return num * 2 ** 50 // pebibyte (2^50 bytes)
    case 'Ei':
      return num * 2 ** 60 // exbibyte (2^60 bytes)
    case 'K':
      return num * 1e3 // kilo (1e3)
    case 'M':
      return num * 1e6 // mega (1e6)
    case 'G':
      return num * 1e9 // giga (1e9)
    case 'T':
      return num * 1e12 // tera (1e12)
    case 'P':
      return num * 1e15 // peta (1e15)
    case 'E':
      return num * 1e18 // exa (1e18)
    default:
      return num // no suffix, just the number
  }
}
