"use client"
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axiosInstance from "../auth";

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [studentDataInfo, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStudentInfo = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("studentapis/get_student_info");
      if (response.data.status === "Success") {
        setStudentData(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching student info:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudentInfo();
  }, [fetchStudentInfo]);

  return (
    <StudentContext.Provider value={{ studentDataInfo, isLoading, refetch: fetchStudentInfo }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => useContext(StudentContext);
