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

  // Create CPU-themed tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'CPU Architecture' } }),
    prisma.tag.create({ data: { name: 'Microprocessors' } }),
    prisma.tag.create({ data: { name: 'Assembly Language' } }),
    prisma.tag.create({ data: { name: 'Embedded Systems' } }),
    prisma.tag.create({ data: { name: 'Computer Organization' } }),
    prisma.tag.create({ data: { name: 'ARM Processors' } }),
    prisma.tag.create({ data: { name: 'x86 Architecture' } }),
    prisma.tag.create({ data: { name: 'RISC-V' } }),
    prisma.tag.create({ data: { name: 'Microcontrollers' } }),
    prisma.tag.create({ data: { name: 'Digital Design' } }),
    prisma.tag.create({ data: { name: 'System Programming' } }),
    prisma.tag.create({ data: { name: 'Performance Optimization' } }),
  ])

  // Create comprehensive CPU-themed courses
  const courses = await Promise.all([
    // Course 1: Complete CPU Architecture Masterclass
    prisma.course.create({
      data: {
        slug: 'complete-cpu-architecture-masterclass',
        title: 'Complete CPU Architecture Masterclass',
        subtitle: 'From microprocessors to advanced computer systems',
        description: 'Master the fundamentals of CPU design, instruction sets, and computer architecture. Learn about modern processors, pipelining, caching, and performance optimization.',
        priceCents: 8999, // $89.99
        status: 'PUBLISHED',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
        category: 'Computer Architecture',
        level: 'Intermediate',
        language: 'English',
        createdById: instructors[0].id,
      },
    }),
    // Course 2: ARM Processor Fundamentals
    prisma.course.create({
      data: {
        slug: 'arm-processor-fundamentals',
        title: 'ARM Processor Fundamentals',
        subtitle: 'Learn ARM assembly and embedded systems programming',
        description: 'Comprehensive guide to ARM architecture, assembly language programming, and embedded systems development. Perfect for mobile and IoT development.',
        priceCents: 6999, // $69.99
        status: 'PUBLISHED',
        thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
        category: 'Embedded Systems',
        level: 'Beginner',
        language: 'English',
        createdById: instructors[1].id,
      },
    }),
    // Course 3: x86 Assembly Language Programming
    prisma.course.create({
      data: {
        slug: 'x86-assembly-language-programming',
        title: 'x86 Assembly Language Programming',
        subtitle: 'Master low-level programming and system optimization',
        description: 'Learn x86 assembly language from scratch. Understand registers, memory management, and system-level programming for maximum performance.',
        priceCents: 7999, // $79.99
        status: 'PUBLISHED',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
        category: 'Assembly Programming',
        level: 'Advanced',
        language: 'English',
        createdById: instructors[2].id,
      },
    }),
    // Course 4: Microcontroller Programming with Arduino
    prisma.course.create({
      data: {
        slug: 'microcontroller-programming-arduino',
        title: 'Microcontroller Programming with Arduino',
        subtitle: 'Build real-world embedded projects',
        description: 'Learn microcontroller programming using Arduino. Build IoT devices, sensors, and automation systems with hands-on projects.',
        priceCents: 4999, // $49.99
        status: 'PUBLISHED',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
        category: 'Microcontrollers',
        level: 'Beginner',
        language: 'English',
        createdById: instructors[3].id,
      },
    }),
    // Course 5: RISC-V Architecture and Implementation
    prisma.course.create({
      data: {
        slug: 'risc-v-architecture-implementation',
        title: 'RISC-V Architecture and Implementation',
        subtitle: 'Open-source processor design and development',
        description: 'Explore RISC-V open-source instruction set architecture. Learn processor design, verification, and implementation techniques.',
        priceCents: 9999, // $99.99
        status: 'PUBLISHED',
        thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
        category: 'Computer Architecture',
        level: 'Advanced',
        language: 'English',
        createdById: instructors[0].id,
      },
    }),
    // Course 6: Computer Organization and Design
    prisma.course.create({
      data: {
        slug: 'computer-organization-design',
        title: 'Computer Organization and Design',
        subtitle: 'Understanding how computers work at the hardware level',
        description: 'Deep dive into computer organization, memory hierarchy, I/O systems, and performance analysis. Essential for system programmers.',
        priceCents: 8999, // $89.99
        status: 'PUBLISHED',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
        category: 'Computer Organization',
        level: 'Intermediate',
        language: 'English',
        createdById: instructors[1].id,
      },
    }),
    // Course 7: Digital Design and FPGA Programming
    prisma.course.create({
      data: {
        slug: 'digital-design-fpga-programming',
        title: 'Digital Design and FPGA Programming',
        subtitle: 'Hardware design using Verilog and FPGAs',
        description: 'Learn digital circuit design using Verilog HDL and FPGA programming. Build custom processors and digital systems.',
        priceCents: 11999, // $119.99
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
        priceCents: 9999, // $99.99
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
        priceCents: 7999, // $79.99
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
        priceCents: 12999, // $129.99
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
        priceCents: 8999, // $89.99
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
        priceCents: 9999, // $99.99
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
    // Course 1: CPU Architecture
    { courseId: courses[0].id, tagId: tags[0].id }, // CPU Architecture
    { courseId: courses[0].id, tagId: tags[4].id }, // Computer Organization
    { courseId: courses[0].id, tagId: tags[11].id }, // Performance Optimization
    
    // Course 2: ARM Processors
    { courseId: courses[1].id, tagId: tags[5].id }, // ARM Processors
    { courseId: courses[1].id, tagId: tags[2].id }, // Assembly Language
    { courseId: courses[1].id, tagId: tags[3].id }, // Embedded Systems
    
    // Course 3: x86 Assembly
    { courseId: courses[2].id, tagId: tags[6].id }, // x86 Architecture
    { courseId: courses[2].id, tagId: tags[2].id }, // Assembly Language
    { courseId: courses[2].id, tagId: tags[10].id }, // System Programming
    
    // Course 4: Arduino
    { courseId: courses[3].id, tagId: tags[8].id }, // Microcontrollers
    { courseId: courses[3].id, tagId: tags[3].id }, // Embedded Systems
    { courseId: courses[3].id, tagId: tags[9].id }, // Digital Design
    
    // Course 5: RISC-V
    { courseId: courses[4].id, tagId: tags[7].id }, // RISC-V
    { courseId: courses[4].id, tagId: tags[0].id }, // CPU Architecture
    { courseId: courses[4].id, tagId: tags[9].id }, // Digital Design
    
    // Course 6: Computer Organization
    { courseId: courses[5].id, tagId: tags[4].id }, // Computer Organization
    { courseId: courses[5].id, tagId: tags[0].id }, // CPU Architecture
    { courseId: courses[5].id, tagId: tags[10].id }, // System Programming
    
    // Course 7: Digital Design
    { courseId: courses[6].id, tagId: tags[9].id }, // Digital Design
    { courseId: courses[6].id, tagId: tags[1].id }, // Microprocessors
    { courseId: courses[6].id, tagId: tags[0].id }, // CPU Architecture
    
    // Course 8: System Programming
    { courseId: courses[7].id, tagId: tags[10].id }, // System Programming
    { courseId: courses[7].id, tagId: tags[4].id }, // Computer Organization
    { courseId: courses[7].id, tagId: tags[11].id }, // Performance Optimization
    
    // Course 9: Performance Optimization
    { courseId: courses[8].id, tagId: tags[11].id }, // Performance Optimization
    { courseId: courses[8].id, tagId: tags[0].id }, // CPU Architecture
    { courseId: courses[8].id, tagId: tags[10].id }, // System Programming
    
    // Course 10: Advanced Microprocessor
    { courseId: courses[9].id, tagId: tags[1].id }, // Microprocessors
    { courseId: courses[9].id, tagId: tags[0].id }, // CPU Architecture
    { courseId: courses[9].id, tagId: tags[11].id }, // Performance Optimization
    
    // Course 11: Embedded Linux
    { courseId: courses[10].id, tagId: tags[3].id }, // Embedded Systems
    { courseId: courses[10].id, tagId: tags[10].id }, // System Programming
    { courseId: courses[10].id, tagId: tags[8].id }, // Microcontrollers
    
    // Course 12: Parallel Processing
    { courseId: courses[11].id, tagId: tags[0].id }, // CPU Architecture
    { courseId: courses[11].id, tagId: tags[11].id }, // Performance Optimization
    { courseId: courses[11].id, tagId: tags[10].id }, // System Programming
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
  const enrollments = []
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
                positionSec: lesson.durationSec,
              },
            })
          } else if (Math.random() < 0.2) { // 20% chance to partially complete
            await prisma.progress.create({
              data: {
                userId: enrollment.userId,
                lessonId: lesson.id,
                completed: false,
                positionSec: Math.floor(lesson.durationSec * Math.random()),
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
