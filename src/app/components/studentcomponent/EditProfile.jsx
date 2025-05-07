"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { RxCross2 } from "react-icons/rx";
import backArrowImg from "../../../../public/images/studentimg/left.svg";
import Cam from "../../../../public/images/studentimg/CamBgPro.svg";
import Lockbg from "../../../../public/images/studentimg/Lockbg.svg";
import GreenTick from "../../../../public/images/studentimg/GreenCheck.svg";
import axiosInstance from "../../auth";
import Loader from "../../components/studentcomponent/Loader";
import { toast, ToastContainer } from "react-toastify";
import defaultProfileImage from "../../../../public/images/studentimg/userprofiledefault.svg";

const EditProfile = ({ subjectData, setRecallUserApi }) => {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const[oldEmail,setOldEmail] = useState('');
  const[oldPhoneNumber,setOldPhoneNumber] = useState('');
  const [isLoader, setIsloader] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const inputRefs = useRef([]);
  const [emailVerfiy, setEmailVerfiy] = useState(true);
  const [phoneVerfiy, setPhoneVerfiy] = useState(true);
  const [profilePic, setProfilePic] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [apiType, setApiType] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // const defaultProfileImage = "/_next/static/media/userprofiledefault.81cc067a.svg";

  const handleSubmit = async (e) => {
    // toast.success("Profile updated successfully!");

    e.preventDefault();
    setIsloader(true);
    const dobEpoch = Math.floor(new Date(dob).getTime() / 1000);

    const data = {
      date_of_birth: dobEpoch,
      gender: gender,
      // first_name: firstName,
      // last_name: lastName,
    };

    try {
      const response = await axiosInstance.patch("onboarding/student/", data, {
        headers: { "Content-Type": "application/json" },
      });
      setIsloader(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update student details");
      setIsloader(false);     
      console.error(
        "Failed to update student details:",
        error.response?.data || error.message
      );
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  useEffect(() => {
    setIsloader(true);
    if (subjectData) {
       
      const firstName = subjectData?.data?.first_name || "";
      const lastName = subjectData?.data?.last_name || "";
      const username = subjectData?.data?.username || "";
      const sectionName = subjectData?.data?.section_name || "";
      const schoolName = subjectData?.data?.school_name || "";
      const gender = subjectData?.data?.gender || "";
      const dob1 = subjectData?.data?.dob || "";
      const phoneNumber = subjectData?.data?.phone_number || "";
      const email = subjectData?.data?.email || "";
      const profileValue = subjectData?.data?.profile_url || "";

      setProfilePic(profileValue ? profileValue : defaultProfileImage);
      setFirstName(firstName);
      setLastName(lastName);
      setUserName(username);
      setSectionName(sectionName);
      setSchoolName(schoolName);
      setGender(gender);
      if (dob1 == null || dob1 == '') {
        setDob(dob1);
      } else {
        const formattedDate = new Date(dob1 * 1000).toISOString().split("T")[0];
        setDob(formattedDate);
      }
      setPhoneNumber(phoneNumber);
      setOldPhoneNumber(phoneNumber)
      setOldEmail(email);
      setEmail(email);
      setIsloader(false);
    }
    
  }, [subjectData]);

  useEffect(() => {
    if (isOtpOpen) {
      inputRefs.current[0]?.focus();
    }
  }, [isOtpOpen]);

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    const enteredOtp = newOtp.join("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async () => {
    const enteredOtp = otp.join("");

    let data;
    if (apiType === "email") {
      // ✅ Fixed comparison
      data = {
        request_type: "email",
        value: email,
        otp: enteredOtp,
      };
    } else {
      data = {
        request_type: "phone_number",
        value: phoneNumber,
        otp: enteredOtp,
      };
    }

    try {
      const response = await axiosInstance.post(
        "/onboarding/verify-otp/student_details/", // Ensure `axiosInstance` has a proper base URL
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (apiType == "email") {
        toast.success("Email updated successfully!");
        setEmailVerfiy(true);
      } else {
        setPhoneVerfiy(true);
        toast.success("phone number updated successfully!");
      }

      setRecallUserApi((prev) => (prev == 0 ? 1 : 0));
      setIsOtpOpen(false);
      setOtp(Array(6).fill("")); // Reset OTP input fields
      inputRefs.current[0]?.focus(); // Move focus to first input field
    } catch (error) {
        toast.error("Invalid OTP");
      setErrorMessage("Invalid OTP");
      console.error(
        "Failed to send OTP:",
        error.response?.data || error.message
      );
    }
  };
  const [emojis, setEmojis] = useState([]);

  useEffect(() => {
    // setIsloader(true);
    const fetchProfileIcons = async () => {
      try {
        const response = await axiosInstance.get("studentapis/get_emojis");
        if (response.data.status === "Success") {
          // Function to transform icons into the required format
          const transformIcons = (icons, isLocked, startIndex) =>
            icons.map((icon, index) => ({
              name: `Emoji ${index + startIndex}`,
              src: icon,
              locked_icons: isLocked,
            }));

          // Combine both unlocked and locked icons
          const formattedIcons = [
            ...transformIcons(
              response.data.data.icon_profiles.all_icons_list,
              false,
              1
            ),
            ...transformIcons(
              response.data.data.icon_profiles.locked_icons,
              true,
              response.data.data.icon_profiles.all_icons_list.length + 1
            ),
          ];

          setEmojis(formattedIcons);
        }
        // setIsloader(false);
      } catch (error) {
        // setIsloader(false);
        console.error("Error fetching profile icons:", error);
      }
    };

    fetchProfileIcons();
  }, []);

  const handleImageUpload = (event) => {
    // const file = event.target.files[0];
    // if (file) {
    //   const imageUrl = URL.createObjectURL(file); // Create a temporary URL to preview the image
    //   setProfilePic(imageUrl);
    //   setUploadUrl(file);
    // }
    // event.target.value = "";

    const file = event.target.files[0];

  if (file) {
    const maxSize = 3 * 1024 * 1024; // 5MB in bytes

    if (file.size > maxSize) {
      // alert("File size must be 5MB or less.");
      event.target.value = ""; // Reset input field
      toast.error("File size must be 3MB or less.");
      return;
    }

    const imageUrl = URL.createObjectURL(file); // Create a temporary URL to preview the image
    setProfilePic(imageUrl);
    setUploadUrl(file);
  }

  event.target.value = ""; // Reset input field after upload

    
  };
  const handleAddEmoji = async () => {
    setIsloader(true);
    const isBlob = (url) => url.startsWith("blob:");
    if (isBlob(profilePic)) {
      const formData = new FormData();
      formData.append("upload_image", uploadUrl);
      try {
        const response = await axiosInstance.post(
          "/studentapis/upload_profile",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setRecallUserApi((prev) => (prev == 0 ? 1 : 0));
        setIsloader(false);
      } catch (error) {
        setIsloader(false);
        console.error(
          "Upload Failed:",
          error.response ? error.response.data : error.message
        );
      }
    } else {
      try {
        const response = await axiosInstance.post("/studentapis/set_emojis", {
          profile_url: profilePic,
        });
        setRecallUserApi((prev) => (prev == 0 ? 1 : 0));
        setIsloader(false);
      } catch (error) {
        setIsloader(false);
        console.error(
          "Failed to Set Emoji:",
          error.response ? error.response.data : error.message
        );
      }
    }
  };

  const handleSendOtp = async (emailValue) => {
    // Ensure apiType is correctly set
    setIsloader(true);
    setErrorMessage("");
    setOtp(Array(6).fill("")); // Reset OTP input fields
    inputRefs.current[0]?.focus(); // Move focus to first input field
    setApiType(emailValue === "email" ? "email" : "phone_number");
    

    let apiurl;
    let data;

    if (emailValue === "email") {
      apiurl = "/onboarding/request-reset-email/";
      data = { email }; // Ensuring latest email value is used
    } else {
      apiurl = "/onboarding/request-reset-phone_number/";
      data = { phone_number: phoneNumber }; // Ensuring latest phone number is used
    }

    try {
        
      const response = await axiosInstance.post(apiurl, data, {
        headers: { "Content-Type": "application/json" },
      });

      setIsloader(false);
      setIsOtpOpen(true);
    } catch (error) {
        setIsloader(false);
        setIsOtpOpen(false);
        emailValue === "email" ? toast.error('Failed to send OTP') : toast.error('Failed to send OTP');
      console.error(
        "Failed to send OTP:",
        error.response?.data || error.message
      );
    }
  };
  return (
    <div className="profile-container">
      <div className="profile-back-arrow">
        <span onClick={handleGoBack} style={{ cursor: "pointer" }}>
          <Image src={backArrowImg} alt="Back" />
        </span>
        <h4>Edit My space</h4>
      </div>

      <div className="profile-content">
        {/* Profile Card Section */}
        <div className="profile-card-container">
          <div
            className="profile-card"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div className="profile-class-edit">
              <p className="profile-class-circle">{sectionName}</p>
              <span
                onClick={() => setIsOpen(true)}
                style={{ cursor: "pointer" }}
              >
                <Image src={Cam} alt="Edit" width={35} />
              </span>
            </div>
            <Image
              src={profilePic || defaultProfileImage}
              alt="Profile Picture"
              width={175}
              height={175}
              // onError={(e) => {
              //   e.target.src = defaultProfileImage;
              // }}
            />
            <h3 className="profile-name">
              {firstName} {lastName}
            </h3>
          </div>
        </div>

        {/* Badge Cards Section */}
        <div className="profile-badge-container">
          <div className="profile-badge-card">
            <form onSubmit={handleSubmit} className="profile-badge-item">
              <div className="profileInput">
                <div className="inputGroup">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={firstName}
                    style={{
                      border: "1px solid #949494",
                      backgroundColor: "#EDEDED",
                      cursor: "no-drop",
                    }}
                    // onChange={(e) => {const input = e.target.value.replace(/[^a-zA-Z\s]/g, "");setFirstName(input);}}
                    disabled
                  />
                </div>
                <div className="inputGroup">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    style={{
                      border: "1px solid #949494",
                      backgroundColor: "#EDEDED",
                      cursor: "no-drop",
                    }}
                    value={lastName}
                    // onChange={(e) => {
                    //     const input = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // Allow only letters & spaces
                    //     setLastName(input);
                    //   }}
                      disabled
                  
                  />
                </div>
              </div>

              {/* ====================== */}

              <div className="profileInput">
                <div className="inputGroup">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={userName}
                    style={{
                      border: "1px solid #949494",
                      backgroundColor: "#EDEDED",
                      cursor: "no-drop",
                    }}
                    disabled
                  />
                </div>

                <div className="inputGroup">
                  <label htmlFor="className">Class</label>
                  <input
                    type="text"
                    id="className"
                    name="className"
                    value={sectionName}
                    style={{
                      border: "1px solid #949494",
                      backgroundColor: "#EDEDED",
                      cursor: "no-drop",
                    }}
                    disabled
                  />
                </div>
              </div>

              {/* ====================== */}

              <div className="profileInput">
                <div className="inputGroup">
                  <label htmlFor="schoolName">School Name</label>
                  <input
                    type="text"
                    id="schoolName"
                    name="schoolName"
                    value={schoolName}
                    style={{
                      border: "1px solid #949494",
                      backgroundColor: "#EDEDED",
                      cursor: "no-drop",
                    }}
                    disabled
                  />
                </div>



                <div className="inputGroup">
                  <label htmlFor="mobileNumber">Mobile Number</label>
                  <div className="edit-prof-input-wrapper">
                    <input
                      type="tel"
                      id="mobileNumber"
                      name="mobileNumber"
                      value={phoneNumber}
                      style={{
                        border: "1px solid #949494",
                        backgroundColor: "#EDEDED",
                        cursor: "no-drop",
                      }}
                      disabled
                      // onChange={(e) => { 
                      //   const input = e.target.value.replace(/[^0-9]/g, ""); 
                      //   setPhoneNumber(input);
                      //   setPhoneVerfiy(false);
                      // {oldPhoneNumber == input ? setPhoneVerfiy(true) : setPhoneVerfiy(false)}}}
                      

                      // maxLength={10}
                    />

                    {/* {phoneVerfiy == true ? (
                      <div className="verified-section">
                        <Image
                          src={GreenTick}
                          alt="Verified"
                          className="verified-icon"
                          width={15}
                          height={15}
                        />
                        <span className="verified-text">Verified</span>
                      </div>
                    ) : (
                      <div
                        className="verified-section"
                        onClick={() => {
                          handleSendOtp("phone");
                        }}
                      >
                        <span className="verified-text-Org">Verify</span>
                      </div>
                    )} */}
                  </div>
                  <span style={{ fontSize: "10px", color: "gray" }}>
                  Note: This number will also be used for WhatsApp communications.
                </span>

                </div>

                
              </div>

              {/* ====================== */}

              <div className="profileInput">
                <div className="inputGroup">
                  <label htmlFor="dateOfBirth">Date of Birth</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>

                <div className="inputGroup">
                  <label htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)} // Handle selection
                  >
                    {/* <option value="">Select Gender</option> */}
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
              </div>

              {/* ====================== */}

              <div className="profileInput">
                {/* <div className="inputGroup">
                  <label htmlFor="emailId">Email ID</label>
                  <div className="edit-prof-input-wrapper">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        {oldEmail == e.target.value ? setEmailVerfiy(true) : setEmailVerfiy(false)};
                      }}
                      placeholder="Email ID"
                    />
                    {emailVerfiy == true ? (
                      <div className="verified-section">
                        <Image
                          src={GreenTick}
                          alt="Verified"
                          className="verified-icon"
                          width={15}
                          height={15}
                        />
                        <span className="verified-text">Verified</span>
                      </div>
                    ) : (
                      <div
                        className="verified-section"
                        onClick={() => {
                          handleSendOtp("email");
                        }}
                      >
                        <span className="verified-text-Org">Verify</span>
                      </div>
                    )}
                  </div>
                </div> */}
                <div></div>
                <button
                  type="submit"
                  className="profile-update-btn"
                >
                  Update
                </button>

               
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
            </form>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="modal-overlay">
          <div className="edit-modal" style={{ maxWidth: "850px" }}>
            <div className="popup-header" style={{ gap: "20px" }}>
              <h2>Choose the MoodMoji that matches how you are feeling.</h2>
              <button
                className="close-btn"
                onClick={() => setIsOpen(false)}
                style={{ position: "relative" }}
              >
                <RxCross2 />
              </button>
            </div>

            <div className="profile-pop-content">
              <div className="selectedImage">
                <div style={{ width: "250px" }}>
                  <Image
                    src={profilePic || defaultProfileImage}
                    alt="Selected MoodMoji"
                    width={250}
                    height={250}
                    // onError={(e) => {
                    //   e.target.src = defaultProfileImage;
                    // }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "5px",
                  }}
                >
                  <label
                    htmlFor="imageUpload"
                    style={{
                      color: "#ff8A00",
                      fontWeight: "700",
                      fontSize: "16px",
                      cursor: "pointer",
                      position: "relative",
                      width: "fit-content",
                      display: "inline-block",
                    }}
                  >
                    Upload Image
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        bottom: 0,
                        width: "100%",
                        height: "2px",
                        backgroundColor: "#ff9800",
                        marginTop: "1px",
                      }}
                    ></span>
                  </label>
                  <p style={{
                    color: "#666666",
                    fontSize: "14px",
                    fontWeight: "600",
                    marginTop: "5px",
                    textAlign: "center",
                  }}>File must be less than 3 MB.</p>

                  <input
                    type="file"
                    id="imageUpload"
                    accept=".png,.jpg,.jpeg,.svg"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />
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

              <div className="emojiGrid">
                {emojis.map((emoji, index) => (
                  <div
                    key={index}
                    className="emojiItem"
                    onClick={() =>
                      !emoji.locked_icons && setProfilePic(emoji.src)
                    }
                    style={{
                      position: "relative",
                      cursor: emoji.locked_icons ? "not-allowed" : "pointer",
                    }}
                  >
                    <Image
                      src={emoji.src}
                      alt={`Emoji ${index + 1}`}
                      width={75}
                      height={75}
                      className={emoji.locked_icons ? "blurredEmoji" : ""}
                    />
                    {emoji.locked_icons && (
                      <>
                        <div className="emojiMask"></div>
                        <Image
                          src={Lockbg}
                          alt="Locked"
                          className="lockIcon"
                          width={20}
                          height={20}
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="uploadSection">
              <button
                onClick={() => {
                  handleAddEmoji();
                  setIsOpen(false);
                }}
                className="claim-btn"
                style={{ width: "200px" }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {isOtpOpen && (
        <div className="modal-overlay">
          <div className="edit-modal" style={{ width: "450px" }}>
            <div className="popup-header">
              <h2>Enter Verification Code</h2>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <p style={{ width: "90%", color: "#666666" }}>
                Please enter the 6-digit code sent to your registered {apiType == 'email'? 'email id' : 'phone number'}
              </p>
              <p className="otp-email">{apiType == 'email'? email : phoneNumber}</p>
            </div>

            <div style={{ marginBottom: "60px", marginTop: "40px" }}>
              <p className={`verifmssg ${errorMessage ? "error" : ""}`}>
                Verification Code
              </p>

              <div className="otp-input-container">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => {handleKeyDown(index, e); if (e.key === "Enter") {
                        handleOtpSubmit(); // ✅ Submit OTP when Enter is pressed
                      }}}
                    className={errorMessage ? "otp-input error" : "otp-input"}
                    ref={(el) => (inputRefs.current[index] = el)}
                  />
                ))}
              </div>
              {errorMessage && <p className="error-text">{errorMessage}</p>}
            </div>
            <div className="quiz-popup-btn">
              <button
                onClick={() => setIsOtpOpen(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button onClick={handleOtpSubmit} className="yes-btn">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {isLoader ? <Loader /> : ""}
    </div>
  );
};
export default EditProfile;
