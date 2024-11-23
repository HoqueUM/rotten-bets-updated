"use client";

import { Card } from "@/components/ui/card";
import { Movie } from "./MovieContext";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "./ui/badge";
//import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";

interface MovieCardProps {
  movie: Movie;
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

export default function MovieCard({ movie }: MovieCardProps) {
  const validTimestamps = movie.timestamps.filter(t => t.score > 0);
  const latestScore = validTimestamps[validTimestamps.length - 1]?.score || 0;
  const scoreChange = validTimestamps.length > 1 
    ? latestScore - validTimestamps[validTimestamps.length - 2].score
    : 0;

  const [zoomDomain, setZoomDomain] = useState({ start: 0, end: validTimestamps.length - 1 });
  const [yDomain, setYDomain] = useState<[number, number]>([movie.low - 5, movie.high + 5]);

  useEffect(() => {
    const zoomedData = validTimestamps.slice(zoomDomain.start, zoomDomain.end + 1);
    if (zoomedData.length > 0) {
      const scores = zoomedData.map(d => d.score);
      const minScore = Math.min(...scores) - 5;
      const maxScore = Math.max(...scores) + 5;
      setYDomain([minScore, maxScore]);
    }
  }, [zoomDomain, validTimestamps]);

  const handlePredefinedZoom = (points: number) => {
    const end = validTimestamps.length - 1;
    const start = Math.max(0, end - points + 1);
    setZoomDomain({ start, end });
  };

  return (
     <Link href={`/movie/${encodeURIComponent(movie.title.replace(/ /g, '_'))}`} target="_blank">
      <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold">{movie.title}</h3>
            <div className="flex gap-2 mt-2">
            {movie.actual_count > 0 && (
              <Badge
                variant={
                  scoreChange === 0
                    ? "default"
                    : scoreChange > 0
                    ? "constructive"
                    : "destructive"
                }
                className="text-xs sm:text-lg px-2 sm:px-4 py-1"
              >
                {movie.percent_score}% ({movie.actual_score}%, {scoreChange > 0 ? "+" : ""}{scoreChange.toFixed(2)}%)
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs sm:text-lg px-2 sm:px-4 py-1">
              {movie.actual_count} reviews
            </Badge>
            </div>
            </div>
        </div>

        {movie.actual_count > 0 && (
          <>
            <div className="z-0 h-[200px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={validTimestamps.slice(zoomDomain.start, zoomDomain.end + 1)}>
                  <XAxis dataKey="time" tick={false} />
                  <YAxis domain={yDomain} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  handlePredefinedZoom(5);
                }}
              >
                Last 5
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  handlePredefinedZoom(10);
                }}
              >
                Last 10
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  setZoomDomain({ start: 0, end: validTimestamps.length - 1 });
                }}
              >
                All
              </Button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                {/* <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground"></span>
                  <span>{((movie.num_liked / (movie.num_liked + movie.num_disliked)) * 100).toFixed(2)}%</span>
                </div> */}
                {/* <Progress value={(movie.num_liked / (movie.num_liked + movie.num_disliked)) * 100} /> */}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <span className="text-muted-foreground text-base">{movie.disliked} rot(s) to get to</span>
                <p className="font-medium text-lg">{movie.low}%</p>
              </div>
              <div>
                <span className="text-muted-foreground text-base">{movie.liked} fresh(es) to get above</span>
                <p className="font-medium text-lg">{movie.high}%</p>
              </div>
            </div>
            </div>
          </>
        )}
      </Card>
     </Link>
  );
}