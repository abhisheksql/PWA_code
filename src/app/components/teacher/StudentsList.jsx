'use client';
import '../../../../public/style/teacher.css';
import React, { useEffect, useState, useMemo } from 'react';
import Select from 'react-select';
import { FiChevronDown } from 'react-icons/fi';
import Image from 'next/image';
import Left from '../../../../public/images/teacher/left.svg';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-circular-progressbar/dist/styles.css';
import User from '../../../../public/images/teacher/User.svg';
import Loader from "../../components/teacher/Loader";
import { useTeacherClassesList } from '../../hooks/teacher/useTeacherClassesList';
import { useStudentsList } from '../../hooks/teacher/useStudentsList';
import Skeleton from '../../components/Skeleton';
import { useSearchParams, useRouter } from "next/navigation";


const Students = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const class_id = searchParams.get("class_id");
    const course_id = searchParams.get("course_id");
    const [isLoader, setIsLoader] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [sectionId, setSectionId] = useState(class_id);
    const [courseId, setCourseId] = useState(course_id);

    const { classesList, loading: classesLoading, error: classesError } = useTeacherClassesList(18);
    const { studentsList, loading: studentsLoading, error: studentsError } = useStudentsList(sectionId, courseId);

    // Memoize class options to prevent recalculating on every render
    const classOptions = useMemo(() => {
        return classesList?.map((classData) => ({
            value: classData.class_name,
            label: classData.class_name,
            sectionId: classData.section_id.toString(), 
            courseId: classData.course_id.toString(),
        })) || [];
    }, [classesList]);

    // Set default selected class based on class_id and course_id from URL params
    useEffect(() => {
        // setIsLoader(true);
        if (class_id && course_id && classOptions.length > 0) {
            const currentClass = classOptions.find(
                (option) => option.sectionId === class_id && option.courseId === course_id
            );

            console.log("class_id:", class_id, "course_id:", course_id, "classOptions:", classOptions); // Debugging log
            if (currentClass) {
                setSelectedClass(currentClass);
                setSectionId(currentClass.sectionId);
                setCourseId(currentClass.courseId);
            }
        }
        // setIsLoader(false);

    }, [class_id, course_id, classOptions]);

    // useEffect(() => {
    //     // if (!classesLoading && !studentsLoading) {
    //     //     setIsLoader(false);
    //     // } else {
    //     //     setIsLoader(true);
    //     // }
    // }, [classesLoading, studentsLoading]);


    const handleDropdownChange = (selectedOption) => {
        setSelectedClass(selectedOption);
        setSectionId(selectedOption.sectionId);
        setCourseId(selectedOption.courseId);
    };

    const studentsData = studentsList?.students?.map((student) => ({
        student_id: student.student_id,
        name: student.student_name,
        completion: student.completion,
        learningIndex: student.learning_index || 0,
        activityLog: student.activity_log,
        proficiency_level: student.proficiency_level
    })) || [];


    const customStyles = {
        control: (base) => ({
            ...base,
            border: '1px solid #6166AE',
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            padding: '5px',
            cursor: 'pointer',
            '&:hover': {
                borderColor: '#6166AE',
            },
        }),

        valueContainer: (base) => ({
            ...base,
            padding: '5px 15px',
        }),
        placeholder: (base) => ({
            ...base,
            color: '#949494',
            fontSize: '16px',
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
        }),
        singleValue: (base) => ({
            ...base,
            color: '#3B3B3B',
            fontSize: '16px',
        }),
        dropdownIndicator: (base) => ({
            ...base,
            color: '#6166AE',
        }),
        indicatorSeparator: () => ({
            display: 'none',
        }),

        option: (styles, { isSelected, isFocused }) => ({
            ...styles,
            backgroundColor: isSelected
                ? '#6166AE26'
                : isFocused
                    ? 'rgba(246, 246, 246, 1)'
                    : 'white',
            color: isSelected ? '#6166AE' : '#000',
            cursor: 'pointer',
            ':hover': {
                backgroundColor: '#6166AE26',
                color: '#6166AE',
            },
        }),

    };

    const handleBackButtonClick = () => {
        setIsLoader(true);
        router.push(`/teacher/class_overview?class_id=${class_id}&course_id=${course_id}`);
    };

    // Handle row click
    const handleRowClick = (student_id) => {
        router.push(`/teacher/reports/studentdetails?class_id=${class_id}&course_id=${course_id}&student_id=${student_id}`);
    };

    return (
        <div className="class-overview-container">
            <div className="class-overview-header">
                <div className="classheading" >
                    <span onClick={handleBackButtonClick} style={{ cursor: 'pointer' }}>
                        <Image src={Left} alt="Back Icon" width={20} height={20} />
                    </span>
                    <h2>Students</h2>
                </div>
                <div className="dropdown-container">
                    <Select
                        instanceId="class-select"
                        value={selectedClass}
                        onChange={handleDropdownChange}
                        options={classOptions}
                        placeholder="Select Class"
                        styles={customStyles}
                        isSearchable={false}
                        components={{ DropdownIndicator: () => <FiChevronDown /> }}
                    />
                </div>
            </div>



            <div className="students-table-container">
                <table className="students-table">
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left' }}>Student Name</th>
                            <th>Completion Rate (C.R.)</th>
                            <th>Proficiency</th>
                            <th>Activity Log</th>
                            {/* <th>Action</th> */}
                        </tr>
                    </thead>
                    <tbody style={{width:'100%'}}>

                        {studentsLoading ? (
                            // Shimmer effect for loading state
                            Array(5).fill('').map((_, index) => (
                                    <tr key={index} className='studentlist-skeleton'>
                                        <td className="student-name">
                                            <div className="student-info">
                                                <div className="studentlist-icon-container">
                                                    <Skeleton width="30px" height="30px" borderRadius="50%" />
                                                </div>
                                                <Skeleton width="100px" height="20px" style={{ marginLeft: '10px' }} />
                                            </div>
                                        </td>
                                        <td className="concept-reach">
                                            <Skeleton width="50px" height="50px" borderRadius="50%" />
                                        </td>
                                        <td className="skelet0n15020">
                                            <Skeleton width="150px" height="20px"/>
                                        </td>
                                        <td className="skelet0n15020">
                                            <Skeleton width="150px" height="15px" />
                                        </td>
                                    </tr>
                                ))
                        ) : (

                            studentsData.map((student, index) => (
                                // add link to student profile
                                <tr key={index} 
                                onClick={() => handleRowClick(student.student_id)} // On row click, navigate to the student details page
                                style={{ cursor: 'pointer', "border-bottom": "1px solid #efefef" }}
                                >
                                    <td className="student-name">
                                        <div className="student-info">
                                            <div className="studentlist-icon-container">
                                                <Image src={User} alt="Student Icon" width={30} height={30} />
                                            </div>
                                            <span className="class-name">{student.name}</span>
                                        </div>
                                    </td>
                                    <td >
                                        <div className='dfjc'>
                                            <div className="circular-progress-container">
                                                <CircularProgressbar
                                                    value={student.completion != null ? (student.completion * 100) : 0}
                                                    text={student.completion != null ? `${(student.completion * 100).toFixed(0)}%` : "0%"}
                                                    styles={buildStyles({
                                                        textSize: '24px',
                                                        pathColor: '#6166AE',
                                                        textColor: '#6166AE',
                                                        trailColor: '#e0e0e0',
                                                    })}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="learning-index" style={{ width: '220px' }}>
                                        <ProgressBar style={{ height: '18px', borderRadius: '2px' }}>
                                            <ProgressBar now={student.proficiency_level?.master * 100} style={{ backgroundColor: '#24AD60' }} label={<span style={{ fontSize: '7px', fontWeight: '700' }}>{Math.floor(student.proficiency_level?.master * 100)}%</span>} />
                                            <ProgressBar now={student.proficiency_level?.proficiency * 100} style={{ backgroundColor: '#9DCA45' }} label={<span style={{ fontSize: '7px', fontWeight: '700' }}>{Math.floor(student.proficiency_level?.proficiency * 100)}%</span>} />
                                            <ProgressBar now={student.proficiency_level?.developing * 100} style={{ backgroundColor: '#FFCA28' }} label={<span style={{ fontSize: '7px', fontWeight: '700' }}>{Math.floor(student.proficiency_level?.developing * 100)}%</span>} />
                                            <ProgressBar now={student.proficiency_level?.critical * 100} style={{ backgroundColor: '#FD6845' }} label={<span style={{ fontSize: '7px', fontWeight: '700' }}>{Math.floor(student.proficiency_level?.critical * 100)}%</span>} />
                                        </ProgressBar>
                                    </td>
                                    <td className="class-students">
                                        {student.activityLog.charAt(0).toUpperCase() + student.activityLog.slice(1)}
                                    </td>

                                    {/* <td className="action">
                                        <button className="start-task-button">Send Message</button>
                                    </td> */}
                                </tr>

                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {isLoader ? <Loader /> : ""}
        </div>
    );
};

export default Students; 
