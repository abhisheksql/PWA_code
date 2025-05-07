'use client';
import '../../../../public/style/teacher.css';
import React, { useState, useEffect, useMemo } from 'react';
import Select from 'react-select';
import { FiChevronDown } from 'react-icons/fi';
import Image from 'next/image';
import Left from '../../../../public/images/teacher/left.svg';
import Chapter from '../../../../public/images/teacher/Chapter.svg';
import { useUpcomingChapters } from '../../hooks/teacher/useUpcomingChapters';
import { useSearchParams, useRouter } from "next/navigation";
import StartChapterModal from './modals/StartChapterModal';
import { useChapterData } from '../../hooks/teacher/useChapterData';
import ClassDropdown from "./ClassDropdown";
import Skeleton from '../../components/Skeleton';
import Loader from "../../components/teacher/Loader";


const UpcomingChapter = () => {
    const router = useRouter();
    const [activeModal, setActiveModal] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null); // Holds the selected dropdown value
    const [classId, setClassId] = useState(null); // Class ID for fetching data
    const [courseId, setCourseId] = useState(null); // Course ID for fetching data
    const [isLoader, setIsLoader] = useState(false);
     useEffect(() => {
        setIsLoader(true);
        const searchParams = new URLSearchParams(window.location.search);
        const class_id = parseInt(searchParams.get('class_id'), 10);
        const course_id = parseInt(searchParams.get('course_id'), 10);

        if (class_id && course_id) {
            setClassId(class_id);
            setCourseId(course_id);
        }
        setIsLoader(false);
    }, []);

    const { UpcomingChaptersList, loading: UpcomingChapterLoading, error: UpcomingChapterError } = useUpcomingChapters(classId, courseId);
    const { ChapterData, loading, error, fetchData } = useChapterData();

    const chapterList = UpcomingChaptersList?.upcoming_chapters.map((chapter) => ({
        chapter_id: chapter.chapter_id,
        name: chapter.chapter_name,
        number: chapter.topics_count.toString(),
        assignment: chapter.assignments_count.toString(),
        multimedia: chapter.multimedia_count.toString(),
        topics_count: chapter.topics_count
    }));

    const upcoming_chapters_count = UpcomingChaptersList?.upcoming_chapters_count;

    const handleStartChapterClick = (chapter) => {
        console.log("selectedClass", selectedClass);
        setActiveModal('startChapter');
        fetchData(classId, courseId, chapter.chapter_id, chapter.chapter_name);
    };

    const handleClassSelect = (newSectionId, newCourseId, selectedOption) => {
        setClassId(newSectionId);
        setCourseId(newCourseId);
        setSelectedClass(selectedOption);  // Update selected class
    };

    const closeModal = () => {
        setActiveModal(null);
    };

    const handleViewDetails = (chapterId, classId, courseId) => {
        setIsLoader(true);
        router.push(`/teacher/chapter_details?chapter_id=${chapterId}&class_id=${classId}&course_id=${courseId}`);
    };


    const handleBackButtonClick = () => {
        setIsLoader(true);
        router.push(`/teacher/class_overview?class_id=${classId}&course_id=${courseId}`);
    };
    return (
        <div className="class-overview-container">
            {/* Header Section */}
            <div className="class-overview-header">
                <div className="classheading">
                    <button onClick={handleBackButtonClick}>
                        <Image src={Left} alt="Back Icon" width={20} height={20} />
                    </button>
                    <h2>Upcoming Chapters ({upcoming_chapters_count})</h2>
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
                            <th>No. of Resources</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>

                    {UpcomingChapterLoading ? (
                            Array.from({ length: 5 }).map((_, index) => (
                                <tr key={index}>
                                    <td style={{width:'50%'}}>
                                        <div className="student-info">
                                            <div className="chapter-list-icon-container">
                                                <Skeleton width="30px" height="30px" borderRadius="50%" />
                                            </div>
                                            <Skeleton width="100px" height="20px" style={{ marginLeft: '10px' }} />
                                        </div>
                                    </td>
                                    <td style={{width:'50%'}}>
                                        <Skeleton width="200px" height="20px" />
                                    </td>
                                    <td className="dfa" style={{width:'100%'}}>
                                        <Skeleton width="80px" height="20px" style={{ marginBottom: '5px' }} />
                                        <Skeleton width="80px" height="20px" />
                                    </td>
                                </tr>
                            ))
                        ) : (

                            chapterList?.map((chapter, index) => (
                                <tr key={index}>
                                    <td className="student-name">
                                        <div className="student-info">
                                            <div className="chapter-list-icon-container">
                                                <Image src={Chapter} alt="Student Icon" width={30} height={30} />
                                            </div>
                                            <div className="df" style={{ alignItems: 'flex-start' }}>
                                                <span className="class-name" style={{ cursor: 'pointer' , textAlign: 'left'}} onClick={() => handleViewDetails(chapter.chapter_id, classId, courseId)}>{chapter.name}</span>
                                                <span className='chapterdetailstopics' style={{ fontSize: '14px' }}>{chapter.topics_count} Topics </span>
                                            </div>
                                        </div>
                                    </td>
                                    {/* <td className="learning-index">
                                        <span className="class-students">{chapter.number}</span>
                                    </td> */}
                                    <td className="class-students">
                                        <div className="resources-info">
                                            <span> Assignment - {chapter.assignment}</span>
                                            { chapter.multimedia_count > 0 ? (
                                                <>
                                                    <span className="vertical-line"></span>
                                                    <span> Multimedia - {chapter.multimedia}</span>
                                                </>
                                            ) : null}
                                        </div>
                                    </td>
                                    <td className="action">
                                        <button className="starting-button" onClick={() => handleViewDetails(chapter.chapter_id, classId, courseId)}>Manual Assign</button>

                                        <button className="start-task-button" onClick={() =>
                                            handleStartChapterClick({
                                                chapter_id: chapter.chapter_id,
                                                chapter_name: chapter.name,
                                            })
                                        }>Quick Assign</button>
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

export default UpcomingChapter;