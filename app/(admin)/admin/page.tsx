'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Users, GraduationCap, TrendingUp, DollarSign, Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface DashboardStats {
  totalCourses: number
  totalUsers: number
  totalEnrollments: number
  publishedCourses: number
  draftCourses: number
  revenue: number
  enrollmentGrowth: number
  enrollmentsLast30Days: number
  recentCourses: Array<{
    id: string
    title: string
    slug: string
    createdBy: string
    enrollments: number
    createdAt: string
  }>
  recentEnrollments: Array<{
    id: string
    userName: string
    userEmail: string
    courseTitle: string
    courseSlug: string
    createdAt: string
  }>
  categoryStats: Array<{
    category: string
    count: number
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/stats')
        
        if (!response.ok) {
          if (response.status === 401) {
            setError('Unauthorized - Admin access required')
            return
          }
          throw new Error('Failed to fetch stats')
        }
        
        const data = await response.json()
        setStats(data)
      } catch (err) {
        console.error('Error fetching stats:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

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
            Loading dashboard...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen gradient-cool flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error loading dashboard</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen gradient-cool flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-xl mb-4">No data available</div>
        </div>
      </div>
    )
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100)
  }

  return (
    <div className="min-h-screen gradient-cool">
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your CPU course platform</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              title: "Total Courses", 
              value: stats.totalCourses, 
              description: `${stats.publishedCourses} published, ${stats.draftCourses} drafts`, 
              icon: BookOpen, 
              color: "text-orange-500",
              gradient: "from-orange-100 to-pink-100"
            },
            { 
              title: "Total Users", 
              value: stats.totalUsers, 
              description: "Registered users", 
              icon: Users, 
              color: "text-teal-500",
              gradient: "from-teal-100 to-cyan-100"
            },
            { 
              title: "Enrollments", 
              value: stats.totalEnrollments, 
              description: "Total enrollments", 
              icon: GraduationCap, 
              color: "text-purple-500",
              gradient: "from-purple-100 to-indigo-100"
            },
            { 
              title: "Revenue", 
              value: formatCurrency(stats.revenue), 
              description: "Total earnings", 
              icon: DollarSign, 
              color: "text-green-500",
              gradient: "from-green-100 to-emerald-100"
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <Card className="glass">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <motion.div
                    className={`p-2 rounded-xl bg-gradient-to-br ${stat.gradient}`}
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <motion.div 
                    className="text-2xl font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 + index * 0.1 }}
                  >
                    {stat.value}
                  </motion.div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Growth and Activity Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Enrollment Growth
                </CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {stats.enrollmentGrowth > 0 ? '+' : ''}{stats.enrollmentGrowth}%
                </div>
                <p className="text-sm text-gray-600">
                  {stats.enrollmentsLast30Days} new enrollments
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-500" />
                  Published Courses
                </CardTitle>
                <CardDescription>Live courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {stats.publishedCourses}
                </div>
                <p className="text-sm text-gray-600">
                  {stats.draftCourses} drafts pending
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-500" />
                  Course Categories
                </CardTitle>
                <CardDescription>Content distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.categoryStats.slice(0, 3).map((category, index) => (
                    <div key={category.category} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{category.category}</span>
                      <Badge variant="secondary">{category.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions and Recent Activity */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common administrative tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button asChild className="w-full gradient-accent">
                    <Link href="/admin/courses">
                      Manage Courses
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/admin/users">
                      Manage Users
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/admin/courses/new">
                      Create New Course
                    </Link>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle>Recent Courses</CardTitle>
                <CardDescription>
                  Latest courses created
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentCourses.map((course, index) => (
                    <motion.div 
                      key={course.id} 
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      <div>
                        <p className="font-medium">{course.title}</p>
                        <p className="text-sm text-gray-600">
                          by {course.createdBy} • {course.enrollments} enrollments
                        </p>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/courses/${course.id}`}>
                            Edit
                          </Link>
                        </Button>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Enrollments */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle>Recent Enrollments</CardTitle>
              <CardDescription>
                Latest student enrollments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentEnrollments.map((enrollment, index) => (
                  <motion.div 
                    key={enrollment.id} 
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.1 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <div>
                      <p className="font-medium">{enrollment.userName}</p>
                      <p className="text-sm text-gray-600">
                        enrolled in {enrollment.courseTitle}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(enrollment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/courses/${enrollment.courseSlug}`}>
                        View Course
                      </Link>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}