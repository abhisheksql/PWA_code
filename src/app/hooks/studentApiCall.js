import { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // Make sure axios is imported
import axiosInstance from "../auth";
const useApi = ({ url, method = 'GET', body = null, headers = {} }, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApi = useCallback(async () => {

    if (!url) {
      setData(null);
      setError('Invalid URL');
      return; // Skip API call if URL is invalid
    }

    setLoading(true);
    setError(null);

    const studentbaseUrl = process.env.NEXT_PUBLIC_STUDENT_API_URL;
    const fullUrl = `${url}`;
    try {
      const response = await axiosInstance({
        url: fullUrl,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        ...(body && { data: body }), // Axios uses `data` instead of `body`
      });

      setData(response.data); // Set only the response data
    } catch (err) {
      setError(err.message); // Set the error message only
      console.error('Fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }, [url, method, body, headers]);

  useEffect(() => {
    // dependencies[0] > 0
    if (url) {
    fetchApi();
    }
  }, [url,...dependencies]);

  return { data, loading, error, refetch: fetchApi };
};

export default useApi;
