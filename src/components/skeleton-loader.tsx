'use client'

export function SkeletonLoader({ 
  type = 'text', 
  count = 3, 
  className = '' 
}: { 
  type?: 'text' | 'avatar' | 'chart' | 'table' 
  count?: number 
  className?: string 
}) {
  switch (type) {
    case 'avatar':
      return (
        <div className={`flex items-center space-x-3 ${className}`}>
          <div className="h-8 w-8 rounded-full animate-pulse bg-card/50"></div>
          <div className="space-y-1">
            <div className="h-3 w-20 animate-pulse bg-card/50"></div>
            <div className="h-2 w-16 animate-pulse bg-card/50"></div>
          </div>
        </div>
      )
    case 'chart':
      return (
        <div className={className}>
          <div className="h-48 w-full rounded animate-pulse bg-card/50"></div>
        </div>
      )
    case 'table':
      return (
        <div className={className}>
          <div className="space-y-2">
            {[...Array(count)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 py-2">
                <div className="h-3 w-20 animate-pulse bg-card/50"></div>
                <div className="h-2 w-32 animate-pulse bg-card/50"></div>
                <div className="h-2 w-24 animate-pulse bg-card/50"></div>
                <div className="h-2 w-20 animate-pulse bg-card/50"></div>
                <div className="h-2 w-28 animate-pulse bg-card/50"></div>
              </div>
            ))}
          </div>
        </div>
      )
    default: // text
      return (
        <div className={className}>
          {[...Array(count)].map((_, i) => (
            <div key={i} className="h-3 w-32 mb-2 animate-pulse bg-card/50"></div>
          ))}
        </div>
      )
  }
}