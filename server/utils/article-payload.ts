type ArticlePayloadInput = Record<string, any>

interface NormalizedArticlePayload {
  title?: string
  summary?: string
  content?: string
  contentJson?: string | null
  section?: string
  category?: string
  coverImage?: string
  tags?: string[]
  author: {
    name?: string
    avatar?: string
  }
  status?: 'draft' | 'published'
  isHot?: boolean
  isFeatured?: boolean
}

function safeString(input: unknown, fallback = '') {
  return typeof input === 'string' ? input.trim() : fallback
}

function sanitizeContentHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/ on\w+="[^"]*"/gi, '')
    .replace(/ on\w+='[^']*'/gi, '')
    .trim()
}

function normalizeTags(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw
      .map(tag => safeString(tag))
      .filter(Boolean)
      .slice(0, 20)
  }

  if (typeof raw === 'string') {
    return raw
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean)
      .slice(0, 20)
  }

  return []
}

function normalizeContentJson(raw: unknown): string | null {
  if (!raw) return null
  if (typeof raw === 'string') {
    const text = raw.trim()
    if (!text) return null
    try {
      JSON.parse(text)
      return text
    }
    catch {
      return null
    }
  }

  if (typeof raw === 'object') {
    try {
      return JSON.stringify(raw)
    }
    catch {
      return null
    }
  }

  return null
}

export function normalizeArticlePayload(input: ArticlePayloadInput, options?: { partial?: boolean }): NormalizedArticlePayload {
  const partial = !!options?.partial
  const title = safeString(input.title)
  const summary = safeString(input.summary)
  const content = sanitizeContentHtml(safeString(input.content))

  if (!partial) {
    if (!title) {
      throw createError({ statusCode: 400, statusMessage: 'Title is required' })
    }
    if (!summary) {
      throw createError({ statusCode: 400, statusMessage: 'Summary is required' })
    }
    if (!content) {
      throw createError({ statusCode: 400, statusMessage: 'Content is required' })
    }
  }

  if (title.length > 200) {
    throw createError({ statusCode: 400, statusMessage: 'Title is too long' })
  }

  if (summary.length > 600) {
    throw createError({ statusCode: 400, statusMessage: 'Summary is too long' })
  }

  const section = safeString(input.section)
  const category = safeString(input.category)
  const hasStatus = input.status === 'draft' || input.status === 'published'
  const status = input.status === 'draft' ? 'draft' : 'published'
  const hasTags = input.tags !== undefined
  const hasIsHot = typeof input.isHot === 'boolean'
  const hasIsFeatured = typeof input.isFeatured === 'boolean'
  const hasAuthor = !!input.author && typeof input.author === 'object'

  return {
    title: partial ? (title || undefined) : title,
    summary: partial ? (summary || undefined) : summary,
    content: partial ? (content || undefined) : content,
    contentJson: input.contentJson === undefined ? undefined : normalizeContentJson(input.contentJson),
    section: partial ? (section || undefined) : (section || 'news'),
    category: partial ? (category || undefined) : (category || 'general'),
    coverImage: partial ? (input.coverImage === undefined ? undefined : safeString(input.coverImage)) : safeString(input.coverImage),
    tags: partial ? (hasTags ? normalizeTags(input.tags) : undefined) : normalizeTags(input.tags),
    author: {
      name: partial
        ? (hasAuthor ? safeString(input.author?.name) || undefined : undefined)
        : (safeString(input.author?.name, '編輯部') || '編輯部'),
      avatar: partial
        ? (hasAuthor && input.author?.avatar !== undefined ? safeString(input.author?.avatar) : undefined)
        : safeString(input.author?.avatar),
    },
    status: partial ? (hasStatus ? status : undefined) : status,
    isHot: partial ? (hasIsHot ? !!input.isHot : undefined) : !!input.isHot,
    isFeatured: partial ? (hasIsFeatured ? !!input.isFeatured : undefined) : !!input.isFeatured,
  }
}