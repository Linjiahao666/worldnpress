import { categoriesBySection, sectionTitleKeys } from '~/utils/navigation'
import type { Category, SectionType } from '~/types'

export function useCategories(section: SectionType | string) {
  const categories = computed<Category[]>(() => {
    return categoriesBySection[section] || []
  })

  function getCategoryBySlug(slug: string) {
    return categories.value.find(c => c.slug === slug)
  }

  function getCategoryLabel(slug: string) {
    const { t, te } = useI18n()
    const cat = getCategoryBySlug(slug)
    if (cat)
      return t(cat.labelKey)

    const sectionTitleKey = sectionTitleKeys[String(section)]
    const sectionNamespace = sectionTitleKey?.replace('.title', '')
    if (sectionNamespace) {
      const guessedKey = `${sectionNamespace}.categories.${slug}`
      if (te(guessedKey))
        return t(guessedKey)
    }

    return slug
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  }

  return {
    categories,
    getCategoryBySlug,
    getCategoryLabel,
  }
}