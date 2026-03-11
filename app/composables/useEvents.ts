import type { EventItem } from '~/types'

export function useEvents(options?: { category?: 'upcoming' | 'past', activeOnly?: boolean }) {
  const query: Record<string, string> = {}
  if (options?.category)
    query.category = options.category
  if (options?.activeOnly)
    query.active = '1'

  const { data, status, refresh } = useFetch<EventItem[]>('/api/events', {
    query,
  })

  return {
    events: computed(() => data.value ?? []),
    status,
    refresh,
  }
}
