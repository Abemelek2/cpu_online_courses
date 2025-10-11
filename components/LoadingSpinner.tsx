import { Skeleton } from '@/components/ui/skeleton'

export function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Loading...</p>
      </div>
    </div>
  )
}

export function CourseCardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-video w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  )
}

export function LessonSkeleton() {
  return (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
      <Skeleton className="w-4 h-4 rounded-full" />
      <Skeleton className="w-4 h-4 rounded-full" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <Skeleton className="h-4 w-12" />
    </div>
  )
}

