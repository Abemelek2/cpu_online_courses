import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get top 6 featured courses based on enrollment count and ratings
    const featuredCourses = await prisma.course.findMany({
      where: {
        status: 'PUBLISHED'
      },
      take: 6,
      orderBy: [
        { enrollments: { _count: 'desc' } },
        { reviews: { _count: 'desc' } }
      ],
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        enrollments: {
          select: {
            id: true
          }
        },
        reviews: {
          select: {
            rating: true
          }
        },
        sections: {
          select: {
            lessons: {
              select: {
                id: true
              }
            }
          }
        },
        courseTags: {
          include: {
            tag: true
          }
        }
      }
    })
    
    // Calculate aggregated data
    const coursesWithStats = featuredCourses.map(course => {
      const enrollmentCount = course.enrollments.length
      const reviewCount = course.reviews.length
      const averageRating = reviewCount > 0 
        ? course.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
        : 0
      const totalLessons = course.sections.reduce((sum, section) => sum + section.lessons.length, 0)
      
      return {
        id: course.id,
        slug: course.slug,
        title: course.title,
        subtitle: course.subtitle,
        description: course.description,
        priceCents: course.priceCents,
        thumbnailUrl: course.thumbnailUrl,
        category: course.category,
        level: course.level,
        language: course.language,
        createdAt: course.createdAt,
        instructor: {
          id: course.createdBy.id,
          name: course.createdBy.name,
          image: course.createdBy.image
        },
        stats: {
          enrollmentCount,
          reviewCount,
          averageRating: Math.round(averageRating * 10) / 10,
          totalLessons
        },
        tags: course.courseTags.map(ct => ct.tag.name)
      }
    })
    
    return NextResponse.json({
      courses: coursesWithStats
    })
    
  } catch (error) {
    console.error('Error fetching featured courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch featured courses' },
      { status: 500 }
    )
  }
}
