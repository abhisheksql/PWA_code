'use client';
import '../../../../public/style/teacher.css';
import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import { FiChevronDown } from "react-icons/fi";
import { useTeacherClassesList } from '../../hooks/teacher/useTeacherClassesList';

const ClassDropdown = ({ onClassChange, grade, subject }) => {

    const [grades, setGrade] = useState(grade);
    const [subjects, setSubject] = useState(subject);

    useEffect(() => {
        setGrade(grade);
        setSubject(subject);
    },[grade, subject]);


    const { classesList, loading: classesLoading, error: classesError } = useTeacherClassesList(grades, subjects);

    // Internal state for selected class
    const [selectedClass, setSelectedClass] = useState(null);

    // Generate class options for the dropdown
    const classOptions = useMemo(() => {
        const options = [
            { value: '', label: 'Select Class', sectionId: null, courseId: null, isDisabled: true } 
        ];

        // Add actual class options if classesList is available
        return [...options, ...(classesList?.map((classData) => ({
            value: classData.class_name,
            label: classData.class_name,
            sectionId: classData.section_id,
            courseId: classData.course_id,
        })) || [])];
    }, [classesList]); // Recalculate only when classesList changes

    // Handle dropdown change
    const handleDropdownChange = (selectedOption) => {
        const newSectionId = selectedOption.sectionId;
        const newCourseId = selectedOption.courseId;
        setSelectedClass(selectedOption);
        // Pass selected values to the parent component (if onClassChange is provided)
        if (onClassChange) {
            onClassChange(newSectionId, newCourseId, selectedOption);
        }
    };

    // Handle URL params for selecting class from the URL (optional, can be removed if not needed)
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const class_id = parseInt(searchParams.get('class_id'), 10);
        const course_id = parseInt(searchParams.get('course_id'), 10);
    
        let classOption;
    
        // If class_id and course_id exist, find the matching option
        if (class_id && course_id) {
            classOption = classOptions.find(
                (option) => option.sectionId === class_id && option.courseId === course_id
            );
        }
    
        // If no match is found, select the first option in the list as fallback
        if (!classOption && classOptions.length > 0) {
            classOption = classOptions[0];
        }
    
        // Set the selected class option if found
        if (classOption) {
            setSelectedClass(classOption);
        }
    }, [classOptions]);

    // Optionally handle loading and error states
    if (classesLoading) return <div>Loading classes...</div>;
    if (classesError) return <div>Error loading classes</div>;


      
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
    return (
        <div>
            <Select
                instanceId="class-select"
                value={selectedClass}
                onChange={handleDropdownChange}
                options={classOptions}
                placeholder="Select Class"
                styles={customStyles}
                isSearchable={false}
                components={{ DropdownIndicator: () => <FiChevronDown /> }}
                getOptionDisabled={(e) => e.isDisabled}
            />
        </div>
    );
};

export default ClassDropdown;
