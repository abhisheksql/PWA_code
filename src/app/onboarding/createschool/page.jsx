"use client";
import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import SchoolCreation from "../../components/SchoolCreation";
import Sidebar from "../../components/Sidebar";
import "../../../../public/style/onboarding.css";
import axios from "axios";
import { useSearchParams } from "next/navigation";

export default function CreateSchool() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [schoolEditId, setSchoolEditid] = useState(0);
  const [sidebarActive, setSidebarActive] = useState("Schools");
  const searchParams = useSearchParams();
  const schooleditidparam = searchParams.get("schoolEditId");

  useEffect(() => {
    // Set state based on query parameters
    schooleditidparam ? setSchoolEditid(schooleditidparam) : "";
  }, [schooleditidparam]); // Depend on these parameters

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
          <SchoolCreation schoolEditId={schoolEditId} />
        </main>
      </div>
    </div>
  );
}
