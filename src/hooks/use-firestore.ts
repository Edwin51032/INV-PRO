'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  collection,
  query,
  onSnapshot,
  doc,
  orderBy,
  limit,
  Query,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useUserId } from './use-user-id';

interface UseCollectionOptions {
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  dataLimit?: number;
}

// In-memory cache
const collectionCache = new Map<string, any[]>();
const docCache = new Map<string, any>();

export function useCollection<T>(collectionName: string, options: UseCollectionOptions = {}) {
  const userId = useUserId();
  const cacheKey = useMemo(() => {
    if (!userId) return null;
    return `users/${userId}/${collectionName}`;
  }, [userId, collectionName]);

  const [data, setData] = useState<T[]>(cacheKey ? collectionCache.get(cacheKey) || [] : []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const memoizedQuery = useMemo(() => {
    if (!cacheKey) return null;

    let q: Query<DocumentData> = query(collection(db, cacheKey));
    
    if (options.sortField) {
      q = query(q, orderBy(options.sortField, options.sortDirection || 'desc'));
    }
    if (options.dataLimit) {
      q = query(q, limit(options.dataLimit));
    }
    
    return q;
  }, [cacheKey, options.sortField, options.sortDirection, options.dataLimit]);

  useEffect(() => {
    if (!memoizedQuery || !cacheKey) {
      setData([]);
      setLoading(!cacheKey);
      return;
    }

    // Set initial loading state only if there's no cached data
    if (!collectionCache.has(cacheKey)) {
        setLoading(true);
    } else {
        setLoading(false);
    }

    const unsubscribe = onSnapshot(
      memoizedQuery,
      (querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(items);
        collectionCache.set(cacheKey, items); // Update cache
        setLoading(false);
      },
      (err) => {
        console.error(`Error fetching collection ${collectionName}:`, err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [memoizedQuery, collectionName, cacheKey]);

  return { data, loading, error };
}

export function useDoc<T>(collectionName: string, docId: string) {
  const userId = useUserId();
  const cacheKey = useMemo(() => {
    if (!userId || !docId) return null;
    return `users/${userId}/${collectionName}/${docId}`;
  }, [userId, collectionName, docId]);

  const [data, setData] = useState<T | null>(cacheKey ? docCache.get(cacheKey) || null : null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId || !docId || !cacheKey) {
        setData(null);
        setLoading(!userId || !docId);
        return;
    };
    
    // Set initial loading state only if there's no cached data
    if (!docCache.has(cacheKey)) {
        setLoading(true);
    } else {
        setLoading(false);
    }

    const path = `users/${userId}/${collectionName}`;
    const docRef = doc(db, path, docId);
    
    const unsubscribe = onSnapshot(docRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          const docData = { id: docSnap.id, ...docSnap.data() } as T;
          setData(docData);
          docCache.set(cacheKey, docData); // Update cache
        } else {
          setData(null);
          docCache.delete(cacheKey); // Remove from cache
        }
        setLoading(false);
      }, 
      (err) => {
        console.error(`Error fetching doc ${collectionName}/${docId}:`, err);
        setError(err);
        setLoading(false);
      });

    return () => unsubscribe();
  }, [collectionName, docId, userId, cacheKey]);

  return { data, loading, error };
}
