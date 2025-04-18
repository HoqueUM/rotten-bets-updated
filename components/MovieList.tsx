"use client";

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import db  from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCcw } from "lucide-react";
import { Button } from "./ui/button";
import MovieCard from "./MovieCard";

type MovieTimestamp = {
  score: number;
  time: string;
};

type Movie = {
  title: string;
  percent_score: number;
  actual_score: number;
  actual_count: number;
  disliked: number;
  liked: number;
  num_liked: number;
  num_disliked: number;
  timestamps: MovieTimestamp[];
  high: number;
  low: number;
};

async function getAllItemsInCurrent(): Promise<Movie[]> {
  const currentCollection = collection(db, 'current');
  const querySnapshot = await getDocs(currentCollection);
  
  const items: Movie[] = [];
  querySnapshot.forEach(doc => {
    items.push(doc.data() as Movie);
  });
  
  return items;
}

export default function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllItemsInCurrent();
      setMovies(data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshData = () => {
    fetchData();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-48 w-full" />
              <div className="mt-4 grid grid-cols-2 gap-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive">
        <p>{error}</p>
        <Button onClick={refreshData} variant="outline" className="mt-4">
          <RefreshCcw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  const activeMovies = movies.filter(movie => movie.actual_count > 0);
  const upcomingMovies = movies.filter(movie => movie.actual_count === 0);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Active Movies</h2>
        <Button onClick={refreshData} variant="outline" size="sm">
          <RefreshCcw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeMovies.map((movie) => (
          <MovieCard key={movie.title} movie={movie} />
        ))}
      </div>

      {upcomingMovies.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mt-12">Upcoming Movies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingMovies.map((movie) => (
              <MovieCard key={movie.title} movie={movie} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}