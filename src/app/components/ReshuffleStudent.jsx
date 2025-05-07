"use client"
import React, { useState, useMemo, useEffect, useRef } from "react";
import { useTable, useSortBy, useRowSelect } from "react-table";
import { FaArrowLeft, FaCaretDown, FaCaretUp } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
import { TbCaretUpDownFilled } from "react-icons/tb";
import Select, { components } from "react-select";
import { FaAngleDown } from "react-icons/fa6";
import axiosInstance from "../auth";
import { useRouter } from "next/navigation";
import Loader from "../components/Loader";
import axios from "axios";
const API_SESSION_ID = process.env.NEXT_PUBLIC_ONBOARDING_SESSION_ID;

export default function ReshuffleStudent({ schoolId, schoolName,
  schoolCode,
  board,
  setAppliedFilters,
  appliedFilters,
  sectionId,
  setNewSection,
  newSection
}) {
  const [selectedClass, setSelectedClass] = useState({});
  const [isClassSelected, setIsClassSelected] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(""); // State to store search input value
  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);
  const [reshuffleData, setReshuffleData] = useState([]);
  const [reshuffledClassDatas, setReshuffledClassDatas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [allClassvalue, setallClassvalue] = useState("");
  const [allClassLabel, setAllClassLabel] = useState("");
  const [allClassvalueselected, setAllClassvalueselected] = useState(0);
  const [callApi, setCallApi] = useState(0);
  const [statusData, setStatusData] = useState([]);
  const [totalStudent, setTotalStudent] = useState(0);
  const [classSection, setClassSection] = useState([]);
  const [disableBtn, setDisableBtn] = useState(true);
  const [isLoader, setIsLoader] = useState(false);
  const router = useRouter();
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    setIsLoader(true);
    const apiCall = async () => {
      try {
        const response = await axiosInstance.get(`onboarding/schools/${schoolId}/sections_names/?session_id=${API_SESSION_ID}`, {
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
        setIsLoader(false);
      }
    };
    if (schoolId > 0) {
      apiCall();
    }
  }, [schoolId]);

  const customStyles = useMemo(
    () => ({
      control: (base) => ({
        ...base,
        width: "100%",
        padding: "10px",
        borderColor: "#DCDCDC",
        boxShadow: "none",
        borderRadius: "5px",
        fontSize: "16px",
        fontWeight: "500",
        display: "flex",
        alignItems: "center",
        minHeight: "50px",
        maxHeight: "50px",
        overflow: "hidden",
      }),
      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
      menu: (base) => ({
        ...base,
        zIndex: 9999,
        width: "100%",
      }),
      placeholder: (base) => ({
        ...base,
        textAlign: "left",
        color: "rgba(179, 179, 179, 1)",
        fontWeight: "700",
        fontSize: "16px",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        maxHeight: "100%",
      }),
      singleValue: (base) => ({
        ...base,
        textAlign: "left",
        color: "rgba(83, 83, 83, 1)",
        fontWeight: "700",
        fontSize: "16px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }),
      indicatorSeparator: () => ({
        display: "none",
      }),
      dropdownIndicator: (base) => ({
        ...base,
        color: "#FF8A00",
        padding: "0 8px",
        ":hover": {
          color: "#FF8A00",
        },
      }),
      option: (styles, { isSelected }) => ({
        ...styles,
        backgroundColor: isSelected ? "rgba(253, 229, 202, 1)" : "#fff",
        color: isSelected ? "#FF8A00" : "#000",
        ":hover": {
          backgroundColor: "rgba(253, 229, 202, 1)",
          color: "#FF8A00",
        },
      }),
    }),
    []
  );
  // Custom Dropdown Indicator
  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <FaAngleDown color="#ff8a00" />
      </components.DropdownIndicator>
    );
  };
  // Filter the data based on search input
  const data = useMemo(() => {
    return reshuffleData.filter((row) =>
      row.userId.toLowerCase().includes(searchInput.toLowerCase())
    );
  }, [searchInput, reshuffleData]);

  const columns = useMemo(
    () => [
      {
        Header: "User ID",
        accessor: "userId",
        disableSortBy: false,
      },
      {
        Header: "First Name",
        accessor: "firstName",
        disableSortBy: false,
      },
      {
        Header: "Last Name",
        accessor: "lastName",
        disableSortBy: false,
      },
      {
        Header: "Class - Section",
        accessor: "classSection",
        disableSortBy: false,
      },
      {
        Header: "Move To",
        accessor: "moveTo",
        Cell: ({ row }) => (
          (
            <Select
              options={row.original.moveTo}
              value={row.original.moveTo.find(
                (option) => option.value === selectedClass[row.id]
              )}
              placeholder="Select Class"
              styles={customStyles}
              menuPosition="fixed"
              onChange={(selectedOption) => {
                const newSelectedClass = {
                  ...selectedClass,
                  [row.id]: selectedOption.value,
                };
                setSelectedClass(newSelectedClass);
                setIsClassSelected(true);
                localStorage.setItem("classstatusvalue", JSON.stringify([]));
              }}
            />
          )
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) => {
          const classstatus = JSON.parse(
            localStorage.getItem("classstatusvalue") || "[]"
          );
          const userStatus = classstatus.find(
            (item) => item.userid == row.original.userId
          );
          return (
            <span>{userStatus ? `Moved to ${userStatus.classcode}` : ""}</span>
          );
        },
      },
    ],
    [selectedClass, customStyles, statusData]
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <input type="checkbox" {...getToggleAllRowsSelectedProps()} />
          ),
          Cell: ({ row }) => (
            <input
              type="checkbox"
              {...row.getToggleRowSelectedProps()}
              onClick={() => onCheckboxClick(row)}
            />
          ),
        },
        ...columns,
      ]);
    }
  );
  const onCheckboxClick = (row) => {
    localStorage.setItem("classstatusvalue", JSON.stringify([]));
    // Add any other logic you need to handle here
  };

  const controllerRef = useRef(null); // Store the AbortController

const reshuffleStudents = async () => {
  // Cancel the previous request if there is one
  if (controllerRef.current) {
    controllerRef.current.abort();
  }

  // Create a new controller for the new request
  controllerRef.current = new AbortController();
  const { signal } = controllerRef.current;
  let class_id = appliedFilters.length > 0 ? appliedFilters.join(",") : "";
  let apiUrl = `onboarding/school/${schoolId}/reshuffle_students/?session_id=${API_SESSION_ID}`;

  if (newSection > 0 && class_id) {
    apiUrl += `&class_id=${class_id}`;
  } else if (newSection > 0) {
    apiUrl += `&class_id=${sectionId}`;
  } else if (class_id) {
    apiUrl += `&class_id=${class_id}`;
  } else {
    if (newSection > 0) {
      apiUrl += `&class_id=${newSection}`;
    }
  }

  try {
    const response = await axiosInstance.get(apiUrl, { signal });

    if (response.data.status === "success") {
      setTotalStudent(response.data.data.students_count);
      const reshuffledClassData = response.data.data.classes.map((reshuffle) => ({
        label: reshuffle.section_name,
        value: reshuffle.class_code,
      }));

      setReshuffledClassDatas(reshuffledClassData);

      const transformedData = response.data.data.students.map((student) => ({
        userId: student.user_id.toString(),
        firstName: student.first_name,
        lastName: student.last_name,
        classSection: student.class_name,
        moveTo: student.reshuffle_classes.map((reshuffle) => ({
          label: reshuffle.section_name,
          value: reshuffle.class_code,
        })),
        status: "",
      }));

      setSelectedClass({});
      setReshuffleData(transformedData);
    }
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Previous API call cancelled:", error.message);
    } else {
      console.error("Error calling the reshuffle API:", error);
    }
  }
};

// useEffect to trigger reshuffleStudents()
useEffect(() => {
  reshuffleStudents(); // Call API when any dependency changes
  return () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
  };
}, [callApi, schoolId, appliedFilters, newSection]);

useEffect(() => {
  if(selectedFlatRows.length > 0) {
    setDisableBtn(false);
  }else{
    setDisableBtn(true);
  }
  
}, [selectedFlatRows]);

  const getCheckedRows = () => {
    const checkedRowsData = selectedFlatRows.map((row) => {
      return {
        userid: Number(row.original.userId), // Adjust based on your data structure
        classcode: selectedClass[row.id] || null, // Include selected class or null if not selected
      };
    });
    const formattedData = {
      data: checkedRowsData,
    };

    // Filter the data array inside formattedData
    const filteredData = formattedData.data.filter((item) => item.classcode);
    const filteredDataArray = filteredData.length;
    let reqData = [];
    if (filteredDataArray > 0 || allClassvalue) {
      if (allClassvalue) {
        // Function to update classcode without checking
        const updateClasscode = (data, newClasscode) => {
          return data.data.map((item) => ({
            ...item,
            classcode: newClasscode, // Directly set the new classcode
          }));
        };
        // Example usage: Change all classcodes to 'c6c'
        const updatedData = updateClasscode(formattedData, allClassvalue);
        reqData = updatedData;
      } else {
        reqData = filteredData;
      }
    }
    const reshuffleStudentsUpdate = async () => {
      const url = `onboarding/school/${schoolId}/reshuffle_students/?session_id=${API_SESSION_ID}`;
      const data = {
        data: reqData,
      };
      localStorage.setItem("classstatusvalue", JSON.stringify(reqData));
      setStatusData(data);
      try {
        const response = await axiosInstance.post(url, data, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        // callApi == 0 ? setCallApi(1) : setCallApi(0);
        setCallApi((prev) => (prev == 0 ? 1 : 0));
      } catch (error) {
        // callApi == 0 ? setCallApi(1) : setCallApi(0);
        setCallApi((prev) => (prev == 0 ? 1 : 0));
        console.error("Error calling API:", error);
      }
    };
    // Call the function
    reshuffleStudentsUpdate();
  };
  const handlePublish = () => {
    if (allClassvalue) {
      setAllClassvalueselected(1);
    }
    setShowModal(!showModal);
  };

  const handleCancelPublish = () => {
    setallClassvalue("");
    setAllClassLabel("");
    setAllClassvalueselected(0);
    setShowModal(!showModal);
  };
  const handleGoBack = () => {
    router.back();
  };
  return (
    <div className="right_content">
      {isFilterOpen && (
        <div className="overlay active" onClick={toggleFilter}></div>
      )}
      <div className="sch-creation-container">
        <div className="left-section">
          <button onClick={handleGoBack} className="link-button">
            <FaArrowLeft />
          </button>
          <span>Reshuffle Students</span>
        </div>
      </div>
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
                <span className="info-item-up">Academic Year</span>
                <span className="info-item-down">{board}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="table_head" style={{ paddingTop: "0" }}>
          <p>Total Students ({totalStudent})</p>
          <div className="table_head_right">
            <div className="input-wrapper" style={{ top: "0" }}>
              <IoSearchOutline className="icon" />
              <input
                type="text"
                className="custom-input"
                placeholder="Search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)} // Update searchInput on change
              />
            </div>
            <button onClick={toggleFilter} style={{ width: "180px" }}>
              <FiFilter /> Filter
            </button>
          </div>
        </div>
        {isFilterOpen && <FilterBox toggleFilter={toggleFilter} appliedFilters={appliedFilters}
          setAppliedFilters={setAppliedFilters} classOptions={classSection} setCallApi={setCallApi} setNewSection={setNewSection} newSection={newSection}/>}
        <table {...getTableProps()} className="table">
          <thead>
            {headerGroups.map((headerGroup, headerGroupIndex) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroupIndex}>
                {headerGroup.headers.map((column, columnIndex) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={columnIndex}
                  >
                    <div className="th-content">
                      {column.render("Header")}
                      {[
                        "userId",
                        "firstName",
                        "lastName",
                        "classSection",
                      ].includes(column.id) && (
                          <span>
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
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
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
        <div className="buttonGroup">
          <div className="left">
            <button className="cancelButton" onClick={toggleModal}>
            Bulk move to new class
            </button>
          </div>
          <div className="right">
          <button onClick={getCheckedRows} className={disableBtn == true ? "nextButtondisabled" :"nextButton"} disabled={disableBtn}>
          Save Changes
        </button>

          </div>
        </div>
      </div>

      {isLoader ? <Loader /> : ""}
      {showModal && (
        <>
          <div className="modal-overlay" onClick={toggleModal}>
            <div
              className="delete-modal"
              style={{ width: "400px" }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Select New Class</h2>
              <div>
                <Select
                  value={reshuffledClassDatas.find(
                    (type) => type.value === reshuffledClassDatas
                  )}
                  onChange={(selectedOption) => {
                    setAllClassLabel(selectedOption.label);
                    setallClassvalue(selectedOption.value);
                  }}
                  options={reshuffledClassDatas}
                  placeholder="Select School Type"
                  styles={customStyles}
                  components={{ DropdownIndicator }}
                  menuPosition="absolute"
                />
              </div>
              <p>
                Are you sure you want to Apply <strong> {allClassLabel}</strong>
                ?
              </p>
              <div className="modal-actions">
                <button onClick={handleCancelPublish} className="cancel-btn">
                  No Choose Individually
                </button>
                <button className="confirm-btn" onClick={handlePublish}>
                  Publish
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
const FilterBox = ({ toggleFilter, appliedFilters, setAppliedFilters, classOptions, setCallApi,setNewSection,newSection }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClasses, setSelectedClasses] = useState(appliedFilters || []); // Initialize from applied filters
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

  // Handle Apply
  const handleApply = () => {
    if ([...selectedClasses].length > 0) {
      setCallApi((prev) => (prev == 0 ? 1 : 0));
    }
    setAppliedFilters([...selectedClasses]); // Persist the selection
    setNewSection([]);
    toggleFilter(); // Close the modal
  };

  // Handle Reset
  const handleReset = () => {
    setSearchTerm("");
    setCallApi((prev) => (prev == 0 ? 1 : 0));
    setAppliedFilters([]);
    setSelectedClasses([]);
    setNewSection([]);
  };

  return (
    <div className="filter-box">
      <div className="filter-header">
        <span>Filter</span>
        <button onClick={toggleFilter} className="filter-cross">
          &#10006;
        </button>
      </div>
      <div className="filter-body">
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
