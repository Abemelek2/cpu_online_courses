"use client"

import React, { useState } from 'react'

type Props = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src?: string | null | Blob
  fallback?: string
}

export default function ClientImage({ src, fallback = '/default-course-thumbnail.svg', alt, ...rest }: Props) {
  const initial = typeof src === 'string' ? src : undefined
  const [imgSrc, setImgSrc] = useState<string | undefined>(initial)

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img
      src={(imgSrc as string) || fallback}
      alt={alt}
      onError={(e) => {
        const t = e.currentTarget as HTMLImageElement
        if (t.src.endsWith(fallback)) return
        t.onerror = null
        setImgSrc(fallback)
      }}
      {...rest}
    />
  )
}
