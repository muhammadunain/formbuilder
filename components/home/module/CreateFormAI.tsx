'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CreateForm } from '@/lib/actions/create.form.action'
import { Loader, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

const demoPrompts = [
  'Create a signup form with name, email, and password',
  'Generate a feedback form with rating, comments, and email',
  'Build a job application form with resume upload, name, and experience',
]

const CreateFormAI = () => {
  const [userInput, setUserInput] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const router = useRouter()

  const handleSubmit = async (): Promise<void> => {
    if (!userInput.trim()) {
      setError('Please enter form requirements')
      return
    }

    try {
      setLoading(true)
      setError('')
      const response = await CreateForm(userInput)
      
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

  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-10 rounded-2xl shadow-lg bg-white/10 ">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">AI Form Builder</h1>
        <p className="text-white text-lg">Describe your form, and let AI build it for you in seconds.</p>
      </div>

      {/* Input Section */}
      <div className="space-y-4">
        <Input
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          value={userInput}
          placeholder='e.g., "Create a contact form with name, email, phone, and message"'
          className="w-full text-white py-3"
          disabled={loading}
        />
        
        <Button
          disabled={loading || !userInput.trim()}
          onClick={handleSubmit}
          variant={'outline'}
          className="w-full py-3 cursor-pointer text-base font-medium"
        >
          {loading ? (
            <>
              <Loader className="animate-spin mr-2" size={16} />
              Generating...
            </>
          ) : (
            "Generate Form"
          )}
        </Button>
      </div>

      {/* Demo Prompts */}
      <div className="mt-8">
        <p className="text-sm text-gray-500 mb-3 text-center">Try one of these:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {demoPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => setUserInput(prompt)}
              className="px-3 py-1.5 text-sm rounded-full border text-white transition"
            >
              {prompt}
            </button>
          ))}
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
