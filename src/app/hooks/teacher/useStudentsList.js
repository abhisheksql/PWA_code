// src/hooks/teacher/useTeacherClasses.js

import { useState, useEffect } from 'react';
import { fetchStudentsList } from '../../api/teacherAPI';

export const useStudentsList = (class_id, course_id) => {
  const [studentsList, setStudentsList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getstudentsList = async () => {
      try {
        setLoading(true);
        const response = await fetchStudentsList(class_id, course_id);
        setStudentsList(response.data); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (class_id, course_id) getstudentsList();
  }, [class_id, course_id]);

  return { studentsList, loading, error };
};
