import { notFound } from 'next/navigation';
import TimeSeriesChart from "@/components/TimeSeriesChart";
import ReviewsList from '@/components/ReviewList';

export type emsReview = {
    link: string;
    quote: string;
    sentiment: string;
}

export type Timestamp = {
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
    timestamps?: Timestamp[];
    high: number;
    low: number;
    emsReviews?: emsReview[];
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
        cache: 'no-store',
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
        notFound();
    }

    if (movie.actual_count === 0) {
        return (
            <div className='flex justify-center items-center flex-col p-4 pb-2'>
                <div className="flex justify-center items-center flex-col p-4 mt-12 max-w-6xl w-full">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-6xl font-bold text-center mb-6">{movie.title}</h1>
                        <p className="text-xl text-muted-foreground">No reviews, check back soon.</p>
                    </div>
                </div>
            </div>
        );
    }

    const validTimestamps = movie.timestamps?.filter(t => t.score > 0) || [];

    return (
        <div className='flex justify-center items-center flex-col p-4 pb-2'>
            <div className='flex justify-center items-center flex-col p-4 mt-12 max-w-6xl w-full' style={{ maxHeight: 'calc(100vh - 5rem)' }}>
                <h1 className='text-4xl sm:text-6xl font-bold text-center mb-6'>{movie.title}</h1>
                <div className='flex flex-col sm:flex-row gap-8 sm:gap-16 p-4 items-center'>
                    <div className='text-3xl sm:text-4xl font-semibold'>{movie.percent_score}%</div>
                    <div className='flex flex-col items-center space-y-2'>
                        <p className='text-xl sm:text-2xl'>({movie.actual_score}%)</p>
                        <div className='text-base sm:text-lg'>On {movie.actual_count} Reviews</div>
                    </div>
                </div>
                <div className='text-lg sm:text-xl mb-6'>
                    {movie.num_liked} Fresh {movie.num_disliked} Rotten
                </div>
                <div className='text-center mb-8'>
                    <p className='font-bold text-lg mb-4'>Relevant Kalshi Strikes:</p>
                    <p className='mb-2'>{movie.liked} fresh(es) to get above {movie.high}%</p>
                    <p>{movie.disliked} rot(s) to get to {movie.low}%</p>
                </div>
                {validTimestamps.length > 0 && (
                    <div className="w-full px-4">
                        <TimeSeriesChart 
                            data={validTimestamps} 
                            yDomain={[movie.low - 5, movie.high + 5]}
                            showControls={true}
                            size="default"
                        />
                    </div>
                )}
            </div>
            {movie.emsReviews && movie.emsReviews.length > 0 && (
                <div className='pt-2'>
                    <ReviewsList reviews={movie.emsReviews} />
                </div>
            )}
        </div>
    );
}