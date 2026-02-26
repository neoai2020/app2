'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { HelpTooltip } from '@/components/ui/help-tooltip'
import { createClient } from '@/lib/supabase/client'
import { EmailTemplate, Lead } from '@/types/database'
import { Copy, Trash2, Mail, ChevronDown, ChevronUp, Archive, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'

interface EmailWithLead extends EmailTemplate {
  lead?: Lead | null
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function SavedEmailsPage() {
  const [emails, setEmails] = useState<EmailWithLead[]>([])
  const [expandedEmail, setExpandedEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const supabase = createClient()

  const fetchEmails = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('email_templates')
      .select(`
        *,
        lead:leads(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (data) setEmails(data as EmailWithLead[])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchEmails()
  }, [fetchEmails])

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleDelete = async (emailId: string) => {
    if (!confirm('Confirm deletion of this archived email?')) return

    try {
      await supabase
        .from('email_templates')
        .delete()
        .eq('id', emailId)

      await fetchEmails()
    } catch (error) {
      console.error('Deletion failed:', error)
    }
  }

  const toggleExpand = (emailId: string) => {
    setExpandedEmail(expandedEmail === emailId ? null : emailId)
  }

  const getToneBadge = (tone: string) => {
    switch (tone) {
      case 'friendly':
        return <Badge variant="success">Friendly</Badge>
      case 'professional':
        return <Badge variant="info">Professional</Badge>
      case 'direct':
        return <Badge variant="warning">Direct</Badge>
      default:
        return <Badge>{tone}</Badge>
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
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold gradient-text">Email Archive</h1>
          <HelpTooltip
            variant="info"
            title="Saved Emails"
            content="All your generated emails are stored here. Click to expand any email, copy the content, and paste it into your email client to send."
            learnMoreLink="/support#saved-emails"
          />
        </div>
        <p className="text-zinc-500 mt-2">Previously generated outreach content</p>
      </motion.div>

      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full mx-auto"
            />
            <p className="text-zinc-500 mt-4">Loading archive...</p>
          </CardContent>
        </Card>
      ) : emails.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Archive className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500">Archive empty</p>
            <p className="text-zinc-600 text-sm mt-1">
              Generate and save emails from the Email Builder
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {emails.map((email, index) => (
            <motion.div
              key={email.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover={false}>
                <CardHeader
                  className="cursor-pointer hover:bg-zinc-800/20 transition-colors"
                  onClick={() => toggleExpand(email.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <CardTitle className="text-base truncate">{email.subject}</CardTitle>
                        {getToneBadge(email.tone)}
                      </div>
                      {email.lead && (
                        <CardDescription className="mt-2 font-mono text-xs">
                          → {email.lead.business_name} ({email.lead.email})
                        </CardDescription>
                      )}
                      <CardDescription className="mt-1 text-xs">
                        {format(new Date(email.created_at), 'MMM d, yyyy • HH:mm')}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e?.stopPropagation()
                          handleDelete(email.id)
                        }}
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </Button>
                      {expandedEmail === email.id ? (
                        <ChevronUp size={18} className="text-zinc-500" />
                      ) : (
                        <ChevronDown size={18} className="text-zinc-500" />
                      )}
                    </div>
                  </div>
                </CardHeader>

                <AnimatePresence>
                  {expandedEmail === email.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CardContent className="border-t border-zinc-800/50 pt-4">
                        {/* Subject */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-medium text-cyan-300/80 uppercase tracking-wider">Subject Line</label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(email.subject, `subject-${email.id}`)}
                            >
                              {copiedField === `subject-${email.id}` ? (
                                <><CheckCircle className="w-3 h-3 text-green-400 mr-1" /> Copied</>
                              ) : (
                                <><Copy className="w-3 h-3 mr-1" /> Copy</>
                              )}
                            </Button>
                          </div>
                          <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/30 text-zinc-300 font-mono text-sm">
                            {email.subject}
                          </div>
                        </div>

                        {/* Body */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-medium text-cyan-300/80 uppercase tracking-wider">Email Body</label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(email.body, `body-${email.id}`)}
                            >
                              {copiedField === `body-${email.id}` ? (
                                <><CheckCircle className="w-3 h-3 text-green-400 mr-1" /> Copied</>
                              ) : (
                                <><Copy className="w-3 h-3 mr-1" /> Copy</>
                              )}
                            </Button>
                          </div>
                          <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/30 text-zinc-300 text-sm whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                            {email.body}
                          </div>
                        </div>

                        {/* Follow Up */}
                        {email.follow_up && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-xs font-medium text-cyan-300/80 uppercase tracking-wider">Follow-Up</label>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopy(email.follow_up!, `followup-${email.id}`)}
                              >
                                {copiedField === `followup-${email.id}` ? (
                                  <><CheckCircle className="w-3 h-3 text-green-400 mr-1" /> Copied</>
                                ) : (
                                  <><Copy className="w-3 h-3 mr-1" /> Copy</>
                                )}
                              </Button>
                            </div>
                            <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/30 text-zinc-300 text-sm whitespace-pre-wrap">
                              {email.follow_up}
                            </div>
                          </div>
                        )}

                        {/* Quick Actions */}
                        {email.lead && (
                          <div className="pt-4 border-t border-zinc-800/50">
                            <Button
                              variant="outline"
                              onClick={() => handleCopy(
                                `To: ${email.lead!.email}\nSubject: ${email.subject}\n\n${email.body}`,
                                `full-${email.id}`
                              )}
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              {copiedField === `full-${email.id}` ? 'Copied!' : 'Copy Complete Email'}
                            </Button>
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
    </motion.div>
  )
}
