import { supabase } from "@/lib/supabase"
import { MemberProfile } from "@/components/MemberProfile"
import { notFound } from "next/navigation"

export const revalidate = 60

async function getMember(id: string) {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching member:', error)
    return null
  }
  
  return data
}

export default async function MemberPage({ params }: { params: { id: string } }) {
  const member = await getMember(params.id)
  
  if (!member) {
    notFound()
  }
  
  return <MemberProfile member={member} />
}
