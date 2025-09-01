"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ResponsesSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Skeleton className="h-8 w-16" />        {/* Back button */}
            <Skeleton className="h-6 w-48" />        {/* Form title */}
          </div>
          <Skeleton className="h-5 w-64" />          {/* Description */}
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-20 mb-2" />  {/* Label */}
                <Skeleton className="h-6 w-12" />       {/* Number */}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Responses Table Skeleton */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-6 w-32 mb-2" />  {/* Title */}
                <Skeleton className="h-4 w-48" />       {/* Description */}
              </div>
              <Skeleton className="h-10 w-24" />        {/* Export button */}
            </div>
          </CardHeader>
          <CardContent>
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 p-4 border-b bg-gray-50 rounded-t-lg">
              <Skeleton className="h-4 w-16" />         {/* Column 1 */}
              <Skeleton className="h-4 w-20" />         {/* Column 2 */}
              <Skeleton className="h-4 w-24" />         {/* Column 3 */}
              <Skeleton className="h-4 w-12" />         {/* Column 4 */}
            </div>

            {/* Table Rows */}
            <div className="space-y-0">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 p-4 border-b hover:bg-gray-50">
                  <Skeleton className="h-4 w-full" />    {/* Data 1 */}
                  <Skeleton className="h-4 w-full" />    {/* Data 2 */}
                  <Skeleton className="h-4 w-full" />    {/* Data 3 */}
                  <Skeleton className="h-8 w-16" />      {/* Action button */}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}