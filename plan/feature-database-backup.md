# 数据库备份与恢复功能 — 工作计划

## 项目概述

为 WorldnPress 管理系统实现数据库备份与恢复功能，支持手动创建备份、下载备份到本地、从备份恢复数据库、以及删除旧备份。

## 技术方案

### 数据库

- **类型**: SQLite（better-sqlite3）
- **路径**: `data/worldnpress.db`
- **备份目录**: `data/backups/`
- **备份方式**: 优先使用 better-sqlite3 的 `backup()` API 进行在线热备份；不可用时回退为文件复制

### 架构

```
服务端 API（Nuxt Server Routes）
├── POST /api/backup/create    → 创建备份
├── GET  /api/backup/list      → 获取备份列表
├── GET  /api/backup/download  → 下载备份文件
├── POST /api/backup/restore   → 恢复数据库
└── POST /api/backup/delete    → 删除备份文件

管理后台页面
└── /admin/backup              → 备份管理界面
```

## 已完成任务

### 1. ✅ 网站名称修改

- **nuxt.config.ts**: `title` 和 `og:title` 改为"国际经济网"
- **zh-CN.json**: `site.title` → "国际经济网"，`footer.companyName` → "国际经济网"，`subtitle/companyNameEn` → "International Economy Network"
- **zh-TW.json**: `site.title` → "國際經濟網"，`footer.companyName` → "國際經濟網"，`subtitle/companyNameEn` → "International Economy Network"
- **en.json**: `site.title` → "International Economy Network"，`footer.companyName` → "International Economy Network"

### 2. ✅ 备份 API — `server/api/backup/create.post.ts`

- 验证管理员 session 权限
- 使用 better-sqlite3 的 `backup()` 进行在线热备份
- 回退方案：执行 WAL checkpoint 后文件复制
- 备份文件命名格式：`worldnpress-backup-{ISO时间戳}.db`

### 3. ✅ 备份列表 API — `server/api/backup/list.get.ts`

- 扫描 `data/backups/` 目录
- 返回文件名、大小（含格式化）、创建时间
- 按创建时间降序排列

### 4. ✅ 备份下载 API — `server/api/backup/download.get.ts`

- 通过 `?file=` 参数指定文件名
- 路径穿越防护
- 返回二进制流，设置 `Content-Disposition` 触发浏览器下载

### 5. ✅ 数据库恢复 API — `server/api/backup/restore.post.ts`

- 恢复前自动备份当前数据库（安全措施）
- 调用 `closeDB()` 关闭当前连接
- 用备份文件覆盖 `worldnpress.db`

### 6. ✅ 备份删除 API — `server/api/backup/delete.post.ts`

- 路径穿越防护
- 删除指定备份文件

### 7. ✅ 数据库工具扩展 — `server/utils/db.ts`

- 新增 `closeDB()` 函数，用于恢复时安全关闭数据库连接

### 8. ✅ 管理后台备份页面 — `app/pages/admin/backup.vue`

- 完整的备份管理界面
- 创建备份按钮（带 loading 状态）
- 备份列表展示（文件名、大小、时间）
- 每个备份支持：下载、恢复、删除操作
- 恢复/删除前有确认提示
- 空状态和加载状态处理
- 操作说明提示卡片

### 9. ✅ 管理后台入口

- 在 `/admin` 仪表板的快捷操作区添加"备份管理"入口按钮

### 10. ✅ 国际化支持

- zh-CN、zh-TW、en 三语言添加备份相关翻译键

### 11. ✅ 路由配置

- `nuxt.config.ts` 中将 `admin/backup` 排除在 i18n 路由前缀外

## 安全措施

1. **权限验证**: 所有备份 API 均验证管理员 session
2. **路径防护**: 文件名校验 + 路径穿越检测（禁止 `..`、`/`、`\`）
3. **文件名限制**: 仅接受 `worldnpress-backup-` 前缀且 `.db` 后缀的文件
4. **恢复安全**: 恢复前自动备份当前数据库

## 文件清单

| 文件路径                            | 操作 | 说明                                |
| ----------------------------------- | ---- | ----------------------------------- |
| `nuxt.config.ts`                    | 修改 | 更新网站名称 + 添加 backup 路由排除 |
| `i18n/locales/zh-CN.json`           | 修改 | 更新名称 + 添加备份翻译             |
| `i18n/locales/zh-TW.json`           | 修改 | 更新名称 + 添加备份翻译             |
| `i18n/locales/en.json`              | 修改 | 更新名称 + 添加备份翻译             |
| `server/utils/db.ts`                | 修改 | 新增 closeDB()                      |
| `server/api/backup/create.post.ts`  | 新建 | 创建备份 API                        |
| `server/api/backup/list.get.ts`     | 新建 | 备份列表 API                        |
| `server/api/backup/download.get.ts` | 新建 | 下载备份 API                        |
| `server/api/backup/restore.post.ts` | 新建 | 恢复数据库 API                      |
| `server/api/backup/delete.post.ts`  | 新建 | 删除备份 API                        |
| `app/pages/admin/backup.vue`        | 新建 | 备份管理页面                        |
| `app/pages/admin/index.vue`         | 修改 | 添加备份管理入口                    |
