'use client';
import React, { useState, useEffect, PureComponent, useMemo } from 'react';
import Select from 'react-select';
import { FiChevronDown } from 'react-icons/fi';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Label, Legend } from 'recharts';
import Image from 'next/image';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import CO1 from '../../../../public/images/teacher/CO1.svg';
import CO2 from '../../../../public/images/teacher/CO2.svg';
import CO3 from '../../../../public/images/teacher/CO3.svg';
import CO4 from '../../../../public/images/teacher/CO4.svg';
import ReportIcon from '../../../../public/images/teacher/ReportIcon.svg';
import PhysicsIcon from '../../../../public/images/teacher/Chemistry.svg';
import MathsIcon from '../../../../public/images/teacher/Maths.svg';
import BookAlt from '../../../../public/images/teacher/book-alt.svg';
import CLTIcon from '../../../../public/images/teacher/CLTIcon.svg';
import DataAnalytics from '../../../../public/images/teacher/DataAnalyticsHover.svg';
import UnlockIcon from '../../../../public/images/teacher/UnlockIcon.svg';
import { Chart } from "react-google-charts";
import { useRouter } from "next/navigation";
import { useTeacherClassOverview } from '../../hooks/teacher/useTeacherClassOverview';
import { useChapterAssignTimeline } from '../../hooks/teacher/useChapterAssignTimeline';
import { useTeacherClassesList } from '../../hooks/teacher/useTeacherClassesList';
import Skeleton from '../../components/Skeleton';
import { fetchQuickEndChapterData, QuickEndChapter } from '../../api/teacherAPI';
import Loader from "../../components/teacher/Loader";

const ClassOverview = () => {

  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState(null);
  const [classId, setClassId] = useState(null);
  const [courseId, setCourseId] = useState(null);
  const [chapterId, setChapterId] = useState(0);
  const [checkAssigned, setCheckAssigned] = useState(false);
  const [activeTab, setActiveTab] = useState("ongoing");
  const [isClient, setIsClient] = useState(false);
  // const [classData, setClassData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quickChapterData, setQuickChapterData] = useState([]);
  const [classNamePopup, setClassName] = useState(''); // Example course ID
  const [chapterNamePopup, setChapterName] = useState('');
  const { classesList, loading: classesLoading, error: classesError } = useTeacherClassesList('', '');
  const ganttChartColors = ['#6166AE', '#FF8A00', '#8AB424', '#1C4CC3', '#192545'];
  const [isAssigned, setIsAssigned] = useState(false);
  const [isCheckboxVisible, setIsCheckboxVisible] = useState(false);
  const [isVisible, setIsvisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoader, setIsLoader] = useState(false);


  const classOptions = useMemo(() => {
    return classesList?.map((classData) => ({
      value: classData.class_name,
      label: classData.class_name,
      sectionId: classData.section_id,
      courseId: classData.course_id,
    })) || [];
  }, [classesList]); // Recalculate only when classesList changes

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const class_id = parseInt(searchParams.get('class_id'), 10);
    const course_id = parseInt(searchParams.get('course_id'), 10);

    if (class_id && course_id) {
      setClassId(class_id);
      setCourseId(course_id);
    }

    let classOption;

    // If class_id and course_id exist, find the matching option
    if (class_id && course_id) {
      classOption = classOptions.find(
        (option) => option.sectionId === class_id && option.courseId === course_id
      );
    }

    // If no match is found, select the first option in the list as fallback
    if (!classOption && classOptions.length > 0) {
      classOption = classOptions[0];
      // set courseid and classid
      setClassId(classOption.sectionId);
      setCourseId(classOption.courseId);
    }

    // Set the selected class option if found
    if (classOption) {
      setSelectedClass(classOption);
    }
  }, [classOptions]);

  const { classOverview, loading: classOverviewLoading, error: classOverviewError, refetch } = useTeacherClassOverview(classId, courseId);
  const { chapterTimeline, loading: chapterTimelineLoading, error: chapterTimelineError } = useChapterAssignTimeline(classId, courseId);

  useEffect(() => {
    if (classOverview?.ongoing_chapter) {
      setChapterName(classOverview.ongoing_chapter.chapter_name || "N/A");
      setClassName(classOverview.ongoing_chapter.class_name || "N/A");
    }
  }, [classOverview?.ongoing_chapter]); // Avoid unnecessary re-renders


  useEffect(() => {
    setIsClient(true);
  }, []);


  const statsData = [
    { title: "Total Students", value: classOverview?.students_count || 0, icon: CO1, link: '/teacher/class_overview/students' },
    { title: "Total Chapters", value: classOverview?.total_chapters_count || 0, icon: CO2, link: '/teacher/class_overview/chapters' },
    { title: "Upcoming Chapters", value: classOverview?.upcoming_chapters_count || 0, icon: CO3, link: '/teacher/class_overview/upcoming_chapters' },
    { title: "Completed Chapters", value: classOverview?.completed_chapters_count || 0, icon: CO4, link: '/teacher/class_overview/completed_chapters' },
  ];

  const chapterData = activeTab === "ongoing" && classOverview?.ongoing_chapter
    ? [
      {
        chapterId: classOverview?.ongoing_chapter?.chapter_id || 0,
        class_id: classOverview?.ongoing_chapter?.section_id || 0,
        course_id: classOverview?.ongoing_chapter?.course_id || 0,
        name: classOverview?.ongoing_chapter?.chapter_name || "N/A",
        class: classOverview?.ongoing_chapter?.class_name || "N/A",
        assignedTopics: `${classOverview?.ongoing_chapter?.assigned_topic_count || 0} / ${classOverview?.ongoing_chapter?.total_topic_count || 0}`,
        learningIndex: classOverview?.ongoing_chapter?.Learning_index || 0,
        completion: classOverview?.ongoing_chapter?.completion * 100 || 0,
        icon: classOverview?.ongoing_chapter?.icon || MathsIcon,
        grade: classOverview?.ongoing_chapter?.grade,
        proficiency_level: classOverview?.ongoing_chapter?.proficiency_level
      }
    ]
    : activeTab === "ended" && classOverview?.recent_ended_chapter
      ? [
        {
          chapterId: classOverview?.recent_ended_chapter?.chapter_id || 0,
          class_id: classOverview?.ongoing_chapter?.section_id || 0,
          course_id: classOverview?.ongoing_chapter?.course_id || 0,
          name: classOverview?.recent_ended_chapter?.chapter_name || "N/A",
          class: classOverview?.recent_ended_chapter?.class_name || "N/A",
          assignedTopics: `${classOverview?.recent_ended_chapter?.assigned_topic_count || 0} / ${classOverview?.recent_ended_chapter?.total_topic_count || 0}`,
          learningIndex: classOverview?.recent_ended_chapter?.Learning_index || 0,
          completion: classOverview?.recent_ended_chapter?.completion * 100 || 0,
          icon: classOverview?.recent_ended_chapter?.icon || PhysicsIcon,
          grade: classOverview?.recent_ended_chapter?.grade,
          proficiency_level: classOverview?.recent_ended_chapter?.proficiency_level
        }
      ]
      : [];

  const barChartDataCount = (classOverview?.ongoing_chapter?.students_attempted_readiness?.length || 0)
    + (classOverview?.ongoing_chapter?.students_not_attempted_readiness?.length || 0);

  const barChartData = activeTab === "ongoing" ? [
    {
      name: 'Readiness',
      Attempted: classOverview?.ongoing_chapter?.students_attempted_readiness?.length || 0,
      NotAttempted: classOverview?.ongoing_chapter?.students_not_attempted_readiness?.length || 0
    },
    {
      name: 'Quest',
      Attempted: classOverview?.ongoing_chapter?.students_attempted_quest?.length || 0,
      NotAttempted: classOverview?.ongoing_chapter?.students_not_attempted_quest?.length || 0
    }
  ] : [
    {
      name: 'Readiness',
      Attempted: classOverview?.recent_ended_chapter?.students_attempted_readiness?.length || 0,
      NotAttempted: classOverview?.recent_ended_chapter?.students_not_attempted_readiness?.length || 0
    },
    {
      name: 'Quest',
      Attempted: classOverview?.recent_ended_chapter?.students_attempted_quest?.length || 0,
      NotAttempted: classOverview?.recent_ended_chapter?.students_not_attempted_quest?.length || 0
    },
    // {
    //   name: 'Milestone',
    //   Attempted: classOverview?.recent_ended_chapter?.students_attempted_milestone?.length || 0,
    //   NotAttempted: classOverview?.recent_ended_chapter?.students_not_attempted_milstone?.length || 0
    // }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: "#ffffff",
          border: "1px solid #6166AE",
          borderRadius: "5px",
          padding: "10px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          fontSize: "14px",
          color: "#333",
        }}>
          <p style={{ fontWeight: "700", marginBottom: "5px", color: "#6166AE" }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.fill, margin: "2px 0", fontSize: "12px" }}>
              {entry.name}: <strong>{entry.value}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };


  const CustomBarLabel = ({ x, y, width, height, value, name, dataKey }) => {
    if (value === 0) return null; // Hide label if value is 0
    const nameToFind = name; // Change this dynamically
    const result = barChartData.find((item) => item.name === nameToFind);
    let labelvalue;
    if (dataKey == 'Attempted') {
      labelvalue = result?.Attempted;
    } else {
      labelvalue = result?.NotAttempted;
    }

    return (
      <text
        x={x + width / 2}
        y={y + height / 2}
        fill="#fff"
        fontSize={10}
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {labelvalue}
      </text>
    );
  };





  // Transform API response data into timelineData
  const timelineData = React.useMemo(() => {
    if (!Array.isArray(chapterTimeline) || chapterTimeline.length === 0) {
      return [
        [
          { type: "string", id: "Room" },
          { type: "string", id: "Name" },
          { type: "date", id: "Start" },
          { type: "date", id: "End" },
          { type: "string", role: "tooltip", p: { html: true } },
        ],
      ];
    }

    const stripTime = (timestamp) => {
      const date = new Date(timestamp * 1000);
      // return new Date(date.getFullYear(), date.getMonth(), date.getDate());
      return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());

    };

    const formattedData = chapterTimeline.map((chapter) => [
      "Start & End", // Static room name
      chapter.chapter_name,
      stripTime(chapter.start_date), // Start date
      stripTime(chapter.end_date),   // End date
      `<div style="padding: 10px;">
                <p>${chapter.chapter_name}</p><br/>
                <span>Start: ${stripTime(chapter.start_date).toLocaleDateString()}</span><br/>
                <span>End: ${stripTime(chapter.end_date).toLocaleDateString()}</span>
            </div>`, // Custom tooltip with only dates
    ]);

    return [
      [
        { type: "string", id: "Room" },
        { type: "string", id: "Name" },
        { type: "date", id: "Start" },
        { type: "date", id: "End" },
        { type: "string", role: "tooltip", p: { html: true } },
      ],
      ...formattedData,
    ];
  }, [chapterTimeline]);


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


  // Timeline Chart Options
  const timelineOptions = {
    timeline: {
      showRowLabels: false,
      barLabelStyle: { fontSize: 16, color: "#3B3B3B", bold: false },
    },
    avoidOverlappingGridLines: false,
    tooltip: {
      isHtml: true, // Allows for custom HTML tooltips
      trigger: "focus",
    },
    selectionMode: "none",
    focusTarget: "none",
    // enableInteractivity: false, 
    hAxis: {
      // format: "MMM dd",
      format: "dd",
      // ticks: [timelineData[1][2], timelineData[timelineData.length - 1][3]],
    },
    backgroundColor: "transparent",
    colors: ganttChartColors,
    selection: false,
  };



  if (!isClient) {
    return null;
  }

  // Handle class selection and update state
  const handleClassSelect = (selectedOption) => {
    setClassId(selectedOption.sectionId);
    setCourseId(selectedOption.courseId);
    setSelectedClass(selectedOption);
  };


  const handleViewDetails = (chapterId, classId, courseId) => {
    setIsLoader(true);
    router.push(`/teacher/chapter_details?chapter_id=${chapterId}&class_id=${classId}&course_id=${courseId}`);
  };


  const handleNavigation = (link) => {
    setIsLoader(true);
    router.push(`${link}?class_id=${classId}&course_id=${courseId}`);
  };

  const handleUpcommingChapterNavigation = () => {
    setIsLoader(true);
    router.push(`/teacher/class_overview/upcoming_chapters?class_id=${classId}&course_id=${courseId}`);
  };

  const handleQuickEndDetails = async (chapterId, classId, courseId) => {
    setChapterId(chapterId);
    setIsLoader(true);
    try {
      const response = await fetchQuickEndChapterData(classId, courseId, chapterId);
      const hasUnassignedTopics = response.data.topics.some(topic => topic.topic_assigned === false);

      setCheckAssigned(hasUnassignedTopics);
      setQuickChapterData(response);

      setIsAssigned(response.data.is_assigned);
      setIsCheckboxVisible(response.data.is_checkbox_visible);
      setIsvisible(response.data.is_visible);
      setIsDisabled(response.data.is_disabled);

      setIsModalOpen(true);

    } catch (err) {
      // toast.error('Error chapter details. Please try again.');
    } finally {
      setIsLoader(false);
      // setIsAssignModalOpen(false);
    }

    // const response = await updateEndedChapter(chapterId, courseId, classId, topic_ids, isCLTChecked, isMilestoneVisible);

  }

  const handleQuickEndChapter = async (chapterId, classId, courseId, isAssigned) => {
    // const topicIds = quickChapterData?.data?.topics?.map(topic => topic.topic_id) || [];
    setIsLoader(true);
    const topicIds = quickChapterData?.data?.topics
      ?.filter(topic => topic.topic_assigned === false) // Filter only unassigned topics
      .map(topic => topic.topic_id) || [];
    try {
      const response = await QuickEndChapter(classId, chapterId, topicIds, isAssigned);
      // setIsModalOpen(true);
    } catch (err) {
      // toast.error('Error chapter details. Please try again.');
    } finally {
      refetch();
      setIsLoader(false);
      setIsModalOpen(false);
    }
    setIsModalOpen(false);
  }

  const handleChapterReportClick = (classId, courseId, chapterid, grade) => {
    setIsLoader(true);
    router.push(`reports/chapterdetails/?class_id=${classId}&course_id=${courseId}&chapter_id=${chapterid}&grade=${grade}&tab=performance`);
  };

  const handleClassClick = (class_id, course_id) => {
    setIsLoader(true);
    router.push(`reports/classdetails/?class_id=${class_id}&course_id=${course_id}`);
  };

  return (
    <div className="class-overview-container">
      {/* {classesLoading || classOverviewLoading || chapterTimelineLoading ? <Skeleton height="50px" /> : ''} */}

      {/* Header Section */}
      <div className="class-overview-header">
        <div className="classheading">
          {classesLoading ? (
            <Skeleton width="200px" height="40px" />
          ) : (
            <h2>
              {selectedClass
                ? `${selectedClass.value}`
                : 'Select Class'}
            </h2>
          )}
        </div>
        <div className="dropdown-container">
          {classesLoading ? (
            <Skeleton width="250px" height="40px" />
          ) : (
            <Select
              instanceId="class-select"
              value={selectedClass}
              onChange={handleClassSelect}
              options={classOptions}
              placeholder="Select Class"
              styles={customStyles}
              isSearchable={false}
              components={{ DropdownIndicator: () => <FiChevronDown /> }}
            />
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-container">
        {classOverviewLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="summary-box"
            >
              <div className='dfjs g10'>
                <div className="skeletonNone">
                  <Skeleton width="40px" height="40px" />
                </div>
                <div className="class-cont" style={{ textAlign: 'left' }}>
                  <Skeleton width="100px" height="20px" />
                  <Skeleton width="80px" height="25px" style={{ marginTop: '5px' }} />
                </div>
              </div>
            </div>
          ))
        ) : (
          statsData.map((stat, index) => (
            <div
              key={index}
              className="summary-box"
              onClick={() => handleNavigation(stat.link)}
              style={{ cursor: 'pointer' }}
            >
              <div className='dfjs g10'>
                <div className='summary-box-img'>
                  <Image src={stat.icon} alt={stat.title} width={50} height={50} />
                </div>
                <div className="class-cont" style={{ textAlign: 'left' }}>
                  <p className="class-students" style={{ fontSize: '13px' }}>{stat.title}</p>
                  <h4 className="class-name" style={{ fontSize: '24px' }}>{stat.value}</h4>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Toggle Section */}
      <div className="toggle-section">
        <div className="toggle-buttons" style={{ width: 'auto' }}>
          <button
            onClick={() => setActiveTab('ongoing')}
            className={`toggle-button ${activeTab === 'ongoing' ? 'active' : ''}`}
          >
            Ongoing Chapter
          </button>
          <button
            onClick={() => setActiveTab('ended')}
            className={`toggle-button ${activeTab === 'ended' ? 'active' : ''}`}
          >
            Last Ended Chapter
          </button>
        </div>
        <div className="toggle-section-right" onClick={() => handleClassClick(classId, courseId)} style={{ cursor: "pointer" }}>
          {/* <Skeleton width="25px" height="25px" /> */}
          <Image src={DataAnalytics} alt='Data Analytics Icon' width={25} height={25} />
          <span>View Grade - Section Reports</span>
        </div>
      </div>

      {/* Chapter Cards Section */}
      <div className="chapter-container">
        {classOverviewLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="classoverview-chapter-card">
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
        ) : chapterData.length === 0 ? (
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
          chapterData.map((chapter, index) => (
            <div key={index} className="classoverview-chapter-card" >
              <div className='dfjs' style={{ width: '100%', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  <div style={{ height: '40px', width: '50px', marginLeft: '-5px' }} >
                    <Image src={chapter.icon} alt={`${chapter.name} Icon`} width={50} height={50} />
                  </div>
                  <div>
                    <h4 className="chapter-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '200px', display: 'inline-block' }}>{chapter.name}</h4>
                    <p className="class-students">{chapter.class}</p>
                  </div>
                </div>
                  <Image src={ReportIcon} className='cp' alt="Assignment Icon" width={40} height={40} onClick={() => handleChapterReportClick(classId, courseId, chapter.chapterId, chapter.grade)} />
              </div>
              <p className="class-chapters">
                <Image src={BookAlt} alt="book" width={15} height={15} /> Assigned Topics: {chapter.assignedTopics}
              </p>
              <div className="progress-section">
                <div style={{ flex: 1 }}>
                  <div className='df'>
                    <p className="learning-index-label" style={{ fontSize: "15px" }}>Proficiency</p>
                    <div style={{ width: '100%' }}>
                      <ProgressBar style={{ height: '15px', borderRadius: '5px' }}>
                        <ProgressBar now={chapter.proficiency_level?.master * 100} style={{ backgroundColor: '#24AD60' }} label={<span style={{ fontSize: '7px', fontWeight: '700' }}>{Math.floor(chapter.proficiency_level?.master * 100)}%</span>} />
                        <ProgressBar now={chapter.proficiency_level?.proficiency * 100} style={{ backgroundColor: '#9DCA45' }} label={<span style={{ fontSize: '7px', fontWeight: '700' }}>{Math.floor(chapter.proficiency_level?.proficiency * 100)}%</span>} />
                        <ProgressBar now={chapter.proficiency_level?.developing * 100} style={{ backgroundColor: '#FFCA28' }} label={<span style={{ fontSize: '7px', fontWeight: '700' }}>{Math.floor(chapter.proficiency_level?.developing * 100)}%</span>} />
                        <ProgressBar now={chapter.proficiency_level?.critical * 100} style={{ backgroundColor: '#FD6845' }} label={<span style={{ fontSize: '7px', fontWeight: '700' }}>{Math.floor(chapter.proficiency_level?.critical * 100)}%</span>} />
                      </ProgressBar>
                    </div>
                  </div>
                </div>

                <div className="concept-reach" style={{ flexDirection: "column" }} >
                  <span style={{ fontSize: '10px', color: '#949494', fontWeight: '600' }}>Completion</span>
                  <div style={{ width: 50 }}>
                    <CircularProgressbar
                      value={Math.floor(chapter.completion)}
                      text={`${Math.floor(chapter.completion)}%`}
                      styles={buildStyles({
                        textSize: '24px',
                        pathColor: '#6166AE',
                        textColor: '#6166AE',
                        trailColor: '#e0e0e0',
                      })}
                    />
                  </div>
                </div>
              </div>
              <div className="chapter-card-buttons" style={{ marginTop: '30px' }}>
                {activeTab == 'ongoing' ? (
                  <button className="view-details-button" onClick={() => handleViewDetails(chapter.chapterId, classId, courseId)}>
                    View Details
                  </button>
                ) : (
                  <button className="view-report-button" onClick={() => handleChapterReportClick(classId, courseId, chapter.chapterId, chapter.grade)}>View Report</button>
                )}
                {activeTab == 'ongoing' && <button className="end-chapter-button" onClick={() => handleQuickEndDetails(chapter.chapterId, classId, courseId)} >End Chapter</button>}
              </div>
            </div>

          ))
        )}

        {/* Bar Chart Section */}

        {chapterData.length > 0 && (

          <div className="classoverview-chart-container">
            {classOverviewLoading ? (
              <Skeleton height="170px" />
            ) : (
              <>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                  <h3 className="chart-title">
                    Student Attempts  ({activeTab === 'ongoing' ? 'Ongoing Chapter' : 'Last Ended Chapter'})
                  </h3>
                  <div className="classoverview-chart-Legend">
                    <p style={{ fontSize: '12px' }}><span style={{ backgroundColor: '#9DCA45' }}></span> Attempted</p>
                    <p style={{ fontSize: '12px' }}><span style={{ backgroundColor: '#FF8A00' }}></span> Not Attempted</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={barChartData} layout="vertical" barCategoryGap="10%" barSize={15}>
                    <CartesianGrid horizontal={false} vertical={true} strokeDasharray="3 3" />
                    <XAxis type="number" tick={{ fontSize: 12 }} domain={[0, barChartDataCount]}>
                      <Label
                        value="No. of Students"
                        position="insideBottom"
                        offset={-2}
                        style={{ fill: '#6166AE', fontWeight: '700', textAnchor: 'middle' }}
                      />
                    </XAxis>
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 12, fontWeight: 'bold', color: '#949494' }}
                      width={80}
                    />

                    <Tooltip content={<CustomTooltip />} />

                    <Bar dataKey="Attempted" stackId="combined" fill="#9DCA45"
                      label={<CustomBarLabel dataKey="Attempted" />}
                    />

                    <Bar dataKey="NotAttempted" stackId="combined" fill="#FF8A00"
                      label={<CustomBarLabel dataKey="NotAttempted" />}
                    />

                  </BarChart>
                </ResponsiveContainer>
              </>
            )}
          </div>

        )}


      </div>

      {/* Gantt Chart Replacement Section */}


      {timelineData.length > 1 && (
        <div className="gantt-chart-container chapter-card" style={{ width: '100%', marginTop: '20px' }}>
          <h3 className="gantt-chart-heading">Chapter Assigning Timeline</h3>
          {chapterTimelineLoading ? (
            <Skeleton height="130px" />
          ) : (
            <Chart
              chartType="Timeline"
              data={timelineData}
              width="100%"
              height="130px"
              options={timelineOptions}
            />
          )}
        </div>

      )}
      {isModalOpen && (
        <div className="tch-modal-overlay">
          <div className="tch-modal-content" style={{ padding: '0px' }}>
            <div className="tch-modal-content-header">
              <h2>
                {checkAssigned
                  ? "Do you want to end this chapter and assign the milestone along with all the unassigned topics?"
                  : "Do you want to end this chapter and assign the milestone?"}
              </h2>
              <div className="chapter-title">
                <span style={{ color: '#fff' }}> {chapterNamePopup}</span>
                <span className="chapter-class">{classNamePopup}</span>
              </div>
            </div>
            <div className="chapter-topics-section chapter-info">

              {quickChapterData?.data?.topics?.map((topic, index) => (
                <div key={index} className="chapter-topics-line">
                  <p style={{width:'70%'}}>{topic.topic_name}</p>

                  {(topic.topic_assigned == true) ?
                    <div className="concept-reach" >
                      <span>Completion Rate</span>
                      <div style={{ width: 40, height: 40 }}>

                        <CircularProgressbar
                          value={topic.topic_completion_reach == null ? 0 : topic.topic_completion_reach * 100}
                          text={topic.topic_completion_reach == null ? '0%' : `${topic.topic_completion_reach * 100}%`}
                          styles={buildStyles({
                            textSize: '24px',
                            pathColor: `#6166AE`,
                            textColor: '#6166AE',
                            trailColor: '#E0E0E0',
                          })}
                        />
                      </div>
                    </div>
                    : <div className="resources-info">
                      <span className="unassigned-btn" >Unassigned</span>
                    </div>
                  }

                </div>
              ))}



              {isVisible && (
                <div className="milestone-section topic-title mb20 mt20">
                  <div className="assignment">
                    <Image src={CLTIcon} className="icon-container" alt="Assignment Icon" width={20} height={20} />
                    <div className='df'>
                      <p className="chapter-name" style={{ fontSize: '18px', color: '#5E5E5E' }}>Milestone</p>
                      <p className="subheading"> {quickChapterData?.data?.milestone_questions_count} Questions</p>
                    </div>
                  </div>

                  {isCheckboxVisible && (
                    <input
                      type="checkbox"
                      className="select-topic-checkbox"
                      disabled={isDisabled}
                      checked={isAssigned}
                      onChange={(e) => setIsAssigned(e.target.value)}
                    />
                  )}
                </div>
              )}
            </div>
            <div className="modal-buttons">
              <button onClick={() => setIsModalOpen(false)} className="modal-no-button">No</button>
              <button onClick={() => { handleQuickEndChapter(chapterId, classId, courseId, isAssigned); }} className="modal-yes-button">Yes</button>

            </div>
          </div>
        </div>
      )}
      {isLoader ? <Loader /> : ""}
    </div>
  );
};

export default ClassOverview;
