'use client';
import { useState } from 'react';
import Select from 'react-select';
import Link from 'next/link';
import { FaArrowLeft } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { FaPlus } from "react-icons/fa6";

export default function PromotionDefault() {
    const [selectedFile, setSelectedFile] = useState(null); // Store selected file
    const [uploadProgress, setUploadProgress] = useState(0); // Store upload progress
    const [isUploading, setIsUploading] = useState(false); // Handle the uploading state
    const [isUploaded, setIsUploaded] = useState(false); // Handle the uploaded state

    const classOptions = [
        { value: 'AY2022 - 2023', label: 'AY2022 - 2023' },
        { value: 'AY2023 - 2024', label: 'AY2023 - 2024' },
        { value: 'AY2024 - 2025', label: 'AY2024 - 2025' },
        { value: 'AY2025 - 2026', label: 'AY2025 - 2026' },
        { value: 'AY2026 - 2027', label: 'AY2026 - 2027' },
    ];

    const uploadTypeOptions = [
        { value: 'AY2023 - 2023', label: 'AY2023 - 2023' },
        { value: 'AY2024 - 2024', label: 'AY2024 - 2024' },
    ];

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setIsUploading(true);

            // Simulating file upload progress
            const fakeUploadProgress = setInterval(() => {
                setUploadProgress(prevProgress => {
                    if (prevProgress >= 100) {
                        clearInterval(fakeUploadProgress);
                        setIsUploading(false);
                        setIsUploaded(true);
                        return 100;
                    }
                    return prevProgress + 20;
                });
            }, 500); // Increment progress every 500ms for simulation
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setUploadProgress(0);
        setIsUploaded(false);
    };

    const customStyles = {
        control: (base) => ({
            ...base,
            padding: '10px',
            borderColor: '#dcdcdc',
            boxShadow: 'none',
            borderRadius: '5px',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            minHeight: '50px',
        }),
        option: (provided, state) => ({
            ...provided,
            fontWeight: state.isSelected ? 700 : 500,
            fontSize: '14px',
            color: state.isSelected ? 'rgba(94, 94, 94, 1)' : '#000',
            backgroundColor: state.isSelected ? 'rgba(253, 229, 202, 1)' : '#fff',
            '&:hover': {
                backgroundColor: 'rgba(253, 229, 202, 1)',
            },
        }),
        dropdownIndicator: (base) => ({
            ...base,
            color: '#ff8a00',
            padding: '0 8px',
        }),
        indicatorSeparator: () => ({
            display: 'none', // Remove the separator
        }),
        placeholder: (styles) => ({
            ...styles,
            color: 'rgba(179, 179, 179, 1)',
            fontWeight: '700',
            fontSize: '15px',
        }),
    };

    return (
        <div className="right_content">

            <div className="sch-creation-container">
                <div className="left-section">
                    <Link href="/createuser" className="link-button">
                        <FaArrowLeft />
                    </Link>
                    <span>Promotion</span>
                </div>

                <div className="right-section">
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

                <div className="sch-creation-container">
                    <div className="left-section" style={{ display: "block" }}>
                        <span style={{ display: "block" }}>Academic Year</span>
                        <p style={{ fontSize: "16px", fontWeight: "700", color: "#8E8E93", margin: "5px 0" }}>Select the academic year for promotion</p>
                    </div>

                </div>

                <div className="create-classSection" style={{ margin: "10px 0" }}>
                    <div className="formRow">
                        <div className="inputGroup">
                            <label>From Year</label>
                            <Select
                                options={classOptions}
                                styles={customStyles}
                                placeholder="Select Class"
                                menuPosition="fixed"
                            />
                        </div>
                        <div className="inputGroup">
                            <label>To Year</label>
                            <Select
                                options={uploadTypeOptions}
                                styles={customStyles}
                                placeholder="Select Upload Type"
                                menuPosition="fixed"
                            />
                        </div>
                    </div>
                </div>


                <div className="create-classSection" style={{ margin: "10px 0" }}>

                    <div className="radio-options" style={{ display: "flex", gap: "25px" }}>
                        <label>
                            <input type="radio" className="custom-radio" name="promotion-type" />
                            Promote Class Wise
                        </label>
                        <label>
                            <input type="radio" className="custom-radio" name="promotion-type" />
                            Promote Section Wise
                        </label>
                        <label>
                            <input type="radio" className="custom-radio" name="promotion-type" />
                            Promote Student Wise
                        </label>
                    </div>
                </div>


                {/* Upload/Preview Button */}
                <div className="buttonGroup">
                    <div className="left"></div>
                    <div className="right">
                        <button className="nextButton">
                            Next
                        </button>
                    </div>
                </div>

            </div>   
        </div>
    );
}
