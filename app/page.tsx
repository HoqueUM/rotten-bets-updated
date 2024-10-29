import MovieList from "@/components/MovieList";
import { MovieProvider } from "@/components/MovieContext";

export default function Home() {
  return (
    <MovieProvider>
      <main className="min-h-screen bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <h1 className="text-4xl font-bold tracking-tight">Rotten Tomatoes Tracker</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Track and analyze Rotten Tomatoes scores for upcoming and current movies
            </p>
          </header>
          
          <MovieList />
        </div>
      </main>
    </MovieProvider>
  );
}