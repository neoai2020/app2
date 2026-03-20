'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { HelpTooltip } from '@/components/ui/help-tooltip'
import { Play, GraduationCap, ChevronDown, ChevronUp, Diamond, Lock } from 'lucide-react'

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
    title: 'Getting Started with Inbox Vault',
    description: 'A complete walkthrough of the platform — learn how to navigate the dashboard, understand each feature, and set up your account for success.',
    duration: '8:24',
    thumbnail: '',
    videoUrl: '#',
  },
  {
    id: '2',
    title: 'How to Create Offer Templates',
    description: 'Step-by-step guide to building high-converting offer templates in the Offer Library using AI generation.',
    duration: '6:15',
    thumbnail: '',
    videoUrl: '#',
  },
  {
    id: '3',
    title: 'Lead Magnet Masterclass',
    description: 'Learn how to pull leads by niche and location using Lead Magnet, and maximize your daily limit for the best results.',
    duration: '7:42',
    thumbnail: '',
    videoUrl: '#',
  },
  {
    id: '4',
    title: 'Email Blast Deep Dive',
    description: 'Master Email Blast — choose the right tone, pair offers with leads, and generate AI emails that get responses.',
    duration: '9:10',
    thumbnail: '',
    videoUrl: '#',
  },
  {
    id: '5',
    title: 'Saving & Managing Emails',
    description: 'How to save generated emails, organize them, and use the saved emails page to manage your outreach pipeline.',
    duration: '4:30',
    thumbnail: '',
    videoUrl: '#',
  },
  {
    id: '6',
    title: 'Scaling to $1,000+/Day',
    description: 'Advanced strategies and mindset shifts to scale your outreach revenue using the platform tools at maximum capacity.',
    duration: '12:05',
    thumbnail: '',
    videoUrl: '#',
  },
  {
    id: '7',
    title: 'DFY Setup & Walkthrough',
    description: 'Complete guide to the Done-For-You system — how it works, what to expect, and how to get started immediately.',
    duration: '10:30',
    thumbnail: '',
    videoUrl: '#',
    premium: true,
  },
  {
    id: '8',
    title: 'Instant Income Blueprint',
    description: 'Learn the Instant Income method — quick-win strategies that generate revenue from day one using pre-built campaigns.',
    duration: '11:15',
    thumbnail: '',
    videoUrl: '#',
    premium: true,
  },
  {
    id: '9',
    title: 'Autopilot System Configuration',
    description: 'Set up the Autopilot system to submit your link to 100+ free traffic sources and get automated traffic on cruise control.',
    duration: '13:45',
    thumbnail: '',
    videoUrl: '#',
    premium: true,
  },
]

const faqs = [
  {
    question: 'How do I get started with Inbox Vault?',
    answer: 'Start by creating an offer template in the Offer Library. Then go to Lead Magnet to pull leads for your niche. Finally, use Email Blast to generate personalized outreach emails using AI. Save your emails and send them through your own email client.'
  },
  {
    question: 'What is the Offer Library?',
    answer: 'The Offer Library is where you create and manage reusable offer templates. You can generate templates with AI (5 per day) for Affiliate Offers, Service Offers, or Partnership proposals. These templates are used when generating emails in Email Blast.'
  },
  {
    question: 'How does Lead Magnet work?',
    answer: 'Lead Magnet lets you pull real business leads by selecting an industry and location. You get up to 25 leads per day. Each lead includes the business name, email, and industry — ready for outreach.'
  },
  {
    question: 'How does Email Blast work?',
    answer: 'Select a lead from Lead Magnet, choose an offer template (or write a custom one), pick a tone, and hit Generate. The AI creates a personalized subject line, email body, and follow-up. You get 10 email generations per day.'
  },
  {
    question: 'What are the daily limits?',
    answer: 'Lead Magnet: 25 leads/day. Email Blast: 10 email generations/day. Offer Library: 5 AI offer generations/day. All limits reset every 24 hours.'
  },
  {
    question: 'Does the platform send emails for me?',
    answer: 'No. Inbox Vault generates email content only. You copy the generated email from Email Blast or Saved Emails, paste it into your email client (Gmail, Outlook, etc.), and send it yourself. This keeps you in full control.'
  },
  {
    question: 'What is Saved Emails?',
    answer: 'After generating an email in Email Blast, you can click "Save Email for Later" to store it. The Saved Emails page lets you view, copy, and manage all your previously generated emails.'
  },
  {
    question: 'What are Premium Features?',
    answer: 'Premium Features are advanced tools: DFY (Done-For-You) provides pre-built campaigns, Instant Income gives you ready-to-post Facebook messages with affiliate links, and Autopilot lets you submit your link to 100+ free traffic sources for ongoing automated traffic.'
  },
  {
    question: 'How does Instant Income work?',
    answer: 'Choose a niche, paste your affiliate link (e.g. from DigiStore24), and get ready-made Facebook posts you can copy and paste into Facebook groups. Posts are written as personal stories to maximize engagement.'
  },
  {
    question: 'How does Autopilot work?',
    answer: 'Enter the URL you want to promote, pick your niche, and get access to 100+ free traffic sources. Each source has step-by-step instructions, a ready-to-copy submission text with your link, and a direct link to the site. Track your progress as you complete each one.'
  },
  {
    question: 'Can I use multiple offer templates?',
    answer: 'Yes, and we strongly recommend it. Create different templates for different industries and offer types. Tailored offers convert significantly better than generic ones.'
  },
  {
    question: 'How do I get the best results from AI emails?',
    answer: 'Use the Professional tone for first-time outreach. Add detailed notes and custom instructions in your offer template for more personalized results. Always select a specific lead target so the AI can tailor the email.'
  },
]

export default function TrainingPage() {
  const [activeTab, setActiveTab] = useState<'videos' | 'faq'>('videos')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)

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
                    <Card className="h-full hover:border-[#D946EF]/30 transition-colors group cursor-pointer">
                      <CardContent className="p-0">
                        {/* Video Thumbnail / Player */}
                        <div
                          className="relative aspect-video bg-zinc-900 rounded-t-xl overflow-hidden"
                          onClick={() => setPlayingVideo(playingVideo === video.id ? null : video.id)}
                        >
                          {playingVideo === video.id ? (
                            <div className="w-full h-full flex items-center justify-center bg-black">
                              <p className="text-zinc-500 text-sm">Video player placeholder</p>
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-800">
                              <div className="w-14 h-14 rounded-full bg-[#D946EF]/20 border border-[#D946EF]/40 flex items-center justify-center group-hover:bg-[#D946EF]/30 group-hover:scale-110 transition-all">
                                <Play className="w-6 h-6 text-[#D946EF] ml-0.5" />
                              </div>
                              <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-xs text-zinc-300 font-mono">
                                {video.duration}
                              </span>
                            </div>
                          )}
                        </div>
                        {/* Info */}
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
                    <Card className="h-full hover:border-[#D946EF]/30 transition-colors group cursor-pointer relative overflow-hidden">
                      <CardContent className="p-0">
                        {/* Premium Badge */}
                        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D946EF] text-black text-[10px] font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(217,70,239,0.5)]">
                          <Diamond className="w-3 h-3" />
                          Premium
                        </div>
                        {/* Video Thumbnail / Player */}
                        <div
                          className="relative aspect-video bg-zinc-900 rounded-t-xl overflow-hidden"
                          onClick={() => setPlayingVideo(playingVideo === video.id ? null : video.id)}
                        >
                          {playingVideo === video.id ? (
                            <div className="w-full h-full flex items-center justify-center bg-black">
                              <p className="text-zinc-500 text-sm">Video player placeholder</p>
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#D946EF]/5 via-zinc-900 to-indigo-500/5">
                              <div className="w-14 h-14 rounded-full bg-[#D946EF]/20 border border-[#D946EF]/40 flex items-center justify-center group-hover:bg-[#D946EF]/30 group-hover:scale-110 transition-all">
                                <Lock className="w-5 h-5 text-[#D946EF]" />
                              </div>
                              <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-xs text-zinc-300 font-mono">
                                {video.duration}
                              </span>
                            </div>
                          )}
                        </div>
                        {/* Info */}
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
