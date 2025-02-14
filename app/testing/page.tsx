"use client"
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type MovieTimestamp = {
  score: number;
  time: string;
};

type Movie = {
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

async function getAllItemsInCurrent(): Promise<Movie[]> {
  const currentCollection = collection(db, 'current');
  const querySnapshot = await getDocs(currentCollection);
  
  const items: Movie[] = [];
  querySnapshot.forEach(doc => {
    items.push(doc.data() as Movie);
  });
  
  return items;
}

export default function ItemsList() {
  const [items, setItems] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllItemsInCurrent();
        setItems(data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-4 p-4">
      {items.map(item => (
        <div key={item.title} className="border p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold">{item.title}</h2>
          <div className="mt-2 space-y-1">
            <p>Score: {item.percent_score}%</p>
            <p>Likes: {item.num_liked}</p>
            <p>Dislikes: {item.num_disliked}</p>
          </div>
        </div>
      ))}
    </div>
  );
}