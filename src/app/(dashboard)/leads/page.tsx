'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { HelpTooltip, QuickTip } from '@/components/ui/help-tooltip'
import { PageHeader } from '@/components/ui/page-header'
import { PromoBanner } from '@/components/ui/promo-banner'
import { GenerationProgress } from '@/components/ui/generation-progress'
import { createClient } from '@/lib/supabase/client'
import { INDUSTRIES, DAILY_LEAD_LIMIT, LEAD_STATUS } from '@/lib/constants'
import { scrollToResults } from '@/lib/scroll-to-results'
import { Lead } from '@/types/database'
import { ExternalLink, Mail, Users, Target, Zap } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function LeadsPage() {
  const [industry, setIndustry] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [showOfferBanner, setShowOfferBanner] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [usageToday, setUsageToday] = useState(0)
  const [error, setError] = useState('')
  const supabase = createClient()

  const fetchLeads = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', user.id)
      .order('allocated_at', { ascending: false })
      .limit(100)

    if (data) setLeads(data as Lead[])
  }, [supabase])

  const fetchUsage = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const today = new Date().toISOString().split('T')[0]
    const { data } = await supabase
      .from('usage_limits')
      .select('leads_allocated')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    if (data) setUsageToday((data as { leads_allocated: number }).leads_allocated)
  }, [supabase])

  useEffect(() => {
    fetchLeads()
    fetchUsage()
  }, [fetchLeads, fetchUsage])

  const handleAllocateLeads = async () => {
    if (!industry || !location) {
      setError('Please pick a type of business and enter a location')
      return
    }

    if (usageToday >= DAILY_LEAD_LIMIT) {
      setError("You've used all your searches for today")
      return
    }

    setError('')
    setLoading(true)
    setShowOfferBanner(true)

    try {
      const response = await fetch('/api/leads/allocate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry, location })
      })

      // The gateway can return non-JSON on timeouts — don't let parsing crash the UI
      let result: { error?: string } = {}
      try {
        result = await response.json()
      } catch {
        result = {}
      }

      if (!response.ok) {
        setError(
          result.error ||
            'The search took too long or the service is busy. Please try again in a minute.'
        )
      } else {
        await fetchLeads()
        await fetchUsage()
        setIndustry('')
        setLocation('')
        scrollToResults()
      }
    } catch {
      setError('Could not reach the server. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const remainingLeads = DAILY_LEAD_LIMIT - usageToday

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
          eyebrow="Leads"
          title={
            <span className="flex items-center gap-3">
              Find Customers
              <HelpTooltip
                variant="info"
                title="What's a lead?"
                content="A lead is just a local business we found that you can email your offer to. Pick a type of business and a location, and we'll find some for you."
              />
            </span>
          }
          subtitle="Pick a type of business and a location, and we'll find customers you can email."
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <QuickTip tip="Target industries where you have experience or knowledge. Your emails will be more authentic and convert better when you understand the business's pain points." />
      </motion.div>

      {/* Allocation Form */}
      <motion.div variants={itemVariants}>
        <Card className="mb-8" glow>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-[#D946EF]/10 border border-[#D946EF]/20">
                <Target className="w-6 h-6 text-[#D946EF]" />
              </div>
              <div>
                <CardTitle>Search settings</CardTitle>
                <CardDescription>
                  <span className="text-[#D946EF] font-mono">{remainingLeads}</span> searches left today
                </CardDescription>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <div className="flex items-center mb-2">
                  <span className="ds-label">Type of business</span>
                  <HelpTooltip
                    variant="help"
                    content="The kind of business you want to reach — like restaurants, dentists, or gyms. Some people call this an industry or niche."
                  />
                </div>
                <Select
                  placeholder="Select industry sector"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  options={INDUSTRIES.map(ind => ({ value: ind, label: ind }))}
                />
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <span className="ds-label">Location</span>
                  <HelpTooltip
                    variant="help"
                    content="The town, state, or country where you want to find businesses. For example: 'Austin, Texas' or 'United Kingdom'."
                  />
                </div>
                <Input
                  placeholder="City, State or Country"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <Button
              onClick={handleAllocateLeads}
              loading={loading}
              disabled={remainingLeads === 0 || loading}
              size="lg"
              glow
            >
              <Zap className="w-4 h-4 mr-2" />
              Find My Customers
            </Button>

            {loading && (
              <div className="mt-4">
                <GenerationProgress label="Finding customers in your area..." />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {showOfferBanner && !loading && (
        <motion.div variants={itemVariants}>
          <PromoBanner />
        </motion.div>
      )}

      {/* Leads Table */}
      <motion.div variants={itemVariants} data-generation-results>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20">
                  <Users className="w-6 h-6 text-[#8B5CF6]" />
                </div>
                <div>
                  <CardTitle>Customers Found</CardTitle>
                  <CardDescription>
                    <span className="text-[#8B5CF6] font-mono">{leads.length}</span> businesses you can email
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {leads.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500">No customers yet</p>
                <p className="text-zinc-600 text-sm">Use the search above to find some</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] cyber-table">
                  <thead>
                    <tr>
                      <th className="text-left px-6 py-4">Business</th>
                      <th className="text-left px-6 py-4">Email</th>
                      <th className="text-left px-6 py-4">Location</th>
                      <th className="text-left px-6 py-4">Status</th>
                      <th className="text-left px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead, index) => (
                      <motion.tr
                        key={lead.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-white">{lead.business_name}</div>
                            {lead.website && (
                              <a
                                href={lead.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-[#D946EF] hover:text-[#e879f9] flex items-center gap-1 mt-1"
                              >
                                <ExternalLink size={10} />
                                Website
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-[#D946EF] hover:text-[#e879f9] flex items-center gap-2"
                          >
                            <Mail size={14} />
                            <span className="font-mono text-sm">{lead.email}</span>
                          </a>
                        </td>
                        <td className="px-6 py-4 text-zinc-400 text-sm">{lead.location}</td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={
                              lead.status === 'allocated' ? 'info' :
                              lead.status === 'used' ? 'success' : 'error'
                            }
                          >
                            {LEAD_STATUS[lead.status].label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.location.href = `/email-builder?lead=${lead.id}`}
                          >
                            Generate Email
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
