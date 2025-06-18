import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { supabase } from "@/lib/supabase"

type Props = {
  item?: any
  onSubmit: () => void
}

export function GalleryForm({ item, onSubmit }: Props) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    photographer: '',
    url: ''
  })
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        description: item.description || '',
        photographer: item.photographer || '',
        url: item.url || ''
      })
    } else {
      setFormData({
        title: '',
        description: '',
        photographer: '',
        url: ''
      })
    }
  }, [item])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = formData.url

      // Upload image if selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${uuidv4()}.${fileExt}`
        const filePath = `gallery/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, imageFile)

        if (uploadError) {
          throw uploadError
        }

        imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${filePath}`
      }

      const galleryData = {
        ...formData,
        url: imageUrl,
        uploadDate: item?.uploadDate || new Date().toISOString()
      }

      if (item?.id) {
        // Update
        const { error } = await supabase
          .from('gallery')
          .update(galleryData)
          .eq('id', item.id)

        if (error) throw error
      } else {
        // Insert
        const { error } = await supabase
          .from('gallery')
          .insert([{ ...galleryData, id: uuidv4() }])

        if (error) throw error
      }

      onSubmit()
    } catch (error) {
      console.error('Error saving gallery item:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-mocha-subtext0 mb-1">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full bg-mocha-surface0 border border-mocha-surface2 rounded px-3 py-2 text-mocha-text"
        />
      </div>

      <div>
        <label className="block text-mocha-subtext0 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full bg-mocha-surface0 border border-mocha-surface2 rounded px-3 py-2 text-mocha-text"
        />
      </div>

      <div>
        <label className="block text-mocha-subtext0 mb-1">Photographer</label>
        <input
          type="text"
          name="photographer"
          value={formData.photographer}
          onChange={handleChange}
          className="w-full bg-mocha-surface0 border border-mocha-surface2 rounded px-3 py-2 text-mocha-text"
        />
      </div>

      <div>
        <label className="block text-mocha-subtext0 mb-1">Image</label>
        {formData.url && (
          <div className="mb-2">
            <img 
              src={formData.url} 
              alt="Current image" 
              className="h-40 w-auto object-cover rounded"
            />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full bg-mocha-surface0 border border-mocha-surface2 rounded px-3 py-2 text-mocha-text"
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-mocha-mauve hover:bg-mocha-lavender text-mocha-base font-medium py-2 px-4 rounded"
      >
        {loading ? "Saving..." : item ? "Update Gallery Item" : "Add Gallery Item"}
      </button>
    </form>
  )
}
