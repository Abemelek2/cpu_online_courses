import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Star, Users, Clock, Play, Award, BookOpen, Shield } from 'lucide-react'

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

async function getFeaturedCourses(): Promise<Course[]> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/courses/featured`, {
      cache: 'no-store' // Ensure fresh data
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch featured courses')
    }
    
    const data = await response.json()
    return data.courses || []
  } catch (error) {
    console.error('Error fetching featured courses:', error)
    return []
  }
}

export default async function HomePage() {
  // Fetch real featured courses
  const courses = await getFeaturedCourses()

  return (
    <div className="min-h-screen bg-white">
      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-cyan-100 to-blue-100 py-3">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-800">New-learner offer | Courses from $9.99</span>
            <span className="text-xs text-gray-600">Ends in 5h 59m 40s</span>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-1 rounded-full">
            Click to redeem
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent"></div>
        </div>

        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-center min-h-screen py-20">
            <div className="text-center max-w-6xl">
              {/* Main Hero Content */}
              <div>
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
              </div>

              {/* Big Search Bar */}
              <div className="mb-12">
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
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-6 rounded-2xl text-xl font-bold shadow-2xl">
                  <Link href="/catalog">Start Learning Now</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-2 border-white/30 text-white hover:bg-white/10 px-12 py-6 rounded-2xl text-xl font-bold backdrop-blur-sm">
                  <Link href="/auth/signup">Free Trial</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {[
                  { number: "50K+", label: "Students Learning" },
                  { number: "200+", label: "Expert Courses" },
                  { number: "95%", label: "Success Rate" }
                ].map((stat, index) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-300 text-lg">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Trending Courses */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trending CPU Courses</h2>
            <p className="text-xl text-gray-600">Most popular courses this week</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.slice(0, 6).map((course, index) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center relative">
                  <Play className="w-16 h-16 text-purple-600" />
                  <Badge className="absolute top-4 right-4 bg-purple-600 text-white">
                    {course.category}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2 text-lg">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {course.subtitle}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(course.stats.averageRating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {course.stats.averageRating} ({course.stats.enrollmentCount.toLocaleString()})
                        </span>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-purple-600">
                      ${(course.priceCents / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {course.stats.totalLessons} lessons
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {course.stats.enrollmentCount.toLocaleString()} students
                    </div>
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/courses/${course.slug}`}>
                      View Course
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore CPU Learning Paths</h2>
            <p className="text-xl text-gray-600">Structured learning tracks for every skill level</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Microprocessors', description: 'Learn the fundamentals of CPU design', icon: '🔧', color: 'from-blue-500 to-cyan-500' },
              { title: 'Assembly Language', description: 'Master low-level programming', icon: '⚡', color: 'from-purple-500 to-pink-500' },
              { title: 'Embedded Systems', description: 'Build real-world applications', icon: '🏗️', color: 'from-green-500 to-teal-500' },
              { title: 'Computer Architecture', description: 'Advanced system design concepts', icon: '🎯', color: 'from-orange-500 to-red-500' }
            ].map((category, index) => (
              <div key={category.title} className="group cursor-pointer">
                <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-3xl">{category.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                  <p className="text-gray-600">{category.description}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose CPU Online?</h2>
            <p className="text-xl text-gray-600">The best platform for mastering computer architecture</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Award, title: 'Expert Instructors', description: 'Learn from industry professionals with decades of experience' },
              { icon: BookOpen, title: 'Comprehensive Curriculum', description: 'From basics to advanced topics, structured learning paths' },
              { icon: Shield, title: 'Hands-on Projects', description: 'Build real-world applications and portfolio projects' }
            ].map((feature, index) => (
              <div key={feature.title} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Master CPU Architecture?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Join thousands of students already learning with our comprehensive courses and expert instructors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
              <Link href="/catalog">Browse All Courses</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg font-semibold">
              <Link href="/auth/signup">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}