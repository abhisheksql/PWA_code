"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import "../../../../../public/style/login.css";
import sliderimage from "../../../../../public/images/sliderimage.svg";
import sliderimage2 from "../../../../../public/images/sliderimage2.svg";
import sliderimage3 from "../../../../../public/images/sliderimg3.svg";
import ios from "../../../../../public/images/ios.svg";
import android from "../../../../../public/images/android.svg";
import logo from "../../../../../public/images/logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";
import "@fortawesome/fontawesome-free/css/all.min.css";
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

function Createnewpassword() {
  const leapApiUrl = process.env.NEXT_PUBLIC_LEAP_API_URL;
  const [username, setUserName] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [newPassword, newSetPassword] = useState("");
  const [confirmPassword, confirmSetPassword] = useState("");
  const [submit, setSubmit] = useState(false);
  const [error, setError] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userparam = searchParams.get("data");

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordVisibility1 = () => {
    setShowPassword1(!showPassword1);
  };

  useEffect(() => {
    if (userparam) {
      setUserName(userparam);
    }
  }, [userparam]);

  const newPasswordChange = (e) => {
    const value = e.target.value;
    newSetPassword(value);
    if (value) setError(false);
  };

  const confirmPasswordChange = (e) => {
    const value = e.target.value;
    confirmSetPassword(value);
    setIsDisabled(!value.trim());
    if (value) setError(false);
  };

  const loginhandler = (e) => {
    e.preventDefault();
    setSubmit(true);
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

  useEffect(() => {
    if (submit) {
      setIsLoader(true);
      if (newPassword === confirmPassword) {
        let apiUrl;
        let userdata;
        apiUrl = `${leapApiUrl}onboarding/reset-password/`;

        userdata = { new_password: confirmPassword, username: username };
        const apiCall = async () => {
          try {
            const response = await axios.post(apiUrl, userdata, {
              headers: {
                "Content-Type": "application/json",
              },
            });
            if (response.status === 200) {
              setError(false);
              router.push(`/login/teacher/createdpassword`);
            } else {
              setError(true);
              setIsLoader(false);
            }
          } catch (error) {
            setIsLoader(false);
            console.error("Error:", error);
          } finally {
            setSubmit(false);
          }
        };

        apiCall();
      } else {
        setIsLoader(false);
        setError(true);
        setSubmit(false);
      }
    }
  }, [submit]);

  return (
    <div className="container-fluid p-0">
      <div className="wrapper custom-height">
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
                    <h1>Transform Lives, Ignite Dreams</h1>
                    <p>
                      Experience the profound joy and fulfillment of shaping the
                      future, one student at a time.
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
                    <h1 className="orange-text">See Every Success</h1>
                    <p>
                      Take pride as you watch your students grow and achieve new
                      milestones each day.
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
                    <h1 className="red-text">Embrace the Future of Teaching</h1>
                    <p>
                      Unlock the power of technology with AcadAlly, making your
                      leap into the digital age inspiring and effortless.
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
                  <div className="form-title mb-2">
                    <h2>Create New Password</h2>
                    <p>
                      Password must have 8 characters and it include at least
                      one symbol and one number
                    </p>
                  </div>
                  <div className="label2 label-anime">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password1"
                      name="password"
                      className="formselect"
                      onChange={newPasswordChange}
                      required
                    />
                    <label htmlFor="password">New Password</label>
                    {/* {error && <span className="error-message">Invalid Password</span>} */}
                    <span
                      onClick={togglePasswordVisibility}
                      className="toggle-password"
                    >
                      <i
                        className={
                          showPassword ? "fa fa-eye" :"fa fa-eye-slash" 
                        }
                      ></i>
                    </span>
                  </div>
                  <div
                    className={`label2 label-anime ${
                      error ? "error-input" : ""
                    }`}
                  >
                    <input
                      type={showPassword1 ? "text" : "password"}
                      id="password2"
                      name="password"
                      className="formselect"
                      onChange={confirmPasswordChange}
                      required
                    />
                    <label htmlFor="password">Confirm New Password</label>
                    {error && (
                      <span className="error-message">Mismatch Password</span>
                    )}
                    <span
                      onClick={togglePasswordVisibility1}
                      className="toggle-password"
                    >
                      <i
                        className={
                          showPassword1 ? "fa fa-eye" : "fa fa-eye-slash"
                        }
                      ></i>
                    </span>
                  </div>
                  <div className="space-50"></div>
                  <button type="submit">Submit</button>
                </form>
              </div>
              <div className="download-app">
                <p>For Best Experience Download AcadAlly Teacher App</p>
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

export default Createnewpassword;
