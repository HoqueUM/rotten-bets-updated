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
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
};

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export function MovieProvider({ children }: { children: React.ReactNode }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchMovies();
    const interval = setInterval(fetchMovies, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <MovieContext.Provider value={{ movies, loading, error, refreshData: fetchMovies }}>
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