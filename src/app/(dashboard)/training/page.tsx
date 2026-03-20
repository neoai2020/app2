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
    title: 'Lead Allocation Masterclass',
    description: 'Learn how to allocate leads by niche and location, and maximize your daily allocation limit for the best results.',
    duration: '7:42',
    thumbnail: '',
    videoUrl: '#',
  },
  {
    id: '4',
    title: 'Email Builder Deep Dive',
    description: 'Master the AI email builder — choose the right tone, pair offers with leads, and generate emails that get responses.',
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
    description: 'Set up the Autopilot system to run your outreach on cruise control. Automate lead allocation, email generation, and follow-ups.',
    duration: '13:45',
    thumbnail: '',
    videoUrl: '#',
    premium: true,
  },
]

const faqs = [
  {
    question: 'What is the daily lead allocation limit?',
    answer: 'Your allocation is capped at 25 leads per 24-hour cycle. This resets at midnight local time. Limits ensure lead quality and prevent system abuse.'
  },
  {
    question: 'How many emails can I generate daily?',
    answer: 'The system allows 10 AI-generated emails per cycle. Each generation includes subject, body, and optional follow-up content.'
  },
  {
    question: 'How many AI offer generations do I get per day?',
    answer: 'You get 5 AI offer template generations per day in the Offer Library. The counter resets every 24 hours.'
  },
  {
    question: 'Why are some business emails unavailable?',
    answer: 'We only surface publicly available business contact information. Personal emails are never collected, ensuring regulatory compliance.'
  },
  {
    question: 'Does the system send emails automatically?',
    answer: 'No. This system generates content only. You maintain full control over transmission through your personal email infrastructure.'
  },
  {
    question: 'How do I send generated emails?',
    answer: 'Copy the generated content from the Email Builder or Saved Emails page, paste it into your email client (Gmail, Outlook, etc.), and send manually.'
  },
  {
    question: 'Are allocated leads validated?',
    answer: 'Yes. All email addresses undergo format validation and deliverability checks. However, 100% deliverability cannot be guaranteed due to dynamic server configurations.'
  },
  {
    question: 'What are Premium Features?',
    answer: 'Premium Features include DFY (Done-For-You), Instant Income, and Autopilot. These are advanced tools designed to accelerate your results with pre-built systems and automation.'
  },
  {
    question: 'Can I use multiple offer templates?',
    answer: 'Absolutely. We recommend creating different templates for different industries and offer types. Tailored offers convert significantly better than generic ones.'
  },
  {
    question: 'How do I get the best results from AI emails?',
    answer: 'Use the Professional tone for first-time outreach, fill in detailed notes and custom instructions in your offer template, and always select a specific lead target for personalization.'
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
