import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params
    const course = await prisma.course.findUnique({
      where: { slug: resolvedParams.slug },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        sections: {
          include: {
            lessons: {
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        },
        enrollments: {
          select: {
            id: true
          }
        },
        reviews: {
          where: { status: 'VISIBLE' },
          include: {
            user: {
              select: { name: true, image: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        courseTags: {
          include: {
            tag: true
          }
        }
      }
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Calculate aggregated data
    const enrollmentCount = course.enrollments.length
    const reviewCount = course.reviews.length
    const averageRating = reviewCount > 0 
      ? course.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
      : 0
    const totalLessons = course.sections.reduce((sum, section) => sum + section.lessons.length, 0)

    // Check if user is enrolled (if session exists)
    let isEnrolled = false
    try {
      const session = await auth()
      if (session?.user) {
        const enrollment = await prisma.enrollment.findUnique({
          where: {
            userId_courseId: {
              userId: session.user.id,
              courseId: course.id
            }
          }
        })
        isEnrolled = !!enrollment
      }
    } catch (error) {
      // Ignore auth errors for public access
    }

    const courseWithStats = {
      ...course,
      instructor: course.createdBy,
      stats: {
        enrollmentCount,
        reviewCount,
        averageRating: Math.round(averageRating * 10) / 10,
        totalLessons
      },
      tags: course.courseTags.map(ct => ct.tag.name),
      isEnrolled
    }

    return NextResponse.json(courseWithStats)
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const resolvedParams = await params

    const course = await prisma.course.update({
      where: { slug: resolvedParams.slug },
      data: {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        priceCents: data.priceCents,
        status: data.status,
        thumbnailUrl: data.thumbnailUrl,
        category: data.category,
        level: data.level,
        language: data.language,
      }
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
