"use client";
import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import "../../../../../public/style/onboarding.css";
import PreviewUser from "../../../components/PreviewUser"; // assuming PreviewUser is a default export
import { useSearchParams } from "next/navigation";

export default function Preview() {
  const searchParams = useSearchParams();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [sidebarActive, setSidebarActive] = useState("Schools");
  const [schoolName, setSchoolName] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [schoolId, setSchoolid] = useState(0);
  const [colValue, setColValue] = useState(1);
  const [board, setBoard] = useState("");
  const [uploadTypeValue, setUploadTypeValue] = useState(0);
  const schoolNameParam = searchParams.get("schoolName");
  const schoolCodeParam = searchParams.get("schoolCode");
  const boardParam = searchParams.get("schoolBoard");
  const schoolidparam = searchParams.get("schoolEditId");
  const colvalueparam = searchParams.get("colValue");
  const uploadTypeparam = searchParams.get("uploadType");

  useEffect(() => {
    // Set state based on query parameters
    schoolNameParam ? setSchoolName(schoolNameParam) : "";
    schoolCodeParam ? setSchoolCode(schoolCodeParam) : "";
    boardParam ? setBoard(boardParam) : "";
    schoolidparam ? setSchoolid(schoolidparam) : "";
    colValue ? setColValue(colvalueparam) : 1;
    uploadTypeparam ? setUploadTypeValue(uploadTypeparam) : 1;
  }, [schoolNameParam, schoolCodeParam, boardParam, colValue]); // Depend on these parameters

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
          <PreviewUser
            colValue={colValue}
            uploadType={uploadTypeValue}
            schoolId={schoolId}
            schoolName={schoolName}
            schoolCode={schoolCode}
            board={board}
          />
        </main>
      </div>
    </div>
  );
}
