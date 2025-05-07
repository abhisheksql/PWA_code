"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import BoosterUpArrow from "../../../../public/images/studentimg/BoosterUpArrow.svg";
import BoosterUpBigArrow from "../../../../public/images/studentimg/BoosterUpBigArrow.svg";
import { useRouter } from "next/navigation";
import ProgressTree from "../../../../public/images/studentimg/ProgressNewTree.svg";
import ProgressNewPlant from "../../../../public/images/studentimg/ProgressNewPlant.svg";
import ProgressFruitTree from "../../../../public/images/studentimg/ProgressFruitTree.svg";
import ProgressHalfPlant from "../../../../public/images/studentimg/ProgressHalfPlant.svg";
import BoosterRaiseTicketIcon from "../../../../public/images/studentimg/BoosterRaiseTicketIcon.svg";
import opacitytree1 from "../../../../public/images/studentimg/opacitytree1.svg";
import opacitytree2 from "../../../../public/images/studentimg/opacitytree2.svg";
import opacitytree3 from "../../../../public/images/studentimg/opacitytree3.svg";
import LoaderPaa from "../../components/studentcomponent/LoaderPaa";
import { RxCross2 } from "react-icons/rx";
import GiniPopupBG from "../../../../public/images/studentimg/GiniPopupBG.png";
import { version } from "os";
import { FiArrowLeft } from "react-icons/fi";
// Component for rendering the question and handling quiz logic
const BoosterRemedial = ({ homeId }) => {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [showSubmitPopup, setShowSubmitPopup] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [isLoader, setIsloader] = useState(false);
  const [paaData, setPaaData] = useState([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [progressLevel, setProgressLevel] = useState(0);
  const [infoCoin, setInfoCoin] = useState(false);
  const router = useRouter();
  const handleBoostClick = () => {
    setIsloader(true);
    router.push(`/student/boosterquiz?home=${homeId}`); // Update with your desired route
  };
  const handleBoostClickpopup = () => {
    setInfoCoin(true);
  };

  useEffect(() => {
    const storedPaa = localStorage.getItem("paa");
    if (storedPaa) {
      setIsloader(true);
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
      } finally {
        setIsloader(false);
      }
    }
  }, []);
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

  const handleReview = () => {
    setIsloader(true);
    router.push(
      `/student/boosterreview?booster_key=${paaData?.data?.booster_key}&chapterid=${paaData?.data?.chapter_id}&sectionid=${paaData?.data?.section_id}&courseid=${paaData?.data?.course_id}&topicid=${paaData?.data?.topic_id}&version=${paaData?.data?.version}&home=${homeId}`
    );
  };

  const quizlength = paaData?.data?.booster_module?.length || 0;

  return (
    <div className="booster-container">
      <div className="progressheader">
        <span onClick={() => handleJourney()} style={{ display: "flex" }}>
          <FiArrowLeft className="booster-backicon" />
        </span>
        <h2>Booster</h2>
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

              {/* {paaData?.data?.review && (
                <span
                  onClick={paaData?.data?.review ? handleReview : null}
                  style={{
                    cursor: paaData?.data?.review ? "pointer" : "not-allowed",
                    opacity: paaData?.data?.review ? 1 : 0.5,
                  }}
                >
                  <Image
                    src={BoosterRaiseTicketIcon}
                    alt="plant"
                    width={25}
                    height={25}
                  />
                </span>
              )} */}
            </div>
          </div>
        </div>

        <div className="booster-flowerplant-box">
          <div className="booster-plant-container">
            <Image src={ProgressNewPlant} alt="plant" width={35} height={35} />

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

      <div className="booster-card-main">
        <div
          className="question-onefeedback"
          style={{ position: "relative", top: "20px" }}
        >
          {paaData?.data?.feedback?.map((group, index) => {
            return (
              <div key={index}>
                <div className=" d-flex feedback-needscard1">
                  <div
                    className="flexarrow"
                    style={index === 1 || index === 2 ? { top: "-330px" } : {}}
                  ></div>

                  <div
                    className={`booster-feedback-topcard2 ${
                      group?.enable ? "" : "bggrey"
                    }`}
                  >
                    <div className="dfac1">
                      {group?.tag ? (
                        <button
                          className={
                            group?.tag == "Proficient"
                              ? "proficient"
                              : group?.tag == "Need Practice"
                              ? "needspractice"
                              : ""
                          }
                        >
                          {group?.tag}
                        </button>
                      ) : null}

                      <p className="topcard-txt">
                        {group?.lu_name ?? "No data available"}
                      </p>
                    </div>
                  </div>
                </div>

                {Array.isArray(group?.child) &&
                  group?.child.map((item, itemIndex) => {
                    return (
                      <div key={itemIndex}>
                        {itemIndex == 0 && (
                          <div className="d-flex feedback-needscard1">
                            <div
                              className="flexarrow"
                              style={{ top: "-20px", left: "30px" }}
                            >
                              <Image src={BoosterUpArrow} alt="Coin Icon" />
                            </div>
                            <div
                              className={`${
                                {
                                  0: "booster-feedback-topcard3",
                                  1: "booster-feedback-topcard4",
                                  2: "booster-feedback-topcard5",
                                }[itemIndex] || ""
                              } ${item?.enable ? "" : "bggrey"}`}
                            >
                              <div className="dfac1">
                                {item?.tag ? (
                                  <button
                                    className={
                                      item?.tag == "Proficient"
                                        ? "proficient"
                                        : item?.tag == "Need Practice"
                                        ? "needspractice"
                                        : ""
                                    }
                                  >
                                    {item?.tag}
                                  </button>
                                ) : null}

                                <p className="topcard-txt">{item.lu_name}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {itemIndex > 0 && (
                          <div className="d-flex feedback-needscard1">
                            <div
                              className="flexarrow"
                              style={{
                                top: "-170px",
                                left: "30px",
                              }}
                            >
                              <Image src={BoosterUpBigArrow} alt="Coin Icon" />
                            </div>
                            <div
                              className={`booster-feedback-topcard3 ${
                                item?.enable ? "" : "bggrey"
                              }`}
                            >
                              <div className="dfac1">
                                {item?.tag ? (
                                  <button
                                    className={
                                      item?.tag == "Proficient"
                                        ? "proficient"
                                        : item?.tag == "Need Practice"
                                        ? "needspractice"
                                        : ""
                                    }
                                  >
                                    {item?.tag}
                                  </button>
                                ) : null}
                                <p className="topcard-txt">{item.lu_name}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {Array.isArray(item?.child) &&
                          item?.child.map((itemchild, itemIndexchild) => {
                            return (
                              <div key={itemIndexchild}>
                                {itemIndexchild == 0 && (
                                  <div className="d-flex feedback-needscard1">
                                    <div
                                      className="flexarrow"
                                      style={{ top: "-20px", left: "30px" }}
                                    >
                                      <Image
                                        src={BoosterUpArrow}
                                        alt="Coin Icon"
                                      />
                                    </div>

                                    <div
                                      className={`${
                                        {
                                          0: "booster-feedback-topcard4",
                                          1: "booster-feedback-topcard5",
                                          2: "booster-feedback-topcard6",
                                        }[itemIndexchild] || ""
                                      } ${itemchild?.enable ? "" : "bggrey"}`}
                                    >
                                      <div className="dfac1">
                                        {itemchild?.tag ? (
                                          <button
                                            className={
                                              itemchild?.tag == "Proficient"
                                                ? "proficient"
                                                : itemchild?.tag ==
                                                  "Need Practice"
                                                ? "needspractice"
                                                : ""
                                            }
                                          >
                                            {itemchild?.tag}
                                          </button>
                                        ) : null}
                                        <p className="topcard-txt">
                                          {itemchild.lu_name}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {itemIndexchild > 0 && (
                                  <div className="d-flex feedback-needscard1">
                                    <div
                                      className="flexarrow"
                                      style={{
                                        top: "-170px",
                                        left: "30px",
                                      }}
                                    >
                                      <Image
                                        src={BoosterUpBigArrow}
                                        alt="Coin Icon"
                                      />
                                    </div>
                                    <div
                                      className={`booster-feedback-topcard4 ${
                                        itemchild?.enable ? "" : "bggrey"
                                      }`}
                                    >
                                      <div className="dfac1">
                                        {itemchild?.tag ? (
                                          <button
                                            className={
                                              itemchild?.tag == "Proficient"
                                                ? "proficient"
                                                : itemchild?.tag ==
                                                  "Need Practice"
                                                ? "needspractice"
                                                : ""
                                            }
                                          >
                                            {itemchild?.tag}
                                          </button>
                                        ) : null}
                                        <p className="topcard-txt">
                                          {itemchild.lu_name}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {Array.isArray(itemchild?.child) &&
                                  itemchild?.child.map((sub, itemsub) => {
                                    return (
                                      <div key={itemsub}>
                                        {itemsub == 0 && (
                                          <div className="d-flex feedback-needscard1">
                                            <div
                                              className="flexarrow"
                                              style={{
                                                top: "-20px",
                                                left: "30px",
                                              }}
                                            >
                                              <Image
                                                src={BoosterUpArrow}
                                                alt="Coin Icon"
                                              />
                                            </div>

                                            <div
                                              className={`${
                                                {
                                                  0: "booster-feedback-topcard5",
                                                  1: "booster-feedback-topcard6",
                                                  2: "booster-feedback-topcard7",
                                                }[itemsub] || ""
                                              } ${sub?.enable ? "" : "bggrey"}`}
                                            >
                                              <div className="dfac1">
                                                {sub?.tag ? (
                                                  <button
                                                    className={
                                                      sub?.tag == "Proficient"
                                                        ? "proficient"
                                                        : sub?.tag ==
                                                          "Need Practice"
                                                        ? "needspractice"
                                                        : ""
                                                    }
                                                  >
                                                    {sub?.tag}
                                                  </button>
                                                ) : null}
                                                <p className="topcard-txt">
                                                  {sub.lu_name}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        )}

                                        {itemsub > 0 && (
                                          <div className="d-flex feedback-needscard1">
                                            <div
                                              className="flexarrow"
                                              style={{
                                                top: "-170px",
                                                left: "30px",
                                              }}
                                            >
                                              <Image
                                                src={BoosterUpBigArrow}
                                                alt="Coin Icon"
                                              />
                                            </div>
                                            <div
                                              className={`booster-feedback-topcard5 ${
                                                sub?.enable ? "" : "bggrey"
                                              }`}
                                            >
                                              <div className="dfac1">
                                                {sub?.tag ? (
                                                  <button
                                                    className={
                                                      sub?.tag == "Proficient"
                                                        ? "proficient"
                                                        : sub?.tag ==
                                                          "Need Practice"
                                                        ? "needspractice"
                                                        : ""
                                                    }
                                                  >
                                                    {sub?.tag}
                                                  </button>
                                                ) : null}
                                                <p className="topcard-txt">
                                                  {sub.lu_name}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                              </div>
                            );
                          })}
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="btn-container" style={{ marginTop: "50px" }}>

        {paaData?.data?.topic_bar?.label < 3 && (
          paaData?.data?.review ? (
            <>
            {(quizlength < 1 && paaData?.data?.version === 2) && <div></div>}
            <button className="btn-lft" onClick={handleReview}>
              Review My Attempt
            </button>
          </>
          ) : (
            <div></div>
          )
        )}

        {paaData?.data?.topic_bar?.label == 3 ? (
          paaData?.data?.review ? (
          <>
            <div></div>
            <button className="btn-lft" onClick={paaData?.data?.review ? handleReview : null}>
              Review My Attempt
            </button>
          </>
          ) : (
            <div></div>
          )
        ) : quizlength > 0 && paaData?.data?.booster_enable ? (
          <button className="btn-rgt" onClick={handleBoostClick}>
            {paaData?.data?.version == 2 ? "Boost to Mastery" : "Boost"}
          </button>
        ) : (!(quizlength < 1 && paaData?.data?.version === 2) && (
            <button className="btn-rgt" onClick={handleBoostClickpopup}>
              Boost
            </button>
          ))
        }
      </div>

      {infoCoin && (
        <div className="popup-overlay" onClick={() => setInfoCoin(false)}>
          <div
            className=" bosster-gini-popup-box bg-gradian backgroundImage4"
          >
            <div
              className="popup-header"
              style={{ justifyContent: "space-between" }}
            >
              <div className="popup-header-left"></div>
              <button
                className="close-btn"
                style={{ position: "relative" }}
                onClick={() => setInfoCoin(false)}
              >
                <RxCross2 />
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoader ? <LoaderPaa /> : ""}
    </div>
  );
};

export default BoosterRemedial;
