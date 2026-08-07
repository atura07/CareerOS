/**
 * Safely parse a JSON-encoded array string into a string[].
 * Returns an empty array when the input is null/undefined or not a valid JSON array.
 */
export function parseJsonArray(raw: string | null | undefined): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : []
  } catch {
    return []
  }
}
