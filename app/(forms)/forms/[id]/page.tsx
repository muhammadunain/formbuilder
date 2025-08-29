'use client'

import { getFormById } from '@/lib/actions/create.form.action'
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
import { Trash2, GripVertical, Plus, Edit, Save, ChevronLeft, ChevronRight, Check, Share2, Eye, Moon, Sun, Copy, ExternalLink } from "lucide-react"
import { preBuiltElements } from '@/constants/bgcode'
import FormLoading from '@/components/home/module/Loading'

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

// Enhanced preBuiltElements with e-signature fields
const enhancedPreBuiltElements = [
  ...preBuiltElements,
  {
    icon: "✍️",
    label: "Signature",
    type: "signature",
    defaultField: {
      fieldType: "signature",
      fieldLabel: "Digital Signature",
      placeholder: "Click to sign",
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
  }
]

const FormBuilder = ({ initialData }: { initialData?: FormData }) => {
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

  const isMultiStep = formData.isMultiStep && formData.steps && formData.steps.length > 0
  const totalSteps = isMultiStep ? formData.steps!.length : 1

  const generateFieldId = () => {
    return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const generateShareLink = () => {
    // In a real app, this would generate an actual shareable link
  return window.location.href
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
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
    
    // Adding new element from sidebar
    if (draggedItem) {
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
      setDraggedItem(null)
    }
    
    // Reordering existing fields
    if (draggedFieldIndex !== null && dropIndex !== undefined && draggedFieldIndex !== dropIndex) {
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
      setDraggedFieldIndex(null)
    }
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
          return (
            <Input
              type={fieldType === 'company' || fieldType === 'title' ? 'text' : fieldType}
              placeholder={placeholder}
              required={required}
              disabled={isBuilderMode}
              className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}
            />
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
            <Input 
              type="date" 
              disabled={isBuilderMode}
              defaultValue={new Date().toISOString().split('T')[0]}
              className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}
            />
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
            <div className={`border-2 border-dashed rounded-lg h-32 flex items-center justify-center cursor-pointer transition-colors ${
              isDarkMode 
                ? 'border-gray-600 bg-gray-800 hover:border-gray-500 text-gray-300' 
                : 'border-gray-300 bg-gray-50 hover:border-gray-400 text-gray-600'
            } ${isBuilderMode ? 'pointer-events-none' : ''}`}>
              <div className="text-center">
                <div className="text-2xl mb-2">✍️</div>
                <div className="text-sm">Click to add signature</div>
              </div>
            </div>
          )

        case 'initial':
          return (
            <div className={`border-2 border-dashed rounded-lg h-20 flex items-center justify-center cursor-pointer transition-colors ${
              isDarkMode 
                ? 'border-gray-600 bg-gray-800 hover:border-gray-500 text-gray-300' 
                : 'border-gray-300 bg-gray-50 hover:border-gray-400 text-gray-600'
            } ${isBuilderMode ? 'pointer-events-none' : ''}`}>
              <div className="text-center">
                <div className="text-lg mb-1">📋</div>
                <div className="text-sm">Add initials</div>
              </div>
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
        className={`relative group p-4 border rounded-lg transition-colors ${
          isBuilderMode 
            ? isDarkMode
              ? 'border-dashed border-gray-600 hover:border-blue-400 bg-gray-900'
              : 'border-dashed border-gray-300 hover:border-blue-400'
            : isDarkMode
              ? 'border-gray-700 bg-gray-900'
              : 'border-gray-200'
        }`}
        draggable={isBuilderMode}
        onDragStart={(e) => handleFieldDragStart(e, index)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, index)}
      >
        {isBuilderMode && (
          <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditingField(isEditing ? null : fieldId)}
              className="h-6 w-6 p-0"
            >
              <Edit size={12} />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => removeField(fieldId)}
              className="h-6 w-6 p-0"
            >
              <Trash2 size={12} />
            </Button>
            <div className="cursor-move p-1">
              <GripVertical size={12} />
            </div>
          </div>
        )}

        <div className="space-y-2">
          {isEditing ? (
            <div className={`space-y-3 p-3 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <Input
                value={field.fieldLabel}
                onChange={(e) => updateField(fieldId, { fieldLabel: e.target.value })}
                placeholder="Field Label"
                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
              />
              <Input
                value={field.placeholder || ''}
                onChange={(e) => updateField(fieldId, { placeholder: e.target.value })}
                placeholder="Placeholder"
                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
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
                    className={`mt-1 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                  />
                </div>
              )}
            </div>
          ) : (
            <>
              <Label className={`flex items-center ${isDarkMode ? 'text-gray-300' : ''}`}>
                {fieldLabel}
                {required && <span className="text-red-500 ml-1">*</span>}
                {isBuilderMode && (
                  <Badge variant="secondary" className="ml-2 text-xs">
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
    <div className={`flex h-screen ${themeClass}`}>
      {/* Left Sidebar - Form Elements */}
      <div className={`w-80 border-r p-4 overflow-y-auto ${
        isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : ''}`}>
              Form Elements
            </h2>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              </Button>
              <Button
                size="sm"
                onClick={() => setIsBuilderMode(!isBuilderMode)}
                variant={isBuilderMode ? "default" : "outline"}
              >
                {isBuilderMode ? 'Preview' : 'Edit'}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            {enhancedPreBuiltElements.map((element, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleElementDragStart(e, element)}
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-grab hover:bg-opacity-80 transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-white'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{element.icon}</span>
                <span className="font-medium text-sm">{element.label}</span>
                <Plus size={16} className={`ml-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
              </div>
            ))}
          </div>

          <Separator className={isDarkMode ? 'bg-gray-700' : ''} />

          {/* Form Settings */}
          <div>
            <h3 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : ''}`}>Form Settings</h3>
            <div className="space-y-3">
              <div>
                <Label className={isDarkMode ? 'text-gray-300' : ''}>Form Title</Label>
                <Input
                  value={formData.formTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, formTitle: e.target.value }))}
                  placeholder="Form Title"
                  className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}
                />
              </div>
              <div>
                <Label className={isDarkMode ? 'text-gray-300' : ''}>Form Subheading</Label>
                <Textarea
                  value={formData.formSubheading}
                  onChange={(e) => setFormData(prev => ({ ...prev, formSubheading: e.target.value }))}
                  placeholder="Form description..."
                  className={`min-h-[80px] ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}`}
                />
              </div>
              
              {/* Share & Preview Buttons */}
              <div className="space-y-2">
                <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full" variant="outline">
                      <Share2 size={16} className="mr-2" />
                      Share Form
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
                  className="w-full" 
                  variant="outline"
                  onClick={() => setPreviewMode(!previewMode)}
                >
                  <Eye size={16} className="mr-2" />
                  {previewMode ? 'Exit Preview' : 'Live Preview'}
                </Button>
              </div>

              <Button className="w-full" variant="outline">
                <Save size={16} className="mr-2" />
                Save Form
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Preview/Builder */}
      <div className={`flex-1 p-6 overflow-y-auto ${isDarkMode ? 'bg-gray-900' : ''}`}>
        <div className="max-w-2xl mx-auto">
          <Card className={`shadow-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
            <CardHeader className="text-center">
              <CardTitle className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {formData.formTitle}
              </CardTitle>
              {formData.formSubheading && (
                <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {formData.formSubheading}
                </CardDescription>
              )}
              
              {(previewMode || !isBuilderMode) && renderMultiStepNav()}
              
              {previewMode && (
                <Badge variant="secondary" className="mx-auto w-fit">
                  <Eye size={14} className="mr-1" />
                  Live Preview Mode
                </Badge>
              )}
            </CardHeader>
            
            <CardContent>
              {isMultiStep && (
                <div className="mb-6">
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {formData.steps![currentStep]?.stepTitle}
                  </h3>
                  {formData.steps![currentStep]?.stepDescription && (
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {formData.steps![currentStep].stepDescription}
                    </p>
                  )}
                </div>
              )}

              <div
                className={`space-y-6 ${isBuilderMode && !previewMode ? 'min-h-[300px]' : ''}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e)}
              >
                {getCurrentFields().length === 0 && isBuilderMode && !previewMode ? (
                  <div className={`text-center py-12 border-2 border-dashed rounded-lg ${
                    isDarkMode ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-500'
                  }`}>
                    <p>
                      Drag and drop form elements here to build your {isMultiStep ? 'step' : 'form'}
                    </p>
                  </div>
                ) : (
                  getCurrentFields().map((field, index) => renderField(field, index))
                )}
                
                {(!isBuilderMode || previewMode) && getCurrentFields().length > 0 && (
                  <div className="pt-4">
                    {isMultiStep ? (
                      <div className="flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={prevStep}
                          disabled={currentStep === 0}
                          className={isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : ''}
                        >
                          <ChevronLeft size={16} className="mr-2" />
                          Previous
                        </Button>
                        
                        {currentStep === totalSteps - 1 ? (
                          <Button type="submit">
                            Submit Form
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
                      <Button type="submit" className="w-full">
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
  )
}

const Forms = ({ params }: { params: Promise<{ id: string }> }) => {
  const [initialData, setInitialData] = useState<FormData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadForm = async () => {
      const { id } = await params
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
    return (
      <FormLoading/>
    )
  }

  return <FormBuilder initialData={initialData || undefined} />
}

export default Forms