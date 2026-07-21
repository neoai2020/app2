'use client'

import { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin } from 'lucide-react'

interface Suggestion {
  label: string
  type: string
}

interface LocationAutocompleteProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const TYPE_LABELS: Record<string, string> = {
  city: 'City',
  town: 'City',
  village: 'City',
  county: 'County',
  state: 'State',
  country: 'Country'
}

/** Location input with smart autocomplete for cities, counties, states and countries. */
export function LocationAutocomplete({ value, onChange, placeholder }: LocationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Suppress the fetch triggered by picking a suggestion
  const skipNextFetch = useRef(false)

  useEffect(() => {
    if (skipNextFetch.current) {
      skipNextFetch.current = false
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)

    const query = value.trim()
    if (query.length < 2) {
      debounceRef.current = setTimeout(() => {
        setSuggestions([])
        setOpen(false)
      }, 0)
      return () => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
      }
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/locations/autocomplete?q=${encodeURIComponent(query)}`)
        if (!res.ok) return
        const data = (await res.json()) as { suggestions: Suggestion[] }
        setSuggestions(data.suggestions || [])
        setOpen((data.suggestions || []).length > 0)
        setHighlighted(-1)
      } catch {
        // network hiccup — keep typing experience silent
      }
    }, 250)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [value])

  // Close when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const pick = (suggestion: Suggestion) => {
    skipNextFetch.current = true
    onChange(suggestion.label)
    setOpen(false)
    setSuggestions([])
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted(h => (h + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted(h => (h <= 0 ? suggestions.length - 1 : h - 1))
    } else if (e.key === 'Enter' && highlighted >= 0) {
      e.preventDefault()
      pick(suggestions[highlighted])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full px-4 py-3 text-base rounded-lg cyber-input"
        />
        {/* Corner accents (matches Input component) */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#D946EF]/30 rounded-tl" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#D946EF]/30 rounded-tr" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#D946EF]/30 rounded-bl" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#D946EF]/30 rounded-br" />
      </div>

      <AnimatePresence>
        {open && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg border border-[#D946EF]/25 bg-[#14111a] shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur"
          >
            {suggestions.map((s, i) => (
              <li key={s.label}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(s)}
                  onMouseEnter={() => setHighlighted(i)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                    i === highlighted
                      ? 'bg-[#D946EF]/10 text-white'
                      : 'text-zinc-300 hover:bg-[#D946EF]/5'
                  }`}
                >
                  <MapPin size={14} className="shrink-0 text-[#D946EF]" />
                  <span className="flex-1 truncate">{s.label}</span>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                    {TYPE_LABELS[s.type] || 'Place'}
                  </span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
