import Database from 'better-sqlite3'
import { resolve } from 'node:path'
import type { Article } from '~/types'

let _db: Database.Database | null = null

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
      cover_image TEXT DEFAULT '',
      category TEXT NOT NULL,
      section TEXT NOT NULL CHECK(section IN ('news', 'esg')),
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
      section TEXT NOT NULL CHECK(section IN ('news', 'esg')),
      label_key TEXT NOT NULL,
      icon TEXT DEFAULT ''
    );

    CREATE INDEX IF NOT EXISTS idx_articles_section ON articles(section);
    CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
    CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
    CREATE INDEX IF NOT EXISTS idx_articles_is_hot ON articles(is_hot);
    CREATE INDEX IF NOT EXISTS idx_articles_is_featured ON articles(is_featured);
  `)
}

// --- 数据映射 ---

function mapRowToArticle(row: any): Article {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    content: row.content,
    coverImage: row.cover_image || '',
    category: row.category,
    section: row.section as 'news' | 'esg',
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
  section: 'news' | 'esg'
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
    INSERT INTO articles (id, title, summary, content, cover_image, category, section, author_id, tags_json, published_at, view_count, is_hot, is_featured, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 'published')
  `).run(
    id, data.title, data.summary, data.content, data.coverImage || '',
    data.category, data.section, authorId, JSON.stringify(data.tags || []),
    new Date().toISOString(),
  )

  return getArticleById(id)!
}
