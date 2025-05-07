"use client";
import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import "../../../../../public/style/onboarding.css";
import CreateUser from "../../../components/CreateUserOneByOne";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import axiosInstance from "../../../auth";
const API_SESSION_ID = process.env.NEXT_PUBLIC_ONBOARDING_SESSION_ID;
export default function CreateUserOneByOne() {
  const searchParams = useSearchParams();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [sidebarActive, setSidebarActive] = useState("Schools");
  const [schoolName, setSchoolName] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [schoolId, setSchoolid] = useState(0);
  const [userid, setUserId] = useState(0);
  const [userRole, setUserRole] = useState("");
  const [board, setBoard] = useState("");
  const [classOptions, setClassOptions] = useState([]);
  const [classvalue, setClassvalue] = useState([]);
  const [sectionsCourses, setSectionsCourses] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const schoolNameParam = searchParams.get("schoolName");
  const schoolCodeParam = searchParams.get("schoolCode");
  const boardParam = searchParams.get("schoolBoard");
  const schoolidparam = searchParams.get("schoolEditId");
  const roleParam = searchParams.get("role");
  const userparam = searchParams.get("user");

  useEffect(() => {
    // Set state based on query parameters
    schoolNameParam ? setSchoolName(schoolNameParam) : "";
    schoolCodeParam ? setSchoolCode(schoolCodeParam) : "";
    boardParam ? setBoard(boardParam) : "";
    schoolidparam ? setSchoolid(schoolidparam) : "";
    userparam ? setUserId(userparam) : "";
    roleParam ? setUserRole(roleParam) : "";
  }, [
    schoolNameParam,
    schoolCodeParam,
    boardParam,
    schoolidparam,
    userparam,
    roleParam,
  ]); // Depend on these parameters
  // Handle screen width change
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 925) {
        setIsSmallScreen(true); // Automatically collapse sidebar for small screens
        setIsCollapsed(true); // Collapse sidebar
      } else {
        setIsSmallScreen(false); // Enable normal functionality above 925px
        setIsCollapsed(false); // Default to expanded sidebar for large screens
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Trigger once on mount to set the initial state

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle sidebar on button click (but only if not on small screen)
  const toggleSidebar = () => {
    if (!isSmallScreen) {
      setIsCollapsed(!isCollapsed);
    }
  };

  useEffect(() => {
    let apiUrl;
    apiUrl = `onboarding/schools/${schoolId}/sections_courses/?session_id=${API_SESSION_ID}`;
    const apiCall = async () => {
      try {
        const response = await axiosInstance.get(apiUrl, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status == 200) {
          const classOptionsdata = [
            ...response.data.data.map((item) => ({
              value: item.class_code,
              label: item.section_name,
            })),
          ];
          setClassOptions(classOptionsdata);
          setSectionsCourses(response.data.data);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
      }
    };
    if (schoolId > 0) {
      apiCall();
    }
  }, [schoolId]);

  return (
    <div className="container">
      <Sidebar isCollapsed={isCollapsed} sidebarActive={sidebarActive} />
      <div className={`main-content ${isCollapsed ? "expanded" : ""}`}>
        <Header toggleSidebar={toggleSidebar} />
        <main>
          <CreateUser
            sectionsCourses={sectionsCourses}
            classOptionData={classOptions}
            schoolId={schoolId}
            schoolName={schoolName}
            schoolCode={schoolCode}
            board={board}
            userid={userid}
            userRole={userRole}
            setIsLoader={setIsLoader}
            isLoader={isLoader}
          />
        </main>
      </div>
    </div>
  );
}
