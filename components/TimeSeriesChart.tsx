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

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data, yDomain }) => {
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

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="w-full h-64 sm:h-96 lg:w-[500px] lg:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.slice(zoomDomain.start, zoomDomain.end + 1)}>
            <XAxis dataKey="time" tick={false} />
            <YAxis domain={currentYDomain} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-2 mt-4">
        <Button variant="outline" size="sm" onClick={() => handlePredefinedZoom(5)}>
          Last 5
        </Button>
        <Button variant="outline" size="sm" onClick={() => handlePredefinedZoom(10)}>
          Last 10
        </Button>
        <Button variant="outline" size="sm" onClick={() => handlePredefinedZoom(20)}>
          Last 20
        </Button>
        <Button variant="outline" size="sm" onClick={() => setZoomDomain({ start: 0, end: data.length - 1 })}>
          All
        </Button>
      </div>
    </div>
  );
};

export default TimeSeriesChart;