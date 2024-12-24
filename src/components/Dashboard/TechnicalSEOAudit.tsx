import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Card, Title, Text } from '@tremor/react'
import { Check, XCircle, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

interface SEOAudit {
  broken_links: Array<{ url: string; status: number }>
  meta_issues: Array<{ page: string; missing_tags: string[] }>
  performance: {
    page_speed: number
    core_web_vitals: {
      lcp: number
      fid: number
      cls: number
    }
  }
  recommendations: string[]
}

export default function TechnicalSEOAudit() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [audit, setAudit] = useState<SEOAudit | null>(null)

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.functions.invoke('technical-seo-audit', {
        body: JSON.stringify({ url })
      })

      if (error) throw error

      setAudit(data.auditResults)
      toast.success('Technical SEO audit completed!')
    } catch (error) {
      toast.error('Failed to perform SEO audit')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Technical SEO Audit</h2>
      
      <form onSubmit={handleAudit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter website URL"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Auditing...' : 'Run Audit'}
          </button>
        </div>
      </form>

      {audit && (
        <div className="space-y-6">
          <Card>
            <Title>Performance Metrics</Title>
            <div className="mt-4">
              <div className="mb-4">
                <Text>Page Speed Score</Text>
                <Text>{audit.performance.page_speed}</Text>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="mb-2">
                    <Text>Largest Contentful Paint (LCP)</Text>
                    <Text>{audit.performance.core_web_vitals.lcp}s</Text>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2.5 mb-4">
                    <div className="bg-emerald-500 h-2.5" style={{ width: `${Math.min(100, (audit.performance.core_web_vitals.lcp / 2.5) * 100)}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="mb-2">
                    <Text>First Input Delay (FID)</Text>
                    <Text>{audit.performance.core_web_vitals.fid}ms</Text>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2.5 mb-4">
                    <div className="bg-emerald-500 h-2.5" style={{ width: `${Math.min(100, (audit.performance.core_web_vitals.fid / 100) * 100)}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="mb-2">
                    <Text>Cumulative Layout Shift (CLS)</Text>
                    <Text>{audit.performance.core_web_vitals.cls}</Text>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2.5 mb-4">
                    <div className="bg-emerald-500 h-2.5" style={{ width: `${Math.min(100, (audit.performance.core_web_vitals.cls / 0.1) * 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <Title>Broken Links</Title>
              <div className="mt-4 space-y-2">
                {audit.broken_links.map((link, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-red-50 rounded-md">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <div>
                      <Text className="font-medium">{link.url}</Text>
                      <Text className="text-sm text-red-500">Status: {link.status}</Text>
                    </div>
                  </div>
                ))}
                {audit.broken_links.length === 0 && (
                  <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-md">
                    <Check className="w-5 h-5 text-green-500" />
                    <Text>No broken links found</Text>
                  </div>
                )}
              </div>
            </Card>

            <Card>
              <Title>Meta Tag Issues</Title>
              <div className="mt-4 space-y-2">
                {audit.meta_issues.map((issue, index) => (
                  <div key={index} className="p-2 bg-yellow-50 rounded-md">
                    <Text className="font-medium">{issue.page}</Text>
                    <div className="mt-1 space-x-1">
                      {issue.missing_tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card>
            <Title>Recommendations</Title>
            <div className="mt-4 space-y-2">
              {audit.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-2 p-2">
                  <Zap className="w-5 h-5 text-indigo-500 mt-1" />
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
