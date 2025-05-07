// // src/hooks/teacher/useTeacherClasses.js

// import { useState, useEffect } from 'react';
// import { fetchTeacherClassOverview } from '../../api/teacherAPI';

// export const useTeacherClassOverview = (class_id, course_id) => {
//     const [classOverview, setClassOverview] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     useEffect(() => {
//         const getClassOverview = async () => {
//             try {
//                 setLoading(true);
//                 const response = await fetchTeacherClassOverview(class_id, course_id);
//                 setClassOverview(response.data);
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (class_id, course_id) getClassOverview();
//     }, [class_id, course_id]);

//     return { classOverview, loading, error };
// };


import { useState, useEffect, useCallback } from 'react';
import { fetchTeacherClassOverview } from '../../api/teacherAPI';

export const useTeacherClassOverview = (class_id, course_id) => {
    const [classOverview, setClassOverview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Define the fetch function using useCallback to prevent unnecessary re-creations
    const getClassOverview = useCallback(async () => {
        if (!class_id || !course_id) return; // Ensure valid IDs before making API call

        try {
            setLoading(true);
            const response = await fetchTeacherClassOverview(class_id, course_id);
            setClassOverview(response.data);
            setError(null); // Reset error on success
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [class_id, course_id]);

    // Fetch data on mount & when dependencies change
    useEffect(() => {
        getClassOverview();
    }, [getClassOverview]);

    // Return the fetched data & a function to manually refetch
    return { classOverview, loading, error, refetch: getClassOverview };
};
