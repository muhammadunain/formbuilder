'use client'

import { getFormById, updateForm, publishForm, unpublishForm } from '@/lib/actions/create.form.action'
import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Trash2, GripVertical, Plus, Edit, Save, ChevronLeft, ChevronRight, Check, Share2, Eye, Moon, Sun, Copy, ExternalLink, Globe } from "lucide-react"
import { preBuiltElements } from '@/constants/bgcode'
import FormLoading from '@/components/home/module/Loading'
import Link from 'next/link'
import { toast } from 'sonner'

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

// Enhanced preBuiltElements with comprehensive e-signature fields
const enhancedPreBuiltElements = [
  ...preBuiltElements,
  // E-Signature Section
  {
    icon: "✍️",
    label: "Digital Signature",
    type: "signature",
    defaultField: {
      fieldType: "signature",
      fieldLabel: "Digital Signature",
      placeholder: "Click to sign or draw your signature",
      required: true,
      validation: "",
      options: []
    }
  },
  {
    icon: "✏️",
    label: "Text Signature",
    type: "text-signature",
    defaultField: {
      fieldType: "text-signature",
      fieldLabel: "Type Your Signature",
      placeholder: "Type your full name as signature",
      required: true,
      validation: "",
      options: []
    }
  },
  {
    icon: "📝",
    label: "E-Sign Text Box",
    type: "esign-textbox",
    defaultField: {
      fieldType: "esign-textbox",
      fieldLabel: "Electronic Signature",
      placeholder: "Enter your electronic signature",
      required: true,
      validation: "",
      options: []
    }
  },
  {
    icon: "📋",
    label: "Initial Field",
    type: "initial",
    defaultField: {
      fieldType: "initial",
      fieldLabel: "Initial Here",
      placeholder: "Add your initials",
      required: false,
      validation: "",
      options: []
    }
  },
  {
    icon: "🔤",
    label: "Initial Text Box",
    type: "initial-textbox",
    defaultField: {
      fieldType: "initial-textbox",
      fieldLabel: "Type Your Initials",
      placeholder: "Enter your initials (e.g., J.D.)",
      required: false,
      validation: "",
      options: []
    }
  },
  {
    icon: "📅",
    label: "Date Signed",
    type: "date-signed",
    defaultField: {
      fieldType: "date-signed",
      fieldLabel: "Date Signed",
      placeholder: "",
      required: true,
      validation: "",
      options: []
    }
  },
  {
    icon: "🕐",
    label: "Time Signed",
    type: "time-signed",
    defaultField: {
      fieldType: "time-signed",
      fieldLabel: "Time Signed",
      placeholder: "",
      required: false,
      validation: "",
      options: []
    }
  },
  {
    icon: "👤",
    label: "Signer Name",
    type: "signer-name",
    defaultField: {
      fieldType: "signer-name",
      fieldLabel: "Full Name of Signer",
      placeholder: "Enter your full legal name",
      required: true,
      validation: "",
      options: []
    }
  },
  {
    icon: "📧",
    label: "Signer Email",
    type: "signer-email",
    defaultField: {
      fieldType: "signer-email",
      fieldLabel: "Email Address",
      placeholder: "Enter your email address",
      required: true,
      validation: "email",
      options: []
    }
  },
  {
    icon: "🏢",
    label: "Company",
    type: "company",
    defaultField: {
      fieldType: "company",
      fieldLabel: "Company/Organization",
      placeholder: "Enter company name",
      required: false,
      validation: "",
      options: []
    }
  },
  {
    icon: "💼",
    label: "Title/Position",
    type: "title",
    defaultField: {
      fieldType: "title",
      fieldLabel: "Title/Position",
      placeholder: "Enter your title",
      required: false,
      validation: "",
      options: []
    }
  },
  {
    icon: "🏠",
    label: "Address",
    type: "address",
    defaultField: {
      fieldType: "address",
      fieldLabel: "Address",
      placeholder: "Enter your full address",
      required: false,
      validation: "",
      options: []
    }
  },
  {
    icon: "📱",
    label: "Phone Number",
    type: "phone",
    defaultField: {
      fieldType: "phone",
      fieldLabel: "Phone Number",
      placeholder: "Enter your phone number",
      required: false,
      validation: "phone",
      options: []
    }
  },
  {
    icon: "🆔",
    label: "ID Number",
    type: "id-number",
    defaultField: {
      fieldType: "id-number",
      fieldLabel: "ID/License Number",
      placeholder: "Enter ID or license number",
      required: false,
      validation: "",
      options: []
    }
  },
  {
    icon: "✅",
    label: "Agreement Checkbox",
    type: "agreement",
    defaultField: {
      fieldType: "agreement",
      fieldLabel: "I agree to the terms and conditions",
      placeholder: "",
      required: true,
      validation: "",
      options: ["I agree to the terms and conditions and authorize this electronic signature"]
    }
  },
  {
    icon: "🔒",
    label: "Consent Checkbox",
    type: "consent",
    defaultField: {
      fieldType: "consent",
      fieldLabel: "Electronic Signature Consent",
      placeholder: "",
      required: true,
      validation: "",
      options: ["I consent to use electronic signatures for this document"]
    }
  }
]

const FormBuilderWithSave = ({ initialData, formId }: { initialData?: FormData, formId?: string }) => {
  const [formData, setFormData] = useState<FormData>(
    initialData || {
      formTitle: 'New Form',
      formSubheading: 'Please fill out the form below',
      formFields: []
    }
  )
  const [draggedItem, setDraggedItem] = useState<any>(null)
  const [draggedFieldIndex, setDraggedFieldIndex] = useState<number | null>(null)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [isBuilderMode, setIsBuilderMode] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [unpublishing, setUnpublishing] = useState(false)
  const [isPublished, setIsPublished] = useState(false)

  const isMultiStep = formData.isMultiStep && formData.steps && formData.steps.length > 0
  const totalSteps = isMultiStep ? formData.steps!.length : 1

  const generateFieldId = () => {
    return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const generateShareLink = () => {
    return `${window.location.origin}/form/${formId}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSaveForm = async () => {
    if (!formId) return
    
    try {
      setSaving(true)
      const response = await updateForm(formId, formData, formData.formTitle, formData.formSubheading)
      
      if (response.success) {
        console.log('Form saved successfully')
      } else {
        console.error('Error saving form:', response.error)
      }
    } catch (error) {
      console.error('Error saving form:', error)
    } finally {
      setSaving(false)
    }
  }

  const handlePublishForm = async () => {
    if (!formId) return
    
    try {
      setPublishing(true)
      const response = await publishForm(formId)
      
      if (response.success) {
        setIsPublished(true)
                toast.success('Form published successfully!')
        
        console.log('Form published successfully')
      } else {
        console.error('Error publishing form:', response.error)
      }
    } catch (error) {
      console.error('Error publishing form:', error)
    } finally {
      setPublishing(false)
    }
  }

  const handleUnpublishForm = async () => {
    if (!formId) return
    
    try {
      setUnpublishing(true)
      const response = await unpublishForm(formId)
      
      if (response.success) {
        setIsPublished(false)
        console.log('Form unpublished successfully')
      } else {
        console.error('Error unpublishing form:', response.error)
      }
    } catch (error) {
      console.error('Error unpublishing form:', error)
    } finally {
      setUnpublishing(false)
    }
  }

  // Handle dragging new elements from sidebar
  const handleElementDragStart = (e: React.DragEvent, element: any) => {
    setDraggedItem(element)
    setDraggedFieldIndex(null)
    e.dataTransfer.effectAllowed = 'copy'
  }

  // Handle dragging existing form fields
  const handleFieldDragStart = (e: React.DragEvent, index: number) => {
    setDraggedFieldIndex(index)
    setDraggedItem(null)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = draggedItem ? 'copy' : 'move'
  }

  const handleDrop = (e: React.DragEvent, dropIndex?: number) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Adding new element from sidebar
    if (draggedItem && draggedFieldIndex === null) {
      const newField: FormField = {
        ...draggedItem.defaultField,
        fieldId: generateFieldId(),
        fieldName: draggedItem.defaultField.fieldLabel.toLowerCase().replace(/\s+/g, '_')
      }
      
      if (isMultiStep) {
        setFormData(prev => ({
          ...prev,
          steps: prev.steps!.map((step, index) => 
            index === currentStep 
              ? { 
                  ...step, 
                  formFields: dropIndex !== undefined 
                    ? [
                        ...step.formFields.slice(0, dropIndex),
                        newField,
                        ...step.formFields.slice(dropIndex)
                      ]
                    : [...step.formFields, newField]
                }
              : step
          )
        }))
      } else {
        setFormData(prev => ({
          ...prev,
          formFields: dropIndex !== undefined 
            ? [
                ...(prev.formFields || []).slice(0, dropIndex),
                newField,
                ...(prev.formFields || []).slice(dropIndex)
              ]
            : [...(prev.formFields || []), newField]
        }))
      }
    }
    
    // Reordering existing fields
    else if (draggedFieldIndex !== null && dropIndex !== undefined && draggedFieldIndex !== dropIndex) {
      const currentFields = getCurrentFields()
      const draggedField = currentFields[draggedFieldIndex]
      const newFields = [...currentFields]
      
      // Remove dragged field
      newFields.splice(draggedFieldIndex, 1)
      
      // Insert at new position
      const insertIndex = draggedFieldIndex < dropIndex ? dropIndex - 1 : dropIndex
      newFields.splice(insertIndex, 0, draggedField)
      
      if (isMultiStep) {
        setFormData(prev => ({
          ...prev,
          steps: prev.steps!.map((step, index) => 
            index === currentStep 
              ? { ...step, formFields: newFields }
              : step
          )
        }))
      } else {
        setFormData(prev => ({
          ...prev,
          formFields: newFields
        }))
      }
    }
    
    // Clear drag state
    setDraggedItem(null)
    setDraggedFieldIndex(null)
  }

  const removeField = (fieldId: string) => {
    if (isMultiStep) {
      setFormData(prev => ({
        ...prev,
        steps: prev.steps!.map((step, index) => 
          index === currentStep
            ? { ...step, formFields: step.formFields.filter(field => field.fieldId !== fieldId) }
            : step
        )
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        formFields: prev.formFields!.filter(field => field.fieldId !== fieldId)
      }))
    }
  }

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    if (isMultiStep) {
      setFormData(prev => ({
        ...prev,
        steps: prev.steps!.map((step, index) => 
          index === currentStep
            ? {
                ...step,
                formFields: step.formFields.map(field => 
                  field.fieldId === fieldId ? { ...field, ...updates } : field
                )
              }
            : step
        )
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        formFields: prev.formFields!.map(field => 
          field.fieldId === fieldId ? { ...field, ...updates } : field
        )
      }))
    }
  }

  const getCurrentFields = (): FormField[] => {
    if (isMultiStep) {
      return formData.steps![currentStep]?.formFields || []
    }
    return formData.formFields || []
  }

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderMultiStepNav = () => {
    if (!isMultiStep) return null

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {formData.steps!.map((step, index) => (
            <React.Fragment key={step.stepId}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    index < currentStep
                      ? 'bg-green-500 text-white'
                      : index === currentStep
                      ? 'bg-blue-500 text-white'
                      : isDarkMode 
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index < currentStep ? <Check size={16} /> : index + 1}
                </div>
                <div className="mt-2 text-xs text-center max-w-20">
                  <div className={`font-medium truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {step.stepTitle}
                  </div>
                </div>
              </div>
              {index < formData.steps!.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-colors ${
                    index < currentStep ? 'bg-green-500' : isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
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
        
        <div className={`flex justify-between text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <span>Step {currentStep + 1} of {totalSteps}</span>
          <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}% Complete</span>
        </div>
      </div>
    )
  }

  const renderField = (field: FormField, index: number) => {
    const { fieldId, fieldType, fieldLabel, placeholder, required, options } = field
    const isEditing = editingField === fieldId

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
        case 'signer-name':
        case 'signer-email':
        case 'address':
        case 'phone':
        case 'id-number':
          return (
            <Input
              type={
                fieldType === 'signer-email' ? 'email' :
                fieldType === 'phone' ? 'tel' :
                fieldType === 'url' ? 'url' :
                fieldType === 'number' ? 'number' :
                'text'
              }
              placeholder={placeholder}
              required={required}
              disabled={isBuilderMode}
              className={`${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''} ${
                fieldType.includes('signer') || fieldType.includes('esign') ? 'border-blue-200 focus:border-blue-400' : ''
              }`}
            />
          )

        // E-Signature Text Fields
        case 'text-signature':
        case 'esign-textbox':
          return (
            <div className="space-y-3">
              <div className={`relative border-2 rounded-lg p-4 ${
                isDarkMode 
                  ? 'bg-gray-800 border-blue-600' 
                  : 'bg-blue-50 border-blue-300'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✍️</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder={placeholder}
                      required={required}
                      disabled={isBuilderMode}
                      className={`font-serif text-lg italic border-0 bg-transparent p-0 focus:ring-0 ${
                        isDarkMode ? 'text-blue-200' : 'text-blue-800'
                      }`}
                    />
                    <div className="border-b-2 border-blue-400 mt-2"></div>
                  </div>
                </div>
                <div className="absolute top-1 right-1">
                  <span className={`text-xs px-2 py-1 rounded ${
                    isDarkMode ? 'bg-blue-700 text-blue-200' : 'bg-blue-200 text-blue-800'
                  }`}>
                    E-SIGN
                  </span>
                </div>
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {fieldType === 'text-signature' ? 'Type your full name as it appears on legal documents' : 'This will serve as your electronic signature'}
              </p>
            </div>
          )

        case 'initial-textbox':
          return (
            <div className="space-y-3">
              <div className={`relative border-2 rounded-lg p-3 w-32 ${
                isDarkMode 
                  ? 'bg-gray-800 border-green-600' 
                  : 'bg-green-50 border-green-300'
              }`}>
                <div className="text-center">
                  <Input
                    type="text"
                    placeholder={placeholder}
                    required={required}
                    disabled={isBuilderMode}
                    maxLength={5}
                    className={`font-serif text-lg italic border-0 bg-transparent p-0 text-center focus:ring-0 ${
                      isDarkMode ? 'text-green-200' : 'text-green-800'
                    }`}
                  />
                  <div className="border-b-2 border-green-400 mt-2"></div>
                </div>
                <div className="absolute -top-2 -right-2">
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isDarkMode ? 'bg-green-700 text-green-200' : 'bg-green-200 text-green-800'
                  }`}>
                    INIT
                  </span>
                </div>
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Enter your initials (e.g., J.D.)
              </p>
            </div>
          )

        case 'textarea':
          return (
            <Textarea
              placeholder={placeholder}
              required={required}
              disabled={isBuilderMode}
              className={`min-h-[100px] ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}`}
            />
          )

        case 'select':
        case 'dropdown':
          return (
            <Select disabled={isBuilderMode}>
              <SelectTrigger className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}>
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
            <RadioGroup disabled={isBuilderMode}>
              {options?.map((option, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${fieldId}-${idx}`} />
                  <Label htmlFor={`${fieldId}-${idx}`} className={isDarkMode ? 'text-gray-300' : ''}>
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )

        case 'checkbox':
          if (options && options.length > 1) {
            return (
              <div className="space-y-2">
                {options.map((option, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <Checkbox id={`${fieldId}-${idx}`} disabled={isBuilderMode} />
                    <Label htmlFor={`${fieldId}-${idx}`} className={isDarkMode ? 'text-gray-300' : ''}>
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            )
          } else {
            return (
              <div className="flex items-center space-x-2">
                <Checkbox id={fieldId} disabled={isBuilderMode} />
                <Label htmlFor={fieldId} className={isDarkMode ? 'text-gray-300' : ''}>
                  {fieldLabel}
                </Label>
              </div>
            )
          }

        // Special E-Signature Agreement/Consent Checkboxes
        case 'agreement':
        case 'consent':
          return (
            <div className={`p-4 rounded-lg border-2 ${
              fieldType === 'agreement' 
                ? isDarkMode 
                  ? 'bg-green-900/20 border-green-600' 
                  : 'bg-green-50 border-green-300'
                : isDarkMode 
                  ? 'bg-blue-900/20 border-blue-600' 
                  : 'bg-blue-50 border-blue-300'
            }`}>
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id={fieldId} 
                  disabled={isBuilderMode}
                  required={required}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label 
                    htmlFor={fieldId} 
                    className={`text-sm leading-relaxed cursor-pointer ${
                      fieldType === 'agreement'
                        ? isDarkMode ? 'text-green-200' : 'text-green-800'
                        : isDarkMode ? 'text-blue-200' : 'text-blue-800'
                    }`}
                  >
                    {options && options[0] ? options[0] : fieldLabel}
                  </Label>
                  {required && (
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      * This agreement is required to proceed
                    </p>
                  )}
                </div>
              </div>
            </div>
          )

        case 'date':
          return (
            <Input 
              type="date" 
              disabled={isBuilderMode} 
              className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}
            />
          )

        case 'date-signed':
          return (
            <div className="space-y-2">
              <Input 
                type="date" 
                disabled={isBuilderMode}
                defaultValue={new Date().toISOString().split('T')[0]}
                className={`border-2 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-purple-600 text-purple-200 focus:border-purple-400' 
                    : 'bg-purple-50 border-purple-300 text-purple-800 focus:border-purple-500'
                }`}
              />
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Date when the document was signed
              </p>
            </div>
          )

        case 'time-signed':
          return (
            <div className="space-y-2">
              <Input 
                type="time" 
                disabled={isBuilderMode}
                defaultValue={new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                className={`border-2 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-orange-600 text-orange-200 focus:border-orange-400' 
                    : 'bg-orange-50 border-orange-300 text-orange-800 focus:border-orange-500'
                }`}
              />
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Time when the document was signed
              </p>
            </div>
          )

        case 'file':
          return (
            <Input 
              type="file" 
              disabled={isBuilderMode}
              className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}
            />
          )

        case 'signature':
          return (
            <div className="space-y-3">
              <div className={`relative border-2 rounded-lg h-40 bg-white ${
                isDarkMode ? 'border-gray-600' : 'border-gray-300'
              } ${isBuilderMode ? 'pointer-events-none' : 'cursor-pointer hover:border-blue-400'}`}>
                {/* Signature Canvas Area */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <div className="text-3xl mb-2">✍️</div>
                    <div className="text-sm font-medium">Sign Here</div>
                    <div className="text-xs mt-1">Click to draw your signature</div>
                  </div>
                </div>
                
                {/* Signature Line */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="border-b-2 border-gray-300 relative">
                    <div className="absolute -bottom-5 left-0 text-xs text-gray-500">
                      Signature
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                {!isBuilderMode && (
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">
                      Draw
                    </button>
                    <button className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600">
                      Type
                    </button>
                    <button className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600">
                      Clear
                    </button>
                  </div>
                )}
              </div>
              
              {/* Signature Options */}
              {!isBuilderMode && (
                <div className="flex space-x-2 text-xs">
                  <button className="flex-1 py-2 px-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                    📝 Draw Signature
                  </button>
                  <button className="flex-1 py-2 px-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                    ⌨️ Type Signature
                  </button>
                  <button className="flex-1 py-2 px-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                    📁 Upload Image
                  </button>
                </div>
              )}
            </div>
          )

        case 'initial':
          return (
            <div className="space-y-3">
              <div className={`relative border-2 rounded-lg h-24 bg-white ${
                isDarkMode ? 'border-gray-600' : 'border-gray-300'
              } ${isBuilderMode ? 'pointer-events-none' : 'cursor-pointer hover:border-green-400'}`}>
                {/* Initial Canvas Area */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <div className="text-2xl mb-1">📋</div>
                    <div className="text-sm font-medium">Initial Here</div>
                  </div>
                </div>
                
                {/* Initial Line */}
                <div className="absolute bottom-3 left-4 right-4">
                  <div className="border-b-2 border-gray-300 relative">
                    <div className="absolute -bottom-4 left-0 text-xs text-gray-500">
                      Initials
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                {!isBuilderMode && (
                  <div className="absolute top-1 right-1 flex space-x-1">
                    <button className="px-1.5 py-0.5 text-xs bg-green-500 text-white rounded hover:bg-green-600">
                      Draw
                    </button>
                    <button className="px-1.5 py-0.5 text-xs bg-gray-500 text-white rounded hover:bg-gray-600">
                      Type
                    </button>
                  </div>
                )}
              </div>
              
              {/* Initial Options */}
              {!isBuilderMode && (
                <div className="flex space-x-2 text-xs">
                  <button className="flex-1 py-1.5 px-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                    ✏️ Draw
                  </button>
                  <button className="flex-1 py-1.5 px-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                    ⌨️ Type
                  </button>
                </div>
              )}
            </div>
          )

        default:
          return (
            <Input
              type="text"
              placeholder={placeholder}
              disabled={isBuilderMode}
              className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}
            />
          )
      }
    }

    return (
      <div
        key={fieldId}
        className={`relative group p-6 border rounded-xl transition-all duration-200 ${
          isBuilderMode 
            ? isDarkMode
              ? 'border-dashed border-gray-600 hover:border-blue-400 bg-gray-800/50 hover:bg-gray-800'
              : 'border-dashed border-gray-300 hover:border-blue-400 bg-white hover:shadow-md'
            : isDarkMode
              ? 'border-gray-700 bg-gray-800'
              : 'border-gray-200 bg-white'
        }`}
        draggable={isBuilderMode}
        onDragStart={(e) => handleFieldDragStart(e, index)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, index)}
      >
        {isBuilderMode && (
          <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditingField(isEditing ? null : fieldId)}
              className="h-8 w-8 p-0 rounded-full"
            >
              <Edit size={14} />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => removeField(fieldId)}
              className="h-8 w-8 p-0 rounded-full"
            >
              <Trash2 size={14} />
            </Button>
            <div className="cursor-move p-2 rounded-full hover:bg-gray-100 transition-colors">
              <GripVertical size={14} />
            </div>
          </div>
        )}

        <div className="space-y-3">
          {isEditing ? (
            <div className={`space-y-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <Input
                value={field.fieldLabel}
                onChange={(e) => updateField(fieldId, { fieldLabel: e.target.value })}
                placeholder="Field Label"
                className={isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : ''}
              />
              <Input
                value={field.placeholder || ''}
                onChange={(e) => updateField(fieldId, { placeholder: e.target.value })}
                placeholder="Placeholder"
                className={isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : ''}
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={field.required}
                  onCheckedChange={(checked) => updateField(fieldId, { required: !!checked })}
                />
                <Label className={isDarkMode ? 'text-gray-300' : ''}>Required</Label>
              </div>
              {(fieldType === 'select' || fieldType === 'radio' || fieldType === 'checkbox') && (
                <div>
                  <Label className={isDarkMode ? 'text-gray-300' : ''}>Options (one per line)</Label>
                  <Textarea
                    value={field.options?.join('\n') || ''}
                    onChange={(e) => updateField(fieldId, { options: e.target.value.split('\n').filter(o => o.trim()) })}
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                    className={`mt-1 ${isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : ''}`}
                  />
                </div>
              )}
            </div>
          ) : (
            <>
              <Label className={`flex items-center text-base font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                {fieldLabel}
                {required && <span className="text-red-500 ml-1">*</span>}
                {isBuilderMode && (
                  <Badge variant="secondary" className="ml-3 text-xs">
                    {fieldType}
                  </Badge>
                )}
              </Label>
              {fieldElement()}
            </>
          )}
        </div>
      </div>
    )
  }

  const themeClass = isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50'

  return (
    <div className={`min-h-screen ${themeClass}`}>
      {/* Top Header Bar */}
      <div className={`sticky top-0 z-50 border-b backdrop-blur-md ${
        isDarkMode ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Side - Back Button and Form Title */}
            <div className="flex items-center space-x-4">
              <Link href={'/'}>
                <Button variant={'ghost'} size="sm" className="flex items-center space-x-2">
                  <ChevronLeft size={16} />
                  <span>Back</span>
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formData.formTitle}
                </h1>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Form Builder
                </p>
              </div>
            </div>

            {/* Right Side - Action Buttons (Horizontal) */}
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline"
                size="sm"
                onClick={handleSaveForm}
                disabled={saving}
                className="flex items-center space-x-2"
              >
                <Save size={16} />
                <span>{saving ? 'Saving...' : 'Save'}</span>
              </Button>

              <Button 
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center space-x-2"
              >
                <Eye size={16} />
                <span>{previewMode ? 'Exit Preview' : 'Preview'}</span>
              </Button>

              {isPublished ? (
                <>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(generateShareLink(), '_blank')}
                    className="flex items-center space-x-2"
                  >
                    <ExternalLink size={16} />
                    <span>Live</span>
                  </Button>
                  
                  <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center space-x-2">
                        <Share2 size={16} />
                        <span>Share</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className={isDarkMode ? 'bg-gray-900 border-gray-700' : ''}>
                      <DialogHeader>
                        <DialogTitle className={isDarkMode ? 'text-white' : ''}>Share Your Form</DialogTitle>
                        <DialogDescription className={isDarkMode ? 'text-gray-400' : ''}>
                          Share this form with others using the link below
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Input
                            value={generateShareLink()}
                            readOnly
                            className={`flex-1 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}`}
                          />
                          <Button
                            size="sm"
                            onClick={() => copyToClipboard(generateShareLink())}
                          >
                           {copied ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            className="flex-1"
                            onClick={() => window.open(generateShareLink(), '_blank')}
                          >
                            <ExternalLink size={16} className="mr-2" />
                            Open Live Form
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    variant="destructive"
                    size="sm"
                    onClick={handleUnpublishForm}
                    disabled={unpublishing}
                    className="flex items-center space-x-2"
                  >
                    {unpublishing ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b border-current"></div>
                    ) : (
                      <Globe size={16} />
                    )}
                    <span>{unpublishing ? 'Unpublishing...' : 'Unpublish'}</span>
                  </Button>
                </>
              ) : (
                <Button 
                  size="sm"
                  onClick={handlePublishForm}
                  disabled={publishing}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Globe size={16} />
                  <span>{publishing ? 'Publishing...' : 'Publish'}</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar - Form Elements */}
        <div className={`w-80 border-r overflow-y-auto h-[calc(100vh-80px)] ${
          isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="p-6">
            <div className="mb-6">
              <h3 className={`text-sm font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Form Elements
              </h3>
              <p className={`text-xs mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Drag and drop elements to build your form
              </p>
            </div>

            <div className="space-y-3">
              {enhancedPreBuiltElements.map((element, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => handleElementDragStart(e, element)}
                  className={`group flex items-center space-x-3 p-4 rounded-xl border cursor-grab hover:shadow-md transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 hover:bg-gray-750 hover:border-gray-600 text-white'
                      : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                    {element.icon}
                  </div>
                  <span className="font-medium text-sm flex-1">{element.label}</span>
                  <Plus size={16} className={`opacity-0 group-hover:opacity-100 transition-opacity ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Form Preview/Builder */}
        <div className={`flex-1 overflow-y-auto h-[calc(100vh-80px)] ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="p-8">
            <div className="max-w-3xl mx-auto mt-8">
              <Card className={`shadow-xl border-0 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <CardHeader className="text-center pb-8 pt-8">
                  <div className="space-y-4">
                    <CardTitle className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formData.formTitle}
                    </CardTitle>
                    {formData.formSubheading && (
                      <CardDescription className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {formData.formSubheading}
                      </CardDescription>
                    )}
                    
                    {(previewMode || !isBuilderMode) && renderMultiStepNav()}
                    
                    {previewMode && (
                      <Badge variant="secondary" className="mx-auto w-fit px-4 py-2">
                        <Eye size={14} className="mr-2" />
                        Live Preview Mode
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="px-8 pb-8">
                  {isMultiStep && (
                    <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
                      <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {formData.steps![currentStep]?.stepTitle}
                      </h3>
                      {formData.steps![currentStep]?.stepDescription && (
                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {formData.steps![currentStep].stepDescription}
                        </p>
                      )}
                    </div>
                  )}

                  <div
                    className={`space-y-6 ${isBuilderMode && !previewMode ? 'min-h-[400px]' : ''}`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e)}
                  >
                    {getCurrentFields().length === 0 && isBuilderMode && !previewMode ? (
                      <div className={`text-center py-16 border-2 border-dashed rounded-xl transition-colors ${
                        isDarkMode ? 'border-gray-600 text-gray-400 bg-gray-800/50' : 'border-gray-300 text-gray-500 bg-gray-50/50'
                      }`}>
                        <div className="space-y-4">
                          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <Plus size={24} className="text-white" />
                          </div>
                          <div>
                            <p className="text-lg font-medium mb-2">Start Building Your Form</p>
                            <p className="text-sm">
                              Drag and drop form elements from the left sidebar to build your {isMultiStep ? 'step' : 'form'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      getCurrentFields().map((field, index) => renderField(field, index))
                    )}
                    
                    {(!isBuilderMode || previewMode) && getCurrentFields().length > 0 && (
                      <div className="pt-8">
                        {isMultiStep ? (
                          <div className="flex justify-between">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={prevStep}
                              disabled={currentStep === 0}
                              className={`px-6 py-3 ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : ''}`}
                            >
                              <ChevronLeft size={16} className="mr-2" />
                              Previous
                            </Button>
                            
                            {currentStep === totalSteps - 1 ? (
                              <Button type="submit" className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                Submit Form
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                onClick={nextStep}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                              >
                                Next
                                <ChevronRight size={16} className="ml-2" />
                              </Button>
                            )}
                          </div>
                        ) : (
                          <Button type="submit" className="w-full py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            Submit Form
                          </Button>
                        )}
                      </div>
                    )}
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

export default FormBuilderWithSave