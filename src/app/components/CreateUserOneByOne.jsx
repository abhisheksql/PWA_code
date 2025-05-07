"use client";
import { FaArrowLeft } from "react-icons/fa";
import Select, { components } from "react-select";
import { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logs from "../../../public/images/logs.svg";
import { RxCross2 } from "react-icons/rx";
import Loader from "../components/Loader";

const API_SESSION_ID = process.env.NEXT_PUBLIC_ONBOARDING_SESSION_ID; 
export default function CreateUserOneByOne({
  sectionsCourses,
  classOptionData,
  schoolId,
  schoolName,
  schoolCode,
  board,
  userid,
  userRole,
  setIsLoader,
  isLoader,
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [className, setClassName] = useState("");
  const [subjectName, setSubjectName] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [genderName, setGenderName] = useState("");
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [subjectLabel, setSubjectLabel] = useState("");
  const [subjectOptionData, setSubjectOptionData] = useState([]);
  const [roleLabel, setRolelabel] = useState("");
  const [genderLabel, setGenderLabel] = useState("");
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [classLabel, setClassLabel] = useState([]);
  const [classValue, setclassValue] = useState("");
  const [logsData, setLogsData] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false); // State for password moda
  const [mobileNumberError, setMobileNumberError] = useState("");
const[recall,setRecall] = useState(0);
  // Toggle password modal
  const toggleLogs = () => setIsLogsOpen(!isLogsOpen);
  const togglePasswordModal = () =>
    setIsPasswordModalOpen(!isPasswordModalOpen);
  const router = useRouter();
  const roleOptions = [
    { value: "student", label: "Student" },
    { value: "teacher", label: "Teacher" },
  ];

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer_not_to_say", label: "Prefer not to say" },
  ];

  // Handle change for both single and multi-select
  const handleSelectChange = (selectedOptions, fieldName) => {
    const valuesArray = selectedOptions.map((option) => option.value);
    setSubjectLabel(selectedOptions);
    const modifiedData = valuesArray.map((item) => {
      if (item.includes(" - ")) {
        return item.split(" - ")[1]; // Take the part after the first hyphen
      }
      return item; // If no hyphen, return the value as is
    });
    setSubjectName(modifiedData);
  };

  const MultiValueContainer = ({ children, ...props }) => {
    const { selectProps, data } = props;
    const selected = selectProps.value;

    // Ensure selected is an array
    const selectedArray = Array.isArray(selected) ? selected : [selected];
    if (selectedArray.length > 2 && selectedArray.indexOf(data) === 1) {
      return (
        <>
          <components.MultiValueContainer {...props}>
            {children}
          </components.MultiValueContainer>
          <span
            style={{ marginLeft: "5px", color: "#ff8a00", fontSize: "12px" }}
          >
            +{selectedArray.length - 2} more
          </span>
        </>
      );
    }

    return selectedArray.indexOf(data) < 2 ? (
      <components.MultiValueContainer {...props}>
        {children}
      </components.MultiValueContainer>
    ) : null;
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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

    singleValue: (base) => ({
      ...base,
      color: "rgba(83, 83, 83, 1)",
      fontWeight: "700",
      fontSize: "16px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    }),
  
    multiValue: (styles) => ({
      ...styles,
      backgroundColor: "rgba(253, 229, 202, 1)",
      color: "#ff8a00",
      borderRadius: "10px",
      border: "1px solid #ff8a00",
      margin: "2px",
    }),
    multiValueLabel: (styles) => ({
      ...styles,
      color: "#ff8a00",
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      color: "#ff8a00",
      cursor: "pointer",
      backgroundColor: "transparent",
      border: "none",
      ":hover": {
        backgroundColor: "transparent",
        color: "#ff8a00",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    clearIndicator: () => ({
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
    placeholder: (base) => ({
      ...base,
      color: "rgba(179, 179, 179, 1)",
      fontWeight: "700",
      fontSize: "16px",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    }),
  };
  const handleSelectRole = (selectedOptions) => {
    setSubjectLabel("");
    setClassLabel("");
    setRolelabel(selectedOptions);
    const value = Array.isArray(selectedOptions)
      ? selectedOptions.map((option) => option.value).join(", ") // If it's an array, join the values into a string
      : selectedOptions
      ? selectedOptions.value
      : ""; // If it's an object, take the value

    setRoleName(value);
  };


  const handleSelectgender = (selectedOptions) => {
    setGenderLabel(selectedOptions);
    const value = Array.isArray(selectedOptions)
      ? selectedOptions.map((option) => option.value).join(", ") // If it's an array, join the values into a string
      : selectedOptions
      ? selectedOptions.value
      : ""; // If it's an object, take the value

      setGenderName(value);
  };

  const handleSelectClass = (selectedOptions) => {
    if (roleName == "student" || roleName == "") {
      setSubjectLabel("");
    }
    if (roleName == "teacher") {
      const arr1Array = Array.isArray(selectedOptions)
        ? selectedOptions
        : [selectedOptions];

      // Find matches based on labels in arr1 and arr2
      const matchingArr2Items = arr1Array.flatMap((item1) => {
        const matchLabel = item1.label;
        const filteredItems =
          subjectLabel.length > 0
            ? subjectLabel.filter((item2) =>
                item2.label.startsWith(`${matchLabel} -`)
              )
            : [];

        return filteredItems;
      });
      setSubjectLabel(matchingArr2Items);
    }
    setClassLabel(selectedOptions);
    const value = Array.isArray(selectedOptions)
      ? selectedOptions.map((option) => option.value).join(", ") // If it's an array, join the values into a string
      : selectedOptions
      ? selectedOptions.value
      : ""; // If it's an object, take the value

    setclassValue(value);
    const existingClasses = sectionsCourses.filter((item) =>
      value.includes(item.class_code)
    );
    if (existingClasses.length > 0) {
      const subjectOptions = [];

      existingClasses.forEach((existingClass) => {
        const sectionName = existingClass.section_name;
        existingClass.subjects.forEach((subject) => {
          // Create a new entry for each subject-section combination
          subjectOptions.push({
            label: `${sectionName} - ${subject.subject_name}`,
            value: `${sectionName} - ${subject.course_code}`,
          });
        });
      });
      setSubjectOptionData(subjectOptions); // Update state with the final subject options
    } else {
    }
  };
  const handleSubmit = async (value) => {
    setIsLoader(true);
    // Front-end email validation
    
    const emailRegex = /^[a-z0-9._]+@[a-z0-9]+\.[a-z]+$/;
    if (!emailRegex.test(emailId)) {
      setIsLoader(false);
      toast.error("Please enter a valid email address.", {
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
    if (userid < 1) {
      const headers = {
        "Content-Type": "application/json",
      };
      let classShortCodes;
      if (typeof classValue == "string") {
        // Split the string by commas and trim whitespace to create an array
        classShortCodes = classValue.split(",").map((code) => code.trim());
      } else if (Array.isArray(classValue)) {
        classShortCodes = classValue; // If already an array, use it as is
      } else {
        classShortCodes = []; // Fallback to an empty array if classValue is neither
      }
      try {
        if (roleName == "") {
          setIsLoader(false);
          toast.error("Role Can Not Be Empty", {
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
        if (roleName == "student") {
          const studentData = {
            session_id:API_SESSION_ID,
            email: emailId,
            first_name: firstName,
            last_name: lastName,
            phone_number: mobileNumber ? mobileNumber : null,
            roles: roleName,
            gender: genderName == '' ? "prefer_not_to_say" : genderName,
            class_short_code: classValue,
            school_id: schoolId,
            ...(admissionNumber ? { admission_number: admissionNumber } : {}),
            course_short_codes: subjectName,
            ...(userName ? { username: userName } : {}),
            ...(password ? { password: password } : {}),
          };
          const response = await axiosInstance.post(
            `onboarding/student/`,
            studentData,
            { headers }
          );
          if (response.status == 200 || response.status == 201) {
            const successMsg = response.data.message;
            toast.success(successMsg, {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });

            setFirstName("");
            setLastName("");
            setUserName("");
            setClassName("");
            setSubjectName([]);
            setRoleName("");
            setAdmissionNumber("");
            setMobileNumber("");
            setGenderName('');
            setEmailId("");
            setPassword("");
            setSubjectLabel("");
            setSubjectOptionData([]);
            setRolelabel("");
            setClassLabel([]);
            setclassValue("");

            if (value == 2) {
              router.push(
                `/onboarding/userdashboard/teacherstudentlist?schoolEditId=${schoolId}&schoolName=${schoolName}&schoolCode=${schoolCode}&schoolBoard=${board}&rolevalue=1`
              );
            }
            setIsLoader(false);
          }
        } else if (roleName === "teacher") {
          const classCourseAssociation = classLabel
            .map((item1) => {
              // Get all matching values from arr2 based on item1's label
              const courseCodes = subjectLabel
                .filter((item2) => item2.label.startsWith(`${item1.label} -`))
                .map((item2) => item2.value);
              return {
                course_code: courseCodes,
                class_code: item1.value,
              };
            })
            .filter((item) => item.course_code.length > 0); // Filter out items with empty course_code arrays
          // Final output in the required format
          const result2 = classCourseAssociation;
          const modifiedData = result2.map((item) => {
            return {
              ...item, // Copy other properties
              course_code: item.course_code.map((course) => {
                // Split the course code by the first "-" and take the second part
                return course.split(" - ")[1];
              }),
            };
          });
          const teacherData = {
            session_id:API_SESSION_ID,
            email: emailId,
            first_name: firstName,
            last_name: lastName,
            phone_number: mobileNumber ? mobileNumber : null,
            roles: roleName,
            gender: genderName == '' ? "prefer_not_to_say" : genderName,
            school_id: schoolId,
            class_course_association: modifiedData,
            ...(userName ? { username: userName } : {}),
            ...(password ? { password: password } : {}),
            ...(admissionNumber ? { admission_number: admissionNumber } : {}),
          };

          const response = await axiosInstance.post(
            `onboarding/teacher/`,
            teacherData,
            { headers }
          );

          if (response.status == 200 || response.status == 201) {
            const successMsg = response.data.message;
            toast.success(successMsg, {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });

            if (value == API_SESSION_ID) {
              router.push(
                `/onboarding/userdashboard/teacherstudentlist?schoolEditId=${schoolId}&schoolName=${schoolName}&schoolCode=${schoolCode}&schoolBoard=${board}&rolevalue=2`
              );
            }
            setIsLoader(false);
          }
        }
      } catch (error) {
        setIsLoader(false);
        let errorval;

        if (roleName == "teacher") {
          errorval = error.response.data.message;
        } else {
          errorval = error.response.data.message;
        }

        toast.error(errorval, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        console.error(
          "Error creating user:",
          error.response ? error.response.data : error.message
        );
      }
    } else if (userid > 0) {
      const updateStudentProfile = async () => {
        if (userRole == "student") {
          const data = {
            first_name: firstName,
            last_name: lastName,
            email: emailId,
            gender: genderName == '' ? "prefer_not_to_say" : genderName,
            phone_number: mobileNumber ? mobileNumber : null,
            class_short_code: classValue,
            course_short_codes: subjectName,
            session_id:API_SESSION_ID,
          };

          const updateUrl = `onboarding/student/user/${userid}/?session_id=${API_SESSION_ID}`;
          try {
            const response = await axiosInstance.patch(updateUrl, data, {
              headers: {
                "Content-Type": "application/json",
              },
            });
            setIsLoader(false);
            setRecall((prev) => (prev == 0 ? 1 : 0));
            const successMsg = response.data.message;
            toast.success(successMsg, {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          } catch (error) {
            setIsLoader(false);
            const errorval = error.response.data.message;

            toast.error(errorval, {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            console.error("Error updating student profile:", error);
          }
        } else if (userRole == "teacher") {
          let classShortCodes;
          if (typeof classValue == "string") {
            // Split the string by commas and trim whitespace to create an array
            classShortCodes = classValue.split(",").map((code) => code.trim());
          } else if (Array.isArray(classValue)) {
            classShortCodes = classValue; // If already an array, use it as is
          } else {
            classShortCodes = []; // Fallback to an empty array if classValue is neither
          }
          const classCourseAssociation = classLabel
            .map((item1) => {
              // Get all matching values from arr2 based on item1's label
              const courseCodes = subjectLabel
                .filter((item2) => item2.label.startsWith(`${item1.label} -`))
                .map((item2) => item2.value);
              return {
                course_code: courseCodes,
                class_code: item1.value,
              };
            })
            .filter((item) => item.course_code.length > 0); // Filter out items with empty course_code arrays
          // Final output in the required format
          const result2 = classCourseAssociation;
          const modifiedData = result2.map((item) => {
            return {
              ...item, // Copy other properties
              course_code: item.course_code.map((course) => {
                // Split the course code by the first "-" and take the second part
                return course.split(" - ")[1];
              }),
            };
          });
          const data = {
            session_id:API_SESSION_ID,
            first_name: firstName,
            last_name: lastName,
            email: emailId,
            gender: genderName == '' ? "prefer_not_to_say" : genderName,
            phone_number: mobileNumber ? mobileNumber : null,
            class_course_association: modifiedData,
            ...(userName ? { username: userName } : {}),
            ...(password ? { password: password } : {}),
            ...(admissionNumber ? { admission_number: admissionNumber } : {}),
          };
          const updateUrl = `onboarding/teacher/user/${userid}/?session_id=${API_SESSION_ID}`;
          try {
            const response = await axiosInstance.patch(updateUrl, data, {
              headers: {
                "Content-Type": "application/json",
              },
            });
            setIsLoader(false);
            setRecall((prev) => (prev == 0 ? 1 : 0));
            const successMsg = response.data.message;
            toast.success(successMsg, {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          } catch (error) {
            setIsLoader(false);
            const errorval = error.response.data.message;
            toast.error(errorval, {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            console.error("Error updating student profile:", error);
          }
        }
      };
      // Call the function
      updateStudentProfile();
    }
  };

  useEffect(() => {
    // Function to call the student API
    const fetchStudentData = async () => {
      try {
        const response = await axiosInstance.get(
          `onboarding/student/user/${userid}/?session_id=${API_SESSION_ID}`,
          {}
        );
        const data = response.data;
        setLogsData(data.data.student_details.logs);
        setFirstName(data.data.user_details.first_name);
        setLastName(data.data.user_details.last_name);
        setUserName(data.data.user_details.username);
        setMobileNumber(data.data.user_details.phone_number);
        setGenderName(data.data.user_details.gender);
        setAdmissionNumber(data.data.student_details.admission_number);
        setEmailId(data.data.user_details.email);
        const classValues = data.data.student_details.class_code;
        const subjectValues = data.data.student_details.course_ids;
        const genderValues = data.data.user_details.gender;
        const filteredgender = genderOptions.filter((item) =>
          Array.isArray(genderValues)
            ? genderValues.includes(item.value)
            : item.value == genderValues
        );
        setGenderLabel(filteredgender);

        // Handle both single and multiple value cases
        const filteredClasses = classOptionData.filter((item) =>
          Array.isArray(classValues)
            ? classValues.includes(item.value)
            : item.value == classValues
        );
        setClassLabel(filteredClasses);
        const classselectvalue = Array.isArray(filteredClasses)
          ? filteredClasses.map((option) => option.value).join(", ") // If it's an array, join the values into a string
          : filteredClasses
          ? filteredClasses.value
          : "";

        setclassValue(classselectvalue);
        const existingClasses = sectionsCourses.filter((item) =>
          classselectvalue.includes(item.class_code)
        );

        if (existingClasses.length > 0) {
          let sectionClasses = existingClasses[0]?.section_name;
          const subjectOptions = existingClasses.flatMap((existingClass) =>
            existingClass.subjects.map((subject) => ({
              value: subject.course_code, // Use course_code or subject_name based on your requirement
              label: `${sectionClasses} - ${subject.subject_name}`,
            }))
          );

          setSubjectOptionData(subjectOptions);
          const extracted = subjectValues[0].split('-').pop(); // "math"
          const newSubjectValue = [`${classValues}-${extracted}`];
          const filteredsubject = subjectOptions.filter((item) =>
            Array.isArray(subjectValues)
              ? subjectValues.includes(item.value)
              : item.value == subjectValues
          );
          setSubjectLabel(filteredsubject);
          const subjectvaluesselect = Array.isArray(filteredsubject)
            ? filteredsubject.map((option) => option.value) // If it's an array, return an array of values
            : filteredsubject
            ? [filteredsubject.value] // If it's a single object, return its value in an array
            : [];
          setSubjectName(subjectvaluesselect);
        } else {
        }
      } catch (error) {
        console.error("API error:", error);
      }
    };

    // Function to call the teacher API
    const fetchTeacherData = async () => {
      try {
        const response = await axiosInstance.get(
          `onboarding/teacher/user/${userid}/?session_id=${API_SESSION_ID}`,
          {}
        );
        const data = response.data;
        setLogsData(data.data.teacher_details.logs);
        setFirstName(data.data.user_details.first_name);
        setLastName(data.data.user_details.last_name);
        setUserName(data.data.user_details.username);
        setMobileNumber(data.data.user_details.phone_number);
        setAdmissionNumber(data.data.teacher_details.admission_number);
        setEmailId(data.data.user_details.email);
        setGenderName(data.data.user_details.gender);

        const genderValues = data.data.user_details.gender;
        const filteredgender = genderOptions.filter((item) =>
          Array.isArray(genderValues)
            ? genderValues.includes(item.value)
            : item.value == genderValues
        );
        setGenderLabel(filteredgender);

        const transformedData =
          data.data.teacher_details.class_course_association.map(
            ({ class_code, class_name }) => ({
              value: class_code,
              label: class_name,
            })
          );
        const formattedCourses =
          data.data.teacher_details.class_course_association.flatMap(
            (classItem) =>
              classItem.course.map((course) => ({
                value: `${classItem.class_name} - ${course.course_code}`,
                label: `${classItem.class_name} - ${course.course_name}`,
              }))
          );
        setSubjectLabel(formattedCourses);
        const classValues = data.data.teacher_details.class_codes;
        const subjectValues = data.data.teacher_details.course_codes;
        const transformedValues = transformedData.map((item) => item.value);
        const filteredClasses = classOptionData.filter((item) =>
          transformedValues.includes(item.value)
        );
        setClassLabel(filteredClasses);
        const classselectvalue = Array.isArray(filteredClasses)
          ? filteredClasses.map((option) => option.value).join(", ") // If it's an array, join the values into a string
          : filteredClasses
          ? filteredClasses.value
          : "";

        setclassValue(classselectvalue);
        
       

        const existingClasses = sectionsCourses.filter((item) =>
          classselectvalue.includes(item.class_code)
        );

        if (existingClasses.length > 0) {
          // If matching classes are found, map the subjects into the desired format
          const subjectOptions = existingClasses.flatMap((existingClass) =>
            existingClass.subjects.map((subject) => ({
              value: `${existingClass.section_name} - ${subject.course_code}`, // Use course_code or subject_name based on your requirement
              label: `${existingClass.section_name} - ${subject.subject_name}`,
            }))
          );

          setSubjectOptionData(subjectOptions);
          const filteredsubject = subjectOptions.filter((item) =>
            Array.isArray(subjectValues)
              ? subjectValues.includes(item.value)
              : item.value == subjectValues
          );
          const subjectvaluesselect = Array.isArray(filteredsubject)
            ? filteredsubject.map((option) => option.value) // If it's an array, return an array of values
            : filteredsubject
            ? [filteredsubject.value] // If it's a single object, return its value in an array
            : [];

          setSubjectName(subjectvaluesselect);
          // Example: setSubjects(subjectOptions); // Update state if required
        } else {
        }
      } catch (error) {
        console.error("API error:", error);
      }
    };

    // Check the role and call the appropriate API
    if (userRole === "student" && userid > 0) {
      fetchStudentData(); // Call student API

      const roleOptionsValue = [{ value: "student", label: "Student" }];
      setRolelabel(roleOptionsValue);
      setRoleName("student");
    } else if (userRole === "teacher" && userid > 0) {
      fetchTeacherData(); // Call teacher API

      const roleOptionsValue = [{ value: "teacher", label: "Teacher" }];
      setRolelabel(roleOptionsValue);
      setRoleName("teacher");
    }
  }, [userRole, userid, classOptionData,recall]); // Dependencies to watch for changes

  const handleGoBack = () => {
    setIsLoader(true);
    router.back();
  };

  // handleCreateUserOne
  const handleBulkUpload = () => {
    setIsLoader(true);
    router.push(
      `/onboarding/userdashboard/uploaduser?schoolEditId=${schoolId}&schoolName=${schoolName}&schoolCode=${schoolCode}&schoolBoard=${board}&isClass=false`
    );
  };

  const handleCancle = () => {
    setFirstName("");
    setLastName("");
    setUserName("");
    setClassName("");
    setSubjectName([]);
    setRoleName("");
    setAdmissionNumber("");
    setMobileNumber("");
    setGenderName('');
    setEmailId("");
    setPassword("");
    setSubjectLabel("");
    setSubjectOptionData([]);
    setRolelabel("");
    setClassLabel([]);
    setclassValue("");
    setGenderName('');
    setGenderLabel('');
  };
  const sendPreviousPassword = async () => {
    setIsLoader(true); // Set loading state to true when the API request starts
    try {
      const response = await axiosInstance.post("/onboarding/send-password/", {
        username: userName, // Pass the username as 'dev'
      });
      if (response.status == 200) {
        const successMsg = response.data.status;
        toast.success(successMsg, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } catch (error) {
      const errorval = error.response.data.status;
      toast.error(errorval, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setIsLoader(false);
    }
  };

  return (
    <div className="right_content">
      <div className="sch-creation-container">
        <div className="left-section">
          <button
            onClick={handleGoBack}
            style={{ border: "none", backgroundColor: "transparent" }}
            className="link-button"
          >
            <FaArrowLeft />
          </button>
          <span>{userid < 1 ? "Create User" : "Update User"}</span>
        </div>
        {userid < 1 ? (
          <div className="right-section">
            <button onClick={handleBulkUpload} className="onebyone">
              Bulk Creation
            </button>
          </div>
        ) : (
          ""
        )}
        {userid > 0 ? (
          <div
            className="right-section"
            onClick={toggleLogs}
            style={{ cursor: "pointer" }}
          >
            <Image
              src={logs}
              alt="Export CSV"
              width={25}
              height={25}
              style={{ marginRight: "15px" }}
            />
            <span>Logs</span>
          </div>
        ) : (
          ""
        )}
      </div>
      {/* <div className="create-classSection" style={{ margin: "10px 0" }}>
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
      </div> */}

      
      <div className="creation-wreaper" style={{ maxHeight: "70vh" }}>
        <div className="formSection">
          <div className="formGroup">
            <div className="formRow">
              <div className="inputGroup">
                <label>First Name</label>
                <input
                  type="text"
                  placeholder="Enter First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="inputGroup">
                <label>Last Name</label>
                <input
                  type="text"
                  placeholder="Enter Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              
              <div className="inputGroup">
                <label>Admission Number</label>
                <input
                  type="text"
                  placeholder="Enter Admission Number"
                  value={admissionNumber}
                  onChange={(e) => setAdmissionNumber(e.target.value)}
                />
              </div>

              
            </div>

            <div className="formRow">
            <div className="inputGroup">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="Enter Username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  disabled={userRole === "teacher" || userRole === "student"} // ✅ Corrected "disabled"
                />

              </div>
              <div className="inputGroup">
                <label>Role</label>
                <Select
                  name="role"
                  value={roleLabel}
                  onChange={handleSelectRole}
                  options={roleOptions}
                  styles={customStyles}
                  placeholder="Select Role"
                  className="dropdown-wrapper"
                  menuPosition="fixed"
                  menuShouldScrollIntoView={false}
                  isDisabled={userRole === "teacher" || userRole === "student"}
                />
              </div>
              <div className="inputGroup">
                <label>Class</label>
                <Select
                  name="Class"
                  value={classLabel}
                  onChange={handleSelectClass}
                  options={classOptionData}
                  styles={customStyles}
                  placeholder="Select Class"
                  className="dropdown-wrapper"
                  menuPosition="fixed"
                  components={{ MultiValueContainer }}
                  hideSelectedOptions={false}
                  isMulti={roleName == "teacher"}
                />
              </div>
            </div>

            <div className="formRow">

            <div className="inputGroup">
                <label>Gender</label>
                <Select
                  name="gender"
                  value={genderLabel}
                  onChange={handleSelectgender}
                  options={genderOptions}
                  styles={customStyles}
                  placeholder="Select Gender"
                  className="dropdown-wrapper"
                  menuPosition="fixed"
                  menuShouldScrollIntoView={false}
                  // isDisabled={userRole === "teacher" || userRole === "student"}
                />
              </div>
            <div className="inputGroup">
                <label>Subject</label>
                <Select
                  name="subject"
                  value={subjectLabel} // Show selected classes only when editing
                  onChange={handleSelectChange}
                  options={subjectOptionData}
                  isMulti
                  components={{ MultiValueContainer }}
                  styles={customStyles}
                  placeholder="Select Subject"
                  className="dropdown-wrapper"
                  menuPosition="fixed"
                  hideSelectedOptions={false}
                />
              </div>

              
             
              <div className="inputGroup">
                <label>Mobile Number</label>
                <input
                  type="tel"
                  placeholder="Enter Mobile Number"
                  value={mobileNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow only digits and limit to 10 characters
                    if (/^\d{0,10}$/.test(value)) {
                      setMobileNumber(value);
                      // Real-time validation
                      if (value.length !== 10 && value.length > 0) {
                        setMobileNumberError(
                          "Mobile Number must be exactly 10 digits."
                        );
                      } else {
                        setMobileNumberError("");
                      }
                    }
                  }}
                  maxLength={10} // Limit input to 10 characters
                />
                {mobileNumberError && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {mobileNumberError}
                  </span>
                )}
              </div>
              
            </div>
            
              <div className="formRow">
              <div className="inputGroup">
                <label>Email ID</label>
                <input
                  type="text"
                  placeholder="Enter Email ID"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                />
              </div>
              {userid < 1 ? (
                <div className="inputGroup" style={{ position: "relative" }}>
                  <label>Password</label>
                  <input
                    value={password}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    style={{ width: "99%", paddingRight: "40px" }}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    onClick={togglePasswordVisibility}
                    style={{
                      position: "absolute",
                      right: "15px",
                      top: "60px",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#FF8A00",
                      fontSize: "20px",
                    }}
                  >
                    {showPassword ? <FiEye /> : <FiEyeOff />}
                  </span>
                </div>
                 ) : (
                  ""
                )}
                {/* <div className="inputGroup"></div> */}
                <div className="inputGroup"></div>
              </div>
           
            {userid > 0 ? (
              <div className="formRow" style={{ marginTop: "35px" }}>
                <div className="inputGroup">
                  <div className="genpass" onClick={togglePasswordModal}>
                    {" "}
                    Regenerate New Password{" "}
                  </div>
                </div>
                <div className="inputGroup">
                  <div className="genpass" onClick={sendPreviousPassword}>
                    Send Previous Password
                  </div>
                </div>
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
            ) : (
              ""
            )}
          </div>
        </div>
        {userid < 1 ? (
          <div className="buttonGroup">
            <div className="left">
              <button className="cancelButton" onClick={handleCancle}>
                Cancel
              </button>
            </div>
            <div className="right">
              <button
                className="saveButton"
                onClick={() => handleSubmit(1)}
                style={{ textDecoration: "underline" }}
              >
                Submit & Create New User
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
              <button onClick={() => handleSubmit(2)} className="nextButton">
                Submit
              </button>
            </div>
          </div>
        ) : (
          <div className="buttonGroup">
            <div className="left"></div>
            <div className="right">
              <button className="nextButton" onClick={() => handleSubmit(3)}>
                Update Profile
              </button>
            </div>
          </div>
        )}
      </div>
      {isLogsOpen && <LogsModal toggleLogs={toggleLogs} logsData={logsData} />}
      {isPasswordModalOpen && (
        <PasswordModal
          togglePasswordModal={togglePasswordModal}
          userName={userName}
        />
      )}
      {isLoader ? <Loader /> : ""}
    </div>
  );
}

const PasswordModal = ({ togglePasswordModal, userName }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rePassword, setRePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handlePasswordChange = (e) => setRePassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const handlePasswordSubmit = async () => {
    if (!rePassword || !confirmPassword) {
      // Check if any of the password fields is empty
      toast.error("Password fields cannot be empty!", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        onClose: () => {
          // Call togglePasswordModal when the toast is dismissed
          togglePasswordModal();
        },
      });
    } else if (rePassword == confirmPassword) {
      try {
        // Call the reset password API with Axios
        const response = await axiosInstance.post(
          "onboarding/school-admin/reset-password/",
          {
            new_password: rePassword,
            username: userName,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Password changed successfully!", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          onClose: () => {
            // Call togglePasswordModal when the toast is dismissed
            togglePasswordModal();
          },
        });
        // togglePasswordModal(); // Close the modal if successful
      } catch (error) {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
        // Handle error feedback as needed
      }
    } else {
      toast.error("Passwords do not match!", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        onClose: () => {
          // Call togglePasswordModal when the toast is dismissed
          // togglePasswordModal();
        },
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  return (
    <>
      <div
        className="delete-modal"
        style={{
          width: "500px",
          backgroundColor: "#fff",
          borderRadius: "10px",
          padding: "20px",
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div
          className="filter-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <span style={{ fontSize: "20px", fontWeight: "700" }}>
            Regenerate Password
          </span>
        </div>
        <div className="filter-body" style={{ marginBottom: "20px" }}>
          <div className="formRow">
            <div
              className="inputGroup"
              style={{ width: "48%", position: "relative" }}
            >
              <label>Enter Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={rePassword}
                onChange={handlePasswordChange}
                placeholder="Enter Password"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
              <span
                onClick={togglePasswordVisibility}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "75%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#FF8A00",
                  fontSize: "20px",
                }}
              >
                {showPassword ? <FiEye /> : <FiEyeOff />}
              </span>
            </div>
            <div
              className="inputGroup"
              style={{ width: "48%", position: "relative" }}
            >
              <label>Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Re-enter Password"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
              <span
                onClick={toggleConfirmPasswordVisibility}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "75%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#FF8A00",
                  fontSize: "20px",
                }}
              >
                {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
              </span>
            </div>
          </div>
        </div>
        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
        >
          <button
            onClick={togglePasswordModal}
            style={{
              backgroundColor: "transparent",
              color: "#FF8A00",
              padding: "10px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handlePasswordSubmit}
            style={{
              backgroundColor: "#6166AE",
              color: "#fff",
              borderRadius: "5px",
              padding: "10px 20px",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "700",
            }}
          >
            Change Password
          </button>
        </div>
      </div>
      <div
        className="overlay active"
        onClick={togglePasswordModal}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000,
        }}
      ></div>
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
    </>
  );
};

// LogsModal Component
const LogsModal = ({ toggleLogs, logsData }) => {
  return (
    <>
      <div className="filter-box">
        <div className="filter-header">
          <span>Logs</span>
          <button onClick={toggleLogs} className="filter-cross">
            <RxCross2 />
          </button>
        </div>
        <div className="filter-body">
          {/* Loop through logsData */}
          {logsData.map((log, index) => (
            <div
              key={index}
              className="filter-body-1"
              style={{
                borderBottom: "0.5px solid #D1D1D1",
                marginBottom: "25px",
              }}
            >
              <label style={{ marginBottom: "0px" }}>Date</label>
              <p
                style={{ margin: "0", marginBottom: "10px", fontSize: "12px" }}
              >
                {new Date(log.timestamp).toLocaleString()}{" "}
                {/* Convert timestamp to local time */}
              </p>
              <label style={{ marginBottom: "0px" }}>Description</label>
              <p
                style={{ margin: "0", marginBottom: "10px", fontSize: "12px" }}
              >
                {log.description
                  ? "Updated fields: " +
                    JSON.stringify(log.description)
                  : "N/A"}
              </p>
              <label style={{ marginBottom: "0px" }}>Action Taken By</label>
              <p
                style={{ margin: "0", marginBottom: "30px", fontSize: "12px" }}
              >
                {log.action_taken_by || "Unknown"}{" "}
                {/* Display action_taken_by, default to 'Unknown' */}
              </p>
            </div>
          ))}
        </div>
        <div className="filter-footer">
          <button
            onClick={toggleLogs}
            style={{ backgroundColor: "#6166AE", color: "#fff", width: "100%" }}
          >
            Close
          </button>
        </div>
      </div>
      <div className="overlay active" onClick={toggleLogs}></div>
    </>
  );
};
