"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import BostPlant from "../../../../public/images/studentimg/BostPlant.svg";
import BostTree from "../../../../public/images/studentimg/BostTree.svg";
import BostArrow from "../../../../public/images/studentimg/BostArrow.svg";
import BoosterTree from "../../../../public/images/studentimg/BoosterTree.png";
import BoosterTreeApple from "../../../../public/images/studentimg/BoosterTreeApple.png";
import axiosInstance from "../../auth";
import { useRouter } from "next/navigation";
import LoaderPaa from "../../components/studentcomponent/LoaderPaa";

const BoosterPaa = ({ pathId, homeId }) => {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [showSubmitPopup, setShowSubmitPopup] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [isLoader, setIsloader] = useState(false);
  const [path, setPath] = useState(2);
  const [paaData, setPaaData] = useState([]);
  const router = useRouter();
  useEffect(() => {
    setPath(pathId);
  }, [pathId]);
  useEffect(() => {
    const storedPaa = localStorage.getItem("paa");
    if (storedPaa) {
      try {
        const parsedPaa = JSON.parse(storedPaa);
        if (parsedPaa?.status == "Success") {
          setPaaData(parsedPaa);
        }
      } catch (error) {
        console.error("Error parsing paa:", error);
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

  const PaaReview = () => {
    setIsloader(true);
    router.push(
      `/student/boosterreview?booster_key=${paaData?.data?.booster_key}&chapterid=${paaData?.data?.chapter_id}&sectionid=${paaData?.data?.section_id}&courseid=${paaData?.data?.course_id}&topicid=${paaData?.data?.topic_id}&version=${paaData?.data?.version}&home=${homeId}`
    );
  };
  const startPaaTest = async () => {
    setIsloader(true);
    try {
      const response = await axiosInstance.post("/test_generator/start_paa", {
        section_id: paaData.data.section_id,
        course_id: paaData.data.course_id,
        chapter_id: paaData.data.chapter_id,
        topic_id: paaData.data.topic_id,
        lu_ids: paaData.data.lu_list,
        subject_name: paaData.data.subject_name,
        chapter_name: paaData.data.chapter_name,
        topic_name: paaData.data.topic_name,
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
  return (
    <div className="booster-container">
      {path == 1 && (
        <>
          <div className="booster-card-cont-main">
            <div className="proficiency-status">
              Yay!{" "}
              <span style={{ display: "block" }}>
                {`You have become proficient in the topic "${paaData?.data?.topic_name}". Time to achieve mastery!`}
              </span>
            </div>
            <div className="booster-progress-container">
              <div className="booster-progress-stage">
                <Image src={BostPlant} alt="Development" />
                <p>Developing</p>
              </div>
              <div className="booster-progress-arrow">
                <Image src={BostArrow} alt="Arrow" />
              </div>
              <div className="booster-progress-stage">
                <Image src={BostTree} alt="Proficient" />
                <p>Proficient</p>
              </div>
            </div>
          </div>
          <div className="btn-container">
            <button className="btn-lft" onClick={PaaReview}>
              Review my attempt
            </button>
            <button className="btn-rgt" onClick={startPaaTest}>
              Next
            </button>
          </div>
        </>
      )}
      {path == 2 && (
        <>
          <div className="booster-card-cont-main">
            <div className="proficiency-status">
              Yay!
              <span style={{ display: "block" }}>
                {`You are proficient in the topic “${paaData?.data?.topic_name}”.
                  Time to achieve mastery!`}
              </span>
            </div>
            <div
              className="booster-progress-container"
              style={{ margin: "0px" }}
            >
              <div>
                <Image
                  src={BoosterTree}
                  alt="Development"
                  width={250}
                  height={250}
                />
              </div>
            </div>
          </div>
          <div className="btn-container">
          <button className="btn-lft" onClick={PaaReview}>
              Review my attempt
            </button>
            <button className="btn-rgt" onClick={startPaaTest}>
              Next
            </button>
          </div>
        </>
      )}
      {path == 3 && (
        <>
          <div className="booster-card-cont-main">
            <div className="proficiency-status">
              Awesome!
              <span style={{ display: "block" }}>
                {`You have mastered the topic "${paaData?.data?.topic_name}" like a
              pro!`}
              </span>
            </div>
            <div
              className="booster-progress-container"
              style={{ margin: "0px" }}
            >
              <div>
                <Image
                  src={BoosterTreeApple}
                  alt="Development"
                  width={250}
                  height={250}
                />
              </div>
            </div>
          </div>
          <div className="btn-container">
            <button className="btn-lft" onClick={startPaaTest}>
              Go to Journey
            </button>
            <button className="btn-rgt" onClick={PaaReview}>
              Review my attempt
            </button>
          </div>
        </>
      )}
      {isLoader ? <LoaderPaa /> : ""}
    </div>
  );
};
export default BoosterPaa;
