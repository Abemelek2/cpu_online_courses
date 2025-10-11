import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admins can upload files
    if ((session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const contentType = req.headers.get('content-type') || ''
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const type = (formData.get('type') as string | null) || 'generic'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const allowedVideo = ['video/mp4', 'video/webm', 'video/ogg']
    const allowedImages = ['image/jpeg', 'image/png', 'image/webp']

    const isVideo = allowedVideo.includes(file.type)
    const isImage = allowedImages.includes(file.type)

    if (!isVideo && !isImage) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
    }

    // 100MB limit for videos, 5MB for images
    const sizeLimit = isVideo ? 100 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > sizeLimit) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 })
    }

    // Determine bucket and file extension
    const bucket = isVideo ? 'course-videos' : 'course-thumbnails'
    const ext = file.name.split('.').pop() || (isVideo ? 'mp4' : 'png')
    const fileName = `${type}-${Date.now()}.${ext}`

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (error) {
      console.error('Supabase upload error:', error)
      
      // Check if bucket doesn't exist
      if (error.message.includes('not found') || error.message.includes('does not exist')) {
        return NextResponse.json({ 
          error: `Storage bucket '${bucket}' not found. Please create it in Supabase dashboard.` 
        }, { status: 500 })
      }
      
      return NextResponse.json({ 
        error: `Upload failed: ${error.message}` 
      }, { status: 500 })
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(fileName)

    return NextResponse.json({ url: publicUrl })
  } catch (err) {
    console.error('Upload error', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
