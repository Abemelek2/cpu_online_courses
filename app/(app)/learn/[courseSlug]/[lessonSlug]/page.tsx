'use client'

import { useState, useEffect, useRef, use } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Play, CheckCircle, Lock, Clock } from 'lucide-react'
import { LoadingSpinner, LessonSkeleton } from '@/components/LoadingSpinner'
import { VideoPlayer } from '@/components/player/VideoPlayer'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Lesson {
  id: string
  title: string
  slug: string
  videoUrl: string | null
  durationSec: number | null
  freePreview: boolean
  section: {
    id: string
    title: string
    course: {
      id: string
      title: string
      slug: string
    }
  }
}

interface Section {
  id: string
  title: string
  lessons: Lesson[]
}

interface Course {
  id: string
  title: string
  slug: string
  sections: Section[]
}

interface LessonPageProps {
  params: Promise<{
    courseSlug: string
    lessonSlug: string
  }>
}

export default function LessonPage({ params }: LessonPageProps) {
  const unwrappedParams = use(params)
  const [course, setCourse] = useState<Course | null>(null)
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()

  useEffect(() => {
    fetchCourseData()
  }, [unwrappedParams.courseSlug, unwrappedParams.lessonSlug])

  const fetchCourseData = async () => {
    try {
      const response = await fetch(`/api/courses/${unwrappedParams.courseSlug}`)
      if (response.ok) {
        const courseData = await response.json()
        setCourse(courseData)
        
        // Find current lesson with section information
        let lesson = null
        for (const section of courseData.sections) {
          const foundLesson = section.lessons.find((l: Lesson) => l.slug === unwrappedParams.lessonSlug)
          if (foundLesson) {
            lesson = {
              ...foundLesson,
              section: {
                id: section.id,
                title: section.title,
                course: {
                  id: courseData.id,
                  title: courseData.title,
                  slug: courseData.slug
                }
              }
            }
            break
          }
        }
        
        setCurrentLesson(lesson)
        
        // Load progress
        if (lesson) {
          const progressResponse = await fetch(`/api/progress?lessonId=${lesson.id}`)
          if (progressResponse.ok) {
            const progressData = await progressResponse.json()
            setProgress(progressData.positionSec || 0)
            setIsCompleted(progressData.completed || false)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching course data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVideoTimeUpdate = async () => {
    if (!videoRef.current || !currentLesson) return

    const currentTime = videoRef.current.currentTime
    const duration = videoRef.current.duration

    if (duration > 0) {
      const progressPercent = (currentTime / duration) * 100
      
      // Update progress every 10 seconds
      if (Math.floor(currentTime) % 10 === 0) {
        try {
          await fetch('/api/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lessonId: currentLesson.id,
              positionSec: Math.floor(currentTime),
              completed: progressPercent >= 90
            })
          })
        } catch (error) {
          console.error('Error updating progress:', error)
        }
      }

      // Mark as completed at 90%
      if (progressPercent >= 90 && !isCompleted) {
        setIsCompleted(true)
        try {
          await fetch('/api/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lessonId: currentLesson.id,
              positionSec: Math.floor(currentTime),
              completed: true
            })
          })
        } catch (error) {
          console.error('Error marking lesson as completed:', error)
        }
      }
    }
  }

  const handleVideoEnded = async () => {
    if (!currentLesson) return
    
    // Mark lesson as completed when video ends
    setIsCompleted(true)
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: currentLesson.id,
          completed: true
        })
      })
      
      // Optionally auto-advance to next lesson
      // goToNextLesson()
    } catch (error) {
      console.error('Error marking lesson as completed:', error)
    }
  }

  const goToNextLesson = () => {
    if (!course || !currentLesson) return

    const allLessons = course.sections.flatMap(section => section.lessons)
    const currentIndex = allLessons.findIndex(lesson => lesson.id === currentLesson.id)
    const nextLesson = allLessons[currentIndex + 1]

    if (nextLesson) {
      router.push(`/learn/${unwrappedParams.courseSlug}/${nextLesson.slug}`)
    } else {
      router.push('/my-learning')
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
          <Button asChild>
            <Link href="/my-learning">Back to My Learning</Link>
          </Button>
        </div>
      </div>
    )
  }

  const allLessons = course.sections.flatMap(section => section.lessons)
  const currentIndex = allLessons.findIndex(lesson => lesson.id === currentLesson.id)
  const nextLesson = allLessons[currentIndex + 1]

  return (
    <div className="min-h-screen gradient-warm">
      <div className="flex h-screen">
        {/* Sidebar - Curriculum */}
        <motion.div 
          className="w-80 glass border-r overflow-y-auto"
          initial={{ x: -320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="p-4 border-b">
            <motion.h2 
              className="font-semibold text-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {course.title}
            </motion.h2>
            <motion.p 
              className="text-sm text-gray-600"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {course.sections.length} sections
            </motion.p>
          </div>
          
          <div className="p-4 space-y-4">
            {course.sections.map((section, sectionIndex) => (
              <motion.div 
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + sectionIndex * 0.1 }}
              >
                <h3 className="font-medium text-sm text-gray-700 mb-2">{section.title}</h3>
                <div className="space-y-1">
                  {section.lessons.map((lesson, lessonIndex) => (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + lessonIndex * 0.05 }}
                    >
                      <Link
                        href={`/learn/${unwrappedParams.courseSlug}/${lesson.slug}`}
                        className={`flex items-center space-x-2 p-3 rounded-xl text-sm transition-all duration-200 ${
                          lesson.id === currentLesson.id
                            ? 'bg-orange-100 text-orange-700 shadow-md'
                            : 'hover:bg-gray-100 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {lesson.id === currentLesson.id ? (
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              <Play className="w-4 h-4" />
                            </motion.div>
                          ) : isCompleted ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate">{lesson.title}</p>
                          {lesson.durationSec && (
                            <p className="text-xs text-gray-500">
                              {Math.floor(lesson.durationSec / 60)}m
                            </p>
                          )}
                        </div>
                        {lesson.freePreview && (
                          <Badge variant="outline" className="text-xs">
                            Free
                          </Badge>
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          className="flex-1 flex flex-col"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Video Player */}
          <div className="flex-1 p-4">
            <motion.div 
              className="w-full h-full rounded-2xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <VideoPlayer
                src={currentLesson.videoUrl || ''}
                onTimeUpdate={handleVideoTimeUpdate}
                onEnded={handleVideoEnded}
                className="w-full h-full rounded-2xl"
              />
            </motion.div>
          </div>

          {/* Lesson Info */}
          <motion.div 
            className="glass border-t p-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">{currentLesson.title}</h1>
                <p className="text-gray-600">
                  {currentLesson.section.title} • Lesson {currentIndex + 1} of {allLessons.length}
                </p>
              </div>
              {isCompleted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Completed
                  </Badge>
                </motion.div>
              )}
            </div>

            <div className="flex items-center space-x-4 mb-4">
              {currentLesson.durationSec && (
                <div className="flex items-center space-x-1 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{Math.floor(currentLesson.durationSec / 60)} minutes</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {nextLesson ? (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button onClick={goToNextLesson} className="gradient-accent">
                    Next Lesson: {nextLesson.title}
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button asChild className="gradient-primary">
                    <Link href="/my-learning">Back to My Learning</Link>
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
