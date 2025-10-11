import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { courseId } = await request.json()

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
    }

    // Check if user is already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: courseId
        }
      }
    })

    if (existingEnrollment) {
      return NextResponse.json({ error: 'Already enrolled' }, { status: 400 })
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: session.user.id,
        courseId: courseId
      }
    })

    // Get the first lesson of the course
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        sections: {
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              take: 1
            }
          },
          orderBy: { order: 'asc' },
          take: 1
        }
      }
    })

    const firstLesson = course?.sections[0]?.lessons[0]

    return NextResponse.json({ 
      success: true, 
      enrollment,
      firstLesson: firstLesson ? {
        courseSlug: course.slug,
        lessonSlug: firstLesson.slug
      } : null
    })

  } catch (error) {
    console.error('Enrollment error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    if (!courseId) {
      return NextResponse.redirect(new URL('/catalog', request.url))
    }

    // Check if user is already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: courseId
        }
      }
    })

    if (existingEnrollment) {
      // Redirect to first lesson
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
          sections: {
            include: {
              lessons: {
                orderBy: { order: 'asc' },
                take: 1
              }
            },
            orderBy: { order: 'asc' },
            take: 1
          }
        }
      })

      const firstLesson = course?.sections[0]?.lessons[0]
      
      if (firstLesson) {
        return NextResponse.redirect(new URL(`/learn/${course.slug}/${firstLesson.slug}`, request.url))
      } else {
        return NextResponse.redirect(new URL('/my-learning', request.url))
      }
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: session.user.id,
        courseId: courseId
      }
    })

    // Get the first lesson of the course
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        sections: {
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              take: 1
            }
          },
          orderBy: { order: 'asc' },
          take: 1
        }
      }
    })

    const firstLesson = course?.sections[0]?.lessons[0]
    
    if (firstLesson) {
      return NextResponse.redirect(new URL(`/learn/${course.slug}/${firstLesson.slug}`, request.url))
    } else {
      return NextResponse.redirect(new URL('/my-learning', request.url))
    }

  } catch (error) {
    console.error('Enrollment error:', error)
    return NextResponse.redirect(new URL('/catalog', request.url))
  }
}
