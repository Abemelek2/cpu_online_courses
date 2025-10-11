'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Eye, Edit, Trash2, Plus, BookOpen, Users, Clock, TrendingUp, Search, Filter } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

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
  createdAt: string
  updatedAt: string
  createdById: string
  sections: {
    id: string
    title: string
    lessons: {
      id: string
      title: string
      slug: string
      durationSec: number | null
      freePreview: boolean
    }[]
  }[]
  enrollments: {
    id: string
  }[]
  createdBy: {
    name: string
  }
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/courses')
        if (!res.ok) {
          if (res.status === 401) {
            console.warn('Unauthorized to list courses')
            setCourses([])
            return
          }
          throw new Error('Failed to fetch courses')
        }

        const data: Course[] = await res.json()
        setCourses(data)
      } catch (err) {
        console.error('Error fetching courses:', err)
        setCourses([])
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <Badge className="bg-green-100 text-green-800 rounded-xl">Published</Badge>
      case 'DRAFT':
        return <Badge variant="secondary" className="rounded-xl">Draft</Badge>
      default:
        return <Badge variant="outline" className="rounded-xl">{status}</Badge>
    }
  }

  const getTotalLessons = (course: Course) => {
    return course.sections.reduce((acc: number, section: any) => acc + section.lessons.length, 0)
  }

  const getTotalDuration = (course: Course) => {
    return course.sections.reduce((acc: number, section: any) => {
      const sectionDuration = section.lessons.reduce((lessonAcc: number, lesson: any) => 
        lessonAcc + (lesson.durationSec || 0), 0)
      return acc + sectionDuration
    }, 0)
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter
    return matchesSearch && matchesStatus
  })

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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-3xl font-bold mb-2 gradient-primary bg-clip-text text-transparent">
              Course Management
            </h1>
            <p className="text-gray-600">Manage your course catalog with ease</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button asChild className="gradient-accent rounded-xl">
              <Link href="/admin/courses/new">
                <Plus className="w-4 h-4 mr-2" />
                Create Course
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Courses",
              value: courses.length,
              icon: BookOpen,
              color: "text-orange-500",
              gradient: "from-orange-100 to-pink-100"
            },
            {
              title: "Published",
              value: courses.filter(c => c.status === 'PUBLISHED').length,
              icon: TrendingUp,
              color: "text-green-500",
              gradient: "from-green-100 to-emerald-100"
            },
            {
              title: "Total Students",
              value: courses.reduce((acc, course) => acc + course.enrollments.length, 0),
              icon: Users,
              color: "text-blue-500",
              gradient: "from-blue-100 to-cyan-100"
            },
            {
              title: "Total Lessons",
              value: courses.reduce((acc, course) => getTotalLessons(course), 0),
              icon: Clock,
              color: "text-purple-500",
              gradient: "from-purple-100 to-indigo-100"
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <Card className="glass border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <motion.p 
                        className="text-2xl font-bold"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 + index * 0.1 }}
                      >
                        {stat.value}
                      </motion.p>
                    </div>
                    <motion.div
                      className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient}`}
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div 
          className="glass p-6 rounded-2xl shadow-xl border border-white/20 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-semibold text-gray-800">Filter & Search</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
            <Button className="gradient-accent rounded-xl">
              <Search className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </motion.div>

        {/* Courses Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="glass border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-600" />
                All Courses
              </CardTitle>
              <CardDescription>
                {filteredCourses.length} courses in your catalog
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="font-semibold">Course</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Lessons</TableHead>
                      <TableHead className="font-semibold">Duration</TableHead>
                      <TableHead className="font-semibold">Students</TableHead>
                      <TableHead className="font-semibold">Created By</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCourses.map((course, index) => (
                      <motion.tr
                        key={course.id}
                        className="border-gray-100 hover:bg-gray-50/50 transition-colors"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-4">
                            <motion.div 
                              className="w-16 h-16 bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl flex items-center justify-center overflow-hidden"
                              whileHover={{ scale: 1.05, rotate: 2 }}
                              transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                              {course.thumbnailUrl ? (
                                <img 
                                  src={course.thumbnailUrl} 
                                  alt={course.title}
                                  className="w-full h-full object-cover rounded-2xl"
                                />
                              ) : (
                                <BookOpen className="w-8 h-8 text-orange-400" />
                              )}
                            </motion.div>
                            <div>
                              <p className="font-semibold text-gray-900">{course.title}</p>
                              <p className="text-sm text-gray-600">{course.subtitle}</p>
                              {course.category && (
                                <Badge variant="outline" className="text-xs mt-1 rounded-lg">
                                  {course.category}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(course.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{getTotalLessons(course)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {formatDuration(getTotalDuration(course))}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{course.enrollments.length}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">{course.createdBy.name}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button asChild variant="outline" size="sm" className="rounded-xl">
                                <Link href={`/courses/${course.slug}`}>
                                  <Eye className="w-4 h-4" />
                                </Link>
                              </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button asChild variant="outline" size="sm" className="rounded-xl">
                                <Link href={`/admin/courses/${course.id}`}>
                                  <Edit className="w-4 h-4" />
                                </Link>
                              </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 rounded-xl">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </motion.div>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {filteredCourses.length === 0 && (
                <motion.div 
                  className="text-center py-12"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No courses found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your search criteria'
                      : 'Create your first course to get started'
                    }
                  </p>
                  <Button asChild className="gradient-accent rounded-xl">
                    <Link href="/admin/courses/new">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Course
                    </Link>
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
