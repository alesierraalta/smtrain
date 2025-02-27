interface MuscleGroupIconProps {
    x: number
    y: number
    name: string
    selected: boolean
    isDarkMode: boolean
  }
  
  export const MuscleGroupIcon = ({ x, y, name, selected, isDarkMode }: MuscleGroupIconProps) => {
    const color = selected ? (isDarkMode ? "#FFFFFF" : "#000000") : isDarkMode ? "#B0B0B0" : "#4B5563"
    return (
      <g transform={`translate(${x}, ${y})`}>
        <rect width={100} height={50} fill={color} rx={5} stroke={isDarkMode ? "#3A3A3A" : "#D1D5DB"} strokeWidth={2} />
        <text x={50} y={30} textAnchor="middle" fill={isDarkMode ? "#FFFFFF" : "#111827"} dominantBaseline="middle">
          {name}
        </text>
      </g>
    )
  }
  
  