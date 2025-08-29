'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { CreateForm } from '@/lib/actions/create.form.action'
import { Loader, AlertCircle, Layers, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'

const singleStepPrompts = [
  'Create a professional real estate property submission form',
  'Generate a feedback form with rating, comments, and email',
  'Build a contact form with name, email, phone, and message',
]

const multiStepPrompts = [
  'Create a comprehensive job application form with personal info, experience, and skills',
  'Build a user registration form with profile setup and preferences',
  'Generate a product order form with customer details, shipping, and payment',
]

const CreateFormAI = () => {
  const [userInput, setUserInput] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [isMultiStep, setIsMultiStep] = useState<boolean>(false)
  const router = useRouter()

  const handleSubmit = async (): Promise<void> => {
    if (!userInput.trim()) {
      setError('Please enter form requirements')
      return
    }

    try {
      setLoading(true)
      setError('')
      const response = await CreateForm(userInput, isMultiStep)
      
      if (response.success) {
        router.push(`/forms/${response.data?.id}`)
      } else {
        setError(response.error)
      }
    } catch (error: any) {
      console.error('Error Creating Form:', error)
      setError(error.message || 'An error occurred while creating the form')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading && userInput.trim()) {
      handleSubmit()
    }
  }

  const currentPrompts = isMultiStep ? multiStepPrompts : singleStepPrompts

  return (
    <div className="w-full max-w-3xl mx-auto  px-6 py-10 rounded-2xl shadow-lg bg-white/10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Form Builder</h1>
        <p className="text-lg">Describe your form, and let AI build it for you in seconds.</p>
      </div>

      {/* Form Type Switch */}
      <div className="flex items-center justify-center space-x-4 mb-6 p-4 bg-white/5 rounded-lg">
        <div className="flex items-center space-x-2">
          <FileText size={18} className={!isMultiStep ? "text-blue-400" : "text-gray-400"} />
          <Label htmlFor="form-type" className={!isMultiStep ? "text-blue-400" : "text-gray-400"}>
            Single Step
          </Label>
        </div>
        
        <Switch
          id="form-type"
          checked={isMultiStep}
          onCheckedChange={setIsMultiStep}
          disabled={loading}
          className='bg-black'
        />
        
        <div className="flex items-center space-x-2">
          <Layers size={18} className={isMultiStep ? "text-blue-400" : "text-gray-400"} />
          <Label htmlFor="form-type" className={isMultiStep ? "text-blue-400" : "text-gray-400"}>
            Multi-Step
          </Label>
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-4">
        <Input
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          value={userInput}
          placeholder={
            isMultiStep 
              ? 'e.g., "Create a job application with personal details, experience, and skills sections"'
              : 'e.g., "Create a contact form with name, email, phone, and message"'
          }
          className="w-full py-3"
          disabled={loading}
        />
        
        <Button
          disabled={loading || !userInput.trim()}
          onClick={handleSubmit}
          variant={'hero'}
          className="w-full py-3 cursor-pointer text-base font-medium"
        >
          {loading ? (
            <>
              <Loader className="animate-spin mr-2" size={16} />
              Generating {isMultiStep ? 'Multi-Step' : 'Single-Step'} Form...
            </>
          ) : (
            <>
              {isMultiStep ? <Layers className="mr-2" size={16} /> : <FileText className="mr-2" size={16} />}
              Generate {isMultiStep ? 'Multi-Step' : 'Single-Step'} Form
            </>
          )}
        </Button>
      </div>

      {/* Demo Prompts */}
      <div className="mt-8">
        <p className="text-sm text-gray-400 mb-3 text-center">
          Try one of these {isMultiStep ? 'multi-step' : 'single-step'} examples:
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {currentPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => setUserInput(prompt)}
              disabled={loading}
              className="px-3 py-1.5 text-sm rounded-full border border-white/20 hover:border-white/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Form Type Info */}
      <div className="mt-6 p-4 bg-white/5 rounded-lg">
        <div className="flex items-start space-x-3">
          {isMultiStep ? (
            <Layers className="text-blue-400 flex-shrink-0 mt-1" size={20} />
          ) : (
            <FileText className="text-blue-400 flex-shrink-0 mt-1" size={20} />
          )}
          <div>
            <h3 className="font-medium text-blue-400">
              {isMultiStep ? 'Multi-Step Form' : 'Single-Step Form'}
            </h3>
            <p className="text-sm text-gray-300 mt-1">
              {isMultiStep 
                ? 'Creates a form with multiple steps/sections for better user experience with complex forms.'
                : 'Creates a traditional single-page form with all fields on one page.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-6 w-full p-4 border border-red-200 rounded-lg bg-red-50 flex items-start gap-3">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-medium text-red-800">Error</h3>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateFormAI