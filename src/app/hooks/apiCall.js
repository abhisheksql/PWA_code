"use client"
import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../auth";

export function useFetchSchoolData(
  appliedFilters,
  startAppliedFilters,
  endAppliedFilters,
  reqValue,
  currentPage = 1,
  pageSize = 10
) {
  const [schoolDatas, setSchoolDatas] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_SESSION_ID = process.env.NEXT_PUBLIC_ONBOARDING_SESSION_ID;

  const fetchSchoolData = useCallback(async () => {
    setLoading(true);

    // Build the query params
    let apiUrl = `onboarding/schools/?session_id=${API_SESSION_ID}`;
    
    // Add school IDs if available
    let school_id = appliedFilters.length > 0 ? appliedFilters.join(",") : '';
    if (school_id) {
      apiUrl += `&schoolids=${school_id}`;
    }
    
    // Add date filters if available
    if (startAppliedFilters) {
      const formattedDate1 = startAppliedFilters.replace(/\//g, "-");
      apiUrl += `&start_date=${formattedDate1}`;
    }
    
    if (endAppliedFilters) {
      const formattedDate2 = endAppliedFilters.replace(/\//g, "-");
      apiUrl += `&end_date=${formattedDate2}`;
    }
    
    // Add pagination parameters
    apiUrl += `&page=${currentPage}&page_size=${pageSize}`;

    try {
      const response = await axiosInstance.get(apiUrl);
      if (response.status === 200) {
        setSchoolDatas(response);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [appliedFilters, startAppliedFilters, endAppliedFilters, reqValue, currentPage, pageSize, API_SESSION_ID]);

  useEffect(() => {
    fetchSchoolData();
  }, [fetchSchoolData]);

  return { schoolDatas, loading, error };
}
