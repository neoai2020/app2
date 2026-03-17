'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { HelpTooltip } from '@/components/ui/help-tooltip'
import { Mail, Shield, Clock, AlertTriangle, CheckCircle, ArrowRight, Terminal } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function SendInstructionsPage() {
  const steps = [
    { number: '01', title: 'Access Archive', description: 'Navigate to Saved Emails to view prepared messages' },
    { number: '02', title: 'Copy Content', description: 'Use copy function to capture subject and body' },
    { number: '03', title: 'Open Client', description: 'Launch Gmail, Outlook, or preferred email service' },
    { number: '04', title: 'Execute Send', description: 'Paste content, verify recipient, and transmit' }
  ]

  const guidelines = [
    { icon: CheckCircle, text: 'Start with 5-10 emails per day for initial deployment' },
    { icon: CheckCircle, text: 'Increase by 5-10 emails weekly as reputation builds' },
    { icon: CheckCircle, text: 'Maximum 50 emails per day from standard accounts' },
    { icon: CheckCircle, text: 'Maintain 2-5 minute intervals between transmissions' }
  ]

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
          <h1 className="text-4xl font-bold gradient-text">Send Protocol</h1>
          <HelpTooltip
            variant="info"
            title="Sending Guidelines"
            content="Follow these instructions carefully to maximize deliverability and avoid spam filters. Proper sending practices are crucial for success."
            learnMoreLink="/support#sending"
          />
        </div>
        <p className="text-zinc-500 mt-2">Transmission guidelines and best practices</p>
      </motion.div>

      {/* Important Notice */}
      <motion.div variants={itemVariants}>
        <Card className="mb-6 border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="py-4">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <h3 className="font-semibold text-yellow-400 uppercase tracking-wider text-sm">System Notice</h3>
                <p className="text-zinc-400 mt-1">
                  This system prepares outreach content only. Transmission control remains with the operator.
                  All sends are executed through your personal email infrastructure.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Manual Sending Steps */}
      <motion.div variants={itemVariants}>
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-400/10 border border-blue-400/20">
                <Terminal className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <CardTitle>Transmission Sequence</CardTitle>
                <CardDescription>Standard operating procedure for email deployment</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/30 hover:border-blue-400/20 transition-colors"
                >
                  <div className="shrink-0 w-12 h-12 rounded-lg bg-linear-to-br from-blue-400/20 to-indigo-400/20 border border-blue-400/30 flex items-center justify-center">
                    <span className="font-mono text-blue-400 font-bold">{step.number}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">{step.title}</h4>
                    <p className="text-zinc-400 text-sm">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="w-5 h-5 text-zinc-600 hidden md:block" />
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sending Volume */}
      <motion.div variants={itemVariants}>
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-400/10 border border-green-400/20">
                <Clock className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <CardTitle>Volume Guidelines</CardTitle>
                <CardDescription>Optimal transmission rates for deliverability</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {guidelines.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-green-400/5 border border-green-400/10"
                >
                  <item.icon className="w-5 h-5 text-green-400 shrink-0" />
                  <span className="text-zinc-300">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Compliance */}
      <motion.div variants={itemVariants}>
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-indigo-400/10 border border-indigo-400/20">
                <Shield className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <CardTitle>Compliance Protocol</CardTitle>
                <CardDescription>Required practices for legitimate outreach</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/30">
                <h4 className="font-medium text-green-400 mb-3 uppercase tracking-wider text-sm">Required Elements</h4>
                <ul className="space-y-2">
                  {['Real name and contact information', 'Clear opt-out mechanism', 'Physical business address'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-zinc-400 text-sm">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/30">
                <h4 className="font-medium text-red-400 mb-3 uppercase tracking-wider text-sm">Prohibited Actions</h4>
                <ul className="space-y-2">
                  {['Targeting personal email addresses', 'Misleading subject lines', 'False claims or guarantees', 'Ignoring unsubscribe requests'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-zinc-400 text-sm">
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Advanced SMTP */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-orange-400/10 border border-orange-400/20">
                <Mail className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <CardTitle>Advanced: SMTP Configuration</CardTitle>
                <CardDescription>Optional infrastructure for experienced operators</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-400 mb-4">
              For operators familiar with email infrastructure, direct SMTP integration 
              enables streamlined transmission workflows.
            </p>
            <div className="p-4 rounded-lg bg-blue-400/5 border border-blue-400/20">
              <h4 className="font-medium text-blue-400 mb-3 uppercase tracking-wider text-sm">Recommended Providers</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Google Workspace', 'Microsoft 365', 'Zoho Mail', 'SendGrid'].map((provider) => (
                  <div key={provider} className="p-2 rounded bg-zinc-800/50 text-center text-sm text-zinc-300">
                    {provider}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-zinc-600 mt-4 uppercase tracking-wider">
              SMTP configuration not managed within this system. Consult provider documentation.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
