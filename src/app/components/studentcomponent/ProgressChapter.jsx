`use client`;
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { RxCross2 } from "react-icons/rx";
import Coin from "../../../../public/images/studentimg/Coin.svg";
import ReadinessPink from "../../../../public/images/studentimg/ReadinessPink.svg";
import Loader from "../../components/studentcomponent/Loader";
import Gems from "../../../../public/images/studentimg/Gems.svg";
import popupImg from "../../../../public/images/studentimg/CoinSparc.svg";
import Oops from "../../../../public/images/studentimg/oops.svg";
import ProgressChapter1 from "../../../../public/images/studentimg/ProgressChapter1.svg";
import ProgressChapter2 from "../../../../public/images/studentimg/ProgressChapter2.svg";
import ProgressChapter3 from "../../../../public/images/studentimg/ProgressChapter3.svg";
import ProgressChapter4 from "../../../../public/images/studentimg/ProgressChapter4.svg";
import ProgressChapter5 from "../../../../public/images/studentimg/ProgressChapter5.svg";
import ProgressAttempt from "../../../../public/images/studentimg/ProgressAttempt.svg";
import ProgressLamp from "../../../../public/images/studentimg/ProgressLamp.svg";
import ProgressPopupTree from "../../../../public/images/studentimg/ProgressPopupTree.svg";
import ProgressConcept from "../../../../public/images/studentimg/ProgressConcept.svg";
import ProgressTree from "../../../../public/images/studentimg/ProgressNewTree.svg";
import ProgressPlant from "../../../../public/images/studentimg/ProgressNewPlant.svg";
import ProgressHalfPlant from "../../../../public/images/studentimg/ProgressHalfPlant.svg";
import ProgressFruitTree from "../../../../public/images/studentimg/ProgressFruitTree.svg";
import feedback4 from "../../../../public/images/studentimg/feedbackPopupFruitTree.svg";
import feedback2 from "../../../../public/images/studentimg/feedbackPopupHalfPlant.svg";
import feedback1 from "../../../../public/images/studentimg/feedbackPopupPlan.svg";
import feedback3 from "../../../../public/images/studentimg/feedbackPopupTree.svg";
import ProficientIcon from "../../../../public/images/studentimg/ProficientIcon.svg";
import BeginnerIcon from "../../../../public/images/studentimg/BeginnerIcon.svg";
import DevelopingIcon from "../../../../public/images/studentimg/DevelopingIcon.svg";
import MasterIcon from "../../../../public/images/studentimg/MasterIcon.svg";
import backArrowImg from "../../../../public/images/studentimg/left.svg";
import axiosInstance from "../../auth";
import InfoTooltip from "../../../../public/images/studentimg/InfoTooltip.svg";
import NoIcon from "../../../../public/images/studentimg/NoIcon.svg";
import JinnyLampbgImg from "../../../../public/images/studentimg/JinnyLampbgImg.svg";
import Typewriter from 'typewriter-effect';


const Progress = ({
  progressChapterData,
  progressChapterDataTab,
  setProgressChapterRight,
  testType,
  chapterId,
  courseId,
  balanceData,
  showBeginner,
  setShowBeginner,
  showProficient,
  setShowProficient,
  showDeveloping,
  setShowDeveloping,
  showList,
  setShowList,
  progressChapterRight,
  showKey,
  setShowKey,
  tabValue,
  setCallBuyHome,
  handleBuyGem,
  setReCall,
  redirectValue,
  typeBadgeValue
}) => {
  // State to manage the active tab (readiness or performance)
  const [activeTab, setActiveTab] = useState("readiness");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [oopspopShow, setOopspopShow] = useState(false);
  const [questPopShow, setQuestPopShow] = useState(false);
  const [crqPopShow, setcrqPopShow] = useState(false);
  const [poptype, setPopType] = useState(0);
  const [expandedIndexes, setExpandedIndexes] = useState([]);
  const [topicName, setTopicName] = useState("");
  const [heading, setHeading] = useState("");
  const [subHeading, setSubHeading] = useState("");
  const [gems, setGems] = useState("");
  const [testUrl, setTestUrl] = useState("");
  const [isLoader, setIsloader] = useState(false);
  const [isSave, setIsSave] = useState(false);
  const [rewardPoint, setRewardPoint] = useState(0);
  const [isPopupOpenFeedbackClt, setIsPopupOpenFeedbackClt] = useState(false);
  const [showFilterDiv, setShowFilterDiv] = useState("");
  const [isBoosterPopupOpen, setIsBoosterPopupOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [feedbackData, setFeedbackData] = useState([]);
  const [popupTitle, setTitle] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [sectionId, setSectionId] = useState(0);
  const [schoolIdFeedback, setSchoolIdFeedback] = useState(0);
  const [isPopupOpenFeedback, setIsPopupOpenFeedback] = useState(false);
  const [topicNameBoost, setTopicNameBoost] = useState("");
  const [reviewPopClaimShow, setReviewPopClaimShow] = useState(false);
  const router = useRouter();
  const [validSequenceClt, setValidSequenceClt] = useState([]);
  const [progressClt, setProgressClt] = useState(0);
  const [isPopupOpenTooltip, setIsPopupOpenTooltip] = useState(false);




    const [isBoostersectionId, setIsBoostersectionId] = useState(0);
    const [isBoostercourseId, setIsBoostercourseId] = useState(0);
    const [isBoosterchapterId, setIsBoosterchapterId] = useState(0);
    const [isBoostertopicId, setIsBoostertopicId] = useState(0);
    const [isBoosterlu_ids, setIsBoosterlu_ids] = useState([]);
    const [isBoostersubjectName, setIsBoostersubjectName] = useState('');
    const [isBoosterchapterName, setIsBoosterchapterName] = useState('');
    const [isBoosterheading, setIsBoosterheading] = useState('');


  // Add refs for modal containers
  const modalRef = useRef(null);
  const questPopupRef = useRef(null);
  const crqPopupRef = useRef(null);
  const oopsPopupRef = useRef(null);
  const feedbackPopupRef = useRef(null);
  const feedbackCltPopupRef = useRef(null);
  const boosterPopupRef = useRef(null);
  const reviewClaimPopupRef = useRef(null);

  const imageMap = {
    0: ProgressPlant,
    1: ProgressHalfPlant,
    2: ProgressTree,
    3: ProgressFruitTree,
  };

  useEffect(() => {
    if (showKey) {
      setShowFilterDiv(
        showKey == 1
          ? "no_attempt"
          : showKey == 2
          ? "beginner"
          : showKey == 3
          ? "developing"
          : showKey == 4
          ? "proficient"
          : showKey == 5
          ? "master"
          : ""
      );
    } else {
      setShowFilterDiv("");
    }
  }, [showKey]);

  useEffect(() => {
    if (progressChapterDataTab?.data?.chapter_name) {
      setTitle(progressChapterDataTab?.data?.chapter_name);
    }

    if (progressChapterDataTab?.data?.section_id) {
      setSectionId(progressChapterDataTab?.data?.section_id);
    }
    //  setSectionId(progressChapterDataTab?.data?.section_id);
  }, [progressChapterDataTab]);
  useEffect(() => {
    if (progressChapterDataTab?.data?.tab?.topics) {
      // Set all indexes as expanded
      if (showList == true) {
        const allIndexes = progressChapterDataTab.data.tab.topics.map(
          (_, index) => index
        );
        setExpandedIndexes(allIndexes);
      }
    }
  }, [progressChapterDataTab, showList, progressChapterRight]);

  useEffect(() => {
    setExpandedIndexes([0]);
  }, []);
  const toggleExpand = (index) => {
    setShowList(false);
    if (expandedIndexes.includes(index)) {
      setExpandedIndexes(expandedIndexes.filter((i) => i !== index));
    } else {
      setExpandedIndexes([...expandedIndexes, index]);
    }
  };

  const handleQuestQuiz = (
    topicId,
    required_gem,
    rewardAwarded,
    topicName,
    schoolId,
    sectionId,
    is_topic_submit,
    is_topic_saved,
    chapterName,
    subjectName
  ) => {
    // setIsloader(true);


    const userid = localStorage.getItem("user_id");
    const key = `${userid}_${schoolId}_${chapterId}_${topicId}_Quest`;
    localStorage.removeItem(`quizResponses_${key}`);

    localStorage.setItem("reward_awarded", rewardAwarded);
    setIsSave(is_topic_saved);
    setRewardPoint(rewardAwarded);
    setTopicName(topicName);
    setHeading("Discover the Explorer Within You!");
    setSubHeading("Start your quiz if you've studied this topic in class.");
    const totalGems = balanceData.data.cur_gems;

    setGems(required_gem);
    let redirectUrl = `/student/testenvironment?schoolId=${schoolId}&&chapterId=${chapterId}&courseId=${courseId}&sectionId=${sectionId}&startGems=${required_gem}&topicId=${topicId}&popupType=Quest&home=2&chapterName=${chapterName}&topic=${topicName}&subject=${subjectName}`;
    setTestUrl(redirectUrl);
    if (is_topic_submit == false && totalGems < required_gem) {
      setOopspopShow(true);
    } else if (is_topic_submit == false) {
      setQuestPopShow(true);
    }
  };

  const handleReviewQuestQuiz = (
    topic_id,
    topic_name,
    school_id,
    section_id,
    lu_ids_on_that_topic,
    chapterName,
    subject
  ) => {
    setIsloader(true);
    router.push(
      `/student/reviewquestion?schoolId=${school_id}&&chapterId=${chapterId}&courseId=${courseId}&sectionId=${section_id}&topicId=${topic_id}&lu_ids=${lu_ids_on_that_topic}&topicname=${topic_name}&chapterName=${chapterName}&subject=${subject}`
    );
  };
  const handleClosePopup = () => {
    setQuestPopShow(false);
  };

  const totaltopiccount = progressChapterDataTab?.data?.topic_bar?.length;
  // Count occurrences of "no_attempt"
  const noAttemptCount = progressChapterDataTab?.data?.topic_bar?.filter(
    (topic) => topic == -1
  ).length;

  // Subtract "no_attempt" count
  const finalCount = totaltopiccount - noAttemptCount;
  const progressPercentage =
    totaltopiccount == 0 ? 0 : (finalCount / totaltopiccount) * 100;
  const validSequence = progressChapterDataTab?.data?.topic_bar?.filter((num) =>
    [0, 1, 2, 3].includes(num)
  );

  const handleCrq = (
    topicId,
    required_gem,
    rewardAwarded,
    topicName,
    schoolId,
    sectionId,
    is_topic_submit,
    is_topic_saved,
    chapterName,
    subjectName
  ) => {

    

    const userid = localStorage.getItem("user_id");
    const key = `${userid}_${schoolId}_${chapterId}_${topicId}_Readiness`;
    localStorage.removeItem(`quizResponses_${key}`);

    setPopType(0);
    setSchoolIdFeedback(schoolId);
    localStorage.setItem("reward_awarded", rewardAwarded);
    setIsSave(is_topic_saved);
    setRewardPoint(rewardAwarded);
    setTopicName(topicName);
    setHeading("Time to begin your learning adventure!");
    setSubHeading("Start this quiz to explore your chapter readiness.");
    const totalGems = balanceData.data.cur_gems;

    setGems(required_gem);

    let redirectUrl = `/student/testenvironment?schoolId=${schoolId}&&chapterId=${chapterId}&courseId=${courseId}&sectionId=${sectionId}&startGems=${required_gem}&topicId=${topicId}&popupType=Readiness&home=2&chapterName=${chapterName}&topic=${topicName}&subject=${subjectName}`;
    setTestUrl(redirectUrl);
    if (is_topic_submit == false && totalGems < required_gem) {
      setOopspopShow(true);
    } else if (is_topic_submit == false) {
      setcrqPopShow(true);
    } else if (is_topic_submit == true) {
      const fetchFeedback = async () => {
        try {
          const response = await axiosInstance.get(
            "/studentapis/get_feedback",
            {
              params: {
                course_id: courseId,
                section_id: sectionId,
                chapter_id: chapterId,
                test_type: "CRQ",
              },
            }
          );

          if (response.status == 200) {
            setFeedbackData(response.data.data);
            setFeedbackType(response.data.data.quiz_type);
            setIsPopupOpenFeedback(true);
          }
        } catch (err) {
          console.error("Error fetching feedback:", err);
        }
      };
      if (sectionId > 0) {
        fetchFeedback();
      }
    }
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

  const handleClt = (
    topicId,
    required_gem,
    rewardAwarded,
    topicName,
    schoolId,
    sectionId,
    is_topic_submit,
    is_topic_saved,
    chapterName,
    subjectName
  ) => {


    const userid = localStorage.getItem("user_id");
    const key = `${userid}_${schoolId}_${chapterId}_${topicId}_Milestone`;
    localStorage.removeItem(`quizResponses_${key}`);

    setPopType(1);
    setSchoolIdFeedback(schoolId);
    localStorage.setItem("reward_awarded", rewardAwarded);
    setIsSave(is_topic_saved);
    setRewardPoint(rewardAwarded);
    setTopicName(topicName);
    setHeading("Ready to conquer your learning!");
    setSubHeading("Start this quiz to discover your understanding.");
    const totalGems = balanceData.data.cur_gems;

    setGems(required_gem);
    let redirectUrl = `/student/testenvironment?schoolId=${schoolId}&&chapterId=${chapterId}&courseId=${courseId}&sectionId=${sectionId}&startGems=${required_gem}&topicId=${topicId}&popupType=Milestone&home=2`;
    setTestUrl(redirectUrl);
    if (is_topic_submit == false && totalGems < required_gem) {
      setOopspopShow(true);
    } else if (is_topic_submit == false) {
      setcrqPopShow(true);
    } else if (is_topic_submit == true) {
      const fetchFeedback = async () => {
        try {
          const response = await axiosInstance.get(
            "/studentapis/get_feedback",
            {
              params: {
                course_id: courseId,
                section_id: sectionId,
                chapter_id: chapterId,
                test_type: "CLT",
              },
            }
          );
          if (response.status == 200) {
            setFeedbackData(response.data.data);
            setFeedbackType(response.data.data.quiz_type);
            setIsPopupOpenFeedbackClt(true);
            const totaltopiccount = response.data.data.topic_bar.length;
            const noAttemptCount = response.data.data.topic_bar.filter(
              (topic) => topic == -1
            ).length;

            // Subtract "no_attempt" count
            const finalCount = totaltopiccount - noAttemptCount;
            const progressPercentage =
              totaltopiccount == 0 ? 0 : (finalCount / totaltopiccount) * 100;
            const validSequence = response.data.data.topic_bar.filter((num) =>
              [0, 1, 2, 3].includes(num)
            );
            setValidSequenceClt(validSequence);
            setProgressClt(progressPercentage);
          }
        } catch (err) {
          console.error("Error fetching feedback:", err);
        }
      };

      if (sectionId > 0) {
        fetchFeedback();
      }
    }
  };

  const handlereviewCRQ = () => {
    setIsloader(true);
    router.push(
      `/student/reviewmyattempt?school_id=${schoolIdFeedback}&section_id=${sectionId}&course_id=${courseId}&test_type=CRQ&chapter_id=${chapterId}&home=2&topic_id=0`
    );
  };

  const handleGoHomeCRQ = () => {
    // setIsloader(true);
    setIsPopupOpenFeedback(false);
    // router.push(
    //   `/student/progresschapter?courseid=${courseId}&chapterid=${chapterId}`
    // );
  };

  const handlereviewCLT = () => {
    setIsloader(true);
    router.push(
      `/student/reviewmyattempt?school_id=${schoolIdFeedback}&section_id=${sectionId}&course_id=${courseId}&test_type=CLT&chapter_id=${chapterId}&home=2&topic_id=0`
    );
  };

  const handleGoBack = () => {
    setIsloader(true);
    // typeBadgeValue
    if(redirectValue == 1){
      router.push(`/student/achievements?type_of_badge=${typeBadgeValue}`);
    }else{
    router.push(`/student/progress?courseid=${courseId}`);
    }
  };

  const handleGoHomeCLT = () => {
    // setIsloader(true);
    setIsPopupOpenFeedbackClt(false);
    // router.push(
    //   `/student/progresschapter?courseid=${courseId}&chapterid=${chapterId}`
    // );
  };
   const handleBoost = async (
    topicId,
    sectionId,
    lu_ids,
    chapter_name,
    subject_name,
    topic_name
  ) => {

      setTopicNameBoost(topic_name);
      setIsBoosterPopupOpen(true);

      setIsBoostersectionId(sectionId);
      setIsBoostercourseId(courseId);
      setIsBoosterchapterId(chapterId);
      setIsBoostertopicId(topicId);
      setIsBoosterlu_ids(lu_ids);
      setIsBoostersubjectName(subject_name);
      setIsBoosterchapterName(chapter_name);
      setIsBoosterheading(topic_name);

    // try {
    //   const response = await axiosInstance.post("/test_generator/start_paa", {
    //     section_id: sectionId,
    //     course_id: courseId,
    //     chapter_id: chapterId,
    //     topic_id: topicId,
    //     lu_ids: lu_ids,
    //     chapter_name: chapter_name,
    //     subject_name: subject_name,
    //     topic_name: topic_name,
    //   });
    //   if (response.data.status == "Success") {
    //     localStorage.setItem("paa", JSON.stringify(response.data));
    //     router.push(`/student/booster?home=2`);
    //   }
    //   setIsBoosterPopupOpen(false);
    // } catch (error) {
    //   setIsBoosterPopupOpen(false);
    //   console.error("Error starting PAA test:", error);
    // }

  };

  useEffect(() => {
    const storedReview = localStorage.getItem("review");
    if (storedReview) {
      setReviewPopClaimShow(true);
    }
  }, []);

  const handleCloseClaimShow = () => {
    const storedReviewClaim = localStorage.getItem("review");

    if (storedReviewClaim) {
      localStorage.setItem("storedReviewclaim", storedReviewClaim);
      setReCall((prevState) => (prevState === 0 ? 1 : 0));
    }
    localStorage.removeItem("review");
    setReviewPopClaimShow(false);
  };

  const handleQuestionRedirect = () => {
    setIsloader(true);
    router.push(`${testUrl}`);
  };

  // Handle outside click for all popups
  useEffect(() => {
    function handleClickOutside(event) {

      if (isLoader) {
        return;
      }
  
      // For regular popup
      if (isPopupOpen && modalRef.current && !modalRef.current.contains(event.target)) {
        setIsPopupOpen(false);
      }
      // For quest popup
      if (questPopShow && questPopupRef.current && !questPopupRef.current.contains(event.target)) {
        setQuestPopShow(false);
      }
      // For crq popup
      if (crqPopShow && crqPopupRef.current && !crqPopupRef.current.contains(event.target)) {
        setcrqPopShow(false);
      }
      
      // For oops popup
      if (oopspopShow && oopsPopupRef.current && !oopsPopupRef.current.contains(event.target)) {
        setOopspopShow(false);
      }
      
      // For feedback popup
      if (isPopupOpenFeedback && feedbackPopupRef.current && !feedbackPopupRef.current.contains(event.target)) {
        setIsPopupOpenFeedback(false);
      }
      
      // For feedback CLT popup
      if (isPopupOpenFeedbackClt && feedbackCltPopupRef.current && !feedbackCltPopupRef.current.contains(event.target)) {
        setIsPopupOpenFeedbackClt(false);
      }
      
      // For booster popup
      if (isBoosterPopupOpen && boosterPopupRef.current && !boosterPopupRef.current.contains(event.target)) {
        setIsBoosterPopupOpen(false);
      }
      
      // For review claim popup
      if (reviewPopClaimShow && reviewClaimPopupRef.current && !reviewClaimPopupRef.current.contains(event.target)) {
        handleCloseClaimShow();
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Remove event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupOpen, questPopShow, crqPopShow, oopspopShow, isPopupOpenFeedback, isPopupOpenFeedbackClt, isBoosterPopupOpen, reviewPopClaimShow,isLoader]);

   const popupRef = useRef(null);  
    useEffect(() => {
      function handleClickOutside(event) {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
          setIsPopupOpenTooltip(false);
        }
      }
    
      if (isPopupOpenTooltip) {
        document.addEventListener("mousedown", handleClickOutside);
      }
    
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isPopupOpenTooltip]);


    const handleBoosterRedirect = async () => {
      setIsloader(true);
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
          router.push(`/student/booster?home=2`);
        }
      } catch (error) {
        // setBoosterResponseIsLoader(false);
        setIsBoosterPopupOpen(false);
        setIsloader(false);
        console.error("Error starting PAA test:", error);
      }
    };

  return (
    <div className="progress-chapter-container">
      {/* Header Section */}
      <div className="profile-back-arrow">
        <span onClick={handleGoBack} style={{ cursor: "pointer" }}>
          <Image src={backArrowImg} alt="Back" />
        </span>
        <h2 className="progresstitle" style={{ margin: "0px" }}>
          {progressChapterDataTab?.data
            ? progressChapterDataTab?.data?.chapter_name
            : ""}

     <div className="std_repo_tooltip-container">
          <button
            onClick={() => setIsPopupOpenTooltip(true)}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <Image src={InfoTooltip} alt="Info" width={20} height={20} />
          </button>
          {isPopupOpenTooltip && (
            <div className="popup-overlay">
              <div ref={popupRef} className="quiz-popup-box std_repo_tooltip" style={{ width: "450px" }}>
                <div className='tooltiphead'>
                  <h3>The chapter progress bar shows your performance across topics and how far you’ve progressed in each topic.</h3>
                </div>

                <div className="chart-Legend" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  padding: '5px 0px',
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  {[
                    { icon: NoIcon, title: "Unattempted", desc: "This topic hasn’t been attempted yet." },
                    { icon: BeginnerIcon, title: "Sapling - Beginner", desc: "You need more practice to understand the basics of this topic." },
                    { icon: DevelopingIcon, title: "Plant - Developing", desc: "You understand the basics and are making progress." },
                    { icon: ProficientIcon, title: "Tree - Proficient", desc: "You have a solid grasp and understanding of this topic." },
                    { icon: MasterIcon, title: "Tree with fruits - Master", desc: "You’ve mastered this topic and can tackle advanced questions." }
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="dfa"
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                        borderBottom: '1px solid #D1D1D1',
                        // padding: '10px 0'
                        justifyContent:'flex-start'
                      }}
                    >
                      <div className="progress-icon">
                        <Image src={item.icon} alt={item.title} />
                      </div>
                      <div className='df tootltipContentText' style={{ alignItems: "flex-start",}}>
                        <h5>{item.title}</h5>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                  {/* Tooltip Items End */}
                </div>
              </div>
            </div>
          )}
        </div>
        </h2>
      </div>
      <div className="progressCard" style={{ marginBottom: "20px" }}>
        <div style={{ position: "relative", top: "40px" }}>
          {validSequence.length > 0 ? (
            <div
              className="progressChapterTreeBox"
              style={{
                width: `${progressPercentage}%`
              }}
            >
              {validSequence.map(
                (num, i) => (
                  (
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
                  )
                )
              )}
            </div>
          ) : (
            <div style={{ minHeight: "35px" }}></div>
          )}
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
      <div className="tabs">
      {(progressChapterDataTab?.data?.crq_test_id == 0 || progressChapterDataTab?.data?.clt_test_id == 0 ) && (
        <div className="swift-tab">
          {progressChapterDataTab?.data?.crq_test_id == 0 && (
            <button
              className={`tab ${activeTab === "readiness" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("readiness");
                handleCrq(
                  0,
                  progressChapterDataTab?.data?.crq_required_gem,
                  progressChapterDataTab?.data?.crq_reward_awarded,
                  progressChapterDataTab?.data?.chapter_name,
                  progressChapterDataTab?.data?.school_id,
                  progressChapterDataTab?.data?.section_id,
                  progressChapterDataTab?.data?.is_crq_submit,
                  progressChapterDataTab?.data?.is_crq_saved,
                  progressChapterDataTab?.data?.is_crq_available,
                  progressChapterDataTab?.data?.chapter_name,
                  progressChapterDataTab?.data?.subject_name
                );
              }}
            >
              Readiness
            </button>
          )}
          {progressChapterDataTab?.data?.clt_test_id == 0 && (
            <button
              className={`tab ${activeTab === "performance" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("performance");

                handleClt(
                  0,
                  progressChapterDataTab?.data?.clt_required_gem,
                  progressChapterDataTab?.data?.clt_reward_awarded,
                  progressChapterDataTab?.data?.chapter_name,
                  progressChapterDataTab?.data?.school_id,
                  progressChapterDataTab?.data?.section_id,
                  progressChapterDataTab?.data?.is_clt_submit,
                  progressChapterDataTab?.data?.is_clt_saved,
                  progressChapterDataTab?.data?.is_clt_available,
                  progressChapterDataTab?.data?.chapter_name,
                  progressChapterDataTab?.data?.subject_name
                );
              }}
            >
              Milestone
            </button>
          )}
        </div>
)}
      </div>
      {/* Content Section */}
      <div className="content">
        {progressChapterDataTab?.data?.data?.topics
          ?.filter(
            (item) =>
              showFilterDiv == "" ||
              (item.topic_state && item.topic_state == showFilterDiv)
          ) // Fix: Allow all topics if showfilterdiv is empty
          .map((item, index) => (
            <div
              key={index}
              className="progress-chapter-content"
              filter={item.topic_state}
            >
              <div
  style={{
    background: item.topic_state === "no_attempt"
      ? "transparent"
      : "linear-gradient(to right, #90CEFF, #FFFFFF)",
    cursor: item.topic_state === "master" ? "pointer" : "default",
  }}

  onClick={
    item.topic_state == "master"
      ? () =>
          handleBoost(
            item.topic_id,
            progressChapterDataTab.data.section_id,
            item.lu_ids_on_that_topic,
            progressChapterDataTab?.data?.chapter_name,
            progressChapterDataTab?.data?.subject_name,
            item.topic_name
          )
      : undefined // If topic_state is not 'master', no click event
  }
>
                <Image
                  src={
                    item.topic_state === "no_attempt"
                      ? ProgressChapter5
                      : item.topic_state === "developing"
                      ? ProgressChapter4
                      : item.topic_state === "proficient"
                      ? ProgressChapter3
                      : item.topic_state === "beginner"
                      ? ProgressChapter2
                      : item.topic_state === "master"
                      ? ProgressChapter1
                      : ProgressChapter1 // Default fallback
                  }
                  alt="Tree"
                  width={100}
                  height={100}
                  className="progress-chapter-tree"
                />
              </div>
              {/* Chapter Title */}
              <div style={{ padding: "15px", width: "100%" }}>
                <div className="progress-chapter-details">
                  <h3 className="progress-chapter-title">{item.topic_name}</h3>
                  {item.review_test && (
                    <button
                      onClick={() =>
                        handleReviewQuestQuiz(
                          item.topic_id,
                          item.topic_name,
                          progressChapterDataTab.data.school_id,
                          progressChapterDataTab.data.section_id,
                          item.lu_ids_on_that_topic,
                          progressChapterDataTab?.data?.chapter_name,
                          progressChapterDataTab?.data?.subject_name
                        )
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <Image
                        src={ProgressAttempt}
                        alt="Tree"
                        width={30}
                        height={30}
                      />
                    </button>
                  )}
                </div>

                {(item.having_PE ||
                  item.having_PAA ||
                  item.having_practice ||
                  item.review_test) && (
                  (
                    <>
                      {(() => {
                        if (item.having_PE) {
                          return (
                            <button
                              className="progress-chapter-action progressAtempted"
                              onClick={() =>
                                handleQuestQuiz(
                                  item.topic_id,
                                  item.required_gem,
                                  item.reward_awarded,
                                  item.topic_name,
                                  progressChapterDataTab.data.school_id,
                                  progressChapterDataTab.data.section_id,
                                  item.is_topic_submit,
                                  item.is_topic_saved,
                                  progressChapterDataTab?.data?.chapter_name,
                                  progressChapterDataTab?.data?.subject_name
                                )
                              }
                            >
                              {item.is_topic_saved
                                ? "Resume Quest"
                                : "Attempt Quest"}
                            </button>
                          );
                        } else if (
                          item.having_PAA &&
                          item.topic_state !== "master"
                        ) {
                          return (
                            <button
                              className="progress-chapter-action progressAtempted progressBooster"
                              onClick={() =>
                                handleBoost(
                                  item.topic_id,
                                  progressChapterDataTab.data.section_id,
                                  item.lu_ids_on_that_topic,
                                  progressChapterDataTab?.data?.chapter_name,
                                  progressChapterDataTab?.data?.subject_name,
                                  item.topic_name
                                )
                              }
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
                          );
                        }
                      })()}
                    </>
                  ))}
              </div>
            </div>
          ))}
      </div>
      {isPopupOpen && (
        <div className="modal-overlay">
          <div className="progress-modal-content" ref={modalRef} onClick={(e) => e.stopPropagation()}>
            <h2>Comparison of Large Numbers</h2>
            <div className="button-icon">
              <Image
                src={ProgressPopupTree}
                alt="Boost Icon"
                width={180}
                height={180}
              />
            </div>
            <div className="progressPopupContent">
              <h3>You are almost ready for the chapter.</h3>
              <div className="progressConceptBox">
                <Image
                  src={ProgressConcept}
                  alt="Boost Icon"
                  width={20}
                  height={20}
                />
                <p>Concepts that need practice:</p>
              </div>
              <div className="progressConceptList">
                <p>
                  Rule of difference between three digit number and number
                  obtained by reversing
                </p>
                <p>
                  Rule of difference between three digit number and number
                  obtained by reversing
                </p>
                <p>
                  Rule of difference between three digit number and number
                  obtained by reversing
                </p>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button className="progressBooster">
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
            </div>
            <div className="quiz-popup-btn">
              <button className="cancel-btn">Cancel</button>
              <button className="yes-btn">Yes</button>
            </div>
          </div>
        </div>
      )}

      {questPopShow && (
        <div className="popup-overlay">
          <div className="popup-box" ref={questPopupRef}>
            <div
              className="popup-header"
              style={{ justifyContent: "space-between" }}
            >
              <div className="popup-header-left">
                <h2>Quest</h2>
                <span>{topicName}</span>
              </div>
              <button
                className="close-btn"
                onClick={() => handleClosePopup()}
                style={{ position: "relative" }}
              >
                {" "}
                <RxCross2 />
              </button>
            </div>
            <div className="popup-center">
              <span>
                <Image
                  src={Coin}
                  alt="Discovery Coins"
                  width={25}
                  height={25}
                />
                +{/* {rewardawarded} */}
                {rewardPoint}
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
              <button  onClick={() => {
                  handleQuestionRedirect();
                }} className="understood-btn gem-btn">
                {isSave ? (
                  "Resume"
                ) : (
                  <>
                    Start (Use {gems}{" "}
                    <Image
                      src={Gems}
                      alt="Discovery Coins"
                      width={20}
                      height={20}
                    />
                    )
                  </>
                )}
              </button>
              <div className="three-dots">
                <span
                  style={{
                    color: "#FD6845",
                    fontWeight: "700",
                    fontSize: "14",
                  }}
                >
                  {" "}
                  P.S. You can submit this quiz only once.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {crqPopShow && (
        <div className="popup-overlay">
          <div className="popup-box" ref={crqPopupRef}>
            <div
              className="popup-header"
              style={{ justifyContent: "space-between" }}
            >
              <div className="popup-header-left">
                <h2>{poptype == 0 ? "Readiness" : "Milestone"}</h2>
                <span>{topicName}</span>
              </div>
              <button
                className="close-btn"
                onClick={() => setcrqPopShow(false)}
                style={{ position: "relative" }}
              >
                {" "}
                <RxCross2 />
              </button>
            </div>
            <div className="popup-center">
              <span>
                <Image
                  src={Coin}
                  alt="Discovery Coins"
                  width={25}
                  height={25}
                />
                +{/* {rewardawarded} */}
                {rewardPoint}
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
              <button onClick={() => {
                  handleQuestionRedirect();
                }} className="understood-btn gem-btn">
                {isSave ? (
                  "Resume"
                ) : (
                  <>
                    Start (Use {gems}{" "}
                    <Image
                      src={Gems}
                      alt="Discovery Coins"
                      width={20}
                      height={20}
                    />
                    )
                  </>
                )}
              </button>
              <div className="three-dots">
                <span
                  style={{
                    color: "#FD6845",
                    fontWeight: "700",
                    fontSize: "14",
                  }}
                >
                  {" "}
                  P.S. You can submit this quiz only once.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {oopspopShow && (
        <div className="popup-overlay">
          <div className="popup-box oops-popup" ref={oopsPopupRef}>
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
                You need 1 gems to attempt this quiz. Buy them using discovery
                coins.
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
          </div>
        </div>
      )}

      {isPopupOpenFeedback && (
        <div className="modal-overlay">
          <div className="progress-modal-content" ref={feedbackPopupRef} onClick={(e) => e.stopPropagation()}>
            {/* FeedbackData */}
            <h2>{popupTitle}</h2>
            <div className="button-icon">
              <Image
                src={
                  feedbackData.icon_tag == "developing"
                    ? feedback2
                    : feedbackData.icon_tag == "proficient"
                    ? feedback3
                    : feedbackData.icon_tag == "beginner"
                    ? feedback1
                    : feedbackData.icon_tag == "master"
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
                )}
              </div>

              {feedbackData?.quiz_type === "PE" && (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button className="progressBooster">
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
              )}
            </div>
            <div className="quiz-popup-btn">
              <button className="cancel-btn" onClick={handleGoHomeCRQ}>
                Go to journey
              </button>
              <button className="yes-btn" onClick={handlereviewCRQ}>
                Review my attempt
              </button>
            </div>
          </div>
        </div>
      )}

      {isPopupOpenFeedbackClt && (
        <div className="modal-overlay">
          <div className="progress-modal-content-progressbar" ref={feedbackCltPopupRef} onClick={(e) => e.stopPropagation()} style={{ padding: "0px" }}>
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
                    {validSequenceClt.map(
                      (num, i) => (
                        (
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
                        )
                      )
                    )}
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
              {/* <h3>{feedbackData.feedback_msg}</h3> */}
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
                    {feedbackData.lu_list.map((item, index) => (
                      <div className="dfjs" key={index} style={{ gap: "10px" }}>
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
            </div>
            <div className="quiz-popup-btn" style={{ margin: "20px" }}>
              <button className="cancel-btn" onClick={handleGoHomeCLT}>
                Go to journey
              </button>
              <button className="yes-btn" onClick={handlereviewCLT}>
                Review my attempt
              </button>
            </div>
          </div>
        </div>
      )}
      {/* {isBoosterPopupOpen && (
        <div className="popup-overlay">
          <div className="quiz-popup-box" ref={boosterPopupRef} style={{ width: "450px" }}>
            <h3 style={{ marginBottom: "20px" }}>
              Hey Explorer, we are loading your progress for this topic:
            </h3>
            <p>{topicNameBoost}</p>
            <div className="quiz-popup-btn" style={{ marginTop: "30px" }}>
              <div className=" customProgressWrapper">
                <div
                  className="customProgressBar"
                  style={{
                    width: `${progress}%`,
                  }}
                >
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {isBoosterPopupOpen && (
        <div className="popup-overlay">
          <div
            className="booster-popup-box"
            ref={boosterPopupRef}
            style={{
              backgroundImage: `url('../images/studentimg/booster-gini-bg.png')`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "cover",
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

      {isLoader ? <Loader /> : ""}
    </div>
  );
};
export default Progress;
