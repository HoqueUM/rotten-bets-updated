import MovieList from "@/components/MovieList";
import SecondaryMovieList from "@/components/SecondaryMovieList";
import { MovieProvider } from "@/components/MovieContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
          
          {/* <Tabs defaultValue="primary" className="mb-8">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="primary">Active Markets</TabsTrigger>
              <TabsTrigger value="secondary">Archive</TabsTrigger>
            </TabsList>
            <TabsContent value="primary"> */}
              <MovieList />
            {/* </TabsContent>
            <TabsContent value="secondary">
              <SecondaryMovieList />
            </TabsContent>
          </Tabs> */}
          
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
        <div className="flex h-14 items-center justify-center">
          <div className="pl-4 flex items-center justify-center">
            <p>Made with ❤️ by <a href="https://www.linkedin.com/in/rahul-hoque/" target="_blank" rel="noopener noreferrer" className="text-decoration-line: underline"> Rahul Hoque</a></p>
          </div>
        </div>
      </main>
    </MovieProvider>
  );
}