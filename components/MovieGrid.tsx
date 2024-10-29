"use client";

import { useMovies } from "./MovieContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "./StarRating";

export default function MovieGrid() {
  const { movies, searchTerm } = useMovies();

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredMovies.map((movie) => (
        <Card key={movie.id} className="overflow-hidden group hover:shadow-xl transition-shadow">
          <div className="relative aspect-[2/3]">
            <img
              src={movie.image}
              alt={movie.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-xl font-semibold text-white mb-2">{movie.title}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {movie.year}
                </Badge>
                <Badge 
                  variant={movie.rating >= 90 ? "default" : "secondary"}
                  className={movie.rating >= 90 ? "bg-green-600" : "bg-yellow-600"}
                >
                  {movie.rating}%
                </Badge>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Your Rating</span>
              <StarRating movieId={movie.id} initialRating={movie.userRating} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}