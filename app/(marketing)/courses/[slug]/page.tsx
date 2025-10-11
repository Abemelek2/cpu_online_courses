'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Star, Users, Clock, Play, BookOpen, Award } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ReviewForm } from '@/components/course/ReviewForm'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface Course {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  thumbnailUrl: string | null
  slug: string
  status: string
  level: string | null
  language: string | null
  category: string | null
  priceCents: number
  createdAt: string
  updatedAt: string
  createdById: string
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
  sections: {
    id: string
    title: string
    order: number
    lessons: {
      id: string
      title: string
      slug: string
      order: number
      durationSec: number | null
      freePreview: boolean
    }[]
  }[]
  reviews: {
    id: string
    rating: number
    comment: string | null
    createdAt: string
    user: {
      name: string
      image: string | null
    }
  }[]
  tags: string[]
  isEnrolled: boolean
}

export default function CoursePage() {
  const params = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/courses/${params.slug}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            notFound()
          }
          throw new Error('Failed to fetch course')
        }
        
        const data = await response.json()
        setCourse(data)
      } catch (err) {
        console.error('Error fetching course:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchCourse()
    }
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen gradient-warm flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading course...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen gradient-warm flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error loading course</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button asChild>
            <Link href="/catalog">Back to Catalog</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!course) {
    notFound()
  }

  const totalLessons = course.stats.totalLessons
  const totalDuration = course.sections.reduce((acc, section) => {
    const sectionDuration = section.lessons.reduce((lessonAcc, lesson) => 
      lessonAcc + (lesson.durationSec || 0), 0)
    return acc + sectionDuration
  }, 0)

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  const averageRating = course.stats.averageRating
  const enrollmentCount = course.stats.enrollmentCount

  return (
    <div className="min-h-screen gradient-warm">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <motion.div 
              className="glass rounded-2xl shadow-sm p-6 mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-video bg-gray-200 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
                {course.thumbnailUrl ? (
                  <img 
                    src={course.thumbnailUrl} 
                    alt={course.title}
                    className="w-full h-full object-cover rounded-2xl transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
                    <Play className="w-16 h-16 text-orange-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              </div>
              
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              {course.subtitle && (
                <p className="text-xl text-gray-600 mb-4">{course.subtitle}</p>
              )}

              {/* Course Stats */}
              <div className="flex items-center space-x-6 mb-4">
                <div className="flex items-center space-x-1 text-gray-600">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{averageRating.toFixed(1)} ({course.stats.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{enrollmentCount.toLocaleString()} students</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(totalDuration)}</span>
                </div>
              </div>

              {/* Tags */}
              <motion.div 
                className="flex flex-wrap gap-2 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {course.tags.map((tag, index) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  >
                    <Badge variant="secondary">
                      {tag}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>

              {/* Instructor Info */}
              <div className="flex items-center space-x-3 mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  {course.instructor.image ? (
                    <img 
                      src={course.instructor.image} 
                      alt={course.instructor.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <Award className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Instructor</p>
                  <p className="text-gray-600">{course.instructor.name}</p>
                </div>
              </div>

              {course.description && (
                <motion.div 
                  className="prose max-w-none"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <p className="text-gray-700">{course.description}</p>
                </motion.div>
              )}
            </motion.div>

            {/* Curriculum */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="mb-6 glass">
                <CardHeader>
                  <CardTitle>Curriculum</CardTitle>
                  <CardDescription>
                    {course.sections.length} sections • {totalLessons} lessons
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {course.sections.map((section, sectionIndex) => (
                      <motion.div
                        key={section.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: sectionIndex * 0.1 }}
                      >
                        <AccordionItem value={section.id} className="border rounded-xl mb-2">
                          <AccordionTrigger className="text-left px-4 py-3 hover:bg-gray-50 rounded-xl">
                            <div>
                              <div className="font-medium">{section.title}</div>
                              <div className="text-sm text-gray-500">
                                {section.lessons.length} lessons
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            <div className="space-y-2">
                              {section.lessons.map((lesson, lessonIndex) => (
                                <motion.div 
                                  key={lesson.id} 
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: lessonIndex * 0.05 }}
                                  whileHover={{ x: 5 }}
                                >
                                  <div className="flex items-center space-x-3">
                                    <Play className="w-4 h-4 text-gray-400" />
                                    <span className="font-medium">{lesson.title}</span>
                                    {lesson.freePreview && (
                                      <Badge variant="outline" className="text-xs">
                                        Free Preview
                                      </Badge>
                                    )}
                                  </div>
                                  <span className="text-sm text-gray-500">
                                    {lesson.durationSec ? formatDuration(lesson.durationSec) : 'No duration'}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </motion.div>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
                <CardDescription>
                  What students are saying about this course
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.reviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      className="border rounded-xl p-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium">{review.user.name}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600">{review.comment || 'No comment provided.'}</p>
                    </motion.div>
                  ))}
                </div>
                
                <Separator className="my-6" />
                
                <ReviewForm courseId={course.id} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="sticky top-8 glass">
                <CardHeader>
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <CardTitle className="text-2xl gradient-primary bg-clip-text text-transparent">
                      ${(course.priceCents / 100).toFixed(2)}
                    </CardTitle>
                    <CardDescription>
                      {course.isEnrolled ? 'You are enrolled in this course' : 'Enroll now and start learning immediately'}
                    </CardDescription>
                  </motion.div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {course.isEnrolled ? (
                      <Button asChild className="w-full gradient-accent" size="lg">
                        <Link href={`/learn/${course.slug}/${course.sections[0]?.lessons[0]?.slug || ''}`}>
                          Continue Learning
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild className="w-full gradient-accent" size="lg">
                        <Link href={`/api/enroll?courseId=${course.id}`}>
                          Enroll Now
                        </Link>
                      </Button>
                    )}
                  </motion.div>
                  
                  <Separator />
                  
                  <motion.div 
                    className="space-y-2 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    {[
                      { label: "Duration:", value: formatDuration(totalDuration) },
                      { label: "Lessons:", value: totalLessons.toString() },
                      { label: "Level:", value: course.level || 'Not specified' },
                      { label: "Language:", value: course.language || 'English' },
                      { label: "Category:", value: course.category || 'Not specified' }
                    ].map((item, index) => (
                      <motion.div 
                        key={item.label}
                        className="flex justify-between"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                      >
                        <span className="text-gray-600">{item.label}</span>
                        <span className="font-medium">{item.value}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}