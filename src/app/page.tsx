import { MemberCard } from "@/components/MemberCard"
import { GalleryItem } from "@/components/GalleryItem"
import { HeroSection } from "@/components/HeroSection" 
import { JoinCTA } from "@/components/JoinCTA" 
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export const revalidate = 60

async function getMembers() {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('joinDate', { ascending: false })
    .limit(4)
  
  if (error) console.error('Error fetching members:', error)
  return data || []
}

async function getGallery() {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('uploadDate', { ascending: false })
    .limit(4)
  
  if (error) console.error('Error fetching gallery:', error)
  return data || []
}

export default async function Home() {
  const [members, gallery] = await Promise.all([getMembers(), getGallery()])
  
  return (
    <main>
      <HeroSection />
      
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-mocha-lavender to-mocha-mauve text-transparent bg-clip-text">
            Featured Members
          </h2>
          <Link 
            href="/members"
            className="text-mocha-blue hover:text-mocha-lavender transition-colors"
          >
            View all <span aria-hidden="true">→</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member) => (
            <Link href={`/members/${member.id}`} key={member.id}>
              <MemberCard {...member} />
            </Link>
          ))}
        </div>
      </section>
      
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-mocha-peach to-mocha-red text-transparent bg-clip-text">
            Latest Gallery
          </h2>
          <Link 
            href="/gallery"
            className="text-mocha-peach hover:text-mocha-red transition-colors"
          >
            View all <span aria-hidden="true">→</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gallery.map((item) => (
            <GalleryItem key={item.id} {...item} />
          ))}
        </div>
      </section>
      
      <JoinCTA />
    </main>
  )
}
