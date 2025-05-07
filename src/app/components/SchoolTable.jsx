"use client";
import React, { useState, useRef, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { LuFilter } from "react-icons/lu";
import { CiCalendar } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { TbCaretUpDownFilled } from "react-icons/tb";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaAngleDown, FaAngleUp, FaCaretUp, FaCaretDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../../../public/style/onboarding.css";
import "../../../public/style/pagination.css";
import { useRouter } from "next/navigation";
import axiosInstance from "../auth";
import Loader from "../components/Loader";
import { parse } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SchoolTable({
  schools,
  setReqValue,
  isLoader,
  setIsLoader,
  setAppliedFilters,
  appliedFilters,
  classSection,
  startAppliedFilters,
  setStartAppliedFilters,
  endAppliedFilters,
  setEndAppliedFilters,
  currentPage,
  pageSize,
  totalItems,
  totalPages,
  handlePageChange,
  handlePageSizeChange
}) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const data = React.useMemo(() => schools, [schools]);
  const columns = React.useMemo(
    () => [
      {
        Header: "School ID",
        accessor: "id",
        disableSortBy: true,
      },
      {
        Header: "School Name",
        accessor: "name",
      },
      {
        Header: "Classroom",
        accessor: "classroom",
        Cell: ({ row }) => <ClassroomCell classroom={row.original.classroom} />,
      },
      {
        Header: "Student",
        accessor: "students",
      },
      {
        Header: "Teacher",
        accessor: "teachers",
      },
      {
        Header: "Onboarding Date",
        accessor: "date",
      },
      {
        Header: "Action",
        accessor: "action",
        disableSortBy: true,
        Cell: ({ row }) => (
          <ActionMenu
            schoolId={row.original.id}
            schoolNameValue={row.original.name}
            schoolShortcodeValue={row.original.school_shortcode}
            schoolBoardValue={row.original.school_board}
            setReqValue={setReqValue}
            setIsLoader={setIsLoader}
            schoolBoardID={row.original.board_id}
            setShowModal={setShowModal}
            setSchoolName={setSchoolName}
            setSchoolIdDelete={setSchoolIdDelete}
          />
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [schoolName, setSchoolName] = useState("");
  const [schoolIdDelete, setSchoolIdDelete] = useState(0);
  
  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  const handleCreateSchool = () => {
    setIsLoader(true);
    router.push("/onboarding/createschool");
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleDeleteSchool = async () => {
    const matchString = `Delete ${schoolName}`;
    
    if (matchString !== confirmText) {
      toast.error("Text does not match. Please try again.", {
                  position: "bottom-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                });
      return;
    }
  
    if (!schoolIdDelete || schoolIdDelete <= 0) {
      toast.error("Invalid school ID.", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("deleted", true);
  
      const response = await axiosInstance.patch(
        `onboarding/schools/${schoolIdDelete}/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      setShowModal(false);
      setConfirmText("");
      if (response.status === 200 || response.status === 201) {
        toast.success(response.data.message, {
                      position: "bottom-center",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "colored",
                    });
        setReqValue(prev => (prev === 0 ? 1 : 0));
      }
    } catch (error) {
      setShowModal(false);
      setConfirmText("");
      toast.error(error.message, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      console.error("Error deleting school:", error.response?.data || error.message);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
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
      
      pages = Array.from(new Set(pages)).sort((a, b) => a - b);
      
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
            Showing {schools.length} of {totalItems} schools
          </span>
          <select 
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="pagination-size-selector"
          >
            {[10, 25, 50, 100].map(size => (
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
      {isFilterOpen && (
        <div className="overlay active" onClick={toggleFilter}></div>
      )}

      <div className="table_head">
        <p>School Overview</p>
        <div className="table_head_right">
          <button onClick={toggleFilter} style={{ width: "auto" }}>
            <LuFilter /> Filter
          </button>
          <button
            onClick={handleCreateSchool}
            className="link-button"
            style={{ width: "auto" }}
          >
            <IoMdAdd /> Create School
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <FilterBox
          toggleFilter={toggleFilter}
          appliedFilters={appliedFilters}
          setAppliedFilters={setAppliedFilters}
          classOptions={classSection}
          setReqValue={setReqValue}
          startAppliedFilters={startAppliedFilters}
          setStartAppliedFilters={setStartAppliedFilters}
          endAppliedFilters={endAppliedFilters}
          setEndAppliedFilters={setEndAppliedFilters}
        />
      )}

      <div className="table-wrapper">
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
                      {!column.disableSortBy && (
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
          <tbody {...getTableBodyProps()} className="tbody_scroll">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="no-data-message">
                  No School is available. Please check back later.
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

      {renderPagination()}

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
                Type <strong>{`"Delete ${schoolName}"`}</strong> to confirm:
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
                <button onClick={handleDeleteSchool} className="confirm-btn">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}

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

      {isLoader ? <Loader /> : ""}
    </div>
  );
}

const FilterBox = ({
  toggleFilter,
  appliedFilters,
  setAppliedFilters,
  classOptions,
  setReqValue,
  startAppliedFilters,
  setStartAppliedFilters,
  endAppliedFilters,
  setEndAppliedFilters,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClasses, setSelectedClasses] = useState(appliedFilters || []);
  const [showMoreClasses, setShowMoreClasses] = useState(false);
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);

  const handleStartDateIconClick = () => {
    setIsStartDateOpen(!isStartDateOpen);
  };
  const handleStartDateInputFocus = () => {
    setIsStartDateOpen(true);
  };
  const handleStartDateClickOutside = () => {
    setIsStartDateOpen(false);
  };

  const handleEndDateIconClick = () => {
    setIsEndDateOpen(!isEndDateOpen);
  };
  const handleEndDateInputFocus = () => {
    setIsEndDateOpen(true);
  };
  const handleEndDateClickOutside = () => {
    setIsEndDateOpen(false);
  };

  const [startDate, setStartDate] = useState(
    startAppliedFilters
      ? parse(startAppliedFilters, "dd/MM/yyyy", new Date())
      : null
  );
  const [endDate, setEndDate] = useState(
    endAppliedFilters
      ? parse(endAppliedFilters, "dd/MM/yyyy", new Date())
      : null
  );

  const filteredClasses = classOptions.filter((classOption) =>
    classOption.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckboxChange = (value) => {
    setSelectedClasses((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((item) => item !== value)
        : [...prevSelected, value]
    );
  };

  const handleApply = () => {
    const filters = {
      classes: [...selectedClasses],
      startDate: startDate ? startDate.toLocaleDateString("en-GB") : null,
      endDate: endDate ? endDate.toLocaleDateString("en-GB") : null,
    };

    setReqValue((prev) => (prev == 0 ? 1 : 0));
    setAppliedFilters(filters.classes);
    setStartAppliedFilters(filters.startDate);
    setEndAppliedFilters(filters.endDate);
    toggleFilter();
  };

  const handleReset = () => {
    setSearchTerm("");
    setStartDate(null);
    setEndDate(null);
    setReqValue((prev) => (prev == 0 ? 1 : 0));
    setAppliedFilters([]);
    setSelectedClasses([]);
    setStartAppliedFilters(null);
    setEndAppliedFilters(null);
  };

  return (
    <div className="filter-box">
      <div className="filter-header">
        <span>Filter</span>
        <button onClick={toggleFilter} className="filter-cross">
          &#10006;
        </button>
      </div>
      <div className="filter-body" style={{ marginBottom: "50px" }}>
        <label>School Name</label>
        <div className="input-wrapper">
          <IoSearchOutline className="icon" />
          <input
            type="text"
            className="custom-input"
            placeholder="Search School Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-options">
          {filteredClasses
            .slice(0, showMoreClasses ? filteredClasses.length : 5)
            .map((classOption, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  value={classOption.value}
                  checked={selectedClasses.includes(classOption.value)}
                  onChange={() => handleCheckboxChange(classOption.value)}
                />

                {classOption.label}
              </label>
            ))}
          {filteredClasses.length > 5 && (
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

        <div className="filter-body-2">
          <label>Onboarding Date</label>
          <div style={{ margin: "25px 0" }}>
            <label style={{ marginBottom: "0px" }}>Start Date</label>
            <div className="input-wrapper">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="Select Start date"
                className="custom-input"
                dateFormat="dd-MM-yyyy"
                showYearDropdown
                scrollableYearDropdown
                open={isStartDateOpen}
                onClickOutside={handleStartDateClickOutside}
                onSelect={() => setIsStartDateOpen(false)}
                onFocus={handleStartDateInputFocus}
                customInput={
                  <input style={{ padding: "10px 40px 10px 10px" }} />
                }
              />
              <CiCalendar
                className="icon"
                onClick={handleStartDateIconClick}
                style={{ cursor: "pointer", left: "auto", right: "10px" }}
              />
            </div>
          </div>

          <div>
            <label style={{ marginBottom: "0px" }}>End Date</label>
            <div className="input-wrapper">
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                placeholderText="Select End date"
                className="custom-input"
                dateFormat="dd-MM-yyyy"
                showYearDropdown
                scrollableYearDropdown
                open={isEndDateOpen}
                onClickOutside={handleEndDateClickOutside}
                onSelect={() => setIsEndDateOpen(false)}
                onFocus={handleEndDateInputFocus}
                customInput={
                  <input style={{ padding: "10px 40px 10px 10px" }} />
                }
              />
              <CiCalendar
                className="icon"
                onClick={handleEndDateIconClick}
                style={{ cursor: "pointer", left: "auto", right: "10px" }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="filter-footer">
        <button onClick={handleReset}>Reset</button>
        <button onClick={handleApply}>Apply</button>
      </div>
    </div>
  );
};

const ClassroomCell = ({ classroom }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded(!isExpanded);
  const classroomItems = classroom.includes(", ")
    ? classroom.split(", ")
    : [classroom];
  return (
    <div
      onClick={classroomItems.length > 1 ? toggleExpand : null}
      style={{
        cursor: classroomItems.length > 1 ? "pointer" : "default",
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
          <div>{classroomItems[0]}</div>
        )}
      </div>
      {classroomItems.length > 1 && (
        <div>{isExpanded ? <FaAngleUp /> : <FaAngleDown />}</div>
      )}
    </div>
  );
};

const ActionMenu = ({
  schoolId,
  schoolNameValue,
  schoolShortcodeValue,
  schoolBoardValue,
  setReqValue,
  setIsLoader,
  schoolBoardID,
  setShowModal,
  setSchoolName,
  setSchoolIdDelete
}) => {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setOpenMenu(!openMenu);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEdit = (schoolId) => {
    setIsLoader(true);
    router.push(`/onboarding/createschool?schoolEditId=${schoolId}`);
  };

  const handleEditClass = (
    schoolId,
    schoolNameValue,
    schoolShortcodeValue,
    schoolBoardValue,
    schoolBoardID
  ) => {
    setIsLoader(true);
    router.push(
      `/onboarding/createclass?schoolname=${schoolNameValue}&schoolcode=${schoolShortcodeValue}&board=${schoolBoardValue}&schoolid=${schoolId}&boardid=${schoolBoardID}`
    );
  };

  const handleEditCourse = (schoolId) => {
    setIsLoader(true);
    router.push(`/onboarding/course/list?school_id=${schoolId}`);
  };

  const handleDelete = (schoolId, setShowModal, schoolNameValue, setSchoolName, setSchoolIdDelete) => {
    setSchoolName(schoolNameValue);
    setSchoolIdDelete(schoolId);
    setShowModal(true);
  };

  const usersEdit = (
    schoolId,
    schoolNameValue,
    schoolShortcodeValue,
    schoolBoardValue,
  ) => {
    setIsLoader(true);
    router.push(
      `/onboarding/userdashboard?schoolEditId=${schoolId}&schoolName=${schoolNameValue}&schoolCode=${schoolShortcodeValue}&schoolBoard=${schoolBoardValue}`
    );
  };

  return (
    <div className="action-buttons">
      <button
        onClick={() =>
          handleEditClass(
            schoolId,
            schoolNameValue,
            schoolShortcodeValue,
            schoolBoardValue,
            schoolBoardID
          )
        }
      >
        Class
      </button>
      <button onClick={() => handleEditCourse(schoolId)}>Course</button>
      <button
        onClick={() =>
          usersEdit(
            schoolId,
            schoolNameValue,
            schoolShortcodeValue,
            schoolBoardValue
          )
        }
      >
        Users
      </button>
      <div style={{ position: "relative" }} ref={menuRef}>
        <BsThreeDotsVertical onClick={toggleMenu} />
        {openMenu && (
          <div className="optionmenu">
            <div onClick={() => handleEdit(schoolId)}>Edit</div>
            <div onClick={() => handleDelete(schoolId, setShowModal, schoolNameValue, setSchoolName, setSchoolIdDelete)}>Delete</div>
          </div>
        )}
      </div>
    </div>
  );
};
