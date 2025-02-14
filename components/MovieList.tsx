"use client";

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import db  from '@/lib/firebase';
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
      <div> 
        <div className="flex flex-col gap-4 justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary">
          </div>
          <p>One moment, we&apos;re loading the latest movies!</p>
        </div>
        <div className="h-screen" />
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