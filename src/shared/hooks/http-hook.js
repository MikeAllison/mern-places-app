import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // Used to cancel HTTP request if the user navs to a different page
  const activeHttpRequests = useRef([]);

  // Wrapped in useCallback to prevent infinite loops when component is re-rendered
  const sendRequest = useCallback(
    async (url, method = 'GET', headers = {}, body = null) => {
      setIsLoading(true);

      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          headers,
          body,
          signal: httpAbortCtrl.signal
        });

        const responseData = await response.json();

        // If the request completes - remove the abort controller for the req
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.message); // Error will be caught in catch block below
        }

        setIsLoading(false);
        return responseData;
      } catch (err) {
        setError(err.message || 'Something went wrong please try again.');
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  // useEffect - Run once, when this page renders the first time
  useEffect(() => {
    // Run when a component that uses this hook unmounts
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => {
        abortCtrl.abort();
      });
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
