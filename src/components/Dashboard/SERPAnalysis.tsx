import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Card, Title, Text } from '@tremor/react'

interface SERPResult {
  position: number
  title: string
  description: string
  url: string
}

export default function SERPAnalysis() {
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<SERPResult[] | null>(null)

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.functions.invoke('analyze-serp', {
        body: JSON.stringify({ keyword })
      })

      if (error) throw error

      setResults(data.results)
      toast.success('SERP analysis completed!')
    } catch (error) {
      toast.error('Failed to analyze SERP')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">SERP Analysis</h2>
      
      <form onSubmit={handleAnalyze} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Keyword</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter a keyword to analyze"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? 'Analyzing...' : 'Analyze SERP'}
        </button>
      </form>

      {results && (
        <div className="mt-8 space-y-4">
          {results.map((result) => (
            <Card key={result.position} className="p-4">
              <div className="flex items-start">
                <div className="w-8 h-8 flex items-center justify-center bg-indigo-100 rounded-full mr-4">
                  <Text className="font-bold">{result.position}</Text>
                </div>
                <div className="flex-1">
                  <Title className="text-indigo-600">{result.title}</Title>
                  <Text className="text-sm text-gray-500 break-all">{result.url}</Text>
                  <Text className="mt-2">{result.description}</Text>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
