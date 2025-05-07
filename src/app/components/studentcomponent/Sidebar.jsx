"use client";
import React, { useEffect, useState } from "react";
import { IoAddCircle } from "react-icons/io5";
import Image from "next/image";
import Ellipse from '../../../../public/images/studentimg/Ellipse.svg';
import Coin from "../../../../public/images/studentimg/Coin.svg";
import Diamond from "../../../../public/images/studentimg/Gems.svg";
import Bell from "../../../../public/images/studentimg/bell.svg";
import Help from "../../../../public/images/studentimg/help.svg";
import FAQ from "../../../../public/images/studentimg/faq.svg";
import "react-toastify/dist/ReactToastify.css";
import Home from "../../../../public/images/studentimg/HomeWhite.svg";
import BarChart from "../../../../public/images/studentimg/BarChartWhite.svg";
import { useRouter } from "next/navigation";
import axiosInstance from "../../auth";
import userprofiledefault from "../../../../public/images/studentimg/userprofiledefault.svg";
const Sidebar = ({
  keyvalue,
  isCollapsed,
  activeTab,
  setActiveTab,
  toggleSidebar,
  balanceData,
  coinStatus,
  gemStatus,
  increaseValue,
  decreaseValue,
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
  setIsLoader,
  setIsPopupOpenBuy,
  handleBuyGem,
  setKey,
  setUserName,
  setChapterStatus,
  recallUserApi,
  setStudentid,
  courseIdActive
}) => {

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
  const [studentData, setStudentData] = useState([]);
  const [newCourseid,setNewCourseid] = useState(0);
  const[notificationCount,setNotificationCount] = useState(0);
  const router = useRouter();
  
// useEffect(() => {
//   if (studentDataInfo) {

//     setStudentData(studentDataInfo);
//     setUserName(studentDataInfo.username);
//     setStudentid(studentDataInfo);
//   }
 
// }, [studentDataInfo,recallUserApi]);
useEffect(() => {
  if (courseIdActive > 0) {
    setNewCourseid(courseIdActive);
  }
}, [courseIdActive]);

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const response = await axiosInstance.get(
          "studentapis/get_student_info"
        );
        if (response.data.status == "Success") {
          setStudentData(response.data.data);
          setUserName(response.data.data.first_name.charAt(0).toUpperCase() + response.data.data.first_name.slice(1) +" "+response.data.data.last_name);
          setStudentid(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching student info:", err);
        // setError(err.message);
      } finally {
        // setIsLoading(false);
      }
    };
    fetchStudentInfo();
  }, [recallUserApi]);

  const handleGoBack = () => {
    setIsLoader(true);
    router.push(`/student/profile`);
  };


  const handleRaiseTicket = () => {
    setIsLoader(true);
    router.push(`/student/raiseticket`);
  };

  const handleNotification = () => {
    setIsLoader(true);
    router.push(`/student/notification`);
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
        console.log("A");
        // For review coins, subtract exact review amount
        newCoins = Math.max(0, Number(balanceData.data.cur_coins) - review_coin);
      } else if(firstTimeLogin) {
        console.log("B");
        // For first time login, subtract exactly 50
        let valuecheck = Number(balanceData.data.cur_coins) - 50;
        newCoins = Math.max(0, Number(balanceData.data.cur_coins) - 50);
        newGems = Math.max(0, Number(balanceData.data.cur_gems) - 50);
      } else if(todayLogin) {
        // For today's login, subtract exactly 10
        console.log("C");
        newCoins = Math.max(0, Number(balanceData.data.cur_coins) - 10);
      }else{
        console.log("D",newCoins);
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
    if (decrease && curCoins > initialCoin - decrease) {
      timer = setInterval(() => {
        setCurCoins((prevCoins) => Math.max(prevCoins - 1, 0));
        if (curCoins - 1 == initialCoin - decrease) {
        }
      }, 10); // Adjust interval as needed
    } else {
      clearInterval(timer);
      if (decrease) {
        setinitialCoin(initialCoin - decrease);
      } // Stop the timer if conditions are not met
    }
    return () => {
      clearInterval(timer); // Clean up on dependency change
    };
  }, [curCoins, decrease, reCallCoins]);

  // Auto-increment curGems only if increaseGems is true and curGems is less than 100
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
      } // Stop incrementing when 100 is reached or increaseGems is false
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
      clearInterval(timer);
    }

    return () => clearInterval(timer); // Cleanup interval on component unmount
  }, [curGems, decreaseGems]);

  const handleRedirect = (path) => {
    // setChapterStatus((prevKey) => (prevKey == 1 ? 0 : 1));

    setKey((prevKey) => prevKey + 1);
    router.push(`/${path}`);
  };

  const handleBuyGemBuy = () => {
    setIsPopupOpenBuy(true); // Open popup
    handleBuyGem(); // Execute the logic passed as a parameter
  };

  useEffect(() => {
    // setIsloader(true);
    
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get("/studentapis/read_notification");

        // if(response.data.status == 'SUCCESS'){
        // const enabledCount = response.data.data.filter(item => item.enable == 1).length;
        // setNotificationCount(enabledCount);
        // }

        if (response.data.status === 'SUCCESS' && Array.isArray(response.data.data)) {
          const enabledCount = response.data.data.filter(item => item.enable === 1).length;
          setNotificationCount(enabledCount);
        } else {
          setNotificationCount(0); // or handle no data case
          console.warn("No data received or not in expected format");
        }
  
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="side-top">
        <div
          className="userInfo"
          onClick={handleGoBack}
          style={{ cursor: "pointer" }}
        >
          <Image
            src={studentData.profile_url ? studentData.profile_url : userprofiledefault}
            // User_img
            alt="User Avatar"
            className="avatar"
            width={50}
            height={50}
            priority
            style={{ objectFit: 'contain' }}
          />
          {/* <h3>{studentData.username}</h3> */}
          <h3>{studentData.first_name
    ? studentData.first_name.charAt(0).toUpperCase() + studentData.first_name.slice(1)
    : ""}
  {" "}
             {studentData.last_name}</h3>
          <p>{studentData.school_name}</p>
        </div>
        <div className="coin-diamond">
          <div className="cod-1">
            <Image src={Coin} alt="Coin Icon" />
            <span>{curCoins !== null ? curCoins : "..."} </span>
          </div>
          <div className="cod-2">
            <Image src={Diamond} alt="Gems Icon" />
            <span>{curGems !== null ? curGems : "..."}</span>
            <IoAddCircle
              onClick={() => handleBuyGemBuy()}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      </div>

      <nav className="navMenu">
        <button
          className={`navLink ${activeTab == "home" ? "active" : ""}`}
          onClick={() => {
            const url = newCourseid > 0 
              ? `student?courseId=${newCourseid}` 
              : `student`;
            handleRedirect(url);
          }}
        >
          {" "}
          <Image src={Home} alt="Home" className="hover-image1" />
          <span>Home</span>{" "}
        </button>
        <button
          className={`navLink ${activeTab == "progress" ? "active" : ""}`}
          onClick={() => {
            const url = newCourseid > 0 
              ? `student/progress?courseid=${newCourseid}` 
              : `student/progress`;
            handleRedirect(url);
          }}
        >
          <Image src={BarChart} alt="Bar Chart" className="hover-image2" />
          <span> Progress</span>{" "}
        </button>
        {/* <button
          className={`navLink ${activeTab == "resources" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("resources");
          }}
        >
          {" "}
          <Image src={VideoCamera} alt="Video Camera" className="hover-image3" />
          <span>Resources</span>{" "}
        </button> */}
      </nav>

      <div className="bottom-icons">
        <button className="bottom-cards" onClick={handleNotification}>
          {" "}
          <Image src={Bell} alt="Help Icon" width={25} />
          <span className="notification-badge">{notificationCount}</span>
        </button>
        {/* <button className="bottom-cards" onClick={handleRaiseTicket}>
          {" "}
          <Image src={FAQ} alt="Help Icon" width={25} />
        </button> */}
        <button className="bottom-cards" onClick={handleRaiseTicket}>
          {" "}
          <Image src={Help} alt="Help Icon" width={25} />
        </button>
      </div>
                  <button className="std-toggle-sidebar" onClick={toggleSidebar}>
                      <Image src={Ellipse} alt="Expand Sidebar" className="toggle-icon" width={40} height={40} />
                  </button>
    </div>
  );
};

export default Sidebar;