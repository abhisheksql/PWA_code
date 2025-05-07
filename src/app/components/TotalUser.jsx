"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import { FiFilter } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { FiEdit3 } from "react-icons/fi";

import Image from "next/image";

import Onbouser from "../../../public/images/Onbouser.svg";
import redDelete from "../../../public/images/redDelet.svg";
import Loader from "../components/Loader";
import { useRouter } from "next/navigation";
import axiosInstance from "../auth";
const API_SESSION_ID = process.env.NEXT_PUBLIC_ONBOARDING_SESSION_ID;
export default function TotalUser({
  totalStudent,
  totalTeacher,
  schoolSectionData,
  schoolId,
  schoolName,
  schoolCode,
  board,
  setIsLoader,
  isLoader,
  setCallApi,
  setAppliedFilters,
  appliedFilters,
}) {
  const [classSection, setClassSection] = useState([]);
  useEffect(() => {
    
    const apiCall = async () => {
      // setIsLoader(true);
      try {
        const response = await axiosInstance.get(
          `onboarding/schools/${schoolId}/sections_names/?session_id=${API_SESSION_ID}
`,
          {
            headers: {
              "Content-Type": "application/json",
              // Authorization: `Bearer ${yourBearerToken}`,
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
          // setIsLoader(false);
        }
        // setIsLoader(false);
      } catch (error) {
        // setIsLoader(false);
        console.error("Error:", error);
      } finally {
      }
    };
    if (schoolId > 0) {
      apiCall();
    }
  }, [schoolId]);

  // Added searchInput state and filtering logic
  const [searchInput, setSearchInput] = useState(""); // State for search input
  const router = useRouter();
  const filteredData = useMemo(
    () =>
      schoolSectionData.filter((item) =>
        item.section_name.toLowerCase().includes(searchInput.toLowerCase())
      ),
    [schoolSectionData, searchInput]
  );
  const columns = React.useMemo(
    () => [
      {
        Header: "Class - Section",
        accessor: "section_name",
      },
      {
        Header: "Students",
        accessor: "total_students",
      },
      {
        Header: "Teacher",
        accessor: "total_teachers",
      },
      {
        Header: "Action",
        accessor: "action",
        disableSortBy: true,
        Cell: ({ row }) => (
          <ActionMenu
            row={row}
            schoolSectionData={schoolSectionData}
            schoolId={schoolId}
            schoolName={schoolName}
            schoolCode={schoolCode}
            board={board}
            setIsLoader={setIsLoader}
            setCallApi={setCallApi}
          />
        ),
      },
    ],
    [schoolSectionData, schoolId, schoolName, schoolCode, board]
  );

  const handleGoBack = () => {
    setIsLoader(true);
    router.back();
  };
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: filteredData }, useSortBy);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);
  const handleBulkUpload = () => {
    setIsLoader(true);
    router.push(
      `/onboarding/userdashboard/uploaduser?schoolEditId=${schoolId}&schoolName=${schoolName}&schoolCode=${schoolCode}&schoolBoard=${board}&isClass=false`
    );
  };

  const handleUserList = () => {
    setIsLoader(true);
    router.push(
      `/onboarding/userdashboard/teacherstudentlist?schoolEditId=${schoolId}&schoolName=${schoolName}&schoolCode=${schoolCode}&schoolBoard=${board}`
    );
  };

  return (
    <div className="right_content">
      {isFilterOpen && (
        <div className="overlay active" onClick={toggleFilter}></div>
      )}
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
            <div className="right-section">
              <button onClick={handleBulkUpload} className="userPageLink">
                Bulk Upload
              </button>
              <button onClick={handleUserList} className="simple-button" style={{cursor: "pointer" , marginLeft:'10px'}}>
                <Image
                  src={Onbouser}
                  alt="User"
                  width={20}
                  height={20}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="table_head" style={{ paddingTop: "0" }}>
        <div className="left-section">
          <button
            onClick={handleGoBack}
            style={{ border: "none", backgroundColor: "transparent" }}
            className="link-button"
          >
            <FaArrowLeft />
          </button>
          <span>
            {" "}
            Total Users ({totalStudent} + {totalTeacher})
          </span>
        </div>
        <div className="table_head_right">
          <div className="input-wrapper" style={{ top: "0" }}>
            <IoSearchOutline className="icon" />
            <input
              type="text"
              className="custom-input"
              placeholder="Search by Class - Section"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)} // Added onChange handler for search
            />
          </div>
          <button onClick={toggleFilter} style={{ width: "180px" }}>
            <FiFilter /> Filter
          </button>
        </div>
      </div>
      {isFilterOpen && (
        <FilterBox
          toggleFilter={toggleFilter}
          appliedFilters={appliedFilters}
          setAppliedFilters={setAppliedFilters}
          classOptions={classSection}
          setCallApi={setCallApi}
        />
      )}
      <div
        className="table-wrapper"
        style={{ maxHeight: "60vh", marginTop: "10px" }}
      >
        <table {...getTableProps()} className="table">
          <thead>
            {headerGroups.map((headerGroup, headerGroupIndex) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroupIndex}>
                {headerGroup.headers.map((column, columnIndex) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={columnIndex}
                  >
                    <div className="th-content">{column.render("Header")}</div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {/* <tbody {...getTableBodyProps()} className="tbody_scroll">
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
          </tbody> */}
          <tbody {...getTableBodyProps()} className="tbody_scroll">
            {rows.length === 0 ? (
              // If no rows, display the "No School Available" message
              <tr>
                <td colSpan={columns.length} className="no-data-message">
                  No Users are available.
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => {
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
              })
            )}
          </tbody>

        </table>
      </div>
      {isLoader ? <Loader /> : ""}
    </div>
  );
}

const FilterBox = ({
  toggleFilter,
  appliedFilters,
  setAppliedFilters,
  classOptions,
  setCallApi,
}) => {
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
    toggleFilter(); // Close the modal
  };

  // Handle Reset
  const handleReset = () => {
    setSearchTerm("");
    setCallApi((prev) => (prev == 0 ? 1 : 0));
    setAppliedFilters([]);
    setSelectedClasses([]);
  };

  return (
    <div className="filter-box">
      <div className="filter-header">
        <span>Filter</span>
        <button onClick={toggleFilter} className="filter-cross">
          &#10006;
        </button>
      </div>
      <div className="filter-body" style={{ paddingBottom: "40px" }}>
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

// ActionMenu Component with Delete Confirmation Modal
const ActionMenu = ({
  row,
  schoolSectionData,
  // setTableData,
  schoolId,
  schoolName,
  schoolCode,
  board,
  setIsLoader,
  setCallApi,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const router = useRouter();
  const sectionName = row.original.section_name; // Use section for the delete confirmation
  const sectionId = row.original.id;
  const handleDelete = async () => {
    setShowModal(false);
    let matchString = `Delete ${sectionName}`;
    if (matchString == confirmText) {
      try {
        // Make the API call with axios
        const response = await axiosInstance.delete(
          `onboarding/sections/${sectionId}/delete/`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status == 200) {
          setCallApi((prev) => (prev == 0 ? 1 : 0));
        } else {
          console.error(`Failed to Delete User`);
        }
        setShowModal(false);
      } catch (error) {
        console.error("An error occurred:", error);
        setShowModal(false);
      }
      setShowModal(false);
    } else {
    }
  };
  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleBulkUploadAction = () => {
    setIsLoader(true);
    router.push(
      `/onboarding/userdashboard/uploaduser?schoolEditId=${schoolId}&schoolName=${schoolName}&schoolCode=${schoolCode}&schoolBoard=${board}&section_name=${sectionName}`
    );
  };

  const handleUserListAction = () => {
    setIsLoader(true);
    router.push(
      `/onboarding/userdashboard/teacherstudentlist?schoolEditId=${schoolId}&schoolName=${schoolName}&schoolCode=${schoolCode}&schoolBoard=${board}&sectionId=${sectionId}`
    );
  };

  return (
    <div className="dfjc">
      <button onClick={handleBulkUploadAction} className="userPageLink">
        {" "}
        Create User
      </button>
      <button onClick={handleUserListAction} className="simple-button">
        <FiEdit3 style={{ cursor: "pointer", color: "#3B3E98" }} />
      </button>

      <Image
        src={redDelete}
        alt="Delete"
        width={20}
        height={24}
        style={{ cursor: "pointer" }}
        onClick={() => setShowModal(true)}
      />
      {showModal && (
        <>
          <div className="modal-overlay" onClick={handleModalClose}>
            <div
              className="delete-modal"
              style={{ width: "400px" }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Delete Class-Section?</h2>
              <p>
                The section will be permanently deleted with no chance of
                recovery. This cannot be undone.
              </p>
              <p>
                Type <strong>{`"Delete ${sectionName}"`}</strong> to confirm:
              </p>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type above message"
                className="confirm-input"
              />
              <div className="modal-actions">
                <button onClick={handleModalClose} className="cancel-btn">
                  Cancel
                </button>
                <button onClick={handleDelete} className="confirm-btn">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
