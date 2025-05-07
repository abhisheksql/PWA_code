"use client";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "../../components/studentcomponent/Loader";
import ProgressPlant from "../../../../public/images/studentimg/ProgressNewPlant.svg";
import ProgressHalfPlant from "../../../../public/images/studentimg/ProgressHalfPlant.svg";
import ProgressTree from "../../../../public/images/studentimg/ProgressNewTree.svg";
import ProgressFruitTree from "../../../../public/images/studentimg/ProgressFruitTree.svg";
import InfoTooltip from "../../../../public/images/studentimg/InfoTooltip.svg";
import NoIcon from "../../../../public/images/studentimg/NoIcon.svg";
import ProficientIcon from "../../../../public/images/studentimg/ProficientIcon.svg";
import BeginnerIcon from "../../../../public/images/studentimg/BeginnerIcon.svg";
import DevelopingIcon from "../../../../public/images/studentimg/DevelopingIcon.svg";
import MasterIcon from "../../../../public/images/studentimg/MasterIcon.svg";

const Progress = ({
  progressData,
  setProgressChapterData,
  setProgressChapterDataTab,
  setProgressChapterRight,
  courseId,
}) => {
  const router = useRouter();
  const [isLoader, setIsLoader] = useState(false);
  const studentbaseUrl = process.env.NEXT_PUBLIC_STUDENT_API_URL;
  const [isPopupOpenTooltip, setIsPopupOpenTooltip] = useState(false);

  // Mapping sequence values to images
  const imageMap = {
    0: ProgressPlant,
    1: ProgressHalfPlant,
    2: ProgressTree,
    3: ProgressFruitTree,
  };
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

  const handleChapterClick = async (chapter) => {
    setIsLoader(true);
    router.push(
      `/student/progresschapter?chapterid=${chapter.chapter_id}&courseid=${courseId}`
    );
  };
  return (
    <div className="progress-container">
      <h2 className="progresstitle">
        All Chapters ({progressData?.data?.length > 0 ? progressData?.data?.length : 0})
        <div className="std_repo_tooltip-container">
          <button
            onClick={() => setIsPopupOpenTooltip(true)}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <Image src={InfoTooltip} alt="Info" width={20} height={20} />
          </button>
          {isPopupOpenTooltip && (
            <div className="popup-overlay">
              <div
                ref={popupRef}
                className="quiz-popup-box std_repo_tooltip"
                style={{ width: "450px" }}
              >
                <div className="tooltiphead">
                  <h3>
                    The chapter progress bar shows your performance across
                    topics and how far you’ve progressed in each topic.
                  </h3>
                </div>

                <div
                  className="chart-Legend"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    padding: "5px 0px",
                    maxHeight: "400px",
                    overflowY: "auto",
                  }}
                >
                  {[
                    {
                      icon: NoIcon,
                      title: "Unattempted",
                      desc: "This topic hasn’t been attempted yet.",
                    },
                    {
                      icon: BeginnerIcon,
                      title: "Sapling - Beginner",
                      desc: "You need more practice to understand the basics of this topic.",
                    },
                    {
                      icon: DevelopingIcon,
                      title: "Plant - Developing",
                      desc: "You understand the basics and are making progress.",
                    },
                    {
                      icon: ProficientIcon,
                      title: "Tree - Proficient",
                      desc: "You have a solid grasp and understanding of this topic.",
                    },
                    {
                      icon: MasterIcon,
                      title: "Tree with fruits - Master",
                      desc: "You’ve mastered this topic and can tackle advanced questions.",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="dfa"
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                        borderBottom: "1px solid #D1D1D1",
                        justifyContent: "flex-start",
                      }}
                    >
                      <div className="progress-icon">
                        <Image src={item.icon} alt={item.title} />
                      </div>
                      <div
                        className="df tootltipContentText"
                        style={{ alignItems: "flex-start" }}
                      >
                        <h5>{item.title}</h5>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </h2>

      <div className="chapterList">
        {progressData && progressData.data ? (
          progressData.data.map((chapter, index) => {
            const totaltopiccount = chapter?.sequence.length;
            const noAttemptCount = chapter?.sequence?.filter(
              (topic) => topic == -1
            ).length;
            const finalCount = totaltopiccount - noAttemptCount;

            const progressPercentage =
              totaltopiccount == 0 ? 0 : (finalCount / totaltopiccount) * 100;
            const validSequence = chapter.sequence.filter((num) =>
              [0, 1, 2, 3].includes(num)
            );

            return (
              <button
                key={index}
                style={{
                  textDecoration: "none",
                  border: "none",
                  background: "none",
                  cursor:
                    chapter.status === "ongoing" ||
                    chapter.status === "completed"
                      ? "pointer"
                      : "",
                }}
                onClick={() => {
                  if (
                    chapter.status === "ongoing" ||
                    chapter.status === "completed"
                  ) {
                    handleChapterClick(chapter);
                  }
                }}
              >
                <div
                  className={
                    chapter.status == "upcoming"
                      ? "progressCardupcoming"
                      : "progressCard"
                  }
                >
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
                        <span className="chapterTitle">
                          {chapter.chapter_name}
                        </span>
                        {chapter.status !== "upcoming" && (
                          <div
                            className={
                              chapter.status == "completed"
                                ? "statusOngoingcompleted"
                                : "statusOngoing"
                            }
                          >
                            {chapter.status == "completed"
                              ? "Assigned"
                              : "Ongoing"}
                          </div>
                        )}
                      </div>
                    </div>
                    {chapter.status !== "upcoming" && (
                      <>
                        <p
                          className="quizInfo"
                          style={{ textAlign: "left", margin: "0px" }}
                        >
                          {chapter.total_activity_completion} /{" "}
                          {chapter.total_activity} Topics Attempted{" "}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="progressChapterContent">
                    {validSequence.length > 0 ? (
                      <div
                        className="progressChapterTreeBox"
                        style={{
                          width: `${progressPercentage}%`
                        }}
                      >
                        {validSequence.map((num, i) => (
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
                              width={30}
                              height={30}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ minHeight: "30px" }}></div>
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
              </button>
            );
          })
        ) : (
          // <Loader />
          ""
        )}
      </div>
      {isLoader ? <Loader /> : ""}
    </div>
  );
};
export default Progress;
