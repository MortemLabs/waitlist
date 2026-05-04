"use client"

import { useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

export function TiltCard({
  children,
  className,
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const sx = useSpring(x, { stiffness: 180, damping: 28 })
  const sy = useSpring(y, { stiffness: 180, damping: 28 })

  const rotateX = useTransform(sy, [-0.5, 0.5], [4, -4])
  const rotateY = useTransform(sx, [-0.5, 0.5], [-4, 4])

  if (prefersReduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={(e) => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        x.set((e.clientX - rect.left - rect.width / 2) / (rect.width / 2))
        y.set((e.clientY - rect.top - rect.height / 2) / (rect.height / 2))
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
      className={cn("relative", className)}
    >
      {children}
    </motion.div>
  )
}
