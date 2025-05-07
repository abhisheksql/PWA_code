
'use client';
import '../../../../public/style/teacher.css';
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import {useRouter } from "next/navigation";
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
import { Modal } from "react-bootstrap";
import ReportVector from '../../../../public/images/teacher/ReportVector.svg';
import { student_performance, chapter_student_performance_breakdown } from '../../api/teacherAPI';
import BoosterUpArrow from '../../../../public/images/studentimg/BoosterUpArrow.svg';
import BoosterUpBigArrow from '../../../../public/images/studentimg/BoosterUpBigArrow.svg';
import Loader from "../../components/teacher/Loader";
import ReportShot from '../../../../public/images/teacher/ReportShot.svg';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { RxCross2 } from "react-icons/rx";
import ReportBlurMan from '../../../../public/images/teacher/ReportBlurMan.svg';
import ReportRedMan from '../../../../public/images/teacher/ReportRedMan.svg';
import Skeleton from '../../components/Skeleton';


const StudentPerformance = () => {
    const router = useRouter();
    // const [activeTab, setActiveTab] = useState("ongoing");
    const [selectedClass, setSelectedClass] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [isStudentPopupOpen, setStudentPopupOpen] = useState(false);
    const [class_id, setClassId] = useState(null);
    const [course_id, setCourseId] = useState(null);
    const [student_id, setChapterId] = useState(null);
    const [isLoader, setIsLoader] = useState(false);
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [TopicAccuracyPopup, setTopicAccuracyPopup] = useState(null);

    // Reference for the tooltip container
    const tooltipRef = useRef(null);
    const buttonRef = useRef(null);

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
        let sortedChapters = [...filteredChapters];

        switch (option) {
            case 'badged-first':
                sortedChapters.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
                break;

            case 'flagged-first':
                sortedChapters.sort((a, b) => (b.flag ? 1 : 0) - (a.flag ? 1 : 0));
                break;

            case 'proficiency-high-to-low':
                sortedChapters.sort((a, b) => {
                    const levelA = a.chapter_proficiency_level?.proficiency || 0;
                    const levelB = b.chapter_proficiency_level?.proficiency || 0;
                    return levelB - levelA;
                });
                break;

            case 'proficiency-low-to-high':
                sortedChapters.sort((a, b) => {
                    const levelA = a.chapter_proficiency_level?.proficiency || 0;
                    const levelB = b.chapter_proficiency_level?.proficiency || 0;
                    return levelA - levelB;
                });
                break;

            case 'completion-high-to-low':
                sortedChapters.sort((a, b) => (b.completion || 0) - (a.completion || 0));
                break;

            case 'completion-low-to-high':
                sortedChapters.sort((a, b) => (a.completion || 0) - (b.completion || 0));
                break;

            default:
                break;
        }

        // Update the sorted chapters
        setFilteredChapters(sortedChapters);
    };



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


    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const class_id2 = parseInt(searchParams.get('class_id'), 10);
        const course_id2 = parseInt(searchParams.get('course_id'), 10);
        const student_id2 = parseInt(searchParams.get('student_id'), 10);

        if (class_id2 && course_id2 && student_id2) {
            setClassId(class_id2);
            setCourseId(course_id2);
            setChapterId(student_id2);
        }
    }, []);

    const [studentPerformance, setStudentPerformance] = useState(null);

    useEffect(() => {
        const fetchPerformanceData = async () => {
            setIsLoader(true);
            try {
                const response = await student_performance(class_id, course_id, student_id);
                if (response?.status === "success" && response.data) {
                    setStudentPerformance(response.data);
                    setIsLoader(false);
                }else{
                    setIsLoader(false);
                }
            } catch (error) {
                console.error("Error fetching student performance:", error);
            } finally {
            }
        };

        fetchPerformanceData();
    }, [class_id, course_id, student_id]);


    const [activeSubtopicId, setActiveSubtopicId] = useState(null);
    const toggleSubtopic = (id) => {
        setActiveSubtopicId(prev => prev === id ? null : id);
    };


    const SubtopicBox = ({ status, title, id, activeSubtopicId, toggleSubtopic, paaFeedback }) => {
        return (
            <div className={`BoosterReportsubtopic ${status.toLowerCase()}`} style={{ marginBottom: '10px' }}>
                <div className="dfa g5" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', cursor: 'pointer' }} 
                // onClick={() => toggleSubtopic(id)}
                onClick={status.toLowerCase() !== 'unattempted' ? () => toggleSubtopic(id) : null}
                 >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="subtopic-line" style={{ height: '50px' }}></span>
                        <p className="df g5">
                            {title}
                            <span className={`status-badge ${status.toLowerCase()}`}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                        </p>
                    </div>

                    {status.toLowerCase() !== 'unattempted' && (
                    <div
                        className="subtopic-toggle-icon"
                        style={{ cursor: 'pointer', fontSize: '24px' }}
                    >
                        {activeSubtopicId === id ? <FiChevronUp /> : <FiChevronDown />}
                    </div>
                    )}
                </div>

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
                                                                <div className="flexarrow" style={{ top: "-170px", left: "5px", }}>
                                                                    <Image src={BoosterUpBigArrow} alt="Coin Icon" />
                                                                </div>
                                                                <div className="booster-feedback-topcard4">
                                                                    <div className="dfac1">
                                                                        <p className="topcard-txt">
                                                                            {grandchild?.tag && (
                                                                                <button className={grandchild.tag === "Proficient" ? "reportBtnProficient" : grandchild.tag === "Need Practice" ? "reportBtnNeedspractice" : ""}>
                                                                                    {grandchild.tag}
                                                                                </button>
                                                                            )}
                                                                            {grandchild.lu_name}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Nested Sub-Children */}
                                                        {Array.isArray(grandchild.child) &&
                                                            grandchild.child.map((subchild, subIndex) => (
                                                                <div key={subIndex} >
                                                                    {subIndex == 0 && (
                                                                        <div className="d-flex feedback-needscard1">
                                                                            <div className="flexarrow" style={{ top: "-10px", left: "5px" }}>
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



    const [studentData, setStudentData] = useState({
        chapter_name: "",
        student_name: "",
        student_proficiency_level: {},
        completion: 0,
        accuracy: {},
        growth: 0,
        topics: [],
    });

    const [TopicAccuracy, setTopicAccuracy] = useState(null);

    const handleStudentClick = async (class_id, course_id, chapter_id, student_id) => {
        setStudentPopupOpen(true);
        setIsLoader(true);
        try {
            const response = await chapter_student_performance_breakdown(class_id, course_id, chapter_id, student_id);

            if (response?.status === "success" && response.data) {
                const { chapter_name, student_name, student_proficiency_level, completion, accuracy, growth, topics } = response.data;

                setStudentData({
                    chapter_name,
                    student_name,
                    student_proficiency_level,
                    completion,
                    accuracy,
                    growth,
                    topics,
                });

                setTopicAccuracy(accuracy);
            }
        } catch (error) {
            console.error("Error fetching topic performance:", error);
        } finally {
            setIsLoader(false);
        }
    };


    const handleGoBack = () => {
        setIsLoader(true);
        router.back();
    };


    const [searchQuery, setSearchQuery] = useState('');
    const [filteredChapters, setFilteredChapters] = useState(studentPerformance?.chapters || []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredChapters(studentPerformance?.chapters || []);
        } else {
            const filtered = studentPerformance?.chapters.filter((chapter) =>
                chapter.chapter_name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredChapters(filtered);
        }
    }, [searchQuery, studentPerformance?.chapters]);



    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            if (filteredChapters?.length > 0) {
                sortData('completion-high-to-low');
                setSelectedOption('completion-high-to-low');
                isFirstRender.current = false; // Set to false after the first render
            }
        }
    }, [filteredChapters]);
    return (
        <div className="class-overview-container">
            <div className="class-overview-header">
                <div className="classheading">
                    <button onClick={handleGoBack} style={{ cursor: 'pointer' }}>
                        <Image src={Left} alt="Back Icon" width={20} height={20} />
                    </button>
                    {studentPerformance?.student_name ? (
                        <h2>{studentPerformance.student_name.charAt(0).toUpperCase() + studentPerformance.student_name.slice(1)}</h2>
                    ) : (
                        <Skeleton width="250px" height="40px" />
                    )}
                </div>
            </div>

            {/* Overall Performance Cards */}
            <div className="reportpercent-main-container">
                {/* Proficiency Level */}
                <div className="reportpercentbg1">
                    <div className='metric-title-container'>
                        <span className='metric-title'>Overall Proficiency Level</span>
                        <div className="tch_repo_tooltip-container">
                            <Image src={Issue} alt="Issue" width={20} height={20} />
                            <div className="tch_repo_tooltip" style={{ left: '-80px', width: '250px' }}>
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
                            </div>
                        </div>
                    </div>

                    <div style={{ width: '100%' }}>
                    {studentPerformance ? (
                        <ProgressBar style={{ height: '40px', borderRadius: '10px' }}>
                            <ProgressBar now={studentPerformance?.student_proficiency_level.master * 100} style={{ backgroundColor: '#24AD60' }} label={<span style={{ fontSize: '14px', fontWeight: '700' }} >{Math.floor(studentPerformance?.student_proficiency_level.master * 100)}% </span>} />
                            <ProgressBar now={studentPerformance?.student_proficiency_level.proficiency * 100} style={{ backgroundColor: '#9DCA45' }} label={<span style={{ fontSize: '14px', fontWeight: '700' }} >{Math.floor(studentPerformance?.student_proficiency_level.proficiency * 100)}% </span>} />
                            <ProgressBar now={studentPerformance?.student_proficiency_level.developing * 100} style={{ backgroundColor: '#FFCA28' }} label={<span style={{ fontSize: '14px', fontWeight: '700' }} >{Math.floor(studentPerformance?.student_proficiency_level.developing * 100)}% </span>} />
                            <ProgressBar now={studentPerformance?.student_proficiency_level.critical * 100} style={{ backgroundColor: '#FD6845' }} label={<span style={{ fontSize: '14px', fontWeight: '700' }} >{Math.floor(studentPerformance?.student_proficiency_level.critical * 100)}% </span>} />
                        </ProgressBar>
                    ) : (
                        <Skeleton width="100%" height="40px" />
                    )}
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
                        <div className='metric-title-container'>
                            <span className='metric-title'>Completion</span>
                            <div className="tch_repo_tooltip-container">
                                <Image src={Issue} alt="Issue" width={20} height={20} />
                                <div className="tch_repo_tooltip">
                                    <h3>Completion</h3>
                                    <p>% of units completed out of total assigned units</p>
                                </div>
                            </div>
                        </div>
                        {studentPerformance?.completion ? (
                            <div className='dfjs reportmainpercent'>
                                <p style={{ color: "#3EA8FF" }}>{(studentPerformance?.completion * 100).toFixed(0)}% </p>
                                <div style={{ width: 50 }}>
                                    <CircularProgressbar
                                        value={studentPerformance?.completion * 100}
                                        strokeWidth={25}
                                        styles={buildStyles({ 
                                        pathColor: `#3EA8FF`, 
                                        textColor: '#3EA8FF', 
                                        trailColor: '#DAE1E8' 
                                        })}
                                    />
                                </div>
                            </div>
                        ) : (
                            <Skeleton width="100%" height="40px" />
                        )}
                    </div>

                    <div className="reportpercentbg3" onClick={() => setShowPopup(true)} style={{ cursor: 'pointer' }}>
                        <div className='metric-title-container'>
                            <span className='metric-title'>Accuracy</span>
                            <div className="tch_repo_tooltip-container">
                                <Image src={Issue} alt="Issue" width={20} height={20} />
                                <div className="tch_repo_tooltip">
                                    <h3>Accuracy</h3>
                                    <p>% of correct attempts out of total attempts in it</p>
                                </div>
                            </div>
                        </div>

                        {studentPerformance?.completion ? (
                        <div className='dfjs reportmainpercent'>
                            <p style={{ color: '#1C4CC3' }}>{studentPerformance?.accuracy.overall_accuracy * 100}% </p>
                            <Image src={ReportVector} alt="ReportVector" width={50} height={50} />
                        </div>
                        ) : (
                            <Skeleton width="100%" height="40px" />
                        )}
                    </div>
                </div>
            </div>

            {/* Chapters Section */}
            <div className='report-filters-tabs'>
                <h3 className='triangle-popup-heading'>Chapters ({studentPerformance?.chapters.length})</h3>
                <div className="chart-Legend" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

                    <div className="report-search-container">
                        <div className="report-search-icon"><Image src={ReportSearch} alt="Issue" width={20} height={20} /></div>
                        <input type="text" className="report-search-input" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>

                    <div style={{ fontSize: '12px' , cursor:'pointer' }}  onClick={handleTooltipToggle}>
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
            </div>

            {/* Chapters List */}
            <div>
                {filteredChapters.length > 0 ? (
                    filteredChapters.map((chapter, index) => (
                        <div key={index} className="chart-section topic-title mb20" onClick={() => handleStudentClick(class_id, course_id, chapter.chapter_id, student_id)} style={{ cursor: 'pointer' }}>
                            <div className="assignment" style={{ width: '30%' }}>
                                <div className="textnone" style={{ height: '40px', width: '50px', marginLeft: '-5px' }}>
                                    <Image src={ReportChapter} alt="Chapter Icon" width={50} height={50} />
                                </div>
                                <p className="report-chapter-name">{chapter.chapter_name}</p>
                            </div>

                            {/* Completion */}
                            <div className='dfa' style={{ gap: '10px', width: '15%' }}>
                                
                                <div className='textnone dfa' style={{ gap: '10px'}} >
                                    {(chapter.flag || chapter.badge) ? (
                                        <>
                                            {chapter.flag && (
                                                <div className="tch_repo_tooltip-container">
                                                    <Image src={ReportFlag} alt="Flag" width={20} height={20} />
                                                    <div className="tch_repo_tooltip">
                                                        <h3>Flag</h3>
                                                        <p>Areas/Students needing improvement</p>
                                                    </div>
                                                </div>
                                            )}
                                            {chapter.badge && (
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

                                    <span className="subheading" style={{ fontSize: '12px' }}>Completion</span>
                                </div>
                                
                                <div style={{ width: 40 }}>
                                    <CircularProgressbar
                                        value={chapter.completion * 100}
                                        text={`${(chapter.completion * 100).toFixed(0)}%`}
                                        strokeWidth={10}
                                        styles={buildStyles({ textSize: '24px', pathColor: `#6166AE`, textColor: '#6166AE', trailColor: '#E0E0E0' })}
                                    />
                                </div>
                            </div>

                            {/* Proficiency */}

                            <div className='df' style={{ width: '30%' }}>
                                <p className="subheading" style={{ fontSize: "12px" }}>Proficiency</p>
                                <div style={{ width: '100%' }}>
                                    <ProgressBar style={{ height: '20px', borderRadius: '5px' }}>
                                        <ProgressBar now={chapter?.chapter_proficiency_level.master * 100} style={{ backgroundColor: '#24AD60' }} label={<span style={{ fontSize: '12px', fontWeight: '700' }} >{Math.floor(chapter?.chapter_proficiency_level.master * 100)}% </span>} />
                                        <ProgressBar now={chapter?.chapter_proficiency_level.proficiency * 100} style={{ backgroundColor: '#9DCA45' }} label={<span style={{ fontSize: '12px', fontWeight: '700' }}>{Math.floor(chapter?.chapter_proficiency_level.proficiency * 100)}% </span>} />
                                        <ProgressBar now={chapter?.chapter_proficiency_level.developing * 100} style={{ backgroundColor: '#FFCA28' }} label={<span style={{ fontSize: '12px', fontWeight: '700' }}>{Math.floor(chapter?.chapter_proficiency_level.developing * 100)}% </span>} />
                                        <ProgressBar now={chapter?.chapter_proficiency_level.critical * 100} style={{ backgroundColor: '#FD6845' }} label={<span style={{ fontSize: '12px', fontWeight: '700' }}>{Math.floor(chapter?.chapter_proficiency_level.critical * 100)}% </span>} />
                                    </ProgressBar>
                                </div>
                            </div>


                            <div style={{ width: '13%', marginTop: '25px' }}>
                                <button className='viewReportBtn'>
                                    View Reports
                                    <Image className='textnone' src={ReportBtn} alt="Issue" width={20} height={20} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ textAlign: 'center', marginTop: '20px' }}>No chapters found.</p>
                )}
            </div>

            {/* Modal Popup */}
            <Modal show={showPopup} onHide={() => setShowPopup(false)} centered>
                <div className="custom-modal tch-modal-content">

                    <div className="dfjs ">
                        <h3 className=" ">Overall Accuracy</h3>
                        <button
                            className="close-button"
                            onClick={() => setShowPopup(false)}
                        >
                            {" "}
                            <RxCross2 />{" "}
                        </button>
                    </div>

                    <div className="summary">
                        <p>Total Question Attempted <span className="highlight" >{studentPerformance?.accuracy.total_questions_attempted}</span></p>
                        <p>Overall Accuracy <span className="highlight">{Math.floor(studentPerformance?.accuracy.overall_accuracy * 100)}%</span></p>
                    </div>

                    <div className="accuracy-container">
                        <div className="accuracy-box blue">
                            <div className="accuracy-text">
                                <Image src={ReportBlurMan} alt='book' width={50} height={50} />
                                <span className="accuracy-text-span">{Math.floor(studentPerformance?.accuracy.level_1_accuracy * 100)}%</span>
                            </div>
                            <p className="accuracy-text-p">Remember & Understand (Basic)</p>
                        </div>
                        <div className="accuracy-box orange">
                            <div className="accuracy-text">
                                <Image src={ReportRedMan} alt='book' width={50} height={50} />
                                <span className="accuracy-text-span">{Math.floor(studentPerformance?.accuracy.level_2_accuracy * 100)}%</span>
                            </div>
                            <p className="accuracy-text-p">Apply & Analyze (Advanced)</p>
                        </div>
                    </div>
                </div>
            </Modal>
            
            {isStudentPopupOpen && (
                <div className="triangle-popup-overlay">
                    <div className="triangle-popup-box">
                        <div >
                            <div className="dfjs " style={{ marginBottom: '30px' }}>
                                <h3 className="dfa triangle-popup-heading">
                                    {studentData.student_name}
                                    {/* <b>{studentData.student_name} </b> &nbsp; | {studentData.chapter_name} */}
                                    <div className="tch_repo_tooltip-container" style={{ marginLeft: '10px' }}>
                                        <Image src={Issue} alt="Issue" width={20} height={20} />
                                        <div className="tch_repo_tooltip" style={{ left: '100px', width: '270px' }}>
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
                                                    <p>% of correct attempts out of total attempts in it</p>
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
                            <div className="reportpercent-main-container ">


                                <div className="reportpercentbg1">
                                    <div className='metric-title-container'>
                                        <span className='metric-title'>Chapter Proficiency Level</span>
                                    </div>
                                    <div style={{ width: '100%' }}>
                                        <ProgressBar style={{ height: '40px', borderRadius: '10px' }}>
                                            <ProgressBar
                                                now={studentData.student_proficiency_level.master * 100}
                                                key={1}
                                                style={{ backgroundColor: '#24AD60' }}
                                                label={<span style={{ fontSize: '14px', fontWeight: '700' }}>
                                                    {Math.floor(studentData?.student_proficiency_level.master * 100)}%</span>}
                                            />
                                            <ProgressBar
                                                now={studentData.student_proficiency_level.proficiency * 100}
                                                key={2}
                                                style={{ backgroundColor: '#9DCA45' }}
                                                label={<span style={{ fontSize: '14px', fontWeight: '700' }}>  {Math.floor(studentData?.student_proficiency_level.proficiency * 100)}%</span>}
                                            />
                                            <ProgressBar
                                                now={studentData.student_proficiency_level.developing * 100}
                                                key={3}
                                                style={{ backgroundColor: '#FFCA28' }}
                                                label={<span style={{ fontSize: '14px', fontWeight: '700' }}> {Math.floor(studentData?.student_proficiency_level.developing * 100)}%</span>}
                                            />
                                            <ProgressBar
                                                now={studentData.student_proficiency_level.critical * 100}
                                                key={4}
                                                style={{ backgroundColor: '#FD6845' }}
                                                label={<span style={{ fontSize: '14px', fontWeight: '700' }}>{Math.floor(studentData?.student_proficiency_level.critical * 100)}%</span>}
                                            />
                                        </ProgressBar>
                                    </div>

                                    
                                    <div className="chart-Legend" style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', justifyContent: 'flex-end' }}>
                                        <p style={{ fontSize: '12px' }}><span style={{ backgroundColor: '#24AD60' }}></span>Master</p>
                                        <p style={{ fontSize: '12px' }}><span style={{ backgroundColor: '#9DCA45' }}></span> Proficient</p>
                                        <p style={{ fontSize: '12px' }}><span style={{ backgroundColor: '#FFCA28' }}></span> Developing</p>
                                        <p style={{ fontSize: '12px' }}><span style={{ backgroundColor: '#FD6845' }}></span> Critical</p>
                                    </div>
                                </div>


                                <div className="reportpercent-two-container">

                                    <div  className="reportpercentbg2" >
                                        <div className='metric-title-container'  >
                                            <span className='metric-title'>Completion</span>
                                        </div>
                                        <div className='dfjs reportmainpercent'>
                                            <p style={{ color: '#3EA8FF' }}>{Math.floor((studentData.completion * 100).toFixed(2))}%</p>
                                            <div style={{ width: 40, height: 40 }}>
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
                                            <Image src={ReportVector} alt="ReportVector" width={40} height={40} />
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Subtopics */}
                            <div className="triangle-popup-subtopics mt20 mb20">
                                <div className="dfjs mb20">
                                    <h3 className="triangle-popup-heading">Topics ({studentData.topics.length})</h3>
                                    <div className='dfa' style={{ gap: '5px' }}>

                                    </div>
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
                </div>
            )}

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

export default StudentPerformance;