import { create } from 'zustand'

type Member = {
  id: string
  name: string
  role: string
  bio: string
  avatar: string
  joinDate: string
  skills: string[]
  socialLinks: {
    [key: string]: string
  }
}

type GalleryItem = {
  id: string
  title: string
  description: string
  url: string
  uploadDate: string
  photographer: string
}

type State = {
  members: Member[]
  gallery: GalleryItem[]
  setMembers: (members: Member[]) => void
  setGallery: (gallery: GalleryItem[]) => void
  isAdmin: boolean
  setIsAdmin: (isAdmin: boolean) => void
}

export const useStore = create<State>((set) => ({
  members: [],
  gallery: [],
  isAdmin: false,
  setMembers: (members) => set({ members }),
  setGallery: (gallery) => set({ gallery }),
  setIsAdmin: (isAdmin) => set({ isAdmin })
}))
