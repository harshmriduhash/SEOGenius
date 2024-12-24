import { useEffect, useState } from 'react'
import { Card, Title, AreaChart, BarChart, Metric, Text, Grid, Flex } from '@tremor/react'
import { supabase } from '../../lib/supabase'
import { ArrowUp, Link, FileText, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Database } from '../../lib/database.types'

type RankTracking = Database['public']['Tables']['rank_tracking']['Row']
type Backlink = Database['public']['Tables']['backlinks']['Row']
type SeoContent = Database['public']['Tables']['seo_content']['Row']

interface DashboardMetrics {
  content_score: number
  keyword_rankings: {
    date: string
    position: number
  }[]
  backlinks: {
    date: string
    count: number
  }[]
  content_performance: {
    date: string
    views: number
    conversions: number
  }[]
}

export default function MainDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const [rankingsData, backlinksData, contentData] = await Promise.all([
        supabase
          .from('rank_tracking')
          .select()
          .order('created_at', { ascending: true }),
        supabase
          .from('backlinks')
          .select()
          .order('created_at', { ascending: true }),
        supabase
          .from('seo_content')
          .select()
          .order('created_at', { ascending: true })
      ])

      const rankings = rankingsData.data as RankTracking[] | null
      const backlinks = backlinksData.data as Backlink[] | null
      const content = contentData.data as SeoContent[] | null

      setMetrics({
        content_score: 85,
        keyword_rankings: rankings?.map(r => ({
          date: new Date(r.created_at).toLocaleDateString(),
          position: r.position
        })) || [],
        backlinks: backlinks?.map(b => ({
          date: new Date(b.created_at).toLocaleDateString(),
          count: 1 // Aggregate by date if needed
        })) || [],
        content_performance: content?.map(c => ({
          date: new Date(c.created_at).toLocaleDateString(),
          views: Math.floor(Math.random() * 1000), // Replace with actual metrics
          conversions: Math.floor(Math.random() * 100)
        })) || []
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor your SEO performance metrics and rankings
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Refresh Data
        </button>
      </div>

      <Grid numItemsMd={2} numItemsLg={3} className="gap-6">
        <Card className="max-w-lg">
          <Flex alignItems="start">
            <div>
              <Text>Content Score</Text>
              <Metric>{metrics?.content_score || 0}%</Metric>
            </div>
            <ArrowUp className="w-5 h-5 text-emerald-500" />
          </Flex>
        </Card>
        <Card className="max-w-lg">
          <Flex alignItems="start">
            <div>
              <Text>Total Backlinks</Text>
              <Metric>{metrics?.backlinks.length || 0}</Metric>
            </div>
            <Link className="w-5 h-5 text-blue-500" />
          </Flex>
        </Card>
        <Card className="max-w-lg">
          <Flex alignItems="start">
            <div>
              <Text>Content Pieces</Text>
              <Metric>{metrics?.content_performance.length || 0}</Metric>
            </div>
            <FileText className="w-5 h-5 text-indigo-500" />
          </Flex>
        </Card>
      </Grid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Title>Keyword Rankings</Title>
          <AreaChart
            className="mt-4 h-72"
            data={metrics?.keyword_rankings || []}
            index="date"
            categories={["position"]}
            colors={["indigo"]}
            valueFormatter={(value) => `Position ${value}`}
            showLegend={false}
          />
        </Card>

        <Card>
          <Title>Backlink Growth</Title>
          <BarChart
            className="mt-4 h-72"
            data={metrics?.backlinks || []}
            index="date"
            categories={["count"]}
            colors={["blue"]}
            valueFormatter={(value) => String(value)}
            showLegend={false}
          />
        </Card>

        <Card className="lg:col-span-2">
          <Title>Content Performance</Title>
          <AreaChart
            className="mt-4 h-72"
            data={metrics?.content_performance || []}
            index="date"
            categories={["views", "conversions"]}
            colors={["indigo", "emerald"]}
            valueFormatter={(value) => String(value)}
          />
        </Card>
      </div>
    </div>
  )
}
