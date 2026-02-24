import { categoriesBySection } from '~/utils/navigation'
import type { Category, SectionType } from '~/types'

export function useCategories(section: SectionType | string) {
  const categories = computed<Category[]>(() => {
    return categoriesBySection[section] || []
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