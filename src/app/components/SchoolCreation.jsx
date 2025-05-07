"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import SchoolLogo from "../../../public/images/school_user.svg";
import SchoolCam from "../../../public/images/school_cam.svg";
import { FaArrowLeft } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CiCalendar } from "react-icons/ci";
import { FaAngleDown } from "react-icons/fa6";
import Select, { components } from "react-select";
import Loader from "../components/Loader";
import { useRouter } from "next/navigation";
import axiosInstance from "../auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import countries from "world-countries";
import DemoLogo from "../../../public/images/DemoLogo.png";
// Map countries data to match react-select's expected format
const countryOptions = countries.map((country) => ({
  label: country.name.common,
  value: country.cca2, // ISO Alpha-2 code
})).sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically

// Custom Dropdown Indicator
const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <FaAngleDown color="#ff8a00" />
    </components.DropdownIndicator>
  );
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
const API_SESSION_ID = process.env.NEXT_PUBLIC_ONBOARDING_SESSION_ID;
export default function SchoolCreation({ schoolEditId }) {
  // const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [schoolName, setSchoolName] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [academicSession, setAcademicSession] = useState("");
  const [schoolType, setSchoolType] = useState("");
  const [board, setBoard] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState("");
  const [postCode, setPostCode] = useState("");
  const [schoolId, setschoolId] = useState("");
  const [base64Image, setBase64Image] = useState("");
  const [errors, setErrors] = useState({});
  const [is_disable, setIs_disable] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadImage, setUploadImage] = useState(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const fileInputRef = useRef(null);
  const [isLoader, setIsLoader] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
  };
  //  ----------- Datepicker ------------------
  const [startDate, setStartDate] = useState(null);
  const [sessionStartDate, setSessionStartDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);
  const [sessionEndDate, setSessionEndDate] = useState(null);
  const [sessionEndDate2, setSessionEndDate2] = useState(null);
  const [boards, setBoardsData] = useState([]);
  const [academicSessions, setAcademicSessions] = useState([]);
  // Define the min and max year for the session start date picker
  const minStartDate = new Date(2021, 0, 1);
  const maxStartDate = new Date(2028, 11, 31);

  const handleStartDateIconClick = () => {
    setIsStartDateOpen(!isStartDateOpen);
  };
  const handleStartDateInputFocus = () => {
    setIsStartDateOpen(true);
  };
  const handleStartDateClickOutside = () => {
    setIsStartDateOpen(false);
  };

  // Handlers for opening/closing the end date picker
  const handleEndDateIconClick = () => {
    setIsEndDateOpen(!isEndDateOpen);
  };
  const handleEndDateInputFocus = () => {
    setIsEndDateOpen(true);
  };
  const handleEndDateClickOutside = () => {
    setIsEndDateOpen(false);
  };

  const router = useRouter();
  const handleGoBack = () => {
    setIsLoader(true);
    router.back();
  };


  async function convertSvgToFile() {
    try {
      const response = await fetch(DemoLogo.src); // Fetch the imported image
      const blob = await response.blob();
      const file = new File([blob], "DemoLogo.png", { type: "image/png+xml" });
      // Generate Blob URL
      const url = URL.createObjectURL(blob);
      setSelectedImage(url);
      setUploadImage(file);
    } catch (error) {
      console.error("Error converting image:", error);
    }
  }

  useEffect(() => {
    convertSvgToFile();
  }, []);


  const [activityTypes, setActivityTypes] = useState({
    readinessQuiz: true,
    topicQuest: true,
    videos: true,
    milestoneQuiz: true,
    remediationQuiz: true,
  });

  // const academicSessions = [
  //   { label: "2025 - 2026", value: "2025-2026" },
  //   { label: "2026 - 2027", value: "2026-2027" },
  //   { label: "2027 - 2028", value: "2027-2028" },
  // ];

  const schoolTypes = [
    { label: "Paid", value: "Paid" },
    { label: "Pilot", value: "Pilot" },
  ];

  // const boards = [
  //   { label: "CBSE", value: "CBSE" },
  //   { label: "ICSE", value: "ICSE" },
  // ];

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const response = await axiosInstance.get(`/onboarding/master_config/board/`);
        if(response.data.status == 'success') {
        // setBoardsData(response.data.data);
        const boards = response.data.data.map((item) => ({
          label: item.board,
          value: item.board_id,
        }));
  
        setBoardsData(boards);
        }
      } catch (err) {
        // setError(err.message || "Something went wrong");
      } finally {
        // setLoading(false);
      }
    };

    fetchBoardData();
  }, []);

  useEffect(() => {
    const fetchSessionList = async () => {
      try {
        const response = await axiosInstance.get(`/onboarding/master_config/session/`);
        if(response.data.status == 'success') {
        const academicSessions = response.data.data.map((item) => ({
          label: `${item.session_start} - ${item.session_end}`,
          value: `${item.session_id}`,
        }));
        const selectedSession = academicSessions.find(session => session.value == API_SESSION_ID) || null;
        // // Set the academic session
        setAcademicSession(selectedSession);
        const startYear = selectedSession.label.split("-")[0].trim();
        const endYear = selectedSession.label.split("-")[1].trim();
              const computedStartDate = new Date(`${startYear}-01-01`); // Assuming sessions start on June 1st
              setSessionStartDate(computedStartDate);
              const computedEndDate = new Date(`${startYear}-12-31`); // Assuming sessions start on June 1st
              setSessionEndDate(computedEndDate);
              const computedEndDate2 = new Date(`${endYear}-12-31`);
              setSessionEndDate2(computedEndDate2);
              setAcademicSessions(academicSessions);
              }
      } catch (err) {
        // setError(err.message || "Something went wrong");
      } finally {
        // setLoading(false);
      }
    };

    fetchSessionList();
  }, []);

  const validateField = (name, value) => {
    let error = "";
    if (name === "schoolName") {
      if (!value.trim()) {
        error = "School Name is required.";
      } else if (!/^[A-Za-z0-9@_\-\.\s]+$/.test(value.trim())) {
        error =
          "School Name can only include letters, numbers, @, _, -, ., and spaces.";
      }
    }

    if (name === "schoolCode") {
      if (!value.trim()) {
        error = "School Code is required.";
      } else if (value.trim().length < 5) {
        error = "Must be at least 5 characters & only Alphanumeric allowed.";
      } else if (!/^[A-Za-z0-9]+$/.test(value.trim())) {
        error = "Must be at least 5 characters & only Alphanumeric allowed.";
      }
    }

    if (name === "postCode") {
      if (!value.trim()) {
        error = "Post Code is required.";
      } else if (!/^\d{6}$/.test(value.trim())) {
        error = "Post Code must be exactly 6 digits.";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const checkAllFieldsEmpty = () => {
    if (
      !schoolName &&
      !schoolCode &&
      !academicSession &&
      !schoolType &&
      !board &&
      !address &&
      !location &&
      !country &&
      !postCode &&
      !startDate &&
      !endDate &&
      !selectedImage
    ) {
      setIsSubmitDisabled(true);
    } else {
      setIsSubmitDisabled(false);
    }
  };
  const isSubmitDisabledfield = !(Object.values(errors).every(
    (err) => err === ""
  ),
  typeof schoolName === "string" &&
    /^[A-Za-z0-9@_\-\s]+$/.test(schoolName.trim()) &&
    schoolName.trim() &&
    schoolCode.trim() &&
    schoolCode.trim().length >= 5 &&
    /^[a-zA-Z0-9]+$/.test(schoolCode.trim()) &&
    schoolType &&
    board &&
    address.trim() &&
    location.trim() &&
    typeof country == "string" &&
    /^[A-Za-z\s]+$/.test(country.trim()) &&
    country.trim() &&
    postCode &&
    /^[0-9]+$/.test(postCode) &&
    academicSession &&
    startDate &&
    endDate &&
    selectedImage);

  useEffect(() => {
    const fetchSchoolData = async () => {
      setIsLoader(true);
      try {
        const response = await axiosInstance.get(
          `onboarding/schools/${schoolEditId}/?session_id=${API_SESSION_ID}`,
          {
            headers: {},
          }
        );
        if (response.data.status_code == 200) {
          setSchoolName(response.data.data.school_name);
          setSchoolCode(response.data.data.school_shortcode);
          setSchoolType(response.data.data.school_type);
          setBoard(response.data.data.board_id);
          setAddress(response.data.data.school_address);
          setLocation(response.data.data.school_city);
          setCountry(response.data.data.school_country);
          setPostCode(response.data.data.school_pincode);

          const formattedSession = {
            label: `${response.data.data.session_start.split("-")[0]} - ${response.data.data.session_end.split("-")[0]}`,
            value: Number(response.data.data.session_id)
          };
          setAcademicSession(formattedSession);

          const startYear = response.data.data.session_start.split("-")[0];
          const endYear = response.data.data.session_end.split("-")[0];
          const computedStartDate = new Date(`${startYear}-01-01`); // Assuming sessions start on June 1st
          setSessionStartDate(computedStartDate);
          const computedEndDate = new Date(`${startYear}-12-31`); // Assuming sessions start on June 1st
          setSessionEndDate(computedEndDate);
          const computedEndDate2 = new Date(`${endYear}-12-31`);
          setSessionEndDate2(computedEndDate2);

          setStartDate(response.data.data.session_start);
          setEndDate(response.data.data.session_end);
          setSelectedImage(response.data.data.school_logo);
          setActivityTypes({
            readinessQuiz: response.data.data.enabled_features.is_enabled_CRQ,
            topicQuest: response.data.data.enabled_features.is_enabled_PE,
            videos: response.data.data.enabled_features.is_enabled_video,
            milestoneQuiz: response.data.data.enabled_features.is_enabled_CLT,
            remediationQuiz: response.data.data.enabled_features.is_enabled_PAA,
          });
        } else {
        }
        setIsLoader(false);
      } catch (error) {
        console.error("Error fetching school data:", error);
        setIsLoader(false);
        toast.error(error.message || error.response.data.message, {
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
    if (schoolEditId > 0) {
      fetchSchoolData();
    }
  }, [schoolEditId]);

  useEffect(() => {
    checkAllFieldsEmpty();
  }, [
    schoolName,
    schoolCode,
    academicSession,
    schoolType,
    board,
    address,
    location,
    country,
    postCode,
    startDate,
    endDate,
  ]); //activityTypes
  // Handle form submission
  const handleSubmit = async (nextres, schoolEditId) => {
    setIsLoader(true);
    const formData = new FormData();
    formData.append("school_name", schoolName);
    formData.append("school_shortcode", schoolCode);
    formData.append("school_type", schoolType);
    formData.append("school_board", board);
    formData.append("school_address", address);
    formData.append("school_city", location);
    formData.append("school_country", country);
    formData.append("school_pincode", postCode);
    // Add enabled features
    formData.append(
      "enabled_features.is_enabled_CRQ",
      activityTypes.readinessQuiz
    );
    formData.append("enabled_features.is_enabled_PE", activityTypes.topicQuest);
    formData.append(
      "enabled_features.is_enabled_CLT",
      activityTypes.milestoneQuiz
    );
    formData.append("enabled_features.is_enabled_video", activityTypes.videos);
    formData.append(
      "enabled_features.is_enabled_PAA",
      activityTypes.remediationQuiz
    );
    // Handle dates
    // formData.append("academic_session", academicSession);
    formData.append("session_id", API_SESSION_ID);
    if (startDate !== null && typeof startDate != "object") {
      setStartDate(Date(startDate));
    }
    formData.append(
      "session_start",
      typeof startDate == "object" ? startDate.toISOString().split("T")[0] : startDate
    );

    formData.append(
      "session_end",
      typeof endDate == "object" ? endDate.toISOString().split("T")[0] : endDate
    );

    if (uploadImage != null) {
      formData.append("school_logo", uploadImage);
    }
    // Function to send form data
    async function createSchool() {
      function logFormData(formData) {
        for (const [key, value] of formData.entries()) {
        }
      }
      logFormData(formData);
      try {
        if (schoolEditId > 0) {
          const response = await axiosInstance.patch(
            `onboarding/schools/${schoolEditId}/update`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          if (response.status == 200 || response.status == 201) {
            setschoolId(response.data);
            if (nextres == 1) {
              router.push(
                `/onboarding/createclass?schoolname=${schoolName}&schoolcode=${schoolCode}&board=${response.data.data.school_board}&boardid=${response.data.data.board_id}&schoolid=${response.data.data.public_id}`
              );
              setIsLoader(false);
            } else if (nextres == 0) {
              router.push(`/onboarding/`);
              setIsLoader(false);
            }
          }
        } else {
          setIsLoader(true);
          const response = await axiosInstance.post(
            "onboarding/schools/",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          if (response.status == 200 || response.status == 201) {
            setschoolId(response.data);
            if (nextres == 1) {
              router.push(
                `/onboarding/createclass?schoolname=${schoolName}&schoolcode=${schoolCode}&board=${response.data.data.school_board}&boardid=${response.data.data.board_id}&schoolid=${response.data.data.public_id}`
              );
              setIsLoader(false);
            } else if (nextres == 0) {
              router.push(`/onboarding/`);
              setIsLoader(false);
            }
          }
        }
      } catch (error) {
        console.error(
          "Error updating school:",
          error.response?.data || error.message
        );
        setIsLoader(false);
        toast.error(error?.response?.data?.message || "Error updating school:", {
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
    }
    createSchool();
  };
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    if (name === "topicQuest" || name === "remediationQuiz") {
      // If either Topic Quest or Remediation Quiz is clicked, sync the other
      if (checked) {
        // If the checkbox is checked, set both to true
        setActivityTypes((prevState) => ({
          ...prevState,
          topicQuest: true,
          remediationQuiz: true,
        }));
      } else {
        // If the checkbox is unchecked, set both to false
        setActivityTypes((prevState) => ({
          ...prevState,
          topicQuest: false,
          remediationQuiz: false,
        }));
      }
    } else {
      setActivityTypes((prevState) => ({
        ...prevState,
        [name]: checked,
      }));
    }
  };

  const handleDivClick = () => {
    fileInputRef.current.click(); // Trigger click event on file input
  };
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create a temporary URL to preview the image
      setSelectedImage(imageUrl);
      setUploadImage(file);
    }
  };

  const handleAcademicSessionChange = (selectedOption) => {
    setAcademicSession(selectedOption);
    const [startYear, endYear] = selectedOption.label.split("-").map(year => year.trim());
    const computedStartDate = new Date(`${startYear}-01-01`); // Assuming sessions start on June 1st
    setSessionStartDate(computedStartDate);
    const computedEndDate = new Date(`${startYear}-12-31`); // Assuming sessions start on June 1st
    setSessionEndDate(computedEndDate);
    const computedEndDate2 = new Date(`${endYear}-12-31`);
    setSessionEndDate2(computedEndDate2);
  };

  const handleClearData = () => {
    setSchoolName("");
    setSchoolCode("");
    setSchoolType("");
    setBoard("");
    setAddress("");
    setLocation("");
    setCountry("");
    setPostCode("");
    setAcademicSession(null);
    setSessionStartDate(null);
    setStartDate(null);
    setEndDate(null);
    setSelectedImage(null);
    setActivityTypes({
      readinessQuiz: true,
      topicQuest: true,
      videos: true,
      milestoneQuiz: true,
      remediationQuiz: true,
    });
  };

  return (
    <div className="right_content">
      <div className="sch-creation-container">
        <div className="left-section">
          <button className="link-button" onClick={handleGoBack}>
            {" "}
            <FaArrowLeft />
          </button>
          <span>Create School</span>
        </div>
        <div className="right-section">
          <div className="step active">
            <div className="circle">1</div>
            <span>School Creation</span>
            <div className="line"></div>
          </div>
          <div className="step">
            <div className="circle">2</div>
            <span>Class Creation</span>
            <div className="line"></div>
          </div>
          <div className="step">
            <div className="circle">3</div>
            <span>Class Grouping</span>
          </div>
        </div>
      </div>

      <div className="creation-wreaper">
        <div className="formSection">
          <div className="school_box">
            <div
              className="schoolLogo"
              onClick={handleDivClick}
              style={{ cursor: "pointer" }}
            >
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt="Uploaded School Logo"
                  className="school_logo"
                  width={100}
                  height={100}
                />
                // <img alt="Uploaded School Logo" loading="lazy" width="100" height="100" src="http://api.acadally.com/onboarding/media/school_logos/Alignment_issue_on_the_button_xjakMbs.jpg" />

              ) : (
                <>
                  <Image
                    src={SchoolLogo}
                    alt="School logo"
                    className="school_logo"
                  />
                  <Image
                    src={SchoolCam}
                    alt="School cam"
                    className="school_cam"
                  />
                </>
              )}
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }} // Hide the file input
                onChange={handleImageUpload}
                accept=".jpeg,.png,.jpg,.svg"
              />
            </div>
            <p>School Logo</p>
          </div>
          <div className="formGroup">
            <div className="formRow">
              <div className="inputGroup">
                <label>School Name</label>
                <input
                  type="text"
                  placeholder="Enter School Name"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  required
                  onBlur={(e) => validateField("schoolName", e.target.value)}
                />
                {errors.schoolName && (
                  <span className="error">{errors.schoolName}</span>
                )}
              </div>
              <div className="inputGroup">
                <label>School Code</label>
                <input
                  type="text"
                  placeholder="School Code"
                  value={schoolCode}
                  onChange={(e) => setSchoolCode(e.target.value)}
                  onBlur={(e) => validateField("schoolCode", e.target.value)}
                />
                {errors.schoolCode && (
                  <span className="error">{errors.schoolCode}</span>
                )}
              </div>

              <div className="inputGroup">
                <label>School Type</label>
                <div className="select-container">
                  <Select
                    value={
                      schoolType
                        ? schoolTypes.find((type) => type.value === schoolType)
                        : null
                    }
                    onChange={(selectedOption) =>
                      setSchoolType(selectedOption.value)
                    }
                    options={schoolTypes}
                    placeholder="Select School Type"
                    styles={customStyles}
                    components={{ DropdownIndicator }}
                    menuPosition="fixed"
                  />
                </div>
              </div>
            </div>

            <div className="formRow">
              <div className="inputGroup">
                <label>Board</label>
                <div className="select-container">
                  <Select
                    value={
                      board
                        ? boards.find(
                            (boardvalue) => boardvalue.value === board
                          )
                        : null
                    }
                    onChange={(selectedOption) =>
                      setBoard(selectedOption.value)
                    }
                    options={boards}
                    placeholder="Select Board"
                    styles={customStyles}
                    components={{ DropdownIndicator }}
                    menuPosition="fixed"
                  />
                </div>
              </div>
              <div className="inputGroup">
                <label>Address</label>
                <input
                  type="text"
                  placeholder="Enter Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="inputGroup">
                <label>Location</label>
                <input
                  type="text"
                  placeholder="Enter Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="formRow">
              <div className="inputGroup">
                <label htmlFor="country">Country</label>
                <Select
                  id="country"
                  name="country"
                  value={
                    countryOptions.find((option) => option.value === country) ||
                    null
                  }
                  onChange={(selectedOption) =>
                    setCountry(selectedOption ? selectedOption.value : "")
                  }
                  options={countryOptions}
                  placeholder="Select Country"
                  styles={customStyles}
                  components={{ DropdownIndicator }}
                  menuPosition="fixed"
                />
              </div>
              <div className="inputGroup">
                <label>Post Code</label>
                <input
                  type="text"
                  placeholder="Enter Post Code"
                  value={postCode}
                  onChange={(e) => setPostCode(e.target.value)}
                  onBlur={(e) => validateField("postCode", e.target.value)}
                  maxLength={6}
                />
                {errors.postCode && (
                  <span className="error">{errors.postCode}</span>
                )}
              </div>
              <div className="inputGroup"></div>
            </div>
          </div>
        </div>
        <h3>Academic Session</h3>
        <div className="formSection">
          <div className="formRow">
            <div className="inputGroup">
              <label>Academic Session</label>
              <div className="select-container">
                {/* <Select
                  value={
                    academicSession
                      ? academicSessions.find(
                          (session) => session.value === academicSession
                        )
                      : null
                  }
                  onChange={handleAcademicSessionChange}
                  options={academicSessions}
                  placeholder="Select Academic Session"
                  styles={customStyles}
                  components={{ DropdownIndicator }}
                  menuPosition="fixed"
                /> */}
                <Select
                value={academicSession} // Use full object
                onChange={handleAcademicSessionChange}
                options={academicSessions}
                placeholder="Select Academic Session"
                styles={customStyles}
                components={{ DropdownIndicator }}
                menuPosition="fixed"
                isDisabled={true}
              />

              </div>
            </div>
            <div className="inputGroup">
              <label>Session Start</label>
              <div className="datepicker-container">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  placeholderText="Select Session Start"
                  dateFormat="dd MMMM yyyy"
                  className="select-dropdown"
                  showYearDropdown
                  open={isStartDateOpen} // Control visibility for start date picker
                  onClickOutside={handleStartDateClickOutside}
                  onSelect={() => setIsStartDateOpen(false)}
                  onFocus={handleStartDateInputFocus}
                  minDate={sessionStartDate}
                  maxDate={sessionEndDate}
                  disabled={!sessionStartDate}
                />
                <CiCalendar
                  className="calendar-icon"
                  onClick={handleStartDateIconClick}
                />
              </div>
            </div>

            <div className="inputGroup">
              <label>Session End</label>
              <div className="datepicker-container">
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  placeholderText="Select Session End"
                  dateFormat="dd MMMM yyyy"
                  className="select-dropdown"
                  showYearDropdown
                  open={isEndDateOpen} // Control visibility for end date picker
                  onClickOutside={handleEndDateClickOutside}
                  onSelect={() => setIsEndDateOpen(false)}
                  onFocus={handleEndDateInputFocus}
                  maxDate={sessionEndDate2}
                  minDate={startDate} // Min date for end date must be after start date
                  disabled={!startDate}
                />
                <CiCalendar
                  className="calendar-icon"
                  onClick={handleEndDateIconClick}
                />
              </div>
            </div>
          </div>
        </div>
        <h3>Activity Types</h3>
        <div className="formSection">
          <div className="checkboxGroup">
            <label>
              <input
                type="checkbox"
                name="readinessQuiz"
                checked={activityTypes.readinessQuiz}
                onChange={handleCheckboxChange}
                disabled
              />{" "}
              Readiness Quiz
            </label>
            <label>
              <input
                type="checkbox"
                name="topicQuest"
                checked={activityTypes.topicQuest}
                onChange={handleCheckboxChange}
              />{" "}
              Topic Quest
            </label>
            <label>
              <input
                type="checkbox"
                name="videos"
                checked={activityTypes.videos}
                onChange={handleCheckboxChange}
              />{" "}
              Videos
            </label>
            <label>
              <input
                type="checkbox"
                name="remediationQuiz"
                checked={activityTypes.remediationQuiz}
                onChange={handleCheckboxChange}
              />{" "}
              Remediation Quiz
            </label>
            <label>
              <input
                type="checkbox"
                name="milestoneQuiz"
                checked={activityTypes.milestoneQuiz}
                onChange={handleCheckboxChange}
                disabled
              />{" "}
              Milestone Quiz
            </label>
          </div>
        </div>
        <div className="buttonGroup">
          <div className="left">
            <button className="cancelButton" onClick={handleClearData}>
              Cancel
            </button>
          </div>
          <div className="right">
            <button
              className="saveButton"
              onClick={(e) => {
                e.preventDefault(); // Prevent the default link navigation
                handleSubmit(0, schoolEditId); // Call handleSubmit with parameter 1
              }}
              disabled={isSubmitDisabledfield}
              style={{
                color: isSubmitDisabledfield ? "#FF8A00" : "#FF8A00",
                cursor: isSubmitDisabledfield ? "not-allowed" : "pointer",
                opacity: isSubmitDisabledfield ? 0.5 : 1,
                textDecoration: "underline",
              }}
            >
              Save & Exit
            </button>
            <button
              className="nextButton"
              onClick={(e) => {
                e.preventDefault(); // Prevent the default link navigation
                handleSubmit(1, schoolEditId); // Call handleSubmit with parameter 1
              }}
              disabled={isSubmitDisabledfield}
              style={{
                backgroundColor: isSubmitDisabledfield ? "#6166AE" : "#6166AE",
                color: isSubmitDisabledfield ? "white" : "white",
                cursor: isSubmitDisabledfield ? "not-allowed" : "pointer",
                opacity: isSubmitDisabledfield ? 0.5 : 1,
              }}
            >
              Next
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
