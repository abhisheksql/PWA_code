"use client";
import "../../../../public/style/student.css";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import "../../../../public/style/student.css";
import ProficientIcon from "../../../../public/images/studentimg/ProficientIcon.svg";
import BeginnerIcon from "../../../../public/images/studentimg/BeginnerIcon.svg";
import DevelopingIcon from "../../../../public/images/studentimg/DevelopingIcon.svg";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "../../components/studentcomponent/Loader";
import popupImg from "../../../../public/images/studentimg/CoinSparc.svg";
import Coin from "../../../../public/images/studentimg/Coin.svg";
const Feedback = () => {
  const [quizFeedback, setQuizFeedback] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [chapterId, setChapterId] = useState(0);
  const [courseId, setCourseId] = useState(0);
  const [sectionId, setSectionId] = useState(0);
  const [topicId, setTopicId] = useState(0);
  const [schoolId, setSchoolId] = useState(0);
  const [homeId, setHomeId] = useState(0);
  const [status, setStatus] = useState(0);
  const [popupType, setPopupType] = useState("");
  const [isLoader, setIsLoader] = useState(false);
  const [reviewPopClaimShow, setReviewPopClaimShow] = useState(false);
  const chapterIdparam = searchParams.get("chapter_id");
  const courseIdparam = searchParams.get("course_id");
  const sectionIdparam = searchParams.get("section_id");
  const topicIdparam = searchParams.get("topic_id");
  const popupTypeparam = searchParams.get("test_type");
  const schoolIdparam = searchParams.get("school_id");
  const homeIdparam = searchParams.get("home");
  const statusIdparam = searchParams.get("status");

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
  }, [
    chapterIdparam,
    courseIdparam,
    sectionIdparam,
    topicIdparam,
    popupTypeparam,
    schoolIdparam,
    statusIdparam,
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const feedback = localStorage.getItem("quizfeedback");
      setQuizFeedback(feedback ? JSON.parse(feedback) : null);
    }
  }, []);

  const handleGoHome = () => {
    setIsLoader(true);

    if (homeId == 1) {
      router.push(
        `/student?courseId=${courseId}&chapterId=${chapterId}&status=${status}`
      );
    } else if (homeId == 2) {
      router.push(
        `/student/progresschapter?courseid=${courseId}&chapterid=${chapterId}&tab=performance`
      );
    } else {
      router.push(
        `/student?courseId=${courseId}&chapterId=${chapterId}&status=${status}`
      );
    }
  };

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
      `/student/reviewmyattempt?school_id=${schoolId}&section_id=${sectionId}&course_id=${courseId}&test_type=${quiz_type}&chapter_id=${chapterId}&topic_id=${topicId}&status=${status}`
    );
  };

  useEffect(() => {
    // Access localStorage only in the browser
    const reviewData = localStorage.getItem("review");
    if (reviewData) {
      setReviewPopClaimShow(true);
    } else {
      setReviewPopClaimShow(false);
    }
  }, []);
  const handleCloseClaimShow = () => {
    setReviewPopClaimShow(false);
    localStorage.removeItem("review");
  };
  return (
    <div className="feedback-box-cont">
      <div className="quiz-container">
        {quizFeedback && quizFeedback.status == "Success" ? (
          <div className="question-section">
            <div className="feedback-head">
              <div className="progress-head-icon">
                <Image
                  src={quizFeedback.data.icon}
                  width={30}
                  height={30}
                  alt="Readiness"
                  className="progress-show"
                />
              </div>
              <div
                className="progress-details"
                style={{ alignItems: "center" }}
              >
                <div className="progress-info">
                  <span style={{ color: "#FF8A00" }}>
                    {quizFeedback.data.title}
                  </span>
                </div>
              </div>
            </div>
            <div className="banner">
              <p>{quizFeedback.data.feedback.feedback_msg}</p>
            </div>
            <div style={{ display: "flex", gap: "30px", marginBottom: "20px" }}>
              {[
                {
                  icon: BeginnerIcon,
                  title: "Beginner",
                  count: quizFeedback.data.feedback.beginner_count,
                },

                {
                  icon: DevelopingIcon,
                  title: "Developing",
                  count: quizFeedback.data.feedback.developing_count,
                },
                {
                  icon: ProficientIcon,
                  title: "Proficient",
                  count: quizFeedback.data.feedback.proficient_count,
                },
              ].map((item, index) => (
                <div key={index} className="feedback-top-card">
                  <div className="progress-icon">
                    <Image src={item.icon} alt={`${item.title} Icon`} />
                  </div>
                  <div className="progress-content">
                    <span className="progress-title">{item.title}</span>
                    <span className="progress-count">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                overflowY: "auto",
                height: "260px",
                scrollbarWidth: "none",
              }}
            >
              {quizFeedback.data.feedback.lu_list.map((item, index) => (
                <div
                  key={index}
                  className="progress-card"
                  style={{ justifyContent: "left", gap: "15px" }}
                >
                  <div
                    className="progress-icon"
                    style={{ height: "40px", width: "40px" }}
                  >
                    <Image
                      src={
                        item.lu_status == "beginner"
                          ? BeginnerIcon
                          : item.lu_status == "developing"
                          ? DevelopingIcon
                          : ProficientIcon
                      }
                      alt="Icon"
                    />
                  </div>
                  <div className="progress-content">
                    <span className="progress-title">{item.lu_name}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="button-section">
              <button className="feedback-btn-lft" onClick={handleGoHome}>
                Go to journey
              </button>
              <button className="feedback-btn-rgt" onClick={handlereview}>
                Review my attempt
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
        {isLoader ? <Loader /> : ""}

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
                  You have earned {localStorage.getItem("review")} discovery
                  coins for reviewing your attempt.
                </p>
                <button className="claim-btn" onClick={handleCloseClaimShow}>
                  Claim
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;
