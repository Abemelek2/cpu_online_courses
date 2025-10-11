import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { courseId, rating, comment } = await req.json()
    if (!courseId || !rating) {
      return NextResponse.json({ error: 'courseId and rating are required' }, { status: 400 })
    }

    // Upsert review by user & course
    const review = await prisma.review.upsert({
      where: {
        userId_courseId: {
          userId: (session.user as any).id,
          courseId,
        },
      },
      update: {
        rating: Math.max(1, Math.min(5, Number(rating))),
        comment: comment || null,
        status: 'VISIBLE',
      },
      create: {
        userId: (session.user as any).id,
        courseId,
        rating: Math.max(1, Math.min(5, Number(rating))),
        comment: comment || null,
        status: 'VISIBLE',
      },
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
