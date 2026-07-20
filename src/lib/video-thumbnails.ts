/** Custom-designed thumbnails for training videos, keyed by Vimeo video id. */
export const VIDEO_THUMBNAILS: Record<string, string> = {
  '1177396372': '/thumbnails/thumb-01-getting-started.webp',
  '1177396987': '/thumbnails/thumb-02-offer-templates.webp',
  '1177396886': '/thumbnails/thumb-03-find-customers.webp',
  '1177396779': '/thumbnails/thumb-04-write-emails.webp',
  '1177396681': '/thumbnails/thumb-05-accelerator.webp',
  '1177396575': '/thumbnails/thumb-06-recurring-streams.webp',
  '1177396473': '/thumbnails/thumb-07-social-payouts.webp',
}

/** Extract numeric Vimeo id from a player or share URL. */
export function getVimeoId(videoUrl: string): string | null {
  try {
    const u = new URL(videoUrl)
    const parts = u.pathname.split('/').filter(Boolean)
    const id = parts[parts.length - 1]
    return id && /^\d+$/.test(id) ? id : null
  } catch {
    return null
  }
}

export function getVideoThumbnail(videoUrl: string): string | null {
  const id = getVimeoId(videoUrl)
  if (!id) return null
  return VIDEO_THUMBNAILS[id] ?? null
}
