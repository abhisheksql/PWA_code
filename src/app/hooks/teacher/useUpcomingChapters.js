import { useState, useEffect } from 'react';
import { fetchUpcomingChapters } from '../../api/teacherAPI';

export const useUpcomingChapters = (class_id, course_id) => {
  const [UpcomingChaptersList, setUpcomingChaptersList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUpcomingChaptersList = async () => {
      try {
        setLoading(true);
        const response = await fetchUpcomingChapters(class_id, course_id);
        setUpcomingChaptersList(response.data); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (class_id, course_id) getUpcomingChaptersList();
  }, [class_id, course_id]);

  return { UpcomingChaptersList, loading, error };
};
