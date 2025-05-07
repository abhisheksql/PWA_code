"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import "../../../../../public/style/login.css";
import sliderimage from "../../../../../public/images/sliderimage.svg";
import sliderimage2 from "../../../../../public/images/sliderimage2.svg";
import sliderimage3 from "../../../../../public/images/sliderimg3.svg";
import ios from "../../../../../public/images/ios.svg";
import android from "../../../../../public/images/android.svg";
import logo from "../../../../../public/images/logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Loader from "../../../components/Loader";

// Import the necessary CSS files
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

import { useRouter } from "next/navigation";

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

function EmailPass() {
  const router = useRouter();
  const leapApiUrl = process.env.NEXT_PUBLIC_LEAP_API_URL;
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [submit, setSubmit] = useState(false);
  const [error, setError] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const searchParams = useSearchParams();
  const name = searchParams.get("username");

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (name) {
      setUserName(name);
    }
  }, [name]);

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setIsDisabled(!value.trim());
    if (value) setError(false);
  };

  const loginhandler = (e) => {
    e.preventDefault();
    setSubmit(true);
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    setSubmit(true);
    setIsLoader(true);
    const apiUrl = `${leapApiUrl}onboarding/login/`;
    const userdata = { username: userName, password };

    try {
      const response = await axios.post(apiUrl, userdata, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status == 200) {
        const { access, refresh } = response.data;
        // Store tokens in localStorage (or sessionStorage if you prefer)
        localStorage.setItem("accessToken", access);
        localStorage.setItem("role", "teacher");
        localStorage.setItem("refreshToken", refresh);
        router.push("/teacher/dashboard");
      } else {
        setError(true);
        setIsLoader(false);
      }
      // setIsLoader(false);
    } catch (error) {
      setError(true);
      setIsLoader(false);
      console.error("Error:", error);
    } finally {
      setSubmit(false);
    }
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
              {[
                {
                  title: "Transform Lives, Ignite Dreams",
                  text: "Experience the profound joy and fulfillment of shaping the future, one student at a time.",
                  image: sliderimage,
                  alt: "Teacher and students illustration",
                  imgClass: "img-slider1",
                },
                {
                  title: "See Every Success",
                  text: "Take pride as you watch your students grow and achieve new milestones each day.",
                  image: sliderimage2,
                  alt: "Teacher and students illustration",
                  imgClass: "img-slider2",
                },
                {
                  title: "Embrace the Future of Teaching",
                  text: "Unlock the power of technology with AcadAlly, making your leap into the digital age inspiring and effortless.",
                  image: sliderimage3,
                  alt: "Teacher and students illustration",
                  imgClass: "img-slider3",
                },
              ].map((slide, index) => (
                <div className="item" key={index}>
                  <div className="left-side">
                    <div className="title">
                      <h1>{slide.title}</h1>
                      <p>{slide.text}</p>
                    </div>
                    <div className="img">
                      <Image
                        src={slide.image}
                        alt={slide.alt}
                        className={slide.imgClass}
                        style={{ width: "100%", height: "auto" }}
                        priority
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-5">
            <div className="right-side">
              <div className="login-box mobileotp-box">
                <div className="logo">
                  <Image
                    src={logo}
                    alt="AcadAlly Logo"
                    style={{ width: "100%", height: "auto" }}
                  />
                  <p>The Ultimate Learning Companion</p>
                </div>
                <form onSubmit={loginHandler}>
                  <div className="form-title">
                    <h2>Log in to your account</h2>
                    <p>
                      Enter your registered username or mobile number to sign
                      in.
                    </p>
                  </div>
                  <div className="label2 label-anime">
                    <input
                      type="text"
                      id="username"
                      value={userName}
                      className="formselect"
                      name="username"
                      readOnly
                      required
                    />
                    {/* <label htmlFor="username">Username</label> */}
                    <label htmlFor="username"></label>
                  </div>
                  <div
                    className={`label2 label-anime ${
                      error ? "error-input" : ""
                    }`}
                  >
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      className="formselect"
                      onChange={handlePasswordChange}
                      required
                    />
                    <label htmlFor="password">Password</label>
                    {error && (
                      <span className="error-message">Invalid Password</span>
                    )}
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

                  <div className="d-flex align-items-center justify-content-between w-100 mb-4">
                    {/* <div className="form-check">
                      <input
                        className="form-check-input teacher-check"
                        type="checkbox"
                        id="flexCheckChecked"
                      />
                      <label
                        className="form-check-label label3"
                        htmlFor="flexCheckChecked"
                      >
                        Remember Me
                      </label>
                    </div> */}
                    <div></div>
                    <Link href="/login/teacher/forgotpassword">
                      Forgot Password ?
                    </Link>
                  </div>
                  <button type="submit" disabled={isDisabled}>
                    Sign In
                  </button>
                  <div className="help" style={{paddingTop:'10px'}}>
                    <p>Need Help Logging In? Contact &nbsp; </p>
                    <Link href="mailto:support@acadally.com"> support@acadally.com</Link>
                  </div>
                </form>
              </div>
              <div className="download-app">
                <p>For Best Experience Download AcadAlly Teacher App</p>
                <Image
                  src={ios}
                  alt="iOS QR Code"
                  style={{ width: "100%", height: "auto" }}
                />
                <Image
                  src={android}
                  alt="Android QR Code"
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

export default EmailPass;
