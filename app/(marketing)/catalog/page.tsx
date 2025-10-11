'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Star, Users, Clock, Play, BookOpen, Award, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Course {
  id: string
  slug: string
  title: string
  subtitle: string
  description: string
  priceCents: number
  thumbnailUrl?: string
  category: string
  level: string
  language: string
  createdAt: string
  instructor: {
    id: string
    name: string
    image?: string
  }
  stats: {
    enrollmentCount: number
    reviewCount: number
    averageRating: number
    totalLessons: number
  }
  tags: string[]
}

interface ApiResponse {
  courses: Course[]
  pagination: {
    page: number
    limit: number
    totalCount: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export default function CatalogPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('')
  const [level, setLevel] = useState('')
  const [sortBy, setSortBy] = useState('popularity')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortBy,
        ...(searchQuery && { search: searchQuery }),
        ...(category && { category }),
        ...(level && { level })
      })

      const response = await fetch(`/api/courses/public?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch courses')
      }

      const data: ApiResponse = await response.json()
      setCourses(data.courses)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [pagination.page, searchQuery, category, level, sortBy])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPagination(prev => ({ ...prev, page: 1 }))
    fetchCourses()
  }

  const totalLessons = courses.reduce((acc, course) => acc + course.stats.totalLessons, 0)
  const totalStudents = courses.reduce((acc, course) => acc + course.stats.enrollmentCount, 0)

  if (loading) {
    return (
      <div className="min-h-screen gradient-cool flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading courses...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-cool">
      {/* Hero Section */}
      <div className="gradient-primary text-white relative overflow-hidden">
        {/* Floating elements */}
        <motion.div
          className="absolute top-10 left-10 w-16 h-16 bg-white/10 rounded-full"
          animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-20 right-20 w-12 h-12 bg-white/5 rounded-full"
          animate={{ y: [0, 20, 0], rotate: [0, -180, -360] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Course Catalog
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl mb-8 text-orange-100"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Discover amazing CPU and computer architecture courses
            </motion.p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {[
                { icon: BookOpen, value: pagination.totalCount, label: "Courses Available", color: "text-orange-200" },
                { icon: Play, value: totalLessons, label: "Video Lessons", color: "text-pink-200" },
                { icon: Users, value: totalStudents, label: "Students Learning", color: "text-yellow-200" }
              ].map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  className="glass rounded-2xl p-6 border border-white/20"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                  <div className="text-3xl font-bold">{stat.value.toLocaleString()}</div>
                  <div className="text-orange-200">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Enhanced Filters */}
        <motion.div 
          className="glass p-8 rounded-2xl shadow-xl border border-white/20 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Filter className="w-6 h-6 text-orange-600" />
            <h2 className="text-2xl font-bold text-gray-800">Find Your Perfect Course</h2>
          </motion.div>
          
          <form onSubmit={handleSearch} className="grid md:grid-cols-5 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Search Courses</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search courses..."
                  className="pl-10 rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  <SelectItem value="Computer Architecture">Computer Architecture</SelectItem>
                  <SelectItem value="Embedded Systems">Embedded Systems</SelectItem>
                  <SelectItem value="Assembly Programming">Assembly Programming</SelectItem>
                  <SelectItem value="Microcontrollers">Microcontrollers</SelectItem>
                  <SelectItem value="Digital Design">Digital Design</SelectItem>
                  <SelectItem value="System Programming">System Programming</SelectItem>
                  <SelectItem value="Performance Optimization">Performance Optimization</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Level</label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Levels</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button type="submit" className="w-full h-12 gradient-accent rounded-xl font-semibold">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              {pagination.totalCount} courses found
            </h3>
            <p className="text-gray-600">Showing {courses.length} of {pagination.totalCount} courses</p>
          </div>
          <div className="flex items-center space-x-2 text-gray-500">
            <TrendingUp className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">Sorted by {sortBy}</span>
          </div>
        </div>

        {/* Enhanced Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <Card className="overflow-hidden glass border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl">
                {/* Course Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  {course.thumbnailUrl ? (
                    <img 
                      src={course.thumbnailUrl} 
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-orange-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-purple-600 text-white">
                      {course.category}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="line-clamp-2 text-lg">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2 text-sm">
                    {course.subtitle}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Course Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.stats.totalLessons} lessons</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{course.stats.enrollmentCount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Rating */}
                  {course.stats.averageRating > 0 && (
                    <div className="flex items-center space-x-1 mb-3">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= course.stats.averageRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {course.stats.averageRating.toFixed(1)} ({course.stats.reviewCount})
                      </span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-purple-600">
                      ${(course.priceCents / 100).toFixed(2)}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {course.level}
                    </Badge>
                  </div>

                  <Button asChild className="w-full h-11 gradient-accent rounded-xl font-semibold group-hover:shadow-lg transition-all duration-300">
                    <Link href={`/courses/${course.slug}`} className="flex items-center justify-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      View Course
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={!pagination.hasPrev}
                className="rounded-xl"
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={!pagination.hasNext}
                className="rounded-xl"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {courses.length === 0 && !loading && (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass rounded-2xl p-12 max-w-md mx-auto border border-white/20">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Search className="w-16 h-16 mx-auto text-gray-400 mb-6" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No courses found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or browse all available courses.
              </p>
              <Button asChild className="gradient-accent rounded-xl">
                <Link href="/catalog">View All Courses</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}