'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ChevronLeft, ChevronRight, Check, AlertCircle, FileText } from 'lucide-react'
import { getFormById, submitFormResponse } from '@/lib/actions/create.form.action'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import FormViewSkeleton from '@/components/ui/skeletons/FormViewSkeleton'

interface FormField {
  fieldId: string
  fieldType: string
  fieldName: string
  fieldLabel: string
  placeholder: string
  required: boolean
  validation: string
  options: string[]
}

interface FormStep {
  stepId: string
  stepTitle: string
  stepDescription: string
  formFields: FormField[]
}

interface FormData {
  formTitle: string
  formSubheading: string
  isMultiStep?: boolean
  totalSteps?: number
  steps?: FormStep[]
  formFields?: FormField[]
}

const PublicForm = ({ params }: { params: Promise<{ id: string }> }) => {
  const [formData, setFormData] = useState<FormData | null>(null)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string>('')
  const [submitterInfo, setSubmitterInfo] = useState({
    name: '',
    email: ''
  })
  const router = useRouter()

  useEffect(() => {
    const loadForm = async () => {
      const { id } = await params
      try {
        setLoading(true)
        console.log('Loading form with ID:', id)
        const response = await getFormById(id)
        
        console.log('Form load response:', response)
        
        if (response.success && response.data) {
          console.log('Form data:', response.data)
          console.log('Is published:', response.data.isPublished)
          
          // Check if form is published
          if (!response.data.isPublished) {
            console.log('Form is not published')
            setSubmitError('This form is not published and cannot be filled out.')
            return
          }
          setFormData(response.data.form as FormData)
        } else {
          console.error('Failed to load form:', response.error)
          setSubmitError('Failed to load form: ' + response.error)
        }
      } catch (error) {
        console.error('Error loading form:', error)
        setSubmitError('Error loading form: ' + error)
      } finally {
        setLoading(false)
      }
    }

    loadForm()
  }, [params])

  const isMultiStep = formData?.isMultiStep && formData?.steps && formData.steps.length > 0
  const totalSteps = isMultiStep ? formData!.steps!.length : 1

  const getCurrentFields = (): FormField[] => {
    if (isMultiStep) {
      return formData!.steps![currentStep]?.formFields || []
    }
    return formData?.formFields || []
  }

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return `${field.fieldLabel} is required`
    }

    if (field.fieldType === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address'
      }
    }

    return null
  }

  const validateCurrentStep = (): boolean => {
    const currentFields = getCurrentFields()
    const newErrors: Record<string, string> = {}
    let isValid = true

    currentFields.forEach(field => {
      if (field.fieldType === 'button') return
      
      const error = validateField(field, responses[field.fieldName])
      if (error) {
        newErrors[field.fieldName] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleInputChange = (fieldName: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [fieldName]: value
    }))

    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }))
    }
  }

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateCurrentStep()) {
      return
    }

    try {
      setSubmitting(true)
      setSubmitError('')
      const { id } = await params
      
      console.log('Submitting form with data:', {
        formId: id,
        responses,
        submitterInfo
      })
      
      const response = await submitFormResponse(
        id,
        responses,
        submitterInfo.email || undefined,
        submitterInfo.name || undefined
      )

      console.log('Form submission response:', response)

      if (response.success) {
        setSubmitted(true)
      } else {
        // Handle error
        console.error('Error submitting form:', response.error)
        setSubmitError(response.error || 'Unknown error occurred')
      }
    } catch (error: any) {
      console.error('Error submitting form:', error)
      setSubmitError(error.message || 'An unexpected error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  const renderField = (field: FormField) => {
    const { fieldId, fieldType, fieldLabel, placeholder, required, options } = field
    const value = responses[field.fieldName] || ''
    const error = errors[field.fieldName]

    const fieldElement = () => {
      switch (fieldType) {
        case 'text':
        case 'email':
        case 'tel':
        case 'password':
        case 'url':
        case 'number':
        case 'company':
        case 'title':
          return (
            <Input
              type={fieldType === 'company' || fieldType === 'title' ? 'text' : fieldType}
              placeholder={placeholder}
              value={value}
              onChange={(e) => handleInputChange(field.fieldName, e.target.value)}
              className={error ? 'border-red-500' : ''}
            />
          )

        case 'textarea':
          return (
            <Textarea
              placeholder={placeholder}
              value={value}
              onChange={(e) => handleInputChange(field.fieldName, e.target.value)}
              className={`min-h-[100px] ${error ? 'border-red-500' : ''}`}
            />
          )

        case 'select':
        case 'dropdown':
          return (
            <Select value={value} onValueChange={(val) => handleInputChange(field.fieldName, val)}>
              <SelectTrigger className={error ? 'border-red-500' : ''}>
                <SelectValue placeholder={placeholder || `Select ${fieldLabel}`} />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option, idx) => (
                  <SelectItem key={idx} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )

        case 'radio':
          return (
            <RadioGroup 
              value={value} 
              onValueChange={(val) => handleInputChange(field.fieldName, val)}
            >
              {options?.map((option, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${fieldId}-${idx}`} />
                  <Label htmlFor={`${fieldId}-${idx}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )

        case 'checkbox':
          if (options && options.length > 1) {
            const selectedValues = Array.isArray(value) ? value : []
            return (
              <div className="space-y-2">
                {options.map((option, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`${fieldId}-${idx}`}
                      checked={selectedValues.includes(option)}
                      onCheckedChange={(checked) => {
                        const newValues = checked
                          ? [...selectedValues, option]
                          : selectedValues.filter(v => v !== option)
                        handleInputChange(field.fieldName, newValues)
                      }}
                    />
                    <Label htmlFor={`${fieldId}-${idx}`}>{option}</Label>
                  </div>
                ))}
              </div>
            )
          } else {
            return (
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id={fieldId}
                  checked={!!value}
                  onCheckedChange={(checked) => handleInputChange(field.fieldName, checked)}
                />
                <Label htmlFor={fieldId}>{fieldLabel}</Label>
              </div>
            )
          }

        case 'date':
          return (
            <Input 
              type="date" 
              value={value}
              onChange={(e) => handleInputChange(field.fieldName, e.target.value)}
              className={error ? 'border-red-500' : ''}
            />
          )

        case 'date-signed':
          return (
            <Input 
              type="date" 
              value={value || new Date().toISOString().split('T')[0]}
              onChange={(e) => handleInputChange(field.fieldName, e.target.value)}
              className={error ? 'border-red-500' : ''}
            />
          )

        case 'file':
          return (
            <Input 
              type="file" 
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  handleInputChange(field.fieldName, file.name)
                }
              }}
              className={error ? 'border-red-500' : ''}
            />
          )

        case 'signature':
          return (
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
              onClick={() => handleInputChange(field.fieldName, 'Signed')}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">✍️</div>
                <div className="text-sm text-gray-600">
                  {value ? 'Signed ✓' : 'Click to add signature'}
                </div>
              </div>
            </div>
          )

        case 'initial':
          return (
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg h-20 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
              onClick={() => handleInputChange(field.fieldName, 'Initialed')}
            >
              <div className="text-center">
                <div className="text-lg mb-1">📋</div>
                <div className="text-sm text-gray-600">
                  {value ? 'Initialed ✓' : 'Add initials'}
                </div>
              </div>
            </div>
          )

        default:
          return (
            <Input
              type="text"
              placeholder={placeholder}
              value={value}
              onChange={(e) => handleInputChange(field.fieldName, e.target.value)}
              className={error ? 'border-red-500' : ''}
            />
          )
      }
    }

    if (fieldType === 'button') return null

    return (
      <div key={fieldId} className="space-y-2">
        <Label className="flex items-center">
          {fieldLabel}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {fieldElement()}
        {error && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle size={14} />
            {error}
          </p>
        )}
      </div>
    )
  }

  const renderMultiStepNav = () => {
    if (!isMultiStep) return null

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {formData!.steps!.map((step, index) => (
            <React.Fragment key={step.stepId}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    index < currentStep
                      ? 'bg-green-500 text-white'
                      : index === currentStep
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index < currentStep ? <Check size={16} /> : index + 1}
                </div>
                <div className="mt-2 text-xs text-center max-w-20">
                  <div className="font-medium text-gray-700 truncate">
                    {step.stepTitle}
                  </div>
                </div>
              </div>
              {index < formData!.steps!.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-colors ${
                    index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
        
        <Progress 
          value={((currentStep + 1) / totalSteps) * 100} 
          className="w-full h-2" 
        />
        
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>Step {currentStep + 1} of {totalSteps}</span>
          <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}% Complete</span>
        </div>
      </div>
    )
  }

  if (loading) {
    return <FormViewSkeleton />
  }

  if (submitError && !formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Form Error</h3>
          <p className="mt-1 text-sm text-gray-500">{submitError}</p>
        </div>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Form not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The form you're looking for doesn't exist or is not published.
          </p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Thank you!</h2>
            <p className="text-gray-600 mb-5">
              Your form has been submitted successfully. We'll get back to you soon.
            </p>
            <Link href={'/'}>
            <Button>
              Back to Home
            </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              {formData.formTitle}
            </CardTitle>
            {formData.formSubheading && (
              <CardDescription className="text-gray-600">
                {formData.formSubheading}
              </CardDescription>
            )}
            
            {renderMultiStepNav()}
          </CardHeader>
          
          <CardContent>
            {submitError && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {submitError}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              {isMultiStep && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {formData.steps![currentStep]?.stepTitle}
                  </h3>
                  {formData.steps![currentStep]?.stepDescription && (
                    <p className="text-gray-600">
                      {formData.steps![currentStep].stepDescription}
                    </p>
                  )}
                </div>
              )}

              {/* Submitter Info (only on first step or single step) */}
              {currentStep === 0 && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">Contact Information (Optional)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Your Name</Label>
                      <Input
                        type="text"
                        placeholder="Enter your name"
                        value={submitterInfo.name}
                        onChange={(e) => setSubmitterInfo(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Your Email</Label>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={submitterInfo.email}
                        onChange={(e) => setSubmitterInfo(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {getCurrentFields().map(field => renderField(field))}
              </div>
              
              <div className="pt-6">
                {isMultiStep ? (
                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 0}
                    >
                      <ChevronLeft size={16} className="mr-2" />
                      Previous
                    </Button>
                    
                    {currentStep === totalSteps - 1 ? (
                      <Button type="submit" disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Submit Form'}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={nextStep}
                      >
                        Next
                        <ChevronRight size={16} className="ml-2" />
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Form'}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PublicForm