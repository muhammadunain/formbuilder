'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, LayoutDashboard, Plus, Eye, BarChart3 } from 'lucide-react'
import { useUser } from '@clerk/nextjs'

const QuickNav = () => {
  const { isSignedIn, isLoaded } = useUser()

  const routes = [
    {
      title: 'Create Form',
      description: 'Use AI to generate forms instantly',
      href: '/create',
      icon: Plus,
      color: 'bg-blue-500',
      available: true
    },
    {
      title: 'Dashboard',
      description: 'Manage your forms and view analytics',
      href: '/dashboard',
      icon: LayoutDashboard,
      color: 'bg-green-500',
      available: isSignedIn
    },
    {
      title: 'Form Builder',
      description: 'Edit and customize your forms',
      href: '/forms/[id]',
      icon: FileText,
      color: 'bg-purple-500',
      available: isSignedIn,
      note: 'Available after creating a form'
    },
    {
      title: 'Public Form',
      description: 'Fill out published forms',
      href: '/form/[id]',
      icon: Eye,
      color: 'bg-orange-500',
      available: true,
      note: 'Available for published forms'
    },
    {
      title: 'Form Responses',
      description: 'View and export form submissions',
      href: '/dashboard/responses/[formId]',
      icon: BarChart3,
      color: 'bg-red-500',
      available: isSignedIn,
      note: 'Available for forms with responses'
    }
  ]

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Navigation</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore all the features of our form builder system. {!isSignedIn && 'Sign in to access all features.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route, index) => {
            const Icon = route.icon
            const isClickable = route.available && !route.href.includes('[')
            
            return (
              <Card key={index} className={`transition-all duration-200 ${
                route.available 
                  ? 'hover:shadow-lg cursor-pointer' 
                  : 'opacity-60 cursor-not-allowed'
              }`}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${route.color} text-white`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{route.title}</CardTitle>
                      {!route.available && (
                        <span className="text-xs text-red-500 font-medium">Sign in required</span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {route.description}
                  </CardDescription>
                  {route.note && (
                    <p className="text-xs text-gray-500 mb-3 italic">{route.note}</p>
                  )}
                  {isClickable ? (
                    <Link href={route.href}>
                      <Button className="w-full">
                        Go to {route.title}
                      </Button>
                    </Link>
                  ) : (
                    <Button disabled className="w-full">
                      {route.href.includes('[') ? 'Dynamic Route' : 'Sign In Required'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {!isSignedIn && (
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">Sign in to access all features and manage your forms</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuickNav