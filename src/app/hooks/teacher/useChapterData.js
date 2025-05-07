import { useState, useEffect } from 'react';
import { fetchChapterData } from '../../api/teacherAPI';

export const useChapterData = () => {
    const [ChapterData, setChapterData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    
    const fetchData = async (class_id, course_id, chapter_id, chapterName = '', className = '') => {
        console.log(class_id, course_id, chapter_id);
        if (!class_id || !course_id || !chapter_id) {
            setChapterData({}); // Reset ChapterData if parameters are missing
            return;
        }
        try {
            setLoading(true);
            setError(null);
    
            const response = await fetchChapterData(class_id, course_id, chapter_id);
            if (response && response.data) {
                setChapterData({
                    ...response.data,
                    chapter_name: response.data.chapter_name || chapterName,
                    class_name: className || response.data.class_name,
                    chapter_id: chapter_id,
                    class_id: class_id,
                    course_id: course_id
                });
            } else {
                setChapterData({}); // Reset ChapterData if response is invalid
                console.warn("Received empty data from API");
            }
        } catch (err) {
            setError(err.message);
            setChapterData({}); // Reset ChapterData on error
        } finally {
            setLoading(false);
        }
    };

    return { ChapterData, loading, error, fetchData };
};
