"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { GalleryForm } from "@/components/admin/GalleryForm"
import { GalleryList } from "@/components/admin/GalleryList"

export default function GalleryAdmin() {
  const [gallery, setGallery] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const fetchGallery = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('uploadDate', { ascending: false })
    
    if (error) {
      console.error('Error fetching gallery:', error)
    } else {
      setGallery(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchGallery()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-xl font-semibold text-mocha-pink mb-4">
          {selectedItem ? 'Edit Gallery Item' : 'Add New Gallery Item'}
        </h2>
        <GalleryForm 
          item={selectedItem} 
          onSubmit={() => {
            fetchGallery()
            setSelectedItem(null)
          }} 
        />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-mocha-blue mb-4">Gallery Items</h2>
        <GalleryList 
          items={gallery}
          loading={loading}
          onEdit={setSelectedItem}
          onDelete={async (id) => {
            await supabase.from('gallery').delete().eq('id', id)
            fetchGallery()
          }}
        />
      </div>
    </div>
  )
}
