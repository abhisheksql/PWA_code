'use client';
import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useTable, useSortBy, useFilters } from 'react-table';
import { IoSearchOutline } from 'react-icons/io5';
import 'react-datepicker/dist/react-datepicker.css';
import { FiFilter } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { RxCross2 } from 'react-icons/rx';
import { FaCaretUp, FaCaretDown, FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { TbCaretUpDownFilled } from 'react-icons/tb';
import Image from 'next/image';
import axiosInstance from '../auth';
import Loader from "../components/Loader";
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import "../../../public/style/pagination.css";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const API_SESSION_ID = process.env.NEXT_PUBLIC_ONBOARDING_SESSION_ID;
export default function Courses() {
  const searchParams = useSearchParams();
  const [tableData, setTableData] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [boards, setBoards] = useState(['CBSE']); // To store the available boards for filtering

  // States for filter data
  const [schools, setSchools] = useState([]);  // To store the list of schools from the API
  const [selectedSchools, setSelectedSchools] = useState([]); // To store selected schools
  const [filteredSchools, setFilteredSchools] = useState([]); // To store filtered schools based on search
  const [selectedBoards, setSelectedBoards] = useState([]); // <-- Add this line

  const [classes, setClasses] = useState([]); // To store the classes fetched from API
  const [selectedClasses, setSelectedClasses] = useState([]); // To store selected classes
  const [filteredClasses, setFilteredClasses] = useState([]); // To store filtered classes based on search

  const [searchQuerySchool, setSearchQuerySchool] = useState('');
  const [searchQueryClass, setSearchQueryClass] = useState('');

  const [showMoreSchools, setShowMoreSchools] = useState(false);
  const [showMoreClasses, setShowMoreClasses] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [allData, setAllData] = useState([]);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axiosInstance.get(`onboarding/schools/filter?session_id=${API_SESSION_ID}`);
        if (response.status === 200) {
          setSchools(response.data.data);
          setFilteredSchools(response.data.data);
        } else {
          setError('Failed to fetch schools');
        }
      } catch (err) {
        console.error('Error fetching schools:', err);
      }
    };
    fetchSchools();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        // Fetch all sections initially, filtering happens client-side or potentially via API if needed differently
        const url = `onboarding/sections/?session_id=${API_SESSION_ID}`;

        const response = await axiosInstance.get(url);
        if (response.status === 200) {
          setClasses(response.data.data);
          
          const uniqueClasses = Array.from(new Set(response.data.data.map(cls => cls.section_name))).map(section_name => {
            return response.data.data.find(cls => cls.section_name === section_name);
          });

          setFilteredClasses(uniqueClasses);
        } else {
          setError('Failed to fetch classes');
        }
      } catch (err) {
        setError('Error fetching classes: ' + err.message);
      }
    };

    fetchClasses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);

    try {
      let query = '';

      const schoolIdFromURL = searchParams.get("school_id");
      if (selectedSchools.length > 0) {
        query += `school_id=${selectedSchools.join(',')}&`; // Include selected schools
      } else if (schoolIdFromURL > 0) {
        query += `school_id=${schoolIdFromURL}&`; // Include schoolId in query if available
      }

      if (selectedBoards.length > 0) {
        query += `board=${selectedBoards.join(',')}&`; // Include board(s) in query if available
      }

      if (selectedClasses.length > 0) {
        // Join the selected classes and format them as a comma-separated string wrapped in double quotes
        const sectionNamesQuery = selectedClasses.map(className => `"${className}"`).join(',');
        query += `section_names=${sectionNamesQuery}&`; // Include section_names in query
      }
      
      // Add pagination parameters for server-side pagination
      query += `page=${currentPage}&page_size=${pageSize}&`;

      query = query.endsWith('&') ? query.slice(0, -1) : query;

      const url = `onboarding/courseslist/?session_id=${API_SESSION_ID}&${query}`;
      const result = await axiosInstance.get(url);

      if (result.status === 200 && result.data?.data) {
        // Extract the actual data array and pagination info from the nested structure
        const coursesData = result.data.data.data || [];
        const paginationInfo = result.data.data.pagination;
        
        const formattedData = coursesData.map(course => ({
          id: course.course_id,
          courseName: course.course_name,
          schoolName: course.school_name,
          class: course.sections.map(section => section.section_name).join(', '),
          subject: course.subject_name,
          board: course.board,
          updatedOn: course.updated_on,
          is_chapter_added: course.is_chapter_added,
        }));
        
        // Store all data for client-side pagination
        setAllData(formattedData);
        
        // Use server pagination info if available
        if (paginationInfo) {
          setTotalItems(paginationInfo.total_items || formattedData.length);
          setTotalPages(paginationInfo.total_pages || Math.ceil(formattedData.length / pageSize));
          setTableData(formattedData);
        } else {
          // Fallback to client-side pagination if server doesn't provide pagination info
          setTotalItems(formattedData.length);
          setTotalPages(Math.ceil(formattedData.length / pageSize));
          
          // Apply client-side pagination
          const startIndex = (currentPage - 1) * pageSize;
          const endIndex = startIndex + pageSize;
          setTableData(formattedData.slice(startIndex, endIndex));
        }
      } else {
        setError('Error fetching courses: Invalid response format');
        setTableData([]);
        setTotalItems(0);
        setTotalPages(0);
      }
    } catch (err) {
      setTableData([]);
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [selectedSchools, selectedBoards, selectedClasses, currentPage, pageSize]);
  
  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const applyFilters = () => {
    setCurrentPage(1); // Reset to first page when filters are applied
    toggleFilter();
  };


  const columns = useMemo(
    () => [
      {
        Header: 'Course ID',
        accessor: 'id',
        disableSortBy: true,
      },
      {
        Header: 'Course Name',
        accessor: 'courseName',
      },
      {
        Header: 'School Name',
        accessor: 'schoolName',
      },
      {
        Header: 'Section',
        accessor: 'section',
        Cell: ({ row }) => <ClassroomCell classroom={row.original.class} />,
        disableSortBy: true,
      },
      {
        Header: 'Subject',
        accessor: 'subject',
        disableSortBy: true,
      },
      {
        Header: 'Board',
        accessor: 'board',
      },
      {
        Header: 'Updated On',
        accessor: 'updatedOn',
      },
      {
        Header: 'Action',
        accessor: 'action',
        disableSortBy: true,
        Cell: ({ row }) => (
          <ActionMenu
            row={row}
            tableData={tableData}
            setTableData={setTableData}
          />
        ),
      },
    ],
    [tableData]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: tableData }, useFilters, useSortBy);

  // Toggle the filter visibility
  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  // Handle search input change for schools
  const handleSearchChangeSchool = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuerySchool(query);
    const filtered = schools.filter(school => school.school_name.toLowerCase().includes(query));
    setFilteredSchools(filtered);
  };

  const handleSearchChangeClass = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQueryClass(query);
    const filtered = classes.filter(cls => cls.section_name.toLowerCase().includes(query));
    setFilteredClasses(filtered);
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedSchools([]);
    setSelectedClasses([]);
    setSearchQuerySchool('');
    setSearchQueryClass('');
    setFilteredSchools(schools);
    setFilteredClasses(classes);
    setShowMoreSchools(false);
    setShowMoreClasses(false);
    setSelectedBoards([]);
    setCurrentPage(1);
  };

  // Apply filters
  return (
    <div className="right_content">
      {loading ? <Loader /> : ''}
      <ToastContainer />
      <div className="table_head">
        <p>Courses</p>
        <div className="table_head_right">
          <button onClick={toggleFilter}><FiFilter /> Filter</button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="filter-box">
          <div className="filter-header">
            <span>Filter</span>
            <button onClick={toggleFilter} className="filter-cross"><RxCross2 /></button>
          </div>

          <div className="filter-body">
            <div className="filter-body-1">
              <label>Board</label>
              <div className="filter-options">
                {boards.map((board, index) => (
                  <label key={index}>
                    <input
                      type="checkbox"
                      checked={selectedBoards.includes(board)} // Update checked state based on selectedBoards
                      onChange={() => {
                        const updatedSelectedBoards = selectedBoards.includes(board)
                          ? selectedBoards.filter(b => b !== board)
                          : [...selectedBoards, board];
                        setSelectedBoards(updatedSelectedBoards); // Update the selectedBoards state
                      }}
                    />
                    {board}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-body-1">
              <label>School Name</label>
              <div className="input-wrapper">
                <IoSearchOutline className="icon" />
                <input
                  type="text"
                  className="custom-input"
                  placeholder="Search school"
                  value={searchQuerySchool}
                  onChange={handleSearchChangeSchool}
                />
              </div>
              <div className="filter-options">
                {loading && <p>Loading schools...</p>}
                {error && <p>{error}</p>}

                {filteredSchools.slice(0, showMoreSchools ? filteredSchools.length : 3).map((school, index) => (
                  <label key={index}>
                    <input
                      type="checkbox"
                      checked={selectedSchools.includes(school.public_id)}
                      onChange={() => {
                        const updatedSelected = selectedSchools.includes(school.public_id)
                          ? selectedSchools.filter(id => id !== school.public_id)
                          : [...selectedSchools, school.public_id];
                        setSelectedSchools(updatedSelected);
                      }}
                    />
                    {school.school_name}
                  </label>
                ))}

                <div className="show-more-container">
                  <button className="show-more-btn" onClick={() => setShowMoreSchools(!showMoreSchools)} >
                    {showMoreSchools ? 'Show Less' : 'Show More'}
                  </button>
                </div>
              </div>
            </div>

            {/* Class Filter */}
            <div className="filter-body-2">
              <label>Class</label>
              <div className="input-wrapper">
                <IoSearchOutline className="icon" />
                <input
                  type="text"
                  className="custom-input"
                  placeholder="Search class"
                  value={searchQueryClass}
                  onChange={handleSearchChangeClass}
                />
              </div>
              <div className="filter-options">
                {filteredClasses.slice(0, showMoreClasses ? filteredClasses.length : 3).map((cls, index) => (
                  <label key={index}>
                    <input
                      type="checkbox"
                      checked={selectedClasses.includes(cls.section_name)}
                      onChange={() => {
                        const updatedSelected = selectedClasses.includes(cls.section_name)
                          ? selectedClasses.filter(id => id !== cls.section_name)
                          : [...selectedClasses, cls.section_name];
                        setSelectedClasses(updatedSelected);
                      }}
                    />
                    {cls.section_name}
                  </label>
                ))}

                <div className="show-more-container">
                  <button
                    className="show-more-btn"
                    onClick={() => setShowMoreClasses(!showMoreClasses)}
                  >
                    {showMoreClasses ? 'Show Less' : 'Show More'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="filter-footer">
            <button onClick={resetFilters}>Reset</button>
            <button onClick={applyFilters}>Apply</button>
          </div>
        </div>
      )}

      {isFilterOpen && <div className="overlay active" onClick={toggleFilter}></div>}

      <div className="table-wrapper">
        <table {...getTableProps()} className="table">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={column.id}
                  >
                    <div className="th-content">
                      {column.render('Header')}
                      {!column.disableSortBy && (
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? <FaCaretDown />
                              : <FaCaretUp />
                            : <TbCaretUpDownFilled />}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()} className="tbody_scroll">
            {rows.length > 0 ? (
              rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} key={row.id}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} key={cell.column.id}>
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={headerGroups[0].headers.length} className="no-data-message">
                  No courses available. Please check back later.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-controls">
            <button 
              className="pagination-button"
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1}
            >
              <FaChevronLeft />
            </button>
            
            {(() => {
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
              
              return pages.map((page, index) => 
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
              );
            })()}
            
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
              Showing {tableData.length} of {totalItems} courses
            </span>
            <select 
              value={pageSize} 
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
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
      )}
    </div>
  );
}


// ClassroomCell Component with centered text and icon
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




// ActionMenu Component with Delete Confirmation Modal
const ActionMenu = ({ row, tableData, setTableData }) => {
  const [showModal, setShowModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const courseName = row.original.courseName;


  const searchParams = useSearchParams();

  const [schoolId_url, setSchoolId_url] = useState(0);

  const handleDelete = async () => {
    try {
      // Assuming row contains the course ID and the API URL is dynamic
      const courseId = tableData[row.index].id; // Get the course ID from the current row

      const response = await axiosInstance.delete(`onboarding/course/${courseId}/delete/`);

      if (response.status === 200) {
        // Remove the row from the tableData state only if the API call is successful
        const newData = tableData.filter((_, index) => index !== row.index);
        setTableData(newData);
        setShowModal(false);
        toast.success('Course deleted successfully!');
      } else {
        toast.error('Failed to delete the course. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete the course. Please try again.');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };


    useEffect(() => {
    const schoolId_urlFromURL = searchParams.get("school_id");
    if (schoolId_urlFromURL) {
      setSchoolId_url(schoolId_urlFromURL);
    }
  }, [searchParams]);
  return (
    <div className="action-buttons">
      {/* added condition on row.original.is_chapter_added if true then show view course else show update */}
      {row.original.is_chapter_added ? (
        <Link href={`/onboarding/course/updatechapter/${row.original.id}?school_id=${schoolId_url}`} passHref>
          <button className='update-create-chapter create-class-btn' style={{width:'115px'}}>Update Course</button>
        </Link>
      ) : (
        <Link href={`/onboarding/course/addchapter/${row.original.id}?school_id=${schoolId_url}`} passHref>
          <button className="update-create-chapter create-class-btn" style={{width:'115px', backgroundColor:'#ff8a00' , borderColor:'#ff8a00'}}>Create Now</button>
        </Link>
      )}
      <Image
        src="/images/redDelet.svg"
        alt="Delete"
        width={20}
        height={24}
        style={{ cursor: 'pointer' , marginRight:'10px'}}
        onClick={() => setShowModal(true)}
      />

      {showModal && (
        <>
          <div className="modal-overlay" onClick={handleModalClose}>
            <div className="delete-modal" style={{ width: "400px" }} onClick={(e) => e.stopPropagation()}>
              <h2>Delete Course ?</h2>
              <p>Your course will be permanently deleted with no chance of recovery. This cannot be undone.</p>
              <p>
                Type <strong>{`"Delete ${courseName}"`}</strong> to confirm:
              </p>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type above message"
                className="confirm-input"
              />

              <div className="modal-actions">
                <button onClick={handleModalClose} className="cancel-btn">Cancel</button>
                <button
                  onClick={handleDelete}
                  className="confirm-btn"
                  disabled={confirmText !== `Delete ${courseName}`} // Disable button if the text doesn't match
                >
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