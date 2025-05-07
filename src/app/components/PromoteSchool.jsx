'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useTable, useSortBy } from 'react-table';
import Select from 'react-select';
import { RxCross2 } from 'react-icons/rx';
import { FiFilter } from "react-icons/fi";
import { IoSearchOutline } from 'react-icons/io5';
import { FaPlus, FaCaretDown, FaCaretUp, FaArrowLeft } from 'react-icons/fa';
import { TbCaretUpDownFilled } from 'react-icons/tb';

// Main PromotionPage Component
export default function PromotionPage() {
    const [activeTab, setActiveTab] = useState("classWise");
    const [isFilterOpen, setIsFilterOpen] = useState(false); // Toggle filter box
    const toggleFilter = () => setIsFilterOpen(!isFilterOpen);





    // Define state for sectionWiseData and studentWiseData
    const [sectionWiseData, setSectionWiseData] = useState([
        { id: 1, section: "Class 6A", students: 32, shiftTo: null },
        { id: 2, section: "Class 6B", students: 32, shiftTo: null },
        { id: 3, section: "Class 6C", students: 32, shiftTo: null },
        { id: 4, section: "Class 6A", students: 32, shiftTo: null },
        { id: 5, section: "Class 6B", students: 32, shiftTo: null },
        { id: 6, section: "Class 6C", students: 32, shiftTo: null },
    ]);

    const [studentWiseData, setStudentWiseData] = useState([
        { id: 1, userId: "1234", firstName: "John", lastName: "Doe", section: "Class 6A", shiftTo: null },
        { id: 2, userId: "1235", firstName: "Jane", lastName: "Smith", section: "Class 6B", shiftTo: null },
        { id: 3, userId: "1236", firstName: "Max", lastName: "Johnson", section: "Class 6C", shiftTo: null },
        { id: 4, userId: "1234", firstName: "John", lastName: "Doe", section: "Class 6A", shiftTo: null },
        { id: 5, userId: "1235", firstName: "Jane", lastName: "Smith", section: "Class 6B", shiftTo: null },
        { id: 6, userId: "1236", firstName: "Max", lastName: "Johnson", section: "Class 6C", shiftTo: null },
    ]);

    const classWiseData = [
        { id: 1, className: "Class 6", students: 450, currentYear: "2023 - 2024", shiftYear: "2024 - 2025" },
        { id: 2, className: "Class 7", students: 350, currentYear: "2023 - 2024", shiftYear: "2024 - 2025" },
        { id: 3, className: "Class 8", students: 650, currentYear: "2023 - 2024", shiftYear: "2024 - 2025" },
        { id: 4, className: "Class 9", students: 750, currentYear: "2023 - 2024", shiftYear: "2024 - 2025" },
        { id: 5, className: "Class 4", students: 250, currentYear: "2023 - 2024", shiftYear: "2024 - 2025" },
        { id: 6, className: "Class 5", students: 450, currentYear: "2023 - 2024", shiftYear: "2024 - 2025" },
    ];

    const classShiftOptions = useMemo(() => [
        { value: "Class 7A", label: "Class 7A" },
        { value: "Class 7B", label: "Class 7B" },
        { value: "Class 7C", label: "Class 7C" },
    ], []);

    const studentShiftOptions = useMemo(() => [
        { value: "Class 6D", label: "Class 6D" },
        { value: "Class 6E", label: "Class 6E" },
        { value: "Class 6F", label: "Class 6F" },
    ], []);

    const customStyles = useMemo(() => ({
        control: (base) => ({
            ...base,
            padding: "10px",
            borderColor: "#dcdcdc",
            boxShadow: "none",
            borderRadius: "5px",
            fontSize: "16px",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            minHeight: "50px",
        }),
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        menu: (base) => ({
            ...base,
            zIndex: 9999,
            width: '100%',
        }),
        placeholder: (base) => ({
            ...base,
            textAlign: 'left',
            color: "rgba(179, 179, 179, 1)",
            fontWeight: "700",
            fontSize: "16px",
        }),
        singleValue: (base) => ({
            ...base,
            textAlign: 'left',
            color: "rgba(83, 83, 83, 1)",
            fontWeight: "700",
            fontSize: "16px",
        }),
        indicatorSeparator: () => ({ display: "none" }),
        dropdownIndicator: (base) => ({
            ...base,
            color: "#ff8a00",
            ":hover": { color: "#ff8a00" },
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
    }), []);

    const handleSelectChange = (id, newValue, type) => {
        if (type === 'sectionWise') {
            setSectionWiseData(prevData => prevData.map(item => item.id === id ? { ...item, shiftTo: newValue } : item));
        } else if (type === 'studentWise') {
            setStudentWiseData(prevData => prevData.map(item => item.id === id ? { ...item, shiftTo: newValue } : item));
        }
    };

    const getTableColumns = () => {
        if (activeTab === 'classWise') {
            return [
                {
                    Header: "",
                    accessor: 'radio',
                    Cell: () => (
                        <input
                            type="radio"
                            className="custom-radio"
                            name="classRadio"
                        />
                    ),
                    disableSortBy: true,
                },
                { Header: 'Class Name', accessor: 'className' },
                { Header: 'Students', accessor: 'students' },
                { Header: 'Current Academic Year', accessor: 'currentYear' },
                { Header: 'Shift to Academic Year', accessor: 'shiftYear' },
                { Header: 'Status', accessor: 'status', disableSortBy: true, Cell: () => <span>&nbsp;</span> },
            ];
        } else if (activeTab === 'sectionWise') {
            return [
                {
                    Header: () => <input type="checkbox" />,
                    accessor: 'checkbox',
                    Cell: () => <input type="checkbox" />,
                    disableSortBy: true,
                },
                { Header: 'Class - Section', accessor: 'section' },
                { Header: 'Students', accessor: 'students' },
                {
                    Header: 'Shift To',
                    accessor: 'shiftTo',
                    Cell: ({ value, row }) => (
                        <Select
                            value={classShiftOptions.find(option => option.value === value)}
                            onChange={(selectedOption) => handleSelectChange(row.original.id, selectedOption.value, 'sectionWise')}
                            options={classShiftOptions}
                            styles={customStyles}
                            menuPosition="fixed"
                        />
                    ),
                },
                { Header: 'Status', accessor: 'status', disableSortBy: true, Cell: () => <span>&nbsp;</span> },
            ];
        } else if (activeTab === 'studentWise') {
            return [
                {
                    Header: () => <input type="checkbox" />,
                    accessor: 'checkbox',
                    Cell: () => <input type="checkbox" />,
                    disableSortBy: true,
                },
                { Header: 'User ID', accessor: 'userId' },
                { Header: 'First Name', accessor: 'firstName' },
                { Header: 'Last Name', accessor: 'lastName' },
                { Header: 'Class - Section', accessor: 'section' },
                {
                    Header: 'Shift To',
                    accessor: 'shiftTo',
                    Cell: ({ value, row }) => (
                        <Select
                            value={studentShiftOptions.find(option => option.value === value)}
                            onChange={(selectedOption) => handleSelectChange(row.original.id, selectedOption.value, 'studentWise')}
                            options={studentShiftOptions}
                            styles={customStyles}
                            menuPosition="fixed"
                        />
                    ),
                },
                { Header: 'Status', accessor: 'status', disableSortBy: true, Cell: () => <span>&nbsp;</span> },
            ];
        }
    };

    const getTableData = () => {
        if (activeTab === 'classWise') return classWiseData;
        if (activeTab === 'sectionWise') return sectionWiseData;
        if (activeTab === 'studentWise') return studentWiseData;
        return [];  // Fallback if none of the tabs match
    };

    return (
        <div className="right_content">

            {/* Header */}
            <div className="sch-creation-container">
                <div className="left-section">
                    <Link href="/createuser" className="link-button">
                        <FaArrowLeft />
                    </Link>
                    <span>Promotion</span>
                </div>
                <div className="right-section" >
                    <button className="download-template-btn" style={{ width: "130px", padding: "8px 15px" }}>
                        <FaPlus style={{ fontSize: '18px' }} /> Add User
                    </button>
                </div>
            </div>

            <div className="creation-wreaper">
                <div className="create-classSection" style={{ margin: "10px 0" }}>
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
                            <div className="info-item">
                                <span className="info-item-up">Academic Year</span>
                                <span className="info-item-down">2025 - 2026</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs for Table Types */}
                <div className="create-classSection" style={{ margin: "10px 0", padding: "20px 20px 0" }}>
                    <div className="toggle-header">
                        <span className={activeTab === "classWise" ? "active-toggle" : ""} onClick={() => setActiveTab("classWise")}>
                            Promote Class Wise
                        </span>
                        <span className={activeTab === "sectionWise" ? "active-toggle" : ""} onClick={() => setActiveTab("sectionWise")}>
                            Promote Section Wise
                        </span>
                        <span className={activeTab === "studentWise" ? "active-toggle" : ""} onClick={() => setActiveTab("studentWise")}>
                            Promote Student Wise
                        </span>
                    </div>
                </div>


                <div className="table_head" style={{ paddingTop: "0" }}>
                    <p>Total Users (10+12)</p>
                    <div className="table_head_right">
                        <div className="input-wrapper" style={{ top: "0" }}>
                            <IoSearchOutline className="icon" />
                            <input type="text" className="custom-input" placeholder="Search" />
                        </div>
                        <button onClick={toggleFilter} style={{ width: "180px" }}><FiFilter /> Filter</button>
                    </div>
                </div>

                {isFilterOpen && <div className="overlay active" onClick={toggleFilter}></div>}
                {isFilterOpen && <FilterBox toggleFilter={toggleFilter} />}

                {/* Table Section */}
                <TableComponent columns={getTableColumns()} data={getTableData()} />

                {/* Upload/Preview Button */}
                <div className="buttonGroup">
                    <div className="left">
                        <button
                            className="saveButton"
                            style={{ color: '#E95436' }}
                        >
                            Note: Only one class can be promoted at a time.
                        </button>

                    </div>
                    <div className="right">
                        <button className="nextButton">
                            Promote Class
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Table Component with consistent styles
const TableComponent = ({ columns, data }) => {
    // Ensure columns and data are defined and default to empty arrays if not.
    const tableColumns = columns || [];
    const tableData = data || [];

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns: tableColumns, data: tableData }, useSortBy);

    return (
        <table {...getTableProps()} className="table">
            <thead>
                {headerGroups.map((headerGroup, headerGroupIndex) => (
                    <tr {...headerGroup.getHeaderGroupProps()} key={headerGroupIndex}>
                        {headerGroup.headers.map((column, columnIndex) => (
                            <th {...column.getHeaderProps(column.getSortByToggleProps())} key={columnIndex}>
                                <div className="th-content">
                                    {column.render('Header')}
                                    {!column.disableSortBy && column.id !== 'status' && (
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
    );
};




// FilterBox Component with Search Input
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
