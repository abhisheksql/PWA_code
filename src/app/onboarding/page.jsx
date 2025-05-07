"use client";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import SchoolTable from "../components/SchoolTable";
import Sidebar from "../components/Sidebar";
import { useFetchSchoolData } from "../hooks/apiCall.js";
import { parse } from "date-fns";
import axiosInstance from "../auth";
const API_SESSION_ID = process.env.NEXT_PUBLIC_ONBOARDING_SESSION_ID;

function Onboarding() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [reqValue, setReqValue] = useState(0);
  const [isLoader, setIsLoader] = useState(false);
  const [sidebarActive, setSidebarActive] = useState("Schools");
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [startAppliedFilters, setStartAppliedFilters] = useState(null);
  const [endAppliedFilters, setEndAppliedFilters] = useState(null);
  const [classSection, setClassSection] = useState([]);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  let formattedData = [];
  const { schoolDatas, loading, error } = useFetchSchoolData(
    appliedFilters,
    startAppliedFilters,
    endAppliedFilters,
    reqValue,
    currentPage,
    pageSize
  );

  useEffect(() => {
    setIsLoader(loading);
  }, [loading]);

  useEffect(() => {
    if (schoolDatas.status == 200 && schoolDatas.data.status_code == 200) {
      // Update pagination data from API response
      if (schoolDatas.data.data && schoolDatas.data.data.pagination) {
        setTotalItems(schoolDatas.data.data.pagination.total_items || 0);
        setTotalPages(schoolDatas.data.data.pagination.total_pages || 0);
      }
    }
  }, [schoolDatas]);

  if (schoolDatas.status == 200 && schoolDatas.data.status_code == 200) {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    };
    
    // Access the nested data array
    const schoolsData = schoolDatas.data.data?.data || [];
    
    if (schoolsData.length > 0) {
      formattedData = schoolsData.map((item) => ({
        id: item.public_id,
        name: item.school_name,
        school_shortcode: item.school_shortcode,
        school_board: item.school_board,
        classroom: item.sections
          .map((section) => section.section_name)
          .join(", "),
        students: item.total_students,
        teachers: item.total_teachers,
        date: item.school_created_on,
        board_id: item.board_id,
      }));
    }
  }

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  
  // Handle changes to page size
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Handle screen width change
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 925) {
        setIsSmallScreen(true);
        setIsCollapsed(true);
      } else {
        setIsSmallScreen(false);
        setIsCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (!isSmallScreen) {
      setIsCollapsed(!isCollapsed);
    }
  };
  
  useEffect(() => {
    const apiCall = async () => {
      try {
        const response = await axiosInstance.get(`onboarding/schools/filter?session_id=${API_SESSION_ID}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status == 200) {
          const convertToValueLabel = (data) => {
            // Check if the input is an array
            if (!Array.isArray(data)) {
              console.error("Input is not an array.");
              return [];
            }

            // Convert the data
            const formattedData1 = data.map((item) => ({
              value: item.public_id,
              label: item.school_name,
            }));
            // Check if the array is empty
            if (formattedData1.length === 0) {
              console.warn("No data found.");
              return [];
            }
            return formattedData1;
          };
          const result1 = convertToValueLabel(response.data.data);
          setClassSection(result1);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
      }
    };
    apiCall();
  }, []);

  return (
    <div className="container" sidebarActive={sidebarActive}>
      <Sidebar isCollapsed={isCollapsed} sidebarActive={sidebarActive} />
      <div className={`main-content ${isCollapsed ? "expanded" : ""}`}>
        <Header toggleSidebar={toggleSidebar} />
        <main>
          <SchoolTable
            schools={formattedData}
            setReqValue={setReqValue}
            isLoader={isLoader}
            setIsLoader={setIsLoader}
            setAppliedFilters={setAppliedFilters}
            appliedFilters={appliedFilters}
            classSection={classSection}
            startAppliedFilters={startAppliedFilters}
            setStartAppliedFilters={setStartAppliedFilters}
            endAppliedFilters={endAppliedFilters}
            setEndAppliedFilters={setEndAppliedFilters}
            // Pagination props
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalItems}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            handlePageSizeChange={handlePageSizeChange}
          />
        </main>
      </div>
    </div>
  );
}

export default Onboarding;
