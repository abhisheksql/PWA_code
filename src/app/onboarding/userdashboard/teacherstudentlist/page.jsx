"use client";
import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import "../../../../../public/style/onboarding.css";
import "../../../../../public/style/pagination.css";
import StudentEdit from "../../../components/TeacherStudentList";
import { useSearchParams } from "next/navigation";
import axiosInstance from "../../../auth";

const API_SESSION_ID = process.env.NEXT_PUBLIC_ONBOARDING_SESSION_ID;

export default function StudentEditPage() {
  const searchParams = useSearchParams();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [schoolName, setSchoolName] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [schoolId, setSchoolid] = useState(0);
  const [rolevalue, setRolevalue] = useState(0);
  const [board, setBoard] = useState("");
  const [sectionId, setSectionId] = useState(0);
  const [callApi, setCallApi] = useState(0);
  const [allData, setAllData] = useState([]);
  const [onboardingStatusApplied, setOnboardingStatusApplied] = useState({
    sent: false,
    notSent: false,
  });
  const [sidebarActive, setSidebarActive] = useState("Schools");
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const schoolNameParam = searchParams.get("schoolName");
  const schoolCodeParam = searchParams.get("schoolCode");
  const boardParam = searchParams.get("schoolBoard");
  const schoolidparam = searchParams.get("schoolEditId");
  const sectionidparam = searchParams.get("sectionId");
  const rolevalueparam = searchParams.get("rolevalue");
  useEffect(() => {
    // Set state based on query parameters
    schoolNameParam ? setSchoolName(schoolNameParam) : "";
    schoolCodeParam ? setSchoolCode(schoolCodeParam) : "";
    boardParam ? setBoard(boardParam) : "";
    schoolidparam ? setSchoolid(schoolidparam) : "";
    sectionidparam ? setSectionId(sectionidparam) : 0;
    rolevalueparam ? setRolevalue(rolevalueparam) : 1;
  }, [
    schoolNameParam,
    schoolCodeParam,
    boardParam,
    schoolidparam,
    sectionidparam,
    rolevalueparam,
  ]);
  useEffect(() => {
    if(sectionId > 0){
    const sectionArray = Array.isArray(sectionId) ? sectionId : [Number(sectionId)];
    setAppliedFilters(sectionArray);
    }
  }, [sectionId]);
  
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
    const fetchTeachersStudents = async () => {
      let status =
        onboardingStatusApplied.sent && onboardingStatusApplied.notSent
          ? false
          : onboardingStatusApplied.sent || onboardingStatusApplied.notSent;

      let onboarding_state = onboardingStatusApplied.sent
        ? true
        : onboardingStatusApplied.notSent
        ? false
        : null;

      let class_id = appliedFilters.length > 0 ? appliedFilters.join(",") : "";
      let apiUrl = `onboarding/teachers_students/list/?session_id=${API_SESSION_ID}&school_id=${schoolId}&page=${currentPage}&page_size=${pageSize}`;
      if (sectionId > 0 && class_id) {
        apiUrl += `&class_id=${class_id}`;
      } else if (sectionId > 0) {
        apiUrl += `&class_id=${sectionId}`;
      } else if(class_id) {
        apiUrl += `&class_id=${class_id}`;
      }

      if (status) {
        apiUrl += `&onboarding_state=${onboarding_state}`;
      }
      
      setIsLoader(true);
      try {
        const response = await axiosInstance.get(apiUrl, {
          headers: {
            // 'Authorization': `Bearer ${token}`,  // Add Bearer token here
          },
        });
        if (response.status == 200) {
          setAllData(response.data.data);
          setIsLoader(false);
        } else {
          console.error("Failed to fetch data");
          setIsLoader(false);
        }
      } catch (error) {
        console.error("Error:", error);
        setIsLoader(false);
      }
    };
    if (schoolId > 0) {
      fetchTeachersStudents();
    }
  }, [schoolId, callApi, sectionId, appliedFilters, currentPage, pageSize]);

  return (
    <div className="container">
      <Sidebar isCollapsed={isCollapsed} sidebarActive={sidebarActive} />
      <div className={`main-content ${isCollapsed ? "expanded" : ""}`}>
        <Header toggleSidebar={toggleSidebar} />
        <main>
          <StudentEdit
            setCallApi={setCallApi}
            allData={allData}
            schoolId={schoolId}
            schoolName={schoolName}
            schoolCode={schoolCode}
            board={board}
            setIsLoader={setIsLoader}
            isLoader={isLoader}
            setAppliedFilters={setAppliedFilters}
            appliedFilters={appliedFilters}
            sectionId={sectionId}
            onboardingStatusApplied={onboardingStatusApplied}
            setOnboardingStatusApplied={setOnboardingStatusApplied}
            rolevalue={rolevalue}
            setSectionId={setSectionId}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
          />
        </main>
      </div>
    </div>
  );
}
