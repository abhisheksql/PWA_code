"use client";
import '../../../../public/style/teacher.css';
import React, { useState, useEffect, use, useMemo } from "react";
import Select from "react-select";
import { FiChevronDown  } from "react-icons/fi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import Image from "next/image";
import Left from "../../../../public/images/teacher/left.svg";
import AssignmentIcon from "../../../../public/images/teacher/Quiz.svg";
import VideoIcon from "../../../../public/images/teacher/Videos.svg";
import Up from "../../../../public/images/teacher/up.svg";
import Down from "../../../../public/images/teacher/Down.svg";
import DataAnalytics from "../../../../public/images/teacher/DataAnalyticsHover.svg";
import {useRouter } from "next/navigation";
import { useChapterData } from "../../hooks/teacher/useChapterData";
import { toast } from "react-toastify";
import { startChapter } from "../../api/teacherAPI";
import { updateEndedChapter } from "../../api/teacherAPI";
import { UpdateAssignChapter } from "../../api/teacherAPI";
import { fetchQuestionList } from "../../api/teacherAPI";
import { updateEndedChapterTopic } from "../../api/teacherAPI";
import Loader from "../../components/teacher/Loader";
import Skeleton from "../../components/Skeleton";
import axiosInstance from '../../auth';
import { MathJax, MathJaxContext } from "better-react-mathjax";

const Mensuration = () => {
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState(null);
  const [dueDate, setDueDate] = useState("");
  const [dueDateTopic, setDueDateTopic] = useState("");
  const [startDate, setStartDate] = useState("");
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const { ChapterData, loading, error, fetchData } = useChapterData();
  const [isLoader, setIsLoader] = useState(false);
  const [selectedTopicIds, setSelectedTopicIds] = useState([]);
  const [chapterId, setChapterId] = useState(null);
  const [classId, setClassId] = useState(null);
  const [courseId, setCourseId] = useState(null);
  const [isModalEndConfirmation, setisModalEndConfirmation] = useState(false);
  const [classOptionsData, setClassOptionsData] = useState([]);
  const [grade, setGrade] = useState(null);
  const [subject, setSubject] = useState(null);
  const [isMilestoneVisible, setIsMilestoneVisible] = useState(false);
  const [dummyQuestions, setDummyQuestions] = useState([]);
  const [isCRQChecked, setIsCRQChecked] = useState(false);
  const [isCLTChecked, setIsCLTChecked] = useState(false);
  const [isAllTopicsAssigned, setIsAllTopicsAssigned] = useState(true);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [quizType,setQuizType] = useState('');

  useEffect(() => {
    if (ChapterData?.end_confirmation_disabled !== undefined) {
      setIsMilestoneVisible(ChapterData.end_confirmation);
    }
  }, [ChapterData]);

  useEffect(() => {
    if (ChapterData?.crq?.is_assigned !== undefined) {
      setIsCRQChecked(ChapterData.crq.is_assigned);
    }
    if (ChapterData?.clt?.is_assigned !== undefined) {
      setIsCLTChecked(ChapterData.clt.is_assigned);
    }
    if (ChapterData?.grade !== null && ChapterData?.grade !== '') {
      setGrade(ChapterData?.grade);
    }
    if (ChapterData?.subject !== null && ChapterData?.subject !== '') {
      setSubject(ChapterData?.subject);
    }

  }, [ChapterData]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const class_id = parseInt(searchParams.get("class_id"), 10);
    const course_id = parseInt(searchParams.get("course_id"), 10);
    const chapter_id = parseInt(searchParams.get("chapter_id"), 10);

    if (class_id && course_id && chapter_id) {
      setClassId(class_id);
      setCourseId(course_id);
      setChapterId(chapter_id);
      fetchData(class_id, course_id, chapter_id);
    }
  }, []);


  useEffect(() => {
    setIsLoader(true);
    const fetchClasses = async () => {
      try {
        const response = await axiosInstance.get(
          `/teacherapis/classes/list/?grade=${ChapterData?.grade}&course_id=${courseId}`
        );

        if (response.status === 200) {
          const classOptions = response?.data?.data?.map((classData) => ({
            value: classData.class_name,
            label: classData.class_name,
            sectionId: classData.section_id,
            courseId: classData.course_id,
          }));

          if (classOptions.length > 0) {
            setClassOptionsData(classOptions);
          }
        }
      } catch (err) {
        console.error("Error fetching classes:", err);
      } finally {
        setIsLoader(false);
      }
    };

    if (courseId && ChapterData?.grade) {
      fetchClasses();
    }
  }, [ChapterData?.grade, courseId]);

  const openAssignModal = () => {
    setIsAssignModalOpen(true);
  };

  // Function to close the modal
  const closeAssignModal = () => {
    setIsAssignModalOpen(false);
  };

  const handleDropdownChange = (selectedOption) => {

    const newSectionId = selectedOption.sectionId;
    const newCourseId = selectedOption.courseId;

    setSelectedClass(selectedOption);  // Update selected class
    if (newSectionId && newCourseId && chapterId) {
      setClassId(newSectionId);
      setCourseId(newCourseId);
      setChapterId(chapterId);
      fetchData(newSectionId, newCourseId, chapterId);
    }
  };

  const handleStartChapter = async () => {
    setIsLoader(true);
    try {
      const topic_ids = selectedTopicIds;
      if (!topic_ids.length) {
        console.warn("No topics selected, sending an empty topic_ids array");
      }
      let timestamp = null;
      if (dueDate && dueDate !== "") {
        const date = new Date(dueDate);
        timestamp = Math.floor(date.getTime() / 1000); // Convert to seconds
      }
      const payload = {
        chapter_id: chapterId,
        course_id: courseId,
        section_id: classId,
        topic_ids,
        ...(isCRQChecked && { is_CRQ_available: true }),
        ...(dueDate && { chapter_due_date: timestamp }),
      };

      const response = await startChapter(
        classId,
        courseId,
        chapterId,
        payload
      );

      if (classId && courseId && chapterId) {
        fetchData(classId, courseId, chapterId);
      }
    } catch (err) {
      // toast.error("Error starting chapter. Please try again.");
      console.error("Error starting chapter:", err);
    } finally {
      setIsLoader(false);
      setIsAssignModalOpen(false);
    }
  };

  const handleAssignTopic = async (endConfirmationValue) => {
    setIsLoader(true);
    const topic_ids = selectedTopicIds.filter(
      (id) =>
        !ChapterData?.topics?.find(
          (topic) => topic.topic_id === id && topic.is_assigned
        )
    );

    if (!endConfirmationValue) {
      if (!topic_ids.length) {
        setIsLoader(false);
        console.warn("No topics selected, sending an empty topic_ids array");
        toast.error('Atleast 1 topic is required to assign');
        setIsAssignModalOpen(false);
        return;
      }
    }
    setIsLoader(true);

    try {

      let timestamp = null;
      if (dueDate && dueDate !== "") {
        const date = new Date(dueDate);
        timestamp = Math.floor(date.getTime() / 1000); // Convert to seconds
      }

      const payload = {
        chapter_id: chapterId,
        section_id: classId,
        topic_ids,
        ...(dueDate && { chapter_due_date: timestamp }),
        ...(endConfirmationValue == true && { end_Confirmation: true }),
      };

      const response = await UpdateAssignChapter(payload);

      if (classId && courseId && chapterId) {
        fetchData(classId, courseId, chapterId);
      }

      if (response.status >= 200 && response.status < 300) {
        router.push(`/teacher/class_overview?class_id=${classId}&course_id=${courseId}`);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error("Error assigning chapter:", err);
    } finally {
      setIsLoader(false);
      setIsAssignModalOpen(false);
    }
  };

  const handleTopicSelection = (event, topicId) => {
    if (event.target.checked) {
      setSelectedTopicIds((prevSelected) => [...prevSelected, topicId]);
    } else {
      setSelectedTopicIds((prevSelected) =>
        prevSelected.filter((id) => id !== topicId)
      );
    }
  };

  const handleSelectAllChange = (e) => {
    const isChecked = e.target.checked;
    setSelectAllChecked(isChecked);
  
    // Select or deselect all topics
    if (isChecked) {
      setSelectedTopicIds(ChapterData?.topics?.map((topic) => topic.topic_id));
    } else {
      setSelectedTopicIds([]);
    }
  };
  useEffect(() => {
    if (ChapterData?.topics?.length === selectedTopicIds.length) {
      setSelectAllChecked(true);
    } else {
      setSelectAllChecked(false);
    }
  }, [selectedTopicIds, ChapterData?.topics?.length]);
  
  

  const customStyles = {
    control: (base) => ({
      ...base,
      border: "1px solid #6166AE",
      boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
      padding: "5px",
      cursor: "pointer",
      "&:hover": {
        borderColor: "#6166AE",
      },
    }),

    valueContainer: (base) => ({
      ...base,
      padding: "5px 15px",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#949494",
      fontSize: "16px",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#3B3B3B",
      fontSize: "16px",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#6166AE",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),

    option: (styles, { isSelected, isFocused }) => ({
      ...styles,
      backgroundColor: isSelected
        ? "#6166AE26"
        : isFocused
          ? "rgba(246, 246, 246, 1)"
          : "white",
      color: isSelected ? "#6166AE" : "#000",
      cursor: "pointer",
      ":hover": {
        backgroundColor: "#6166AE26",
        color: "#6166AE",
      },
    }),
  };

  const handleClassSelect = async (
    newSectionId,
    newCourseId,
    selectedOption
  ) => {
    if (newSectionId !== classId || newCourseId !== courseId) {
      setClassId(newSectionId);
      setCourseId(newCourseId);
      setSelectedClass(selectedOption);

      const data = await fetchData(newSectionId, newCourseId, chapterId);
      if (!data || Object.keys(data).length === 0) {
        console.warn("Fetched data is empty. Resetting ChapterData.");
      }
    }
  };

  const openEndChapterModal = async () => {
    setIsLoader(true);

    const topic_ids = selectedTopicIds.filter(
      (id) =>
        !ChapterData?.topics?.find(
          (topic) => topic.topic_id === id && topic.is_assigned
        )
    );

    let timestamp = null;
    if (dueDateTopic && dueDateTopic !== "") {
      const date = new Date(dueDateTopic);
      timestamp = Math.floor(date.getTime() / 1000);
    }
    console.log(timestamp, "timestamp");
    try {
      const response = await updateEndedChapter(
        chapterId,
        courseId,
        classId,
        topic_ids,
        isCLTChecked,
        timestamp
        // isMilestoneVisible
      );
      if (response.status_code >= 200 && response.status_code < 300) {
        router.push(
          `/teacher/class_overview?class_id=${classId}&course_id=${courseId}`
        );
      }
    } catch (err) {
      console.error("Error Ended Chapter:", err);
    } finally {
      setIsLoader(false);
      setIsAssignModalOpen(false);
    }
  };

  useEffect(() => {
    if (ChapterData?.topics?.length !== 0) {
      const assignedTopicIds = ChapterData?.topics
        ?.filter((topic) => topic.is_assigned)
        .map((topic) => topic.topic_id);

      if (assignedTopicIds?.length > 0) {
        setSelectedTopicIds(assignedTopicIds);
      }
    }
  }, [ChapterData?.topics]);

  useEffect(() => {
    const futureDate = new Date();

    if (ChapterData?.due_date) {
      const formattedDate = new Date(ChapterData.due_date * 1000)
        .toISOString()
        .split("T")[0];
      setDueDate(formattedDate);
      // setDueDateTopic(formattedDate);
    }else{
      futureDate.setDate(futureDate.getDate() + 14); // Add 18 days
      const formattedFutureDate = futureDate.toISOString().split("T")[0];
      setDueDate(formattedFutureDate);

    }
    
    futureDate.setDate(futureDate.getDate() + 7); // Add 18 days
    const formattedTopicDate = futureDate.toISOString().split("T")[0];
    setDueDateTopic(formattedTopicDate);

    if (ChapterData?.start_date) {
      const formattedDate = new Date(ChapterData.start_date * 1000)
        .toISOString()
        .split("T")[0];
      setStartDate(formattedDate);
    }
  }, [ChapterData]);

  useEffect(() => {

    if (ChapterData?.all_topics_assigned === true) {
      setIsMilestoneVisible(true);
    }

    const hasUnassignedTopics = ChapterData?.topics?.some(
      (topic) => topic.topic_status === false
    );
    setIsAllTopicsAssigned(hasUnassignedTopics);
  }, [ChapterData]);

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;

    // Update the local state
    setisModalEndConfirmation(isChecked);
    setIsMilestoneVisible(isChecked);
  };

  const [view, setView] = useState("teacher");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const class_id = parseInt(searchParams.get("class_id"), 10);
    const course_id = parseInt(searchParams.get("course_id"), 10);
    const chapter_id = parseInt(searchParams.get("chapter_id"), 10);
    if (class_id && course_id && chapter_id) {
      fetchData(class_id, course_id, chapter_id);
    }
  }, []);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < dummyQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowAnswer(false);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowAnswer(false);
    }
  };

  const toggleShowAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  const handleQuestionData = async (class_id, chapter_id, course_id, topic_id, type) => {
    setIsLoader(true);
    setView('teacher');
    setCurrentQuestionIndex(0);

    const transformApiResponse = (apiResponse) => {
      if (!apiResponse || !apiResponse.data || !apiResponse.data.questions) {
        return [];
      }

      return apiResponse.data.questions.map((q) => ({
        solution: q.correct_solution.map((sol) => sol.content).join(' '), // Combine solution content
        question: q.questiontext.map((text) => text.content).join(' '), // Combine question content
        options: q.options.map((opt) => ({
          optiontext: opt.optiontext.map((text) => text.content).join(' '), // Combine option text content
          option: opt.options,
        })),
        correct: q.options.find((opt) => opt.options === q.correctoption)?.optiontext.map((text) => text.content).join(' ') || "",
        isLatex: q.is_latex, // Include latex flag
        correct_option : q.correctoption
      }));
    };

    try {
      const response = await fetchQuestionList(class_id, chapter_id, course_id, topic_id, type);

      const transformedData = transformApiResponse(response);

      let quiz_type =
      type == "PE"
        ? "Quest"
        : type == "CLT"
        ? "Milestone"
        : type == "CRQ"
        ? "Readiness"
        : "";

      setQuizType(quiz_type);
      setSelectedAssignment(transformedData);
      setDummyQuestions(transformedData);
    } catch (err) {
      console.error("Error fetching chapter details:", err);
    } finally {
      setIsLoader(false);
    }
  };

  const handleCompletetopic = async () => {
    setIsLoader(true);
    try {
      const topic_ids = selectedTopicIds.filter(
        (id) =>
          !ChapterData?.topics?.find(
            (topic) => topic.topic_id === id && topic.is_assigned
          )
      );

      let timestamp = null;
      if (dueDateTopic && dueDateTopic !== "") {
        const date = new Date(dueDateTopic);
        timestamp = Math.floor(date.getTime() / 1000); // Convert to seconds
      }
      const payload = {
        chapter_id: chapterId,
        course_id: courseId,
        section_id: classId,
        topic_ids,
        // ...(isCLTChecked && { is_CLT_available: true }),
      };

      const response = await updateEndedChapterTopic(payload);

      if (classId && courseId && chapterId) {
        fetchData(classId, courseId, chapterId);
      }
    } catch (err) {
      console.error("Error starting chapter:", err);
    }  finally {
      setIsLoader(false);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const class_id = parseInt(searchParams.get('class_id'), 10);
    const course_id = parseInt(searchParams.get('course_id'), 10);

    let classOption;

    if (class_id && course_id) {
      classOption = classOptionsData.find(
        (option) => option.sectionId === class_id && option.courseId === course_id
      );
    }

    if (!classOption && classOptionsData.length > 0) {
      classOption = classOptionsData[0];
    }

    if (classOption) {
      setSelectedClass(classOption);
    }
  }, [classOptionsData]);

  const mathJaxConfig = {
    tex: {
      inlineMath: [["$", "$"], ["\\(", "\\)"]],
    },
    startup: {
      typeset: true,
    },
    options: {
      enableMenu: false,  // Disable the right-click menu
      renderActions: {
        addMenu: [], // Disable the menu
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const container = document.getElementById("mathjax-options-wrapper");
      if (container && window.MathJax?.typesetPromise) {
        window.MathJax.typesetPromise([container]).catch((err) =>
          console.error("MathJax typesetting failed:", err)
        );
      }
    }, 200);
  
    return () => clearTimeout(timer);
  }, [currentQuestionIndex, showAnswer]);
  
  
  const handleChapterReportClick = (classId, courseId, chapterid, grade) => {
    setIsLoader(true);
    router.push(`reports/chapterdetails/?class_id=${classId}&course_id=${courseId}&chapter_id=${chapterid}&grade=${grade}&tab=performance`);
  };
  const handleBackButtonClick = () => {
    setIsLoader(true);
    router.back()
};
  return (
    <div id="mathjax-options-wrapper">
      <MathJaxContext config={mathJaxConfig}>
    <div className="class-overview-container">
      {loading ? (
        <>
          <div className="chapterdetails-header">
            <div className="classheading">
              <Skeleton width={150} height={25} />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <div className="toggle-section-right">
                <Skeleton circle width={25} height={25} />
                <Skeleton width={120} height={20} />
              </div>
              <Skeleton width={200} height={40} />
            </div>
          </div>

          <div className="chart-section topic-title mb20">
            <Skeleton width="100%" height={50} />
          </div>

          <div className="topics-section">
            <h3 className="section-title">
              <Skeleton width={150} height={20} />
            </h3>
            <div className="topics-container">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="topic-item chart-section">
                  <div className="topic-header">
                    <div className="topic-title">
                      <Skeleton width={200} height={20} />
                    </div>
                    <div className="topic-info">
                      <Skeleton width={150} height={15} />
                    </div>
                  </div>
                  <div className="topic-details">
                    <Skeleton width="90%" height={15} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="action-section topic-title mt30">
            <Skeleton width={150} height={40} style={{ marginRight: "10px" }} />
            <Skeleton width={150} height={40} />
          </div>
        </>
      ) : (
        <>
          <div className="chapterdetails-header">
            <div className="classheading">
              <button  onClick={handleBackButtonClick}>
                <Image src={Left} alt="Back Icon" width={20} height={20} />
              </button>
              <h2>{ChapterData?.chapter_name}</h2>{" "}
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <div className="toggle-section-right" onClick={() => handleChapterReportClick(ChapterData.class_id, ChapterData.course_id, ChapterData.chapter_id, ChapterData.grade)}>
                <Image
                  src={DataAnalytics}
                  alt="Data Analytics Icon"
                  width={25}
                  height={25}
                />
                <span>View Reports</span>
              </div>
              <div className="dropdown-container">
                <Select
                  instanceId="class-select"
                  value={selectedClass}
                  onChange={handleDropdownChange}
                  options={classOptionsData}
                  placeholder="Select Class"
                  styles={customStyles}
                  isSearchable={false}
                  components={{ DropdownIndicator: () => <FiChevronDown /> }}
                />
              </div>

            </div>
          </div>

          {ChapterData && Object.keys(ChapterData).length > 0 ? (
            <>
              <div className="chart-section topic-title mb20">
                {ChapterData?.crq?.is_visible && (
                  <>
                    <div className="assignment">
                      <div style={{ height: '40px', width: '50px', marginLeft: '-5px' }} >
                        <Image src={ChapterData?.crq?.image} alt="Assignment Icon" width={50} height={50} />
                      </div>

                      <div
                        className="df"
                        onClick={() => {
                          handleQuestionData(
                            ChapterData.class_id,
                            ChapterData.chapter_id,
                            ChapterData.course_id,
                            null,
                            "CRQ"
                          );
                        }}
                      >
                        <p
                          className="chapterdetails-Chapter-name-big"
                        >
                          {ChapterData?.crq?.name}
                        </p>
                        <p className="subheading">
                          {/* Mensuration -{" "} */}
                          {ChapterData?.chapter_name} -{" "}
                          <span style={{ color: "#6166AE", fontWeight: "600", cursor: "pointer" }} onClick={() => {
                            handleQuestionData(
                              ChapterData.class_id,
                              ChapterData.chapter_id,
                              ChapterData.course_id,
                              null,
                              "CRQ"
                            );
                          }}>
                            {ChapterData?.crq?.questions_count} Questions
                          </span>
                        </p>
                      </div>
                    </div>
                    {ChapterData?.crq.is_checkbox_visible && (
                      <input
                        type="checkbox"
                        className="select-topic-checkbox"
                        defaultChecked={ChapterData?.crq?.is_assigned}
                        disabled={ChapterData?.crq?.is_disabled}
                        checked={isCRQChecked}
                        onChange={(e) => setIsCRQChecked(e.target.checked)} // Update state on change
                      />
                    )}
                  </>
                )}
              </div>

              {/* Topics Section */}
              <div className="topics-section">

                <div className='dfjs'>
                  <h3 className="section-title">
                    Topics ({ChapterData?.topics.length})
                  </h3>

                  <div className='dfa g10'>
                    <h4 className="section-title" style={{margin:'0px', fontSize:'16px'}}> Select All </h4>
                    <input
                      type="checkbox"
                      className="select-topic-checkbox"
                      checked={selectAllChecked}
                      onChange={handleSelectAllChange}
                    />
                  </div>

                </div>
          
              


                <div className="topics-container">
                  {ChapterData?.topics?.map((topic, index) => (
                    <div key={index} className="topic-item chart-section">
                      <div className="topic-header">
                        <div
                          className="topic-title"
                          onClick={() =>
                            setExpandedTopic(
                              expandedTopic === index ? null : index
                            )
                          }
                        >
                          <Image
                            src={expandedTopic === index ? Up : Down}
                            className={`toggle-icon icon-container ${expandedTopic === index ? "expanded" : ""
                              }`}
                            alt={
                              expandedTopic === index
                                ? "Collapse Icon"
                                : "Expand Icon"
                            }
                            width={20}
                            height={20}
                            style={{ cursor: "pointer" }}
                          />
                          <span
                            className="chapterdetails-Chapter-name"
                          >
                            {topic.topic_name}
                          </span>
                        </div>
                        <div className="topic-info">
                          <div className="resources-info">
                            <span className="class-students fw">
                              Assignment - {topic.assignments.length}
                            </span>
                            {/* if multimedias length is greater than 0 then show */}
                            {topic.multimedias.length > 0 && (
                              <>
                                <span className="vertical-line"></span>
                                <span className="class-students fw">
                                  Multimedia - {topic.multimedias.length}
                                </span>
                              </>
                            )}
                          </div>
                          <div className="topic-status">
                            {topic.topic_status === null ? (
                              ""
                            ) : topic.topic_status ? (
                              <span className="assigned fw">Assigned</span>
                            ) : (
                              <span className="unassigned fw">Unassigned</span>
                            )}
                          </div>
                          <input
                            type="checkbox"
                            className="select-topic-checkbox"
                            onChange={(e) =>
                              handleTopicSelection(e, topic.topic_id)
                            }
                            checked={selectedTopicIds.includes(topic.topic_id)}
                            disabled={topic.is_disabled}
                          />
                        </div>
                      </div>
                      {expandedTopic === index && (
                        <div className="topic-details">
                          {/* Assignments Section */}
                          {topic.assignments.length > 0 && (
                            <div className="assignments">
                              <h4
                                className="chapter-name"
                                style={{
                                  fontSize: "14px",
                                  color: "#949494",
                                  margin: "10px 0",
                                }}
                              >
                                Assignments
                              </h4>
                              {topic.assignments.map((assignment, idx) => (
                                <div key={idx} className="assignment">
                                  <Image
                                    src={AssignmentIcon}
                                    className="icon-container"
                                    alt="Assignment Icon"
                                    width={20}
                                    height={20}
                                  />
                                  <div className="df">
                                    <p
                                      className="chapterdetails-Chapter-name-big"
                                      onClick={() => {
                                        handleQuestionData(
                                          ChapterData.class_id,
                                          ChapterData.chapter_id,
                                          ChapterData.course_id,
                                          topic.topic_id,
                                          "PE"
                                        );
                                      }}
                                    >
                                      {assignment.name}
                                    </p>
                                    <p className="subheading">
                                      {topic.topic_name} -
                                      <span style={{ color: "#6166AE", fontWeight: "600", cursor: "pointer" }}
                                        onClick={() => {
                                          handleQuestionData(
                                            ChapterData.class_id,
                                            ChapterData.chapter_id,
                                            ChapterData.course_id,
                                            topic.topic_id,
                                            "PE"
                                          );
                                        }}>
                                        {assignment?.question_count} Questions
                                      </span>
                                      {assignment.description}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Multimedia Section */}
                          {topic.multimedias.length > 0 && (
                            <div className="multimedia">
                              <h4
                                className="chapter-name"
                                style={{
                                  fontSize: "14px",
                                  color: "#949494",
                                  margin: "10px 0",
                                }}
                              >
                                Multimedia
                              </h4>
                              {topic.multimedias.map((media, idx) => {

                                return (
                                  <div key={idx} className="media-item">
                                    <Image
                                      src={VideoIcon}
                                      className="icon-container"
                                      alt="Multimedia Icon"
                                      width={20}
                                      height={20}
                                    />
                                    <div className="df">
                                      <p
                                        className="chapterdetails-Chapter-name-big"
                                        onClick={() =>
                                          setSelectedMedia({
                                            name: "Sample Video",
                                            url: media.url,
                                            topicName: topic.topic_name,
                                            count:
                                              topic?.assignments[0]?.question_count,
                                          })
                                        }
                                      >
                                        {media.name}
                                      </p>
                                      <p className="subheading">
                                        {topic.topic_name}
                                        {media.description}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* add condition if chapter_status is completed also */}
              {(ChapterData?.chapter_status === "ongoing" ||
                ChapterData?.chapter_status === "completed") && (
                  <div
                    className="chart-section topic-title mb20"
                    style={{ backgroundColor: "rgba(97, 102, 174, 0.4)" }}
                  >
                    <div className="assignment">
                      <p
                        className="chapter-name"
                        style={{ fontSize: "18px", color: "#383838" }}
                      >
                        Has this chapter been completed in class?
                      </p>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        className="select-topic-checkbox"
                        onChange={handleCheckboxChange} // Handle toggle
                        checked={isMilestoneVisible} // Bind to local state
                        disabled={ChapterData?.end_confirmation_disabled} // Dynamically disable based on API
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                )}
              {isMilestoneVisible &&
                ChapterData?.clt &&
                ChapterData?.clt.is_visible && (
                  <>
                    <h3 className="section-title">{ChapterData?.clt.name}</h3>
                    <div className="chapterdetails-mileston-container">
                      <div className="assignment">
                        <div style={{height:'30px' , width:'50px' , marginLeft:'-5px' , marginTop:'-5px'}}>
                        <Image
                          src={ChapterData?.clt?.image}
                          // className="icon-container"
                          alt="Assignment Icon"
                          width={50}
                          height={50}
                        />
                        </div>
                        <div
                          className="df"
                          onClick={() => {
                            handleQuestionData(
                              ChapterData.class_id,
                              ChapterData.chapter_id,
                              ChapterData.course_id,
                              null,
                              "CLT"
                            );
                          }}
                        >
                          <p
                            className="chapterdetails-Chapter-name-big"
                          >
                            {ChapterData?.clt.name}
                          </p>
                          <p className="subheading">
                            {ChapterData?.chapter_name} -{" "}
                            <span style={{ color: "#6166AE", fontWeight: "600", cursor: "pointer" }} onClick={() => {
                              handleQuestionData(
                                ChapterData.class_id,
                                ChapterData.chapter_id,
                                ChapterData.course_id,
                                null,
                                "CLT"
                              );
                            }} >
                              {ChapterData?.clt?.questions_count
                                ? ChapterData?.clt?.questions_count
                                : 0}{" "}
                              Questions
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="dfa" style={{ gap: "20px" }}>
                        {ChapterData?.chapter_status === "completed" ? null :
                          <div className="due-date dfa" style={{ gap: "5px" }}>
                            <label htmlFor="due-date">Due Date</label>
                            <input
                              type="date"
                              id="due-date"
                              value={dueDateTopic}
                              onChange={(e) => setDueDateTopic(e.target.value)}
                              min={
                                startDate && !isNaN(startDate)
                                  ? new Date(startDate * 1000).toISOString().split("T")[0]
                                  : new Date().toISOString().split("T")[0]
                              }

                            />
                          </div>
                        }
                        {/* add condition if ChapterData?.clt.is_checkbox_visible false then do not show checkbox */}
                        {ChapterData?.clt.is_checkbox_visible && (
                          <input
                            type="checkbox"
                            className="select-topic-checkbox"
                            defaultChecked={ChapterData?.clt?.is_assigned}
                            disabled={ChapterData?.clt?.is_disabled}
                            checked={isCLTChecked}
                            onChange={(e) => setIsCLTChecked(e.target.checked)} // Update state on change
                          />
                        )}
                      </div>
                    </div>
                  </>
                )}
              <div className="action-section topic-title mt30">
                <div className="due-date df">
                  {isMilestoneVisible ? null : (
                    <>
                      <label htmlFor="due-date">Due Date</label>
                      <input
                        type="date"
                        id="due-date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        // min={new Date().toISOString().split("T")[0]} // Disable past dates
                        min={
                          startDate && !isNaN(startDate)
                            ? new Date(startDate * 1000).toISOString().split("T")[0]
                            : new Date().toISOString().split("T")[0]
                        }
                      />
                    </>
                  )}
                </div>

                {/* isAllTopicsAssigned == false && ChapterData?.chapter_status === "completed"
                                                        ? "" : */}
                {!isAllTopicsAssigned &&
                  ChapterData?.chapter_status === "completed" ? <button
                    className="no-Button"
                    style={
                      !isMilestoneVisible
                        ? { }
                        : {}
                    }
                    onClick={() => handleChapterReportClick(ChapterData.class_id, ChapterData.course_id, ChapterData.chapter_id, ChapterData.grade)}
                  >
                  View Reports
                </button> : (

                  <>

                    {
                      ChapterData?.chapter_status === "completed" ? (
                        <div className="dfa" style={{ gap: "10px" }}>
                          <div className="due-date df" style={{ gap: "5px" }}>
                            <label htmlFor="due-date">Start Date</label>
                            <input
                              type="date"
                              id="due-date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              disabled
                            />
                          </div>

                          <div className="due-date df" style={{ gap: "5px" }}>
                            <label htmlFor="due-date">Due Date</label>
                            <input
                              type="date"
                              id="due-date"
                              value={dueDateTopic}
                              onChange={(e) => setDueDateTopic(e.target.value)}
                              min={
                                startDate && !isNaN(startDate)
                                  ? new Date(startDate * 1000).toISOString().split("T")[0]
                                  : new Date().toISOString().split("T")[0]
                              }
                            />
                          </div>
                        </div>
                      ) : null}

                    <div className='mt30 dfa' style={{ gap: "10px" }}>
                      <button
                        onClick={() =>
                          ChapterData?.chapter_status === "completed"
                            ? handleCompletetopic()
                            : openAssignModal()
                        }
                        className={
                          isMilestoneVisible
                            ? "modal-yes-button"
                            : "no-Button"
                        }
                        style={
                          !isMilestoneVisible
                            ? {}
                            : {}
                        }
                      >
                        {ChapterData?.chapter_status === "completed"
                          ? "Assign Pending"
                          : isMilestoneVisible
                            ? "End Chapter"
                            : ChapterData?.chapter_status === "ongoing"
                              ? "Assign Topic"
                              : "Start & Assign"}
                      </button>
                      {ChapterData?.chapter_status == "completed" ? (
                        <button
                          className="no-Button"
                          style={
                            !isMilestoneVisible
                              ? {}
                              : {}
                          }
                          onClick={() => handleChapterReportClick(ChapterData.class_id, ChapterData.course_id, ChapterData.chapter_id, ChapterData.grade)}
                        >
                          View Reports
                        </button>


                      ) : null}
                    </div>
                  </>
                )}
              </div>
              {isAssignModalOpen && (
                <div className="tch-modal-overlay ">
                  <div className="tch-modal-content">
                    <h2 style={{ color: "#6166AE", fontSize: '24px', margin: '0px' }}>
                      Are you sure you want to{" "}
                      {isMilestoneVisible
                        ? "end this chapter and assign the milestone?"
                        : ChapterData?.chapter_status === "ongoing"
                          ? "assign the selected topic(s) in this chapter?"
                          : "start this chapter and assign the selected topics?"}{" "}
                    </h2>
                    <div className="modal-buttons" style={{ margin: '0px' }}>
                      <button
                        onClick={closeAssignModal}
                        className="modal-no-button"
                      >
                        No
                      </button>
                      {/* call handleAssignTopic when chapter_status is ongoing */}
                      <button
                        onClick={isMilestoneVisible
                          ? openEndChapterModal
                          : ChapterData?.chapter_status === "ongoing"
                            ? () => handleAssignTopic(false)
                            : handleStartChapter}

                        className="modal-yes-button"
                      >
                        {isMilestoneVisible
                          ? "End Chapter"
                          : ChapterData.chapter_status === "ongoing"
                            ? "Assign Topic"
                            : "Assign Chapter"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="no-data">
              <p>No chapter data available.</p>
            </div>
          )}

          {selectedAssignment && (
            <div className="tch-modal-overlay">
              <div className="quize-tch-modal-content" >
                <div className="dfjs ">
                  <h3 className=" ">{quizType}</h3>
                  <button
                    className="close-button"
                    onClick={() => setSelectedAssignment(null)}
                  >
                    {" "}
                    <RxCross2 />{" "}
                  </button>
                </div>
                <p className="modalDetail">
                  {selectedAssignment?.chapter_name} - <span>{selectedAssignment?.length} Questions</span>
                </p>
                <div className="view-toggle">
                  <button
                    className={view === "teacher" ? "active" : ""}
                    onClick={() => setView("teacher")}
                  >
                    Teacher View
                  </button>
                  <button
                    className={view === "student" ? "active" : ""}
                    onClick={() => setView("student")}
                  >
                    Student View
                  </button>
                </div>

                {/* Conditionally render teacher view */}

                {view === "teacher" && (
                  <div className="teacherView">
                    {selectedAssignment.map((q, index) => (
                      <div
                        className="quiz-container"
                        key={index}
                        style={{
                          display: "flex",
                          // justifyContent: "space-between",
                          gap:'20px',
                          flexDirection: "column",
                        }}
                      >
                          <div className="question">
                            {q.isLatex ? (
                              <div>
                                <MathJax dangerouslySetInnerHTML={{ __html: q.question }}></MathJax>
                              </div>
                            ) : (
                              <div dangerouslySetInnerHTML={{__html:q.question}}></div>
                            )}
                          </div>

                          <div>
                            {q.options.map((option, idx) => (
                              <div key={idx} className="option">
                                <span
                                  className={`option-label ${option.optiontext === q.correct ? "highlight-answer" : ""}`}
                                >
                                  {String.fromCharCode(65 + idx)}
                                </span>
                                <div className="questionOption">
                                {q.isLatex ? (
                                    <div>
                                      <MathJax>{option.optiontext}</MathJax>
                                    </div>
                                  ) : (
                                  <div dangerouslySetInnerHTML={{ __html: option.optiontext}}></div>
                                )}
                                </div>
                              </div>
                            ))}
                          </div>

                      </div>
                    ))}
                  </div>
                )}

                {view === "student" && (
                  <div>
                    <div className="studentView">
                      <div
                        className="quiz-container"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          flexDirection: "column",
                          width: "100%",
                        }}
                      >
                        <div className="studentquestion">
                          {dummyQuestions[currentQuestionIndex].isLatex ? (
                            <MathJax dangerouslySetInnerHTML={{ __html: dummyQuestions[currentQuestionIndex].question }}></MathJax>
                          ) : (
                            <div dangerouslySetInnerHTML={{__html:dummyQuestions[currentQuestionIndex].question}}></div>
                          )}
                        </div>

                        <div>
                          {dummyQuestions[currentQuestionIndex].options.map((option, idx) => (
                            <label key={idx} className="option">
                              <input type="radio" name="answer" />
                              <span className="option-label">{String.fromCharCode(65 + idx)}</span>
                              <div className="questionOption">
                                <MathJax dangerouslySetInnerHTML={{ __html: dummyQuestions[currentQuestionIndex].isLatex ? option.optiontext : option.optiontext }} />
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      {showAnswer && (
                        <div className="answer-box">
                          <p className="correct-answer">
                            Correct answer is
                            <span className="answer-circle">
                              {dummyQuestions[currentQuestionIndex].correct_option}
                            </span>
                          </p>
                          <h4>Solution</h4>
                          <div className="solution-content">
                            <MathJax>
                              <div dangerouslySetInnerHTML={{ __html:(dummyQuestions[currentQuestionIndex].solution) }} />
                            </MathJax>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="popup-footer">
                      <span
                        className="prev-button"
                        onClick={handlePrevQuestion}
                        style={{
                          cursor: currentQuestionIndex === 0 ? "not-allowed" : "pointer",
                          opacity: currentQuestionIndex === 0 ? 0.5 : 1,
                        }}
                      >
                        <FaChevronLeft />
                      </span>
                      <span className="show-answer-button" onClick={toggleShowAnswer}>
                        {showAnswer ? "Hide Answer" : "Show Answer"}
                      </span>
                      <span
                        className="next-button"
                        onClick={handleNextQuestion}
                        style={{
                          cursor:
                            currentQuestionIndex === dummyQuestions.length - 1
                              ? "not-allowed"
                              : "pointer",
                          opacity: currentQuestionIndex === dummyQuestions.length - 1 ? 0.5 : 1,
                        }}
                      >
                        <FaChevronRight />
                      </span>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {selectedMedia && (
            <div className="tch-modal-overlay">
              <div
                className="tch-modal-content"
                style={{ minWidth: "800px", minHeight: "500px" }}
              >
                <div className="dfjs ">
                  <h3 className=" ">Video</h3>
                  <button
                    className="close-button"
                    onClick={() => setSelectedMedia(false)}
                  >
                    {" "}
                    <RxCross2 />{" "}
                  </button>
                </div>
                <p className="modalDetail">
                  {selectedMedia.topicName} -{" "}
                  <span>{selectedMedia.count} Questions</span>
                </p>

                <div className="video-container" style={{ marginTop: "30px" }}>
                  {selectedMedia?.url ? (
                    <iframe
                      width="100%"
                      height="400px"
                      src={selectedMedia.url}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <p>No video available</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {isModalEndConfirmation && (
            <div className="tch-modal-overlay">
              <div className="tch-modal-content" style={{ padding: '0px' }}>
                <div className="tch-modal-content-header">
                  <h2>
                    There are a few topics in this chapter that have not been assigned to students.
                  </h2>
                  <div className="chapter-title">
                    <span style={{ color: "#fff" }}>
                      {" "}
                      {ChapterData?.chapter_name}
                    </span>
                    <span className="chapter-class">
                      {ChapterData?.class_name}
                    </span>
                  </div>
                </div>
                <div className="chapter-info">
                  {/* <div className="chapter-topics">
                    {ChapterData?.topics?.map(
                      (topic, index) =>
                        topic.topic_status == false && (
                          <div key={index} className="chapter-topics-line">
                            <p>{topic.topic_name}</p>
                            <div className="resources-info">
                              <span className="unassigned-btn">Unassigned</span>
                            </div>
                          </div>
                        )
                    )}
                  </div> */}
                  <div className="model-red mt20">
                    <h5>
                      Would you like to mark the chapter as complete without assigning the remaining topic(s)?
                    </h5>
                  </div>
                </div>
                <div className="modal-buttons">
                  <button
                    onClick={() => {
                      setisModalEndConfirmation(false);
                      setIsMilestoneVisible(false);
                    }}
                    className="modal-no-button"
                  >
                    No
                  </button>
                  <button
                    onClick={() => {
                      handleAssignTopic(true);
                      setisModalEndConfirmation(false);
                    }}
                    className="modal-yes-button"
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )
      }
     
     </div >
    {isLoader ? <Loader /> : ""}
    </MathJaxContext>
    </div >
  );
};

export default Mensuration;
