"use client";

import { Star } from "lucide-react";
import { useMovies } from "./MovieContext";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  movieId: number;
  initialRating?: number;
}

export function StarRating({ movieId, initialRating = 0 }: StarRatingProps) {
  const { rateMovie } = useMovies();
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex gap-1">
      {stars.map((star) => (
        <button
          key={star}
          onClick={() => rateMovie(movieId, star)}
          className="focus:outline-none focus:ring-2 focus:ring-primary rounded-sm"
        >
          <Star
            className={cn(
              "w-4 h-4 transition-colors",
              star <= (initialRating || 0)
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            )}
          />
        </button>
      ))}
    </div>
  );
}