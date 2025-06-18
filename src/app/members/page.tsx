import { MemberCard } from "@/components/MemberCard"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export const revalidate = 60

async function getMembers() {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('name')
  
  if (error) console.error('Error fetching members:', error)
  return data || []
}

export default async function MembersPage() {
  const members = await getMembers()
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-mocha-text">Our Members</h1>
        <p className="text-mocha-subtext1 mb-8">Meet the talented creators behind Horn-Ya Studio</p>
        
        <div className="bg-gradient-to-r from-mocha-mauve/20 to-mocha-pink/20 p-0.5 rounded-lg mb-12">
          <div className="bg-mocha-base rounded-lg p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {members.map((member) => (
                <Link href={`/members/${member.id}`} key={member.id}>
                  <MemberCard {...member} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
