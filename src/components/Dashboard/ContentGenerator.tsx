import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function ContentGenerator() {
  const [topic, setTopic] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [keywords, setKeywords] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Call Supabase Edge Function (needs to be created in Supabase Dashboard)
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: JSON.stringify({
          topic,
          targetAudience,
          keywords: keywords.split(',').map(k => k.trim()),
        })
      })

      if (error) throw error

      // Save the generated content
      const { error: saveError } = await supabase
        .from('seo_content')
        .insert({
          user_id: user.id,
          title: topic,
          keywords: keywords.split(',').map(k => k.trim()),
          target_audience: targetAudience,
          content: data.content,
          status: 'draft'
        })

      if (saveError) throw saveError

      toast.success('Content generated successfully!')
    } catch (error) {
      toast.error('Failed to generate content')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Generate SEO Content</h2>
      <form onSubmit={handleGenerate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter your topic"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Target Audience</label>
          <input
            type="text"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Define your target audience"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Keywords (comma-separated)</label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="keyword1, keyword2, keyword3"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? 'Generating...' : 'Generate Content'}
        </button>
      </form>
    </div>
  )
}
