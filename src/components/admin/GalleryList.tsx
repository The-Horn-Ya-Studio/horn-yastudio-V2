type Props = {
  items: any[]
  loading: boolean
  onEdit: (item: any) => void
  onDelete: (id: string) => void
}

export function GalleryList({ items, loading, onEdit, onDelete }: Props) {
  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }
  
  if (items.length === 0) {
    return <div className="text-center py-8 text-mocha-subtext0">No gallery items found</div>
  }
  
  return (
    <div className="space-y-3">
      {items.map(item => (
        <div key={item.id} className="bg-mocha-surface0 rounded p-3 flex items-center">
          {item.url && (
            <img 
              src={item.url} 
              alt={item.title} 
              className="h-14 w-20 rounded mr-3 object-cover"
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-mocha-text font-medium truncate">{item.title}</h3>
            <p className="text-mocha-subtext0 text-sm truncate">{item.description}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(item)}
              className="px-3 py-1 bg-mocha-blue text-mocha-base rounded text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => {
                if (confirm("Are you sure you want to delete this gallery item?")) {
                  onDelete(item.id)
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
