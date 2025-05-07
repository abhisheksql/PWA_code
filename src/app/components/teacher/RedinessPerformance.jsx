'use client';
import '../../../../public/style/teacher.css';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import Select from 'react-select';
import { FiChevronDown } from 'react-icons/fi';
import { FaChevronRight } from "react-icons/fa6";
import Image from 'next/image';
import { useSearchParams, useRouter } from "next/navigation";
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import Issue from '../../../../public/images/teacher/Issue.svg';
import Left from '../../../../public/images/teacher/left.svg';
import ReportSearch from '../../../../public/images/teacher/Graysearch.svg';
import ReportChapter from '../../../../public/images/teacher/ReportChapter.svg';
import ReportFlag from '../../../../public/images/teacher/ReportFlag.svg';
import ReportBadge from '../../../../public/images/teacher/ReportBadge.svg';
import ReportBtn from '../../../../public/images/teacher/ReportBtn.svg';
import ReportVector from '../../../../public/images/teacher/ReportVector.svg';
import ReportGrow from '../../../../public/images/teacher/ReportGrow.svg';
import { Modal } from "react-bootstrap";
import { RxCross2 } from "react-icons/rx";
import ReportStudent from '../../../../public/images/teacher/ReportStudent.svg';
import Subtopicicon from '../../../../public/images/teacher/Subtopicicon.svg';
import StudentNotAttempt from '../../../../public/images/teacher/StudentNotAttempt.svg';
import ReportBlurMan from '../../../../public/images/teacher/ReportBlurMan.svg';
import ReportRedMan from '../../../../public/images/teacher/ReportRedMan.svg';


import ReportBoosterArrow1 from '../../../../public/images/teacher/ReportBoosterArrow1.png';
import ReportBoosterArrow2 from '../../../../public/images/teacher/ReportBoosterArrow2.png';
import BoosterUpArrow from '../../../../public/images/studentimg/BoosterUpArrow.svg';
import BoosterUpBigArrow from '../../../../public/images/studentimg/BoosterUpBigArrow.svg';
import Loader from "../../components/teacher/Loader";
import ReportShot from '../../../../public/images/teacher/ReportShot.svg';
import { FiChevronUp } from 'react-icons/fi';
import { getChapter_Crq_Performance, getChapterPerformance, getChapterPerformanceBreakdown, getChapterTopicPerformance, chapter_subtopic_student_attempts, chapter_student_performance_breakdown } from '../../api/teacherAPI';
import ClassDropdown from "./ClassDropdown";
import { set } from 'date-fns';


const RedinessPerformance = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("subtopic");
    const [selectedClass, setSelectedClass] = useState(null);
    const [performanceData, setPerformanceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [subTopicPopup, setSubTopicPopup] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    const [class_id, setClassId] = useState(null);
    const [course_id, setCourseId] = useState(null);
    const [chapter_id, setChapterId] = useState(null);
    const [grade, setGrade] = useState(null);
    const [AccuracyPopup, setAccuracyPopup] = useState(false);
    const [TopicAccuracyPopup, setTopicAccuracyPopup] = useState(null);
    const [popupSource, setPopupSource] = useState(null);
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [isStudentPopupOpen, setStudentPopupOpen] = useState(false);
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const tooltipRef = useRef(null);
    const buttonRef = useRef(null);


    // Close the tooltip if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                tooltipRef.current && !tooltipRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)
            ) {
                setIsTooltipVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const [studentData, setStudentData] = useState({
        chapter_name: "",
        student_name: "",
        student_proficiency_level: {},
        completion: 0,
        accuracy: {},
        growth: 0,
        topics: [],
    });

    const handleClosePopup = () => {
        setPopupOpen(false);
        setSelectedSubtopic(null);
    };

    const handleCloseStudentPopup = () => {
        setStudentPopupOpen(false);
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const class_id2 = parseInt(searchParams.get('class_id'), 10);
        const course_id2 = parseInt(searchParams.get('course_id'), 10);
        const chapter_id2 = parseInt(searchParams.get('chapter_id'), 10);
        const grade2 = parseInt(searchParams.get('grade'), 10);
        const tab = searchParams.get('tab');
        const childtab = searchParams.get('childtab');
        if (tab) {
            setSelectedChapter(tab)
        }
        if (childtab) {
            setActiveTab(childtab)
        }

        if (class_id2 && course_id2 && chapter_id2) {
            setClassId(class_id2);
            setCourseId(course_id2);
            setChapterId(chapter_id2);
            setGrade(grade2);
        }
    }, []);

    const assignments = [
        {
            title: "Area of General Quadrilaterals, trapezium and rhombus",
            assignedTopics: "4/8",
            completion: 24,
            proficiency: [32, 32, 32, 32]
        },
        {
            title: "Basic Geometry",
            assignedTopics: "5/8",
            completion: 40,
            proficiency: [20, 30, 25, 25]
        },
        {
            title: "Algebra Basics",
            assignedTopics: "6/8",
            completion: 50,
            proficiency: [35, 25, 20, 20]
        },
        {
            title: "Understanding Elementary Shapes ",
            assignedTopics: "4/8",
            completion: 24,
            proficiency: [32, 32, 32, 32]
        },
        {
            title: "Basic Geometry",
            assignedTopics: "5/8",
            completion: 40,
            proficiency: [20, 30, 25, 25]
        },
        {
            title: "Algebra Basics",
            assignedTopics: "6/8",
            completion: 50,
            proficiency: [35, 25, 20, 20]
        },
    ];


    const customStyles = {
        control: (base) => ({
            ...base,
            border: '1px solid #6166AE',
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            padding: '5px',
            cursor: 'pointer',
            '&:hover': {
                borderColor: '#6166AE',
            },
        }),

        valueContainer: (base) => ({
            ...base,
            padding: '5px 15px',
        }),
        placeholder: (base) => ({
            ...base,
            color: '#949494',
            fontSize: '16px',
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
        }),
        singleValue: (base) => ({
            ...base,
            color: '#3B3B3B',
            fontSize: '16px',
        }),
        dropdownIndicator: (base) => ({
            ...base,
            color: '#6166AE',
        }),
        indicatorSeparator: () => ({
            display: 'none',
        }),

        option: (styles, { isSelected, isFocused }) => ({
            ...styles,
            backgroundColor: isSelected
                ? '#6166AE26'
                : isFocused
                    ? 'rgba(246, 246, 246, 1)'
                    : 'white',
            color: isSelected ? '#6166AE' : '#000',
            cursor: 'pointer',
            ':hover': {
                backgroundColor: '#6166AE26',
                color: '#6166AE',
            },
        }),

    };
    const handleDropdownChange = (selectedOption) => {
        setSelectedClass(selectedOption);
    };


    const [selectedChapter, setSelectedChapter] = useState("readiness");
    const handleChapterSelection = (chapter) => {
        setSelectedChapter(chapter);
    };

    const handleClassSelect = (newSectionId, newCourseId, selectedOption) => {
        setClassId(newSectionId);
        setCourseId(newCourseId);
        setSelectedClass(selectedOption);
    };

    useEffect(() => {
        setIsLoader(true);
        if (class_id === null || course_id === null || chapter_id === null) return;

        const fetchData = async () => {
            try {
                setLoading(true); // Set loading before fetching data
                let response;
                if (selectedChapter === "readiness") {
                    response = await getChapter_Crq_Performance(class_id, course_id, chapter_id);
                } else if (selectedChapter === "performance") {
                    response = await getChapterPerformance(class_id, course_id, chapter_id);
                }
                console.log(`API Response for ${selectedChapter}:`, response);
                setPerformanceData(response?.data || null);
            } catch (error) {
                console.error(`Error fetching ${selectedChapter} data:`, error);
            } finally {
                setIsLoader(false);
            }
        };

        fetchData();
    }, [class_id, course_id, chapter_id, selectedChapter]); // ✅ Added selectedChapter as a dependency

    const { chapter_name, chapter_proficiency_level, completion, accuracy, sub_topics = [], topics = [], students, non_attempted_students } = performanceData || {};
    const displayedTopics = selectedChapter === "readiness" ? sub_topics : topics;

    const [progressData, setProgressData] = useState([]);

    // Category to Color Mapping
    const categoryColorMap = {
        proficient: "Proficient",
        critical: "Critical",
        developing: "Developing",
        unattempted: "Unattempted",
        mastery: "Mastery"
    };

    const [topicPerformance, setTopicPerformance] = useState(null);
    const [studentsNeedingAttention, setStudentsNeedingAttention] = useState([]);
    const [studentsDoingWell, setStudentsDoingWell] = useState([]);
    const [TopicAccuracy, setTopicAccuracy] = useState(null);
    const [popuptype , setPopuptype] = useState(null);

    const handleTopicSelect = async (class_id, course_id, chapter_id, lu_id, type) => {
        setIsLoader(true);
        if (selectedChapter === "readiness") {
            setSubTopicPopup(true);
            setPopuptype(type);
            try {
                const response = await getChapterPerformanceBreakdown(class_id, course_id, chapter_id, lu_id, type);

                if (response?.status === "success" && Array.isArray(response.data)) {
                    // Transform API response to match `progressData` format
                    const updatedProgressData = response.data.map(student => ({
                        status: student.category.charAt(0).toUpperCase() + student.category.slice(1), // Capitalize first letter
                        color: categoryColorMap[student.category] || "Unknown", // Map category to color
                        student_name: (type == 'topic') ? student.student_name : student.subtopic_name, // Add student name
                        subtopic_name: (type == 'topic') ? student.subtopic_name : student.student_name,// Include subtopic name
                    }));

                    setProgressData(updatedProgressData);
                }
            } catch (error) {
                console.error("Error fetching progress data:", error);
            } finally {
                setIsLoader(false);
            }
        } else {
            setPopupOpen(true);

            try {
                const response = await getChapterTopicPerformance(class_id, course_id, chapter_id, lu_id);

                if (response?.status === "success" && response.data) {
                    const data = response.data;

                    // Process students needing attention
                    const attentionStudents = {
                        not_attempted: data.students_attempts.not_attempted,
                        critical: data.students_attempts.critical,
                        developing: data.students_attempts.developing,
                    };

                    // Process students doing well
                    const wellPerformingStudents = {
                        proficient: data.students_attempts.proficient,
                        master: data.students_attempts.master,
                    };

                    setTopicPerformance(data);
                    setStudentsNeedingAttention(attentionStudents);
                    setStudentsDoingWell(wellPerformingStudents);
                    setTopicAccuracy(data.accuracy);
                }
            } catch (error) {
                console.error("Error fetching topic performance:", error);
            } finally {
                setIsLoader(false);
            }
        }
    };

    const handleStudentClick = async (class_id, course_id, chapter_id, student_id) => {
        setIsLoader(true);
        if (selectedChapter === "readiness") {
        } else {
            setStudentPopupOpen(true);

            try {
                const response = await chapter_student_performance_breakdown(class_id, course_id, chapter_id, student_id);

                if (response?.status === "success" && response.data) {
                    // Destructure the response data for use in rendering
                    const { chapter_name, student_name, student_proficiency_level, completion, accuracy, growth, topics } = response.data;

                    // Render the content dynamically
                    setStudentData({
                        chapter_name,
                        student_name,
                        student_proficiency_level,
                        completion,
                        accuracy,
                        growth,
                        topics,
                    });
                    setTopicAccuracy(response.data.accuracy);
                }
            } catch (error) {
                console.error("Error fetching topic performance:", error);
            } finally {
                setIsLoader(false);
            }
        }
    };

    // Define category colors
    const studentCategoryColors = {
        not_attempted: { main: "#949494", even: "#EFEFEF" },
        critical: { main: "#E95436", even: "#FFE1DA" },
        developing: { main: "#FFCA28", even: "#FFF4D4" },
        master: { main: "#24AD60", even: "#BDE6CF" },
        proficient: { main: "#9DCA45", even: "#E2EFC7" },
    };

    const [selectedSubtopic, setSelectedSubtopic] = useState(null);


    const handleSubtopicClick = async (class_id, course_id, chapter_id, topic_id, lu_id) => {
        setIsLoader(true);

        // If the same subtopic is clicked, reset the data and show the topic data again
        if (selectedSubtopic === lu_id) {
            // Deselect the subtopic and reset the data to show topic data
            setSelectedSubtopic(null);
            setStudentsNeedingAttention({});
            setStudentsDoingWell({});
            setTopicPerformance(null); // Reset topic data if needed
            setTopicAccuracy(null);    // Reset accuracy if needed

            // Optionally, re-fetch topic data to ensure the latest data is displayed again
            try {
                const response = await getChapterTopicPerformance(class_id, course_id, chapter_id, topic_id);
                if (response?.status === "success" && response.data) {
                    const data = response.data;

                    // Process students needing attention
                    const attentionStudents = {
                        not_attempted: data.students_attempts.not_attempted,
                        critical: data.students_attempts.critical,
                        developing: data.students_attempts.developing,
                    };

                    // Process students doing well
                    const wellPerformingStudents = {
                        proficient: data.students_attempts.proficient,
                        master: data.students_attempts.master,
                    };

                    setTopicPerformance(data);
                    setStudentsNeedingAttention(attentionStudents);
                    setStudentsDoingWell(wellPerformingStudents);
                    setTopicAccuracy(data.accuracy);
                }
            } catch (error) {
                console.error("Error fetching topic performance:", error);
            } finally {
                setIsLoader(false);
            }

        } else {
            // If a new subtopic is clicked, proceed with fetching the subtopic data
            setSelectedSubtopic(lu_id); // Set selected subtopic

            try {
                const response = await chapter_subtopic_student_attempts(class_id, course_id, chapter_id, topic_id, lu_id);

                if (response?.status === "success" && response.data) {
                    const data = response.data;

                    // Process students needing attention
                    const attentionStudents = {
                        not_attempted: data.not_attempted || [],
                        critical: data.critical || [],
                        developing: data.developing || [],
                    };

                    // Process students doing well
                    const wellPerformingStudents = {
                        proficient: data.proficient || [],
                        master: [], // No "master" in the API response, keeping empty for consistency
                    };

                    setStudentsNeedingAttention(attentionStudents);
                    setStudentsDoingWell(wellPerformingStudents);
                }
            } catch (error) {
                console.error("Error fetching subtopic student attempts:", error);
            } finally {
                setIsLoader(false);
            }
        }
    };



    // const [toggleState, setToggleState] = useState({});

    // const toggleSubtopic = (index) => {
    //     setToggleState(prevState => ({
    //         ...prevState,
    //         [index]: !prevState[index]
    //     }));
    // };

    const [activeSubtopicId, setActiveSubtopicId] = useState(null);

    const toggleSubtopic = (id) => {
        setActiveSubtopicId(prevId => (prevId === id ? null : id));
    };


    // const SubtopicBox = ({ status, title, index, toggleState, toggleSubtopic, paaFeedback }) => {
    // const SubtopicBox = ({ status, title, id, toggleState, toggleSubtopic, paaFeedback }) => {
    const SubtopicBox = ({ status, title, id, activeSubtopicId, toggleSubtopic, paaFeedback }) => {
        return (
            <div className={`BoosterReportsubtopic ${status.toLowerCase()}`} style={{ marginBottom: '10px', cursor: 'pointer' }} 
            onClick={status.toLowerCase() !== 'unattempted' ? () => toggleSubtopic(id) : null}
            // onClick={() => toggleSubtopic(id)}
            >
                <div className="dfa g5" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="subtopic-line" style={{ height: '50px' }}></span>
                        <p className="df g5">
                            <span style={{ fontSize: '14px' }}>{title}</span>

                            {/* <span className={`status-badge ${status.toLowerCase()}`}>{status}</span> */}
                            <span className={`status-badge ${status.toLowerCase()}`}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                        </p>
                    </div>

                    {status.toLowerCase() !== 'unattempted' && (
                    <div
                        className="subtopic-toggle-icon"
                        style={{ cursor: 'pointer', fontSize: '24px' }}
                    // onClick={() => toggleSubtopic(index)}
                    // onClick={() => toggleSubtopic(id)}
                    >
                        {/* {toggleState[index] ? <FiChevronUp /> : <FiChevronDown />} */}
                        {activeSubtopicId === id ? <FiChevronUp /> : <FiChevronDown />}

                    </div>
                    )}
                </div>

                {/* {toggleState[id] && ( */}
                {activeSubtopicId === id && (

                    <div className="subtopic-content" style={{ gap: '10px' }}>
                        {paaFeedback?.map((feedback, feedbackIndex) => (
                            <div key={feedbackIndex} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {/* Parent Learning Unit */}
                                <div className="d-flex feedback-needscard1">
                                    <div className="flexarrow" >
                                        {/* <Image src={ReportBoosterArrow1} alt="Arrow Icon" width={30} height={30} /> */}
                                    </div>
                                    <div className="booster-feedback-topcard1">
                                        <div className="dfac1">
                                            {/* {feedback?.tag && (
                                                <button className={feedback.tag === "reportBtnProficient" ? "reportBtnProficient" : "reportBtnNeedspractice"}>
                                                    {feedback.tag}
                                                </button>
                                            )} */}
                                            {feedback?.tag && (
                                                <button className={feedback.tag === "Proficient" ? "reportBtnProficient" : feedback.tag === "Need Practice" ? "reportBtnNeedspractice" : ""}>
                                                    {feedback.tag}
                                                </button>
                                            )}
                                            <p className="topcard-txt">{feedback.lu_name}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Child Learning Units */}
                                {Array.isArray(feedback.child) &&
                                    feedback.child.map((child, childIndex) => (

                                        <div key={childIndex} >
                                            {/* <div className="d-flex feedback-needscard1">
                                                <div className="flexarrow" style={{ top: "20px", left: "10px" }}>
                                                    <Image src={ReportBoosterArrow1} alt="Big Arrow Icon" width={50} height={50} />
                                                </div>
                                                <div className="booster-feedback-topcard2">
                                                    <div className="dfac1">

                                                        <button className='reportBtnNeedspractice'>
                                                            Needs practice
                                                        </button>
                                                        <p className="topcard-txt">{child.lu_name}</p>
                                                    </div>
                                                </div>
                                            </div> */}


                                            {childIndex == 0 && (
                                                <div className="d-flex feedback-needscard1">
                                                    <div className="flexarrow" style={{ top: "-10px", left: "5px" }} >
                                                        <Image src={BoosterUpArrow} alt="Coin Icon" width={70} height={70} />
                                                    </div>
                                                    <div
                                                        className={
                                                            {
                                                                0: "booster-feedback-topcard3",
                                                                1: "booster-feedback-topcard4",
                                                                2: "booster-feedback-topcard5",
                                                            }[childIndex] || ""
                                                        }
                                                    >
                                                        <div className="dfac1">
                                                        {child?.tag && (
                                                            <button className={child.tag === "Proficient" ? "reportBtnProficient" : child.tag === "Need Practice" ? "reportBtnNeedspractice" : ""}>
                                                                {child.tag}
                                                            </button>
                                                        )}
                                                            <p className="topcard-txt">{child.lu_name}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {childIndex > 0 && (
                                                <div className="d-flex feedback-needscard1">
                                                    <div className="flexarrow" style={{ top: "-100px", left: "9px", }}>
                                                        <Image src={BoosterUpBigArrow} alt="Coin Icon" width={70} height={150} />
                                                    </div>

                                                    <div className="booster-feedback-topcard3">
                                                        <div className="dfac1">
                                                        {child?.tag && (
                                                            <button className={child.tag === "Proficient" ? "reportBtnProficient" : child.tag === "Need Practice" ? "reportBtnNeedspractice" : ""}>
                                                                {child.tag}
                                                            </button>
                                                        )}
                                                            <p className="topcard-txt">{child.lu_name}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Grandchild Learning Units */}
                                            {Array.isArray(child.child) &&
                                                child.child.map((grandchild, grandchildIndex) => (
                                                    <div key={grandchildIndex} style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '10px 0px' }}>

                                                        {grandchildIndex == 0 && (
                                                            <div className="d-flex feedback-needscard1">
                                                                <div className="flexarrow" style={{ top: "-10px", left: "5px" }} >
                                                                    <Image src={BoosterUpArrow} alt="Coin Icon" width={70} height={70} />
                                                                </div>
                                                                <div
                                                                    className={
                                                                        {
                                                                            0: "booster-feedback-topcard4",
                                                                            1: "booster-feedback-topcard5",
                                                                            2: "booster-feedback-topcard6",
                                                                        }[grandchildIndex] || ""
                                                                    }
                                                                >
                                                                    <div className="dfac1">
                                                                    {grandchild?.tag && (
                                                                        <button className={grandchild.tag === "Proficient" ? "reportBtnProficient" : grandchild.tag === "Need Practice" ? "reportBtnNeedspractice" : ""}>
                                                                            {grandchild.tag}
                                                                        </button>
                                                                    )}
                                                                        <p className="topcard-txt">
                                                                            {grandchild.lu_name}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {grandchildIndex > 0 && (
                                                            <div className="d-flex feedback-needscard1">
                                                                <div className="flexarrow" style={{ top: "-100px", left: "9px" }}>
                                                                    <Image src={BoosterUpBigArrow} alt="Coin Icon" width={70} height={150} />
                                                                </div>
                                                                <div className="booster-feedback-topcard4">
                                                                    <div className="dfac1">
                                                                        {grandchild?.tag && (
                                                                            <button className={grandchild.tag === "Proficient" ? "reportBtnProficient" : grandchild.tag === "Need Practice" ? "reportBtnNeedspractice" : ""}>
                                                                                {grandchild.tag}
                                                                            </button>
                                                                        )}
                                                                        <p className="topcard-txt">
                                                                            {grandchild.lu_name}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Nested Sub-Children */}
                                                        {Array.isArray(grandchild.child) &&
                                                            grandchild.child.map((subchild, subIndex) => (
                                                                <div key={subIndex}  >

                                                                    {/* <div className="flexarrow" style={{ top: "-110px", left: "90px" }}>
                                                                        <Image src={BoosterUpBigArrow} alt="Big Arrow Icon" width={50} height={50} />
                                                                    </div>
                                                                    <div className="booster-feedback-topcard4">
                                                                        <div className="dfac1">
                                                                            <button className='reportBtnNeedspractice'>
                                                                                Needs practice
                                                                            </button>
                                                                            <p className="topcard-txt">{subchild.lu_name}</p>
                                                                        </div>
                                                                    </div> */}

                                                                    {subIndex == 0 && (
                                                                        <div className="d-flex feedback-needscard1">
                                                                            <div className="flexarrow" style={{ top: "-10px", left: "5px" }} >
                                                                                <Image src={BoosterUpArrow} alt="Coin Icon" width={70} height={70} />
                                                                            </div>
                                                                            <div
                                                                                className={
                                                                                    {
                                                                                        0: "booster-feedback-topcard5",
                                                                                        1: "booster-feedback-topcard6",
                                                                                        2: "booster-feedback-topcard7",
                                                                                    }[subIndex] || ""
                                                                                }
                                                                            >
                                                                                <div className="dfac1">
                                                                                    <p className="topcard-txt">
                                                                                        {subchild.lu_name}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {subIndex > 0 && (
                                                                        <div className="d-flex feedback-needscard1">
                                                                            <div className="flexarrow" style={{ top: "-100px", left: "9px" }}>
                                                                                <Image src={BoosterUpBigArrow} alt="Coin Icon" width={70} height={150} />
                                                                            </div>
                                                                            <div className="booster-feedback-topcard3">
                                                                                <div className="dfac1">
                                                                                    <p className="topcard-txt">
                                                                                        {subchild.lu_name}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                            ))}
                                                    </div>
                                                ))}
                                        </div>
                                    ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };




    const subtopics = [
        { title: "Numerical expansion of whole numbers", status: "Developing" },
        { title: "Understanding fractions", status: "Critical" },
        { title: "Basic Algebra", status: "Mastery" },
        { title: "Advanced Equations", status: "Proficient" }
    ];



    const feedback = [
        {
            lu_id: "LU000971",
            lu_name: "Child 1",
            tag: null,
            child: [
                {
                    lu_id: "CH0015",
                    lu_name: "  Child 1 1",
                    tag: null,
                    level: 1,
                    child: []
                },
                {
                    lu_id: "CH001",
                    lu_name: "Child 1 2",
                    tag: null,
                    child: [
                        {
                            lu_id: "CH0015",
                            lu_name: " Child 1 2 1",
                            tag: null,
                            level: 1,
                        },
                        {
                            lu_id: "CH0015",
                            lu_name: "Child 1 2 2",
                            tag: null,
                            level: 1,
                            child: [
                                {
                                    lu_id: "CH0015",
                                    lu_name: " Child 1 2 2 1",
                                    tag: null,
                                    level: 1,
                                },
                            ]
                        },
                    ],
                }
            ],
        },
    ];

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredDisplayedTopics, setFilteredDisplayedTopics] = useState(displayedTopics);
    const [filteredStudents, setFilteredStudents] = useState(students);


    // Filtered Chapters & Students
    useEffect(() => {
        // Filtered Topics
        const searchFilteredTopics = displayedTopics.filter((topic) => {
            const nameToSearch = selectedChapter === "readiness" ? topic.subtopic_name : topic.topic_name;
            return nameToSearch.toLowerCase().includes(searchQuery.toLowerCase());
        });

        // Filtered Students
        const searchFilteredStudents = students?.filter((student) =>
            student.student_name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Only update the state if filtered data has changed
        if (JSON.stringify(filteredDisplayedTopics) !== JSON.stringify(searchFilteredTopics)) {
            setFilteredDisplayedTopics(searchFilteredTopics);
        }

        if (JSON.stringify(filteredStudents) !== JSON.stringify(searchFilteredStudents)) {
            setFilteredStudents(searchFilteredStudents);
        }

    }, [searchQuery, displayedTopics, students, selectedChapter]);

    // Options to display in the tooltip
    const options = [
        { id: 'badged-first', label: 'Badged first' },
        { id: 'flagged-first', label: 'Flagged first' },
        { id: 'proficiency-high-to-low', label: 'Proficiency - High to Low' },
        { id: 'proficiency-low-to-high', label: 'Proficiency - Low to High' },
        { id: 'completion-high-to-low', label: 'Completion - High to Low' },
        { id: 'completion-low-to-high', label: 'Completion - Low to High' },
    ];

    const handleTooltipToggle = () => {
        setIsTooltipVisible(!isTooltipVisible);
    };

    const handleSelectOption = (option) => {
        setSelectedOption(option);
        setIsTooltipVisible(false); // Close the tooltip after selecting
        sortData(option);
    };

    const sortData = (option) => {
        let sortedTopics = [...filteredDisplayedTopics];
        let sortedStudentsList = [...filteredStudents];

        switch (option) {
            case 'badged-first':
                sortedTopics.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
                sortedStudentsList.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
                break;

            case 'flagged-first':
                sortedTopics.sort((a, b) => (b.flag ? 1 : 0) - (a.flag ? 1 : 0));
                sortedStudentsList.sort((a, b) => (b.flag ? 1 : 0) - (a.flag ? 1 : 0));
                break;

            case 'proficiency-high-to-low':
                sortedTopics.sort((a, b) => {
                    const levelA = selectedChapter === "readiness" ? a.subtopic_proficiency_level : a.topic_proficiency_level;
                    const levelB = selectedChapter === "readiness" ? b.subtopic_proficiency_level : b.topic_proficiency_level;
                    return (levelB.proficiency || 0) - (levelA.proficiency || 0);
                });
                sortedStudentsList.sort((a, b) => {
                    const levelA = a.student_proficiency_level;
                    const levelB = b.student_proficiency_level;
                    return (levelB.proficiency || 0) - (levelA.proficiency || 0);
                });
                break;

            case 'proficiency-low-to-high':
                sortedTopics.sort((a, b) => {
                    const levelA = selectedChapter === "readiness" ? a.subtopic_proficiency_level : a.topic_proficiency_level;
                    const levelB = selectedChapter === "readiness" ? b.subtopic_proficiency_level : b.topic_proficiency_level;
                    return (levelA.proficiency || 0) - (levelB.proficiency || 0);
                });
                sortedStudentsList.sort((a, b) => {
                    const levelA = a.student_proficiency_level;
                    const levelB = b.student_proficiency_level;
                    return (levelA.proficiency || 0) - (levelB.proficiency || 0);
                });
                break;

            case 'completion-high-to-low':
                sortedTopics.sort((a, b) => (b.completion || 0) - (a.completion || 0));
                sortedStudentsList.sort((a, b) => (b.completion || 0) - (a.completion || 0));
                break;

            case 'completion-low-to-high':
                console.log('zee  - ', option);
                sortedTopics.sort((a, b) => (a.completion || 0) - (b.completion || 0));
                sortedStudentsList.sort((a, b) => (a.completion || 0) - (b.completion || 0));
                break;

            default:
                break;
        }
        console.log('sortedTopics - ', option);
        // Update the sorted data
        setFilteredDisplayedTopics(sortedTopics);
        setFilteredStudents(sortedStudentsList);
    };



    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            if (filteredDisplayedTopics && filteredDisplayedTopics.length > 0 && filteredStudents && filteredStudents.length > 0) {
                sortData('completion-high-to-low');
                setSelectedOption('completion-high-to-low');
                isFirstRender.current = false; // Set to false after the first render
            }
        }
    }, [filteredDisplayedTopics, filteredStudents]);
    
    
    const searchParams = useSearchParams();
    const handleGoBack = () => {
        const from = searchParams.get('from');

        if (from === 'classdetails') {
          router.push(`/teacher/reports/classdetails?class_id=${class_id}&course_id=${course_id}`);
        } else {
          router.back();
        }
      };

    return (
        <div className="class-overview-container">
            <div className="class-overview-header">
                <div className="classheading" >
                    <span onClick={handleGoBack} style={{ cursor: 'pointer' }}>
                        <Image src={Left} alt="Back Icon" width={20} height={20} />
                    </span>
                    <h2>{chapter_name}</h2>
                </div>
                <div className="dropdown-container">
                    {grade != null && course_id != null && (
                        <ClassDropdown onClassChange={handleClassSelect} grade={grade} subject={course_id} />
                    )}
                </div>
            </div>
            <div className="gradetab-toggle mb30" style={{ justifyContent: 'flex-start' }}>
                <div className={`chapters ${selectedChapter === "readiness" ? "active" : ""}`} onClick={() => handleChapterSelection("readiness")} >
                    Chapter Readiness
                </div>
                <div className={`chapters ${selectedChapter === "performance" ? "active" : ""}`} onClick={() => handleChapterSelection("performance")}>
                    Chapter Performance
                </div>
            </div>


            <div className="reportpercent-main-container ">

                <div className="reportpercentbg1">
                    <div className='metric-title-container'>
                        <span className='metric-title'>Concept Proficiency Level</span>
                        <div className="tch_repo_tooltip-container">
                            <Image src={Issue} alt="Issue" width={20} height={20} />
                            <div className="tch_repo_tooltip" style={{ left: '-80px', width: '250px' }}>
                                <h3>Proficiency</h3>
                                {selectedChapter === "readiness" && (
                                    <>
                                        <p style={{ fontSize: '11px' }}>Represents the distribution across different proficiency levels. Eg. -</p>
                                        <ProgressBar style={{ height: '15px', borderRadius: '5px', margin: '5px 0px' }}>
                                            <ProgressBar now={22} key={2} style={{ backgroundColor: '#9DCA45' }} label={<span style={{ fontSize: '7px', fontWeight: '700' }}>22%</span>} />
                                            <ProgressBar now={14} key={3} style={{ backgroundColor: '#FFCA28' }} label={<span style={{ fontSize: '7px', fontWeight: '700' }}>14%</span>} />
                                            <ProgressBar now={64} key={4} style={{ backgroundColor: '#FD6845' }} label={<span style={{ fontSize: '7px', fontWeight: '700' }}>64%</span>} />
                                        </ProgressBar>
                                        <p style={{ fontSize: '11px' }}>The above figure means out of total attempted units, 22% are Proficient, 14% are Developing and 64% are in Critical zone.</p>
                                        <p style={{ fontSize: '11px' }}> <b>Note:</b> Proficiency may not total 100% due to rounding.</p>
                                    </>
                                )}
                                {selectedChapter === "performance" && (
                                    <>
                                        <p style={{ fontSize: '11px' }}>Represents the distribution across different proficiency levels. Eg. -</p>
                                        <ProgressBar style={{ height: '15px', borderRadius: '5px', margin: '5px 0px' }}>
                                            <ProgressBar now={14} key={1} style={{ backgroundColor: '#24AD60' }} label={<span style={{ fontSize: '7px', fontWeight: '700' }}>14%</span>} />
                                            <ProgressBar now={7} key={2} style={{ backgroundColor: '#9DCA45' }} label={<span style={{ fontSize: '7px', fontWeight: '700' }}>7%</span>} />
                                            <ProgressBar now={15} key={3} style={{ backgroundColor: '#FFCA28' }} label={<span style={{ fontSize: '7px', fontWeight: '700' }}>15%</span>} />
                                            <ProgressBar now={64} key={4} style={{ backgroundColor: '#FD6845' }} label={<span style={{ fontSize: '7px', fontWeight: '700' }}>64%</span>} />
                                        </ProgressBar>
                                        <p style={{ fontSize: '11px' }}>The above figure means out of total attempted units, 14% are Mastered, 8% are Proficient, 15% are Developing and 64% are in Critical zone.</p>
                                        <p style={{ fontSize: '11px' }}> <b>Note:</b> Proficiency may not total 100% due to rounding.</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '100%' }}>
                        <ProgressBar style={{ height: '40px', borderRadius: '10px' }}>
                            {selectedChapter === "performance" && (
                                <ProgressBar now={chapter_proficiency_level?.master * 100} key={1} style={{ backgroundColor: '#24AD60' }} label={<span style={{ fontSize: '14px', fontWeight: '700' }}>{Math.floor(chapter_proficiency_level?.master * 100)}%</span>} />
                            )}
                            <ProgressBar now={chapter_proficiency_level?.proficiency * 100} style={{ backgroundColor: '#9DCA45' }} label={<span style={{ fontSize: '14px', fontWeight: '700' }}>{Math.floor(chapter_proficiency_level?.proficiency * 100)}%</span>} />
                            <ProgressBar now={chapter_proficiency_level?.developing * 100} style={{ backgroundColor: '#FFCA28' }} label={<span style={{ fontSize: '14px', fontWeight: '700' }}>{Math.floor(chapter_proficiency_level?.developing * 100)}%</span>} />
                            <ProgressBar now={chapter_proficiency_level?.critical * 100} style={{ backgroundColor: '#FD6845' }} label={<span style={{ fontSize: '14px', fontWeight: '700' }}>{Math.floor(chapter_proficiency_level?.critical * 100)}%</span>} />
                        </ProgressBar>
                    </div>

                    <div className="Report-chart-Legend">
                        {selectedChapter === "performance" && (
                            <p style={{ fontSize: '12px' }}><span style={{ backgroundColor: '#24AD60' }}></span>Master</p>
                        )}
                        <p style={{ fontSize: '12px' }}><span style={{ backgroundColor: '#9DCA45' }}></span> Proficient</p>
                        <p style={{ fontSize: '12px' }}><span style={{ backgroundColor: '#FFCA28' }}></span> Developing</p>
                        <p style={{ fontSize: '12px' }}><span style={{ backgroundColor: '#FD6845' }}></span> Critical</p>
                    </div>
                </div>

                <div className="reportpercent-two-container" >

                    <div className="reportpercentbg2" >
                        <div className='metric-title-container'>
                            <span className='metric-title'>Completion</span>
                            <div className="tch_repo_tooltip-container">
                                <Image src={Issue} alt="Issue" width={20} height={20} />
                                <div className="tch_repo_tooltip">
                                    <h3>Completion</h3>
                                    <p>% of students who attempted the quiz out of total assigned students</p>
                                </div>
                            </div>
                        </div>
                        <div className='dfjs reportmainpercent'>
                            <p style={{ color: '#3EA8FF' }}>{(completion * 100).toFixed(0)}%</p>
                            <div style={{ width: 50 }}>

                                <CircularProgressbar value={completion * 100} strokeWidth={25} styles={buildStyles({
                                    textSize: '24px',
                                    pathColor: '#3EA8FF',
                                    textColor: '#3EA8FF',
                                    trailColor: '#DAE1E8',
                                })} />
                            </div>
                        </div>
                    </div>

                    <div className="reportpercentbg3" onClick={() => setAccuracyPopup(true)}>
                        <div className='metric-title-container' >
                            <span className='metric-title'>Accuracy</span>
                            <div className="tch_repo_tooltip-container">
                                <Image src={Issue} alt="Issue" width={20} height={20} />
                                <div className="tch_repo_tooltip">
                                    <h3>Accuracy</h3>
                                    {selectedChapter === "readiness" && (
                                        <p>% of correct attempts in Chapter Readiness Quiz out of total attempts in it.</p>
                                    )}
                                    {selectedChapter === "performance" && (
                                        <p>% of correct topic attempts out of total attempts</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='dfjs reportmainpercent'>
                            <p style={{ color: '#1C4CC3' }}>{((accuracy?.overall_accuracy || 0) * 100).toFixed(0)}%</p>
                            <Image src={ReportVector} alt="ReportVector" width={50} height={50} />
                        </div>
                    </div>
                </div>
            </div>

            <div className='report-filters-tabs'>
                <div className="toggle-buttons" style={{ borderRadius: '20px' }}>
                    <button
                        onClick={() => {
                            setActiveTab("subtopic");
                            setSearchQuery("");
                        }}
                        className={`toggle-button ${activeTab === "subtopic" ? "active" : ""}`}
                        style={{ borderRadius: '20px', padding: '10px 45px' }}
                    >
                        {selectedChapter === "readiness" ? "Sub Topics" : "Topics"} ({displayedTopics?.length})
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab("student");
                            setSearchQuery("");
                        }}
                        className={`toggle-button ${activeTab === "student" ? "active" : ""}`}
                        style={{ borderRadius: '20px', padding: '10px 45px' }}
                    >
                        Students ({students?.length})
                    </button>
                </div>


                <div className='report-filters-tabs-right'>

                <div className="chart-Legend">
                    <div className="report-search-container">
                        <div className="report-search-icon"><Image src={ReportSearch} alt="Issue" width={20} height={20} /></div>
                        <input type="text" className="report-search-input" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>

                    <div style={{ fontSize: '12px', cursor: 'pointer' }} onClick={handleTooltipToggle}>
                        <div className="tch_repo_tooltip-container-click" style={{ marginRight: '5px' }} ref={buttonRef}>
                            <Image src={ReportShot}
                                alt="Issue"
                                width={15}
                                height={15}
                            />

                            {isTooltipVisible && (
                                <div className="tch_repo_tooltip-click" ref={tooltipRef}>
                                    <div
                                        className="chart-Legend"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        {options.map((option, index) => (
                                            <p
                                                key={index}
                                                id={option.id}
                                                className={selectedOption === option.id ? 'active' : ''}
                                                style={{ fontSize: '13px', cursor: 'pointer', padding: '8px', width: '100%', margin: '0px' }}
                                                onClick={() => handleSelectOption(option.id)}
                                            >
                                                {option.label}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        Sort by
                    </div>
                </div>

                    {/* button will not click if non_attempted_students is 0  als show 0 */}

                    <button className="reportNotAttempt" onClick={() => setShowPopup(true)} disabled={non_attempted_students?.length === 0}>Not Attempted ({non_attempted_students?.length || 0}) <FaChevronRight /> </button>
                    {/* <button className="reportNotAttempt" onClick={() => setShowPopup(true)}>Not Attempted ({non_attempted_students?.length}) <FaChevronRight /> </button> */}
                </div>
            </div>
            <div>
                {activeTab === "subtopic" ? (
                    filteredDisplayedTopics?.map((sub, index) => {
                        const level = selectedChapter === "readiness" ? sub.subtopic_proficiency_level : sub.topic_proficiency_level;
                        const name = selectedChapter === "readiness" ? sub.subtopic_name : sub.topic_name;
                        const topicid = selectedChapter === "readiness" ? sub.subtopic_id : sub.topic_id;

                        return (
                            <div
                                key={index}
                                className="chart-section topic-title mb20"
                                onClick={() => handleTopicSelect(class_id, course_id, chapter_id, topicid, 'topic')} // Call the function properly
                                style={{ cursor: "pointer" }}
                            >
                                <div className="assignment" style={{ width: '20%' }}>
                                    <p className="report-chapter-name" >{name}</p>
                                </div>

                                <div className='dfjs' style={{ gap: '10px', width: '15%' }}>

                                    <div className='textnone dfa' style={{ gap: '10px'}} >
                                        {(sub.flag || sub.badge) ? (
                                            <>
                                                {sub.flag && (
                                                    <div className="tch_repo_tooltip-container">
                                                        <Image src={ReportFlag} alt="Flag" width={20} height={20} />
                                                        <div className="tch_repo_tooltip">
                                                            <h3>Flag</h3>
                                                            <p>Areas/Students needing improvement</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {sub.badge && (
                                                    <div className="tch_repo_tooltip-container">
                                                        <Image src={ReportBadge} alt="Badge" width={20} height={20} />
                                                        <div className="tch_repo_tooltip">
                                                            <h3>Badges</h3>
                                                            <p>Areas/Students with excellent completion and proficiency</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div style={{ width: '20px', height: '20px' }} />
                                        )}

                                        <span className="subheading" style={{ fontSize: "12px" }}>Completion</span>
                                    </div>

                                    <div style={{ width: 40, height: 40 }}>
                                        <CircularProgressbar
                                            value={sub.completion !== null ? Math.floor(sub.completion * 100) : 0} // Default to 0 if null
                                            text={sub.completion !== null ? `${Math.floor(sub.completion * 100)}%` : "0%"}
                                            strokeWidth={10}
                                            styles={buildStyles({
                                                textSize: '24px',
                                                pathColor: `#6166AE`,
                                                textColor: '#6166AE',
                                                trailColor: '#E0E0E0',
                                            })}
                                        />
                                    </div>
                                </div>

                                <div style={{ width: '1.5px', height: '50px', backgroundColor: '#EDEDED', margin: 'auto 10px' }}></div>

                                <div className='df' style={{ width: '40%' }}>
                                    <p className="subheading" style={{ fontSize: "14px" }}>Proficiency</p>
                                    <div style={{ width: '100%' }}>
                                        <ProgressBar style={{ height: '20px', borderRadius: '5px' }}>
                                            {selectedChapter === "performance" && (
                                                <ProgressBar now={level?.master * 100} key={1} style={{ backgroundColor: '#24AD60' }} label={<span style={{ fontSize: '14px', fontWeight: '700' }}>{Math.floor(level?.master * 100)}%</span>} />
                                            )}
                                            <ProgressBar now={level?.proficiency * 100} style={{ backgroundColor: '#9DCA45' }} label={<span style={{ fontSize: '12px', fontWeight: '700' }}>{Math.floor(level?.proficiency * 100)}%</span>} />
                                            <ProgressBar now={level?.developing * 100} style={{ backgroundColor: '#FFCA28' }} label={<span style={{ fontSize: '12px', fontWeight: '700' }}>{Math.floor(level?.developing * 100)}%</span>} />
                                            <ProgressBar now={level?.critical * 100} style={{ backgroundColor: '#FD6845' }} label={<span style={{ fontSize: '12px', fontWeight: '700' }}>{Math.floor(level?.critical * 100)}%</span>} />
                                        </ProgressBar>
                                    </div>
                                </div>

                                <div style={{ width: '12%', marginTop: '25px' }}>
                                    <button className='viewReportBtn'>
                                        View Details
                                        <Image className='textnone'  src={ReportBtn} alt="Issue" width={20} height={20} />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    filteredStudents?.map((student, index) => (
                        <div
                            key={index}
                            className="chart-section topic-title mb20"
                            onClick={() => selectedChapter === "readiness"
                                ? handleTopicSelect(class_id, course_id, chapter_id, student.student_id)
                                : handleStudentClick(class_id, course_id, chapter_id, student.student_id)
                            }
                            style={{ cursor: "pointer" }}>
                            <div className="assignment" style={{ width: '20%' }}>
                                <p className="report-chapter-name">{student.student_name.charAt(0).toUpperCase() + student.student_name.slice(1)}</p>
                            </div>
                            <div className='dfjs' style={{ gap: '10px', width: '15%' }}>

                                <div className='textnone dfa' style={{ gap: '10px'}} >
                                    {(student.flag || student.badge) ? (
                                        <>
                                            {student.flag && (
                                                <div className="tch_repo_tooltip-container">
                                                    <Image src={ReportFlag} alt="Flag" width={20} height={20} />
                                                    <div className="tch_repo_tooltip">
                                                        <h3>Flag</h3>
                                                        <p>Areas/Students needing improvement</p>
                                                    </div>
                                                </div>
                                            )}
                                            {student.badge && (
                                                <div className="tch_repo_tooltip-container">
                                                    <Image src={ReportBadge} alt="Badge" width={20} height={20} />
                                                    <div className="tch_repo_tooltip">
                                                        <h3>Badges</h3>
                                                        <p>Areas/Students with excellent completion and proficiency</p>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div style={{ width: '20px', height: '20px' }} />
                                    )}

                                    <span className="subheading" style={{ fontSize: "12px" }}>Completion</span>
                                </div>

                                <div style={{ width: 40, height: 40 }}>
                                    <CircularProgressbar
                                        value={student.completion !== null ? Math.floor(student.completion * 100) : 0} // Default to 0 if null
                                        text={student.completion !== null ? `${Math.floor(student.completion * 100)}%` : "0%"}
                                        strokeWidth={10}
                                        styles={buildStyles({
                                            textSize: '24px',
                                            pathColor: `#6166AE`,
                                            textColor: '#6166AE',
                                            trailColor: '#E0E0E0',
                                        })}
                                    />
                                </div>
                            </div>

                            <div style={{ width: '1.5px', height: '50px', backgroundColor: '#EDEDED', margin: 'auto 10px' }}></div>

                            <div className='df' style={{ width: '40%' }}>
                                <p className="subheading" style={{ fontSize: "14px" }}>Proficiency</p>
                                <div style={{ width: '100%' }}>
                                    <ProgressBar style={{ height: '20px', borderRadius: '5px' }}>
                                        {selectedChapter === "performance" && (
                                            <ProgressBar now={student.student_proficiency_level?.master * 100} key={1} style={{ backgroundColor: '#24AD60' }} label={<span style={{ fontSize: '12px', fontWeight: '700' }}>{Math.floor(student.student_proficiency_level?.master * 100)}%</span>} />
                                        )}
                                        <ProgressBar now={student.student_proficiency_level.proficiency * 100} style={{ backgroundColor: '#9DCA45' }} label={<span style={{ fontSize: '12px', fontWeight: '700' }}>{Math.floor(student.student_proficiency_level.proficiency * 100)}%</span>} />
                                        <ProgressBar now={student.student_proficiency_level.developing * 100} style={{ backgroundColor: '#FFCA28' }} label={<span style={{ fontSize: '12px', fontWeight: '700' }}>{Math.floor(student.student_proficiency_level.developing * 100)}%</span>} />
                                        <ProgressBar now={student.student_proficiency_level.critical * 100} style={{ backgroundColor: '#FD6845' }} label={<span style={{ fontSize: '12px', fontWeight: '700' }}>{Math.floor(student.student_proficiency_level.critical * 100)}%</span>} />
                                    </ProgressBar>
                                </div>
                            </div>

                            <div style={{ width: '12%', marginTop: '25px' }}>
                                <button
                                    className='viewReportBtn'
                                    onClick={() => selectedChapter === "readiness"
                                        ? handleTopicSelect(class_id, course_id, chapter_id, student.student_id)
                                        : handleStudentClick(class_id, course_id, chapter_id, student.student_id)
                                    }
                                >
                                    View Details
                                    <Image className='textnone' src={ReportBtn} alt="Issue" width={20} height={20} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <Modal show={showPopup} onHide={() => setShowPopup(false)} centered>
                <div className="custom-modal tch-modal-content">

                    <div className="dfjs ">
                        <h3 className=" ">Students Not Attempted</h3>
                        <button
                            className="close-button"
                            onClick={() => setShowPopup(false)}
                        >
                            {" "}
                            <RxCross2 />{" "}
                        </button>
                    </div>

                    <div className="progress-list" style={{ marginTop: '20px' }}>
                        {non_attempted_students?.map((item, index) => (
                            <div key={index} className="progress-item">
                                <div className="progress-info" style={{ width: '80%' }}>
                                    <div style={{ height: '30px', width: '50px', marginLeft: '-5px' }}>
                                        <Image src={StudentNotAttempt} alt="book" width={40} height={40} />
                                    </div>
                                    <span className="ReportPopupTitle" style={{ textAlign: 'left' }}>{item}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>

            <Modal show={subTopicPopup} onHide={() => setSubTopicPopup(false)} centered>
                <div className="custom-modal tch-modal-content">

                    <div className="dfjs ">
                        <h3 className=" " style={{textAlign:'left'}}>{progressData[0]?.subtopic_name}</h3>
                        <button
                            className="close-button"
                            onClick={() => setSubTopicPopup(false)}
                        >
                            {" "}
                            <RxCross2 />{" "}
                        </button>
                    </div>

                    <div className="progress-list" style={{ marginTop: '20px' }}>
                        {progressData.map((item, index) => (
                            <div key={index} className="progress-item">
                                <div className="progress-info" style={{ width: '80%' }}>
                                    <div className='textnone progress-infoimage'>
                                        <Image src={popuptype === "topic" ? ReportStudent : Subtopicicon } alt="book" width={50} height={50} />
                                    </div>
                                    <span className="ReportPopupTitle" style={{ textAlign: 'left' }}>{item.student_name}</span>
                                </div>
                                <span className={`status-badge ${item.color.toLowerCase()}`}>{item.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>

            {isPopupOpen && (
                <div className="triangle-popup-overlay">
                    <div className="triangle-popup-box">


                        <div className="dfjs" style={{ marginBottom: "30px" }}>
                            <h3 className="dfa triangle-popup-heading">
                                {topicPerformance?.topic_name || "Topic Name"}

                                <div className="tch_repo_tooltip-container" style={{ marginLeft: '10px' }}>
                                    <Image src={Issue} alt="Issue" width={20} height={20} />
                                    <div className="tch_repo_tooltip" style={{ left: '100px', width: '250px' }}>
                                        <h3>Proficiency</h3>
                                        <p style={{ fontSize: '11px' }}>Represents the distribution across different proficiency levels. Eg. -</p>
                                        <ProgressBar style={{ height: '15px', borderRadius: '5px', margin: '5px 0px' }}>
                                            <ProgressBar now={14} key={1} style={{ backgroundColor: '#24AD60' }} label={<span style={{ fontSize: '7px', fontWeight: '700' }}>14%</span>} />
                                            <ProgressBar now={7} key={2} style={{ backgroundColor: '#9DCA45' }} label={<span style={{ fontSize: '7px', fontWeight: '700' }}>7%</span>} />
                                            <ProgressBar now={15} key={3} style={{ backgroundColor: '#FFCA28' }} label={<span style={{ fontSize: '7px', fontWeight: '700' }}>15%</span>} />
                                            <ProgressBar now={64} key={4} style={{ backgroundColor: '#FD6845' }} label={<span style={{ fontSize: '7px', fontWeight: '700' }}>64%</span>} />
                                        </ProgressBar>
                                        <p style={{ fontSize: '11px' }}>The above figure means out of total attempted units, 14% are Mastered, 8% are Proficient, 15% are Developing and 64% are in Critical zone.</p>
                                        <p style={{ fontSize: '11px' }}> <b>Note:</b> Proficiency may not total 100% due to rounding.</p>

                                        <div style={{ margin: '5px 0px' }}>
                                            <h3 style={{ margin: '0px' }}>Completion</h3>
                                            <p>% of units completed out of total assigned units</p>
                                        </div>
                                        <div style={{ margin: '5px 0px' }}>
                                            <h3 style={{ margin: '0px' }}>Accuracy</h3>
                                            <p>% of correct topic attempts out of total attempts in it
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </h3>
                            <button className="close-button" onClick={handleClosePopup}>
                                <RxCross2 />
                            </button>
                        </div>

                        {/* Overall Proficiency Level */}
                        <div className="reportpercent-main-container">

                            <div className="reportpercentbg1">
                                <div className='metric-title-container'>
                                    <span className='metric-title'>Topic Proficiency Level</span>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <ProgressBar style={{ height: "40px", borderRadius: "10px" }}>
                                        <ProgressBar now={topicPerformance?.topic_proficiency_level.master * 100} key={1} style={{ backgroundColor: '#24AD60' }} label={<span style={{ fontSize: '14px', fontWeight: '700' }}>
                                            {Math.floor(topicPerformance?.topic_proficiency_level.master * 100)}%</span>}
                                        />
                                        <ProgressBar now={topicPerformance?.topic_proficiency_level.proficiency * 100} key={1} style={{ backgroundColor: "#9DCA45" }}
                                            label={<span style={{ fontSize: '14px', fontWeight: '700' }}>
                                                {Math.floor(topicPerformance?.topic_proficiency_level.proficiency * 100)}%</span>}
                                        />
                                        <ProgressBar now={topicPerformance?.topic_proficiency_level.developing * 100} key={2} style={{ backgroundColor: "#FFCA28" }}
                                            label={<span style={{ fontSize: '14px', fontWeight: '700' }}>
                                                {Math.floor(topicPerformance?.topic_proficiency_level.developing * 100)}%</span>}
                                        />
                                        <ProgressBar now={topicPerformance?.topic_proficiency_level.critical * 100} key={3} style={{ backgroundColor: "#FD6845" }}
                                            label={<span style={{ fontSize: '14px', fontWeight: '700' }}>
                                                {Math.floor(topicPerformance?.topic_proficiency_level.critical * 100)}%</span>}
                                        />
                                    </ProgressBar>
                                </div>

                                <div className="Report-chart-Legend">
                                    <p style={{ fontSize: '12px' }}><span style={{ backgroundColor: '#24AD60' }}></span>Master</p>
                                    <p style={{ fontSize: '12px' }}><span style={{ backgroundColor: '#9DCA45' }}></span> Proficient</p>
                                    <p style={{ fontSize: '12px' }}><span style={{ backgroundColor: '#FFCA28' }}></span> Developing</p>
                                    <p style={{ fontSize: '12px' }}><span style={{ backgroundColor: '#FD6845' }}></span> Critical</p>
                                </div>
                            </div>


                            <div className="reportpercent-two-container" >

                                {/* Completion */}
                                <div className="reportpercentbg2" >
                                    <div className='metric-title-container' >
                                        <span className='metric-title'>Completion</span>
                                    </div>
                                    <div className='dfjs reportmainpercent'>
                                        <p style={{ color: '#3EA8FF' }}>{(topicPerformance?.completion * 100).toFixed(0)}% </p>
                                        <div style={{ width: 50 }}>
                                            <CircularProgressbar
                                                value={topicPerformance?.completion * 100}
                                                strokeWidth={25}
                                                styles={buildStyles({
                                                    pathColor: `#3EA8FF`,
                                                    textColor: '#3EA8FF',
                                                    trailColor: '#DAE1E8',
                                                })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="reportpercentbg3" onClick={() => setTopicAccuracyPopup(true)}>
                                    <div className='metric-title-container'>
                                        <span className='metric-title'>Accuracy</span>
                                    </div>
                                    <div className='dfjs reportmainpercent'>
                                        <p style={{ color: '#1C4CC3' }}>{(topicPerformance?.accuracy?.overall_accuracy * 100).toFixed(0)}% </p>
                                        <Image src={ReportVector} alt="ReportVector" width={50} height={50} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Subtopics */}
                        <div className="triangle-popup-subtopics mt20 mb20">
                            <h3 className="triangle-popup-heading" style={{ fontSize: '20px', marginBottom: '10px' }}>Subtopics ({topicPerformance?.subtopics.length || 0})</h3>
                            <div className="subtopic-container">
                                {topicPerformance?.subtopics.map((subtopic, index) => (
                                    <div key={index} className={`subtopic-box ${subtopic.completion === 1 ? "completed" : subtopic.completion === 0 ? "pending" : "default"} ${selectedSubtopic === subtopic.subtopic_id ? "subtopic-selected" : ""}`} onClick={() => handleSubtopicClick(class_id, course_id, chapter_id, topicPerformance.topic_id, subtopic.subtopic_id)} style={{ cursor: "pointer" }}>

                                        <p style={{ margin: '0px', display: 'flex', alignItems: 'center' }} ><span className="subtopic-line" style={{ backgroundColor: subtopic.flag ? 'red' : subtopic.badge ? 'green' : '' }}></span> {subtopic.subtopic_name}</p>

                                        {/* {subtopic.flag && <Image src={ReportFlag} alt="Flag" className="subtopic-icon" width={40} height={40} />} */}
                                        {subtopic.flag && (
                                            <div className="tch_repo_tooltip-container">
                                                <Image src={ReportFlag} alt="Flag" className="subtopic-icon" width={40} height={40} />
                                                <div className="tch_repo_tooltip">
                                                    <h3>Flag</h3>
                                                    <p>Areas/Students needing improvement</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* {subtopic.badge && <Image src={ReportBadge} alt="Badge" className="subtopic-icon" width={40} height={40} />} */}
                                        {subtopic.badge && (
                                            <div className="tch_repo_tooltip-container">
                                                <Image src={ReportBadge} alt="Badge" className="subtopic-icon" width={40} height={40} />
                                                <div className="tch_repo_tooltip">
                                                    <h3>Badges</h3>
                                                    <p>Areas/Students with excellent completion and proficiency</p>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Students Needing Attention */}
                        <div className="triangle-student-category">
                            <div style={{display:'flex' , }}>
                                <h3 className="triangle-popup-heading" style={{ fontSize: '20px', marginBottom: '10px' , width:'61%' }}>Students Needing Attention</h3>
                                <h3 className="triangle-popup-heading" style={{ fontSize: '20px', marginBottom: '10px' }}>Students Doing Well</h3>
                            </div>
                            <div className="triangle-student-group">
                                <>
                                {Object.keys(studentsNeedingAttention).map((key, index) => (
                                    <div key={index} className={`triangle-group`}>
                                        <h4 style={{ backgroundColor: studentCategoryColors[key]?.main || "#FF6868" }}>
                                            {key.replace("_", " ").toUpperCase()}
                                        </h4>
                                        {studentsNeedingAttention[key].map((student, i) => (
                                            <p
                                                key={i}
                                                style={{
                                                    backgroundColor: i % 2 != 0 ? studentCategoryColors[key]?.even : "#fff",
                                                }}
                                                className={i % 2 != 0 ? "even-row" : "odd-row"}
                                            >
                                                {student}
                                            </p>
                                        ))}
                                    </div>
                                ))}
                                </>

                                <>
                                {Object.keys(studentsDoingWell).filter((key) => !(selectedSubtopic && key === "master")).map((key, index) => (
                                    <div key={index} className={`triangle-group`}>
                                        <h4 style={{ backgroundColor: studentCategoryColors[key]?.main || "#9DCA45" }}>
                                            {key.replace("_", " ").toUpperCase()}
                                        </h4>
                                        {studentsDoingWell[key].map((student, i) => (
                                            <p
                                                key={i}
                                                style={{
                                                    backgroundColor: i % 2 != 0 ? studentCategoryColors[key]?.even : "#fff",
                                                }}
                                                className={i % 2 === 0 ? "even-row" : "odd-row"}
                                            >
                                                {student}
                                            </p>
                                        ))}
                                    </div>
                                ))}
                                </>
                            </div>
                        </div>

                        {/* Students Doing Well */}
                        {/* <div className="triangle-student-category">
                            <h3 className="triangle-popup-heading" style={{ fontSize: '20px', marginBottom: '10px' }}>Students Doing Well</h3>
                            <div className="triangle-student-group">
                            {Object.keys(studentsDoingWell).filter((key) => !(selectedSubtopic && key === "master")).map((key, index) => (
                                    <div key={index} className={`triangle-group ${key}`}>
                                        <h4 style={{ backgroundColor: studentCategoryColors[key]?.main || "#9DCA45" }}>
                                            {key.replace("_", " ").toUpperCase()}
                                        </h4>
                                        {studentsDoingWell[key].map((student, i) => (
                                            <p
                                                key={i}
                                                style={{
                                                    backgroundColor: i % 2 != 0 ? studentCategoryColors[key]?.even : "#fff",
                                                }}
                                                className={i % 2 === 0 ? "even-row" : "odd-row"}
                                            >
                                                {student}
                                            </p>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div> */}
                    </div>
                </div>
            )}


            {isStudentPopupOpen && (

                <div className="triangle-popup-overlay">
                    <div className="triangle-popup-box">

                        <div className="dfjs " style={{ marginBottom: '30px' }}>
                            <h3 className="dfa triangle-popup-heading" style={{ gap: '10px' }}>
                                {studentData.student_name.charAt(0).toUpperCase() + studentData.student_name.slice(1)}
                                {/* {studentData.student_name} | <span style={{fontSize:"16px"}}>{studentData.chapter_name}</span> */}

                                <div className="tch_repo_tooltip-container" style={{ marginLeft: '10px' }}>
                                    <Image src={Issue} alt="Issue" width={20} height={20} />
                                    <div className="tch_repo_tooltip" style={{ left: '100px', width: '250px' }}>
                                        <h3>Proficiency</h3>
                                        <p style={{ fontSize: '11px' }}>Represents the distribution across different proficiency levels. Eg. -</p>
                                        <ProgressBar style={{ height: '15px', borderRadius: '5px', margin: '5px 0px' }}>
                                            <ProgressBar now={14} key={1} style={{ backgroundColor: '#24AD60' }} label={<span style={{ fontSize: '7px', fontWeight: '700' }}>14%</span>} />
                                            <ProgressBar now={7} key={2} style={{ backgroundColor: '#9DCA45' }} label={<span style={{ fontSize: '7px', fontWeight: '700' }}>7%</span>} />
                                            <ProgressBar now={15} key={3} style={{ backgroundColor: '#FFCA28' }} label={<span style={{ fontSize: '7px', fontWeight: '700' }}>15%</span>} />
                                            <ProgressBar now={64} key={4} style={{ backgroundColor: '#FD6845' }} label={<span style={{ fontSize: '7px', fontWeight: '700' }}>64%</span>} />
                                        </ProgressBar>
                                        <p style={{ fontSize: '11px' }}>The above figure means out of total attempted units, 14% are Mastered, 8% are Proficient, 15% are Developing and 64% are in Critical zone.</p>
                                        <p style={{ fontSize: '11px' }}> <b>Note:</b> Proficiency may not total 100% due to rounding.</p>

                                        <div style={{ margin: '5px 0px' }}>
                                            <h3 style={{ margin: '0px' }}>Completion</h3>
                                            <p>% of students who attempted the quiz out of total assigned students</p>
                                        </div>
                                        <div style={{ margin: '5px 0px' }}>
                                            <h3 style={{ margin: '0px' }}>Accuracy</h3>
                                            <p>% of correct topic attempts out of total attempts in it</p>
                                        </div>
                                    </div>
                                </div>
                            </h3>
                            <button
                                className="close-button"
                                onClick={() => setStudentPopupOpen(false)}
                            >
                                {" "}
                                <RxCross2 />{" "}
                            </button>
                        </div>

                        {/* Chapter Performance */}
                        <div className="reportpercent-main-container">
                            <div className="reportpercentbg1" >
                                <div className='metric-title-container'>
                                    <span className='metric-title'>Chapter Proficiency Level</span>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <ProgressBar style={{ height: '40px', borderRadius: '10px' }}>
                                        <ProgressBar
                                            now={studentData.student_proficiency_level.master * 100}
                                            key={1}
                                            style={{ backgroundColor: '#24AD60' }}
                                            label={<span style={{ fontSize: '14px', fontWeight: '700' }}>{Math.floor(studentData.student_proficiency_level.master * 100)}%</span>}
                                        />
                                        <ProgressBar
                                            now={studentData.student_proficiency_level.proficiency * 100}
                                            key={2}
                                            style={{ backgroundColor: '#9DCA45' }}
                                            label={<span style={{ fontSize: '14px', fontWeight: '700' }}>{Math.floor(studentData.student_proficiency_level.proficiency * 100)}%</span>}
                                        />
                                        <ProgressBar
                                            now={studentData.student_proficiency_level.developing * 100}
                                            key={3}
                                            style={{ backgroundColor: '#FFCA28' }}
                                            label={<span style={{ fontSize: '14px', fontWeight: '700' }}>{Math.floor(studentData.student_proficiency_level.developing * 100)}%</span>}
                                        />
                                        <ProgressBar
                                            now={studentData.student_proficiency_level.critical * 100}
                                            key={4}
                                            style={{ backgroundColor: '#FD6845' }}
                                            label={<span style={{ fontSize: '14px', fontWeight: '700' }}>{Math.floor(studentData.student_proficiency_level.critical * 100)}%</span>}
                                        />
                                    </ProgressBar>
                                </div>
                                <div className="Report-chart-Legend">
                                    <p style={{ fontSize: '12px' }}><span style={{ backgroundColor: '#24AD60' }}></span>Master</p>
                                    <p style={{ fontSize: '12px' }}><span style={{ backgroundColor: '#9DCA45' }}></span> Proficient</p>
                                    <p style={{ fontSize: '12px' }}><span style={{ backgroundColor: '#FFCA28' }}></span> Developing</p>
                                    <p style={{ fontSize: '12px' }}><span style={{ backgroundColor: '#FD6845' }}></span> Critical</p>
                                </div>
                            </div>

                            <div className="reportpercent-two-container">
                                <div className="reportpercentbg2" >
                                    <div className='metric-title-container' >
                                        <span className='metric-title'>Completion</span>
                                    </div>
                                    <div className='dfjs reportmainpercent'>
                                        <p style={{ color: '#3EA8FF' }}>{Math.floor((studentData.completion * 100).toFixed(2))}%</p>
                                        <div style={{ width: 50 }}>
                                            <CircularProgressbar
                                                value={studentData.completion * 100}
                                                strokeWidth={25}
                                                styles={buildStyles({
                                                    pathColor: `#3EA8FF`,
                                                    textColor: '#3EA8FF',
                                                    trailColor: '#DAE1E8',
                                                })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="reportpercentbg3" onClick={() => setTopicAccuracyPopup(true)}>
                                    <div className='metric-title-container'>
                                        <span className='metric-title'>Accuracy</span>
                                    </div>
                                    <div className='dfjs reportmainpercent'>
                                        <p style={{ color: '#1C4CC3' }}>{Math.floor((studentData.accuracy.overall_accuracy * 100).toFixed(2))}%</p>
                                        <Image src={ReportVector} alt="ReportVector" width={50} height={50} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Subtopics */}
                        <div className="triangle-popup-subtopics mt20 mb20">
                            <div className="dfjs mb20">
                                <h3 className="triangle-popup-heading">Topics ({studentData.topics.length})</h3>
                                {/* <div className='dfa' style={{ gap: '5px' }}>
                                    <Image src={ReportShot} alt="Report Shot" width={20} height={20} />
                                    Sort by
                                </div> */}
                            </div>

                            <div className="subtopic-container">
                                {studentData.topics.map((topic) => (
                                    <SubtopicBox
                                        key={topic.topic_id}
                                        id={topic.topic_id}
                                        title={topic.topic_name}
                                        status={topic.category === "master" ? "mastery" : topic.category}
                                        activeSubtopicId={activeSubtopicId}
                                        toggleSubtopic={toggleSubtopic}
                                        paaFeedback={topic.paa_feedback}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Popup */}
            <Modal show={AccuracyPopup} onHide={() => setAccuracyPopup(false)} centered>
                <div className="custom-modal tch-modal-content">

                    <div className="dfjs ">
                        <h3 className=" ">Overall Accuracy</h3>
                        <button
                            className="close-button"
                            onClick={() => setAccuracyPopup(false)}
                        >
                            {" "}
                            <RxCross2 />{" "}
                        </button>
                    </div>

                    <div className="summary">
                        <p>Total Question Attempted <span className="highlight">{accuracy?.total_questions_attempted}</span></p>
                        <p>Overall Accuracy <span className="highlight">{Math.floor(accuracy?.overall_accuracy * 100)}%</span></p>
                    </div>

                    <div className="accuracy-container">
                        <div className="accuracy-box blue">
                            <div className="accuracy-text">
                                <Image src={ReportBlurMan} alt='book' width={50} height={50} />
                                <span className="accuracy-text-span">{Math.floor(accuracy?.level_1_accuracy * 100)}%</span>
                            </div>
                            <p className="accuracy-text-p">Remember & Understand (Basic)</p>
                        </div>
                        <div className="accuracy-box orange">
                            <div className="accuracy-text">
                                <Image src={ReportRedMan} alt='book' width={50} height={50} />
                                <span className="accuracy-text-span">{Math.floor(accuracy?.level_2_accuracy * 100)}%</span>
                            </div>
                            <p className="accuracy-text-p">Apply & Analyze (Advanced)</p>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Modal Popup */}
            <Modal show={TopicAccuracyPopup} onHide={() => setTopicAccuracyPopup(false)} centered>
                <div className="custom-modal tch-modal-content">

                    <div className="dfjs ">
                        <h3 className=" ">Overall Accuracy</h3>
                        <button
                            className="close-button"
                            onClick={() => setTopicAccuracyPopup(false)}
                        >
                            {" "}
                            <RxCross2 />{" "}
                        </button>
                    </div>

                    <div className="summary">
                        <p>Total Question Attempted <span className="highlight">{TopicAccuracy?.total_questions_attempted}</span></p>
                        <p>Overall Accuracy <span className="highlight">{Math.floor(TopicAccuracy?.overall_accuracy * 100)}%</span></p>
                    </div>
                    <div className="accuracy-container">
                        <div className="accuracy-box blue">
                            <div className="accuracy-text">
                                <Image src={ReportBlurMan} alt='book' width={50} height={50} />
                                <span className="accuracy-text-span">{Math.floor(TopicAccuracy?.level_1_accuracy * 100)}%</span>
                            </div>
                            <p className="accuracy-text-p">Remember & Understand (Basic)</p>
                        </div>
                        <div className="accuracy-box orange">
                            <div className="accuracy-text">
                                <Image src={ReportRedMan} alt='book' width={50} height={50} />
                                <span className="accuracy-text-span">{Math.floor(TopicAccuracy?.level_2_accuracy * 100)}%</span>
                            </div>
                            <p className="accuracy-text-p">Apply & Analyze (Advanced)</p>
                        </div>
                    </div>
                </div>
            </Modal>
            {isLoader ? <Loader /> : ""}
        </div>

    );
};

export default RedinessPerformance;