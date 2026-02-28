export type SectionType =
  | 'news'
  | 'gba-hk'
  | 'esg'
  | 'green-finance'
  | 'ai-data'
  | 'think-tank'
  | 'events'
  | 'supervision'
  | 'brand'
  | 'industry'
  | 'politics'
  | 'data-center'
  | 'global-economy'
  | 'mainland-economy'

export interface Article {
  id: string
  title: string
  summary: string
  content: string
  // 結構化內容，用於數據庫以 JSON 形式保存
  contentBlocks?: ArticleContentBlock[]
  coverImage?: string
  category: string
  section: SectionType
  author: Author
  tags: string[]
  publishedAt: string
  updatedAt?: string
  viewCount: number
  isHot?: boolean
  isFeatured?: boolean
}

// 數據庫層文章記錄結構（可映射為資料表欄位）
export interface ArticleRecord {
  id: string
  title: string
  summary: string
  contentHtml: string
  contentBlocksJson?: string
  coverImage?: string
  category: string
  section: SectionType
  authorId: string
  tagsJson?: string
  publishedAt: string
  updatedAt?: string
  viewCount: number
  status: 'draft' | 'published'
  isHot?: boolean
  isFeatured?: boolean
}

export interface Author {
  id: string
  name: string
  avatar?: string
}

export interface ArticleContentBlock {
  type: 'paragraph' | 'heading' | 'image' | 'quote'
  text?: string
  level?: 2 | 3
  src?: string
  alt?: string
  caption?: string
}

export interface Category {
  slug: string
  section: SectionType
  labelKey: string
  icon?: string
}

export interface NavigationItem {
  labelKey: string
  to: string
  icon?: string
  children?: NavigationItem[]
  comingSoon?: boolean
}

export interface Section {
  id: string
  labelKey: string
  icon: string
  color: string
  sortOrder: number
  showOnHome: boolean
  isActive: boolean
  createdAt: string
  updatedAt?: string | null
  categories: Category[]
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ArticleQuery {
  section?: string
  category?: string
  page?: number
  pageSize?: number
  hot?: boolean
  featured?: boolean
  search?: string
}