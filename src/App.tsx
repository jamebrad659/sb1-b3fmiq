import React, { useState, useCallback, useEffect } from 'react'
import { Upload, Send } from 'lucide-react'

function App() {
  const [image, setImage] = useState<File | null>(null)
  const [prompt, setPrompt] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Unhandled error:', event.error)
      setError('An unexpected error occurred. Please try again.')
    }

    window.addEventListener('error', handleError)

    return () => {
      window.removeEventListener('error', handleError)
    }
  }, [])

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files && e.target.files.length > 0) {
        setImage(e.target.files[0])
      }
    } catch (err) {
      console.error('Error handling image change:', err)
      setError('Error uploading image. Please try again.')
    }
  }, [])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (image && prompt) {
        setOutput(`Processing image "${image.name}" with prompt: "${prompt}"`)
        setError(null)
      } else {
        setOutput('')
        setError('Please provide both an image and a prompt.')
      }
    } catch (err) {
      console.error('Error handling submit:', err)
      setError('An error occurred while processing. Please try again.')
    }
  }, [image, prompt])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Image and Prompt Processor</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">{image ? image.name : 'PNG, JPG or GIF (MAX. 800x400px)'}</p>
                </div>
                <input id="image" type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
              Enter Prompt
            </label>
            <input
              type="text"
              id="prompt"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
          >
            <Send className="w-5 h-5 mr-2" />
            Process
          </button>
        </form>
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {output && (
          <div className="mt-6 p-4 bg-gray-100 rounded-md">
            <h2 className="text-lg font-semibold mb-2">Output:</h2>
            <p className="text-gray-700">{output}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App