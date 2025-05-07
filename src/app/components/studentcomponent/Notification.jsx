import React from "react";
import Image from "next/image";
import studentlamp from "../../../../public/images/studentimg/studentlamp.svg";
import studentlampgrey from "../../../../public/images/studentimg/studentlampgrey.svg";
import studentmaths from "../../../../public/images/studentimg/studentmaths.svg";
import studentmathsgrey from "../../../../public/images/studentimg/studentmathsgrey.svg";
import studentscience from "../../../../public/images/studentimg/studentscience.svg";
import studentsciencegrey from "../../../../public/images/studentimg/studentsciencegrey.svg";

import studentbio from "../../../../public/images/studentimg/studentbio.svg";
import studentbiogrey from "../../../../public/images/studentimg/studentbiogrey.svg";

import studentchemistry from "../../../../public/images/studentimg/studentchemistry.svg";
import studentchemistrygrey from "../../../../public/images/studentimg/studentchemistrygrey.svg";

import studentphysics from "../../../../public/images/studentimg/studentphysics.svg";
import studentphysicsgrey from "../../../../public/images/studentimg/studentphysicsgrey.svg";


import { useRouter } from "next/navigation";
import axiosInstance from "../../auth";
const Notification = ({ notifications, setIsloader }) => {
  const router = useRouter();
  const handleDisableNotification = async (notification, enable) => {
    setIsloader(true);
    const { section_id, chapter_id, course_id, topic_id, version, tag_type } =
      notification;
    if (enable == 1) {
      try {
        const {
          section_id,
          chapter_id,
          course_id,
          topic_id,
          version,
          tag_type,
        } = notification;

        const url = `/studentapis/disable_notification?section_id=${section_id}&chapter_id=${chapter_id}&course_id=${course_id}&topic_id=${topic_id}&version=${version}&tag_type=${tag_type}`;
        const response = await axiosInstance.get(url);
        router.push(
          `/student/progresschapter?chapterid=${chapter_id}&courseid=${course_id}`
        );
      } catch (error) {
        setIsloader(false);
        console.error("Error disabling notification:", error);
      }
    } else {
      router.push(
        `/student/progresschapter?chapterid=${chapter_id}&courseid=${course_id}`
      );
      setIsloader(false);
    }
  };

  return (
    <div className="raiseAticket">
      <h2 className="progresstitle">Notifications</h2>
      <div className="notifications-list">
        {notifications?.data?.length > 0 && (
          <>
            {notifications?.data
              .filter((notification) => notification.enable === 1)
              .map((notification, index) => (
                <div
                  key={`enabled-${index}`}
                  className="notification-item"
                  onClick={() => handleDisableNotification(notification, 1)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="notification-icon cardimg">
                    <Image
                      src={
                        notification.tag_icon?.toLowerCase() == "math_icon"
                          ? studentmaths :
                          notification.tag_icon?.toLowerCase() ==
                            "science_icon"
                          ? studentscience
                          : notification.tag_icon?.toLowerCase() ==
                            "physics_icon"
                          ? studentphysics
                          : notification.tag_icon?.toLowerCase() ==
                            "biology_icon"
                          ? studentbio
                          : notification.tag_icon?.toLowerCase() ==
                            "chemistry_icon"
                          ? studentchemistry
                          : notification.tag_icon?.toLowerCase() ==
                            "booster_icon"
                          ? studentlamp
                          : ""
                      }
                      alt="notification-icon"
                      className="avatar"
                      width={25}
                      height={25}
                    />
                  </div>
                  <div className="notification-details">
                    <span className="notification-course-name">
                      {notification.chapter_name}
                    </span>
                    <span className="notification-message">
                      {notification.body}
                    </span>
                  </div>
                  <div className="notification-time">
                    {notification.time} ago
                  </div>
                </div>
              ))}
            {/* Disabled Notifications (enable === 0) */}
            {notifications?.data
              .filter((notification) => notification.enable === 0)
              .map((notification, index) => (
                <div
                  key={`disabled-${index}`}
                  className="notification-item"
                  onClick={() => handleDisableNotification(notification, 0)}
                  style={{ cursor: "pointer" }} // Dimmed effect for disabled
                >
                  <div className="notification-icon gray_cardimg">
                    <Image
                      src={
                        notification.tag_icon?.toLowerCase() == "math_icon"
                          ? studentmathsgrey 
                          :notification.tag_icon?.toLowerCase() == "physics_icon"
                          ? studentphysicsgrey
                          :notification.tag_icon?.toLowerCase() == "biology_icon"
                          ? studentbiogrey
                          :notification.tag_icon?.toLowerCase() == "chemistry_icon"
                          ? studentchemistrygrey
                          : notification.tag_icon?.toLowerCase() ==
                            "science_icon"
                          ? studentsciencegrey
                          : notification.tag_icon?.toLowerCase() ==
                            "booster_icon"
                          ? studentlampgrey
                          : ""
                      }
                      alt="notification-icon"
                      className="avatar"
                      width={25}
                      height={25}
                    />
                  </div>
                  <div className="notification-details">
                    <span className="notification-course-name">
                      {notification.chapter_name}
                    </span>
                    <span className="notification-message">
                      {notification.body}
                    </span>
                  </div>
                  <div
                    className="notification-time"
                    style={{ color: "#949494" }}
                  >
                    {notification.time} ago
                  </div>
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Notification;
