import Link from "next/link"

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-mocha-mauve mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/members" 
          className="bg-mocha-surface1 p-6 rounded-lg hover:bg-mocha-surface2 transition-colors">
          <h2 className="text-xl font-semibold text-mocha-blue mb-2">Manage Members</h2>
          <p className="text-mocha-subtext1">Add, edit, or remove community members</p>
        </Link>
        
        <Link href="/admin/gallery" 
          className="bg-mocha-surface1 p-6 rounded-lg hover:bg-mocha-surface2 transition-colors">
          <h2 className="text-xl font-semibold text-mocha-green mb-2">Manage Gallery</h2>
          <p className="text-mocha-subtext1">Upload, edit, or delete gallery images</p>
        </Link>
      </div>
    </div>
  )
}
