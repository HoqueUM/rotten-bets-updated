"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Movie } from "./MovieContext";
import { Badge } from "./ui/badge";
import Link from "next/link";
import TimeSeriesChart from "./TimeSeriesChart";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MovieCardProps {
  movie: Movie;
  minViews?: number;
}

export default function MovieCard({ 
  movie, 
  minViews = 1
}: MovieCardProps) {
  const validTimestamps = movie.timestamps.filter(t => t.score > 0);
  const maxViews = validTimestamps.length;
  
  // Default to maximum available views
  const [recentViewsCount, setRecentViewsCount] = useState(maxViews);
  
  const latestScore = validTimestamps[validTimestamps.length - 1]?.score || 0;
  const scoreChange = validTimestamps.length > 1 
    ? latestScore - validTimestamps[validTimestamps.length - 2].score
    : 0;

  // Get only the most recent timestamps based on user selection
  const displayedTimestamps = validTimestamps.length > recentViewsCount
    ? validTimestamps.slice(-recentViewsCount) 
    : validTimestamps;

  const handleSliderChange = (value: number[]) => {
    setRecentViewsCount(value[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      // Ensure value is within valid range
      const newValue = Math.min(Math.max(value, minViews), maxViews);
      setRecentViewsCount(newValue);
    }
  };

  // Update recentViewsCount if maxViews changes (e.g., when new data arrives)
  useEffect(() => {
    if (recentViewsCount > maxViews) {
      setRecentViewsCount(maxViews);
    }
  }, [maxViews]);

  return (
    <Card className="p-6">
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
          <div className="h-[200px] mt-4">
            <TimeSeriesChart 
              data={displayedTimestamps} 
              yDomain={[movie.low - 5, movie.high + 5]}
              showControls={true}
              size="default"
            />
          </div>
          
          {/* Slider and Input controls for recent views */}
          {validTimestamps.length > 1 && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="recentViews" className="text-sm text-muted-foreground">
                  Filter Reviews
                </Label>
                <span className="text-xs text-muted-foreground">
                  {maxViews} total
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-grow">
                  <Slider
                    id="recentViews"
                    value={[recentViewsCount]}
                    min={minViews}
                    max={maxViews}
                    step={1}
                    onValueChange={handleSliderChange}
                  />
                </div>
                <Input
                  type="number"
                  min={minViews}
                  max={maxViews}
                  value={recentViewsCount}
                  onChange={handleInputChange}
                  className="w-16 h-8 text-sm"
                />
              </div>
            </div>
          )}
          
          <div className="mt-4 space-y-4">
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
  );
}