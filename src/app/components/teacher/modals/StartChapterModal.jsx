import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify'; // Importing toast
import { startChapter } from '../../../api/teacherAPI'; // Importing the startChapter function
import Loader from "../../../components/teacher/Loader";

const StartChapterModal = ({ isOpen, onClose, ChapterData, loading, error }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    const [dueDate, setDueDate] = useState('');
    // Set dueDate when the component mounts or when isOpen changes
    useEffect(() => {
        if (isOpen) {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 14); // Add 18 days
            const formattedFutureDate = futureDate.toISOString().split("T")[0];
            setDueDate(formattedFutureDate);
        }
    }, [isOpen]); // Dependency array to run effect when isOpen changes

    if (!isOpen) return null; // Don't render modal if it's not open
    const handleStartChapter = async (class_id, course_id, chapter_id) => {
        setIsLoader(true);

        try {
            // Ensure topic_ids is always an array of topic IDs
            const topic_ids = Array.isArray(ChapterData.topics)
                ? ChapterData.topics.map(topic => topic.topic_id || topic.id) // Ensure you're extracting the correct ID
                : [];

            // If topic_ids is empty, log a warning
            if (!topic_ids.length) {
                console.warn('No topics found, sending an empty topic_ids array');
            }

            // Prepare the payload
            let timestamp = 0;
            if (dueDate && dueDate !== '') {
                const date = new Date(dueDate);
                timestamp = Math.floor(date.getTime() / 1000); // Convert to seconds
            }
            console.log('timestamp', timestamp);

            const payload = {
                chapter_id,
                course_id,
                section_id: class_id, // class_id is section_id in the API
                topic_ids,  // This should now be an array of topic_ids
                ...(ChapterData.crq?.is_visible && { is_CRQ_available: true }),  // Add is_CRQ_available if CRQ is visible
                ...(dueDate && { chapter_due_date: timestamp }),  // Only include dueDate if it's set
            };

            // Log the payload for debugging
            console.log("Sending payload:", payload);

            // Make the API call to start the chapter
            const response = await startChapter(class_id, course_id, chapter_id, payload);

            // Show success toast if the API call is successful
            // toast.success('Chapter started successfully!');
            console.log('API Response:', response);

            // Close the modal after success
            onClose();
        } catch (err) {
            // Show error toast if the API call fails
            // toast.error('Error starting chapter. Please try again.');
            console.error('Error starting chapter:', err);
        } finally {
            setIsLoader(false); // Ensure loading state is reset after request is finished
        }
    };
    return (
        <div className="tch-modal-overlay">
            <div className="tch-modal-content" style={{ padding: '0px' }}>
                {/* Modal Header */}
                <div className="tch-modal-content-header">
                    <h2>Are you sure you want to assign all the topics below and start the chapter?</h2>

                      {isLoader ? <Loader /> : ""}
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p style={{ color: 'red' }}>{error}</p> // Display error if provided
                    ) : (
                        <div className="chapter-title">
                            <span style={{ color: '#fff' }}>{ChapterData?.chapter_name || ''}</span>
                            <span className="chapter-class">{ChapterData?.class_name || ''}</span>
                        </div>
                    )}
                </div>

                {/* If not loading or errors, show the chapter info and topics */}
                {!isLoading && !error && ChapterData && (
                    <div className="chapter-topics-section chapter-info">
                        {ChapterData.crq?.is_visible && (
                            <div className="chapter-topics-line">
                                <p>Chapter Readiness Quiz</p>
                            </div>
                        )}

                        {ChapterData.topics?.map((topic, index) => (
                            <div key={index} className="chapter-topics-line">
                                <p>{topic.topic_name}</p>
                                <div className="resources-info">
                                    <span style={{ width: '100px' }}> Assignment - {topic.assignments.length}</span>
                                    {topic.multimedias.length > 0 ? (
                                        <>
                                            <span className="vertical-line"></span>
                                            <span>Multimedia - {topic.multimedias.length} </span>
                                        </>
                                    ) : null}
                                </div>
                            </div>
                        ))}

                        {/* Due Date input */}
                        <div className="due-date" style={{ marginTop: '20px' }} >
                            <label>Due Date</label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)} // Update dueDate state on input change
                                min={new Date().toISOString().split("T")[0]} // Disable past dates
                                style={{ padding: '10px', width: '100%', fontSize: '16px' }}
                            />
                        </div>
                    </div>
                )}

                {/* Modal Buttons */}
                <div className="modal-buttons" style={{ marginTop: '5px' }}>
                    <button onClick={onClose} className="modal-no-button" disabled={isLoading}>No</button>
                    <button
                        className="modal-yes-button"
                        onClick={() => handleStartChapter(ChapterData?.class_id, ChapterData?.course_id, ChapterData?.chapter_id)}
                        disabled={isLoading} // Disable the button while loading
                    >
                        Start Chapter
                    </button>
                </div>
            </div>
            {isLoader ? <Loader /> : ""}
        </div>
    );
};

export default StartChapterModal;
