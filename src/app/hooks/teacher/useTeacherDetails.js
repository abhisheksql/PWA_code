// // src/hooks/teacher/useTeacherDetails.js

// import { useState, useEffect } from 'react';
// import { fetchTeacherDetails } from '../../../app/api/teacherAPI';

// export const useTeacherDetails = (teacherId) => {
//     console.log(teacherId)
//   const [teacherData, setTeacherData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const getTeacherDetails = async () => {
//       try {
//         setLoading(true);
//         const response = await fetchTeacherDetails(teacherId);
//         setTeacherData(response.data); // Assumes API response structure includes data
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (teacherId) getTeacherDetails();
//   }, [teacherId ]);

//   return { teacherData, loading, error };
// };
