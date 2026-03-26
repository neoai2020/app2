'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChevronDown, ChevronUp, HelpCircle, Mail, FileText, ExternalLink, Headphones, MessageCircle } from 'lucide-react'

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
    answer: 'Lead Magnet: 25 leads per day. Email Blast: 10 email generations per day. Offer Library: 5 AI offer generations per day. All limits reset automatically every 24 hours. Your remaining count is always visible on the Dashboard and each feature page.'
  },
  {
    question: 'Does Profit Loop send emails for me?',
    answer: 'No. Profit Loop generates email content only. You copy the email from Email Blast or Saved Emails, paste it into your email client (Gmail, Outlook, Yahoo, etc.), and send it yourself. This gives you full control and avoids spam filter issues.'
  },
  {
    question: 'Why are some business emails unavailable?',
    answer: 'We only surface publicly available business contact information. Personal emails are never collected, ensuring regulatory compliance. Some businesses may not have a publicly listed email.'
  },
  {
    question: 'Are leads validated?',
    answer: 'Yes. All email addresses undergo format validation and deliverability checks. However, 100% deliverability cannot be guaranteed due to dynamic server configurations.'
  },
  {
    question: 'Which industries can I target in Lead Magnet?',
    answer: 'Available industries include: Restaurants & Cafes, Retail Stores, Professional Services, Health & Wellness, Home Services, Automotive, Real Estate, Legal Services, Financial Services, Education & Training, Technology Services, Marketing & Advertising, Construction, and Manufacturing.'
  },
  {
    question: 'What offer types can I create?',
    answer: 'Three types: Affiliate Offer (promote products for commission), Service Offer (pitch your own skills like SEO, web design, marketing), and Partnership (propose collaborations). Each type has specialized AI prompts for better results.'
  },
  {
    question: 'What are the three email tones in Email Blast?',
    answer: 'Professional — formal and polished, best for cold outreach. Friendly — warm and approachable, ideal for follow-ups. Direct — sharp and to the point, great for busy decision-makers. The AI adjusts word choice and structure based on your selection.'
  },
  {
    question: 'How does DFY (Done For You) work?',
    answer: 'DFY provides 1,600 verified leads across 8 niches with 200 leads each. Every lead includes a unique pre-written email. Paste your affiliate link, choose a niche, and start copying and sending. Click "Load More" to access all 200 leads per niche.'
  },
  {
    question: 'How does Instant Income work?',
    answer: 'Choose a niche, paste your affiliate link (e.g. from DigiStore24), and click "Generate My Posts Now." You get 3 unique Facebook posts written as personal stories. Copy and paste them into Facebook groups for affiliate commissions.'
  },
  {
    question: 'How does Autopilot work?',
    answer: 'Enter your promotion URL, save it, and your link gets auto-inserted into all 102 traffic source submissions. Each source has step-by-step instructions, ready-to-copy text, and a direct link. Track progress as you complete each one.'
  },
  {
    question: 'What is Profit Protector?',
    answer: 'Profit Protector is your account security dashboard under Premium Features. It monitors account verification, connection security, session protection, data encryption, server status, and API connectivity in real time.'
  },
  {
    question: 'Where can I find training videos?',
    answer: 'Visit the Training page from the sidebar. It has video tutorials for every feature: Getting Started, Offer Library, Lead Magnet, Email Blast, plus premium tutorials for DFY, Instant Income, and Autopilot. There\'s also a comprehensive FAQ tab.'
  },
  {
    question: 'What are Premium Features?',
    answer: 'Premium Features include: DFY (1,600 pre-built leads with emails), Instant Income (Facebook post generator), Autopilot (100+ free traffic sources), and Profit Protector (security dashboard). All accessible from the sidebar.'
  },
  {
    question: 'How do I get the best results?',
    answer: 'Use Professional tone for cold outreach. Create multiple offer templates for different niches. Add custom instructions in your offers for better AI output. Use all 25 daily leads and 10 email generations. Layer in Instant Income and Autopilot for additional revenue streams.'
  },
  {
    question: 'How do refunds work?',
    answer: 'Full refund available within 30 days of purchase — no questions asked. Email ProfitLoopAI@neoai.freshdesk.com or open a ticket at neoaifreshdesk.freshdesk.com. Refunds are processed within 5-7 business days.'
  }
]

export default function SupportPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto"
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

      {/* FAQ + Got a Question — Side by Side */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        {/* FAQ Section — Left */}
        <div className="lg:col-span-3">
          <Card className="h-full">
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
                      <span className="font-medium text-zinc-200 pr-4 text-sm">{faq.question}</span>
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
        </div>

        {/* Got a Question? — Right */}
        <div className="lg:col-span-2">
          <Card className="sticky top-6">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#D946EF]/10 border border-[#D946EF]/20 flex items-center justify-center mx-auto mb-5">
                <MessageCircle className="w-8 h-8 text-[#D946EF]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Got a Question?</h3>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                Can&apos;t find what you&apos;re looking for? Our support team is here to help. Reach out and we&apos;ll get back to you within 24–48 hours.
              </p>
              <a href="mailto:ProfitLoopAI@neoai.freshdesk.com">
                <button className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#D946EF] to-[#8B5CF6] text-white font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(217,70,239,0.3)]">
                  <Mail className="w-4 h-4" />
                  Message Us
                </button>
              </a>
              <p className="text-zinc-600 text-xs mt-4">ProfitLoopAI@neoai.freshdesk.com</p>
            </CardContent>
          </Card>
        </div>
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
                  Email us at ProfitLoopAI@neoai.freshdesk.com or open a ticket on the support portal. Include your account email and purchase date.
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
