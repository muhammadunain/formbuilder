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
import { Trash2, GripVertical, Plus, Edit, Save, Copy, Eye, ExternalLink, Check } from "lucide-react"

interface FormField {
  fieldId: string
  fieldType: string
  fieldName: string
  fieldLabel: string
  placeholder?: string
  required: boolean
  validation: string
  options?: string[]
}

interface FormData {
  formTitle: string
  formSubheading: string
  formFields: FormField[]
}

// Pre-built form elements for the sidebar
const preBuiltElements = [
  {
    type: 'text',
    label: 'Text Input',
    icon: '📝',
    defaultField: {
      fieldType: 'text',
      fieldLabel: 'Text Field',
      placeholder: 'Enter text...',
      required: false,
      validation: 'nonEmpty'
    }
  },
  {
    type: 'email',
    label: 'Email Input',
    icon: '📧',
    defaultField: {
      fieldType: 'email',
      fieldLabel: 'Email Address',
      placeholder: 'Enter email...',
      required: true,
      validation: 'email'
    }
  },
  {
    type: 'tel',
    label: 'Phone Input',
    icon: '📞',
    defaultField: {
      fieldType: 'tel',
      fieldLabel: 'Phone Number',
      placeholder: 'Enter phone...',
      required: false,
      validation: 'phone'
    }
  },
  {
    type: 'textarea',
    label: 'Textarea',
    icon: '📄',
    defaultField: {
      fieldType: 'textarea',
      fieldLabel: 'Message',
      placeholder: 'Enter your message...',
      required: false,
      validation: 'nonEmpty'
    }
  },
  {
    type: 'select',
    label: 'Dropdown',
    icon: '📋',
    defaultField: {
      fieldType: 'select',
      fieldLabel: 'Select Option',
      placeholder: 'Choose an option...',
      required: false,
      validation: 'nonEmpty',
      options: ['Option 1', 'Option 2', 'Option 3']
    }
  },
  {
    type: 'radio',
    label: 'Radio Buttons',
    icon: '🔘',
    defaultField: {
      fieldType: 'radio',
      fieldLabel: 'Choose One',
      required: false,
      validation: 'nonEmpty',
      options: ['Option 1', 'Option 2', 'Option 3']
    }
  },
  {
    type: 'checkbox',
    label: 'Checkboxes',
    icon: '☑️',
    defaultField: {
      fieldType: 'checkbox',
      fieldLabel: 'Select Multiple',
      required: false,
      validation: 'nonEmpty',
      options: ['Option 1', 'Option 2', 'Option 3']
    }
  },
  {
    type: 'number',
    label: 'Number Input',
    icon: '🔢',
    defaultField: {
      fieldType: 'number',
      fieldLabel: 'Number',
      placeholder: 'Enter number...',
      required: false,
      validation: 'number'
    }
  },
  {
    type: 'date',
    label: 'Date Picker',
    icon: '📅',
    defaultField: {
      fieldType: 'date',
      fieldLabel: 'Date',
      required: false,
      validation: 'date'
    }
  },
  {
    type: 'file',
    label: 'File Upload',
    icon: '📎',
    defaultField: {
      fieldType: 'file',
      fieldLabel: 'Upload File',
      required: false,
      validation: 'file'
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
  const [editingField, setEditingField] = useState<string | null>(null)
  const [isBuilderMode, setIsBuilderMode] = useState(true)
  const [showLivePreview, setShowLivePreview] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copyType, setCopyType] = useState<'json' | 'html' | null>(null)

  const generateFieldId = () => {
    return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const handleDragStart = (e: React.DragEvent, element: any) => {
    setDraggedItem(element)
    e.dataTransfer.effectAllowed = 'copy'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedItem) {
      const newField: FormField = {
        ...draggedItem.defaultField,
        fieldId: generateFieldId(),
        fieldName: draggedItem.defaultField.fieldLabel.toLowerCase().replace(/\s+/g, '_')
      }
      
      setFormData(prev => ({
        ...prev,
        formFields: [...prev.formFields, newField]
      }))
      setDraggedItem(null)
    }
  }

  const removeField = (fieldId: string) => {
    setFormData(prev => ({
      ...prev,
      formFields: prev.formFields.filter(field => field.fieldId !== fieldId)
    }))
  }

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFormData(prev => ({
      ...prev,
      formFields: prev.formFields.map(field => 
        field.fieldId === fieldId ? { ...field, ...updates } : field
      )
    }))
  }

  const moveField = (fromIndex: number, toIndex: number) => {
    setFormData(prev => {
      const newFields = [...prev.formFields]
      const [removed] = newFields.splice(fromIndex, 1)
      newFields.splice(toIndex, 0, removed)
      return { ...prev, formFields: newFields }
    })
  }

  // Copy functionality
  const copyFormAsJSON = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(formData, null, 2))
      setCopied(true)
      setCopyType('json')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy JSON:', err)
    }
  }

  const generateHTMLForm = () => {
    const htmlFields = formData.formFields.map(field => {
      const { fieldId, fieldType, fieldLabel, placeholder, required, options } = field
      
      switch (fieldType) {
        case 'text':
        case 'email':
        case 'tel':
        case 'password':
        case 'url':
        case 'number':
        case 'date':
          return `    <div class="form-group">
      <label for="${fieldId}">${fieldLabel}${required ? ' *' : ''}</label>
      <input type="${fieldType}" id="${fieldId}" name="${fieldId}" placeholder="${placeholder || ''}"${required ? ' required' : ''} />
    </div>`

        case 'textarea':
          return `    <div class="form-group">
      <label for="${fieldId}">${fieldLabel}${required ? ' *' : ''}</label>
      <textarea id="${fieldId}" name="${fieldId}" placeholder="${placeholder || ''}"${required ? ' required' : ''}></textarea>
    </div>`

        case 'select':
          return `    <div class="form-group">
      <label for="${fieldId}">${fieldLabel}${required ? ' *' : ''}</label>
      <select id="${fieldId}" name="${fieldId}"${required ? ' required' : ''}>
        <option value="">${placeholder || `Select ${fieldLabel}`}</option>
${options?.map(option => `        <option value="${option}">${option}</option>`).join('\n') || ''}
      </select>
    </div>`

        case 'radio':
          return `    <div class="form-group">
      <fieldset>
        <legend>${fieldLabel}${required ? ' *' : ''}</legend>
${options?.map((option, idx) => `        <div>
          <input type="radio" id="${fieldId}-${idx}" name="${fieldId}" value="${option}"${required && idx === 0 ? ' required' : ''} />
          <label for="${fieldId}-${idx}">${option}</label>
        </div>`).join('\n') || ''}
      </fieldset>
    </div>`

        case 'checkbox':
          if (options && options.length > 1) {
            return `    <div class="form-group">
      <fieldset>
        <legend>${fieldLabel}${required ? ' *' : ''}</legend>
${options.map((option, idx) => `        <div>
          <input type="checkbox" id="${fieldId}-${idx}" name="${fieldId}[]" value="${option}" />
          <label for="${fieldId}-${idx}">${option}</label>
        </div>`).join('\n')}
      </fieldset>
    </div>`
          } else {
            return `    <div class="form-group">
      <div>
        <input type="checkbox" id="${fieldId}" name="${fieldId}"${required ? ' required' : ''} />
        <label for="${fieldId}">${fieldLabel}${required ? ' *' : ''}</label>
      </div>
    </div>`
          }

        case 'file':
          return `    <div class="form-group">
      <label for="${fieldId}">${fieldLabel}${required ? ' *' : ''}</label>
      <input type="file" id="${fieldId}" name="${fieldId}"${required ? ' required' : ''} />
    </div>`

        default:
          return `    <div class="form-group">
      <label for="${fieldId}">${fieldLabel}${required ? ' *' : ''}</label>
      <input type="text" id="${fieldId}" name="${fieldId}" placeholder="${placeholder || ''}"${required ? ' required' : ''} />
    </div>`
      }
    }).join('\n\n')

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formData.formTitle}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        .form-container { background: #f9f9f9; padding: 30px; border-radius: 8px; }
        .form-group { margin-bottom: 20px; }
        label, legend { display: block; margin-bottom: 5px; font-weight: bold; }
        input, textarea, select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }
        textarea { resize: vertical; min-height: 100px; }
        fieldset { border: none; padding: 0; margin: 0; }
        fieldset div { margin-bottom: 10px; }
        fieldset input[type="radio"], fieldset input[type="checkbox"] { width: auto; margin-right: 8px; }
        button { background: #007cba; color: white; padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
        button:hover { background: #005a8b; }
        .required { color: #d00; }
    </style>
</head>
<body>
    <div class="form-container">
        <h1>${formData.formTitle}</h1>
        ${formData.formSubheading ? `<p>${formData.formSubheading}</p>` : ''}
        
        <form method="POST" action="#">
${htmlFields}

            <div class="form-group">
                <button type="submit">Submit Form</button>
            </div>
        </form>
    </div>
</body>
</html>`
  }

  const copyFormAsHTML = async () => {
    try {
      await navigator.clipboard.writeText(generateHTMLForm())
      setCopied(true)
      setCopyType('html')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy HTML:', err)
    }
  }

  const openLivePreview = () => {
    const htmlContent = generateHTMLForm()
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
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
        onDragStart={(e) => e.dataTransfer.setData('text/plain', index.toString())}
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
                onDragStart={(e) => handleDragStart(e, element)}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-grab hover:bg-gray-100 transition-colors"
              >
                <span className="text-lg">{element.icon}</span>
                <span className="font-medium text-sm">{element.label}</span>
                <Plus size={16} className="ml-auto text-gray-400" />
              </div>
            ))}
          </div>

          {/* Form Settings */}
          <div className="border-t pt-4">
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
            </CardHeader>
            
            <CardContent>
              <div
                className={`space-y-6 ${isBuilderMode ? 'min-h-[300px]' : ''}`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {formData.formFields.length === 0 && isBuilderMode ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">
                      Drag and drop form elements here to build your form
                    </p>
                  </div>
                ) : (
                  formData.formFields.map((field, index) => renderField(field, index))
                )}
                
                {!isBuilderMode && formData.formFields.length > 0 && (
                  <div className="pt-4">
                    <Button type="submit" className="w-full">
                      Submit Form
                    </Button>
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