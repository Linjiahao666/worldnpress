import { mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const formData = await readMultipartFormData(event)
  const file = formData?.find(item => item.name === 'file')

  if (!file?.data || !file.filename) {
    throw createError({ statusCode: 400, statusMessage: '请选择要导入的备份文件' })
  }

  if (!file.filename.toLowerCase().endsWith('.db')) {
    throw createError({ statusCode: 400, statusMessage: '仅支持 .db 文件' })
  }

  if (file.data.length < 16) {
    throw createError({ statusCode: 400, statusMessage: '文件内容无效' })
  }

  const sqliteSignature = file.data.subarray(0, 16).toString('utf8')
  if (sqliteSignature !== 'SQLite format 3\u0000') {
    throw createError({ statusCode: 400, statusMessage: '该文件不是有效的 SQLite 数据库备份' })
  }

  const backupDir = resolve(process.cwd(), 'data', 'backups')
  mkdirSync(backupDir, { recursive: true })

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const originalName = file.filename.replace(/\.db$/i, '').replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 50) || 'imported'
  const fileName = `worldnpress-backup-import-${timestamp}-${originalName}.db`
  const filePath = join(backupDir, fileName)

  writeFileSync(filePath, file.data)

  return {
    success: true,
    backup: {
      fileName,
      size: file.data.length,
      importedAt: new Date().toISOString(),
    },
  }
})
