import { readFileSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const query = getQuery(event)
  const fileName = query.file as string

  if (!fileName || !fileName.startsWith('worldnpress-backup-') || !fileName.endsWith('.db')) {
    throw createError({ statusCode: 400, statusMessage: '无效的备份文件名' })
  }

  // 防止路径穿越攻击
  if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
    throw createError({ statusCode: 400, statusMessage: '无效的文件名' })
  }

  const backupDir = resolve(process.cwd(), 'data', 'backups')
  const filePath = join(backupDir, fileName)

  if (!existsSync(filePath)) {
    throw createError({ statusCode: 404, statusMessage: '备份文件不存在' })
  }

  const fileBuffer = readFileSync(filePath)

  setHeaders(event, {
    'Content-Type': 'application/octet-stream',
    'Content-Disposition': `attachment; filename="${fileName}"`,
    'Content-Length': String(fileBuffer.length),
  })

  return fileBuffer
})
