'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2, GripVertical, Play, Upload, Clock, BookOpen, CheckCircle, Edit3 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface Lesson {
  id?: string
  title: string
  slug: string
  order: number
  videoUrl?: string
  durationSec?: number
  freePreview: boolean
}

interface Section {
  id?: string
  title: string
  order: number
  lessons: Lesson[]
}

interface CurriculumBuilderProps {
  courseSlug: string
  initialSections?: Section[]
  onSave?: (sections: Section[]) => void
}

export function CurriculumBuilder({ courseSlug, initialSections = [], onSave }: CurriculumBuilderProps) {
  const [sections, setSections] = useState<Section[]>(initialSections)
  const [isAddingSection, setIsAddingSection] = useState(false)
  const [isAddingLesson, setIsAddingLesson] = useState(false)
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)
  const [newSection, setNewSection] = useState({ title: '', order: 0 })
  const [newLesson, setNewLesson] = useState({
    title: '',
    slug: '',
    order: 0,
    videoUrl: '',
    durationSec: 0,
    freePreview: false
  })

  useEffect(() => {
    setSections(initialSections)
  }, [initialSections])

  const addSection = async () => {
    if (!newSection.title.trim()) {
      toast.error('Section title is required')
      return
    }

    try {
      const response = await fetch(`/api/courses/${courseSlug}/sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newSection.title,
          order: sections.length
        })
      })

      if (!response.ok) throw new Error('Failed to create section')

      const section = await response.json()
      setSections([...sections, { ...section, lessons: [] }])
      setNewSection({ title: '', order: 0 })
      setIsAddingSection(false)
      toast.success('Section created')
    } catch (error) {
      toast.error('Failed to create section')
    }
  }

  const addLesson = async () => {
    if (!newLesson.title.trim() || !newLesson.slug.trim()) {
      toast.error('Lesson title and slug are required')
      return
    }

    if (!selectedSectionId) {
      toast.error('Please select a section')
      return
    }

    try {
      const response = await fetch(`/api/courses/${courseSlug}/sections/${selectedSectionId}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newLesson.title,
          slug: newLesson.slug,
          order: sections.find(s => s.id === selectedSectionId)?.lessons.length || 0,
          videoUrl: newLesson.videoUrl,
          durationSec: newLesson.durationSec,
          freePreview: newLesson.freePreview
        })
      })

      if (!response.ok) throw new Error('Failed to create lesson')

      const lesson = await response.json()
      setSections(sections.map(section => 
        section.id === selectedSectionId 
          ? { ...section, lessons: [...section.lessons, lesson] }
          : section
      ))
      setNewLesson({
        title: '',
        slug: '',
        order: 0,
        videoUrl: '',
        durationSec: 0,
        freePreview: false
      })
      setIsAddingLesson(false)
      toast.success('Lesson created')
    } catch (error) {
      toast.error('Failed to create lesson')
    }
  }

  const uploadVideo = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'video')

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Upload failed')

      const { url } = await response.json()
      setNewLesson({ ...newLesson, videoUrl: url })
      toast.success('Video uploaded')
    } catch (error) {
      toast.error('Failed to upload video')
    }
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h3 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
            Curriculum Builder
          </h3>
          <p className="text-gray-600 mt-1">Create and organize your course content</p>
        </div>
        <div className="flex space-x-3">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Dialog open={isAddingSection} onOpenChange={setIsAddingSection}>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-xl">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Section
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl">Add Section</DialogTitle>
                  <DialogDescription>
                    Create a new section for your course
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="section-title" className="text-sm font-semibold">Section Title</Label>
                    <Input
                      id="section-title"
                      value={newSection.title}
                      onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                      placeholder="e.g., Getting Started"
                      className="rounded-xl mt-1"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddingSection(false)} className="rounded-xl">
                      Cancel
                    </Button>
                    <Button onClick={addSection} className="gradient-accent rounded-xl">
                      Add Section
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Dialog open={isAddingLesson} onOpenChange={setIsAddingLesson}>
              <DialogTrigger asChild>
                <Button className="gradient-accent rounded-xl">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Lesson
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl">Add Lesson</DialogTitle>
                  <DialogDescription>
                    Create a new lesson for your course
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold">Section</Label>
                    <Select value={selectedSectionId || ''} onValueChange={setSelectedSectionId}>
                      <SelectTrigger className="rounded-xl mt-1">
                        <SelectValue placeholder="Select a section" />
                      </SelectTrigger>
                      <SelectContent>
                        {sections.map((section) => (
                          <SelectItem key={section.id} value={section.id!}>
                            {section.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lesson-title" className="text-sm font-semibold">Lesson Title</Label>
                      <Input
                        id="lesson-title"
                        value={newLesson.title}
                        onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                        placeholder="e.g., Introduction to React"
                        className="rounded-xl mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lesson-slug" className="text-sm font-semibold">Lesson Slug</Label>
                      <Input
                        id="lesson-slug"
                        value={newLesson.slug}
                        onChange={(e) => setNewLesson({ ...newLesson, slug: e.target.value })}
                        placeholder="e.g., introduction-to-react"
                        className="rounded-xl mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="video-upload" className="text-sm font-semibold">Video Upload</Label>
                    <div className="mt-1">
                      <Input
                        id="video-upload"
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) uploadVideo(file)
                        }}
                        className="rounded-xl"
                      />
                      {newLesson.videoUrl && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-2 mt-2 text-sm text-green-600"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Video uploaded successfully
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="duration" className="text-sm font-semibold">Duration (seconds)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={newLesson.durationSec}
                        onChange={(e) => setNewLesson({ ...newLesson, durationSec: parseInt(e.target.value) || 0 })}
                        className="rounded-xl mt-1"
                      />
                    </div>
                    <div className="flex items-center space-x-2 mt-6">
                      <input
                        type="checkbox"
                        id="free-preview"
                        checked={newLesson.freePreview}
                        onChange={(e) => setNewLesson({ ...newLesson, freePreview: e.target.checked })}
                        className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                      />
                      <Label htmlFor="free-preview" className="text-sm font-semibold">Free Preview</Label>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddingLesson(false)} className="rounded-xl">
                      Cancel
                    </Button>
                    <Button onClick={addLesson} className="gradient-accent rounded-xl">
                      Add Lesson
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>
      </motion.div>

      {/* Sections */}
      <AnimatePresence>
        <div className="space-y-6">
          {sections.map((section, sectionIndex) => (
            <motion.div
              key={section.id || sectionIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4, delay: sectionIndex * 0.1 }}
              whileHover={{ scale: 1.01 }}
            >
              <Card className="glass border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <motion.div
                        whileHover={{ rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <GripVertical className="w-5 h-5 text-teal-600" />
                      </motion.div>
                      <span className="text-lg">{section.title}</span>
                      <Badge variant="secondary" className="rounded-xl">
                        {section.lessons.length} lessons
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Button variant="ghost" size="sm" className="rounded-xl">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 rounded-xl">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {section.lessons.map((lesson, lessonIndex) => (
                      <motion.div
                        key={lesson.id || lessonIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: lessonIndex * 0.05 }}
                        whileHover={{ x: 5, scale: 1.01 }}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center space-x-4">
                          <motion.div
                            whileHover={{ rotate: 5 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          >
                            <GripVertical className="w-4 h-4 text-gray-400" />
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          >
                            <Play className="w-5 h-5 text-teal-600" />
                          </motion.div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{lesson.title}</p>
                            <p className="text-sm text-gray-600">{lesson.slug}</p>
                          </div>
                          {lesson.freePreview && (
                            <Badge variant="outline" className="text-xs rounded-lg">
                              Free Preview
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>
                              {lesson.durationSec ? formatDuration(lesson.durationSec) : 'No duration'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Button variant="ghost" size="sm" className="rounded-xl">
                                <Edit3 className="w-4 h-4" />
                              </Button>
                            </motion.div>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 rounded-xl">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {section.lessons.length === 0 && (
                      <motion.div 
                        className="text-center py-8 text-gray-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="font-medium">No lessons in this section</p>
                        <p className="text-sm">Add your first lesson to get started</p>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          
          {sections.length === 0 && (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <BookOpen className="w-20 h-20 mx-auto text-gray-300 mb-6" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No sections created yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Add your first section to start building your curriculum and organize your course content
              </p>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  onClick={() => setIsAddingSection(true)} 
                  className="gradient-accent rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Section
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </AnimatePresence>
    </div>
  )
}
