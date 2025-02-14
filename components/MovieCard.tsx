"use client";

import { Card } from "@/components/ui/card";
import { Movie } from "./MovieContext";
import { Badge } from "./ui/badge";
import Link from "next/link";
import TimeSeriesChart from "./TimeSeriesChart";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const validTimestamps = movie.timestamps.filter(t => t.score > 0);
  const latestScore = validTimestamps[validTimestamps.length - 1]?.score || 0;
  const scoreChange = validTimestamps.length > 1 
    ? latestScore - validTimestamps[validTimestamps.length - 2].score
    : 0;

  return (
    <Card className="p-6">
      {/* <Link 
        href={`/movie/${encodeURIComponent(movie.title)}`} 
        target="_blank"
        className="block hover:opacity-80 transition-opacity"
      > */}
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
      {/* </Link> */}

      {movie.actual_count > 0 && (
        <>
          <div className="h-[200px] mt-4">
            <TimeSeriesChart 
              data={validTimestamps} 
              yDomain={[movie.low - 5, movie.high + 5]}
              showControls={true}
              size="default"
            />
          </div>
          <Link 
            href={`/movie/${encodeURIComponent(movie.title)}`} 
            target="_blank"
            className="block hover:opacity-80 transition-opacity"
          >
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
          </Link>
        </>
      )}
    </Card>
  );
}