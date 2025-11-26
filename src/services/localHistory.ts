const KEY = 'calc.history'

export function loadHistory(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function saveHistory(item: string) {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || '[]')
    data.unshift(item)
    localStorage.setItem(KEY, JSON.stringify(data.slice(0,20)))
  } catch {}
}

export function clearHistory() {
  localStorage.removeItem(KEY)
}
