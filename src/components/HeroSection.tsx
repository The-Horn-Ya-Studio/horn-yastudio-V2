"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export function HeroSection() {
  return (
    <div className="relative bg-gradient-to-b from-mocha-crust to-mocha-base overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-mocha-text">Welcome to </span>
            <span className="bg-gradient-to-r from-mocha-mauve to-mocha-pink text-transparent bg-clip-text">
              Horn-Ya Studio
            </span>
          </motion.h1>
          
          <motion.p
            className="text-xl text-mocha-subtext1 mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            A creative community for anime and game enthusiasts, artists, and content creators.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link 
              href="/members"
              className="bg-gradient-to-r from-mocha-mauve to-mocha-pink text-mocha-base px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Meet Our Members
            </Link>
            <Link
              href="/join"
              className="bg-transparent border border-mocha-lavender text-mocha-lavender px-6 py-3 rounded-full font-medium hover:bg-mocha-surface0 transition-colors"
            >
              Join Our Community
            </Link>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-mocha-mauve/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-24 -right-16 w-72 h-72 bg-mocha-blue/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  )
}
