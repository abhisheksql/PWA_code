"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowLeft } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";
import HexagonCheck from "../../../../public/images/studentimg/HexagonCheck.svg";
import BoosterFlag from "../../../../public/images/studentimg/BoosterFlag.svg";
import ProgressTree from "../../../../public/images/studentimg/ProgressNewTree.svg";
import axiosInstance from "../../auth";
import { useRouter, useSearchParams } from "next/navigation";
import LoaderPaa from "../../components/studentcomponent/LoaderPaa";
import opacitytree1 from "../../../../public/images/studentimg/opacitytree1.svg";
import opacitytree2 from "../../../../public/images/studentimg/opacitytree2.svg";
import opacitytree3 from "../../../../public/images/studentimg/opacitytree3.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProgressNewPlant from "../../../../public/images/studentimg/ProgressNewPlant.svg";
import ProgressFruitTree from "../../../../public/images/studentimg/ProgressFruitTree.svg";
import ProgressHalfPlant from "../../../../public/images/studentimg/ProgressHalfPlant.svg";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import DOMPurify from "dompurify";
import boosterLUicon from "../../../../public/images/studentimg/boosterLUicon.svg";

// Component for rendering the question and handling quiz logic
const BoosterReview = ({ homeId }) => {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [showSubmitPopup, setShowSubmitPopup] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  // const[recallLatex,setRecallLatex] = useState(0);
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [isLoader, setIsloader] = useState(false);
  const [data, setData] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [reportedQuestionId, setReportedQuestionId] = useState(0);
  const searchParams = useSearchParams();
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [progressLevel, setProgressLevel] = useState(0);
  const [studentData, setStudentData] = useState([]);
  const [topicName, setTopicName] = useState("");
  const [chapterName, setChapterName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [luList, setLuList] = useState([]);
  // Extract parameters from the URL
  const chapterId = searchParams.get("chapterid");
  const sectionId = searchParams.get("sectionid");
  const courseId = searchParams.get("courseid");
  const topicId = searchParams.get("topicid");
  const version = searchParams.get("version");
  const boosterKey = searchParams.get("booster_key");
  const onlytopic = searchParams.get("only_topic");
  const router = useRouter();
  // Store in state
  const [params, setParams] = useState({});
  useEffect(() => {
    if (
      !chapterId ||
      !sectionId ||
      !courseId ||
      !topicId ||
      !version ||
      !boosterKey
    )
      return;

    if (onlytopic == 1) {
      setParams({
        chapter_id: chapterId,
        section_id: sectionId,
        course_id: courseId,
        topic_id: topicId,
        version: version,
        booster_key: boosterKey,
        only_topic: false,
      });
    } else {
      setParams({
        chapter_id: chapterId,
        section_id: sectionId,
        course_id: courseId,
        topic_id: topicId,
        version: version,
        booster_key: boosterKey,
      });
    }
  }, [chapterId, sectionId, courseId, topicId, version, boosterKey, onlytopic]);

  useEffect(() => {
    const fetchData = async () => {
      setIsloader(true);
      try {
        const response = await axiosInstance.get("/studentapis/paa_review", {
          params: params, // Use `params` directly
        });

        if (response.data.status == "Success") {
          const progress =
            (response?.data?.data?.topic_bar?.topic_percentage / 100) * 100;
          setTopicName(response?.data?.data?.topic_name);
          setChapterName(response?.data?.data?.chapter_name);
          setSubjectName(response?.data?.data?.subject_name);
          setProgressPercentage(progress);
          setProgressLevel(response.data.data.topic_bar.label);
          setLuList(response.data.data.lu_list);

          const transformData = (apiData) => {
            return apiData.map((item) => ({
              question_id: item.question_id,
              question: item.question || "", // Keep the HTML content
              options: Object.values(item.options), // Convert options object to an array

              answer: item.answer, // Selected answer
              correct_answer: item.correct_answer, // Correct answer
              correct_solution: item.correct_solution, // Solution text
              name: item.name,
              is_latex: item.is_latex,
              url: item.url,
            }));
          };
          const transformedData = transformData(
            response.data.data.question_data
          );
          setQuestions(transformedData);
          setData(transformedData);
          setIsloader(false);
        }
      } catch (err) {
        setIsloader(false);
        console.error("Error fetching data:", err.message);
      }
    };
    if (params.section_id > 0) {
      fetchData();
    }
  }, [params]); // Depend on `params`

  const handleShowVideoClick = () => {
    const currentQuestion = questions[currentQuestionIndex]?.url;
    // const videoURL = "https://video.gumlet.io/6427d70e5d9d91ad3622f92b/6440ca19fac3f5d6b7bede74/main.mp4";
    setVideoUrl(currentQuestion);
    setShowVideoPopup(true);
  };

  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions?.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOptionIndex(null);
      setIsOptionSelected(false);
    }
  };
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOptionIndex(null);
      setIsOptionSelected(false);
    }
  };
  const handleQuitReview = async () => {
    // setRecallLatex(prev => prev + 1);
    setIsloader(true);
    try {
      const response = await axiosInstance.post("/test_generator/start_paa", {
        section_id: params.section_id,
        course_id: params.course_id,
        chapter_id: params.chapter_id,
        topic_id: params.topic_id,
        lu_ids: luList,
        chapter_name: chapterName,
        subject_name: subjectName,
        topic_name: topicName,
      });
      if (response.data.status == "Success") {
        localStorage.removeItem("paa");
        localStorage.setItem("paa", JSON.stringify(response.data));

        router.push(`/student/booster?&home=${homeId}`);
        setIsloader(false);
      }
    } catch (error) {
      setIsloader(false);
      console.error("Error starting PAA test:", error);
    }
  };
  // recallLatex
  useEffect(() => {
    // // When using better-react-mathjax, typesetting is handled by the MathJaxContext
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
  }, [currentQuestionIndex,questions,showReportPopup]);

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const response = await axiosInstance.get(
          "studentapis/get_student_info"
        );
        if (response.data.status == "Success") {
          setStudentData(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching student info:", err);
      } finally {
      }
    };
    fetchStudentInfo();
  }, []);

  const handleSubmit = async () => {
    // setRecallLatex(prev => prev + 1);
    setIsloader(true);
    const selectedIssues = Object.keys(checkboxValues).filter(
      (key) => checkboxValues[key]
    );
    let descriptions = [];

    if (checkboxValues.typo_in_question == true) {
      descriptions.push("There is a typo in this question");
    }
    if (checkboxValues.wrong_answer == true) {
      descriptions.push("The answer is wrong");
    }
    if (checkboxValues.image_not_visible == true) {
      descriptions.push("I can not see the image");
    }
    if (checkboxValues.mistake_in_solution == true) {
      descriptions.push("There is a mistake in the solution");
    }
    if (checkboxValues.technical_issue == true) {
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
    formData.append("chapter", chapterName || "");
    formData.append("topic", topicName || "");
    formData.append("activities", "Booster" || "");
    formData.append("subject", questionValue || "");
    formData.append("status", "Open");
    formData.append("priority", "");
    formData.append("interface", "Student Application");
    formData.append("issue_type", "Content");
    formData.append("name", studentData?.first_name + studentData?.last_name);
    formData.append("description", description || "");
    formData.append("subjects", subjectName || "");

    // formData.forEach((value, key) => {
    //   console.log(`${key}:`, value);
    // });

    try {
      const response = await axiosInstance.post(
        "/onboarding/add_ticket/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // ✅ Ensures correct format for file uploads
          },
        }
      );
      setShowReportPopup(false); // Close the popup
      setIsloader(false);

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
      setIsloader(false);
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
  const [checkboxValues, setCheckboxValues] = useState({
    typo_in_question: false,
    wrong_answer: false,
    image_not_visible: false,
    mistake_in_solution: false,
    technical_issue: false,
  });

  const [textareaValue, setTextareaValue] = useState("");
  const handleCheckboxChange = (key) => {
    setCheckboxValues((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleTextareaChange = (e) => {
    setTextareaValue(e.target.value);
  };

  const handleReportClick = () => {
    // setRecallLatex(prev => prev + 1);
    setTextareaValue("");
    const currentQuestion = questions[currentQuestionIndex];
    setReportedQuestionId(currentQuestion.question_id);
    setShowReportPopup(true); // Open modal
    // Report
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
      <div className="booster-container">
        <div className="dfjs">
          <div className="progressheader">
            <span style={{ display: "flex" }} onClick={handleQuitReview}>
              <FiArrowLeft className="booster-backicon" />
            </span>
            <h2>Booster</h2>
          </div>

          <span
            className="boosterReport"
            onClick={() => {
              handleReportClick();
              setShowReportPopup(true);
            }}
          >
            <Image
              src={BoosterFlag}
              alt="Booster Flag"
              width={20}
              height={20}
            />
            Report
          </span>
        </div>

        <div className="progressCard">
          <div style={{ width: "100%", padding: "10px 10px 5px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span className="chapterTitle" style={{ color: "#8AB424" }}>
                  {topicName}
                </span>
              </div>
            </div>
          </div>
          <div className="booster-flowerplant-box">
            <div className="booster-plant-container">
              <Image
                src={ProgressNewPlant}
                alt="plant"
                width={35}
                height={35}
              />
              <Image
                src={progressLevel >= 1 ? ProgressHalfPlant : opacitytree1}
                alt="plant"
                width={35}
                height={35}
              />
              <Image
                src={progressLevel >= 2 ? ProgressTree : opacitytree3}
                alt="plant"
                width={35}
                height={35}
              />
              <Image
                src={progressLevel >= 3 ? ProgressFruitTree : opacitytree2}
                alt="plant"
                width={35}
                height={35}
              />
            </div>
            <div className="progress-flowerbar-background">
              <div
                className="progress-flowerbar-fill"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="question-section">
          <div className="question-box">
            <div className="boosterQuestion">
              <div className="booster-question-segment">
                <span className="question-segment-img booster-review-icon">
                  <Image
                    src={boosterLUicon}
                    width={40}
                    height={40}
                    alt="Coin Icon"
                  />
                </span>
                <span className="boosterQuestionSegment" style={{ color: "#3EA8FF" }}>
                  {questions[currentQuestionIndex]?.name || "Question"}
                </span>
              </div>
              {questions[currentQuestionIndex]?.question && (
                <>
                  {questions[currentQuestionIndex]?.question.map(
                    (qItem, index) => (
                      <React.Fragment key={index}>
                        {qItem.type == "text" ? (
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
                                className="dummytxt"
                                key={`math-content-${currentQuestionIndex}-${index}`}
                                style={{
                                  border: "0",
                                  marginBottom: "5px",
                                }}
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
                              className="dummytxt"
                              style={{ border: "0" }}
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
              )}
            </div>
            <div className="options">
              {questions[currentQuestionIndex]?.options?.map(
                (option, index) => {
                  const correctIndex =
                    questions[currentQuestionIndex]?.correct_answer;
                  const selectedAnswer =
                    questions[currentQuestionIndex]?.answer;

                  let labelClass = "";
                  let labelWrongClass = "";
                  if (index === correctIndex) {
                    labelClass = "green-card";
                    if (selectedAnswer === correctIndex) {
                      labelClass += " booster-correctanswer";
                    }
                  }
                  if (
                    selectedAnswer !== correctIndex &&
                    index === selectedAnswer
                  ) {
                    labelWrongClass = "booster-red-card";
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
                              questions[currentQuestionIndex].is_latex ? (
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
              <div className=" quiz-popup-btn" style={{ margin: "0px" }}>
                <div className="booster-question-segment">
                  <span className="question-video-img">
                    {" "}
                    <Image src={HexagonCheck} alt="Coin Icon" />
                  </span>
                  <span className="boosterQuestionSolution" style={{ color: "#5E5E5E" }}>Solution</span>
                </div>
              </div>
              <div style={{ marginTop: "10px" }}>
                <>
                  {questions[currentQuestionIndex]?.correct_solution.map(
                    (qItem, index) => (
                      <React.Fragment key={index}>
                        {qItem.type == "text" ? (
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
            </div>
          </div>
          <div className="button-section" style={{ marginTop: "40px" }}>
            <button
              className="btn-lft"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              style={{
                width: "180px",
                height: "50px",
                opacity: currentQuestionIndex === 0 ? 0.4 : 1,
                cursor: currentQuestionIndex === 0 ? "not-allowed" : "pointer",
              }}
            >
              Previous
            </button>
            <button
              className="btn-rgt"
              style={{ width: "180px", height: "50px" }}
              onClick={
                currentQuestionIndex == questions?.length - 1
                  ? handleQuitReview
                  : handleNextQuestion
              }
            >
              Next
            </button>
          </div>
        </div>

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
                ></iframe>
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
              <div className="report-issue-options boosterCheckbox">
                <label>
                  <input
                    type="checkbox"
                    checked={checkboxValues.incorrect}
                    onChange={() => handleCheckboxChange("typo_in_question")}
                  />{" "}
                  There is a typo in this question{" "}
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={checkboxValues.noCorrectOption}
                    onChange={() => handleCheckboxChange("wrong_answer")}
                  />{" "}
                  The answer is wrong
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={checkboxValues.noImage}
                    onChange={() => handleCheckboxChange("image_not_visible")}
                  />{" "}
                  I can not see the image
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={checkboxValues.imageMistake}
                    onChange={() => handleCheckboxChange("mistake_in_solution")}
                  />{" "}
                  There is a mistake in the solution
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={checkboxValues.techIssue}
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
                  className="booster-report-textarea"
                ></textarea>
              </div>
              <div className="quiz-popup-btn">
                <button
                  onClick={() => setShowReportPopup(false)}
                  className="btn-lft"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleSubmit(); // Call handleSubmit function
                    setShowReportPopup(false); // Close the popup after submit
                  }}
                  className="btn-rgt"
                >
                  Submit Issue
                </button>
              </div>
            </div>
          </div>
        )}

        {showSubmitPopup && (
          <div className="popup-overlay">
            <div className="quiz-popup-box">
              <h3>Quit Quiz??</h3>
              <p>
                Are you sure you want to quit? Your quiz progress will not be
                saved.
              </p>
              <div className="quiz-popup-btn" style={{ gap: "15px" }}>
                <button
                  className="btn-lft"
                  style={{ width: "170px" }}
                  onClick={() => setShowSubmitPopup(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn-rgt"
                  style={{ width: "170px" }}
                  onClick={handleQuitReview}
                >
                  Yes
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
        {isLoader ? <LoaderPaa /> : ""}
      </div>
    </MathJaxContext>
    </div>
  );
};

export default BoosterReview;
