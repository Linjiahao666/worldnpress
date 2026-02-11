---
goal: 構建世界財經新聞門戶網站首頁及完整欄目架構
version: 2.0
date_created: 2026-02-10
last_updated: 2026-02-10
owner: Development Team
status: "Code Complete - Pending Install & Test"
tags: ["feature", "architecture", "nuxt", "portal", "news", "i18n", "nuxt-ui"]
---

# Introduction

![Status: In Progress](https://img.shields.io/badge/status-In%20Progress-yellow)

本計劃旨在構建一個類似官網首頁的財經新聞門戶網站項目（WorldnPress），基於 Nuxt 4 框架實現。網站包含 11 個主要欄目，**第一階段優先實現首頁、新聞中心、ESG 與可持續發展三個核心欄目**，其餘欄目預留入口後續迭代。

## 實現範圍說明

### ✅ 第一階段必須實現（MVP）

- **首頁** - 完整功能實現
- **新聞中心** - 完整功能實現（含 7 個子分類）
- **ESG 與可持續發展** - 完整功能實現（含 8 個子分類）

### 🔜 第二階段預留入口（暫不實現）

- 粵港澳大灣區·香港財經
- 綠色金融
- AI 輿情大數據中心
- 智庫研究中心
- 會展與活動中心
- 輿論監督與誠信建設
- 品牌與企業服務
- 關於我們與合規公示

## 設計規範

### 主題配色方案

基於 Web Interface Guidelines 設計的清新財經門戶配色：

| 色彩角色                 | 色值               | 用途                         |
| ------------------------ | ------------------ | ---------------------------- |
| **Primary**              | `#4ADE80` (淺綠色) | 主要按鈕、連結高亮、品牌強調 |
| **Primary Dark**         | `#22C55E`          | 按鈕 hover 狀態              |
| **Background**           | `#FFFFFF` (白色)   | 頁面背景、卡片背景           |
| **Background Secondary** | `#F8FAFC`          | 次要背景、分割區域           |
| **Text Primary**         | `#1E293B` (深灰黑) | 主要文字內容                 |
| **Text Secondary**       | `#64748B`          | 次要說明文字                 |
| **Border**               | `#E2E8F0`          | 邊框、分割線                 |

### 設計原則

- 極簡配色：僅使用綠色、白色、黑色三色系
- 高對比度：確保文字可讀性符合 WCAG AA 標準
- 一致性：所有交互元素使用統一的視覺語言

## 1. Requirements & Constraints

- **REQ-001**: 基於 Nuxt 4.x 框架實現，使用 Vue 3 Composition API 和 TypeScript
- **REQ-002**: 使用 Nuxt UI 作為 UI 組件庫
- **REQ-003**: 採用響應式設計，支持桌面端、平板和移動端
- **REQ-004**: 實現 SSR（服務端渲染）以提升 SEO 性能
- **REQ-005**: 組件化架構，支持複用和可維護性
- **REQ-006**: 實現統一的佈局系統（Header、Footer、Sidebar）
- **REQ-007**: **國際化支持** - 主語言繁體中文（zh-TW），可選簡體中文（zh-CN）和英語（en）
- **REQ-008**: **內容發布系統** - 預留發布界面，支持新聞內容 CRUD 操作
- **REQ-009**: **數據庫集成** - 前端讀取數據庫內容顯示，開發階段使用 Mock 數據
- **REQ-010**: **公司信息 Footer** - 底部展示完整公司信息
- **SEC-001**: 所有外部連結需使用 `rel="noopener noreferrer"`
- **SEC-002**: 實現基本的 CSP (Content Security Policy) 配置
- **CON-001**: 保持與 Nuxt 4.x 的兼容性日期 2025-07-15
- **CON-002**: 首頁加載時間控制在 3 秒內
- **GUD-001**: 遵循 Nuxt 目錄結構約定（app/ 目錄模式）
- **GUD-002**: 使用 Nuxt 自動導入特性（組件、composables、utils）
- **GUD-003**: 採用語義化 HTML 標籤提升可訪問性
- **GUD-004**: 使用 `Intl.DateTimeFormat` 和 `Intl.NumberFormat` 處理日期和數字格式化
- **PAT-001**: 使用 Nuxt Layouts 實現頁面佈局複用
- **PAT-002**: 使用 Nuxt Middleware 實現路由守衛
- **PAT-003**: 使用 @nuxtjs/i18n 實現國際化

## 2. Implementation Steps

### Implementation Phase 1: 項目基礎架構與依賴安裝 ✅

- GOAL-001: 安裝必要依賴，建立完整的 Nuxt 項目目錄結構，配置基礎開發環境

| Task     | Description                                                 | Completed | Date |
| -------- | ----------------------------------------------------------- | --------- | ---- |
| TASK-001 | 安裝 `@nuxt/ui` 組件庫及其依賴                              | ✅        | 2026-02-10 |
| TASK-002 | 安裝 `@nuxtjs/i18n` 國際化模組                              | ✅        | 2026-02-10 |
| TASK-003 | 配置 `nuxt.config.ts` 添加 Nuxt UI、i18n 模組及主題配色     | ✅        | 2026-02-10 |
| TASK-004 | 創建 `i18n/locales/zh-TW.json` 繁體中文語言包               | ✅        | 2026-02-10 |
| TASK-005 | 創建 `i18n/locales/zh-CN.json` 簡體中文語言包               | ✅        | 2026-02-10 |
| TASK-006 | 創建 `i18n/locales/en.json` 英語語言包                      | ✅        | 2026-02-10 |
| TASK-007 | 配置 `app.config.ts` 定義 Nuxt UI 主題配色（淺綠色 + 白色） | ✅        | 2026-02-10 |

### Implementation Phase 2: 佈局系統實現 ✅

- GOAL-002: 創建全局佈局組件，包含 Header、Footer 和導航系統

| Task     | Description                                                                                       | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-008 | 創建 `app/layouts/default.vue` 默認佈局文件，包含 Header、Footer 和主內容區域 slot                | ✅        | 2026-02-10 |
| TASK-009 | 創建 `app/components/layout/TheHeader.vue` 全局頭部導航組件，包含 Logo、主導航菜單、語言切換器    | ✅        | 2026-02-10 |
| TASK-010 | 創建 `app/components/layout/TheFooter.vue` 全局底部組件，**包含完整公司信息展示區域**             | ✅        | 2026-02-10 |
| TASK-011 | 創建 `app/components/layout/TheNavigation.vue` 主導航菜單組件，支持多級下拉菜單（含所有欄目入口） | ✅        | 2026-02-10 |
| TASK-012 | 創建 `app/components/layout/LanguageSwitcher.vue` 語言切換組件                                    | ✅        | 2026-02-10 |
| TASK-013 | 創建 `app/components/layout/MobileNav.vue` 移動端導航抽屜組件                                     | ✅        | 2026-02-10 |

### Implementation Phase 3: 首頁實現 ✅（MVP 必須）

- GOAL-003: 完整實現首頁功能，包含輪播圖、要聞列表、欄目入口卡片

| Task     | Description                                                                         | Completed | Date |
| -------- | ----------------------------------------------------------------------------------- | --------- | ---- |
| TASK-014 | 創建 `app/pages/index.vue` 首頁主結構                                               | ✅        | 2026-02-10 |
| TASK-015 | 創建 `app/components/home/HeroCarousel.vue` 首頁輪播圖組件                          | ✅        | 2026-02-10 |
| TASK-016 | 創建 `app/components/home/LatestNews.vue` 最新要聞列表組件                          | ✅        | 2026-02-10 |
| TASK-017 | 創建 `app/components/home/SectionCard.vue` 欄目入口卡片組件（含所有 11 個欄目入口） | ✅        | 2026-02-10 |
| TASK-018 | 創建 `app/components/home/HotNews.vue` 熱點新聞側邊欄組件                           | ✅        | 2026-02-10 |
| TASK-019 | 創建 `app/components/home/QuickLinks.vue` 快速連結組件                              | ✅        | 2026-02-10 |

### Implementation Phase 4: 新聞中心實現 ✅（MVP 必須）

- GOAL-004: 完整實現新聞中心頁面及 7 個子分類

| Task     | Description                                                                                                                 | Completed | Date |
| -------- | --------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-020 | 創建 `app/pages/news/index.vue` 新聞中心首頁                                                                                | ✅        | 2026-02-10 |
| TASK-021 | 創建 `app/pages/news/[category].vue` 新聞中心分類頁（宏觀經濟、環球財經、金融市場、產業經濟、國際貿易、企業財經、財經法治） | ✅        | 2026-02-10 |
| TASK-022 | 創建 `app/pages/news/[category]/[id].vue` 新聞詳情頁                                                                        | ✅        | 2026-02-10 |
| TASK-023 | 創建 `app/components/news/NewsCard.vue` 新聞卡片組件，支持圖文、純文本類型                                                  | ✅        | 2026-02-10 |
| TASK-024 | 創建 `app/components/news/NewsList.vue` 新聞列表組件，支持分頁                                                              | ✅        | 2026-02-10 |
| TASK-025 | 創建 `app/components/news/NewsDetail.vue` 新聞詳情展示組件                                                                  | ✅        | 2026-02-10 |
| TASK-026 | 創建 `app/components/common/CategoryNav.vue` 分類導航組件                                                                   | ✅        | 2026-02-10 |
| TASK-027 | 創建 `app/components/common/Breadcrumb.vue` 麵包屑導航組件                                                                  | ✅        | 2026-02-10 |

### Implementation Phase 5: ESG 與可持續發展實現 ✅（MVP 必須）

- GOAL-005: 完整實現 ESG 與可持續發展頁面及 8 個子分類

| Task     | Description                                                                                                                    | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------------------------------------------ | --------- | ---- |
| TASK-028 | 創建 `app/pages/esg/index.vue` ESG 與可持續發展首頁                                                                            | ✅        | 2026-02-10 |
| TASK-029 | 創建 `app/pages/esg/[category].vue` ESG 分類頁（ESG 要聞、治理實踐、碳管理、循環經濟、信息披露、報告服務、評級認定、教育培訓） | ✅        | 2026-02-10 |
| TASK-030 | 創建 `app/pages/esg/[category]/[id].vue` ESG 文章詳情頁                                                                        | ✅        | 2026-02-10 |
| TASK-031 | 創建 `app/components/esg/EsgHighlight.vue` ESG 重點報道組件                                                                    | ✅        | 2026-02-10 |
| TASK-032 | 創建 `app/components/esg/EsgStats.vue` ESG 數據統計展示組件                                                                    | ✅        | 2026-02-10 |

### Implementation Phase 6: 數據層與 API 實現 ✅

- GOAL-006: 實現數據獲取邏輯、Mock API 和發布系統預留

| Task     | Description                                                                   | Completed | Date |
| -------- | ----------------------------------------------------------------------------- | --------- | ---- |
| TASK-033 | 創建 `app/types/index.ts` TypeScript 類型定義（Article, Category, Author 等） | ✅        | 2026-02-10 |
| TASK-034 | 創建 `app/composables/useArticles.ts` 文章數據獲取 composable                 | ✅        | 2026-02-10 |
| TASK-035 | 創建 `app/composables/useCategories.ts` 分類數據管理 composable               | ✅        | 2026-02-10 |
| TASK-036 | 創建 `server/api/articles/index.get.ts` 獲取文章列表 API                      | ✅        | 2026-02-10 |
| TASK-037 | 創建 `server/api/articles/[id].get.ts` 獲取文章詳情 API                       | ✅        | 2026-02-10 |
| TASK-038 | 創建 `server/api/articles/index.post.ts` **發布文章 API（預留）**             | ✅        | 2026-02-10 |
| TASK-039 | 創建 `server/api/categories/index.get.ts` 獲取分類列表 API                    | ✅        | 2026-02-10 |
| TASK-040 | 創建 `server/utils/mockData.ts` Mock 文章數據（開發階段）                     | ✅        | 2026-02-10 |
| TASK-041 | 創建 `app/utils/navigation.ts` 導航菜單配置數據                               | ✅        | 2026-02-10 |

### Implementation Phase 7: 發布系統預留 🔜

- GOAL-007: 預留內容發布管理界面入口

| Task     | Description                                                        | Completed | Date |
| -------- | ------------------------------------------------------------------ | --------- | ---- |
| TASK-042 | 創建 `app/pages/admin/index.vue` 管理後台入口頁面（預留）          | ✅        | 2026-02-10 |
| TASK-043 | 創建 `app/pages/admin/articles/index.vue` 文章管理列表頁面（預留） | ✅        | 2026-02-10 |
| TASK-044 | 創建 `app/pages/admin/articles/create.vue` 文章發布頁面（預留）    | ✅        | 2026-02-10 |
| TASK-045 | 創建 `app/pages/admin/articles/[id].vue` 文章編輯頁面（預留）      | ✅        | 2026-02-10 |

### Implementation Phase 8: 其他欄目入口預留 🔜

- GOAL-008: 為其他 8 個欄目創建佔位頁面，預留入口

| Task     | Description                                                     | Completed | Date |
| -------- | --------------------------------------------------------------- | --------- | ---- |
| TASK-046 | 創建 `app/pages/gba-hk/index.vue` 粵港澳大灣區·香港財經佔位頁   | ✅        | 2026-02-10 |
| TASK-047 | 創建 `app/pages/green-finance/index.vue` 綠色金融佔位頁         | ✅        | 2026-02-10 |
| TASK-048 | 創建 `app/pages/ai-data/index.vue` AI 輿情大數據中心佔位頁      | ✅        | 2026-02-10 |
| TASK-049 | 創建 `app/pages/think-tank/index.vue` 智庫研究中心佔位頁        | ✅        | 2026-02-10 |
| TASK-050 | 創建 `app/pages/events/index.vue` 會展與活動中心佔位頁          | ✅        | 2026-02-10 |
| TASK-051 | 創建 `app/pages/supervision/index.vue` 輿論監督與誠信建設佔位頁 | ✅        | 2026-02-10 |
| TASK-052 | 創建 `app/pages/brand/index.vue` 品牌與企業服務佔位頁           | ✅        | 2026-02-10 |
| TASK-053 | 創建 `app/pages/about/index.vue` 關於我們與合規公示佔位頁       | ✅        | 2026-02-10 |
| TASK-054 | 創建 `app/components/common/ComingSoon.vue` 即將上線提示組件    | ✅        | 2026-02-10 |

### Implementation Phase 9: SEO 與性能優化 ✅

- GOAL-009: 優化網站 SEO 和加載性能

| Task     | Description                                         | Completed | Date |
| -------- | --------------------------------------------------- | --------- | ---- |
| TASK-055 | 配置 `nuxt.config.ts` 的 `app.head` 全局 SEO 元數據 | ✅        | 2026-02-10 |
| TASK-056 | 為每個頁面實現 `useSeoMeta()` 動態 SEO 配置         | ✅        | 2026-02-10 |
| TASK-057 | 創建 `public/robots.txt` 搜索引擎爬蟲配置           | ✅        | 2026-02-10 |
| TASK-058 | 添加 Open Graph 和 Twitter Card 元數據支持          | ✅        | 2026-02-10 |

### Implementation Phase 10: 測試與驗收 ✅

- GOAL-010: 完成功能測試和驗收

| Task     | Description                                  | Completed | Date |
| -------- | -------------------------------------------- | --------- | ---- |
| TASK-059 | 驗證首頁功能完整性                           | ⬜        |      |
| TASK-060 | 驗證新聞中心所有分類頁面正確渲染             | ⬜        |      |
| TASK-061 | 驗證 ESG 所有分類頁面正確渲染                | ⬜        |      |
| TASK-062 | 驗證國際化語言切換功能                       | ⬜        |      |
| TASK-063 | 驗證響應式佈局在各設備上的表現               | ⬜        |      |
| TASK-064 | 驗證導航菜單功能完整性（所有欄目入口可點擊） | ⬜        |      |
| TASK-065 | 驗證 Footer 公司信息展示正確                 | ⬜        |      |
| TASK-066 | 執行生產環境構建測試 (`nuxt build`)          | ⬜        |      |

## 3. Alternatives

- **ALT-001**: 使用 Tailwind CSS 替代 Nuxt UI - 未選擇，Nuxt UI 提供完整組件庫減少開發時間
- **ALT-002**: 使用 vue-i18n 替代 @nuxtjs/i18n - 未選擇，@nuxtjs/i18n 與 Nuxt 深度集成更便捷
- **ALT-003**: 使用 Pinia 進行狀態管理 - 當前規模使用 useState composable 足夠，Pinia 可後續按需引入
- **ALT-004**: 使用 Nuxt Content 管理新聞內容 - 未選擇，計劃使用數據庫存儲以支持動態發布
- **ALT-005**: 使用 Prisma + PostgreSQL 作為數據庫 - 可後續迭代，當前階段先使用 Mock 數據

## 4. Dependencies

### 核心依賴（已安裝）

- **DEP-001**: `nuxt: ^4.3.1` - 核心框架
- **DEP-002**: `vue: ^3.5.28` - Vue 3 運行時
- **DEP-003**: `vue-router: ^4.6.4` - 路由管理

### 需要安裝的依賴

- **DEP-004**: `@nuxt/ui: ^3.x` - Nuxt UI 組件庫（包含 Tailwind CSS）
- **DEP-005**: `@nuxtjs/i18n: ^9.x` - 國際化模組
- **DEP-006**: `@nuxt/image: ^1.x` - 圖片優化模組
- **DEP-007**: `@nuxtjs/seo: ^2.x` (可選) - SEO 工具集

### 開發依賴

- **DEP-008**: `@nuxt/devtools` - 開發調試工具
- **DEP-009**: `typescript: ^5.x` - TypeScript 支持

## 5. Files

### 配置文件

- **FILE-001**: `nuxt.config.ts` - Nuxt 配置（模組、主題、SEO）
- **FILE-002**: `app.config.ts` - 應用運行時配置（Nuxt UI 主題）
- **FILE-003**: `tailwind.config.ts` - Tailwind CSS 配置（由 Nuxt UI 自動生成）

### 國際化文件

- **FILE-004**: `i18n/locales/zh-TW.json` - 繁體中文語言包
- **FILE-005**: `i18n/locales/zh-CN.json` - 簡體中文語言包
- **FILE-006**: `i18n/locales/en.json` - 英語語言包

### 佈局文件

- **FILE-007**: `app/app.vue` - 根組件
- **FILE-008**: `app/layouts/default.vue` - 默認佈局

### 頁面文件（MVP 必須）

- **FILE-009**: `app/pages/index.vue` - 首頁 ✅
- **FILE-010**: `app/pages/news/index.vue` - 新聞中心首頁 ✅
- **FILE-011**: `app/pages/news/[category].vue` - 新聞分類頁 ✅
- **FILE-012**: `app/pages/news/[category]/[id].vue` - 新聞詳情頁 ✅
- **FILE-013**: `app/pages/esg/index.vue` - ESG 首頁 ✅
- **FILE-014**: `app/pages/esg/[category].vue` - ESG 分類頁 ✅
- **FILE-015**: `app/pages/esg/[category]/[id].vue` - ESG 詳情頁 ✅

### 頁面文件（預留入口）

- **FILE-016**: `app/pages/gba-hk/index.vue` - 粵港澳大灣區 🔜
- **FILE-017**: `app/pages/green-finance/index.vue` - 綠色金融 🔜
- **FILE-018**: `app/pages/ai-data/index.vue` - AI 輿情 🔜
- **FILE-019**: `app/pages/think-tank/index.vue` - 智庫研究 🔜
- **FILE-020**: `app/pages/events/index.vue` - 會展活動 🔜
- **FILE-021**: `app/pages/supervision/index.vue` - 輿論監督 🔜
- **FILE-022**: `app/pages/brand/index.vue` - 品牌服務 🔜
- **FILE-023**: `app/pages/about/index.vue` - 關於我們 🔜

### 發布系統文件（預留）

- **FILE-024**: `app/pages/admin/index.vue` - 管理後台入口 🔜
- **FILE-025**: `app/pages/admin/articles/index.vue` - 文章管理 🔜
- **FILE-026**: `app/pages/admin/articles/create.vue` - 文章發布 🔜
- **FILE-027**: `app/pages/admin/articles/[id].vue` - 文章編輯 🔜

### 佈局組件

- **FILE-028**: `app/components/layout/TheHeader.vue` - 頭部組件
- **FILE-029**: `app/components/layout/TheFooter.vue` - 底部組件（含公司信息）
- **FILE-030**: `app/components/layout/TheNavigation.vue` - 導航組件
- **FILE-031**: `app/components/layout/LanguageSwitcher.vue` - 語言切換
- **FILE-032**: `app/components/layout/MobileNav.vue` - 移動端導航

### 業務組件

- **FILE-033**: `app/components/home/HeroCarousel.vue` - 首頁輪播
- **FILE-034**: `app/components/home/LatestNews.vue` - 最新要聞
- **FILE-035**: `app/components/home/SectionCard.vue` - 欄目卡片
- **FILE-036**: `app/components/home/HotNews.vue` - 熱點新聞
- **FILE-037**: `app/components/news/NewsCard.vue` - 新聞卡片
- **FILE-038**: `app/components/news/NewsList.vue` - 新聞列表
- **FILE-039**: `app/components/news/NewsDetail.vue` - 新聞詳情
- **FILE-040**: `app/components/common/CategoryNav.vue` - 分類導航
- **FILE-041**: `app/components/common/Breadcrumb.vue` - 麵包屑
- **FILE-042**: `app/components/common/ComingSoon.vue` - 即將上線提示
- **FILE-043**: `app/components/esg/EsgHighlight.vue` - ESG 重點報道
- **FILE-044**: `app/components/esg/EsgStats.vue` - ESG 統計

### 數據層

- **FILE-045**: `app/types/index.ts` - 類型定義
- **FILE-046**: `app/composables/useArticles.ts` - 文章 composable
- **FILE-047**: `app/composables/useCategories.ts` - 分類 composable
- **FILE-048**: `app/utils/navigation.ts` - 導航配置

### Server API

- **FILE-049**: `server/api/articles/index.get.ts` - 文章列表 API
- **FILE-050**: `server/api/articles/[id].get.ts` - 文章詳情 API
- **FILE-051**: `server/api/articles/index.post.ts` - 發布文章 API（預留）
- **FILE-052**: `server/api/categories/index.get.ts` - 分類列表 API
- **FILE-053**: `server/utils/mockData.ts` - Mock 數據

## 6. Testing

### MVP 功能測試（第一階段）

- **TEST-001**: 驗證首頁所有欄目入口連結正確跳轉
- **TEST-002**: 驗證新聞中心 7 個子分類頁面正確渲染
- **TEST-003**: 驗證 ESG 8 個子分類頁面正確渲染
- **TEST-004**: 驗證新聞詳情頁正確顯示文章內容
- **TEST-005**: 驗證 ESG 詳情頁正確顯示文章內容

### 國際化測試

- **TEST-006**: 驗證繁體中文（zh-TW）顯示正確
- **TEST-007**: 驗證簡體中文（zh-CN）切換和顯示正確
- **TEST-008**: 驗證英語（en）切換和顯示正確
- **TEST-009**: 驗證語言切換後 URL 正確更新
- **TEST-010**: 驗證日期、數字格式隨語言正確變化

### UI/UX 測試

- **TEST-011**: 驗證響應式佈局在 320px、768px、1024px、1440px 寬度下正確顯示
- **TEST-012**: 驗證移動端導航抽屜正常展開/收起
- **TEST-013**: 驗證麵包屑導航正確顯示當前位置
- **TEST-014**: 驗證主題配色（淺綠色 + 白色 + 黑色文字）一致性
- **TEST-015**: 驗證按鈕、連結的 hover/focus 狀態正確

### Footer 測試

- **TEST-016**: 驗證 Footer 公司信息展示完整
- **TEST-017**: 驗證 Footer 連結正確跳轉

### 預留入口測試

- **TEST-018**: 驗證 8 個預留欄目入口可點擊並顯示「即將上線」提示

### 性能測試

- **TEST-019**: 驗證 SSR 渲染輸出包含正確的 SEO 元數據
- **TEST-020**: 驗證 Lighthouse 性能分數達到 80 分以上
- **TEST-021**: 完成生產環境構建測試 (`nuxt build`)

## 7. Risks & Assumptions

### 風險

- **RISK-001**: Nuxt UI v3 可能存在兼容性問題，需密切關注官方更新
- **RISK-002**: 國際化翻譯工作量較大，建議分批完成
- **RISK-003**: 數據庫集成可能需要額外後端開發資源
- **RISK-004**: Mock 數據與實際數據結構可能存在差異，需預留調整空間

### 假設

- **ASSUMPTION-001**: 內容數據後續通過 CMS 或 API 提供，當前階段使用 Mock 數據
- **ASSUMPTION-002**: 主語言為繁體中文，其他語言為可選
- **ASSUMPTION-003**: 發布系統第一階段僅預留入口，完整功能後續迭代
- **ASSUMPTION-004**: 公司信息由客戶提供，當前使用佔位內容

## 8. Related Specifications / Further Reading

- [Nuxt 4 官方文檔](https://nuxt.com/docs)
- [Nuxt UI 文檔](https://ui.nuxt.com/)
- [@nuxtjs/i18n 文檔](https://i18n.nuxtjs.org/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Nuxt File-based Routing](https://nuxt.com/docs/getting-started/routing)
- [Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines)
- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/)
