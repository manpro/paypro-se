import React from 'react'

interface ChartCardProps {
  title: string
  children: React.ReactNode
  description?: string
  className?: string
}

const ChartCard: React.FC<ChartCardProps> = ({ 
  title, 
  children, 
  description, 
  className = '' 
}) => {
  return (
    <div className={`card ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </div>
      <div className="h-80">
        {children}
      </div>
    </div>
  )
}

export default ChartCard 