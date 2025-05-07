"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import backArrowImg from "../../../../public/images/studentimg/left.svg";
import popupImg from "../../../../public/images/studentimg/popup-img.svg";
import { useRouter } from "next/navigation";
import ProgressBar from "@ramonak/react-progress-bar";
import GreenCheck from "../../../../public/images/studentimg/GreenCheck.svg";
import Loader from "../../components/studentcomponent/Loader";
const AchievementsPage = ({ subjectData, typeBadge }) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [medalLength, setMedalLength] = useState(0);
  const [isLoader, setIsloader] = useState(false);
  const handleShowModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleback = () => {
    router.push(`/student/profile`);
  };

  useEffect(() => {
    if (subjectData) {
      setMedalLength(subjectData.data.medals.length);
    }
  }, [subjectData]);

  const handleChapter = (course_id, chapter_id) => {
    setIsloader(true);
    router.push(
      `/student/progresschapter?chapterid=${chapter_id}&courseid=${course_id}&typeBadge=${typeBadge}&redirectstatus=1`
    );
  };

  return (
    <div className="achievements-container">
      <div className="achievements-back-arrow">
        <span style={{ cursor: "pointer" }}>
          <Image src={backArrowImg} alt="Back" onClick={handleback} />
        </span>
        <h4>You’ve collected this badge in:</h4>
      </div>

      <div className="achievements-content">
        <div className="achievements-badge-list-container">
          {subjectData &&
            subjectData.data &&
            subjectData.data.medals.map((badge, index) => (
              <div
                key={index}
                className="achievements-badge-item"
                style={{
                  justifyContent: "space-between",
                  cursor:
                    typeBadge == "rockstar" ||
                    // typeBadge == "ninja" ||
                    typeBadge == "marvel"
                      ? "pointer"
                      : "default",
                }}
                onClick={
                  typeBadge == "rockstar" ||
                  // typeBadge == "ninja" ||
                  typeBadge == "marvel"
                    ? () => handleChapter(badge.course_id, badge.chapter_id)
                    : undefined
                }
              >
                {/* ========================= */}
                <div
                  style={{ display: "flex", flexDirection: "row", gap: "15px" }}
                >
                  <div className="cardimg">
                    <Image
                      src={badge.icon}
                      alt={badge.chapter_name}
                      width={30}
                      height={30}
                    />
                  </div>
                  <div className="achievements-badge-content">
                    <h5 className="achievements-badge-title">
                      {typeBadge == "go"
                        ? badge.z
                        : typeBadge == "book"
                        ? `${badge.count} Quizzes`
                        : badge.chapter_name}
                    </h5>
                    <p className="achievements-badge-date">{badge.time}</p>
                  </div>
                </div>
                <div>
                  <Image src={GreenCheck} alt="green check" />
                </div>
              </div>
            ))}
          {subjectData &&
            subjectData.data &&
            subjectData.data.bar.map((badge, index) => (
              <div
                key={index}
                className="achievements-badge-item"
                style={{
                  justifyContent: "space-between",
                  cursor:
                    typeBadge == "rockstar" ||
                    // typeBadge == "ninja" ||
                    typeBadge == "marvel"
                      ? "pointer"
                      : "default",
                }}
                onClick={
                  typeBadge == "rockstar" ||
                  // typeBadge == "ninja" ||
                  typeBadge == "marvel"
                    ? () => handleChapter(badge.course_id, badge.chapter_id)
                    : undefined
                }
              >
                <div
                  style={{ display: "flex", flexDirection: "row", gap: "15px" }}
                >
                  <div className="cardimg">
                    <Image
                      src={badge.icon}
                      alt={badge.chapter_name}
                      width={30}
                      height={30}
                    />
                  </div>
                  <div className="achievements-badge-content">
                    <h5 className="achievements-badge-title">
                      {typeBadge == "go"
                        ? badge.z
                        : typeBadge == "book"
                        ? `${badge.y} Quizzes`
                        : badge.chapter_name}
                    </h5>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <ProgressBar
                        completed={(badge.x / badge.y) * 100}
                        bgColor="#9DCA45"
                        baseBgColor="#D1D1D1"
                        height="10px"
                        borderRadius="20px"
                        isLabelVisible={false}
                        width="250px"
                      />
                      <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                        <span style={{ color: "#FF8A00" }}>
                          {badge.x}/{badge.y}{" "}
                        </span>
                        <span style={{ color: "#949494" }}>
                          {" "}
                          {typeBadge == "go" ? "Coins" : "Quizzes"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="achievements-profile-right-container">
          {subjectData &&
            subjectData.data &&
            subjectData.data.head.length > 0 && (
              <>
                <div className="achievements-profile-background-1">
                  <div
                    className="achievements-profile-background-2"
                    onClick={handleShowModal} // Show modal on click
                  >
                    <Image
                      src={subjectData.data.head[0].icon}
                      width={80}
                      height={80}
                      alt="Achievement Image"
                      className="achievements-inner-image"
                    />
                  </div>
                </div>
                <div className="achievements-badge-info">
                  {/* start */}
                  <p class="number">{medalLength}</p>
                  {/* end */}
                  <h3 className="achievements-badge-name">
                    {subjectData.data.head[0].name}
                  </h3>
                  <p className="achievements-badge-description">
                    {subjectData.data.head[0].info}
                  </p>
                </div>
              </>
            )}
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-body">
              <h2>Congratulations!</h2>
              <p>You have earned a new badge!</p>
              <Image src={popupImg} alt="Badge Popup" className="popup-img" />
              <h3 className="modal-badge-title">
                {subjectData.data.head[0].name}
              </h3>
              <p className="modal-badge-description">
                Yay! You have completed all the quizzes of{" "}
                {subjectData.data.medals[0].chapter_name} .
              </p>
              <button className="claim-btn" onClick={handleCloseModal}>
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

export default AchievementsPage;
