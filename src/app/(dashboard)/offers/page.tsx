'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { HelpTooltip, QuickTip } from '@/components/ui/help-tooltip'
import { Offer } from '@/types/database'
import { Plus, Edit, Trash2, ExternalLink, Gift, FolderOpen, X } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [link, setLink] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
    setEditingOffer(null)
    setShowForm(false)
    setError('')
  }

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer)
    setName(offer.name)
    setDescription(offer.description)
    setLink(offer.link || '')
    setNotes(offer.notes || '')
    setShowForm(true)
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
        ? { id: editingOffer.id, name, description, link, notes }
        : { name, description, link, notes }

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

  const templates = [
    {
      title: 'Affiliate Offer',
      description: '"I\'d like to share a [product/service] that can help your business [benefit]. Many businesses like yours have seen [result]."'
    },
    {
      title: 'Service Offer',
      description: '"I noticed [observation]. I specialize in [service] and have helped similar businesses [achieve result]."'
    },
    {
      title: 'Partnership',
      description: '"I believe there\'s a great opportunity for us to collaborate on [topic]. Our services complement each other well."'
    }
  ]

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

                <div className="space-y-4">
                  <Input
                    label="Template Name"
                    placeholder="e.g., Web Design Services"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <Textarea
                    label="Description"
                    placeholder="Describe the offer value proposition..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />

                  <Input
                    label="Link (Optional)"
                    placeholder="https://example.com/offer"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                  />

                  <Textarea
                    label="Notes (Optional)"
                    placeholder="Internal notes or instructions..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />

                  <div className="flex gap-4 pt-4">
                    <Button onClick={handleSave} loading={loading} glow>
                      {editingOffer ? 'Update Template' : 'Save Template'}
                    </Button>
                    <Button variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Default Templates */}
      <motion.div variants={itemVariants}>
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-[#D946EF]/10 border border-[#D946EF]/20">
                <FolderOpen className="w-6 h-6 text-[#D946EF]" />
              </div>
              <div>
                <CardTitle>System Templates</CardTitle>
                <CardDescription>Pre-configured offer frameworks</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {templates.map((template, index) => (
                <motion.div
                  key={template.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/30 hover:border-[#D946EF]/20 transition-colors"
                >
                  <h4 className="font-medium text-[#D946EF] mb-2">{template.title}</h4>
                  <p className="text-sm text-zinc-500 italic">{template.description}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* User's Offers */}
      <motion.div variants={itemVariants}>
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
                {offers.map((offer, index) => (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-6 hover:bg-zinc-800/20 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-lg mb-2">{offer.name}</h4>
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
