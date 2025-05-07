"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Coin from "../../../../public/images/studentimg/Coin.svg";
import Gems from "../../../../public/images/studentimg/Gems.svg";
import MtCoins from "../../../../public/images/studentimg/mtcoin.svg";
import MtGems from "../../../../public/images/studentimg/mtgem.svg";
import axiosInstance from "../../auth";
import info from "../../../../public/images/studentimg/info.svg";
import { useRouter } from "next/navigation";

const RightSection = ({
  keyvalue,
  activeTab,
  balanceData,
  subjectData,
  setCourseId,
  coinStatus,
  gemStatus,
  increaseValue,
  decreaseValue,
  courseIdActive,
  increaseGemsValue,
  decreaseGemsValue,
  setCoin,
  setGems,
  setDecreaseValue,
  setIncreaseGemsValue,
  reCallCoins,
  setReCallCoins,
  setShouldFetchBalance,
  shouldFetchBalance,
  setReCallCard,
  setIsLoader,
  callBuyHome,
  setCallBuyHome,
  chapterStatus,
  setIsPopupOpenBuy,
  handleBuyGem,
  setInfoCoin,
  setInfoGems,
  newCourseId,
  newChapterId,
}) => {

  const [activeCourseId, setActiveCourseId] = useState(null);
  const [fetchedCourseIds, setFetchedCourseIds] = useState(new Set());
  const [curGems, setCurGems] = useState(null);
  const [curCoins, setCurCoins] = useState(null); // Initially set to null
  const [increase, setIncrease] = useState(false); // State to control the increment
  const [decrease, setDecrease] = useState(false);
  const [increaseGems, setIncreaseGems] = useState(false); // State to control the increment for gems
  const [decreaseGems, setDecreaseGems] = useState(false); // State to control the decrement for gems
  const [gemCount, setGemCount] = useState(1);
  const [initialCoin, setinitialCoin] = useState(0);
  const [initialGems, setinitialGems] = useState(0);
  const [buyMoreGems, setBuyMoreGems] = useState(0);
  const [buyStatus, setBuyStatus] = useState(true);
  const [remainingCoinsStatus, setRemainingCoinsStatus] = useState(0);
  const [balanceDataFetch, setBalanceDataFetch] = useState(0);

  const router = useRouter();
  const handleClosePopup = () => {
    setIsPopupOpenBuy(false);
  };

  useEffect(() => {
    if (coinStatus) {
      setIncrease(increaseValue);
      setDecrease(decreaseValue);
    }
    if (gemStatus) {
      setIncreaseGems(increaseGemsValue);
      setDecreaseGems(decreaseGemsValue);
    }
  }, [
    coinStatus,
    gemStatus,
    increaseValue,
    decreaseValue,
    increaseGemsValue,
    decreaseGemsValue,
  ]);
 useEffect(() => {
     if (balanceData?.data?.cur_coins !== undefined) {
       const review_coin = Number(localStorage.getItem("review"));
       const firstTimeLogin = localStorage.getItem("loginfirstTime");
       const todayLogin = localStorage.getItem("logintodayLogin");
 
       // Start with initial values from balanceData
       let newCoins = Number(balanceData.data.cur_coins);
       let newGems = Number(balanceData.data.cur_gems);
   
       // Calculate new values based on conditions with exact values
       if (review_coin > 0) {
         // For review coins, subtract exact review amount
         newCoins = Math.max(0, Number(balanceData.data.cur_coins) - review_coin);
       } else if(firstTimeLogin) {
         // For first time login, subtract exactly 50
         let valuecheck = Number(balanceData.data.cur_coins) - 50;
         newCoins = Math.max(0, Number(balanceData.data.cur_coins) - 50);
         newGems = Math.max(0, Number(balanceData.data.cur_gems) - 50);
       } else if(todayLogin) {
         // For today's login, subtract exactly 10
         newCoins = Math.max(0, Number(balanceData.data.cur_coins) - 10);
       }
       // Set the calculated values
       setCurCoins(newCoins);
       setinitialCoin(newCoins);
       setCurGems(newGems);
       setinitialGems(newGems);
     }
   }, [balanceData]); // Only depend on balanceData changes

  useEffect(() => {
    let timer;
    localStorage.removeItem("firstTime");
    localStorage.removeItem("todayLogin");
    localStorage.removeItem("storedReviewclaim");
    // localStorage.removeItem("UserLoginvaluedata");
  
    if (increase && curCoins < initialCoin + Number(increase)) {
      timer = setInterval(() => {
        setCurCoins((prevCoins) => Math.min(prevCoins + 1)); 
      }, 10);
    } else {
      clearInterval(timer);
      if (increase) {
        setinitialCoin(initialCoin + Number(increase));
        setIncrease(false);
      }
    }
  
    return () => clearInterval(timer);
  }, [curCoins, increase, initialCoin]);
  useEffect(() => {
    let timer;
    if (decrease && curCoins !== null && curCoins > initialCoin - decrease) {
      timer = setInterval(() => {
        setCurCoins((prevCoins) => Math.max(prevCoins - 1, 0)); // Decrement by 1 but not below 0
      }, 10); // Adjust interval as needed (100ms here)
    } else {
      clearInterval(timer);
      if (decrease) {
        setinitialCoin(initialCoin - decrease);
      } // Stop the timer if conditions are not met // Stop decrementing when 0 is reached or decrease is false
    }
    return () => clearInterval(timer); // Cleanup interval on component unmount
  }, [curCoins, decrease, reCallCoins]); // Only run when curCoins or decrease changes

  useEffect(() => {
    let timer;
    localStorage.removeItem("firstTime");
    localStorage.removeItem("todayLogin");
    if (increaseGems && curGems < initialGems + increaseGems) {
      timer = setInterval(() => {
        setCurGems((prevGems) => Math.min(prevGems + 1)); // Increment by 1 but not above 100
      }, 10); // Adjust interval as needed (100ms here)
    } else {
      clearInterval(timer);
      if (increaseGems) {
        setinitialGems(initialGems + increaseGems);
      } // Stop the timer if conditions are not met // Stop decrementing when 0 is reached or decreaseGems is false
      // setinitialGems(initialGems+increaseGems) // Stop incrementing when 100 is reached or increaseGems is false
    }
    return () => clearInterval(timer); // Cleanup interval on component unmount
  }, [curGems, increaseGems, reCallCoins]);

  // Auto-decrement curGems only if decreaseGems is true and curGems is greater than 0
  useEffect(() => {
    let timer;
    if (decreaseGems && curGems > 0) {
      timer = setInterval(() => {
        setCurGems((prevGems) => Math.max(prevGems - 1, 0)); // Decrement by 1 but not below 0
      }, 10); // Adjust interval as needed (100ms here)
    } else {
      clearInterval(timer); // Stop decrementing when 0 is reached or decreaseGems is false
    }
    return () => clearInterval(timer); // Cleanup interval on component unmount
  }, [curGems, decreaseGems]);

  const handleCardClick = async (
    courseId,
    sectionId,
    message,
    setReCallCard,
    setIsLoader
  ) => {
    setReCallCard((prevValue) => (prevValue == 1 ? 0 : 1));
    setCourseId(courseId);
    if (message && !fetchedCourseIds.has(courseId)) {
      try {
        const response = await axiosInstance.post('studentapis/update_subject_card',
          {
            section_id: sectionId,
            course_id: courseId,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setFetchedCourseIds((prevSet) => new Set(prevSet).add(courseId));
      } catch (error) {
        if (error.response) {
          console.error("API call failed:", error.response.status);
        } else {
          console.error("Error making API call:", error.message);
        }
      } finally {
        setIsLoader(false);
      }
    }
  };

  const handleBuyGemBuy = () => {
    setIsPopupOpenBuy(true); // Open popup
    handleBuyGem(); // Execute the logic passed as a parameter
  };

  const handleProgressBack = () => {
    router.push(
      `student/progresschapter?chapterid=${newChapterId}&courseid=${newCourseId}`
    );
  };

  return (
    <div className="rightSection">
      <div
        className="std-card discovery-card"
        style={{ border: "1px solid #CE9000" }}
      >
        <div
          className="cardimg"
          style={{ border: "1px solid #CE9000", backgroundColor: "#FFF5DD" }}
        >
          <Image src={Coin} alt="Discovery Coins" width={30} height={30} className="responsive-img1"/>
        </div>
        <div className="card-content">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontWeight: "700",
            }}
          >
            <span>Discovery Coins</span>
            <Image
              src={info}
              style={{ cursor: "pointer" }}
              alt="Discovery Coins"
              width={20}
              height={20}
              onClick={() => setInfoCoin(true)}
            />
          </div>

          <p style={{ color: "#CE9000" }}>
            {curCoins !== null ? curCoins : "Loading..."}{" "}
          </p>
        </div>
        <Image src={MtCoins} alt="Multi Coins" className="mlt" />
      </div>
      <div
        className="std-card gems-card"
        style={{ border: "1px solid #00A763" }}
      >
        <div
          className="cardimg"
          style={{ border: "1px solid #00A763", backgroundColor: "#70D8404A" }}
        >
          <Image src={Gems} alt="Gems" width={30} height={30} className="responsive-img1"/>
        </div>
        <div className="card-content">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontWeight: "700",
            }}
          >
            <span>Gems</span>
            <Image
              src={info}
              style={{ cursor: "pointer" }}
              alt="Discovery Coins"
              width={20}
              height={20}
              onClick={() => setInfoGems(true)}
            />
          </div>
          <p style={{ color: "#00A763" }}>
            {curGems !== null ? curGems : "Loading..."}
          </p>
        </div>
        <button className="buy-button" onClick={() => handleBuyGemBuy()}>
          Buy
        </button>
        <Image src={MtGems} alt="Multi Gems" className="mlt" />
      </div>
      <div className="line"></div>
      {subjectData?.data?.map((subject) => (
        <div
          key={subject.course_id}
          className={`std-card ${
            courseIdActive == subject.course_id ? "active" : ""
          }`}
          onClick={() =>
            handleCardClick(
              subject.course_id,
              subject.section_id,
              subject.message,
              setReCallCard,
              setIsLoader
            )
          }
        >
          <div className="cardimg">
            <Image
              src={subject.icon}
              alt={`${subject.subject_name} Icon`}
              width={30}
              height={30}
              className="responsive-img1"
            />
          </div>
          <div className="card-content">
            <span>{subject.subject_name}</span>
            {subject.message && (
              <h4 className="new-label">{subject.message}</h4>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RightSection;
