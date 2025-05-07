// src/hooks/teacher/useMilestonePopupData.js
import { useState, useEffect } from 'react';
import { fetchMilestonePopupData } from '../../api/teacherAPI';

export const useMilestonePopupData = () => {
  const [chapterData, setChapterData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (class_id, course_id, chapter_id,chapterName,className) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchMilestonePopupData(class_id, course_id, chapter_id);

      setChapterData({
        ...response.data,
        chapter_name: chapterName,
        class_name: className,
        chapter_id: chapter_id,
        class_id: class_id,
        course_id: course_id
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { chapterData, loading, error, fetchData };
};
