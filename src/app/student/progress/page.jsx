"use client";
import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../../components/studentcomponent/Sidebar";
import "../../../../public/style/student.css";
import Progress from "../../components/studentcomponent/Progress";
import RightSection from "../../components/studentcomponent/RightSection";
import axiosInstance from "../../auth";
import Loader from "../../components/studentcomponent/Loader";
import Gem from "../../../../public/images/studentimg/Gems.svg";
import CoinFrame from "../../../../public/images/studentimg/CoinFrame.svg";
import Image from "next/image";
import Coin from "../../../../public/images/studentimg/Coin.svg";
import Gems from "../../../../public/images/studentimg/Gems.svg";
import RightArrow from "../../../../public/images/studentimg/RightArrow.svg";
import { useSearchParams } from "next/navigation";

export default function StudentWeb() {
  const searchParams = useSearchParams();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [increase, setIncrease] = useState(false);
  const [decrease, setDecrease] = useState(false);
  const [activeTab, setActiveTab] = useState("progress");
  const [coin, setCoin] = useState(false);
  const [gems, setGems] = useState(false);
  const [increaseGems, setIncreaseGems] = useState(false);
  const [decreaseGems, setDecreaseGems] = useState(false);
  const [shouldFetchBalance, setShouldFetchBalance] = useState(false);
  const [balanceData, setBalanceData] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceError, setBalanceError] = useState(null);
  const [cardLoading, setCardLoading] = useState(false);
  const [subjectData, setSubjectData] = useState([]);
  const [courseId, setCourseId] = useState(0);
  const [progressData, setProgressData] = useState([]);
  const [reCallCoins, setReCallCoins] = useState(1);
  const [isLoader, setIsLoader] = useState(false);
  const [isPopupOpenBuy, setIsPopupOpenBuy] = useState(false);
  const [buyMoreGems, setBuyMoreGems] = useState(0);
  const [buyStatus, setBuyStatus] = useState(true);
  const [remainingCoinsStatus, setRemainingCoinsStatus] = useState(0);
  const [balanceDataFetch, setBalanceDataFetch] = useState(0);
  const [gemCount, setGemCount] = useState(1);
  const [callBuyHome, setCallBuyHome] = useState(false);
  const [key, setKey] = useState(0);
  const [recallUserApi, setRecallUserApi] = useState(0);
  const [studentId, setStudentid] = useState(0);
  const [infoCoin, setInfoCoin] = useState(false);
  const [infoGems, setInfoGems] = useState(false);
  const [userName, setUserName] = useState("");
  const [reCallCard, setReCallCard] = useState(1);
  const [chapterStatus, setChapterStatus] = useState(0);
  const [newCourseId, setNewCourseId] = useState(0);
  const [chapterId, setChapterId] = useState(0);
  const buyPopupRef = useRef(null);
  const infoCoinPopupRef = useRef(null);
  const infoGemsPopupRef = useRef(null);
  const chapterIdparam = searchParams.get("chapterid");
  const courseIdparam = searchParams.get("courseid");

  useEffect(() => {
    chapterIdparam ? setChapterId(chapterIdparam) : 0;
    courseIdparam ? setNewCourseId(courseIdparam) : 0;
  }, [chapterIdparam, courseIdparam]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  useEffect(() => {
    const fetchBalance = async () => {
      setBalanceLoading(true);
      setBalanceError(null);
      try {
        const response = await axiosInstance.get(`studentapis/get_balance`);
        setBalanceData(response.data);
      } catch (error) {
        setBalanceError(error);
      } finally {
        setBalanceLoading(false);
      }
    };

    fetchBalance();
  }, [shouldFetchBalance]);

  useEffect(() => {
    const fetchSubjectCard = async () => {
      setCardLoading(true);
      try {
        const response = await axiosInstance.get(
          `studentapis/get_subject_card`
        );
        setSubjectData(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setCardLoading(false);
      }
    };

    fetchSubjectCard();
  }, [reCallCard]);

  useEffect(() => {
    if (subjectData && subjectData.data && subjectData.data.length > 0) {
      const firstSubject = subjectData.data[0];
      if (firstSubject.course_id && courseId < 1) {
        setCourseId(firstSubject.course_id);
      }
    }
  }, [subjectData]);

  useEffect(() => {
    if (newCourseId) {
      setCourseId(newCourseId);
    }
  }, [newCourseId]);

  useEffect(() => {
    setIsLoader(true);
    const fetchProgress = async () => {
      setCardLoading(true);
      try {
        const response = await axiosInstance.get(
          `studentapis/get_progress_data?course_id=${courseId}`
        );
        setProgressData(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setCardLoading(false);
        setIsLoader(false);
      }
    };

    if (courseId > 0) {
      fetchProgress();
    }
  }, [courseId]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isPopupOpenBuy &&
        buyPopupRef.current &&
        !buyPopupRef.current.contains(event.target)
      ) {
        setIsPopupOpenBuy(false);
        setCallBuyHome(false);
        setGemCount(1);
      }

      if (
        infoCoin &&
        infoCoinPopupRef.current &&
        !infoCoinPopupRef.current.contains(event.target)
      ) {
        setInfoCoin(false);
      }

      if (
        infoGems &&
        infoGemsPopupRef.current &&
        !infoGemsPopupRef.current.contains(event.target)
      ) {
        setInfoGems(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupOpenBuy, infoCoin, infoGems]);

  const handleBuyGem = async () => {
    const fetchBalance = async () => {
      try {
        const response = await axiosInstance.get(`studentapis/get_balance`);
        if (response.data.status === "Success") {
          setBalanceDataFetch(response.data.data.cur_coins);
          return response.data.data.cur_coins;
        }
        return 0;
      } catch (error) {
        console.error("Error fetching balance:", error);
        return 0;
      }
    };

    const fetchcoins = await fetchBalance();
    let show_msg = true;
    if (fetchcoins >= 50) {
      show_msg = true;
    } else {
      show_msg = false;
    }
    setBuyStatus(show_msg);
    const calculateMoreGems = (gemCost, studentBalance) => {
      const remainingCoins = Math.abs(gemCost * 1 - studentBalance);
      setRemainingCoinsStatus(remainingCoins);
      let moreGems = 0;
      if (remainingCoins >= gemCost) {
        moreGems = Math.floor(remainingCoins / gemCost);
      }
      return moreGems;
    };
    const gemCost = 50;
    const studentBalance = fetchcoins;
    const moreGems = calculateMoreGems(gemCost, studentBalance);
    setBuyMoreGems(moreGems);
    setIsPopupOpenBuy(true);
  };

  const handleGemChange = (increment) => {
    if (gemCount + increment >= 1) {
      let totalCount = gemCount + increment;
      setGemCount(gemCount + increment);
      let show_msg = true;
      let count_val = (gemCount + increment) * 50;
      if (balanceDataFetch >= count_val) {
        show_msg = true;
      } else {
        show_msg = false;
      }
      setBuyStatus(show_msg);
      const calculateMoreGems = (gemCost, studentBalance, totalCount) => {
        const remainingCoins = Math.abs(gemCost * totalCount - studentBalance);
        setRemainingCoinsStatus(remainingCoins);
        let moreGems = 0;
        if (remainingCoins >= gemCost) {
          moreGems = Math.floor(remainingCoins / gemCost);
        }
        return moreGems;
      };
      const gemCost = 50;
      const studentBalance = balanceDataFetch;

      const moreGems = calculateMoreGems(gemCost, studentBalance, totalCount);
      setBuyMoreGems(moreGems);
    }
  };

  const handleBuyGemsFromCoins = async () => {
    setIsLoader(true);
    try {
      const response = await axiosInstance.get(
        `/studentapis/convert_coin_to_gems?gem_count=${gemCount}`
      );
      setIsPopupOpenBuy(false);
      setCoin(true);
      setGems(true);
      setDecrease(gemCount * 50);
      setIncreaseGems(gemCount);
      setIncrease(false);
      setReCallCoins((prevCoin) => (prevCoin === 1 ? 0 : 1));
      setShouldFetchBalance((prevCoin) => (prevCoin === 1 ? 0 : 1));
      return response.data;
    } catch (error) {
      setIsPopupOpenBuy(false);
      console.error(
        "Error converting coins to gems:",
        error.response ? error.response.data : error.message
      );
      throw error;
    } finally {
      setIsLoader(false);
      setIsPopupOpenBuy(false);
      setCallBuyHome(false);
      setGemCount(1);
    }
  };

  return (
    <div className="student_container">
      <Sidebar
      keyvalue={balanceData?.data?.cur_coins}
        isCollapsed={isSidebarCollapsed}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        toggleSidebar={toggleSidebar}
        balanceData={balanceData}
        coinStatus={coin}
        gemStatus={gems}
        increaseValue={increase}
        decreaseValue={decrease}
        increaseGemsValue={increaseGems}
        decreaseGemsValue={decreaseGems}
        setCoin={setCoin}
        setGems={setGems}
        setDecreaseValue={setDecrease}
        setIncreaseGemsValue={setIncreaseGems}
        reCallCoins={reCallCoins}
        setReCallCoins={setReCallCoins}
        setShouldFetchBalance={setShouldFetchBalance}
        shouldFetchBalance={shouldFetchBalance}
        setIsLoader={setIsLoader}
        setIsPopupOpenBuy={setIsPopupOpenBuy}
        handleBuyGem={handleBuyGem}
        setKey={setKey}
        setUserName={setUserName}
        setChapterStatus={setChapterStatus}
        recallUserApi={recallUserApi}
        setStudentid={setStudentid}
        courseIdActive={courseId}
      />

      <div
        className={`main-right-container ${
          isSidebarCollapsed ? "collapsed" : ""
        }`}
      >
        {activeTab == "progress" &&
        progressData &&
        progressData.status == "Success" ? (
          <Progress progressData={progressData} courseId={courseId} />
        ) : (
          ""
        )}
        {subjectData.status == "Success" && (
          <RightSection
          keyvalue={balanceData?.data?.cur_coins}
            activeTab={activeTab}
            balanceData={balanceData}
            subjectData={subjectData}
            setCourseId={setCourseId}
            coinStatus={coin}
            gemStatus={gems}
            increaseValue={increase}
            decreaseValue={decrease}
            courseIdActive={courseId}
            increaseGemsValue={increaseGems}
            decreaseGemsValue={decreaseGems}
            setCoin={setCoin}
            setGems={setGems}
            setDecreaseValue={setDecrease}
            setIncreaseGemsValue={setIncreaseGems}
            reCallCoins={reCallCoins}
            setReCallCoins={setReCallCoins}
            setShouldFetchBalance={setShouldFetchBalance}
            shouldFetchBalance={shouldFetchBalance}
            setReCallCard={setReCallCard}
            setIsLoader={setIsLoader}
            callBuyHome={callBuyHome}
            setCallBuyHome={setCallBuyHome}
            chapterStatus={chapterStatus}
            setIsPopupOpenBuy={setIsPopupOpenBuy}
            handleBuyGem={handleBuyGem}
            setInfoCoin={setInfoCoin}
            setInfoGems={setInfoGems}
          />
        )}
        {isLoader ? <Loader /> : ""}
      </div>
      {isPopupOpenBuy && (
        <div className="popup-overlay">
          <div className="popup-box" ref={buyPopupRef}>
            <div className="popup-header buygem">
              <h2>Cost of a Gem</h2>
              <div className="gem-cost-section">
                <div className="gem-info">
                  <Image src={Gem} alt="Gem" width={35} height={35} />
                  <span className="text">1 gem</span>
                </div>
                <div className="equals">=</div>
                <div className="coin-info">
                  <Image src={CoinFrame} alt="Coins" width={50} height={50} />
                  <span className="text">50 coins</span>
                </div>
              </div>
            </div>
            <div className="popup-body" style={{ margin: "20px 0px" }}>
              <div className="gem-purchase-section">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                    paddingBottom: "20px",
                    borderBottom: "1px solid #EDEDED",
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "18px",
                      fontWeight: "800",
                      color: "#5E5E5E",
                    }}
                  >
                    <Image src={Gem} alt="Gems" width={30} height={30} />
                    Buy gem(s)
                  </label>
                  <div className="gem-counter">
                    <button onClick={() => handleGemChange(-1)}>-</button>
                    <span>{gemCount}</span>
                    <button onClick={() => handleGemChange(1)}>+</button>
                  </div>
                </div>
                {buyStatus ? (
                  <>
                    <p
                      style={{
                        color: "#383838",
                        fontSize: "13px",
                        fontWeight: "700",
                        marginBottom: "10px",
                      }}
                    >
                      The cost of these {gemCount} gems equals {gemCount * 50}{" "}
                      discovery points.
                    </p>
                    <p style={{ color: "#949494", fontSize: "14px" }}>
                      You can buy {buyMoreGems} more gem(s) with the remaining
                      discovery coins.
                    </p>
                  </>
                ) : (
                  <>
                    <p
                      style={{
                        color: "#FD6845",
                        fontSize: "13px",
                        fontWeight: "700",
                        marginBottom: "10px",
                      }}
                    >
                      Not enough discovery coins available.
                    </p>
                    <p style={{ color: "#FD6845", fontSize: "14px" }}>
                      You need {remainingCoinsStatus} more discovery coins to
                      buy {gemCount} gem.
                    </p>
                  </>
                )}
              </div>
              <div className="quick-purchase-buttons">
                {[5, 10, 20, 25].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setGemCount(amount);
                      handleGemChange(amount);
                    }}
                  >
                    <Image src={Gem} alt="Gems" width={20} height={20} />+
                    {amount}
                  </button>
                ))}
              </div>
            </div>
            <div className="popup-footer">
              <button
                className="understood-btn"
                disabled={!buyStatus}
                onClick={handleBuyGemsFromCoins}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}

      {infoCoin && (
        <div className="popup-overlay">
          <div
            className="popup-box bg-gradian backgroundImage2"
            ref={infoCoinPopupRef}
          >
            <div className="popup-header">
              <h2 style={{ color: "#CE9000" }}> Discovery Coins</h2>
            </div>
            <div
              className="rewards-container"
              style={{ width: "70%", minHeight: "150px" }}
            >
              <div className="coin-reward-item">
                <Image
                  src={Coin}
                  alt="Coins Icon"
                  width={80}
                  height={80}
                  style={{ maxHeight: "100px", maxWidth: "100px" }}
                />
              </div>
            </div>
            <div className="popup-content" style={{ marginTop: "20px" }}>
              <p style={{ fontSize: "14px", fontWeight: "700" }}>
                You can earn these by completing quizzes, levelling up your
                concepts, and reviewing your attempts.
              </p>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#CE9000",
                  margin: "20px 0",
                }}
              >
                The more you explore, the more coins you collect!
              </p>
            </div>
            <div className="popup-footer">
              <button
                className="circular-button-coin"
                onClick={() => setInfoCoin(false)}
              >
                <Image
                  src={RightArrow}
                  alt="Coins Icon"
                  width={40}
                  height={40}
                />
              </button>
            </div>
          </div>
        </div>
      )}
      {infoGems && (
        <div className="popup-overlay">
          <div
            className="popup-box bg-gradian backgroundImage3"
            ref={infoGemsPopupRef}
          >
            <div className="popup-header">
              <h2 style={{ color: "#00A763" }}>Gems</h2>
            </div>
            <div
              className="rewards-container"
              style={{ width: "70%", minHeight: "150px" }}
            >
              <div className="gems-reward-item">
                <Image
                  src={Gems}
                  alt="Gems Icon"
                  width={80}
                  height={80}
                  style={{ maxHeight: "100px", maxWidth: "100px" }}
                />
              </div>
            </div>
            <div className="popup-content" style={{ marginTop: "20px" }}>
              <p style={{ fontSize: "14px", fontWeight: "700" }}>
                You spend these to take on chapter quizzes like Readiness,
                Quests, and Milestones.
              </p>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#00A763",
                  margin: "20px 0",
                }}
              >
                You can buy more gems using discovery coins.
              </p>
            </div>
            <div className="popup-footer">
              <button
                className="circular-button-gems"
                onClick={() => {
                  setInfoGems(false);
                }}
              >
                <Image
                  src={RightArrow}
                  alt="Coins Icon"
                  width={40}
                  height={40}
                />{" "}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
