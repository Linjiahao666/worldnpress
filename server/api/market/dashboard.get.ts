interface DashboardItem {
  label: string
  value: string
  change: string
  up: boolean
}

interface DashboardResponse {
  items: DashboardItem[]
  updatedAt: string
  source: string[]
}

function toFixed(value: number, digits = 4) {
  return Number.isFinite(value) ? value.toFixed(digits) : '--'
}

function formatPrice(value: number) {
  if (!Number.isFinite(value)) return '--'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value)
}

function formatPercent(value: number) {
  if (!Number.isFinite(value)) return '--'
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}

function formatDelta(value: number) {
  if (!Number.isFinite(value)) return '--'
  return `${value >= 0 ? '+' : ''}${Math.abs(value).toFixed(4)}`
}

function pickLastTwoValues(rates: Record<string, { CNY?: number }>) {
  const dates = Object.keys(rates).sort((a, b) => a.localeCompare(b))
  if (dates.length === 0) return { latest: NaN, previous: NaN }
  const latestDate = dates[dates.length - 1]!
  const previousDate = dates.length > 1 ? dates[dates.length - 2]! : latestDate
  return {
    latest: Number(rates[latestDate]?.CNY),
    previous: Number(rates[previousDate]?.CNY),
  }
}

export default defineEventHandler(async (): Promise<DashboardResponse> => {
  const now = new Date()
  const start = new Date(now)
  start.setDate(start.getDate() - 10)

  const startDate = start.toISOString().slice(0, 10)
  const endDate = now.toISOString().slice(0, 10)

  const items: DashboardItem[] = []
  const sources: string[] = []

  try {
    const [usdSeries, eurSeries] = await Promise.all([
      $fetch<{ rates: Record<string, { CNY?: number }> }>(
        `https://api.frankfurter.dev/v1/${startDate}..${endDate}?base=USD&symbols=CNY`,
      ),
      $fetch<{ rates: Record<string, { CNY?: number }> }>(
        `https://api.frankfurter.dev/v1/${startDate}..${endDate}?base=EUR&symbols=CNY`,
      ),
    ])

    const usd = pickLastTwoValues(usdSeries.rates || {})
    const eur = pickLastTwoValues(eurSeries.rates || {})

    if (Number.isFinite(usd.latest)) {
      items.push({
        label: 'USD/CNY',
        value: toFixed(usd.latest, 4),
        change: formatDelta(usd.latest - usd.previous),
        up: usd.latest >= usd.previous,
      })
    }

    if (Number.isFinite(eur.latest)) {
      items.push({
        label: 'EUR/CNY',
        value: toFixed(eur.latest, 4),
        change: formatDelta(eur.latest - eur.previous),
        up: eur.latest >= eur.previous,
      })
    }

    if (items.length > 0) {
      sources.push('Frankfurter')
    }
  } catch {
    // ignore upstream failure and keep partial response
  }

  try {
    const crypto = await $fetch<{
      bitcoin?: { usd?: number, usd_24h_change?: number }
      ethereum?: { usd?: number, usd_24h_change?: number }
    }>(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true',
    )

    if (Number.isFinite(crypto.bitcoin?.usd)) {
      items.push({
        label: 'BTC/USD',
        value: formatPrice(Number(crypto.bitcoin?.usd)),
        change: formatPercent(Number(crypto.bitcoin?.usd_24h_change)),
        up: Number(crypto.bitcoin?.usd_24h_change) >= 0,
      })
    }

    if (Number.isFinite(crypto.ethereum?.usd)) {
      items.push({
        label: 'ETH/USD',
        value: formatPrice(Number(crypto.ethereum?.usd)),
        change: formatPercent(Number(crypto.ethereum?.usd_24h_change)),
        up: Number(crypto.ethereum?.usd_24h_change) >= 0,
      })
    }

    if (items.some(item => item.label.includes('BTC') || item.label.includes('ETH'))) {
      sources.push('CoinGecko')
    }
  } catch {
    // ignore upstream failure and keep partial response
  }

  return {
    items,
    updatedAt: now.toISOString(),
    source: sources,
  }
})
