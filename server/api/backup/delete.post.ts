import { unlinkSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'

const SESSION_PASSWORD = 'worldnpress-admin-session-secret-2026!'

export default defineEventHandler(async (event) => {
  // 验证管理员权限
  const session = await useSession(event, { password: SESSION_PASSWORD })
  if (!session.data?.authenticated) {
    throw createError({ statusCode: 401, statusMessage: '未授權，請先登錄' })
  }

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
  const filePath = join(backupDir, fileName)

  if (!existsSync(filePath)) {
    throw createError({ statusCode: 404, statusMessage: '备份文件不存在' })
  }

  try {
    unlinkSync(filePath)
    return { success: true, message: `备份文件 ${fileName} 已删除` }
  }
  catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `删除失败: ${err.message}`,
    })
  }
})
