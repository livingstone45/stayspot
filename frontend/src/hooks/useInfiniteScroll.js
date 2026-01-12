import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for infinite scroll functionality
 */
export const useInfiniteScroll = (fetchMore, hasMore = true) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isFetching) return;
    fetchMoreData();
  }, [isFetching]);

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isFetching) return;
    if (hasMore) {
      setIsFetching(true);
    }
  };

  const fetchMoreData = useCallback(async () => {
    try {
      await fetchMore();
    } finally {
      setIsFetching(false);
    }
  }, [fetchMore]);

  return [isFetching, setIsFetching];
};

/**
 * Hook for infinite scroll with intersection observer
 */
export const useInfiniteScrollObserver = (fetchMore, hasMore = true, threshold = 1.0) => {
  const [isFetching, setIsFetching] = useState(false);
  const [element, setElement] = useState(null);

  const observer = useCallback(
    (node) => {
      if (isFetching) return;
      if (element) element.disconnect();
      
      const newObserver = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setIsFetching(true);
          }
        },
        { threshold }
      );
      
      if (node) newObserver.observe(node);
      setElement(newObserver);
    },
    [isFetching, hasMore, threshold]
  );

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

  return [observer, isFetching];
};

export default useInfiniteScroll;