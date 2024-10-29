'use client';

import { useMovies } from './MovieContext';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
//import { useSession } from 'next-auth/react';
//import { signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-2 rounded-md shadow-md">
        <p className="text-foreground">{`Score: ${payload[0].value.toFixed(1)}%`}</p>
        <p className="text-muted-foreground text-sm">{payload[0].payload.time}</p>
      </div>
    );
  }
  return null;
};

export function MovieDetails({ title }: { title: string }) {
  const { movies, loading, error } = useMovies();
  //const { data: session } = useSession();
  const [zoomDomain, setZoomDomain] = useState({ start: 0, end: 0 });
  const [yDomain, setYDomain] = useState<[number, number]>([0, 100]);

  const movie = movies.find((m) => m.title === title);
  const validTimestamps = movie?.timestamps.filter((t) => t.score > 0) || [];

  useEffect(() => {
    if (validTimestamps.length > 0) {
      setZoomDomain({ start: 0, end: validTimestamps.length - 1 });
    }
  }, [validTimestamps.length]);

  useEffect(() => {
    if (movie) {
      const zoomedData = validTimestamps.slice(zoomDomain.start, zoomDomain.end + 1);
      if (zoomedData.length > 0) {
        const scores = zoomedData.map(d => d.score);
        const minScore = Math.min(...scores) - 5;
        const maxScore = Math.max(...scores) + 5;
        setYDomain([minScore, maxScore]);
      }
    }
  }, [zoomDomain, movie, validTimestamps]);

  const handlePredefinedZoom = (points: number) => {
    const end = validTimestamps.length - 1;
    const start = Math.max(0, end - points + 1);
    setZoomDomain({ start, end });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-destructive">{error}</div>;
  }

  if (!movie) {
    return <div className="text-center">Movie not found</div>;
  }

  const latestScore = validTimestamps[validTimestamps.length - 1]?.score || 0;
  const scoreChange =
    validTimestamps.length > 1
      ? latestScore - validTimestamps[validTimestamps.length - 2].score
      : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">{movie.title}</h1>
        {/* {!session && (
          <Button onClick={() => signIn()}>Sign in to track this movie</Button>
        )} */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Score Overview</h2>
          <div className="flex gap-4 mb-6">
            <div>
              <div className="text-sm text-muted-foreground">Current Score</div>
              <div className="text-3xl font-bold">
                {movie.percent_score.toFixed(1)}%
              </div>
            </div>
            {scoreChange !== 0 && (
              <div>
                <div className="text-sm text-muted-foreground">Change</div>
                <div
                  className={`text-3xl font-bold ${
                    scoreChange > 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {scoreChange > 0 ? '+' : ''}
                  {scoreChange.toFixed(2)}%
                </div>
              </div>
            )}
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={validTimestamps.slice(zoomDomain.start, zoomDomain.end + 1)}>
                <XAxis dataKey="time" />
                <YAxis domain={yDomain} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePredefinedZoom(5)}
            >
              Last 5
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePredefinedZoom(10)}
            >
              Last 10
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePredefinedZoom(20)}
            >
              Last 20
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoomDomain({ start: 0, end: validTimestamps.length - 1 })}
            >
              All
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Statistics</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Review Count</span>
                <span>{movie.actual_count}</span>
              </div>
              <Progress value={(movie.actual_count / 200) * 100} />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Liked vs Disliked</span>
                <span>
                  {(
                    (movie.num_liked / (movie.num_liked + movie.num_disliked)) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <Progress
                value={
                  (movie.num_liked / (movie.num_liked + movie.num_disliked)) *
                  100
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">
                  Highest Score
                </div>
                <div className="text-2xl font-semibold">{movie.high}%</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Lowest Score
                </div>
                <div className="text-2xl font-semibold">{movie.low}%</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Likes</div>
                <div className="text-2xl font-semibold">{movie.num_liked}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Total Dislikes
                </div>
                <div className="text-2xl font-semibold">
                  {movie.num_disliked}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}