// src/app/context/TeacherContext.js

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchTeacherDetails } from '../api/teacherAPI';

const TeacherContext = createContext();

export const TeacherProvider = ({ teacherId, children }) => {
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getTeacherData = useCallback(async () => {
    try {
      setLoading(true);
      const [detailsResponse ] = await Promise.all([
        fetchTeacherDetails(teacherId),
      ]);

      setTeacherData(detailsResponse.data); // Sets teacher details
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => {
    if (teacherId ) getTeacherData();
  }, [getTeacherData, teacherId]);

  return (
    <TeacherContext.Provider value={{ teacherData, loading, error }}>
      {children}
    </TeacherContext.Provider>
  );
};

export const useTeacher = () => useContext(TeacherContext);
