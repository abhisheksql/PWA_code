"use client";
import "../../../../public/style/student.css";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { RxCross2 } from "react-icons/rx";
import TopSvg from "../../../../public/images/studentimg/top-svg.svg";
import BtmSvg from "../../../../public/images/studentimg/btm-svg.svg";
import MagicLamp from "../../../../public/images/studentimg/MagicLamp.svg";
import ReadinessPink from "../../../../public/images/studentimg/ReadinessPink.svg";
import Coin from "../../../../public/images/studentimg/Coin.svg";
import Gems from "../../../../public/images/studentimg/Gems.svg";
import ReadinessBlue from "../../../../public/images/studentimg/ReadinessBlue.svg";
import PlantPopup from "../../../../public/images/studentimg/PlantPopup.svg";
import TreePopup from "../../../../public/images/studentimg/TreePopup.svg";
import JinnyLamp from "../../../../public/images/studentimg/JinnyLamp.svg";
import Oops from "../../../../public/images/studentimg/oops.svg";
import PEillustration from "../../../../public/images/studentimg/PEillustration.svg";
import ReviewAccuracy from "../../../../public/images/studentimg/reviewAccuracy.svg";
import { useRouter } from "next/navigation";
import popupImg from "../../../../public/images/studentimg/CoinSparc.svg";
import Loader from "../../components/studentcomponent/Loader";
import axiosInstance from "../../auth";
import JinnyLampbgImg from "../../../../public/images/studentimg/JinnyLampbgImg.svg";
import TooltipLock from "../../../../public/images/studentimg/TooltipLock.svg";
const HomeAssignedChapter = ({
  chapterData,
  balanceData,
  userLoginData,
  setReCall,
  setLoginCall,
  loginCall,
  setCallBuyHome,
  newChapterId,
  userName,
  chapterStatus,
  handleBuyGem,
  reCallCard,
}) => {
  const router = useRouter();
  const [isLoader, setIsLoader] = useState(false);
  const [chapterName, setChapterName] = useState("");
  const [heading, setHeading] = useState("");
  const [subHeading, setSubHeading] = useState("");
  const [requiredgem, setRequiredgem] = useState("");
  const [rewardawarded, setRewardawarded] = useState(0);
  const [popType, setPopType] = useState("");
  const [chapterId, setChapterId] = useState(0);
  const [courseId, setCourseId] = useState(0);
  const [sectionId, setSectionId] = useState(0);
  const [topicId, setTopicId] = useState(0);
  const [testUrl, setTestUrl] = useState("");
  const [schoolId, setschoolId] = useState(0);
  const [reviewPopShow, setReviewPopShow] = useState(false);
  const [noOfCorrect, setNoOfCorrect] = useState(0);
  const [totalQuestion, setTotalQuestion] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [reviewPopClaimShow, setReviewPopClaimShow] = useState(false);
  const [oopspopShow, setOopspopShow] = useState(false);
  const [startGems, setStartGems] = useState(0);
  const [reviewChapterName, setReviewChapterName] = useState("");
  const [reviewTopicName, setReviewTopicName] = useState("");
  const [reviewSubjectName, setReviewSubjectName] = useState("");
  const [isBoosterPopupOpen, setIsBoosterPopupOpen] = useState(false);
  const[boosterResponseIsLoader,setBoosterResponseIsLoader] =useState(false);
  const[startPaaLoader,setstartPaaLoader] =useState(false);
  const [progress, setProgress] = useState(0);
  const [visibleTooltipId, setVisibleTooltipId] = useState(null);

  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  // Reference for the tooltip container
  const tooltipRef = useRef(null);
  const buttonRef = useRef(null);
  // const handleTooltipToggle = () => {
  //   setIsTooltipVisible(!isTooltipVisible);
  // };

  // 2. Update toggle function to take an ID parameter
const handleTooltipToggle = (tooltipId) => {
  if (visibleTooltipId === tooltipId) {
    setVisibleTooltipId(null); // Close if already open
  } else {
    setVisibleTooltipId(tooltipId); // Open this specific tooltip
  }
};


  const [isBoostersectionId, setIsBoostersectionId] = useState(0);
  const [isBoostercourseId, setIsBoostercourseId] = useState(0);
  const [isBoosterchapterId, setIsBoosterchapterId] = useState(0);
  const [isBoostertopicId, setIsBoostertopicId] = useState(0);
  const [isBoosterlu_ids, setIsBoosterlu_ids] = useState([]);
  const [isBoostersubjectName, setIsBoostersubjectName] = useState('');
  const [isBoosterchapterName, setIsBoosterchapterName] = useState('');
  const [isBoosterheading, setIsBoosterheading] = useState('');

  const [showPopup, setShowPopup] = useState({
    Readiness: false,
    // Quest: false,
    // Milestone: false,
    magicLamp: false,
    OopsPopUp: false,
    readinessblue: false,
    plant: false,
    tree: false,
    welcome: false,
    discoveryCoins: false,
    discoveryGems: false,
    welcomeback: false,
  });

  // Add refs for modal containers
  const modalRef = useRef(null);
  const reviewPopupRef = useRef(null);
  const oopsPopupRef = useRef(null);
  const boosterPopupRef = useRef(null);
  const reviewClaimPopupRef = useRef(null);

  // startPaaLoader
  useEffect(() => {
    const storedReview = localStorage.getItem("review");
    if (storedReview) {
      setReviewPopClaimShow(true);
    }
  }, []);

//   useEffect(() => {
//     if(startPaaLoader == true){
//     if(boosterResponseIsLoader == true){
//       // setIsLoader(true);
//       alert("Booster Response is loading");
//     }else if(boosterResponseIsLoader == false){
//       alert("Booster Response");
//   }
// }
//     // const storedReview = localStorage.getItem("review");
//     // if (storedReview) {
//     //   setReviewPopClaimShow(true);
//     // 
//   }, [startPaaLoader,boosterResponseIsLoader]);
  const handleIconClick = (
    popupType,
    heading,
    required_gem,
    reward_awarded,
    is_submit,
    schoolId,
    chapterId,
    sectionId,
    courseId,
    topicId = 0,
    no_of_correct,
    total_question,
    percentage,
    locked,
    start_gems,
    chapterName,
    subjectName,
    lu_ids
  ) => {
    setReviewTopicName(heading);
    if (popupType == "Booster") {
      // setBoosterResponseIsLoader(true);
      setIsBoosterPopupOpen(true);

      setIsBoostersectionId(sectionId);
      setIsBoostercourseId(courseId);
      setIsBoosterchapterId(chapterId);
      setIsBoostertopicId(topicId);
      setIsBoosterlu_ids(lu_ids);
      setIsBoostersubjectName(subjectName);
      setIsBoosterchapterName(chapterName);
      setIsBoosterheading(heading);
      // const startPaaTest = async () => {
      //   try {
      //     const response = await axiosInstance.post(
      //       "/test_generator/start_paa",
      //       {
      //         section_id: sectionId,
      //         course_id: courseId,
      //         chapter_id: chapterId,
      //         topic_id: topicId,
      //         lu_ids: lu_ids,
      //         subject_name: subjectName,
      //         chapter_name: chapterName,
      //         topic_name: heading,
      //       }
      //     );
      //     if (response.data.status == "Success") {
      //       localStorage.setItem("paa", JSON.stringify(response.data));
      //       setBoosterResponseIsLoader(false);
      //       // setIsBoosterPopupOpen(false);
      //       // router.push(`/student/booster?home=1`);
      //     }
      //   } catch (error) {
      //     setBoosterResponseIsLoader(false);
      //     setIsBoosterPopupOpen(false);
      //     console.error("Error starting PAA test:", error);
      //   }
      // };
      // startPaaTest();
      return;
    }

    if (chapterId == -1 || locked) {
      return;
    }
    setStartGems(start_gems);
    setNoOfCorrect(no_of_correct);
    setTotalQuestion(total_question);
    let accuracy_num = percentage * 100;
    let accuracy_nums = parseFloat(accuracy_num.toFixed(2));
    setPercentage(accuracy_nums);
    localStorage.removeItem("reward_awarded");
    localStorage.setItem("reward_awarded", reward_awarded);
    setschoolId(schoolId);
    setChapterId(chapterId);
    setCourseId(courseId);
    setSectionId(sectionId);
    setTopicId(topicId);
    setChapterName(heading);
    setPopType(popupType);
    setRequiredgem(required_gem);
    setRewardawarded(reward_awarded);
    setReviewChapterName(chapterName);
    setReviewSubjectName(subjectName);
    let redirectUrl = `/student/testenvironment?schoolId=${schoolId}&&chapterId=${chapterId}&courseId=${courseId}&sectionId=${sectionId}&topicId=${topicId}&startGems=${start_gems}&popupType=${popupType}&home=1&status=${chapterStatus}&chapterName=${chapterName}&topic=${heading}&subject=${subjectName}`;
    setTestUrl(redirectUrl);

    if (popupType == "Readiness") {
      setHeading("Time to begin your learning adventure!");
      setSubHeading("Start this quiz to explore your chapter readiness.");
    } else if (popupType == "Quest") {
      setHeading("Discover the Explorer Within You!");
      setSubHeading("Start your quiz if you've studied this topic in class.");
    } else if (popupType == "Milestone") {
      setHeading("Ready to conquer your learning!");
      setSubHeading("Start this quiz to discover your understanding.");
    }

    let totalGems = balanceData?.data?.cur_gems || 0;
    if (is_submit == false && totalGems < start_gems) {
      setOopspopShow(true);
    } else if (is_submit == false) {
      setShowPopup({ ...showPopup, [popupType]: true });
    } else {
      setReviewPopShow(true);
    }
  };

  const handleClosePopup = (popupType = null, nextPopupType = null) => {
    setShowPopup({
      Readiness: false,
    });
    if (popupType == "discoveryGems") {
      localStorage.removeItem("UserLoginvaluedata");
    }
    setShowPopup((prevState) => ({
      ...prevState,
      [popupType]: false,
      ...(nextPopupType ? { [nextPopupType]: true } : {}),
    }));
  };

  // boosterResponseIsLoader

  const handleBoosterRedirect = async () => {
    setIsLoader(true);
    try {
      const response = await axiosInstance.post(
        "/test_generator/start_paa",
        {
          section_id: isBoostersectionId,
          course_id: isBoostercourseId,
          chapter_id: isBoosterchapterId,
          topic_id: isBoostertopicId,
          lu_ids: isBoosterlu_ids,
          subject_name: isBoostersubjectName,
          chapter_name: isBoosterchapterName,
          topic_name: isBoosterheading,
        }
      );

      if (response.data.status === "Success") {
        localStorage.setItem("paa", JSON.stringify(response.data));
        // setBoosterResponseIsLoader(false);
        // Optional routing if needed:
        // setIsBoosterPopupOpen(false);
        // setIsLoader(false);
        router.push(`/student/booster?home=1`);
      }
    } catch (error) {
      // setBoosterResponseIsLoader(false);
      setIsBoosterPopupOpen(false);
      setIsLoader(false);
      console.error("Error starting PAA test:", error);
    }

    
  };

  const handleProgressRedirect = () => {
    let quiz_type =
      popType == "Quest"
        ? "PE"
        : popType == "Milestone"
        ? "CLT"
        : popType == "Readiness"
        ? "CRQ"
        : "";
    setIsLoader(true);
    router.push(
      `student/progresschapter?chapterid=${chapterId}&courseid=${courseId}&test_type=${quiz_type}`
    );
  };

  const handleReviewRedirect = () => {
    let quiz_type =
      popType == "Quest"
        ? "PE"
        : popType == "Milestone"
        ? "CLT"
        : popType == "Readiness"
        ? "CRQ"
        : "";
    setIsLoader(true);
    router.push(
      `/student/reviewmyattempt?school_id=${schoolId}&section_id=${sectionId}&course_id=${courseId}&test_type=${quiz_type}&chapter_id=${chapterId}&topic_id=${topicId}&home=1&status=${chapterStatus}&chapterName=${reviewChapterName}&topic=${reviewTopicName}&subject=${reviewSubjectName}`
    );
  };

  const handleQuestionRedirect = () => {



    const userid = localStorage.getItem("user_id");
    const key = `${userid}_${schoolId}_${chapterId}_${topicId}_${popType}`;
    localStorage.removeItem(`quizResponses_${key}`);

    setIsLoader(true);
    router.push(`${testUrl}`);
  };

  const handleCloseClaimShow = () => {
    const storedReviewClaim = localStorage.getItem("review");

    if (storedReviewClaim) {
      localStorage.setItem("storedReviewclaim", storedReviewClaim);
      setReCall((prevState) => (prevState === 0 ? 1 : 0));
    }
    localStorage.removeItem("review");
    setReviewPopClaimShow(false);
  };
  let isTopSvg = true;

  useEffect(() => {
    const scrollToElement = (newChapterId) => {
      if (newChapterId == undefined || newChapterId == null) {
        return;
      }
      const targetElement = document.getElementById(String(newChapterId));
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        setTimeout(() => scrollToElement(newChapterId), 100); // Retry after 100ms
      }
    };
    if (newChapterId && newChapterId > 0) {
      scrollToElement(newChapterId);
    }
  }, [newChapterId]);

  useEffect(() => {
    const mainContent = document.querySelector(".mainContent");
    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" }); // Fallback
    }
  }, [reCallCard]);

  // useEffect(() => {
  //   if (isBoosterPopupOpen) {
  //     const interval = setInterval(() => {
  //       setProgress((oldProgress) => {
  //         if (oldProgress >= 100) {
  //           return 0; // Restart progress from 0 when it reaches 100
  //         }
  //         return Math.min(oldProgress + 2, 100);
  //       });
  //     }, 100); // Adjust speed of progress

  //     return () => clearInterval(interval); // Cleanup interval on unmount
  //   }
  // }, [isBoosterPopupOpen]);

  // Handle outside click for all popups
  useEffect(() => {
    function handleClickOutside(event) {
      if (isLoader) {
        return;
      }

      if (visibleTooltipId !== null && 
        tooltipRef.current && 
        !tooltipRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)) {
      setVisibleTooltipId(null);
    }

      // For regular popups (Readiness, Quest, Milestone, etc.)
      if (
        (showPopup.Readiness ||
          showPopup.Quest ||
          showPopup.Milestone ||
          showPopup.magicLamp ||
          showPopup.readinessblue ||
          showPopup.plant ||
          showPopup.tree) &&
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        setShowPopup({
          Readiness: false,
          Quest: false,
          Milestone: false,
          magicLamp: false,
          readinessblue: false,
          plant: false,
          tree: false,
          welcome: false,
          discoveryCoins: false,
          discoveryGems: false,
          welcomeback: false,
        });
      }
      // For review popup
      if (
        reviewPopShow &&
        reviewPopupRef.current &&
        !reviewPopupRef.current.contains(event.target)
      ) {
        setReviewPopShow(false);
      }

      // For oops popup
      if (
        oopspopShow &&
        oopsPopupRef.current &&
        !oopsPopupRef.current.contains(event.target)
      ) {
        setOopspopShow(false);
      }

      // For booster popup
      if (
        isBoosterPopupOpen &&
        boosterPopupRef.current &&
        !boosterPopupRef.current.contains(event.target)
      ) {
        setIsBoosterPopupOpen(false);
      }

      // For review claim popup
      if (
        reviewPopClaimShow &&
        reviewClaimPopupRef.current &&
        !reviewClaimPopupRef.current.contains(event.target)
      ) {
        handleCloseClaimShow();
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Remove event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    showPopup,
    reviewPopShow,
    oopspopShow,
    isBoosterPopupOpen,
    reviewPopClaimShow,
    isLoader,
    visibleTooltipId
  ]);

  return (
    <div className="mainContent">
      {chapterData && chapterData.data && chapterData.data.chapter_data ? (
        chapterData.data.chapter_data.map((chapter) => (
          <div key={chapter.chapter_id}>
            <div className="sticky" id={chapter.chapter_id}>
              <div className="progress-head">
                <div
                  className="progress-head-icon"
                  style={{ backgroundColor: "rgba(255, 138, 0, 0.1)" }}
                >
                  <Image
                    src={chapter.icon}
                    alt="Ongoing Maths"
                    className="progress-show"
                    width={30}
                    height={30}
                  />
                </div>
                <div className="progress-details">
                  <div className="progress-info">
                    <span>{chapter.chapter_name}</span>
                    <p>
                      {chapter.chapter_id > 0
                        ? chapter.due_date
                        : chapter.chapter_dec}
                    </p>
                  </div>
                  <div className="chapter-info">
                    <button className="previous-chapter-btn">
                      {chapter.status.charAt(0).toUpperCase() +
                        chapter.status.slice(1) ==
                      "Completed"
                        ? "Previous"
                        : chapter.status.charAt(0).toUpperCase() +
                            chapter.status.slice(1) ==
                          "Upcoming"
                        ? "Upcoming"
                        : "Ongoing"}
                    </button>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {chapter.chapter_id > 0 && (
                        <div>
                          <p>
                            <span
                              style={{ color: "#FF8A00", fontSize: "12px" }}
                            >
                              {chapter.total_activity_completion}/
                              {chapter.total_activity}
                            </span>{" "}
                            Quizzes
                          </p>
                        </div>
                      )}

                      {chapter.chapter_id > 0 && (
                        <div className="progress-bar-background">
                          <div
                            className="progress-bar-fill"
                            style={{
                              width: `${
                                (chapter.total_activity_completion /
                                  chapter.total_activity) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {chapter.crq && chapter.crq.length > 0 && (
              <div className="stage">
                <div className={isTopSvg ? "stage-icon1" : "stage-icon2"}>

                  <div style={{ fontSize: '12px', cursor: 'pointer' }}
                      // onClick={chapter.chapter_id == -1 ? handleTooltipToggle : null}
                      onClick={chapter.chapter_id == -1 ? () => handleTooltipToggle(`tooltip-readiness-${chapter.chapter_id}`) : null}>
                      <div className="locktooltip-container-click" style={{ marginRight: '5px' }} ref={buttonRef}>
                  <span
                    onClick={() =>
                      handleIconClick(
                        "Readiness",
                        chapter.chapter_name,
                        chapter.chapter_id == -1 ? -1 : chapter.crq[0].is_open,
                        chapter.chapter_id == -1
                          ? -1
                          : chapter.crq[0].reward_awarded,
                        chapter.crq[0].is_submit,
                        chapter.school_id,
                        chapter.chapter_id,
                        chapter.section_id,
                        chapter.course_id,
                        0,
                        chapter.crq[0].no_of_correct,
                        chapter.crq[0].total_question,
                        chapter.crq[0].percentage,
                        chapter.crq_locked,
                        chapter.crq[0].required_gem,
                        chapter.chapter_name,
                        chapter.subject_name,
                        []
                      )
                    }
                    id={`${chapter.chapter_id}1`}
                  >
                    <Image
                      src={chapter.crq[0].icon}
                      width={70}
                      height={70}
                      alt="Image"
                      className="progress-icon responsive-img2"
                    />
                  </span>

				{/* {isTooltipVisible && ( */}
        {visibleTooltipId === `tooltip-readiness-${chapter.chapter_id}` && (
                          <div className={isTopSvg ? "locktooltip-click1" : "locktooltip-click2"} ref={tooltipRef}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                flexDirection: 'row',
                                gap:'5px'
                              }}
                            >
                              <Image src={TooltipLock}
                                alt="Issue"
                                width={50}
                                height={50}
                              />
                              <div className="locktooltip-content">
                                <h5>Readiness</h5>
                                <p>Stay tuned! This quiz will unlock soon.</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  <p>{chapter.crq[0].module_name}</p>{" "}
                </div>
                <Image
                  src={isTopSvg ? TopSvg : BtmSvg}
                  alt="Top svg"
                  className="progress-show responsive-svg"
                  priority
                />
                {(isTopSvg = !isTopSvg)}{" "}
              </div>
            )}
            {chapter?.topics?.map((topic, index) => {
              return (
                <div
                  key={index}
                  className="std-progress"
                  style={{
                    position: "relative",
                    top: index === 0 ? "0px" : "-20px",
                  }}
                >
                  <div className="topic-name-container">
                    <div className="topicline"></div>
                    <div className="topic-name-box">{topic.name}</div>
                    <div className="topicline"></div>
                  </div>

                  {topic.activity &&
                    (Array.isArray(topic.activity)
                      ? topic.activity // If it's an array, use it as-is
                      : [topic.activity]
                    ) // If it's a single object, wrap it in an array
                      .map((activity, index) => {
                        const currentSvg = isTopSvg ? TopSvg : BtmSvg;
                        const currentPath = isTopSvg
                          ? "stage-icon1"
                          : "stage-icon2"; // Toggle icon path based on topic index
                        isTopSvg = !isTopSvg; // Toggle image for the next activity
                        return (
                          <div
                            key={index}
                            className="stage"
                            style={{ top: index === 0 ? "0px" : "-40px" }}
                          >
                            <div className={currentPath}>
                              {/* <span
                                onClick={() =>
                                  handleIconClick(
                                    // "Quest",
                                    activity.module_name,
                                    topic.name,
                                    chapter.chapter_id === -1
                                      ? -1
                                      : activity.is_topic_open,
                                    chapter.chapter_id === -1
                                      ? -1
                                      : activity.reward_awarded,
                                    activity.is_topic_submit,
                                    chapter.school_id,
                                    chapter.chapter_id,
                                    chapter.section_id,
                                    chapter.course_id,
                                    topic.id,
                                    activity.no_of_correct,
                                    activity.total_question,
                                    activity.percentage,
                                    false,
                                    activity.required_gem,
                                    chapter.chapter_name,
                                    chapter.subject_name,
                                    activity?.lu_ids ? activity?.lu_ids : []
                                  )
                                }
                                id={
                                  activity.module_name == "Quest"
                                    ? `${topic.id}1`
                                    : `${topic.id}0`
                                }
                              >
                                {activity.module_name == "Quest" ? (
                                  <Image
                                    src={activity.icon}
                                    width={70}
                                    height={70}
                                    className="progress-icon"
                                    alt="Image"
                                  />
                                ) : (
                                  <Image
                                    src={activity.icon}
                                    width={200}
                                    height={70}
                                    className="progress-icon"
                                    alt="Image"
                                    style={{
                                      left: "-40px",
                                      position: "relative",
                                    }}
                                  />
                                )}
                              </span> */}

<div style={{ fontSize: '12px', cursor: 'pointer' }}
                      // onClick={chapter.chapter_id == -1 ? handleTooltipToggle : null}
                      onClick={chapter.chapter_id == -1 ? () => handleTooltipToggle(`tooltip-activity-${topic.id}-${index}`) : null}
                      >
                      <div className="locktooltip-container-click" style={{ marginRight: '5px' }} ref={buttonRef}>
                  <span
                                onClick={() =>
                                  handleIconClick(
                                    // "Quest",
                                    activity.module_name,
                                    topic.name,
                                    chapter.chapter_id === -1
                                      ? -1
                                      : activity.is_topic_open,
                                    chapter.chapter_id === -1
                                      ? -1
                                      : activity.reward_awarded,
                                    activity.is_topic_submit,
                                    chapter.school_id,
                                    chapter.chapter_id,
                                    chapter.section_id,
                                    chapter.course_id,
                                    topic.id,
                                    activity.no_of_correct,
                                    activity.total_question,
                                    activity.percentage,
                                    false,
                                    activity.required_gem,
                                    chapter.chapter_name,
                                    chapter.subject_name,
                                    activity?.lu_ids ? activity?.lu_ids : []
                                  )
                                }
                                id={
                                  activity.module_name == "Quest"
                                    ? `${topic.id}1`
                                    : `${topic.id}0`
                                }
                              >
                                {activity.module_name == "Quest" ? (
                                  <Image
                                    src={activity.icon}
                                    width={70}
                                    height={70}
                                    className="progress-icon responsive-img2"
                                    alt="Image"
                                  />
                                ) : (
                                  <Image
                                    src={activity.icon}
                                    width={200}
                                    height={70}
                                    className="progress-icon responsive-img3"
                                    alt="Image"
                                    style={{
                                      left: "-40px",
                                      position: "relative",
                                    }}
                                  />
                                )}
                              </span>

				{/* {isTooltipVisible && ( */}
        {visibleTooltipId === `tooltip-activity-${topic.id}-${index}` && (
                          <div className={currentPath == "stage-icon1" ? "locktooltip-click1" : "locktooltip-click2"} ref={tooltipRef}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                flexDirection: 'row',
                                gap:'5px'
                              }}
                            >
                              <Image src={TooltipLock}
                                alt="Issue"
                                width={50}
                                height={50}
                              />
                              <div className="locktooltip-content">
                                <h5>Quest</h5>
                                <p>Stay tuned! This quiz will unlock soon.</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                              <p>
                                {activity.module_name == "Quest"
                                  ? activity.module_name
                                  : null}
                              </p>
                            </div>
                            <Image
                              src={currentSvg}
                              className="progress-show responsive-svg"
                              alt="Image"
                            />
                          </div>
                        );
                      })}
                </div>
              );
            })}

            {chapter.clt && chapter.clt.length > 0 && (
              <>
                <div className="topic-name-container">
                  <div className="topicline"></div>
                  <div className="topic-name-box">Milestone</div>
                  <div className="topicline"></div>
                </div>
                <div className="stage">
                  <div className={isTopSvg ? "stage-icon1" : "stage-icon2"}>

<div style={{ fontSize: '12px', cursor: 'pointer' }}
                      // onClick={chapter.chapter_id == -1 ? handleTooltipToggle : null}
                      onClick={chapter.chapter_id == -1 ? () => handleTooltipToggle(`tooltip-milestone-${chapter.chapter_id}`) : null}
                      >
                      <div className="locktooltip-container-click" style={{ marginRight: '5px' }} ref={buttonRef}>
                           

 <span
                      onClick={() =>
                        handleIconClick(
                          "Milestone",
                          chapter.chapter_name,
                          chapter.chapter_id == -1
                            ? -1
                            : chapter.clt[0].is_clt_open,
                          chapter.chapter_id == -1
                            ? -1
                            : chapter.clt[0].reward_awarded,
                          chapter.clt[0].is_clt_submit,
                          chapter.school_id,
                          chapter.chapter_id,
                          chapter.section_id,
                          chapter.course_id,
                          0,
                          chapter.clt[0].no_of_correct,
                          chapter.clt[0].total_question,
                          chapter.clt[0].percentage,
                          chapter.clt_locked,
                          chapter.clt[0].required_gem,
                          chapter.chapter_name,
                          chapter.subject_name,
                          []
                        )
                      }
                      id={`${chapter.chapter_id}0`}
                    >
                      <Image
                        src={chapter.clt[0].icon}
                        width={70}
                        height={70}
                        alt="Image"
                        className="progress-icon responsive-img2"
                      />
                    </span>

                    {visibleTooltipId === `tooltip-milestone-${chapter.chapter_id}` && (
                          <div className={isTopSvg ? "locktooltip-click1" : "locktooltip-click2"} ref={tooltipRef}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                flexDirection: 'row',
                                gap:'5px'
                              }}
                            >
                              <Image src={TooltipLock}
                                alt="Issue"
                                width={50}
                                height={50}
                              />
                              <div className="locktooltip-content">
                                <h5>Milestone</h5>
                                <p>Stay tuned! This quiz will unlock soon.</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <p>Milestone</p>
                  </div>
                  <Image
                    src={isTopSvg ? TopSvg : BtmSvg}
                    alt="Bottom Svg"
                    className="progress-show responsive-svg"
                    priority
                  />
                  {/* {chapter.paa && chapter.paa.length > 0 && (
                    <Image
                      className={isTopSvg ? "magicright" : "magicleft"}
                      src={MagicLamp}
                      alt="Magic Lamp"
                      style={{
                        position: "relative",
                        left: "-35%",
                        top: "-15px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleIconClick("magicLamp")}
                    />
                  )} */}
                  {(isTopSvg = !isTopSvg)}
                </div>
              </>
            )}
          </div>
        ))
      ) : (
        <Loader />
      )}
      {/* Popups Section - Add refs to each popup container */}
      {(showPopup.Readiness || showPopup.Milestone || showPopup.Quest) && (
        <div className="popup-overlay">
          <div className="popup-box" ref={modalRef}>
            <ReadinessPopupBox
              handleClosePopup={handleClosePopup}
              heading={heading}
              subHeading={subHeading}
              chapterName={chapterName}
              popType={popType}
              requiredgem={requiredgem}
              rewardawarded={rewardawarded}
              testUrl={testUrl}
              startGems={startGems}
              handleQuestionRedirect={handleQuestionRedirect}
            />
          </div>
        </div>
      )}
      {oopspopShow && (
        <div className="popup-overlay">
          <div className="popup-box oops-popup" ref={oopsPopupRef}>
            <OopsPopUp
              handleBuyGem={handleBuyGem}
              setOopspopShow={setOopspopShow}
              setCallBuyHome={setCallBuyHome}
            />
          </div>
        </div>
      )}
      {showPopup.magicLamp && (
        <div className="popup-overlay">
          <div
            className="popup-box"
            ref={modalRef}
            style={{ background: "#FDF4DB" }}
          >
            <MagicLampPopupBox handleClosePopup={handleClosePopup} />
          </div>
        </div>
      )}
      {showPopup.readinessblue && (
        <div className="popup-overlay">
          <div className="popup-box" ref={modalRef}>
            <ReadinessBluePopupBox handleClosePopup={handleClosePopup} />
          </div>
        </div>
      )}
      {showPopup.plant && (
        <div className="popup-overlay">
          <div className="popup-box" ref={modalRef}>
            <PlantPopupBox handleClosePopup={handleClosePopup} />
          </div>
        </div>
      )}
      {showPopup.tree && (
        <div className="popup-overlay">
          <div className="popup-box" ref={modalRef}>
            <TreePopupBox handleClosePopup={handleClosePopup} />
          </div>
        </div>
      )}
      {reviewPopClaimShow && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-body">
              <h2>Congratulations!</h2>
              <Image src={popupImg} alt="Badge Popup" className="popup-img" />
              <h3 className="modal-badge-title">
                <span>
                  <Image
                    src={Coin}
                    alt="Discovery Coins"
                    width={25}
                    height={25}
                  />
                  +{localStorage.getItem("review")}
                </span>
              </h3>
              <p className="modal-badge-description">
                You have earned {localStorage.getItem("review")} discovery coins
                for reviewing your attempt.
              </p>
              <button className="claim-btn" onClick={handleCloseClaimShow}>
                Claim
              </button>
            </div>
          </div>
        </div>
      )}
      {reviewPopShow && (
        <div className="popup-overlay">
          <div className="popup-box" ref={reviewPopupRef}>
            <div
              className="popup-header"
              style={{ justifyContent: "space-between" }}
            >
              <div className="popup-header-left">
                <h2>{popType}</h2>
                <span>{chapterName}</span>
              </div>

              <button
                className="close-btn"
                onClick={() => setReviewPopShow(false)}
                style={{ position: "relative" }}
              >
                {" "}
                <RxCross2 />{" "}
              </button>
            </div>
            <div className="popup-center">
              <Image
                src={PEillustration}
                alt="Readiness Pink"
                className="progress-popup-icon"
                width={230}
                height={200}
              />
            </div>
            <div className="popup-content" style={{ marginTop: "0px" }}>
              <h3>Hey Explorer!</h3>
              <p>You have already attempted this quiz.</p>
            </div>
            <div className="accuracy-card">
              <div className="accuracy-info">
                <div className="progress-p-icon previous-icon">
                  <Image
                    src={ReviewAccuracy}
                    alt="Accuracy"
                    width={30}
                    height={30}
                  />
                </div>
                <div className="accuracy-text">
                  <span className="title" style={{ color: "#666666" }}>
                    Accuracy
                  </span>
                  <span
                    className="subtitle"
                    style={{ color: "#9A9A9A", fontWeight: "700" }}
                  >
                    {noOfCorrect}/{totalQuestion} Correct
                  </span>
                </div>
              </div>
              <div className="accuracy-percentage">{percentage}%</div>
            </div>
            <div className="popup-footer">
              <button
                onClick={() => {
                  handleReviewRedirect();
                }}
                className="understood-btn gem-btn"
              >
                Review my attempt
              </button>
              <button
                style={{
                  color: "#FF8A00",
                  fontWeight: "800",
                  fontSize: "14",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
                onClick={() => {
                  handleProgressRedirect();
                }}
              >
                View progress
              </button>
            </div>
          </div>
        </div>
      )}

      {/* {isBoosterPopupOpen && (
        <div className="popup-overlay">
          <div
            className="quiz-popup-box"
            ref={boosterPopupRef}
            style={{ width: "450px" }}
          >
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
                >
                  {/* {progress}% */}
                {/* </div>
              </div>
            </div>
          </div>
        </div>
      )} */}

{isBoosterPopupOpen && (
        <div className="popup-overlay">
          <div
            className="booster-popup-box bg-gradian"
            ref={boosterPopupRef}
            style={{
              backgroundImage: `url('../images/studentimg/booster-gini-bg.png')`,
              minWidth:'500',
              minHeight:'450px'
            }}
          >
                  <Image
                    src={JinnyLampbgImg}
                    alt="Accuracy"
                    width={200}
                    height={200}
                  />
                  <div style={{width:'80%' , margin:'0 auto'}}>
                    <h5 style={{ marginBottom: "20px" }}>
                        Launching your personalized journey to boost mastery of the topic
                    </h5>
                    <p>{isBoosterheading}</p>
                    <div className="popup-footer">
                      <button className="understood-btn" onClick={() => handleBoosterRedirect()}
                      >
                      Let’s Go
                      </button>
                    </div>
                  </div>
            {/* <div className="quiz-popup-btn" style={{ marginTop: "30px" }}>
              <div className=" customProgressWrapper">
                <div
                  className="customProgressBar"
                  style={{
                    width: `${progress}%`,
                  }}
                >
                </div>
              </div>
            </div> */}
          </div>
        </div>
      )}
      {isLoader ? <Loader /> : ""}
    </div>
  );
};

const ReadinessPopupBox = ({
  handleClosePopup,
  popType,
  chapterName,
  heading,
  subHeading,
  requiredgem,
  rewardawarded,
  testUrl,
  startGems,
  handleQuestionRedirect,
}) => (
  <>
    <div className="popup-header" style={{ justifyContent: "space-between" }}>
      <div className="popup-header-left">
        <h2>{popType}</h2>
        <span>{chapterName}</span>
      </div>
      <button
        className="close-btn"
        onClick={() => handleClosePopup("Readiness")}
        style={{ position: "relative" }}
      >
        {" "}
        <RxCross2 />{" "}
      </button>
    </div>
    <div className="popup-center">
      <span>
        <Image src={Coin} alt="Discovery Coins" width={25} height={25} />+
        {rewardawarded}
      </span>
      <Image
        src={ReadinessPink}
        alt="Readiness Pink"
        className="progress-popup-icon"
      />
    </div>
    <div className="popup-content" style={{ marginTop: "0px" }}>
      <h3>{heading}</h3>
      <p>{subHeading}</p>
    </div>
    <div className="popup-footer">
      {/* href={testUrl} */}
      <button
        onClick={() => {
          handleQuestionRedirect();
        }}
        className="understood-btn gem-btn"
      >
        {requiredgem == false ? (
          <>
            Start (Use {startGems}{" "}
            <Image src={Gems} alt="Discovery Coins" width={20} height={20} /> )
          </>
        ) : (
          "Resume"
        )}
      </button>
      <div className="three-dots">
        <span style={{ color: "#FD6845", fontWeight: "700", fontSize: "14" }}>
          {" "}
          P.S. You can submit this quiz only once.
        </span>
      </div>
    </div>
  </>
);

const OopsPopUp = ({ handleBuyGem, setOopspopShow, setCallBuyHome }) => (
  <>
    <div className="dfa">
      <Image
        src={Oops}
        alt="Icon"
        className="background-icon"
        style={{ marginLeft: "10%" }}
      />
    </div>
    <div className="popup-content">
      <h3 style={{ color: "#5E5E5E", marginBottom: "12px" }}>
        You need 1 gems to attempt this quiz. Buy them using discovery coins.
      </h3>
    </div>
    <div className="popup-footer">
      <button
        onClick={() => {
          handleBuyGem();
          setOopspopShow(false);
          setCallBuyHome(true);
        }}
        className="understood-btn"
      >
        Buy Now
      </button>
    </div>
  </>
);

const MagicLampPopupBox = ({ handleClosePopup }) => (
  <>
    <div className="popup-header">
      <button
        className="close-btn"
        onClick={() => handleClosePopup("magicLamp")}
        style={{ top: "5px" }}
      >
        {" "}
        <RxCross2 />{" "}
      </button>
    </div>
    <div className="dfa">
      <Image
        src={JinnyLamp}
        alt="BoosterPopup"
        className="progress-popup-icon"
      />
    </div>

    <div className="popup-content">
      <p>
        A booster strengthens your understanding of a concept. Watch a short
        video and take a quiz to quickly bridge any learning gaps.
      </p>
    </div>
    <div className="popup-footer">
      <button
        onClick={() => handleClosePopup("magicLamp")}
        className="understood-btn"
      >
        I Understand
      </button>
    </div>
  </>
);

const ReadinessBluePopupBox = ({ handleClosePopup }) => (
  <>
    <div className="popup-header" style={{ justifyContent: "space-between" }}>
      <div className="popup-header-left">
        <h2>Readiness</h2>
        <span>Knowing Our Numbers</span>
      </div>
      <button
        className="close-btn"
        onClick={() => handleClosePopup("readinessblue")}
        style={{ position: "relative" }}
      >
        {" "}
        <RxCross2 />{" "}
      </button>
    </div>
    <div className="popup-center">
      <span>
        <Image src={Coin} alt="Discovery Coins" width={25} height={25} />
        +150
      </span>
      <Image
        src={ReadinessBlue}
        alt="Readiness Pink"
        className="progress-popup-icon"
      />
    </div>

    <div className="popup-content" style={{ marginTop: "0px" }}>
      <h3>Ready to conquer your learning!</h3>
      <p>Start this quiz to discover your understanding.</p>
    </div>
    <div className="popup-footer">
      <button
        onClick={() => handleClosePopup("Readiness")}
        className="understood-btn gem-btn"
      >
        Start (Use 2{" "}
        <Image src={Gems} alt="Discovery Coins" width={20} height={20} /> ){" "}
      </button>
      <div className="three-dots">
        <span style={{ color: "#FD6845", fontWeight: "700", fontSize: "14" }}>
          {" "}
          P.S. You cannot attempt quests after attempting this milestone.
        </span>
      </div>
    </div>
  </>
);

{
  /* Plant Popup */
}
const PlantPopupBox = ({ handleClosePopup }) => (
  <>
    <div className="popup-header">
      <h2>Plant</h2>
      <button className="close-btn" onClick={() => handleClosePopup("plant")}>
        {" "}
        <RxCross2 />{" "}
      </button>
    </div>
    <div className="dfa">
      <Image
        src={PlantPopup}
        alt="PlantPopup"
        className="progress-popup-icon"
      />
    </div>

    <div className="popup-content">
      <h3 style={{ color: "#5E5E5E" }}>You are developing!</h3>
      <p>
        You understand the basics and are making progress, but there is still
        room to grow.
      </p>
    </div>
    <div className="popup-footer">
      <button
        onClick={() => handleClosePopup("plant")}
        className="understood-btn"
      >
        I Understand
      </button>
      <div className="three-dots">
        <div className="dot"></div>
        <div className="dot middle"></div>
        <div className="dot"></div>
      </div>
    </div>
  </>
);

const TreePopupBox = ({ handleClosePopup }) => (
  <>
    <div className="popup-header">
      <h2>Tree</h2>
      <button className="close-btn" onClick={() => handleClosePopup("tree")}>
        {" "}
        <RxCross2 />{" "}
      </button>
    </div>
    <div className="dfa">
      {" "}
      <Image src={TreePopup} alt="TreePopup" className="progress-popup-icon" />
    </div>
    <div className="popup-content">
      <h3 style={{ color: "#5E5E5E" }}>You are Proficient!</h3>
      <p>
        A tree indicates you have a strong understanding of the sub-concept. You
        can easily apply your knowledge and skills effectively.
      </p>
    </div>
    <div className="popup-footer">
      <button
        onClick={() => handleClosePopup("tree")}
        className="understood-btn"
      >
        I Understand
      </button>
      <div className="three-dots">
        <div className="dot"></div>
        <div className="dot middle"></div>
        <div className="dot"></div>
      </div>
    </div>
  </>
);
export default HomeAssignedChapter;
