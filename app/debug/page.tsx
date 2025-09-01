'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { submitFormResponse } from '@/lib/actions/form.response.action'

const DebugPage = () => {
  const [formId, setFormId] = useState('')
  const [testData, setTestData] = useState('{"name": "Test User", "email": "test@example.com"}')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleTest = async () => {
    try {
      setLoading(true)
      setResult(null)
      
      let responseData
      try {
        responseData = JSON.parse(testData)
      } catch (e) {
        setResult({ success: false, error: 'Invalid JSON in test data' })
        return
      }

      const response = await submitFormResponse(
        formId,
        responseData,
        'test@example.com',
        'Test User'
      )

      setResult(response)
    } catch (error: any) {
      setResult({ success: false, error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Form Submission Debug</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Form ID</label>
              <Input
                value={formId}
                onChange={(e) => setFormId(e.target.value)}
                placeholder="Enter form ID to test"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Test Data (JSON)</label>
              <textarea
                className="w-full p-2 border rounded-md h-32"
                value={testData}
                onChange={(e) => setTestData(e.target.value)}
                placeholder="Enter test response data as JSON"
              />
            </div>

            <Button onClick={handleTest} disabled={loading || !formId}>
              {loading ? 'Testing...' : 'Test Form Submission'}
            </Button>

            {result && (
              <div className="mt-4 p-4 border rounded-md">
                <h3 className="font-medium mb-2">Result:</h3>
                <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DebugPage