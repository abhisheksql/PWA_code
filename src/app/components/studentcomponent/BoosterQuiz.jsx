"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FiArrowLeft } from "react-icons/fi";
import axiosInstance from "../../auth";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import DOMPurify from "dompurify";
import ProgressTree from "../../../../public/images/studentimg/ProgressNewTree.svg";
import opacitytree1 from "../../../../public/images/studentimg/opacitytree1.svg";
import opacitytree2 from "../../../../public/images/studentimg/opacitytree2.svg";
import opacitytree3 from "../../../../public/images/studentimg/opacitytree3.svg";
import { useRouter } from "next/navigation";
import Paapopup from "../../../../public/images/studentimg/Paapopup.png";
import ProgressNewPlant from "../../../../public/images/studentimg/ProgressNewPlant.svg";
import ProgressFruitTree from "../../../../public/images/studentimg/ProgressFruitTree.svg";
import ProgressHalfPlant from "../../../../public/images/studentimg/ProgressHalfPlant.svg";
import LoaderPaa from "../../components/studentcomponent/LoaderPaa";
import BoosterFlag from "../../../../public/images/studentimg/BoosterFlag.svg";
import boosternoquestion from "../../../../public/images/studentimg/boosternoquestion.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const BoosterQuiz = ({ homeId }) => {
  const router = useRouter();
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [showSubmitPopup, setShowSubmitPopup] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [testResponse, setTestResponse] = useState({}); // Store questionid: answer pair
  const [isLoader, setIsloader] = useState(false);
  const [paaData, setPaaData] = useState([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [progressLevel, setProgressLevel] = useState(0);
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [isPopupOpenFeedback, setIsPopupOpenFeedback] = useState(false);
  const [showNextQuestion, setShowNextQuestion] = useState(false);
  const [studentData, setStudentData] = useState([]);
  const [textareaValue, setTextareaValue] = useState("");
   const [reportedQuestionId, setReportedQuestionId] = useState(0);
  //  const[recallLatex,setRecallLatex] = useState(0);
   const [checkboxValues, setCheckboxValues] = useState({
       typo_in_question: false,
       wrong_answer: false,
       image_not_visible: false,
       mistake_in_solution: false,
       technical_issue: false,
     });
  useEffect(() => {
    const storedPaa = localStorage.getItem("paa");
    if (storedPaa) {
      try {
        const parsedPaa = JSON.parse(storedPaa);
        if (parsedPaa?.status == "Success") {
          setPaaData(parsedPaa);
          const progress =
            (parsedPaa?.data?.topic_bar?.topic_percentage / 100) * 100;

          setProgressPercentage(progress);
          setProgressLevel(parsedPaa?.data?.topic_bar?.label);
        }
      } catch (error) {
        console.error("Error parsing paa:", error);
      }
    }
  }, []);

  const questions = paaData?.data?.booster_module?.map((item) => ({
    questionid: item.question_id, // Keep question_id as questionid
    question: item.question, // Retain HTML tags
    options: Object.values(item.options), // Convert options object to array
    is_latex: item.is_latex,
  }));

  const handleOptionSelect = (index) => {
    setSelectedOptionIndex(index);
    setTestResponse((prev) => ({
      ...prev,
      [questions[currentQuestionIndex]?.questionid]: index, // Storing 1-based index
    }));
  };
  const handleNextQuestion = () => {
    setSelectedOptionIndex(null);
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handleTextareaChange = (e) => {
    setTextareaValue(e.target.value);
  };

  const handleSubmitQuiz = async () => {
    const finalData = {
      section_id: paaData?.data?.section_id,
      course_id: paaData?.data?.course_id,
      chapter_id: paaData?.data?.chapter_id,
      topic_id: paaData?.data?.topic_id,
      booster_key: paaData?.data?.booster_key,
      global_key: paaData?.data?.global_key,
      test_response: testResponse,
      lu_ids: paaData?.data?.lu_list,
      version: paaData?.data?.version,
    };

    try {
      setIsloader(true);
      const response = await axiosInstance.post(
        "/test_generator/submit_booster",
        finalData
      );
      if (response.data.status == "Success") {
        if (
          response.data.data.topic_before == 0 &&
          response.data.data.topic_after == 1
        ) {
          setShowSubmitPopup(false);
          if (response.data.data.submit == true) {
            setShowNextQuestion(true);
          } else {
            setShowNextQuestion(false);
          }
          setIsPopupOpenFeedback(true);
        } else if (
          response.data.data.topic_before == 1 &&
          response.data.data.topic_after == 2
        ) {
          router.push(`/student/advancepaa?id=1&home=${homeId}`);
        } else if (
          response.data.data.topic_before == 0 &&
          response.data.data.topic_after == 2
        ) {
          router.push(`/student/advancepaa?id=2&home=${homeId}`);
        } else if (
          (response.data.data.topic_before == 2 &&
            response.data.data.topic_after == 3) ||
          response.data.data.topic_after == 3
        ) {
          router.push(`/student/advancepaa?id=3&home=${homeId}`);
        } else if (response.data.data.submit == true) {
          router.push(
            `/student/boosterreview?booster_key=${paaData?.data?.booster_key}&chapterid=${paaData?.data?.chapter_id}&sectionid=${paaData?.data?.section_id}&courseid=${paaData?.data?.course_id}&topicid=${paaData?.data?.topic_id}&version=${paaData?.data?.version}&home=${homeId}&only_topic=1`
          );
        } else if (response.data.data.submit == false) {
          setShowSubmitPopup(false);
          setCurrentQuestionIndex(0);
          setSelectedOptionIndex(null);
          setTestResponse({});

          // Reset the questions from booster_module
          if (paaData?.data?.booster_module) {
            setPaaData((prev) => ({
              ...prev,
              data: {
                ...prev.data,
                booster_module: response.data.data.booster_module, // Keep the booster questions
              },
            }));
          }
          // Update local storage to refresh the quiz state
          localStorage.setItem("paa", JSON.stringify(paaData));
        }
      }

    } catch (error) {
      console.error("Error submitting:", error.response?.data || error.message);
    } finally {
      setIsloader(false);
    }
  };

  // useEffect(() => {
  //   // When using better-react-mathjax, typesetting is handled by the MathJaxContext
  //   // We only need to manually trigger typesetting in special cases
  //   const timer = setTimeout(() => {
  //     if (
  //       window.MathJax &&
  //       typeof window.MathJax.typesetPromise === "function"
  //     ) {
  //       window.MathJax.typesetPromise().catch((err) =>
  //         console.error("MathJax typesetting failed:", err)
  //       );
  //     }
  //   }, 100); // Small delay to ensure content is rendered
  //   return () => clearTimeout(timer);
  // }, [currentQuestionIndex]);

  useEffect(() => {
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
    }, [currentQuestionIndex, questions,showReportPopup]);

  const handleContinue = () => {
    setIsPopupOpenFeedback(false);
    if (showNextQuestion == true) {
      router.push(
        `/student/boosterreview?booster_key=${paaData?.data?.booster_key}&chapterid=${paaData?.data?.chapter_id}&sectionid=${paaData?.data?.section_id}&courseid=${paaData?.data?.course_id}&topicid=${paaData?.data?.topic_id}&version=${paaData?.data?.version}&home=${homeId}`
      );
    } else {
      setCurrentQuestionIndex(0);
      setSelectedOptionIndex(null);
      setTestResponse({});

      // Reset the questions from booster_module
      if (paaData?.data?.booster_module) {
        setPaaData((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            booster_module: response.data.data.booster_module, // Keep the booster questions
          },
        }));
      }
      // Update local storage to refresh the quiz state
      localStorage.setItem("paa", JSON.stringify(paaData));
    }
  };

  const handleCheckboxChange = (key) => {
    setCheckboxValues((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleQuitReview = () => {
    setIsloader(true);
    router.push(`/student/booster?&home=${homeId}`);
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

  const handleReportClick = () => {
    setTextareaValue("");
    const currentQuestion = questions[currentQuestionIndex];
    setReportedQuestionId(currentQuestion.questionid);
    setShowReportPopup(true); // Open modal
    // Report
  };

  const handleSubmit = async () => {

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
    formData.append("chapter", paaData?.data?.chapter_name || "");
    formData.append("topic", paaData?.data?.topic_name || "");
    formData.append("activities", "Booster" || "");
    formData.append("subject", questionValue || "");
    formData.append("status", "Open");
    formData.append("priority", "");
    formData.append("interface", "Student Application");
    formData.append("issue_type", "Content");
    formData.append("name", studentData?.first_name + studentData?.last_name);
    formData.append("description", description || "");
    formData.append("subjects", paaData?.data?.subject_name || "");

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


  const handleJourney = () => {
    setIsloader(true);
    if (homeId == 1) {
      router.push(
        `/student?chapterId=${paaData?.data?.topic_id}0&courseId=${paaData?.data?.course_id}`
      );
    } else if (homeId == 2) {
      router.push(
        `/student/progresschapter?chapterid=${paaData?.data?.chapter_id}&courseid=${paaData?.data?.course_id}`
      );
    } else {
      router.push(`/student/`);
    }
  };


  return (
    <div id="mathjax-options-wrapper">
    <MathJaxContext config={mathJaxConfig}>
      <div className="booster-container">
        <div className="dfjs">
          <div className="progressheader">
            <span
              onClick={() => setShowSubmitPopup(true)}
              style={{ display: "flex" }}
            >
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
                  {paaData?.data?.topic_name}
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

        { (questions && questions?.length > 0) ? (
          <div className="question-section">
            <div className="question-box">
              <>
                {questions[currentQuestionIndex]?.question?.map(
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
                              className="boosterQuestion"
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
                            className="boosterQuestion"
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
              <div className="options">
                {questions[currentQuestionIndex]?.options?.map(
                  (option, index) => (
                    <div
                      key={index}
                      className={`option-card ${
                        selectedOptionIndex === index ? "selected" : ""
                      }`}
                      onClick={() => handleOptionSelect(index)}
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
                  )
                )}
              </div>
            </div>

            <div className="button-section" style={{ marginTop: "40px" }}>
              <div></div>
              <button
                className="btn-rgt"
                onClick={() =>
                  currentQuestionIndex < questions?.length - 1
                    ? handleNextQuestion()
                    : handleSubmitQuiz()
                }
                disabled={selectedOptionIndex === null}
                style={{
                  opacity: selectedOptionIndex === null ? "40%" : "100%",
                }}
              >
                Next
              </button>
            </div>
          </div>
        ):( <>
          <div style={{display:'flex',alignItems:'center',flexDirection:'column',gap:'20px'}}>
              <Image src={boosternoquestion}
                alt="Issue"
                width={350}
                height={350}
              />
              <div className="locktooltip-content">
                <h5 style={{ fontSize: '24px', textAlign: 'center', marginBottom: '10px' }}>Hey Explorer</h5>
                <p style={{ fontSize: '18px', textAlign: 'center', fontWeight: '600' }}>Quiz not ready, questions will be added soon! </p>
              </div>
        </div>
        <div className="button-section" style={{ marginTop: "60px" }}>
              <div></div>
              <button className="btn-rgt" onClick={() => handleJourney()}
              >
                Go to Journey
              </button>
        </div>

          </>)}
        {showSubmitPopup && (
          <div className="popup-overlay">
            <div className="quiz-popup-box">
              <h3>Quit Quiz?</h3>
              <p>Are you sure you want to quit?</p>
              <p>Your quiz progress won’t be saved.</p>
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

        {/* {showReportPopup && (
          <div className="popup-overlay">
            <div className="quiz-popup-box" style={{ minWidth: "500px" }}>
              <h3 style={{ width: "60%", margin: "0 auto" }}>
                What is the issue in this question?
              </h3>
              <p
                style={{
                  fontSize: "18",
                  fontWeight: "700",
                  textAlign: "left",
                  marginTop: "20px",
                }}
              >
                Select Issue Type
              </p>
              <div className="report-issue-options boosterCheckbox">
                <label>
                  <input type="checkbox" /> This question seems incorrect
                </label>
                <label>
                  <input type="checkbox" /> This question is unclear
                </label>
                <label>
                  <input type="checkbox" /> There is no correct option
                </label>
                <label>
                  <input type="checkbox" /> I can not see the image
                </label>
                <label>
                  <input type="checkbox" /> There is a mistake in the image
                </label>
                <label>
                  <input type="checkbox" /> There is some tech issue
                </label>
              </div>
              <div style={{ marginTop: "10px", textAlign: "left" }}>
                <p>Describe the issue:</p>
                <textarea
                  placeholder="Type here"
                  rows="4"
                  className="booster-report-textarea"
                ></textarea>
              </div>
              <div className="quiz-popup-btn" style={{ gap: "15px" }}>
                <button
                  onClick={() => setShowReportPopup(false)}
                  className="btn-lft"
                  style={{ width: "100%" }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowReportPopup(false)}
                  className="btn-rgt"
                  style={{ width: "100%" }}
                >
                  Submit Issue
                </button>
              </div>
            </div>
          </div>
        )} */}

        {isPopupOpenFeedback && (
          <div className="popup-overlay">
            <div className="quiz-popup-box" style={{minWidth:'450px', minHeight:'350px'}}>
              <h3 style={{ color: "#3EA8FF" }}>Yay!</h3>
              <p>You have become developing in this topic.</p>
              <div className="button-icon" style={{ marginTop: "60px" }}>
                <Image
                  src={Paapopup}
                  alt="Boost Icon"
                  width={250}
                  height={85}
                />
              </div>
              <div className="quiz-popup-btn" style={{marginTop:'60px'}}>
                <button
                  className="btn-rgt"
                  style={{ width: "100%" }}
                  onClick={handleContinue}
                >
                  Continue
                </button>
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

export default BoosterQuiz;
