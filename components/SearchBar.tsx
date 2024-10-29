"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMovies } from "./MovieContext";

export function SearchBar() {
  const { setSearchTerm } = useMovies();

  return (
    <div className="relative max-w-xl mx-auto mb-8">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <Input
        type="search"
        placeholder="Search movies..."
        className="pl-10 bg-card"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}