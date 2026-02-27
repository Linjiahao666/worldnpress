import type { Section } from '~/types'

export function useSections(options?: { activeOnly?: boolean, homeOnly?: boolean }) {
  const query: Record<string, string> = {}
  if (options?.activeOnly) query.active = '1'
  if (options?.homeOnly) query.home = '1'

  const { data, status, refresh } = useFetch<Section[]>('/api/sections', {
    query,
  })

  return {
    sections: computed(() => data.value ?? []),
    status,
    refresh,
  }
}

export function useHomeSections() {
  return useSections({ activeOnly: true, homeOnly: true })
}

export function useActiveSections() {
  return useSections({ activeOnly: true })
}
