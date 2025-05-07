`use client`;
import React, { useState } from "react";
import Image from "next/image";
import ProficientIcon from "../../../../public/images/studentimg/ProficientIcon.svg";
import BeginnerIcon from "../../../../public/images/studentimg/BeginnerIcon.svg";
import DevelopingIcon from "../../../../public/images/studentimg/DevelopingIcon.svg";
import MasterIcon from "../../../../public/images/studentimg/MasterIcon.svg";
import NoIcon from "../../../../public/images/studentimg/NoIcon.svg";
import { useRouter } from "next/navigation";

const ProgressRight = ({
  progressChapterData,
  progressChapterDataTab,
  progressChapterRight,
  chapterId,
  courseId,
  showBeginner,
  setShowBeginner,
  showProficient,
  setShowProficient,
  showDeveloping,
  setShowDeveloping,
  setShowList,
  showKey,
  setShowKey,
}) => {
  const router = useRouter();
  let beginner_count = 0;
  let developing_count = 0;
  let proficient_count = 0;
  let no_attempt_count = 0;
  let master_count = 0;
    no_attempt_count = progressChapterDataTab?.data?.data?.no_attempt ? progressChapterDataTab?.data?.data?.no_attempt
      : 0;
    beginner_count = progressChapterDataTab?.data?.data?.beginner_count ? progressChapterDataTab?.data?.data?.beginner_count
        : 0;
    developing_count = progressChapterDataTab?.data?.data?.developing_count ? progressChapterDataTab?.data?.data?.developing_count
        : 0;
    proficient_count = progressChapterDataTab?.data?.data?.proficient_count ? progressChapterDataTab?.data?.data?.proficient_count
        : 0;
        master_count = progressChapterDataTab?.data?.data?.master_count ? progressChapterDataTab?.data?.data?.master_count
      : 0;

  const handleHomepage = () => {
    router.push(
      `/student?courseId=${courseId}&chapterId=${chapterId}&status=1`
    );
  };

  const handleshow = (id) => {
    setShowKey((prev) => (prev == id ? 0 : id));
  };

  return (
    <div className="progress-right">
    <div
        className={showKey == 1 ? "progress-card-report" : "progress-card"}
        onClick={() => handleshow(1)}
        style={{cursor: 'pointer'}}
      >
        <div className="progress-content">
          <span className="progress-card-title">Not Attempted</span>
          <span className="progress-count">{no_attempt_count}</span>
        </div>
        <div className="progress-icon">
          <Image src={NoIcon} alt="Developing Icon" />
        </div>
      </div>

      <div
        className={showKey == 2 ? "progress-card-report" : "progress-card"}
        onClick={() => handleshow(2)}
        style={{cursor: 'pointer'}}
      >
        <div className="progress-content">
          <span className="progress-card-title">Beginner</span>
          <span className="progress-count">{beginner_count}</span>
        </div>
        <div className="progress-icon">
          <Image src={BeginnerIcon} alt="Beginner Icon" />
        </div>
      </div>
      <div
        className={showKey == 3 ? "progress-card-report" : "progress-card"}
        onClick={() => handleshow(3)}
        style={{cursor: 'pointer'}}
      >
        <div className="progress-content">
          <span className="progress-card-title">Developing</span>
          <span className="progress-count">{developing_count}</span>
        </div>
        <div className="progress-icon">
          <Image src={DevelopingIcon} alt="Developing Icon" />
        </div>
      </div>
      <div
        className={showKey == 4 ? "progress-card-report" : "progress-card"}
        onClick={() => handleshow(4)}
        style={{cursor: 'pointer'}}
      >
        <div className="progress-content">
          <span className="progress-card-title">Proficient</span>
          <span className="progress-count">{proficient_count}</span>
        </div>
        <div className="progress-icon">
          <Image src={ProficientIcon} alt="Proficient Icon" />
        </div>
      </div>
      <div
        className={showKey == 5 ? "progress-card-report" : "progress-card"}
        onClick={() => handleshow(5)}
        style={{cursor: 'pointer'}}
      >
        <div className="progress-content">
          <span className="progress-card-title">Master</span>
          <span className="progress-count">{master_count}</span>
        </div>
        <div className="progress-icon">
          <Image src={MasterIcon} alt="Developing Icon" />
        </div>
      </div>
    </div>
  );
};

export default ProgressRight;
