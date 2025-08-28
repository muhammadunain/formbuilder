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
import { Trash2, GripVertical, Plus, Edit, Save, ChevronLeft, ChevronRight, Check } from "lucide-react"
import { preBuiltElements } from '@/constants/bgcode'

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

  const isMultiStep = formData.isMultiStep && formData.steps && formData.steps.length > 0
  const totalSteps = isMultiStep ? formData.steps!.length : 1

  const generateFieldId = () => {
    return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
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
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index < currentStep ? <Check size={16} /> : index + 1}
                </div>
                <div className="mt-2 text-xs text-center max-w-20">
                  <div className="font-medium truncate">{step.stepTitle}</div>
                </div>
              </div>
              {index < formData.steps!.length - 1 && (
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
          return (
            <Input
              type={fieldType}
              placeholder={placeholder}
              required={required}
              disabled={isBuilderMode}
            />
          )

        case 'textarea':
          return (
            <Textarea
              placeholder={placeholder}
              required={required}
              disabled={isBuilderMode}
              className="min-h-[100px]"
            />
          )

        case 'select':
        case 'dropdown':
          return (
            <Select disabled={isBuilderMode}>
              <SelectTrigger>
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
                  <Label htmlFor={`${fieldId}-${idx}`}>{option}</Label>
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
                    <Label htmlFor={`${fieldId}-${idx}`}>{option}</Label>
                  </div>
                ))}
              </div>
            )
          } else {
            return (
              <div className="flex items-center space-x-2">
                <Checkbox id={fieldId} disabled={isBuilderMode} />
                <Label htmlFor={fieldId}>{fieldLabel}</Label>
              </div>
            )
          }

        case 'date':
          return <Input type="date" disabled={isBuilderMode} />

        case 'file':
          return <Input type="file" disabled={isBuilderMode} />

        default:
          return (
            <Input
              type="text"
              placeholder={placeholder}
              disabled={isBuilderMode}
            />
          )
      }
    }

    return (
      <div
        key={fieldId}
        className={`relative group p-4 border rounded-lg ${isBuilderMode ? 'border-dashed border-gray-300 hover:border-blue-400' : 'border-gray-200'} transition-colors`}
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
            <div className="space-y-3 bg-gray-50 p-3 rounded">
              <Input
                value={field.fieldLabel}
                onChange={(e) => updateField(fieldId, { fieldLabel: e.target.value })}
                placeholder="Field Label"
              />
              <Input
                value={field.placeholder || ''}
                onChange={(e) => updateField(fieldId, { placeholder: e.target.value })}
                placeholder="Placeholder"
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={field.required}
                  onCheckedChange={(checked) => updateField(fieldId, { required: !!checked })}
                />
                <Label>Required</Label>
              </div>
              {(fieldType === 'select' || fieldType === 'radio' || fieldType === 'checkbox') && (
                <div>
                  <Label>Options (one per line)</Label>
                  <Textarea
                    value={field.options?.join('\n') || ''}
                    onChange={(e) => updateField(fieldId, { options: e.target.value.split('\n').filter(o => o.trim()) })}
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          ) : (
            <>
              <Label className="flex items-center">
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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Form Elements */}
      <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Form Elements</h2>
            <Button
              size="sm"
              onClick={() => setIsBuilderMode(!isBuilderMode)}
              variant={isBuilderMode ? "default" : "outline"}
            >
              {isBuilderMode ? 'Preview' : 'Edit'}
            </Button>
          </div>
          
          <div className="space-y-2">
            {preBuiltElements.map((element, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleElementDragStart(e, element)}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-grab hover:bg-gray-100 transition-colors"
              >
                <span className="text-lg">{element.icon}</span>
                <span className="font-medium text-sm">{element.label}</span>
                <Plus size={16} className="ml-auto text-gray-400" />
              </div>
            ))}
          </div>

          <Separator />

          {/* Form Settings */}
          <div>
            <h3 className="font-medium mb-3">Form Settings</h3>
            <div className="space-y-3">
              <div>
                <Label>Form Title</Label>
                <Input
                  value={formData.formTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, formTitle: e.target.value }))}
                  placeholder="Form Title"
                />
              </div>
              <div>
                <Label>Form Subheading</Label>
                <Textarea
                  value={formData.formSubheading}
                  onChange={(e) => setFormData(prev => ({ ...prev, formSubheading: e.target.value }))}
                  placeholder="Form description..."
                  className="min-h-[80px]"
                />
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
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-800">
                {formData.formTitle}
              </CardTitle>
              {formData.formSubheading && (
                <CardDescription className="text-gray-600 mt-2">
                  {formData.formSubheading}
                </CardDescription>
              )}
              
              {isMultiStep && !isBuilderMode && renderMultiStepNav()}
            </CardHeader>
            
            <CardContent>
              {isMultiStep && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {formData.steps![currentStep]?.stepTitle}
                  </h3>
                  {formData.steps![currentStep]?.stepDescription && (
                    <p className="text-gray-600 mt-1">
                      {formData.steps![currentStep].stepDescription}
                    </p>
                  )}
                </div>
              )}

              <div
                className={`space-y-6 ${isBuilderMode ? 'min-h-[300px]' : ''}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e)}
              >
                {getCurrentFields().length === 0 && isBuilderMode ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">
                      Drag and drop form elements here to build your {isMultiStep ? 'step' : 'form'}
                    </p>
                  </div>
                ) : (
                  getCurrentFields().map((field, index) => renderField(field, index))
                )}
                
                {!isBuilderMode && getCurrentFields().length > 0 && (
                  <div className="pt-4">
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
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading form...</div>
      </div>
    )
  }

  return <FormBuilder initialData={initialData || undefined} />
}

export default Forms