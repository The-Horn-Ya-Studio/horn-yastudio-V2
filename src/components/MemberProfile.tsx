"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

type FavoriteAnime = {
  title: string
  image?: string
}

type FavoriteCharacter = {
  name: string
  anime: string
  image?: string
}

type CayrydingItem = {
  id: string
  name: string
  image: string
  username: string
}

type MemberProps = {
  member: {
    id: string
    name: string
    role: string
    bio: string
    avatar: string
    skills: string[]
    socialLinks: Record<string, string>
    favoriteAnimes?: FavoriteAnime[]
    favoriteCharacters?: FavoriteCharacter[]
    cayryding?: CayrydingItem[]
  }
}

export function MemberProfile({ member }: MemberProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  
  // Default values if not provided
  const favoriteAnimes = member.favoriteAnimes || [
    { title: "Sepia Atoms", image: "/placeholder-anime.jpg" },
    { title: "Sinadon", image: "/placeholder-anime.jpg" }
  ]
  
  const favoriteCharacters = member.favoriteCharacters || [
    { name: "Ehage Shoe", anime: "Sepia Atoms", image: member.avatar }
  ]
  
  const cayryding = member.cayryding || [
    {
      id: "1",
      name: "Thader Anes",
      image: "https://source.unsplash.com/300x400/?anime,girl,1",
      username: "Thagram"
    },
    {
      id: "2",
      name: "Foptor Gitsin",
      image: "https://source.unsplash.com/300x400/?anime,girl,2",
      username: "Thagram"
    },
    {
      id: "3", 
      name: "Aumora Zuka",
      image: "https://source.unsplash.com/300x400/?anime,girl,3",
      username: "Thagram" 
    }
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-mocha-lavender/30 to-mocha-blue/30 p-0.5 rounded-2xl">
          <div className="bg-gradient-to-b from-mocha-crust to-mocha-base rounded-2xl p-6 md:p-10">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center md:w-1/3">
                <div className="relative w-48 h-48">
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    fill
                    className="rounded-full object-cover border-4 border-mocha-surface0"
                  />
                </div>
                
                <h1 className="text-2xl font-bold mt-4 text-mocha-mauve">{member.name}</h1>
                <p className="text-mocha-subtext1 mb-6">{member.role}</p>
                
                <div className="bg-mocha-surface0 rounded-xl p-4 w-full">
                  <h2 className="flex items-center gap-2 text-mocha-text font-semibold mb-2">
                    <span className="inline-block bg-mocha-surface1 p-1 rounded">
                      <GridIcon />
                    </span>
                    Favorite genres
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill, i) => (
                      <span key={i} className="bg-mocha-surface1 text-mocha-lavender text-xs px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 bg-mocha-surface0 rounded-xl p-4 w-full">
                  <h2 className="flex items-center gap-2 text-mocha-text font-semibold mb-2">
                    <span className="inline-block bg-mocha-surface1 p-1 rounded">
                      <ShareIcon />
                    </span>
                    Share Apie
                  </h2>
                  <div className="space-y-2">
                    {Object.entries(member.socialLinks).map(([platform, url]) => (
                      <a 
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between text-mocha-subtext1 hover:text-mocha-text p-2 bg-mocha-surface1 rounded-lg"
                      >
                        <span className="capitalize">{platform}</span>
                        <span>•••</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="md:w-2/3">
                <div className="bg-mocha-surface0 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold text-mocha-text">
                      Persaled Introduction
                    </h2>
                  </div>
                  <p className="text-mocha-subtext0">
                    {member.bio}
                  </p>
                </div>
                
                <div className="relative">
                  <div className={`bg-mocha-surface0 rounded-xl overflow-hidden transition-all duration-300 ${isDetailOpen ? 'max-h-[800px]' : 'max-h-72'}`}>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-semibold text-mocha-text">
                          Detailed Bio
                        </h2>
                        <span className="inline-block bg-mocha-red text-mocha-base text-xs px-2 py-0.5 rounded-full">
                          New
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1">
                          <p className="text-mocha-subtext0">
                            Your new notself ame, commdudettotinr your more memmp.
                          </p>
                        </div>
                        <div className="h-16 w-16 rounded-full overflow-hidden">
                          <Image
                            src={member.avatar}
                            alt={member.name}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        </div>
                      </div>
                      
                      <h3 className="text-mocha-text font-semibold mt-6 mb-2">Favorite Anime</h3>
                      <div className="flex items-center gap-3">
                        {favoriteAnimes.map((anime, i) => (
                          <div key={i} className="bg-mocha-surface1 rounded-full px-3 py-1 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-mocha-surface2 flex items-center justify-center">
                              <HeartIcon />
                            </span>
                            {anime.title}
                          </div>
                        ))}
                      </div>
                      
                      <h3 className="text-mocha-text font-semibold mt-6 mb-2">Favorite Anime Characters</h3>
                      <div className="flex items-center gap-3">
                        {favoriteCharacters.map((character, i) => (
                          <div key={i} className="bg-mocha-surface1 rounded-full pl-1 pr-3 py-1 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full overflow-hidden">
                              <Image 
                                src={character.image || member.avatar}
                                alt={character.name}
                                width={24}
                                height={24}
                                className="object-cover"
                              />
                            </div>
                            {character.name}
                          </div>
                        ))}
                        <button className="bg-mocha-blue text-mocha-base rounded-full px-4 py-1">
                          Copperon
                        </button>
                      </div>
                      
                      <h3 className="text-mocha-text font-semibold mt-6 mb-3">You your Cayryding</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {cayryding.map((item) => (
                          <div key={item.id} className="relative rounded-xl overflow-hidden">
                            <div className="aspect-[3/4] relative">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                              <p className="text-white font-medium">{item.name}</p>
                              <p className="text-white/70 text-sm">{item.username}</p>
                            </div>
                            <div className="absolute top-2 right-2 bg-white/20 rounded-full w-6 h-6 flex items-center justify-center backdrop-blur-sm">
                              <span className="text-white text-xs">1</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setIsDetailOpen(!isDetailOpen)}
                    className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-mocha-surface1 rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    <ChevronIcon isOpen={isDetailOpen} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center gap-4 mt-8">
              <SocialButton icon={<TwitterIcon />} />
              <SocialButton icon={<TwitterIcon />} />
              <SocialButton icon={<InstagramIcon />} />
              <SocialButton icon={<DiscordIcon />} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SocialButton({ icon }: { icon: React.ReactNode }) {
  return (
    <motion.button
      className="bg-mocha-surface0 hover:bg-mocha-surface1 w-10 h-10 rounded-full flex items-center justify-center text-mocha-subtext1 hover:text-mocha-text transition-colors"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
    </motion.button>
  )
}

function GridIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
      <polyline points="16 6 12 2 8 6"></polyline>
      <line x1="12" y1="2" x2="12" y2="15"></line>
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  )
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  )
}

function TwitterIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  )
}

function DiscordIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
  )
}
