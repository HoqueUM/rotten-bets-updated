import admin from '@/lib/firebase';
import { NextApiRequest, NextApiResponse } from 'next';

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
  
type MovieContextType = {
    movies: Movie[];
    loading: boolean;
    error: string | null;
    refreshData: () => Promise<void>;
  };
  export default async function getAllItemsInCurrent() {
    const db = admin.firestore();
    const currentCollection = await db.collection('current').get();
  
    const items: Movie[] = [];
    currentCollection.forEach(doc => {
      items.push(doc.data() as Movie);
    });
  
    return items;
  }
  
  async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
      const items = await getAllItemsInCurrent();
      res.status(200).json(items);
    } catch (error) {
      console.error('Error fetching items:', error);
      res.status(500).json({ error: 'Failed to fetch items' });
    }
  }