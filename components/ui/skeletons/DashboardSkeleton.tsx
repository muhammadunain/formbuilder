"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />  {/* Title */}
          <Skeleton className="h-5 w-64" />       {/* Subtitle */}
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />  {/* Label */}
                    <Skeleton className="h-8 w-16" />       {/* Number */}
                  </div>
                  <Skeleton className="w-8 h-8 rounded" />  {/* Icon */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Forms Section Skeleton */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <Skeleton className="h-6 w-32 mb-2" />  {/* Title */}
              <Skeleton className="h-4 w-48" />       {/* Description */}
            </div>
            <Skeleton className="h-10 w-32" />        {/* Create button */}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Form Cards Skeleton */}
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Skeleton className="h-5 w-48" />      {/* Form title */}
                      <Skeleton className="h-5 w-16 rounded-full" /> {/* Status badge */}
                    </div>
                    <Skeleton className="h-4 w-32" />        {/* Date */}
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-12" />        {/* Edit */}
                    <Skeleton className="h-8 w-16" />        {/* Live */}
                    <Skeleton className="h-8 w-20" />        {/* Responses */}
                    <Skeleton className="h-8 w-12" />        {/* Share */}
                    <Skeleton className="h-8 w-16" />        {/* Unpublish */}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}