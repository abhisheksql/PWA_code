'use client';
import '../../../../public/style/teacher.css';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Left from '../../../../public/images/teacher/left.svg';
import Chapter from '../../../../public/images/teacher/Chapter.svg';
import { useChaptersList } from '../../hooks/teacher/useChaptersList';
import {useRouter } from "next/navigation";
import ClassDropdown from "./ClassDropdown";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import StartChapterModal from './modals/StartChapterModal';
import { useChapterData } from '../../hooks/teacher/useChapterData';
import Loader from "../../components/teacher/Loader";
import Skeleton from '../../components/Skeleton';

const ChaptersList = () => {
    const router = useRouter();
    const [activeModal, setActiveModal] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [classId, setClassId] = useState(null); // Class ID for fetching data
    const [courseId, setCourseId] = useState(null); // Course ID for fetching data
    const [isLoader, setIsLoader] = useState(false);

    useEffect(() => {
        // setIsLoader(true);
        const searchParams = new URLSearchParams(window.location.search);
        const class_id = parseInt(searchParams.get('class_id'), 10);
        const course_id = parseInt(searchParams.get('course_id'), 10);

        if (class_id && course_id) {
            setClassId(class_id);
            setCourseId(course_id);
        }
        // setIsLoader(false);
    }, []);

    const { ChaptersList, loading: chaptersLoading, error: chaptersError } = useChaptersList(classId, courseId);
    const { ChapterData, loading, error, fetchData } = useChapterData();

    const handleClassSelect = (newSectionId, newCourseId, selectedOption) => {
        setClassId(newSectionId);
        setCourseId(newCourseId);
        setSelectedClass(selectedOption);  // Update selected class
    };

    const chapterData = ChaptersList?.chapters?.map((chapter) => ({
        name: chapter.chapter_name,
        topics_count: chapter.topics_count,
        number: chapter.topics_count.toString(),
        completion: chapter.completion,
        learning_index: chapter.learning_index,
        proficiency_level: chapter.proficiency_level,
        assignments_count: chapter.assignments_count,
        multimedia_count: chapter.multimedia_count
    }));

    const chapters_count = ChaptersList?.chapters_count;


    const handleStartChapterClick = (chapter) => {
        setActiveModal('startChapter');
        fetchData(classId, courseId, chapter.chapter_id, chapter.chapter_name);
    };

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
                    <span onClick={handleBackButtonClick} style={{ cursor: 'pointer' }}>
                        <Image src={Left} alt="Back Icon" width={20} height={20} />
                    </span>
                    <h2>Total Chapters ({chapters_count})</h2>
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
                                    <td className="learning-index">
                                        <Skeleton width="180px" height="20px"/>
                                    </td>
                                    <td className="class-students dfa">
                                        <Skeleton width="80px" height="15px" />
                                        <Skeleton width="80px" height="15px" />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            ChaptersList?.chapters?.map((chapter, index) => (
                                <tr key={index}>
                                    <td className="student-name" style={{ width: '35%' }}>
                                        <div className="student-info">
                                            <div className="chapter-list-icon-container">
                                                <Image src={Chapter} alt="Student Icon" width={30} height={30} />
                                            </div>
                                            <div className="df" style={{ alignItems: 'flex-start' }}>
                                                <p className="class-name" style={{ cursor: 'pointer', textAlign: 'left' }} onClick={() => handleViewDetails(chapter.chapter_id, classId, courseId)}>{chapter.chapter_name}</p>
                                                <span className='chapterdetailstopics' style={{ fontSize: '14px' }}>{chapter.topics_count} Topics </span>
                                            </div>
                                            {/* <span className="class-name" style={{ cursor: 'pointer' }} onClick={() => handleViewDetails(chapter.chapter_id, classId, courseId)}>{chapter.chapter_name}</span> */}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="dfjc">
                                            {(chapter.status === "ongoing" || chapter.status === "completed") && (
                                                <div className="circular-progress-container">
                                                    <CircularProgressbar
                                                        value={chapter.completion * 100}
                                                        text={chapter.completion == null ? '0' : `${Math.floor(chapter.completion * 100)}%`}
                                                        styles={buildStyles({
                                                            textSize: '24px',
                                                            pathColor: '#6166AE',
                                                            textColor: '#6166AE',
                                                            trailColor: '#e0e0e0',
                                                        })}
                                                        style={{ width: '30px' }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    <td className="learning-index" style={{ width: '220px' }}>
                                        {chapter.status === "ongoing" || chapter.status === "completed" ? (
                                            <div className="dfjc">
                                                <ProgressBar style={{ width: '100%', height: '15px', borderRadius: '2px' }}>
                                                    <ProgressBar now={chapter.proficiency_level?.master * 100} style={{ backgroundColor: '#24AD60' }} label={<span style={{ fontSize: '10px', fontWeight: '700' }}>{Math.floor(chapter.proficiency_level?.master * 100)}%</span>} />
                                                    <ProgressBar now={chapter.proficiency_level?.proficiency * 100} style={{ backgroundColor: '#9DCA45' }} label={<span style={{ fontSize: '10px', fontWeight: '700' }}>{Math.floor(chapter.proficiency_level?.proficiency * 100)}%</span>} />
                                                    <ProgressBar now={chapter.proficiency_level?.developing * 100} style={{ backgroundColor: '#FFCA28' }} label={<span style={{ fontSize: '10px', fontWeight: '700' }}>{Math.floor(chapter.proficiency_level?.developing * 100)}%</span>} />
                                                    <ProgressBar now={chapter.proficiency_level?.critical * 100} style={{ backgroundColor: '#FD6845' }} label={<span style={{ fontSize: '10px', fontWeight: '700' }}>{Math.floor(chapter.proficiency_level?.critical * 100)}%</span>} />
                                                </ProgressBar>
                                            </div>
                                        ) : chapter.status === "upcoming" ? (
                                            <div className="resources-info" style={{ fontSize: '10px', color: '#949494' }}>
                                                <span> Assignment - {chapter.assignments_count}</span>
                                                { chapter.multimedia_count > 0 ? (
                                                <>
                                                    <span className="vertical-line"></span>
                                                    <span> Multimedia - {chapter.multimedia_count}</span>
                                                </>
                                                ) : null}
                                                
                                            </div>
                                        ) : null}
                                    </td>

                                    <td className="action" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                                        {/* Conditionally render buttons based on chapter status */}
                                        {chapter.status === "upcoming" && (
                                            <>
                                                <button
                                                    className="starting-button"
                                                    onClick={() => handleViewDetails(chapter.chapter_id, classId, courseId)}
                                                >
                                                    Manual Assign
                                                </button>
                                                <button
                                                    className="start-task-button"
                                                    onClick={() =>
                                                        handleStartChapterClick({
                                                            chapter_id: chapter.chapter_id,
                                                            chapter_name: chapter.chapter_name,
                                                        })
                                                    }
                                                >
                                                    Quick Assign
                                                </button>
                                            </>
                                        )}
                                        {(chapter.status === "completed" || chapter.status === "ongoing") && (
                                            <>
                                                <div>
                                                </div>
                                                <button
                                                    className="view-report-button"
                                                    onClick={() => handleChapterReportClick(chapter.section_id, chapter.course_id, chapter.chapter_id, chapter.grade)}
                                                >
                                                    View Report
                                                </button>
                                            </>
                                        )}
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

export default ChaptersList;