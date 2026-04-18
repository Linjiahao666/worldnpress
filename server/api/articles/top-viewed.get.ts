function getAsiaShanghaiDateSeed() {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())

  const year = parts.find(part => part.type === 'year')?.value
  const month = parts.find(part => part.type === 'month')?.value
  const day = parts.find(part => part.type === 'day')?.value

  return `${year}-${month}-${day}`
}

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const rawLimit = query.limit ? Number(query.limit) : 5
  const limit = Number.isFinite(rawLimit) ? Math.max(1, Math.floor(rawLimit)) : 5
  const dailyRandom = query.dailyRandom === 'true'
  const dateSeed = typeof query.dateSeed === 'string' ? query.dateSeed.trim() : ''

  if (dailyRandom) {
    return getTopViewedArticles(limit, {
      dailySeed: dateSeed || getAsiaShanghaiDateSeed(),
    })
  }

  return getTopViewedArticles(limit)
})
