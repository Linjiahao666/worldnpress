import Database from 'better-sqlite3'
import { resolve } from 'node:path'
import type { Article } from '~/types'

let _db: Database.Database | null = null

export function closeDB() {
  if (_db) {
    _db.close()
    _db = null
  }
}

export function useDB(): Database.Database {
  if (!_db) {
    const dbPath = resolve(process.cwd(), 'data', 'worldnpress.db')
    _db = new Database(dbPath)
    _db.pragma('journal_mode = WAL')
    _db.pragma('foreign_keys = ON')
    initDB(_db)
  }
  return _db
}

function initDB(db: Database.Database) {
  // 迁移：移除 CHECK 约束以支持更多 section
  try {
    const tableInfo = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='articles'").get() as { sql: string } | undefined
    if (tableInfo?.sql && tableInfo.sql.includes('CHECK')) {
      console.log('[DB] Migrating articles table to remove CHECK constraint...')
      db.exec(`
        ALTER TABLE articles RENAME TO articles_old_v3;
        CREATE TABLE articles (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          summary TEXT NOT NULL DEFAULT '',
          content TEXT NOT NULL DEFAULT '',
          cover_image TEXT DEFAULT '',
          category TEXT NOT NULL,
          section TEXT NOT NULL,
          author_id TEXT NOT NULL,
          tags_json TEXT DEFAULT '[]',
          published_at TEXT NOT NULL,
          updated_at TEXT,
          view_count INTEGER DEFAULT 0,
          is_hot INTEGER DEFAULT 0,
          is_featured INTEGER DEFAULT 0,
          status TEXT DEFAULT 'published',
          FOREIGN KEY (author_id) REFERENCES authors(id)
        );
        INSERT INTO articles SELECT * FROM articles_old_v3;
        DROP TABLE articles_old_v3;
      `)
      console.log('[DB] Articles table migrated.')
    }

    const catInfo = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='categories'").get() as { sql: string } | undefined
    if (catInfo?.sql && catInfo.sql.includes('CHECK')) {
      console.log('[DB] Migrating categories table to remove CHECK constraint...')
      db.exec(`
        ALTER TABLE categories RENAME TO categories_old_v3;
        CREATE TABLE categories (
          slug TEXT PRIMARY KEY,
          section TEXT NOT NULL,
          label_key TEXT NOT NULL,
          icon TEXT DEFAULT ''
        );
        INSERT INTO categories SELECT * FROM categories_old_v3;
        DROP TABLE categories_old_v3;
      `)
      console.log('[DB] Categories table migrated.')
    }
  }
  catch (e) {
    // Tables don't exist yet, that's fine
  }

  try {
    const articleColumns = db.prepare("PRAGMA table_info(articles)").all() as Array<{ name: string }>
    const articleColumnNames = new Set(articleColumns.map(c => c.name))

    if (!articleColumnNames.has('content_html')) {
      db.exec("ALTER TABLE articles ADD COLUMN content_html TEXT NOT NULL DEFAULT ''")
      db.exec("UPDATE articles SET content_html = content WHERE content_html = ''")
    }

    if (!articleColumnNames.has('content_json')) {
      db.exec("ALTER TABLE articles ADD COLUMN content_json TEXT")
    }
  }
  catch {
    // ignore when table not ready yet
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS authors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      avatar TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      summary TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      content_html TEXT NOT NULL DEFAULT '',
      content_json TEXT,
      cover_image TEXT DEFAULT '',
      category TEXT NOT NULL,
      section TEXT NOT NULL,
      author_id TEXT NOT NULL,
      tags_json TEXT DEFAULT '[]',
      published_at TEXT NOT NULL,
      updated_at TEXT,
      view_count INTEGER DEFAULT 0,
      is_hot INTEGER DEFAULT 0,
      is_featured INTEGER DEFAULT 0,
      status TEXT DEFAULT 'published',
      FOREIGN KEY (author_id) REFERENCES authors(id)
    );

    CREATE TABLE IF NOT EXISTS categories (
      slug TEXT PRIMARY KEY,
      section TEXT NOT NULL,
      label_key TEXT NOT NULL,
      icon TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS sections (
      id TEXT PRIMARY KEY,
      label_key TEXT NOT NULL,
      icon TEXT DEFAULT '',
      color TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      show_on_home INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS reporters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      department TEXT NOT NULL,
      position TEXT NOT NULL,
      contact TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title_key TEXT NOT NULL,
      date TEXT NOT NULL,
      location_key TEXT NOT NULL,
      type_key TEXT DEFAULT '',
      status_key TEXT DEFAULT '',
      desc_key TEXT DEFAULT '',
      icon TEXT DEFAULT '',
      color TEXT DEFAULT '',
      category TEXT NOT NULL DEFAULT 'upcoming',
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_articles_section ON articles(section);
    CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
    CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
    CREATE INDEX IF NOT EXISTS idx_articles_is_hot ON articles(is_hot);
    CREATE INDEX IF NOT EXISTS idx_articles_is_featured ON articles(is_featured);
    CREATE INDEX IF NOT EXISTS idx_sections_sort_order ON sections(sort_order);
    CREATE INDEX IF NOT EXISTS idx_sections_show_on_home ON sections(show_on_home);
    CREATE INDEX IF NOT EXISTS idx_reporters_sort_order ON reporters(sort_order);
    CREATE INDEX IF NOT EXISTS idx_reporters_is_active ON reporters(is_active);
    CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
    CREATE INDEX IF NOT EXISTS idx_events_date ON events(date DESC);
    CREATE INDEX IF NOT EXISTS idx_events_sort_order ON events(sort_order);
    CREATE INDEX IF NOT EXISTS idx_events_is_active ON events(is_active);
  `)
}

// --- 数据映射 ---

function extractTextFromTipTapNode(node: any): string {
  if (!node || typeof node !== 'object') return ''
  if (node.type === 'text') return typeof node.text === 'string' ? node.text : ''
  if (node.type === 'hardBreak') return '\n'
  if (Array.isArray(node.content)) {
    return node.content.map(extractTextFromTipTapNode).join('')
  }
  return ''
}

function normalizeHeadingLevel(level: unknown): 2 | 3 {
  const normalized = Number(level)
  return normalized === 3 ? 3 : 2
}

function normalizeContentBlocks(parsed: unknown): Article['contentBlocks'] | undefined {
  if (Array.isArray(parsed)) {
    const blocks = parsed
      .map((item): Article['contentBlocks'][number] | null => {
        if (!item || typeof item !== 'object') return null
        const block = item as Record<string, unknown>
        const text = typeof block.text === 'string' ? block.text : ''

        if (block.type === 'paragraph') return { type: 'paragraph', text }
        if (block.type === 'quote') return { type: 'quote', text }
        if (block.type === 'image') {
          return {
            type: 'image',
            src: typeof block.src === 'string' ? block.src : '',
            alt: typeof block.alt === 'string' ? block.alt : '',
            caption: typeof block.caption === 'string' ? block.caption : '',
          }
        }

        if (block.type === 'h2') return { type: 'heading', level: 2, text }
        if (block.type === 'h3') return { type: 'heading', level: 3, text }
        if (block.type === 'heading') {
          return {
            type: 'heading',
            level: normalizeHeadingLevel(block.level),
            text,
          }
        }

        return null
      })
      .filter((item): item is Article['contentBlocks'][number] => !!item)

    return blocks.length > 0 ? blocks : undefined
  }

  if (parsed && typeof parsed === 'object') {
    const doc = parsed as Record<string, unknown>
    if (doc.type !== 'doc' || !Array.isArray(doc.content)) return undefined

    const blocks = doc.content
      .map((node): Article['contentBlocks'][number] | null => {
        if (!node || typeof node !== 'object') return null
        const tiptapNode = node as Record<string, any>
        const type = tiptapNode.type

        if (type === 'paragraph') {
          return {
            type: 'paragraph',
            text: extractTextFromTipTapNode(tiptapNode).trim(),
          }
        }

        if (type === 'heading') {
          return {
            type: 'heading',
            level: normalizeHeadingLevel(tiptapNode.attrs?.level),
            text: extractTextFromTipTapNode(tiptapNode).trim(),
          }
        }

        if (type === 'blockquote') {
          return {
            type: 'quote',
            text: extractTextFromTipTapNode(tiptapNode).trim(),
          }
        }

        if (type === 'image') {
          return {
            type: 'image',
            src: typeof tiptapNode.attrs?.src === 'string' ? tiptapNode.attrs.src : '',
            alt: typeof tiptapNode.attrs?.alt === 'string' ? tiptapNode.attrs.alt : '',
            caption: typeof tiptapNode.attrs?.title === 'string' ? tiptapNode.attrs.title : '',
          }
        }

        return null
      })
      .filter((item): item is Article['contentBlocks'][number] => !!item)

    return blocks.length > 0 ? blocks : undefined
  }

  return undefined
}

function mapRowToArticle(row: any): Article {
  let contentBlocks: Article['contentBlocks'] | undefined
  if (row.content_json) {
    try {
      const parsed = JSON.parse(row.content_json)
      contentBlocks = normalizeContentBlocks(parsed)
    }
    catch {
      contentBlocks = undefined
    }
  }

  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    content: row.content_html || row.content,
    contentBlocks,
    coverImage: row.cover_image || '',
    category: row.category,
    section: row.section as Article['section'],
    author: {
      id: row.author_id,
      name: row.author_name || '',
      avatar: row.author_avatar || '',
    },
    tags: JSON.parse(row.tags_json || '[]'),
    publishedAt: row.published_at,
    updatedAt: row.updated_at || undefined,
    viewCount: row.view_count || 0,
    isHot: !!row.is_hot,
    isFeatured: !!row.is_featured,
  }
}

// --- 查询函数 ---

export function getArticles(query: {
  section?: string
  category?: string
  page?: number
  pageSize?: number
  hot?: boolean
  featured?: boolean
  search?: string
}) {
  const db = useDB()
  const { section, category, page = 1, pageSize = 10, hot, featured, search } = query

  const conditions: string[] = []
  const params: (string | number)[] = []

  if (section) { conditions.push('a.section = ?'); params.push(section) }
  if (category) { conditions.push('a.category = ?'); params.push(category) }
  if (hot) { conditions.push('a.is_hot = 1') }
  if (featured) { conditions.push('a.is_featured = 1') }
  if (search) {
    conditions.push('(a.title LIKE ? OR a.summary LIKE ? OR a.tags_json LIKE ?)')
    const kw = `%${search}%`
    params.push(kw, kw, kw)
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  const countRow = db.prepare(`SELECT COUNT(*) as count FROM articles a ${where}`).get(...params) as { count: number }
  const total = countRow.count
  const totalPages = Math.ceil(total / pageSize)
  const offset = (page - 1) * pageSize

  const rows = db.prepare(`
    SELECT a.*, au.name as author_name, au.avatar as author_avatar
    FROM articles a
    LEFT JOIN authors au ON a.author_id = au.id
    ${where}
    ORDER BY a.published_at DESC
    LIMIT ? OFFSET ?
  `).all(...params, pageSize, offset) as any[]

  return { data: rows.map(mapRowToArticle), total, page, pageSize, totalPages }
}

export function getArticleById(id: string): Article | null {
  const db = useDB()
  const row = db.prepare(`
    SELECT a.*, au.name as author_name, au.avatar as author_avatar
    FROM articles a
    LEFT JOIN authors au ON a.author_id = au.id
    WHERE a.id = ?
  `).get(id) as any

  if (!row) return null
  return mapRowToArticle(row)
}

export function incrementViewCount(id: string): number {
  const db = useDB()
  const result = db.prepare('UPDATE articles SET view_count = view_count + 1 WHERE id = ?').run(id)
  if (result.changes === 0) return 0
  const row = db.prepare('SELECT view_count FROM articles WHERE id = ?').get(id) as { view_count: number } | undefined
  return row?.view_count ?? 0
}

export function getTopViewedArticles(limit = 5): Article[] {
  const db = useDB()
  const rows = db.prepare(`
    SELECT a.*, au.name as author_name, au.avatar as author_avatar
    FROM articles a
    LEFT JOIN authors au ON a.author_id = au.id
    WHERE a.status = 'published'
    ORDER BY a.view_count DESC, a.published_at DESC
    LIMIT ?
  `).all(limit) as any[]
  return rows.map(mapRowToArticle)
}

export function createArticle(data: {
  title: string
  summary: string
  content: string
  contentJson?: string
  section: string
  category: string
  coverImage?: string
  tags?: string[]
  author?: { name: string, avatar?: string }
}): Article {
  const db = useDB()
  const id = `${data.section}-${data.category}-${Date.now()}`
  const authorId = `author-${Date.now()}`

  db.prepare('INSERT OR IGNORE INTO authors (id, name, avatar) VALUES (?, ?, ?)')
    .run(authorId, data.author?.name || '編輯部', data.author?.avatar || '')

  db.prepare(`
    INSERT INTO articles (id, title, summary, content, content_html, content_json, cover_image, category, section, author_id, tags_json, published_at, view_count, is_hot, is_featured, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 'published')
  `).run(
    id, data.title, data.summary, data.content, data.content, data.contentJson || null, data.coverImage || '',
    data.category, data.section, authorId, JSON.stringify(data.tags || []),
    new Date().toISOString(),
  )

  return getArticleById(id)!
}

export function updateArticle(id: string, data: {
  title?: string
  summary?: string
  content?: string
  contentJson?: string | null
  section?: string
  category?: string
  coverImage?: string
  tags?: string[]
  status?: 'draft' | 'published'
  isHot?: boolean
  isFeatured?: boolean
  authorName?: string
  authorAvatar?: string
}): Article | null {
  const db = useDB()
  const existing = db.prepare('SELECT * FROM articles WHERE id = ?').get(id) as any
  if (!existing) return null

  if (data.authorName || data.authorAvatar) {
    db.prepare('UPDATE authors SET name = ?, avatar = ? WHERE id = ?').run(
      data.authorName ?? '',
      data.authorAvatar ?? '',
      existing.author_id,
    )
  }

  db.prepare(`
    UPDATE articles SET
      title = ?,
      summary = ?,
      content = ?,
      content_html = ?,
      content_json = ?,
      cover_image = ?,
      category = ?,
      section = ?,
      tags_json = ?,
      status = ?,
      is_hot = ?,
      is_featured = ?,
      updated_at = ?
    WHERE id = ?
  `).run(
    data.title ?? existing.title,
    data.summary ?? existing.summary,
    data.content ?? existing.content,
    data.content ?? existing.content_html ?? existing.content,
    data.contentJson !== undefined ? data.contentJson : (existing.content_json ?? null),
    data.coverImage ?? existing.cover_image,
    data.category ?? existing.category,
    data.section ?? existing.section,
    JSON.stringify(data.tags ?? JSON.parse(existing.tags_json || '[]')),
    data.status ?? existing.status,
    data.isHot !== undefined ? (data.isHot ? 1 : 0) : existing.is_hot,
    data.isFeatured !== undefined ? (data.isFeatured ? 1 : 0) : existing.is_featured,
    new Date().toISOString(),
    id,
  )

  return getArticleById(id)
}

export function deleteArticle(id: string): boolean {
  const db = useDB()
  const result = db.prepare('DELETE FROM articles WHERE id = ?').run(id)
  return result.changes > 0
}

export function getAdminStats() {
  const db = useDB()
  const articleCount = db.prepare('SELECT COUNT(*) as count FROM articles').get() as { count: number }
  const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number }
  const viewsRow = db.prepare('SELECT COALESCE(SUM(view_count), 0) as total FROM articles').get() as { total: number }
  const sectionCount = db.prepare('SELECT COUNT(*) as count FROM sections').get() as { count: number }
  return {
    totalArticles: articleCount.count,
    totalCategories: categoryCount.count,
    totalViews: viewsRow.total,
    totalSections: sectionCount.count,
  }
}

// --- Sections (模块) CRUD ---

export interface SectionRecord {
  id: string
  label_key: string
  icon: string
  color: string
  sort_order: number
  show_on_home: number
  is_active: number
  created_at: string
  updated_at: string | null
}

export function getSections(options?: { activeOnly?: boolean, homeOnly?: boolean }) {
  const db = useDB()
  const conditions: string[] = []
  if (options?.activeOnly) conditions.push('is_active = 1')
  if (options?.homeOnly) conditions.push('show_on_home = 1')
  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  return db.prepare(`SELECT * FROM sections ${where} ORDER BY sort_order ASC, id ASC`).all() as SectionRecord[]
}

export function getSectionById(id: string): SectionRecord | null {
  const db = useDB()
  return (db.prepare('SELECT * FROM sections WHERE id = ?').get(id) as SectionRecord) || null
}

export function createSection(data: {
  id: string
  labelKey: string
  icon?: string
  color?: string
  sortOrder?: number
  showOnHome?: boolean
}): SectionRecord {
  const db = useDB()
  const now = new Date().toISOString()
  db.prepare(`
    INSERT INTO sections (id, label_key, icon, color, sort_order, show_on_home, is_active, created_at)
    VALUES (?, ?, ?, ?, ?, ?, 1, ?)
  `).run(
    data.id,
    data.labelKey,
    data.icon || '',
    data.color || '',
    data.sortOrder ?? 0,
    data.showOnHome ? 1 : 0,
    now,
  )
  return getSectionById(data.id)!
}

export function updateSection(id: string, data: {
  labelKey?: string
  icon?: string
  color?: string
  sortOrder?: number
  showOnHome?: boolean
  isActive?: boolean
}): SectionRecord | null {
  const db = useDB()
  const existing = getSectionById(id)
  if (!existing) return null

  const now = new Date().toISOString()
  db.prepare(`
    UPDATE sections SET
      label_key = ?,
      icon = ?,
      color = ?,
      sort_order = ?,
      show_on_home = ?,
      is_active = ?,
      updated_at = ?
    WHERE id = ?
  `).run(
    data.labelKey ?? existing.label_key,
    data.icon ?? existing.icon,
    data.color ?? existing.color,
    data.sortOrder ?? existing.sort_order,
    data.showOnHome !== undefined ? (data.showOnHome ? 1 : 0) : existing.show_on_home,
    data.isActive !== undefined ? (data.isActive ? 1 : 0) : existing.is_active,
    now,
    id,
  )
  return getSectionById(id)
}

export function deleteSection(id: string): boolean {
  const db = useDB()
  const result = db.prepare('DELETE FROM sections WHERE id = ?').run(id)
  return result.changes > 0
}

export function getSectionCategories(sectionId: string) {
  const db = useDB()
  return db.prepare('SELECT * FROM categories WHERE section = ?').all(sectionId) as Array<{
    slug: string
    section: string
    label_key: string
    icon: string
  }>
}

export interface ReporterRecord {
  id: number
  name: string
  department: string
  position: string
  contact: string
  sort_order: number
  is_active: number
  created_at: string
  updated_at: string | null
}

export interface EventRecord {
  id: number
  title_key: string
  date: string
  location_key: string
  type_key: string
  status_key: string
  desc_key: string
  icon: string
  color: string
  category: 'upcoming' | 'past'
  sort_order: number
  is_active: number
  created_at: string
  updated_at: string | null
}

export function getReporters(options?: { activeOnly?: boolean }) {
  const db = useDB()
  const conditions: string[] = []
  if (options?.activeOnly)
    conditions.push('is_active = 1')
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  return db.prepare(`SELECT * FROM reporters ${where} ORDER BY sort_order ASC, id ASC`).all() as ReporterRecord[]
}

export function getEvents(options?: { category?: 'upcoming' | 'past', activeOnly?: boolean }) {
  const db = useDB()
  const conditions: string[] = []
  const params: Array<string | number> = []

  if (options?.category) {
    conditions.push('category = ?')
    params.push(options.category)
  }
  if (options?.activeOnly)
    conditions.push('is_active = 1')

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  return db.prepare(`SELECT * FROM events ${where} ORDER BY sort_order ASC, date DESC, id DESC`).all(...params) as EventRecord[]
}

export function getEsgStats() {
  const db = useDB()
  const articleRow = db.prepare(`SELECT COUNT(*) as count FROM articles WHERE section = 'esg'`).get() as { count: number }
  const categoryRow = db.prepare(`SELECT COUNT(*) as count FROM categories WHERE section = 'esg'`).get() as { count: number }
  const viewsRow = db.prepare(`SELECT COALESCE(SUM(view_count), 0) as total FROM articles WHERE section = 'esg'`).get() as { total: number }

  return {
    totalArticles: articleRow.count,
    totalCategories: categoryRow.count,
    totalViews: viewsRow.total,
  }
}
