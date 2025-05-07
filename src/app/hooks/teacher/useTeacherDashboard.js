// // src/hooks/useTeacherDashboard.js

// import { useState, useEffect } from 'react';
// import { fetchTeacherDashboardData } from '../app/api/teacherAPI';

// export const useTeacherDashboard = (teacherId) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const getData = async () => {
//       setLoading(true);
//       try {
//         const result = await fetchTeacherDashboardData(teacherId);
//         setData(result);
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (teacherId) getData();
//   }, [teacherId]);

//   return { data, loading, error };
// };
