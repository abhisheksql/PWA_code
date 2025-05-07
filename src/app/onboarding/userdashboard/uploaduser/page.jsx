"use client";
import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import "../../../../../public/style/onboarding.css";
import UserCreation from "../../../components/UserCreation";
import { useSearchParams } from "next/navigation";

export default function UploadUser() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [sidebarActive, setSidebarActive] = useState("Schools");
  const searchParams = useSearchParams();
  const [schoolName, setSchoolName] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [schoolId, setSchoolid] = useState(0);
  const [isClass, setisClass] = useState(null);
  const [board, setBoard] = useState("");

  const schoolNameParam = searchParams.get("schoolName");
  const schoolCodeParam = searchParams.get("schoolCode");
  const boardParam = searchParams.get("schoolBoard");
  const schoolidparam = searchParams.get("schoolEditId");
  const isClassparam = searchParams.get("section_name");

  useEffect(() => {
    // Set state based on query parameters
    schoolNameParam ? setSchoolName(schoolNameParam) : "";
    schoolCodeParam ? setSchoolCode(schoolCodeParam) : "";
    boardParam ? setBoard(boardParam) : "";
    schoolidparam ? setSchoolid(schoolidparam) : "";
    isClassparam ? setisClass(isClassparam) : null;
  }, [schoolNameParam, schoolCodeParam, boardParam, isClassparam]); // Depend on these parameters

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

  return (
    <div className="container" sidebarActive={sidebarActive}>
      <Sidebar isCollapsed={isCollapsed} />
      <div className={`main-content ${isCollapsed ? "expanded" : ""}`}>
        <Header toggleSidebar={toggleSidebar} />
        <main>
          <UserCreation
            schoolId={schoolId}
            isClass={isClass}
            schoolName={schoolName}
            schoolCode={schoolCode}
            board={board}
          />
        </main>
      </div>
    </div>
  );
}
