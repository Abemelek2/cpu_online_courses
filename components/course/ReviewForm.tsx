"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

export function ReviewForm({ courseId }: { courseId: string }) {
  const [rating, setRating] = useState<string>('5')
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, rating: Number(rating), comment })
      })
      if (!res.ok) throw new Error('Failed to submit review')
      toast.success('Review submitted')
      setComment('')
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4 items-end">
        <div className="space-y-2">
          <Label>Rating</Label>
          <Select value={rating} onValueChange={setRating}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 - Excellent</SelectItem>
              <SelectItem value="4">4 - Good</SelectItem>
              <SelectItem value="3">3 - Average</SelectItem>
              <SelectItem value="2">2 - Poor</SelectItem>
              <SelectItem value="1">1 - Terrible</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="comment">Comment (optional)</Label>
          <Textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} rows={3} />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </div>
    </form>
  )
}

