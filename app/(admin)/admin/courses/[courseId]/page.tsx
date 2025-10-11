"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import ClientImage from '@/components/ClientImage'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CurriculumBuilder } from '@/components/admin/CurriculumBuilder'
import { toast } from 'sonner'

export default function EditCoursePage() {
  const params = useParams<{ courseId: string }>()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [course, setCourse] = useState<any>(null)

  useEffect(() => {
    if (!params?.courseId) return
    fetchCourse()
  }, [params?.courseId])

  async function fetchCourse() {
    try {
      // First get course by ID to get the slug
      const courseRes = await fetch(`/api/courses`)
      if (!courseRes.ok) throw new Error('Failed to fetch courses')
      const courses = await courseRes.json()
      const course = courses.find((c: any) => c.id === params.courseId)
      
      if (!course) throw new Error('Course not found')
      
      // Then fetch full course data by slug
      const res = await fetch(`/api/courses/${course.slug}`)
      if (!res.ok) throw new Error('Failed to fetch course')
      const data = await res.json()
      setCourse(data)
    } catch (err: any) {
      toast.error(err.message || 'Failed to load course')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      setIsSaving(true)

      let thumbnailUrl = course.thumbnailUrl || ''
      if (thumbnailFile) {
        const uploadData = new FormData()
        uploadData.append('file', thumbnailFile)
        uploadData.append('type', 'thumbnail')
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData })
        const { url } = await uploadRes.json()
        thumbnailUrl = url
      }

      const payload = {
        title: formData.get('title'),
        subtitle: formData.get('subtitle'),
        description: formData.get('description'),
        category: formData.get('category'),
        level: formData.get('level'),
        language: formData.get('language'),
        status: formData.get('status') || 'DRAFT',
        thumbnailUrl,
      }

      const res = await fetch(`/api/courses/${course.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error('Failed to save course')

      toast.success('Course saved')
      router.push('/admin/courses')
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading course...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course not found</h1>
          <Button onClick={() => router.push('/admin/courses')}>Back to Courses</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="curriculum">Content</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Edit Course</CardTitle>
                <CardDescription>Update course details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" defaultValue={course.title} required />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input defaultValue={course.slug} disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input id="subtitle" name="subtitle" defaultValue={course.subtitle || ''} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={4} defaultValue={course.description || ''} />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input name="category" defaultValue={course.category || ''} />
                </div>
                <div className="space-y-2">
                  <Label>Level</Label>
                  <Select name="level" defaultValue={course.level || undefined}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Input name="language" defaultValue={course.language || ''} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail</Label>
                  <Input id="thumbnail" type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
                  <div className="mt-2">
                    <ClientImage src={course.thumbnailUrl} alt="Thumbnail" className="w-48 rounded" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select name="status" defaultValue={course.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        </TabsContent>
        
        <TabsContent value="curriculum">
          <Card>
            <CardHeader>
              <CardTitle>Course Curriculum</CardTitle>
              <CardDescription>Manage sections and lessons</CardDescription>
            </CardHeader>
            <CardContent>
              {course && (
                <CurriculumBuilder 
                  courseSlug={course.slug} 
                  initialSections={course.sections || []}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
