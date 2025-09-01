"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function FormBuilderSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header Bar Skeleton */}
      <div className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Side */}
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-16" /> {/* Back button */}
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <Skeleton className="h-5 w-32 mb-1" /> {/* Form title */}
                <Skeleton className="h-4 w-24" />      {/* Subtitle */}
              </div>
            </div>

            {/* Right Side - Action Buttons */}
            <div className="flex items-center space-x-3">
              <Skeleton className="h-8 w-16" /> {/* Save */}
              <Skeleton className="h-8 w-20" /> {/* Preview */}
              <Skeleton className="h-8 w-16" /> {/* Live */}
              <Skeleton className="h-8 w-16" /> {/* Share */}
              <Skeleton className="h-8 w-20" /> {/* Publish */}
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar Skeleton */}
        <div className="w-80 border-r bg-white h-[calc(100vh-80px)]">
          <div className="p-6">
            <div className="mb-6">
              <Skeleton className="h-4 w-24 mb-4" /> {/* Title */}
              <Skeleton className="h-3 w-48 mb-4" /> {/* Description */}
            </div>

            <div className="space-y-3">
              {/* Form Elements Skeleton */}
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 rounded-xl border bg-gray-50">
                  <Skeleton className="w-8 h-8 rounded-lg" /> {/* Icon */}
                  <Skeleton className="h-4 flex-1" />          {/* Label */}
                  <Skeleton className="w-4 h-4" />             {/* Plus icon */}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Form Preview Skeleton */}
        <div className="flex-1 bg-gray-50 h-[calc(100vh-80px)] overflow-y-auto">
          <div className="p-8">
            <div className="max-w-3xl mx-auto mt-8">
              <Card className="shadow-xl border-0 bg-white">
                <CardHeader className="text-center pb-8 pt-8">
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-64 mx-auto" />  {/* Form title */}
                    <Skeleton className="h-5 w-80 mx-auto" />  {/* Form description */}
                  </div>
                </CardHeader>
                
                <CardContent className="px-8 pb-8">
                  {/* Empty state skeleton */}
                  <div className="text-center py-16 border-2 border-dashed rounded-xl bg-gray-50/50">
                    <div className="space-y-4">
                      <Skeleton className="w-16 h-16 rounded-full mx-auto" /> {/* Plus icon */}
                      <div>
                        <Skeleton className="h-5 w-48 mx-auto mb-2" />        {/* Title */}
                        <Skeleton className="h-4 w-64 mx-auto" />             {/* Description */}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}