'use client'

import { useEffect, useState } from 'react'
import { HelpCircle, X } from 'lucide-react'
import { ContactSupportWidget } from '@/components/ui/contact-support-widget'

export function AuthSupportButton() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Contact support"
            className="fixed bottom-4 right-4 left-4 z-50 flex max-h-[calc(100dvh-2rem)] w-auto flex-col overflow-hidden rounded-2xl shadow-2xl shadow-black/60 sm:left-auto sm:bottom-6 sm:right-6 sm:w-[400px]"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close support form"
              className="absolute right-3 top-3 z-10 rounded-full border border-white/10 bg-black/40 p-1.5 text-zinc-400 transition-colors hover:bg-black/60 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            {/* Solid backing so the translucent Card stays readable over the blurred page */}
            <div className="min-h-0 overflow-y-auto overscroll-contain rounded-2xl bg-[#0c0512]">
              <ContactSupportWidget />
            </div>
          </div>
        </>
      )}

      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full border border-[#D946EF]/40 bg-[#D946EF] px-4 py-3 text-sm font-black uppercase tracking-wide text-white shadow-lg shadow-[#D946EF]/30 transition-all hover:scale-105 hover:bg-[#c026d3] sm:bottom-6 sm:right-6"
        >
          <HelpCircle className="h-4 w-4" />
          Need help?
        </button>
      )}
    </>
  )
}
