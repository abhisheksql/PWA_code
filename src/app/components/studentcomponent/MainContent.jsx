"use client";
import "../../../../public/style/student.css";
import React, { useState } from "react";
import Image from "next/image";
import { RxCross2 } from "react-icons/rx";
import TopSvg from "../../../../public/images/studentimg/top-svg.svg";
import BtmSvg from "../../../../public/images/studentimg/btm-svg.svg";
import Quiz from "../../../../public/images/studentimg/Quiz.svg";
import TreeIcon from "../../../../public/images/studentimg/TreeIcon.svg";
import MagicLamp from "../../../../public/images/studentimg/MagicLamp.svg";
import Readiness from "../../../../public/images/studentimg/Readiness.svg";
import Quest from "../../../../public/images/studentimg/Quest.svg";
import Milestone from "../../../../public/images/studentimg/Milestone.svg";
import Sapling from "../../../../public/images/studentimg/Sapling.svg";
import Plant from "../../../../public/images/studentimg/Plant.svg";
import Master from "../../../../public/images/studentimg/Master.svg";
import Tree from "../../../../public/images/studentimg/Tree.svg";
import ReadinessPopup from "../../../../public/images/studentimg/ReadinessPopup.svg";
import QuestPopup from "../../../../public/images/studentimg/QuestPopup.svg";
import MilestonePopup from "../../../../public/images/studentimg/MilestonePopup.svg";
import SaplingPopup from "../../../../public/images/studentimg/SaplingPopup.svg";
import PlantPopup from "../../../../public/images/studentimg/PlantPopup.svg";
import TreePopup from "../../../../public/images/studentimg/TreePopup.svg";
import MasterPopup from "../../../../public/images/studentimg/MasterPopup.svg";
import BoosterPopup from "../../../../public/images/studentimg/BoosterPopup.svg";

const MainContent = () => {
  const [showPopup, setShowPopup] = useState({
    readiness: false,
    quest: false,
    milestone: false,
    magicLamp: false,
    sapling: false,
    plant: false,
    tree: false,
    master: false,
  });

  const handleIconClick = (popupType) => {
    setShowPopup({ ...showPopup, [popupType]: true });
  };

  const handleClosePopup = (popupType, isCloseButton = false) => {
    let nextPopupType = null;

    // If the close (X) button is clicked, just close the popup without opening the next one
    if (isCloseButton) {
      setShowPopup((prevState) => ({
        ...prevState,
        [popupType]: false,
      }));
      return;
    }

    // Sequential flow for Readiness, Quest, Milestone, Booster
    if (popupType === "readiness") {
      nextPopupType = "quest";
    } else if (popupType === "quest") {
      nextPopupType = "magicLamp";
    } else if (popupType === "magicLamp") {
      nextPopupType = "milestone";
    } else if (popupType === "milestone") {
      nextPopupType = null;
    }

    // Sequential flow for Sapling, Plant, Tree
    if (popupType === "sapling") {
      nextPopupType = "plant";
    } else if (popupType === "plant") {
      nextPopupType = "tree";
    } else if (popupType === "tree") {
      nextPopupType = "master";
    } else if (popupType === "master") {
      nextPopupType = null; // Close all popups
    }

    setShowPopup((prevState) => ({
      readiness: false,
      quest: false,
      milestone: false,
      magicLamp: false,
      sapling: false,
      plant: false,
      tree: false,
      master: false,
      ...(nextPopupType ? { [nextPopupType]: true } : {}), // Open next popup if available
    }));
  };

  return (
    <div className="mainContent">
      <div className="sticky">
        <div className="progress-head">
          <div className="progress-head-icon">
            <Image src={Quiz} alt="Readiness" className="progress-show" width={30}
            height={30} />
          </div>
          <div>
            <span>Know your Quizzes</span>
            <p>
              Click on each icon to understand what they represent and how they
              help your learning journey.
            </p>
          </div>
        </div>
      </div>
      <div className="std-progress">
        <div className="stage">
          <div className="stage-icon1">
            <span onClick={() => handleIconClick("readiness")}>
              <Image
                src={Readiness}
                alt="Readiness"
                className="progress-icon responsive-img2"
                width={70}
                height={70}
              />
            </span>
            <p>Readiness</p>
          </div>
          <Image
            src={TopSvg}
            alt="Top svg"
            className="progress-show responsive-svg"
          />
        </div>
        <div className="topic-name-container">
          <div className="topicline"></div>
          <div className="topic-name-box">Topic Name</div>
          <div className="topicline"></div>
        </div>
        <div className="stage">
          <div className="stage-icon2">
            <span onClick={() => handleIconClick("quest")}>
              <Image 
              src={Quest} 
              alt="Quest" 
              className="progress-icon responsive-img2" 
              width={70}        
              height={70}/>
            </span>
            <p>Quest</p>
          </div>
          <Image
            src={BtmSvg}
            alt="Bottom Svg"
            className="progress-show responsive-svg"
          />
          <div>
            <Image
              src={MagicLamp}
              alt="Magic Lamp"
              style={{ position: "relative", left: "-35%", top: "-15px" , cursor:'pointer' }}
              onClick={() => handleIconClick("magicLamp")}
              width={200}
              height={70}
            />
          </div>
        </div>
        <div className="topic-name-container">
          <div className="topicline"></div>
          <div className="topic-name-box">Milestone</div>
          <div className="topicline"></div>
        </div>
        <div className="stage">
          <div className="stage-icon1">
            <span onClick={() => handleIconClick("milestone")}>
              <Image
                src={Milestone}
                alt="Milestone"
                className="progress-icon responsive-img2"
                width={70}
                height={70}
              />
            </span>
            <p>Milestone</p>
          </div>
          <Image
            src={TopSvg}
            alt="Top svg"
            className="progress-show responsive-svg"
          />
        </div>
      </div>
      <div className="sticky">
        <div className="progress-head">
          <div className="progress-head-icon">
            <Image 
            src={TreeIcon} 
            alt="Readiness" 
            className="progress-show" 
            width={30}
            height={30}/>
          </div>
          <div>
            <span>Know your Progress</span>
            <p>
              Click on each icon to understand these growth stages and what they
              represent in your learning journey.
            </p>
          </div>
        </div>
      </div>
      <div className="std-progress">
        <div className="stage">
          <div className="stage-icon1">
            <span onClick={() => handleIconClick("sapling")}>
              <Image 
              src={Sapling} 
              alt="Sapling" 
              className="progress-icon responsive-img2"
              width={70}
              height={70} />
            </span>
            <p>Beginner</p>
          </div>
          <Image
            src={TopSvg}
            alt="Top svg"
            className="progress-show responsive-svg"
          />
        </div>
        <div className="stage" style={{ top: "-40px" }}>
          <div className="stage-icon2">
            <span onClick={() => handleIconClick("plant")}>
              <Image 
              src={Plant} 
              alt="Plant" 
              className="progress-icon responsive-img2" 
              width={70}
              height={70}/>
            </span>
            <p>Developing</p>
          </div>
          <Image
            src={BtmSvg}
            alt="Bottom Svg"
            className="progress-show responsive-svg"
          />
        </div>
        <div className="stage" style={{ top: "-100px" }}>
          <div className="stage-icon1">
            <span onClick={() => handleIconClick("tree")}>
              <Image 
              src={Tree} 
              alt="Tree" 
              className="progress-icon responsive-img2" 
              width={70}
              height={70}/>
            </span>
            <p>Proficient</p>
          </div>
          <Image
            src={TopSvg}
            alt="Top svg"
            className="progress-show responsive-svg"
          />
        </div>
        <div className="stage" style={{ top: "-120px", left: "20px" }}>
          <div className="stage-icon2">
            <span onClick={() => handleIconClick("master")}>
              <Image 
              src={Master} 
              alt="Master" 
              className="progress-icon responsive-img2" 
              width={70}
              height={70}/>
            </span>
            <p>Master</p>
          </div>
        </div>
      </div>

      {/* Popups Section */}
      {showPopup.readiness && (
        <ReadinessPopupBox handleClosePopup={handleClosePopup} />
      )}
      {showPopup.quest && <QuestPopupBox handleClosePopup={handleClosePopup} />}
      {showPopup.milestone && (
        <MilestonePopupBox handleClosePopup={handleClosePopup} />
      )}
      {showPopup.magicLamp && (
        <MagicLampPopupBox handleClosePopup={handleClosePopup} />
      )}
      {showPopup.sapling && (
        <SaplingPopupBox handleClosePopup={handleClosePopup} />
      )}
      {showPopup.plant && <PlantPopupBox handleClosePopup={handleClosePopup} />}
      {showPopup.tree && <TreePopupBox handleClosePopup={handleClosePopup} />}
      {showPopup.master && (
        <MasterPopupBox handleClosePopup={handleClosePopup} />
      )}
    </div>
  );
};
{
  /* Readiness Popup */
}
const ReadinessPopupBox = ({ handleClosePopup }) => (
  <div className="popup-overlay">
    <div className="popup-box">
      <div className="popup-header">
        <h2>Readiness</h2>
        <button
          className="close-btn"
          onClick={() => handleClosePopup("readiness", true)}
        >
          {" "}
          <RxCross2 />{" "}
        </button>
      </div>
      <div className="notassignedpopupimg">
        <Image
          src={Readiness}
          alt="ReadinessPopup"
          className="progress-popup-icon"
        />
      </div>
      <div className="popup-content">
        <p>
          A Readiness Quiz assesses what you already know before diving into a
          new chapter.
        </p>
        <p>Take this quiz before starting a chapter.</p>
      </div>
      <div className="popup-footer">
        <button
          onClick={() => handleClosePopup("readiness")}
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
    </div>
  </div>
);

{
  /* Quest Popup */
}
const QuestPopupBox = ({ handleClosePopup }) => (
  <div className="popup-overlay">
    <div className="popup-box">
      <div className="popup-header">
        <h2>Quest</h2>
        <button
          className="close-btn"
          onClick={() => handleClosePopup("quest", true)}
        >
          {" "}
          <RxCross2 />{" "}
        </button>
      </div>
      <div className="notassignedpopupimg">
        <Image
          src={Quest}
          alt="QuestPopup"
          className="progress-popup-icon"
        />
      </div>
      <div className="popup-content">
        <p>A Quest assesses your understanding of a topic. </p>
        <p>Take this quiz when you have learnt the topic in class.</p>
      </div>
      <div className="popup-footer">
        <button
          onClick={() => handleClosePopup("quest")}
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
    </div>
  </div>
);

{
  /* Milestone Popup */
}
const MilestonePopupBox = ({ handleClosePopup }) => (
  <div className="popup-overlay">
    <div className="popup-box">
      <div className="popup-header">
        <h2>Milestone</h2>
        <button
          className="close-btn"
          onClick={() => handleClosePopup("milestone", true)}
        >
          {" "}
          <RxCross2 />{" "}
        </button>
      </div>
      <div className="notassignedpopupimg">
        <Image
          src={Milestone}
          alt="MilestonePopup"
          className="progress-popup-icon"
        />
      </div>

      <div className="popup-content">
        <p>A milestone assesses your knowledge of a chapter. </p>
        <p>
          Take this quiz after finishing all the quests to see how much you’ve
          learned.
        </p>
      </div>
      <div className="popup-footer">
        <button
          onClick={() => handleClosePopup("milestone")}
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
    </div>
  </div>
);

{
  /* Booster Popup */
}
const MagicLampPopupBox = ({ handleClosePopup }) => (
  <div className="popup-overlay">
    <div
      className="popup-box"
      style={{
        background:
          "linear-gradient(rgba(255, 255, 255, 0.2), rgba(20, 119, 248, 0.2)), rgba(255, 255, 255, 1)",
      }}
    >
      <div className="popup-header">
        <h2>Booster</h2>
        <button
          className="close-btn"
          onClick={() => handleClosePopup("magicLamp", true)}
        >
          {" "}
          <RxCross2 />{" "}
        </button>
      </div>
      <div className="dfa">
        <Image
          src={BoosterPopup}
          alt="BoosterPopup"
          className="progress-popup-icon"
          width={250}
        />
      </div>

      <div className="popup-content">
        <p> A Booster helps you grow in your understanding of a concept.</p>
        <p>Take this quiz to strengthen your learning.</p>
      </div>
      <div className="popup-footer">
        <button
          onClick={() => handleClosePopup("magicLamp")}
          className="understood-btn"
          style={{
            backgroundColor: "#1477F8",
            borderBottom: "4px solid #08479A",
          }}
        >
          I Understand
        </button>
        <div className="three-dots">
          <div className="dot" style={{ backgroundColor: "#1477F8" }}></div>
          <div
            className="dot middle"
            style={{ backgroundColor: "#08479A" }}
          ></div>
          <div className="dot" style={{ backgroundColor: "#1477F8" }}></div>
        </div>
      </div>
    </div>
  </div>
);

{
  /*  Sapling Popup  */
}
const SaplingPopupBox = ({ handleClosePopup }) => (
  <div className="popup-overlay">
    <div className="popup-box">
      <div className="popup-header">
        <h2>Beginner</h2>
        <button
          className="close-btn"
          onClick={() => handleClosePopup("sapling", true)}
        >
          {" "}
          <RxCross2 />{" "}
        </button>
      </div>
      <div className="notassignedpopupimg">
        <Image
          src={SaplingPopup}
          alt="SaplingPopup"
          className="progress-popup-icon"
        />
      </div>
      <div className="popup-content">
        <h3 style={{ color: "#5E5E5E", marginBottom: "12px" }}>
          You are a beginner!
        </h3>
        <p>
          {" "}
          You are starting to understand the concept. Keep learning and
          practicing, and you can become master in this concept.
        </p>
      </div>
      <div className="popup-footer">
        <button
          onClick={() => handleClosePopup("sapling")}
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
    </div>
  </div>
);

{
  /* Developing Popup */
}
const PlantPopupBox = ({ handleClosePopup }) => (
  <div className="popup-overlay">
    <div className="popup-box">
      <div className="popup-header">
        <h2>Developing</h2>
        <button
          className="close-btn"
          onClick={() => handleClosePopup("plant", true)}
        >
          {" "}
          <RxCross2 />{" "}
        </button>
      </div>
      <div className="notassignedpopupimg">
        <Image
          src={PlantPopup}
          alt="PlantPopup"
          className="progress-popup-icon"
        />
      </div>

      <div className="popup-content">
        {/* <h3 style={{ color: "#5E5E5E", marginBottom: "12px" }}>
          You are developing!
        </h3> */}
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
    </div>
  </div>
);

{
  /* Proficient Popup */
}
const TreePopupBox = ({ handleClosePopup }) => (
  <div className="popup-overlay">
    <div className="popup-box">
      <div className="popup-header">
        <h2>Proficient</h2>
        <button
          className="close-btn"
          onClick={() => handleClosePopup("tree", true)}
        >
          {" "}
          <RxCross2 />{" "}
        </button>
      </div>
      <div className="notassignedpopupimg">
        {" "}
        <Image
          src={TreePopup}
          alt="TreePopup"
          className="progress-popup-icon"
        />
      </div>
      <div className="popup-content">
        {/* <h3 style={{ color: "#5E5E5E", marginBottom: "12px" }}>
          You are Proficient!
        </h3> */}
        <p>
          A tree indicates you have a strong understanding of the sub-concept.
          You can easily apply your knowledge and skills effectively.
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
    </div>
  </div>
);

{
  /* Proficient Popup */
}
const MasterPopupBox = ({ handleClosePopup }) => (
  <div className="popup-overlay">
    <div className="popup-box">
      <div className="popup-header">
        <h2>Master</h2>
        <button
          className="close-btn"
          onClick={() => handleClosePopup("master", true)}
        >
          {" "}
          <RxCross2 />{" "}
        </button>
      </div>
      <div className="notassignedpopupimg">
        {" "}
        <Image
          src={MasterPopup}
          alt="Master Popup"
          className="progress-popup-icon"
        />
      </div>
      <div className="popup-content">
        {/* <h3 style={{ color: "#5E5E5E", marginBottom: "12px" }}>
          You are Proficient!
        </h3> */}
        <p>
          A Tree with Fruits indicates that you’ve mastered the concept and
          conquered both the basic and advanced level challenges.
        </p>
      </div>
      <div className="popup-footer">
        <button
          onClick={() => handleClosePopup("master")}
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
    </div>
  </div>
);

export default MainContent;
