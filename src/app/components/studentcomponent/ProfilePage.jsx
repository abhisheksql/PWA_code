"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import backArrowImg from "../../../../public/images/studentimg/left.svg";
import highlightImg from "../../../../public/images/studentimg/highlight.svg";
import Studentlogout from "../../../../public/images/studentimg/Studentlogout.svg";
import rightArrowImg from "../../../../public/images/studentimg/right.svg";
import { useRouter } from "next/navigation";
import Loader from "../../components/studentcomponent/Loader";
import defaultProfileImage from "../../../../public/images/studentimg/userprofiledefault.svg";

const ProfilePage = ({ subjectData }) => {
  const router = useRouter();
  const [isLoader, setIsloader] = useState(false);
  const [showSignOutPopup, setshowSignOutPopup] = useState(false);
  const handleBadgeClick = (badge) => {
    setIsloader(true);
    router.push(`/student/achievements?type_of_badge=${badge}`);
  };

  const handleGoBack = () => {
    router.push("/student/");
  };

  const handleLogout = () => {
    // Implement your logout logic here
    localStorage.clear();
    router.push("/login");
  };

  const handleEditProfile = () => {
    setIsloader(true);
    router.push(`/student/editprofile`);
  };
  const borderColors = [
    "#FF8A00",
    "#FA8072",
    "#8078BE",
    // "#60B7FF",
    "#9376E4",
    "#96AF66",
  ];
  return (
    <div className="profile-container">
      {subjectData && subjectData.data ? (
        <div>
          <div className="dfjs">
            <div className="profile-back-arrow">
              <span onClick={handleGoBack} style={{ cursor: "pointer" }}>
                <Image src={backArrowImg} alt="Back" />
              </span>
              <h4>My Space</h4>
            </div>

            <div className="dfa signOutButton" style={{ gap: "10px" , cursor:'pointer' }}  onClick={() => setshowSignOutPopup(true)}>
              <p> Sign Out</p>
              <Image
                src={Studentlogout}
                alt="Log Out"
                width={30}
                height={30}
              />
            </div>
          </div>

          <div className="profile-content">
            <div className="profile-card-container">
              <div
                className="profile-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div className="profile-class-edit">
                  <p className="profile-class-circle">
                    {subjectData.data.badge_data.class_name}
                  </p>
                  <span
                    onClick={handleEditProfile}
                    style={{ cursor: "pointer" }}
                  >
                    <Image
                      src={highlightImg}
                      alt="Edit"
                      style={{ cursor: "pointer" }}
                      width={20}
                      height={20}
                    />{" "}
                    Edit Profile
                  </span>
                </div>
                <Image
                  src={subjectData.data.badge_data.icon || defaultProfileImage}
                  alt="Profile Picture"
                  className="profile-image"
                  width={175}
                  height={175}
                  onError={(e) => {
                    e.target.src = defaultProfileImage;
                  }}
                />
                <h3 className="profile-name">
                  {subjectData.data.badge_data.student_name}
                </h3>
                <p className="profile-school">
                  {subjectData.data.badge_data.school_name}
                </p>
              </div>
            </div>

            {/* Badge Cards Section */}
            <div className="profile-badge-container">
              <div className="profile-badge-card">
                {subjectData.data.badge_data.type_of_bages.map(
                  (badge, index) => (
                    <div
                      key={index}
                      className={`profile-badge-item ${
                        badge.collected > 0 ? "" : ""
                      }`}
                      style={{
                        border: `1px solid ${borderColors[index]}`,
                      }}
                    >
                      <div className="profile-badge-details">
                        <Image
                          src={badge.icon}
                          alt={badge.name}
                          width={50}
                          height={50}
                        />
                        <div>
                          <h5 className="profile-badge-title">{badge.name}</h5>
                          <p className="profile-badge-description">
                            {badge.text}
                          </p>
                        </div>
                      </div>
                      {badge.collected > -1 && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <div></div>
                          <div
                            className="profile-badge-collection"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              handleBadgeClick(badge.badge_type);
                            }}
                          >
                            {badge.collected} Collected{" "}
                            <Image
                              src={rightArrowImg}
                              alt="Arrow"
                              className="profile-right-arrow"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}

      {showSignOutPopup && (
        <div className="popup-overlay">
          <div className="quiz-popup-box" style={{ width: "350px" }}>
            <h3 style={{ marginBottom: "20px" }}>Sign Out?</h3>
            <p>Are you sure you want to Sign out?</p>
            <div className="quiz-popup-btn" style={{ marginTop: "30px" }}>
              <button
                onClick={() => setshowSignOutPopup(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button
                className="yes-btn"
                onClick={() => {
                  handleLogout(); // Call the logout function to clear localStorage and other tasks
                  router.push("/login"); // Redirect to the login page
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
      {isLoader ? <Loader /> : ""}
    </div>
  );
};

export default ProfilePage;
