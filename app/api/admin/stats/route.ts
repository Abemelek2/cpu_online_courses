import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get basic counts
    const [
      totalCourses,
      totalUsers,
      totalEnrollments,
      publishedCourses,
      draftCourses,
      recentCourses,
      recentEnrollments
    ] = await Promise.all([
      prisma.course.count(),
      prisma.user.count(),
      prisma.enrollment.count(),
      prisma.course.count({ where: { status: 'PUBLISHED' } }),
      prisma.course.count({ where: { status: 'DRAFT' } }),
      prisma.course.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: {
            select: { name: true }
          },
          enrollments: {
            select: { id: true }
          }
        }
      }),
      prisma.enrollment.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true }
          },
          course: {
            select: { title: true, slug: true }
          }
        }
      })
    ])

    // Revenue removed: all courses are free

    // Get course categories distribution
    const categoryStats = await prisma.course.groupBy({
      by: ['category'],
      _count: {
        id: true
      },
      where: {
        category: { not: null }
      }
    })

    // Get enrollment trends (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const enrollmentsLast30Days = await prisma.enrollment.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    })

    const previous30Days = new Date()
    previous30Days.setDate(previous30Days.getDate() - 60)
    const enrollmentsPrevious30Days = await prisma.enrollment.count({
      where: {
        createdAt: {
          gte: previous30Days,
          lt: thirtyDaysAgo
        }
      }
    })

    const enrollmentGrowth = enrollmentsPrevious30Days > 0 
      ? Math.round(((enrollmentsLast30Days - enrollmentsPrevious30Days) / enrollmentsPrevious30Days) * 100)
      : 0

    return NextResponse.json({
      totalCourses,
      totalUsers,
      totalEnrollments,
      publishedCourses,
    draftCourses,
      recentCourses: recentCourses.map(course => ({
        id: course.id,
        title: course.title,
        slug: course.slug,
        createdBy: course.createdBy.name,
        enrollments: course.enrollments.length,
        createdAt: course.createdAt
      })),
      recentEnrollments: recentEnrollments.map(enrollment => ({
        id: enrollment.id,
        userName: enrollment.user.name,
        userEmail: enrollment.user.email,
        courseTitle: enrollment.course.title,
        courseSlug: enrollment.course.slug,
        createdAt: enrollment.createdAt
      })),
      categoryStats: categoryStats.map(stat => ({
        category: stat.category,
        count: stat._count.id
      })),
      enrollmentGrowth,
      enrollmentsLast30Days
    })
    
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
