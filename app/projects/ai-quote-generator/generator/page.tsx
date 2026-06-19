'use client'

import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'

const THEMES = [
  { id: 'motivational', label: '💪 Motivational', color: '#10b981' },
  { id: 'business', label: '💼 Business', color: '#3b82f6' },
  { id: 'tech', label: '💻 Technology', color: '#8b5cf6' },
  { id: 'philosophy', label: '🧠 Philosophy', color: '#f59e0b' },
  { id: 'success', label: '🚀 Success', color: '#ec4899' },
  { id: 'life', label: '✨ Life', color: '#06b6d4' },
]

const ANIMATION_STYLES = [
  'animate-fade-in-bounce',
  'animate-slide-up',
  'animate-pulse-glow',
  'animate-bounce-in',
  'animate-fade-in-scale',
]

export default function GeneratorPage() {
  const [selectedTheme, setSelectedTheme] = useState('motivational')
  const [quote, setQuote] = useState('')
  const [author, setAuthor] = useState('')
  const [loading, setLoading] = useState(false)
  const [favorites, setFavorites] = useState<Array<{ quote: string; author: string; theme: string }>>([])
  const [showFavorites, setShowFavorites] = useState(false)
  const [copied, setCopied] = useState(false)
  const [animationStyle, setAnimationStyle] = useState('animate-fade-in-bounce')
  const quoteRef = useRef<HTMLDivElement>(null)

  const generateQuote = async () => {
    setLoading(true)
    const randomAnimation = ANIMATION_STYLES[Math.floor(Math.random() * ANIMATION_STYLES.length)]
    setAnimationStyle(randomAnimation)
    try {
      const response = await fetch('/api/generate-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme: selectedTheme }),
      })

      const data = await response.json()
      console.log('API Response:', data, 'Status:', response.status)

      if (!response.ok) {
        console.error('API Error:', data)
        throw new Error(data.error || 'Failed to generate quote')
      }

      if (data.quote) {
        setQuote(data.quote)
        setAuthor(data.author)
      } else {
        throw new Error('No quote in response')
      }
    } catch (error) {
      console.error('Error generating quote:', error)
      setQuote('The only way to do great work is to love what you do.')
      setAuthor('Steve Jobs')
    } finally {
      setLoading(false)
    }
  }

  const saveFavorite = () => {
    if (quote && author) {
      setFavorites([...favorites, { quote, author, theme: selectedTheme }])
    }
  }

  const removeFavorite = (index: number) => {
    setFavorites(favorites.filter((_, i) => i !== index))
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`"${quote}" — ${author}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const exportAsImage = async () => {
    if (!quoteRef.current) return

    try {
      const canvas = await html2canvas(quoteRef.current, {
        backgroundColor: '#1f2937',
        scale: 2,
        logging: false,
      })

      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = `quote-${Date.now()}.png`
      link.click()
    } catch (error) {
      console.error('Error exporting image:', error)
    }
  }

  const shareToTwitter = () => {
    const text = `"${quote}" — ${author}`
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(twitterUrl, '_blank')
  }

  const clearQuote = () => {
    setQuote('')
    setAuthor('')
    setCopied(false)
  }

  const themeColor = THEMES.find((t) => t.id === selectedTheme)?.color || '#3b82f6'

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-500 to-cyan-300 p-4">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50 mb-8">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-white flex items-center gap-2 mb-4"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-white">✨ AI-Powered Quote Generator</h1>
          <p className="text-gray-300">Generate unique quotes powered by Claude AI</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Theme Selection */}
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
              <h2 className="text-lg font-bold text-white mb-4">Select Theme</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      selectedTheme === theme.id
                        ? `bg-opacity-100 text-white`
                        : 'bg-slate-800 text-white hover:bg-slate-700'
                    }`}
                    style={
                      selectedTheme === theme.id ? { backgroundColor: theme.color } : {}
                    }
                  >
                    {theme.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quote Display */}
            <div
              ref={quoteRef}
              className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-400 rounded-lg p-8 text-center"
              style={{
                borderLeft: `4px solid ${themeColor}`,
              }}
            >
              {quote ? (
                <div className={`space-y-4 ${animationStyle}`}>
                  <p className="text-3xl font-bold text-white leading-relaxed">"{quote}"</p>
                  <p className="text-xl text-white">— {author}</p>
                </div>
              ) : (
                <div className="text-gray-500 text-lg">
                  <p>✨ Select a theme and click generate to create a quote</p>
                </div>
              )}
            </div>

            {/* Generate and Clear Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={generateQuote}
                disabled={loading}
                className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-600 text-white font-bold py-4 rounded-lg transition text-lg"
              >
                {loading ? '🔄 Generating...' : '✨ Generate'}
              </button>
              <button
                onClick={clearQuote}
                className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                🗑️ Clear
              </button>
            </div>

            {/* Action Buttons */}
            {quote && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={copyToClipboard}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                >
                  {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
                <button
                  onClick={exportAsImage}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                >
                  🖼️ Export
                </button>
                <button
                  onClick={shareToTwitter}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                >
                  𝕏 Share
                </button>
                <button
                  onClick={saveFavorite}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                >
                  ❤️ Save
                </button>
              </div>
            )}
          </div>

          {/* Sidebar - Favorites */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">❤️ Favorites</h2>
                <span className="bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {favorites.length}
                </span>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {favorites.length === 0 ? (
                  <p className="text-white text-sm text-center py-4">
                    Save quotes to see them here
                  </p>
                ) : (
                  favorites.map((fav, index) => (
                    <div
                      key={index}
                      className="bg-blue-50 rounded-lg p-3 border border-gray-400 hover:border-gray-400 transition group"
                    >
                      <p className="text-white text-sm line-clamp-2 mb-2">"{fav.quote}"</p>
                      <p className="text-white text-xs mb-2">— {fav.author}</p>
                      <div className="flex items-center justify-between">
                        <span
                          className="text-xs px-2 py-1 rounded text-white"
                          style={{
                            backgroundColor: THEMES.find((t) => t.id === fav.theme)?.color,
                          }}
                        >
                          {THEMES.find((t) => t.id === fav.theme)?.label}
                        </span>
                        <button
                          onClick={() => removeFavorite(index)}
                          className="text-red-400 hover:text-red-300 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {favorites.length > 0 && (
                <button
                  onClick={() => setFavorites([])}
                  className="w-full mt-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-semibold py-2 rounded-lg transition text-sm"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Info Section */}
        <section className="mt-12 bg-slate-900 border border-slate-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: 1,
                title: 'Select Theme',
                desc: 'Choose a category like Motivational, Business, or Technology',
              },
              {
                num: 2,
                title: 'Generate',
                desc: 'Claude AI creates a unique, contextual quote instantly',
              },
              {
                num: 3,
                title: 'Share',
                desc: 'Copy, export as image, or share to social media',
              },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="bg-gray-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">
                  {step.num}
                </div>
                <h3 className="font-bold text-white mb-2">{step.title}</h3>
                <p className="text-white text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
