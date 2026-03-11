import { readdirSync, statSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

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
