"use client"

import { useState } from "react"
import { GalleryItem } from "./GalleryItem"
import { motion } from "framer-motion"

type Props = {
  items: any[]
}

type Filter = "all" | "digital" | "traditional" | "3d" | "photography"

export function GalleryLayout({ items }: Props) {
  const [filter, setFilter] = useState<Filter>("all")
  
  // In real scenario we would filter by categories from the database
  // Here we're just simulating it
  const filteredItems = filter === "all" 
    ? items
    : items.filter((_, i) => i % (filter === "digital" ? 2 : 3) === 0)
  
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>All</FilterButton>
        <FilterButton active={filter === "digital"} onClick={() => setFilter("digital")}>Digital</FilterButton>
        <FilterButton active={filter === "traditional"} onClick={() => setFilter("traditional")}>Traditional</FilterButton>
        <FilterButton active={filter === "3d"} onClick={() => setFilter("3d")}>3D Art</FilterButton>
        <FilterButton active={filter === "photography"} onClick={() => setFilter("photography")}>Photography</FilterButton>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <GalleryItem {...item} />
          </motion.div>
        ))}
      </div>
      
      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-mocha-subtext0">
          No gallery items found for this category.
        </div>
      )}
    </div>
  )
}

type FilterButtonProps = {
  children: React.ReactNode
  active: boolean
  onClick: () => void
}

function FilterButton({ children, active, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full transition-colors ${
        active 
          ? "bg-mocha-mauve text-mocha-base" 
          : "bg-mocha-surface0 text-mocha-subtext1 hover:bg-mocha-surface1 hover:text-mocha-text"
      }`}
    >
      {children}
    </button>
  )
}
