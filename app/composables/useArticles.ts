import type { Article, PaginatedResponse, ArticleQuery } from '~/types'

export function useArticles(query: Ref<ArticleQuery> | ArticleQuery) {
  const queryRef = isRef(query) ? query : ref(query)

  const { data, status, refresh } = useFetch<PaginatedResponse<Article>>('/api/articles', {
    query: queryRef,
    watch: [queryRef],
  })

  return {
    articles: computed(() => data.value?.data ?? []),
    total: computed(() => data.value?.total ?? 0),
    totalPages: computed(() => data.value?.totalPages ?? 0),
    currentPage: computed(() => data.value?.page ?? 1),
    status,
    refresh,
  }
}

export function useArticleDetail(id: Ref<string> | string) {
  const idRef = isRef(id) ? id : ref(id)

  const { data: article, status, error } = useFetch<Article>(() => `/api/articles/${idRef.value}`, {
    watch: [idRef],
  })

  return {
    article,
    status,
    error,
  }
}

export function useHotArticles(section?: string) {
  return useArticles({
    section,
    hot: true,
    pageSize: 5,
  })
}

export function useFeaturedArticles(section?: string) {
  return useArticles({
    section,
    featured: true,
    pageSize: 5,
  })
}

export function useTopViewedArticles(limit = 5) {
  const { data, status, refresh } = useFetch<Article[]>('/api/articles/top-viewed', {
    query: { limit },
  })

  return {
    articles: computed(() => data.value ?? []),
    status,
    refresh,
  }
}

export function useRecordView(articleId: Ref<string> | string) {
  const idRef = isRef(articleId) ? articleId : ref(articleId)
  const recorded = ref(false)

  async function recordView() {
    if (recorded.value || !idRef.value) return
    try {
      await $fetch(`/api/articles/${idRef.value}/view`, { method: 'POST' })
      recorded.value = true
    }
    catch {
      // silently ignore
    }
  }

  // Only record view on client side
  if (import.meta.client) {
    watch(idRef, (newId) => {
      if (newId) {
        recorded.value = false
        recordView()
      }
    }, { immediate: true })
  }

  return { recorded, recordView }
}