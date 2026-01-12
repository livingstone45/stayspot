import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to handle async operations with loading, error, and data states
 */
export const useAsync = (asyncFunction, dependencies = []) => {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null
  });

  const execute = useCallback(async (...args) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await asyncFunction(...args);
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      setState({ data: null, loading: false, error });
      throw error;
    }
  }, dependencies);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset
  };
};

/**
 * Hook to handle async operations that run immediately
 */
export const useAsyncEffect = (asyncFunction, dependencies = []) => {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    let cancelled = false;

    const runAsync = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const data = await asyncFunction();
        if (!cancelled) {
          setState({ data, loading: false, error: null });
        }
      } catch (error) {
        if (!cancelled) {
          setState({ data: null, loading: false, error });
        }
      }
    };

    runAsync();

    return () => {
      cancelled = true;
    };
  }, dependencies);

  const retry = useCallback(() => {
    setState(prev => ({ ...prev, loading: true, error: null }));
  }, []);

  return {
    ...state,
    retry
  };
};

/**
 * Hook for handling multiple async operations
 */
export const useAsyncQueue = () => {
  const [queue, setQueue] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addToQueue = useCallback((asyncFunction, id = Date.now()) => {
    setQueue(prev => [...prev, { id, asyncFunction, status: 'pending' }]);
  }, []);

  const processQueue = useCallback(async () => {
    if (isProcessing || queue.length === 0) return;

    setIsProcessing(true);
    const updatedQueue = [...queue];

    for (let i = 0; i < updatedQueue.length; i++) {
      const item = updatedQueue[i];
      if (item.status === 'pending') {
        try {
          updatedQueue[i] = { ...item, status: 'processing' };
          setQueue([...updatedQueue]);
          
          await item.asyncFunction();
          updatedQueue[i] = { ...item, status: 'completed' };
        } catch (error) {
          updatedQueue[i] = { ...item, status: 'failed', error };
        }
      }
    }

    setQueue(updatedQueue);
    setIsProcessing(false);
  }, [queue, isProcessing]);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  const removeFromQueue = useCallback((id) => {
    setQueue(prev => prev.filter(item => item.id !== id));
  }, []);

  useEffect(() => {
    processQueue();
  }, [queue.length]);

  return {
    queue,
    isProcessing,
    addToQueue,
    clearQueue,
    removeFromQueue
  };
};

export default useAsync;