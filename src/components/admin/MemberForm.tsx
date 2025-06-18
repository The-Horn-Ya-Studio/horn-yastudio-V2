import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { supabase } from "@/lib/supabase"

type Props = {
  member?: any
  onSubmit: () => void
}

export function MemberForm({ member, onSubmit }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    avatar: '',
    skills: [] as string[],
    socialLinks: {} as Record<string, string>
  })
  const [loading, setLoading] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  const [socialPlatform, setSocialPlatform] = useState('')
  const [socialUrl, setSocialUrl] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        role: member.role || '',
        bio: member.bio || '',
        avatar: member.avatar || '',
        skills: member.skills || [],
        socialLinks: member.socialLinks || {}
      })
    } else {
      setFormData({
        name: '',
        role: '',
        bio: '',
        avatar: '',
        skills: [],
        socialLinks: {}
      })
    }
  }, [member])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  const handleAddSocial = () => {
    if (socialPlatform.trim() && socialUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialPlatform]: socialUrl
        }
      }))
      setSocialPlatform('')
      setSocialUrl('')
    }
  }

  const handleRemoveSocial = (platform: string) => {
    const newSocialLinks = { ...formData.socialLinks }
    delete newSocialLinks[platform]
    setFormData(prev => ({
      ...prev,
      socialLinks: newSocialLinks
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let avatarUrl = formData.avatar

      // Upload avatar if selected
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop()
        const fileName = `${uuidv4()}.${fileExt}`
        const filePath = `avatars/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, avatarFile)

        if (uploadError) {
          throw uploadError
        }

        avatarUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${filePath}`
      }

      const memberData = {
        ...formData,
        avatar: avatarUrl,
        joinDate: member?.joinDate || new Date().toISOString()
      }

      if (member?.id) {
        // Update
        const { error } = await supabase
          .from('members')
          .update(memberData)
          .eq('id', member.id)

        if (error) throw error
      } else {
        // Insert
        const { error } = await supabase
          .from('members')
          .insert([{ ...memberData, id: uuidv4() }])

        if (error) throw error
      }

      onSubmit()
    } catch (error) {
      console.error('Error saving member:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-mocha-subtext0 mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full bg-mocha-surface0 border border-mocha-surface2 rounded px-3 py-2 text-mocha-text"
        />
      </div>

      <div>
        <label className="block text-mocha-subtext0 mb-1">Role</label>
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full bg-mocha-surface0 border border-mocha-surface2 rounded px-3 py-2 text-mocha-text"
        />
      </div>

      <div>
        <label className="block text-mocha-subtext0 mb-1">Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={3}
          className="w-full bg-mocha-surface0 border border-mocha-surface2 rounded px-3 py-2 text-mocha-text"
        />
      </div>

      <div>
        <label className="block text-mocha-subtext0 mb-1">Avatar</label>
        {formData.avatar && (
          <div className="mb-2">
            <img 
              src={formData.avatar} 
              alt="Current avatar" 
              className="h-20 w-20 object-cover rounded-full"
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

      <div>
        <label className="block text-mocha-subtext0 mb-1">Skills</label>
        <div className="flex">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="flex-1 bg-mocha-surface0 border border-mocha-surface2 rounded-l px-3 py-2 text-mocha-text"
            placeholder="Add a skill"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="bg-mocha-blue text-mocha-base px-3 py-2 rounded-r"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {formData.skills.map((skill, index) => (
            <span 
              key={index} 
              className="bg-mocha-surface1 text-mocha-lavender px-2 py-1 rounded flex items-center"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(index)}
                className="ml-1 text-mocha-red"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-mocha-subtext0 mb-1">Social Links</label>
        <div className="grid grid-cols-3 gap-2">
          <input
            type="text"
            value={socialPlatform}
            onChange={(e) => setSocialPlatform(e.target.value)}
            className="bg-mocha-surface0 border border-mocha-surface2 rounded px-3 py-2 text-mocha-text"
            placeholder="Platform"
          />
          <input
            type="text"
            value={socialUrl}
            onChange={(e) => setSocialUrl(e.target.value)}
            className="bg-mocha-surface0 border border-mocha-surface2 rounded px-3 py-2 text-mocha-text"
            placeholder="URL"
          />
          <button
            type="button"
            onClick={handleAddSocial}
            className="bg-mocha-blue text-mocha-base px-3 py-2 rounded"
          >
            Add
          </button>
        </div>
        <div className="mt-2 space-y-1">
          {Object.entries(formData.socialLinks).map(([platform, url]) => (
            <div key={platform} className="flex items-center bg-mocha-surface1 rounded p-2">
              <span className="text-mocha-lavender flex-1">{platform}: </span>
              <span className="text-mocha-subtext1 truncate flex-1">{url}</span>
              <button
                type="button"
                onClick={() => handleRemoveSocial(platform)}
                className="ml-2 text-mocha-red"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-mocha-mauve hover:bg-mocha-lavender text-mocha-base font-medium py-2 px-4 rounded"
      >
        {loading ? "Saving..." : member ? "Update Member" : "Add Member"}
      </button>
    </form>
  )
}
