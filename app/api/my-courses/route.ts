import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const courses = await prisma.course.findMany({
      where: {
        enrollments: {
          some: {
            userId: session.user.id
          }
        }
      },
      include: {
        sections: {
          include: {
            lessons: {
              include: {
                progress: {
                  where: {
                    userId: session.user.id
                  }
                }
              },
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        },
        enrollments: {
          where: {
            userId: session.user.id
          }
        }
      },
      orderBy: {
        enrollments: {
          _count: 'desc'
        }
      }
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error('Error fetching user courses:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
