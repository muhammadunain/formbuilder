'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  FileText, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Share2, 
  BarChart3, 
  Users, 
  Calendar,
  Globe,
  Lock,
  Layers,
  ExternalLink
} from 'lucide-react'
import { getUserForms, getDashboardStats, publishForm, unpublishForm, syncUser } from '@/lib/actions/create.form.action'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { formatDistanceToNow } from 'date-fns'
import DashboardSkeleton from '@/components/ui/skeletons/DashboardSkeleton'
import Link from 'next/link'

interface FormData {
  id: string
  title: string
  description: string | null
  isPublished: boolean
  isMultiStep: boolean
  createdAt: Date
  updatedAt: Date
  responseCount: number
}

interface DashboardStats {
  totalForms: number
  publishedForms: number
  totalResponses: number
}

const Dashboard = () => {
  const [forms, setForms] = useState<FormData[]>([])
  const [stats, setStats] = useState<DashboardStats>({ totalForms: 0, publishedForms: 0, totalResponses: 0 })
  const [loading, setLoading] = useState(true)
  const [publishingForm, setPublishingForm] = useState<string | null>(null)
  const [unpublishingForm, setUnpublishingForm] = useState<string | null>(null)
  const router = useRouter()
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (isLoaded && user) {
      loadDashboardData()
      syncUser() // Sync user data with our database
    }
  }, [isLoaded, user])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [formsResponse, statsResponse] = await Promise.all([
        getUserForms(),
        getDashboardStats()
      ])

      if (formsResponse.success) {
        // @ts-ignore
        setForms(formsResponse.data)
      }
      
      if (statsResponse.success) {
        // @ts-ignore
        setStats(statsResponse.data)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePublishForm = async (formId: string) => {
    try {
      setPublishingForm(formId)
      const response = await publishForm(formId)
      
      if (response.success) {
        // Update the form in the local state
        setForms(prev => prev.map(form => 
          form.id === formId ? { ...form, isPublished: true } : form
        ))
        // Update stats
        setStats(prev => ({ ...prev, publishedForms: prev.publishedForms + 1 }))
      }
    } catch (error) {
      console.error('Error publishing form:', error)
    } finally {
      setPublishingForm(null)
    }
  }

  const handleUnpublishForm = async (formId: string) => {
    try {
      setUnpublishingForm(formId)
      const response = await unpublishForm(formId)
      
      if (response.success) {
        // Update the form in the local state
        setForms(prev => prev.map(form => 
          form.id === formId ? { ...form, isPublished: false } : form
        ))
        // Update stats
        setStats(prev => ({ ...prev, publishedForms: prev.publishedForms - 1 }))
      }
    } catch (error) {
      console.error('Error unpublishing form:', error)
    } finally {
      setUnpublishingForm(null)
    }
  }

  const handleCreateForm = () => {
    router.push('/create-form')
  }

  const handleEditForm = (formId: string) => {
    router.push(`/forms/${formId}`)
  }

  const handleViewResponses = (formId: string) => {
    router.push(`/dashboard/responses/${formId}`)
  }

  const handleShareForm = (formId: string) => {
    const shareUrl = `${window.location.origin}/form/${formId}`
    navigator.clipboard.writeText(shareUrl)
    // You could add a toast notification here
  }

  const handleLivePreview = (formId: string) => {
    window.open(`${window.location.origin}/form/${formId}`, '_blank')
  }

  if (!isLoaded || loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <Link href={'/'}>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              </Link>
              <p className="text-gray-600">Welcome back, {user?.firstName || 'User'}!</p>
            </div>
             <Link href={'/create-form'}>
            <Button  className="flex items-center gap-2">
              <Plus size={16} />
              Create New Form
            </Button>
             </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalForms}</div>
              <p className="text-xs text-muted-foreground">
                {stats.publishedForms} published
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published Forms</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.publishedForms}</div>
              <p className="text-xs text-muted-foreground">
                Live and accepting responses
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalResponses}</div>
              <p className="text-xs text-muted-foreground">
                Across all forms
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Forms List */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Your Forms</CardTitle>
            <CardDescription>
              Manage and track your form submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {forms.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No forms yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating your first form.
                </p>
                <div className="mt-6">
                  <Button onClick={handleCreateForm}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Form
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {forms.map((form) => (
                  <div
                    key={form.id}
                    className="flex items-start justify-between p-6 border rounded-lg hover:bg-gray-50 transition-colors bg-white shadow-sm"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-gray-900 text-lg truncate">{form.title}</h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {form.isMultiStep && (
                            <Badge variant="secondary" className="text-xs">
                              <Layers className="w-3 h-3 mr-1" />
                              Multi-step
                            </Badge>
                          )}
                          <Badge 
                            variant={form.isPublished ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {form.isPublished ? (
                              <>
                                <Globe className="w-3 h-3 mr-1" />
                                Published
                              </>
                            ) : (
                              <>
                                <Lock className="w-3 h-3 mr-1" />
                                Draft
                              </>
                            )}
                          </Badge>
                        </div>
                      </div>
                      
                      {form.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{form.description}</p>
                      )}
                      
                      <div className="flex items-center gap-6 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users size={12} />
                          {form.responseCount} responses
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          Updated {formatDistanceToNow(new Date(form.updatedAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>

                    {/* Form Actions - Right Side */}
                    <div className="flex flex-col gap-2 ml-6 min-w-fit">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditForm(form.id)}
                          title="Edit Form"
                        >
                          <Edit size={14} />
                        </Button>
                        
                        {form.isPublished ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleLivePreview(form.id)}
                              title="Live Preview"
                            >
                              <Eye size={14} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewResponses(form.id)}
                              title="View Responses"
                            >
                              <BarChart3 size={14} />
                            </Button>
                          </>
                        ) : null}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {form.isPublished ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleShareForm(form.id)}
                              title="Copy Share Link"
                            >
                              <Share2 size={14} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUnpublishForm(form.id)}
                              disabled={unpublishingForm === form.id}
                              title="Unpublish Form"
                            >
                              {unpublishingForm === form.id ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
                              ) : (
                                <Lock size={14} />
                              )}
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handlePublishForm(form.id)}
                            disabled={publishingForm === form.id}
                            className="w-full"
                          >
                            {publishingForm === form.id ? 'Publishing...' : 'Publish'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard