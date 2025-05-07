"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../components/studentcomponent/Sidebar";
import MainContent from "../components/studentcomponent/MainContent";
import RightSection from "../components/studentcomponent/RightSection";
import HomeAssignedChapter from "../components/studentcomponent/HomeAssignedChapter";
import axiosInstance from "../auth";
import Loader from "../components/studentcomponent/Loader";
import { useSearchParams } from "next/navigation";
import Gem from "../../../public/images/studentimg/Gems.svg";
import CoinFrame from "../../../public/images/studentimg/CoinFrame.svg";
import Image from "next/image";
import Coin from "../../../public/images/studentimg/Coin.svg";
import Gems from "../../../public/images/studentimg/Gems.svg";
import quizard_full from "../../../public/images/studentimg/quizard_full.svg";
import gogetter_full from "../../../public/images/studentimg/gogetter_full.svg";
import mastermarvel_full from "../../../public/images/studentimg/mastermarvel_full.svg";
import ninja_full from "../../../public/images/studentimg/ninja_full.svg";
import rockstar_full from "../../../public/images/studentimg/rockstar_full.svg";
import Right from "../../../public/images/studentimg/RightArrow.svg";
export default function StudentWeb() {
  const searchParams = useSearchParams();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [recallUserApi, setRecallUserApi] = useState(0);
  const [courseId, setCourseId] = useState(0);
  const [shouldFetchBalance, setShouldFetchBalance] = useState(1);
  const [reCall, setReCall] = useState(0);
  const [coin, setCoin] = useState(false);
  const [gems, setGems] = useState(false);
  const [increase, setIncrease] = useState(0);
  const [decrease, setDecrease] = useState(0);
  const [increaseGems, setIncreaseGems] = useState(false);
  const [decreaseGems, setDecreaseGems] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [isLoader, setIsLoader] = useState(false);
  const [UserLoginvalue, setUserLoginvalue] = useState([]);
  const [balanceData, setBalanceData] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [cardLoading, setCardLoading] = useState(false);
  const [balanceError, setBalanceError] = useState(null);
  const [subjectData, setSubjectData] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loginCall, setLoginCall] = useState(0);
  const [reCallCoins, setReCallCoins] = useState(1);
  const [reCallCard, setReCallCard] = useState(1);
  const [callBuyHome, setCallBuyHome] = useState(false);
  const [newChapterId, setNewChapterId] = useState(0);
  const [chapterStatus, setChapterStatus] = useState(0);
  const [newCourseId, setNewCourseId] = useState(0);
  const [isPopupOpenBuy, setIsPopupOpenBuy] = useState(false);
  const [buyMoreGems, setBuyMoreGems] = useState(0);
  const [buyStatus, setBuyStatus] = useState(true);
  const [remainingCoinsStatus, setRemainingCoinsStatus] = useState(0);
  const [balanceDataFetch, setBalanceDataFetch] = useState(0);
  const [gemCount, setGemCount] = useState(1);
  const [infoCoin, setInfoCoin] = useState(false);
  const [infoGems, setInfoGems] = useState(false);
  const [userName, setUserName] = useState("");
  const [welcomeBackPopup, setWelcomeBackPopup] = useState(false);
  const [welcomePopup, setWelcomePopup] = useState(false);
  const [discoveryCoinsPopup, setDiscoveryCoinsPopup] = useState(false);
  const [discoveryGemsPopup, setDiscoveryGemsPopup] = useState(false);
  const [visibleBadges, setVisibleBadges] = useState([]);
  const [studentId, setStudentid] = useState(0);
  const [badgesData, setBadgesData] = useState([]);
  const chapterIdparam = searchParams.get("chapterId");
  const courseIdparam = searchParams.get("courseId");
  const statusparam = searchParams.get("status");
  const [key, setKey] = useState(0);

  useEffect(() => {
    chapterIdparam ? setNewChapterId(chapterIdparam) : 0;
    courseIdparam ? setNewCourseId(courseIdparam) : 0;
    statusparam ? setChapterStatus(statusparam) : 0;
  }, [chapterIdparam, courseIdparam, statusparam]);

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };


//   useEffect(() => {
//     localStorage.removeItem("logintodayLogin");
//       localStorage.removeItem("loginfirstTime");
//   const fetchData = async () => {      
//     setLoading(true);
//     try {
//       // First API call - gaming_login
//       const response = await axiosInstance.get(`studentapis/gamification_login`);
      
//       if (response.status === 201) {
//         setUserLoginvalue(response.data);
        
//         // After successful login, fetch balance
//         setBalanceLoading(true);
//         try {
//           const balanceResponse = await axiosInstance.get(`studentapis/get_balance`);
//           setBalanceData(balanceResponse.data);
//         } catch (error) {
//           setBalanceError(error);
//         } finally {
//           setBalanceLoading(false);
//         }
//       }

//       // Handle login flags
//       if (response.data.data && 
//          (response.data.data.today_login_flag === true || 
//           response.data.data.first_time === true)) {
//         localStorage.setItem("UserLoginvaluedata", JSON.stringify(response.data));
//       }
//     } catch (err) {
//       console.error("API call failed:", err);
//     } finally {
//       setLoading(false);
//       // setBalanceDataFetch(prev => prev === 0 ? 1 : 0);
//       setLoginCall(prev => prev === 0 ? 1 : 0);
//     }
//   };

//   fetchData();
// }, []); // Empty dependency array since this should only run once on mount

  useEffect(() => {
    localStorage.removeItem("logintodayLogin");
      localStorage.removeItem("loginfirstTime");
      localStorage.removeItem("UserLoginvaluedata");
    const fetchData = async () => {      
      setLoading(true); // Set loading state
      try {
        const response = await axiosInstance.get(
          `studentapis/gamification_login`
        );
        const storedLoginData = JSON.parse(
          localStorage.getItem("UserLoginvaluedata")
        );

        if (response.status == 201) {
          setUserLoginvalue(response.data);
        }
        if (
          response.data.data &&
          (response.data.data.today_login_flag == true ||
            response.data.data.first_time == true)
        ) {
          localStorage.setItem(
            "UserLoginvaluedata",
            JSON.stringify(response.data)
          );
        } // Store the API response data
      } catch (err) {
        console.error("API call failed:", err); // Log the error
      } finally {
        setLoading(false); // Reset loading state
        setBalanceDataFetch((prevState) => (prevState === 0 ? 1 : 0));
        setLoginCall((prevState) => (prevState === 0 ? 1 : 0));
      }
    };
    fetchData(); // Invoke the function to fetch data
  }, []);

  

  useEffect(() => {
    const fetchSubjectCard = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axiosInstance.get(
          `studentapis/get_subject_card`
        );
        setSubjectData(response.data); // Update with API data
      } catch (error) {
        console.log(error);
      } finally {
        setCardLoading(false); // Stop loading
      }
    };
    fetchSubjectCard(); // Call the API when the component mounts
  }, [reCallCard, key]);

  useEffect(() => {
    if (subjectData && subjectData.data && subjectData.data.length > 0) {
      // Example logic: setting courseId based on the first item in subjectData
      const firstSubject = subjectData.data[0];
      if (firstSubject.course_id && courseId < 1) {
        setCourseId(firstSubject.course_id);
      }
    }
  }, [subjectData, key]);

  useEffect(() => {
    if (newCourseId) {
      setCourseId(newCourseId);
    }
  }, [newCourseId]);

  useEffect(() => {
    // Function to fetch balance data
    const fetchHomeData = async () => {
      setCardLoading(true); // Start loading
      try {
        let apiurl;
        if (chapterStatus == 1) {
          setCourseId(newCourseId);
          // apiurl = `studentapis/get_home_data?course_id=${newCourseId}&chapter_id=${newChapterId}`;
          apiurl = `studentapis/get_home_data?course_id=${newCourseId}`;
        } else {
          apiurl = `studentapis/get_home_data?course_id=${courseId}`;
        }
        const response = await axiosInstance.get(apiurl);
        setData(response.data); // Update with API data
      } catch (error) {
        console.log(error);
      } finally {
        setCardLoading(false); // Stop loading
      }
    };

    if (courseId > 0) {
      fetchHomeData();
    } // Call the API when the component mounts
  }, [courseId, newChapterId, chapterStatus, newCourseId, key]);


  
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

  useEffect(() => {
    // Function to fetch balance data
    const fetchBalance = async () => {
      setBalanceLoading(true); // Start loading
      setBalanceError(null); // Reset error
      try {
        // await new Promise(resolve => setTimeout(resolve, 300));
        const response = await axiosInstance.get(`studentapis/get_balance`);
        setBalanceData(response.data); // Update with API data
      } catch (error) {
        setBalanceError(error); // Capture error
      } finally {
        setBalanceLoading(false); // Stop loading
        // setIsLoader(false);
      }
    };
    fetchBalance(); // Call the API when the component mounts
  }, [shouldFetchBalance]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFirstTime = localStorage.getItem("firstTime"); // Store the result as a boolean
      const storedTodayLogin = localStorage.getItem("todayLogin");
      const storedReview = localStorage.getItem("storedReviewclaim");

      // Set the state based on the conditions
      if (storedFirstTime || storedTodayLogin || storedReview) {
        setCoin(true);
        setDecrease(false);
        // setShouldFetchBalance((prevCoin) => (prevCoin === 1 ? 0 : 1));
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
        // setShouldFetchBalance((prevCoin) => (prevCoin === 1 ? 0 : 1));
      }
    }
  }, [reCall]); // This effect should run only once on mount (when the component is loaded)

  if (UserLoginvalue.status == "Success") {
    localStorage.setItem("user_id", UserLoginvalue.data.student_id);
  }

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
    // Show the popup after fetching the balance
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

      const gemCost = 50; // Cost of 1 gem in coins
      const studentBalance = balanceDataFetch; // Example student balance
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

  const handleOverlayClick = (e) => {
    if (
      e.target.classList.contains("popup-overlay") ||
      e.target.classList.contains("modal-overlay")
    ) {
      setIsPopupOpenBuy(false);
      setCallBuyHome(false);
      setGemCount(1);
      setDiscoveryCoinsPopup(false);
      setDiscoveryGemsPopup(false);
      setInfoCoin(false);
      setInfoGems(false);
      // setWelcomeBackPopup(false);
      // setWelcomePopup(false);

      // For badge popups, we need to handle them differently
      // Instead of closing all badges at once, we'll only close the one that was clicked
      if (e.target.classList.contains("modal-overlay")) {
        const badgeIndex = visibleBadges.findIndex((badge, idx) =>
          e.target
            .closest(".modal-overlay")
            .contains(document.querySelectorAll(".modal-overlay")[idx])
        );

        if (badgeIndex !== -1) {
          const badgeToRemove = visibleBadges[badgeIndex];
          handleClaim(
            badgeToRemove.medal_name,
            badgeToRemove.chapter_id,
            badgeToRemove.count,
            badgeToRemove.course_id,
            badgeToRemove.section_id,
            badgeToRemove.month,
            badgeToRemove.student_id,
            badgeToRemove.year
          );
        }
      }
    }
  };

  useEffect(() => {
    let firstTime = false;
    let todayLogin = false;
    const storedData1 = localStorage.getItem("UserLoginvaluedata");
    if (storedData1) {
      const storedDatauserLoginData = JSON.parse(storedData1);

      if (storedDatauserLoginData) {
        firstTime = storedDatauserLoginData.data?.first_time;
        todayLogin = storedDatauserLoginData.data?.today_login_flag;
      }

      if (firstTime == true) {
        const loginfirstTime = localStorage.setItem("loginfirstTime",firstTime);
        console.log("firstTime", '1111');
        setWelcomePopup(true);
      } else if (todayLogin == true) {
        console.log("firstTime", '22222');
        const logintodayLogin = localStorage.setItem("logintodayLogin",todayLogin);
        setWelcomeBackPopup(true);
      } else {
        console.log("No login data found in localStorage.");
      }
    }
  }, [loginCall]);

  const handleLoginClick = (value) => {
    if (value == "firsttime") {
      localStorage.setItem("firstTime", true);
    } else if (value == "todaylogin") {
      localStorage.setItem("todayLogin", true);
    }
    setReCall((prevState) => (prevState === 0 ? 1 : 0));
  };


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

  const handleWelcomeBackLogin = () => {
    handleLoginClick("todaylogin");
    setWelcomeBackPopup(false);
    localStorage.removeItem("logintodayLogin");
    localStorage.removeItem("loginfirstTime");
    localStorage.removeItem("UserLoginvaluedata");
  };
  const handleWelcomeLogin = () => {
      setWelcomePopup(false);
      setDiscoveryCoinsPopup(true);
      localStorage.removeItem("logintodayLogin");
      localStorage.removeItem("loginfirstTime");
      localStorage.removeItem("UserLoginvaluedata");
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
        <>
          {/* activeTab == "home" && */}
          {data && data.status == "Success" && data.data.default == true ? (
            <MainContent />
          ) : (
            <HomeAssignedChapter            
              chapterData={data}
              balanceData={balanceData}
              userLoginData={UserLoginvalue}
              setReCall={setReCall}
              LoginCall={setLoginCall}
              loginCall={loginCall}
              setIsLoader={setIsLoader}
              isLoader={isLoader}
              setCallBuyHome={setCallBuyHome}
              newChapterId={newChapterId}
              userName={userName}
              chapterStatus={chapterStatus}
              handleBuyGem={handleBuyGem}
              reCallCard={reCallCard}
            />
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
              newCourseId={newCourseId}
              newChapterId={newChapterId}
            />
           )} 
        </>
      </div>

      {isLoader ? <Loader /> : ""}

      {cardLoading ? <Loader /> : ""}
      {(isPopupOpenBuy || callBuyHome) && (
        <div className="popup-overlay" onClick={handleOverlayClick}>
          <div className="popup-box">
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
        <div className="popup-overlay" onClick={handleOverlayClick}>
          <div
            className="popup-box bg-gradian backgroundImage2"
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
                <Image src={Right} alt="Coins Icon" width={40} height={40} />
              </button>
            </div>
          </div>
        </div>
      )}
      {infoGems && (
        <div className="popup-overlay" onClick={handleOverlayClick}>
          <div
            className="popup-box bg-gradian backgroundImage3"
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
                <Image src={Right} alt="Coins Icon" width={40} height={40} />{" "}
              </button>
            </div>
          </div>
        </div>
      )}

      {welcomeBackPopup && (
        <div className="popup-overlay" onClick={handleOverlayClick}>
          <div
            className="popup-box bg-gradian backgroundImage2"
          >
            <div className="popup-header">
              <h2 style={{ color: "#CE9000" }}> Welcome back, {userName}</h2>
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
                <span>+10 Coins</span>
              </div>
            </div>
            <div className="popup-content" style={{ margin: "40px 0px" }}>
              <p style={{ fontSize: "18px", fontWeight: "700" }}>
                You’ve earned 10 discovery coins.
              </p>
            </div>
            <div className="popup-footer">
              <button
                className="circular-button-coin"
                onClick={() => handleWelcomeBackLogin()}

              >
                <Image src={Right} alt="Coins Icon" width={40} height={40} />
              </button>
            </div>
          </div>
        </div>
      )}

      {welcomePopup && (
        <div className="popup-overlay" onClick={handleOverlayClick}>
          <div
            className="popup-box bg-gradian backgroundImage1"
          >
            <div className="popup-header">
              <h2>Welcome to AcadAlly!</h2>
            </div>
            <div className="popup-content" style={{ marginTop: "20px" }}>
              <p>
                For hopping on, you have earned 50 discovery coins and 50
                gems.
              </p>
            </div>
            <div className="rewards-container">
              <div className="coin-reward-item">
                <Image src={Coin} alt="Coins Icon" width={50} height={50} />
                <span>+50 Coins</span>
              </div>
              <div className="gems-reward-item">
                <Image src={Gems} alt="Gems Icon" width={50} height={50} />
                <span>+50 Gems</span>
              </div>
            </div>
            <div className="popup-footer">
              <button
              onClick={() => handleWelcomeLogin()}
                
                className="understood-btn"
              >
                Start
              </button>
            </div>
          </div>
        </div>
      )}

      {discoveryCoinsPopup && (
        <div className="popup-overlay">
          <div
            className="popup-box bg-gradian backgroundImage2"
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
                onClick={() => {
                  setDiscoveryCoinsPopup(false);
                  setDiscoveryGemsPopup(true);
                }}
              >
                <Image src={Right} alt="Coins Icon" width={40} height={40} />
              </button>
            </div>
          </div>
        </div>
      )}

      {discoveryGemsPopup && (
        <div className="popup-overlay">
          <div
            className="popup-box bg-gradian backgroundImage3"
          >
            <div className="popup-header">
              <h2 style={{ color: "#00A763" }}> Gems</h2>
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
                  handleLoginClick("firsttime");
                  setDiscoveryGemsPopup(false);
                }}
              >
                <Image src={Right} alt="Coins Icon" width={40} height={40} />{" "}
              </button>
            </div>
          </div>
        </div>
      )}

      {visibleBadges.map((badge, index) => (
        <div className="modal-overlay" key={index} onClick={handleOverlayClick}>
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
                  ? `Superb! You are proficient in ${badge.chapter_name}`
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
  );
}
