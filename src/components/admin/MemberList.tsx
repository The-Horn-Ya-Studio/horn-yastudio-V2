type Props = {
  members: any[]
  loading: boolean
  onEdit: (member: any) => void
  onDelete: (id: string) => void
}

export function MemberList({ members, loading, onEdit, onDelete }: Props) {
  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }
  
  if (members.length === 0) {
    return <div className="text-center py-8 text-mocha-subtext0">No members found</div>
  }
  
  return (
    <div className="space-y-3">
      {members.map(member => (
        <div key={member.id} className="bg-mocha-surface0 rounded p-3 flex items-center">
          {member.avatar && (
            <img 
              src={member.avatar} 
              alt={member.name} 
              className="h-10 w-10 rounded-full mr-3 object-cover"
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-mocha-text font-medium truncate">{member.name}</h3>
            <p className="text-mocha-subtext0 text-sm truncate">{member.role}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(member)}
              className="px-3 py-1 bg-mocha-blue text-mocha-base rounded text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => {
                if (confirm("Are you sure you want to delete this member?")) {
                  onDelete(member.id)
                }
              }}
              className="px-3 py-1 bg-mocha-red text-mocha-base rounded text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
