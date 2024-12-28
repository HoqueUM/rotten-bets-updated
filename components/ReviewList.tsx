"use client";

import { useEffect, useState } from "react";

import { ExternalLink } from "lucide-react";

const ITEMS_PER_PAGE = 10;

export type emsReview = {
    link: string;
    quote: string;
    sentiment: string;
}
export default function ReviewsList({ reviews }: { reviews: emsReview[] }) {
  const [displayedReviews, setDisplayedReviews] = useState<emsReview[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMoreReviews();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
        if (!loading && displayedReviews.length < reviews.length) {
          loadMoreReviews();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [displayedReviews.length, loading, reviews.length]);

  const loadMoreReviews = () => {
    setLoading(true);
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = page * ITEMS_PER_PAGE;
    const newReviews = reviews.slice(start, end);
    
    setDisplayedReviews(prev => [...prev, ...newReviews]);
    setPage(prev => prev + 1);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl space-y-4">
      <h2 className="text-2xl font-bold mb-6">Critics Reviews</h2>
      <div className="space-y-4">
        {displayedReviews.map((review, index) => (
          <a
            key={index}
            href={review.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className={`p-6 rounded-lg shadow-md transition-transform hover:scale-[1.02] ${
              review.sentiment.toLowerCase() === "fresh" 
                ? "bg-green-50 hover:bg-green-100 border border-green-200" 
                : "bg-red-50 hover:bg-red-100 border border-red-200"
            }`}>
              <div className="flex justify-between items-start gap-4">
                <p className={`text-lg ${
                  review.sentiment.toLowerCase() === "fresh" 
                    ? "text-green-800" 
                    : "text-red-800"
                }`}>
                  {review.quote}
                </p>
                <ExternalLink className={`flex-shrink-0 w-5 h-5 ${
                  review.sentiment.toLowerCase() === "fresh" 
                    ? "text-green-600" 
                    : "text-red-600"
                }`} />
              </div>
            </div>
          </a>
        ))}
      </div>
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        </div>
      )}
    </div>
  );
}