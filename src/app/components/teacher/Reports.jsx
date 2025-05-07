"use client";
import '../../../../public/style/teacher.css';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Select from 'react-select';
import { RxCross2 } from "react-icons/rx";
import { FiChevronDown } from 'react-icons/fi';
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import Issue from '../../../../public/images/teacher/Issue.svg';
import ReportGrow from '../../../../public/images/teacher/ReportGrow.svg';
import ReportVector from '../../../../public/images/teacher/ReportVector.svg';
import BookAlt from '../../../../public/images/teacher/book-alt.svg';
import UnlockIcon from '../../../../public/images/teacher/UnlockIcon.svg';
import Loader from "../../components/teacher/Loader";
import ReportBlurMan from '../../../../public/images/teacher/ReportBlurMan.svg';
import ReportRedMan from '../../../../public/images/teacher/ReportRedMan.svg';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { Modal } from "react-bootstrap";
import { getTeacherPerformance } from '../../api/teacherAPI'; 
import Skeleton from '../../components/Skeleton';
import { getTeacherClassPerformance, fetchTeacherClasses, fetchTeacherAssignedChapter, getTeacherGradesBySubject } from '../../api/teacherAPI';
import { useRouter } from "next/navigation";

const Reports = () => {
    const [activeTab, setActiveTab] = useState("ongoing");
    const [selectedClass, setSelectedClass] = useState('All');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [teacherData, setTeacherData] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [sectionNames, setSectionNames] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState(6);
    const [isLoader, setIsLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const router = useRouter();

    // States for storing the response data, loading states, and error handling
    const [classes, setClasses] = useState([]);
    const [AssignedChapter, setAssignedChapter] = useState([]);
    const [classesLoading, setClassesLoading] = useState(true);
    // const [assignedChapterLoading, setAssignedChapterLoading] = useState(true);
    const [classesError, setClassesError] = useState(null);
    const [assignedChapterError, setAssignedChapterError] = useState(null);

    useEffect(() => {
        if (selectedSubject?.label) {
            // setIsLoader(true); 
            setClassesLoading(true);

            const fetchClassesAndAssignedChapters = async () => {
                try {
                    // Fetch classes
                    const classesData = await fetchTeacherClasses(selectedSubject.label);
                    setClasses(classesData.data);

                    // Fetch assigned chapters
                    const assignedChapterData = await fetchTeacherAssignedChapter(selectedSubject.label);
                    setAssignedChapter(assignedChapterData.data);
                } catch (error) {
                    setClassesError(error);
                    setAssignedChapterError(error);
                } finally {
                    setClassesLoading(false);
                }
            };

            fetchClassesAndAssignedChapters();  // Call the function to fetch both classes and chapters
        }
    }, [selectedSubject?.label]);

    const fetchTeacherPerformanceData = async () => {
        try {
            const response = await getTeacherPerformance();
            if (response.status === "success") {
                setTeacherData(response.data);
            }
        } catch (error) {
            console.error("Error fetching teacher performance data:", error);
        }
    };


    const [subjectGrades, setSubjectGrades] = useState(null);

    const handleSubjectSelect = async (selectedOption) => {
        setSelectedSubject(selectedOption);
        try {
          const response = await getTeacherGradesBySubject(selectedOption.value);
          if (response.status === "success") {
            setSubjectGrades(response.data); // ✅ Only update subject-specific grades
            setSelectedGrade(response.data[0]);
          }
        } catch (error) {
          console.error("Error fetching subject grades:", error);
        }
      };
      

    const { teacher_proficiency_level, completion, accuracy, growth, subject_list, grades } = teacherData || {};

    const gradesToRender = subjectGrades || grades;

    const fetchClassPerformanceData = async () => {
        if (!selectedSubject || !selectedGrade) return;
        try {
            setIsLoader(true); 
            const result = await getTeacherClassPerformance(selectedSubject.value, selectedGrade);
            if (result.status === 'success') {
                const uniqueSections = result.data.grade_performance.map(section => section.section_name);
                setSectionNames([...new Set(uniqueSections)]);
                const formattedData = result.data.grade_performance[0].chapters.map(chapter => {
                    const chapterData = { name: chapter.chapter_name };
                    result.data.grade_performance.forEach(section => {
                        const classData = section.chapters.find(ch => ch.chapter_name === chapter.chapter_name);
                        chapterData[section.section_name] = classData ? Math.floor(classData.chapter_proficiency * 100) : 0;
                    });
                    return chapterData;
                });
                setChartData(formattedData);
            }
        } catch (error) {
            console.error('Error fetching performance data:', error);
        }finally {
            setIsLoader(false); // ✅ Stop loader after fetch
        }

    };

    useEffect(() => {
        fetchTeacherPerformanceData();
    }, []);

    useEffect(() => {
        fetchClassPerformanceData();
    }, [selectedSubject, selectedGrade]);

    useEffect(() => {
        if (teacherData?.subject_list?.length > 0) {
            setSelectedSubject({ label: teacherData.subject_list[0], value: teacherData.subject_list[0] });
        }
        if (teacherData?.grades?.length > 0) {
            setSelectedGrade(teacherData.grades[0]);
        }
    }, [teacherData]);


    const ongoingChapters = AssignedChapter?.ongoing_chapters?.map((chapter) => ({
        id: chapter.chapter_id,
        name: chapter.chapter_name,
        class: chapter.class_name,
        learningIndex: chapter.learning_index,
        completion: chapter.completion,
        section_id: chapter.section_id,
        course_id: chapter.course_id,
        icon: chapter.icon,
        grade: chapter.grade,
        assigned_topic_count: chapter.assigned_topic_count,
        proficiency_level: chapter.proficiency_level
    })) || [];

    const endedChapters = AssignedChapter?.recent_ended_chapters?.map((chapter) => ({
        id: chapter.chapter_id,
        name: chapter.chapter_name,
        class: chapter.class_name,
        learningIndex: chapter.learning_index,
        completion: chapter.completion,
        section_id: chapter.section_id,
        course_id: chapter.course_id,
        icon: chapter.icon,
        grade: chapter.grade,
        assigned_topic_count: chapter.assigned_topic_count,
        proficiency_level: chapter.proficiency_level
    })) || [];

    const data = activeTab === "ongoing" ? ongoingChapters : endedChapters;

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

  
      

    const handleGradeSelection = (grade) => {
        setSelectedGrade(grade);
        setSelectedClass('All')
    };

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


    // const filteredData = selectedClass === 'All' ? chartData : chartData.filter(data => Object.keys(data).includes(selectedClass));
    const filteredData = selectedClass === 'All'
    ? chartData
    : chartData.map(chapter => ({
      name: chapter.name,
      [selectedClass]: chapter[selectedClass]
    }));

    const colors = ['#6166AE', '#9DCA45', '#FF8A00' , '#09814A', '#FCBA04' , '#3EA8FF' , '#950952' , '#94671F' , '#A837DD' , '#EA526F', '#6153CC' , '#717744'];

    const handleClassClick = (classId, courseId) => {
        setIsLoader(true);
        router.push(`reports/classdetails/?class_id=${classId}&course_id=${courseId}`);
    };

    const handleChapterReportClick = (classId, courseId, chapterid, grade) => {
        setIsLoader(true);
        router.push(`reports/chapterdetails/?class_id=${classId}&course_id=${courseId}&chapter_id=${chapterid}&grade=${grade}&tab=performance`);
    };
    const handleUpcommingChapterNavigation = () => {
        setIsLoader(true);
        router.push(`/teacher/class_overview/upcoming_chapters?class_id=${classes?.classes[0]?.section_id}&course_id=${classes?.classes[0]?.course_id}`);
      };
    return (
        <div className="class-overview-container">

            <div className="class-overview-header">
                <div className="classheading">
                    <h2>Performance Overview</h2>
                </div>
            </div>

            <div className="reportpercent-main-container">

                <div className="reportpercentbg1" >
                    <div className='metric-title-container'>
                        <span className='metric-title'>Overall Proficiency Level</span>
                        <div className="tch_repo_tooltip-container">
                            <Image src={Issue} alt="Issue" width={20} height={20} />
                            <div className="tch_repo_tooltip" style={{left:'-80px', width:'250px'}}>
                                <h3>Proficiency</h3>
                                <p style={{fontSize:'11px'}}>Represents the distribution across different proficiency levels. Eg. -</p>
                                <ProgressBar style={{ height: '15px', borderRadius: '5px' , margin:'5px 0px' }}>
                                    <ProgressBar now={14}  key={1} style={{ backgroundColor: '#24AD60' }} label={<span style={{ fontSize: '7px', fontWeight: '700' }}>14%</span>}/>
                                    <ProgressBar now={7} key={2} style={{ backgroundColor: '#9DCA45' }} label={<span style={{ fontSize: '7px', fontWeight: '700' }}>7%</span>}/>
                                    <ProgressBar now={15} key={3} style={{ backgroundColor: '#FFCA28' }} label={<span style={{ fontSize: '7px', fontWeight: '700' }}>15%</span>}/>
                                        <ProgressBar now={64} key={4} style={{ backgroundColor: '#FD6845' }} label={<span style={{ fontSize: '7px', fontWeight: '700' }}>64%</span>} />
                                </ProgressBar>
                                <p style={{fontSize:'11px'}}>The above figure means out of total attempted units, 14% are Mastered, 8% are Proficient, 15% are Developing and 64% are in Critical zone.</p>
                                <p style={{fontSize:'11px'}}> <b>Note:</b> Proficiency may not total 100% due to rounding.</p>
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '100%' }}>
                        {classesLoading ? (
                        <Skeleton width="100%" height="40px" />
                        ) : (
                            <ProgressBar style={{ height: '40px', borderRadius: '10px' }}>
                                <ProgressBar
                                    now={teacher_proficiency_level?.proficiency * 100 || 0}
                                    key={1}
                                    style={{ backgroundColor: '#9DCA45' }}
                                    label={<span style={{ fontSize: '14px', fontWeight: '700' }}>{Math.floor(teacher_proficiency_level?.proficiency * 100) || 0}%</span>}
                                />
                                <ProgressBar
                                    now={teacher_proficiency_level?.developing * 100 || 0}
                                    key={2}
                                    style={{ backgroundColor: '#FFCA28' }}
                                    label={<span style={{ fontSize: '14px', fontWeight: '700' }}>{Math.floor(teacher_proficiency_level?.developing * 100) || 0}%</span>}
                                />
                                <ProgressBar
                                    now={teacher_proficiency_level?.critical * 100 || 0}
                                    key={3}
                                    style={{ backgroundColor: '#FD6845' }}
                                    label={<span style={{ fontSize: '14px', fontWeight: '700' }}>{Math.floor(teacher_proficiency_level?.critical * 100) || 0}%</span>}
                                />
                            </ProgressBar>
                        )}
                    </div>
                    <div className="Report-chart-Legend">
                        <p style={{ fontSize: '12px' }}><span style={{ backgroundColor: '#24AD60' }}></span>Master</p>
                        <p style={{ fontSize: '12px' }}><span style={{ backgroundColor: '#9DCA45' }}></span> Proficient</p>
                        <p style={{ fontSize: '12px' }}><span style={{ backgroundColor: '#FFCA28' }}></span> Developing</p>
                        <p style={{ fontSize: '12px' }}><span style={{ backgroundColor: '#FD6845' }}></span> Critical</p>
                    </div>
                </div>

                <div className="reportpercent-two-container" >

                    <div className="reportpercentbg2" >
                        <div className='metric-title-container' >
                            <span className='metric-title'>Completion</span>

                            <div className="tch_repo_tooltip-container">
                                <Image src={Issue} alt="Issue" width={20} height={20} />
                                <div className="tch_repo_tooltip">
                                    <h3>Completion</h3>
                                    <p>% of topics attempted by students out of total assigned topics across all sections</p>
                                </div>
                            </div>

                        </div>
                        <div className='dfjs reportmainpercent'>
                            {classesLoading ? (
                                <div className='dfjs' style={{width:'100%'}}>
                                    <Skeleton width="60px" height="40px" />
                                    <Skeleton width="50px" height="45px"  borderRadius="50%" />
                                </div>
                            ) : (
                                <>
                                    <p style={{ color: '#3EA8FF' }}> {Math.floor(completion * 100) || '0'}%</p>
                                    <div style={{ width: 50 }}>
                                        <CircularProgressbar
                                            value={completion * 100 || 0}
                                            strokeWidth={25}
                                            styles={buildStyles({
                                                pathColor: `#3EA8FF`,
                                                textColor: '#3EA8FF',
                                                trailColor: '#DAE1E8',
                                            })}
                                        />
                                    </div>
                                </>
                            )} 
                        </div>
                    </div>

                    <div className="reportpercentbg3" onClick={() => setShowPopup(true)}>
                        <div className='metric-title-container'>
                            <span className='metric-title'>Accuracy</span>

                            <div className="tch_repo_tooltip-container">
                                <Image src={Issue} alt="Issue" width={20} height={20} />
                                <div className="tch_repo_tooltip">
                                    <h3>Accuracy</h3>
                                    <p>% of correct attempts in topic quizzes across all sections</p>
                                </div>
                            </div>
                        </div>
                        <div className='dfjs reportmainpercent'>
                            {classesLoading ? (
                                <div className='dfjs' style={{width:'100%'}}>
                                    <Skeleton width="60px" height="40px" />
                                    <Skeleton width="50px" height="45px"  borderRadius="50%" />
                                </div>
                            ) : (
                                <>
                                    <p style={{ color: '#1C4CC3' }}>{Math.floor(accuracy?.overall_accuracy * 100) || 0}% </p>
                                    <Image src={ReportVector} alt="ReportVector" width={50} height={50} />
                                </>
                            )} 
                        </div>
                    </div>
                </div>



                {/* Growth */}
                {/* <div className="class-card reportpercentbg3">
                    <div className='dfa mb20' style={{ gap: '5px' }}>
                        <span cmetric-title>Growth</span>
                        <div className="tch_repo_tooltip-container">
                            <Image src={Issue} alt="Issue" width={20} height={20} />
                            <div className="tch_repo_tooltip">
                                <h3>Growth</h3>
                                <p>Number of level ups achieved in Proficiency.</p>
                            </div>
                        </div>
                    </div>
                    <div className='dfjs reportmainpercent'>
                        <p style={{ color: '#24AD60' }}>{growth} <span style={{ fontWeight: '400', fontSize: '11px', color: '#535353' }}>level up(s)</span></p>
                        <Image src={ReportGrow} alt="ReportGrow" width={40} height={40} />
                    </div>
                </div> */}

            </div>

            <div className="class-overview-header mt20">
                <div className="classheading">
                    <h2>Subject Overview</h2>
                </div>
                <div className="dropdown-container">
                    {classesLoading ? (
                    <Skeleton width="250px" height="40px" />
                    ) : (
                        <Select
                            instanceId="class-select"
                            value={selectedSubject}
                            onChange={handleSubjectSelect}
                            options={subject_list?.map(subject => ({ label: subject, value: subject }))}
                            placeholder="Select Subject:"
                            styles={customStyles}
                            isSearchable={false}
                            components={{ DropdownIndicator: () => <FiChevronDown /> }}
                        />
                    )}     
                </div>
            </div>

            {/* Grade Tab Section */}
            <div className="gradetab-toggle">
                {classesLoading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} style={{display:'flex', gap:'10px' , margin:'5px'}}>
                                <Skeleton width="180px" height="40px" />
                            </div>
                        ))
                    ) : (
                        <>
                        {gradesToRender?.map((grade, index) => (
                            <div
                                key={index}
                                className={`grades ${selectedGrade === grade ? "active" : ""}`}
                                onClick={() => handleGradeSelection(grade)}
                            >
                                Grade {grade}
                            </div>
                        ))}
                    </>
                )}  
            </div>

            <div className="bar-chart-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    
                    {classesLoading ? (
                        <Skeleton width="180px" height="35px" />
                    ) : (
                        <h3 className="chart-title" style={{ margin: '0px', fontSize: '16px', fontWeight: '700', color: '#6166AE' }}>
                            Grade {selectedGrade}
                        </h3>
                    )} 
                    
                    <div className="class-tabs">

                    {classesLoading ? (
                        Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} style={{margin:'2px'}}>
                                <Skeleton width="50px" height="20px" />
                            </div>
                        ))
                    ) : (
                        <>  
                            <button
                            className={`tab-button ${selectedClass === 'All' ? 'active' : ''}`}
                            onClick={() => setSelectedClass('All')}
                            >
                                All
                            </button>
                            {sectionNames.map((sectionName, index) => (
                                <button
                                    key={index}
                                    className={`tab-button ${selectedClass === sectionName ? 'active' : ''}`}
                                    onClick={() => setSelectedClass(sectionName)}
                                >
                                    {sectionName}
                                </button>
                            ))}
                        </>
                    )} 


                       
                    </div>
                </div>

                {classesLoading ? (
                    <Skeleton width="100%" height="400px" />
                ) : (
                    <ResponsiveContainer width="100%" height={450}>
                        <BarChart
                            data={filteredData}
                            margin={{ top: 20, left: 20, right: 30, bottom: 40 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis
                                dataKey="name"
                                interval={0}
                                height={60}
                                tick={({ x, y, payload }) => {
                                    const { value } = payload;
                                    const truncatedValue = value.length > 15 ? value.substring(0, 15) + '...' : value;
                                    return (
                                        <g transform={`translate(${x},${y + 5})`}>
                                            <text
                                                x={0}
                                                y={0}
                                                dy={16}
                                                textAnchor="end"
                                                fill="#666"
                                                transform="rotate(-30)"
                                                style={{
                                                    fontSize: '12px',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                <tspan x="0" dy="10">{truncatedValue}</tspan>
                                            </text>
                                        </g>
                                    );
                                }}
                            />
                            
                            <YAxis
                                domain={[0, 100]}
                                tickFormatter={(tick) => `${tick}%`}
                            >
                                <Label
                                    value="Proficiency"
                                    angle={-90}
                                    position="outsideLeft"
                                    dx={-40}
                                    style={{
                                        textAnchor: "middle",
                                        fill: "#6166AE",
                                        fontWeight: "700",
                                    }}
                                />
                            </YAxis>

                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                content={({ payload }) => {
                                    if (!payload || payload.length === 0) return null;
                                    const data = payload[0].payload;
                                    return (
                                        <div style={{ padding: '10px', backgroundColor: '#fff', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.15)' }}>
                                            <p style={{ textAlign: 'center' }}>{data.name}</p>
                                            {Object.keys(data).map((key, index) => {
                                                if (key !== 'name') {
                                                    return (
                                                        <p key={index} style={{ margin: '2px 0', fontSize: '13px', color: '#6166AE' }}>
                                                            <samp> {key} :</samp> {data[key]}
                                                        </p>
                                                    );
                                                }
                                            })}
                                        </div>
                                    );
                                }}
                            />

                            {filteredData.length > 0 &&
                                Object.keys(filteredData[0])
                                    .filter(key => key !== 'name')
                                    .map((className, index) => (
                                        <Bar key={index} dataKey={className} fill={colors[index % colors.length]} />
                                    ))
                            }

                        </BarChart>
                    </ResponsiveContainer>
                )}

                {/* Chart Legend */}
                <div className="classoverview-chart-Legend ">
                {classesLoading ? (
                        Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} style={{margin:'2px'}}>
                                <Skeleton width="80px" height="20px" />
                            </div>
                        ))
                    ) : (
                    
                    <>
                        {filteredData.length > 0 && Object.keys(filteredData[0]).filter(key => key !== 'name').map((className, index) => (
                            <p key={index} style={{ fontSize: '12px' }}>
                                <span
                                    style={{
                                        backgroundColor: colors[index % colors.length],
                                        width: '15px',
                                        height: '15px',
                                        display: 'inline-block',
                                        marginRight: '5px',
                                    }}
                                ></span>
                                {className}
                            </p>
                        ))}
                    </>
                )} 

                </div>
            </div>


            <h2 className='gradeclassbox'>
                My Classes (0{classes?.classes?.length})
            </h2>

            <div className="chapter-cards">
                <div className="classes-container">

                    {classesLoading ? (
                        // Shimmer effect for loading
                        Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="chapter-card dfa g5" style={{ flexDirection:'row', width: '150px' }}>
                                <Skeleton width="35px" height="35px" />
                                <Skeleton width="100px" height="20px" />
                            </div>
                        ))
                    ) : (
                        classes?.classes?.map((classItem, index) => (
                            <div className="chapter-cards" key={index} onClick={() => handleClassClick(classItem.section_id, classItem.course_id)}
                                style={{ cursor: "pointer", margin: '0px' }}>
                                <div className="custom-class-card">
                                    <div className="custom-card-content">
                                        <div className="custom-icon-container">
                                            <Image src={classItem.icon} alt={`${classItem.class_name} Icon`} width={40} height={40} />
                                        </div>
                                        <div className="custom-text-container">
                                            <h3 className="custom-class-name">{classItem.class_name}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>


            <div className="toggle-buttons">
                <button
                    className={`toggle-button ${activeTab === "ongoing" ? "active" : ""}`}
                    onClick={() => handleTabChange("ongoing")}
                >
                    Ongoing Chapters ({AssignedChapter?.total_ongoing_chapters})
                </button>
                <button
                    className={`toggle-button ${activeTab === "ended" ? "active" : ""}`}
                    onClick={() => handleTabChange("ended")}
                >
                    Recently Ended Chapter ({AssignedChapter?.total_recent_ended_chapters})
                </button>
            </div>
            {/* Display Cards Based on Active Tab */}
            <div className="chapter-cards">

                {classesLoading ? (
                    // Shimmer effect for loading
                    Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="chapter-card">
                            <div  className='dfjs g10'>
                                <div className="icon-container">
                                    <Skeleton width="30px" height="30px" borderRadius="50%" />
                                </div>
                                <div className="class-cont" style={{ textAlign: 'left' }}>
                                    <Skeleton width="80px" height="20px"/>
                                    <Skeleton width="120px" height="15px" style={{ marginTop: '5px' }}  />
                                </div>
                            </div>
                                <Skeleton width="80%" height="15px" style={{ marginTop: '10px' }} />
                            <div  className='dfjs g10' style={{width:'100%'}}>
                                <Skeleton width="90%" height="20px" style={{ marginTop: '10px' }} />
                                <Skeleton circle width="50px" height="45px" borderRadius="50%"  style={{ marginTop: '15px' }} />
                            </div>
                            <div  className='g10' style={{width:'100%' , display:"flex", justifyContent:'flex-end' }}>
                                <Skeleton width="80px" height="25px"/>
                                <Skeleton width="80px" height="25px"/>
                            </div>
                        </div>
                    ))
                ) : (
                data.length === 0 ? (
                    <div className="unlock-box">
                        {activeTab === "ongoing" && (
                        <div className="unlock-content" onClick={() => handleUpcommingChapterNavigation()}>
                            <div className="unlock-icon">
                            <Image src={UnlockIcon} alt='unlock icon' width={40} height={40} />
                            </div>
                            <div className="unlock-text">
                            <h3>Unlock the Chapter</h3>
                            <p>Click here to unlock the chapter</p>
                            </div>
                        </div>
                        )}
                        {activeTab === "ended" && (
                        <div className="unlock-content">
                            <div className="unlock-icon">
                            <Image src={UnlockIcon} alt='unlock icon' width={40} height={40} />
                            </div>
                            <div className="unlock-text">
                            <p>You have not ended any chapter yet!</p>
                            </div>
                        </div>
                        )}
                    </div>
                    ) : (
                    data.map((chapter, index) => (
                        <div key={index} className="chapter-card">
                            <div className='dfjs' style={{ width: '100%', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', gap: '2px' }}>
                                    <div style={{ height: '40px', width: '50px', marginLeft: '-5px' }}>
                                        <Image src={chapter.icon} alt="book" width={50} height={50} />
                                    </div>
                                    <div>
                                        <h4 className="chapter-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '200px', display: 'inline-block' }}>{chapter.name}</h4>
                                        <p className="class-students">{chapter.class}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="chapter-details">
                                <p className="class-chapters">
                                    <Image src={BookAlt} alt='book' width={15} height={15} /> Assigned Topics: <span style={{ color: '#6166AE' }}>{chapter.assigned_topic_count}</span>
                                </p>
                                <div className="teacher-progress" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                                    <div style={{ flex: 1 }}>
                                        <div className="progress-header">
                                            <p className="learning-index-label" style={{ fontSize: '14px' }}>Proficiency</p>
                                        </div>
                                        <div style={{ width: '100%' }}>
                                            <ProgressBar style={{ height: '18px', borderRadius: '3px' }}>
                                                <ProgressBar now={chapter.proficiency_level?.master * 100} style={{ backgroundColor: '#24AD60' }} label={<span style={{ fontSize: '8px', fontWeight: '700' }}>{Math.floor(chapter.proficiency_level?.master * 100)}%</span>} />
                                                <ProgressBar now={chapter.proficiency_level?.proficiency * 100} style={{ backgroundColor: '#9DCA45' }} label={<span style={{ fontSize: '8px', fontWeight: '700' }}>{Math.floor(chapter.proficiency_level?.proficiency * 100)}%</span>} />
                                                <ProgressBar now={chapter.proficiency_level?.developing * 100} style={{ backgroundColor: '#FFCA28' }} label={<span style={{ fontSize: '8px', fontWeight: '700' }}>{Math.floor(chapter.proficiency_level?.developing * 100)}%</span>} />
                                                <ProgressBar now={chapter.proficiency_level?.critical * 100} style={{ backgroundColor: '#FD6845' }} label={<span style={{ fontSize: '8px', fontWeight: '700' }}>{Math.floor(chapter.proficiency_level?.critical * 100)}%</span>} />
                                            </ProgressBar>
                                        </div>
                                    </div>
                                    <div className="concept-reach" style={{ flexDirection: "column" }} >
                                        <span style={{ fontSize: '10px', color: '#949494', fontWeight: '600' }}>Completion</span>
                                        <div style={{ width: 50 }}>
                                            <CircularProgressbar
                                                strokeWidth={9}
                                                value={chapter.completion != null ? (chapter.completion * 100) : 0}
                                                text={chapter.completion != null ? `${(chapter.completion * 100).toFixed(0)}%` : "0%"}
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
                                <div className="chapter-card-buttons">
                                    <button className="end-chapter-button" onClick={() => handleChapterReportClick(chapter.section_id, chapter.course_id, chapter.id, chapter.grade)}>
                                        View Chapter Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                    )
                )}
            </div>

            {/* Modal Popup */}
            <Modal show={showPopup} onHide={() => setShowPopup(false)} centered>
                <div className="tch-modal-content">

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
            {isLoader ? <Loader /> : ""}
        </div>
    );
};

export default Reports;
