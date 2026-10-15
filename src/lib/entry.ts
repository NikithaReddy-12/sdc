export const ENTRY_STORAGE_KEY = 'gsdc_entered'

export function hasEnteredPortal() {
  try {
    return localStorage.getItem(ENTRY_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function markEnteredPortal() {
  try {
    localStorage.setItem(ENTRY_STORAGE_KEY, 'true')
  } catch {
    // Storage can be blocked. The gate still closes for this page view.
  }
}
