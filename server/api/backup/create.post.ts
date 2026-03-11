import { copyFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const dbPath = resolve(process.cwd(), 'data', 'worldnpress.db')
  const backupDir = resolve(process.cwd(), 'data', 'backups')

  if (!existsSync(dbPath)) {
    throw createError({ statusCode: 500, statusMessage: '数据库文件不存在' })
  }

  // 确保备份目录存在
  mkdirSync(backupDir, { recursive: true })

  // 使用 SQLite 的 backup API 通过 better-sqlite3 进行安全备份
  const db = useDB()

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupFileName = `worldnpress-backup-${timestamp}.db`
  const backupPath = join(backupDir, backupFileName)

  try {
    // 使用 better-sqlite3 的 backup 方法进行在线备份（安全，不会锁表）
    await db.backup(backupPath)
  }
  catch {
    // 如果 backup API 不可用，回退到文件复制（先执行 checkpoint）
    try {
      db.pragma('wal_checkpoint(TRUNCATE)')
    }
    catch {
      // checkpoint 失败不阻塞
    }
    copyFileSync(dbPath, backupPath)
  }

  return {
    success: true,
    backup: {
      fileName: backupFileName,
      createdAt: new Date().toISOString(),
      path: backupPath,
    },
  }
})
