import { GalleryItem } from "@/components/GalleryItem"
import { supabase } from "@/lib/supabase"
import { GalleryLayout } from "@/components/GalleryLayout"

export const revalidate = 60

async function getGallery() {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('uploadDate', { ascending: false })
  
  if (error) console.error('Error fetching gallery:', error)
  return data || []
}

export default async function GalleryPage() {
  const gallery = await getGallery()
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-mocha-text">Gallery</h1>
        <p className="text-mocha-subtext1 mb-8">Artwork from our talented community members</p>
        
        <GalleryLayout items={gallery} />
      </div>
    </div>
  )
}
