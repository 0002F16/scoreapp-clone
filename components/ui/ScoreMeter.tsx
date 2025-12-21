import React from "react";

interface ScoreMeterProps {
  score: number; // Score out of 100
  maxScore?: number; // Maximum possible score (default 100)
}

export const ScoreMeter: React.FC<ScoreMeterProps> = ({ 
  score, 
  maxScore = 100 
}) => {
  // Calculate percentage (assuming max score is around 100 based on quiz points)
  // The quiz has a max score, but we'll display as percentage of 100
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));
  
  // Convert percentage to angle (0-180 degrees for semi-circle)
  const angle = (percentage / 100) * 180;
  
  // SVG dimensions
  const size = 400;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = 150;
  
  // Calculate needle position
  const needleAngle = angle - 90; // Adjust for starting position
  const needleLength = radius - 20;
  const needleX = centerX + needleLength * Math.cos((needleAngle * Math.PI) / 180);
  const needleY = centerY + needleLength * Math.sin((needleAngle * Math.PI) / 180);
  
  // Create arc path for filled portion
  const startAngle = -90; // Start from left
  const endAngle = startAngle + angle;
  
  const createArcPath = (start: number, end: number, innerRadius: number, outerRadius: number) => {
    const startRad = (start * Math.PI) / 180;
    const endRad = (end * Math.PI) / 180;
    
    const x1 = centerX + innerRadius * Math.cos(startRad);
    const y1 = centerY + innerRadius * Math.sin(startRad);
    const x2 = centerX + outerRadius * Math.cos(startRad);
    const y2 = centerY + outerRadius * Math.sin(startRad);
    const x3 = centerX + outerRadius * Math.cos(endRad);
    const y3 = centerY + outerRadius * Math.sin(endRad);
    const x4 = centerX + innerRadius * Math.cos(endRad);
    const y4 = centerY + innerRadius * Math.sin(endRad);
    
    const largeArc = end - start > 180 ? 1 : 0;
    
    return `
      M ${x2} ${y2}
      A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x3} ${y3}
      L ${x4} ${y4}
      A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1} ${y1}
      Z
    `;
  };
  
  // Generate tick marks
  const ticks = [];
  const numTicks = 20;
  const tickInnerRadius = radius - 10;
  const tickOuterRadius = radius;
  
  for (let i = 0; i <= numTicks; i++) {
    const tickAngle = -90 + (i / numTicks) * 180;
    const tickRad = (tickAngle * Math.PI) / 180;
    const x1 = centerX + tickInnerRadius * Math.cos(tickRad);
    const y1 = centerY + tickInnerRadius * Math.sin(tickRad);
    const x2 = centerX + tickOuterRadius * Math.cos(tickRad);
    const y2 = centerY + tickOuterRadius * Math.sin(tickRad);
    
    const isFilled = i <= (percentage / 100) * numTicks;
    
    ticks.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={isFilled ? "#F97316" : "#E5E7EB"}
        strokeWidth={2}
      />
    );
  }
  
  return (
    <div className="flex flex-col items-center">
      {/* Percentage Display */}
      <div className="text-6xl sm:text-7xl font-bold text-red-600 mb-4">
        {Math.round(percentage)}%
      </div>
      
      {/* SVG Meter */}
      <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`} className="overflow-visible">
        {/* Background arc (gray) */}
        <path
          d={createArcPath(-90, 90, radius - 30, radius)}
          fill="#E5E7EB"
        />
        
        {/* Filled arc (orange gradient) */}
        {angle > 0 && (
          <path
            d={createArcPath(-90, endAngle, radius - 30, radius)}
            fill="#F97316"
          />
        )}
        
        {/* Tick marks */}
        <g>{ticks}</g>
        
        {/* Needle */}
        <g>
          <circle cx={centerX} cy={centerY} r={8} fill="#3B82F6" />
          <line
            x1={centerX}
            y1={centerY}
            x2={needleX}
            y2={needleY}
            stroke="#1E40AF"
            strokeWidth={4}
            strokeLinecap="round"
          />
        </g>
      </svg>
      
      {/* Label */}
      <div className="text-sm font-medium text-red-600 mt-2">
        Your Overall Score
      </div>
    </div>
  );
};

