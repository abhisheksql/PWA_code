"use client";
import { useEffect, useState } from "react";
import Select from "react-select";
import Link from "next/link";
import { MdOutlineFileDownload, MdOutlineCloudUpload } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import Image from "next/image";
import Papa from "papaparse";
import CsvLogo from "../../../public/images/or.csv.svg";
import Loader from "../components/Loader";
import { FiEdit3 } from "react-icons/fi";
import { useTable } from "react-table";
import React from "react";
import axiosInstance from "../auth";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_SESSION_ID = process.env.NEXT_PUBLIC_ONBOARDING_SESSION_ID;
export default function UserCreation({
  isClass,
  schoolId,
  schoolName,
  schoolCode,
  board,
}) {
  const OnboardingApiUrl = process.env.NEXT_PUBLIC_LEAP_API_URL;
  const [selectedFile, setSelectedFile] = useState(null); // Store selected file
  const [uploadProgress, setUploadProgress] = useState(0); // Store upload progress
  const [isUploading, setIsUploading] = useState(false); // Handle the uploading state
  const [isUploaded, setIsUploaded] = useState(false); // Handle the uploaded state
  const [checkUploaded, setCheckUploaded] = useState(0);
  const [schoolSectionData, setSchoolSectionData] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [fileName, setFileName] = useState("");
  const [classLabel, setClasslabel] = useState([]);
  const [selectTemplateValue, setSelectTemplatevalue] = useState([]);
  const [sectionId, setSectionId] = useState(0);
  const [uploadType, setUploadType] = useState(null);
  const [colValue, SetColValue] = useState(1);
  const [isLoader, setIsLoader] = useState(false);
  const [fileSave, setISaveFile] = useState('');
  const router = useRouter();
  const uploadTypeOptions = [
    { value: 1, label: "Add New Only" },
    { value: 2, label: "Update Existing Only" },
  ];

  // Function to download CSV template
  const handleDownloadTemplate = () => {
    // Define CSV content (template data)
    const csvTemplate = [
      ["Name", "Email", "Class", "Phone Number"], // CSV headers
      ["John Doe", "johndoe@example.com", "Class 1", "1234567890"], // Example row
      ["Jane Smith", "janesmith@example.com", "Class 2", "0987654321"], // Example row
    ];

    // create student template csv 
 
    const studentcreate = [
      ["username", "password", "firstname", "lastname", "email", "role1", "phone1", "coursecode", "classcode", "profile_field_admission_number"], // CSV headers
      [, , "Minki", "Agarwal", "minki@gmail.com", "student", 8123409789, "c6a-math,c6a-hindi", "c6a", "ghjk09823456"], // Example row
      [, , "Gini", "Agarwal", "gini_ag@gmail.com", "student", 8123409780, "c6a-math", "c6a", "ghjk09823452"], // Example row
      [, , "Fena", "Goel", "fgoel@gmail.com", "student", 8755464318, "c6a-math", "c6a", "ghjk09823450"], // Example row
      [, , "Dina", "Agarwal", "dina_ag@gmail.com", "student", 8755464319, "c6a-math", "c6a", "ghjk09823453"], // Example row
    ];

    // update student template csv
    const studentupdate = [
      ["username", "firstname", "lastname", "email", "profile_field_admission_number", "role1", "phone1", "coursecode", "classcode"], // CSV headers
      ["dpsl057785", "Saif", "AliKhan", "saifalikhan@example.com", "ADM1017785", "student", 9012376851, "c6a-math,c6a-science,c6a-art", "c6a"], // Example row
      ["dpsl057784", "Taimur", "AliKhan", "taimurkhan@example.com", "ADM1017784", "student", 9012376851, "c6a-math,c6a-science,c6a-art", "c6a"], // Example row
    ];

    // create teacher template csv
    const teachercreate = [
      ["username", "password", "firstname", "lastname", "email", "profile_field_admission_number", "role1", "phone1", "coursecode", "classcode"], // CSV headers
      [, , "Sarika", "Agarwal", "sarika@gmail.com", , "teacher", 7345128967, "c6a-math,c6b-math", "c6a,c6b"], // Example row
      [, , "Rajni", "Agarwal", "sarika@gmail.com", , "teacher", 7345120967, "c6a-math", "c6a"], // Example row
      [, , "Sarika", "Goel", "sarika@gmail.com", , "teacher", 7345120967, "c6a-math", "c6a"], // Example row
      [, , "Sarika", "Agarwal", "sarika@gmail.com", , "teacher", 7345120967, "c6a-math,c6a-hindi", "c6a"], // Example row
    ];

    // update teacher template csv
    const teacherupdate = [
      ["username", "firstname", "lastname", "email", "profile_field_admission_number", "role1", "phone1", "coursecode", "classcode"], // CSV headers
      ["ranbir@example.com", "Ranbir", "Agarwal", "ranbir@example.com", "hj72539", "teacher", 9123040987, "c6a-", "c6a,c6b"], // Example row
      ["ranbir@example.com", "Ranbir", "Kapoor", "ranbir@example.com", "hj72539", "teacher", 9123040987, "c8a-math", "c8a"], // Example row
      ["ranbir@example.com", "Ranbir", "Kapoor", "ranbir_4567@example.com", "hj72539", "teacher", 9123090987, "c8b-math", "c8b"], // Example row
    ];


    // update teacher template csv
    const createstudents_classwise = [
      ["username", "password", "firstname", "lastname", "email", "profile_field_admission_number", "role1", "phone1", "coursecode"], // CSV headers
      [, , "Minki", "Agarwal", "minki@gmail.com", "ghjk09823456", "student", 8123409789, "c6a-math"], // Example row
      [, , "Gini", "Agarwal", "gini_ag@gmail.com", "ghjk09823452", "student", 8123409780, "c6a-math"], // Example row
      [, , "Fena", "Goel", "fgoel@gmail.com", "ghjk09823450", "student", 8755464318, "c6a-math"], // Example row
      [, , "Dina", "Agarwal", "dina_ag@gmail.com", "ghjk09823453", "student", 8755464319, "c6a-math"], // Example row
    ];

    let csvTemplateName = '';
    let downloadedName = '';

    if (selectTemplateValue.value == 1) {
      csvTemplateName = studentcreate;
      downloadedName = 'studentcreate';
    } else if (selectTemplateValue.value == 2) {
      csvTemplateName = teachercreate;
      downloadedName = 'teachercreate';
    } else if (selectTemplateValue.value == 3) {
      csvTemplateName = studentupdate;
      downloadedName = 'studentupdate';
    } else if (selectTemplateValue.value == 4) {
      csvTemplateName = teacherupdate;
      downloadedName = 'teacherupdate';
    } else if (selectTemplateValue.value == 5) {
      csvTemplateName = createstudents_classwise;
      downloadedName = 'createstudents_classwise';
    } else {
      csvTemplateName = studentcreate;
      downloadedName = 'studentcreate';
    }
    // Convert to CSV string
    // const csvString = Papa.unparse(csvTemplate);
    const csvString = Papa.unparse(csvTemplateName);
    // Create a Blob from the CSV string
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });

    // Create a link element to trigger the download
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", downloadedName); // Name of the downloaded file
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up
  };

  const handleFileUpload = async (event) => {

    const file = event.target.files[0];
    setISaveFile(file);
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);

      let colcheck = file.name.toLowerCase().includes("teacher") ? 2 : 1;
      let checktype = file.name.toLowerCase().includes("Create")
        ? 1
        : file.name.includes("Update")
          ? 2
          : 0;
      setCheckUploaded(checktype);
      SetColValue(colcheck);
      setIsUploading(true);

      // Simulating file upload progress
      const fakeUploadProgress = setInterval(() => {
        setUploadProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(fakeUploadProgress);
            setIsUploading(false);
            return 100;
          }
          return prevProgress + 20;
        });
      }, 500); // Increment progress every 500ms for simulation
    }
    if (file && file.type !== "text/csv") {
      toast.error("Please upload a valid CSV file.", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
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
    placeholder: (base) => ({
      ...base,
      color: "rgba(179, 179, 179, 1)",
      fontWeight: "700",
      fontSize: "16px",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    }),
    singleValue: (base) => ({
      ...base,
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
  };

  useEffect(() => {
    let apiUrl;

    apiUrl = `onboarding/schools/${schoolId}/sections/?session_id=${API_SESSION_ID}`;
    const apiCall = async () => {
      try {
        const response = await axiosInstance.get(apiUrl, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status == 200) {
          const totalTeachers = response.data.data.total_teachers;
          const totalStudents = response.data.data.total_students;
          setSchoolSectionData(
            response.data.data.sections.map((item) => ({
              id: item.public_id,
              section_name: item.section_name,
              //   total_teachers: totalTeachers,  // Use total_teachers from the data level
              //   total_students: totalStudents,  // Use total_students from the data level
            }))
          );
          const classOptionsdata = response.data.data.sections.map(
            (section) => ({
              value: section.public_id.toString(),
              label: section.section_name,
            })
          );

          setClassOptions(classOptionsdata);
          if (isClass) {
            const selectedSectionResult = classOptionsdata.find(
              (item) => item.label == isClass
            );
            setClasslabel(selectedSectionResult);
            const valueOnly = selectedSectionResult
              ? selectedSectionResult.value
              : null;
            setSectionId(valueOnly);
          }
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
      }
    };
    apiCall();
  }, [schoolId, isClass]);

  const handleSelectClass = (selectedOptions) => {
    setClasslabel(selectedOptions);
    const value = Array.isArray(selectedOptions)
      ? selectedOptions.map((option) => option.value).join(", ") // If it's an array, join the values into a string
      : selectedOptions
        ? selectedOptions.value
        : ""; // If it's an object, take the value
    setSectionId(value);
  };

  const data = React.useMemo(
    () => [
      {
        firstName: "John",
        lastName: "Doe",
        class: "Class - 6A",
        role: "Teacher",
        email: "John@example.com",
        mobile: "+91 89370 12345",
        admissionID: "CSKM1844",
        errorType: "Invalid Mobile Number",
        actionType: "Create",
      },
      {
        firstName: "John",
        lastName: "Doe",
        class: "Class - 6A",
        role: "Teacher",
        email: "John@example.com",
        mobile: "+91 89370 12345",
        admissionID: "CSKM1844",
        errorType: "Incorrect Email",
        actionType: "Update",
      },
      // Add the rest of your data entries
    ],
    []
  );
  const handleGoBack = () => {
    router.back();
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "First Name",
        accessor: "firstName",
      },
      {
        Header: "Last Name",
        accessor: "lastName",
      },
      {
        Header: "Class - Section",
        accessor: "class",
      },
      {
        Header: "Role",
        accessor: "role",
      },
      {
        Header: "Email ID",
        accessor: "email",
      },
      {
        Header: "Mobile Number",
        accessor: "mobile",
        Cell: ({ row }) => (
          <span
            style={{
              color:
                row.original.errorType === "Invalid Mobile Number"
                  ? "red"
                  : "#000",
            }}
          >
            {row.original.mobile}
          </span>
        ),
      },
      {
        Header: "Admission ID",
        accessor: "admissionID",
      },
      {
        Header: "Error Type",
        accessor: "errorType",
      },
      {
        Header: "Type of Action",
        accessor: "actionType",
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: () => (
          <Link href="./edituser">
            <FiEdit3
              style={{ cursor: "pointer", color: "#3B3E98", fontSize: "20px" }}
            />
          </Link>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });
  const allErrors = localStorage.getItem("allErrors");
  // setIsLoader

  const handleCreateUserOne = () => {
    setIsLoader(true);
    // const editSchool = schoolId; // Get the value of the button
    router.push(
      `/onboarding/userdashboard/createuser?schoolEditId=${schoolId}&schoolName=${schoolName}&schoolCode=${schoolCode}&schoolBoard=${board}`
    );
  };

  const handlePreview = async () => {
    setIsLoader(true);

    if (fileSave) {
      setSelectedFile(fileSave);
      setFileName(fileSave.name);

      // let colcheck = fileSave.name.includes("Teacher") ? 2 : 1;
      let colcheck = fileSave.name.toLowerCase().includes("teacher") ? 2 : 1;
      let checktype = fileSave.name.includes("Create")
        ? 1
        : fileSave.name.includes("Update")
          ? 2
          : 0;
      // setCheckUploaded(checktype);
      // SetColValue(colcheck);
      setIsUploading(true);

      // Simulating file upload progress
      // const fakeUploadProgress = setInterval(() => {
      //   setUploadProgress((prevProgress) => {
      //     if (prevProgress >= 100) {
      //       clearInterval(fakeUploadProgress);
      //       setIsUploading(false);
      //       return 100;
      //     }
      //     return prevProgress + 20;
      //   });
      // }, 500); // Increment progress every 500ms for simulation

      const formData = new FormData();
      formData.append("file", fileSave);
      let classSegment;
      if (colcheck == 2) {
        classSegment = "";
      } else {
        classSegment = sectionId ? `class/${sectionId}/` : "";
      }

      let updatevalue = "False";
      if (uploadType == 1 || uploadType == null || uploadType == "") {
        updatevalue = "False";
      } else {
        updatevalue = "True";
      }

      const url = `onboarding/upload-csv/school/${schoolId}/${classSegment}?session_id=${API_SESSION_ID}&is_UPDATE=${updatevalue}`;
      try {
        const responseData = await axiosInstance.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        let response;

        if (typeof responseData.data == "string") {
          // Replace 'NaN' with 'null' to make it valid JSON
          const sanitizedData = responseData.data.replace(/NaN/g, "null");
          try {
            response = JSON.parse(sanitizedData);
          } catch (error) {
            console.error("Error parsing JSON:", error);
            return;
          }
        } else {
          response = responseData.data;
        }
        if (responseData.status == 200) {
          setIsUploaded(true);
          const transformAnomalyRows = (anomalyRows) => {
            if (!Array.isArray(anomalyRows)) {
              console.error("anomalyRows is not an array:", anomalyRows);
              return [];
            }
            return anomalyRows.map((row) => {
              const rowDetails = row.row_details || {};
              const allErrors = row.anamolies
                .map((anomaly) => anomaly.error)
                .join(", ");
              const orpassowrd =
                uploadType == 2
                  ? null
                  : { password: rowDetails.password || "" };
              const actiontypevalue =
                uploadType == 1 || uploadType == null || uploadType == ""
                  ? "Create"
                  : "Update";

              return {
                firstName: rowDetails.firstname || "",
                lastName: rowDetails.lastname || "",
                class: rowDetails.classcode || "",
                role: rowDetails.role1 || "",
                email: rowDetails.email || "",
                gender: rowDetails.gender || "",
                mobile: rowDetails.phone1 ? `${rowDetails.phone1}` : "",
                errorType: allErrors,
                actionType: actiontypevalue,
                coursecode: rowDetails.coursecode,
                username: rowDetails.username || "",
                ...orpassowrd,
                admissionID: rowDetails.profile_field_admission_number || "",
              };
            });
          };

          const transformApplicableRows = (applicableRows) => {
            if (!Array.isArray(applicableRows)) {
              console.error("applicableRows is not an array:", applicableRows);
              return [];
            }
            return applicableRows.map((row) => {
              const rowDetails = row.row_details || {};
              const orpassowrd =
                uploadType == 2
                  ? null
                  : { password: rowDetails.password || "" };
              const actiontypevalue =
                uploadType == 1 || uploadType == null || uploadType == ""
                  ? "Create"
                  : "Update";

              return {
                firstName: rowDetails.firstname || "",
                lastName: rowDetails.lastname || "",
                class: rowDetails.classcode || "",
                role: rowDetails.role1 || "",
                email: rowDetails.email || "",
                gender: rowDetails.gender || "",
                mobile: rowDetails.phone1 ? `${rowDetails.phone1}` : "",
                errorType: "", // No errors for applicable rows
                actionType: actiontypevalue,
                coursecode: rowDetails.coursecode,
                admissionID: rowDetails.profile_field_admission_number || "",
                ...orpassowrd,
                username: rowDetails.username || "",
              };
            });
          };

          const anomalyRowsFormatted = transformAnomalyRows(
            response.data.anomaly_rows || []
          );
          const applicableRowsFormatted = transformApplicableRows(
            response.data.applicable_rows || []
          );

          const allRowsFormatted = [
            ...anomalyRowsFormatted,
            ...applicableRowsFormatted,
          ];
          localStorage.setItem(
            "allErrors",
            response.data.total_error_count || 0
          );
          localStorage.setItem("allRows", JSON.stringify(allRowsFormatted));

          router.push(
            `/onboarding/userdashboard/previewuser?schoolEditId=${schoolId}&schoolName=${schoolName}&schoolCode=${schoolCode}&schoolBoard=${board}&colValue=${colValue}&uploadType=${uploadType}`
          );
        } else {
        }
        setIsLoader(false);
      } catch (error) {
        setIsLoader(false);
        setIsUploaded(false);
        toast.error(error?.response?.data?.message || 'invalid error', {
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
        console.error("Error uploading file:", error);
      } finally {
        setIsLoader(false);
      }
    } else {
      setIsLoader(false);
    }

    // const editSchool = schoolId; // Get the value of the button
    // router.push(
    //   `/onboarding/userdashboard/previewuser?schoolEditId=${schoolId}&schoolName=${schoolName}&schoolCode=${schoolCode}&schoolBoard=${board}&colValue=${colValue}&uploadType=${uploadType}`
    // );
  };

  const selectTemplate = [
    { value: 1, label: "Create Student" },
    { value: 2, label: "Create Teacher" },
    { value: 3, label: "Update Student" },
    { value: 4, label: "Update Teacher" },
    { value: 5, label: "Create Student Class-wise" },
  ];

  const handleDownloadCsv = (selectedOption) => {
    setSelectTemplatevalue(selectedOption); // Update state with the selected option
  }
  return (
    <div className="right_content">
      <div className="sch-creation-container">
        <div className="left-section">
          <button
            className="link-button"
            style={{ border: "none", backgroundColor: "transparent" }}
            onClick={handleGoBack}
          >
            <FaArrowLeft />
          </button>
          <span>Create User</span>
        </div>
        <div className="right-section" style={{ gap: "10px" }}>
          <Select
            value={selectTemplateValue}
            onChange={handleDownloadCsv}
            options={selectTemplate}
            styles={customStyles}
            placeholder="Select Template"
            menuPosition="fixed"
          />
          <button
            className="download-template-btn"
            onClick={handleDownloadTemplate}
          >
            <MdOutlineFileDownload />
            Download Template
          </button>
        </div>
      </div>

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
          </div>
        </div>
      </div>

      <div className="creation-wreaper" style={{ maxHeight: "50vh" }}>
        <div className="sch-creation-container">
          <div className="left-section">
            <span>Upload User</span>
          </div>
          <div className="right-section">
            <button
              onClick={handleCreateUserOne}
              className="onebyone"
              style={{ width: "auto" }}
            >
              Create user one by one
            </button>
          </div>
        </div>

        <div className="create-classSection" style={{ margin: "10px 0" }}>
          <div className="formRow">
            <div className="inputGroup">
              <label>Class</label>
              <Select
                value={classLabel}
                onChange={handleSelectClass}
                options={classOptions}
                styles={customStyles}
                placeholder="Select Class"
                menuPosition="fixed"
              />
            </div>
            <div className="inputGroup">
              <label>Upload Type</label>
              <Select
                onChange={(selectedOptions) => {
                  setUploadType(selectedOptions ? selectedOptions.value : null);
                }}
                options={uploadTypeOptions}
                styles={customStyles}
                placeholder="Select Upload Type"
                menuPosition="fixed"
              />
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        {uploadType !== null &&
          (!selectedFile ? (
            <div className="upload-user-section">
              <div className="upload-form">
                <div className="file-upload-section">
                  <div
                    className="file-upload-box"
                    onClick={() => document.getElementById("fileInput").click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const droppedFile = e.dataTransfer.files[0];
                      // if (droppedFile && droppedFile.type === "text/csv") {
                      //   handleFileUpload({ target: { files: [droppedFile] } });
                      // } else {
                      //   alert("Please upload a valid CSV file.");
                      // }

                      if (droppedFile && droppedFile.type !== "text/csv") {
                        toast.error("Please upload a valid CSV file.", {
                          position: "bottom-center",
                          autoClose: 5000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          theme: "colored",
                        });
                      }
                      
                    }}

                  >
                    <MdOutlineCloudUpload />
                    <p>
                      Drag your file(s) or <a href="#">Browse</a>
                    </p>
                    <span>Only supports Comma-Separated Value .CSV</span>
                    <input
                      type="file"
                      id="fileInput"
                      accept=".csv"
                      style={{ display: "none" }}
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="upload-user-section">
              <div className="file-info">
                <div className="file-info-left">
                  <Image
                    src={CsvLogo}
                    alt="Export CSV"
                    width={35}
                    height={35}
                    style={{ marginRight: "8px" }}
                  />
                  <div className="file-info-leftside">
                    <span className="file-name">{selectedFile.name}</span>
                    <span className="file-size">
                      {(selectedFile.size / 1024).toFixed(2)}kb
                    </span>
                  </div>
                </div>
                <div className="file-info-right" onClick={handleRemoveFile}>
                  <RxCross2 />
                </div>
              </div>
              {isUploading && (
                <div
                  className="progress-status"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      backgroundColor: "#e0e0e0",
                      height: "8px",
                      borderRadius: "4px",
                      position: "relative",
                      marginRight: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: `${uploadProgress}%`,
                        height: "100%",
                        backgroundColor: "#6166AE",
                        borderRadius: "4px",
                        transition: "width 0.5s ease",
                      }}
                    ></div>
                  </div>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "gray",
                      minWidth: "40px",
                      textAlign: "right",
                    }}
                  >
                    {uploadProgress}%
                  </span>
                </div>
              )}
            </div>
          ))}
        <div className="buttonGroup">
          <div className="left"></div>
          <div className="right">
            {/* {checkUploaded == uploadType && isUploaded && ( */}
            <button onClick={handlePreview} className="nextButton">
              Preview
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
            {/* )} */}
          </div>
        </div>
      </div>
      {isLoader ? <Loader /> : ""}
    </div>
  );
}
