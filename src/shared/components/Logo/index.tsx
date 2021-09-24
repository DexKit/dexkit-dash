import React, { useState } from 'react'


const BAD_SRCS: { [tokenAddress: string]: true } = {}

/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
export default function Logo({ srcs, alt, ...rest }: any) {
  const [, refresh] = useState<number>(0)

  const src: string | undefined = (srcs as string[]).find(src => !BAD_SRCS[src])

  if (src) {
    return (
      <img
        {...rest}
        alt={alt}
        src={src}
        onError={() => {
          if (src) BAD_SRCS[src] = true
          refresh(i => i + 1)
        }}
      />
    )
  }

  return null
}
