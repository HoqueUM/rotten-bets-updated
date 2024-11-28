import { notFound } from 'next/navigation';

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

async function fetchMovie(title: string): Promise<Movie> {
    const url = `https://rotten-bets-backend.onrender.com/current`;
    const decodedTitle = decodeURIComponent(title);
    const payload = {
        "movie": decodedTitle,
    };

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        cache: 'no-store', // This ensures fresh data on every request
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.statusText}`);
    }

    return res.json();
}

export default async function Page({ params }: { params: { title: string } }) {
    let movie: Movie;
    try {
        movie = await fetchMovie(params.title);
    } catch (error) {
        console.error(error);
        notFound(); // This will show the 404 page if the movie is not found
    }

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