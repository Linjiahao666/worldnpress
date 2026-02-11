import { newsCategories, esgCategories } from '~/utils/navigation'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const section = query.section as string | undefined

  if (section === 'news') return newsCategories
  if (section === 'esg') return esgCategories

  return {
    news: newsCategories,
    esg: esgCategories,
  }
})