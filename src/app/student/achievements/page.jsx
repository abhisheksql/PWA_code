"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/studentcomponent/Sidebar";
import "../../../../public/style/student.css";
import AchievementsPage from "../../components/studentcomponent/AchievementsPage";
import axiosInstance from "../../auth";
import Gem from "../../../../public/images/studentimg/Gems.svg";
import CoinFrame from "../../../../public/images/studentimg/CoinFrame.svg";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Loader from "../../components/studentcomponent/Loader";
export default function StudentWeb() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [increase, setIncrease] = useState(false);
  const [decrease, setDecrease] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [coin, setCoin] = useState(false);
  const [gems, setGems] = useState(false);
  const [increaseGems, setIncreaseGems] = useState(false);
  const [decreaseGems, setDecreaseGems] = useState(false);
  const [shouldFetchBalance, setShouldFetchBalance] = useState(false);
  const [balanceData, setBalanceData] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceError, setBalanceError] = useState(null);
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
  const [userName, setUserName] = useState("");
  const [subjectData, setSubjectData] = useState(null);
  const [subjectLoading, setSubjectLoading] = useState(true);
  const [subjectError, setSubjectError] = useState(null);
  const [typeBadge, setTypeBadge] = useState("");
  const [chapterStatus, setChapterStatus] = useState(0);
  const [recallUserApi, setRecallUserApi] = useState(0);
  const searchParams = useSearchParams();
  const [studentId, setStudentid] = useState(0);
  const typeofbadge = searchParams.get("type_of_badge");

  useEffect(() => {
    typeofbadge ? setTypeBadge(typeofbadge) : 0;
  }, [typeofbadge]);

  // Function to toggle the sidebar
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

      // Example usage:
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

  useEffect(() => {
    setIsLoader(true);
    const fetchBadgeProfile = async () => {
      try {
        setSubjectLoading(true);
        const response = await axiosInstance.get(
          `studentapis/badge_type?type_of_badge=${typeBadge}`
        );
        // if(response.status == 200){
        setSubjectData(response.data);
        // }
        setIsLoader(false);
      } catch (error) {
        setIsLoader(false);
        setSubjectError(error.message || "Something went wrong");
      } finally {
        setSubjectLoading(false);
      }
    };
    if (typeBadge !== "") {
      fetchBadgeProfile();
    }
  }, [typeBadge]); // Empty dependency array ensures this runs once on mount

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("popup-overlay")) {
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
      />
      <div
        className={`main-right-container ${
          isSidebarCollapsed ? "collapsed" : ""
        }`}
      >
        <AchievementsPage subjectData={subjectData} typeBadge={typeBadge} />
      </div>

      {isPopupOpenBuy && (
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
      {isLoader ? <Loader /> : ""}
    </div>
  );
}
