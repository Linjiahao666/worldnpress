import { readdirSync, statSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'

const SESSION_PASSWORD = 'worldnpress-admin-session-secret-2026!'

export default defineEventHandler(async (event) => {
  // 验证管理员权限
  const session = await useSession(event, { password: SESSION_PASSWORD })
  if (!session.data?.authenticated) {
    throw createError({ statusCode: 401, statusMessage: '未授權，請先登錄' })
  }

  const backupDir = resolve(process.cwd(), 'data', 'backups')

  if (!existsSync(backupDir)) {
    return { backups: [] }
  }

  const files = readdirSync(backupDir)
    .filter(f => f.startsWith('worldnpress-backup-') && f.endsWith('.db'))
    .map((fileName) => {
      const filePath = join(backupDir, fileName)
      const stats = statSync(filePath)
      return {
        fileName,
        size: stats.size,
        sizeFormatted: formatFileSize(stats.size),
        createdAt: stats.mtime.toISOString(),
      }
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return { backups: files }
})

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / k ** i).toFixed(2)} ${sizes[i]}`
}
