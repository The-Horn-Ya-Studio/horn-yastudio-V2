"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { MemberForm } from "@/components/admin/MemberForm"
import { MemberList } from "@/components/admin/MemberList"

export default function MembersAdmin() {
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMember, setSelectedMember] = useState<any>(null)

  const fetchMembers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('name')
    
    if (error) {
      console.error('Error fetching members:', error)
    } else {
      setMembers(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-xl font-semibold text-mocha-pink mb-4">
          {selectedMember ? 'Edit Member' : 'Add New Member'}
        </h2>
        <MemberForm 
          member={selectedMember} 
          onSubmit={() => {
            fetchMembers()
            setSelectedMember(null)
          }} 
        />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-mocha-blue mb-4">Member List</h2>
        <MemberList 
          members={members}
          loading={loading}
          onEdit={setSelectedMember}
          onDelete={async (id) => {
            await supabase.from('members').delete().eq('id', id)
            fetchMembers()
          }}
        />
      </div>
    </div>
  )
}
