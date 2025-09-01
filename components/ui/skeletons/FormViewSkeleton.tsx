"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function FormViewSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-6">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />  {/* Form title */}
            <Skeleton className="h-5 w-80 mx-auto" />       {/* Form description */}
          </CardHeader>
          
          <CardContent className="space-y-6 px-8 pb-8">
            {/* Form Fields Skeleton */}
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-32" />            {/* Field label */}
                <Skeleton className="h-10 w-full rounded-md" /> {/* Input field */}
              </div>
            ))}

            {/* Special field types */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />              {/* Label */}
              <Skeleton className="h-20 w-full rounded-md" /> {/* Textarea */}
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />              {/* Label */}
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <Skeleton className="w-4 h-4 rounded" />  {/* Checkbox */}
                    <Skeleton className="h-4 w-32" />         {/* Option text */}
                  </div>
                ))}
              </div>
            </div>

            {/* E-signature field skeleton */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-36" />              {/* Label */}
              <div className="border-2 border-dashed rounded-lg h-40 bg-blue-50 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Skeleton className="w-8 h-8 rounded-full mx-auto" /> {/* Icon */}
                  <Skeleton className="h-4 w-24 mx-auto" />             {/* Text */}
                </div>
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-8 flex-1" />          {/* Action button */}
                <Skeleton className="h-8 flex-1" />          {/* Action button */}
                <Skeleton className="h-8 flex-1" />          {/* Action button */}
              </div>
            </div>

            {/* Submit button */}
            <Skeleton className="h-12 w-full rounded-md" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}