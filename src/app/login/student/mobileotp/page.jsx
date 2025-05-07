"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import "../../../../../public/style/login.css";
import sliderimage from "../../../../../public/images/student-sliderimg1.svg";
import sliderimage2 from "../../../../../public/images/student-sliderimg2.svg";
import sliderimage3 from "../../../../../public/images/student-sliderimg3.svg";
import ios from "../../../../../public/images/ios-black.svg";
import android from "../../../../../public/images/android-black.svg";
import logo from "../../../../../public/images/orange-logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";
import Loader from "../../../components/Loader";

// Import the necessary CSS files
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

// Dynamic import of jQuery
const loadJQueryAndOwlCarousel = async () => {
  const $ = (await import("jquery")).default;
  await import("owl.carousel");

  // Make sure jQuery is available globally
  if (typeof window !== "undefined") {
    window.$ = window.jQuery = $;
  }
  return $;
};

function MobileOtp() {
  const leapApiUrl = process.env.NEXT_PUBLIC_LEAP_API_URL;
  const [submit, setSubmit] = useState(false);
  const [userNumber, setUserNumber] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userAction, setUserAction] = useState("");
  const [userOtp, setUserOtp] = useState(new Array(6).fill(""));
  const [otpError, setOtpError] = useState(false);
  const [seconds, setSeconds] = useState(59);
  const [minutes, setMinutes] = useState(0);
  const [isLoader, setIsLoader] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true); // Disable resend button initially
  const [userLabel, setUserLabel] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const mobile = searchParams.get("data");
  const action = searchParams.get("action");
  const label = searchParams.get("label");

  const handleGoBack = () => {
    router.back();
  };

  useEffect(() => {
    if (mobile) {
      const isNumeric = (str) => /^\d+$/.test(str);

      if (isNumeric(mobile)) {
        setUserNumber(mobile);
      } else {
        setUserEmail(mobile);
      }
    }
  }, [mobile]);

  useEffect(() => {
    if (action) {
      setUserAction(action);
    }
    if (label) {
      setUserLabel(label);
    }
  }, [action, label]);

  useEffect(() => {
    const savedTime = localStorage.getItem("otp-timer-start");

    if (savedTime) {
      const elapsed = Math.floor((Date.now() - parseInt(savedTime)) / 1000);
      const remainingSeconds = 59 - (elapsed % 60);
      const remainingMinutes = Math.max(0, Math.floor((59 - elapsed) / 60));

      if (remainingMinutes <= 0 && remainingSeconds <= 0) {
        setMinutes(0);
        setSeconds(0);
        setResendDisabled(false);
      } else {
        setMinutes(remainingMinutes);
        setSeconds(remainingSeconds);
        setResendDisabled(true);
      }
    } else {
      localStorage.setItem("otp-timer-start", Date.now().toString());
    }

    const countdown = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds > 0) {
          return prevSeconds - 1;
        } else if (prevSeconds === 0) {
          if (minutes > 0) {
            setMinutes((prevMinutes) => prevMinutes - 1);
            return 59;
          } else {
            setResendDisabled(false);
            clearInterval(countdown);
            return 0;
          }
        }
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [seconds, minutes]);

  const handleApiCall = async () => {
    try {
      // Make your API call here
      const apiCall = async () => {
        try {
          const isNumeric = (str) => /^\d+$/.test(str);
          if (isNumeric(userNumber)) {
            const otpResponse = await axios.post(
              `${leapApiUrl}onboarding/generate-otp-for-login/`,
              {
                phone_number: userNumber,
                role: "student",
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            if (otpResponse.status === 200) {
            } else {
              console.error(
                "Failed to generate OTP:",
                otpResponse.data.message
              );
            }
          }
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setSubmit(false);
        }
      };

      apiCall();
      // Restart the timer
      localStorage.setItem("otp-timer-start", Date.now().toString());
      setMinutes(0);
      setSeconds(59);
      setResendDisabled(true);
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  const handleResendOtp = () => {
    handleApiCall();
  };

  useEffect(() => {
    const initializeCarousel = async () => {
      const $ = await loadJQueryAndOwlCarousel();

      const slider1 = $("#slide-content");
      const slider2 = $("#slide-bg");

      let slider1FirstSlideIndex;
      let prevIndex = 0;

      slider1.owlCarousel({
        loop: true,
        autoplay: true,
        dots: true,
        smartSpeed: 800,
        items: 1,
        onInitialized: function (event) {
          slider1FirstSlideIndex = event.item.index;
        },
        onTranslate: function (event) {
          sliderSync(event);
        },
      });

      function sliderSync(event) {
        const index = event.item.index;
        const loop = event.relatedTarget.options.loop;
        const slider2CloneCount = slider2.find(".owl-item.cloned").length / 2;

        if (loop) {
          if (index < slider1FirstSlideIndex) {
            slider2.trigger("prev.owl.carousel");
          } else {
            if (
              event.item.count === 2 &&
              event.item.index === 2 &&
              prevIndex === 3
            ) {
              slider2.trigger("next.owl.carousel");
            } else {
              slider2.trigger("to.owl.carousel", index - slider2CloneCount);
            }
          }
          prevIndex = event.item.index;
        } else {
          slider2.trigger("to.owl.carousel", index);
        }
      }

      slider2.owlCarousel({
        loop: true,
        nav: false,
        dots: false,
        touchDrag: false,
        mouseDrag: false,
        pullDrag: false,
        items: 1,
      });
    };

    if (typeof window !== "undefined") {
      initializeCarousel();
    }
  }, []);

  const loginhandler = (e) => {
    e.preventDefault();
    setSubmit(true);
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...userOtp];
      newOtp[index] = value;
      setUserOtp(newOtp);

      if (index < 5) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    } else if (value === "") {
      const newOtp = [...userOtp];
      newOtp[index] = "";
      setUserOtp(newOtp);
      if (index > 0) {
        document.getElementById(`otp-input-${index - 1}`).focus();
      }
    }
  };

  useEffect(() => {
    if (submit) {
      setIsLoader(true);
      let apiUrl;
      let userdata;
      if (action == "login") {
        apiUrl = `${leapApiUrl}onboarding/login/`;
        userdata = {
          phone_number: userNumber,
          otp: userOtp.join(""),
          role: "student",
        };
      } else if (action == "forgot") {
        if (userNumber !== "") {
          userdata = {
            user_id: userNumber,
            otp: userOtp.join(""),
            request_type: "username",
          };
        }
        apiUrl = `${leapApiUrl}onboarding/verify-otp/`;
      } else if (action == "forgotpassword") {
        userdata = {
          username: userEmail,
          otp: userOtp.join(""),
          request_type: "password",
        };
        apiUrl = `${leapApiUrl}onboarding/verify-otp/`;
      }
      const apiCall = async () => {
        try {
          const response = await axios.post(apiUrl, userdata, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (response.status == 200) {
            setOtpError(false);
            if (action == "forgot") {
              if (userNumber !== "") {
                router.push(
                  `/login/student/createnewusername?data=${userNumber}`
                );
              } else if (userEmail !== "") {
                router.push(
                  `/login/student/createnewusername?data=${userEmail}`
                );
              }
            } else if (action == "forgotpassword") {
              router.push(`/login/student/createnewpassword?data=${userEmail}`);
            } else if (action == "login") {
              localStorage.setItem("access_token_login", response.data.access);
              router.push(
                `/login/student/studentprofile?data=${userNumber}&action=loginuserlist`
              );
            }
          } else {
            setOtpError(true);
            setIsLoader(false);
          }
        } catch (error) {
          setOtpError(true);
          setIsLoader(false);
        } finally {
          setSubmit(false);
        }
      };
      apiCall();
    }
  }, [submit]);

  return (
    <div className="container-fluid p-0">
      <div className="wrapper  custom-height student-login">
        <div className="owl-carousel owl-theme" id="slide-bg">
          <div className="item slide" id="slide1"></div>
          <div className="item slide" id="slide2"></div>
          <div className="item slide" id="slide3"></div>
        </div>
        <div className="row">
          <div className="col-7">
            <div className="owl-carousel owl-theme" id="slide-content">
              <div className="item">
                <div className="left-side">
                  <div className="title">
                    <h1 className="green-text">Grow Smarter, Day by Day!</h1>
                    <p>
                      See your progress unfold and feel proud of each milestone.
                      Celebrate your journey to success!
                    </p>
                  </div>
                  <div className="img">
                    <Image
                      src={sliderimage}
                      alt="Teacher and students illustration"
                      className="img-slider1"
                      style={{ width: "100%", height: "auto" }}
                      priority
                    />
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="left-side">
                  <div className="title">
                    <h1 className="orange-text">
                      Find Your Academic Superpower!
                    </h1>
                    <p>
                      Uncover the best path for you and excel with personalized
                      guidance. Discover the hero within your studies!
                    </p>
                  </div>
                  <div className="img">
                    <Image
                      src={sliderimage2}
                      alt="Teacher and students illustration"
                      className="img-slider2"
                      style={{ width: "100%", height: "auto" }}
                      priority
                    />
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="left-side">
                  <div className="title">
                    <h1 className="red-text">
                      Learn with Joy, Free from Judgement!
                    </h1>
                    <p>
                      Experience a fun and supportive environment where every
                      mistake is a chance to grow and every effort is
                      appreciated.
                    </p>
                  </div>
                  <div className="img">
                    <Image
                      src={sliderimage3}
                      alt="Teacher and students illustration"
                      className="img-slider3"
                      style={{ width: "100%", height: "auto" }}
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-5">
            <div className="right-side">
              <div className="login-box mobileotp-box">
                <div className="logo">
                  <Image
                    src={logo}
                    alt=""
                    style={{ width: "100%", height: "auto" }}
                  />
                  <p>The Ultimate Learning Companion</p>
                </div>
                <form onSubmit={loginhandler}>
                  <div className="form-title">
                    <h2>Enter Verification Code</h2>
                    <p>
                      Please enter the 6-digit code sent to your registered
                      mobile number and email id
                    </p>
                  </div>
                  <div className="detail">
                    {userLabel ? (
                      <p>{userLabel}</p>
                    ) : (
                      <>
                        {userEmail && <p>{userEmail}</p>}
                        {userNumber && <p>{userNumber}</p>}
                      </>
                    )}
                  </div>

                  <div
                    className={`row gx-2 pb-2 w-75 ${
                      otpError ? "error-input" : ""
                    }`}
                  >
                    <div className={`label2 ${otpError ? "error-input" : ""}`}>
                      <label htmlFor="">Verification code</label>
                    </div>
                    {userOtp.map((digit, i) => (
                      <div
                        key={i}
                        className={`col-2 ${otpError ? "error-input" : ""}`}
                      >
                        <input
                          id={`otp-input-${i}`}
                          className={`otp-letter-input formselect ${
                            otpError ? "error-border" : ""
                          }`}
                          type="text"
                          value={digit}
                          onChange={(e) => handleChange(e, i)}
                          maxLength="1"
                          autoComplete="off"
                        />
                      </div>
                    ))}
                    {otpError && <span>Invalid OTP</span>}
                  </div>

                  <div className="row w-100 mt-xxl-5 mt-xl-4 mt-3">
                    <div className="col-sm-6">
                      <button
                        type="button"
                        className="cancel"
                        onClick={handleGoBack}
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="col-sm-6">
                      <button type="submit">Submit</button>
                    </div>
                  </div>
                  <div
                    className="otp"
                    style={{ display: action === "login" ? "block" : "none" }}
                  >
                    <p
                      onClick={() => {
                        if (!resendDisabled) {
                          handleResendOtp();
                        }
                      }}
                      style={{
                        color: resendDisabled ? "gray" : "blue",
                        cursor: resendDisabled ? "not-allowed" : "pointer",
                        pointerEvents: resendDisabled ? "none" : "auto",
                      }}
                    >
                      Resend - {minutes < 10 ? `0${minutes}` : minutes}:
                      {seconds < 10 ? `0${seconds}` : seconds}
                    </p>
                  </div>

                  <div
                    className="help"
                    style={{
                      display:
                        action == "forgot" || action == "forgotpassword"
                          ? "block"
                          : "none",
                      paddingTop:'10px'
                    }}
                  >
                    <p>Need Help Logging In? Contact  &nbsp; </p>
                    <Link href="mailto:support@acadally.com"> support@acadally.com</Link>
                  </div>

                </form>
              </div>
              <div className="download-app">
                <p>For Best Experience Download AcadAlly Student App</p>
                <Image
                  src={ios}
                  alt="QR Code"
                  style={{ width: "100%", height: "auto" }}
                />
                <Image
                  src={android}
                  alt="QR Code"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {isLoader ? <Loader /> : ""}
    </div>
  );
}

export default MobileOtp;
