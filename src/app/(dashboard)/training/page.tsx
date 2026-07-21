'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { BonusTrainingCard } from '@/components/ui/bonus-training-card'
import { HelpTooltip } from '@/components/ui/help-tooltip'
import { VideoOverlay } from '@/components/ui/video-overlay'
import { getVideoThumbnail } from '@/lib/video-thumbnails'
import { Play, GraduationCap, ChevronDown, ChevronUp, Diamond } from 'lucide-react'

const VIDEOS_PER_ROW = 2

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
    thumbnail: '/thumbnails/thumb-01-getting-started.webp',
    videoUrl: 'https://player.vimeo.com/video/1177396372',
  },
  {
    id: '2',
    title: 'How to Create Offer Templates',
    description: 'Step-by-step guide to building high-converting offer templates in the Offer Library using AI generation.',
    duration: '4:18',
    thumbnail: '/thumbnails/thumb-02-offer-templates.webp',
    videoUrl: 'https://player.vimeo.com/video/1177396987',
  },
  {
    id: '3',
    title: 'Find Customers Masterclass',
    description: 'Learn how to pull leads by niche and location using Find Customers, and maximize your daily limit for the best results.',
    duration: '4:05',
    thumbnail: '/thumbnails/thumb-03-find-customers.webp',
    videoUrl: 'https://player.vimeo.com/video/1177396886',
  },
  {
    id: '4',
    title: 'Write Emails Deep Dive',
    description: 'Master Write Emails — choose the right tone, pair offers with leads, and generate AI emails that get responses.',
    duration: '4:22',
    thumbnail: '/thumbnails/thumb-04-write-emails.webp',
    videoUrl: 'https://player.vimeo.com/video/1177396779',
  },
  {
    id: '5',
    title: 'Accelerator Setup & Walkthrough',
    description: 'Complete guide to the Accelerator system — 1,600 pre-built leads across 8 niches with pre-written emails ready to send.',
    duration: '4:38',
    thumbnail: '/thumbnails/thumb-05-accelerator.webp',
    videoUrl: 'https://player.vimeo.com/video/1177396681',
    premium: true,
  },
  {
    id: '6',
    title: 'Recurring Streams Blueprint',
    description: 'Learn the Recurring Streams method — copy-paste Facebook posts with your affiliate link to earn commissions from day one.',
    duration: '4:28',
    thumbnail: '/thumbnails/thumb-06-recurring-streams.webp',
    videoUrl: 'https://player.vimeo.com/video/1177396575',
    premium: true,
  },
  {
    id: '7',
    title: 'Social Payouts Configuration',
    description: 'Set up Social Payouts to submit your link to 100+ free traffic sources and get automated traffic on cruise control.',
    duration: '4:45',
    thumbnail: '/thumbnails/thumb-07-social-payouts.webp',
    videoUrl: 'https://player.vimeo.com/video/1177396473',
    premium: true,
  },
]

function chunkIntoRows<T>(items: T[], rowSize: number): T[][] {
  const rows: T[][] = []
  for (let i = 0; i < items.length; i += rowSize) {
    rows.push(items.slice(i, i + rowSize))
  }
  return rows
}

function TrainingVideoCard({ video, index }: { video: Video; index: number }) {
  const [open, setOpen] = useState(false)
  const thumbnail = getVideoThumbnail(video.videoUrl)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="h-full hover:border-[#D946EF]/30 transition-colors relative overflow-hidden">
        {video.premium && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D946EF] text-black text-[10px] font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(217,70,239,0.5)]">
            <Diamond className="w-3 h-3" />
            Premium
          </div>
        )}
        <CardContent className="p-0">
          <div className="relative aspect-video bg-zinc-900 rounded-t-xl overflow-hidden">
            {thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbnail}
                alt={`${video.title} thumbnail`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a1f] to-zinc-900" />
            )}
            <div className={`absolute inset-0 ${thumbnail ? 'thumb-scrim' : 'bg-black/40'}`} />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={`Play ${video.title}`}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/20 bg-gradient-to-br from-[#8B5CF6] to-[#D946EF] text-white shadow-2xl transition-transform duration-300 hover:scale-110">
                <Play className="ml-1 h-8 w-8 fill-white" />
              </span>
              <span className="text-sm font-semibold text-white drop-shadow-lg">
                ▶ Click to Play Video
              </span>
            </button>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-white text-sm mb-1">{video.title}</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">{video.description}</p>
          </div>
        </CardContent>
      </Card>

      {open && (
        <VideoOverlay
          videoUrl={video.videoUrl}
          title={video.title}
          onClose={() => setOpen(false)}
        />
      )}
    </motion.div>
  )
}

function VideoRowsWithPromo({ videos }: { videos: Video[] }) {
  const rows = chunkIntoRows(videos, VIDEOS_PER_ROW)

  return (
    <div className="space-y-8">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {row.map((video, videoIndex) => (
              <TrainingVideoCard
                key={video.id}
                video={video}
                index={rowIndex * VIDEOS_PER_ROW + videoIndex}
              />
            ))}
          </div>
          {rowIndex < rows.length - 1 && <BonusTrainingCard variant="compact" />}
        </div>
      ))}
    </div>
  )
}

const faqs = [
  {
    question: 'How do I get started with Profit Loop?',
    answer: 'Watch the "Getting Started" video on the Dashboard or in Training. The core workflow is: 1) Create offer templates in the Offer Library, 2) Find customers by business type and location, 3) Generate personalized AI emails in Write Emails, 4) Copy and send from your own inbox (Gmail, Outlook, etc.). Repeat daily for best results.'
  },
  {
    question: 'What is the Offer Library and how do I use it?',
    answer: 'The Offer Library stores your reusable outreach templates. Click "New Template", choose a type (Affiliate Offer, Service Offer, or Partnership), fill in your details and any custom notes, then click Generate with AI. The AI writes a professional email template you can save and reuse. You get 5 AI generations per day.'
  },
  {
    question: 'How does Find Customers work?',
    answer: 'Pick a type of business (15 options including Restaurants & Cafes, Real Estate, Health & Wellness, and more) and a location (city, state, or country). Click "Find My Customers" and businesses appear with name, email, and website when available. You get 25 searches per day. From any result you can jump into Write Emails to draft outreach.'
  },
  {
    question: 'How does Write Emails work?',
    answer: 'Select a customer from your Find Customers results, pick an offer template (or write a custom description), choose a tone (Professional, Friendly, or Direct), and click Generate. The AI creates a personalized subject line, email body, and follow-up. You get 10 generations per day. Copy the email into your own inbox and send it yourself.'
  },
  {
    question: 'What are the daily limits?',
    answer: 'Find Customers: 25 searches per day. Write Emails: 10 email generations per day. Offer Library: 5 AI offer generations per day. Limits reset at midnight. Your remaining count is always visible on the Dashboard and on each feature page.'
  },
  {
    question: 'Does Profit Loop send emails for me?',
    answer: 'No. Profit Loop generates email content only. You copy the email from Write Emails or Saved Emails, paste it into your email client (Gmail, Outlook, Yahoo, etc.), and send it yourself. This keeps you in control and helps avoid spam-filter issues.'
  },
  {
    question: 'What is Saved Emails?',
    answer: 'Every email you generate in Write Emails can be saved for later. Saved Emails is your archive — view, expand, copy subject/body/follow-up individually, or copy the complete email at once. Great for reusing messages that get replies.'
  },
  {
    question: 'What are the three email tones?',
    answer: 'Professional — formal and business-like, best for first-time cold outreach. Friendly — warm and approachable, ideal for follow-ups or casual industries. Direct — clear and to the point, great for busy decision-makers. The AI adjusts word choice and structure based on your selection.'
  },
  {
    question: 'What are Premium Features?',
    answer: 'Premium Features (in the sidebar) include four tools: Accelerator — 1,600 pre-built leads with pre-written emails across 8 niches. Recurring Streams — ready-to-post Facebook messages with your affiliate link. Social Payouts — 100+ free traffic sources with step-by-step submission guides. Protector — your account security overview.'
  },
  {
    question: 'How does Accelerator work?',
    answer: 'Watch the on-page training video first. Accelerator gives you 1,600 verified leads across 8 niches (SaaS, Real Estate, E-commerce, Agencies, Coaching, Fitness, Crypto, Local Services) — 200 per niche. Each lead includes a unique pre-written email. Paste your affiliate link, choose a niche, copy emails, and send from your inbox. Use "Load More" to unlock all 200 leads per niche.'
  },
  {
    question: 'How does Recurring Streams work?',
    answer: 'Watch the training video on the page. Choose a niche (Weight Loss, Make Money Online, Health & Fitness, etc.), paste your affiliate link (e.g. from DigiStore24), and click "Generate My Posts Now." You get 3 unique Facebook posts written as personal stories. Copy and paste them into Facebook groups (about 3–5 groups per day). Best posting times: 7–9 AM, 12–1 PM, 7–9 PM.'
  },
  {
    question: 'How does Social Payouts work?',
    answer: 'Watch the training video first. Enter your promotion URL and click Save. Your link is auto-inserted into all 102 traffic source submissions. Filter by niche, then for each source: open the instructions, copy the pre-written submission text with your link, and mark it done to track progress.'
  },
  {
    question: 'What is Protector?',
    answer: 'Protector is your account security dashboard under Premium Features. It shows real-time security checks (account verification, secure connection, session protection, data encryption, server status, API connectivity), your account info, and recent security activity.'
  },
  {
    question: 'How do I get the best results from AI emails?',
    answer: 'Use Professional tone for cold outreach. Add detailed notes in your offer template (for example, "mention their recent blog post" or "focus on saving them time"). Create separate templates for different industries. Glance at each business\'s website before sending. Save strong emails to build a swipe file.'
  },
  {
    question: 'What are Exclusive offers?',
    answer: 'Exclusive offers appear in the sidebar (and under More on mobile): Fast Cash Training, Create your P-55 account, and Get Paid To Copy & Paste. Each opens in a new tab. They are optional partner offers — separate from your Profit Loop membership.'
  },
  {
    question: 'Can I change my promotion link in Social Payouts?',
    answer: 'Yes. After saving your initial link, click Change to update it. Your new link is used in all future submission text copies. Sources you already submitted still have the old link — only new copies reflect the change.'
  },
  {
    question: 'How do I contact support?',
    answer: 'Open the Support page from the sidebar (or More on mobile). You can open a ticket at https://neoaifreshdesk.freshdesk.com or email ProfitLoopAI@neoai.freshdesk.com. Typical response time is 24–48 hours.'
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
      className="max-w-7xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <PageHeader
          eyebrow="Academy"
          title={
            <span className="flex items-center gap-3">
              Training
              <HelpTooltip
                variant="info"
                title="Training Center"
                content="Watch step-by-step video tutorials to master every feature. Premium videos are available with premium features."
              />
            </span>
          }
          subtitle="Video tutorials and frequently asked questions"
        />
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="mb-6 flex gap-2">
        <button
          onClick={() => setActiveTab('videos')}
          className={`ds-chip transition-colors ${
            activeTab === 'videos'
              ? 'bg-[#D946EF] text-black'
              : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white'
          }`}
        >
          <span className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            Training Videos
          </span>
        </button>
        <button
          onClick={() => setActiveTab('faq')}
          className={`ds-chip transition-colors ${
            activeTab === 'faq'
              ? 'bg-[#D946EF] text-black'
              : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white'
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
            <div className="mb-8">
              <h2 className="ds-h2 mb-4 flex items-center gap-2">
                <Play className="w-5 h-5 text-[#D946EF]" />
                Platform Tutorials
              </h2>
              <VideoRowsWithPromo videos={trainingVideos.filter(v => !v.premium)} />
            </div>

            {/* Premium Videos */}
            <div>
              <h2 className="ds-h2 mb-4 flex items-center gap-2">
                <Diamond className="w-5 h-5 text-[#D946EF]" />
                Premium Feature Tutorials
              </h2>
              <VideoRowsWithPromo videos={trainingVideos.filter(v => v.premium)} />
            </div>
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
                  <div className="p-3 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20">
                    <GraduationCap className="w-6 h-6 text-[#8B5CF6]" />
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
