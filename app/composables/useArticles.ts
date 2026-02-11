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