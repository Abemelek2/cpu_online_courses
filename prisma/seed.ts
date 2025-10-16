import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting comprehensive CPU course platform seed...')

  // Clear existing data
  await prisma.progress.deleteMany()
  await prisma.enrollment.deleteMany()
  await prisma.review.deleteMany()
  await prisma.courseTag.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.section.deleteMany()
  await prisma.course.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.user.deleteMany()

  // Create instructor users
  const instructorPassword = await bcrypt.hash('instructor123', 12)
  
  const instructors = await Promise.all([
    prisma.user.create({
      data: {
        email: 'sarah.chen@cpuonline.com',
        name: 'Dr. Sarah Chen',
        password: instructorPassword,
        role: 'ADMIN',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      },
    }),
    prisma.user.create({
      data: {
        email: 'michael.rodriguez@cpuonline.com',
        name: 'Prof. Michael Rodriguez',
        password: instructorPassword,
        role: 'ADMIN',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      },
    }),
    prisma.user.create({
      data: {
        email: 'alex.thompson@cpuonline.com',
        name: 'Dr. Alex Thompson',
        password: instructorPassword,
        role: 'ADMIN',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      },
    }),
    prisma.user.create({
      data: {
        email: 'lisa.wang@cpuonline.com',
        name: 'Dr. Lisa Wang',
        password: instructorPassword,
        role: 'ADMIN',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      },
    }),
  ])

  // Create student users
  const studentPassword = await bcrypt.hash('student123', 12)
  
  const students = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john.doe@student.com',
        name: 'John Doe',
        password: studentPassword,
        role: 'STUDENT',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      },
    }),
    prisma.user.create({
      data: {
        email: 'jane.smith@student.com',
        name: 'Jane Smith',
        password: studentPassword,
        role: 'STUDENT',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      },
    }),
    prisma.user.create({
      data: {
        email: 'mike.johnson@student.com',
        name: 'Mike Johnson',
        password: studentPassword,
        role: 'STUDENT',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      },
    }),
    prisma.user.create({
      data: {
        email: 'sarah.wilson@student.com',
        name: 'Sarah Wilson',
        password: studentPassword,
        role: 'STUDENT',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      },
    }),
    prisma.user.create({
      data: {
        email: 'david.brown@student.com',
        name: 'David Brown',
        password: studentPassword,
        role: 'STUDENT',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      },
    }),
    prisma.user.create({
      data: {
        email: 'emma.davis@student.com',
        name: 'Emma Davis',
        password: studentPassword,
        role: 'STUDENT',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      },
    }),
    prisma.user.create({
      data: {
        email: 'james.miller@student.com',
        name: 'James Miller',
        password: studentPassword,
        role: 'STUDENT',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      },
    }),
    prisma.user.create({
      data: {
        email: 'lisa.garcia@student.com',
        name: 'Lisa Garcia',
        password: studentPassword,
        role: 'STUDENT',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      },
    }),
  ])

  // Create a broader Computer Science tag set
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'Algorithms' } }),
    prisma.tag.create({ data: { name: 'Data Structures' } }),
    prisma.tag.create({ data: { name: 'Operating Systems' } }),
    prisma.tag.create({ data: { name: 'Databases' } }),
    prisma.tag.create({ data: { name: 'Machine Learning' } }),
    prisma.tag.create({ data: { name: 'Web Development' } }),
    prisma.tag.create({ data: { name: 'Computer Networks' } }),
    prisma.tag.create({ data: { name: 'Security' } }),
    prisma.tag.create({ data: { name: 'Compilers' } }),
    prisma.tag.create({ data: { name: 'Software Engineering' } }),
    prisma.tag.create({ data: { name: 'Datapaths & Architecture' } }),
    prisma.tag.create({ data: { name: 'Embedded Systems' } }),
  ])

  // Create a diverse set of computer science courses
  const courses = await Promise.all([
    prisma.course.create({
      data: {
        slug: 'introduction-to-algorithms',
        title: 'Introduction to Algorithms',
        subtitle: 'Core algorithms and problem-solving techniques',
        description: 'Covers sorting, searching, graph algorithms, dynamic programming, and algorithmic analysis (Big-O). Designed for both beginners and those preparing for interviews.',
        priceCents: 0,
        status: 'PUBLISHED',
        thumbnailUrl: 'https://images.unsplash.com/photo-1526378724496-4f9f3b4a6adf?w=400&h=300&fit=crop',
        category: 'Algorithms',
        level: 'Intermediate',
        language: 'English',
        createdById: instructors[0].id,
      }
    }),
    prisma.course.create({
      data: {
        slug: 'data-structures-and-design',
        title: 'Data Structures & Design',
        subtitle: 'Essential data structures and when to use them',
        description: 'Arrays, linked lists, trees, heaps, hash maps, and design patterns for building efficient systems.',
        priceCents: 0,
        status: 'PUBLISHED',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
        category: 'Data Structures',
        level: 'Beginner',
        language: 'English',
        createdById: instructors[1].id,
      }
    }),
    prisma.course.create({
      data: {
        slug: 'operating-systems-principles',
        title: 'Operating Systems Principles',
        subtitle: 'Concurrency, memory management, and kernel internals',
        description: 'Study process management, scheduling, virtual memory, file systems, and kernel architecture. Hands-on with small OS projects.',
        priceCents: 0,
        status: 'PUBLISHED',
        thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
        category: 'Operating Systems',
        level: 'Advanced',
        language: 'English',
        createdById: instructors[2].id,
      }
    }),
    prisma.course.create({
      data: {
        slug: 'database-systems',
        title: 'Database Systems',
        subtitle: 'Relational databases, SQL, and indexing',
        description: 'Design and implement schemas, learn SQL, transactions, indexing, and basic query optimization.',
        priceCents: 0,
        status: 'PUBLISHED',
        thumbnailUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop',
        category: 'Databases',
        level: 'Intermediate',
        language: 'English',
        createdById: instructors[3].id,
      }
    }),
    prisma.course.create({
      data: {
        slug: 'machine-learning-basics',
        title: 'Machine Learning Basics',
        subtitle: 'Supervised and unsupervised learning fundamentals',
        description: 'Covers linear models, SVMs, decision trees, clustering, and an introduction to neural networks and model evaluation.',
        priceCents: 0,
        status: 'PUBLISHED',
        thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
        category: 'Machine Learning',
        level: 'Beginner',
        language: 'English',
        createdById: instructors[0].id,
      }
    }),
    prisma.course.create({
      data: {
        slug: 'web-development-fullstack',
        title: 'Web Development — Full Stack',
        subtitle: 'Frontend, backend, and deployment basics',
        description: 'Build modern web apps with React/Next.js, Node.js, APIs, and deployment best practices.',
        priceCents: 0,
        status: 'PUBLISHED',
        thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
        category: 'Web Development',
        level: 'Beginner',
        language: 'English',
        createdById: instructors[1].id,
      }
    }),
    prisma.course.create({
      data: {
        slug: 'computer-networks',
        title: 'Computer Networks',
        subtitle: 'Networking fundamentals, TCP/IP, and sockets',
        description: 'Cover network layers, protocols, routing, and practical socket programming exercises.',
        priceCents: 0,
        status: 'PUBLISHED',
        thumbnailUrl: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=400&h=300&fit=crop',
        category: 'Computer Networks',
        level: 'Intermediate',
        language: 'English',
        createdById: instructors[2].id,
      }
    }),
    prisma.course.create({
      data: {
        slug: 'cybersecurity-fundamentals',
        title: 'Cybersecurity Fundamentals',
        subtitle: 'Security principles, threat modelling and mitigation',
        description: 'Introductory security course covering cryptography basics, security models, common vulnerabilities, and secure coding practices.',
        priceCents: 0,
        status: 'PUBLISHED',
        thumbnailUrl: 'https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?w=400&h=300&fit=crop',
        category: 'Security',
        level: 'Intermediate',
        language: 'English',
        createdById: instructors[3].id,
      }
    }),
    // Keep a CPU architecture course included as part of the broader catalog
    prisma.course.create({
      data: {
        slug: 'cpu-architecture-essentials',
        title: 'CPU Architecture Essentials',
        subtitle: 'Key concepts in modern processor design',
        description: 'Covers instruction sets, pipelining, caches, and microarchitecture tradeoffs. Included as part of core CS curriculum.',
        priceCents: 0,
        status: 'PUBLISHED',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
        category: 'Computer Architecture',
        level: 'Intermediate',
        language: 'English',
        createdById: instructors[0].id,
      }
    }),
    // Course 7: Digital Design and FPGA Programming
    prisma.course.create({
      data: {
        slug: 'digital-design-fpga-programming',
        title: 'Digital Design and FPGA Programming',
        subtitle: 'Hardware design using Verilog and FPGAs',
        description: 'Learn digital circuit design using Verilog HDL and FPGA programming. Build custom processors and digital systems.',
  priceCents: 0, // Free
        status: 'PUBLISHED',
        thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
        category: 'Digital Design',
        level: 'Advanced',
        language: 'English',
        createdById: instructors[2].id,
      },
    }),
    // Course 8: System Programming and OS Internals
    prisma.course.create({
      data: {
        slug: 'system-programming-os-internals',
        title: 'System Programming and OS Internals',
        subtitle: 'Low-level programming and operating system concepts',
        description: 'Master system programming, kernel development, and operating system internals. Learn about processes, threads, and memory management.',
  priceCents: 0, // Free
        status: 'PUBLISHED',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
        category: 'System Programming',
        level: 'Advanced',
        language: 'English',
        createdById: instructors[3].id,
      },
    }),
    // Course 9: Performance Optimization and Profiling
    prisma.course.create({
      data: {
        slug: 'performance-optimization-profiling',
        title: 'Performance Optimization and Profiling',
        subtitle: 'Maximize system performance through optimization',
        description: 'Learn advanced performance optimization techniques, profiling tools, and benchmarking. Optimize both hardware and software performance.',
  priceCents: 0, // Free
        status: 'PUBLISHED',
        thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
        category: 'Performance Optimization',
        level: 'Intermediate',
        language: 'English',
        createdById: instructors[0].id,
      },
    }),
    // Course 10: Advanced Microprocessor Design
    prisma.course.create({
      data: {
        slug: 'advanced-microprocessor-design',
        title: 'Advanced Microprocessor Design',
        subtitle: 'Design and implement custom processors',
        description: 'Advanced course covering pipelining, superscalar processors, branch prediction, and out-of-order execution. For serious hardware engineers.',
  priceCents: 0, // Free
        status: 'PUBLISHED',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
        category: 'Microprocessors',
        level: 'Expert',
        language: 'English',
        createdById: instructors[1].id,
      },
    }),
    // Course 11: Embedded Linux Systems
    prisma.course.create({
      data: {
        slug: 'embedded-linux-systems',
        title: 'Embedded Linux Systems',
        subtitle: 'Linux kernel development for embedded devices',
        description: 'Learn embedded Linux development, kernel customization, device drivers, and real-time systems programming.',
  priceCents: 0, // Free
        status: 'PUBLISHED',
        thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
        category: 'Embedded Systems',
        level: 'Advanced',
        language: 'English',
        createdById: instructors[2].id,
      },
    }),
    // Course 12: Parallel Processing and Multi-Core Systems
    prisma.course.create({
      data: {
        slug: 'parallel-processing-multicore-systems',
        title: 'Parallel Processing and Multi-Core Systems',
        subtitle: 'Programming and optimizing multi-core processors',
        description: 'Master parallel programming, multi-threading, GPU computing, and distributed systems. Essential for modern high-performance computing.',
  priceCents: 0, // Free
        status: 'PUBLISHED',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
        category: 'Computer Architecture',
        level: 'Advanced',
        language: 'English',
        createdById: instructors[3].id,
      },
    }),
  ])

  // Create course tags
  const courseTags = [
    // Course 0: Introduction to Algorithms
    { courseId: courses[0].id, tagId: tags[0].id }, // Algorithms
    { courseId: courses[0].id, tagId: tags[1].id }, // Data Structures

    // Course 1: Data Structures & Design
    { courseId: courses[1].id, tagId: tags[1].id }, // Data Structures
    { courseId: courses[1].id, tagId: tags[9].id }, // Software Engineering

    // Course 2: Operating Systems Principles
    { courseId: courses[2].id, tagId: tags[2].id }, // Operating Systems
    { courseId: courses[2].id, tagId: tags[10].id }, // Datapaths & Architecture

    // Course 3: Database Systems
    { courseId: courses[3].id, tagId: tags[3].id }, // Databases
    { courseId: courses[3].id, tagId: tags[9].id }, // Software Engineering

    // Course 4: Machine Learning Basics
    { courseId: courses[4].id, tagId: tags[4].id }, // Machine Learning
    { courseId: courses[4].id, tagId: tags[1].id }, // Data Structures

    // Course 5: Web Development — Full Stack
    { courseId: courses[5].id, tagId: tags[5].id }, // Web Development
    { courseId: courses[5].id, tagId: tags[9].id }, // Software Engineering

    // Course 6: Computer Networks
    { courseId: courses[6].id, tagId: tags[6].id }, // Computer Networks
    { courseId: courses[6].id, tagId: tags[9].id }, // Software Engineering

    // Course 7: Cybersecurity Fundamentals
    { courseId: courses[7].id, tagId: tags[7].id }, // Security
    { courseId: courses[7].id, tagId: tags[9].id }, // Software Engineering

    // Course 8: CPU Architecture Essentials
    { courseId: courses[8].id, tagId: tags[10].id }, // Datapaths & Architecture
    { courseId: courses[8].id, tagId: tags[11].id }, // Embedded Systems
  ]

  await prisma.courseTag.createMany({ data: courseTags })

  // Create sections and lessons for each course
  for (let i = 0; i < courses.length; i++) {
    const course = courses[i]
    const instructor = instructors[i % instructors.length]
    
    // Create 3-5 sections per course
    const sections = await Promise.all([
      prisma.section.create({
        data: {
          title: 'Introduction and Fundamentals',
          order: 1,
          courseId: course.id,
        },
      }),
      prisma.section.create({
        data: {
          title: 'Core Concepts and Theory',
          order: 2,
          courseId: course.id,
        },
      }),
      prisma.section.create({
        data: {
          title: 'Practical Implementation',
          order: 3,
          courseId: course.id,
        },
      }),
      prisma.section.create({
        data: {
          title: 'Advanced Topics and Optimization',
          order: 4,
          courseId: course.id,
        },
      }),
      prisma.section.create({
        data: {
          title: 'Real-World Applications',
          order: 5,
          courseId: course.id,
        },
      }),
    ])

    // Create 4-8 lessons per section
    for (let j = 0; j < sections.length; j++) {
      const section = sections[j]
      const lessonsPerSection = Math.floor(Math.random() * 5) + 4 // 4-8 lessons
      
      for (let k = 0; k < lessonsPerSection; k++) {
        await prisma.lesson.create({
          data: {
            title: `Lesson ${k + 1}: ${getLessonTitle(course.title, j, k)}`,
            slug: `lesson-${j + 1}-${k + 1}-${course.slug}`,
            order: k + 1,
            videoUrl: `https://example.com/videos/${course.slug}/lesson-${j + 1}-${k + 1}.mp4`,
            durationSec: Math.floor(Math.random() * 900) + 300, // 5-20 minutes
            freePreview: k === 0, // First lesson is free preview
            sectionId: section.id,
          },
        })
      }
    }
  }

  // Create enrollments (20-30 enrollments across different users and courses)
  const enrollments: { userId: string; courseId: string }[] = []
  for (let i = 0; i < 25; i++) {
    const student = students[Math.floor(Math.random() * students.length)]
    const course = courses[Math.floor(Math.random() * courses.length)]
    
    // Check if enrollment already exists
    const existingEnrollment = enrollments.find(
      e => e.userId === student.id && e.courseId === course.id
    )
    
    if (!existingEnrollment) {
      enrollments.push({
        userId: student.id,
        courseId: course.id,
      })
    }
  }

  await prisma.enrollment.createMany({ data: enrollments })

  // Create progress for enrolled students
  for (const enrollment of enrollments) {
    const course = courses.find(c => c.id === enrollment.courseId)
    if (course) {
      const sections = await prisma.section.findMany({
        where: { courseId: course.id },
        include: { lessons: true },
      })
      
      // Randomly complete some lessons
      for (const section of sections) {
        for (const lesson of section.lessons) {
          if (Math.random() < 0.3) { // 30% chance to complete each lesson
            await prisma.progress.create({
              data: {
                userId: enrollment.userId,
                lessonId: lesson.id,
                completed: true,
                  positionSec: lesson.durationSec ?? undefined,
              },
            })
            } else if (Math.random() < 0.2) { // 20% chance to partially complete
            await prisma.progress.create({
              data: {
                userId: enrollment.userId,
                lessonId: lesson.id,
                completed: false,
                  positionSec: lesson.durationSec ? Math.floor(lesson.durationSec * Math.random()) : undefined,
              },
            })
          }
        }
      }
    }
  }

  // Create reviews (15-25 reviews with ratings 4.5-5.0 stars)
  const reviewComments = [
    'Excellent course! Very well explained and comprehensive.',
    'Great instructor, clear explanations, and practical examples.',
    'Perfect for beginners. Step-by-step approach made it easy to follow.',
    'Advanced concepts explained in simple terms. Highly recommended!',
    'Real-world examples and hands-on projects made learning engaging.',
    'Instructor is knowledgeable and responsive to questions.',
    'Well-structured curriculum with excellent pacing.',
    'Practical skills that I can apply immediately in my work.',
    'Comprehensive coverage of the topic. Worth every penny!',
    'Clear explanations and good use of visual aids.',
    'Challenging but rewarding. Great for skill development.',
    'Excellent course materials and supplementary resources.',
    'Instructor explains complex concepts very clearly.',
    'Good balance of theory and practical application.',
    'Highly recommend this course to anyone interested in the topic.',
  ]

  // Create unique review combinations to avoid constraint violations
  const reviewCombinations = new Set<string>()
  let reviewCount = 0
  const maxReviews = 20

  while (reviewCount < maxReviews) {
    const student = students[Math.floor(Math.random() * students.length)]
    const course = courses[Math.floor(Math.random() * courses.length)]
    const combination = `${student.id}-${course.id}`
    
    if (!reviewCombinations.has(combination)) {
      reviewCombinations.add(combination)
      const rating = Math.random() < 0.8 ? 5 : 4 // 80% chance of 5 stars
      const comment = reviewComments[Math.floor(Math.random() * reviewComments.length)]
      
      await prisma.review.create({
        data: {
          userId: student.id,
          courseId: course.id,
          rating,
          comment,
          status: 'VISIBLE',
        },
      })
      reviewCount++
    }
  }

  console.log('🎉 Comprehensive CPU course platform seed completed!')
  console.log(`👥 Created ${instructors.length} instructors and ${students.length} students`)
  console.log(`📚 Created ${courses.length} CPU-themed courses`)
  console.log(`🏷️  Created ${tags.length} course tags`)
  console.log(`📝 Created ${enrollments.length} enrollments`)
  console.log(`⭐ Created 20 reviews`)
  console.log('')
  console.log('🔑 Login credentials:')
  console.log('Instructors: instructor123')
  console.log('Students: student123')
  console.log('')
  console.log('📧 Sample instructor emails:')
  instructors.forEach(instructor => console.log(`  - ${instructor.email}`))
  console.log('')
  console.log('📧 Sample student emails:')
  students.slice(0, 3).forEach(student => console.log(`  - ${student.email}`))
}

// Helper function to generate lesson titles
function getLessonTitle(courseTitle: string, sectionIndex: number, lessonIndex: number): string {
  const lessonTemplates = [
    'Introduction and Overview',
    'Basic Concepts and Terminology',
    'Fundamental Principles',
    'Core Theory and Background',
    'Practical Examples and Applications',
    'Hands-on Implementation',
    'Advanced Techniques and Methods',
    'Optimization and Best Practices',
    'Real-world Case Studies',
    'Troubleshooting and Debugging',
    'Performance Analysis',
    'Integration and Deployment',
  ]
  
  return lessonTemplates[lessonIndex % lessonTemplates.length]
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
