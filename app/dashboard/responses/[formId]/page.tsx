'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  ArrowLeft, 
  Download, 
  Eye, 
  Calendar,
  Mail,
  User,
  FileText,
  BarChart3
} from 'lucide-react'
import { getFormResponses, getFormById } from '@/lib/actions/create.form.action'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow, format } from 'date-fns'
import ResponsesSkeleton from '@/components/ui/skeletons/ResponsesSkeleton'

interface FormResponse {
  id: string
  formId: string
  responseData: any
  submittedAt: Date
  submitterEmail: string | null
  submitterName: string | null
}

interface FormData {
  id: string
  title: string
  description: string | null
  form: any
  isMultiStep: boolean
}

const FormResponses = ({ params }: { params: Promise<{ formId: string }> }) => {
  const [responses, setResponses] = useState<FormResponse[]>([])
  const [formData, setFormData] = useState<FormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      const { formId } = await params
      try {
        setLoading(true)
        const [responsesResult, formResult] = await Promise.all([
          getFormResponses(formId),
          getFormById(formId)
        ])

        if (responsesResult.success) {
          // @ts-ignore
          setResponses(responsesResult.data)
        }
        
        if (formResult.success) {
          // @ts-ignore
          setFormData(formResult.data)
        }
      } catch (error) {
        console.error('Error loading form responses:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params])

  const exportToCSV = () => {
    if (!responses.length || !formData) return

    const formFields = formData.isMultiStep 
      ? formData.form.steps?.flatMap((step: any) => step.formFields) || []
      : formData.form.formFields || []

    // Create CSV headers
    const headers = ['Submission Date', 'Submitter Name', 'Submitter Email']
    formFields.forEach((field: any) => {
      if (field.fieldType !== 'button') {
        headers.push(field.fieldLabel)
      }
    })

    // Create CSV rows
    const csvRows = [headers.join(',')]
    
    responses.forEach(response => {
      const row = [
        format(new Date(response.submittedAt), 'yyyy-MM-dd HH:mm:ss'),
        response.submitterName || 'Anonymous',
        response.submitterEmail || 'Not provided'
      ]

      formFields.forEach((field: any) => {
        if (field.fieldType !== 'button') {
          const value = response.responseData[field.fieldName] || ''
          // Escape commas and quotes in CSV
          const escapedValue = typeof value === 'string' 
            ? `"${value.replace(/"/g, '""')}"` 
            : value
          row.push(escapedValue)
        }
      })

      csvRows.push(row.join(','))
    })

    // Download CSV
    const csvContent = csvRows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${formData.title}_responses.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const renderResponseValue = (field: any, value: any) => {
    if (!value) return 'Not answered'

    switch (field.fieldType) {
      case 'checkbox':
        return Array.isArray(value) ? value.join(', ') : value
      case 'date':
      case 'date-signed':
        return format(new Date(value), 'MMM dd, yyyy')
      case 'signature':
      case 'initial':
        return value ? 'Signed' : 'Not signed'
      default:
        return value.toString()
    }
  }

  if (loading) {
    return <ResponsesSkeleton />
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Form not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The form you're looking for doesn't exist or you don't have access to it.
          </p>
          <div className="mt-6">
            <Button onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const formFields = formData.isMultiStep 
    ? formData.form.steps?.flatMap((step: any) => step.formFields) || []
    : formData.form.formFields || []

  const dataFields = formFields.filter((field: any) => field.fieldType !== 'button')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{formData.title}</h1>
                <p className="text-gray-600">Form Responses</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                <BarChart3 className="w-4 h-4 mr-1" />
                {responses.length} responses
              </Badge>
              {responses.length > 0 && (
                <Button onClick={exportToCSV} variant="outline">
                  <Download size={16} className="mr-2" />
                  Export CSV
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Responses</CardTitle>
            <CardDescription>
              {formData.description || 'View and manage form submissions'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {responses.length === 0 ? (
              <div className="text-center py-12">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No responses yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Once people start filling out your form, their responses will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Submitter</TableHead>
                      <TableHead>Email</TableHead>
                      {dataFields.slice(0, 3).map((field: any) => (
                        <TableHead key={field.fieldId}>{field.fieldLabel}</TableHead>
                      ))}
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {responses.map((response) => (
                      <TableRow key={response.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-gray-400" />
                            <div>
                              <div className="text-sm font-medium">
                                {format(new Date(response.submittedAt), 'MMM dd, yyyy')}
                              </div>
                              <div className="text-xs text-gray-500">
                                {format(new Date(response.submittedAt), 'HH:mm')}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-gray-400" />
                            {response.submitterName || 'Anonymous'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail size={14} className="text-gray-400" />
                            {response.submitterEmail || 'Not provided'}
                          </div>
                        </TableCell>
                        {dataFields.slice(0, 3).map((field: any) => (
                          <TableCell key={field.fieldId} className="max-w-[200px]">
                            <div className="truncate">
                              {renderResponseValue(field, response.responseData[field.fieldName])}
                            </div>
                          </TableCell>
                        ))}
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedResponse(response)}
                              >
                                <Eye size={14} className="mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Response Details</DialogTitle>
                                <DialogDescription>
                                  Submitted on {format(new Date(response.submittedAt), 'MMMM dd, yyyy at HH:mm')}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                {/* Submitter Info */}
                                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Name</label>
                                    <p className="text-sm text-gray-900">{response.submitterName || 'Anonymous'}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Email</label>
                                    <p className="text-sm text-gray-900">{response.submitterEmail || 'Not provided'}</p>
                                  </div>
                                </div>

                                {/* Form Responses */}
                                <div className="space-y-3">
                                  {dataFields.map((field: any) => (
                                    <div key={field.fieldId} className="border-b pb-3">
                                      <label className="text-sm font-medium text-gray-700">
                                        {field.fieldLabel}
                                        {field.required && <span className="text-red-500 ml-1">*</span>}
                                      </label>
                                      <div className="mt-1">
                                        <p className="text-sm text-gray-900">
                                          {renderResponseValue(field, response.responseData[field.fieldName])}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default FormResponses