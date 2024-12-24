import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Card, Title } from '@tremor/react'
import { Languages, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

const LANGUAGES = [
  { value: 'es', name: 'Spanish' },
  { value: 'fr', name: 'French' },
  { value: 'de', name: 'German' },
  { value: 'it', name: 'Italian' },
  { value: 'pt', name: 'Portuguese' },
  { value: 'nl', name: 'Dutch' },
  { value: 'ru', name: 'Russian' },
  { value: 'zh', name: 'Chinese' },
  { value: 'ja', name: 'Japanese' },
  { value: 'ko', name: 'Korean' }
]

export default function ContentTranslator() {
  const [content, setContent] = useState('')
  const [targetLanguage, setTargetLanguage] = useState('es')
  const [translatedContent, setTranslatedContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleTranslate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase.functions.invoke('translate-content', {
        body: JSON.stringify({
          content,
          targetLanguage,
          userId: user.id
        })
      })

      if (error) throw error

      setTranslatedContent(data.translatedContent)
      toast.success('Content translated successfully!')

      // Save to seo_content table instead
      const { error: saveError } = await supabase
        .from('seo_content')
        .insert({
          user_id: user.id,
          url: 'translation',
          title: `Translation to ${targetLanguage}`,
          content: data.translatedContent,
          description: content.substring(0, 200)
        })

      if (saveError) throw saveError

    } catch (error) {
      console.error('Error translating content:', error)
      toast.error('Failed to translate content')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <Card className="overflow-hidden">
        <div className="flex items-center space-x-2 mb-6">
          <Languages className="w-6 h-6 text-indigo-600" />
          <Title>Multilingual SEO Content Generator</Title>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <form onSubmit={handleTranslate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original Content
                </label>
                <div className="relative">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={12}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 resize-none font-mono text-sm leading-relaxed"
                    placeholder="Enter your content here..."
                    required
                    style={{ minHeight: '300px' }}
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                    {content.length} characters
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Language
                  </label>
                  <select
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Translating...
                    </>
                  ) : (
                    'Translate'
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            <div className="border-t lg:border-t-0 lg:border-l border-gray-200 lg:pl-6 pt-6 lg:pt-0">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Translated Content
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 min-h-[300px] prose prose-sm max-w-none">
                {translatedContent ? (
                  <div>{translatedContent}</div>
                ) : (
                  <p className="text-gray-400 italic">
                    Translated content will appear here...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
