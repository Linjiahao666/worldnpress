export default defineEventHandler((event) => {
  const query = getQuery(event)
  const limit = query.limit ? Number(query.limit) : 5

  return getTopViewedArticles(limit)
})
