export default defineEventHandler((event) => {
  const query = getQuery(event)

  return getArticles({
    section: query.section as string | undefined,
    category: query.category as string | undefined,
    page: query.page ? Number(query.page) : 1,
    pageSize: query.pageSize ? Number(query.pageSize) : 10,
    hot: query.hot === 'true',
    featured: query.featured === 'true',
    search: query.search as string | undefined,
  })
})