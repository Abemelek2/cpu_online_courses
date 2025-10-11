import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; sectionId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, slug: lessonSlug, order, videoUrl, durationSec, freePreview } = await req.json()
    const resolvedParams = await params
    
    const lesson = await prisma.lesson.create({
      data: {
        title,
        slug: lessonSlug,
        order: order || 0,
        videoUrl,
        durationSec: durationSec ? parseInt(durationSec) : null,
        freePreview: freePreview || false,
        sectionId: resolvedParams.sectionId
      }
    })

    return NextResponse.json(lesson)
  } catch (error) {
    console.error('Error creating lesson:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
