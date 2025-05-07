// src/hooks/teacher/useTeacherClasses.js

import { useState, useEffect } from 'react';
import { fetchTeacherClassesList } from '../../api/teacherAPI';

export const useTeacherClassesList = (grade, subject ) => {
  const [classesList, setClassesList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const getClassesList = async () => {
      try {
        setLoading(true);
        const response = await fetchTeacherClassesList(grade, subject);
        setClassesList(response.data); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getClassesList();
  }, [grade, subject]);

  return { classesList, loading, error };
};
