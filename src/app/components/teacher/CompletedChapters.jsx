'use client';
import '../../../../public/style/teacher.css';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Left from '../../../../public/images/teacher/left.svg';
import Chapter from '../../../../public/images/teacher/Chapter.svg';
import { useCompletedChapters } from '../../hooks/teacher/useCompletedChapters';
import { useRouter } from "next/navigation";
import ClassDropdown from "./ClassDropdown";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import StartChapterModal from './modals/StartChapterModal';
import { useChapterData } from '../../hooks/teacher/useChapterData';
import Loader from "../../components/teacher/Loader";
import Skeleton from '../../components/Skeleton';

const CompletedChapters = () => {
    const router = useRouter();
    const [activeModal, setActiveModal] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [classId, setClassId] = useState(null); // Class ID for fetching data
    const [courseId, setCourseId] = useState(null); // Course ID for fetching data
    const [isLoader, setIsLoader] = useState(false);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const class_id = parseInt(searchParams.get('class_id'), 10);
        const course_id = parseInt(searchParams.get('course_id'), 10);

        if (class_id && course_id) {
            setClassId(class_id);
            setCourseId(course_id);
        }
    }, []);

    const { CompletedChapters, loading: chaptersLoading, error: chaptersError } = useCompletedChapters(classId, courseId);
    const { ChapterData, loading, error, fetchData } = useChapterData();

    const handleClassSelect = (newSectionId, newCourseId, selectedOption) => {
        setClassId(newSectionId);
        setCourseId(newCourseId);
        setSelectedClass(selectedOption);
    };

    const chapterData = CompletedChapters?.chapters?.map((chapter) => ({
        name: chapter.chapter_name,
        completion_rate: chapter.completion_rate,
        learning_index: chapter.learning_index,
        proficiency_level: chapter.proficiency_level
    }));

    const chapters_count = CompletedChapters?.chapters_count;

    const closeModal = () => {
        setActiveModal(null);
    };

    const handleViewDetails = (chapterId, classId, courseId) => {
        setIsLoader(true);
        router.push(`/teacher/chapter_details?chapter_id=${chapterId}&class_id=${classId}&course_id=${courseId}`);
    };

    const handleChapterReportClick = (classId, courseId, chapterid, grade) => {
        setIsLoader(true);
        router.push(`/teacher/reports/chapterdetails/?class_id=${classId}&course_id=${courseId}&chapter_id=${chapterid}&grade=${grade}&tab=performance`);
    };

    const handleBackButtonClick = () => {
        setIsLoader(true);
        router.push(`/teacher/class_overview?class_id=${classId}&course_id=${courseId}`);
    };

    return (
        <div className="class-overview-container">
            <div className="class-overview-header">
                <div className="classheading">
                    <button onClick={handleBackButtonClick}>
                        <Image src={Left} alt="Back Icon" width={20} height={20} />
                    </button>
                    <h2>Completed Chapters ({chapters_count})</h2>
                </div>
                <div className="dropdown-container">
                    <ClassDropdown onClassChange={handleClassSelect} />
                </div>
            </div>

            {/* Students Table Section */}
            <div className="students-table-container">
                <table className="students-table">
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left' }}>Chapter name</th>
                            <th><span className='textnone'>Completion Rate</span> (C.R.)</th>
                            <th>Proficiency</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {chaptersLoading ? (
                            Array.from({ length: 5 }).map((_, index) => (
                                <tr key={index}>
                                    <td className="student-name">
                                        <div className="student-info">
                                            <div className="chapter-list-icon-container">
                                                <Skeleton width="30px" height="30px" borderRadius="50%" />
                                            </div>
                                            <Skeleton width="100px" height="20px" style={{ marginLeft: '10px' }} />
                                        </div>
                                    </td>
                                    <td className="concept-reach">
                                        <Skeleton width="50px" height="50px" borderRadius="50%" />
                                    </td>
                                    <td>
                                        <Skeleton width="200px" height="20px" />
                                    </td>
                                    <td>
                                        <Skeleton width="80px" height="25px" />
                                    </td>
                                </tr>
                            ))
                        ) : (

                         CompletedChapters?.chapters?.map((chapter, index) => (
                            <tr key={index}>
                                <td className="student-name">
                                    <div className="student-info">
                                        <div className="chapter-list-icon-container">
                                            <Image src={Chapter} alt="Chapter Icon" width={30} height={30} />
                                        </div>
                                        <div className="df" style={{ alignItems: 'flex-start' }}>
                                            <p className="class-name" style={{ cursor: 'pointer' }} onClick={() => handleViewDetails(chapter.chapter_id, classId, courseId)}>{chapter.chapter_name}</p>
                                            <span className='chapterdetailstopics' style={{ fontSize: '14px' }}>{chapter.total_topic_count} Topics </span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className='dfjc'>
                                        <div className="circular-progress-container" style={{ width: '40px' }}>
                                            <CircularProgressbar
                                                value={chapter.completion != null ? (chapter.completion * 100) : 0}
                                                text={chapter.completion != null ? `${(chapter.completion * 100).toFixed(0)}%` : "0%"}
                                                styles={buildStyles({
                                                    textSize: '24px',
                                                    pathColor: '#6166AE',
                                                    textColor: '#6166AE',
                                                    trailColor: '#e0e0e0',
                                                })}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="learning-index" style={{ width: '220px' }}>
                                    <ProgressBar style={{ height: '15px', borderRadius: '2px' }}>
                                        <ProgressBar now={chapter.proficiency_level?.master * 100} style={{ backgroundColor: '#24AD60' }} label={<span style={{ fontSize: '10px', fontWeight: '700' }}>{Math.floor(chapter.proficiency_level?.master * 100)}%</span>} />
                                        <ProgressBar now={chapter.proficiency_level?.proficiency * 100} style={{ backgroundColor: '#9DCA45' }} label={<span style={{ fontSize: '10px', fontWeight: '700' }}>{Math.floor(chapter.proficiency_level?.proficiency * 100)}%</span>} />
                                        <ProgressBar now={chapter.proficiency_level?.developing * 100} style={{ backgroundColor: '#FFCA28' }} label={<span style={{ fontSize: '10px', fontWeight: '700' }}>{Math.floor(chapter.proficiency_level?.developing * 100)}%</span>} />
                                        <ProgressBar now={chapter.proficiency_level?.critical * 100} style={{ backgroundColor: '#FD6845' }} label={<span style={{ fontSize: '10px', fontWeight: '700' }}>{Math.floor(chapter.proficiency_level?.critical * 100)}%</span>} />
                                    </ProgressBar>
                                </td>
                                <td className="action">
                                    <button className="view-report-button" onClick={() => handleChapterReportClick(chapter.section_id, chapter.course_id, chapter.chapter_id, chapter.grade)}>
                                        View Report
                                    </button>
                                </td>
                            </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* End Chapter Modal */}
            {activeModal === 'startChapter' && (
                <StartChapterModal
                    isOpen={true}
                    onClose={closeModal}
                    ChapterData={ChapterData}
                />
            )}
             {isLoader ? <Loader /> : ""}
        </div>
    );
};

export default CompletedChapters;