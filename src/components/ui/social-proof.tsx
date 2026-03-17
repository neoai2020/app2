'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DollarSign, TrendingUp, Mail, Users, CheckCircle } from 'lucide-react'

interface Notification {
  id: number
  name: string
  location: string
  action: string
  amount?: string
  icon: 'dollar' | 'email' | 'lead' | 'success'
  timeAgo: string
}

const firstNames = [
  'Michael', 'Sarah', 'David', 'Jennifer', 'Robert', 'Lisa', 'James', 'Emily',
  'John', 'Amanda', 'William', 'Jessica', 'Richard', 'Ashley', 'Thomas', 'Michelle',
  'Daniel', 'Stephanie', 'Matthew', 'Nicole', 'Anthony', 'Elizabeth', 'Mark', 'Heather',
  'Steven', 'Megan', 'Paul', 'Rachel', 'Andrew', 'Laura', 'Kenneth', 'Christina',
  'George', 'Kimberly', 'Edward', 'Brittany', 'Brian', 'Samantha', 'Ronald', 'Katherine'
]

const locations = [
  'New York, USA', 'Los Angeles, USA', 'Chicago, USA', 'Houston, USA', 'Phoenix, USA',
  'London, UK', 'Toronto, Canada', 'Sydney, Australia', 'Miami, USA', 'Dallas, USA',
  'Atlanta, USA', 'Denver, USA', 'Seattle, USA', 'Boston, USA', 'Austin, USA',
  'San Diego, USA', 'Portland, USA', 'Nashville, USA', 'Charlotte, USA', 'Orlando, USA',
  'Vancouver, Canada', 'Melbourne, Australia', 'Manchester, UK', 'Dublin, Ireland'
]

const actions = [
  { text: 'just received a response', icon: 'email' as const, hasAmount: false },
  { text: 'closed a deal worth', icon: 'dollar' as const, hasAmount: true },
  { text: 'generated', icon: 'lead' as const, hasAmount: false, suffix: 'new leads' },
  { text: 'just made', icon: 'dollar' as const, hasAmount: true },
  { text: 'successfully sent', icon: 'success' as const, hasAmount: false, suffix: 'emails' },
  { text: 'earned', icon: 'dollar' as const, hasAmount: true },
  { text: 'booked a call worth', icon: 'dollar' as const, hasAmount: true },
]

const amounts = ['$127', '$250', '$89', '$340', '$175', '$420', '$195', '$310', '$85', '$550', '$275', '$180']
const leadCounts = ['15', '22', '18', '25', '12', '30', '28', '20']
const emailCounts = ['45', '32', '28', '50', '38', '42', '55', '35']
const timeAgos = ['just now', '2 min ago', '5 min ago', '8 min ago', '12 min ago', '15 min ago']

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateNotification(id: number): Notification {
  const action = getRandomItem(actions)
  let actionText = action.text
  
  if (action.suffix === 'new leads') {
    actionText = `${action.text} ${getRandomItem(leadCounts)} ${action.suffix}`
  } else if (action.suffix === 'emails') {
    actionText = `${action.text} ${getRandomItem(emailCounts)} ${action.suffix}`
  }

  return {
    id,
    name: getRandomItem(firstNames),
    location: getRandomItem(locations),
    action: actionText,
    amount: action.hasAmount ? getRandomItem(amounts) : undefined,
    icon: action.icon,
    timeAgo: getRandomItem(timeAgos)
  }
}

const iconComponents = {
  dollar: DollarSign,
  email: Mail,
  lead: Users,
  success: CheckCircle
}

const iconColors = {
  dollar: 'text-green-400 bg-green-400/20',
  email: 'text-blue-400 bg-blue-400/20',
  lead: 'text-indigo-400 bg-indigo-400/20',
  success: 'text-blue-400 bg-blue-400/20'
}

export function SocialProofNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [counter, setCounter] = useState(0)

  const addNotification = useCallback(() => {
    const newNotification = generateNotification(counter)
    setNotifications(prev => [newNotification, ...prev].slice(0, 1)) // Only show 1 at a time
    setCounter(prev => prev + 1)
  }, [counter])

  useEffect(() => {
    // Initial notification after 5 seconds
    const initialTimeout = setTimeout(() => {
      addNotification()
    }, 5000)

    // Then every 15-25 seconds randomly (less overwhelming)
    const interval = setInterval(() => {
      addNotification()
    }, 15000 + Math.random() * 10000)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [addNotification])

  // Auto-remove notifications after 6 seconds
  useEffect(() => {
    if (notifications.length > 0) {
      const timeout = setTimeout(() => {
        setNotifications(prev => prev.slice(0, -1))
      }, 6000)
      return () => clearTimeout(timeout)
    }
  }, [notifications])

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-[300px]">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => {
          const Icon = iconComponents[notification.icon]
          const colorClass = iconColors[notification.icon]
          
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="rounded-xl p-4 shadow-2xl border border-zinc-700/50"
              style={{
                background: 'linear-gradient(135deg, rgba(24, 24, 27, 0.98) 0%, rgba(39, 39, 42, 0.98) 100%)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)'
              }}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-lg ${colorClass}`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-white text-sm truncate">
                      {notification.name}
                    </p>
                    <span className="shrink-0 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  </div>
                  <p className="text-zinc-400 text-xs mt-0.5">
                    {notification.location}
                  </p>
                  <p className="text-zinc-200 text-sm mt-2 font-medium">
                    {notification.action}
                    {notification.amount && (
                      <span className="text-green-400 font-bold ml-1">
                        {notification.amount}
                      </span>
                    )}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-zinc-700/50">
                    <TrendingUp size={12} className="text-green-400" />
                    <p className="text-zinc-500 text-xs">
                      {notification.timeAgo}
                    </p>
                    <span className="text-zinc-600">•</span>
                    <span className="text-green-500 text-xs font-medium">Verified</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

// Live counter component for dashboard
export function LiveActivityCounter() {
  const [stats, setStats] = useState({
    totalEarnings: 683755.34,
    activeUsers: 1847,
    emailsSent: 47521,
    leadsGenerated: 12892
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        totalEarnings: prev.totalEarnings + (Math.random() * 15) + 5,
        activeUsers: prev.activeUsers + (Math.random() > 0.7 ? 1 : Math.random() > 0.3 ? 0 : -1),
        emailsSent: prev.emailsSent + Math.floor(Math.random() * 2) + 1,
        leadsGenerated: prev.leadsGenerated + (Math.random() > 0.6 ? 1 : 0)
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  const formatCurrency = (num: number) => {
    return '$' + num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="text-center p-4 rounded-lg bg-green-400/5 border border-green-400/20">
        <p className="text-2xl font-bold text-green-400 font-mono">
          {formatCurrency(stats.totalEarnings)}
        </p>
        <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Community Earnings</p>
      </div>
      <div className="text-center p-4 rounded-lg bg-blue-400/5 border border-blue-400/20">
        <p className="text-2xl font-bold text-blue-400 font-mono">
          {formatNumber(stats.activeUsers)}
        </p>
        <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Active Members</p>
      </div>
      <div className="text-center p-4 rounded-lg bg-indigo-400/5 border border-indigo-400/20">
        <p className="text-2xl font-bold text-indigo-400 font-mono">
          {formatNumber(stats.emailsSent)}
        </p>
        <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Emails Sent</p>
      </div>
      <div className="text-center p-4 rounded-lg bg-orange-400/5 border border-orange-400/20">
        <p className="text-2xl font-bold text-orange-400 font-mono">
          {formatNumber(stats.leadsGenerated)}
        </p>
        <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Leads Generated</p>
      </div>
    </div>
  )
}
