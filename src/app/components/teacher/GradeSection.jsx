import React, { useEffect, useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import Left from '../../../../public/images/teacher/left.svg';
import ReportSearch from '../../../../public/images/teacher/Graysearch.svg';
import ReportFlag from '../../../../public/images/teacher/ReportFlag.svg';
import ReportBtn from '../../../../public/images/teacher/ReportBtn.svg';
import ReportBadge from '../../../../public/images/teacher/ReportBadge.svg';
import ReportShot from '../../../../public/images/teacher/ReportShot.svg';
import { getChapters, getStudents } from '../../api/teacherAPI';
import ClassDropdown from "./ClassDropdown";
import Loader from "../../components/teacher/Loader";
import Skeleton from '../../components/Skeleton';

const GradeSection = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("chapters");
    const [selectedClass, setSelectedClass] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [students, setStudents] = useState([]);
    const [isLoader, setIsLoader] = useState(false);
    const [class_id, setClassId] = useState(null);
    const [course_id, setCourseId] = useState(null);
    const [chaptersLoading, setChaptersLoading] = useState(true);
    const [studentsLoading, setStudentsLoading] = useState(true);
    const [chaptersSorted, setChaptersSorted] = useState(false);
    const [studentsSorted, setStudentsSorted] = useState(false);
    const [studentTabViewed, setStudentTabViewed] = useState(false);
    const [studentDataReady, setStudentDataReady] = useState(false);
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    // Reference for the tooltip container
    const tooltipRef = useRef(null);
    const buttonRef = useRef(null);


    const handleTooltipToggle = () => {
        setIsTooltipVisible(!isTooltipVisible);
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

        if (class_id2 && course_id2) {
            setClassId(class_id2);
            setCourseId(course_id2);
        }
    }, []);

    useEffect(() => {
        // setIsLoader(true);
        if (!class_id || !course_id) return;

        setChaptersLoading(true);
        setStudentsLoading(true);

        // Fetch chapters
        const fetchChapters = async () => {
            try {
                const response = await getChapters(class_id, course_id);
                setChapters(response.data.chapters || []);
            } catch (error) {
                console.error('Error fetching chapters:', error);
                setChaptersLoading(false);
            } finally {
                setIsLoader(false);
            }
        };

        // Fetch students
        const fetchStudents = async () => {
            try {
                const response = await getStudents(class_id, course_id);
                setStudents(response.data.students || []);
            } catch (error) {
                console.error('Error fetching students:', error);
                setStudentsLoading(false);
            } finally {
                setIsLoader(false);
            }
        };

        fetchChapters();
        fetchStudents();

    }, [class_id, course_id]);

    const handleClassSelect = (newSectionId, newCourseId, selectedOption) => {
        setClassId(newSectionId);
        setCourseId(newCourseId);
        setSelectedClass(selectedOption);
        // Reset search query when changing class
        setSearchQuery("");
    };

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredChapters, setFilteredChapters] = useState(chapters);
    const [filteredStudents, setFilteredStudents] = useState(students);

    // Search filter for chapters
    useEffect(() => {
        const searchFilteredChapters = chapters.filter((chapter) =>
            chapter.chapter_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredChapters(searchFilteredChapters);
    }, [searchQuery, chapters]);

    // Search filter for students
    useEffect(() => {
        const searchFilteredStudents = students.filter((student) =>
            student.student_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredStudents(searchFilteredStudents);
    }, [searchQuery, students]);

    // Sort data when chapters or students data changes
    useEffect(() => {
        if (filteredStudents.length > 0 && filteredChapters.length > 0) {
            // Use the current selected option or default to 'completion-high-to-low'
            const currentOption = selectedOption || 'completion-high-to-low';
            sortData(currentOption);
        }
    }, [filteredStudents, filteredChapters]);

    // Set initial sorting option when component mounts
    useEffect(() => {
        if (!selectedOption) {
            setSelectedOption('completion-high-to-low');
        }
    }, []);

    const handleSelectOption = (option) => {
        setSelectedOption(option);
        setIsTooltipVisible(false);
        sortData(option);
    };

    const options = [
        { id: 'badged-first', label: 'Badged first' },
        { id: 'flagged-first', label: 'Flagged first' },
        { id: 'proficiency-high-to-low', label: 'Proficiency - High to Low' },
        { id: 'proficiency-low-to-high', label: 'Proficiency - Low to High' },
        { id: 'completion-high-to-low', label: 'Completion - High to Low' },
        { id: 'completion-low-to-high', label: 'Completion - Low to High' },
    ];

    const sortData = (option) => {
        console.log(option, filteredStudents);
        let sortedChaptersList = [...filteredChapters];
        let sortedStudentsList = [...filteredStudents];

        // Perform the sorting based on option
        switch (option) {
            case 'badged-first':
                sortedChaptersList.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
                sortedStudentsList.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
                break;

            case 'flagged-first':
                sortedChaptersList.sort((a, b) => (b.flag ? 1 : 0) - (a.flag ? 1 : 0));
                sortedStudentsList.sort((a, b) => (b.flag ? 1 : 0) - (a.flag ? 1 : 0));
                break;

            case 'proficiency-high-to-low':
                sortedChaptersList.sort((a, b) => {
                    const levelA = a.proficiency_level.proficiency || 0;
                    const levelB = b.proficiency_level.proficiency || 0;
                    return levelB - levelA;
                });
                sortedStudentsList.sort((a, b) => {
                    const levelA = a.proficiency_level.proficiency || 0;
                    const levelB = b.proficiency_level.proficiency || 0;
                    return levelB - levelA;
                });
                break;

            case 'proficiency-low-to-high':
                sortedChaptersList.sort((a, b) => {
                    const levelA = a.proficiency_level.proficiency || 0;
                    const levelB = b.proficiency_level.proficiency || 0;
                    return levelA - levelB;
                });
                sortedStudentsList.sort((a, b) => {
                    const levelA = a.proficiency_level.proficiency || 0;
                    const levelB = b.proficiency_level.proficiency || 0;
                    return levelA - levelB;
                });
                break;

            case 'completion-high-to-low':
                sortedChaptersList.sort((a, b) => (b.completion || 0) - (a.completion || 0));
                sortedStudentsList.sort((a, b) => (b.completion || 0) - (a.completion || 0));
                break;

            case 'completion-low-to-high':
                sortedChaptersList.sort((a, b) => (a.completion || 0) - (b.completion || 0));
                sortedStudentsList.sort((a, b) => (a.completion || 0) - (b.completion || 0));
                break;

            default:
                break;
        }

        // Update the sorted data only when necessary
        if (JSON.stringify(sortedChaptersList) !== JSON.stringify(filteredChapters)) {
            setFilteredChapters(sortedChaptersList);
        }
        if (JSON.stringify(sortedStudentsList) !== JSON.stringify(filteredStudents)) {
            setFilteredStudents(sortedStudentsList);
        }

        // Mark sorting as complete and turn off loading states
        setChaptersSorted(true);
        setStudentsSorted(true);
        setChaptersLoading(false);
        setStudentsLoading(false);
    };

    const handleChapterReportClick = (classId, courseId, chapterid, grade) => {
        setIsLoader(true);
        router.push(`chapterdetails/?class_id=${classId}&course_id=${courseId}&chapter_id=${chapterid}&grade=${grade}&tab=performance&from=classdetails`);
    };
    const handleStudentDetailsClick = (classId, courseId, studentId) => {
        setIsLoader(true);
        router.push(`studentdetails/?class_id=${classId}&course_id=${courseId}&student_id=${studentId}`);
    };
    const handleGoBack = () => {
        setIsLoader(true);
        router.push(`/teacher/reports`);
    };

    // const isFirstRender = useRef(true);

    // useEffect(() => {
    //     if (filteredChapters?.length > 0 || filteredStudents?.length > 0) {
    //       // Only set selectedOption if it's different from the current state
    //       if (selectedOption !== 'completion-high-to-low') {
    //         sortData('completion-high-to-low');
    //         setSelectedOption('completion-high-to-low');
    //       }
    //     }
    //   }, [filteredChapters, filteredStudents, selectedOption]); // Added selectedOption as a dependency to avoid infinite loop
      

    // Render skeleton item for loading state
    const renderSkeletonItem = () => (
        <div className="chart-section topic-title mb20">
            <div  className="assignment" style={{ width: '30%' }}>
                <div className='textnone' style={{ height: '40px', width: '40px' }}>
                    <Skeleton width="40px" height="40px" />
                </div>
                <div className="df" style={{ gap: '2px', flexDirection: 'column' }}>
                    <Skeleton width="200px" height="20px" />
                    <Skeleton width="150px" height="16px" />
                </div>
            </div>

            <div className='dfjs' style={{ gap: '10px', width: '15%' }}>
                <Skeleton width="20px" height="20px" />
                <Skeleton width="60px" height="20px" />
                <Skeleton width="40px" height="40px" borderRadius="50%" />
            </div>

            <div style={{
                width: '1.5px',
                height: '50px',
                backgroundColor: '#EDEDED',
                margin: 'auto 10px'
            }}></div>

            <div className="df" style={{ width: '30%' , gap: '2px', flexDirection: 'column' }}>
                <Skeleton width="100px" height="15px" />
                <Skeleton width="250px%" height="20px" />             
            </div>

            <div className='textnone' style={{ width: '13%', marginTop: '20px' }}>
                <Skeleton width="120px" height="30px" borderRadius="5px" />
            </div>
        </div>
    );

    // Optimize the tab switching function
    const handleTabSwitch = (tab) => {
        setActiveTab(tab);
        setSearchQuery("");
        
        // Mark student tab as viewed when it's selected
        if (tab === "students") {
            setStudentTabViewed(true);
        }
    };
    
    // Optimize the student data processing
    useEffect(() => {
        // Only process student data when the student tab is viewed
        if (studentTabViewed && students.length > 0 && !studentDataReady) {
            // Use setTimeout to defer processing to next tick
            const timer = setTimeout(() => {
                // Pre-process student data to improve rendering performance
                const processedStudents = students.map(student => ({
                    ...student,
                    // Pre-calculate any expensive values here
                    completionPercentage: Math.floor(student.completion * 100),
                    // Add any other pre-calculated values
                }));
                
                setFilteredStudents(processedStudents);
                setStudentDataReady(true);
            }, 0);
            
            return () => clearTimeout(timer);
        }
    }, [studentTabViewed, students, studentDataReady]);
    
    // Optimize the student rendering
    const renderStudentItem = (student, index) => {
        // Use pre-calculated values if available
        const completionPercentage = student.completionPercentage || Math.floor(student.completion * 100);
        
        return (
            <div key={index} className="chart-section topic-title mb20" onClick={() => handleStudentDetailsClick(class_id, course_id, student.student_id)} style={{cursor:'pointer'}}>
                <div className="assignment" style={{ width: '30%' }}>
                    <div className='textnone' style={{ height: '50px', width: '50px',}}>
                        <Image src={student.icon} alt="Student Icon" width={50} height={50} />
                    </div>
                    <div className="df" style={{ gap: '2px' }}>
                        <p className="report-chapter-name">
                            {student.student_name}
                        </p>
                        <p className="subheading" style={{ fontSize: "12px" }}>
                            Activity: {student.activity_log}
                        </p>
                    </div>
                </div>

                <div className='dfjs' style={{ gap: '10px', width: '15%' }}>

                    <div className='textnone dfa' style={{ gap:'10px'}} >
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
                            value={completionPercentage}
                            text={`${completionPercentage}%`}
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

                <div style={{
                    width: '1.5px',
                    height: '50px',
                    backgroundColor: '#EDEDED',
                    margin: 'auto 10px'
                }}></div>

                <div className="df" style={{ width: '30%' }}>
                    <p className="subheading" style={{ fontSize: "14px" }}>Proficiency</p>
                    <div style={{ width: '100%' }}>
                        <ProgressBar style={{ height: '20px', borderRadius: '5px' }}>
                            <ProgressBar now={student.proficiency_level?.master * 100} style={{ backgroundColor: '#24AD60' }} label={<span style={{ fontSize: '12px', fontWeight: '700' }}>{Math.floor(student.proficiency_level?.master * 100)}%</span>} />
                            <ProgressBar now={student.proficiency_level?.proficiency * 100} style={{ backgroundColor: '#9DCA45' }} label={<span style={{ fontSize: '12px', fontWeight: '700' }}>{Math.floor(student.proficiency_level?.proficiency * 100)}%</span>} />
                            <ProgressBar now={student.proficiency_level?.developing * 100} style={{ backgroundColor: '#FFCA28' }} label={<span style={{ fontSize: '12px', fontWeight: '700' }}>{Math.floor(student.proficiency_level?.developing * 100)}%</span>} />
                            <ProgressBar now={student.proficiency_level?.critical * 100} style={{ backgroundColor: '#FD6845' }} label={<span style={{ fontSize: '12px', fontWeight: '700' }}>{Math.floor(student.proficiency_level?.critical * 100)}%</span>} />
                        </ProgressBar>
                    </div>
                </div>
                <div style={{ width: '13%', marginTop: '25px' }}>
                    <button className='viewReportBtn' onClick={() => handleStudentDetailsClick(class_id, course_id, student.student_id)}>
                        View Reports
                        <Image className='textnone' src={ReportBtn} alt="Report Button" width={20} height={20} />
                    </button>
                </div>
            </div>
        );
    };

    // Add a useEffect to reset the sorted states when class_id or course_id changes
    useEffect(() => {
        if (class_id && course_id) {
            setChaptersSorted(false);
            setStudentsSorted(false);
        }
    }, [class_id, course_id]);

    return (
        <div className="class-overview-container">
            <div className="class-overview-header">
                <div className="classheading">
                    <span onClick={handleGoBack} style={{ cursor: 'pointer' }}>
                        <Image src={Left} alt="Back Icon" width={20} height={20} />
                    </span>
                    <h2>{chapters[0]?.class_name} Reports</h2>
                </div>
                <div className='dfa' style={{ gap: '10px' }}>
                    <div className="dropdown-container">
                        <ClassDropdown onClassChange={handleClassSelect} />
                    </div>
                </div>
            </div>

            <div className='report-filters-tabs'>
                <div className="toggle-buttons" style={{ borderRadius: '20px' , marginBottom:'2px' }}>
                    <button
                        onClick={() => handleTabSwitch("chapters")}
                        className={`toggle-button ${activeTab === "chapters" ? "active" : ""}`}
                        style={{ borderRadius: '20px', padding: '10px 45px' }}
                    >
                        Chapters
                    </button>
                    <button
                        onClick={() => handleTabSwitch("students")}
                        className={`toggle-button ${activeTab === "students" ? "active" : ""}`}
                        style={{ borderRadius: '20px', padding: '10px 45px' }}
                    > Student </button>
                </div>
                <div className='report-filters-tabs-right'>

                    <div className="Report-chart-Legend">
                        <div className="report-search-container">
                            <div className="report-search-icon"><Image src={ReportSearch} alt="Issue" width={20} height={20} /></div>
                            <input type="text" className="report-search-input" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                        <div style={{ fontSize: '12px',cursor: 'pointer' }} 
                                    onClick={handleTooltipToggle}>
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
                    
                    <div className="Report-chart-Legend">
                        <p style={{ fontSize: '12px' }}><span style={{ backgroundColor: '#24AD60' }}></span>Master</p>
                        <p style={{ fontSize: '12px' }}><span style={{ backgroundColor: '#9DCA45' }}></span> Proficient</p>
                        <p style={{ fontSize: '12px' }}><span style={{ backgroundColor: '#FFCA28' }}></span> Developing</p>
                        <p style={{ fontSize: '12px' }}><span style={{ backgroundColor: '#FD6845' }}></span> Critical</p>
                    </div>
                
                </div>
            </div>
            <div>
                {/* Render Chapters Tab */}
                {activeTab === "chapters" && (
                    <div>
                        {chaptersLoading || !chaptersSorted ? (
                            // Skeleton loading for chapters - show until chapters are loaded AND sorted
                            Array(4).fill(0).map((_, index) => (
                                <div key={index}>
                                    {renderSkeletonItem()}
                                </div>
                            ))
                        ) : (
                            filteredChapters.map((chapter, index) => (
                                <div key={index} className="chart-section topic-title mb20" onClick={() => handleChapterReportClick(chapter.section_id, chapter.course_id, chapter.chapter_id, chapter.grade)}  style={{cursor:'pointer'}}>
                                    <div className="assignment" style={{ width: '30%' }}>
                                        <div className='textnone' style={{ height: '40px', width: '50px', marginLeft: '-5px' }}>
                                            <Image src={chapter.icon} alt="Assignment Icon" width={50} height={50} />
                                        </div>
                                        <div className="df" style={{ gap: '2px' }}>
                                            <p className="report-chapter-name">
                                                {chapter.chapter_name}
                                            </p>
                                            <p className="subheading" style={{ fontSize: "12px" }}>
                                                Assigned Topics :
                                                <span style={{ color: "#6166AE", fontWeight: "600", marginLeft: '5px' }}>
                                                    {chapter.topics_assigned > 0 ? chapter.topics_assigned : 0} / {chapter.topics_count}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className='dfjs' style={{ gap: '10px', width: '15%' }}>

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

                                            <span className="subheading" style={{ fontSize: "12px" }}>Completion</span>
                                        </div>

                                        <div style={{ width: 40, height: 40 }}>
                                            <CircularProgressbar
                                                value={chapter.completion !== null ? Math.floor(chapter.completion * 100) : 0}
                                                text={chapter.completion !== null ? `${Math.floor(chapter.completion * 100)}%` : "0%"}
                                                strokeWidth={10}
                                                styles={buildStyles({
                                                    textSize: '24px',
                                                    pathColor: '#6166AE',
                                                    textColor: '#6166AE',
                                                    trailColor: '#E0E0E0',
                                                })}
                                            />

                                        </div>
                                    </div>

                                    <div style={{
                                        width: '1.5px',
                                        height: '50px',
                                        backgroundColor: '#EDEDED',
                                        margin: 'auto 10px'
                                    }}></div>

                                    <div className='df' style={{ width: '30%' }}>
                                        <p className="subheading" style={{ fontSize: "14px" }}>Proficiency</p>
                                        <div style={{ width: '100%' }}>
                                            <ProgressBar style={{ height: '20px', borderRadius: '5px' }}>
                                                <ProgressBar
                                                    now={chapter.proficiency_level.master * 100}
                                                    key={1}
                                                    style={{ backgroundColor: '#24AD60' }}
                                                    label={<span style={{ fontSize: '12px', fontWeight: '700' }}>{Math.floor(chapter.proficiency_level.master * 100)}%</span>}
                                                />
                                                <ProgressBar
                                                    now={chapter.proficiency_level.proficiency * 100}
                                                    key={2}
                                                    style={{ backgroundColor: '#9DCA45' }}
                                                    label={<span style={{ fontSize: '12px', fontWeight: '700' }}>{Math.floor(chapter.proficiency_level.proficiency * 100)}%</span>}
                                                />
                                                <ProgressBar
                                                    now={chapter.proficiency_level.developing * 100}
                                                    key={3}
                                                    style={{ backgroundColor: '#FFCA28' }}
                                                    label={<span style={{ fontSize: '12px', fontWeight: '700' }}>{Math.floor(chapter.proficiency_level.developing * 100)}%</span>}
                                                />
                                                <ProgressBar
                                                    now={chapter.proficiency_level.critical * 100}
                                                    key={4}
                                                    style={{ backgroundColor: '#FD6845' }}
                                                    label={<span style={{ fontSize: '12px', fontWeight: '700' }}>{Math.floor(chapter.proficiency_level.critical * 100)}%</span>}
                                                />
                                            </ProgressBar>
                                        </div>
                                    </div>

                                    <div style={{ width: '13%', marginTop: '25px' }}>
                                        <button className='viewReportBtn' onClick={() => handleChapterReportClick(chapter.section_id, chapter.course_id, chapter.chapter_id, chapter.grade)}>
                                            View Reports
                                            <Image className='textnone' src={ReportBtn} alt="Report Btn" width={20} height={20} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Render Students Tab */}
                {activeTab === "students" && (
                    <div>
                        {studentsLoading || !studentsSorted ? (
                            // Skeleton loading for students - show until students are loaded AND sorted
                            Array(4).fill(0).map((_, index) => (
                                <div key={index}>
                                    {renderSkeletonItem()}
                                </div>
                            ))
                        ) : (
                            // Use the optimized rendering function
                            filteredStudents.map((student, index) => renderStudentItem(student, index))
                        )}
                    </div>
                )}
            </div>
            {isLoader ? <Loader /> : ""}
        </div>
    );
};

export default GradeSection;
