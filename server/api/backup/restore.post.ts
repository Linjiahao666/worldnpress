import { copyFileSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const body = await readBody(event)
  const { fileName } = body

  if (!fileName || !fileName.startsWith('worldnpress-backup-') || !fileName.endsWith('.db')) {
    throw createError({ statusCode: 400, statusMessage: '无效的备份文件名' })
  }

  // 防止路径穿越
  if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
    throw createError({ statusCode: 400, statusMessage: '无效的文件名' })
  }

  const backupDir = resolve(process.cwd(), 'data', 'backups')
  const backupPath = join(backupDir, fileName)
  const dbPath = resolve(process.cwd(), 'data', 'worldnpress.db')

  if (!existsSync(backupPath)) {
    throw createError({ statusCode: 404, statusMessage: '备份文件不存在' })
  }

  try {
    // 关闭当前数据库连接
    closeDB()

    // 恢复前先自动备份当前数据库（安全措施）
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const autoBackupName = `worldnpress-backup-auto-before-restore-${timestamp}.db`
    const autoBackupPath = join(backupDir, autoBackupName)

    if (existsSync(dbPath)) {
      copyFileSync(dbPath, autoBackupPath)
    }

    // 用备份文件覆盖当前数据库
    copyFileSync(backupPath, dbPath)

    return {
      success: true,
      message: `数据库已从备份 ${fileName} 恢复成功`,
      autoBackup: autoBackupName,
    }
  }
  catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `恢复失败: ${err.message}`,
    })
  }
})
