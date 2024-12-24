import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Card, Title, AreaChart } from '@tremor/react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { Database } from '../../lib/database.types'

type RankingData = Database['public']['Tables']['rank_tracking']['Row']

export default function RankTracker() {
  const [rankings, setRankings] = useState<RankingData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRankings()
  }, [])

  const fetchRankings = async () => {
    try {
      const { data, error } = await supabase
        .from('rank_tracking')
        .select()
        .order('created_at', { ascending: true })

      if (error) throw error

      const rankingData = data as RankingData[]
      setRankings(rankingData)
    } catch (error) {
      console.error('Error fetching rankings:', error)
      toast.error('Failed to fetch ranking data')
    } finally {
      setLoading(false)
    }
  }

  const chartData = rankings.map(r => ({
    date: format(new Date(r.created_at), 'MMM d'),
    Position: r.position,
    Clicks: r.clicks,
    Impressions: r.impressions,
    'Click-through Rate': Math.round(r.ctr * 100)
  }))

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Rank Tracking</h2>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading rankings data...</div>
      ) : rankings.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No ranking data available yet</div>
      ) : (
        <div className="space-y-6">
          <Card>
            <Title>Average Position Over Time</Title>
            <AreaChart
              className="mt-4 h-72"
              data={chartData}
              index="date"
              categories={["Position"]}
              colors={["indigo"]}
              valueFormatter={(value) => `${value.toFixed(1)}`}
            />
          </Card>

          <Card>
            <Title>Clicks and Impressions</Title>
            <AreaChart
              className="mt-4 h-72"
              data={chartData}
              index="date"
              categories={["Clicks", "Impressions"]}
              colors={["emerald", "blue"]}
              valueFormatter={(value) => Math.round(value).toString()}
            />
          </Card>

          <Card>
            <Title>Click-through Rate (%)</Title>
            <AreaChart
              className="mt-4 h-72"
              data={chartData}
              index="date"
              categories={["Click-through Rate"]}
              colors={["orange"]}
              valueFormatter={(value) => `${value}%`}
            />
          </Card>
        </div>
      )}
    </div>
  )
}
