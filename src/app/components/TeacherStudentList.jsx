"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useTable, useSortBy, useRowSelect } from "react-table";
import { FiFilter } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
import { FaArrowLeft, FaCaretDown, FaCaretUp, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IoAddSharp } from "react-icons/io5";
import { MdOutlineFileDownload } from "react-icons/md";
import { PiShuffleBold } from "react-icons/pi";
import { FiTrendingUp } from "react-icons/fi";
import { FiEdit3 } from "react-icons/fi";
import Image from "next/image";
import redDelete from "../../../public/images/redDelet.svg";
import { TbCaretUpDownFilled } from "react-icons/tb";
import { useRouter } from "next/navigation";
import axiosInstance from "../auth";
import Loader from "../components/Loader";
import { saveAs } from "file-saver";
import { parse } from "json2csv";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../public/style/pagination.css";

const API_SESSION_ID = process.env.NEXT_PUBLIC_ONBOARDING_SESSION_ID;

export default function TeacherStudentList({
  setCallApi,
  allData,
  schoolId,
  schoolName,
  schoolCode,
  board,
  setIsLoader,
  isLoader,
  setAppliedFilters,
  appliedFilters,
  sectionId,
  onboardingStatusApplied,
  setOnboardingStatusApplied,
  rolevalue,
  setSectionId,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize
}) {
  const teacherCount = allData.total_teacher_count;
  const studentCount = allData.total_students_count;
  const [allStudentData, setAllStudentData] = useState([]);
  const [allTeacherData, setAllTeacherData] = useState([]);
  const [totalTeacher, setTotalTeacher] = useState(0);
  const [totalStudent, setTotalStudent] = useState(0);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [confirmTextAll, setConfirmTextAll] = useState("");
  const [typeDeleteAll, setTypeDeleteAll] = useState("");
  const [errorConfirmAll, setErrorConfirmAll] = useState(0);
  const teacherDatas = allData.teachers;
  const studentDatas = allData.students;

  const router = useRouter();
  const [classSection, setClassSection] = useState([]);
  useEffect(() => {
    setIsLoader(true);
    const apiCall = async () => {
      try {
        const response = await axiosInstance.get(
          `onboarding/schools/${schoolId}/sections_names/?session_id=${API_SESSION_ID}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status == 200) {
          const convertToValueLabel = (data) => {
            // Check if the input is an array
            if (!Array.isArray(data)) {
              console.error("Input is not an array.");
              return [];
            }

            // Convert the data
            const formattedData = data.map((item) => ({
              value: item.public_id,
              label: item.section_name,
            }));
            // Check if the array is empty
            if (formattedData.length === 0) {
              console.warn("No data found.");
              return [];
            }
            return formattedData;
          };
          const result = convertToValueLabel(response.data.data);
          setClassSection(result);
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

  useEffect(() => {
    setTotalTeacher(teacherCount);
    setTotalStudent(studentCount);
  }, [teacherCount, studentCount]);
  useEffect(() => {
    if (teacherDatas && Array.isArray(teacherDatas)) {
      const transformedDataTeacher = teacherDatas.map((teacher) => ({
        username: teacher.user_id.username,
        userid: teacher.user_id.user_id.toString(),
        firstname: teacher.user_id.first_name,
        lastname: teacher.user_id.last_name,
        classsection:
          teacher.class_course_association.length > 0
            ? teacher.class_course_association
              .map((item) => item.class_name)
              .join(",")
            : "",
        mobilenumber: teacher.user_id.phone_number, // Assuming Indian phone numbers
        email: teacher.user_id.email,
        onboardingstatus: teacher.onboarding_state ? "Sent" : "Not Sent",
        roles: teacher.user_id.roles,
      }));
      setAllTeacherData(transformedDataTeacher);
    }

    if (studentDatas && Array.isArray(studentDatas)) {
      const transformedDataStudent = studentDatas.map((student) => ({
        username: student.user_id.username,
        userid: student.user_id.user_id,
        firstname: student.user_id.first_name,
        lastname: student.user_id.last_name,
        classsection: student.class_name,
        mobilenumber: student.user_id.phone_number,
        email: student.user_id.email,
        admissionid: student.admission_number,
        onboardingstatus: student.onboarding_state ? "Sent" : "Not Sent",
        roles: student.user_id.roles,
      }));

      setAllStudentData(transformedDataStudent);
    }
  }, [teacherDatas, studentDatas]);
  const [isTeacherView, setIsTeacherView] = useState(false); // Toggle between student and teacher view
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  useEffect(() => {
    setIsTeacherView(rolevalue == 2 ? true : false);
  }, [rolevalue]);

  // Filter the data based on search query
  const filteredData = useMemo(() => {
    const dataToFilter = isTeacherView ? allTeacherData : allStudentData;
    return dataToFilter.filter((item) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        item.firstname.toLowerCase().includes(searchLower) ||
        item.lastname.toLowerCase().includes(searchLower) ||
        item.username.toLowerCase().includes(searchLower) ||
        item.email.toLowerCase().includes(searchLower) ||
        item.userid.searchLower
      );
    });
  }, [searchQuery, allStudentData, allTeacherData, isTeacherView]);

  const columns = useMemo(() => {
    return isTeacherView
      ? teacherColumns(
        setCallApi,
        schoolId,
        schoolName,
        schoolCode,
        board,
        setIsLoader
      )
      : studentColumns(
        setCallApi,
        schoolId,
        schoolName,
        schoolCode,
        board,
        setIsLoader
      );
  }, [isTeacherView, schoolName]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    state: { selectedRowIds },
  } = useTable(
    {
      columns,
      data: filteredData, // Use filtered data here
    },
    useSortBy, // Sorting hook
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <input
              type="checkbox"
              {...getToggleAllRowsSelectedProps()}
              style={{ marginLeft: "10px", marginTop: "5px" }}
            />
          ),
          Cell: ({ row }) => (
            <input
              type="checkbox"
              {...row.getToggleRowSelectedProps()}
              style={{ marginLeft: "10px", marginTop: "5px" }}
            />
          ),
        },
        ...columns,
      ]);
    }
  );

  const selectedUserIds = selectedFlatRows.map((row) => row.original.userid);
  const handleGoBack = () => {
    setIsLoader(true);
    router.back();
  };

  const handleModalClose = () => {
    setShowDeleteModal(false);
    setShowModal(false);
  };

  const handleUserActionAll = async (action) => {
    setConfirmTextAll("");
    setErrorConfirmAll(0);
    setTypeDeleteAll(action);
    setShowDeleteModal(false);
    setShowModal(true);
  };

  const handleDeleteAll = async () => {
    setIsLoader(true);
    let matchStringAll = `${typeDeleteAll} ${schoolName}`;
    if (matchStringAll == confirmTextAll) {
      try {
        let data = {
          user_ids: selectedUserIds,
          action: typeDeleteAll.toUpperCase(),
        };
        // Make the API call with axios
        const response = await axiosInstance.post(
          "onboarding/user/delete/",
          data, // data payload goes here as the second argument
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status == 200) {
          setCallApi((prev) => (prev == 0 ? 1 : 0));
        } else {
          console.error(`Failed to ${typeDeleteAll} user`);
        }
        setIsLoader(false);
      } catch (error) {
        setIsLoader(false);
        console.error("An error occurred:", error);
      }
      setIsLoader(false);
      setShowModal(false);
    } else {
      setIsLoader(false);
      setErrorConfirmAll(1);
    }
  };
  const handleCreateUserOne = () => {
    setIsLoader(true);
    router.push(
      `/onboarding/userdashboard/createuser?schoolEditId=${schoolId}&schoolName=${schoolName}&schoolCode=${schoolCode}&schoolBoard=${board}`
    );
  };

  const handlereshuffle = () => {
    setIsLoader(true);
    router.push(
      `/onboarding/userdashboard/reshufflestudent?schoolEditId=${schoolId}&schoolName=${schoolName}&schoolCode=${schoolCode}&schoolBoard=${board}&sectionid=${sectionId}`
    );
  };

  const handlepromotion = () => {
    setIsLoader(true);
    router.push(
      `/onboarding/userdashboard/promotion?schoolEditId=${schoolId}&schoolName=${schoolName}&schoolCode=${schoolCode}&schoolBoard=${board}`
    );
  };


  const handleExport = async () => {

    // setAppliedFilters([...selectedClasses]); // Persist the selection

    // setOnboardingStatusApplied(onboardingStatus);

    // appliedFilters;
    // onboardingStatusApplied;

    let user_role = isTeacherView ? "teacher" : "student";

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
    let apiUrl = `/onboarding/export/users/?session_id=${API_SESSION_ID}&dumy_users=false&school_id=${schoolId}&user_role=${user_role}`;

    // if (sectionId > 0 && class_id) {
    //   apiUrl += `&class_id=${class_id}`;
    // } else if (sectionId > 0) {
    //   apiUrl += `&class_id=${sectionId}`;
    // } else

    if (class_id) {
      apiUrl += `&class_id=${class_id}`;
    }

    if (status) {
      apiUrl += `&onboarding_state=${onboarding_state}`;
    }
    try {
      // Make API call to get user data in JSON format
      const response = await axiosInstance.get(
        apiUrl
      );
      // Check if response is successful
      if (response.status == 200) {
        // Convert JSON data to CSV
        const csvData = parse(response.data.data); // Assuming the response data is an array of user data
        // Create a Blob object and trigger download
        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, `${user_role}_data.csv`); // Save as "user_data.csv"
      } else {
        console.error("Error fetching data:", response.status);
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  const handleOnboardingMessage = async () => {
    setIsLoader(true);
    let user_role = isTeacherView ? "teacher" : "student";
    let users_id = selectedUserIds.length > 0 ? selectedUserIds.join(",") : "";

    try {
      // Make API call to get user data in JSON format
      const response = await axiosInstance.post(
        `onboarding/send-onboarding-message/?user_ids=${users_id}&user_role=${user_role}`
      );
      // Check if response is successful
      if (response.status == 200) {
        // Convert JSON data to CSV
        setIsLoader(false);
        toast.success(response.data.message, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          onClose: () => { },
        });
      } else {
        console.error("Error fetching data:", response.status);
      }
    } catch (error) {
      setIsLoader(false);
      let err_msg = 'Internal Server Error'
      if(error){
         err_msg =error.message;
      }
      toast.error(err_msg, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        onClose: () => { },
      });
      console.error("Error during API call:", error);
    }
    setTimeout(() => {
      setCallApi((prev) => (prev === 0 ? 1 : 0));
    }, 4000); // 4000 milliseconds = 4 seconds
  };

  const totalPages = useMemo(() => {
    if (allData && allData.pagination && allData.pagination.total_pages) {
      return isTeacherView 
        ? allData.pagination.total_pages.teachers || 1 
        : allData.pagination.total_pages.students || 1;
    }
    return 1;
  }, [allData, isTeacherView]);

  const totalItems = useMemo(() => {
    return isTeacherView ? totalTeacher : totalStudent;
  }, [isTeacherView, totalTeacher, totalStudent]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setIsLoader(true);
      setCurrentPage(newPage);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (e) => {
    let newSize;
    // Check if e is an event object or a direct number value
    if (e && e.target && e.target.value) {
      newSize = parseInt(e.target.value);
    } else if (typeof e === 'number') {
      newSize = e;
    } else {
      newSize = 10; // Default fallback value
    }
    
    setIsLoader(true);
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Render the pagination UI
  const renderPagination = () => {
    if (!allData || !allData.pagination) return null;
    if (totalPages <= 1 && totalItems <= pageSize) return null;
    
    let pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      pages.push(1);
      
      if (currentPage > 2) {
        pages.push(currentPage - 1);
      }
      
      if (currentPage !== 1 && currentPage !== totalPages) {
        pages.push(currentPage);
      }
      
      if (currentPage < totalPages - 1) {
        pages.push(currentPage + 1);
      }
      
      pages.push(totalPages);
      
      // Remove duplicates and sort
      pages = Array.from(new Set(pages)).sort((a, b) => a - b);
      
      // Add ellipses where there are gaps 
      const pagesWithEllipses = [];
      for (let i = 0; i < pages.length; i++) {
        pagesWithEllipses.push(pages[i]);
        
        if (i < pages.length - 1 && pages[i + 1] - pages[i] > 1) {
          pagesWithEllipses.push('...');
        }
      }
      
      pages = pagesWithEllipses;
    }
    
    return (
      <div className="pagination-container">
        <div className="pagination-controls">
          <button 
            className="pagination-button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FaChevronLeft />
          </button>
          
          {pages.map((page, index) => 
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
            ) : (
              <button
                key={`page-${page}`}
                className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            )
          )}
          
          <button 
            className="pagination-button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <FaChevronRight />
          </button>
        </div>
        
        <div className="pagination-info">
          <span>
            Showing {isTeacherView ? allTeacherData.length : allStudentData.length} of {totalItems} {isTeacherView ? 'teachers' : 'students'}
          </span>
          <select 
            value={pageSize}
            onChange={handlePageSizeChange}
            className="pagination-size-selector"
          >
            {[5, 10, 20, 50].map(size => (
              <option key={`size-${size}`} value={size}>
                {size} per page
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  return (
    <div className="right_content">
      {/* Header for switching between Student and Teacher View */}
      <div className="sch-creation-container">
        <div className="left-section">
          <button
            onClick={handleGoBack}
            className="link-button"
            style={{ border: "none", backgroundColor: "transparent" }}
          >
            <FaArrowLeft />
          </button>
          <span>Edit User</span>
        </div>

        <div className="right-section" style={{ width: "auto" }}>
          <button
            onClick={handleCreateUserOne}
            className="download-template-btn"
            style={{ padding: "5px 15px" }}
          >
            <IoAddSharp />
            Add User
          </button>
        </div>
      </div>
      {isFilterOpen && (
        <div className="overlay active" onClick={toggleFilter}></div>
      )}
      {isFilterOpen && (
        <FilterBox
          toggleFilter={toggleFilter}
          appliedFilters={appliedFilters}
          setAppliedFilters={setAppliedFilters}
          classOptions={classSection}
          setCallApi={setCallApi}
          sectionId={sectionId}
          onboardingStatusApplied={onboardingStatusApplied}
          setOnboardingStatusApplied={setOnboardingStatusApplied}
          setSectionId={setSectionId}
          setCurrentPage={setCurrentPage}
        />
      )}

      {/* Create Table Header */}
      <div className="creation-wreaper">
        <div className="create-classSection" style={{ margin: "10px 0" }}>
          <div className="class-form">
            <div
              className="school-info"
              style={{ border: "none", marginBottom: "0", paddingBottom: "0" }}
            >
              <div className="info-item">
                <span className="info-item-up">School Name</span>
                <span className="info-item-down">{schoolName}</span>
              </div>
              <div className="info-item">
                <span className="info-item-up">School Code</span>
                <span className="info-item-down">{schoolCode}</span>
              </div>
              <div className="info-item">
                <span className="info-item-up">Board</span>
                <span className="info-item-down">{board}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Toggle between Students and Teachers */}

        <div
          className="create-classSection"
          style={{ margin: "10px 0", padding: "10px 10px 0" }}
        >
          <div className="toggle-header">
            <span
              className={!isTeacherView ? "active-toggle" : ""}
              onClick={() => setIsTeacherView(false)}
              style={{ marginRight: "20px" }}
            >
              Student - {totalStudent}
            </span>

            <span
              className={isTeacherView ? "active-toggle" : ""}
              onClick={() => setIsTeacherView(true)}
              style={{ cursor: "pointer" }}
            >
              Teacher - {totalTeacher}
            </span>
          </div>
        </div>
        {/* Filter and search inputs */}
        <div className="table_head" style={{ paddingTop: "0" }}>
          <p>
            {isTeacherView
              ? `Total Teachers (${totalTeacher})`
              : `Total Students (${totalStudent})`}
          </p>

          <div className="table_head_right" style={{ justifyContent: "right" }}>
            <div className="input-wrapper" style={{ top: "0", width: "28%" }}>
              <IoSearchOutline className="icon" />
              <input
                type="text"
                className="custom-input"
                placeholder="Search"
                value={searchQuery} // Bind the input to the searchQuery state
                onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery on input change
              />
            </div>

            <button
              onClick={toggleFilter}
              style={{ width: "100px", padding: "5px 10px" }}
            >
              <FiFilter style={{ fontSize: "20px" }} /> Filter
            </button>
            {isTeacherView ? null : (
              <>
                {/* handlereshuffle */}
                <button
                  onClick={handlereshuffle}
                  style={{
                    width: "125px",
                    padding: "5px 10px",
                    backgroundColor: "#FF8A00",
                    color: "#fff",
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    textDecoration: "none",
                    borderRadius: "5px",
                  }}
                >
                  <PiShuffleBold style={{ fontSize: "20px" }} /> Reshuffle
                </button>

                <button
                  onClick={handlepromotion}
                  style={{
                    width: "125px",
                    padding: "5px 10px",
                    backgroundColor: "#FF8A00",
                    color: "#fff",
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    textDecoration: "none",
                    borderRadius: "5px",
                  }}
                >
                  <FiTrendingUp style={{ fontSize: "20px" }} /> Promotion
                </button>
              </>
            )}
            <button
              style={{
                width: "110px",
                padding: "5px 10px",
                backgroundColor: "#FF8A00",
                color: "#fff",
              }}
              onClick={handleExport}
            >
              <MdOutlineFileDownload style={{ fontSize: "20px" }} /> Export
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div
          className="table-wrapper"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          <table {...getTableProps()} className="table">
            <thead>
              {headerGroups.map((headerGroup, headerGroupIndex) => (
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  key={headerGroupIndex}
                >
                  {headerGroup.headers.map((column, columnIndex) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      key={columnIndex}
                    >
                      <div className="th-content">
                        {column.render("Header")}
                        {/* Only show sorting icons for specific columns */}
                        {[
                          "firstname",
                          "lastname",
                          "classsection",
                          "email",
                        ].includes(column.id) && (
                            <>
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <FaCaretDown />
                                ) : (
                                  <FaCaretUp />
                                )
                              ) : (
                                <TbCaretUpDownFilled />
                              )}
                            </>
                          )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()} className="tbody_scroll">
              {rows.map((row, rowIndex) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} key={rowIndex}>
                    {row.cells.map((cell, cellIndex) => (
                      <td {...cell.getCellProps()} key={cellIndex}>
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Add Pagination Controls here */}
        {renderPagination()}

        {Object.keys(selectedRowIds).length > 0 && (
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
          >
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="saveButton"
              style={{ 
                display: "flex",
                gap: "10px",
                marginLeft: "10px",
                alignItems: "center",
                color: "#E95436",
                fontSize: "13px",
              }}
            >
              <Image
                src={redDelete}
                alt="Delete"
                width={20}
                height={20}
                style={{ cursor: "pointer", marginLeft: "10px" }}
              />
              Delete Selected
            </button>
            <button 
              onClick={() => handleOnboardingMessage()}
              className="nextButton"
              style={{ width: "250px" }}
            >
              Send Onboarding Message
            </button>
            <ToastContainer
              position="bottom-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
            {showDeleteModal && (
              <div className="modal-overlay" onClick={handleModalClose}>
                <div
                  className="delete-modal"
                  style={{ width: "400px" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2
              style={{ 
                      width: "300px",
                      margin: "30px auto",
                      textAlign: "center",
                      marginBottom: "50px",
                    }}
                  >
                    What action would you like to take with the user?
                  </h2>
                  <div
                    className="modal-actions"
                    style={{ justifyContent: "center" }}
                  >
                    <button
                      className="confirm-btn"
                      style={{ borderRadius: "5px", margin: "5px" }}
                      onClick={() => {
                        handleUserActionAll("Delete");
                      }}
                    >
                      {" "}
                      Delete{" "}
            </button>
            <button 
                      className="confirm-btn"
                      style={{ borderRadius: "5px", margin: "5px" }}
                      onClick={() => {
                        handleUserActionAll("Suspend");
                      }}
                    >
                      {" "}
                      Suspend{" "}
                    </button>
                    <button
                      className="confirm-btn"
                      style={{ borderRadius: "5px", margin: "5px" }}
                      onClick={() => {
                        handleUserActionAll("Reactivate");
                      }}
                    >
                      {" "}
                      Reactivate{" "}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {showModal && (
              <>
                <div className="modal-overlay" onClick={handleModalClose}>
                  <div
                    className="delete-modal"
                    style={{ width: "400px" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h2>{`${typeDeleteAll} Users ? `}</h2>
                    {/* <p>
                      Your Users will be permanently deleted with no chance of
                      recovery. this cannot be undone.
                    </p> */}

{typeDeleteAll == 'Suspend' ? (
  <p>
   {`Your Users will be removed from all the classes they are currently assigned to.`}
  </p>
) : typeDeleteAll == 'Reactivate' ? (
  <p>
    {`To reactivate this User, you must assign them to at least one class.`}
  </p>
) : (
  <p>
    {`Your Users will be permanently deleted with no chance of recovery. This cannot be undone.`}
  </p>
)}
                    <p>
                      Type <strong>{`${typeDeleteAll} ${schoolName}`}</strong>{" "}
                      to confirm:
                    </p>

                    <input
                      type="text"
                      value={confirmTextAll}
                      onChange={(e) => setConfirmTextAll(e.target.value)}
                      placeholder="Type above message"
                      className="confirm-input"
              style={{ 
                        margin: "0px",
                        borderColor: errorConfirmAll == 1 ? "red" : "",
                      }}
                    />

                    {errorConfirmAll == 1 && (
                      <div style={{ textAlign: "right", color: "red" }}>
                        Schoolname does not match
                      </div>
                    )}

                    <div
                      className="modal-actions"
                      style={{ marginTop: "10px" }}
                    >
                      <button onClick={handleModalClose} className="cancel-btn">
                        Cancel
            </button>
                      <button onClick={handleDeleteAll} className="confirm-btn">

                      {typeDeleteAll == 'Suspend' ? 'Suspend' : typeDeleteAll == 'Reactivate' ? 'Reactivate' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {isLoader ? <Loader /> : ""}
    </div>
  );
}

// Columns for Student and Teacher tables
const studentColumns = (
  setCallApi,
  schoolId,
  schoolName,
  schoolCode,
  board,
  setIsLoader
) => [
    {
      Header: "User Name",
      accessor: "username",
    },
    {
      Header: "User ID",
      accessor: "userid",
    },
    {
      Header: "First Name",
      accessor: "firstname",
    },
    {
      Header: "Last Name",
      accessor: "lastname",
    },
    {
      Header: "Class - Section",
      accessor: "classsection",
    },
    {
      Header: "Mobile Number",
      accessor: "mobilenumber",
    },
    {
      Header: "Email ID",
      accessor: "email",
    },
    {
      Header: "Admission ID",
      accessor: "admissionid",
    },
    {
      Header: "Onboarding Status",
      accessor: "onboardingstatus",

      Cell: ({ row }) => {
        // Access the 'created' value from the row's original data
        const isCreated = row.original.onboardingstatus == "Sent" ? true : false;
        // Return the JSX based on the condition
        return (
          <div>
            {isCreated ? (
              <div>
                <span
                  className="status-dot"
                  style={{ backgroundColor: "#6FCF97", marginRight: "10px" }}
                ></span>
                Sent
              </div>
            ) : (
              <div>
                <span
                  className="status-dot"
                  style={{ backgroundColor: "#DC1500", marginRight: "10px" }}
                ></span>
                Not Sent
              </div>
            )}
          </div>
        );
      },
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: ({ row }) => (
        <ActionMenu
          row={row}
          setCallApi={setCallApi}
          schoolId={schoolId}
          schoolName={schoolName}
          schoolCode={schoolCode}
          board={board}
          setIsLoader={setIsLoader}
        />
      ), // Pass props
    },
  ];
const teacherColumns = (
  setCallApi,
  schoolId,
  schoolName,
  schoolCode,
  board,
  setIsLoader
) => [
    {
      Header: "User Name",
      accessor: "username",
    },
    {
      Header: "User ID",
      accessor: "userid",
    },
    {
      Header: "First Name",
      accessor: "firstname",
    },
    {
      Header: "Last Name",
      accessor: "lastname",
    },
    {
      Header: "Class - Section",
      accessor: "classsection",
    },
    {
      Header: "Mobile Number",
      accessor: "mobilenumber",
    },
    {
      Header: "Email ID",
      accessor: "email",
    },
    {
      Header: "Onboarding Status",
      accessor: "onboardingstatus",

      Cell: ({ row }) => {
        const isCreated = row.original.onboardingstatus == "Sent" ? true : false;
        // Return the JSX based on the condition
        return (
          <div>
            {isCreated ? (
              <div>
                <span
                  className="status-dot"
                  style={{ backgroundColor: "#6FCF97", marginRight: "10px" }}
                ></span>
                Sent
              </div>
            ) : (
              <div>
                <span
                  className="status-dot"
                  style={{ backgroundColor: "#DC1500", marginRight: "10px" }}
                ></span>
                Not Sent
              </div>
            )}
          </div>
        );
      },
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: ({ row }) => (
        <ActionMenu
          row={row}
          setCallApi={setCallApi}
          schoolId={schoolId}
          schoolName={schoolName}
          schoolCode={schoolCode}
          board={board}
          setIsLoader={setIsLoader}
        />
      ), // Pass props
    },
  ];

const FilterBox = ({
  toggleFilter,
  appliedFilters,
  setAppliedFilters,
  classOptions,
  setCallApi,
  sectionId,
  onboardingStatusApplied,
  setOnboardingStatusApplied,
  setSectionId,
  setCurrentPage
}) => {


  // State for managing "Sent" and "Not Sent" checkboxes
  const [onboardingStatus, setOnboardingStatus] = useState({
    sent: onboardingStatusApplied?.sent || false,
    notSent: onboardingStatusApplied?.notSent || false,
  });

  const [searchTerm, setSearchTerm] = useState("");
  let sectionDefault = sectionId ? [parseInt(sectionId)] : [];
  // Initialize the selectedClasses with appliedFilters or default to [31]
  const [selectedClasses, setSelectedClasses] = useState(
    appliedFilters.length > 0 ? appliedFilters : []
  ); // Default to 31 (Class 6B)
  const [showMoreClasses, setShowMoreClasses] = useState(false);

  // Filter classes based on search term
  const filteredClasses = classOptions.filter((classOption) =>
    classOption.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Handle checkbox selection
  const handleCheckboxChange = (value) => {
    setSelectedClasses((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((item) => item !== value)
        : [...prevSelected, value]
    );
  };


  // Handle onboarding status change
  const handleStatusChange = (status) => {
    setOnboardingStatus((prevStatus) => ({
      ...prevStatus,
      [status]: !prevStatus[status],
    }));
  };

  // Handle Apply
  const handleApply = () => {
    if ([...selectedClasses].length > 0) {
      setCallApi((prev) => (prev === 0 ? 1 : 0));
    }
    setSectionId(0);
    setAppliedFilters([...selectedClasses]); // Persist the selection
    setOnboardingStatusApplied(onboardingStatus);
    setCurrentPage(1); // Reset to first page when applying filters
    toggleFilter(); // Close the modal
  };

  // Handle Reset
  const handleReset = () => {
    setSearchTerm("");
    setCallApi((prev) => (prev === 0 ? 1 : 0));
    setAppliedFilters([]);
    setSelectedClasses([]); // Reset to default selection (Class 6B)
    setOnboardingStatusApplied({ sent: false, notSent: false }); // Reset onboarding status
    setOnboardingStatus({ sent: false, notSent: false });
    setSectionId(0);
    setCurrentPage(1); // Reset to first page when resetting filters
  };

  return (
    <div className="filter-box">
      <div className="filter-header">
        <span>Filter</span>
        <button onClick={toggleFilter} className="filter-cross">
          &#10006;
        </button>
      </div>

      <div className="filter-body-1">
        <label>Onboarding Status </label>
        <div className="filter-options">
          <label>
            <input
              type="checkbox"
              checked={onboardingStatus.sent}
              onChange={() => handleStatusChange("sent")}
            />
            Sent
          </label>
          <label>
            <input
              type="checkbox"
              checked={onboardingStatus.notSent}
              onChange={() => handleStatusChange("notSent")}
            />
            Not Sent
          </label>
        </div>
      </div>

      <div className="filter-body" style={{ marginTop: "0px" , marginBottom:'50px' }}>
        <label>Class</label>
        <div className="input-wrapper">
          <IoSearchOutline className="icon" />
          <input
            type="text"
            className="custom-input"
            placeholder="Search class"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-options">
          {filteredClasses
            .slice(0, showMoreClasses ? filteredClasses.length : 5) // Show more functionality
            .map((classOption, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  value={classOption.value}
                  checked={selectedClasses.includes(classOption.value)} // Retain checkbox state
                  onChange={() => handleCheckboxChange(classOption.value)}
                />
                {classOption.label}
              </label>
            ))}
          {filteredClasses.length > 5 && ( // Only show the button if there are more than 5 items
            <div className="show-more-container">
            <button 
                className="show-more-btn"
                onClick={() => setShowMoreClasses(!showMoreClasses)}
              >
                {showMoreClasses ? "Show Less" : "Show More"}
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="filter-footer">
        <button onClick={handleReset}>Reset</button>
        <button onClick={handleApply}>Apply</button>
      </div>
    </div>
  );
};

// ActionMenu Component
const ActionMenu = ({
  row,
  setCallApi,
  schoolId,
  schoolName,
  schoolCode,
  board,
  setIsLoader,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [typeDelete, setTypeDelete] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errorconfirm, setErrorConfirm] = useState(0);
  const sectionName = row.original.classsection;
  // Use section for the delete confirmation
  const userid = row.original.userid;
  const role = row.original.roles;
  const username = row.original.username;
  // setCallApi(6);
  const handleDelete = async () => {
    setIsLoader(true);
    setShowDeleteModal(false);

    let matchString = `${typeDelete} ${username}`;
    if (matchString == confirmText) {
      try {
        let data = {
          user_ids: [userid],
          action: typeDelete.toUpperCase(),
        };
        // Make the API call with axios
        const response = await axiosInstance.post(
          "onboarding/user/delete/",
          data, // data payload goes here as the second argument
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status == 200) {
          setIsLoader(false);
          toast.success(response.data.message, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            onClose: () => { },
          });
          setTimeout(() => {
            setCallApi((prev) => (prev === 0 ? 1 : 0));
          }, 4000);
        } else {
          setIsLoader(false);
          console.error(`Failed to ${typeDelete} user`);
        }
      } catch (error) {
        setIsLoader(false);
        toast.error(error.message, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          onClose: () => { },
        });
        console.error("An error occurred:", error);
      }
      setIsLoader(false);
      setShowModal(false);
    } else {
      setIsLoader(false);
      setErrorConfirm(1);
    }
  };

  const handleModalClose = () => {
    setShowDeleteModal(false);
    setShowModal(false);
  };

  const handleUserAction = async (action) => {
    setConfirmText("");
    setErrorConfirm(0);
    setTypeDelete(action);
    setShowDeleteModal(false);
    setShowModal(true);
  };

  // setIsLoader

  const router = useRouter();
  const handleUserEdit = () => {
    setIsLoader(true);
    router.push(
      `/onboarding/userdashboard/createuser?schoolEditId=${schoolId}&schoolName=${schoolName}&schoolCode=${schoolCode}&schoolBoard=${board}&user=${userid}&role=${role}`
    );
  };

  return (
    <div className="dfjc" style={{ gap: "6px" }}>
      <button className="simple-button" onClick={handleUserEdit}>
        <FiEdit3 style={{ cursor: "pointer", color: "#3B3E98" }} />
      </button>

      <Image
        src={redDelete}
        alt="Delete"
        width={20}
        height={24}
        style={{ cursor: "pointer" }}
        onClick={() => setShowDeleteModal(true)}
      />
      {showDeleteModal && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <div
            className="delete-modal"
            style={{ width: "400px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{ 
                width: "300px",
                margin: "30px auto",
                textAlign: "center",
                marginBottom: "50px",
              }}
            >
              What action would you like to take with the user?
            </h2>
            <div className="modal-actions" style={{ justifyContent: "center" }}>
              <button
                className="confirm-btn"
                style={{ borderRadius: "5px", margin: "5px" }}
                onClick={() => handleUserAction("Delete")}
              >
                {" "}
                Delete
              </button>
              <button
                className="confirm-btn"
                style={{ borderRadius: "5px", margin: "5px" }}
                onClick={() => handleUserAction("Suspend")}
              >
                {" "}
                Suspend{" "}
              </button>
              <button
                className="confirm-btn"
                style={{ borderRadius: "5px", margin: "5px" }}
                onClick={() => handleUserAction("Reactivate")}
              >
                {" "}
                Reactivate{" "}
            </button>
          </div>
        </div>
        </div>
      )}
      {showModal && (
        <>
          <div className="modal-overlay" onClick={handleModalClose}>
            <div
              className="delete-modal"
              style={{ width: "400px" }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>{`${typeDelete} User ? `}</h2>
              {/* <p>
                Your User will be permanently deleted with no chance of
                recovery. this cannot be undone.
              </p> */}

{typeDelete == 'Suspend' ? (
  <p>
   {`Your User will be removed from all the classes they are currently assigned to.`}
  </p>
) : typeDelete == 'Reactivate' ? (
  <p>
    {`To reactivate this User, you must assign them to at least one class.`}
  </p>
) : (
  <p>
    {`Your User will be permanently deleted with no chance of recovery. This cannot be undone.`}
  </p>
)}
              <p>
                Type <strong>{`${typeDelete} ${username}`}</strong>{" "}
                to confirm:
              </p>

              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type above message"
                className="confirm-input"
        style={{ 
                  margin: "0px",
                  borderColor: errorconfirm == 1 ? "red" : "",
                }}
              />

              {errorconfirm == 1 && (
                <div style={{ textAlign: "right", color: "red" }}>
                  Username does not match
                </div>
              )}

              <div
                className="modal-actions"
                style={{ marginTop: "10px" }}
              >
                <button onClick={handleModalClose} className="cancel-btn">
                  Cancel
        </button>
                <button onClick={handleDelete} className="confirm-btn">

                {typeDelete == 'Suspend' ? 'Suspend' : typeDelete == 'Reactivate' ? 'Reactivate' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
