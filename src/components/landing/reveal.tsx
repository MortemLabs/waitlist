"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"

export function Reveal({
  children,
  delay = 0,
  y = 18,
}: Readonly<{
  children: ReactNode
  delay?: number
  y?: number
}>) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <>{children}</>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay, duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}
