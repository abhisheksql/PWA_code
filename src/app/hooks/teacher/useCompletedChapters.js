import { useState, useEffect } from 'react';
import { fetchCompletedChapters } from '../../api/teacherAPI';

export const useCompletedChapters = (class_id, course_id) => {
  const [CompletedChapters, setCompletedChapters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCompletedChapters = async () => {
      try {
        setLoading(true);
        const response = await fetchCompletedChapters(class_id, course_id);
        console.log('response', response.data);
        setCompletedChapters(response.data); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (class_id && course_id) {
      getCompletedChapters();
    }
  }, [class_id, course_id]);
  return { CompletedChapters, loading, error };
};
