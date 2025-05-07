'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ReportIcon from '../../../../public/images/teacher/ReportIcon.svg';
import BookAlt from '../../../../public/images/teacher/book-alt.svg';
import CLTIcon from '../../../../public/images/teacher/CLTIcon.svg';
import Skeleton from '../../components/Skeleton';
import { useRouter } from "next/navigation";
import { QuickEndChapter, fetchQuickEndChapterData } from '../../api/teacherAPI';
import { useTeacherClasses } from '../../hooks/teacher/useTeacherClasses';
import { useTeacherAssignedChapter } from '../../hooks/teacher/useTeacherAssignedChapter';
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import UnlockIcon from '../../../../public/images/teacher/UnlockIcon.svg';
import Loader from "../../components/teacher/Loader";


const MainContent = () => {
  const router = useRouter();

  // State to manage various conditions for the UI and data
  const [checkAssigned, setCheckAssigned] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classId, setClassId] = useState(0);
  const [courseId, setCourseId] = useState(0);
  const [chapterId, setChapterId] = useState(0);
  const [classNamePopup, setClassName] = useState('');
  const [chapterNamePopup, setChapterName] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState("ongoing");
  const [quickChapterData, setQuickChapterData] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const [isAssigned, setIsAssigned] = useState(false);
  const [isCheckboxVisible, setIsCheckboxVisible] = useState(false);
  const [isVisible, setIsvisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  // Fetching data related to teacher's classes and assigned chapters using custom hooks
  const { classes, loading: classesLoading, error: classesError } = useTeacherClasses();
  const { AssignedChapter, loading: assignedChapterLoading, error: assignedChapterError, refetch } = useTeacherAssignedChapter();
  
  // Effect hook to update class and chapter names when AssignedChapter data changes
  useEffect(() => {
    if (AssignedChapter?.ongoing_chapters?.length > 0) {
      setChapterName(AssignedChapter.ongoing_chapters[0].chapter_name);
      setClassName(AssignedChapter.ongoing_chapters[0].class_name);
    }

    if (!assignedChapterLoading) {
      setIsLoader(false);
    }
  }, [AssignedChapter]); // Runs only when AssignedChapter changes

  // Data mapping for ongoing chapters
  const ongoingChaptersData = AssignedChapter?.ongoing_chapters?.map((chapter) => ({
    id: chapter.chapter_id,
    name: chapter.chapter_name,
    class: chapter.class_name,
    classId: chapter.section_id,
    courseId: chapter.course_id,
    assignedTopics: `${chapter.assigned_topic_count} / ${chapter.total_topic_count}`,
    learningIndex: chapter.learning_index,
    completion: chapter.completion,
    icon: chapter.icon,
    proficiency_level: chapter.proficiency_level,
    grade: chapter.grade
  })) || [];

  // Data mapping for recently ended chapters
  const endedChaptersData = AssignedChapter?.recent_ended_chapters?.map((chapter) => ({
    id: chapter.chapter_id,
    name: chapter.chapter_name,
    class: chapter.class_name,
    classId: chapter.section_id,
    courseId: chapter.course_id,
    assignedTopics: `${chapter.assigned_topic_count} / ${chapter.total_topic_count}`,
    learningIndex: chapter.learning_index,
    completion: chapter.completion,
    icon: chapter.icon,
    proficiency_level: chapter.proficiency_level,
    grade: chapter.grade
  })) || [];

  // Effect hook to manage the client-side rendering state
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Return nothing until the component is fully rendered on the client-side
  }

  // Handles the navigation when a class is clicked
  const handleClassClick = (sectionId, courseId) => {
    setIsLoader(true);
    router.push(`/teacher/class_overview?class_id=${sectionId}&course_id=${courseId}`);
  };

  // Redirects to the chapter details page
  const handleRedirect = (chapterid, classId, courseId) => {
    setIsLoader(true);
    router.push(`/teacher/chapter_details?chapter_id=${chapterid}&class_id=${classId}&course_id=${courseId}`);
  }

  // Fetches details of a specific chapter when clicked
  const handleQuickEndDetails = async (chapterId, classId, courseId, chapterName, className) => {
    console.log('chapterName', chapterName);
    setIsLoader(true);
    setClassId(classId);
    setCourseId(courseId);
    setChapterId(chapterId);
    setChapterId(chapterId);
    setClassName(className);
    setChapterName(chapterName);
    try {


      const response = await fetchQuickEndChapterData(classId, courseId, chapterId);
      const hasUnassignedTopics = response.data.topics.some(topic => topic.topic_assigned === false);

      setCheckAssigned(hasUnassignedTopics);
      setIsAssigned(response.data.is_assigned);
      setIsCheckboxVisible(response.data.is_checkbox_visible);
      setIsvisible(response.data.is_visible);
      setIsDisabled(response.data.is_disabled);
      setQuickChapterData(response);
      setIsModalOpen(true);

    } catch (err) {
      toast.error('Error chapter details. Please try again.');
      console.error('Error chapter details', err);
    } finally {
      setIsLoader(false);
    }
  }

  // Handles the completion of a chapter by updating the topics and setting milestone
  const handleQuickEndChapter = async (chapterId, classId, courseId, isAssigned) => {
    setIsLoader(true);
    const topicIds = quickChapterData?.data?.topics?.filter(topic => topic.topic_assigned === false).map(topic => topic.topic_id) || [];

    try {
      const response = await QuickEndChapter(classId, chapterId, topicIds, isAssigned);
    } catch (err) {
      // toast.error('Error chapter details. Please try again.');
      console.error('Error chapter details', err);
    } finally {
      setIsLoader(false);
      refetch();
      setIsModalOpen(false);
    }
    setIsModalOpen(false);
  }

  // Handles the navigation to the chapter report page
  const handleChapterReportClick = (classId, courseId, chapterid, grade) => {
    setIsLoader(true);
    router.push(`reports/chapterdetails/?class_id=${classId}&course_id=${courseId}&chapter_id=${chapterid}&grade=${grade}&tab=performance`);
  };

  // Selects the appropriate chapter data based on the active tab (ongoing/ended)
  const chapters = activeTab === "ongoing" ? ongoingChaptersData : endedChaptersData;

  // Navigates to the upcoming chapter overview page
  const handleUpcommingChapterNavigation = () => {
    setIsLoader(true);
    router.push(`/teacher/class_overview/upcoming_chapters?class_id=${classes?.classes[0]?.section_id}&course_id=${classes?.classes[0]?.course_id}`);
  };


  return (
    <div className="main-content">
      <div className="my-classes-section">
        <h3 className="section-title">My Classes</h3>
        <div className="classes-container">
          {classesLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="class-card " style={{ height: "90px", marginBottom: "15px" }}>
                <div  className='dfjs g10'>
                  <div className="icon-container">
                    <Skeleton width="30px" height="30px" borderRadius="50%" />
                  </div>
                  <div className="class-cont" style={{ textAlign: 'left' }}>
                    <Skeleton width="80px" height="20px"/>
                    <Skeleton width="120px" height="15px" style={{ marginTop: '5px' }}  />
                  </div>
                </div>
                <Skeleton width="200px" height="15px" />
              </div>
            ))
          ) : (
            classes?.classes?.map((classItem, index) => (
              <div
                key={index}
                className="class-card"
                onClick={() => handleClassClick(classItem.section_id, classItem.course_id)}
                style={{ cursor: "pointer" }}
              >
                <div style={{ display: "flex", gap: "5px" }}>
                  <div style={{ height: '40px', width: '50px', marginLeft: '-5px' }} >
                    <Image
                      src={`${classItem.icon}`}
                      alt={`${classItem.class_name} Icon`}
                      width={50}
                      height={50}
                    />
                  </div>
                  <div className="class-cont">
                    <h4 className="class-name">{classItem.class_name}</h4>
                    <p className="class-students">Total Students: {classItem.student_count}</p>
                  </div>
                </div>
                <p className="class-chapters">
                  <Image src={BookAlt} alt="book" width={15} height={15} />
                  Remaining Chapters: {classItem.upcoming_chapters_count}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="toggle-buttons">
        <button
          onClick={() => setActiveTab("ongoing")}
          className={`toggle-button ${activeTab === "ongoing" ? "active" : ""}`}
        >
          Ongoing Chapter ({AssignedChapter?.total_ongoing_chapters})
        </button>
        <button
          onClick={() => setActiveTab("ended")}
          className={`toggle-button ${activeTab === "ended" ? "active" : ""}`}
        >
          Last Ended Chapter({AssignedChapter?.total_recent_ended_chapters})
        </button>
      </div>


      <div className="chapter-cards">
        {/* {(activeTab === "ongoing" ? ongoingChaptersData : endedChaptersData).map( */}
        {/* // (chapter, index) => ( */}
        {assignedChapterLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="chapter-card" style={{ width: '32%' }}>
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

          chapters.length === 0 ? (
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
            chapters.map((chapter, index) => (


              <div key={index} className="chapter-card">

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
                    <Image src={ReportIcon} className='cp' alt="Assignment Icon" width={40} height={40} onClick={() => handleChapterReportClick(chapter.classId, chapter.courseId, chapter.id, chapter.grade)} />
                </div>
                <div className="chapter-details">
                  <p className="class-chapters">
                    <Image src={BookAlt} alt='book' width={15} height={15} /> Assigned Topics: {chapter.assignedTopics}
                  </p>
                  {/* Progress Bars */}
                  <div className="teacher-progress" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>

                    <div className='df' style={{ flex: 1 }}>
                      <p className="learning-index-label" style={{ fontSize: "15px" }}>Proficiency</p>
                      <div style={{ width: '100%' }}>
                        <ProgressBar style={{ height: '15px', borderRadius: '5px' }}>
                          <ProgressBar now={chapter.proficiency_level?.master * 100} style={{ backgroundColor: '#24AD60' }} label={<span style={{ fontSize: '10px', fontWeight: '700' }}>{Math.floor(chapter.proficiency_level?.master * 100)}%</span>} />
                          <ProgressBar now={chapter.proficiency_level?.proficiency * 100} style={{ backgroundColor: '#9DCA45' }} label={<span style={{ fontSize: '10px', fontWeight: '700' }}>{Math.floor(chapter.proficiency_level?.proficiency * 100)}%</span>} />
                          <ProgressBar now={chapter.proficiency_level?.developing * 100} style={{ backgroundColor: '#FFCA28' }} label={<span style={{ fontSize: '10px', fontWeight: '700' }}>{Math.floor(chapter.proficiency_level?.developing * 100)}%</span>} />
                          <ProgressBar now={chapter.proficiency_level?.critical * 100} style={{ backgroundColor: '#FD6845' }} label={<span style={{ fontSize: '10px', fontWeight: '700' }}>{Math.floor(chapter.proficiency_level?.critical * 100)}%</span>} />
                        </ProgressBar>
                      </div>
                    </div>
                    <div className="concept-reach" style={{flexDirection:"column"}} >
                      <span style={{fontSize:'10px' , color:'#949494' , fontWeight:'600'}}>Completion</span>
                      <div style={{ width: 50 }}>
                      <CircularProgressbar
                        value={chapter.completion != null ? (chapter.completion * 100) : 0}
                        text={chapter.completion != null ? `${(chapter.completion * 100).toFixed(0)}%` : "0%"}
                        styles={buildStyles({
                          textSize: '24px',
                          pathColor: `#6166AE`,
                          textColor: '#6166AE',
                          trailColor: '#E0E0E0',
                        })}
                      />
                      </div>
                    </div>
                  </div>
                  <div className="chapter-card-buttons">
                    {activeTab === "ongoing" ? (
                      <button
                        className="view-details-button"
                        onClick={() => handleRedirect(chapter.id, chapter.classId, chapter.courseId)}
                      >
                        View Details
                      </button>

                    ) : (
                      <button className="view-report-button" onClick={() => handleChapterReportClick(chapter.classId, chapter.courseId, chapter.id, chapter.grade)}>View Report</button>
                    )}
                    {activeTab === "ongoing" && (
                      <button className="end-chapter-button" onClick={() => handleQuickEndDetails(chapter.id, chapter.classId, chapter.courseId, chapter.name, chapter.class)}>End Chapter</button>
                    )}
                  </div>
                </div>
              </div>

            ))
          )
        )}
      </div>


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
                          text={topic.topic_completion_reach == null ? '0' : `${topic.topic_completion_reach * 100}%`}
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

              {/* <div className="milestone-section topic-title mb20 mt20">
                <div className="assignment">
                  <Image src={CLTIcon} className="icon-container" alt="Assignment Icon" width={20} height={20} />
                  <div className='df'>
                    <p className="chapter-name" style={{ fontSize: '18px', color: '#5E5E5E' }}>Milestone</p>
                    <p className="subheading"> {quickChapterData?.data?.milestone_questions_count} Questions</p>
                  </div>
                </div>
                <input type="checkbox" className="select-topic-checkbox" disabled checked/>
              </div> */}
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
            <div className="modal-buttons" style={{ marginTop: '0px' }}>
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

export default MainContent;
