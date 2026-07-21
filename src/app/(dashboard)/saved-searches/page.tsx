'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { HelpTooltip } from '@/components/ui/help-tooltip'
import { PageHeader } from '@/components/ui/page-header'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { createClient } from '@/lib/supabase/client'
import { Search, Lead } from '@/types/database'
import { LEAD_STATUS } from '@/lib/constants'
import {
  Bookmark,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Mail,
  MapPin,
  Target,
  Trash2,
  Users
} from 'lucide-react'
import { format } from 'date-fns'

interface SearchWithLeads extends Search {
  leads: Lead[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function SavedSearchesPage() {
  const [searches, setSearches] = useState<SearchWithLeads[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchToDelete, setSearchToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const supabase = createClient()

  const fetchSearches = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('searches')
      .select(`
        *,
        leads(*)
      `)
      .eq('user_id', user.id)
      .eq('is_saved', true)
      .order('last_searched_at', { ascending: false })

    if (data) {
      const rows = (data as unknown as SearchWithLeads[]).map(s => ({
        ...s,
        leads: [...(s.leads || [])].sort(
          (a, b) => new Date(b.allocated_at).getTime() - new Date(a.allocated_at).getTime()
        )
      }))
      setSearches(rows)
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchSearches()
  }, [fetchSearches])

  const confirmDelete = async () => {
    if (!searchToDelete) return

    setDeleting(true)
    try {
      // Unsave rather than destroy — the search history stays usable for
      // dedup so repeat searches still return fresh leads.
      await supabase
        .from('searches')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .update({ is_saved: false } as any)
        .eq('id', searchToDelete)

      await fetchSearches()
    } catch (error) {
      console.error('Failed to remove saved search:', error)
    } finally {
      setDeleting(false)
      setSearchToDelete(null)
    }
  }

  const toggleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id)
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
          eyebrow="Searches"
          title={
            <span className="flex items-center gap-3">
              Saved Searches
              <HelpTooltip
                variant="info"
                title="Saved Searches"
                content="Every search you save from Find Customers lives here, with the date you ran it and all the customers it found. Run the same niche and location again anytime to add the next batch of qualified leads to it."
              />
            </span>
          }
          subtitle="Your saved searches with every customer they found, organized by niche and location."
        />
      </motion.div>

      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-[#D946EF]/30 border-t-[#D946EF] rounded-full mx-auto"
            />
            <p className="text-zinc-500 mt-4">Loading saved searches...</p>
          </CardContent>
        </Card>
      ) : searches.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bookmark className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500">No saved searches yet</p>
            <p className="text-zinc-600 text-sm mt-1">
              Run a search on Find Customers and hit &quot;Save Search&quot; to keep it here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {searches.map((search, index) => (
            <motion.div
              key={search.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover={false}>
                <CardHeader
                  className="cursor-pointer hover:bg-zinc-800/20 transition-colors"
                  onClick={() => toggleExpand(search.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="p-2 rounded-lg bg-[#D946EF]/10 border border-[#D946EF]/20">
                          <Target className="w-4 h-4 text-[#D946EF]" />
                        </div>
                        <CardTitle className="text-base truncate">{search.industry}</CardTitle>
                        <Badge variant="info">
                          <span className="flex items-center gap-1">
                            <MapPin size={10} />
                            {search.location}
                          </span>
                        </Badge>
                        <Badge variant="success">
                          {search.leads.length} customer{search.leads.length === 1 ? '' : 's'}
                        </Badge>
                      </div>
                      <CardDescription className="mt-2 text-xs">
                        First searched {format(new Date(search.created_at), 'MMM d, yyyy • HH:mm')}
                        {search.last_searched_at !== search.created_at && (
                          <> · Last searched {format(new Date(search.last_searched_at), 'MMM d, yyyy • HH:mm')}</>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e?.stopPropagation()
                          setSearchToDelete(search.id)
                        }}
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </Button>
                      {expanded === search.id ? (
                        <ChevronUp size={18} className="text-zinc-500" />
                      ) : (
                        <ChevronDown size={18} className="text-zinc-500" />
                      )}
                    </div>
                  </div>
                </CardHeader>

                <AnimatePresence>
                  {expanded === search.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CardContent className="border-t border-zinc-800/50 p-0">
                        {search.leads.length === 0 ? (
                          <div className="p-8 text-center">
                            <Users className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                            <p className="text-zinc-500 text-sm">No customers stored for this search</p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px] cyber-table">
                              <thead>
                                <tr>
                                  <th className="text-left px-6 py-4">Business</th>
                                  <th className="text-left px-6 py-4">Email</th>
                                  <th className="text-left px-6 py-4">Location</th>
                                  <th className="text-left px-6 py-4">Found on</th>
                                  <th className="text-left px-6 py-4">Status</th>
                                  <th className="text-left px-6 py-4">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {search.leads.map((lead) => (
                                  <tr key={lead.id}>
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
                                    <td className="px-6 py-4 text-zinc-400 text-sm whitespace-nowrap">
                                      {format(new Date(lead.allocated_at), 'MMM d, yyyy')}
                                    </td>
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
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={searchToDelete !== null}
        title="Remove this saved search?"
        message="This removes it from Saved Searches. Your search history is kept so repeat searches still skip customers you already have."
        confirmLabel="Yes, remove"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setSearchToDelete(null)}
      />
    </motion.div>
  )
}
