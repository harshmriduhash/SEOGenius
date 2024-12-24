import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Card, Title, Text, Metric, ProgressBar, Flex } from '@tremor/react'
import { MapPin, Star, MessageCircle, TrendingUp } from 'lucide-react'

interface GMBData {
  reviews: Array<{
    rating: number
    text: string
    sentiment: string
  }>
  metrics: {
    total_reviews: number
    average_rating: number
    positive_sentiment_percentage: number
  }
}

interface LocalSEOAnalysis {
  gmb_data: GMBData
  local_keywords: string[]
  recommendations: string[]
}

export default function LocalSEO() {
  const [businessName, setBusinessName] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<LocalSEOAnalysis | null>(null)

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.functions.invoke('local-seo-analysis', {
        body: JSON.stringify({ businessName })
      })

      if (error) throw error

      setAnalysis(data.analysis)
      toast.success('Local SEO analysis completed!')
    } catch (error) {
      toast.error('Failed to analyze local SEO')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Local SEO Analysis</h2>
      
      <form onSubmit={handleAnalyze} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter business name"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Analyzing...' : 'Analyze Local SEO'}
          </button>
        </div>
      </form>

      {analysis && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <Title>Rating Overview</Title>
              </div>
              <Metric className="mt-4">{analysis.gmb_data.metrics.average_rating.toFixed(1)}</Metric>
              <Text>Average Rating</Text>
              <ProgressBar
                className="mt-4"
                value={analysis.gmb_data.metrics.positive_sentiment_percentage}
                color="yellow"
              />
              <Text className="mt-2">{analysis.gmb_data.metrics.positive_sentiment_percentage}% Positive Sentiment</Text>
            </Card>

            <Card>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-500" />
                <Title>Review Metrics</Title>
              </div>
              <Metric className="mt-4">{analysis.gmb_data.metrics.total_reviews}</Metric>
              <Text>Total Reviews</Text>
            </Card>

            <Card>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <Title>Local Keywords</Title>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {analysis.local_keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          <Card>
            <Title>Recent Reviews</Title>
            <div className="mt-4 space-y-4">
              {analysis.gmb_data.reviews.map((review, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <Flex>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`text-sm px-2 py-1 rounded ${
                      review.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                      review.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {review.sentiment}
                    </span>
                  </Flex>
                  <Text className="mt-2">{review.text}</Text>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-500" />
              <Title>Local SEO Recommendations</Title>
            </div>
            <div className="mt-4 space-y-2">
              {analysis.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-indigo-50 rounded-lg">
                  <div className="w-6 h-6 flex items-center justify-center bg-indigo-100 rounded-full mt-0.5">
                    <Text className="font-bold">{index + 1}</Text>
                  </div>
                  <Text>{recommendation}</Text>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
