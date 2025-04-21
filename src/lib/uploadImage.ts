import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function uploadImage(file: File): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Create a unique filename
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
  const filename = file.name.replace(/\.[^/.]+$/, "") + '-' + uniqueSuffix + '.jpg'
  
  // Save to public/uploads directory
  const path = join(process.cwd(), 'public/uploads', filename)
  await writeFile(path, buffer)
  
  // Return the public URL
  return `/uploads/${filename}`
} 