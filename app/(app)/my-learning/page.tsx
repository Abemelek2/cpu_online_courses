'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Play, Clock, CheckCircle, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Lesson {
  id: string
  title: string
  slug: string
  durationSec: number | null
  progress: {
    completed: boolean
    positionSec: number
  } | null
  section: {
    title: string
  }
}

interface Course {
  id: string
  title: string
  slug: string
  thumbnailUrl: string | null
  sections: {
    lessons: Lesson[]
  }[]
  enrollments: {
    createdAt: string
  }[]
}

export default function MyLearningPage() {
  const { data: session, status } = useSession()
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    
    if (status === 'authenticated') {
      fetchEnrolledCourses()
    }
  }, [status, router])

  const fetchEnrolledCourses = async () => {
    try {
      const response = await fetch('/api/my-courses')
      if (response.ok) {
        const data = await response.json()
        setCourses(data)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getCourseProgress = (course: Course) => {
    const allLessons = course.sections.flatMap(section => section.lessons)
    const completedLessons = allLessons.filter(lesson => lesson.progress?.completed)
    const totalLessons = allLessons.length
    
    return {
      completed: completedLessons.length,
      total: totalLessons,
      percentage: totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0
    }
  }

  const getNextLesson = (course: Course) => {
    const allLessons = course.sections.flatMap(section => section.lessons)
    return allLessons.find(lesson => !lesson.progress?.completed)
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  if (isLoading) {
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
            Loading your courses...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="min-h-screen gradient-warm">
        <div className="container mx-auto px-4 py-8">
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <BookOpen className="w-16 h-16 text-orange-400 mx-auto mb-4" />
            </motion.div>
            <h1 className="text-2xl font-bold mb-4">No courses enrolled yet</h1>
            <p className="text-gray-600 mb-8">
              Start your learning journey by enrolling in a course
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild className="gradient-accent">
                <Link href="/catalog">Browse Courses</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Circular Progress Component
  const CircularProgress = ({ percentage, size = 60 }: { percentage: number; size?: number }) => {
    const radius = (size - 8) / 2
    const circumference = radius * 2 * Math.PI
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="text-orange-500 transition-all duration-500 ease-in-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-gray-700">{percentage}%</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-warm">
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-2">My Learning</h1>
          <p className="text-gray-600">Continue your learning journey</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => {
            const progress = getCourseProgress(course)
            const nextLesson = getNextLesson(course)
            const totalDuration = course.sections
              .flatMap(section => section.lessons)
              .reduce((acc, lesson) => acc + (lesson.durationSec || 0), 0)

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Card className="overflow-hidden glass">
                  <div className="aspect-video bg-gray-200 flex items-center justify-center relative overflow-hidden">
                    {course.thumbnailUrl ? (
                      <img 
                        src={course.thumbnailUrl} 
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    ) : (
                      <div className="text-gray-500">No thumbnail</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                    <CardDescription>
                      Enrolled {new Date(course.enrollments[0]?.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Circular Progress */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CircularProgress percentage={progress.percentage} />
                        <div>
                          <div className="text-sm font-medium text-gray-700">
                            {progress.completed}/{progress.total} lessons
                          </div>
                          <div className="text-xs text-gray-500">
                            {progress.percentage === 100 ? "Completed!" : "In Progress"}
                          </div>
                        </div>
                      </div>
                      <Badge variant={progress.percentage === 100 ? "default" : "secondary"}>
                        {progress.percentage === 100 ? "Completed" : "In Progress"}
                      </Badge>
                    </div>

                    {/* Course Info */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(totalDuration)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      {nextLesson ? (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button asChild className="w-full gradient-accent">
                            <Link href={`/learn/${course.slug}/${nextLesson.slug}`}>
                              <Play className="w-4 h-4 mr-2" />
                              Continue Learning
                            </Link>
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button asChild variant="outline" className="w-full">
                            <Link href={`/courses/${course.slug}`}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              View Course
                            </Link>
                          </Button>
                        </motion.div>
                      )}
                      
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button asChild variant="outline" className="w-full">
                          <Link href={`/courses/${course.slug}`}>
                            Course Details
                          </Link>
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
