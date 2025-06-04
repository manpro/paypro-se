import React from 'react'

interface MetricBoxProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  unit?: string
  description?: string
}

const MetricBox: React.FC<MetricBoxProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  unit,
  description
}) => {
  const changeColor = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  }[changeType]

  const changeIcon = {
    positive: '↗',
    negative: '↘',
    neutral: '→'
  }[changeType]

  return (
    <div className="metric-box">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-700">{title}</h4>
        {change && (
          <span className={`text-sm font-medium ${changeColor} flex items-center`}>
            <span className="mr-1">{changeIcon}</span>
            {change}
          </span>
        )}
      </div>
      
      <div className="flex items-baseline">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        {unit && <span className="ml-1 text-sm text-gray-500">{unit}</span>}
      </div>
      
      {description && (
        <p className="text-xs text-gray-600 mt-2">{description}</p>
      )}
    </div>
  )
}

export default MetricBox 