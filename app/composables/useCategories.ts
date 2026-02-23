import { newsCategories, esgCategories, politicsCategories } from '~/utils/navigation'
import type { Category } from '~/types'

export function useCategories(section: 'news' | 'esg' | 'politics') {
  const categories = computed<Category[]>(() => {
    if (section === 'news') return newsCategories
    if (section === 'politics') return politicsCategories
    return esgCategories
  })

  function getCategoryBySlug(slug: string) {
    return categories.value.find(c => c.slug === slug)
  }

  function getCategoryLabel(slug: string) {
    const { t } = useI18n()
    const cat = getCategoryBySlug(slug)
    return cat ? t(cat.labelKey) : slug
  }

  return {
    categories,
    getCategoryBySlug,
    getCategoryLabel,
  }
}