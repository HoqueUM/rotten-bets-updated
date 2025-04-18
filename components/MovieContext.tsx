"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type MovieTimestamp = {
  score: number;
  time: string;
};

export type Movie = {
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

type MovieContextType = {
  movies: Movie[];
  secondaryMovies: Movie[];
  loading: boolean;
  secondaryLoading: boolean;
  error: string | null;
  secondaryError: string | null;
  refreshData: () => Promise<void>;
  refreshSecondaryData: () => Promise<void>;
};

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export function MovieProvider({ children }: { children: React.ReactNode }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [secondaryMovies, setSecondaryMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [secondaryLoading, setSecondaryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [secondaryError, setSecondaryError] = useState<string | null>(null);

  const fetchMovies = async () => {
    try {
      const response = await fetch('https://rotten-bets-backend.onrender.com/check_all_movies');
      if (!response.ok) throw new Error('Failed to fetch movies');
      const data = await response.json();
      setMovies(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  const fetchSecondaryMovies = async () => {
    try {
      setSecondaryLoading(true);
      const response = await fetch('https://rotten-bets-backend.onrender.com/all_movies');
      if (!response.ok) throw new Error('Failed to fetch secondary movies');
      
      const data = await response.json();
      
      // Filter out movies that don't match the expected Movie type structure
      const validMovies = data.filter((movie: any) => {
        // Check if all required properties exist and have correct types
        return (
          typeof movie.title === 'string' &&
          typeof movie.percent_score === 'number' &&
          typeof movie.actual_score === 'number' &&
          typeof movie.actual_count === 'number' &&
          typeof movie.disliked === 'number' &&
          typeof movie.liked === 'number' &&
          typeof movie.num_liked === 'number' &&
          typeof movie.num_disliked === 'number' &&
          Array.isArray(movie.timestamps) &&
          typeof movie.high === 'number' &&
          typeof movie.low === 'number'
        );
      });
      
      setSecondaryMovies(validMovies);
      setSecondaryError(null);
    } catch (err) {
      setSecondaryError(err instanceof Error ? err.message : 'Failed to fetch secondary movies');
    } finally {
      setSecondaryLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
    fetchSecondaryMovies();
    
    const primaryInterval = setInterval(fetchMovies, 300000); // Refresh every 5 minutes
    const secondaryInterval = setInterval(fetchSecondaryMovies, 300000); // Refresh every 5 minutes
    
    return () => {
      clearInterval(primaryInterval);
      clearInterval(secondaryInterval);
    };
  }, []);

  return (
    <MovieContext.Provider 
      value={{ 
        movies, 
        secondaryMovies,
        loading, 
        secondaryLoading,
        error, 
        secondaryError,
        refreshData: fetchMovies,
        refreshSecondaryData: fetchSecondaryMovies
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}

export function useMovies() {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error("useMovies must be used within a MovieProvider");
  }
  return context;
}