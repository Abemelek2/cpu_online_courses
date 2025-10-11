import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    const level = searchParams.get('level')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'popularity'
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    
    const skip = (page - 1) * limit
    
    // Build where clause
    const where: any = {
      status: 'PUBLISHED'
    }
    
    if (category) {
      where.category = category
    }
    
    if (level) {
      where.level = level
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { subtitle: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (minPrice || maxPrice) {
      where.priceCents = {}
      if (minPrice) {
        where.priceCents.gte = parseInt(minPrice) * 100
      }
      if (maxPrice) {
        where.priceCents.lte = parseInt(maxPrice) * 100
      }
    }
    
    // Build orderBy clause
    let orderBy: any = {}
    switch (sortBy) {
      case 'popularity':
        orderBy = { enrollments: { _count: 'desc' } }
        break
      case 'rating':
        orderBy = { reviews: { _count: 'desc' } }
        break
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      case 'price-low':
        orderBy = { priceCents: 'asc' }
        break
      case 'price-high':
        orderBy = { priceCents: 'desc' }
        break
      default:
        orderBy = { enrollments: { _count: 'desc' } }
    }
    
    // Get courses with aggregated data
    const courses = await prisma.course.findMany({
      where,
      skip,
      take: limit,
      orderBy,
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
    const coursesWithStats = courses.map(course => {
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
    
    // Get total count for pagination
    const totalCount = await prisma.course.count({ where })
    const totalPages = Math.ceil(totalCount / limit)
    
    return NextResponse.json({
      courses: coursesWithStats,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
    
  } catch (error) {
    console.error('Error fetching public courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}
