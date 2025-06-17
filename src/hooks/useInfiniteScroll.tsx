// hooks/useInfiniteScroll.ts
import { useEffect, useState } from 'react';

interface UseInfiniteScrollOptions {
  fetchMore: () => void;
  hasMore: boolean;
  threshold?: number;
}

export const useInfiniteScroll = ({
  fetchMore,
  hasMore,
  threshold = 10
}: UseInfiniteScrollOptions) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (
        !hasMore ||
        isFetching ||
        window.innerHeight + document.documentElement.scrollTop < 
        document.documentElement.offsetHeight - threshold
      ) {
        return;
      }
      
      setIsFetching(true);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, isFetching, threshold]);

  useEffect(() => {
    if (!isFetching) return;

    const fetchData = async () => {
      try {
        await fetchMore();
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [isFetching, fetchMore]);

  return { isFetching };
};