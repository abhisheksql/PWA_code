"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import "../../../../public/style/student.css";
import { RxCross1 } from "react-icons/rx";
import { FiFlag } from "react-icons/fi";
import { MdOutlineWatchLater } from "react-icons/md";
import QuizIcon from "../../../../public/images/studentimg/Quiz.svg";
import QuizCoin from "../../../../public/images/studentimg/quizcoin.svg";
import Coin from "../../../../public/images/studentimg/Coin.svg";
import Accuracy from "../../../../public/images/studentimg/Accuracy.svg";
import Time from "../../../../public/images/studentimg/Time.svg";
import Correct from "../../../../public/images/studentimg/Correct.svg";
import VideoCamera from "../../../../public/images/studentimg/VideoCamera.svg";
import HexagonCheck from "../../../../public/images/studentimg/HexagonCheck.svg";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "../../auth";
import Loader from "../../components/studentcomponent/Loader";
import reviewmyicon from "../../../../public/images/studentimg/reviewmyicon.svg";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import DOMPurify from "dompurify";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [showSubmitPopup, setShowSubmitPopup] = useState(false);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [reportedQuestionId, setReportedQuestionId] = useState(0);
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [chapterId, setChapterId] = useState(0);
  const [courseId, setCourseId] = useState(0);
  const [sectionId, setSectionId] = useState(0);
  const [topicId, setTopicId] = useState(0);
  const [homeId, setHomeId] = useState(0);
  const [status, setStatus] = useState(0);
  const [schoolId, setSchoolId] = useState(0);
  const [popupType, setPopupType] = useState("");
  const [quizKey, setQuizKey] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [studentData, setStudentData] = useState();
  const [reviewChapterName, setReviewChapterName] = useState("");
  const [reviewTopicName, setReviewTopicName] = useState("");
  const [reviewSubjectName, setReviewSubjectName] = useState("");

  const chapterIdparam = searchParams.get("chapter_id");
  const courseIdparam = searchParams.get("course_id");
  const sectionIdparam = searchParams.get("section_id");
  const topicIdparam = searchParams.get("topic_id");
  const popupTypeparam = searchParams.get("test_type");
  const schoolIdparam = searchParams.get("school_id");
  const homeIdparam = searchParams.get("home");
  const statusIdparam = searchParams.get("status");
  const chapterNameParam = searchParams.get("chapterName");
  const Topicparam = searchParams.get("topic");
  const Subjectparam = searchParams.get("subject");

  // Hook for setting state from search params
  useEffect(() => {
    schoolIdparam && setSchoolId(schoolIdparam);
    chapterIdparam && setChapterId(chapterIdparam);
    courseIdparam && setCourseId(courseIdparam);
    sectionIdparam && setSectionId(sectionIdparam);
    topicIdparam && setTopicId(topicIdparam);
    popupTypeparam && setPopupType(popupTypeparam);
    homeIdparam && setHomeId(homeIdparam);
    statusIdparam && setStatus(statusIdparam);
    chapterNameParam && setReviewChapterName(chapterNameParam);
    Topicparam && setReviewTopicName(Topicparam);
    Subjectparam && setReviewSubjectName(Subjectparam);
  }, [
    chapterIdparam,
    courseIdparam,
    sectionIdparam,
    topicIdparam,
    popupTypeparam,
    schoolIdparam,
    homeIdparam,
    statusIdparam,
    chapterNameParam,
    Topicparam,
    Subjectparam,
  ]);

  const [videoUrl, setVideoUrl] = useState("");
  const [checkboxValues, setCheckboxValues] = useState({
    typo_in_question: false,
    wrong_answer: false,
    image_not_visible: false,
    mistake_in_solution: false,
    technical_issue: false,
  });
  const [textareaValue, setTextareaValue] = useState("");

  // Hook for setting quizKey

  useEffect(() => {
    const userid = localStorage.getItem("user_id");
    const key = `${userid}_${schoolId}_${chapterId}_${topicId}_${popupType}`;
    setQuizKey(key);
  }, [schoolId, topicId, chapterId, popupType]);


  // Hook for clearing quiz responses
  useEffect(() => {
    if (quizKey) {
      localStorage.removeItem(`quizResponses_${quizKey}`);
    }
  }, [quizKey]);

  // Hook for fetching quiz data
  useEffect(() => {
    if (schoolId > 0) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await axiosInstance.get(
            `studentapis/review_my_attempt`,
            {
              params: {
                school_id: schoolId,
                section_id: sectionId,
                course_id: courseId,
                test_type: popupType,
                chapter_id: chapterId,
                topic_id: topicId,
              },
            }
          );
          if (response.status === 200) {
            setData(response.data);
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [schoolId, sectionId, courseId, popupType, chapterId, topicId]);

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

  // Hook for MathJax re-rendering
  useEffect(() => {
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
    // When using better-react-mathjax, typesetting is handled by the MathJaxContext
        // We only need to manually trigger typesetting in special cases

        const timer = setTimeout(() => {
          const container = document.getElementById("mathjax-options-wrapper");
          if ( container && window.MathJax && typeof window.MathJax.typesetPromise === "function") {
            window.MathJax.typesetPromise([container]).catch((err) =>
              console.error("MathJax typesetting failed:", err)
            );
          }
        }, 200); // Small delay to ensure content is rendered
    
        return () => clearTimeout(timer);

  }, [currentQuestionIndex,showReportPopup,showSubmitPopup]);

  // Process data after hooks
  let questions = [];
  if (data) {
    questions = data.data.test.responses;
    if (data.data.show_popup === true) {
      localStorage.setItem("review", Number(data.data.points));
    }
  }

  // Early return after all hooks
  if (!questions.length) return <Loader />;

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOptionIndex(null);
    } else {
      setIsLoader(true);
      setShowSubmitPopup(false);
      setShowResultPopup(false);

      let redirectValue;
      if (popupType == "CRQ") {
        redirectValue = `${chapterId}1`;
      } else if (popupType == "CLT") {
        redirectValue = `${chapterId}0`;
      } else {
        redirectValue = `${topicId}1`;
      }

      if (homeId == 1) {
        router.push(
          `/student?courseId=${courseId}&chapterId=${redirectValue}&status=${status}`
        );
      } else if (homeId == 2) {
        router.push(
          `/student/progresschapter?courseid=${courseId}&chapterid=${chapterId}&status=${status}`
        );
      } else {
        router.push(
          `/student?courseId=${courseId}&chapterId=${redirectValue}&status=${status}`
        );
      }
    }
  };

  const handleReportClick = () => {
    setTextareaValue("");
    const currentQuestion = questions[currentQuestionIndex];
    setReportedQuestionId(currentQuestion.question_id);
    setShowReportPopup(true);
  };

  const handleShowVideoClick = () => {
    const currentQuestion = questions[currentQuestionIndex];
    setVideoUrl(currentQuestion.url);
    setShowVideoPopup(true);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOptionIndex(null);
    }
  };

  const handleSubmitQuiz = () => {
    setIsLoader(true);
    setShowSubmitPopup(false);
    setShowResultPopup(false);
    let redirectValue;
    if (popupType == "CRQ") {
      redirectValue = `${chapterId}1`;
    } else if (popupType == "CLT") {
      redirectValue = `${chapterId}0`;
    } else {
      redirectValue = `${topicId}1`;
    }
    if (homeId == 1) {
      router.push(
        `/student?courseId=${courseId}&chapterId=${redirectValue}&status=${status}`
      );
    } else if (homeId == 2) {
      router.push(
        `/student/progresschapter?courseid=${courseId}&chapterid=${chapterId}`
      );
    } else {
      router.back();
    }
  };

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
    formData.append("topic", reviewTopicName || "");
    formData.append("activities", data?.data?.test?.quiz_type || "");
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

  return (
    <div id="mathjax-options-wrapper">
    <MathJaxContext config={mathJaxConfig}>
      <div className="quiz-container">
        <div className="progress-head">
          <div className="progress-head-icon">
            <Image src={QuizIcon} alt="Readiness" className="progress-show" />
          </div>
          <div className="quizhead-container">
            <div className="progress-info">
              <span>
                {data.data.test.quiz_type === "PE"
                  ? "Quest"
                  : popupType === "CLT"
                  ? "Milestone"
                  : popupType === "CRQ"
                  ? "Readiness"
                  : ""}
              </span>
              <p>{data.data.name}</p>
            </div>
            <div className="chapter-info">
              <button
                onClick={() => setShowSubmitPopup(true)}
                className="quit-btn"
              >
                <RxCross1 /> Quit
              </button>
            </div>
          </div>
        </div>

        <div className="question-section">
          <div className="question-section-header">
            <div className="question-no-section">
              {questions.map((question, index) => (
                <button
                  key={index}
                  className={`${
                    question.answer === "wrong"
                      ? "red"
                      : question.answer === "correct"
                      ? "green"
                      : question.answer === "skip"
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
              <p className="dfa" style={{ gap: "5px", margin: "0px" }}>
                <MdOutlineWatchLater style={{ color: "#FF8A00" }} /> Time Spent
                on this Question: {" "}
                <span style={{ color: "#949494" }}>
                  {questions[currentQuestionIndex].time}
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
                  <Image
                    src={reviewmyicon}
                    width={40}
                    height={40}
                    alt="Coin Icon"
                  />
                </span>
                <span>{questions[currentQuestionIndex].name}</span>
              </div>
              {questions[currentQuestionIndex].question.map((qItem, index) => (
                <React.Fragment key={index}>
                  {qItem.type === "text" ? (
                    questions[currentQuestionIndex].is_latex ? (
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
                            dangerouslySetInnerHTML={{ __html: qItem.content }}
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
                      alt="Question Image"
                    />
                  ) : null}
                </React.Fragment>
              ))}
            </div>
            <div className="options">
              {Object.values(questions[currentQuestionIndex].options).map(
                (option, index) => {
                  const isCorrectAnswer =
                    index === questions[currentQuestionIndex].correct_answer;
                  const isUserAnswer = questions[currentQuestionIndex].answer;
                  const isUserOption = questions[currentQuestionIndex].option;
                  let labelClass = "";
                  let labelWrongClass = "";
                  if (isCorrectAnswer) {
                    labelClass = "green-card";
                    if (isUserAnswer === "correct") {
                      labelClass += " correctanswer";
                    }
                  }
                  if (isUserAnswer === "wrong" && isUserOption === index) {
                    labelWrongClass = "red-card";
                  }
                  return (
                    <div
                      key={index}
                      className={`option-card ${labelWrongClass} ${labelClass}`}
                      style={{
                        pointerEvents: "none",
                        cursor: "not-allowed",
                      }}
                    >
                      <span className="option-label-box">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option.map((optionchild, optIndex) => (
                        <div key={optIndex} className="option-text">
                          {optionchild.type === "text" ? (
                            questions[currentQuestionIndex].is_latex ? (
                              <div
                                className="optiontextreview"
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
                              />
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
                {questions[currentQuestionIndex].correct_solution.map(
                  (qItem, index) => (
                    <React.Fragment key={index}>
                      {qItem.type === "text" ? (
                        questions[currentQuestionIndex].is_latex ? (
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
              {currentQuestionIndex === questions.length - 1
                ? "Finish Review"
                : "Next Question"}
            </button>
          </div>
        </div>
        
        {showSubmitPopup && (
          <div className="popup-overlay">
            <div className="quiz-popup-box" style={{ width: "350px" }}>
              <h3>Quit ?</h3>
              <p>Are you sure you want to quit?</p>
              <div className="quiz-popup-btn">
                <button
                  onClick={() => setShowSubmitPopup(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button onClick={handleSubmitQuiz} className="yes-btn">
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
        {showResultPopup && (
          <div className="popup-overlay">
            <div
              className="quiz-popup-box"
              style={{ width: "450px", minHeight: "91vh" }}
            >
              <div style={{ display: "flex", justifyContent: "right" }}>
                <div className="cod-1" style={{ width: "20%" }}>
                  <Image src={Coin} alt="Coin Icon" width={20} height={20} />
                  <span>1000</span>
                </div>
              </div>
              <h3 style={{ color: "#FF8A00" }}>Quest Completed!</h3>
              <p style={{ fontSize: "15px", fontWeight: "700" }}>
                Rational numbers between two rational numbers and pattern
                involving rational numbers
              </p>
              <Image
                src={QuizCoin}
                alt="Quiz Coin"
                style={{ position: "relative", top: "-40px" }}
              />
              <div className="popup-middle">
                <p>You’ve earned</p>
                <p style={{ color: "#FF8A00" }}>
                  <span>
                    <Image
                      src={Coin}
                      alt="Readiness"
                      className="progress-show"
                      width={25}
                      height={25}
                    />
                    +100
                  </span>{" "}
                  discovery coins.
                </p>
              </div>
              <div
                className="quest-multibox"
                style={{ position: "relative", top: "-40px" }}
              >
                <div className="quest-multibox1">
                  <Image src={Accuracy} alt="Accuracy" />
                  <span>50%</span>
                  <p>Accuracy</p>
                </div>
                <div className="quest-multibox2">
                  <Image src={Correct} alt="Correct" />
                  <span>4/8</span>
                  <p>Correct</p>
                </div>
                <div className="quest-multibox3">
                  <Image src={Time} alt="Time" />
                  <span>4 min 5 sec</span>
                  <p>Time spent</p>
                </div>
              </div>
              <button
                className="continue-btn"
                style={{ width: "100%", position: "relative", top: "-10px" }}
              >
                Continue
              </button>
            </div>
          </div>
        )}
        {showVideoPopup && (
          <div className="popup-overlay">
            <div
              className="quiz-popup-box"
              style={{ minWidth: "800px", minHeight: "500px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  margin: "20px 0",
                }}
              >
                <h6 style={{ fontSize: "18px" }}>Solution Video</h6>
                <button
                  onClick={() => setShowVideoPopup(false)}
                  className="close-btn"
                  style={{ position: "relative" }}
                >
                  <RxCross1 size={16} />
                </button>
              </div>
              <div className="video-container">
                <iframe
                  width="100%"
                  height="400px"
                  src={videoUrl}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}
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
      </div>
      {isLoader && <Loader />}
    </MathJaxContext>
    </div>
  );
};

export default Quiz;
