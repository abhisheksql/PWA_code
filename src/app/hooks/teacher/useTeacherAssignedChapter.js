// // src/hooks/teacher/useAssignedChapter.js

// import { useState, useEffect } from 'react';
// import { fetchTeacherAssignedChapter } from '../../api/teacherAPI';

// export const useTeacherAssignedChapter = () => {
  
//   const [AssignedChapter, setAssignedChapter] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const getAssignedChapter = async () => {
//       try {
//         // setLoading(true);
//         const response = await fetchTeacherAssignedChapter();
//         // console.log("AssignedChapter  -- ",response);
//         setAssignedChapter(response.data); // Assuming response has a `data` field
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     getAssignedChapter();
//   }, []);

//   return { AssignedChapter, loading, error };
// };


import { useState, useEffect, useCallback } from 'react';
import { fetchTeacherAssignedChapter } from '../../api/teacherAPI';

export const useTeacherAssignedChapter = (subject) => {
  const [AssignedChapter, setAssignedChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define the fetch function using useCallback
  const getAssignedChapter = useCallback(async () => {
    try {
      
      setLoading(true);
      const response = await fetchTeacherAssignedChapter(subject);
      setAssignedChapter(response.data); 
      setError(null);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [subject]);

  // Fetch data on mount
  useEffect(() => {
    getAssignedChapter();
  }, [getAssignedChapter]);

  return { AssignedChapter, loading, error, refetch: getAssignedChapter };
};
