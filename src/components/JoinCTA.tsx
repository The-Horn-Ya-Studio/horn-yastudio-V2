"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export function JoinCTA() {
  return (
    <section className="bg-gradient-to-r from-mocha-surface0 to-mocha-surface1 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 
            className="text-3xl font-bold mb-4 text-mocha-text"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Join the Horn-Ya Studio Community
          </motion.h2>
          
          <motion.p
            className="text-lg text-mocha-subtext1 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Connect with fellow artists, share your work, and participate in exclusive events.
          </motion.p>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link 
              href="/join"
              className="inline-block bg-gradient-to-r from-mocha-pink to-mocha-red text-mocha-base px-8 py-3 rounded-full font-medium text-lg hover:opacity-90 transition-opacity"
            >
              JOIN THE COMMUNITY
            </Link>
            <div className="h-6 w-full relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8">
                <div className="w-0.5 h-6 bg-mocha-pink absolute left-1/2 -translate-x-1/2"></div>
                <div className="w-0.5 h-6 bg-mocha-pink absolute left-1/2 -translate-x-1/2 rotate-90 translate-y-3"></div>
                <div className="w-0.5 h-6 bg-mocha-pink absolute left-1/2 -translate-x-1/2 rotate-45 translate-y-1.5"></div>
                <div className="w-0.5 h-6 bg-mocha-pink absolute left-1/2 -translate-x-1/2 -rotate-45 translate-y-1.5"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
