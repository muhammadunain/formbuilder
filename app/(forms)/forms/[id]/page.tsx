'use client'

import { getFormById } from '@/lib/actions/create.form.action'
import React, { useState, useEffect } from 'react'
import FormBuilderSkeleton from '@/components/ui/skeletons/FormBuilderSkeleton'
import FormBuilderWithSave from './FormBuilderWithSave'

interface FormData {
  formTitle: string
  formSubheading: string
  isMultiStep?: boolean
  totalSteps?: number
  steps?: any[]
  formFields?: any[]
}

const Forms = ({ params }: { params: Promise<{ id: string }> }) => {
  const [initialData, setInitialData] = useState<FormData | null>(null)
  const [formId, setFormId] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadForm = async () => {
      const { id } = await params
      setFormId(id)
      try {
        const response = await getFormById(id)
        if (response.success && response.data) {
          setInitialData(response.data.form as FormData)
        }
      } catch (error) {
        console.error('Error loading form:', error)
      } finally {
        setLoading(false)
      }
    }

    loadForm()
  }, [params])

  if (loading) {
    return <FormBuilderSkeleton />
  }

  return <FormBuilderWithSave initialData={initialData || undefined} formId={formId} />
}

export default Forms