"use client";
import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "../../../../public/style/onboarding.css";
import GroupingCourse from "../../components/GroupingCourse";
import { useSearchParams } from "next/navigation";

export default function CreateSchool() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [schoolName, setSchoolName] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [schoolId, setSchoolid] = useState(0);
  const [board, setBoard] = useState("");
  const [sidebarActive, setSidebarActive] = useState("Schools");
  const searchParams = useSearchParams();

  const[boardid,setBoardId] = useState(0);
  const boardidparam = searchParams.get("boardid");
  

  const schoolNameParam = searchParams.get("schoolname");
  const schoolCodeParam = searchParams.get("schoolcode");
  const boardParam = searchParams.get("board");
  const schoolidparam = searchParams.get("schoolid");

  useEffect(() => {
    // Set state based on query parameters
    schoolNameParam ? setSchoolName(schoolNameParam) : "";
    schoolCodeParam ? setSchoolCode(schoolCodeParam) : "";
    boardParam ? setBoard(boardParam) : "";
    schoolidparam ? setSchoolid(schoolidparam) : "";
    boardidparam ? setBoardId(boardidparam) : "";
  }, [schoolNameParam, schoolCodeParam, boardParam,boardidparam]); // Depend on these parameters

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
    <div className="container">
      <Sidebar isCollapsed={isCollapsed} sidebarActive={sidebarActive} />
      <div className={`main-content ${isCollapsed ? "expanded" : ""}`}>
        <Header toggleSidebar={toggleSidebar} />
        <main>
          <GroupingCourse
            schoolId={schoolId}
            schoolName={schoolName}
            schoolCode={schoolCode}
            board={board}
            boardid={boardid}
          />
        </main>
      </div>
    </div>
  );
}
