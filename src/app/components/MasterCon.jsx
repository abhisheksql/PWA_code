'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useTable, useSortBy, useRowSelect } from 'react-table';
import { FiFilter } from "react-icons/fi";
import { IoSearchOutline } from 'react-icons/io5';
import { FaArrowLeft, FaCaretDown, FaCaretUp } from "react-icons/fa";

import { IoAddSharp } from "react-icons/io5";
import { MdOutlineFileDownload } from "react-icons/md";
import { PiShuffleBold } from "react-icons/pi";
import { FiTrendingUp } from "react-icons/fi";
import { FiEdit3 } from 'react-icons/fi';
import Image from 'next/image';
import { RxCross2 } from 'react-icons/rx';

import { TbCaretUpDownFilled } from 'react-icons/tb';

export default function MasterCon() {
    const [studentData, setStudentData] = useState([
        { username: 'John47', userid: '1234', firstname: 'John', lastname: 'Doe', classsection: 'Class - 6A', mobilenumber: '+91 89370 12345', email: 'john@example.com', admissionid: 'CSKM1234', onboardingstatus: 'Sent' },
        { username: 'Jane67', userid: '2345', firstname: 'Jane', lastname: 'Doe', classsection: 'Class - 7B', mobilenumber: '+91 89370 23456', email: 'jane@example.com', admissionid: 'CSKM2345', onboardingstatus: 'Not Sent' },
        // Add more student data as needed
    ]);

    const [teacherData, setTeacherData] = useState([
        { username: 'TeacherA', userid: '7890', firstname: 'Michael', lastname: 'Smith', classsection: 'Class - 6A', mobilenumber: '+91 98200 12345', email: 'michael@example.com', onboardingstatus: 'Enabled' },
        { username: 'TeacherB', userid: '6789', firstname: 'Sarah', lastname: 'Johnson', classsection: 'Class - 7B', mobilenumber: '+91 98200 67890', email: 'sarah@example.com', onboardingstatus: 'Disabled' },
        // Add more teacher data as needed
    ]);

    const [isTeacherView, setIsTeacherView] = useState(false); // Toggle between student and teacher view
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [selectedRows, setSelectedRows] = useState([]); // Track selected rows for delete

    const columns = useMemo(() => {
        return isTeacherView ? teacherColumns(setTeacherData) : studentColumns(setStudentData);
    }, [isTeacherView]);

    const data = isTeacherView ? teacherData : studentData;

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
            data,
        },
        useSortBy, // Sorting hook
        useRowSelect,
        (hooks) => {
            hooks.visibleColumns.push((columns) => [
                {
                    id: 'selection',
                    Header: ({ getToggleAllRowsSelectedProps }) => (
                        <input type="checkbox" {...getToggleAllRowsSelectedProps()} />
                    ),
                    Cell: ({ row }) => (
                        <input type="checkbox" {...row.getToggleRowSelectedProps()} />
                    ),
                },
                ...columns,
            ]);
        }
    );

    // Function to handle delete action for selected rows
    const handleDeleteSelected = () => {
        const remainingData = studentData.filter((_, index) => !selectedRows.includes(index));
        setStudentData(remainingData);
        setShowDeleteModal(false);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setShowDeleteModal(false);
    };

    return (
        <div className="right_content">
            {/* Header for switching between Student and Teacher View */}
            <div className="sch-creation-container">
                <div className="left-section">
                    {/* <Link href="/createuser" className="link-button">
                        <FaArrowLeft />
                    </Link> */}
                    <span>Master Config</span>
                </div>

                {/* <div className="right-section" style={{ width: "160px" }}>
                    <Link href="/teacherdetail" className="download-template-btn" style={{ padding: "10px 33px" }}>
                        <IoAddSharp />
                        Add User
                    </Link>
                </div> */}

            </div>

            {isFilterOpen && <div className="overlay active" onClick={toggleFilter}></div>}

            {/* Filter Component */}
            {isFilterOpen && <FilterBox toggleFilter={toggleFilter} />}

            {/* Create Table Header */}
            <div className="creation-wreaper">
                
                
                {/* <div className="create-classSection" style={{ margin: "10px 0" }}>
                    <div className="class-form">
                        <div className="school-info" style={{ border: "none", marginBottom: "0", paddingBottom: "0" }}>
                            <div className="info-item">
                                <span className="info-item-up">School Name</span>
                                <span className="info-item-down">DPS Bangalore</span>
                            </div>
                            <div className="info-item">
                                <span className="info-item-up">School Code</span>
                                <span className="info-item-down">111</span>
                            </div>
                            <div className="info-item">
                                <span className="info-item-up">Board</span>
                                <span className="info-item-down">CBSE</span>
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* Toggle between Students and Teachers */}
                <div className="create-classSection" style={{ margin: "10px 0", padding: "20px 20px 0" }}>
                    <div className="toggle-header">
                        <span
                            className={!isTeacherView ? "active-toggle" : ""}
                            onClick={() => setIsTeacherView(false)}
                            style={{ marginRight: "20px" }}
                        >
                            Student - 450
                        </span>

                        <span
                            className={isTeacherView ? "active-toggle" : ""}
                            onClick={() => setIsTeacherView(true)}
                            style={{ cursor: "pointer" }}
                        >
                            Teacher - 25
                        </span>

                        <span
                            className={isTeacherView ? "active-toggle" : ""}
                            onClick={() => setIsTeacherView(true)}
                            style={{ cursor: "pointer" }}
                        >
                            Teacher - 25
                        </span>
                    </div>
                </div>

                {/* Table Header */}
                <div className="table_head" style={{ paddingTop: "0" }}>
                    <p>{isTeacherView ? "Total Teachers (25)" : "Total Students (450)"}</p>

                    <div className="table_head_right" style={{ justifyContent: "right" }}>
                        <div className="input-wrapper" style={{ top: "0", width: "70%" }}>
                            <IoSearchOutline className="icon" />
                            <input type="text" className="custom-input" placeholder="Search" />
                        </div>
                        <button onClick={toggleFilter} style={{ width: "100px", padding: "5px 10px" }}><FiFilter style={{ fontSize: "20px" }} /> Filter</button>
                    </div>
                </div>

                <div className="table-wrapper">
                    {/* Student or Teacher Table */}
                    <table {...getTableProps()} className="table">
                        <thead>
                            {headerGroups.map((headerGroup, headerGroupIndex) => (
                                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroupIndex}>
                                    {headerGroup.headers.map((column, columnIndex) => (
                                        <th {...column.getHeaderProps(column.getSortByToggleProps())} key={columnIndex}>
                                            <div className="th-content">
                                                {column.render('Header')}
                                                {/* Only show sorting icons for specific columns */}
                                                {['firstname', 'lastname', 'classsection', 'email'].includes(column.id) && (
                                                    <>
                                                        {column.isSorted
                                                            ? column.isSortedDesc
                                                                ? <FaCaretDown />
                                                                : <FaCaretUp />
                                                            : <TbCaretUpDownFilled />}
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
                                                {cell.render('Cell')}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                    {/* Delete Selected Button */}
                    <button
                        className="saveButton"
                        style={{ display: 'flex', gap: "10px", marginLeft: '10px', alignItems: "center", color: "#E95436", fontSize: "13px" }}
                        onClick={() => setShowDeleteModal(true)}
                    >
                        <Image
                            src="/"
                            alt="Delete"
                            width={20}
                            height={20}
                            style={{ cursor: 'pointer', marginLeft: '10px' }}
                        />
                        Delete Selected
                    </button>
                    <Link href="/previewuser" className="nextButton" style={{ width: "250px" }}>Send Onboarding Message</Link>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay" onClick={handleModalClose}>
                    <div className="delete-modal" style={{ width: "400px" }} onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ width: "300px", margin: '30px auto', textAlign: 'center', marginBottom: '50px' }}>What action would you like to take with the user?</h2>

                        <div className="modal-actions" >
                            <button className="confirm-btn" style={{ borderRadius: '5px', margin: '5px' }} onClick={() => setShowDeleteModal(false) && setShowModal(true)}> Delete </button>
                            <button className="confirm-btn" style={{ borderRadius: '5px', margin: '5px' }}> Suspend </button>
                            <button className="confirm-btn" style={{ borderRadius: '5px', margin: '5px' }}> Reactivate </button>
                        </div>

                    </div>
                </div>
            )}

            {/* Final Delete Confirmation Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={handleModalClose}>
                    <div className="delete-modal" style={{ width: "400px" }} onClick={(e) => e.stopPropagation()}>
                        <h2>Delete Class-Section?</h2>
                        <p>The section will be permanently deleted with no chance of recovery. This cannot be undone.</p>
                        <p>
                            Type <strong>{`"Delete Selected"`}</strong> to confirm:
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
                                onClick={handleDeleteSelected}
                                className="confirm-btn"
                                disabled={confirmText !== "Delete Selected"}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Columns for Student and Teacher tables
const studentColumns = (setTableData) => [
    {
        Header: 'User Name',
        accessor: 'username',
    },
    {
        Header: 'User ID',
        accessor: 'userid',
    },
    {
        Header: 'First Name',
        accessor: 'firstname',
    },
    {
        Header: 'Last Name',
        accessor: 'lastname',
    },
    {
        Header: 'Class - Section',
        accessor: 'classsection',
    },
    {
        Header: 'Mobile Number',
        accessor: 'mobilenumber',
    },
    {
        Header: 'Email ID',
        accessor: 'email',
    },
    {
        Header: 'Admission ID',
        accessor: 'admissionid',
    },
    {
        Header: 'Onboarding Status',
        accessor: 'onboardingstatus',
    },
    {
        Header: 'Action',
        accessor: 'action',
        Cell: ({ row }) => <ActionMenu row={row} setTableData={setTableData} />, // Pass props
    },
];

const teacherColumns = (setTableData) => [
    {
        Header: 'User Name',
        accessor: 'username',
    },
    {
        Header: 'User ID',
        accessor: 'userid',
    },
    {
        Header: 'First Name',
        accessor: 'firstname',
    },
    {
        Header: 'Last Name',
        accessor: 'lastname',
    },
    {
        Header: 'Class - Section',
        accessor: 'classsection',
    },
    {
        Header: 'Mobile Number',
        accessor: 'mobilenumber',
    },
    {
        Header: 'Email ID',
        accessor: 'email',
    },
    {
        Header: 'Onboarding Status',
        accessor: 'onboardingstatus',
    },
    {
        Header: 'Action',
        accessor: 'action',
        Cell: ({ row }) => <ActionMenu row={row} setTableData={setTableData} />, // Pass props
    },
];

// FilterBox Component
const FilterBox = ({ toggleFilter }) => {
    const [showMoreClasses, setShowMoreClasses] = useState(false);
    const classes = ['Class 6A', 'Class 7A', 'Class 8A', 'Class 6B', 'Class 6C', 'Class 6D', 'Class 7B', 'Class 7C'];

    return (
        <div className="filter-box">
            <div className="filter-header">
                <span>Filter</span>
                <button onClick={toggleFilter} className="filter-cross"><RxCross2 /></button>
            </div>
            <div className="filter-body">
                <div className="filter-body-2">
                    <label>Class</label>
                    <div className="input-wrapper">
                        <IoSearchOutline className="icon" />
                        <input type="text" className="custom-input" placeholder="Search class" />
                    </div>
                    <div className="filter-options">
                        {classes.slice(0, showMoreClasses ? classes.length : 5).map((className, index) => (
                            <label key={index}><input type="checkbox" /> {className}</label>
                        ))}
                        <div className="show-more-container">
                            <button className="show-more-btn" onClick={() => setShowMoreClasses(!showMoreClasses)}>
                                {showMoreClasses ? 'Show Less' : 'Show More'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="filter-footer">
                <button onClick={toggleFilter}>Reset</button>
                <button onClick={toggleFilter}>Apply</button>
            </div>
        </div>
    );
};

// ActionMenu Component
const ActionMenu = ({ row, setTableData }) => {
    const [showModal, setShowModal] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const sectionName = row.original.classsection; // Use section for the delete confirmation

    const handleDelete = () => {
        const newData = row.original.section.filter((_, index) => index !== row.index);
        setTableData(newData);
        setShowDeleteModal(false);
    };

    const handleModalClose = () => {
        setShowDeleteModal(false);
        setShowModal(false);
    };

    return (
        <div className="action-buttons" style={{ gap: "3px" }} >
            <Link href="./edituser" >
                <FiEdit3 style={{ cursor: 'pointer', color: "#3B3E98" }} />
            </Link>
            <Image
                src="/imgs/redDelet.svg"
                alt="Delete"
                width={20}
                height={24}
                style={{ cursor: 'pointer', marginLeft: '10px' }}
                onClick={() => setShowDeleteModal(true)}
            />

            {showDeleteModal && (
                <div className="modal-overlay" onClick={handleModalClose}>
                    <div className="delete-modal" style={{ width: "400px" }} onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ width: "300px", margin: '30px auto', textAlign: 'center', marginBottom: '50px' }}>What action would you like to take with the user?</h2>

                        <div className="modal-actions" style={{ justifyContent: 'center' }}>
                            <button className="confirm-btn" style={{ borderRadius: '5px', margin: '5px' }} onClick={() => { setShowDeleteModal(false); setShowModal(true); }}> Delete </button>
                            <button className="confirm-btn" style={{ borderRadius: '5px', margin: '5px' }} onClick={() => { setShowDeleteModal(false); setShowModal(true); }}> Suspend </button>
                            <button className="confirm-btn" style={{ borderRadius: '5px', margin: '5px' }} onClick={() => { setShowDeleteModal(false); setShowModal(true); }}> Reactivate </button>
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={handleModalClose}>
                    <div className="delete-modal" style={{ width: "400px" }} onClick={(e) => e.stopPropagation()}>
                        <h2>Delete Class-Section?</h2>
                        <p>The section will be permanently deleted with no chance of recovery. This cannot be undone.</p>
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
                            <button onClick={handleModalClose} className="cancel-btn">Cancel</button>
                            <button
                                onClick={handleDelete}
                                className="confirm-btn"
                                disabled={confirmText !== `Delete ${sectionName}`}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
