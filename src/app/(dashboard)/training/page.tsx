'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { HelpTooltip } from '@/components/ui/help-tooltip'
import { Play, GraduationCap, ChevronDown, ChevronUp, Diamond } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

interface Video {
  id: string
  title: string
  description: string
  duration: string
  thumbnail: string
  videoUrl: string
  premium?: boolean
}

const trainingVideos: Video[] = [
  {
    id: '1',
    title: 'Getting Started with Profit Loop',
    description: 'A complete walkthrough of the platform — learn how to navigate the dashboard, understand each feature, and set up your account for success.',
    duration: '4:32',
    thumbnail: '',
    videoUrl: 'https://player.vimeo.com/video/1177396372',
  },
  {
    id: '2',
    title: 'How to Create Offer Templates',
    description: 'Step-by-step guide to building high-converting offer templates in the Offer Library using AI generation.',
    duration: '4:18',
    thumbnail: '',
    videoUrl: 'https://player.vimeo.com/video/1177396987',
  },
  {
    id: '3',
    title: 'Lead Magnet Masterclass',
    description: 'Learn how to pull leads by niche and location using Lead Magnet, and maximize your daily limit for the best results.',
    duration: '4:05',
    thumbnail: '',
    videoUrl: 'https://player.vimeo.com/video/1177396886',
  },
  {
    id: '4',
    title: 'Email Blast Deep Dive',
    description: 'Master Email Blast — choose the right tone, pair offers with leads, and generate AI emails that get responses.',
    duration: '4:22',
    thumbnail: '',
    videoUrl: 'https://player.vimeo.com/video/1177396779',
  },
  {
    id: '5',
    title: 'DFY Setup & Walkthrough',
    description: 'Complete guide to the Done-For-You system — 1,600 pre-built leads across 8 niches with pre-written emails ready to send.',
    duration: '4:38',
    thumbnail: '',
    videoUrl: 'https://player.vimeo.com/video/1177396681',
    premium: true,
  },
  {
    id: '6',
    title: 'Instant Income Blueprint',
    description: 'Learn the Instant Income method — copy-paste Facebook posts with your affiliate link to earn commissions from day one.',
    duration: '4:28',
    thumbnail: '',
    videoUrl: 'https://player.vimeo.com/video/1177396575',
    premium: true,
  },
  {
    id: '7',
    title: 'Autopilot System Configuration',
    description: 'Set up the Autopilot system to submit your link to 100+ free traffic sources and get automated traffic on cruise control.',
    duration: '4:45',
    thumbnail: '',
    videoUrl: 'https://player.vimeo.com/video/1177396473',
    premium: true,
  },
]

const faqs = [
  {
    question: 'How do I get started with Profit Loop?',
    answer: 'Watch the "Getting Started" video in the Training Videos tab above. The core workflow is: 1) Create offer templates in the Offer Library, 2) Pull leads in Lead Magnet by industry and location, 3) Generate personalized AI emails in Email Blast, 4) Copy and send via Gmail or Outlook. Repeat daily for best results.'
  },
  {
    question: 'What is the Offer Library and how do I use it?',
    answer: 'The Offer Library stores your reusable email templates. Click "New Template", choose a type (Affiliate, Service, or Partnership), fill in your details and custom instructions, then click "Generate with AI." The AI writes a professional email template you can save and reuse across all your outreach. You get 5 AI generations per day.'
  },
  {
    question: 'How does Lead Magnet work?',
    answer: 'Lead Magnet pulls real, verified business leads. Select a Target Industry (15 options including Restaurants, Real Estate, Health & Wellness, etc.) and a Target Location (city, state, or country). Click "Execute Allocation" and leads appear with business name, email, and website. You get 25 leads per day. Click "Generate Email" on any lead to jump straight to Email Blast.'
  },
  {
    question: 'How does Email Blast work?',
    answer: 'Select a lead from your Lead Magnet results, pick an offer template (or write a custom description), choose a tone (Professional, Friendly, or Direct), and click Generate. The AI creates a personalized subject line, email body, and follow-up message. You get 10 generations per day. Copy, paste into your email client, and send.'
  },
  {
    question: 'What are the daily limits?',
    answer: 'Lead Magnet: 25 leads per day. Email Blast: 10 email generations per day. Offer Library: 5 AI offer generations per day. All limits reset automatically every 24 hours. Your remaining count is always visible on the Dashboard and on each feature page.'
  },
  {
    question: 'Does Profit Loop send emails for me?',
    answer: 'No. Profit Loop generates email content only. You copy the email from Email Blast or Saved Emails, paste it into your email client (Gmail, Outlook, Yahoo, etc.), and send it yourself. This gives you full control over your outreach and avoids spam filter issues.'
  },
  {
    question: 'What is Saved Emails?',
    answer: 'Every email you generate in Email Blast can be saved by clicking "Save Email for Later." The Saved Emails page is your archive — view, expand, copy subject/body/follow-up individually, or use "Copy Complete Email" to grab everything at once. Great for reusing winning templates.'
  },
  {
    question: 'What are the three email tones?',
    answer: 'Professional — formal and polished, best for first-time cold outreach. Friendly — warm and approachable, ideal for follow-ups or casual industries like restaurants. Direct — sharp and to the point, great for busy decision-makers. The AI adjusts word choice, formality, and structure based on your selection.'
  },
  {
    question: 'What are Premium Features?',
    answer: 'Premium Features include three advanced tools: DFY (Done-For-You) gives you 1,600 pre-built leads with pre-written emails across 8 niches. Instant Income provides ready-to-post Facebook messages with your affiliate link. Autopilot gives you 100+ free traffic sources with submission guides. Plus Profit Protector for account security monitoring.'
  },
  {
    question: 'How does DFY (Done For You) work?',
    answer: 'DFY provides 1,600 verified leads across 8 niches (SaaS, Real Estate, E-commerce, Agencies, Coaching, Fitness, Crypto, Local Services) — 200 leads per niche. Each lead comes with a unique pre-written email. Paste your affiliate link, choose a niche, copy emails, and send. Use "Load More" to access all 200 leads per niche.'
  },
  {
    question: 'How does Instant Income work?',
    answer: 'Choose a niche (Weight Loss, Make Money Online, Health & Fitness, etc.), paste your affiliate link from DigiStore24 or similar, and click "Generate My Posts Now." You get 3 unique Facebook posts written as personal stories. Copy and paste them into Facebook groups (3-5 groups per day). Best posting times: 7-9 AM, 12-1 PM, 7-9 PM.'
  },
  {
    question: 'How does Autopilot work?',
    answer: 'Enter your promotion URL and click "Save & Continue." Your link is auto-inserted into all 102 traffic source submissions. Filter by niche, then for each source: click "View Instructions" for step-by-step guidance, "Copy Submission Text" to grab your pre-written post with your link, and "Mark as Done" to track progress. Submit to all 102 sources for maximum traffic.'
  },
  {
    question: 'What is Profit Protector?',
    answer: 'Profit Protector is your account security dashboard. It shows real-time security checks (account verification, secure connection, session protection, data encryption, server status, API connectivity), your account info, and recent security activity. All systems are monitored continuously.'
  },
  {
    question: 'How do I get the best results from AI emails?',
    answer: 'Use Professional tone for cold outreach. Add detailed custom instructions in your offer template (e.g., "mention their recent blog post" or "focus on saving them time"). Create separate templates for different industries. Research each lead\'s website before sending. Save every email to build a swipe file of winning templates.'
  },
  {
    question: 'What is the Scale to $1,000+/Day page?',
    answer: 'The Scale page links to an exclusive training on how to multiply your results using Profit Loop. It covers advanced automation, workflow optimization, and strategies to consistently hit $1,000+ per day by combining email outreach, Instant Income, and Autopilot traffic sources.'
  },
  {
    question: 'Can I change my promotion link in Autopilot?',
    answer: 'Yes. After saving your initial link, click "Change" to update it. Your new link will be used in all future submission text copies. Note: previously submitted sources will still have the old link — only new copies will reflect the change.'
  },
  {
    question: 'How do I contact support?',
    answer: 'Visit the Support page from the sidebar. You can open a ticket at our support portal (neoaifreshdesk.freshdesk.com) or email us at ProfitLoopAI@neoai.freshdesk.com. Response time is 24-48 hours.'
  },
]

export default function TrainingPage() {
  const [activeTab, setActiveTab] = useState<'videos' | 'faq'>('videos')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

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
          <h1 className="text-4xl font-bold gradient-text">Training</h1>
          <HelpTooltip
            variant="info"
            title="Training Center"
            content="Watch step-by-step video tutorials to master every feature. Premium videos are available with premium features."
          />
        </div>
        <p className="text-zinc-500 mt-2">Video tutorials and frequently asked questions</p>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="mb-6 flex gap-2">
        <button
          onClick={() => setActiveTab('videos')}
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
            activeTab === 'videos'
              ? 'bg-zinc-100 text-zinc-900'
              : 'bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <span className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            Training Videos
          </span>
        </button>
        <button
          onClick={() => setActiveTab('faq')}
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
            activeTab === 'faq'
              ? 'bg-zinc-100 text-zinc-900'
              : 'bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <span className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            FAQ
          </span>
        </button>
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === 'videos' ? (
          <motion.div
            key="videos"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Platform Videos */}
            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Play className="w-5 h-5 text-[#D946EF]" />
                Platform Tutorials
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trainingVideos.filter(v => !v.premium).map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="h-full hover:border-[#D946EF]/30 transition-colors">
                      <CardContent className="p-0">
                        <div className="relative aspect-video bg-zinc-900 rounded-t-xl overflow-hidden">
                          <iframe
                            src={`${video.videoUrl}?title=0&byline=0&portrait=0`}
                            className="w-full h-full"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-white text-sm mb-1">{video.title}</h3>
                          <p className="text-xs text-zinc-500 leading-relaxed">{video.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Premium Videos */}
            <motion.div variants={itemVariants}>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Diamond className="w-5 h-5 text-[#D946EF]" />
                Premium Feature Tutorials
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trainingVideos.filter(v => v.premium).map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="h-full hover:border-[#D946EF]/30 transition-colors relative overflow-hidden">
                      <CardContent className="p-0">
                        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D946EF] text-black text-[10px] font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(217,70,239,0.5)]">
                          <Diamond className="w-3 h-3" />
                          Premium
                        </div>
                        <div className="relative aspect-video bg-zinc-900 rounded-t-xl overflow-hidden">
                          <iframe
                            src={`${video.videoUrl}?title=0&byline=0&portrait=0`}
                            className="w-full h-full"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-white text-sm mb-1">{video.title}</h3>
                          <p className="text-xs text-zinc-500 leading-relaxed">{video.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="faq"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-indigo-400/10 border border-indigo-400/20">
                    <GraduationCap className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>Quick answers to common questions about the platform</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-zinc-800/50">
                  {faqs.map((faq, index) => (
                    <div key={index} className="px-6">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        className="w-full py-5 flex items-center justify-between gap-4 text-left"
                      >
                        <span className="font-medium text-white text-sm">{faq.question}</span>
                        {expandedFaq === index ? (
                          <ChevronUp className="w-4 h-4 text-[#D946EF] flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                        )}
                      </button>
                      <AnimatePresence>
                        {expandedFaq === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <p className="pb-5 text-sm text-zinc-400 leading-relaxed">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
