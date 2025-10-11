'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'
import { Search, BookOpen, Play, Users, Clock, Award, CheckCircle, Star } from 'lucide-react'

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
  reviews: {
    id: string
    rating: number
  }[]
}

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for now - replace with actual API call
    const mockCourses: Course[] = [
      {
        id: '1',
        title: 'Introduction to Web Development',
        subtitle: 'Learn the basics of HTML, CSS, and JavaScript',
        description: 'A comprehensive course covering the fundamentals of web development.',
        thumbnailUrl: null,
        slug: 'introduction-to-web-development',
        status: 'PUBLISHED',
        level: 'BEGINNER',
        language: 'English',
        category: 'Programming',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdById: '1',
        sections: [
          {
            id: '1',
            title: 'Getting Started',
            lessons: [
              { id: '1', title: 'Introduction', slug: 'introduction', durationSec: 300, freePreview: true },
              { id: '2', title: 'Setting up your environment', slug: 'setup', durationSec: 600, freePreview: false }
            ]
          }
        ],
        enrollments: [{ id: '1' }, { id: '2' }],
        reviews: [{ id: '1', rating: 5 }, { id: '2', rating: 4 }]
      },
      {
        id: '2',
        title: 'Advanced React Patterns',
        subtitle: 'Master modern React development techniques',
        description: 'Deep dive into advanced React patterns and best practices.',
        thumbnailUrl: null,
        slug: 'advanced-react-patterns',
        status: 'PUBLISHED',
        level: 'INTERMEDIATE',
        language: 'English',
        category: 'Programming',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdById: '1',
        sections: [
          {
            id: '2',
            title: 'Advanced Hooks',
            lessons: [
              { id: '3', title: 'Custom Hooks', slug: 'custom-hooks', durationSec: 900, freePreview: true },
              { id: '4', title: 'Context API', slug: 'context-api', durationSec: 1200, freePreview: false }
            ]
          }
        ],
        enrollments: [{ id: '3' }, { id: '4' }, { id: '5' }],
        reviews: [{ id: '3', rating: 5 }, { id: '4', rating: 5 }]
      }
    ]
    
    setTimeout(() => {
      setCourses(mockCourses)
      setLoading(false)
    }, 1000)
  }, [])

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
            Loading courses...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Promotional Banner */}
      <motion.div 
        className="bg-gradient-to-r from-cyan-100 to-blue-100 py-3"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-800">New-learner offer | Courses from $9.99</span>
            <span className="text-xs text-gray-600">Ends in 5h 59m 40s</span>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-1 rounded-full">
            Click to redeem
          </Button>
        </div>
      </motion.div>

      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent"></div>
        </div>

        {/* Floating Geometric Shapes */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-xl"
          animate={{ 
            y: [0, -30, 0], 
            x: [0, 20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full blur-xl"
          animate={{ 
            y: [0, 30, 0], 
            x: [0, -20, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-20 h-20 bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-full blur-xl"
          animate={{ 
            y: [0, -20, 0], 
            x: [0, 15, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-center min-h-screen py-20">
            <div className="text-center max-w-6xl">
              {/* Main Hero Content */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
                  Master
                  <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                    CPU Architecture
                  </span>
                  <span className="block text-4xl md:text-5xl lg:text-6xl text-gray-300 font-light">
                    Like a Pro
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                  Learn from industry experts. Build real-world projects. Master microprocessors, 
                  computer architecture, and embedded systems with hands-on courses.
                </p>
              </motion.div>

              {/* Big Search Bar */}
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                <div className="relative max-w-4xl mx-auto">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-8 h-8" />
                  <input
                    type="text"
                    placeholder="Search for CPU courses, microprocessors, computer architecture..."
                    className="w-full pl-16 pr-32 py-6 text-xl border-2 border-white/20 rounded-2xl focus:ring-4 focus:ring-purple-500/50 focus:border-transparent bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 hover:bg-white/20 transition-all duration-300"
                  />
                  <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-2xl">
                    Search
                  </Button>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-6 rounded-2xl text-xl font-bold shadow-2xl">
                    <Link href="/catalog">Start Learning Now</Link>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button asChild variant="outline" size="lg" className="border-2 border-white/30 text-white hover:bg-white/10 px-12 py-6 rounded-2xl text-xl font-bold backdrop-blur-sm">
                    <Link href="/auth/signup">Free Trial</Link>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
              >
                {[
                  { number: "50K+", label: "Students Learning" },
                  { number: "200+", label: "Expert Courses" },
                  { number: "95%", label: "Success Rate" }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                  >
                    <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-300 text-lg">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Trending Courses */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trending Courses
            </h2>
            <p className="text-lg text-gray-600">
              What's hot in CPU and technology learning
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                title: "CPU Architecture Fundamentals",
                instructor: "Dr. Sarah Chen",
                rating: 4.9,
                students: 12500,
                price: "$89.99",
                image: "bg-gradient-to-br from-blue-500 to-purple-600",
                icon: "💻"
              },
              {
                title: "Advanced Microprocessors",
                instructor: "Prof. Michael Torres",
                rating: 4.8,
                students: 8900,
                price: "$129.99",
                image: "bg-gradient-to-br from-green-500 to-teal-600",
                icon: "⚡"
              },
              {
                title: "Parallel Processing Systems",
                instructor: "Dr. Lisa Wang",
                rating: 4.9,
                students: 6700,
                price: "$99.99",
                image: "bg-gradient-to-br from-orange-500 to-red-600",
                icon: "🔄"
              },
              {
                title: "CPU Optimization Techniques",
                instructor: "Alex Johnson",
                rating: 4.7,
                students: 11200,
                price: "$79.99",
                image: "bg-gradient-to-br from-purple-500 to-pink-600",
                icon: "🚀"
              }
            ].map((course, index) => (
              <motion.div
                key={course.title}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className={`w-full h-32 ${course.image} rounded-lg mb-4 flex items-center justify-center text-4xl`}>
                  {course.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{course.instructor}</p>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{course.rating}</span>
                    <span className="text-sm text-gray-500">({course.students.toLocaleString()})</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{course.price}</span>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
                  Enroll Now
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore by Category
            </h2>
            <p className="text-lg text-gray-600">
              Find the perfect course for your learning goals
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "CPU & Microprocessors",
                description: "Learn about processor architecture, design, and optimization",
                courses: 150,
                color: "from-blue-500 to-cyan-500",
                icon: "🖥️"
              },
              {
                title: "Computer Architecture",
                description: "Understand how computers work at the hardware level",
                courses: 89,
                color: "from-purple-500 to-pink-500",
                icon: "🏗️"
              },
              {
                title: "Parallel Computing",
                description: "Master multi-core processing and distributed systems",
                courses: 67,
                color: "from-green-500 to-emerald-500",
                icon: "⚡"
              },
              {
                title: "Embedded Systems",
                description: "Build and program microcontrollers and IoT devices",
                courses: 94,
                color: "from-orange-500 to-red-500",
                icon: "🔧"
              },
              {
                title: "Performance Optimization",
                description: "Optimize code and systems for maximum efficiency",
                courses: 76,
                color: "from-teal-500 to-blue-500",
                icon: "🚀"
              },
              {
                title: "Digital Design",
                description: "Create and implement digital circuits and systems",
                courses: 112,
                color: "from-indigo-500 to-purple-500",
                icon: "🔌"
              }
            ].map((category, index) => (
              <motion.div
                key={category.title}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{category.courses} courses</span>
                  <Button variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-50">
                    Explore
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Courses
            </h2>
            <p className="text-lg text-gray-600">
              Hand-picked courses from our top instructors
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Card className="overflow-hidden glass border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl">
                  <div className="aspect-video bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center relative overflow-hidden">
                    {course.thumbnailUrl ? (
                      <img 
                        src={course.thumbnailUrl} 
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    ) : (
                      <BookOpen className="w-16 h-16 text-orange-400" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold line-clamp-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2 text-gray-600">
                      {course.subtitle}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">4.8</span>
                        <span className="text-sm text-gray-500">(128)</span>
                      </div>
                      <Badge variant="secondary" className="rounded-xl">Free</Badge>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button asChild className="w-full gradient-accent rounded-xl h-12 text-base font-semibold">
                        <Link href={`/courses/${course.slug}`}>View Course</Link>
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button asChild size="lg" className="gradient-primary rounded-xl px-8 py-4 text-lg font-semibold">
                <Link href="/catalog">View All Courses</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 gradient-cool">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Why Choose Our Platform?
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎓",
                title: "Expert Instructors",
                description: "Learn from industry professionals with years of experience",
                gradient: "from-orange-100 to-pink-100"
              },
              {
                icon: "📚",
                title: "Comprehensive Content",
                description: "Access to thousands of courses across various topics and skill levels",
                gradient: "from-teal-100 to-cyan-100"
              },
              {
                icon: "🚀",
                title: "Learn at Your Pace",
                description: "Study whenever and wherever you want with our flexible platform",
                gradient: "from-purple-100 to-indigo-100"
              }
            ].map((feature, index) => (
              <motion.div 
                key={feature.title}
                className="text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <motion.div 
                  className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <span className="text-2xl">{feature.icon}</span>
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Start Learning Today
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Join over 100,000 students who are already advancing their careers with CPU Online Courses
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full">
                  <Link href="/catalog">Browse All Courses</Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg font-semibold rounded-full">
                  <Link href="/auth/signup">Get Started Free</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
