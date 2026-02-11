import { newsCategories, esgCategories } from '~/utils/navigation'
import type { Category } from '~/types'

export function useCategories(section: 'news' | 'esg') {
  const categories = computed<Category[]>(() => {
    return section === 'news' ? newsCategories : esgCategories
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