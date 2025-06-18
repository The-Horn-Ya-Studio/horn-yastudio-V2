"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push("/login")
      }
    }
    
    checkAuth()
  }, [router])

  return (
    <div className="min-h-screen bg-mocha-base">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-mocha-lavender mb-8">Admin Panel</h1>
        <div className="bg-mocha-mantle rounded-lg p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
