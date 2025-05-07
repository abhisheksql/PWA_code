import React , { useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Image from 'next/image';
import CLTIcon from '../../../../../public/images/teacher/CLTIcon.svg';
import { updateEndedChapter } from '../../../api/teacherAPI';
import { toast } from 'react-toastify'; // Importing toast
import Loader from "../../teacher/Loader";


const EndChapterModal = ({ isOpen, onClose, chapterData, loading, error }) => {
    const [isLoader, setIsLoader] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isMilestoneChecked, setIsMilestoneChecked] = useState(false); // State to track checkbox
    if (!isOpen) return null;

    const handleCheckboxChange = (e) => {
        setIsMilestoneChecked(e.target.checked); // Update the state when checkbox is toggled
    };

    const handleEndChapter = async () => {
        setIsLoader(true)
        try {
            const { chapter_id, course_id, class_id } = chapterData;
            const isCLTAvailable = true; // Replace with your logic if this value varies
            const response = await updateEndedChapter(chapter_id, course_id, class_id, isCLTAvailable);
            toast.success('Chapter Ended Successfully');
            console.log('API Response:', response);
            onClose(); // Close the modal after success
        } catch (error) {
            toast.error('Failed to end chapter. Please try again.', error);
        } finally {
            setIsLoader(false)
        }
    };

    return (
        <div className="tch-modal-overlay">
            <div className="tch-modal-content" style={{padding:'0px'}}>
                {/* Modal Header */}
                <div className="tch-modal-content-header">
                    <h2>Do you want to end this chapter and assign the milestone?</h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p style={{ color: 'red' }}>Error: {error}</p>
                    ) : (
                        <div className="chapter-title">
                            <span style={{ color: '#fff' }}> {chapterData?.chapter_name || ''}</span>
                            <span className="chapter-class">{chapterData?.class_name || ''}</span>
                        </div>
                    )}
                </div>

                {!loading && !error && chapterData && (
                    <div className="chapter-topics-section chapter-info">
                        {chapterData.topics?.map((topic, index) => (
                            <div key={index} className="chapter-topics-line">
                                <p style={{width:'70%'}}>{topic.topic_name}</p>
                                <div className="concept-reach">
                                    <span>Concept Reach</span>
                                    <div style={{ width: 40, height: 40 }}>
                                        <CircularProgressbar
                                            value={topic.concept_reach !== null ? Math.floor(topic.concept_reach * 100) : 0}
                                            text={topic.concept_reach !== null ? `${Math.floor(topic.concept_reach * 100)}%` : "0%"}
                                            styles={buildStyles({
                                                textSize: '24px',
                                                pathColor: '#6166AE',
                                                textColor: '#6166AE',
                                                trailColor: '#E0E0E0',
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="milestone-section topic-title mb20 mt20">
                            <div className="assignment">
                                <Image src={CLTIcon} className="icon-container" alt="Assignment Icon" width={20} height={20} />
                                <div className="df">
                                    <p className="chapter-name" style={{ fontSize: '18px', color: '#5E5E5E' }}>Milestone</p>
                                    <p className="subheading">{chapterData.milestone_questions || 0} Questions</p>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                className="select-topic-checkbox"
                                checked={isMilestoneChecked} // Controlled checkbox state
                                onChange={handleCheckboxChange} // Handle checkbox change
                            />
                        </div>
                    </div>
                )}
                <div className="modal-buttons">
                    <button onClick={onClose} className="modal-no-button">No</button>
                    <button
                        className="modal-yes-button"
                        onClick={handleEndChapter}
                        disabled={!isMilestoneChecked} // Disable button if checkbox is not checked
                    >
                        End Chapter
                    </button>
                </div>
            </div>
            {isLoader ? <Loader /> : ""}
        </div>
    );
};

export default EndChapterModal;
