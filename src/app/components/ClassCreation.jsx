"use client";
import { FaArrowLeft, FaCaretDown, FaCaretUp } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import { TbCaretUpDownFilled } from "react-icons/tb";
import "jspdf-autotable";
import Papa from "papaparse";
import React, { useEffect, useState } from "react";
import Select, { components } from "react-select";
import { useTable, useSortBy } from "react-table";
import { FaAngleDown } from "react-icons/fa";
import Image from "next/image";
import { useCallback } from "react";
import delete_img from "../../../public/images/Delete_icon.svg";
import csv_img from "../../../public/images/csvIcon.svg";
import axiosInstance from "../auth";
import { useRouter } from "next/navigation";
import Loader from "../components/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const API_SESSION_ID = process.env.NEXT_PUBLIC_ONBOARDING_SESSION_ID;
export default function ClassCreation({
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
  const [classData, setClassData] = useState([]);
  const [numSections, setNumSections] = useState("");
  const [sectionSuffix, setSectionSuffix] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [className, setClassName] = useState(null);
  const [classNameLabel, setClassNameLabel] = useState([]);
  const [gradeNumber, SetGradeNumber] = useState(null);
  const [buttonValue, setButtonValue] = useState("");
  const [reqValue, setReqValue] = useState(0);
  const [existSubject, setExistSubject] = useState([]);
  const [sectionPublicId, setSectionPublicId] = useState(0);
  const [customClassName, setCustomClassName] = useState("");
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
const[subjectOptionData,setSubjectOptionData] = useState([]);
  const handleClassNameChange = (selectedOption) => {
    const classNumber = selectedOption.value.replace(/\D/g, ""); 
    SetGradeNumber(classNumber);
    if (selectedOption && selectedOption.value === "-1") {
      setIsOtherSelected(true);
      setClassName(null);
      setClassNameLabel([{ value: "-1", label: "Other" }]);
    } else {
      setIsOtherSelected(false);
      setClassName(selectedOption ? selectedOption.value : null);
      setClassNameLabel(selectedOption ? [selectedOption] : []);
    }
  };

  const handleCustomClassChange = (event) => {
    setCustomClassName(event.target.value); // Update custom class name
  };

  const handleSubmitCustomClass = () => {
    if (customClassName.trim()) {
      const customOption = { value: customClassName, label: customClassName };
      setClassName(customClassName);
      setClassNameLabel([customOption]); // Set custom class name in select
      setIsOtherSelected(false);
      setCustomClassName(""); // Clear input field after submit
    } else {
    }
  };
  const router = useRouter();
  const handleSelectChange = (selectedOptions) => {
    // Map selected options to the desired format
    const formattedSubjects = selectedOptions
      ? selectedOptions.map((option) => ({ subject: option.label }))
      : [];
    setSubjects(selectedOptions); // Update state with formatted subjects
  };

  const handleSelectChangelang = (selectedOptions) => {
    // Extract labels from selected options and store them as an array of strings
    const selectedLanguages = selectedOptions
      ? selectedOptions.map((option) => option.label)
      : [];
    // setLanguages(selectedLanguages); // Update state with selected languages
    setLanguages(selectedOptions);
  };

  const handleGoBack = () => {
    setIsLoader(true);
    router.back();
  };

  const isFormValid = () => {
    return (
      className &&
      numSections.trim() !== "" &&
      sectionSuffix &&
      subjects.length > 0 &&
      languages.length > 0
    );
  };
  const handleExportCSV = () => {
    // Get the table rows and cells dynamically from the HTML table
    const table = document.querySelector(".class-table");
    const rows = table.querySelectorAll("tr");

    // Prepare an array to hold the table data
    const csvData = [];
    // Iterate through rows and extract cell data
    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll("th, td"); // Get both header and data cells
      const rowData = [];
      cells.forEach((cell) => {
        rowData.push(cell.innerText); // Add cell content to the rowData array
      });
      // Push the row data to the csvData array
      csvData.push(rowData);
    });

    // Convert the csvData to a CSV string using Papa.unparse
    const csvString = Papa.unparse(csvData);
    // Create a Blob from the CSV string
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    // Create a link element to trigger the download
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "Created_Classes.csv"); // Name of the downloaded file
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up
  };

  const handleDelete = useCallback((rowData) => {
    setDeleteIndex(rowData);
    setDeleteModalVisible(true); // Show the delete confirmation modal
  }, []);

  const confirmDelete = async (e) => {
    const deleteIndex = e.target.value; // Get the value of the button
    try {
      // Call the API to delete the class from the backend
      //  change delete to patch
      const response = await axiosInstance.patch(`onboarding/sections/${deleteIndex}/delete/`, {
        headers: {
          // 'Content-Type': 'application/json',
        },
      });
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
      // setReqValue((prevValue) => (prevValue == 1 ? 0 : 1));
    } catch (error) {
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
      // setReqValue((prevValue) => (prevValue == 1 ? 0 : 1));
      console.error("Error deleting class:", error);
    }finally{
      setReqValue((prevValue) => (prevValue == 1 ? 0 : 1));
    }
    setDeleteModalVisible(false);
    setDeleteIndex(null);
  };







  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setDeleteIndex(null);
  };

  const handleEdit = useCallback((rowData) => {
    const getSection = async () => {
      try {
        const response = await axiosInstance.get(
          `onboarding/sections/${rowData}/`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.status_code == 200) {
          setSectionPublicId(response.data.data.public_id);
          const options = [
            {
              value: `Class ${response.data.data.grade}`,
              label: `Class ${response.data.data.grade}`,
            },
          ];
          // const classNumber = selectedOption.value.replace(/\D/g, ""); 
          SetGradeNumber(response.data.data.grade);

          setClassNameLabel(options);
          setSectionSuffix(response.data.data.section_suffix);
          const formattedSubjects = response.data.data.subjects
            .filter((item) => item.subject) // Filter out any objects with null or empty subjects
            .map((item) => ({
              value: item.subject_id,
              label: item.subject,
            }));
          setExistSubject(formattedSubjects);
          setSubjects(formattedSubjects);
          const languagesString = response.data.data.languages.replace(
            /'/g,
            '"'
          ); // Replace single quotes with double quotes
          const languagesArray = JSON.parse(languagesString);
          const formattedLanguages = languagesArray.map((language) => ({
            value: language,
            label: language,
          }));
          setLanguages(formattedLanguages);
        }
        // Handle success (e.g., show a success message or redirect)
      } catch (error) {
        console.error("Error calling API:", error);
        // Handle error (e.g., show an error message)
      }
    };
    setEditingIndex((prevIndex) => {
      if (prevIndex === null) {
        getSection();
        return rowData; // Set the index for editing
      } else if (prevIndex === rowData) {
        setSubjects([]);
        setLanguages([]);
        setSectionSuffix("");
        return null; // Deselect the item if it's already selected for editing
      } else {
        getSection();
        return rowData; // Set a new index for editing
      }
    });
  }, []);
  // const subjectOptions = [
  //   { value: "Math", label: "Math" },
  //   { value: "Science", label: "Science" },
  //   { value: "Art", label: "Art" },
  //   { value: "Physics", label: "Physics" },
  //   { value: "Chemistry", label: "Chemistry" },
  //   { value: "Biology", label: "Biology" },
  //   { value: "Commerce", label: "Commerce" },
  //   ,
  // ];


  useEffect(() => {
    const fetchSubjectData = async () => {
      try {
        const response = await axiosInstance.get(`/onboarding/master_config/subject/?grade=${gradeNumber}&board_id=${boardid}`);
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
if(gradeNumber > 0){
    fetchSubjectData();
}
  }, [gradeNumber]);

  const languageOptions = [
    { value: "English", label: "English" },
    { value: "Hindi", label: "Hindi" },
  ];

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

    if (selected.length > 1 && selected.indexOf(data) === 0) {
      return (
        <>
          <components.MultiValueContainer {...props}>
            {children}
          </components.MultiValueContainer>
          <span
            style={{
              marginLeft: "5px",
              color: "#ff8a00",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            +{selected.length - 1} More
          </span>
        </>
      );
    }

    return selected.indexOf(data) === 0 ? (
      <components.MultiValueContainer {...props}>
        {children}
      </components.MultiValueContainer>
    ) : null;
  };

  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <FaAngleDown color="#ff8a00" fontSize={"15px"} />
      </components.DropdownIndicator>
    );
  };
  const columns = React.useMemo(
    () => [
      {
        Header: "Class Code",
        accessor: "class_code",
        id: "classCode",
        disableSortBy: true,
      },
      {
        Header: "Class Name",
        accessor: "section_name",
        id: "className",
        sortType: "basic",
      },
      {
        Header: "Grade",
        accessor: "grade",
        sortType: "basic",
      },
      {
        Header: "Subjects",
        accessor: "subjects",
        Cell: ({ value }) => {
          if (Array.isArray(value)) {
            return value.join(", ");
          }
          return value;
        },
        disableSortBy: true,
      },
      {
        Header: "Languages",
        accessor: "languages",
        Cell: ({ value }) => {
          if (Array.isArray(value)) {
            return value.join(", ");
          }
          return value;
        },
        sortType: "basic",
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => {
          const handleClickEdit = () => {
            handleEdit(row.original.public_id);
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
                onClick={() => handleDelete(row.original.public_id)}
              />
            </>
          );
        },
        disableSortBy: true,
      },
    ],
    [handleDelete, handleEdit]
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: classData,
      },
      useSortBy
    );

  const handleSubmit = (e) => {
    
    e.preventDefault();
    if (buttonValue == 1) {
      setIsLoader(true);
      const school_id = Number(schoolId);
      const number_of_sections = Number(numSections);
      const section_suffix = sectionSuffix;
      const grade = Number(className.match(/\d+/)[0]);
      const languageArray = languages.map((language) => language.value);
      const subjectArray = subjects.map((subject) => ({
        subject: Number(subject.value),
      }));
      const formData = {
        school_id,
        grade,
        number_of_sections,
        section_suffix,
        subjects: subjectArray, // Rename subjectArray if needed
        languages: languageArray,
        session_id:API_SESSION_ID
      };
      const createSection = async () => {
        try {
          const response = await axiosInstance.post(
            "onboarding/sections/create/",
            formData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          setIsLoader(false);
          if (response.data.status_code == 201) {
            setClassNameLabel([]);
            setNumSections("");
            setSectionSuffix("");
            setSubjects([]);
            setLanguages([]);
            
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
          setReqValue((prevValue) => (prevValue == 1 ? 0 : 1));
        } catch (error) {
          setIsLoader(false);
          setReqValue((prevValue) => (prevValue == 1 ? 0 : 1));
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
        }
      };
      createSection(); // Call the API when the component mounts
    } else if (buttonValue == 0) {
      setIsLoader(true);
      const school_id = Number(schoolId);
      // const number_of_sections = Number(numSections);
      const section_suffix = sectionSuffix;
      // const grade = Number(className.match(/\d+/)[0]);
      const formattedLanguages = languages.map((lang) => lang.value);
      const availableSubjects = existSubject;
      const currentSubjects = subjects;
     
      const result = availableSubjects.map((subject) => {
        const isCurrent = currentSubjects.find(
          (curr) => curr.value === subject.value
        );
        if (isCurrent) {
          return { subject: subject.value, action: "none" };
        } else {
          return { subject: subject.value, action: "deleted" };
        }
      });

      // Now check for added subjects (new in currentSubjects but not in availableSubjects)
      currentSubjects.forEach((subject) => {
        const isNew = !availableSubjects.find(
          (avail) => avail.value === subject.value
        );
        if (isNew) {
          result.push({ subject: subject.value, action: "added" });
        }
      });
      const formData = {
        subjects: result,
        section_suffix,
        languages: formattedLanguages,
        session_id:API_SESSION_ID
      };
      const editSection = async () => {
        try {
          const response = await axiosInstance.patch(
            `onboarding/sections/${sectionPublicId}/`,
            formData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          setIsLoader(false);
          if (
            response.data.status_code == 201 ||
            response.data.status_code == 201
          ) {
          }
          
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

          setClassNameLabel([]);
          setNumSections("");
          setSectionSuffix("");
          setSubjects([]);
          setLanguages([]);
          setReqValue((prevValue) => (prevValue == 1 ? 0 : 1));
          // Handle success (e.g., show a success message or redirect)
        } catch (error) {
          setIsLoader(false);
          toast.error(error.response.data.message, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            onClose: () => {},
          });
          setClassNameLabel([]);
          setNumSections("");
          setSectionSuffix("");
          setSubjects([]);
          setLanguages([]);
          setReqValue((prevValue) => (prevValue == 1 ? 0 : 1));
          console.error(
            "Error calling API:",
            error.response?.data || error.message
          );
          // Handle error (e.g., show an error message)
        }
      };
      setEditingIndex(null);
      editSection();
    }
  };

  useEffect(() => {
    // API call inside useEffect
    const getSection = async () => {
      setIsLoader(true);
      try {
        const response = await axiosInstance.get(
          `onboarding/sections/?school_id=${schoolId}&session_id=${API_SESSION_ID}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status == 200) {
          if (response.data.data.length > 0) {
            const formatLanguages = (languageString) => {
              try {
                // Convert the string representation to an actual array
                const parsedArray = JSON.parse(
                  languageString.replace(/'/g, '"')
                );
                // Join the array into a string
                return parsedArray.join(", ");
              } catch (error) {
                console.error("Failed to parse languages:", error);
                return languageString; // Return the original string in case of error
              }
            };
            const extractedData = response.data.data.map((item) => {
              // Ensure item.subjects is an array or default to an empty array
              const subjects = Array.isArray(item.subjects)
                ? item.subjects.map((sub) => sub.subject) // Convert subjects to an array of subject names
                : item.subjects
                ? [item.subjects]
                : []; // Handle single subject case, or set to empty array if null
              return {
                public_id: item.public_id,
                subjects: subjects, // Will always be an array
                section_name: item.section_name,
                grade: item.grade,
                class_code: item.class_code,
                languages: formatLanguages(item.languages), // Convert languages format
              };
            });
            setClassData(extractedData);

            // Extract unique grades
            const uniqueGrades = [
              ...new Set(response.data.data.map((item) => item.grade)),
            ];
            // Create gradeOptions in ascending order
            const gradeOptions = uniqueGrades
              .sort((a, b) => a - b) // Sort grades in ascending order
              .map((grade) => ({
                value: grade,
                label: `Class ${grade}`,
              }));
            // Store gradeOptions in localStorage
            localStorage.setItem("gradeOptions", JSON.stringify(gradeOptions));
          } else {
            localStorage.removeItem("gradeOptions");
            setClassData([]);
          }
        }
      } catch (error) {
        console.error("Error calling API:", error);
      } finally {
        setIsLoader(false);
      }
    };
    getSection(); // Call the API when the component mounts
  }, [reqValue, schoolId]);
  const handleNumSectionsChange = (e) => {
    setNumSections(e.target.value);
  };
  const handleSaveAndNext = () => {
    setIsLoader(true);
    router.push(
      `/onboarding/classgrouping?schoolname=${schoolName}&schoolcode=${schoolCode}&board=${board}&schoolid=${schoolId}&boardid=${boardid}`
    );
  };

  return (
    <div className="right_content">
      <div className="sch-creation-container">
        <div className="left-section">
          <button onClick={handleGoBack} className="link-button">
            <FaArrowLeft />
          </button>
          <span>Create Class</span>
        </div>
        <div className="right-section">
          <div className="step active">
            <div className="circle tick-circle"></div>
            <span>School Creation</span>
            <div className="line active-line"></div>
          </div>
          <div className="step active">
            <div className="circle">2</div>
            <span>Class Creation</span>
            <div className="line"></div>
          </div>
          <div className="step">
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
                <div className="inputGroup">
                  <label>Class</label>
                  <Select
                    name="className"
                    value={classNameLabel}
                    onChange={handleClassNameChange}
                    options={[
                      { value: "Class 6", label: "Class 6" },
                      { value: "Class 7", label: "Class 7" },
                      { value: "Class 8", label: "Class 8" },
                      { value: "Class 9", label: "Class 9" },
                      { value: "Class 10", label: "Class 10" },
                      // { value: "-1", label: "Other" },
                    ]}
                    placeholder="Select Class"
                    styles={customStyles}
                    components={{ DropdownIndicator }}
                    menuPosition="fixed"
                    isDisabled={editingIndex !== null}
                  />

                  {isOtherSelected && (
                    <div
                      style={{ display: "flex", gap: "5px", margin: "10px 0" }}
                    >
                      <input
                        type="text"
                        value={customClassName}
                        onChange={handleCustomClassChange}
                        placeholder="Custom Class"
                      />
                      <button
                        onClick={handleSubmitCustomClass}
                        className="other-submit"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>

                <div className="inputGroup">
                  <label>Number of Sections</label>
                  <input
                    type="text"
                    name="numSections"
                    value={numSections}
                    onChange={handleNumSectionsChange}
                    placeholder="Enter No. of Sections"
                    className="form-input"
                    disabled={editingIndex !== null} // Disable if editing
                  />
                </div>

                <div className="inputGroup">
                  <label>Section Suffix</label>
                  <Select
                    name="sectionSuffix"
                    value={
                      sectionSuffix
                        ? { value: sectionSuffix, label: sectionSuffix }
                        : null
                    } // Ensure the value is set correctly
                    onChange={(selectedOption) =>
                      setSectionSuffix(selectedOption.value)
                    }
                    // Only set the value (string)
                    options={[
                      { value: "numbers", label: "numbers" },
                      { value: "uppercase", label: "uppercase" },
                      { value: "lowercase", label: "lowercase" },
                      { value: "roman_upper", label: "roman_upper" },
                      { value: "roman_lower", label: "roman_lower" },
                    ]}
                    placeholder="Select Section Suffix"
                    styles={customStyles}
                    components={{ DropdownIndicator }}
                    menuPosition="fixed"
                    isDisabled={editingIndex !== null}
                  />
                </div>

                <div className="inputGroup">
                  <label>Subjects</label>
                  <Select
                    name="subject"
                    value={subjects}
                    onChange={handleSelectChange}
                    options={subjectOptionData}
                    isMulti
                    styles={customStyles}
                    components={{ MultiValueContainer, DropdownIndicator }}
                    placeholder="Select Subject"
                    hideSelectedOptions={false}
                    menuPosition="fixed"
                  />
                </div>
                <div className="inputGroup">
                  <label>Language</label>
                  <Select
                    name="language"
                    value={languages}
                    onChange={handleSelectChangelang}
                    options={languageOptions}
                    isMulti
                    styles={customStyles}
                    components={{ MultiValueContainer, DropdownIndicator }}
                    placeholder="Select Language"
                    hideSelectedOptions={false}
                    menuPosition="fixed"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="create-class-btn"
                disabled={editingIndex !== null ? false : !isFormValid()}
                value={editingIndex !== null ? 0 : 1}
                onClick={(e) => setButtonValue(e.target.value)}
              >
                {editingIndex !== null ? "Update Class" : "Create Class"}
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

        {classData.length > 0 && (
          <>
            <div className="class-table-section">
              <div className="table-header">
                <span>Total Classes </span>
                <button className="export-btn" onClick={handleExportCSV}>
                  <Image
                    src={csv_img}
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
                          {["className", "sectionSuffix", "language"].includes(
                            column.id
                          ) && (
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
            <div className="buttonGroup">
              <div className="left"> </div>
              <div className="right">
                <button
                  onClick={() => handleSaveAndNext()}
                  className="nextButton"
                >
                  Save & Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalVisible && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Delete Class?</h2>
            <p>Are you sure you want to delete this class?</p>
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
