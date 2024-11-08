import MovieList from "@/components/MovieList";
import { MovieProvider } from "@/components/MovieContext";

export default function Home() {
  return (
    <MovieProvider>
      <main className="min-h-screen bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <h1 className="text-4xl font-bold tracking-tight">Rot Kings</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The #1 place to track and analyze Rotten Tomatoes scores for Kalshi
            </p>
          </header>
          
          <MovieList />

          <div className="mt-8 text-center">
            <a
              href="https://ko-fi.com/rahulhoque"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#5A2E0E] text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-[#4A2E0F] focus:outline-none focus:ring-2 focus:ring-[#A52A2A] focus:ring-offset-2"
            >
              Buy me a Ko-Fi!
            </a>
          </div>
        </div>
      </main>
    </MovieProvider>
  );
}