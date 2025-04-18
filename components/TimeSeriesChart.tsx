"use client";

import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";

interface Timestamp {
  score: number;
  time: string;
}

interface TimeSeriesChartProps {
  data: Timestamp[];
  yDomain: [number, number];
  showControls?: boolean;
  size?: 'default' | 'large';
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-2 rounded-md shadow-md">
        <p className="text-foreground">{`Score: ${payload[0].value.toFixed(2)}%`}</p>
      </div>
    );
  }
  return null;
};

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ 
  data, 
  yDomain,
  showControls = true,
  size = 'default'
}) => {
  const [zoomDomain, setZoomDomain] = useState({ start: 0, end: data.length - 1 });
  const [currentYDomain, setCurrentYDomain] = useState<[number, number]>(yDomain);

  useEffect(() => {
    const zoomedData = data.slice(zoomDomain.start, zoomDomain.end + 1);
    const scores = zoomedData.map(d => d.score);
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    setCurrentYDomain([minScore, maxScore]);
  }, [zoomDomain, data]);

  const handlePredefinedZoom = (points: number) => {
    const end = data.length - 1;
    const start = Math.max(0, end - points + 1);
    setZoomDomain({ start, end });
  };

  const chartHeight = size === 'large' ? 'h-[400px] sm:h-[500px]' : 'h-[200px]';

  return (
    <div className={`w-full ${chartHeight} flex flex-col`}>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data.slice(zoomDomain.start, zoomDomain.end + 1)}
            margin={{ top: 5, right: 5, left: 25, bottom: 5 }}
          >
            <XAxis 
              dataKey="time" 
              tick={false}
              height={20}
            />
            <YAxis 
              domain={currentYDomain}
              width={35}
              tickFormatter={(value) => `${value}%`}
              tick={{ fontSize: 10 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2} 
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {showControls}
    </div>
  );
};

export default TimeSeriesChart;