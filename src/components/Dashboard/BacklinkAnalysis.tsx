import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Card, Title, Text, Metric, Flex } from '@tremor/react'
import { Link2, AlertTriangle } from 'lucide-react'

interface BacklinkAnalysis {
  toxic_links: Array<{ url: string; reason: string }>
  opportunities: Array<{ domain: string; relevance: number; strategy: string }>
  metrics: {
    total_backlinks: number
    toxic_percentage: number
    domain_authority: number
  }
}

export default function BacklinkAnalysis() {
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<BacklinkAnalysis | null>(null)

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.functions.invoke('analyze-backlinks', {
        body: JSON.stringify({ domain })
      })

      if (error) throw error

      setAnalysis(data.analysis)
      toast.success('Backlink analysis completed!')
    } catch (error) {
      toast.error('Failed to analyze backlinks')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Backlink Analysis</h2>
      
      <form onSubmit={handleAnalyze} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter domain (e.g., example.com)"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Analyzing...' : 'Analyze Backlinks'}
          </button>
        </div>
      </form>

      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <Title>Domain Metrics</Title>
            <div className="mt-4 space-y-2">
              <Metric>{analysis.metrics.domain_authority}</Metric>
              <Text>Domain Authority</Text>
            </div>
            <div className="mt-4">
              <Flex className="mt-4">
                <Text>Total Backlinks</Text>
                <Text>{analysis.metrics.total_backlinks}</Text>
              </Flex>
              <Flex className="mt-2">
                <Text>Toxic Percentage</Text>
                <Text className="text-red-500">{analysis.metrics.toxic_percentage}%</Text>
              </Flex>
            </div>
          </Card>

          <Card>
            <Title>Toxic Links</Title>
            <div className="mt-4 space-y-2">
              {analysis.toxic_links.map((link, index) => (
                <div key={index} className="flex items-start space-x-2 p-2 bg-red-50 rounded-md">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-1" />
                  <div>
                    <Text className="font-medium">{link.url}</Text>
                    <Text className="text-sm text-gray-500">{link.reason}</Text>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="md:col-span-2">
            <Title>Link-Building Opportunities</Title>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.opportunities.map((opportunity, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <Flex>
                    <div className="flex items-center space-x-2">
                      <Link2 className="w-5 h-5 text-indigo-500" />
                      <Text className="font-medium">{opportunity.domain}</Text>
                    </div>
                    <Text>Relevance: {opportunity.relevance}/10</Text>
                  </Flex>
                  <div className="mt-2">
                    <Text className="text-sm text-gray-600">{opportunity.strategy}</Text>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
