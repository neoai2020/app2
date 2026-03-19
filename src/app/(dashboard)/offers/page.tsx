'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { HelpTooltip, QuickTip } from '@/components/ui/help-tooltip'
import { Offer } from '@/types/database'
import { Plus, Edit, Trash2, ExternalLink, Gift, FolderOpen, X, Briefcase, Handshake, DollarSign } from 'lucide-react'

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
  const [error, setError] = useState('')

  const editorRef = useRef<HTMLDivElement>(null)

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
    setError('')
  }

  const generateDescription = async () => {
    setGenerating(true)
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
      // If AI fails or key is missing, throw to use fallback
      if (!res.ok || !data.template) throw new Error(data.error || 'Failed to generate')
      
      setDescription(data.template)
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

  const handleDelete = async (offer: Offer) => {
    if (!confirm('Confirm deletion of this offer template?')) return

    try {
      const response = await fetch(`/api/offers?id=${offer.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Deletion failed')
      await fetchOffers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deletion failed')
    }
  }



  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold gradient-text">Offer Library</h1>
            <HelpTooltip
              variant="info"
              title="Offer Templates"
              content="Create and store offer templates here. These can be quickly selected when generating emails, saving you time and ensuring consistency."
              learnMoreLink="/support#offers"
            />
          </div>
          <p className="text-zinc-500 mt-2">Manage reusable offer templates for campaigns</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} glow>
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </Button>
        )}
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
                    <div className="p-3 rounded-lg bg-indigo-400/10 border border-indigo-400/20">
                      {editingOffer ? <Edit className="w-6 h-6 text-indigo-400" /> : <Plus className="w-6 h-6 text-indigo-400" />}
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
                      className="p-6 text-left rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/80 hover:border-indigo-500/50 transition-all flex flex-col gap-3 group"
                    >
                      <div className="p-3 bg-indigo-500/10 rounded-lg w-fit group-hover:bg-indigo-500/20 transition-colors">
                        <DollarSign className="w-6 h-6 text-indigo-400" />
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
                      className="p-6 text-left rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/80 hover:border-emerald-500/50 transition-all flex flex-col gap-3 group"
                    >
                      <div className="p-3 bg-emerald-500/10 rounded-lg w-fit group-hover:bg-emerald-500/20 transition-colors">
                        <Briefcase className="w-6 h-6 text-emerald-400" />
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
                        onClick={() => setFormStep(1)} 
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
                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Service Offered</label>
                        <select 
                          value={selectedService}
                          onChange={(e) => setSelectedService(e.target.value)}
                          className="w-full bg-[#111111] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        >
                          {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Target Niche</label>
                        <select 
                          value={selectedNiche}
                          onChange={(e) => setSelectedNiche(e.target.value)}
                          className="w-full bg-[#111111] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        >
                          {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </div>
                    </>
                  )}

                  {type === 'Partnership' && (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Target Niche</label>
                      <select 
                        value={selectedNiche}
                        onChange={(e) => setSelectedNiche(e.target.value)}
                        className="w-full bg-[#111111] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      >
                        {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  )}

                  <Input
                    label="Your Link / Email / Website"
                    placeholder="https://your-website.com"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                  />

                  <Textarea
                    label="Notes & Custom Instructions (Optional)"
                    placeholder="e.g. Please mention our recent award, write in a very casual tone, etc."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />

                  <div className="space-y-1 pt-4 border-t border-white/5">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Generated Email Template</label>
                      <button 
                        onClick={generateDescription}
                        disabled={generating}
                        className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors disabled:opacity-50 flex items-center gap-1"
                      >
                        {generating ? '✨ Generating...' : '✨ Generate with AI'}
                      </button>
                    </div>
                    <div
                      ref={editorRef}
                      contentEditable
                      onBlur={() => {
                        if (editorRef.current) {
                          setDescription(editorRef.current.innerHTML)
                        }
                      }}
                      className="min-h-[160px] p-4 text-sm leading-relaxed bg-[#111111] border border-white/10 rounded-xl text-zinc-300 focus:outline-none focus:border-indigo-500 overflow-y-auto w-full cursor-text [&_a]:text-blue-400 [&_a]:underline [&_p]:mb-4 last:[&_p]:mb-0"
                    />
                  </div>

                  <div className="flex gap-4 pt-4 mt-4 border-t border-white/5">
                    <Button onClick={handleSave} loading={loading} glow>
                      {editingOffer ? 'Update Template' : 'Save Template'}
                    </Button>
                    <Button variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
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
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === t
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-indigo-400/10 border border-indigo-400/20">
                <Gift className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <CardTitle>Your Templates</CardTitle>
                <CardDescription>
                  <span className="text-indigo-400 font-mono">{offers.length}</span> custom templates
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
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-white text-lg">{offer.name}</h4>
                          <span className="px-2 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-xs text-zinc-300">
                            {offer.type || 'Affiliate Offer'}
                          </span>
                        </div>
                        <p className="text-zinc-400">{offer.description}</p>
                        {offer.link && (
                          <a
                            href={offer.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#D946EF] hover:text-[#e879f9] text-sm flex items-center gap-1 mt-2"
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
                          onClick={() => handleDelete(offer)}
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
    </motion.div>
  )
}
