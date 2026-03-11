import type { Reporter } from '~/types'

export function useReporters(options?: { activeOnly?: boolean }) {
  const query: Record<string, string> = {}
  if (options?.activeOnly)
    query.active = '1'

  const { data, status, refresh } = useFetch<Reporter[]>('/api/reporters', {
    query,
  })

  return {
    reporters: computed(() => data.value ?? []),
    status,
    refresh,
  }
}
