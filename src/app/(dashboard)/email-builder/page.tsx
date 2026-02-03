'use client'

import { useState, useEffect, Suspense, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { PromoBanner } from '@/components/ui/promo-banner'
import { HelpTooltip, QuickTip } from '@/components/ui/help-tooltip'
import { createClient } from '@/lib/supabase/client'
import { EMAIL_TONES, DAILY_EMAIL_LIMIT } from '@/lib/constants'
import { Lead, Offer } from '@/types/database'
import { Sparkles, Copy, Save, RefreshCw, Mail, Cpu, CheckCircle } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

function EmailBuilderContent() {
  const searchParams = useSearchParams()
  const leadId = searchParams.get('lead')

  const [leads, setLeads] = useState<Lead[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [selectedLead, setSelectedLead] = useState('')
  const [selectedOffer, setSelectedOffer] = useState('')
  const [customOffer, setCustomOffer] = useState('')
  const [tone, setTone] = useState<'friendly' | 'professional' | 'direct'>('professional')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [followUp, setFollowUp] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [emailsRemaining, setEmailsRemaining] = useState(DAILY_EMAIL_LIMIT)
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: leadsData } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'allocated')
      .order('allocated_at', { ascending: false })

    if (leadsData) setLeads(leadsData as Lead[])

    const { data: offersData } = await supabase
      .from('offers')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (offersData) setOffers(offersData as Offer[])

    const today = new Date().toISOString().split('T')[0]
    const { data: usage } = await supabase
      .from('usage_limits')
      .select('emails_generated')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    if (usage) {
      setEmailsRemaining(DAILY_EMAIL_LIMIT - (usage as { emails_generated: number }).emails_generated)
    }
  }, [supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (leadId) setSelectedLead(leadId)
  }, [leadId])

  const handleGenerate = async () => {
    if (!selectedLead) {
      setError('Select a target lead')
      return
    }

    if (!selectedOffer && !customOffer) {
      setError('Provide an offer or custom description')
      return
    }

    if (emailsRemaining <= 0) {
      setError('Daily generation limit reached')
      return
    }

    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/emails/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: selectedLead,
          offerId: selectedOffer || null,
          customOffer: customOffer || null,
          tone
        })
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Generation failed')
      } else {
        setSubject(result.subject)
        setBody(result.body)
        setFollowUp(result.followUp || '')
        setEmailsRemaining(prev => prev - 1)
      }
    } catch {
      setError('System error during generation')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!subject || !body) {
      setError('Generate content first')
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/emails/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: selectedLead,
          offerId: selectedOffer || null,
          subject,
          body,
          followUp,
          tone
        })
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Save failed')
      } else {
        setSuccess('Email archived successfully')
        if (selectedLead) {
          await fetch('/api/leads/mark-used', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ leadId: selectedLead })
          })
        }
      }
    } catch {
      setError('System error during save')
    } finally {
      setSaving(false)
    }
  }

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  const selectedLeadData = leads.find(l => l.id === selectedLead)

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto"
    >
      {/* Promo Banner */}
      <motion.div variants={itemVariants}>
        <PromoBanner />
      </motion.div>

      {/* Header */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold gradient-text">Email Builder</h1>
              <HelpTooltip
                variant="info"
                title="AI Email Generator"
                content="Our AI creates personalized, compliant outreach emails. Select a lead, choose your offer, and let the system generate professional messages that convert."
                learnMoreLink="/support#email-builder"
              />
            </div>
            <p className="text-zinc-500 mt-2">AI-powered outreach generation system</p>
          </div>
          <Badge variant="info" pulse>
            <Cpu className="w-3 h-3 mr-1" />
            {emailsRemaining} generations available
          </Badge>
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <QuickTip tip="The 'Professional' tone works best for first-time outreach. Save 'Friendly' for follow-ups or industries like restaurants and retail." />
      </motion.div>

      {/* Configuration */}
      <motion.div variants={itemVariants}>
        <Card className="mb-6" glow>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-400/10 border border-purple-400/20">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <CardTitle>Generation Parameters</CardTitle>
                <CardDescription>Configure AI output settings</CardDescription>
              </div>
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

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                {success}
              </motion.div>
            )}

            <div className="space-y-4">
              <Select
                label="Target Lead"
                placeholder="Select allocation target"
                value={selectedLead}
                onChange={(e) => setSelectedLead(e.target.value)}
                options={leads.map(lead => ({
                  value: lead.id,
                  label: `${lead.business_name} — ${lead.email}`
                }))}
              />

              {selectedLeadData && (
                <div className="p-4 rounded-lg bg-cyan-400/5 border border-cyan-400/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                    <span className="text-xs text-cyan-400 uppercase tracking-wider">Target Data</span>
                  </div>
                  <p className="font-medium text-white">{selectedLeadData.business_name}</p>
                  <p className="text-sm text-zinc-400 font-mono">{selectedLeadData.email}</p>
                  <p className="text-sm text-zinc-500">{selectedLeadData.location} • {selectedLeadData.industry}</p>
                </div>
              )}

              <Select
                label="Offer Template"
                placeholder="Select from library"
                value={selectedOffer}
                onChange={(e) => {
                  setSelectedOffer(e.target.value)
                  setCustomOffer('')
                }}
                options={[
                  { value: '', label: 'Use custom description' },
                  ...offers.map(offer => ({
                    value: offer.id,
                    label: offer.name
                  }))
                ]}
              />

              {!selectedOffer && (
                <Textarea
                  label="Custom Offer"
                  placeholder="Describe the offer or service..."
                  value={customOffer}
                  onChange={(e) => setCustomOffer(e.target.value)}
                />
              )}

              <Select
                label="Output Tone"
                value={tone}
                onChange={(e) => setTone(e.target.value as 'friendly' | 'professional' | 'direct')}
                options={EMAIL_TONES.map(t => ({
                  value: t.value,
                  label: `${t.label} — ${t.description}`
                }))}
              />

              <Button
                onClick={handleGenerate}
                loading={loading}
                disabled={emailsRemaining <= 0}
                size="lg"
                className="w-full"
                glow
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Content
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Generated Email */}
      {(subject || body) && (
        <motion.div
          variants={itemVariants}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-green-400/10 border border-green-400/20">
                  <Mail className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <CardTitle>Generated Output</CardTitle>
                  <CardDescription>Review and modify before saving</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-cyan-300/80 uppercase tracking-wider">Subject Line</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(subject, 'subject')}
                  >
                    {copied === 'subject' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    <span className="ml-1">{copied === 'subject' ? 'Copied' : 'Copy'}</span>
                  </Button>
                </div>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-cyan-300/80 uppercase tracking-wider">Email Body</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(body, 'body')}
                  >
                    {copied === 'body' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    <span className="ml-1">{copied === 'body' ? 'Copied' : 'Copy'}</span>
                  </Button>
                </div>
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>

              {followUp && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-cyan-300/80 uppercase tracking-wider">Follow-Up</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(followUp, 'followUp')}
                    >
                      {copied === 'followUp' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      <span className="ml-1">{copied === 'followUp' ? 'Copied' : 'Copy'}</span>
                    </Button>
                  </div>
                  <Textarea
                    value={followUp}
                    onChange={(e) => setFollowUp(e.target.value)}
                    className="min-h-[150px]"
                  />
                </div>
              )}

              <div className="flex gap-4 pt-4 border-t border-zinc-800">
                <Button
                  onClick={handleGenerate}
                  variant="outline"
                  loading={loading}
                  disabled={emailsRemaining <= 0}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
                <Button
                  onClick={handleSave}
                  loading={saving}
                  glow
                >
                  <Save className="w-4 h-4 mr-2" />
                  Archive Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}

export default function EmailBuilderPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full"
        />
      </div>
    }>
      <EmailBuilderContent />
    </Suspense>
  )
}
