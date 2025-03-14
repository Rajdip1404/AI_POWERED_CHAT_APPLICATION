import { motion } from 'framer-motion'
import React from 'react'

const FloatingShape = ({color, size, top, left, delay}) => {
  return (
    <motion.div
        className={`absolute rounded-full ${color} ${size} opacity-20 blur-lg`}
        style={{top, left}}
        animate={{
            y: ["0%", "100%", "0%"],
            x: ["0%", "100%", "0%"],
            rotate: [0, 360]
        }}
        transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            delay
        }}
        aria-hidden="true"
    />
  )
}

export default FloatingShape