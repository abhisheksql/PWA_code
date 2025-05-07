// src/hooks/teacher/useTeacherClasses.js

import { useState, useEffect } from 'react';
import { fetchChapterAssignTimeline } from '../../api/teacherAPI';

export const useChapterAssignTimeline = (class_id, course_id) => {
    const [chapterTimeline, setchapterTimeline] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const getchapterTimeline = async () => {
            try {
                setLoading(true);
                const response = await fetchChapterAssignTimeline(class_id, course_id);
                setchapterTimeline(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
if(class_id && course_id) {
        getchapterTimeline();
}
    }, [class_id, course_id]);

    return { chapterTimeline, loading, error };
};
