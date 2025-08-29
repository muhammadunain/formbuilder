"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function FormLoading() {
  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900 items-center justify-center">
      <Card className="w-[600px] shadow-lg rounded-2xl">
        <CardHeader>
          <Skeleton className="h-6 w-40 mb-2" /> {/* Title */}
          <Skeleton className="h-4 w-60" />      {/* Subtitle */}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input fields skeletons */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />   {/* Label */}
            <Skeleton className="h-10 w-full rounded-md" /> {/* Input */}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />   
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />   
            <Skeleton className="h-20 w-full rounded-md" /> {/* Textarea */}
          </div>

          {/* Button skeleton */}
          <Skeleton className="h-10 w-full rounded-md" />
        </CardContent>
      </Card>
    </div>
  )
}
