
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

  export async function generateStaticParams() {
    const url = `https://rotten-bets-backend.onrender.com/all_movies`;
    
    const movies: Movie[] = await fetch(url).then((res) => res.json());
    return movies.map((movie) => {
        return {
            title: encodeURIComponent(movie.title.replace(/ /g, '_')),
        }
    })
}


export default async function Page({ params }: { params: { title: string } }) {
    const url = `https://rotten-bets-backend.onrender.com/current`;
    const decodedTitle = decodeURIComponent(params.title).replace(/_/g, ' ');
    const payload = {
        "movie": decodedTitle,
    };
  
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  
    if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.statusText}`);
    }

    const movie = await res.json();
    return (
        <div className='flex justify-center items-center flex-col p-4 mt-12 overflow-auto' style={{ maxHeight: 'calc(100vh - 5rem)' }}>
                <p className='text-6xl font-bold'>{movie.title}</p>
                <div className='flex flex-row gap-16 p-4'>
                    <div className='flex justify-center items-center'>
                        <div className='text-4xl'>{movie.percent_score}%</div>
                    </div>
                    <div className='flex flex-col justify-center items-center space-y-2'>
                        <p className='text-2xl'>({movie.actual_score})</p>
                        <div className='text-lg'>On {movie.actual_count} Reviews</div>
                    </div>
                </div>
                <div className='flex flex-row gap-4'>
                    <p className='text-xl'>{movie.num_liked} Fresh {movie.num_disliked} Rotten</p>                
                </div>
                <div className='flex flex-col gap-4 justify-center items-center'>
                    <br />
                    <p className='font-bold'>Relevant Kalshi Strikes:</p>
                    <p>{movie.liked} fresh(es) to get above {movie.high}%</p>
                    <p>{movie.disliked} rot(s) to get to {movie.low}%</p>
                </div>
      </div>
    );
}