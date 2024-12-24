import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Card, Title, Text } from '@tremor/react'
import { Search, Loader2 } from 'lucide-react'

interface KeywordCluster {
  informational: string[]
  navigational: string[]
  transactional: string[]
}

export default function KeywordAnalysis() {
  const [keywords, setKeywords] = useState('')
  const [loading, setLoading] = useState(false)
  const [clusters, setClusters] = useState<KeywordCluster | null>(null)

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase.functions.invoke('analyze-keywords', {
        body: JSON.stringify({
          keywords: keywords.split(',').map(k => k.trim()),
          user_id: user.id
        })
      })

      if (error) throw error

      setClusters(data.clusters)
      toast.success('Keywords analyzed successfully!')
    } catch (error) {
      toast.error('Failed to analyze keywords')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3">
          <Card>
            <div className="flex items-center space-x-2 mb-6">
              <Search className="w-6 h-6 text-indigo-600" />
              <Title>Keyword Analysis</Title>
            </div>
            
            <form onSubmit={handleAnalyze} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords
                </label>
                <div className="relative">
                  <textarea
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 resize-none font-mono text-sm leading-relaxed"
                    placeholder="Enter keywords separated by commas&#10;Example: seo tools, keyword research, backlink checker"
                    rows={10}
                    required
                    style={{ minHeight: '200px' }}
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                    {keywords.split(',').filter(k => k.trim()).length} keywords
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Keywords'
                )}
              </button>
            </form>
          </Card>
        </div>

        <div className="lg:w-2/3">
          {clusters ? (
            <div className="space-y-6">
              <Card>
                <Title>Informational Intent</Title>
                <Text className="mt-4">
                  Keywords that indicate users are seeking information or answers.
                </Text>
                <div className="mt-4 flex flex-wrap gap-2">
                  {clusters.informational.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </Card>
              
              <Card>
                <Title>Navigational Intent</Title>
                <Text className="mt-4">
                  Keywords that suggest users are looking for specific websites or pages.
                </Text>
                <div className="mt-4 flex flex-wrap gap-2">
                  {clusters.navigational.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </Card>
              
              <Card>
                <Title>Transactional Intent</Title>
                <Text className="mt-4">
                  Keywords that indicate users are ready to take action or make a purchase.
                </Text>
                <div className="mt-4 flex flex-wrap gap-2">
                  {clusters.transactional.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </Card>
            </div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No keywords analyzed</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Enter your keywords in the form and click analyze to see the results.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
