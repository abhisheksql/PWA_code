"use client";
import "../../../../public/style/student.css";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { RxCross1 } from "react-icons/rx";
import QuizIcon from "../../../../public/images/studentimg/Quiz.svg";
import QuizCoin from "../../../../public/images/studentimg/quizcoin.svg";
import Coin from "../../../../public/images/studentimg/Coin.svg";
import Accuracy from "../../../../public/images/studentimg/Accuracy.svg";
import Time from "../../../../public/images/studentimg/Time.svg";
import Correct from "../../../../public/images/studentimg/Correct.svg";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "../../auth";
import Loader from "../../components/studentcomponent/Loader";
import DOMPurify from "dompurify";
import { FiFlag } from "react-icons/fi";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import ProgressConcept from "../../../../public/images/studentimg/ProgressConcept.svg";
import ProgressTree from "../../../../public/images/studentimg/ProgressNewTree.svg";
import ProgressPlant from "../../../../public/images/studentimg/ProgressNewPlant.svg";
import ProgressHalfPlant from "../../../../public/images/studentimg/ProgressHalfPlant.svg";
import ProgressFruitTree from "../../../../public/images/studentimg/ProgressFruitTree.svg";
import ProgressLamp from "../../../../public/images/studentimg/ProgressLamp.svg";
import feedback4 from "../../../../public/images/studentimg/feedbackPopupFruitTree.svg";
import feedback2 from "../../../../public/images/studentimg/feedbackPopupHalfPlant.svg";
import feedback1 from "../../../../public/images/studentimg/feedbackPopupPlan.svg";
import feedback3 from "../../../../public/images/studentimg/feedbackPopupTree.svg";
import ProficientIcon from "../../../../public/images/studentimg/ProficientIcon.svg";
import BeginnerIcon from "../../../../public/images/studentimg/BeginnerIcon.svg";
import DevelopingIcon from "../../../../public/images/studentimg/DevelopingIcon.svg";
import MasterIcon from "../../../../public/images/studentimg/MasterIcon.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WithoutQuestion from "../../../../public/images/studentimg/WithoutQuestion.svg";
import Typewriter from 'typewriter-effect';

const Quiz = () => {
  const studentbaseUrl = process.env.NEXT_PUBLIC_STUDENT_API_URL;
  const searchParams = useSearchParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [showSubmitPopup, setShowSubmitPopup] = useState(false);
  const [showSavePopup, setSavePopup] = useState(false);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [responses, setResponses] = useState([]);
  const [questions, setQuestion] = useState([]);
  const [chapterId, setChapterId] = useState(0);
  const [progress, setProgress] = useState(0);
  const [courseId, setCourseId] = useState(0);
  const [sectionId, setSectionId] = useState(0);
  const [topicId, setTopicId] = useState(0);
  const [schoolId, setSchoolId] = useState(0);
  const [popupType, setPopupType] = useState("");
  const [popupCoin, setPopupCoin] = useState("");
  const [popupAccuracy, setPopupAccuracy] = useState(0);
  const [popupTotal, setPopupTotal] = useState(0);
  const [popupCorrect, setPopupCorrect] = useState(0);
  const [popupTime, setPopupTime] = useState(0);
  const [quizKey, setQuizKey] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [testData, setTestData] = useState(null);
  const [error, setError] = useState(null);
  const [coinValue, setCoinValue] = useState(0);
  const [targetCoins, setTargetCoins] = useState(0);
  const [homeId, setHomeId] = useState(0);
  const [status, setStatus] = useState(0);
  const [responsesCheck, setResponsesCheck] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [popupTitle, setTitle] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [startGems, setStartGems] = useState(0);
  const [isPopupOpenFeedback, setIsPopupOpenFeedback] = useState(false);
  const [isPopupOpenFeedbackClt, setIsPopupOpenFeedbackClt] = useState(false);
  const[questionLengthCheck,setQuestionLengthCheck] = useState(false);
  const chapterIdparam = searchParams.get("chapterId");
  const courseIdparam = searchParams.get("courseId");
  const sectionIdparam = searchParams.get("sectionId");
  const topicIdparam = searchParams.get("topicId");
  const popupTypeparam = searchParams.get("popupType");
  const schoolIdparam = searchParams.get("schoolId");
  const homeIdparam = searchParams.get("home");
  const statusIdparam = searchParams.get("status");
  const startGemsparam = searchParams.get("startGems");
  const chapterNameParam = searchParams.get("chapterName");
  const Topicparam = searchParams.get("topic");
  const Subjectparam = searchParams.get("subject");

  const [reviewChapterName, setReviewChapterName] = useState("");
  const [reviewTopicName, setReviewTopicName] = useState("");
  const [reviewSubjectName, setReviewSubjectName] = useState("");
  const [isBoosterPopupOpen, setIsBoosterPopupOpen] = useState(false);
  const [reportedQuestionId, setReportedQuestionId] = useState(0);
  const [isFirstRender, setIsFirstRender] = useState(1);
  const [feedbackData, setFeedbackData] = useState([]);
  const [feedbackType, setFeedbackType] = useState("");
  const [studentData, setStudentData] = useState();
  const [showReportPopup, setShowReportPopup] = useState(false);
  const router = useRouter();
  const [validSequenceClt, setValidSequenceClt] = useState([]);
  const [progressClt, setProgressClt] = useState(0);

  const imageMap = {
    0: ProgressPlant,
    1: ProgressHalfPlant,
    2: ProgressTree,
    3: ProgressFruitTree,
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

  useEffect(() => {
    if (isBoosterPopupOpen) {
      const interval = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress >= 100) {
            return 0; // Restart progress from 0 when it reaches 100
          }
          return Math.min(oldProgress + 2, 100);
        });
      }, 100); // Adjust speed of progress

      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [isBoosterPopupOpen]);

  const startPaaTest = async () => {
    setIsBoosterPopupOpen(true);
    const formattedList = feedbackData?.topic_lu;
    try {
      const response = await axiosInstance.post("/test_generator/start_paa", {
        section_id: feedbackData?.section_id,
        course_id: feedbackData?.course_id,
        chapter_id: feedbackData?.chapter_id,
        topic_id: feedbackData?.topic_id,
        lu_ids: formattedList,
        subject_name: reviewSubjectName,
        chapter_name: reviewChapterName,
        topic_name: reviewTopicName,
      });
      if (response.data.status == "Success") {
        localStorage.removeItem("paa");
        localStorage.setItem("paa", JSON.stringify(response.data));
        router.push(`/student/booster?&home=${homeId}`);
        setIsBoosterPopupOpen(false);
      }
    } catch (error) {
      setIsBoosterPopupOpen(false);
      console.error("Error starting PAA test:", error);
    }
  };

  const handleTextareaChange = (e) => {
    setTextareaValue(e.target.value);
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

  const handleSubmit = async () => {
    setIsLoader(true);
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
    let quiz_type =
      popupType == "Quest"
        ? "PE"
        : popupType == "Milestone"
        ? "CLT"
        : popupType == "Readiness"
        ? "CRQ"
        : "";

    const formData = new FormData();
    formData.append("userid", studentData?.student_id || "");
    formData.append("class", studentData?.section_name || "");
    formData.append("is_parent", "No");
    formData.append("email", studentData?.email || "");
    formData.append("school", studentData?.school_name || "");
    formData.append("chapter", reviewChapterName || "");
    formData.append("topic", reviewTopicName || "");
    formData.append("activities", quiz_type || "");
    formData.append("subject", questionValue || "");
    formData.append("status", "Open");
    formData.append("priority", "");
    formData.append("interface", "Student Application");
    formData.append("issue_type", "Content");
    formData.append("name", studentData?.first_name + studentData?.last_name);
    formData.append("description", description || "");
    formData.append("subjects", reviewSubjectName || "");
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
  // localStorage.removeItem(`quizResponses_${quizKey}`);
  useEffect(() => {
    // Set state based on query parameters
    schoolIdparam ? setSchoolId(schoolIdparam) : 0;
    chapterIdparam ? setChapterId(chapterIdparam) : 0;
    courseIdparam ? setCourseId(courseIdparam) : 0;
    sectionIdparam ? setSectionId(sectionIdparam) : 0;
    topicIdparam ? setTopicId(topicIdparam) : 0;
    popupTypeparam ? setPopupType(popupTypeparam) : "";
    homeIdparam ? setHomeId(homeIdparam) : 0;
    statusIdparam ? setStatus(statusIdparam) : 0;
    startGemsparam ? setStartGems(startGemsparam) : 0;
    chapterNameParam ? setReviewChapterName(chapterNameParam) : "";
    Topicparam ? setReviewTopicName(Topicparam) : "";
    Subjectparam ? setReviewSubjectName(Subjectparam) : "";
  }, [
    chapterIdparam,
    courseIdparam,
    sectionIdparam,
    topicIdparam,
    popupTypeparam,
    schoolIdparam,
    homeIdparam,
    statusIdparam,
    startGemsparam,
    chapterNameParam,
    Topicparam,
    Subjectparam,
    popupType,
  ]);

  // useEffect(() => {
  //   let userid = localStorage.getItem("user_id");
  //   if (topicId > 0) {
  //     let key = `${userid}_${schoolId}_${chapterId}_${topicId}_${popupType}`;
  //     setQuizKey(key);
  //   } else {
  //     let key = `${userid}_${schoolId}_${chapterId}_${topicId}_${popupType}`;
  //     setQuizKey(key);
  //   }
  // }, [schoolId, topicId, chapterId]);
  useEffect(() => {
    const userid = localStorage.getItem("user_id");
    const key = `${userid}_${schoolId}_${chapterId}_${topicId}_${popupType}`;
    setQuizKey(key);
  }, [schoolId, topicId, chapterId, popupType]);

  if (typeof window !== "undefined") {
    const point = localStorage.getItem("reward_awarded");
  }

  useEffect(() => {

    // if (isFirstRender) {
    //   setIsFirstRender(false); // Update state to prevent further skips
    //   return;
    // }

    const fetchData = async () => {
      
      const apiParams = {
        test_type:
          popupType === "Quest"
            ? "PE"
            : popupType === "Milestone"
            ? "CLT"
            : popupType === "Readiness"
            ? "CRQ"
            : "",
        chapter_id: parseInt(chapterId, 10),
        section_id: parseInt(sectionId, 10),
        course_id: parseInt(courseId, 10),
        school_id: parseInt(schoolId, 10),
        topic_id: parseInt(topicId, 10),
        required_gems: parseInt(startGems, 10),
      };
      setIsLoader(true);
      try {
        const response = await axiosInstance.get(
          `studentapis/gen_or_get_save_data`,
          { params: apiParams }
        );
        if(response?.data?.status == "Success"){
          console.log("Success",response?.data?.data);
          if (response?.data?.data == null) {
            setQuestionLengthCheck(true);
          }

        }

        if (response?.data?.data?.submit_flag == true) {
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
              `/student?courseId=${courseId}&chapterId=${redirectValue}`
            );
          } else if (homeId == 2) {
            router.push(
              `/student/progresschapter?courseid=${courseId}&chapterid=${chapterId}`
            );
          } else {
            router.push(
              `/student/progresschapter?courseid=${courseId}&chapterid=${chapterId}`
            );
          }
          return;
        }
        setQuizTitle(response.data.data.name);

        const convertQuestions = (data) => {
          return data.data.question_data.map((questionsvalue) => {
            const {
              question_id,
              question,
              option,
              time_taken,
              options,
              answer,
              is_latex,
            } = questionsvalue;
            const optionsArray = Object.values(options).map((opt) => opt);
            return {
              questionId: question_id.toString(),
              selectedOption: option,
              timeTaken: time_taken,
              question: question,
              is_latex: is_latex,
              options: optionsArray,
              answer: answer, // Modify logic as needed
            };
          });
        };

        const questionsdata = convertQuestions(response.data);
        const extractedData = questionsdata.map(
          ({ questionId, selectedOption, timeTaken }) => ({
            questionId,
            selectedOption,
            timeTaken,
          })
        );
        const storedResponses = localStorage.getItem(
          `quizResponses_${quizKey}`
        );
        if (!storedResponses || storedResponses.length < 1) {
          localStorage.setItem(
            `quizResponses_${quizKey}`,
            JSON.stringify(extractedData)
          );
        }

        setQuestion(questionsdata);
        setTestData(response.data);
        setIsLoader(false);
      } catch (err) {
        setIsLoader(false);
        console.error("Error fetching test data:", err);
        setError(err.message);
      }
    };

    if (
      schoolId > 0 &&
      courseId > 0 &&
      chapterId > 0 &&
      sectionId > 0 &&
      popupType !== null
    ) {
      setIsFirstRender(false);
      fetchData();
    }
  }, [
    isFirstRender,
    schoolId,
    chapterId,
    sectionId,
    courseId,
    topicId,
    popupType,
    quizKey,
  ]);
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
  }, [currentQuestionIndex, questions,selectedOptionIndex,showReportPopup,showSubmitPopup,showSavePopup]);
  // Handle next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOptionIndex(null);
    } else {
      const finalData = JSON.parse(
        localStorage.getItem(`quizResponses_${quizKey}`)
      );
      // Ensure finalData is an array before calling .some()
      if (Array.isArray(finalData)) {
        const hasNegativeSelection = finalData.some(
          (item) => item.selectedOption < 0
        );
        setResponsesCheck(hasNegativeSelection);
      } else {
        console.error("finalData is not an array");
      }
      setShowSubmitPopup(true);
    }
  };
  // Handle previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOptionIndex(null);
    }
  };

  // Handle submit confirmation
  const handleContinue = () => {
    // setIsLoader(true);
    setShowSubmitPopup(false);
    setShowResultPopup(false);

    if (popupType == "Quest" || popupType == "Readiness") {
      setIsPopupOpenFeedback(true);
    } else if (popupType == "Milestone") {
      setIsPopupOpenFeedbackClt(true);
    }
  };

  const handleSaveQuiz = async (value) => {
    setIsLoader(true);
    let quiz_type =
      popupType == "Quest"
        ? "PE"
        : popupType == "Milestone"
        ? "CLT"
        : popupType == "Readiness"
        ? "CRQ"
        : "";
    let chapter_id = parseInt(chapterId, 10);
    let section_id = parseInt(sectionId, 10);
    let course_id = parseInt(courseId, 10);
    let school_id = parseInt(schoolId, 10);
    let topic_id = parseInt(topicId, 10);

    let quizpoint = 0;
    if (typeof window !== "undefined") {
      quizpoint = localStorage.getItem("reward_awarded");
    }
    const storedResponsessubmit = localStorage.getItem(
      `quizResponses_${quizKey}`
    );
    let submitparsedResponses = [];
    let submitquizres = [];
    if (storedResponsessubmit) {
      submitparsedResponses = JSON.parse(storedResponsessubmit);
      submitquizres = submitparsedResponses.map(
        ({ questionId, selectedOption, timeTaken }) => ({
          question_id: Number(questionId),
          option: selectedOption,
          time_taken: timeTaken,
        })
      );
    }

    const payload = {
      school_id: school_id,
      section_id: section_id,
      course_id: course_id,
      chapter_id: chapter_id,
      topic_id: topic_id,
      reward_point: Number(quizpoint),
      sequence: "",
      submit_flag: value,
      test: {
        quiz_type: quiz_type,
        responses: submitquizres,
      },
    };
    try {
      const response = await axiosInstance.post(
        "studentapis/submit_test",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      if (value) {
        setIsLoader(false);
        localStorage.setItem("quizfeedback", JSON.stringify(response.data));
        setTitle(response.data.data.title);
        setFeedbackData(response.data.data.feedback);
        const totaltopiccount = response.data.data.feedback.topic_bar.length;
        const noAttemptCount = response.data.data.feedback.topic_bar.filter(
          (topic) => topic == -1
        ).length;
        const finalCount = totaltopiccount - noAttemptCount;
        const progressPercentage =
          totaltopiccount == 0 ? 0 : (finalCount / totaltopiccount) * 100;
        const validSequence = response.data.data.feedback.topic_bar.filter(
          (num) => [0, 1, 2, 3].includes(num)
        );
        setValidSequenceClt(validSequence);
        setProgressClt(progressPercentage);
        setFeedbackType(response.data.data.quiz_type);
        setPopupCoin(response.data.data.coins);
        let accuracy_num = response.data.data.accuracy * 100;
        let accuracy_nums = parseFloat(accuracy_num.toFixed(2));
        setPopupAccuracy(accuracy_nums);
        setPopupTotal(response.data.data.total);
        setPopupCorrect(response.data.data.correct);
        setPopupTime(response.data.data.total_time);
        setShowResultPopup(true);
        setIsPopupOpenFeedback(false);
        setIsLoader(false);
        setCoinValue(response.data.data.balance.total_coins);
        setTargetCoins(
          response.data.data.balance.total_coins + response.data.data.coins
        );
      } else {
        setShowResultPopup(false);
        setIsLoader(true);
        let redirectValue;
        if (quiz_type == "CRQ") {
          redirectValue = `${chapter_id}1`;
        } else if (quiz_type == "CLT") {
          redirectValue = `${chapter_id}0`;
        } else {
          redirectValue = `${topic_id}1`;
        }

        if (homeId == 1) {
          router.push(`/student?courseId=${course_id}&chapterId=${redirectValue}`);
        } else if (homeId == 2) {
          router.push(
            `/student/progresschapter?courseid=${course_id}&chapterid=${chapter_id}`
          );
        } else {
          router.push(
            `/student/progresschapter?courseid=${course_id}&chapterid=${chapter_id}&tab=performance`
          );
        }
      }
    } catch (error) {
      setIsLoader(false);
      if (error.response && error.response.status === 409) {
        console.log("Handled 409 error as successful response");
        // Treat 409 as 200, proceed with the success logic
        if (value) {
          setShowResultPopup(true);
        } else {
          setShowResultPopup(false);
        }
      } else {
        // Handle other errors (network issues, server errors, etc.)
        console.error("Error submitting quiz:", error);
      }
    }
  };

  useEffect(() => {
    const storedResponses = localStorage.getItem(`quizResponses_${quizKey}`);
    if (storedResponses) {
      const parsedResponses = JSON.parse(storedResponses);
      setResponses(parsedResponses);
      for (let i = questions.length - 1; i >= 0; i--) {
        const { questionId } = questions[i]; // Current question's questionId
        // Find the corresponding response in parsedResponses
        const matchingResponse = parsedResponses.find(
          (response) => response.questionId == questionId
        );
        if (matchingResponse && matchingResponse.timeTaken > 0) {
          // selectedOption
          const questionIndex = questions.findIndex(
            (question) => question.questionId === questionId
          );

          if (matchingResponse) {
            setCurrentQuestionIndex(questionIndex);
            break; // Stop after finding the first match (from the end)
          }
        }
      }
    }
  }, [quizKey, questions]);

  const handleCheckBox = (index, clickRes = "") => {
    const endTime = Date.now(); // Record the time when leaving the current question
    const timeTaken = Math.max(
      Math.floor((endTime - questionStartTime) / 1000),
      1
    );
    const questionId = questions[currentQuestionIndex].questionId;
    setQuestionStartTime(Date.now());
    setResponses((prevResponses) => {
      const updatedResponses = [...prevResponses];
      const existingResponseIndex = updatedResponses.findIndex(
        (response) => response.questionId === questionId
      );
      if (existingResponseIndex >= 0) {
        if (!(clickRes == "skip")) {
          updatedResponses[existingResponseIndex].selectedOption = index;
        }
        updatedResponses[existingResponseIndex].timeTaken =
          (updatedResponses[existingResponseIndex].timeTaken || 0) + timeTaken;
      } else {
        // Add a new response
        updatedResponses.push({ questionId, selectedOption: index, timeTaken });
      }
      // Persist updated responses to localStorage
      localStorage.setItem(
        `quizResponses_${quizKey}`,
        JSON.stringify(updatedResponses)
      );
      setQuestionStartTime(Date.now());
      return updatedResponses;
    });
  };

  useEffect(() => {
    let interval;
    // Increment coins one by one until targetCoins
    if (coinValue < targetCoins) {
      interval = setInterval(() => {
        setCoinValue((prevValue) => {
          if (prevValue < targetCoins) {
            return prevValue + 1; // Increment by 1
          } else {
            clearInterval(interval); // Stop the interval when the target is reached
            return prevValue;
          }
        });
      }, 50); // Adjust speed by changing the interval duration
    }
    return () => clearInterval(interval); // Clean up the interval
  }, [coinValue, targetCoins, homeId, router, startGems]);

  const handlereview = () => {
    setIsLoader(true);

    let quiz_type =
      popupType == "Quest"
        ? "PE"
        : popupType == "Milestone"
        ? "CLT"
        : popupType == "Readiness"
        ? "CRQ"
        : "";
    router.push(
      `/student/reviewmyattempt?school_id=${schoolId}&section_id=${sectionId}&course_id=${courseId}&test_type=${quiz_type}&chapter_id=${chapterId}&home=${homeId}&topic_id=${topicId}`
    );
  };

  const handlegotojournybooster = () => {
    setIsLoader(true);
    router.push(
      `/student/progresschapter?courseid=${courseId}&chapterid=${chapterId}`
    );
  };

  const handleGoHome = () => {
    setIsLoader(true);
    let quiz_type =
      popupType == "Quest"
        ? "PE"
        : popupType == "Milestone"
        ? "CLT"
        : popupType == "Readiness"
        ? "CRQ"
        : "";

    let redirectValue;
    if (quiz_type == "CRQ") {
      redirectValue = `${chapterId}1`;
    } else if (quiz_type == "CLT") {
      redirectValue = `${chapterId}0`;
    } else {
      redirectValue = `${topicId}1`;
    }
    if (homeId == 1) {
      router.push(
        `/student?courseId=${courseId}&chapterId=${redirectValue}`
      );
    } else if (homeId == 2) {
      router.push(
        `/student/progresschapter?courseid=${courseId}&chapterid=${chapterId}`
      );
    } else {
      router.push(
        `/student/progresschapter?courseid=${courseId}&chapterid=${chapterId}&tab=performance`
      );
    }
  };

  const handleReportClick = () => {
    const currentQuestion = questions[currentQuestionIndex];
    setReportedQuestionId(currentQuestion.questionId);
    setShowReportPopup(true); // Open modal
    // Report
  };

  if (questions.length < 1 || !localStorage.getItem(`quizResponses_${quizKey}`)) {


    if (questionLengthCheck == true) {
      return <div className="quiz-container">
      <div className="progress-head">
        <div className="progress-head-icon">
          <Image src={QuizIcon} alt="Readiness" className="progress-show" />
        </div>
        <div className="quizhead-container">
          <div className="progress-info">
            <span>{popupType}</span>
            <p>{popupType == 'Quest' ? reviewTopicName : reviewTopicName}</p>
          </div>
          <div className="chapter-info">
            <button
              onClick={() => handleGoHome()} // Pass a function to set the state
              className="quit-btn"
            >
              <RxCross1 /> Quit
            </button>
          </div>
        </div>
      </div>
      <div className="question-section" style={{ minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div>
              <Image src={WithoutQuestion}
                alt="Issue"
                width={350}
                height={350}
              />
              <div className="locktooltip-content">
                <h5 style={{ fontSize: '24px', textAlign: 'center', marginBottom: '10px' }}>Hey Explorer</h5>
                <p style={{ fontSize: '18px', textAlign: 'center', fontWeight: '600' }}>Quiz not ready, questions will be added soon! </p>
              </div>
            </div>
          </div>
      </div>;
    }

    return <Loader />;
  }

  
  
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
    svg: {
      fontCache: "global",
    },
    startup: {
      typeset: true,
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
              <span>{popupType}</span>
              <p>{quizTitle}</p>
            </div>
            <div className="chapter-info">
              <button
                onClick={() => setSavePopup(true)} // Pass a function to set the state
                className="quit-btn"
              >
                <RxCross1 /> Quit
              </button>
            </div>
          </div>
        </div>

        <div className="question-section">
          <div className="question-section-header">
            <div>
              {questions.map((_, index) => (
                // <>
                <button
                  key={index}
                  className={`${
                    index == currentQuestionIndex ? "active" : ""
                  } ${
                    responses.some(
                      (item) =>
                        item.questionId == questions[index].questionId &&
                        item.timeTaken > 0
                    )
                      ? ` ${
                          responses.some(
                            (item) =>
                              item.questionId == questions[index].questionId &&
                              item.selectedOption > -1
                          )
                            ? "orange"
                            : "light-orange"
                        }`
                      : "nav-btn"
                  }`}
                  onClick={() => {
                    setCurrentQuestionIndex(index);
                    handleCheckBox(-1, "skip");
                  }}
                  disabled={`${
                    responses.some(
                      (item) =>
                        item.questionId == questions[index].questionId &&
                        item.timeTaken < 1
                    )
                      ? true
                      : ""
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="question-section-report">
              <span onClick={handleReportClick} style={{ cursor: "pointer" }}>
                <FiFlag style={{ color: "#FD6845" }} /> Report
              </span>
            </div>
          </div>

          <div className="question-box">
            <>
              {questions[currentQuestionIndex].question.map((qItem, index) => (
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
                          className="question"
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
                        className="question"
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
              ))}
            </>
            <div className="options">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <div
                  key={index}
                  className={`option-card ${
                    responses.find(
                      (response) =>
                        response.questionId ===
                        questions[currentQuestionIndex].questionId
                    )?.selectedOption === index
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedOptionIndex((prevIndex) => {
                      let value = -1;
                      const currentResponse = responses.find(
                        (response) =>
                          response.questionId ==
                          questions[currentQuestionIndex].questionId
                      );
                      if (prevIndex == null || prevIndex == undefined) {
                        if (currentResponse) {
                          if (
                            currentResponse.selectedOption == index &&
                            currentResponse.selectedOption > -1
                          ) {
                            value = -1;
                          } else {
                            value = index;
                          }
                        } else {
                        }
                      } else if (currentResponse.selectedOption !== index) {
                        value = index;
                      } else {
                      }
                      // Return the new index
                      handleCheckBox(value);
                      return value;
                    });
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
                            <div style={{ marginBottom: "5px" }}>
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
                                __html: DOMPurify.sanitize(optionchild.content),
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
              ))}
            </div>
          </div>

          <div className="button-section">
            <button
              className="prev-btn"
              onClick={() => {
                handlePreviousQuestion();
                handleCheckBox(-1, "skip");
              }}
              disabled={currentQuestionIndex === 0}
            >
              Previous Question
            </button>
            <button
              className={`${
                responses.find(
                  (response) =>
                    response.questionId ==
                    questions[currentQuestionIndex].questionId
                )?.selectedOption > -1
                  ? "selected-btn"
                  : "next-btn"
              }`}
              onClick={() => {
                handleCheckBox(-1, "skip");
                handleNextQuestion();
              }}
            >
              {currentQuestionIndex === questions.length - 1
                ? "Submit Quiz"
                : "Next Question"}
            </button>
          </div>
        </div>
        {showSubmitPopup && (
          <div className="popup-overlay">
            <div className="quiz-popup-box">
              <h3>Submit Quiz?</h3>
              <p>Are you sure you want to submit this quiz?</p>

              {responsesCheck && (
                <div className="quiz-popup-red">
                  <p style={{ margin: "0px" }}>Attention!</p>
                  <p style={{ margin: "0px" }}>
                    Any unanswered questions will be scored as zero.
                  </p>
                </div>
              )}
              <div className="quiz-popup-btn">
                <button
                  onClick={() => setShowSubmitPopup(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveQuiz(true)}
                  className="yes-btn"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
        {showSavePopup && (
          <div className="popup-overlay">
            <div className="quiz-popup-box">
              <h3>Quit Quiz?</h3>
              <p>Are you sure you want to quit this quiz?</p>
              <div className="quiz-popup-btn">
                <button
                  onClick={() => setSavePopup(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveQuiz(false)}
                  className="yes-btn"
                >
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
              style={{ width: "450px", maxHeight: "95vh" }}
            >
              <div style={{ display: "flex", justifyContent: "right" }}>
                <div className="cod-1" style={{ width: "20%" }}>
                  <Image src={Coin} alt="Coin Icon" width={20} height={20} />
                  <span style={{ fontSize: "13px", fontWeight: "700" }}>
                    {coinValue}
                  </span>
                </div>
              </div>
              <h3 style={{ color: "#FF8A00", fontSize: "" }}>
                {popupType} Completed!
              </h3>
              <p style={{ fontSize: "15px", fontWeight: "700" }}>
                {popupTitle}
              </p>
              <Image
                src={QuizCoin}
                alt="Quiz Coin"
                style={{ position: "relative", top: "-40px" }}
                width={230}
                height={215}
              />

              <div className="popup-middle">
                <p style={{ fontSize: "18px" }}>You have earned</p>
                <p style={{ color: "#FF8A00", fontSize: "16px" }}>
                  <span>
                    <Image
                      src={Coin}
                      alt="Readiness"
                      className="progress-show"
                      width={25}
                      height={25}
                    />
                    +{popupCoin}
                  </span>{" "}
                  discovery coins.
                </p>
              </div>

              <div
                className="quest-multibox"
                style={{ position: "relative", top: "-50px" }}
              >
                <div className="quest-multibox1">
                  <Image src={Accuracy} alt="Accuracy" />
                  <span>{popupAccuracy}%</span>
                  <p>Accuracy</p>
                </div>
                <div className="quest-multibox2">
                  <Image src={Correct} alt="Correct" />
                  <span>
                    {popupCorrect}/{popupTotal}
                  </span>
                  <p>Correct</p>
                </div>

                <div className="quest-multibox3">
                  <Image src={Time} alt="Time" />
                  <span>{popupTime}</span>
                  <p>Time spent</p>
                </div>
              </div>
              <button
                onClick={handleContinue}
                className="continue-btn"
                style={{ width: "100%", position: "relative", top: "-30px" }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {isPopupOpenFeedback && (
          <div className="modal-overlay">
            <div
              className="progress-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>{popupTitle}</h2>
              <div className="button-icon">
                <Image
                  src={
                    feedbackData?.icon_tag == "developing"
                      ? feedback2
                      : feedbackData?.icon_tag == "proficient"
                      ? feedback3
                      : feedbackData?.icon_tag == "beginner"
                      ? feedback1
                      : feedbackData?.icon_tag == "master"
                      ? feedback4
                      : feedback1 // Default fallback
                  }
                  alt="Boost Icon"
                  width={180}
                  height={180}
                />
              </div>
              <div className="progressPopupContent">
                <h3>
                  <Typewriter
                    onInit={(typewriter) => {
                      typewriter
                        .typeString(feedbackData.feedback_msg)
                        .start();
                    }}
                    options={{
                      cursor: "",
                      delay: 10,
                      loop: false,
                      autoStart: false,
                    }}
                  />
                </h3>
                <div className="progressConceptList">
                  {feedbackData?.lu_list?.length > 0 ? (
                    <>
                      <div className="progressConceptBox">
                        <Image
                          src={ProgressConcept}
                          alt="Boost Icon"
                          width={30}
                          height={30}
                        />
                        <p>
                          <Typewriter
                            onInit={(typewriter) => {
                              typewriter
                                .typeString( "Concepts that need practice:")
                                .start();
                            }}
                            options={{
                              cursor: "",
                              delay: 10,
                              loop: false,
                              autoStart: false,
                            }}
                          />
                        </p>
                      </div>

                      {feedbackData?.lu_list?.map((item, index) => (
                        <p key={index}>
                          <Typewriter
                            onInit={(typewriter) => {
                              typewriter
                                .typeString(item.lu_name)
                                .start();
                            }}
                            options={{
                              cursor: "",
                              delay: 10,
                              loop: false,
                              autoStart: false,
                            }}
                          />
                        </p>
                      ))}
                    </>
                  ) : null}
                </div>

                {/* {feedbackData?.quiz_type == "PE" &&
                  feedbackData?.topic_lu?.length > 0 && (
                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <button
                        className="progressBooster"
                        onClick={startPaaTest}
                      >
                        Boost
                        <Image
                          src={ProgressLamp}
                          alt="Boost Icon"
                          width={20}
                          height={20}
                          className="button-icon"
                        />
                      </button>
                    </div>
                  )} */}

              </div>
              <div className="quiz-popup-btn">
                <button className="cancel-btn" onClick={handleGoHome}>
                  Go to journey
                </button>
                <button className="yes-btn" onClick={handlereview}>
                  Review my attempt
                </button>
              </div>
            </div>
          </div>
        )}

        {isPopupOpenFeedbackClt && (
          <div className="modal-overlay">
            <div
              className="progress-modal-content-progressbar"
              onClick={(e) => e.stopPropagation()}
              style={{ padding: "0px" }}
            >
              <div className="progress-modal-progressbar">
                <h2 style={{ padding: "20px", marginBottom: "10px" }}>
                  {popupTitle}
                </h2>

                <div style={{ position: "relative", top: "10px" }}>
                  {validSequenceClt.length > 0 ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: `${progressClt}%`,
                        transition: "width 0.3s ease-in-out",
                        position: "relative",
                        top: "20px",
                        zIndex: "10",
                        minHeight: "30px",
                      }}
                    >
                      {validSequenceClt.map((num, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flex: 1,
                          }}
                        >
                          <Image
                            src={imageMap[num]}
                            alt="progress stage"
                            width={35}
                            height={35}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ minHeight: "35px" }}></div>
                  )}

                  <div className="progress-flowerbar-background">
                    <div
                      className="progress-flowerbar-fill"
                      style={{ width: `${progressClt}%` }}
                    ></div>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${progressClt}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="progressPopupContent" style={{ margin: "20px" }}>
                {/* <h3>{feedbackData?.feedback_msg}</h3> */}
                <h3>
                  <Typewriter
                    onInit={(typewriter) => {
                      typewriter
                        .typeString(feedbackData.feedback_msg)
                        .start();
                    }}
                    options={{
                      cursor: "",
                      delay: 10,
                      loop: false,
                      autoStart: false,
                    }}
                  />
                </h3>

                <div className="progressConceptList">
                  {feedbackData?.lu_list?.length > 0 && (
                    <>
                      <div className="progressConceptBox">
                        <Image
                          src={ProgressConcept}
                          alt="Boost Icon"
                          width={20}
                          height={20}
                        />
                       <p>
                        <Typewriter
                          onInit={(typewriter) => {
                            typewriter
                              .typeString( "Concepts that need practice:")
                              .start();
                          }}
                          options={{
                            cursor: "",
                            delay: 10,
                            loop: false,
                            autoStart: false,
                          }}
                        />
                      </p>
                      </div>
                      {feedbackData?.lu_list?.map((item, index) => (
                        <div
                          className="dfjs"
                          key={index}
                          style={{ gap: "10px" }}
                        >
                          <div className="progress-icon">
                            <Image
                              src={
                                item.lu_status === "developing"
                                  ? DevelopingIcon
                                  : item.lu_status === "proficient"
                                  ? ProficientIcon
                                  : item.lu_status === "beginner"
                                  ? BeginnerIcon
                                  : item.lu_status === "master"
                                  ? MasterIcon
                                  : BeginnerIcon // Default fallback
                              }
                              alt="Progress Icon"
                            />
                          </div>
                          {/* <p>{item.lu_name}</p> */}
                          <p>
                            <Typewriter
                              onInit={(typewriter) => {
                                typewriter
                                  .typeString(item.lu_name)
                                  .start();
                              }}
                              options={{
                                cursor: "",
                                delay: 10,
                                loop: false,
                                autoStart: false,
                              }}
                            />
                          </p>
                        </div>
                      ))}
                    </>
                  )}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    className="gotojournybooster"
                    onClick={handlegotojournybooster}
                  >
                    View Progress
                  </button>
                </div>
              </div>

              <div className="quiz-popup-btn" style={{ margin: "20px" }}>
                <button className="cancel-btn" onClick={handleGoHome}>
                  Go to journey
                </button>
                <button className="yes-btn" onClick={handlereview}>
                  Review my attempt
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
              <div className="report-issue-options">
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
                  className="report-textarea"
                ></textarea>
              </div>
              <div className="quiz-popup-btn">
                <button
                  onClick={() => setShowReportPopup(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleSubmit(); // Call handleSubmit function
                    setShowReportPopup(false); // Close the popup after submit
                  }}
                  className="yes-btn"
                >
                  Submit Issue
                </button>
              </div>
            </div>
          </div>
        )}

        {isBoosterPopupOpen && (
          <div className="popup-overlay">
            <div className="quiz-popup-box" style={{ width: "450px" }}>
              <h3 style={{ marginBottom: "20px" }}>
                Hey Explorer, we are loading your progress for this topic:
              </h3>
              <p>{reviewTopicName}</p>
              <div className="quiz-popup-btn" style={{ marginTop: "30px" }}>
                <div className=" customProgressWrapper">
                  <div
                    className="customProgressBar"
                    style={{
                      width: `${progress}%`,
                    }}
                  ></div>
                </div>
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
        {isLoader ? <Loader /> : ""}
      </div>
    </MathJaxContext>
    </div>
  );
};
export default Quiz;
