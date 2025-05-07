"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import "../../../../public/style/student.css";
import { RxCross1 } from "react-icons/rx";
import { MdOutlineWatchLater } from "react-icons/md";
import QuizIcon from "../../../../public/images/studentimg/Quiz.svg";
import BeginnerIcon from "../../../../public/images/studentimg/BeginnerIcon.svg";
import axiosInstance from "../../auth";
import { useRouter, useSearchParams } from "next/navigation";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import reviewmyicon from "../../../../public/images/studentimg/reviewmyicon.svg";
import DOMPurify from "dompurify";
import { FiFlag } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../components/studentcomponent/Loader";
import HexagonCheck from "../../../../public/images/studentimg/HexagonCheck.svg";
const ReviewQuestion = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [showSubmitPopup, setShowSubmitPopup] = useState(false);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [reportedQuestionId, setReportedQuestionId] = useState(0);
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [showBadgePopup, setShowBadgePopup] = useState(true);
  const [responseData, setResponseData] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const [studentData, setStudentData] = useState();
  const [chapterId, setChapterId] = useState(0);
  const [courseId, setCourseId] = useState(0);
  const [sectionId, setSectionId] = useState(0);
  const [topicId, setTopicId] = useState(0);
  const [topicName, setTopicName] = useState("");
  const [reviewChapterName, setReviewChapterName] = useState("");
  const [reviewSubjectName, setReviewSubjectName] = useState("");
  const [schoolId, setSchoolId] = useState(0);
  const [luIds, setLuIds] = useState("");
  const [checkboxValues, setCheckboxValues] = useState({
    typo_in_question: false,
    wrong_answer: false,
    image_not_visible: false,
    mistake_in_solution: false,
    technical_issue: false,
  });
  const [textareaValue, setTextareaValue] = useState("");
  const chapterIdparam = searchParams.get("chapterId");
  const courseIdparam = searchParams.get("courseId");
  const sectionIdparam = searchParams.get("sectionId");
  const topicIdparam = searchParams.get("topicId");
  const luidsparam = searchParams.get("lu_ids");
  const schoolIdparam = searchParams.get("schoolId");
  const topicNameparam = searchParams.get("topicname");
  const chapterNameParam = searchParams.get("chapterName");
  const Subjectparam = searchParams.get("subject");
  useEffect(() => {
    // Set state based on query parameters
    schoolIdparam ? setSchoolId(schoolIdparam) : 0;
    chapterIdparam ? setChapterId(chapterIdparam) : 0;
    courseIdparam ? setCourseId(courseIdparam) : 0;
    sectionIdparam ? setSectionId(sectionIdparam) : 0;
    topicIdparam ? setTopicId(topicIdparam) : 0;
    luidsparam ? setLuIds(luidsparam) : "";
    topicNameparam ? setTopicName(topicNameparam) : "";
    chapterNameParam && setReviewChapterName(chapterNameParam);
    Subjectparam && setReviewSubjectName(Subjectparam);
  }, [
    Subjectparam,
    chapterNameParam,
    chapterIdparam,
    courseIdparam,
    sectionIdparam,
    topicIdparam,
    luidsparam,
    schoolIdparam,
    topicNameparam,
  ]); //

 
  useEffect(() => {
    const fetchReviewQuestions = async () => {
      try {
        const response = await axiosInstance.post(
          "/studentapis/review_questions",
          {
            section_id: sectionId,
            course_id: courseId,
            chapter_id: chapterId,
            topic_id: topicId,
            lu_ids: luIds.split(","),
          }
        );
        setResponseData(response.data.data.question_data);
        // const timer = setTimeout(() => {
        //   const container = document.getElementById("mathjax-options-wrapper");
        //   if ( container && window.MathJax && typeof window.MathJax.typesetPromise === "function") {
        //     window.MathJax.typesetPromise([container]).catch((err) =>
        //       console.error("MathJax typesetting failed:", err)
        //     );
        //   }
        // }, 500); // Small delay to ensure content is rendered
    
        return () => clearTimeout(timer);
      } catch (err) {
        console.error("Error fetching review questions:", err);
      }
    };
    if (schoolId > 0) {
      fetchReviewQuestions();
    }
  }, [chapterId, courseId, sectionId, topicId, schoolId, luIds]);

  
  // schoolId

  const handleCheckboxChange = (key) => {
    setCheckboxValues((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleTextareaChange = (e) => {
    setTextareaValue(e.target.value);
  };

  const handleSubmit = async () => {
    setIsLoader(true);
    const selectedIssues = Object.keys(checkboxValues).filter(
      (key) => checkboxValues[key]
    );
    let descriptions = [];
    if (checkboxValues.typo_in_question) {
      descriptions.push("There is a typo in this question");
    }
    if (checkboxValues.wrong_answer) {
      descriptions.push("The answer is wrong");
    }
    if (checkboxValues.image_not_visible) {
      descriptions.push("I can not see the image");
    }
    if (checkboxValues.mistake_in_solution) {
      descriptions.push("There is a mistake in the solution");
    }
    if (checkboxValues.technical_issue) {
      descriptions.push("There is some tech issue");
    }
    if (textareaValue) {
      descriptions.push(textareaValue);
    }
    let description = descriptions.join(", ");
    let questionValue = `RQ - ${reportedQuestionId}`;

    const formData = new FormData();
    formData.append("userid", studentData?.student_id || "");
    formData.append("class", studentData?.section_name || "");
    formData.append("is_parent", "No");
    formData.append("email", studentData?.email || "");
    formData.append("school", studentData?.school_name || "");
    formData.append("chapter", reviewChapterName || "");
    formData.append("topic", topicName || "");
    formData.append("activities", "PE");
    formData.append("subject", questionValue || "");
    formData.append("status", "Open");
    formData.append("priority", "");
    formData.append("interface", "Student Application");
    formData.append("issue_type", "Content");
    formData.append(
      "name",
      `${studentData?.first_name || ""} ${studentData?.last_name || ""}`
    );
    formData.append("description", description || "");
    formData.append("subjects", reviewSubjectName || "");

    try {
      const response = await axiosInstance.post(
        "/onboarding/add_ticket/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setShowReportPopup(false);
      setIsLoader(false);
      toast.success("Ticket Created Successfully!", {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                  });

    } catch (error) {
      setIsLoader(false);
      toast.error(error, {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
      console.error("Error submitting the issue:", error);
    }
  };

  const mathJaxConfig = {
    tex: {
      inlineMath: [
        ["$", "$"],
        ["\\(", "\\)"],
      ],
      displayMath: [
        ["$$", "$$"],
        ["\\[", "\\]"],
      ],
      processEscapes: true,
    },
    startup: {
      typeset: true,
    },
    options: {
      enableMenu: false, // Disable the right-click menu
      renderActions: {
        addMenu: [], // Disable the menu
      },
    },
  };

  // Handle next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < responseData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOptionIndex(null);
    } else {
      setIsLoader(true);
      router.push(
        `/student/progresschapter?courseid=${courseId}&chapterid=${chapterId}&tab=performance`
      );
    }
  };

  // Handle previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOptionIndex(null);
    }
  };

  // Hook for fetching student info
  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const response = await axiosInstance.get(
          "studentapis/get_student_info"
        );
        if (response.data.status === "Success") {
          setStudentData(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching student info:", err);
      }
    };
    fetchStudentInfo();
  }, []);

  const handleGoHome = () => {
    setIsLoader(true);
    router.push(
      `/student/progresschapter?courseid=${courseId}&chapterid=${chapterId}&tab=performance`
    );
  };

  const handleReportClick = () => {
    setTextareaValue("");
    const currentQuestion = responseData[currentQuestionIndex];
    setReportedQuestionId(currentQuestion.question_id);
    setShowReportPopup(true);
  };


   // When using better-react-mathjax, typesetting is handled by the MathJaxContext
    // We only need to manually trigger typesetting in special cases
    // const timer = setTimeout(() => {
    //   if (
    //     window.MathJax &&
    //     typeof window.MathJax.typesetPromise === "function"
    //   ) {
    //     window.MathJax.typesetPromise().catch((err) =>
    //       console.error("MathJax typesetting failed:", err)
    //     );
    //   }
    // }, 100); // Small delay to ensure content is rendered
    // return () => clearTimeout(timer);
    
  useEffect(() => {
   
    const timer = setTimeout(() => {
      const container = document.getElementById("mathjax-options-wrapper");
      if ( container && window.MathJax && typeof window.MathJax.typesetPromise === "function") {
        window.MathJax.typesetPromise([container]).catch((err) =>
          console.error("MathJax typesetting failed:", err)
        );
      }
    }, 500); // Small delay to ensure content is rendered

    return () => clearTimeout(timer);
  }, [currentQuestionIndex,responseData,showReportPopup]);

  if (!responseData.length) return <Loader />;
  return (
    <div id="mathjax-options-wrapper">
    <MathJaxContext config={mathJaxConfig}>
      <div className="quiz-container">
        <div className="progress-head">
          <div className="progress-head-icon">
            <Image src={QuizIcon} alt="Readiness" className="progress-show" />
          </div>
          <div className="quizhead-container">
            <span>{topicName}</span>
            <div className="progress-info">
              {/* <span>Quest</span>
              <p>{topicName}</p> */}
            </div>
            <div className="chapter-info">
              <button onClick={handleGoHome} className="quit-btn">
                <RxCross1 /> Quit
              </button>
            </div>
          </div>
        </div>

        <div className="question-section">
          <div className="question-section-header">
            <div className="question-no-section" >
              {responseData.map((response, index) => (
                <button
                  key={index}
                  className={`${
                    response.answer == "wrong"
                      ? "red"
                      : response.answer == "correct"
                      ? "green"
                      : response.answer == "skip"
                      ? "gray"
                      : ""
                  } ${index === currentQuestionIndex ? "active" : ""}`}
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <div className="question-section-report dfa">
              <p className="dfa">
                <MdOutlineWatchLater style={{ color: "#FF8A00" }} /> Time Spent
                on this Question: {" "}
                <span style={{ color: "#949494" }}>
                  {" "}
                  {responseData[currentQuestionIndex]?.time}{" "}
                </span>
              </p>
              <span onClick={handleReportClick} style={{ cursor: "pointer" }}>
                    <FiFlag style={{ color: "#FD6845" }} /> Report
              </span>
            </div>
          </div>
          <div className="question-box">
            <div className="question">
              <div className="question-segment">
                <span className="question-segment-img">
                  {" "}
                  <Image
                    src={reviewmyicon}
                    alt="Coin Icon"
                    width={40}
                    height={40}
                  />
                </span>
                <span>{responseData[currentQuestionIndex]?.name}</span>
              </div>
              <>
                {responseData[currentQuestionIndex]?.question?.map(
                  (qItem, index) => (
                    <React.Fragment key={index}>
                      {qItem.type == "text" ? (
                        responseData[currentQuestionIndex].is_latex ? (
                          <div
                            style={{
                              maxWidth: "100%",
                              overflow: "hidden",
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                              display: "block",
                              lineHeight: "1.5",
                              padding: "5px",
                              textAlign: "left",
                            }}
                          >
                            <div
                              className="questionreview"
                              key={index}
                              style={{ marginBottom: "5px" }}
                            >
                              <MathJax
                                dangerouslySetInnerHTML={{
                                  __html: qItem.content,
                                }}
                              ></MathJax>
                            </div>
                          </div>
                        ) : (
                          <p
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(qItem.content),
                            }}
                          ></p>
                        )
                      ) : qItem.type == "image" && qItem.content ? (
                        <Image
                          src={qItem.content}
                          width={200}
                          height={200}
                          alt="Question Image"
                        />
                      ) : null}
                    </React.Fragment>
                  )
                )}
              </>
            </div>
            <div className="options">
              {responseData[currentQuestionIndex]?.options &&
                Array.isArray(
                  Object.values(responseData[currentQuestionIndex].options)
                ) &&
                Object.values(responseData[currentQuestionIndex].options).map(
                  (option, index) => {
                    const isCorrectAnswer =
                      index ===
                      responseData[currentQuestionIndex].correct_answer;
                    const isUserAnswer =
                      responseData[currentQuestionIndex].answer;
                    const isUserOption =
                      responseData[currentQuestionIndex].option;

                    let labelClass = "";
                    let labelWrongClass = "";
                    // Set `labelClass` for the correct answer
                    if (isCorrectAnswer) {
                      labelClass = "green-card"; // Default class for correct answers
                      if (isUserAnswer == "correct") {
                        labelClass += " correctanswer"; // Add extra class for a correct user answer
                      }
                    }
                    // Set `labelWrongClass` for the wrong user option
                    if (isUserAnswer == "wrong" && isUserOption === index) {
                      labelWrongClass = "red-card";
                    }
                    return (
                      <div
                        key={index}
                        className={`option-card ${labelWrongClass} ${labelClass}`}
                        style={{
                          pointerEvents: "none", // Disable pointer interactions
                          cursor: "not-allowed", // Change cursor to indicate disabled state
                        }}
                      >
                        <span className="option-label-box">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <>
                          {option.map((optionchild, optIndex) => (
                            <div key={optIndex} className="option-text">
                              {optionchild.type === "text" ? (
                                responseData[currentQuestionIndex].is_latex ? (
                                  <div
                                    key={optIndex}
                                    style={{ marginBottom: "5px" }}
                                  >
                                    <MathJax
                                      dangerouslySetInnerHTML={{
                                        __html: optionchild.content,
                                      }}
                                    ></MathJax>
                                  </div>
                                ) : (
                                  <span
                                    className="option-text"
                                    dangerouslySetInnerHTML={{
                                      __html: DOMPurify.sanitize(
                                        optionchild.content
                                      ),
                                    }}
                                  ></span>
                                )
                              ) : optionchild.type === "image" &&
                                optionchild.content ? (
                                <Image
                                  src={optionchild.content}
                                  width={200}
                                  height={200}
                                  alt="Option Image"
                                />
                              ) : null}
                            </div>
                          ))}
                        </>
                      </div>
                    );
                  }
                )}
            </div>

            <div className="question-video">
              <div className="quiz-popup-btn" style={{ margin: "0px" }}>
                <div className="question-segment">
                  <span className="question-video-img">
                    <Image src={HexagonCheck} alt="Coin Icon" />
                  </span>
                  <span style={{ color: "#5E5E5E" }}>Solution</span>
                </div>
              </div>
              <div style={{ marginTop: "10px" }}>
                {responseData[currentQuestionIndex]?.correct_solution?.map(
                  (qItem, index) => (
                    <React.Fragment key={index}>
                      {qItem.type === "text" ? (
                        responseData[currentQuestionIndex]?.is_latex ? (
                          <div
                            style={{
                              maxWidth: "100%",
                              overflow: "hidden",
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                              display: "block",
                              lineHeight: "1.5",
                              padding: "5px",
                              textAlign: "left",
                            }}
                          >
                            <div key={index} style={{ marginBottom: "5px" }}>
                              <MathJax
                                dangerouslySetInnerHTML={{
                                  __html: qItem.content,
                                }}
                              ></MathJax>
                            </div>
                          </div>
                        ) : (
                          <p
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(qItem.content),
                            }}
                          />
                        )
                      ) : qItem.type === "image" && qItem.content ? (
                        <Image
                          src={qItem.content}
                          width={200}
                          height={200}
                          alt="Solution Image"
                        />
                      ) : null}
                    </React.Fragment>
                  )
                )}
              </div>
            </div>

          </div>
          <div className="button-section">
            <button
              className="prev-btn"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous Question
            </button>
            <button className="next-btn" onClick={handleNextQuestion}>
              {currentQuestionIndex === responseData.length - 1
                ? "Finish Review"
                : "Next Question"}
            </button>
          </div>
        </div>
      </div>
      {showReportPopup && (
          <div className="popup-overlay">
            <div className="report-popup-box">
              <h3 className="reportheading">
                Report an issue in this question
              </h3>
              <p className="report-subheading">
                What is the issue?
              </p>
              <div className="report-issue-options">
                <label>
                  <input
                    type="checkbox"
                    checked={checkboxValues.typo_in_question}
                    onChange={() => handleCheckboxChange("typo_in_question")}
                  />{" "}
                  There is a typo in this question
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={checkboxValues.wrong_answer}
                    onChange={() => handleCheckboxChange("wrong_answer")}
                  />{" "}
                  The answer is wrong
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={checkboxValues.image_not_visible}
                    onChange={() => handleCheckboxChange("image_not_visible")}
                  />{" "}
                  I can not see the image
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={checkboxValues.mistake_in_solution}
                    onChange={() => handleCheckboxChange("mistake_in_solution")}
                  />{" "}
                  There is a mistake in the solution
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={checkboxValues.technical_issue}
                    onChange={() => handleCheckboxChange("technical_issue")}
                  />{" "}
                  There is some tech issue
                </label>
              </div>
              <div style={{ marginTop: "10px", textAlign: "left" }}>
                <p>Describe the issue:</p>
                <textarea
                  value={textareaValue}
                  onChange={handleTextareaChange}
                  placeholder="Type here"
                  rows="4"
                  className="report-textarea"
                />
              </div>
              <div className="quiz-popup-btn">
                <button
                  onClick={() => setShowReportPopup(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button onClick={handleSubmit} className="yes-btn">
                  Submit Issue
                </button>
              </div>
            </div>
          </div>
        )}

         <ToastContainer
                          position="bottom-center"
                          autoClose={5000}
                          hideProgressBar={false}
                          newestOnTop={false}
                          closeOnClick
                          rtl={false}
                          pauseOnFocusLoss
                          draggable
                          pauseOnHover
                          theme="colored"
                />
                 {isLoader && <Loader />}
    </MathJaxContext>
    </div>
  );
};

export default ReviewQuestion;
