import { useState, useEffect } from 'react';
import { fetchChapterList } from '../../api/teacherAPI';

export const useChaptersList = (class_id, course_id) => {
  const [ChaptersList, setChaptersList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getChaptersList = async () => {
      try {
        setLoading(true);
        const response = await fetchChapterList(class_id, course_id);
        console.log('response', response.data);
        setChaptersList(response.data); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (class_id && course_id) {
      getChaptersList();
    }
  }, [class_id, course_id]);
  return { ChaptersList, loading, error };
};
