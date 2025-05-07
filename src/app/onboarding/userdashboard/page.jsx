"use client";
import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "../../../../public/style/onboarding.css";
import TotalUser from "../../components/TotalUser";
import { useSearchParams } from "next/navigation";
import axiosInstance from "../../auth";
const API_SESSION_ID = process.env.NEXT_PUBLIC_ONBOARDING_SESSION_ID;
export default function CreateUser() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [schoolName, setSchoolName] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [schoolId, setSchoolid] = useState(0);
  const [schoolSectionData, setSchoolSectionData] = useState([]);
  const [board, setBoard] = useState("");
  const [totalTeacher, setTotalTeacher] = useState(0);
  const [totalStudent, setTotalStudent] = useState(0);
  const searchParams = useSearchParams();
  const schoolNameParam = searchParams.get("schoolName");
  const schoolCodeParam = searchParams.get("schoolCode");
  const boardParam = searchParams.get("schoolBoard");
  const schoolidparam = searchParams.get("schoolEditId");
  const [isLoader, setIsLoader] = useState(false);
  const [sidebarActive, setSidebarActive] = useState("Schools");
  const [callApi, setCallApi] = useState(0);
  const [appliedFilters, setAppliedFilters] = useState([]);

  useEffect(() => {
    // Set state based on query parameters
    schoolNameParam ? setSchoolName(schoolNameParam) : "";
    schoolCodeParam ? setSchoolCode(schoolCodeParam) : "";
    boardParam ? setBoard(boardParam) : "";
    schoolidparam ? setSchoolid(schoolidparam) : "";
  }, [schoolNameParam, schoolCodeParam, boardParam]); // Depend on these parameters

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

  const OnboardingApiUrl = process.env.NEXT_PUBLIC_LEAP_API_URL;

  useEffect(() => {
    let class_id = appliedFilters.length > 0 ? appliedFilters.join(",") : "";
    const apiUrl = class_id
      ? `onboarding/schools/${schoolId}/sections/?session_id=${API_SESSION_ID}&class_id=${class_id}`
      : `onboarding/schools/${schoolId}/sections/?session_id=${API_SESSION_ID}`;

    const apiCall = async () => {
      setIsLoader(true);
      try {
        const response = await axiosInstance.get(apiUrl, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status == 200) {
          const totalTeachers = response.data.data.total_teachers;
          const totalStudents = response.data.data.total_students;
          setTotalTeacher(totalTeachers);
          setTotalStudent(totalStudents);
          setSchoolSectionData(
            response.data.data.sections.map((item) => ({
              id: item.public_id,
              section_name: item.section_name,
              total_teachers: item.total_teachers, // Use total_teachers from the data level
              total_students: item.total_students, // Use total_students from the data level
            }))
          );
          setIsLoader(false);
        }
        setIsLoader(false);
      } catch (error) {
        setIsLoader(false);
        console.error("Error:", error);
      } finally {
      }
    };

    if (schoolId > 0) {
      apiCall();
    }
  }, [schoolId, callApi, appliedFilters]);

  return (
    <div className="container">
      <Sidebar isCollapsed={isCollapsed} sidebarActive={sidebarActive} />
      <div className={`main-content ${isCollapsed ? "expanded" : ""}`}>
        <Header toggleSidebar={toggleSidebar} />
        <main>
          <TotalUser
            totalStudent={totalStudent}
            totalTeacher={totalTeacher}
            schoolSectionData={schoolSectionData}
            schoolId={schoolId}
            schoolName={schoolName}
            schoolCode={schoolCode}
            board={board}
            setIsLoader={setIsLoader}
            isLoader={isLoader}
            setCallApi={setCallApi}
            setAppliedFilters={setAppliedFilters}
            appliedFilters={appliedFilters}
          />
        </main>
      </div>
    </div>
  );
}
