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
        console.error('API Error Status:', response.status)
        console.error('API Error Full Response:', JSON.stringify(data, null, 2))
        throw new Error(data.details || data.error || 'Failed to generate quote')
      }

      if (data.quote) {
        setQuote(data.quote)
        setAuthor(data.author)
      } else {
        throw new Error('No quote in response')
      }
    } catch (error) {
      console.error('Error generating quote:', error)
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      setQuote(`Error: ${errorMsg}`)
      setAuthor('Check browser console for details')
      alert(`Quote Generation Failed:\n\n${errorMsg}\n\nMake sure ANTHROPIC_API_KEY is set in Vercel environment variables.`)
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
    <div className="min-h-screen p-4" style={{ background: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 50%, #A78BFA 100%)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 mb-8" style={{ backgroundColor: '#4C1D95', borderBottom: '3px solid #F59E0B' }}>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 mb-4 font-semibold transition"
            style={{ color: '#FCD34D' }}
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold" style={{ color: '#FFFFFF' }}>✨ AI-Powered Quote Generator</h1>
          <p style={{ color: '#E9D5FF' }}>Generate unique quotes powered by Claude AI</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Theme Selection */}
            <div className="rounded-lg p-6 border-2" style={{ backgroundColor: '#FFFFFF', borderColor: '#A78BFA' }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: '#5B21B6' }}>Select Theme</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`px-4 py-2 rounded-lg font-semibold transition text-white`}
                    style={{
                      backgroundColor: selectedTheme === theme.id ? theme.color : '#E9D5FF',
                      color: selectedTheme === theme.id ? '#FFFFFF' : '#5B21B6',
                      border: `2px solid ${theme.color}`,
                    }}
                  >
                    {theme.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quote Display */}
            <div
              ref={quoteRef}
              className="rounded-lg p-8 text-center border-2"
              style={{
                background: 'linear-gradient(135deg, #F3E8FF 0%, #FAF5FF 100%)',
                borderColor: '#A78BFA',
                borderLeft: `6px solid ${themeColor}`,
              }}
            >
              {quote ? (
                <div className={`space-y-4 ${animationStyle}`}>
                  <p className="text-3xl font-bold leading-relaxed" style={{ color: '#5B21B6' }}>"{quote}"</p>
                  <p className="text-xl" style={{ color: '#7C3AED' }}>— {author}</p>
                </div>
              ) : (
                <div className="text-lg" style={{ color: '#A78BFA' }}>
                  <p>✨ Select a theme and click generate to create a quote</p>
                </div>
              )}
            </div>

            {/* Generate and Clear Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={generateQuote}
                disabled={loading}
                className="font-bold py-4 rounded-lg transition text-lg text-white"
                style={{
                  backgroundColor: loading ? '#D1D5DB' : '#F59E0B',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? '🔄 Generating...' : '✨ Generate'}
              </button>
              <button
                onClick={clearQuote}
                className="font-semibold py-4 rounded-lg transition flex items-center justify-center gap-2 text-white"
                style={{ backgroundColor: '#7C3AED' }}
              >
                🗑️ Clear
              </button>
            </div>

            {/* Action Buttons */}
            {quote && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={copyToClipboard}
                  className="text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#7C3AED' }}
                >
                  {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
                <button
                  onClick={exportAsImage}
                  className="text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#7C3AED' }}
                >
                  🖼️ Export
                </button>
                <button
                  onClick={shareToTwitter}
                  className="text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#7C3AED' }}
                >
                  𝕏 Share
                </button>
                <button
                  onClick={saveFavorite}
                  className="text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#EC4899' }}
                >
                  ❤️ Save
                </button>
              </div>
            )}
          </div>

          {/* Sidebar - Favorites */}
          <div className="lg:col-span-1">
            <div className="rounded-lg p-6 sticky top-24 border-2" style={{ backgroundColor: '#FFFFFF', borderColor: '#A78BFA' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold" style={{ color: '#5B21B6' }}>❤️ Favorites</h2>
                <span className="text-xs font-bold px-2 py-1 rounded text-white" style={{ backgroundColor: '#EC4899' }}>
                  {favorites.length}
                </span>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {favorites.length === 0 ? (
                  <p className="text-sm text-center py-4" style={{ color: '#A78BFA' }}>
                    Save quotes to see them here
                  </p>
                ) : (
                  favorites.map((fav, index) => (
                    <div
                      key={index}
                      className="rounded-lg p-3 border-2 transition group"
                      style={{ backgroundColor: '#F3E8FF', borderColor: '#A78BFA' }}
                    >
                      <p className="text-sm line-clamp-2 mb-2" style={{ color: '#5B21B6' }}>"{fav.quote}"</p>
                      <p className="text-xs mb-2" style={{ color: '#7C3AED' }}>— {fav.author}</p>
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
                          className="text-xs"
                          style={{ color: '#EC4899' }}
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
                  className="w-full mt-4 font-semibold py-2 rounded-lg transition text-sm text-white"
                  style={{ backgroundColor: '#EC4899' }}
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Info Section */}
        <section className="mt-12 rounded-lg p-6 border-2" style={{ backgroundColor: '#FFFFFF', borderColor: '#A78BFA' }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#5B21B6' }}>How It Works</h2>
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
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3 text-white" style={{ backgroundColor: '#F59E0B' }}>
                  {step.num}
                </div>
                <h3 className="font-bold mb-2" style={{ color: '#5B21B6' }}>{step.title}</h3>
                <p className="text-sm" style={{ color: '#7C3AED' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
