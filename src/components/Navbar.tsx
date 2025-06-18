"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-mocha-base to-mocha-mantle border-b border-mocha-surface0">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <motion.div
            initial={{ rotate: -10 }}
            whileHover={{ rotate: 0, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-mocha-mauve to-mocha-pink text-transparent bg-clip-text">
              Horn-Ya
            </span>
            <span className="text-2xl font-bold text-mocha-lavender ml-1">
              Studio
            </span>
          </motion.div>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <NavLink href="/gallery">Gallery</NavLink>
          <NavLink href="/members">Members</NavLink>
          <NavLink href="/forum">Forum</NavLink>
        </nav>
        
        <div className="flex items-center gap-3">
          {isSearchOpen ? (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "200px", opacity: 1 }}
              className="relative"
            >
              <input 
                type="text" 
                className="w-full bg-mocha-surface0 rounded-full px-4 py-1 text-mocha-text border border-mocha-surface1 focus:outline-none focus:border-mocha-mauve"
                placeholder="Search member..."
                autoFocus
                onBlur={() => setIsSearchOpen(false)}
              />
            </motion.div>
          ) : (
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="text-mocha-subtext0 hover:text-mocha-text p-2 rounded-full"
            >
              <SearchIcon />
            </button>
          )}
          
          <Link href="/login" className="bg-mocha-blue text-mocha-base px-4 py-1.5 rounded-full font-medium text-sm hover:bg-mocha-lavender transition-colors">
            Login
          </Link>
        </div>
      </div>
    </header>
  )
}

function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Link href={href} className="relative text-mocha-subtext1 hover:text-mocha-text font-medium group">
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-mocha-mauve transition-all group-hover:w-full"></span>
    </Link>
  )
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  )
}
