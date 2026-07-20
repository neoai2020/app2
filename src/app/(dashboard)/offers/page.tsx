'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { HelpTooltip, QuickTip } from '@/components/ui/help-tooltip'
import { PageHeader } from '@/components/ui/page-header'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { PromoBanner } from '@/components/ui/promo-banner'
import { Offer } from '@/types/database'
import { scrollToResults } from '@/lib/scroll-to-results'
import { Plus, Edit, Trash2, ExternalLink, Gift, X, Briefcase, Handshake, DollarSign, Sparkles, RefreshCw, Save, Zap, Brain } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export type OfferType = 'Affiliate Offer' | 'Service Offer' | 'Partnership'

const NICHES = ['SaaS & Software', 'Real Estate', 'E-commerce', 'Digital Agencies', 'Coaching', 'Fitness', 'Crypto', 'Local Services']
const SERVICES = ['Digital Marketing', 'SEO Optimization', 'Web Design', 'UI/UX Design', 'Email Marketing', 'Content Creation', 'Performance Ads (PPC)', 'App Development', 'Copywriting']

const LOADING_PHRASES = [
  'AI is analyzing your niche...',
  'Researching top-converting offer angles...',
  'Crafting a high-impact email template...',
  'Optimizing for maximum engagement...',
  'Fine-tuning the copy for conversions...',
  'Adding professional finishing touches...',
  'Almost there — polishing your offer...',
]

const MAX_DAILY_GENERATIONS = 5
const GENERATION_RESET_MS = 24 * 60 * 60 * 1000

function getGenerationState(): { count: number; resetAt: number } {
  if (typeof window === 'undefined') return { count: 0, resetAt: 0 }
  try {
    const raw = localStorage.getItem('offer_gen_state')
    if (raw) {
      const state = JSON.parse(raw)
      if (Date.now() >= state.resetAt) {
        return { count: 0, resetAt: Date.now() + GENERATION_RESET_MS }
      }
      return state
    }
  } catch {}
  return { count: 0, resetAt: Date.now() + GENERATION_RESET_MS }
}

function saveGenerationState(state: { count: number; resetAt: number }) {
  if (typeof window === 'undefined') return
  localStorage.setItem('offer_gen_state', JSON.stringify(state))
}

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formStep, setFormStep] = useState<1 | 2>(1)
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null)
  
  const [activeTab, setActiveTab] = useState<'All' | OfferType>('All')
  const [type, setType] = useState<OfferType>('Affiliate Offer')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [link, setLink] = useState('')
  const [notes, setNotes] = useState('')
  
  const [selectedNiche, setSelectedNiche] = useState(NICHES[0])
  const [selectedService, setSelectedService] = useState(SERVICES[0])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [error, setError] = useState('')

  const [genCount, setGenCount] = useState(0)
  const [genResetAt, setGenResetAt] = useState(0)

  const [offerToDelete, setOfferToDelete] = useState<Offer | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [loadingPhrase, setLoadingPhrase] = useState(0)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [showOfferBanner, setShowOfferBanner] = useState(false)

  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const state = getGenerationState()
    setGenCount(state.count)
    setGenResetAt(state.resetAt)
  }, [])

  useEffect(() => {
    if (!generating) {
      setLoadingPhrase(0)
      setLoadingProgress(0)
      return
    }
    setLoadingProgress(0)
    const phraseInterval = setInterval(() => {
      setLoadingPhrase(prev => (prev + 1) % LOADING_PHRASES.length)
    }, 2800)
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 92) return prev
        const increment = prev < 30 ? 3 : prev < 60 ? 2 : prev < 80 ? 1 : 0.5
        return Math.min(prev + increment, 92)
      })
    }, 300)
    return () => {
      clearInterval(phraseInterval)
      clearInterval(progressInterval)
    }
  }, [generating])

  const remaining = MAX_DAILY_GENERATIONS - genCount

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== description) {
      editorRef.current.innerHTML = description || ''
    }
  }, [description])

  const fetchOffers = useCallback(async () => {
    try {
      const response = await fetch('/api/offers')
      const data = await response.json()
      if (data.offers) setOffers(data.offers)
    } catch (err) {
      console.error('Failed to fetch offers:', err)
    }
  }, [])

  useEffect(() => {
    fetchOffers()
  }, [fetchOffers])

  const resetForm = () => {
    setName('')
    setDescription('')
    setLink('')
    setNotes('')
    setType('Affiliate Offer')
    setSelectedNiche(NICHES[0])
    setSelectedService(SERVICES[0])
    setEditingOffer(null)
    setShowForm(false)
    setFormStep(1)
    setGenerated(false)
    setError('')
  }

  const generateDescription = async () => {
    let state = getGenerationState()
    if (state.count >= MAX_DAILY_GENERATIONS) {
      setError(`You've used all ${MAX_DAILY_GENERATIONS} daily generations. Resets in ${getTimeUntilReset(state.resetAt)}.`)
      return
    }

    setGenerating(true)
    setShowOfferBanner(true)
    setError('')
    try {
      const res = await fetch('/api/offers/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: selectedService,
          niche: selectedNiche,
          link: link,
          type: type,
          notes: notes
        })
      })
      const data = await res.json()
      if (!res.ok || !data.template) throw new Error(data.error || 'Failed to generate')
      
      setDescription(data.template)
      setGenerated(true)
      scrollToResults()

      state = getGenerationState()
      const newState = { count: state.count + 1, resetAt: state.resetAt }
      saveGenerationState(newState)
      setGenCount(newState.count)
      setGenResetAt(newState.resetAt)
    } catch (err) {
      console.error(err)
      let text = ''
      if (type === 'Affiliate Offer') {
        text = `Hi there,\n\nI wanted to share a resource that has been incredibly helpful. I believe it can add massive value to your workflow.\n\nYou can check it out here: ${link || '[Your Link]'}\n\nLet me know if you have any questions!\n\nBest,\n[Your Name]`
      } else if (type === 'Service Offer') {
        text = `Hi there,\n\nI was reviewing some of the great work you're doing in the ${selectedNiche} space.\n\nI specialize in ${selectedService} and have helped similar businesses scale their operations and achieve exceptional results. I'd love to explore how we could potentially add value to your team.\n\nYou can see my details here: ${link || '[Your Link]'}\n\nWould you be open to a quick 5-minute chat next week?\n\nBest,\n[Your Name]`
      } else if (type === 'Partnership') {
        text = `Hi there,\n\nI've been following your company's growth in the ${selectedNiche} industry and I'm really impressed.\n\nI believe our services complement each other perfectly, and there could be a highly beneficial partnership opportunity for us to explore.\n\nHere is a link to what we do: ${link || '[Your Link]'}\n\nAre you open to a brief introductory call to discuss potential synergies?\n\nBest,\n[Your Name]`
      }
      setDescription(text)
      setGenerated(true)
      scrollToResults()

      state = getGenerationState()
      const newState = { count: state.count + 1, resetAt: state.resetAt }
      saveGenerationState(newState)
      setGenCount(newState.count)
      setGenResetAt(newState.resetAt)
    } finally {
      setGenerating(false)
    }
  }

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer)
    setName(offer.name)
    setDescription(offer.description)
    setLink(offer.link || '')
    setNotes(offer.notes || '')
    if (offer.type) setType(offer.type as OfferType)
    setShowForm(true)
    setFormStep(2)
    setGenerated(true)
  }

  const handleSave = async () => {
    if (!name || !description) {
      setError('Name and description required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const method = editingOffer ? 'PUT' : 'POST'
      const body = editingOffer
        ? { id: editingOffer.id, name, description, link, notes, type }
        : { name, description, link, notes, type }

      const response = await fetch('/api/offers', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Operation failed')
      }

      await fetchOffers()
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed')
    } finally {
      setLoading(false)
    }
  }

  const confirmDelete = async () => {
    if (!offerToDelete) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/offers?id=${offerToDelete.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Deletion failed')
      await fetchOffers()
      setOfferToDelete(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deletion failed')
      setOfferToDelete(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <PageHeader
          eyebrow="Library"
          title={
            <span className="flex items-center gap-3">
              Offer Library
              <HelpTooltip
                variant="info"
                title="What's an offer?"
                content="An offer is simply what you're emailing people about — a product, a service, or a deal you want them to check out. Save your offers here so you can reuse them in your emails."
              />
            </span>
          }
          subtitle="Manage reusable offer templates for campaigns"
          actions={
            <>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                <Zap className="w-4 h-4 text-[#D946EF]" />
                <span className="text-sm font-medium text-zinc-300">
                  <span className={`font-bold ${remaining <= 1 ? 'text-red-400' : 'text-[#D946EF]'}`}>{remaining}</span>
                  <span className="text-zinc-500">/{MAX_DAILY_GENERATIONS} AI generations left</span>
                </span>
              </div>
              {!showForm && (
                <Button onClick={() => setShowForm(true)} glow>
                  <Plus className="w-4 h-4 mr-2" />
                  New Template
                </Button>
              )}
            </>
          }
        />
      </motion.div>

      {/* How to Generate an Offer - Step by Step */}
      <motion.div variants={itemVariants} className="mb-4">
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#D946EF] mb-4">How to Generate an Offer</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#D946EF]/10 border border-[#D946EF]/30 flex items-center justify-center">
                  <span className="text-xs font-bold text-[#D946EF]">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Click &quot;New Template&quot;</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Choose your offer type</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#D946EF]/10 border border-[#D946EF]/30 flex items-center justify-center">
                  <span className="text-xs font-bold text-[#D946EF]">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Fill in the details</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Name, link, and any notes</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#D946EF]/10 border border-[#D946EF]/30 flex items-center justify-center">
                  <span className="text-xs font-bold text-[#D946EF]">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Generate with AI</p>
                  <p className="text-xs text-zinc-500 mt-0.5">AI crafts your email template</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#D946EF]/10 border border-[#D946EF]/30 flex items-center justify-center">
                  <span className="text-xs font-bold text-[#D946EF]">4</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Review &amp; Save</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Edit if needed, then save</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <QuickTip tip="Create multiple offer templates for different industries. A generic offer converts less than one tailored to specific business needs." />
      </motion.div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Card glow>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20">
                      {editingOffer ? <Edit className="w-6 h-6 text-[#8B5CF6]" /> : <Plus className="w-6 h-6 text-[#8B5CF6]" />}
                    </div>
                    <div>
                      <CardTitle>{editingOffer ? 'Edit Template' : 'New Template'}</CardTitle>
                      <CardDescription>
                        {editingOffer ? 'Modify template parameters' : 'Create reusable offer configuration'}
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={resetForm}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2"
                  >
                    <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                    {error}
                  </motion.div>
                )}

                {formStep === 1 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <button
                      onClick={() => { 
                        setType('Affiliate Offer'); 
                        setFormStep(2); 
                      }}
                      className="p-6 text-left rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/80 hover:border-[#8B5CF6]/50 transition-all flex flex-col gap-3 group"
                    >
                      <div className="p-3 bg-[#8B5CF6]/10 rounded-lg w-fit group-hover:bg-[#8B5CF6]/20 transition-colors">
                        <DollarSign className="w-6 h-6 text-[#8B5CF6]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">Affiliate Offer</h3>
                        <p className="text-sm text-zinc-400">Promote products for a commission.</p>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => { 
                        setType('Service Offer'); 
                        setFormStep(2); 
                      }}
                      className="p-6 text-left rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/80 hover:border-[#8B5CF6]/50 transition-all flex flex-col gap-3 group"
                    >
                      <div className="p-3 bg-[#8B5CF6]/10 rounded-lg w-fit group-hover:bg-[#8B5CF6]/20 transition-colors">
                        <Briefcase className="w-6 h-6 text-[#8B5CF6]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">Service Offer</h3>
                        <p className="text-sm text-zinc-400">Offer your own professional services.</p>
                      </div>
                    </button>

                    <button
                      onClick={() => { 
                        setType('Partnership'); 
                        setFormStep(2); 
                      }}
                      className="p-6 text-left rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/80 hover:border-[#D946EF]/50 transition-all flex flex-col gap-3 group"
                    >
                      <div className="p-3 bg-[#D946EF]/10 rounded-lg w-fit group-hover:bg-[#D946EF]/20 transition-colors">
                        <Handshake className="w-6 h-6 text-[#D946EF]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">Partnership</h3>
                        <p className="text-sm text-zinc-400">Collaborate with other businesses.</p>
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {!editingOffer && (
                      <button 
                        onClick={() => { setFormStep(1); setGenerated(false); setDescription(''); }} 
                        className="text-sm text-zinc-400 hover:text-white transition-colors mb-2 flex items-center gap-1"
                      >
                        &larr; Back to Types
                      </button>
                    )}
                    
                  <Input
                    label="Offer/Template Name"
                    placeholder="e.g., Summer Outreach"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  {type === 'Service Offer' && (
                    <>
                      <div className="space-y-1">
                        <label className="ds-label">Service Offered</label>
                        <select 
                          value={selectedService}
                          onChange={(e) => setSelectedService(e.target.value)}
                          className="w-full bg-[#111111] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#8B5CF6] transition-colors"
                        >
                          {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="ds-label">Target Niche</label>
                        <select 
                          value={selectedNiche}
                          onChange={(e) => setSelectedNiche(e.target.value)}
                          className="w-full bg-[#111111] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#8B5CF6] transition-colors"
                        >
                          {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </div>
                    </>
                  )}

                  {type === 'Partnership' && (
                    <div className="space-y-1">
                      <label className="ds-label">Target Niche</label>
                      <select 
                        value={selectedNiche}
                        onChange={(e) => setSelectedNiche(e.target.value)}
                        className="w-full bg-[#111111] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#8B5CF6] transition-colors"
                      >
                        {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center mb-2">
                      <span className="ds-label">Your Link / Email / Website</span>
                      <HelpTooltip
                        variant="help"
                        content="This is your affiliate link or website — the web address people click to buy or sign up. An affiliate link is a special link that pays you a commission, usually from a site like Digistore24 or ClickBank."
                      />
                    </div>
                    <Input
                      placeholder="https://your-website.com"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                    />
                  </div>

                  <Textarea
                    label="Notes & Custom Instructions (Optional)"
                    placeholder="e.g. Please mention our recent award, write in a very casual tone, etc."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />

                  {/* AI Generation Loading State */}
                  <AnimatePresence>
                    {generating && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="pt-4 border-t border-white/5"
                      >
                        <div className="rounded-xl bg-gradient-to-br from-[#D946EF]/5 via-zinc-900/50 to-[#8B5CF6]/5 border border-[#D946EF]/20 p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                            >
                              <Brain className="w-6 h-6 text-[#D946EF]" />
                            </motion.div>
                            <div>
                              <p className="text-sm font-semibold text-white">AI is working its magic</p>
                              <p className="text-xs text-zinc-500">This usually takes 10–20 seconds</p>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="relative mb-4 h-3.5 w-full overflow-hidden rounded-full border border-[#D946EF]/30 bg-white/5 p-0.5">
                            <motion.div
                              className="absolute inset-y-0.5 left-0.5 rounded-full bg-gradient-to-r from-[#D946EF] to-[#8B5CF6] shadow-[0_0_15px_rgba(217,70,239,0.5)]"
                              style={{ backgroundSize: '200% 100%' }}
                              animate={{
                                width: `calc(${loadingProgress}% - 4px)`,
                                backgroundPosition: ['0% 0%', '100% 0%'],
                              }}
                              transition={{
                                width: { duration: 0.5, ease: 'easeOut' },
                                backgroundPosition: { duration: 2, repeat: Infinity, ease: 'linear' },
                              }}
                            />
                          </div>

                          {/* Cycling phrases */}
                          <div className="h-6 overflow-hidden relative">
                            <AnimatePresence mode="wait">
                              <motion.p
                                key={loadingPhrase}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.3 }}
                                className="text-sm text-[#D946EF]/80 flex items-center gap-2"
                              >
                                <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                                {LOADING_PHRASES[loadingPhrase]}
                              </motion.p>
                            </AnimatePresence>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {showOfferBanner && (
                    <div className="pt-4">
                      <PromoBanner />
                    </div>
                  )}

                  {/* Generated Preview */}
                  {!generating && generated && description && (
                    <div className="space-y-1 border-t border-white/5 pt-4" data-generation-results>
                      <label className="ds-label px-1">Generated Email Template</label>
                      <div
                        ref={editorRef}
                        contentEditable
                        onBlur={() => {
                          if (editorRef.current) {
                            setDescription(editorRef.current.innerHTML)
                          }
                        }}
                        className="ds-well min-h-[160px] p-4 text-sm leading-relaxed rounded-xl text-zinc-300 focus:outline-none focus:border-[#8B5CF6] overflow-y-auto w-full cursor-text [&_a]:text-blue-400 [&_a]:underline [&_p]:mb-4 last:[&_p]:mb-0"
                      />
                    </div>
                  )}

                  {/* CTAs */}
                  {!generating && (
                  <div className="flex flex-wrap gap-3 pt-4 mt-4 border-t border-white/5">
                    {editingOffer ? (
                      <>
                        <Button onClick={handleSave} loading={loading} glow>
                          <Save className="w-4 h-4 mr-2" />
                          Update Template
                        </Button>
                        <Button variant="outline" onClick={resetForm}>
                          Cancel
                        </Button>
                      </>
                    ) : !generated ? (
                      <>
                        <Button onClick={generateDescription} glow disabled={remaining <= 0}>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate with AI ({remaining} left)
                        </Button>
                        <Button variant="outline" onClick={resetForm}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={handleSave} loading={loading} glow>
                          <Save className="w-4 h-4 mr-2" />
                          Save Template
                        </Button>
                        <Button
                          variant="outline"
                          onClick={generateDescription}
                          disabled={remaining <= 0}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Regenerate ({remaining} left)
                        </Button>
                        <Button variant="outline" onClick={resetForm}>
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>

      {/* User's Offers */}
      <motion.div variants={itemVariants}>
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {(['All', 'Affiliate Offer', 'Service Offer', 'Partnership'] as const).map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`ds-chip px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === t
                  ? 'bg-[#D946EF] text-black'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20">
                <Gift className="w-6 h-6 text-[#8B5CF6]" />
              </div>
              <div>
                <CardTitle>Your Templates</CardTitle>
                <CardDescription>
                  <span className="text-[#8B5CF6] font-mono">{offers.length}</span> custom templates
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {offers.length === 0 ? (
              <div className="p-12 text-center">
                <Gift className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500">No custom templates</p>
                <p className="text-zinc-600 text-sm">Create your first template above</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/50">
                {offers.filter(o => activeTab === 'All' || o.type === activeTab).map((offer, index) => (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-6 hover:bg-zinc-800/20 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-white text-lg">{offer.name}</h4>
                          <span className="px-2 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-xs text-zinc-300">
                            {offer.type || 'Affiliate Offer'}
                          </span>
                        </div>
                        <div
                          className="text-zinc-400 text-sm leading-relaxed [&_a]:text-blue-400 [&_a]:underline [&_p]:mb-3 last:[&_p]:mb-0 prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: offer.description }}
                        />
                        {offer.link && (
                          <a
                            href={offer.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#D946EF] hover:text-[#e879f9] text-sm flex items-center gap-1 mt-3"
                          >
                            <ExternalLink size={12} />
                            <span className="font-mono">{offer.link}</span>
                          </a>
                        )}
                        {offer.notes && (
                          <p className="text-sm text-zinc-600 mt-2 italic">
                            Note: {offer.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(offer)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setOfferToDelete(offer)}
                        >
                          <Trash2 size={16} className="text-red-400" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <ConfirmDialog
        open={offerToDelete !== null}
        title="Delete this offer?"
        message={
          <>
            This will permanently delete{' '}
            <span className="text-white font-medium">{offerToDelete?.name || 'this offer'}</span>. You can&apos;t undo this.
          </>
        }
        confirmLabel="Yes, delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setOfferToDelete(null)}
      />
    </motion.div>
  )
}

function getTimeUntilReset(resetAt: number): string {
  const diff = resetAt - Date.now()
  if (diff <= 0) return 'now'
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}
