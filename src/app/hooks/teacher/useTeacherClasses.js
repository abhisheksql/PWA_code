// src/hooks/teacher/useTeacherClasses.js

import { useState, useEffect } from 'react';
import { fetchTeacherClasses } from '../../api/teacherAPI';

export const useTeacherClasses = (subject) => {
  const [classes, setClasses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getClasses = async () => {
      try {
        setLoading(true);
        const response = await fetchTeacherClasses(subject);
        // console.log("fdsfsd  -- ",response);
        setClasses(response.data); // Assuming response has a `data` field
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getClasses();
    if(subject){
    }
  }, [subject]);

  return { classes, loading, error };
};
