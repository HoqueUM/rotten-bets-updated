import { MovieDetails } from "@/components/MovieDetails";
import { MovieProvider } from "@/components/MovieContext";

export default function MoviePage({ params }: { params: { title: string } }) {
  const decodedTitle = decodeURIComponent(params.title);
  
  return (
    <MovieProvider>
      <main className="min-h-screen bg-gradient-to-b from-background to-muted py-8">
        <div className="container">
          <MovieDetails title={decodedTitle} />
        </div>
      </main>
    </MovieProvider>
  );
}