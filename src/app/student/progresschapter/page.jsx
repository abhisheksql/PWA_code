"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/studentcomponent/Sidebar";
import "../../../../public/style/student.css";
import ProgressChapter from "../../components/studentcomponent/ProgressChapter";
import ProgressRight from "../../components/studentcomponent/ProgressRight";
import axiosInstance from "../../auth";
import { useSearchParams } from "next/navigation";
import Loader from "../../components/studentcomponent/Loader";
import Gem from "../../../../public/images/studentimg/Gems.svg";
import CoinFrame from "../../../../public/images/studentimg/CoinFrame.svg";
import Image from "next/image";
import quizard_full from "../../../../public/images/studentimg/quizard_full.svg";
import gogetter_full from "../../../../public/images/studentimg/gogetter_full.svg";
import mastermarvel_full from "../../../../public/images/studentimg/mastermarvel_full.svg";
import ninja_full from "../../../../public/images/studentimg/ninja_full.svg";
import rockstar_full from "../../../../public/images/studentimg/rockstar_full.svg";
export default function ProgressChpt() {
  const searchParams = useSearchParams();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [increase, setIncrease] = useState(false);
  const [decrease, setDecrease] = useState(false);
  const [activeTab, setActiveTab] = useState("progress");
  const [recallUserApi, setRecallUserApi] = useState(0);
  const [studentId, setStudentid] = useState(0);
  const [reCall, setReCall] = useState(0);
  const [coin, setCoin] = useState(false);
  const [gems, setGems] = useState(false);
  const [shouldFetchBalance, setShouldFetchBalance] = useState(false);
  const [balanceData, setBalanceData] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceError, setBalanceError] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progressChapterData, setProgressChapterData] = useState([]);
  const [progressChapterDataTab, setProgressChapterDataTab] = useState([]);
  const [progressChapterRight, setProgressChapterRight] = useState(true);
  const [increaseGems, setIncreaseGems] = useState(false);
  const [decreaseGems, setDecreaseGems] = useState(false);
  const [reCallCoins, setReCallCoins] = useState(1);
  const [courseId, setCourseId] = useState(0);
  const [chapterId, setChapterId] = useState(0);
  const [testType, setTestType] = useState("");
  const [isPopupOpenBuy, setIsPopupOpenBuy] = useState(false);
  const [buyMoreGems, setBuyMoreGems] = useState(0);
  const [buyStatus, setBuyStatus] = useState(true);
  const [remainingCoinsStatus, setRemainingCoinsStatus] = useState(0);
  const [balanceDataFetch, setBalanceDataFetch] = useState(0);
  const [gemCount, setGemCount] = useState(1);
  const [callBuyHome, setCallBuyHome] = useState(false);
  const [key, setKey] = useState(0);
  const [showBeginner, setShowBeginner] = useState(true);
  const [showProficient, setShowProficient] = useState(true);
  const [showDeveloping, setShowDeveloping] = useState(true);
  const [showList, setShowList] = useState(false);
  const [showKey, setShowKey] = useState(0);
  const [isLoader, setIsLoader] = useState(false);
  const [visibleBadges, setVisibleBadges] = useState([]);
  const [userName, setUserName] = useState("");
  const [tabValue, setTabValue] = useState("readiness");
  const [redirectValue, setRedirectValue] = useState(0);
  const [typeBadgeValue, setTypeBadgeValue] = useState("");
  const [badges, setBadges] = useState(false);
  const [badgesData, setBadgesData] = useState([]);
  const [chapterStatus, setChapterStatus] = useState(0);
  const chapterIdparam = searchParams.get("chapterid");
  const courseIdparam = searchParams.get("courseid");
  const testTypeparam = searchParams.get("test_type");
  const tabTypeparam = searchParams.get("tab");
  const redirectstatusparam = searchParams.get("redirectstatus");
  const typeBadgeparam = searchParams.get("typeBadge");
  useEffect(() => {
    // Set state based on query parameters
    chapterIdparam ? setChapterId(chapterIdparam) : 0;
    courseIdparam ? setCourseId(courseIdparam) : 0;
    testTypeparam ? setTestType(testTypeparam) : "";
    tabTypeparam ? setTabValue(tabTypeparam) : "readiness";
    redirectstatusparam ? setRedirectValue(redirectstatusparam) : 0;
    typeBadgeparam ? setTypeBadgeValue(typeBadgeparam) : "";
  }, [
    chapterIdparam,
    courseIdparam,
    testTypeparam,
    tabTypeparam,
    redirectstatusparam,
    typeBadgeparam,
  ]);

  useEffect(() => {
    // Set state based on query parameters
    if (tabTypeparam == "performance") {
      setProgressChapterRight(false);
    } else {
      setProgressChapterRight(true);
    }
  }, [tabTypeparam]);

  // setProgressChapterRight
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  useEffect(() => {
    // Function to fetch balance data
    const fetchBalance = async () => {
      setBalanceLoading(true); // Start loading
      setBalanceError(null); // Reset error
      try {
        const response = await axiosInstance.get(`studentapis/get_balance`);
        setBalanceData(response.data); // Update with API data
      } catch (error) {
        setBalanceError(error); // Capture error
      } finally {
        setBalanceLoading(false); // Stop loading
      }
    };

    fetchBalance(); // Call the API when the component mounts
  }, [shouldFetchBalance]);

  useEffect(() => {
    const fetchChapterDataTab1 = async () => {
      try {
        const response = await axiosInstance.get(
          `studentapis/get_student_report_data?course_id=${courseId}&chapter_id=${chapterId}`
        );
        const data = response.data;
        setProgressChapterDataTab(data);
      } catch (error) {
        console.error("Error fetching Tab 1 data:", error);
      }
    };

    if (courseId && chapterId) {
      fetchChapterDataTab1();
    }
  }, [chapterId, courseId]); // Dependency array ensures the effect runs when chapterId or courseId changes

  const handleBuyGem = async () => {
    const fetchBalance = async () => {
      try {
        const response = await axiosInstance.get(`studentapis/get_balance`);
        if (response.data.status === "Success") {
          setBalanceDataFetch(response.data.data.cur_coins); // Update with API data
          return response.data.data.cur_coins; // Return the current coins
        }
        return 0; // Default to 0 if status is not success
      } catch (error) {
        console.error("Error fetching balance:", error);
        return 0; // Return 0 on error
      }
    };

    const fetchcoins = await fetchBalance(); // Await the balance fetch
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

    // Example usage:
    const gemCost = 50; // Cost of 1 gem in coins
    const studentBalance = fetchcoins; // Example student balance
    const moreGems = calculateMoreGems(gemCost, studentBalance);
    setBuyMoreGems(moreGems);
    setIsPopupOpenBuy(true);
  };

  const handleGemChange = async (increment) => {
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
      // Example usage:
      const gemCost = 50; // Cost of 1 gem in coins
      const studentBalance = balanceDataFetch; // Example student balance
      const moreGems = calculateMoreGems(gemCost, studentBalance, totalCount);
      setBuyMoreGems(moreGems);
    }
  };

  const handleBuyGemsFromCoins = async () => {
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
      setIsPopupOpenBuy(false);
      setCallBuyHome(false);
      setGemCount(1);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("popup-overlay")) {
      setIsPopupOpenBuy(false);
      setCallBuyHome(false);
      setGemCount(1);
    }
  };

  // API call to get balance
  useEffect(() => {
    const fetchBadge = async () => {
      setLoading(true); // Set loading state
      try {
        const response = await axiosInstance.get(`studentapis/badge_flag`);
        if (response.status == 200) {
          setBadgesData(response.data);
        }
      } catch (err) {
        console.error("API call failed:", err); // Log the error
      } finally {
        setLoading(false); // Reset loading state
      }
    };

    fetchBadge(); // Invoke the function to fetch data
  }, []);

  useEffect(() => {
    if (badgesData?.status == "Success") {
      // Get all badges with flag: true
      setVisibleBadges(badgesData.data.filter((badge) => badge.flag));
    }
  }, [badgesData]);

  // Handle Claim button click (hide the popup)
  const handleClaim = async (
    medalName,
    chapterId,
    count,
    courseId,
    sectionId,
    month,
    studentid,
    year
  ) => {
    setIsLoader(true);
    try {
      const response = await axiosInstance.post(
        `/studentapis/badge_flag_seen`,
        {
          medal_name: medalName,
          student_id: studentid,
          section_id: sectionId,
          course_id: courseId,
          chapter_id: chapterId,
          count: count,
          month: month,
          year: year,
        }
      );
    } catch (error) {
      console.error(
        "Error",
        error.response ? error.response.data : error.message
      );
    } finally {
      setVisibleBadges((prevBadges) =>
        prevBadges.filter((badge) => badge.medal_name !== medalName)
      );
      setIsLoader(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFirstTime = localStorage.getItem("firstTime"); // Store the result as a boolean
      const storedTodayLogin = localStorage.getItem("todayLogin");
      const storedReview = localStorage.getItem("storedReviewclaim");

      // Set the state based on the conditions
      if (storedFirstTime || storedTodayLogin || storedReview) {
        setCoin(true);
        setDecrease(false);
        setShouldFetchBalance((prevCoin) => (prevCoin === 1 ? 0 : 1));
        if (storedFirstTime) {
          setIncrease(50);
        } else if (storedTodayLogin) {
          setIncrease(10);
        }

        if (storedReview) {
          setIncrease(storedReview);
        }

        if (storedFirstTime) {
          setGems(true);
          setIncreaseGems(50);
        } else {
          setGems(false);
          setIncreaseGems(0);
          setDecreaseGems(0);
        }
      } else {
        setGems(false);
        setCoin(false);
        setIncrease(0);
        setDecrease(0);
        setIncreaseGems(0);
        setDecreaseGems(0);
        setShouldFetchBalance((prevCoin) => (prevCoin === 1 ? 0 : 1));
      }
    }
  }, [reCall]); // This effect should run only once on mount (when the component is loaded)

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
        {progressChapterDataTab &&
        progressChapterDataTab.status == "Success" ? (
          <ProgressChapter
            progressChapterData={progressChapterData}
            progressChapterDataTab={progressChapterDataTab}
            setProgressChapterRight={setProgressChapterRight}
            testType={testType}
            chapterId={chapterId}
            courseId={courseId}
            balanceData={balanceData}
            showBeginner={showBeginner}
            setShowBeginner={setShowBeginner}
            showProficient={showProficient}
            setShowProficient={setShowProficient}
            showDeveloping={showDeveloping}
            setShowDeveloping={setShowDeveloping}
            showList={showList}
            setShowList={setShowList}
            progressChapterRight={progressChapterRight}
            showKey={showKey}
            setShowKey={setShowKey}
            tabValue={tabValue}
            setCallBuyHome={setCallBuyHome}
            handleBuyGem={handleBuyGem}
            setReCall={setReCall}
            redirectValue={redirectValue}
            typeBadgeValue={typeBadgeValue}
          />
        ) : (
          <Loader />
        )}
        <ProgressRight
          progressChapterData={progressChapterData}
          progressChapterDataTab={progressChapterDataTab}
          progressChapterRight={progressChapterRight}
          chapterId={chapterId}
          courseId={courseId}
          showBeginner={showBeginner}
          setShowBeginner={setShowBeginner}
          showProficient={showProficient}
          setShowProficient={setShowProficient}
          showDeveloping={showDeveloping}
          setShowDeveloping={setShowDeveloping}
          setShowList={setShowList}
          showKey={showKey}
          setShowKey={setShowKey}
        />

        {(isPopupOpenBuy || callBuyHome) && (
          <div className="popup-overlay" onClick={handleOverlayClick}>
            <div className="popup-box">
              <div className="popup-header buygem">
                <h2>Cost of a Gem</h2>
                <div className="gem-cost-section">
                  <span className="gem-info">
                    <Image src={Gem} alt="Gem" width={35} height={35} />
                    <span className="text">1 gem</span>
                  </span>
                  <span className="equals">=</span>
                  <span className="coin-info">
                    <Image src={CoinFrame} alt="Coins" width={50} height={50} />
                    <span className="text">50 coins</span>
                  </span>
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

        {visibleBadges.map((badge, index) => (
          <div className="modal-overlay" key={index}>
            <div className="modal-content">
              <div className="modal-body">
                <h2>Congratulations!</h2>
                <Image
                  src={
                    badge.medal_name == "book"
                      ? quizard_full
                      : badge.medal_name == "go"
                      ? gogetter_full
                      : badge.medal_name == "rockstar"
                      ? rockstar_full
                      : badge.medal_name == "marvel"
                      ? mastermarvel_full
                      : badge.medal_name == "ninja"
                      ? ninja_full
                      : ""
                  }
                  alt="Badge Popup"
                  className="popup-img"
                />
                <h3 className="modal-badge-title">
                  {badge.medal_name == "book"
                    ? "Quizard"
                    : badge.medal_name == "go"
                    ? "Go Getter"
                    : badge.medal_name == "rockstar"
                    ? "Rockstar"
                    : badge.medal_name == "marvel"
                    ? "Master Marvel"
                    : badge.medal_name == "ninja"
                    ? "Review Ninja"
                    : ""}
                </h3>
                <p className="modal-badge-description">
                  {badge.medal_name == "book"
                    ? "Great! You have completed a total of 50 quizzes."
                    : badge.medal_name == "go"
                    ? "Wonderful! You have earned 1500 coins this month."
                    : badge.medal_name == "rockstar"
                    ? `Yay! You have completed all the quizzes of ${badge.chapter_name}.`
                    : badge.medal_name == "marvel"
                    ? `Superb! You are proficient in ${badge.chapter_name}.`
                    : badge.medal_name == "ninja"
                    ? `Awesome! You have reviewed all your quizzes of ${badge.chapter_name}.`
                    : ""}
                </p>
                <button
                  className="claim-btn"
                  onClick={() =>
                    handleClaim(
                      badge.medal_name,
                      badge.chapter_id,
                      badge.count,
                      badge.course_id,
                      badge.section_id,
                      badge.month,
                      badge.student_id,
                      badge.year
                    )
                  }
                >
                  Claim
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
