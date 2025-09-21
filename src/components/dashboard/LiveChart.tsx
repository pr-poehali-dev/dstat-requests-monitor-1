import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataPoint {
  timestamp: string;
  value: number;
  label: string;
}

interface LiveChartProps {
  title: string;
  data: DataPoint[];
  height?: number;
  color?: string;
}

export default function LiveChart({ 
  title, 
  data, 
  height = 200, 
  color = '#3B82F6' 
}: LiveChartProps) {
  const [animatedData, setAnimatedData] = useState<DataPoint[]>([]);

  useEffect(() => {
    setAnimatedData([]);
    const timer = setTimeout(() => setAnimatedData(data), 100);
    return () => clearTimeout(timer);
  }, [data]);

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const generatePath = (points: DataPoint[]) => {
    if (points.length === 0) return '';
    
    const width = 100;
    const stepX = width / (points.length - 1 || 1);
    
    return points.map((point, index) => {
      const x = index * stepX;
      const y = 100 - ((point.value - minValue) / range) * 80; // Leave 20% padding
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const path = generatePath(animatedData);
  const areaPath = path ? `${path} L 100 100 L 0 100 Z` : '';

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">{title}</span>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full bg-dashboard-green animate-pulse`} />
            <span className="text-sm text-gray-500">Live</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative" style={{ height: `${height}px` }}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="overflow-visible"
          >
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={color} stopOpacity="0.05" />
              </linearGradient>
            </defs>
            
            {/* Grid lines */}
            {[...Array(5)].map((_, i) => (
              <line
                key={i}
                x1="0"
                y1={20 + i * 20}
                x2="100"
                y2={20 + i * 20}
                stroke="#e5e7eb"
                strokeWidth="0.5"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            
            {/* Area fill */}
            {areaPath && (
              <path
                d={areaPath}
                fill="url(#areaGradient)"
                className="transition-all duration-1000 ease-out"
              />
            )}
            
            {/* Line */}
            {path && (
              <path
                d={path}
                fill="none"
                stroke={color}
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
                className="transition-all duration-1000 ease-out"
              />
            )}
            
            {/* Data points */}
            {animatedData.map((point, index) => {
              const x = (index / (animatedData.length - 1 || 1)) * 100;
              const y = 100 - ((point.value - minValue) / range) * 80;
              
              return (
                <g key={index}>
                  <circle
                    cx={x}
                    cy={y}
                    r="1"
                    fill={color}
                    className="transition-all duration-1000 ease-out"
                    vectorEffect="non-scaling-stroke"
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r="3"
                    fill={color}
                    fillOpacity="0.3"
                    className="transition-all duration-1000 ease-out animate-pulse"
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              );
            })}
          </svg>
          
          {/* Y-axis labels */}
          <div className="absolute inset-y-0 -left-12 flex flex-col justify-between text-xs text-gray-500">
            <span>{Math.round(maxValue)}</span>
            <span>{Math.round((maxValue + minValue) / 2)}</span>
            <span>{Math.round(minValue)}</span>
          </div>
          
          {/* X-axis labels */}
          <div className="absolute -bottom-6 inset-x-0 flex justify-between text-xs text-gray-500">
            <span>{data[0]?.label || ''}</span>
            <span>{data[Math.floor(data.length / 2)]?.label || ''}</span>
            <span>{data[data.length - 1]?.label || ''}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}