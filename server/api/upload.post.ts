import { mkdir, writeFile } from 'node:fs/promises'
import { extname, join } from 'node:path'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const form = await readMultipartFormData(event)
  const file = form?.find((item) => item.name === 'file')

  if (!file || !file.data) {
    throw createError({ statusCode: 400, statusMessage: '請上傳文件' })
  }

  const uploadDir = join(process.cwd(), 'public', 'uploads')
  await mkdir(uploadDir, { recursive: true })

  const original = file.filename || 'upload'
  const ext = extname(original) || '.png'
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`
  const filePath = join(uploadDir, fileName)

  await writeFile(filePath, file.data)

  return {
    url: `/uploads/${fileName}`,
  }
})
