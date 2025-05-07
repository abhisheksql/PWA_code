"use client";
import { FaArrowLeft } from "react-icons/fa";
import { FiFlag, FiEdit3, FiSave } from "react-icons/fi";
import { useTable } from "react-table";
import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../auth";
import { useRouter } from "next/navigation";
import Loader from "../components/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const API_SESSION_ID = process.env.NEXT_PUBLIC_ONBOARDING_SESSION_ID;
export default function PreviewUser({
  colValue,
  uploadType,
  schoolId,
  schoolName,
  schoolCode,
  board,
}) {
  // const storedRows = JSON.parse(localStorage.getItem("allRows"));
  const storedRows =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("allRows"))
      : "";
  const allErrors =
    typeof window !== "undefined" ? localStorage.getItem("allErrors") : "";
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [tableData, setTableData] = useState(storedRows);
  const [dataLength, setDataLength] = useState(0);
  const [updateTable, setUpdateTable] = useState(0);
  const [errors, setError] = useState(0);
  const [isLoader, setIsLoader] = useState(false);
  const router = useRouter();
  const spanRef = useRef(null);
  useEffect(() => {
    const storedRows =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("allRows")) || []
        : [];

    setTableData(storedRows);
    const storedRowsError =
      typeof window !== "undefined" ? localStorage.getItem("allErrors") : [];
    setError(storedRowsError);
  }, [updateTable]);

  useEffect(() => {
    setDataLength(storedRows.length);
  }, [storedRows.length, updateTable]);

  useEffect(() => {
    setError(allErrors);
  }, [allErrors]);
  const columns = React.useMemo(
    () => [
      {
        Header: "Username",
        accessor: "username",
        Cell: ({ value, row }) => (
          <span
            contentEditable={editRowIndex == row.index}
            suppressContentEditableWarning={true}
            style={{
              color: row.original.errorType?.split("-")[0].includes("username")
                ? "red"
                : "#000",
            }}
            onBlur={(e) =>
              handleInputChange(row.index, "username", e.target.textContent)
            }
          >
            {value}
          </span>
        ),
      },
      ...(uploadType == 1 ||
      uploadType == 0 ||
      uploadType == "" ||
      uploadType == null ||
      uploadType == "null"
        ? [
            {
              Header: "Password",
              accessor: "password",
              Cell: ({ value, row }) => (
                <span
                  contentEditable={editRowIndex == row.index}
                  suppressContentEditableWarning={true}
                  style={{
                    color: row.original.errorType?.split("-")[0].includes("password")
                      ? "red"
                      : "#000",
                  }}
                  onBlur={(e) =>
                    handleInputChange(
                      row.index,
                      "password",
                      e.target.textContent
                    )
                  }
                >
                  {value}
                </span>
              ),
            },
          ]
        : []),
      {
        Header: "First Name",
        accessor: "firstName",
        Cell: ({ value, row }) => (
          <span
            contentEditable={editRowIndex == row.index}
            suppressContentEditableWarning={true}
            style={{
              color: row.original.errorType?.split("-")[0].includes("firstname")
                ? "red"
                : "#000",
            }}
            onBlur={(e) =>
              handleInputChange(row.index, "firstName", e.target.textContent)
            }
          >
            {value || "\u00A0"}
          </span>
        ),
      },
      {
        Header: "Last Name",
        accessor: "lastName",
        Cell: ({ value, row }) => (
          <span
            contentEditable={editRowIndex == row.index}
            suppressContentEditableWarning={true}
            style={{
              color: row.original.errorType?.split("-")[0].includes("lastname")
                ? "red"
                : "#000",
            }}
            onBlur={(e) =>
              handleInputChange(row.index, "lastName", e.target.textContent)
            }
          >
            {value || "\u00A0" /* Ensures non-empty space for editing */}
          </span>
        ),
      },
      {
        Header: "Class - Section",
        accessor: "class",
        Cell: ({ value, row }) => (
          <span
            contentEditable={editRowIndex == row.index}
            suppressContentEditableWarning={true}
            style={{
              color: row.original.errorType?.split("-")[0].includes("class") ? "red" : "#000",
            }}
            onBlur={(e) =>
              handleInputChange(row.index, "class", e.target.textContent)
            }
          >
            {value || "\u00A0"}
          </span>
        ),
      },
      {
        Header: "Role",
        accessor: "role",
        Cell: ({ value, row }) => (
          <span
            contentEditable={editRowIndex == row.index}
            suppressContentEditableWarning={true}
            style={{
              color: row.original.errorType?.split("-")[0].includes("role") ? "red" : "#000",
            }}
            onBlur={(e) =>
              handleInputChange(row.index, "role", e.target.textContent)
            }
          >
            {value || "\u00A0"}
          </span>
        ),
      },
      {
        Header: "Email ID",
        accessor: "email",
        Cell: ({ value, row }) => (
          <span
            contentEditable={editRowIndex == row.index}
            suppressContentEditableWarning={true}
            style={{
              color: row.original.errorType?.split("-")[0].includes("email") ? "red" : "#000",
            }}
            onBlur={(e) =>
              handleInputChange(row.index, "email", e.target.textContent)
            }
          >
            {value || "\u00A0"}
          </span>
        ),
      },
      {
        Header: "Mobile Number",
        accessor: "mobile",
        Cell: ({ value, row }) => (
          <span
            contentEditable={editRowIndex == row.index}
            suppressContentEditableWarning={true}
            style={{
              color: row.original.errorType?.split("-")[0].includes("phone1") ? "red" : "#000",
            }}
            onBlur={(e) =>
              handleInputChange(row.index, "mobile", e.target.textContent)
            }
          >
            {value || "\u00A0"}
          </span>
        ),
      },
      {
        Header: "Gender",
        accessor: "gender",
        Cell: ({ value, row }) => (
          <span
            contentEditable={editRowIndex == row.index}
            suppressContentEditableWarning={true}
            style={{
              color: row.original.errorType?.split("-")[0].includes("gender") ? "red" : "#000",
            }}
            onBlur={(e) =>
              handleInputChange(row.index, "gender", e.target.textContent)
            }
          >
            {value || "\u00A0"}
          </span>
        ),
      },
      {
        Header: "Admission ID",
        accessor: "admissionID",
        Cell: ({ value, row }) => (
          <span
            contentEditable={editRowIndex === row.index}
            suppressContentEditableWarning={true}
            style={{
              color: row.original.errorType?.split("-")[0].includes(
                "profile_field_admission_number"
              )
                ? "red"
                : "#000",
            }}
            onBlur={(e) =>
              handleInputChange(row.index, "admissionID", e.target.textContent)
            }
          >
            {value || "\u00A0"}
          </span>
        ),
      },
      {
        Header: "Course Code",
        accessor: "coursecode",

        Cell: ({ value, row }) => (
          <span
            contentEditable={editRowIndex == row.index}
            suppressContentEditableWarning={true}
            style={{
              color: row.original.errorType?.split("-")[0].includes("coursecode")
                ? "red"
                : "#000",
            }}
            onBlur={(e) =>
              handleInputChange(row.index, "coursecode", e.target.textContent)
            }
          >
            {value || "\u00A0"}
          </span>
        ),
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
        Cell: ({ row }) =>
          editRowIndex === row.index ? (
            <FiSave
              style={{ cursor: "pointer", color: "#3B3E98", fontSize: "20px" }}
              onClick={() => handleSaveClick()}
            />
          ) : row.original.errorType ? (
            <FiEdit3
              style={{ cursor: "pointer", color: "#3B3E98", fontSize: "20px" }}
              onClick={() => handleEditClick(row)}
            />
          ) : null,
      },
    ],
    [editRowIndex, tableData, colValue, updateTable, uploadType]
  );

  const handleEditClick = (row) => {
    let rowiddata = row.index;
    setEditRowIndex(rowiddata);
  };

  const handleSaveClick = () => {
    setEditRowIndex(null);
  };

  const handleInputChange = (rowIndex, columnId, value) => {
    const updatedData = [...tableData];

    updatedData[rowIndex] = {
      ...updatedData[rowIndex],
      [columnId]: value,
    };
    setTableData(updatedData);
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      //  data: tableData
      data: Array.isArray(tableData) ? tableData : [],
    });
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the clicked element is outside the editable span
      if (spanRef.current && !spanRef.current.contains(event.target)) {
        setEditRowIndex(null);
      }
    };
    // Add the event listener to detect clicks outside
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Clean up the event listener when the component is unmounted
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [spanRef]);
  const handleUploadClick = async (
    value,
    userType,
    uploadType,
    schoolId,
    schoolName,
    schoolCode,
    board
  ) => {
    setIsLoader(true);
    const actiontypevalue =
      uploadType == 1 ||
      uploadType == "null" ||
      uploadType == null ||
      uploadType == ""
        ? "False"
        : "True";
    const formattedData = {
      user_type: userType == 2 ? "teacher" : "student",
      isAddToDB: value == 2 ? false : true,
      data: tableData.map((item) => ({
        firstname: item.firstName,
        lastname: item.lastName,
        email: item.email,
        role1: item.role,
        phone1: item.mobile,
        gender:item.gender,
        classcode: item.class,
        coursecode: item.coursecode,
        profile_field_admission_number: item.admissionID
          ? String(item.admissionID)
          : "",
        username: item.username,
        ...(uploadType != 2 ? { password: item.password } : null),
      })),
    };
    const url = `onboarding/upload-csv/school/${schoolId}/?session_id=${API_SESSION_ID}&is_UPDATE=${actiontypevalue}`;
    try {
      const responseData = await axiosInstance.post(url, formattedData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      let response;
      if (typeof responseData.data === "string") {
        // Replace 'NaN' with 'null' to make it valid JSON
        const sanitizedData = responseData.data.replace(/NaN/g, "null");
        try {
          response = await JSON.parse(sanitizedData);
          setIsLoader(false);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          setIsLoader(false);
          return;
        }
      } else {
        response = responseData.data;
        setIsLoader(false);
      }
      if (response.status == "success" && value == 1) {
        toast.success("CSV uploaded successfully.", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        let role = userType == 2 ? 2 : 1;
        setTimeout(() => {
          router.push(
            `/onboarding/userdashboard/teacherstudentlist?schoolEditId=${schoolId}&schoolName=${schoolName}&schoolCode=${schoolCode}&schoolBoard=${board}&rolevalue=${role}`
          );
        }, 5000); // Wait for 5 seconds (same as toast autoClose)
      }
      if (value == 2) {
        const transformAnomalyRows = (anomalyRows) => {
          if (!Array.isArray(anomalyRows)) {
            console.error("anomalyRows is not an array:", anomalyRows);
            return [];
          }
          return anomalyRows.map((row) => {
            const rowDetails = row.row_details || {};

            // Combine all anomalies' error messages into a single string
            const allErrors = row.anamolies
              .map((anomaly) => anomaly.error)
              .join(", ");
            const idOrCourse = {
              admissionID: String(rowDetails.profile_field_admission_number) || "",
            };
            // Ensure uploadType is defined
            const actiontypevalue =
              uploadType == 1 ||
              uploadType == null ||
              uploadType == "null" ||
              uploadType == ""
                ? "Create"
                : "Update";
            const orusername = { username: rowDetails.username || "" };
            const orpassowrd = { password: rowDetails.password || "" };
            // Create a single row for each `anomalyRow`
            return {
              firstName: rowDetails.firstname || "",
              lastName: rowDetails.lastname || "",
              class: rowDetails.classcode || "",
              role: rowDetails.role1 || "",
              email: rowDetails.email || "",
              mobile: rowDetails.phone1 ? `${rowDetails.phone1}` : "",
              gender: rowDetails.gender || "",
              errorType: allErrors, // Consolidated errors from all anomalies
              actionType: actiontypevalue,
              coursecode: rowDetails.coursecode || "",
              ...idOrCourse,
              ...orusername,
              ...orpassowrd,
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
            const actiontypevalue =
              uploadType == 1 || uploadType == null || uploadType == ""
                ? "Create"
                : "Update";
            const orusername = { username: rowDetails.username || "" };
            const orpassowrd = { password: rowDetails.password || "" };
            return {
              firstName: rowDetails.firstname || "",
              lastName: rowDetails.lastname || "",
              class: rowDetails.classcode || "",
              role: rowDetails.role1 || "",
              email: rowDetails.email || "",
              mobile: rowDetails.phone1 ? `${rowDetails.phone1}` : "",
              gender: rowDetails.gender || "",
              errorType: "", // No errors for applicable rows
              actionType: actiontypevalue,
              coursecode: rowDetails.coursecode || "",
              admissionID: String(rowDetails.profile_field_admission_number) || "",
              ...orusername,
              ...orpassowrd,
            };
          });
        };

        // Format rows
        const anomalyRowsFormatted = transformAnomalyRows(
          response.data.anomaly_rows
        );
        const applicableRowsFormatted = transformApplicableRows(
          response.data.applicable_rows
        );

        // Combine anomaly and applicable rows
        const allRowsFormatted = [
          ...anomalyRowsFormatted,
          ...applicableRowsFormatted,
        ];
        // Store combined rows in localStorage
        try {
          if (updateTable) {
            setUpdateTable(0);
          } else {
            setUpdateTable(1);
          }

          typeof window !== "undefined"
            ? localStorage.setItem("allErrors", response.data.total_error_count)
            : "";
          typeof window !== "undefined"
            ? localStorage.setItem("allRows", JSON.stringify(allRowsFormatted))
            : "";
          setIsLoader(false);
        } catch (error) {
          console.error("Error saving to localStorage:", error);
          setIsLoader(false);
        }
      }
    } catch (error) {
      setIsLoader(false);
      toast.error(error?.message || "Status Code 504", {
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
      console.error("Error in API call:", error);
      
      // Handle error, e.g., show error message to the user
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="right_content">
      <div className="sch-creation-container">
        <div className="left-section">
          <button
            onClick={handleGoBack}
            className="link-button"
            style={{ border: "none", backgroundColor: "transparent" }}
          >
            <FaArrowLeft />
          </button>
          <span>Preview User</span>
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
                <span className="info-item-up">Board</span>
                <span className="info-item-down">{board}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="sch-creation-container">
          <div className="left-section">
            <span>Total Users ({dataLength})</span>
          </div>
          <div className="right-section">
            <FiFlag
              style={{ fontSize: "16px", color: "#DC1500", fontWeight: "700" }}
            />
            <span
              style={{
                marginLeft: "10px",
                fontSize: "16px",
                color: "#DC1500",
                fontWeight: "700",
              }}
            >
              {allErrors} Errors
            </span>
          </div>
        </div>

        <div className="table-wrapper">
          <table {...getTableProps()} className="table">
            <thead>
              {headerGroups.map((headerGroup, headerGroupIndex) => (
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  key={headerGroupIndex}
                >
                  {headerGroup.headers.map((column, columnIndex) => (
                    <th {...column.getHeaderProps()} key={columnIndex}>
                      {column.render("Header")}
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
        </div>
        <div className="buttonGroup" style={{ marginTop: "30px" }}>
          <div className="left"></div>
          <div className="right">
            <button
              className="nextButton"
              onClick={() =>
                handleUploadClick(
                  errors > 0 ? 2 : 1,
                  colValue,
                  uploadType,
                  schoolId,
                  schoolName,
                  schoolCode,
                  board
                )
              }
            >
              {errors > 0 ? "Validate Again" : "Upload"}
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
          </div>
        </div>
      </div>
      {isLoader ? <Loader /> : ""}
    </div>
  );
}
