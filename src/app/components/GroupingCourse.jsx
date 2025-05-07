"use client";
import {
  FaArrowLeft,
  FaCaretUp,
  FaCaretDown,
  FaAngleDown,
  FaAngleUp,
} from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import { TbCaretUpDownFilled } from "react-icons/tb";
import "jspdf-autotable";
import Papa from "papaparse";
import React, { useState, useCallback, useEffect } from "react";
import Select, { components } from "react-select";
import { useTable, useSortBy } from "react-table";
import Image from "next/image";
import delete_img from "../../../public/images/Delete_icon.svg";
import export_img from "../../../public/images/csvIcon.svg";
import axiosInstance from "../auth";
import { useRouter } from "next/navigation";
import Loader from "../components/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_SESSION_ID = process.env.NEXT_PUBLIC_ONBOARDING_SESSION_ID; 
export default function ClassGrouping({
  schoolId,
  schoolName,
  schoolCode,
  board,
  boardid
}) {
  const [classList, setClassList] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [sectionClass, setSectionClass] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [sectionIds, setSectionIds] = useState([]);
  const [buttonValue, setButtonValue] = useState();
  const [gradeName, setGradeName] = useState("");
  const [gradeLabel, setGradeNamelabel] = useState("");
  const [subjectLabel, setSubjectlabel] = useState("");
  const [reqValue, setReqValue] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const [sectionPublicId, setSectionPublicId] = useState(0);
  const[subjectOptionData,setSubjectOptionData] = useState([]);

  const router = useRouter();
  const customStyles = {
    control: (base) => ({
      ...base,
      width: "100%",
      padding: "8px",
      borderColor: "#ccc",
      boxShadow: "none",
      borderRadius: "5px",
      fontSize: "16px",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      "&:hover": {
        borderColor: "#ccc",
      },
    }),

    multiValue: (styles) => ({
      ...styles,
      backgroundColor: "rgba(253, 229, 202, 1)",
      color: "#ff8a00",
      borderRadius: "10px",
      border: "1px solid #ff8a00",
      margin: "2px",
    }),
    multiValueLabel: (styles) => ({
      ...styles,
      color: "#ff8a00",
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      color: "#ff8a00",
      cursor: "pointer",
      backgroundColor: "transparent",
      border: "none",
      ":hover": {
        backgroundColor: "transparent",
        color: "#ff8a00",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    clearIndicator: () => ({
      display: "none",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#ff8a00",
      padding: "0 8px",
    }),
    option: (styles, { isSelected }) => ({
      ...styles,
      backgroundColor: isSelected ? "rgba(253, 229, 202, 1)" : "#fff",
      color: isSelected ? "#ff8a00" : "#000",
      ":hover": {
        backgroundColor: "rgba(253, 229, 202, 1)",
        color: "#ff8a00",
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: "rgba(179, 179, 179, 1)",
      fontWeight: "700",
      fontSize: "16px",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    }),
  };
  const MultiValueContainer = ({ children, ...props }) => {
    const { selectProps, data } = props;
    const selected = selectProps.value;

    if (selected.length > 2 && selected.indexOf(data) === 1) {
      return (
        <>
          <components.MultiValueContainer {...props}>
            {children}
          </components.MultiValueContainer>
          <span
            style={{ marginLeft: "5px", color: "#ff8a00", fontSize: "12px" }}
          >
            +{selected.length - 2} More
          </span>
        </>
      );
    }

    return selected.indexOf(data) < 2 ? (
      <components.MultiValueContainer {...props}>
        {children}
      </components.MultiValueContainer>
    ) : null;
  };

  const handleSelectChange = (selectedOptions) => {
    // Check if "Select All" is in the selected options before the update
    const previouslySelected = subjects.some(
      (option) => option.value == "select_all"
    );
    // If "Select All" is currently selected
    const hasSelectAll = selectedOptions.some(
      (option) => option.value == "select_all"
    );

    if (hasSelectAll) {
      // If "Select All" is selected, update to select all sections (excluding "Select All")
      const allSelected = selectedOptions.length !== sectionClass.length; // Check if not all sections are selected
      const updatedOptions = sectionClass;
      setSubjects(updatedOptions); // Set selected subjects (all or none)
      const filteredOptions = updatedOptions.filter(
        (option) => option.value !== "select_all"
      );
      const valuesArray = filteredOptions.map((option) => option.value);
      setSectionIds(valuesArray);
    } else {
      // Normal case: Select specific options without "Select All"
      setSubjects(selectedOptions); // Set selected sections
      const filteredOptions = selectedOptions.filter(
        (option) => option.value !== "select_all"
      );
      const valuesArray = filteredOptions.map((option) => option.value);
      setSectionIds(valuesArray);
    }
    // Check if "Select All" has been deselected
    if (previouslySelected && !hasSelectAll) {
      setSectionIds([]);
      setSubjects([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (buttonValue == 1) {
      setIsLoader(true);
      const school_id = Number(schoolId);
      const formData = {
        school_id,
        course_name: courseName,
        subject: subjectName,
        grade: gradeName,
        section_ids: sectionIds, // Rename subjectArray if needed
        session_id:API_SESSION_ID
      };

      const createSection = async () => {
        try {
          const response = await axiosInstance.post(
            "onboarding/courses/create/",
            formData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          setReqValue((prev) => (prev == 0 ? 1 : 0));
          setIsLoader(false);
          if (
            response.data.status_code == 201 ||
            response.data.status_code == 200
          ) {

            toast.success(response.data.message, {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              onClose: () => {},
            });
          }
          // Handle success (e.g., show a success message or redirect)
        } catch (error) {
          setReqValue((prev) => (prev == 0 ? 1 : 0));
          setIsLoader(false);
          toast.error(error.response.data.message, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            onClose: () => {},
          });
          console.error(
            "Error calling API:",
            error.response?.data || error.message
          );
          // Handle error (e.g., show an error message)
        }
      };
      setCourseName("");
      setSectionClass([]);
      setSubjects([]);
      setGradeName("");
      setGradeNamelabel(null);
      setSubjectName("");
      setSubjectlabel(null);
      createSection();
    } else if (buttonValue == 0) {
      setIsLoader(true);
      const formData = {
        course_name: courseName,
        section_ids: sectionIds, // Rename subjectArray if needed
      };

      const editcourselist = async () => {
        try {
          const response = await axiosInstance.put(
            `onboarding/courses/${sectionPublicId}/edit/`,
            formData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          setReqValue((prev) => (prev == 0 ? 1 : 0));
          setIsLoader(false);
          if (
            response.data.status_code == 201 ||
            response.data.status_code == 200 || response.status == 200
          ) {
            toast.success(response.data.message, {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              onClose: () => {},
            });
          }
          // Handle success (e.g., show a success message or redirect)
        } catch (error) {
          setReqValue((prev) => (prev == 0 ? 1 : 0));
          setIsLoader(false);
          toast.error(error.response.data.message || error.message, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            onClose: () => {},
          });

          console.error(
            "Error calling API:",
            error.response?.data || error.message
          );
          // Handle error (e.g., show an error message)
        }
      };
      setEditingIndex(null);
      editcourselist();
      setCourseName("");
      setSectionClass([]);
      setSubjects([]);
      setGradeNamelabel(null);
      setSubjectlabel(null);
    }
  };

  const handleDeleteClass = useCallback(
    (classIndex, rowIndex) => {
      const updatedClassList = [...classList];
      updatedClassList[rowIndex].className = updatedClassList[
        rowIndex
      ].className.filter((_, i) => i !== classIndex);
    },
    [classList]
  );

  const handleDelete = useCallback((rowData) => {
    setDeleteIndex(rowData);
    setDeleteModalVisible(true); // Show the delete confirmation modal
  }, []);

  const confirmDelete = async (e) => {
    const deleteIndex = e.target.value; // Get the value of the button
    try {
      // Call the API to delete the class from the backend
     const response = await axiosInstance.delete(`onboarding/course/${deleteIndex}/delete/`, {
        headers: {
          // 'Content-Type': 'application/json',
        },
      });
      setReqValue((prev) => (prev == 0 ? 1 : 0));
      // toast.success(response.data.message, {
      //   position: "bottom-center",
      //   autoClose: 5000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   theme: "colored",
      //   onClose: () => {},
      // });
      // setReqValue((prev) => (prev == 0 ? 1 : 0));
    } catch (error) {
      setReqValue((prev) => (prev == 0 ? 1 : 0));
      toast.error(error.message, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        onClose: () => {},
      });
      // setReqValue((prev) => (prev == 0 ? 1 : 0));
      console.error("Error deleting class:", error);
      // Handle the error (show a message to the user, log it, etc.)
    }finally{
      // setReqValue((prev) => (prev == 0 ? 1 : 0));
    }
    setDeleteModalVisible(false);
    setDeleteIndex(null);
  };
  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setDeleteIndex(null);
  };

  const handleEdit = useCallback(
    (index) => {
      setSectionPublicId(index.courseId);
      const coursename = index.courseName;
      const subjectname = index.subject;
      const subjectid = index.subjectid;
      const subjectObject = {
        value: subjectid, // Set value to the original string
        label: subjectname, // Set label to the original string
      };
      setSubjectlabel(subjectObject);
      // Function to extract the first number from sections
      const extractFirstNumber = (sectionsString) => {
        const regex = /\d+/; // Regular expression to find the first digit sequence
        const match = sectionsString.match(regex); // Returns the first match or null
        return match ? match[0] : null; // Return the first number or null if no match
      };

      const firstNumber = extractFirstNumber(index.sections);
      const setgradevalue = `Class ${firstNumber}`;
      const classObject = {
        value: firstNumber, // Set value to the original string
        label: setgradevalue, // Set label to the original string
      };
      setGradeNamelabel(classObject);
      setCourseName(coursename);
      const sectionss = index.sections;
      const getSection = async () => {
        try {
          const response = await axiosInstance.get(
            `onboarding/sections/?school_id=${schoolId}&grade=${firstNumber}&subject=${subjectid}&session_id=${API_SESSION_ID}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.status == 200 && response.data.data.length > 0) {
            const sections = response.data.data.map((section) => ({
              value: section.public_id,
              label: section.section_name,
            }));
            sections.unshift({ value: "select_all", label: "Select All" });
            setSectionClass(sections);
            // Split sections string into individual classes
            const selectedLabels = sectionss
              .split(", ")
              .map((sectionnew) => sectionnew.trim());
            // Find and set existing classes as selected
            const preSelectedClasses = sections.filter((option) =>
              selectedLabels.includes(option.label)
            );
            setSubjects(preSelectedClasses);
            const valuesArray = preSelectedClasses.map(
              (option) => option.value
            );
            setSectionIds(valuesArray);
          } else {
            setSectionClass([]);
          }
          // Handle success (e.g., show a success message or redirect)
        } catch (error) {
          console.error("Error calling API:", error);
          // Handle error (e.g., show an error message)
        } finally {
        }
      };
      setEditingIndex((prevIndex) => {
        if (prevIndex === null) {
          getSection();
          return index; // Set the index for editing
        } else if (prevIndex === index) {
          setCourseName("");
          setSectionClass([]);
          setSubjects([]);
          setGradeNamelabel("");
          setSubjectlabel("");
          return null; // Deselect the item if it's already selected for editing
        } else {
          getSection();
          return index; // Set a new index for editing
        }
      });
    },
    [schoolId]
  );
  const handleExportCSV = () => {
    const csvData = classList.map((item) => ({
      CourseID: item.courseId,
      courseCode: item.courseCode,
      CourseName: item.courseName,
      Subject: item.subject,
      Class: item.sections, // Use the full sections string
      Status: item.is_chapter_added ? "Created" : "Not Created",
    }));
    // Convert the csvData to a CSV string using Papa.unparse
    const csvString = Papa.unparse(csvData);
    // Create a Blob from the CSV string
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    // Create a link element to trigger the download
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "Grouped-Courses.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // const subjectOptions = [
  //   { value: "Math", label: "Math" },
  //   { value: "Science", label: "Science" },
  //   { value: "Art", label: "Art" },
  // ];

  const classGrade = JSON.parse(localStorage.getItem("gradeOptions"));
  const gradeOptions = classGrade;

  const columns = React.useMemo(
    () => [
      {
        Header: "Course Code",
        accessor: "courseCode",
        sortType: "basic",
      },
      {
        Header: "Course Name",
        accessor: "courseName",
        sortType: "basic",
      },
      {
        Header: "Class",
        accessor: "sections",
        Cell: ({ row }) => <ClassroomCell classroom={row.original.sections} />,
        disableSortBy: true,
      },
      {
        Header: "Subject",
        accessor: "subject",
        sortType: "basic",
      },
      {
        Header: "Status",
        accessor: "created",
        Cell: ({ row }) => {
          // Access the 'created' value from the row's original data
          const isCreated = row.original.created;
          // Return the JSX based on the condition
          return (
            <div>
              {isCreated ? (
                <div>
                  <span
                    className="status-dot"
                    style={{ backgroundColor: "#6FCF97", marginRight: "10px" }}
                  ></span>
                  Created
                </div>
              ) : (
                <div>
                  <span
                    className="status-dot"
                    style={{ backgroundColor: "#DC1500", marginRight: "10px" }}
                  ></span>
                  Not Created
                </div>
              )}
            </div>
          );
        },
        sortType: "basic",
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => {
          const handleClickEdit = () => {
            handleEdit(row.original); // Edit action
            // Scroll to the create-classSection div
            const classSection = document.querySelector(".create-classSection");
            if (classSection) {
              classSection.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          };

          return (
            <>
              <FiEdit3
                style={{ color: "rgba(97, 102, 174, 1)", cursor: "pointer" }}
                onClick={handleClickEdit}
              />
              <Image
                src={delete_img}
                alt="Delete"
                width={20}
                height={20}
                style={{ cursor: "pointer", marginLeft: "10px" }}
                onClick={() => handleDelete(row.original.courseId)} // Trigger the confirmation modal
              />
            </>
          );
        },
        disableSortBy: true,
      },
    ],
    [handleDelete, handleEdit, handleDeleteClass]
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: classList,
      },
      useSortBy
    );
  const ClassroomCell = ({ classroom }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleExpand = () => setIsExpanded(!isExpanded);
    const classroomItems = classroom.includes(", ")
      ? classroom.split(", ")
      : [classroom];

    return (
      <div
        onClick={classroomItems.length > 1 ? toggleExpand : null} // Only toggle if more than one classroom
        style={{
          cursor: classroomItems.length > 1 ? "pointer" : "default", // Pointer only if expandable
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "5px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {isExpanded ? (
            classroomItems.map((item, idx) => (
              <div key={idx} style={{ textAlign: "center" }}>
                {item}
              </div>
            ))
          ) : classroomItems.length > 1 ? (
            <div>
              {classroomItems[0]}, +{classroomItems.length - 1} more
            </div>
          ) : (
            <div>{classroomItems[0]}</div> // Show single classroom without "more" text
          )}
        </div>
        {classroomItems.length > 1 && ( // Only show the toggle icon if more than one classroom
          <div>{isExpanded ? <FaAngleUp /> : <FaAngleDown />}</div>
        )}
      </div>
    );
  };
  useEffect(() => {
    // API call inside useEffect
    setIsLoader(true);
    const getCourseList = async () => {
      try {
        const response = await axiosInstance.get(
          `onboarding/courseslist/?session_id=${API_SESSION_ID}&school_id=${schoolId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status == 200) {
          const extractedData = response.data.data.map((item) => {
            return {
              courseId: item.course_id,
              courseCode: item.short_code,
              courseName: item.course_name,
              subject: item.subject_name,
              subjectid: item.subject,
              sections: item.sections
                .map((section) => section.section_name) // Map over sections and get each section_name
                .join(", "),
              sectionsArray: item.sections.map(
                (section) => section.section_name
              ),
              created: item.is_chapter_added, // Convert languages format
            };
          });
          setClassList(extractedData);
          setIsLoader(false);
        }
        // Handle success (e.g., show a success message or redirect)
      } catch (error) {
        // setClassList([]);
        setIsLoader(false);
        console.error("Error calling API:", error);
        // Handle error (e.g., show an error message)
      } finally {
      }
    };
    if(schoolId > 0){
    getCourseList(); // Call the API when the component mounts
    }
  }, [reqValue, schoolId]);

   useEffect(() => {
    const fetchSubjectData = async () => {
      try {
        const response = await axiosInstance.get(`/onboarding/master_config/subject/?grade=${gradeName}&board_id=${boardid}`);
        if(response.data.status == 'success') {
        // setBoardsData(response.data.data);
        const subjects = response.data.data.map((item) => ({
          label: item.subject,
          value: item.subject_id,
        }));
  
        setSubjectOptionData(subjects);
        }
      } catch (err) {
        // setError(err.message || "Something went wrong");
      } finally {
        // setLoading(false);
      }
    };
if(gradeName > 0){
    fetchSubjectData();
}
  }, [gradeName]);

  useEffect(() => {
    // API call inside useEffect
    const getSection = async () => {
      try {
        const response = await axiosInstance.get(
          `onboarding/sections/?school_id=${schoolId}&grade=${gradeName}&subject=${subjectName}&session_id=${API_SESSION_ID}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status == 200 && response.data.data.length > 0) {
          const sections = response.data.data.map((section) => ({
            value: section.public_id,
            label: section.section_name,
          }));
          sections.unshift({ value: "select_all", label: "Select All" });
          setSectionClass(sections);
        } else {
          setSectionClass([]);
        }
        // Handle success (e.g., show a success message or redirect)
      } catch (error) {
        console.error("Error calling API:", error);
        // Handle error (e.g., show an error message)
      } finally {
      }
    };
    if (gradeName && schoolId > 0 && subjectName) {
      getSection(); // Call the API when the component mounts
    }
  }, [gradeName, subjectName, schoolId]);

  const handleSelectChangelang = (selectedOptions) => {
    setSubjectlabel(selectedOptions);
    const value = Array.isArray(selectedOptions)
      ? selectedOptions.map((option) => option.value).join(", ") // If it's an array, join the values into a string
      : selectedOptions
      ? selectedOptions.value
      : ""; // If it's an object, take the value
    setSubjectName(value);
  };

  const handleSelectChangegrade = (selectedOptions) => {
    setGradeNamelabel(selectedOptions);
    const value = Array.isArray(selectedOptions)
      ? selectedOptions.map((option) => option.value).join(", ") // If it's an array, join the values into a string
      : selectedOptions
      ? selectedOptions.value
      : ""; // If it's an object, take the value
    setGradeName(value);
    setSubjectlabel('');
    setSubjects([]);
  };

  const isFormValid = () => {
    return (
      courseName &&
      gradeName !== null &&
      gradeName !== "" &&
      subjectName &&
      sectionIds.length > 0
    );
  };

  const handleGoBack = () => {
    setIsLoader(true);
    router.back();
  };

  const handleSubmitHome = () => {
    setIsLoader(true);
    router.push(`/onboarding`);
  };
  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <FaAngleDown color="#ff8a00" fontSize={"15px"} />
      </components.DropdownIndicator>
    );
  };

  return (
    <div className="right_content">
      <div className="sch-creation-container">
        <div className="left-section">
          <button className="link-button" onClick={handleGoBack}>
            <FaArrowLeft />
          </button>
          <span>Grouping Class & Course</span>
        </div>
        <div className="right-section">
          <div className="step active">
            <div className="circle tick-circle"></div>
            <span>School Creation</span>
            <div className="line active-line"></div>
          </div>
          <div className="step active">
            <div className="circle tick-circle"></div>
            <span>Class Creation</span>
            <div className="line active-line"></div>
          </div>
          <div className="step active">
            <div className="circle">3</div>
            <span>Class Grouping</span>
          </div>
        </div>
      </div>
      <div className="creation-wreaper">
        <div className="create-classSection">
          <div className="class-form">
            <div className="school-info">
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
            <form onSubmit={handleSubmit}>
              <div className="class-formRow">
                <div className="inputGroup" style={{ width: "24%" }}>
                  <label>Course Name</label>
                  <input
                    type="text"
                    name="courseName"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="Course Name"
                    className="form-input"
                  />
                </div>
                <div className="inputGroup" style={{ width: "24%" }}>
                  <label>Class</label>
                  <Select
                    name="grade"
                    value={gradeLabel}
                    onChange={handleSelectChangegrade}
                    options={gradeOptions}
                    styles={customStyles}
                    placeholder="Select Class"
                    className="dropdown-wrapper"
                    menuPosition="fixed"
                    menuShouldScrollIntoView={false}
                    isDisabled={editingIndex !== null}
                  />
                </div>
                <div className="inputGroup" style={{ width: "24%" }}>
                  <label>Subject</label>
                  <Select
                    name="subject"
                    value={subjectLabel}
                    onChange={handleSelectChangelang}
                    options={subjectOptionData}
                    styles={customStyles}
                    placeholder="Select Subject"
                    className="dropdown-wrapper"
                    menuPosition="fixed"
                    menuShouldScrollIntoView={false}
                    isDisabled={editingIndex !== null}
                  />
                </div>

                <div className="inputGroup" style={{ width: "24%" }}>
                  <label>Section</label>
                  <Select
                    name="className"
                    value={subjects}
                    onChange={handleSelectChange}
                    options={sectionClass}
                    isMulti
                    components={{ MultiValueContainer, DropdownIndicator }}
                    styles={customStyles}
                    placeholder="Select Section"
                    className="dropdown-wrapper"
                    menuPosition="fixed"
                    hideSelectedOptions={false}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="create-class-btn"
                value={editingIndex !== null ? 0 : 1}
                onClick={(e) => setButtonValue(e.target.value)}
                disabled={editingIndex !== null ? false : !isFormValid()}
              >
                {editingIndex !== null
                  ? "Update Class & Course"
                  : "Group Class & Course"}
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
            </form>
          </div>
        </div>
        {classList.length > 0 && (
          <>
            <div className="class-table-section">
              <div className="table-header">
                <span>Total Classes </span>
                <button className="export-btn" onClick={handleExportCSV}>
                  <Image
                    src={export_img}
                    alt="Export CSV"
                    width={20}
                    height={20}
                    style={{ marginRight: "8px" }}
                  />
                  Export Classes
                </button>
              </div>
              <table {...getTableProps()} className="class-table">
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr
                      {...headerGroup.getHeaderGroupProps()}
                      key={headerGroup.id}
                    >
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          key={column.id}
                        >
                          {column.render("Header")}
                          {[
                            "courseName",
                            "className",
                            "subject.label",
                            "status",
                          ].includes(column.id) && (
                            <span style={{ marginLeft: "5px" }}>
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <FaCaretDown />
                                ) : (
                                  <FaCaretUp />
                                )
                              ) : (
                                <TbCaretUpDownFilled />
                              )}
                            </span>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {rows.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()} key={row.id}>
                        {row.cells.map((cell) => (
                          <td {...cell.getCellProps()} key={cell.column.id}>
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* {showSubmitButton && ( */}
            <div className="buttonGroup">
              <div className="left"> </div>
              <div className="right">
                <button className="nextButton" onClick={handleSubmitHome}>
                  {" "}
                  Exit{" "}
                </button>
              </div>
            </div>
            {/* )} */}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalVisible && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Delete Course?</h2>
            <p>Are you sure you want to delete this course?</p>
            <div className="modal-actions">
              <button onClick={cancelDelete} className="cancel-btn">
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="confirm-btn"
                value={deleteIndex}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {isLoader ? <Loader /> : ""}
    </div>
  );
}
