'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, HelpCircle, Mail, FileText, CheckCircle, MessageSquare, ExternalLink, Headphones } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const faqs = [
  {
    question: 'What are the daily usage limits?',
    answer: 'Lead Magnet: 25 leads per day. Email Blast: 10 email generations per day. Offer Library: 5 AI offer generations per day. All limits reset every 24 hours automatically.'
  },
  {
    question: 'Does the platform send emails for me?',
    answer: 'No. Profit Loop generates email content only. Copy your email from Email Blast or Saved Emails, paste it into your email client (Gmail, Outlook, etc.), and send it yourself.'
  },
  {
    question: 'Why are some business emails unavailable?',
    answer: 'We only surface publicly available business contact information. Personal emails are never collected, ensuring regulatory compliance.'
  },
  {
    question: 'Are leads validated?',
    answer: 'Yes. All email addresses undergo format validation and deliverability checks. However, 100% deliverability cannot be guaranteed due to dynamic server configurations.'
  },
  {
    question: 'Which industries can I target?',
    answer: 'Available industries include: Restaurants & Cafes, Retail, Professional Services, Health & Wellness, Home Services, Automotive, Real Estate, Legal, Financial, Education, Technology, Marketing & Advertising, Construction, and Manufacturing.'
  },
  {
    question: 'Where can I learn how to use the platform?',
    answer: 'Visit the Training page from the sidebar. It has step-by-step video tutorials for every feature, including premium features, plus a comprehensive FAQ section.'
  },
  {
    question: 'What are Premium Features?',
    answer: 'Premium Features include DFY (Done-For-You) pre-built campaigns, Instant Income (ready-to-post Facebook messages), and Autopilot (100+ free traffic sources with step-by-step submission guides).'
  },
  {
    question: 'How do refunds work?',
    answer: 'Full refund available within 30 days of purchase — no questions asked. Submit a request using the contact form below with your account email and purchase date. Refunds are processed within 5–7 business days.'
  }
]

export default function SupportPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSubmitted(true)
    setLoading(false)
    setName('')
    setEmail('')
    setMessage('')
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
        <h1 className="text-4xl font-bold gradient-text">Support Center</h1>
        <p className="text-zinc-500 mt-2">Documentation and assistance resources</p>
      </motion.div>

      {/* Support Channels */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <a
          href="https://neoaifreshdesk.freshdesk.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <Card className="h-full hover:border-[#D946EF]/30 transition-colors">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-[#D946EF]/10 border border-[#D946EF]/20 group-hover:bg-[#D946EF]/20 transition-colors">
                <Headphones className="w-6 h-6 text-[#D946EF]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">Support Portal</h3>
                <p className="text-zinc-500 text-sm">Open a ticket or check existing requests</p>
              </div>
              <ExternalLink className="w-5 h-5 text-zinc-600 group-hover:text-[#D946EF] transition-colors" />
            </CardContent>
          </Card>
        </a>

        <a
          href="mailto:ProfitLoopAI@neoai.freshdesk.com"
          className="group"
        >
          <Card className="h-full hover:border-green-400/30 transition-colors">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-400/10 border border-green-400/20 group-hover:bg-green-400/20 transition-colors">
                <Mail className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">Email Support</h3>
                <p className="text-zinc-500 text-sm">ProfitLoopAI@neoai.freshdesk.com</p>
              </div>
              <ExternalLink className="w-5 h-5 text-zinc-600 group-hover:text-green-400 transition-colors" />
            </CardContent>
          </Card>
        </a>
      </motion.div>

      {/* FAQ Section */}
      <motion.div variants={itemVariants}>
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-[#D946EF]/10 border border-[#D946EF]/20">
                <HelpCircle className="w-6 h-6 text-[#D946EF]" />
              </div>
              <div>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Common queries and system documentation</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-800/50">
              {faqs.map((faq, index) => (
                <div key={index}>
                  <button
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-zinc-800/20 transition-colors"
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  >
                    <span className="font-medium text-zinc-200 pr-4">{faq.question}</span>
                    {expandedFaq === index ? (
                      <ChevronUp size={18} className="text-[#D946EF] shrink-0" />
                    ) : (
                      <ChevronDown size={18} className="text-zinc-500 shrink-0" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-4 text-zinc-400 text-sm leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contact Form */}
      <motion.div variants={itemVariants}>
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-400/10 border border-green-400/20">
                <MessageSquare className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>Submit inquiry for human assistance</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 rounded-full bg-green-400/10 border border-green-400/30 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
                <p className="text-zinc-400">
                  We&apos;ve received your message. A support ticket has been created. Expect a response within 24–48 hours at your email address.
                </p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => setSubmitted(false)}
                >
                  Submit Another Inquiry
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Your Name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  type="email"
                  label="Email Address"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Textarea
                  label="Message"
                  placeholder="Describe your issue or question..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
                <Button type="submit" loading={loading} glow>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Refund Policy */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-indigo-400/10 border border-indigo-400/20">
                <FileText className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <CardTitle>Refund Protocol</CardTitle>
                <CardDescription>Satisfaction guarantee terms</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/30">
                <h4 className="font-medium text-[#D946EF] mb-2 uppercase tracking-wider text-sm">30-Day Guarantee</h4>
                <p className="text-zinc-400 text-sm">
                  Full refund available within 30 days of purchase. No interrogation required.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/30">
                <h4 className="font-medium text-[#D946EF] mb-2 uppercase tracking-wider text-sm">Request Procedure</h4>
                <p className="text-zinc-400 text-sm">
                  Submit a request via the contact form above, email us at ProfitLoopAI@neoai.freshdesk.com, or open a ticket on the support portal. Include your account email and purchase date.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/30">
                <h4 className="font-medium text-[#D946EF] mb-2 uppercase tracking-wider text-sm">Processing Timeline</h4>
                <p className="text-zinc-400 text-sm">
                  Refunds processed within 5-7 business days. Confirmation transmitted upon completion.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
