'use client';
import '../../../../public/style/teacher.css';
import React, { useState, useEffect, useRef } from "react";
import Image from 'next/image';
import { FiLogOut } from "react-icons/fi";
import Help from '../../../../public/images/teacher/Help.svg';
import NotificationIcon from '../../../../public/images/teacher/Bell.svg';
import UserProfilePicture from '../../../../public/images/teacher/Placeholder.svg';
import SearchIcon from '../../../../public/images/teacher/Search.svg';
import { FaChevronDown } from "react-icons/fa";
import { useTeacher } from '../../context/TeacherContext';
import Skeleton from '../../components/Skeleton';
import { usePathname, useRouter } from 'next/navigation';
import Loader from "../../components/teacher/Loader";

const Header = ({ toggleSidebar }) => {
  const router = useRouter();
  const pathname = usePathname();
  const pathSegments = pathname.split('/');
  const currentPage = pathSegments[pathSegments.length - 1];
  const { teacherData } = useTeacher();
  const [isLoader, setIsLoader] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleDropdownToggle = (event) => {
    event.stopPropagation();
    setDropdownOpen((prevState) => !prevState);
  };

  useEffect(() => {
    setIsLoader(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoader(true); 
    router.push("/login");
  };

  const handleFeedback = () => {
    setIsLoader(true); 
    router.push("/teacher/feedback");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="header">

      {currentPage === "dashboard" ? (
        <div className="header-title-section">
          <h2 className="header-title">Dashboard</h2>
          <p className="subheading">Welcome back to AcadAlly</p>
        </div>
      ) : currentPage === "class_overview" ? (
        <div className="header-title-section">
          <h2 className="header-title">Class Overview</h2>
          <p className="subheading">Manage Your Classes</p>
        </div>
      ) : currentPage === "reports" ? (
        <div className="header-title-section">
          <h2 className="header-title">Reports</h2>
          <p className="subheading">Track the progress of your classes</p>
        </div>
      ) : currentPage === "todo" ? (
        <div className="header-title-section">
          <h2 className="header-title">To-Do Task</h2>
          <p className="subheading">Stay on track with your tasks</p>
        </div>
      ) : (
        <div className="header-title-placeholder"></div>
      )}

      {/* <div className="search-bar">
        <div className="search-input-container">
          <Image src={SearchIcon} alt="Search Icon" className="search-icon" />
          <input
            type="text"
            placeholder="Search for class, chapter, reports and more."
            className="search-input"
          />
        </div>
      </div> */}

      <div className="header-right-section">
        <button onClick={handleFeedback} className="notification-icon">
          <Image src={Help} alt="Help" />
        </button>

        {/* <button onClick={handleFeedback} className="notification-icon">
          <Image src={NotificationIcon} alt="Notifications" />
        </button> */}

        <div className="user-profile" ref={dropdownRef} onClick={handleDropdownToggle}>
          {teacherData ? (
            <>
              <Image
                src={teacherData.teacher_dp || UserProfilePicture}
                alt="User Profile"
                className="profile-picture"
                width={40}
                height={40}
              />
              <div className="user-info">
                <p className="user-name">{teacherData.teacher_name.charAt(0).toUpperCase() + teacherData.teacher_name.slice(1)}</p>
                <p className="user-email">{teacherData.teacher_email}</p>
              </div>
              <div style={{ position: 'relative' }}>
                <FaChevronDown
                  style={{ cursor: "pointer", marginLeft: "5px", color:'#6166AE' }}
                />
                {dropdownOpen && (
                  <div className="log-dropdown">
                    <button onClick={handleLogout} className="log-dropdown-item">
                      <FiLogOut />
                      LOG OUT
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className='skeletonNone'>
                <Skeleton width="35px" height="35px" borderRadius="10%" />
              </div>
              <div className="user-info" style={{ marginLeft: '5px' }}>
                <Skeleton width="80px" height="20px" />
                <Skeleton width="150px" height="15px" style={{ marginTop: '5px' }} />
              </div>
            </>
          )}
        </div>
      </div>
      {isLoader ? <Loader /> : ""}
    </div>
  );
};

export default Header;